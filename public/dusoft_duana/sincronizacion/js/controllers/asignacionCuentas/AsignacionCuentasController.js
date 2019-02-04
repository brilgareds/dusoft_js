
define(["angular", "js/controllers"
], function (angular, controllers) {
    controllers.controller('AsignacionCuentasController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket","Empresa", "ServerServiceDoc",
        function ($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, Empresa, ServerServiceDoc) {

            var that = this;
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            that.init = function(callback) {
                $scope.root = {prefijo:{}};         
                callback();
            };

            that.listarPrefijos = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Usuario.getUsuarioActual().getEmpresa().codigo
                    }
                };
//                console.log("ServerService",ServerServiceDoc);
                ServerServiceDoc.listarPrefijos(obj, function (data) {
                    if (data.status === 200) {
                        $scope.root.listarPrefijo=data.obj.listarPrefijos;
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };
            
            that.insertarTipoCuenta = function () {
                var obj = {
                    session: $scope.session,
                    cuentaId: "",
                    cuentaCategotia:"" 
                    
                };
                ServerServiceDoc.insertarTipoCuenta(obj, function (data) {
                    if (data.status === 200) {
                       console.log("data",data);
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };


            that.init(function () {
               that.listarPrefijos();
            });
    }]);
});