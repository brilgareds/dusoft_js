
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state) {

            var that = this;



            $scope.Productos = [];

            for (var i = 0; i <= 1000; i++) {
                $scope.Productos.push({codido_producto: i, descripcion_producto: 'descripcion_producto ' + i, direccion: i, telefono: i, fecha_registro: i});
            }

            $scope.lista_productos = {
                data: 'Productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                columnDefs: [
                    {field: 'codido_producto', displayName: 'Codigo Producto', width: "20%"},
                    {field: 'descripcion_producto', displayName: 'Descripcion'},
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "15%"},
                    {field: 'cantidad', width: "7%", displayName: "Cantidad", enableCellEdit: true},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="calcular_valores_producto()" ><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                        </div>'}
                ]
            };


            $scope.calcular_valores_producto = function() {

                console.log('==== calcular_valores_producto ====');
                
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/genererarordenes/calcularvaloresproducto.html',
                    controller: "CalcularValoresProductoController"                    
                };

                var modalInstance = $modal.open($scope.opts);

            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});