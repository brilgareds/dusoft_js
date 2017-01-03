
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

                
            console.log("numeroPedidoTipo ",pedido);
            $scope.facturas = pedido;
            $scope.listaFacturasPedido = {
                data: 'facturas',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'Pedido', width: "30%", displayName: 'Pedido', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.pedido_cliente_id}}</p></div>'},
                    {field: 'Factura', width: "35%", displayName: 'Factura', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.factura_fiscal}}</p></div>'},
                    {field: 'Fecha', width: "35%", displayName: 'Fecha', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.fecha_registro}}</p></div>'},
                    
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
