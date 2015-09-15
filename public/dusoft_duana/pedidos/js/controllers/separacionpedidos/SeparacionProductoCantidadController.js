
define(["angular", "js/controllers",'includes/slide/slideContent'], function(angular, controllers){
    
    controllers.controller('SeparacionProductoCantidadController',[
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        "pedido",
        function($scope,$rootScope,Request,
                 API,socket,AlertService,$modal,
                 localStorageService,$state, pedido){
         
            var self = this;
            console.log("pedido ", pedido);
            
            self.init = function(callback){
                $scope.rootVentanaCantidad = {};
                $scope.rootVentanaCantidad.pedido = pedido;
                
                
            };
            
            
            self.init(function(){
                
            });
            
        }
        
    ]);
});

