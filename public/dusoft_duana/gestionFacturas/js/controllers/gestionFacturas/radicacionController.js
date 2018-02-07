
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
], function(angular, controllers) {

    controllers.controller('radicacionController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa", 
        function($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa) {
            
   $scope.factura="0000";

    }]);
});

     