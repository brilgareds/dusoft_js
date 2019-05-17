define(["angular", "js/controllers"
], function (angular, controllers) {

    controllers.controller('SincronizacionDocumentosController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "EmpresaOrdenCompra", "ServerServiceDoc", "ProveedorOrdenCompra",
        function ($scope, $rootScope, Request,
                  $filter, $state, $modal,
                  API, AlertService, localStorageService,
                  Usuario, socket, $timeout,
                  Empresa, ServerServiceDoc, Proveedor) {

            var that = this;
            $scope.servicioProveedor = false;
            $scope.servicioPrefijo = true;
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.servicio = '';
            $scope.cod_proveedor = '';
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            $scope.root = {
                prefijo: {},
                estado: true,
                listarTiposServicios: {}
            };

            that.listarPrefijos = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Usuario.getUsuarioActual().getEmpresa().codigo
                    }
                };
//                console.log("ServerService",ServerServiceDoc);
                ServerServiceDoc.listarPrefijos(obj, function (data) {
                    if (data.status === 200) {
                        console.log('Prefijos Array: ', data);
                        $scope.root.listarPrefijos = data.obj.listarPrefijos.prefijos;
                        $scope.root.listarPrefijosFiltrados = data.obj.listarPrefijos.prefijosFiltrados;
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };


            $scope.prefijo_actualizado = function (prefijo) {
                console.log('prefijo es:', prefijo);
                $scope.root.prefijo = prefijo;
            };


            $scope.sincronizar = function () {
                that.consulta(1);
            };

            $scope.buscar = function () {
                that.consulta(0);
            };

            $scope.servicio_actualizado = function (servicio) {
                if (servicio === 9) {
                    $scope.servicioProveedor = true;
                    $scope.servicioPrefijo = false;
                    $scope.root.prefijo2 = {prefijo: ''}
                } else {
                    $scope.servicioProveedor = false;
                    $scope.servicioPrefijo = true;
                }

                $scope.servicio = servicio;
            };

            that.consulta = function (sw) {
                var prefijo = $scope.root.prefijo2;
                var servicio = $scope.root.servicio;

                var numero = $scope.root.numero;
                var obj = {
                    prefijo: prefijo.prefijo,
                    facturaFiscal: numero,
                    sincronizar: sw,
                    servicio: $scope.servicio
                };
                that.sincronizacionDocumentos(obj);
            };

            that.listarTiposServicios = function () {
                var obj = {
                    session: $scope.session,
                    data: {}
                };
                ServerServiceDoc.listarTiposServicios(obj, function (data) {
                    console.log('Servicios: ', data);
                    $scope.root.listarTiposServicios = data.obj.listarTiposServicios.servicios;
                });
            };

            that.sincronizacionDocumentos = function (parametros) {
                $scope.root.estado = false;
                $scope.color_boton = "";
                $scope.iconos = "";
                $scope.encabezado = {};
                $scope.root.asientosContables = {};
                var obj = {
                    session: $scope.session,
                    data: {
                        prefijo: parametros.prefijo,
                        facturaFiscal: parametros.facturaFiscal,
                        sincronizar: parametros.sincronizar,
                        servicio: parametros.servicio,
                        codigoProveedor: $scope.cod_proveedor
                    }
                };
                console.log('Objeto antes de Ajax: ', obj);

                ServerServiceDoc.sincronizacionDocumentos(obj, function (data) {
                    if (data.status === 200) {
                        $scope.root.estado = true;
                        $scope.root.asientosContables = data.obj.asientosContables;
                        console.log('Respuesta es: ', data.obj);

                        if ($scope.root.asientosContables.estado === true) {
                            // $scope.encabezado = data.obj.parametro.encabezado;
                            $scope.color_boton = "btn-danger";
                            $scope.iconos = "glyphicon glyphicon-asterisk";
                        } else {
                            if (parametros.sincronizar === 1) {
                                $scope.root.asientosContables.descripcion = "";
                                $scope.color_boton = "btn-success";
                                $scope.iconos = "";
                            }
                        }
                        console.log("$scope.root.asientosContables:: ", $scope.root.asientosContables);
                    } else {
                        console.log(" data.mensaje", data.msj);
                        console.log(" data.mensaje", data);
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", data.msj);
                    }
                });
            };

            $scope.lista_reportesGenerados = {
                data: 'root.asientosContables.detalle',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                columnDefs: [
                    {
                        field: 'codcentrocostoasiento',
                        displayName: "C. Costos",
                        cellClass: "txt-center dropdown-button",
                        width: "5%"
                    },
                    {
                        field: 'C. Utilidad',
                        displayName: "C. Utilidad",
                        cellClass: "txt-center dropdown-button",
                        width: "6%",
                        cellTemplate: '<div class="row">\
                                           {{row.entity.codcentroutilidadasiento}} \
                                       </div>'
                    },
                    {
                        field: 'L. Costos',
                        displayName: "Linea Costos",
                        cellClass: "txt-center dropdown-button",
                        width: "7%",
                        cellTemplate: '<div class="row">\
                                               {{row.entity.codlineacostoasiento}} \
                                            </div>'
                    },
                    {
                        field: 'Cuenta', displayName: "Cuenta", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: '<div class="row">\
                                           {{row.entity.codcuentaasiento}} \
                                       </div>'
                    },
                    {
                        field: 'Identificacion',
                        displayName: "Identificacion",
                        cellClass: "txt-center dropdown-button",
                        width: "8%",
                        cellTemplate: '<div class="row">\
                                           {{row.entity.identerceroasiento}} \
                                       </div>'
                    },
                    {
                        field: 'Valor Base',
                        displayName: "Valor Base",
                        cellClass: "txt-center dropdown-button",
                        width: "10%",
                        cellTemplate: '<div class="row">\
                                           {{row.entity.valorbaseasiento}} \
                                       </div>'
                    },
                    {
                        field: 'Valor Credito',
                        displayName: "Valor Credito",
                        cellClass: "txt-center dropdown-button",
                        width: "10%",
                        cellTemplate: '<div class="row">\
                                           {{row.entity.valorcreditoasiento}} \
                                       </div>'
                    },
                    {
                        field: 'Valor Debito',
                        displayName: "Valor Debito",
                        cellClass: "txt-center dropdown-button",
                        width: "10%",
                        cellTemplate: '<div class="row">\
                                           {{row.entity.valordebitoasiento}} \
                                       </div>'
                    },
                    {
                        field: 'V. Tasa',
                        displayName: "Valor Tasa",
                        cellClass: "txt-center dropdown-button",
                        width: "6%",
                        cellTemplate: '<div class="row">\
                                           {{row.entity.valortasaasiento}} \
                                       </div>'
                    },
                    {
                        field: 'observacionasiento',
                        displayName: "Observacion",
                        cellClass: "txt-left dropdown-button",
                        width: "30%"
                    }
                ]

            };
            $scope.Empresa = Empresa;

            $scope.datos_view = {
                termino_busqueda_proveedores: '',
                lista_productos: []
            };

            $scope.listar_proveedores = function (termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datos_view.termino_busqueda_proveedores = termino_busqueda;

                that.buscar_proveedores(function (proveedores) {

                    that.render_proveedores(proveedores);
                });
            };

            that.buscar_proveedores = function (callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: $scope.datos_view.termino_busqueda_proveedores
                        }
                    }
                };

                Request.realizarRequest(API.PROVEEDORES.LISTAR_PROVEEDORES, "POST", obj, function (data) {
                    if (data.status === 200) {
                        callback(data.obj.proveedores);
                    }
                });
            };

            that.render_proveedores = function (proveedores) {
                $scope.Empresa.limpiar_proveedores();
                proveedores.forEach(function (data) {
                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);
                    $scope.Empresa.set_proveedores(proveedor);
                });
            };

            $scope.seleccionar_proveedor = function (recepcion) {
                $scope.cod_proveedor = recepcion.proveedor.codigo_proveedor_id;
            };


            that.init = function () {
                $scope.root = {};
                that.listarTiposServicios();
                that.listarPrefijos();
            };

            that.init();
        }]);
});
