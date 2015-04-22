define(["angular", "js/controllers", "includes/classes/Usuario","includes/Constants/Url",
        "includes/header/lockscreen", "includes/content/rutamodulo",
        "includes/classes/Empresa", "includes/classes/Modulo", "includes/classes/Rol","includes/classes/OpcionModulo" ], function(angular, controllers) {
    controllers.controller('HeaderController', [
        '$scope', '$rootScope', "$state", "Request",
        "Usuario","socket","URL","localStorageService","Empresa",
        "Modulo","Rol","OpcionModulo","AlertService",
        function($scope, $rootScope, $state,
        Request, Usuario, socket, URL, localStorageService,Empresa,
        Modulo, Rol,  OpcionModulo, AlertService) {
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
                                var _modulo = Modulo.get(
                                        modulo.modulo_id,
                                        modulo.parent,
                                        modulo.nombre,
                                        modulo.state,
                                        "usuario_modulo_"
                                );
                                
                                _modulo.setIcon(modulo.icon);
                                _modulo.setState(modulo.state);
                                
                                var _opciones = modulo.opciones;
                                
                                for(var ii in _opciones){
                                    var _opcion = _opciones[ii];
                                    var opcion = OpcionModulo.get(_opcion.id, _opcion.nombre, _opcion.alias, _opcion.modulo_id);
                                    _modulo.agregarOpcion(opcion);
                                }
                                              
                                _modulo.setCarpetaRaiz(modulo.carpeta_raiz); 
                                _modulos.push(_modulo);

                            }
                        
                        }
                        
                        if(_modulos.length > 0){
                            $scope.Usuario.setModulos(_modulos);
                            //estando los modulos preparados se envian al controlador del menu                      
                            $rootScope.$emit("modulosUsuario");
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
                console.log("to staste ", toState);

                var moduloActual = self.obtenerModuloActual(toState.name);

                //se busca en el parent name el modulo actual
                if(!moduloActual &&  toState.parent_name){
                    moduloActual = self.obtenerModuloActual(toState.parent_name);
                }

                //no se encontro el modulo, el usuario no tiene permisos para verlo
                if(!moduloActual){
                    event.preventDefault();
                    AlertService.mostrarMensaje("warning", "El usuario no tiene permisos para ver la sección de "+ toState.name);
                    return;
                }

                $scope.Usuario.setModuloActual(moduloActual);
              
                    
           });
           
           self.obtenerModuloActual = function(state){
                var modulos = $scope.Usuario.getModulos();
                for(var i in modulos){
                    var modulo = modulos[i];
                    console.log("buscando ", modulo.getState(), " con ", state);
                    if(modulo.getState() === state){
                       return modulo;
                    }
                }
                return null;
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
                var obj_session = {
                  usuario_id : Usuario.usuario_id,
                  auth_token : Usuario.token,
                  socket_id : socketid
                };

                socket.emit("onActualizarSesion",obj_session);
             });   
            
                            

            
            self.traerUsuarioPorId(obj_session.usuario_id, function(){
                var empresa_id = obj_session.empresa_id;

                if(!empresa_id){
                    empresa_id = $scope.Usuario.getEmpresa().getCodigo();
                }
                
                self.traerParametrizacionPorUsuario(empresa_id,function(parametrizacion){
                    
                    console.log("parametrizacion >>>>>>>>>>>>>", parametrizacion);
                    
                    self.obtenerEmpresasUsuario(function(){
                        console.log("usuario ", $scope.Usuario);
                        $rootScope.$emit("parametrizacionUsuarioLista", parametrizacion);
                    });

                });
            });
           
        }]);
});