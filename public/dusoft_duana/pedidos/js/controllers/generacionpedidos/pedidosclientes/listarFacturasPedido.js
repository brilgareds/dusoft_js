
define(["angular", "js/controllers",
    "models/generacionpedidos/pedidosclientes/Laboratorio",
    "models/generacionpedidos/pedidosclientes/Molecula"
], function(angular, controllers) {

    controllers.controller('listarFacturasPedido', [
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
        "Laboratorio",
        "ProductoPedidoCliente",
        "Usuario", "Molecula", "$sce","pedido","$modalInstance",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Laboratorio, Producto, Sesion, Molecula, $sce, pedido,$modalInstance) {

            var that = this;

                
            $scope.facturas = pedido;
            $scope.listaFacturasPedido = {
                data: 'facturas',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                
                    {field: 'pedido_cliente_id', displayName: 'No. Pedido', width: "20%"},
                    {field: 'factura_fiscal', displayName: 'No. Factura', width: "25%"},
                    {field: 'fecha_registro', displayName: 'F. Factura', width: "30%"},
                    {field: 'valor_total', displayName: 'V. Total', width: "25%", cellFilter: 'currency : "$"'}
                   
                    
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
