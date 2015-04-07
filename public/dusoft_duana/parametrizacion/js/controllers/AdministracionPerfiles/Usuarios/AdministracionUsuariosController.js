
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('AdministracionUsuariosController', [
        '$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "$state", "AlertService",
        "UsuarioParametrizacion","$filter","Usuario",
        "localStorageService","STATIC","EmpresaParametrizacion","Rol",
        function(
                $scope, $rootScope, Request, $modal,
                API, socket, $timeout, $state,
                AlertService, UsuarioParametrizacion, $filter, Usuario,
                localStorageService, STATIC, EmpresaParametrizacion, Rol) {
                     
            var self = this;
            
            $scope.rootUsuario = {
                
            };
            
            $scope.rootUsuario.empresas = [];
            
            $scope.rootUsuario.termino_busqueda = "";
            $scope.rootUsuario.paginaactual = 1;
            
            $scope.rootUsuario.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            
            $scope.rootUsuario.avatar = "";
            $scope.rootUsuario.avatar_empty = STATIC.BASE_IMG + "/avatar_empty.png";
            
             
            $scope.opciones_archivo = new Flow();
            $scope.opciones_archivo.target = API.USUARIOS.SUBIR_AVATAR_USUARIO;
            $scope.opciones_archivo.testChunks = false;
            $scope.opciones_archivo.singleFile = true;
            $scope.opciones_archivo.query = {
                session: JSON.stringify($scope.rootUsuario.session)
            };
            
            $scope.abrir = false;
            var fechaActual = new Date();
            
            
            $scope.listado_roles = {
                data: 'rootUsuario.empresaSeleccionada.getRoles()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre', displayName: 'Nombre'},
                    {field: 'observacion', displayName: 'Observacion'},
                    {field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                      <button class="btn btn-default btn-xs" ng-click="onEditarRol(row.entity)"><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                   </div>'
                    }
                ]

            };
            
            
            self.inicializarUsuarioACrear = function() {
                $scope.rootUsuario.usuarioAGuardar = UsuarioParametrizacion.get();
            };
            
            self.esEmailValido = function(email){
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            };
            
            self.__validarCreacionUsuario = function() {
                var validacion = {
                    valido: true,
                    msj: ""
                };
                
                var usuario = $scope.rootUsuario.usuarioAGuardar;


                if (usuario.getNombre() === undefined || usuario.getNombre().length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El usuario debe tener un nombre";
                    return validacion;
                }
                
                if (usuario.getNombreUsuario() === undefined || usuario.getNombreUsuario().length === 0) {
                    validacion.valido = false;
                    validacion.msj = "Debe tener un nombre de usuario";
                    return validacion;
                }
                                
                if (usuario.getClave() && usuario.getClave().length > 0 || usuario.getId() === "") {
                    
                    if(usuario.getClave().length < 5) {
                        validacion.valido = false;
                        validacion.msj = "El usuario debe tener una clave valida de 6 caracteres";
                        return validacion;
                    }
                    
                     if(usuario.getClave() !== $scope.rootUsuario.confirmacionClave) {
                        validacion.valido = false;
                        validacion.msj = "Debe confirmar la clave";
                        return validacion;
                    }
                }
                
                

                if (usuario.getEmail() === undefined && usuario.getEmail().length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El usuario debe tener un email";
                    return validacion;
                    
                } else if(usuario.getEmail() !== $scope.rootUsuario.confirmacionEmail) {
                    validacion.valido = false;
                    validacion.msj = "Debe confirmar el email";
                    return validacion;
                }
                
                if(!self.esEmailValido(usuario.getEmail())){
                    validacion.valido = false;
                    validacion.msj = "El email no es valido";
                    return validacion;
                }
                
                return validacion;

            };
            
            self.traerUsuarioPorId = function(usuario_id, callback){
                
                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: usuario_id
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.OBTENER_USUARIO_POR_ID, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var _usuario = data.obj.parametrizacion_usuarios.usuario;
                        
                        if(_usuario){
                           $scope.rootUsuario.usuarioAGuardar = UsuarioParametrizacion.get(_usuario.usuario_id, _usuario.usuario, _usuario.nombre);
                           $scope.rootUsuario.usuarioAGuardar.setFechaCaducidad(_usuario.fecha_caducidad_contrasena);
                           $scope.rootUsuario.usuarioAGuardar.setEmail(_usuario.email);
                           $scope.rootUsuario.confirmacionEmail = _usuario.email;
                           $scope.rootUsuario.usuarioAGuardar.setDescripcion(_usuario.descripcion);
                           $scope.rootUsuario.usuarioAGuardar.setRutaAvatar(_usuario.ruta_avatar);
                           
                           if(_usuario.ruta_avatar){
                               
                                $scope.rootUsuario.avatar = STATIC.RUTA_AVATAR+_usuario.usuario_id + "/" + _usuario.ruta_avatar || "";    
                           }
                        }
                        
                        callback();

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            };
            
            
            self.traerEmpresas = function() {
                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.rootUsuario.empresas = [];
                        var datos = data.obj.empresas;

                        for (var i in datos) {

                            var empresa = EmpresaParametrizacion.get(
                                    datos[i].razon_social,
                                    datos[i].empresa_id
                            );

                            $scope.rootUsuario.empresas.push(empresa);

                            //se verifica cual es la empresa a la que pertenece el rol
                           /* if ($scope.rootRoles.rolAGuardar.getId() > 0) {
                                if ($scope.rootRoles.rolAGuardar.getEmpresaId() === empresa.getCodigo()) {
                                    $scope.rootRoles.empresaSeleccionada = empresa;
                                    $scope.onEmpresaSeleccionada();
                                }
                            }*/

                        }

                    }

                });
            };
            
            
            
            self.traerRoles = function() {
                if (!$scope.rootUsuario.empresaSeleccionada || $scope.rootUsuario.empresaSeleccionada.getCodigo().length === 0) {
                    $scope.rootUsuario.paginaactual = 1;
                    return;
                }

                $scope.rootUsuario.empresaSeleccionada.vaciarRoles();

                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_perfiles: {
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo(),
                            termino: $scope.rootUsuario.termino_busqueda,
                            pagina_actual:$scope.rootUsuario.paginaactual
                        }
                    }
                };

                Request.realizarRequest(API.PERFILES.LISTAR_ROLES, "POST", obj, function(data) {
                    if (data.status === 200) {

                        var roles = data.obj.parametrizacion_perfiles.roles;
                        
                        if(roles.length === 0){
                            AlertService.mostrarMensaje("warning", "No se encontraron registros");
                            return;
                        }

                        for (var i in roles) {

                            var rol = Rol.get(
                                    roles[i].id,
                                    roles[i].nombre,
                                    roles[i].observacion,
                                    $scope.rootUsuario.empresaSeleccionada.getCodigo()
                            );

                            $scope.rootUsuario.empresaSeleccionada.agregarRol(rol);

                        }

                    } else {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error...");
                    }

                });

            };
            
            
            $scope.onVolver = function(){
                $state.go("ListarUsuarios");
            };
            
            $scope.onLimpiarFormulario = function(){
                self.inicializarUsuarioACrear();
                $scope.rootUsuario.confirmacionEmail = "";
                $scope.rootUsuario.confirmacionClave = "";
            };
            
            $scope.onBuscarRol = function($event) {
                if ($event.which === 13) {
                    $scope.rootUsuario.paginaactual = 1;
                    self.traerRoles();
                }
            };
            
            
            $scope.onGuardarUsuario = function(){
                console.log("usuario a guardar ",$scope.rootUsuario.usuarioAGuardar);
                console.log("confirmar clave ",$scope.confirmarClave);
                 
                var validacion = self.__validarCreacionUsuario();
                
                if (!validacion.valido) {
                    AlertService.mostrarMensaje("warning", validacion.msj);
                    return;
                }
                
               // $scope.rootRoles.rolAGuardar.setEmpresaId($scope.rootRoles.empresaSeleccionada.getCodigo());
                var usuario_guardar = angular.copy($scope.rootUsuario.usuarioAGuardar);


                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario: usuario_guardar
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.GUARDAR_USUARIO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var _usuario = data.obj.parametrizacion_usuarios.usuario;
                        if(_usuario){
                            var id = data.obj.parametrizacion_usuarios.usuario.usuario_id;
                            $scope.rootUsuario.usuarioAGuardar.setId(id);
                        }
                        
                        console.log("usuario guardado ", $scope.rootUsuario.usuarioAGuardar);

                        AlertService.mostrarMensaje("success", "Usuario guardado correctamente");


                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
                
                
            };
            
            $scope.cargar_archivo = function($flow) {

                $scope.opciones_archivo = $flow;
            };
            
             $scope.subirImagenUsuario = function() {
                // Solo Subir Plano
                $scope.opciones_archivo.opts.query.data = JSON.stringify({
                    parametrizacion_usuarios: {
                        usuario_id: $scope.rootUsuario.usuarioAGuardar.getId()
                    }
                });

                $scope.opciones_archivo.upload();
                
                console.log("file data ", $scope.opciones_archivo.opts);

            };
            
            $scope.respuestaImagenAvatar = function(file, message) {
                
                //$scope.opciones_archivo.cancel();
                var data = (message !== undefined) ? JSON.parse(message) : {};

                if (data.status === 200) {

                    AlertService.mostrarMensaje("success", "Avatar actualizado correctamente");
                
                } else {
                    AlertService.mostrarMensaje("success", "Se genero un error actualizando el avatar");
                }
            
            };
            
            $scope.onEmpresaSeleccionada = function() {
                self.traerRoles();
            };
            
            $scope.paginaAnterior = function() {
                $scope.rootUsuario.paginaactual--;
                self.traerRoles();
            };

            $scope.paginaSiguiente = function() {
                $scope.rootUsuario.paginaactual++;
                self.traerRoles();
            };

            var usuario_id = localStorageService.get("usuario_id");
            self.inicializarUsuarioACrear();
            
            self.traerEmpresas();

            if (usuario_id && usuario_id.length > 0) {
                self.traerUsuarioPorId(usuario_id, function() {
                    
                });
            } 
            
           // $scope.fecha = $filter('date')(fechaActual, "yyyy-MM-dd");
            
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.rootUsuarios = {};
                $scope.$$watchers = null;
            });
            
        }]);
});