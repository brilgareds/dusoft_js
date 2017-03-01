//Controlador de la View verpedidosfarmacias.html

define(["angular", 
    "js/controllers",
    'includes/slide/slideContent',
    "models/generacionpedidos/pedidosfarmacias/FarmaciaPedido",
    "models/generacionpedidos/pedidosfarmacias/CentroUtilidadPedidoFarmacia",
    "models/generacionpedidos/pedidosfarmacias/BodegaPedidoFarmacia",
    "controllers/generacionpedidos/pedidosfarmacias/ListaPedidosController",
    "controllers/generacionpedidos/pedidosfarmacias/ListaPedidosTemporalesController",
    "services/generacionpedidos/pedidosfarmacias/PedidosFarmaciasService"], function(angular, controllers) {

    controllers.controller('PedidosFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        "PedidosFarmaciasService",
        function($scope, $rootScope, Request,
                 EmpresaPedidoFarmacia, API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal,
                 PedidosFarmaciasService) {
                     
            var self = this;
            
            $scope.root = {};
            var self = this;
            $scope.root.empresasFarmacias = Usuario.getUsuarioActual().getEmpresasFarmacias();
            $scope.root.servicio =  PedidosFarmaciasService;
            /*
             * @Author: Eduar
             * @param {object} obj
             * +Descripcion: Handler del boton crear pedido
             */
            $scope.onIrVistaGuardarPedidoTemporal = function(multiple){
                localStorageService.add("bodegaMultiple",
                        {
                            multiple: multiple
                        });
                $state.go('GuardarPedidoTemporal');
            };
            

        }]);
        
});
