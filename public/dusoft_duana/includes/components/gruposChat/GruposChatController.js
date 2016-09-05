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
                }
            };
            
            $scope.listaGrupos = {
                data: 'root.grupos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter:true,
                groups:['getNombre()'],
                columnDefs: [
                    {
                        field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                        <button class="btn btn-default btn-xs"  ng-click="onBtnCambiarEstadoUsuarioGrupo(row.entity)">\
                                            <span  class="glyphicon glyphicon-check"></span>\
                                        </button>\
                                   </div>'
                    },
                    {field: 'getUsuarios()[0].getNombre()', displayName: 'Nombre'},
                    {field: 'getUsuarios()[0].getNombreUsuario()', displayName: 'Usuario'},
                    {field: 'getNombre()', displayName:'Grupo', visible:false}
                ]

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
                            pagina:$scope.root.paginaactual
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
               self.finalizar();
            }, function() {
                self.finalizar();
            });


        }]);

});
