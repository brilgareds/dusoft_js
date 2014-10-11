define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('eventBridgeController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', '$stateParams',

        function($scope, $rootScope, Request, API, socket, AlertService, $state, $stateParams) {
            
            //$rootScope.$emit("enviaEventoBridge", $scope.pedido.numero_pedido, "CreaPedidoFarmaciaController");
            
            $rootScope.$on('enviaEventoBridge', function(event, data, receiveViewName) {
                    
                    console.log("eventBridgeView data: ",data);
                    
                    /* Código de Prueba */
                    $rootScope.$emit("recibeEventoBridge", data);
                    $state.go(receiveViewName);
                    
                    //$scope.pedido.numero_pedido = data.numero_pedido;

                });
            
        }
    ]);
});