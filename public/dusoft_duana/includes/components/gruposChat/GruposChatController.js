define(["angular",
    "js/controllers",
    'includes/Constants/Url', 'includes/classes/GrupoChat'], function(angular, controllers) {

    controllers.controller('GruposChatController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'CentroUtilidad', 'Bodega',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", 'URL',
        '$filter', '$timeout', '$modalInstance', 'GrupoChat',
        function($scope, $rootScope, Request,
                Empresa, CentroUtilidad, Bodega,
                API, socket, AlertService, $state, Usuario,
                localStorageService, URL, 
                $filter, $timeout, $modalInstance, GrupoChat) {

            var self = this;
            /*
             * @Author: Eduar
             * +Descripcion: Definicion del objeto que contiene los parametros del controlador
             */
            $scope.root = {
                session: {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                },
                grupos:[],
                terminoBusqueda:"",
                paginaactual:1,
                filtro:{
                    usuarios:false,
                    grupos:true
                },
                usuariosSeleccionados:[]
            };
            
            $scope.listaGrupos = {
                data: 'root.grupos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter:true,
                groups:['getNombre()'],
                aggregateTemplate: "<div ng-init='row.seleccionado = !row.collapsed' ng-click='row.toggleExpand(); onSeleccionarGrupo(row)' ng-style='rowStyle(row)' class='ngAggregate ng-scope' style='top: 0px; height: 48px; left: 0px;'>\
                    <span class='ngAggregateText ng-binding'>\
                        {{row.label CUSTOM_FILTERS}} ({{row.totalChildren()}} {{AggItemsLabel}})\
                    </span>\
                    <div ng-class=\"{ 'ngAggArrowCollapsed':row.collapsed, 'ngAggArrowExpanded':!row.collapsed}\"></div>\
                    <input-check ng-model='row.seleccionado'  type='checkbox' class='pull-right' style='margin:4px 40px 0px 0px;' ng-click='onSeleccionarGrupo(row)' />\
                </div>",
                columnDefs: [
                    {field: 'getUsuarios()[0].getNombre()', displayName: 'Nombre'},
                    {field: 'getUsuarios()[0].getNombreUsuario()', displayName: 'Usuario'},
                    {field: 'getNombre()', displayName:'Grupo'}
                ]

            };
            
            $scope.listaUsuariosSeleccionados = {
                data: 'root.usuariosSeleccionados',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter:true,
                columnDefs: [
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: "6%",
                        cellTemplate: ' <div class="row">\
                                                <button  class="btn btn-default btn-xs" ng-click="onRemoverUsuario(row.entity)"\  ">\
                                                    <span class="glyphicon glyphicon-trash"></span>\
                                                </button>\
                                            </div>'
                    },
                    {field: 'getNombre()', displayName: 'Nombre'},
                    {field: 'getNombreUsuario()', displayName: 'Usuario'}
                ]

            };
            
            $scope.onRemoverUsuario = function(usuario){
                self.removerUsuarios([usuario]);
                
                $scope.$broadcast("onActualizarUsuariosSeleccionados", $scope.root.usuariosSeleccionados);
            };
            
            $scope.onSeleccionarGrupo = function(row){
                row.seleccionado = !row.seleccionado;
                var usuarios = [];
                
                for(var i in row.children){
                    usuarios.push(row.children[i].entity.getUsuarios()[0]);
                }
                
                if(row.seleccionado){
                    self.agregarUsuarios(usuarios);
                } else {
                    self.removerUsuarios(usuarios);
                }
                
                $scope.$broadcast("onActualizarUsuariosSeleccionados", $scope.root.usuariosSeleccionados);
                
            };
            
            
            self.agregarUsuarios = function(_usuarios){
                var usuarios = $scope.root.usuariosSeleccionados;
                var _usuario = _usuarios[0];
                var agregar = true;
                
                if(!_usuario){
                    return;
                }
                
                for(var i in usuarios){
                    var usuario = usuarios[i];
                    if(usuario.getId() === _usuario.getId()){
                        agregar = false;
                        break;
                    }
                }
                
                //var timer = setTimeout(function(){
                    
                    if(agregar){
                        $scope.root.usuariosSeleccionados.push(_usuario);
                    }
                    
                    _usuarios.splice(0,1);
                    self.agregarUsuarios(_usuarios);
                //},0);

            };
            
            self.removerUsuarios = function(_usuarios){
                var usuarios = $scope.root.usuariosSeleccionados;
                var _usuario = _usuarios[0];
                var index = -1;
                
                if(!_usuario){
                    return;
                }
                
                for(var i in usuarios){
                    var usuario = usuarios[i];
                    if(usuario.getId() === _usuario.getId()){
                        index = i;
                        break;
                    }
                }
                
                //var timer = setTimeout(function(){
                    
                    if(index !== -1){
                        $scope.root.usuariosSeleccionados.splice(index,1);
                    }
                    
                    _usuarios.splice(0,1);
                    
                    self.removerUsuarios(_usuarios);
                //},0);
            };

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Permite traer grupos del API
             */
            self.consultarGrupos = function(callback) {

                $scope.root.grupos = [];

                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat:{
                            termino_busqueda:$scope.root.terminoBusqueda,
                            pagina:$scope.root.paginaactual,
                            filtro:{
                                busquedaGrupo:true
                            }
                        }
                    }
                };
                Request.realizarRequest(URL.CONSTANTS.API.CHAT.CONSULTAR_GRUPOS, "POST", obj, function(data) {
                    
                    if(data.status === 200){
                        $scope.root.grupos = [];
                        var usuarios = data.obj.usuarios || [];

                        //se hace el set correspondiente para el plugin de jstree
                        for (var i in usuarios) {
                            var grupo = GrupoChat.get(usuarios[i].grupo_id, usuarios[i].nombre_grupo);
                            
                            var usuario = Usuario.get(usuarios[i].usuario_id, usuarios[i].usuario, usuarios[i].nombre);
                            grupo.agregarUsuario(usuario);
                            $scope.root.grupos.push(grupo);
                        }
                        
                        callback(true);
                        
                    } else {
                        callback(false);
                    }
                });

            };
            
            
            self.iniciarConversacion = function(){
                
                if($scope.root.usuariosSeleccionados.length === 0){
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "No se han seleccionado usuarios para la conversación");
                    return;
                }
                
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat:{
                            usuario_id:Usuario.getUsuarioActual().getId(),
                            usuarios:$scope.root.usuariosSeleccionados
                        }
                    }
                };
                Request.realizarRequest(URL.CONSTANTS.API.CHAT.GUARDAR_CONVERSACION, "POST", obj, function(data) {
                    console.log("data ", data );
                    if(data.status === 200){
                       
                        
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error iniciando la conversación");
                    }
                });
            };
            
            
            $scope.onIniciarConversacion = function(){
                self.iniciarConversacion();
            };
            
            
            
          /**
            * @author Eduar Garcia
            * +Descripcion Evento de la directiva de usuarios al seleccionarse uno
            * @params Event e, Usuario usuario
            * @fecha 2016-09-06
            */
            $scope.$on("onBtnSeleccionarUsuario", function(e, usuario){

                self.agregarUsuarios([usuario]);
                
            });
            
          /**
            * @author Eduar Garcia
            * +Descripcion Evento de la directiva de usuarios al presionar el boton de remover
            * @params Event e, Usuario usuario
            * @fecha 2016-09-06
            */
            $scope.$on("onBtnRemoverUsuario", function(e, usuario){
                self.removerUsuarios([usuario]);
            });
            
            $scope.onBuscarUsuario = function(event){
                
                if(event.which === 13){
                    self.consultarGrupos(function(){
                        
                    });
                }
                
            };
            
            $scope.paginaAnterior = function() {
                if($scope.root.paginaactual > 1){
                    
                    $scope.root.paginaactual--;
                }
                
                self.consultarGrupos(function(){
                        
                });
            };

            $scope.paginaSiguiente = function() {
                $scope.root.paginaactual++;
                self.consultarGrupos(function(){
                        
                });
            };
            
            $scope.onCambiarFiltro = function(seleccion){
                
                if(seleccion === 0){
                    $scope.root.filtro ={
                        usuarios:true,
                        grupos:false
                    };
                } else {
                    $scope.root.filtro = {
                        usuarios:false,
                        grupos:true
                    };
                    
                    self.consultarGrupos(function(valido){
                        if(valido){

                        } else {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error consultando los grupos");
                        }
                    });
                    
                    
                }
                
            };
            
            
            /*
             * @Author: Eduar
             * +Descripcion: Listeners de la ventana al abrir y cerrar
             */
            $modalInstance.opened.then(function() {
                //Timer para permitir que la animacion termine
                $timeout(function(){
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>> traer grupos");
                    self.consultarGrupos(function(valido){
                        if(valido){

                        } else {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error consultando los grupos");
                        }
                    });
                }, 500);

            });
            

            $modalInstance.result.then(function() {
              // self.finalizar();
            }, function() {
                //self.finalizar();
            });


        }]);

});
