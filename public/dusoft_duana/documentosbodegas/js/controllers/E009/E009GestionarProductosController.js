
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('E009GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout", "$filter", "Usuario",
        "AlertService", "localStorageService", "$state", "DocumentoDevolucion", "ProductoDevolucion",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, $filter, Sesion,
                AlertService, localStorageService, $state, Documento, Producto) {

            var that = this;
            $scope.parametros = '';
            //$scope.parametros = empresa;
            //$scope.tipoProducto = tipoProducto;
            $scope.tipoProducto;
            $rootScope.$on('gestionar_productosCompleto', function (e, parametros) {

                $scope.datos_form = {
                    listado_productos: [],
                    titulo: 'Buscar Productos'
                };


                $scope.parametros = parametros;
                //$scope.tipoProducto = $scope.parametros[1].tipoProducto;
                $scope.tipoProducto = parametros[1].tipoProducto;

                $timeout(function () {
                    $scope.buscador_productos(true, '');
                }, 3);
            });


            /*
             * Descripcion: lista todos los productos existentes
             * @author German Andres Galvis
             * @fecha  12/02/2018
             */
            that.listarProductos = function (busqueda) {

                var obj = {
                    session: $scope.session,
                    data: busqueda
                };

                Request.realizarRequest(API.E009.LISTAR_PRODUCTOS, "POST", obj, function (data) {
                    if (data.status === 200) {
                        that.renderProductos(data.obj.listarProductos);
                    }
                });
            };

            that.renderProductos = function (productos) {
                $scope.datos_form.listado_productos = [];
                productos.forEach(function (data) {
                    var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.existencia).toFixed(),
                            data.tipo_producto_id, data.subClase, data.lote, $filter('date')(data.fecha_vencimiento, "dd/MM/yyyy"));
                            producto.setNombreTipo(data.nombreTipo);
                    $scope.datos_form.listado_productos.push(producto);
                });
            };

            $scope.filtroNombre = {nombre: "Seleccionar", id: -1};

            $scope.onSeleccionFiltro = function (filtro) {
                $scope.filtroNombre.nombre = filtro.nombre;
                $scope.filtroNombre.id = filtro.id;
            };

            /*
             *
             */
            $scope.buscador_productos = function (event, termino_busqueda) {
                console.log("busca tipo",$scope.tipoProducto);
                if (termino_busqueda !== undefined) {
                    if (termino_busqueda.length < 3) {
                        return;
                    }
                } else {
                    termino_busqueda = '';
                }
                var parametros = {
                    empresa_id: $scope.parametros[1].empresa.getEmpresa().getCodigo(),
                    centro_utilidad: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.codigo,
                    bodega: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.bodega.codigo,
                    /*empresa_id: $scope.parametros.getEmpresa().getCodigo(),
                     centro_utilidad: $scope.parametros.getEmpresa().centroUtilidad.codigo,
                     bodega: $scope.parametros.getEmpresa().centroUtilidad.bodega.codigo,*/
                    descripcion: termino_busqueda,
                    tipoFiltro: $scope.filtroNombre.id
                };
                if (event.which === 13)
                    that.listarProductos(parametros);
            };

            $scope.filtros = [
                {nombre: "Descripcion", id: '0'},
                {nombre: "Codigo", id: '1'},
                {nombre: "Molecula", id: '2'}
//                {nombre: "Unidad venta", id: true},
            ];

            $scope.filtro = $scope.filtros[0];

            $scope.onSeleccionFiltros = function (filtro) {
                $scope.filtro = filtro;
            };

            $scope.guardarProducto = function (producto) {

                if ($scope.tipoProducto === undefined || $scope.tipoProducto.id === "") {
                    $scope.tipoProducto.id = producto.tipoProducto;
                    $scope.tipoProducto.nombre = producto.nombreTipo;
                } else if ($scope.tipoProducto.id !== producto.tipoProducto) {
                    AlertService.mostrarMensaje("warning", "DEBE SELECCIONAR PRODUCTOS DEL TIPO " + " " + $scope.tipoProducto.nombre.toUpperCase());
                    return;
                }

                var fecha_actual = new Date();
                fecha_actual = $filter('date')(new Date(fecha_actual), "dd/MM/yyyy");

                var fecha_vencimiento = $filter('date')(new Date(producto.fecha_vencimiento), "dd/MM/yyyy");
                var diferencia = $scope.restaFechas(fecha_actual, fecha_vencimiento);
                if (diferencia >= 0 && diferencia <= 45) {
                    AlertService.mostrarMensaje("warning", "Producto proximo a vencer");
                    return;
                }

                if ($scope.doc_tmp_id === '00000') {
                    AlertService.mostrarMensaje("warning", "Debe crear primero el temporal");
                    return;
                }


                var parametro = {
                    empresaId: $scope.parametros[1].empresa.getEmpresa().getCodigo(),
                    centroUtilidad: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.codigo,
                    bodega: $scope.parametros[1].empresa.getEmpresa().centroUtilidad.bodega.codigo,
                    codigoProducto: producto.codigo_producto,
                    cantidad: producto.cantidad,
                    lote: producto.lote,
                    fechaVencimiento: producto.fecha_vencimiento,
                    docTmpId: $scope.doc_tmp_id
                };
                that.insertarProductos(parametro);
            };

            that.insertarProductos = function (parametro) {

                var obj = {
                    session: $scope.session,
                    data: parametro
                };

                Request.realizarRequest(API.E009.CREAR_ITEM, "POST", obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            $scope.habilitarCheck = function (producto) {
                var disabled = false;

                if (producto.cantidad === undefined || producto.cantidad === "" || parseInt(producto.cantidad) <= 0) {
                    disabled = true;
                }
                if (parseInt(producto.cantidad) > parseInt(producto.existencia)) {
                    AlertService.mostrarMensaje("warning", "la cantidad ingresada no puede superar las existencias");
                    disabled = true;
                }

                return disabled;
            };

            $scope.lista_productos_E009 = {
                data: 'datos_form.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo ', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 6">NeA</span>\
                                                <span ng-cell-text >{{COL_FIELD}} </span>\
                                                <span class="glyphicon glyphicon-lock text-danger" ng-show="row.entity.estado == \'0\'" ></span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripcion', width: "35%", enableCellEdit: false},
                    {field: 'subClase', displayName: 'Molecula', width: "15%", enableCellEdit: false},
                    {field: 'existencia', displayName: 'Existencias', width: "10%", enableCellEdit: false},
                    {field: 'getCantidad() | number : "0" ', displayName: 'Cantidad', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "7%", enableCellEdit: false},
                    {width: "6%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="guardarProducto(row.entity)" ng-disabled="habilitarCheck(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            /*$scope.onCerrar = function () {
             $modalInstance.close($scope.tipoProducto);
             };*/


            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {//ng-disabled="habilitar_ingreso_producto(row.entity)"
                $scope.$$watchers = null;
            });
        }]);
});