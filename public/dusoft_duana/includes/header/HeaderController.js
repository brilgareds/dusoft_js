define(["angular", "js/controllers"], function(angular, controllers) {
    controllers.controller('HeaderController', ['$scope', '$rootScope', "$state", "Request", "Usuario",
        function($scope, $rootScope, $state, Request, Usuario) {

            $scope.cerraSesion = function($event) {
                $event.preventDefault();

                $scope.session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };

                Request.realizarRequest('/api/logout', "POST", {session: $scope.session, data: {}}, function(data) {
                    //console.log(data)
                    $rootScope.$emit("cerrarSesion");
                });

            };

        }]);
});