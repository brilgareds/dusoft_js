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
            var self = this;
            $scope.root.empresasFarmacias = Usuario.getUsuarioActual().getEmpresasFarmacias();
            
            /*
             * @Author: Eduar
             * @param {object} obj
             * +Descripcion: Handler del boton crear pedido
             */
            $scope.onIrVistaGuardarPedidoTemporal = function(){
                $state.go('GuardarPedidoTemporal');
            };
            
            self.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
            
            //permisos kardex
            $scope.root.opcionesModulo = {
                btnCrearPedido: {
                    'click': self.opciones.sw_crear_pedido
                },
                btnVerPedido: {
                    'click': self.opciones.sw_consultar_pedido 
                },
                btnModificarPedido: {
                    'click': self.opciones.sw_consultar_pedido  && self.opciones.sw_modificar_pedido
                }        
            };

        }]);
        
});
