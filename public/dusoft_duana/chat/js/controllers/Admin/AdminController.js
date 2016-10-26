//Controlador de la View creapedidosfarmacias.html

define(["angular", "js/controllers", "controllers/Grupos/ListaGruposController"], function(angular, controllers) {

    controllers.controller('AdminController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal',
        "$timeout",
        function($scope, $rootScope, Request, 
                 API, socket, AlertService,
                 $state, Usuario, localStorageService, $modal,
                 $timeout) {
                     
            var self = this;
            $rootScope.$emit("onDeshabilitarBtnChat");
            var moduloChat =  Usuario.getUsuarioActual().objetoModulos["ChatDusoft"];
            
            $scope.root = {
                opciones:(moduloChat)? moduloChat.opciones : {}
            };
                                    
            localStorageService.set("chat", {estado:'1'});
            
            $scope.$on('$destroy', function() {
                localStorageService.set("chat", {estado:'0'});
            });
            
        }]);
});
