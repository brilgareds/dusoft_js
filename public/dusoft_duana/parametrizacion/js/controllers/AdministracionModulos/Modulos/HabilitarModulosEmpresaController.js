
define(["angular", "js/controllers", "js/models", "models/Perfiles/Rol"], function(angular, controllers) {

    controllers.controller('HabilitarModulosEmpresaController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "$timeout", "AlertService", "Usuario", 
        "$modalInstance", "Empresa_Modulo", "moduloSeleccionado",
        "EmpresaParametrizacion", "Modulo", "Rol",
        function($scope, $rootScope, Request,
                API, socket,
                $timeout, AlertService, Usuario,
                $modalInstance, Empresa_Modulo, moduloSeleccionado, 
                EmpresaParametrizacion, Modulo, Rol) {

            var self = this;
            $scope.empresas = [];

            $scope.root = {};

            $scope.root.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            
            moduloSeleccionado.vaciarListaEmpresas();
            console.log("moduloSeleccionado ", moduloSeleccionado);
            

            $scope.moduloSeleccionado = moduloSeleccionado;
            $scope.root.empresaSeleccionada;

            self.traerEmpresas = function() {
                var obj = {
                    session: $scope.root.session,
                    data: {
                        empresas: {
                            modulo_id: moduloSeleccionado.getId()
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

                            self.agregarEmpresa(empresa, datos[i].modulos_empresas_id);
                        }

                    }

                });
            };

            self.agregarEmpresa = function(empresa, modulos_empresas_id) {
               //se debe recorrer los modulos padre o hijo automaticamente seleccionados por el plugin
               empresa = angular.copy(empresa);
                for (var i in moduloSeleccionado.getModulosHijo()) {

                    self.__agregarEmpresa(empresa, moduloSeleccionado.getModulosHijo()[i],0);
                }
                
                for (var i in moduloSeleccionado.getModulosPadre()) {
                     
                    if(empresa.getEstado()){
                        console.log("cambiar modulo padre ",empresa.getEstado(), moduloSeleccionado.getModulosPadre()[i]);
                        self.__agregarEmpresa(empresa, moduloSeleccionado.getModulosPadre()[i],0);
                    }
                    
                }
                
                //se crea una instancia empresa_modulo para el modulo seleccionado
                self.__agregarEmpresa(empresa, moduloSeleccionado.getId(), modulos_empresas_id);
                
            };

            self.__agregarEmpresa = function(empresa, modulo_id, modulos_empresas_id) {
               // console.log("empresa seleccionada ", empresa)
                 //se crea una instancia de la clase que asocia la relacion N:N entre modulos y empresas
                //se crea una instancia nueva de modulo diferente al seleccionado porque solo interesa tener el id
                
                var empresa_modulo = Empresa_Modulo.get(
                        empresa,
                        Modulo.get(modulo_id),
                        empresa.getEstado(),
                        modulos_empresas_id
                 );
                //valida si la empresa fue seleccionada con el checkbox

                 moduloSeleccionado.agregarEmpresa(empresa_modulo);

            };

            $scope.listado_empresas = {
                data: 'empresas',
                afterSelectionChange:function(rowItem){
                    if(rowItem.selected && rowItem.entity.estado){
                        self.traerRoles(rowItem.entity);
                    } else {
                        rowItem.selected = false;
                    }
                },
                enableColumnResize: true,
                enableRowSelection: true,
                keepLastSelected:false,
                multiSelect:false,
                columnDefs: [
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <input-check  ng-model="row.entity.estado" ng-change="onSeleccionarEmpresa(row.entity)"  />'},
                    {field: 'codigo', displayName: 'Codigo'},
                    {field: 'nombre', displayName: 'Nombre'}
                ]

            };
            
            
            
            
           self.traerRoles = function(empresa) {

                $scope.root.empresaSeleccionada = empresa;
                $scope.root.empresaSeleccionada.vaciarRoles();

                var obj = {
                    session: $scope.root.session,
                    data: {
                        parametrizacion_perfiles: {
                            empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
                            termino: "",
                            pagina_actual:0
                        }
                    }
                };

                Request.realizarRequest(API.PERFILES.LISTAR_ROLES, "POST", obj, function(data) {
                    if (data.status === 200) {

                        var roles = data.obj.parametrizacion_perfiles.roles;
                        
                        if(roles.length === 0){
                            AlertService.mostrarMensaje("warning", "No se encontraron registros");
                            return;
                        }

                        for (var i in roles) {

                            var rol = Rol.get(
                                    roles[i].id,
                                    roles[i].nombre,
                                    roles[i].observacion,
                                    $scope.root.empresaSeleccionada.getCodigo()
                                    );

                            $scope.root.empresaSeleccionada.agregarRol(rol);

                        }

                    } else {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error...");
                    }

                });

            };
            
            
            
            
            
           /* self.agregarModulo = function(modulo_id, estado) {

                var modulo_empresa = self.obtenerModuloSeleccionado(modulo_id);   
                if (!modulo_empresa)
                    return false;

                var modulo = Modulo.get(modulo_empresa.getModulo().getId());
                modulo.agregarEmpresa(modulo_empresa);
                modulo.setRoles(modulo_empresa.getModulo().getRoles());

                var rol_modulo = RolModulo.get(
                        0,
                        Rol.get(
                            $scope.rootRoles.rolAGuardar.getId(),
                            $scope.rootRoles.rolAGuardar.getNombre(),
                            $scope.rootRoles.rolAGuardar.getObservacion(),
                            $scope.rootRoles.rolAGuardar.getEmpresaId()
                        ),
                        modulo,
                        estado
                );

                $scope.rootRoles.rolAGuardar.agregarModulo(rol_modulo);
               

                return modulo;
            };
            */
            
            

            $scope.onSeleccionarEmpresa = function(empresa) { 
                moduloSeleccionado.vaciarListaEmpresas();
                self.agregarEmpresa(empresa);
                                
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
                    AlertService.mostrarMensaje("success", data.msj);
                });

            };


            $scope.onHabilitarModuloEnEmpresas = function() {
                return;
                console.log("modulso seleccionados ",$scope.moduloSeleccionado.getListaEmpresas());
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
                    AlertService.mostrarMensaje("success", data.msj);
                });

            };

            $scope.listado_roles = {
                data: 'root.empresaSeleccionada.getRoles()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <input-check  ng-model="row.entity.estado" ng-change="onSeleccionarEmpresa(row.entity)"  />'},
                    {field: 'nombre', displayName: 'Nombre Rol'}
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