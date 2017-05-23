
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
        "Usuario", "$sce","$modalInstance",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                 Sesion, $sce,$modalInstance) {

            var that = this;

                
            $scope.listaFacturasPedido = {
                data: 'facturas',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                
                    {field: 'pedido_cliente_id', displayName: 'No. Pedido', width: "30%"},
                    {field: 'factura_fiscal', displayName: 'No. Factura', width: "35%"},
                    {field: 'fecha_registro', displayName: 'F. Factura', width: "35%"}
                   
                    
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
