
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

            $scope.rootOpciones = {
            };


            self.traerOpcionesModulo = function() {
                $scope.rootModulos.moduloAGuardar.vaciarOpciones();
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_modulos: {
                            modulo: {
                                id: $scope.rootModulos.moduloAGuardar.modulo_id
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
                            opcion.setEstado(datos[i].estado);

                            $scope.rootModulos.moduloAGuardar.agregarOpcion(opcion);
                        }

                        // console.log("modulo a guardar ", $scope.rootModulos.moduloAGuardar);

                    }

                });
            };

            //valida que la creacion de la opcion sea correcta
            self.validarCreacionOpcion = function() {
                var opcion = $scope.rootModulos.moduloAGuardar.getOpcionAGuardar();

                var validacion = {
                    valido: true,
                    msj: ""
                };

                if (opcion === undefined) {
                    validacion.valido = false;
                    validacion.msj = "Los campos para la opcion del modulo son obligatorios";
                    return validacion;
                }

                if (opcion.nombre === undefined || opcion.nombre.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "La opcion debe tener un nombre";
                    return validacion;
                }

                if (opcion.alias === undefined || opcion.alias.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "La opcion debe tener un alias";
                    return validacion;
                }

                if (opcion.observacion === undefined || opcion.observacion.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "La opcion debe tener una observacion";
                    return validacion;
                }

                return validacion;

            };

            self.inicializarOpcionACrear = function() {
                $scope.rootModulos.moduloAGuardar.opcionAGuardar = OpcionModulo.get();

            };

            $scope.listado_opciones = {
                data: 'rootModulos.moduloAGuardar.opciones',
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
            
            $scope.onEditarOpcion = function(opcion){
               // console.log("editar opcion ", opcion);
                $scope.rootModulos.moduloAGuardar.opcionAGuardar = opcion;
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

            $scope.$on("traerOpcionesModulo", function() {
                self.traerOpcionesModulo();
                self.inicializarOpcionACrear();
            });
            
            $scope.onLimpiarFormularioOpcion = function(){
                self.inicializarOpcionACrear();
            };

            $scope.onGuardarOpcion = function() {
                var validacion = self.validarCreacionOpcion();

                if (!validacion.valido) {
                    AlertService.mostrarMensaje("warning", validacion.msj);
                    return;
                }

                var opcion_guardar = angular.copy($scope.rootModulos.moduloAGuardar.getOpcionAGuardar());

                opcion_guardar.modulo_id = $scope.rootModulos.moduloAGuardar.modulo_id;

                console.log(JSON.stringify(opcion_guardar));

                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_modulos: {
                            opcion: opcion_guardar
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.GUARDAR_OPCION, "POST", obj, function(data) {
                    if (data.status === 200) {
                        console.log("opcion guardada con exito ", data);
                        var id = data.obj.parametrizacion_modulo.opcion.id;
                        if (id) {
                            $scope.rootModulos.moduloAGuardar.getOpcionAGuardar().setId(id);
                            
                            //se decide pasar esta instancia ya que es una copia de la opcion para guardar
                            //si se pasa la referencia de agregarOpcion directamente puede presentar conflictos con el binding
                            opcion_guardar.setId(id);
                        }

                        $scope.rootModulos.moduloAGuardar.agregarOpcion(opcion_guardar);
                        //self.traerOpcionesModulo();
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });

            };

        }]);
});