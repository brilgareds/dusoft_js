
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosClientesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state) {

            var that = this;

            $rootScope.$on('gestionar_productos_clientesCompleto', function(e, parametros) {

                $scope.datos_form = {
                    lista_productos: []
                };

                $timeout(function() {
                    for (var i = 0; i < 10; i++) {
                        $scope.datos_form.lista_productos.push({codigo_producto: 'codi' + i})
                    }
                }, 3);
            });

            $rootScope.$on('cerrar_gestion_productos_clientesCompleto', function(e, parametros) {

                $scope.$$watchers = null;
            });


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