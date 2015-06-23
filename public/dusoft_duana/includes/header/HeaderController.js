define(["angular", "js/controllers", "includes/classes/Usuario", "includes/Constants/Url",
    "includes/header/lockscreen", "includes/content/rutamodulo",
    "includes/classes/Empresa", "includes/classes/Modulo",
    "includes/classes/Rol", "includes/classes/OpcionModulo",
    "includes/classes/CentroUtilidad", "includes/classes/Bodega", "includes/classes/VariableModulo"], function(angular, controllers) {
    controllers.controller('HeaderController', [
        '$scope', '$rootScope', "$state", "Request",
        "Usuario", "socket", "URL", "localStorageService", "Empresa",
        "Modulo", "Rol", "OpcionModulo", "AlertService", "CentroUtilidad", "Bodega","VariableModulo",
        function($scope, $rootScope, $state,
                Request, Usuario, socket, URL, localStorageService, Empresa,
                Modulo, Rol, OpcionModulo, AlertService, CentroUtilidad, Bodega, VariableModulo) {

            var self = this;
           
            
            var obj_session = localStorageService.get("session");
            
            if (!obj_session){
                window.location = "../pages/401.html";
                return;
            }

            // setUsuarioActual(obj_session);
            
            self.redireccionarLogin = function(){
                window.location = "../login";
            };
            


            $scope.mostarLock = false;
            $scope.unlockform = {};

            $scope.obj_session = {
                usuario: "",
                clave: ""
            };

            var session = {
                usuario_id: obj_session.usuario_id,
                auth_token: obj_session.auth_token
            };

            $scope.empresas = [];

            self.setUsuarioActual = function(obj) {
                var usuario = Usuario.get(obj.usuario_id, obj.usuario, obj.nombre);

                usuario.setRutaAvatar("/images/avatar_empty.png");

                usuario.setToken(session.auth_token);
                usuario.setUsuarioId(obj.usuario_id);

                if (obj.ruta_avatar && obj.ruta_avatar.length > 0) {

                    usuario.setRutaAvatar(URL.CONSTANTS.STATIC.RUTA_AVATAR + usuario.getId() + "/" + obj.ruta_avatar);
                }

                usuario.setNombre(obj.nombre);
                usuario.setNombreUsuario(obj.usuario);
                usuario.setEmail(obj.email);

                var empresa_id = obj_session.empresa_id;

                if (!empresa_id) {
                    empresa_id = obj.empresa_id;
                }

                var empresa = Empresa.get("", empresa_id);
                usuario.setEmpresa(empresa);


                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  usuario ", usuario ,obj);
                Usuario.setUsuarioActual(usuario);

                $scope.Usuario = usuario;
            };


            self.obtenerEmpresasUsuario = function(callback) {
               
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

                    if (obj) {
                        var empresas = obj.empresas || [];

                        //se hace el set correspondiente para el plugin de jstree
                        for (var i in empresas) {
                            var empresa = Empresa.get(empresas[i].razon_social, empresas[i].empresa_id);

                            if (empresa.getCodigo() === $scope.Usuario.getEmpresa().getCodigo()) {
                                empresa.setCentrosUtilidad($scope.Usuario.getEmpresa().getCentrosUtilidad());
                                $scope.Usuario.setEmpresa(empresa);
                            }

                            $scope.empresas.push(empresa);


                        }

                        callback();
                    }

                });
            };


            self.traerUsuarioPorId = function(usuario_id, callback) {

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

                    if (obj) {

                        self.setUsuarioActual(obj);
                        callback(obj);
                    }

                });
            };



            self.traerParametrizacionPorUsuario = function(empresa_id, callback) {

                var obj = {
                    session: session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: $scope.Usuario.getId(),
                            empresa_id: empresa_id
                        }
                    }
                };

                Request.realizarRequest(URL.CONSTANTS.API.USUARIOS.OBTENER_PARAMETRIZACION_USUARIO, "POST", obj, function(data) {
                    var obj = data.obj.parametrizacion_usuarios;
                    if (obj) {
                        obj = obj.parametrizacion;
                        var modulos = obj.modulos || [];
                        
                        self.asignarModulosUsuario(modulos);

                        self.asignarEmpresasFarmacias(obj.centros_utilidad);
                        //console.log("empresa usuario ", $scope.Usuario.getEmpresa())
                        callback(obj);
                    } else {
                        $scope.cerraSesion(function() {
                            self.redireccionarLogin();
                        });
                    }

                });
            };

            //asigna los centros de utilidad y bodegas al usuario
            self.asignarEmpresasFarmacias = function(centros) {
                for (var i in centros) {
                    var _empresa = centros[i];
                    //se instancia las emrpesas del usuario
                    if(_empresa.seleccionado_usuario === '1'){
                        
                        var empresa = Empresa.get(_empresa.nombre_empresa, _empresa.empresa_id);
                                                
                        //se asigna los centros de utilidad y bodega de la empresa                        
                        centros.forEach(function(centro){
                            if(empresa.getCodigo() === centro.empresa_id && centro.seleccionado_usuario === '1'){
                                
                                var _centro = CentroUtilidad.get(centro.descripcion, centro.centro_utilidad_id);
                                _centro.setNombreEmpresa(centro.nombre_empresa);
                                _centro.setEmpresaId(centro.empresa_id);
                                
                                for (var ii in centro.bodegas) {
                                    var bodega = centro.bodegas[ii];

                                    if(bodega.seleccionado_usuario === '1'){
                                        var _bodega = Bodega.get(bodega.descripcion, bodega.bodega_id);

                                        _centro.agregarBodega(_bodega);
                                    }
                                }
                                empresa.agregarCentroUtilidad(_centro);
                            }
                        });
                        
                        $scope.Usuario.agregarEmpresaFarmacia(empresa);
                    }
                }
                console.log("HeaderController-> asignarEmpresasFarmacias() ", $scope.Usuario.getEmpresasFarmacias());
            };
            
            //se hace el set correspondiente para el plugin de jstree, y se crea un objeto valor de los modulos y opciones para facilidad de acceso del modulo actual
            self.asignarModulosUsuario = function(modulos) {
                var _modulos = [];
                var _modulosObjetoValor = {};
                
                for (var i in modulos) {

                    var modulo = modulos[i];

                    if (modulo.estado_modulo_usuario === '1') {
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

                        for(var ii in _opciones) {
                            var _opcion = _opciones[ii];
                            // console.log("opcion >>>>>>>>>>>>>>> ", _opcion.estado_opcion_rol)
                            var opcion = OpcionModulo.get(_opcion.id, _opcion.nombre, _opcion.alias, _opcion.modulo_id);
                            opcion.setEstado_opcion_rol(_opcion.estado_opcion_rol);
                            _modulo.agregarOpcion(opcion);
                        }
                        
                        var _variables = modulo.variables;
                        
                        for(var iii in _variables){
                            var _variable = _variables[iii];
                            if(_variable.estado === '1'){
                                
                                var variable = VariableModulo.get(_variable.id, _variable.nombre, _variable.valor, _variable.observacion);
                                _modulo.agregarVariable(variable);
                            }
                        }

                        _modulo.setCarpetaRaiz(modulo.carpeta_raiz);
                        _modulos.push(_modulo);

                        //objeto para mejorar el perfomance en el momento de buscar el modulo actual cada vez que cambie el router
                        _modulosObjetoValor[modulo.state] = {
                            id: "usuario_modulo_" + modulo.modulo_id,
                            parent: modulo.parent,
                            nombre: modulo.nombre,
                            state: modulo.state,
                            icon: modulo.icon,
                            opciones: _modulo.getOpciones(true),
                            variables:_modulo.getVariables(true)
                        };
                        
                    }

                }
                
                if (_modulos.length > 0) {
                    $scope.Usuario.setModulos(_modulos);
                    $scope.Usuario.setObjetoModulos(_modulosObjetoValor);
                    //estando los modulos preparados se envian al controlador del menu                      
                    $rootScope.$emit("modulosUsuario");
                } else {
                    $scope.cerraSesion(function() {
                        window.location = "../pages/401.html";
                    });
                }
            };
            
            
            $scope.onVerPerfilUsuario = function(){
                 localStorageService.set("usuarioo_id", $scope.Usuario.getId());
                 window.location = "../parametrizacion/#/AdministracionUsuarios";
            };

            $scope.onEmpresaSeleccionada = function(empresa) {
                $scope.Usuario.setEmpresa(empresa);
                self.traerParametrizacionPorUsuario($scope.Usuario.getEmpresa().getCodigo(), function(parametrizacion) {

                    var obj = localStorageService.get("session");

                    obj.empresa_id = parametrizacion.rol.empresa_id;

                    localStorageService.add("session", JSON.stringify(obj));
                    location.reload();
                });
            };

            $scope.cerraSesionBtnClick = function($event) {
                $event.preventDefault();
                $scope.cerraSesion(function() {
                    self.redireccionarLogin();
                });

            };

            $scope.cerraSesion = function(callback) {
                $scope.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };


                Request.realizarRequest('/api/logout', "POST", {session: $scope.session, data: {}}, function(data) {
                    //console.log(data)
                    localStorage.removeItem("ls.session");
                    callback();

                });
            };

            $scope.autenticar = function() {

                var session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                Request.realizarRequest('/api/unLockScreen', "POST", {session: session, data: {login: {contrasenia: $scope.obj_session.clave}}}, function(data) {
                    if (data.status === 200) {
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

            $scope.bloquearPantalla = function() {

                var session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                Request.realizarRequest('/api/lockScreen', "POST", {session: session, data: {}}, function(data) {
                    if (data.status === 200) {
                        $scope.mostarLock = true;
                        $scope.obj_session = {};
                    }

                });
            };


            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                var moduloActual = self.obtenerModuloActual(toState.name);

                //se busca en el parent name el modulo actual
                if (!moduloActual && toState.parent_name) {
                    moduloActual = self.obtenerModuloActual(toState.parent_name);
                }

                //no se encontro el modulo, el usuario no tiene permisos para verlo
                if (!moduloActual) {
                    event.preventDefault();
                    AlertService.mostrarMensaje("warning", "El usuario no tiene permisos para ver la sección de " + toState.name);
                    return;
                }

                $scope.Usuario.setModuloActual(moduloActual);


            });

            self.obtenerModuloActual = function(state) {
                var obj = $scope.Usuario.getObjetoModulos();

                var modulo = obj[state];

                return modulo;

            };

            socket.on("onCerrarSesion", function() {
                console.log("onCerrarSesion");
                $scope.cerraSesion(function() {
                    window.location = "../pages/403.html";
                });
            });

            //evento de coneccion al socket
            socket.on("onConnected", function(datos) {
                var socketid = datos.socket_id;
                var socket_session = {
                   usuario_id: obj_session.usuario_id,
                   auth_token: obj_session.auth_token,
                   socket_id: socketid
                };
                

                socket.emit("onActualizarSesion", socket_session);
            });

            self.traerUsuarioPorId(obj_session.usuario_id, function() {
                var empresa_id = obj_session.empresa_id;

                if (!empresa_id) {
                    empresa_id = $scope.Usuario.getEmpresa().getCodigo();
                }

                self.traerParametrizacionPorUsuario(empresa_id, function(parametrizacion) {

                    self.obtenerEmpresasUsuario(function() {
                        $rootScope.$emit("parametrizacionUsuarioLista", parametrizacion);
                    });

                });
            });

        }]);
});