define(["angular", "js/controllers",'models/ClientePedido',
        'models/PedidoAuditoria', 'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido'], function(angular, controllers) {

    var fo = controllers.controller('AuditarLote', [
        '$scope', '$rootScope', 'Request', 
        '$modalInstance', 'EmpresaPedido','Cliente',
         'PedidoAuditoria', 'API',"socket", "AlertService",
         "Usuario","LoteProductoPedido","productosSeleccionados",

        function(   $scope, $rootScope, Request,
                    $modalInstance, Empresa, Cliente,
                    PedidoAuditoria, API, socket, AlertService, 
                    Usuario, LoteProductoPedido, productosSeleccionados) {
            
   

        }]);

});


