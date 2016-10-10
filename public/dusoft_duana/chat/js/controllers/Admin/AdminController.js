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
            
            localStorageService.set("chat", {estado:'1'});
            
            $scope.$on('$destroy', function() {
                localStorageService.set("chat", {estado:'0'});
            });
            
        }]);
});
