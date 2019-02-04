
define(["angular", "js/controllers"
], function (angular, controllers) {
    controllers.controller('AsignacionCuentasController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa", "serverService",
        function ($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, Empresa, serverService) {

            var that = this;
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
           $scope.root={};

            that.listarPrefijos = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Usuario.getUsuarioActual().getEmpresa()
                    }
                };
                serverService.listarPrefijos(obj, function (data) {
                    if (data.status === 200) {
                        $scope.root.listarPrefijo=data.obj.listarPrefijos;
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };


            that.init(function () {
               
            });
    }]);
});