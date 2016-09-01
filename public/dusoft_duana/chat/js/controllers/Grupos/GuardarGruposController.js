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
                usuariosSeleccionados:[]
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
                columnDefs: [
                    {field: 'nombre', displayName: 'Nombre'},
                    {field: 'usuario', displayName: 'Usuario'},
                    {field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                      <button class="btn btn-default btn-xs" ng-validate-events="{{opcionesModulo.btnEditarUsuario}}" ng-click="onEditarUsuario(row.entity)"><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                   </div>'
                    }
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
                    console.log("grupos guardados ", data);
                    if (data.status === 200) {
                        
                       if(data.obj.grupo_id && data.obj.grupo_id.length > 0){
                           grupo.setId(data.obj.grupo_id[0]);
                       } 
                       
                       var usuarios =  $scope.root.usuariosSeleccionados;
                       
                       if(usuarios.length > 0){
                           self.insertarUsuarios(usuarios);
                       }
                       
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }

                });
            };
            
            
            $scope.onBtnCambiarEstado = function(){
                var grupo =  $scope.root.grupo;
                grupo.setEstado(
                    (grupo.getEstado() === '0') ? '1' : '0'
                );
            };
            
            $scope.onBtnGuardarGrupo = function(){
               console.log("on btn guadar grupo ", $scope.root.usuariosSeleccionados);
               
               self.guardarGrupo();
            };
                     
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.root = {};
                $scope.$$watchers = null;
                
            });
            
           
        }]);
});
