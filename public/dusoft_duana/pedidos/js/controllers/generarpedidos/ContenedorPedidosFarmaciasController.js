//Controlador de la View verpedidosfarmacias.html

define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('ContenedorPedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario",
        function($scope, $rootScope, Request, API, socket, AlertService, $state, Usuario) {

            console.log(">>>> Usuario",Usuario.getUsuarioActual());

            var that = this;


            $scope.root = {};
            
            $scope.root.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
            //$scope.root.opciones.sw_ver_listado_temporales = true;
            
            console.log(">>>> Opciones Contenedor: ",$scope.root.opciones);
            
            $scope.root.opcionesModulo = {
                btnCrearPedido: {
                    'click': $scope.root.opciones.sw_crear_pedido
                }
            };


        }]);
});
