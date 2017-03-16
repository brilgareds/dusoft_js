define(["angular", 
    "js/controllers",
    'includes/slide/slideContent',
    "controllers/GestionTerceros/Terceros/ListaTercerosController",
    "controllers/GestionTerceros/Proveedores/ListaProveedoresController",
    "controllers/GestionTerceros/Clientes/ListaClientesController",
    "controllers/GestionTerceros/Terceros/GuardarTerceroController",
    "services/GestionTerceros/GestionTercerosService"], function(angular, controllers) {

    controllers.controller('TercerosController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal) {
                     
            var self = this;
            
            $scope.root = {};
            var self = this;

            

        }]);
        
});
