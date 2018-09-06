
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
], function(angular, controllers) {

    controllers.controller('MovilController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa", 
        function($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa) {

            $scope.descarga= function(){
                 $scope.visualizarReporte("/reports/apk/" + "DusoftBodegas.apk", "DusoftBodegas.apk", "_blank");
            };

        }]);
});