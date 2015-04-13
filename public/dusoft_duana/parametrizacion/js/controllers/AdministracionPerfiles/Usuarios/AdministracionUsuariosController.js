
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('AdministracionUsuariosController', [
        '$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "$state", "AlertService",
        "UsuarioParametrizacion","$filter","Usuario",
        "localStorageService","STATIC","EmpresaParametrizacion","Rol","Empresa_Modulo", 
        "Modulo","RolModulo","ParametrizacionService",
        function($scope, $rootScope, Request, $modal,
                API, socket, $timeout, $state,
                AlertService, UsuarioParametrizacion, $filter, Usuario,
                localStorageService, STATIC, EmpresaParametrizacion, Rol, Empresa_Modulo, 
                Modulo, RolModulo, ParametrizacionService) {
                     
            var self = this;
            
            $scope.rootUsuario = {
                
            };
            
            $scope.rootModulos = {
                
            };
            
            $scope.rootUsuario.empresas = [];
            
            $scope.rootUsuario.termino_busqueda = "";
            $scope.rootUsuario.paginaactual = 1;
            
            $scope.rootUsuario.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            
            $scope.rootModulos.session = $scope.rootUsuario.session;
            
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
                    {field: 'opciones', displayName: "", cellClass: "txt-center dropdown-button", width: "18%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción <span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="seleccionRol(row.entity);" >Seleccionar</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="gestionar_acciones_orden_compra(row.entity,0)" >Modificar</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="generar_reporte(row.entity,0)" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-disabled="true" ng-click="enviar_email(row.entity,0)" >Enviar por Email</a></li>\
                                                <li class="divider"></li>\
                                                <li><a href="javascript:void(0);" ng-click="gestionar_acciones_orden_compra(row.entity,1)" >Novedades</a></li>\
                                                <li class="divider"></li>\
                                                <li><a href="javascript:void(0);" ng-click="anular_orden_compra_seleccionada(row.entity)">Anular OC</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]

            };
            
            
            self.inicializarUsuarioACrear = function() {
                $scope.rootUsuario.usuarioAGuardar = UsuarioParametrizacion.get();
                $scope.rootModulos.moduloAGuardar = Modulo.get();
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
                    console.log("informacion del usuario ",data);
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
                        
                        if(_usuario.empresa_id){
                            $scope.rootUsuario.empresaSeleccionada = EmpresaParametrizacion.get("", _usuario.empresa_id);
                            $scope.rootUsuario.empresaSeleccionada.setLoginEmpresaId(_usuario.login_empresas_id);
                            var rol = Rol.get(
                                    _usuario.id_rol,
                                    _usuario.nombre_rol,
                                    _usuario.observacion_rol,
                                    $scope.rootUsuario.empresaSeleccionada.getCodigo()
                            );
                                
                           $scope.rootUsuario.rolAGuardar = rol;
                            
                            
                            self.traerModulosPorUsuario(function(){
                                self.traerModulos();
                           });
                        }
                        
                        callback();

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            };
            
            /*self.obtenerRolUsuarioPorEmpresa = function(callback){
                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: $scope.rootUsuario.usuarioAGuardar.getId(),
                            empresa_id :$scope.rootUsuario.empresaSeleccionada.getCodigo()
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.OBTENER_ROL_USUARIO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var rol = data.obj.parametrizacion_usuarios.rol;
                        $scope.rootUsuario.empresaSeleccionada = EmpresaParametrizacion.get("", rol.empresa_id);
                        
                        if(rol){
                            var rol = Rol.get(
                                    rol.id,
                                    rol.nombre,
                                    rol.observacion,
                                    $scope.rootUsuario.empresaSeleccionada.getCodigo()
                            );
                                
                           $scope.rootUsuario.rolAGuardar = rol;
                        }
                        
                        callback();

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            };*/
            
            
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
                
                var parametros = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_perfiles: {
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo(),
                            termino: $scope.rootUsuario.termino_busqueda,
                            pagina_actual:$scope.rootUsuario.paginaactual
                        }
                    }
                };
                
                ParametrizacionService.traerRoles(parametros, $scope.rootUsuario.empresaSeleccionada, function(success, msg){
                    if(!success){
                        AlertService.mostrarMensaje("warning", msg);
                    }
                });

            };
            
            //trae todos los modulos que estan disponibles para la empresa seleccionada
            self.traerModulos = function() {   
                $scope.$broadcast("deshabilitarNodos");
                $scope.rootUsuario.empresaSeleccionada.vaciarListaEmpresas();
                
                var parametros = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_roles: {
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo()
                        }
                    }
                };
                
                ParametrizacionService.traerModulos(parametros, $scope.rootUsuario.empresaSeleccionada, self.esModuloSeleccionado);
                
              

            };
            
            $rootScope.$on("datosArbolCambiados",function(e, modulos){
                $scope.$broadcast("datosArbolCambiados", modulos);
            });

            $rootScope.$on("onseleccionarnodo", function(e, modulo){
               $scope.$broadcast("onseleccionarnodo",modulo.id); 
            });
            
            
            self.traerModulosPorUsuario = function(callback) {
                $scope.rootUsuario.rolAGuardar.vaciarModulos();
                
                
                var parametros = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            rol_id: $scope.rootUsuario.rolAGuardar.getId(),
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo(),   
                            usuario_id:$scope.rootUsuario.usuarioAGuardar.getId()
                        }
                    }
                };
                
                ParametrizacionService.traerModulosPorUsuario(parametros, $scope.rootUsuario.rolAGuardar, function(success){
                    if(success){
                        console.log("modulos para el rol ",$scope.rootUsuario.rolAGuardar.getModulos());
                        var modulos = $scope.rootUsuario.rolAGuardar.getModulos();
                        for(var i in modulos){
                            console.log("id modulo ", modulos[i].getModulo().getId(), modulos[i].getModulo().getEstado())
                        }
                        callback();
                    }
                });
                
            };
            
            //se busca en el rol los modulo que le pertenecen
            self.esModuloSeleccionado = function(modulo) {
                var modulos =  $scope.rootUsuario.rolAGuardar.getModulos();
                //console.log("modulos del rol ",modulos);
                for (var i in modulos) {
                    if (modulos[i].getModulo().getId() === modulo.getId() && modulos[i].getModulo().getEstado()) {
                        return modulos[i];
                    }
                }
                return null;
            };
            
            
            self.asignarRolUsuario = function(callback){   
                
              var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios:{
                            usuario_id:$scope.rootUsuario.usuarioAGuardar.getId(),
                            rol_id:$scope.rootUsuario.rolAGuardar.getId(),
                            empresa_id:$scope.rootUsuario.empresaSeleccionada.getCodigo(),
                            predeterminado:$scope.rootUsuario.empresaSeleccionada.getPredeterminado()
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.ASIGNAR_ROL_USUARIO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        console.log("rol asignado ", data);
                        var login_empresa_id = data.obj.parametrizacion_usuarios.login_empresa_id;
                        $scope.rootUsuario.empresaSeleccionada.setLoginEmpresaId(login_empresa_id);
                        callback();
                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error guardando el rol para el usuario");
                    }

                });
            };
            
            
            //agrega modulo al rol actual buscandolo en los modulos seleccionados para la empresa por el id, se retorna el modulo que se guardo
            self.agregarModulo = function(modulo_id, estado) {
                
                return ParametrizacionService.agregarModulo($scope.rootUsuario.rolAGuardar, $scope.rootUsuario.empresaSeleccionada, modulo_id, estado);

            };
            
            
            //basado en los modulos seleccionados, se envian para ser habilitardos para el usuario
            self.habilitarModulosRol = function() {

                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            rolesModulos: $scope.rootUsuario.rolAGuardar.getModulos(),
                            login_empresas_id:$scope.rootUsuario.empresaSeleccionada.getLoginEmpresaId()
                        }
                    }
                };
                

                Request.realizarRequest(API.USUARIOS.HABILITAR_MODULOS_USUARIO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        console.log("moduolos asignados ", data);
                        AlertService.mostrarMensaje("success", "El modulo se habilito en el rol correctamente");
                        var rol = $scope.rootUsuario.rolAGuardar;
                        var ids = data.obj.parametrizacion_usuarios.ids;
                        
                        //se asigna el id del rol_modulo guardado, ya sea que se modifique o cree
                        var modulos = rol.getModulos();
                        for(var i in ids){
                            
                            for(var ii in modulos){
                                if(modulos[ii].getModulo().getId() === ids[i].modulo_id){
                                    modulos[ii].setUsuarioEmpresaId(ids[i].login_modulos_empresas_id);
                                    break;
                                }
                            }
                          
                        }
                        

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            };
            
            
            $rootScope.$on("onSeleccionarOpcion", function(event, opcion){
                console.log("on seleccion code 1 ", opcion)
            });
            
            $scope.seleccionRol = function(rol){
                $scope.rootUsuario.rolAGuardar = rol;
                
                self.asignarRolUsuario(function(){
                    self.traerModulosPorUsuario(function(){
                         self.traerModulos();
                    });
                });
            };
            
            $scope.onVolver = function(){
                $state.go("ListarUsuarios");
            };
            
            $scope.onLimpiarFormulario = function(){
                self.inicializarUsuarioACrear();
                $scope.rootUsuario.confirmacionEmail = "";
                $scope.rootUsuario.confirmacionClave = "";
                $scope.rootUsuario.avatar = "";
            };
            
            $scope.onBuscarRol = function($event) {
                if ($event.which === 13) {
                    $scope.rootUsuario.paginaactual = 1;
                    self.traerRoles();
                }
            };
            
            
            $scope.$on("modulosSeleccionados", function(e, modulos_seleccionado) {
                //vacia los modulos del rol para enviar solo los seleccionados en el momento
                $scope.rootUsuario.rolAGuardar.vaciarModulos();
                
                var modulo = self.agregarModulo(modulos_seleccionado.seleccionado, true);

                if (!modulo) {
                    return;
                }
                
                $scope.rootModulos.moduloAGuardar = modulo;


                for (var i in modulos_seleccionado.padres) {
                    self.agregarModulo(modulos_seleccionado.padres[i], true);
                }

                for (var ii in modulos_seleccionado.hijos) {
                    self.agregarModulo(modulos_seleccionado.hijos[ii], true);
                }
                
                self.habilitarModulosRol();
                
            });
            
            
            $scope.$on("traerOpcioesModuloSeleccionado", function(e, modulo_id) {
                //self.listarRolesModulosOpciones(modulo_id);
                
                $scope.rootModulos.moduloAGuardar = self.esModuloSeleccionado(Modulo.get(modulo_id)).getModulo();
                                
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_usuarios: {
                            modulo: {
                                id: modulo_id,
                                rol_modulo_id:0,
                                rol_id:$scope.rootUsuario.rolAGuardar.getId(),
                                empresa_id:$scope.rootUsuario.empresaSeleccionada.getCodigo()
                            },
                            usuario_id:$scope.rootUsuario.usuarioAGuardar.getId()
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.LISTAR_USUARIO_OPCIONES, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_usuarios.opciones_modulo;
                        
                        //se emite el evento con los datos al controllador de opciones
                        $scope.$broadcast("traerOpcionesModulo", datos);

                    }

                });
                
            });
            
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
            
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.rootUsuarios = {};
                $scope.$$watchers = null;
            });
            
        }]);
});