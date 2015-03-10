
define(["angular", "js/controllers", "js/models",
    "controllers/AdministracionModulos/Modulos/OpcionesModulosController",
    "models/Perfiles/Rol", "models/Perfiles/RolModulo"
], function(angular, controllers) {

    controllers.controller('AdministracionRolesController', [
        '$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "AlertService", "Usuario", "EmpresaParametrizacion",
        "Empresa_Modulo", "Modulo", "Rol", "RolModulo",
        function($scope, $rootScope, Request,
                $modal, API, socket, $timeout,
                AlertService, Usuario, EmpresaParametrizacion,
                Empresa_Modulo, Modulo, Rol, RolModulo) {

            var self = this;


            $scope.rootRoles = {
            };

            $scope.rootModulos = {
            };

            $scope.rootRoles.empresas = [];
            
            $scope.rootRoles.modulos_empresa = [];

            $scope.rootModulos.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };


            self.inicializarRolACrear = function() {
                $scope.rootModulos.moduloAGuardar = Modulo.get();
                $scope.rootRoles.rolAGuardar = Rol.get();
            };


            self.validarCreacionRol = function() {
                var rol = $scope.rootRoles.rolAGuardar;
                var validacion = {
                    valido: true,
                    msj: ""
                };


                if (rol.nombre === undefined || rol.nombre.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El rol debe tener un nombre";
                    return validacion;
                }

                if (rol.observacion === undefined || rol.observacion.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El rol debe tener una observacion";
                    return validacion;
                }

                if ($scope.rootRoles.empresaSeleccionada === undefined || $scope.rootRoles.empresaSeleccionada.getCodigo().length === 0) {
                    validacion.valido = false;
                    validacion.msj = "Debe seleccionar una empresa";
                    return validacion;
                }

                return validacion;

            };


            self.traerEmpresas = function() {
                var obj = {
                    session: $scope.rootModulos.session,
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
               //se evita que traiga los modulos si no se a guardado el rol
               if($scope.rootRoles.rolAGuardar.getId() === 0){
                   return;
               }
               
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_roles: {
                            empresa_id: $scope.rootRoles.empresaSeleccionada.getCodigo()
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_MODULOS_POR_EMPRESA, "POST", obj, function(data) {
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
                            modulos.push(modulo);
                            
                            //necesario para guardar en roles_modulos
                            $scope.rootRoles.modulos_empresa.push(
                                    Empresa_Modulo.get(
                                        angular.copy($scope.rootRoles.empresaSeleccionada),
                                        modulo,
                                        true,
                                        datos[i].id
                                    )
                                    
                            );

                        }

                        $scope.$broadcast("datosArbolCambiados", modulos);
                    }

                });

            };
            
            self.obtenerModuloSeleccionado = function(modulo_id){
                var modulos = $scope.rootRoles.modulos_empresa;
                for(var i in modulos){
                    if(modulos[i].getModulo().getId() === modulo_id){
                        return modulos[i];
                    }
                }
            };

            $scope.$on("modulosSeleccionados", function(e, modulos_seleccionado) {
                var modulo_empresa = self.obtenerModuloSeleccionado(modulos_seleccionado.seleccionado);
                
                if(!modulo_empresa) return;
                
                $scope.rootModulos.moduloAGuardar = Modulo.get(modulo_empresa.getModulo().getId());
                $scope.rootModulos.moduloAGuardar.agregarEmpresa(modulo_empresa);
                
                var rol_modulo = RolModulo.get(
                            0,
                            Rol.get(
                                $scope.rootRoles.rolAGuardar.getId(),
                                $scope.rootRoles.rolAGuardar.getNombre(),
                                $scope.rootRoles.rolAGuardar.getObservacion(),
                                $scope.rootRoles.rolAGuardar.getEmpresaId()
                            ),
                            angular.copy($scope.rootModulos.moduloAGuardar)
                );

                $scope.rootRoles.rolAGuardar.agregarModulo(rol_modulo);
                $scope.$broadcast("traerOpcionesModulo");
                
                console.log("modulos empresas >>>>>>>> ", modulo_empresa);
              
            });

            $scope.onGuardarRol = function() {
               
                var validacion = self.validarCreacionRol();

                if (!validacion.valido) {
                    AlertService.mostrarMensaje("warning", validacion.msj);
                    return;
                }
                
                $scope.rootRoles.rolAGuardar.setEmpresaId($scope.rootRoles.empresaSeleccionada.getCodigo());
                var rol_guardar = angular.copy($scope.rootRoles.rolAGuardar);


                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_perfiles: {
                            rol: rol_guardar
                        }
                    }
                };
                
                console.log("rol guardar >>>>> ",rol_guardar);

                Request.realizarRequest(API.PERFILES.GUARDAR_ROL, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", "Rol guardado correctamente");
                        var id = data.obj.parametrizacion_perfiles.rol.id;
                        if ($scope.rootRoles.rolAGuardar.getId() === 0) {
                            $scope.rootRoles.rolAGuardar.setId(id);
                            $scope.onEmpresaSeleccionada();
                        }
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });

            };



            //se carga las empresas despues que el arbol esta listo
            $scope.$on("arbolListoEnDom", function() {
            });

            self.inicializarRolACrear();
            self.traerEmpresas();

        }]);
});