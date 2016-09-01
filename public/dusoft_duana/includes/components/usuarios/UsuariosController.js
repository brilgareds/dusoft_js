define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('UsuariosController', [
        '$scope', '$rootScope', 'Request',
        'URL', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal',
        "$timeout",
        function($scope, $rootScope, Request, 
                 URL, socket, AlertService,
                 $state, Usuario, localStorageService, $modal,
                 $timeout) {
                     
            
            var self = this;
            $scope.rootUsuarios = {
                usuarios:[],
                termino_busqueda:"",
                paginaactual:1
                //usuariosSeleccionados:[]
            };

            $scope.rootUsuarios.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            var columnas =  [
                {field: 'nombre', displayName: 'Nombre'},
                {field: 'usuario', displayName: 'Usuario'}
            ];
            
            
            if($scope.btnSeleccionar){
                var item = {
                        field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                      <input-check ng-model="row.entity.seleccionado" ng-click="onBtnSeleccionar(row.entity)"></input-check>\
                                   </div>'
                };
                
                columnas.splice(0, 0, item);
            }
            
            if($scope.btnDetalle){
                var item = {
                        field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                      <button class="btn btn-default btn-xs"  ng-click="onBtnDetalle(row.entity)"><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                   </div>'
                };
                
                columnas.push(item);
            }
            
            $scope.listaUsuarios = {
                data: 'rootUsuarios.usuarios',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs:columnas
            };
            
            self.traerUsuarios = function() {
                //$scope.rootUsuarios.empresaSeleccionada.vaciarRoles();
                 $scope.rootUsuarios.usuarios = [];
                var obj = {
                    session: $scope.rootUsuarios.session,
                    data: {
                        lista_usuarios: {
                            estado_registro: '1',
                            termino_busqueda: $scope.rootUsuarios.termino_busqueda,
                            pagina_actual:$scope.rootUsuarios.paginaactual
                        }
                    }
                };
                
                Request.realizarRequest(URL.CONSTANTS.API.USUARIOS.LISTAR_USUARIOS, "POST", obj, function(data) {
                    if (data.status === 200) {

                        var usuarios = data.obj.lista_usuarios;
                        
                        if(usuarios.length === 0){
                            AlertService.mostrarMensaje("warning", "No se encontraron registros");
                            return;
                        }

                        for (var i in usuarios) {

                            var usuario = Usuario.get(
                                    usuarios[i].usuario_id,
                                    usuarios[i].usuario,
                                    usuarios[i].nombre
                            );

                            $scope.rootUsuarios.usuarios.push(usuario);

                        }

                    } else {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error...");
                    }

                });

            };
            
            $scope.onBtnSeleccionar = function(usuario){
                
                $scope.$emit("onBtnSeleccionarUsuario",usuario);
                
            };
            
            $scope.onBtnDetalle = function(usuario){
                $scope.$emit("onBtnDetalleUsuario", usuario);
            };
            
            $scope.onBuscarUsuario = function($event) {
                if ($event.which === 13) {
                    $scope.rootUsuarios.paginaactual = 1;
                    self.traerUsuarios();
                }
            };
            
            $scope.paginaAnterior = function() {
                if($scope.rootUsuarios.paginaactual > 1){
                    
                    $scope.rootUsuarios.paginaactual--;
                }
                
                self.traerUsuarios();
            };

            $scope.paginaSiguiente = function() {
                $scope.rootUsuarios.paginaactual++;
                self.traerUsuarios();
            };
             
            
            self.traerUsuarios();
            

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
                $scope.rootUsuarios = {};

            });
   
        }]);
});
