//Controlador de la View verpedidosfarmacias.html

define(["angular", 
    "js/controllers",
    'includes/slide/slideContent',
    'models/generarpedidos/ClientePedido',
    'models/generarpedidos/PedidoVenta',
    "models/generacionpedidos/pedidosfarmacias/FarmaciaPedido",
    "models/generacionpedidos/pedidosfarmacias/CentroUtilidadPedidoFarmacia",
    "models/generacionpedidos/pedidosfarmacias/BodegaPedidoFarmacia",
    "controllers/generacionpedidos/pedidosfarmacias/ListaPedidosController",
    "controllers/generacionpedidos/pedidosfarmacias/ListaPedidosTemporalesController",
    "services/generacionpedidos/pedidosfarmacias/ListaPedidosFarmaciasService"], function(angular, controllers) {

    controllers.controller('PedidosFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaVenta', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request, EmpresaPedidoFarmacia, FarmaciaVenta, PedidoVenta, API, socket, AlertService, $state, Usuario, localStorageService, $modal) {
            var self = this;
            
            $scope.root = {};
            $scope.root.empresasFarmacias = Usuario.getUsuarioActual().getEmpresasFarmacias();
                        
            $scope.onIrVistaGuardarPedidoTemporal = function(){
                $state.go('GuardarPedidoTemporal');
            };

        }]);
        
});
