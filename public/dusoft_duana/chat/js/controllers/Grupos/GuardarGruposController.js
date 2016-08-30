define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('GuardarGruposController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal', "$timeout",
        function($scope, $rootScope, Request,
                API, socket, AlertService,
                $state, Usuario, localStorageService, $modal, $timeout) {

            var self = this;
            
            
            $scope.root = {
                grupos:[]
            };

            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            }

                        
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.root = {};
                $scope.$$watchers = null;
                
            });
            
           


        }]);
});
