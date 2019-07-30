
define(["angular", "js/controllers",
], function (angular, controllers) {

    controllers.controller('ListarProductosContratoController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "ProductoContrato",
        "Usuario",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, ProductoContrato, Sesion) {

            var that = this;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                termino_busqueda: ''
            };

            $scope.filtros = [
                {nombre: "Descripcion", id: 1},
                {nombre: "Codigo Producto", id: 2},
                {nombre: "Cliente", id: 3}

            ];
            $scope.filtro = $scope.filtros[0];

            $scope.onSeleccionFiltro = function (filtro) {

                $scope.filtro = filtro;
                $scope.datos_view.termino_busqueda = '';

            };

            // Variable para paginacion
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.pagina_actual = 1;


            $scope.buscador_productos_contrato = function (ev) {

                if (ev.which == 13) {
                    $scope.buscar_productos_contrato();
                }
            };

            $scope.buscar_productos_contrato = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        productos_contratos: {
                            termino_busqueda: $scope.datos_view.termino_busqueda,
                            filtro: $scope.filtro.id,
                            paginaActual: $scope.pagina_actual
                        }
                    }
                };

                Request.realizarRequest(API.CONTRATOS.LISTAR_PRODUCTOS_CONTRATO, "POST", obj, function (data) {

                    if (data.status === 200) {
                        $scope.cantidad_items = data.obj.productos_contratos.length;

                        if ($scope.cantidad_items === 0) {
                            AlertService.mostrarMensaje("warning", "no se encontraron registros");
                        }
                        that.renderProductosContrato(data.obj.productos_contratos);
                    }
                });
            };

            that.renderProductosContrato = function (productos) {

                $scope.datos_view.listado_productos = [];
                productos.forEach(function (data) {
                    var producto = ProductoContrato.get(data.contrato_cliente_id, data.empresa_id, data.nombre_tercero, data.codigo_producto, data.tipo_producto_id, data.descripcion,
                            parseFloat(data.precio_pactado).toFixed(2), data.nombre, data.usuario_id, parseFloat(data.costo_sin_iva).toFixed(2), parseFloat(data.deficit).toFixed(2)
                            , data.justificacion);
                            producto.set_regulado(data.sw_regulado);
                            producto.set_precio_regulado(data.precio_regulado);
                    $scope.datos_view.listado_productos.push(producto);
                });
            };

            $scope.lista_productos_contratos = {
                data: 'datos_view.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'get_nombre_tercero()', displayName: 'Cliente', width: "17%"},
                    {field: 'get_codigo()', displayName: 'Codigo Producto', width: "8%",
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.get_tipo_producto() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.get_tipo_producto() == 2">A</span>\
                                                <span class="label label-info" ng-show="row.entity.get_tipo_producto() == 3">C</span>\
                                                <span class="label label-warning" ng-show="row.entity.get_tipo_producto() == 4">I</span>\
                                                <span class="label label-default" ng-show="row.entity.get_tipo_producto() == 5">Ne</span>\
                                                <span class="label label-info" ng-show="row.entity.get_tipo_producto() == 8">Nu</span>\
                                                <span class="label label-info" ng-show="row.entity.get_tipo_producto() == 9">Ge</span>\
                                                <span ng-cell-text >{{COL_FIELD}}</span>\
                                                <span class="glyphicon glyphicon-lock pull-right text-danger" ng-show="row.entity.estado == \'0\'" ></span>\
                                            </div>'},
                    {field: 'get_descripcion()', displayName: 'Descripcion', width: "25%"},
                    {field: 'get_precio_regulado()', displayName: '$ Regulado', width: "7%", cellFilter: "currency:'$ '",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                           <span ng-if="row.entity.es_regulado()" class="label label-danger" >R</span>\
                                           <span ng-cell-text class="pull-right" >{{COL_FIELD | currency}}</span>\
                                       </div>'},
                    {field: 'get_precio_pactado()', displayName: 'Precio Pactado', width: "7%", cellFilter: "currency:'$ '",
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                           <span ng-cell-text class="pull-right" >{{COL_FIELD | currency}}</span>\
                                       </div>'},
                    {field: 'get_costo_ultima_compra()', displayName: "Costo Sin IVA", width: "8%",
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                           <span ng-cell-text class="pull-right" >{{COL_FIELD | currency}}</span>\
                                       </div>'},
                    {field: 'get_deficit()', displayName: "Deficit", width: "6%"},
                    {field: 'get_justificacion()', displayName: "Justificacion", width: "9%"},
                    {field: 'get_usuario()', displayName: "Usuario", width: "15%"}
                ]
            };

            $scope.pagina_anterior = function () {
                if ($scope.paginaactual === 1)
                    return;
                $scope.pagina_actual--;
                $scope.buscar_productos_contrato($scope.termino_busqueda, true);
            };

            $scope.pagina_siguiente = function () {
                $scope.pagina_actual++;
                $scope.buscar_productos_contrato($scope.termino_busqueda, true);
            };


            $scope.descargar_productos_contrato = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        productos_contratos: {
                            termino_busqueda: $scope.datos_view.termino_busqueda
                        }
                    }
                };

                Request.realizarRequest(API.CONTRATOS.DESCARGAR_PRODUCTOS_CONTRATO, "POST", obj, function (data) {

                    if (data.status === 200) {
                        var nombre = data.obj.excel;
                        $scope.visualizarReporte("/reports/Auditorias/" + nombre, nombre, "download");

                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };






            $scope.buscar_productos_contrato();

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});