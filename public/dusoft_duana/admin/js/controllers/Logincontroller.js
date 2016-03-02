define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('Logincontroller', ['$scope', "Request", "localStorageService","$state",
        function($scope, Request, localStorageService, $state) {

            console.log("init login controller");
            $scope.usuario = "";
            $scope.clave = "";
            $scope.mostrarmensaje = false;
            $scope.ocultar_formulario = true;

            $scope.autenticar = function() {
                if ($scope.loginform.$invalid) {
                    return;
                }

                var obj = {
                    session: {
                        usuario_id: "",
                        auth_token: ""
                    },
                    data: {
                        login: {
                            usuario: $scope.usuario,
                            contrasenia: $scope.clave,
                            device:"web",
                            admin:true
                        }
                    }
                };
                Request.realizarRequest("/login", "POST", obj, function(datos) {
                    if (datos.status === 200) {
                        
                        localStorageService.add("session", JSON.stringify(datos.obj.sesion));
                        $state.go("ControlPanel");
                        //window.location = "../kardex/";
                        
                    } else {
                        $scope.mostrarmensaje = true;
                        $scope.msgerror = datos.msj || "Ha ocurrido un error...";
                    }
                });

            };
            

            $scope.recuperarContrasenia = function() {
                if ($scope.forgoutform.$invalid) {
                    return;
                }

                var obj = {
                    session: {
                        usuario_id: "",
                        auth_token: ""
                    },
                    data: {
                        login: {
                            usuario: $scope.usuario
                        }
                    }
                };

                Request.realizarRequest("/forgout", "POST", obj, function(datos) {
                    
                    if (datos.status === 200) {
                        $scope.mostrarmensaje = false;
                        $scope.ocultar_formulario = false;
                        $scope.usuario="";
                        $scope.msj = datos.msj;
                    } else {
                        $scope.mostrarmensaje = true;
                        $scope.msgerror = datos.msj || "Ha ocurrido un error...";
                    }
                });
            };
        }]);
});
