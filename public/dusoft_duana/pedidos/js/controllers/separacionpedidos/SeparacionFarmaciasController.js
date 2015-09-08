//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers", 
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionFarmaciasController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", 
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal) {
             
             
             
             console.log("hi SeparacionFarmaciasController");
             $scope.$on('$destroy', function iVeBeenDismissed() {
                 console.log("goodbye SeparacionFarmaciasController");
             });

        }]);
});
