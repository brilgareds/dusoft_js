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
                     
            $rootScope.$emit("onDeshabilitarBtnChat");
            
        }]);
});
