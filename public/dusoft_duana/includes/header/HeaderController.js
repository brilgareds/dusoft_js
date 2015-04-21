define(["angular", "js/controllers", "includes/classes/Usuario","includes/Constants/Url",
        "includes/header/lockscreen", "includes/content/rutamodulo", "includes/classes/Empresa" ], function(angular, controllers) {
    controllers.controller('HeaderController', [
        '$scope', '$rootScope', "$state", "Request",
        "Usuario","socket","URL","localStorageService","Empresa",
        function($scope, $rootScope, $state,
        Request, Usuario, socket, URL, localStorageService,Empresa) {
            var self = this;
            var obj_session = localStorageService.get("session");
            console.log("session obj_session ", obj_session)
            if(!obj_session) return;
            
           // setUsuarioActual(obj_session);

                
            $scope.mostarLock = false;
            $scope.unlockform = {};
            
            $scope.obj_session = {
                usuario:"",
                clave:""
            };
            
            var session = {
                usuario_id:obj_session.usuario_id,
                auth_token: obj_session.auth_token
            };
            
            $scope.empresas = [];
           
            
           self.setUsuarioActual = function(obj){
                var usuario = Usuario.get(obj.usuario_id, obj.usuario, obj.nombre);
                
                usuario.setRutaAvatar("/images/avatar_empty.png");
                        
                usuario.setToken(session.auth_token);
                usuario.setUsuarioId(obj.usuario_id); 
                
                if(obj.ruta_avatar && obj.ruta_avatar.length > 0){
                    
                    usuario.setRutaAvatar(URL.CONSTANTS.STATIC.RUTA_AVATAR+usuario.getId() + "/" +obj.ruta_avatar);
                }
                
                usuario.setNombre(obj.nombre);
                usuario.setNombreUsuario(obj.usuario);
                usuario.setEmail(obj_session.email);
                
                var empresa_id = obj_session.empresa_id;
                
                if(!empresa_id){
                    empresa_id = obj.empresa_id;
                }
                
                var empresa = Empresa.get("", empresa_id);
                usuario.setEmpresa(empresa);
                
                
                console.log("ruta de avatar ", usuario.getRutaAvatar());
                Usuario.setUsuarioActual(usuario);

                $scope.Usuario = usuario;
           };
           
           
           self.obtenerEmpresasUsuario = function(callback){

                var obj = {
                    session: session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: $scope.Usuario.getId()
                        }
                    }
                };
                
                Request.realizarRequest(URL.CONSTANTS.API.USUARIOS.OBTENER_EMPRESAS_USUARIO, "POST", obj, function(data) {
                    var obj = data.obj.parametrizacion_usuarios;
                    
                    if(obj){
                        var empresas = obj.empresas || [];
                        
                        //se hace el set correspondiente para el plugin de jstree
                        for(var i in empresas){
                            var empresa = Empresa.get(empresas[i].razon_social, empresas[i].empresa_id);
                            
                            if(empresa.getCodigo() === $scope.Usuario.getEmpresa().getCodigo()){
                                   $scope.Usuario.setEmpresa(empresa);
                            }
                            
                            $scope.empresas.push(empresa);
                            
                        
                        }
                        
                        
                        callback();
                    }
                    
                });
            };
            
            
            self.traerUsuarioPorId = function(usuario_id, callback){

                var obj = {
                    session: session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: usuario_id
                        }
                    }
                };
                
                Request.realizarRequest(URL.CONSTANTS.API.USUARIOS.OBTENER_USUARIO_POR_ID, "POST", obj, function(data) {
                    var obj = data.obj.parametrizacion_usuarios.usuario;
                    
                    if(obj){
                        
                        self.setUsuarioActual(obj);
                        callback(obj);
                    }
                    
                });
            };
            
                        
               
           self.traerParametrizacionPorUsuario = function(empresa_id, callback){

                var obj = {
                    session: session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: $scope.Usuario.getId(),
                            empresa_id:empresa_id
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
                        
                        console.log("modulos del sistema ", _modulos);
                        if(_modulos.length > 0){
                            //estando los modulos preparados se envian al controlador del menu                      
                            $rootScope.$emit("modulosUsuario", _modulos);
                        }
                        
                        callback(obj);
                    }
                    
                });
            };
            
            
            $scope.onEmpresaSeleccionada = function(){
                self.traerParametrizacionPorUsuario($scope.Usuario.getEmpresa().getCodigo(),function(parametrizacion){
                    
                    var obj = localStorageService.get("session");
                    
                    obj.empresa_id = parametrizacion.rol.empresa_id;
                    
                    localStorageService.add("session", JSON.stringify(obj));
                    location.reload();
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

                var session = {
                    usuario_id: Usuario.usuario_id,
                    auth_token: Usuario.token
                };

                Request.realizarRequest('/api/unLockScreen', "POST", {session: session, data: {login:{contrasenia:$scope.obj_session.clave}}}, function(data) {
                    if(data.status === 200){
                        $scope.msgerror = "";
                        $scope.mostrarmensaje = false;
                        $scope.mostarLock = false;
                        $scope.obj_session = {};
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
                        $scope.obj_session = {};
                    }

                });
            };
            
            
          $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                    /*console.log("event === ", event);
                    console.log("toState === ", toState);
                    console.log("toParams === ", toParams);
                    console.log("fromState === ", fromState);
                    console.log("fromParams === ", fromParams);*/
                    //event.preventDefault();
                    
           });

            socket.on("onCerrarSesion",function(){
                console.log("onCerrarSesion");
                $scope.cerraSesion(function(){
                    window.location = "../pages/403.html";
                });
            });

            //evento de coneccion al socket
            socket.on("onConnected", function(datos){
                var socketid = datos.socket_id;
                var obj_session = {
                  usuario_id : Usuario.usuario_id,
                  auth_token : Usuario.token,
                  socket_id : socketid
                };

                socket.emit("onActualizarSesion",obj_session);
             });   
            
                            
            var empresa_id = obj_session.empresa_id;

            if(!empresa_id){
                empresa_id = $scope.Usuario.getEmpresa().getCodigo();
            }
            
            self.traerUsuarioPorId(obj_session.usuario_id, function(){
                
                self.traerParametrizacionPorUsuario(empresa_id,function(parametrizacion){
                    self.obtenerEmpresasUsuario(function(){
                        console.log("usuario ", $scope.Usuario);
                        $rootScope.$emit("parametrizacionUsuarioLista", parametrizacion);
                    });

                });
            });
           
        }]);
});