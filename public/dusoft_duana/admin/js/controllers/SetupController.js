define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('SetupController', ['$scope', 'Usuario', "Request", "localStorageService", "API",
        function($scope, Usuario, Request, localStorageService, API) {
            
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
                        $scope.total = Number(data.obj.parametrizacion_modulos.total);
                        
                        callback();

                    }

                });
            };
            
            $scope.onInicializarAplicacion = function(){
                
            };
            
            self.traerModulos(function(){
                
            });

        }]);
});
