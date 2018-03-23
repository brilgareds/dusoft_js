
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('I012GestionarClientesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', '$modalInstance', 'API', "socket", "$timeout", "$filter", "Usuario",
        "AlertService", "localStorageService", "$state", 'I012Service', "DocumentoDevolucion", "ProductoDevolucion",
        function ($scope, $rootScope, Request, $modal, $modalInstance, API, socket, $timeout, $filter, Sesion,
                AlertService, localStorageService, $state, I012Service, Documento, Producto) {

            var that = this;
            $scope.parametros = '';
            $scope.tipoProducto;
            $scope.root = {
            };

            $scope.onCerrar = function () {
                $modalInstance.close();
            };

            $scope.root.filtros = [
                {tipo: '', descripcion: "Todos"},
                {tipo: 'Nombre', descripcion: "Nombre"}
            ];

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los tipos de terceros
             * @author German Andres Galvis
             * @fecha 20/03/2018 DD/MM/YYYY
             * @returns {undefined}
             */
            that.listarTiposTerceros = function () {
                console.log("prueba 1");
                var obj = {
                    session: $scope.session,
                    data: {listar_tipo_terceros: {}}
                };

                I012Service.listarTiposTerceros(obj, function (data) {

                    if (data.status === 200) {
                        $scope.tipoTercero = I012Service.renderListarTipoTerceros(data.obj.listar_tipo_terceros);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            that.init = function (callback) {
                console.log("prueba");
                that.listarTiposTerceros();
                callback();
            }

            /*
             * Descripcion: lista todos los productos existentes
             * @author German Andres Galvis
             * @fecha  12/02/2018
             */
//            that.listarProductos = function (busqueda) {
//
//                var obj = {
//                    session: $scope.session,
//                    data: busqueda
//                };
//
//                Request.realizarRequest(API.E009.LISTAR_PRODUCTOS, "POST", obj, function (data) {
//                    if (data.status === 200) {
//                        that.renderProductos(data.obj.listarProductos);
//                    }
//                });
//            };
//
//            that.renderProductos = function (productos) {
//                $scope.datos_form.listado_productos = [];
//                productos.forEach(function (data) {
//                    var fecha = sumarDias(new Date(data.fecha_vencimiento), 1);
//                    var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.existencia).toFixed(),
//                            data.tipo_producto_id, data.subClase, data.lote, $filter('date')(fecha, "dd/MM/yyyy"));
//                    producto.setNombreTipo(data.nombreTipo);
//                    $scope.datos_form.listado_productos.push(producto);
//                });
//            };
//
//            function sumarDias(fecha, dias) {
//                fecha.setDate(fecha.getDate() + dias);
//                return fecha;
//            }
//
//            // $scope.filtroNombre = {nombre: "Seleccionar", id: -1};
//            $scope.filtroNombre = {nombre: "Descripcion", id: '0'};
//
//            $scope.onSeleccionFiltro = function (filtro) {
//                $scope.filtroNombre.nombre = filtro.nombre;
//                $scope.filtroNombre.id = filtro.id;
//            };
//
//            /*
//             *
//             */
//            $scope.buscador_productos = function (event, termino_busqueda) {
//                if (termino_busqueda !== undefined) {
//                    if (termino_busqueda.length < 3) {
//                        return;
//                    }
//                } else {
//                    termino_busqueda = '';
//                }
//                var parametros = {
//                    empresa_id: $scope.parametros[1].empresa.getEmpresa().getCodigo(),
//                    centro_utilidad: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.codigo,
//                    bodega: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.bodega.codigo,
//                    descripcion: termino_busqueda,
//                    tipoFiltro: $scope.filtroNombre.id
//                };
//                if (event.which === 13)
//                    that.listarProductos(parametros);
//            };
//
//            $scope.filtros = [
//                {nombre: "Descripcion", id: '0'},
//                {nombre: "Codigo", id: '1'},
//                {nombre: "Molecula", id: '2'}
//            ];
//
//            $scope.filtro = $scope.filtros[0];
//
//            $scope.onSeleccionFiltros = function (filtro) {
//                $scope.filtro = filtro;
//            };
//
//            $scope.guardarProducto = function (producto) {
//
//                if ($scope.tipoProducto === undefined || $scope.tipoProducto.id === "") {
//                    $scope.tipoProducto.id = producto.tipoProducto;
//                    $scope.tipoProducto.nombre = producto.nombreTipo;
//                } else if ($scope.tipoProducto.id !== producto.tipoProducto) {
//                    AlertService.mostrarMensaje("warning", "DEBE SELECCIONAR PRODUCTOS DEL TIPO " + " " + $scope.tipoProducto.nombre.toUpperCase());
//                    return;
//                }
//
//                if ($scope.doc_tmp_id === '00000') {
//                    AlertService.mostrarMensaje("warning", "Debe crear primero el temporal");
//                    return;
//                }
//
//
//                var parametro = {
//                    empresaId: $scope.parametros[1].empresa.getEmpresa().getCodigo(),
//                    centroUtilidad: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.codigo,
//                    bodega: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.bodega.codigo,
//                    codigoProducto: producto.codigo_producto,
//                    cantidad: producto.cantidad,
//                    lote: producto.lote,
//                    fechaVencimiento: producto.fecha_vencimiento,
//                    docTmpId: $scope.doc_tmp_id
//                };
//                that.insertarProductos(parametro);
//            };
//
//            that.insertarProductos = function (parametro) {
//
//                var obj = {
//                    session: $scope.session,
//                    data: parametro
//                };
//
//                Request.realizarRequest(API.E009.CREAR_ITEM, "POST", obj, function (data) {
//                    if (data.status === 200) {
//                        AlertService.mostrarMensaje("warning", data.msj);
//                    } else {
//                        AlertService.mostrarMensaje("warning", data.msj);
//                    }
//                });
//            };
//
//            $scope.habilitarCheck = function (producto) {
//                var disabled = false;
//
//                if (producto.cantidad === undefined || producto.cantidad === "" || parseInt(producto.cantidad) <= 0) {
//                    disabled = true;
//                }
//                if (parseInt(producto.cantidad) > parseInt(producto.existencia)) {
//                    AlertService.mostrarMensaje("warning", "la cantidad ingresada no puede superar las existencias");
//                    disabled = true;
//                }
//
//                return disabled;
//            };

            $scope.lista_clientes = {
                data: 'datos_form.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'ID', displayName: 'Identificación', width: "25%", enableCellEdit: false},
                    {field: 'NOMBRE', displayName: 'Nombre', width: "65%", enableCellEdit: false},
                    {width: "10%", displayName: "Opción", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="guardarProducto(row.entity)" ng-disabled="habilitarCheck(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

        }]);
});