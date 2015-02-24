
define([
    "angular", "js/controllers", "js/models",
    "controllers/AdministracionModulos/Modulos/HabilitarModulosEmpresaController",
    "models/Modulo/Modulo"
], function(angular, controllers) {

    controllers.controller('AdministracionModulosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket",
        "$timeout", "AlertService", "Usuario", "$modal", "Modulo",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, Usuario, $modal, Modulo) {


            var self = this;

            $scope.rootModulos = {
            };

            $scope.rootModulos.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            $scope.rootModulos.iconos = [
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
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_MODULOS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        console.log(Modulo);
                        var datos = data.obj.parametrizacion_modulos.modulos;
                        $scope.rootModulos.modulos = [];
                        
                        for (var i in datos) {
                            
                            
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
                        $scope.$broadcast("datosArbolCambiados", $scope.rootModulos.modulos);

                    }

                });
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

                var modulo_guardar = angular.copy($scope.rootModulos.moduloAGuardar);
                var moduloPadre = $scope.rootModulos.moduloPadre;
                
                //se verifica si tiene padre para sacar la informacion necesaria
                if (moduloPadre) {
                    modulo_guardar.parent = moduloPadre.modulo_id;
                    modulo_guardar.parent_name = moduloPadre.text;
                }

                modulo_guardar.url = "/" + modulo_guardar.state;

                delete modulo_guardar.nodo_principal;

                console.log(JSON.stringify(modulo_guardar));


                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_modulos: {
                            modulo: modulo_guardar
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.GUARDAR_MODULO, "POST", obj, function(data) {
                    if (data.status === 200) {

                    }

                });

            };

            $scope.onSeleccionIcono = function(icono) {
                $scope.rootModulos.moduloAGuardar.icon = icono.clase;
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
                console.log("es modulo principal ", $scope.rootModulos.moduloAGuardar.nodo_principal);
                if ($scope.rootModulos.moduloAGuardar.nodo_principal) {
                    delete $scope.rootModulos.moduloPadre;
                    delete $scope.rootModulos.moduloAGuardar.icon;
                }
            };
            
            $scope.$on("modulosSeleccionados",function(e, modulos){
                ///console.log("modulos seleccionados ", modulos);
                
                var obj = {
                    session: $scope.rootModulos.session,
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
                        $scope.rootModulos.moduloAGuardar = _modulo;
                        
                        var modulos = $scope.rootModulos.modulos;
                        
                        console.log("moduloe seleccionando ",_modulo.parent);
                        
                        for(var i in  modulos){
                            
                            if(modulos[i].id === _modulo.parent){
                                console.log("modulos select ", modulos[i].id);
                                
                                $scope.rootModulos.moduloPadre = modulos[i];
                                break;
                            }
                        }
                        
                        console.log("modulo creado ",_modulo)
                        
                    } else {
                        AlertService.mostrarMensaje("warning", "Se ha generado un error");
                    }

                });
            });
            
            //valida que la creacion del modulo se correcta
            self.validarCreacionModulo = function() {
                var modulo = $scope.rootModulos.moduloAGuardar;
                var validacion = {
                    valido: true,
                    msj: ""
                };

                if (!modulo.nodo_principal && !$scope.rootModulos.moduloPadre) {
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
                 $scope.rootModulos.moduloAGuardar = Modulo.get();
                 $scope.rootModulos.moduloAGuardar.setNodoPrincipal(false);
                 $scope.rootModulos.moduloAGuardar.setEstado(false);
                 $scope.rootModulos.moduloPadre = Modulo.get();
                
            };

            self.inicializarModuloACrear();


        }]);
});