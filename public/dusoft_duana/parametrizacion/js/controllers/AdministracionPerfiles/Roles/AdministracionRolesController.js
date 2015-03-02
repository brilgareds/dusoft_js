
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('AdministracionRolesController', ['$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "AlertService", "Usuario","EmpresaParametrizacion",
        function($scope, $rootScope, Request,
                 $modal, API, socket, $timeout,
                 AlertService, Usuario, EmpresaParametrizacion) {

            var self = this;


            $scope.rootRoles = {
            };
            
            $scope.rootRoles.empresas =[];
            
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

            //se carga los modulos despues que el arbol esta listo
            $scope.$on("arbolListoEnDom", function() {

            });


            self.traerEmpresas();


        }]);
});