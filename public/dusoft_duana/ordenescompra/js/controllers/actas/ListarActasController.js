
define(["angular", "js/controllers",
    "includes/classes/Empresa",
], function (angular, controllers) {
    controllers.controller('ListarActasController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket",
        "Usuario",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        function ($scope, $rootScope, Request,
                $modal, API, socket,
                Usuario, Empresa, Proveedor) {

            var that = this;
            $scope.Empresa = Empresa;
            var proveedorSeleccionado;
            var ordenSeleccion;

            $scope.datos_view = {
                termino_busqueda: ""
            };

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            /*
             * Inicializacion de variables
             * @param {type} empresa
             * @param {type} callback
             * @returns {void}
             */
            that.init = function () {
                $scope.root = {};
                $scope.root.termino_busqueda_proveedores = "";
                $scope.root.Empresa = Empresa;
                $scope.root.terminoBusqueda = "";
            };

            /*
             * @Author: AMGT
             * +Descripcion: lista para escoger busqueda, por numero orden de pedido.
             */
            $scope.filtros = [
                {nombre: "Orden", selec: '0'}
            ];
            /*
             * @Author: AMGT
             * +Descripcion: metodo que selecciona el filtro
             */
            $scope.filtro = $scope.filtros[0];
            $scope.onSeleccionFiltro = function (filtro) {
                $scope.filtro = filtro;
            };

            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();

            /*
             * @Author: AMGT
             * +Descripcion: selecciona la lista de proveedores
             */
            $scope.listar_proveedores = function (termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.root.termino_busqueda_proveedores = termino_busqueda;

                that.buscar_proveedores(function (proveedores) {

                    that.render_proveedores(proveedores);
                });
            };

            /*
             * @Author: AMGT
             * +Descripcion: selecciona el buscador de proveedores
             */
            that.buscar_proveedores = function (callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: $scope.root.termino_busqueda_proveedores
                        }
                    }
                };

                Request.realizarRequest(API.PROVEEDORES.LISTAR_PROVEEDORES, "POST", obj, function (data) {

                    if (data.status === 200) {

                        if ($scope.numero_orden > 0)
                            that.render_proveedores(data.obj.proveedores);

                        //callback(true);
                        callback(data.obj.proveedores);
                    }
                });
            };

            /*
             * @Author: AMGT
             * +Descripcion: aplica el render al modelo
             */
            that.render_proveedores = function (proveedores) {

                $scope.Empresa.limpiar_proveedores();
                proveedores.forEach(function (data) {

                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);

                    $scope.Empresa.set_proveedores(proveedor);
                });
            };

            /*
             * @Author: AMGT
             * +Descripcion: busca ordenes de compras
             */
            $scope.onBuscarOrden = function (event, proveedor) {

                proveedorSeleccionado = proveedor;

                if (event.which === 13 || event.which === 1 || proveedor !== undefined) {

                    that.refrescar();

                    if (proveedor !== undefined) {
                        $scope.proveedor = proveedor;
                    }
                    if ($scope.proveedor === undefined) {
                        $scope.proveedor = {codigo_proveedor_id: ""}
                    }

                    var parametros = {
                        codigoProveedor: $scope.proveedor.codigo_proveedor_id,
                        terminoBusqueda: $scope.root.terminoBusqueda
                    };

                    that.buscarOrdenesProveedoresActas(parametros, function (data) {

                        $scope.root.ordenProveedorActa = data;
                    });

                }
            };

            /*
             * @Author: AMGT
             * +Descripcion: limpia los parametros para nuevas busquedas
             */
            that.refrescar = function () {
                $scope.root.ordenProductosActa = {};
                $scope.root.ordenProveedorActa = {};
                $scope.root.proveedor = "";
                $scope.root.numeoOrden = "";
            };


            /*
             * @Author: AMGT
             * +Descripcion: busca las actas por orden de compra y codigo proveedor
             */
            that.buscarOrdenesProveedoresActas = function (parametros, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            terminoBusqueda: parametros.terminoBusqueda,
                            codigoProveedor: parametros.codigoProveedor
                        }
                    }
                };

                Request.realizarRequest(API.ACTAS_TECNICAS.LISTAR_ORDENES_PARA_ACTAS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        callback(data.obj.listarOrdenesParaActas);
                    }
                });
            };

            /*
             * @Author: AMGT
             * +Descripcion: busca los productos de una orden
             */
            that.buscarOrdenesProductosActas = function (parametros, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        orden: {
                            ordenPedido: parametros.numero_orden
                        }
                    }
                };

                Request.realizarRequest(API.ACTAS_TECNICAS.LISTAR_PRODUCTOS_PARA_ACTAS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        callback(data.obj.listarProductosParaActas);
                    }
                });
            };


            /*
             * @Author: AMGT
             * +Descripcion: realiza la busqueda por orden 
             */
            $scope.onSeleccionarProducto = function (datos) {
                $scope.root.ordenProductosActa = {};
                $scope.root.proveedor = datos.nombre_tercero;
                $scope.root.numeoOrden = datos.numero_orden;
                ordenSeleccion = datos;
                that.buscarOrdenesProductosActas(datos, function (obj) {
                    $scope.root.ordenProductosActa = obj;

                });
            };

            /*
             * @Author: AMGT
             * +Descripcion: grilla donde se encuentran las ordenes para realizar el acta
             */
            $scope.listaOrdenesProveedoresActas = {
                data: 'root.ordenProveedorActa',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'numero_orden', displayName: '# Orden', width: "10%"},
                    {field: 'fecha_registro', displayName: 'F. Ingreso', cellFilter: "date:\'yyyy-MM-dd\'", width: "10%"},
                    {field: 'nombre_tercero', displayName: "Proveedor", width: "30%"},
                    {field: 'tercero_id', displayName: "Nit", width: "10%"},
                    {field: 'observaciones', displayName: "Observación", width: "30%"},
                    {displayName: "Detalle de la Orden", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-success btn-xs dropdown-toggle" style="width:120px" ng-click="onSeleccionarProducto(row.entity)" data-toggle="dropdown"><span class="glyphicon glyphicon-list-alt"></span></button>\
                                        </div>'
                    }
                ]
            };


            /*
             * @Author: AMGT
             * +Descripcion: grilla donde se encuentran los productos a realizar actas 
             */
            $scope.listaProductosActas = {
                data: 'root.ordenProductosActa',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripción', cellFilter: "date:\'yyyy-MM-dd\'", width: "60%"},
                    {field: 'numero_unidades', displayName: "Cantidad", width: "10%"},
                    {displayName: "Generar Acta Tecnica", cellClass: "txt-center dropdown-button",
                        cellTemplate: ' <div class="row">\
                                            <div ng-if="row.entity.estado_acta==0" >\
                                              <button class="btn btn-danger btn-xs " ng-click="onAbrirVentana(row.entity)" >\
                                                  <span class="glyphicon glyphicon-edit"> Crear Acta Tecnica</span>\
                                              </button>\
                                            </div>\
                                            <div ng-if="row.entity.estado_acta==1" >\
                                              <button class="btn btn-success btn-xs" style="width:142px" >\
                                                  <span class="glyphicon glyphicon-ok"></span>\
                                              </button>\
                                            </div>\
                                         </div>'
                    }
                ]
            };

            /*
             * @Author: AMGT
             * +Descripcion: $scope para abrir formulario de acta tecnica
             */
            $scope.onAbrirVentana = function (entity) {
                that.ventanaActaTecnica(entity);
            };

            /*
             * @Author: AMGT
             * +Descripcion: manejador de la ventana modal 
             */
            that.ventanaActaTecnica = function (entity) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    templateUrl: 'views/actas/actaTecnica.html',
                    scope: $scope,
                    controller: "ActaTecnicaController",
                    windowClass: 'app-modal-window-xlg-xlg',
                    resolve: {
                        productoItem: function () {
                            return entity;
                        },
                        ordenItem: function () {
                            return {orden: ordenSeleccion, proveedor: proveedorSeleccionado};
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function () {
                    that.buscarOrdenesProductosActas({numero_orden: $scope.root.numeoOrden}, function (obj) {
                        $scope.root.ordenProductosActa = obj;
                    });

                }, function () {});
            };


            that.init();

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                $scope.root = {};
            });

        }]);
});