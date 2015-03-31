
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

            self.traerEmpresasModulos = function(callback) {
                
                
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
                            //se determina si la empresa es seleccioanda al hacer match con el modulo_id
                            var esModuloActual = false;
                            var estado = datos[i].estado;
                            if(datos[i].modulo_id === moduloSeleccionado.getId()) {
                                esModuloActual = true;
                            }
                            
                            var empresa = EmpresaParametrizacion.get(
                                    datos[i].razon_social,
                                    datos[i].empresa_id,
                                    estado
                            );
                                
                                                        
                            if(datos[i].modulo_id !== null){
                                
                                self.__agregarEmpresa(empresa, datos[i].modulo_id , datos[i].modulos_empresas_id);
                            }
                        }
                        
                        callback();
                    }

                });
            };
            
            
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
                
                Request.realizarRequest(API.MODULOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.empresas = [];
                        var datos = data.obj.empresas;

                        for (var i in datos) {

                            var empresa = EmpresaParametrizacion.get(
                                    datos[i].razon_social,
                                    datos[i].empresa_id
                            );
                                
                            empresa.setEstado(self.esEmpresaSeleccionada(empresa));
                            
                            $scope.empresas.push(empresa);

                        }
                        
                    }

                });
            };
            
            //verifica si la empresa fue seleccionada por el modulo
            self.esEmpresaSeleccionada = function(empresa){
                 
                 for(var i in moduloSeleccionado.getListaEmpresas()){
                     var _empresa = moduloSeleccionado.getListaEmpresas()[i];
                     
                     if(empresa.getCodigo() ===  _empresa.getEmpresa().getCodigo() 
                        &&_empresa.getModulo().getId() === moduloSeleccionado.getId()){
    
                         return _empresa.getEmpresa().getEstado();
                     }
                 }
                 
                 return false;
            };

            self.agregarEmpresa = function(empresa, modulos_empresas_id) {
               //se debe recorrer los modulos padre o hijo automaticamente seleccionados por el plugin
               empresa = angular.copy(empresa);
                for (var i in moduloSeleccionado.getModulosHijo()) {

                    self.__agregarEmpresa(empresa, moduloSeleccionado.getModulosHijo()[i],modulos_empresas_id);
                }
                
                for (var i in moduloSeleccionado.getModulosPadre()) {
                     
                    if(empresa.getEstado()){
                        console.log("cambiar modulo padre ",empresa.getEstado(), moduloSeleccionado.getModulosPadre()[i]);
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
            
           //trae los roles asignados al modulo
           self.listarRolesPorModulo = function(empresa, callback){
              // $scope.onSeleccionarRol();
              $scope.root.empresaSeleccionada = empresa;
              var obj = {
                    session: $scope.root.session,
                    data: {
                        parametrizacion_modulos: {
                            empresa_id: empresa.getCodigo(),
                            modulo_id:moduloSeleccionado.getId()
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_ROLES_POR_MODULO, "POST", obj, function(data) {
                    if (data.status === 200) {

                        var roles = data.obj.parametrizacion_modulos.roles;
                        moduloSeleccionado.vaciarRoles();

                        for (var i in roles) {

                            var rol = Rol.get(
                                    roles[i].id,
                                    roles[i].nombre,
                                    roles[i].observacion,
                                    $scope.root.empresaSeleccionada.getCodigo()
                            );
                                
                            rol.setEstado(roles[i].estado_rol_modulo);
                            
                            self.gestionarRolEnModulo(rol);

                        }
                        
                        callback();

                    } else {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error...");
                    }

                });
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
                                
                            var rol_estado = self.esRolSeleccionado(rol);
                            
                            rol.setEstado((rol_estado)?rol_estado.getEstado():'0');

                            $scope.root.empresaSeleccionada.agregarRol(rol);

                        }

                    } else {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error...");
                    }

                });

            };
            
            //determina si un rol le pertenece al modulo
            self.esRolSeleccionado = function(rol){
               var roles = moduloSeleccionado.getRoles();
               
               for(var i in roles){
                   var _rol = roles[i].getRol();
                   var _modulo = roles[i].getModulo();
                   
                   if(_rol.getId() === rol.getId() && _modulo.getId() === moduloSeleccionado.getId()){
                       return _rol;
                   }
                   
               }
               return false;
            };
            
            //crea la instancia rol_modulo para habilitar el modulo en el rol
            self.crearRolModulo = function(modulo, rol, empresa){
                var empresas = $scope.moduloSeleccionado.getListaEmpresas();
                var asignado_empresa = false;
                
                for(var i in empresas){
                   
                    if(empresas[i].getEmpresa().getCodigo() === empresa.getCodigo() && empresas[i].getModulo().getId() === modulo.getId()){
                        modulo.agregarEmpresa(empresas[i]);
                        asignado_empresa = true;
                        break;
                    }
                }
                
                //si el modulo no tiene empresa asignada no se debe agregar
                if(!asignado_empresa){
                    return false;
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
                        self.listarRolesPorModulo(rowItem.entity, function(){
                            
                            self.traerRoles(rowItem.entity);
                        });
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

                moduloSeleccionado.vaciarRoles();
                
                self.gestionarRolEnModulo(rol);
                self.habilitarModulosRol();
                
            };
            
            //prepara los roles para crearlos o editarlos en el rol
            self.gestionarRolEnModulo = function(rol){
                var modulo = Modulo.get(moduloSeleccionado.getId());
                var empresa = angular.copy($scope.root.empresaSeleccionada);
                rol = angular.copy(rol);
                
                var rol_modulo = self.crearRolModulo(modulo, rol, empresa);
                
                if(rol_modulo){
                    moduloSeleccionado.agregarRol( 
                        rol_modulo
                    );
                }
                
                for (var i in moduloSeleccionado.getModulosHijo()) {
                    modulo = Modulo.get(moduloSeleccionado.getModulosHijo()[i]);
                    
                    rol_modulo = self.crearRolModulo(modulo, rol, empresa);
                    
                    if(rol_modulo){
                        moduloSeleccionado.agregarRol(
                             rol_modulo
                        );
                    }
                }
                
                if(rol.getEstado()){
                    for (var i in moduloSeleccionado.getModulosPadre()) {
                         modulo = Modulo.get(moduloSeleccionado.getModulosPadre()[i]);
                         
                         rol_modulo = self.crearRolModulo(modulo, rol, empresa);
                         
                         if(rol_modulo){
                            moduloSeleccionado.agregarRol(
                                rol_modulo
                            );
                         }
                    }
                }
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
                
                
                console.log("$scope.moduloSeleccionado.getListaEmpresas() ",$scope.moduloSeleccionado.getListaEmpresas());
                                
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
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", "La empresa se habilito correctamente");
                        var modulo = $scope.moduloSeleccionado;
                        var ids = data.obj.parametrizacion_modulos.ids;
                        
                        //se asigna el id del rol_modulo guardado, ya sea que se modifique o cree
                        var empresas = modulo.getListaEmpresas();
                        for(var i in ids){
                            
                            for(var ii in empresas){
                                if(empresas[ii].getModulo().getId() === ids[i].modulo_id && empresas[ii].getEmpresa().getCodigo() === ids[i].empresa_id ){
                                    empresas[ii].setId(ids[i].modulos_empresas_id);
                                    break;
                                }
                            }
                          
                        }
                        

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
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
                self.traerEmpresasModulos(function(){
                    self.traerEmpresas();
                });

            });


        }]);
});