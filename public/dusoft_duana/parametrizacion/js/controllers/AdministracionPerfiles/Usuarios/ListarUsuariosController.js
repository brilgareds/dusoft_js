
define(["angular", "js/controllers", "js/models",
        "includes/classes/Usuario"
], function(angular, controllers) {

    controllers.controller('ListarUsuariosController', [
        '$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "AlertService", "Usuario",
        "Rol", "Usuario","localStorageService","$state",
        function($scope, $rootScope, Request,
                $modal, API, socket, $timeout,
                AlertService, Usuario,
                Rol, Usuario,localStorageService, $state) {

            var self = this;
            var moduloActual = Usuario.getUsuarioActual().getModuloActual(); 
            
            $scope.opciones = (moduloActual)? moduloActual.opciones : {};
            $scope.variables = (moduloActual)? moduloActual.variables : {}; 
            $scope.foo = "Duana";
            
            console.log($scope.opciones.sw_crear_usuario && !$scope.foo === 'Duanas');
            

            
            
            $scope.opcionesModulo = {
                btnCrear : {
                    'click':$scope.opciones.sw_crear_usuario
                },
                buscador:{
                    //'keypress':$scope.opciones.sw_crear_usuario
                },
                btnEditarUsuario:{
                    //'click':false
                }
                                    
            };
            
            
            

            $scope.rootUsuarios = {
            };

            $scope.rootUsuarios.termino_busqueda = "";

            $scope.rootUsuarios.usuarios = [];

            $scope.rootUsuarios.session = {
                 usuario_id: Usuario.getUsuarioActual().getId(),
                 auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.rootUsuarios.paginaactual = 1;


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

                Request.realizarRequest(API.USUARIOS.LISTAR_USUARIOS, "POST", obj, function(data) {
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


            $scope.listado_usuarios = {
                data: 'rootUsuarios.usuarios',
                enableColumnResize: true,
                enableRowSelection: false,
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

            $scope.onEditarUsuario = function(rol) {
                localStorageService.set("usuario_id", rol.getId());
                $state.go("AdministracionUsuarios");
            };
            
            $scope.onNuevoUsuario = function(){
                localStorageService.set("usuario_id", null);
                $state.go("AdministracionUsuarios");
            };

            $scope.onBuscarUsuario = function($event) {
                if ($event.which === 13) {
                    $scope.rootUsuarios.paginaactual = 1;
                    self.traerUsuarios();
                }
            };

            self.traerUsuarios();
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.rootUsuarios = {};
                $scope.$$watchers = null;
            });



        }]);
});