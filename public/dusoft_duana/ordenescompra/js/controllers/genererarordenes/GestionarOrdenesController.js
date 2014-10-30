
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "controllers/genererarordenes/GestionarProductosController",
    "controllers/genererarordenes/CalcularValoresProductoController"
], function(angular, controllers) {

    controllers.controller('GestionarOrdenesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state) {

            var that = this;


            $scope.buscar_productos = function() {
                console.log('========buscar_productos=======');
                $scope.slideurl = "views/genererarordenes/gestionarproductos.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_productos');
            };

            $scope.cerrar = function() {
                console.log('===== Cerrar =====');
                $scope.$emit('cerrar_gestion_productos', {animado: true});
            };

            $scope.Productos = [];

            for (var i = 0; i <= 1000; i++) {
                $scope.Productos.push({codido_producto: i, descripcion_producto: 'descripcion_producto ' + i, direccion: i, telefono: i, fecha_registro: i});
            }

//            $scope.getTotal = function(col) {
//                $scope.total = 0;
//                angular.forEach($scope.lista_productos, function(row) {
//                    return getSumCol(row.codido_producto);
//                });
//                return $scope.total;
//            };
//            function getSumCol(score) {
//                $scope.total += score;
//            }



            $scope.lista_productos = {
                data: 'Productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                showFooter: true,
                //footerTemplate: '<div style="width: 200px; display: inline-block;">{{getTotal(0)}}</div><div style="width: 200px; display: inline-block;">{{total2}}</div><div style="width: 200px; display: inline-block;">{{total3}}</div>',
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


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});