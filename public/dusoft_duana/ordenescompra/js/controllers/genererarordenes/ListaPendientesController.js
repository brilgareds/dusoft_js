
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ListaPendientesController', [
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
        "Usuario", "$sce","$modalInstance","productos",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                 Sesion, $sce,$modalInstance, productos) {

            var that = this;
                        
            $scope.root = {
                productos : productos
            };
                
            $scope.listaProductosPendiente = {
                data: 'root.productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                
                    {field: 'getCodigoProducto()', displayName: 'Codigo Producto', width:"15%"},
                    {field: 'getDescripcion()', displayName: 'Descripcion', width: "55%"},
                    {field: 'get_cantidad_seleccionada()', displayName: 'Cnt.', width:"10%"},
                    {field: 'getCantidadPendiente()', displayName: 'Pendiente', width:"10%"},
                    {field: 'get_cantidad_recibida()', displayName: 'Rec.', width:"10%"}
                   
                    
                ]
            };

            $scope.cerrarVentanaFactura = function(){

                $modalInstance.close();
            };
                
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                //$scope.datos_form = null;
            });
        }]);
});
