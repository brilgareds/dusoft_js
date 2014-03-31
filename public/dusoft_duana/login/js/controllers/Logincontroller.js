define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('Logincontroller', ['$scope', 'User', "Request", "localStorageService",
        function($scope, User, Request, localStorageService) {

            console.log("init login controller");
            $scope.usuario = "";
            $scope.clave = "";
            $scope.mostrarmensaje = false;
            $scope.ocultar_formulario = true;

            $scope.autenticar = function() {
                if ($scope.loginform.$invalid) {
                    console.log("invalido")
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
                            contrasenia: $scope.clave
                        }
                    }
                };
                console.log(localStorageService.get("session"))
                Request.realizarRequest("/login", "POST", obj, function(datos) {
                    if (datos.status == 200) {
                        localStorageService.add("session", JSON.stringify(datos.obj.sesion));
                        window.location = "../kardex/";
                    } else {
                        $scope.mostrarmensaje = true;
                        $scope.msgerror = datos.msj || "Ha ocurrido un error...";
                    }
                });

            };

            $scope.recuperarContrasenia = function() {
                if ($scope.forgoutform.$invalid) {
                    console.log("invalido")
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
                    
                    if (datos.status == 200) {
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
