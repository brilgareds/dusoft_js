
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosClientesController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "socket",
        "$timeout",
        "AlertService",
        "localStorageService",
        "$state",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, Sesion) {

            var that = this;

            $rootScope.$on('gestionar_productos_clientesCompleto', function(e, parametros) {

                $scope.datos_form = {
                    lista_productos: []
                };

                console.log($scope.Pedido.getCliente());
                that.buscar_productos();

                $timeout(function() {
                    for (var i = 0; i < 10; i++) {
                        $scope.datos_form.lista_productos.push({codigo_producto: 'codi' + i})
                    }
                }, 3);
            });

            $rootScope.$on('cerrar_gestion_productos_clientesCompleto', function(e, parametros) {

                $scope.$$watchers = null;
            });


            // Productos 

            that.buscar_productos = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            centro_utilidad_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            contrato_cliente_id: $scope.Pedido.getCliente().get_contrato(),
                            termino_busqueda: '',
                            pagina_actual: 1
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_PRODUCTOS_CLIENTES, "POST", obj, function(data) {

                    console.log('=========== server response =========');
                    console.log(data);

                    /*if (data.status === 200) {
                        //that.render_productos(data.obj.lista_productos);
                    }*/
                });
            };



            $scope.lista_productos = {
                data: 'datos_form.lista_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                //enableCellEditOnFocus: true,
                //enableCellEdit: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo', width: "10%", enableCellEdit: false},
                    {field: 'descripcion', displayName: 'Descripcion', enableCellEdit: false},
                    {field: 'costo_ultima_compra', displayName: 'CUM', width: "7%", cellFilter: "currency:'$ '"},
                    {field: 'costo_ultima_compra', displayName: 'Invima', width: "7%", cellFilter: "currency:'$ '"},
                    {field: 'costo_ultima_compra', displayName: 'Venc. Invima', width: "7%", cellFilter: "currency:'$ '"},
                    {field: 'costo_ultima_compra', displayName: 'IVA', width: "5%", cellFilter: "currency:'$ '"},
                    {field: 'costo_ultima_compra', displayName: '$ Regulado', width: "7%", cellFilter: "currency:'$ '"},
                    {field: 'costo_ultima_compra', displayName: '$ Venta', width: "7%", cellFilter: "currency:'$ '",
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'costo_ultima_compra', displayName: 'Existencia', width: "7%", cellFilter: "currency:'$ '"},
                    {field: 'costo_ultima_compra', displayName: 'Disponible', width: "7%", cellFilter: "currency:'$ '"},
                    {field: 'cantidad', width: "7%", displayName: "Cantidad", cellFilter: "number",
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-toolbar">\
                                            <button class="btn btn-default btn-xs" ng-click="calcular_valores_producto(row)" ><span class="glyphicon glyphicon-lock"></span></button>\
                                            <button class="btn btn-default btn-xs" ng-click="solicitar_producto(row)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});