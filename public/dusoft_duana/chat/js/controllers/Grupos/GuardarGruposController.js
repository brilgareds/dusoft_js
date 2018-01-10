define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('GuardarGruposController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", 
        '$modal', "$timeout","GrupoChat",
        function($scope, $rootScope, Request,
                API, socket, AlertService,
                $state, Usuario, localStorageService, 
                $modal, $timeout, GrupoChat) {

            var self = this;
            
            
            $scope.root = {
                usuarios:[],
                grupo:GrupoChat.get(),
                usuariosSeleccionados:[],
                terminoBusqueda:""
            };

            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            
            $scope.listaUsuarios = {
                data: 'root.usuarios',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter:true,
                columnDefs: [
                    {
                        field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                        <button class="btn btn-default btn-xs"  ng-click="onBtnCambiarEstadoUsuarioGrupo(row.entity)">\
                                            <span ng-if="row.entity.estado" class="glyphicon glyphicon-trash"></span>\
                                            <span ng-if="!row.entity.estado" class="glyphicon glyphicon-check"></span>\
                                        </button>\
                                   </div>'
                    },
                    {field: 'getNombre()', displayName: 'Nombre'},
                    {field: 'getNombreUsuario()', displayName: 'Usuario'}
                ]

            };

            /**
            * @author Eduar Garcia
            * +Descripcion Evento de la directiva de usuarios al seleccionarse uno
            * @params Event e, Usuario usuario
            * @fecha 2016-08-30
            */
            $scope.$on("onBtnSeleccionarUsuario", function(e, usuario){
                //self.insertarUsuarios([usuario.getId()]);
                self.seleccionarUsuario(usuario);
            });
            
            
            self.init = function(){
                var grupoId = localStorageService.get("grupoId");
                
                if(grupoId && grupoId !== '0'){
                    self.obtenerGrupo(grupoId, function(grupo){
                        $scope.root.grupo = GrupoChat.get(grupo.id, grupo.nombre, grupo.fecha_creacion);
                        $scope.root.grupo.setEstado(grupo.estado);
                        
                        self.listarUsuariosPorGrupo("", function(usuarios){
                            self.renderUsuariosGrupo(usuarios);
                        });
                    });
                } 
                
            };
            
            
            self.renderUsuariosGrupo = function(_usuarios){
                $scope.root.usuarios = [];
                
                for(var i in _usuarios){
                    var _usuario = _usuarios[i];
                    var usuario = Usuario.get(_usuario.usuario_id, _usuario.usuario, _usuario.nombre);
                    usuario.setEstado(Boolean(parseInt(_usuario.estado)));
                    $scope.root.usuarios.push(usuario);
                }
                
            };
            
          /**
            * @author Eduar Garcia
            * +Descripcion Realiza peticion para obtener el grupo por id
            * @params Event e, Usuario usuario
            * @fecha 2016-09-01
            */
            self.obtenerGrupo = function(id, callback){
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            grupo_id: id 
                        }
                    }
                };

                Request.realizarRequest(API.CHAT.OBTENER_GRUPO_POR_ID, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
                       callback(data.obj.grupo[0]);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }

                });
            };
            
          /**
            * @author Eduar Garcia
            * +Descripcion Realiza peticion para obtener el grupo por id
            * @params Event e, Usuario usuario
            * @fecha 2016-09-01
            */
            self.listarUsuariosPorGrupo = function(terminoBusqueda, callback){
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            grupo_id: $scope.root.grupo.getId(),
                            termino_busqueda:$scope.root.terminoBusqueda,
                            pagina:1
                        }
                    }
                };

                Request.realizarRequest(API.CHAT.LISTAR_USUARIOS, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
                      
        
                      callback(data.obj.usuarios);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }

                });
            };
            
           /*
            * @author Eduar Garcia
            * +Descripcion Guarda los usuarios del grupo
            * @params Usuario usuario
            * @fecha 2016-09-01
            */
            self.seleccionarUsuario = function(usuario){
                var usuarios =  $scope.root.usuariosSeleccionados;
                
                for(var i in usuarios){
                    if(usuarios[i].getId() === usuario.getId()){
                        $scope.root.usuariosSeleccionados.splice(i,1);
                        return;
                    }
                }
                
                usuarios.push(usuario);
                
            };
            
          /**
            * @author Eduar Garcia
            * +Descripcion Realiza peticion para insertar usuarios en el grupo
            * @params Arra<Usuario> usuarios
            * @fecha 2016-08-30
            */
            self.insertarUsuarios = function(usuarios){
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            grupo_id: $scope.root.grupo.getId(),
                            usuarios:usuarios
                        }
                    }
                };

                Request.realizarRequest(API.CHAT.INSERTAR_USUARIO_GRUPO, "POST", obj, function(data) {
                    
                    if (data.status !== 200) {
                       AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    } else {
                        $scope.root.usuariosSeleccionados = [];
                        self.listarUsuariosPorGrupo("", function(usuarios){
                            self.renderUsuariosGrupo(usuarios);
                        });
                    }

                });
            };
            
          /**
            * @author Eduar Garcia
            * +Descripcion Realiza peticion para crear o modificar un grupo
            * @fecha 2016-08-30
            */
            self.guardarGrupo = function(){
                var grupo =  $scope.root.grupo;
                
                if(grupo.getNombre().length === 0){
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El nombre del grupo es obligatorio");
                    return;
                }
                
                
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            grupo_id: grupo.getId(),
                            estado:grupo.getEstado(),
                            nombre:grupo.getNombre()
                        }
                    }
                };

                Request.realizarRequest(API.CHAT.GUARDAR_GRUPO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        
                       if(data.obj.grupo_id && data.obj.grupo_id.length > 0){
                           grupo.setId(data.obj.grupo_id[0]);
                           localStorageService.set("grupoId", grupo.getId());
                       } 
                       
                       AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Se ha guardado el grupo correctamente");
                       var usuarios =  $scope.root.usuariosSeleccionados;
                       
                       if(usuarios.length > 0){
                           self.insertarUsuarios(usuarios);
                       } 
                       
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }

                });
            };
            
          /**
            * @author Eduar Garcia
            * +Descripcion Realiza peticion para modificar estado de un usuario en el grupo
            * @fecha 2016-09-02
            */
            self.cambiarEstadoUsuarioGrupo = function(usuario){
                var grupo =  $scope.root.grupo;
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            grupo_id: grupo.getId(),
                            estado:!usuario.getEstado(),
                            usuario_id:usuario.getId()
                        }
                    }
                };

                Request.realizarRequest(API.CHAT.CAMBIAR_ESTADO_USUARIO_GRUPO, "POST", obj, function(data) {
             
                    if (data.status === 200) {
                                                
                        usuario.setEstado(
                            !usuario.getEstado()
                        );
                       
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }

                });
            };
            
           /*
            * @author Eduar Garcia
            * +Descripcion Handler del boton para realizar busqueda de usuarios del grupo
            * @fecha 2016-09-02
            */
            $scope.onBuscarUsuariosGrupo = function(event){
                
                if(event.which === 13){
                    self.listarUsuariosPorGrupo($scope.root.terminoBusqueda, function(usuarios){
                        self.renderUsuariosGrupo(usuarios);
                    });
                }
                
            };

           /*
            * @author Eduar Garcia
            * +Descripcion Handler del boton del grid de usuarios
            * @fecha 2016-09-02
            */
            $scope.onBtnCambiarEstadoUsuarioGrupo = function(usuario){
                
                var msj = "activar";
                
                if(!usuario.getEstado() === false){
                    msj = "inactivar";
                }
                
                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Seguro que desea "+msj+"  el usuario?", function(accion){
                    if(accion){
                        self.cambiarEstadoUsuarioGrupo(usuario);
                    }
                });
            };
            
           /*
            * @author Eduar Garcia
            * +Descripcion Handler del boton de cambiar estado
            * @fecha 2016-09-01
            */
            $scope.onBtnCambiarEstado = function(){
                var grupo =  $scope.root.grupo;
                grupo.setEstado(
                    (grupo.getEstado() === '0') ? '1' : '0'
                );
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de guardar grupo
            * @fecha 2016-09-01
            */
            $scope.onBtnGuardarGrupo = function(){               
               self.guardarGrupo();
            };
            
          /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de regresar a la vista anterior
            * @fecha 2016-09-02
            */
            $scope.onBtnCancelar = function(){
                $state.go("ChatDusoft");
            };
            
            self.init();
            
                     
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.root = {};
                $scope.$$watchers = null;
                
            });
            
           
        }]);
});
