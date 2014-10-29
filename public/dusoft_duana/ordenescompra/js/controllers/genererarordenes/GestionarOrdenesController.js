
define(["angular", "js/controllers",
    "controllers/genererarordenes/GestionarProductosController"], function(angular, controllers) {

    controllers.controller('GestionarOrdenesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state) {

            var that = this;


            $scope.buscar_productos = function() {
                console.log('========buscar_productos=======');
                $scope.slideurl = "views/genererarordenes/listarproductos.html?time=" + new Date().getTime();
                
                 $scope.$emit('gestionar_productos');
            };


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});