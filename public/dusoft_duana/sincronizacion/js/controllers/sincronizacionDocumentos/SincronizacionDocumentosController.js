
define(["angular", "js/controllers"
], function(angular, controllers) {

    controllers.controller('SincronizacionDocumentosController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa", 
        function($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,
                Empresa) {

            var that = this;
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };  
            that.init = function(callback) {
                $scope.root = {};         
                callback();
            };                       

            that.init(function() {
                
            });        

    }]);
});