//Controlador de la View verpedidosfarmacias.html

define(["angular", 
    "js/controllers",
    'includes/slide/slideContent',
    'models/generarpedidos/ClientePedido',
    'models/generarpedidos/PedidoVenta',
    "controllers/generacionpedidos/pedidosfarmacias/ListaPedidosController",
    "controllers/generacionpedidos/pedidosfarmacias/ListaPedidosTemporalesController"], function(angular, controllers) {

    controllers.controller('PedidosFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaVenta', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request, EmpresaPedido, FarmaciaVenta, PedidoVenta, API, socket, AlertService, $state, Usuario, localStorageService, $modal) {
            var self = this;
            
            $scope.root = {};
            $scope.root.empresasFarmacias = Usuario.getUsuarioActual().getEmpresasFarmacias();
                        


        }]);
        
});
