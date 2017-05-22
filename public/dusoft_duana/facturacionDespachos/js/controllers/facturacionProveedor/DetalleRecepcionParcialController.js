define(["angular", "js/controllers",
    'includes/slide/slideContent',
    "includes/classes/Empresa",
 ], function(angular, controllers) {
    
        controllers.controller('DetalleRecepcionParcialController', [
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
                    var filtroPedido = localStorageService.get("verificacionDetalle");
                    console.log(">>>>>>>>>>>>>>>",filtroPedido);
               }]);
});