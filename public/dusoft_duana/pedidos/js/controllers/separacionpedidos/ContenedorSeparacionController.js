//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers", 
    'includes/slide/slideContent', 'controllers/separacionpedidos/SeparacionFarmaciasController',
    'controllers/separacionpedidos/SeparacionClientesController'], function(angular, controllers) {

    var fo = controllers.controller('ContenedorSeparacionController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", 
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal) {
             
             
             
             $scope.root = {};
             var self = this;
             
             $scope.root.vistas = [
                 {path:"separacionclientes.html", nombre:"Asignacion Clientes"},
                 {path:"separacionfarmacias.html", nombre:"Asignacion Farmacias"},
                 {path:"separacionclientes.html", nombre:"Temporales Clientes"},
                 {path:"separacionfarmacias.html", nombre:"Temporales Farmacias"}
             ];
             
             
             
             self.modificarVista = function(vista){
                $scope.root.vista = "views/separacionpedidos/"+vista+"?time=" + new Date().getTime();
                
                console.log("vista ", $scope.root.vista);
             };
             
             self.modificarVista($scope.root.vistas[1].path);
             
             $scope.onCambiarVista = function(vista){
                self.modificarVista(vista); 
             };

        }]);
});
