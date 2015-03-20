
define(["angular", "js/controllers", "js/models", "models/Perfiles/Rol", "models/Perfiles/RolModulo"], function(angular, controllers) {

    controllers.controller('HabilitarModulosEmpresaController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "$timeout", "AlertService", "Usuario", 
        "$modalInstance", "Empresa_Modulo", "moduloSeleccionado",
        "EmpresaParametrizacion", "Modulo", "Rol","RolModulo",
        function($scope, $rootScope, Request,
                API, socket,
                $timeout, AlertService, Usuario,
                $modalInstance, Empresa_Modulo, moduloSeleccionado, 
                EmpresaParametrizacion, Modulo, Rol, RolModulo) {

            var self = this;
            $scope.empresas = [];

            $scope.root = {};

            $scope.root.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            
            moduloSeleccionado.vaciarListaEmpresas();
            

            $scope.moduloSeleccionado = moduloSeleccionado;
            $scope.root.empresaSeleccionada;

            self.traerEmpresas = function() {
                
                
                var ids = [moduloSeleccionado.getId()];
                
                ids = ids.concat(moduloSeleccionado.getModulosHijo());
                ids = ids.concat(moduloSeleccionado.getModulosPadre());
                
                var obj = {
                    session: $scope.root.session,
                    data: {
                        empresas: {
                            modulos_id: ids
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
                            
                            if(datos[i].modulo_id === moduloSeleccionado.getId() || datos[i].modulo_id === null  ){
                                $scope.empresas.push(empresa);
                            }
                            

                            self.__agregarEmpresa(empresa, datos[i].modulo_id , datos[i].modulos_empresas_id);
                        }

                    }

                });
            };

            self.agregarEmpresa = function(empresa, modulos_empresas_id) {
               //se debe recorrer los modulos padre o hijo automaticamente seleccionados por el plugin
               empresa = angular.copy(empresa);
                for (var i in moduloSeleccionado.getModulosHijo()) {

                    self.__agregarEmpresa(empresa, moduloSeleccionado.getModulosHijo()[i],modulos_empresas_id);
                }
                
                for (var i in moduloSeleccionado.getModulosPadre()) {
                     
                    if(empresa.getEstado()){
                       // console.log("cambiar modulo padre ",empresa.getEstado(), moduloSeleccionado.getModulosPadre()[i]);
                        self.__agregarEmpresa(empresa, moduloSeleccionado.getModulosPadre()[i],modulos_empresas_id);
                    }
                    
                }
                
                //se crea una instancia empresa_modulo para el modulo seleccionado
               // console.log("empresa ",empresa, "modulo empresa id ", modulos_empresas_id);
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
            
            //crea la instancia rol_modulo para habilitar el modulo en el rol
            self.crearRolModulo = function(modulo, rol, empresa){
                var empresas = $scope.moduloSeleccionado.getListaEmpresas();
                
                for(var i in empresas){
                   
                    if(empresas[i].getEmpresa().getCodigo() === empresa.getCodigo() && empresas[i].getModulo().getId() === modulo.getId()){
                        console.log("econtrando >>>>>>>>>>>>>>> ", empresas[i])
                        modulo.agregarEmpresa(empresas[i]);
                        break;
                    }
                }
                
                var rol_modulo = RolModulo.get(
                        0,
                        rol,
                        modulo,
                        rol.estado
                );
                    
               return rol_modulo;

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
            
           $scope.listado_roles = {
                data: 'root.empresaSeleccionada.getRoles()',
                enableColumnResize: true,
                enableRowSelection: false,
                showFilter:true,
                columnDefs: [
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <input-check  ng-model="row.entity.estado" ng-change="onSeleccionarRol(row.entity)"  />'},
                    {field: 'nombre', displayName: 'Nombre Rol'}
                ]

            };
            
            
            
            $scope.onSeleccionarRol = function(rol){
               // console.log("rol seleccionado ", moduloSeleccionado);
                /*console.log("modulo seleccionado ",$scope.moduloSeleccionado.getListaEmpresas());
                console.log("empresa seleccionada ",$scope.root.empresaSeleccionada);*/
                
                moduloSeleccionado.vaciarRoles();
                var modulo = Modulo.get(moduloSeleccionado.getId());
                var empresa = angular.copy($scope.root.empresaSeleccionada);
                rol = angular.copy(rol);
                
                moduloSeleccionado.agregarRol( 
                    self.crearRolModulo(modulo, rol, empresa)
                );
                
                for (var i in moduloSeleccionado.getModulosHijo()) {
                    modulo = Modulo.get(moduloSeleccionado.getModulosHijo()[i]);
                    moduloSeleccionado.agregarRol(
                         self.crearRolModulo(modulo, rol, empresa)
                    );
                }
                
                if(rol.getEstado()){
                    for (var i in moduloSeleccionado.getModulosPadre()) {
                         modulo = Modulo.get(moduloSeleccionado.getModulosPadre()[i]);
                         moduloSeleccionado.agregarRol(
                             self.crearRolModulo(modulo, rol, empresa)
                         );
                    }
                }
                self.habilitarModulosRol();
                
            };
            
            
            //basado en los roles seleccionados, se envian para ser habilitardos para el modulo
            self.habilitarModulosRol = function() {
                console.log("roles modulos seleccionados ", moduloSeleccionado.getRoles());
                var obj = {
                    session: $scope.root.session,
                    data: {
                        parametrizacion_perfiles: {
                            rolesModulos: moduloSeleccionado.getRoles()
                        }
                    }
                };

                Request.realizarRequest(API.PERFILES.HABILITAR_MODULOS_ROLES, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", "El modulo se habilito en el rol correctamente");
                       /* var rol = $scope.rootRoles.rolAGuardar;
                        var ids = data.obj.parametrizacion_perfiles.ids;
                        
                        //se asigna el id del rol_modulo guardado, ya sea que se modifique o cree
                        var modulos = rol.getModulos();
                        for(var i in ids){
                            
                            for(var ii in modulos){
                                if(modulos[ii].getModulo().getId() === ids[i].modulo_id){
                                    modulos[ii].setId(ids[i].roles_modulos_id);
                                    break;
                                }
                            }
                          
                        }*/
                        

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            };
            

            
          
            $scope.onSeleccionarEmpresa = function(empresa) { 
               //testing moduloSeleccionado.vaciarListaEmpresas();
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




            $scope.close = function() {
                $scope.empresas = [];
                $modalInstance.close();
            };

            $modalInstance.opened.then(function() {
                self.traerEmpresas();

            });


        }]);
});