define(["angular", 
    "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('ListaClientesController', [
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
