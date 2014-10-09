define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('PedidosController', [
        '$scope', '$rootScope',
        
        function($scope, $rootScope) {

            $scope.selectestados = {
                placeholder:"Seleccionar Estado"
            };

            $scope.estados_pedido = [
                {estado:"", nombre:"Todos"},
                {estado:"no_asignados", nombre:"No Asignado"},
                {estado:"asignados", nombre:"Asignado"},
                {estado:"auditados", nombre:"Auditado"},
                {estado:"en_zona_despacho", nombre:"En zona de despacho"},
                {estado:"despachado", nombre:"Despachado"},
                {estado:"despachado_pendientes", nombre:"Despachado con pendientes"}
            ];

            $scope.estadoseleccionado = "";
        }]);
});