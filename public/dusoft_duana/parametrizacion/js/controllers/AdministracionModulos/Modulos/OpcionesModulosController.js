
define([
    "angular", "js/controllers", "js/models",
    "models/Modulo/OpcionModulo"
], function(angular, controllers) {

    controllers.controller('OpcionesModulosController', [
        '$scope', '$rootScope', 'Request',
        'API', "AlertService", "Usuario",
        "OpcionModulo",
        function($scope, $rootScope, Request,
                API, AlertService, Usuario,
                OpcionModulo) {


            var self = this;


            $scope.listado_opciones = {
                data: 'rootModulos.moduloAGuardar.opciones',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre', displayName: 'Nombre'},
                    {field: 'alias', displayName: 'Alias'},
                    {field: 'accion', displayName: '', width:'40',
                        cellTemplate: '<div>\
                                      <button class="btn btn-default btn-xs" ng-click="onBorrarOpcion(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                   </div>'
                    }
                ]

            };


            $scope.rootOpciones = {
                
            };
            
            $scope.$on("traerOpcionesModulo", function(){
                self.traerOpcionesModulo();
            });
            
            self.traerOpcionesModulo = function() {
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_modulos:{
                            modulo:{
                                id:$scope.rootModulos.moduloAGuardar.modulo_id
                            }
                        } 
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_OPCIONES, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_modulos.opciones_modulo;

                        for (var i in datos) {


                            var opcion = OpcionModulo.get(
                                    datos[i].id,
                                    datos[i].nombre,
                                    datos[i].alias,
                                    datos[i].modulo_id
                             );

                            opcion.setObservacion(datos[i].observacion);

                            $scope.rootModulos.moduloAGuardar.agregarOpcion(opcion);
                        }
                        
                        console.log("modulo a guardar ",$scope.rootModulos.moduloAGuardar);

                    }

                });
            };
            
            return;
            //valida que la creacion del modulo se correcta
            self.validarCreacionModulo = function() {
                var modulo = $scope.rootOpciones.moduloAGuardar;
                var validacion = {
                    valido: true,
                    msj: ""
                };

                if (!modulo.nodo_principal && !$scope.rootOpciones.moduloPadre) {
                    validacion.valido = false;
                    validacion.msj = "Debe seleccionar el modulo padre";
                    return validacion;
                }

                if (modulo.nombre === undefined || modulo.nombre.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El modulo debe tener un nombre";
                    return validacion;
                }

                if (modulo.state === undefined || modulo.state.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El modulo debe tener un estado";
                    return validacion;
                }

                if (modulo.observacion === undefined || modulo.observacion.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El modulo debe tener una observacion";
                    return validacion;
                }

                if (!modulo.nodo_principal && !modulo.icon) {
                    validacion.valido = false;
                    validacion.msj = "Debe seleccionar el icono del modulo";
                    return validacion;
                }

                return validacion;

            };

            self.inicializarModuloACrear = function() {
                $scope.rootOpciones.moduloAGuardar = Modulo.get();
                $scope.rootOpciones.moduloAGuardar.setNodoPrincipal(false);
                $scope.rootOpciones.moduloAGuardar.setEstado(false);
                $scope.rootOpciones.moduloPadre = undefined;

            };


            $scope.rootOpciones.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            $scope.rootOpciones.iconos = [
                {clase: 'glyphicon glyphicon-file', nombre: 'Archivo'},
                {clase: 'glyphicon glyphicon-list-alt', nombre: 'Lista'}
            ];


            $scope.listado_opciones = {
                data: '[]',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_opcion', displayName: 'Nombre'},
                    {field: 'alias', displayName: 'Alias'},
                    {field: 'accion', displayName: 'Accion',
                        cellTemplate: '<div>\
                                      <button class="btn btn-default btn-xs" ng-click="onBorrarOpcion(row.entity)"><span class="glyphicon glyphicon-remove">Borrar</span></button>\
                                   </div>'
                    }
                ]

            };

            //se carga los modulos despues que el arbol esta listo
            $scope.$on("arbolListoEnDom", function() {
                self.traerOpciones();
            });

            //ventana para habilitar el modulo en una empresa
            $scope.onHabilitarModuloEnEmpresas = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    size: 'lg',
                    templateUrl: 'views/AdministracionModulos/Modulos/habilitarModuloEmpresa.html',
                    controller: "HabilitarModulosEmpresaController",
                    resolve: {
                    }
                };



                var modalInstance = $modal.open($scope.opts);

            };

            //limpia los datos del modulo
            $scope.onLimpiarFormulario = function() {
                self.inicializarModuloACrear();
            };

            $scope.onGuardarModulo = function() {
                var validacion = self.validarCreacionModulo();

                if (!validacion.valido) {
                    AlertService.mostrarMensaje("warning", validacion.msj);
                    return;
                }

                var modulo_guardar = angular.copy($scope.rootOpciones.moduloAGuardar);
                var moduloPadre = $scope.rootOpciones.moduloPadre;

                //se verifica si tiene padre para sacar la informacion necesaria
                if (moduloPadre) {
                    console.log("tratando de guardar modulo");
                    modulo_guardar.parent = moduloPadre.modulo_id;
                    modulo_guardar.parent_name = moduloPadre.text;

                } else if (modulo_guardar.parent === "#") {
                    modulo_guardar.parent = null;
                }

                modulo_guardar.url = "/" + modulo_guardar.state;

                delete modulo_guardar.nodo_principal;

                console.log(JSON.stringify(modulo_guardar));


                var obj = {
                    session: $scope.rootOpciones.session,
                    data: {
                        parametrizacion_modulos: {
                            modulo: modulo_guardar
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.GUARDAR_MODULO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        console.log("modulo guardado con exito ", data);
                        var id = data.obj.parametrizacion_modulo.modulo.id;
                        if (id) {
                            $scope.rootOpciones.moduloAGuardar.setId(id);
                        }

                        self.traerOpciones();
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });

            };

            $scope.onSeleccionIcono = function(icono) {
                $scope.rootOpciones.moduloAGuardar.icon = icono.clase;
            };

            $scope.onBorrarOpcion = function(opcion) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar la opcion?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Codigo.</h4>\
                                    <h5> {{ producto_eliminar.getCodigoProducto() }}</h5>\
                                    <h4>Descripcion.</h4>\
                                    <h5> {{ producto_eliminar.getDescripcion() }} </h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            // $scope.eliminar_producto();
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };

                    },
                    resolve: {
                        producto_eliminar: function() {
                            return $scope.producto_eliminar;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.onSeleccionarNodoPrincipal = function() {
                console.log("es modulo principal ", $scope.rootOpciones.moduloAGuardar.nodo_principal);
                if ($scope.rootOpciones.moduloAGuardar.nodo_principal) {
                    delete $scope.rootOpciones.moduloPadre;
                    delete $scope.rootOpciones.moduloAGuardar.icon;
                    $scope.rootOpciones.moduloAGuardar.parent = null;
                    $scope.rootOpciones.moduloAGuardar.parent_id = null;
                    $scope.rootOpciones.moduloAGuardar.parent_name = null;
                }
            };

            $scope.onModuloPadreSeleccionado = function() {

                if ($scope.rootOpciones.moduloAGuardar && $scope.rootOpciones.moduloAGuardar.modulo_id === $scope.rootOpciones.moduloPadre.modulo_id) {
                    console.log("modulo padre seleccionado ", $scope.rootOpciones.moduloPadre);
                    delete $scope.rootOpciones.moduloPadre;
                }
            };

            $scope.$on("modulosSeleccionados", function(e, modulos) {
                ///console.log("modulos seleccionados ", modulos);

                var obj = {
                    session: $scope.rootOpciones.session,
                    data: {
                        parametrizacion_modulos: {
                            modulos_id: modulos
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.OBTENER_MODULOS_POR_ID, "POST", obj, function(data) {
                    if (data.status === 200) {
                        //console.log("modulos encontrados ",data);
                        var modulo = data.obj.parametrizacion_modulos.modulos[0] || undefined;

                        var _modulo = Modulo.get(
                                modulo.id,
                                modulo.parent,
                                modulo.nombre,
                                modulo.url
                                );

                        _modulo.setIcon(modulo.icon);
                        _modulo.setState(modulo.state);
                        _modulo.setObservacion(modulo.observacion);
                        _modulo.setEstado(modulo.estado);
                        $scope.rootOpciones.moduloAGuardar = _modulo;

                        var modulos = $scope.rootOpciones.modulos;

                        console.log("moduloe seleccionando ", _modulo.parent);

                        if (_modulo.parent !== "#") {

                            for (var i in  modulos) {

                                if (modulos[i].id === _modulo.parent) {
                                    console.log("modulos select ", modulos[i].id);

                                    $scope.rootOpciones.moduloPadre = modulos[i];
                                    break;
                                }
                            }
                        } else {
                            $scope.rootOpciones.moduloPadre = undefined;
                        }

                        console.log("modulo creado ", _modulo);

                    } else {
                        AlertService.mostrarMensaje("warning", "Se ha generado un error");
                    }

                });
            });

            //fin de eventos
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.rootOpciones = [];
                $scope.$$watchers = null;
            });


            self.inicializarModuloACrear();


        }]);
});