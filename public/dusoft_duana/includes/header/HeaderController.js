define(["angular", "js/controllers", "includes/classes/Usuario"], function(angular, controllers) {
    controllers.controller('HeaderController', ['$scope', '$rootScope', "$state", "Request", "Usuario","socket",
        function($scope, $rootScope, $state, Request, Usuario, socket) {
           
            $scope.cerraSesionBtnClick = function($event) {
                $event.preventDefault();
                $scope.cerraSesion(function(){
                    window.location = "../login";
                });
                

            };  

            $scope.cerraSesion = function(callback){
                $scope.session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };

                console.log(Usuario)

                Request.realizarRequest('/api/logout', "POST", {session: $scope.session, data: {}}, function(data) {
                    //console.log(data)
                    localStorage.removeItem("ls.session");
                    callback();

                });
            };

            $scope.bloquearPantalla = function(){
                alert("")
            };

            socket.on("onCerrarSesion",function(){
                console.log("onCerrarSesion");
                $scope.cerraSesion(function(){
                    window.location = "../pages/403.html";
                });
            });

            //evento de coneccion al socket
            socket.on("onConnected", function(datos){
                var socketid = datos.socket_id;
                var obj = {
                  usuario_id : Usuario.usuario_id,
                  auth_token : Usuario.token,
                  socket_id : socketid
                };

                socket.emit("onActualizarSesion",obj);
             });   

        }]);
});