
define(["angular", "js/services"], function(angular, services) {

    services.factory('ParametrizacionService', 
    ['$rootScope','Modulo','Request','Empresa_Modulo','EmpresaParametrizacion',
     'API','RolModulo','Rol',
    function($rootScope, Modulo, Request, Empresa_Modulo, EmpresaParametrizacion, 
             API, RolModulo, Rol) {
        
           var self = this;
           
           //metodo usado por los controladores AdministracionUsuariosController, AdministracionRolesController
           self.traerModulos = function(parametros, empresaSeleccionada, esModuloSeleccionado ){
               //$scope.$broadcast("deshabilitarNodos");


                Request.realizarRequest(API.MODULOS.LISTAR_MODULOS_POR_EMPRESA, "POST", parametros, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_roles.modulos_empresas;
                        /*Este arreglo es necesario para pasarlo al plugin de jstree, ya que los parents y children no devuleven el objeto 
                         del modelo que estamos trabajando*/
                        var modulos = [];

                        //se crea una instancia de la relacion de modulos y empresas
                        for (var i in datos) {
                            var modulo = Modulo.get(
                                    datos[i].modulo_id,
                                    datos[i].parent,
                                    datos[i].nombre,
                                    datos[i].state
                             );

                            modulo.setIcon(datos[i].icon);
                            
                            var moduloRolSeleccionado = esModuloSeleccionado(modulo);   
                                                        
                            modulo.state = {
                                selected:(moduloRolSeleccionado)?true:false,
                                disabled: true
                            };
                            
                            modulos.push(modulo);
                            
                            if(moduloRolSeleccionado){
                                
                                $rootScope.$emit("onseleccionarnodo",modulo);
                            };

                            //necesario para guardar en roles_modulos
                            empresaSeleccionada.agregarEmpresa(
                                    Empresa_Modulo.get(
                                        EmpresaParametrizacion.get(empresaSeleccionada.getCodigo()),
                                        modulo,
                                        true,
                                        datos[i].id
                                    )
                            );

                        }
                        //console.log("refrescar arbol code 1");
                        $rootScope.$emit("datosArbolCambiados", modulos);
                    }

                });
           };
           
           $rootScope.$on("arbolRefrescado",function(){
              // console.log("arbol refrescado");
           });
           
           
           //metodo usado por los controladores AdministracionRolesController
           self.traerModulosPorRol = function(parametros, rolAGuardar, callback){
               
               Request.realizarRequest(API.PERFILES.OBTENER_MODULOS_POR_ROL, "POST", parametros, function(data) {
                    if (data.status === 200) {
                        
                        var modulos = data.obj.parametrizacion_perfiles.modulos_empresas;
                        for(var i in modulos){
                            //bloque 1
                            var modulo = Modulo.get(modulos[i].modulo_id, modulos[i].parent);
                            modulo.setEstado(modulos[i].estado_rol);
                            

                            var rol_modulo = RolModulo.get(
                                    modulos[i].roles_modulos_id,
                                    Rol.get(
                                        rolAGuardar.getId(),
                                        rolAGuardar.getNombre(),
                                        rolAGuardar.getObservacion(),
                                        rolAGuardar.getEmpresaId()
                                    ),
                                    modulo,
                                    true
                            );

                            rolAGuardar.agregarModulo(rol_modulo);
                        }


                        callback(true);
                    } else {
                       callback(false);
                    }

                });
               
           };
           
           self.traerModulosPorUsuario = function(parametros, rolAGuardar, callback){
               
               Request.realizarRequest(API.USUARIOS.OBTENER_MODULOS_USUARIO, "POST", parametros, function(data) {
                    if (data.status === 200) {
                        
                        var modulos = data.obj.parametrizacion_usuarios.modulos_usuario;
                        for(var i in modulos){
                            //bloque 1
                            var modulo = Modulo.get(modulos[i].modulo_id, modulos[i].parent);
                            modulo.setEstado(modulos[i].estado_modulo_usuario);
                            

                            var rol_modulo = RolModulo.get(
                                    modulos[i].login_modulos_empresas_id,
                                    Rol.get(
                                        rolAGuardar.getId(),
                                        rolAGuardar.getNombre(),
                                        rolAGuardar.getObservacion(),
                                        rolAGuardar.getEmpresaId()
                                    ),
                                    modulo,
                                    true
                            );

                            rolAGuardar.agregarModulo(rol_modulo);
                        }

                        callback(true);
                    } else {
                       callback(false);
                    }

                });
               
           };
           
           
           //metodo usado por los controladores AdministracionUsuariosController, ListarRolesController
           self.traerRoles = function(parametros, empresaSeleccionada, callback) {
                if (!empresaSeleccionada || empresaSeleccionada.getCodigo().length === 0) {
                    return;
                }

                empresaSeleccionada.vaciarRoles();

                Request.realizarRequest(API.PERFILES.LISTAR_ROLES, "POST", parametros, function(data) {
                    if (data.status === 200) {

                        var roles = data.obj.parametrizacion_perfiles.roles;
                        
                        if(roles.length === 0){
                            callback(false, "No se encontraron registros");
                            return;
                        }

                        for (var i in roles) {

                            var rol = Rol.get(
                                    roles[i].id,
                                    roles[i].nombre,
                                    roles[i].observacion,
                                    empresaSeleccionada.getCodigo()
                            );

                            empresaSeleccionada.agregarRol(rol);

                        }
                        
                        callback(true);
                    } else {
                        callback(false, "Ha ocurrido un error...");
                    }

                });

            };


            return this;

        }]);
});