define(["angular", "js/controllers"], function(angular, controllers) {
    controllers.controller('HeaderController', ['$scope', '$rootScope', "$state", "Request",
        function($scope, $rootScope, $state, Request) {

            $scope.cerraSesion = function($event) {
                $event.preventDefault();

                Request.realizarRequest('/api/logout', "POST", {session: $scope.session, data: {}}, function(data) {

                    $rootScope.$emit("cerrarSesion");
                });

            };

        }]);
});