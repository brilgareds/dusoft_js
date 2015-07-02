
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state) {

            var that = this;
            

            $rootScope.$on('gestionar_productosCompleto', function(e, parametros) {

                console.log('=============== Iniciando Slider =============');
                
            });

            $rootScope.$on('cerrar_gestion_productosCompleto', function(e, parametros) {
                
                $scope.$$watchers = null;
            });

            $scope.lista_productos_orden_compra = {
                data: 'Empresa.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                //enableCellEditOnFocus: true,
                enableCellEdit: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "20%", enableCellEdit: false},
                    {field: 'descripcion', displayName: 'Descripcion', enableCellEdit: false},
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "15%", cellFilter: "currency:'$ '", enableCellEdit: true,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span class="label label-primary" ng-show="row.entity.regulado == 1" >Reg</span>\
                                            <span class="label label-danger" ng-show="row.entity.tiene_valor_pactado == 0">S.C</span>\
                                            <span class="label label-success" ng-show="row.entity.tiene_valor_pactado == 1">C.C</span>\
                                            <span ng-cell-text class="pull-right" >{{COL_FIELD | currency:"$ "}}</span>\
                                        </div>'},
                    {field: 'cantidad', width: "7%", displayName: "Cantidad", enableCellEdit: true, cellFilter: "number"},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center", enableCellEdit: false,
                        cellTemplate: '<div class="btn-toolbar">\
                                            <button class="btn btn-default btn-xs" ng-click="calcular_valores_producto(row)" ><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                            <button class="btn btn-default btn-xs" ng-click="solicitar_producto(row)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});