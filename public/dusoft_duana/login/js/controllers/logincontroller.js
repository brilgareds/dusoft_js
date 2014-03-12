
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('Logincontroller', ['$scope', 'User', "Request", "localStorageService",
        function($scope, User, Request, localStorageService) {

            console.log("init login controller");
            $scope.usuario = "mauricio.barrios";
            $scope.clave   = "123456";
            $scope.mostrarmensaje = false;

            console.log($location.search())
            if($location.search().noauth){
                $scope.mostrarmensaje = true;
                $scope.msgerror = "Su sesion ha sido cerrada porque no esta autenticado";
            }



            $scope.autenticar = function() {
                if($scope.loginform.$invalid){
                    console.log("invalido")
                    return ;
                }

                var obj = {
                    session:{
                        usuario_id:"",
                        auth_token:""
                    },
                    data:{
                        login:{
                            usuario:$scope.usuario, 
                            contrasenia:$scope.clave
                        }
                    }
                };
                console.log(localStorageService.get("session"))
                Request.realizarRequest("/login","POST",obj,function(datos){
                    if(datos.status == 200){
                        localStorageService.add("session",JSON.stringify(datos.obj.sesion));
                        window.location = "../pedidos/";
                    } else {
                        $scope.mostrarmensaje = true;
                        $scope.msgerror = datos.msj || "Ha ocurrido un error...";
                    }
                });

            }


        }]);
});