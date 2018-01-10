define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('PedidosController', [
        '$scope', '$rootScope','Usuario',
        
        function($scope, $rootScope, Usuario) {

            $scope.estados_pedido = [
                {estado:"", nombre:"Todos"},
                {estado:"no_asignados", nombre:"No Asignado"},
                {estado:"asignados", nombre:"Asignado"},
                {estado:"separacion_finalizada", nombre:"Separacion Finalizada"},
                {estado:"en_auditoria", nombre:"En Auditoría"},
                {estado:"auditados", nombre:"Auditado"},
                {estado:"auditados_pdtes", nombre:"Auditado con pendientes"},
                {estado:"en_zona_despacho", nombre:"En zona de despacho"},
                {estado:"en_zona_despacho_pdtes", nombre:"En zona de despacho con pendientes"},
                {estado:"despachado", nombre:"Despachado"},
                {estado:"despachado_pendientes", nombre:"Despachado con pendientes"}
            ];

            $scope.estadoseleccionado ;
            
            
            var opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
            
            //permisos asignacion de pedidos
            $scope.opcionesModulo = {
                btnAsignarPedidosClientes: {
                    'click': opciones.sw_asignar_pedidos_clientes
                },
                btnAsignarPedidosFarmacias: {
                    'click': opciones.sw_asignar_pedidos_farmacias
                },
                btnCambiarEstadoPedidos:{
                    'click': opciones.sw_cambiar_estado_pedidos
                }
            };
            
            
        }]);
});