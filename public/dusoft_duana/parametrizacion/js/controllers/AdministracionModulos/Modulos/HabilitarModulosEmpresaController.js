
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('HabilitarModulosEmpresaController', ['$scope', '$rootScope', 'Request', 'API',
        "socket", "$timeout", "AlertService", "Usuario", "$modalInstance", "Empresa_Modulo", "moduloSeleccionado", "EmpresaParametrizacion", "Modulo",
        function($scope, $rootScope, Request,
                API, socket,
                $timeout, AlertService, Usuario,
                $modalInstance, Empresa_Modulo, moduloSeleccionado, EmpresaParametrizacion, Modulo) {

            var self = this;
            $scope.empresas = [];

            $scope.root = {};

            $scope.root.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            $scope.moduloSeleccionado = moduloSeleccionado;

            self.traerEmpresas = function() {
                var obj = {
                    session: $scope.root.session,
                    data: {
                        empresas:{
                            modulo_id:moduloSeleccionado.getId()
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_EMPRESAS_MODULOS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.empresas = [];
                        var datos = data.obj.empresas;

                        for (var i in datos) {

                            var empresa = EmpresaParametrizacion.get(
                                    datos[i].razon_social,
                                    datos[i].empresa_id,
                                    datos[i].estado
                                    );

                            $scope.empresas.push(empresa);
                            
                            self.agregarEmpresa(empresa);
                        }

                    }

                });
            };
            
            self.agregarEmpresa = function(empresa){
                
                //se crea una instancia de la clase que asocia la relacion N:N entre modulos y empresas
                //se crea una instancia nueva de modulo diferente al seleccionado porque solo interesa tener el id
                var empresa_modulo = Empresa_Modulo.get(
                        empresa,
                        Modulo.get(moduloSeleccionado.getId())
                        );

                //valida si la empresa fue seleccionada con el checkbox
                if (empresa.getEstado()) {
                    moduloSeleccionado.agregarEmpresa(empresa_modulo);
                } else {
                    moduloSeleccionado.removerEmpresa(empresa_modulo);
                }
            };

            $scope.listado_empresas = {
                data: 'empresas',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <input-check  ng-model="row.entity.estado" ng-change="onSeleccionarEmpresa(row.entity)"  />'},
                    {field: 'codigo', displayName: 'Codigo'},
                    {field: 'nombre', displayName: 'Nombre'}
                ]

            };

            $scope.onSeleccionarEmpresa = function(empresa) {

                self.agregarEmpresa(empresa);

            };
            

            $scope.onHabilitarModuloEnEmpresas = function() {
                console.log($scope.moduloSeleccionado.getListaEmpresas());

                var obj = {
                    session: $scope.root.session,
                    data: {
                        parametrizacion_modulos: {
                            empresas_modulos: $scope.moduloSeleccionado.getListaEmpresas(),
                            modulo_id: moduloSeleccionado.getId()
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.HABILITAR_MODULO_EMPRESAS, "POST", obj, function(data) {
                      $scope.close();
                      AlertService.mostrarMensaje("success", data.msj);
                });

            };

            $scope.listado_roles = {
                data: '[]',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_rol', displayName: 'Nombre Rol'}
                ]

            };


            $scope.close = function() {
                $scope.empresas = [];
                $modalInstance.close();
            };

            $modalInstance.opened.then(function() {
                self.traerEmpresas();

            });


        }]);
});