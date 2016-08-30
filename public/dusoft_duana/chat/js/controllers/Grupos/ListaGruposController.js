//Controlador de la View creapedidosfarmacias.html

define(["angular", "js/controllers", "includes/classes/GrupoChat"], function(angular, controllers) {

    controllers.controller('ListaGruposController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal',
        "$timeout","GrupoChat",
        function($scope, $rootScope, Request, 
                 API, socket, AlertService,
                 $state, Usuario, localStorageService, $modal,
                 $timeout, GrupoChat) {
                     
            
            var self = this;
            $scope.root = {
                grupos:[]
            };

            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
                        
            $scope.root.listaGrupos = {
                data: 'root.grupos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting:true,
                multiSelect: false,
                showFilter:true,
                filterOptions:$scope.root.filtroGrid,
                columnDefs: [
                    {field: 'getNombre()', displayName: 'Nombre'},
                    {field: 'getFechaCreacion()', displayName: 'FechaCreacion'},
                    {field: 'getNumeroIntegrantes()', displayName: 'Numero de integrantes'},
                    {field: 'getDescripcionEstado()', displayName: 'Estado'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "5%",
                     cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li ng-click="onGuardarGrupo()"><a href="javascript:void(0);" >Ver</a></li>\
                                            <li>\
                                                <a href="javascript:void(0);" ng-click="onCambiarEstado(row.entity)">\
                                                    <span ng-if="row.entity.getEstado() == \'0\'">Activar</span>\
                                                    <span ng-if="row.entity.getEstado() == \'1\'">Inactivar</span>\
                                                </a>\
                                            </li>\
                                        </ul>\n\
                                    </div>'
                        }
                ]
            };
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Hace peticion para obtener grupos
             */
            self.onTraerGrupos = function(callback){
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            termino_busqueda: '',
                            pagina:1
                        }
                    }
                };

                Request.realizarRequest(API.CHAT.LISTAR_GRUPOS, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
                        var grupos = data.obj.grupos || [];

                        //se hace el set correspondiente para el plugin de jstree
                        for (var i in grupos) {
                            var grupo = GrupoChat.get(grupos[i].id, grupos[i].nombre, grupos[i].fecha_creacion, grupos[i].numero_integrantes);
                            grupo.setEstado(grupos[i].estado).setDescripcionEstado(grupos[i].descripcion_estado);
                            $scope.root.grupos.push(grupo);
                        }
                        
                        callback();
                    }

                });
            };
            
            self.cambiarEstado = function(grupo){
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            grupo_id: grupo.getId(),
                            estado: (grupo.getEstado() === '1') ? '0' : '1' 
                        }
                    }
                };

                Request.realizarRequest(API.CHAT.CAMBIAR_ESTADO, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
                       self.onTraerGrupos(function(){
                           
                       });
                    }

                });
            };
            
            $scope.onCambiarEstado = function(grupo){
                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Seguro que desea cambiar el estado del grupo?", function(accion){
                    if(accion){
                        self.cambiarEstado(grupo);
                    }
                });
            };
            
            $scope.onGuardarGrupo = function(){
                $state.go("GuardarGrupo");
            };
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
                $scope.root = {};

            });
            
            
            self.onTraerGrupos(function(){
                
            });

            
            
        }]);
});
