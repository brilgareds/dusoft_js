define(["angular", "js/controllers", 'controllers/asignacioncontroller','models/Cliente', 'models/Pedido'], function(angular, controllers) {

    var fo = controllers.controller('DetallepedidoSeparadoController', [
        '$scope', '$rootScope', 'Request', 
        '$modal', 'Empresa','Cliente',
         'Pedido', 'API',"socket", "$timeout", 
         "AlertService","Usuario", "localStorageService",

        function($scope, $rootScope, Request, $modal, Empresa, Cliente, Pedido, API, socket, $timeout, AlertService,Usuario,localStorageService) {
            
            $scope.cerrar = function(){
               $scope.$emit('cerrarslide');
            };
            
            $rootScope.$on("mostrarslide", function(e, pedido) {
                console.log("controlador de detalle recibio el pedido");
               console.log(pedido) 
                
            });
            
            


        }]);
});
