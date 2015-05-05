define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('SetupController', ['$scope', 'Usuario', "Request", "localStorageService", "API", "AlertService", "$modal",
        function($scope, Usuario, Request, localStorageService, API, AlertService, $modal) {

            var self = this;
            $scope.root = {};
            $scope.totalModulos = 0;

            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            self.traerModulos = function(callback) {
                var obj = {
                    session: $scope.root.session,
                    data: {
                        termino: ""
                    }
                };

                Request.realizarRequest(API.MODULOS.OBTENER_CANTIDAD_MODULOS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.totalModulos = Number(data.obj.parametrizacion_modulos.total);

                        callback();

                    }

                });
            };

            $scope.onInicializarAplicacion = function() {

                var obj = {
                    session: $scope.root.session,
                    data: {
                        termino: ""
                    }
                };

                Request.realizarRequest(API.ADMIN.INICIALIZAR_APLICACION, "POST", obj, function(data) {
                    if (data.status === 200) {

                        self.traerModulos(function() {
                            AlertService.mostrarMensaje("success", "Proceso realizado correctamente!");
                        });

                    } else {
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            //  size: 'sm',
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title" style="color:red;">Error ...</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h5>Se ha generado un error en el proceso, no se han creado los modulos ni roles iniciales, favor revisar el archivo de configuración.</h5>\
                                </div>',
                            scope: $scope,
                            controller: function($scope, $modalInstance) {

                                $scope.close = function() {
                                    $modalInstance.close();
                                };

                            }
                        };
                        var modalInstance = $modal.open($scope.opts);

                    }


                });

            };

            self.traerModulos(function() {

            });

        }]);
});
