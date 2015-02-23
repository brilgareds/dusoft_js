
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
                        var datos = data.obj.modulos;
                        $scope.rootModulos.modulos = [];

                        for (var i in datos) {
                            var modulo = Modulo.get(
                                    datos[i].id,
                                    datos[i].parent,
                                    datos[i].nombre,
                                    datos[i].url
                                    );

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


            /*$scope.onModuloPadreSeleccionado = function(){
             console.log($scope.rootModulos.moduloAGuardar.moduloPadre);
             };
             */

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
                
                //se verifica si tiene padre para sacar la informacion necesaria
                if(modulo_guardar.moduloPadre){
                    modulo_guardar.parent = modulo_guardar.moduloPadre.parent_id;
                    modulo_guardar.parent_name = modulo_guardar.moduloPadre.text;
                    delete modulo_guardar.moduloPadre;
                }
                
                modulo_guardar.url = "/"+modulo_guardar.state;
                
                delete modulo_guardar.nodo_principal;
                console.log(modulo_guardar);
                
                return;
                
                 var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        modulo:modulo_guardar
                    }
                };

                Request.realizarRequest(API.MODULOS.GUARDAR_MODULO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        
                    }

                });
                
            };

            $scope.onSeleccionIcono = function(icono) {
                console.log(icono);
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
                   delete $scope.rootModulos.moduloAGuardar.moduloPadre ;
                   delete $scope.rootModulos.moduloAGuardar.icon ;
                }
            };

            self.validarCreacionModulo = function() {
                var modulo = $scope.rootModulos.moduloAGuardar;
                var validacion = {
                    valido: true,
                    msj: ""
                };

                console.log(modulo);

                if (!modulo.nodo_principal && !modulo.moduloPadre) {
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

                if (modulo.descripcion === undefined || modulo.descripcion.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El modulo debe tener una descripcion";
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
                $scope.rootModulos.moduloAGuardar = {
                    nodo_principal: false,
                    estado: false
                };
            };

            self.inicializarModuloACrear();


        }]);
});