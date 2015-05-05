define(["angular", "js/controllers", "controllers/SetupController"], function(angular, controllers) {

    controllers.controller('ControlPanelController', ['$scope', "$state", "Request", "localStorageService", "Usuario",
        function($scope, $state, Request, localStorageService, Usuario) {
            var self = this;
            var session = localStorageService.get("session");
            
            if (session) {
                var usuario = Usuario.get(session.usuario_id);
                usuario.setToken(session.auth_token);
                Usuario.setUsuarioActual(usuario);
            } else {
                $state.go("autenticar");
                return;
            }

            $scope.onCerrarSesion = function() {
                self.cerraSesion(function(){
                    $state.go("autenticar");
                });
            };


            self.cerraSesion = function(callback) {
                $scope.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };


                Request.realizarRequest('/api/logout', "POST", {session: $scope.session, data: {}}, function(data) {
                    //console.log(data)
                    localStorage.removeItem("ls.session");
                    callback();

                });
            };

        }]);
});
