
define(["angular", "js/controllers", "js/models",
    "controllers/AdministracionModulos/Modulos/OpcionesModulosController",
    "includes/classes/Rol", "models/Perfiles/RolModulo"
], function(angular, controllers) {

    controllers.controller('ListarRolesController', [
        '$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "AlertService", "Usuario",
        "Rol", "EmpresaParametrizacion","localStorageService","$state","ParametrizacionService",
        function($scope, $rootScope, Request,
                $modal, API, socket, $timeout,
                AlertService, Usuario,
                Rol, EmpresaParametrizacion,localStorageService, $state, ParametrizacionService) {

            var self = this;


            $scope.rootRoles = {
            };

            $scope.rootRoles.termino_busqueda = "";

            $scope.rootRoles.empresas = [];

            $scope.rootRoles.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.rootRoles.paginaactual = 1;

            self.traerEmpresas = function() {
                var obj = {
                    session: $scope.rootRoles.session,
                    data: {
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.rootRoles.empresas = [];
                        var datos = data.obj.empresas;

                        for (var i in datos) {

                            var empresa = EmpresaParametrizacion.get(
                                    datos[i].razon_social,
                                    datos[i].empresa_id
                                    );
                            
                            if(empresa.getCodigo() === '03'){
                                $scope.rootRoles.empresaSeleccionada = empresa;
                            }
                            
                            $scope.rootRoles.empresas.push(empresa);

                        }
                        
                        self.traerRoles();

                    }

                });
            };

            self.traerRoles = function() {
                
                                
                var parametros = {
                    session: $scope.rootRoles.session,
                    data: {
                        parametrizacion_perfiles: {
                            empresa_id: $scope.rootRoles.empresaSeleccionada.getCodigo(),
                            termino: $scope.rootRoles.termino_busqueda,
                            pagina_actual:$scope.rootRoles.paginaactual
                        }
                    }
                };
                
                ParametrizacionService.traerRoles(parametros, $scope.rootRoles.empresaSeleccionada, function(success, msg){
                    if(!success){
                        AlertService.mostrarMensaje("warning", msg);
                    }
                });
                
            };


            $scope.listado_roles = {
                data: 'rootRoles.empresaSeleccionada.getRoles()',
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

            $scope.paginaAnterior = function() {
                $scope.rootRoles.paginaactual--;
                self.traerRoles();
            };

            $scope.paginaSiguiente = function() {
                $scope.rootRoles.paginaactual++;
                self.traerRoles();
            };

            $scope.onEditarRol = function(rol) {
                localStorageService.set("rol_id", rol.getId());
                $state.go("AdministracionRoles");
            };
            
            $scope.onNuevoRol = function(){
                localStorageService.set("rol_id", null);
                $state.go("AdministracionRoles");
            };

            $scope.onBuscarRol = function($event) {
                if ($event.which === 13) {
                    $scope.rootRoles.paginaactual = 1;
                    self.traerRoles();
                }
            };


            $scope.onEmpresaSeleccionada = function() {
                $scope.rootRoles.paginaactual = 1;
                self.traerRoles();
            };

            self.traerEmpresas();
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.rootRoles = {};
                $scope.$$watchers = null;
            });



        }]);
});