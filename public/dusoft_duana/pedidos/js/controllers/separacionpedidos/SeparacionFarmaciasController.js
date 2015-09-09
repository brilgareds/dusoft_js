//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers", 
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionFarmaciasController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", 
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal) {
             
             
             var self = this;
             
             self.init = function(callback){
                $scope.rootSeparacionFarmacias = {}; 
                callback();
             };
             
             
             self.traerPedidosTemporales = function(){
                console.log("traer pedidos temporales SeparacionFarmaciasController");
             }; 
             
             self.traerPedidosAsignados = function(){
                 console.log("traer pedidos asignados SeparacionFarmaciasController");
             };
             
             /*
             * @Author: Eduar
             * +Descripcion: Funcion utilizada para destruir las referencias del controlador ejemplo la variable rootSeparacionFarmacias
             */
             $scope.$on('$destroy', function iVeBeenDismissed() {
                 console.log("goodbye SeparacionFarmaciasController");
                 $scope.rootSeparacionFarmacias = null;
             });
             
             self.init(function(){
                if($scope.root.esTemporal){
                    self.traerPedidosTemporales();
                } else {
                    self.traerPedidosAsignados();
                }
             });
                 


        }]);
});
