define(["angular", "js/controllers", "includes/classes/Usuario","includes/Constants/Url",
        "includes/header/lockscreen", "includes/content/rutamodulo" ], function(angular, controllers) {
    controllers.controller('HeaderController', [
        '$scope', '$rootScope', "$state", "Request",
        "Usuario","socket","URL","localStorageService",
        function($scope, $rootScope, $state,
        Request, Usuario, socket, URL, localStorageService) {
            var self = this;
            var obj = localStorageService.get("session");
            console.log("session obj ", obj)
            if(!obj) return;
            
            
            var usuario = Usuario.get(obj.usuario_id, obj.detalle.usuario, obj.detalle.nombre);
                        
            usuario.setToken(obj.auth_token);
            usuario.setUsuarioId(obj.usuario_id); 
            usuario.setRutaAvatar(obj.ruta_avatar);
            Usuario.setUsuarioActual(usuario);
            
            $scope.Usuario = Usuario;
                
            $scope.mostarLock = false;
            $scope.unlockform = {};
            
            $scope.obj = {
                usuario:"",
                clave:""
            };
            
            var session = {
                usuario_id: usuario.getId(),
                auth_token: usuario.getToken()
            };
                        
               
           self.traerParametrizacionPorUsuario = function(callback){

                var obj = {
                    session: session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: usuario.getId()
                        }
                    }
                };
                
                Request.realizarRequest(URL.CONSTANTS.API.USUARIOS.OBTENER_PARAMETRIZACION_USUARIO, "POST", obj, function(data) {
                    var obj = data.obj.parametrizacion_usuarios.parametrizacion;
                    
                    if(obj){
                        var modulos = obj.modulos || [];
                        var _modulos = [];
                        
                        //se hace el set correspondiente para el plugin de jstree
                        for(var i in modulos){
                            var modulo = modulos[i];
                            if(modulo.estado_modulo_usuario === '1'){
                                modulo.text = modulo.nombre;
                                modulo.id = "usuario_modulo_"+modulo.modulo_id;

                                if(!modulo.parent){
                                    modulo.parent = "#";
                                } else {
                                    modulo.parent =  "usuario_modulo_"+modulo.parent;
                                }

                                _modulos.push(modulo);

                            }
                        
                        }
                        if(modulos.length > 0){
                            //estando los modulos preparados se envian al controlador del menu                      
                            $rootScope.$emit("modulosUsuario", _modulos);
                        }
                        
                        callback(obj);
                    }
                    
                });
            };
            
           
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


                Request.realizarRequest('/api/logout', "POST", {session: $scope.session, data: {}}, function(data) {
                    //console.log(data)
                    localStorage.removeItem("ls.session");
                    callback();

                });
            };

            $scope.autenticar = function(){

                console.log($scope.obj.clave)
                var session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };

                Request.realizarRequest('/api/unLockScreen', "POST", {session: session, data: {login:{contrasenia:$scope.obj.clave}}}, function(data) {
                    if(data.status === 200){
                        $scope.msgerror = "";
                        $scope.mostrarmensaje = false;
                        $scope.mostarLock = false;
                        $scope.obj = {};
                    } else {
                        $scope.msgerror = data.msj;
                        $scope.mostrarmensaje = true;
                    }

                });
            };

            $scope.bloquearPantalla = function(){
                
                var session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };

                Request.realizarRequest('/api/lockScreen', "POST", {session: session, data: {}}, function(data) {
                    if(data.status === 200){
                        $scope.mostarLock = true;
                        $scope.obj = {};
                    }

                });
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
            
            

            self.traerParametrizacionPorUsuario(function(parametrizacion){

                $rootScope.$emit("parametrizacionUsuarioLista", parametrizacion);
            });
            

        }]);
});