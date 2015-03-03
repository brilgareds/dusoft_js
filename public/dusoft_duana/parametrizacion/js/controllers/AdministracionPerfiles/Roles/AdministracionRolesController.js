
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('AdministracionRolesController', ['$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "AlertService", "Usuario", "EmpresaParametrizacion", "Empresa_Modulo", "Modulo",
        function($scope, $rootScope, Request,
                $modal, API, socket, $timeout,
                AlertService, Usuario, EmpresaParametrizacion,
                Empresa_Modulo, Modulo) {

            var self = this;


            $scope.rootRoles = {
            };

            $scope.rootRoles.empresas = [];

            $scope.rootRoles.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };


            self.traerEmpresas = function() {
                var obj = {
                    session: $scope.rootRoles.session,
                    data: {
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        console.log("empresas ", data);
                        $scope.rootRoles.empresas = [];
                        var datos = data.obj.empresas;

                        for (var i in datos) {

                            var empresa = EmpresaParametrizacion.get(
                                    datos[i].razon_social,
                                    datos[i].empresa_id
                                    );

                            $scope.rootRoles.empresas.push(empresa);

                        }

                    }

                });
            };


            $scope.listado_opciones = {
                data: 'rootRoles.moduloAGuardar.opciones',
                enableColumnResize: true,
                enableRowSelection: false,
                showFilter: true,
                columnDefs: [
                    {field: 'nombre', displayName: 'Nombre'},
                    {field: 'alias', displayName: 'Alias'},
                    {field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                      <button class="btn btn-default btn-xs" ng-click="onEditarOpcion(row.entity)"><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                      <button class="btn btn-default btn-xs" ng-click="onBorrarOpcion(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                   </div>'
                    }
                ]

            };


            $scope.onEmpresaSeleccionada = function() {
                console.log($scope.rootRoles.empresaSeleccionada);
                var obj = {
                    session: $scope.rootRoles.session,
                    data: {
                        parametrizacion_roles: {
                            empresa_id: $scope.rootRoles.empresaSeleccionada.getCodigo()
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_MODULOS_POR_EMPRESA, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_roles.modulos_empresas;
                        var modulos = [];
                       /* for (var i in datos) {


                            var modulo = Modulo.get(
                                    datos[i].id,
                                    datos[i].parent,
                                    datos[i].nombre,
                                    datos[i].url
                                    );

                            modulo.setIcon(datos[i].icon);

                            $scope.rootModulos.modulos.push(modulo);
                        }

                        // console.log(modulos);
                        $scope.$broadcast("datosArbolCambiados", $scope.rootModulos.modulos);*/
                        
                        
                        
                        
                        //se crea una instancia de la relacion de modulos y empresas
                        for (var i in datos) {
                            var modulo = Modulo.get(
                                     datos[i].modulo_id,
                                     null,
                                     datos[i].nombre,
                                     datos[i].state
                            );
                            
                            modulo.setIcon(datos[i].icon);
                            
                            var empresa_modulo = Empresa_Modulo.get(
                                 EmpresaParametrizacion.get(
                                     $scope.rootRoles.empresaSeleccionada.getNombre(),
                                     $scope.rootRoles.empresaSeleccionada.getCodigo()
                                 ),
                                 modulo
                             );

                            modulos.push(modulo);   

                        }
                        
                        $scope.$broadcast("datosArbolCambiados", modulos);
                    }

                });

            };

            //se carga los modulos despues que el arbol esta listo
            $scope.$on("arbolListoEnDom", function() {

            });


            self.traerEmpresas();


        }]);
});