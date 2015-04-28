
define([
    "angular", "js/controllers", "js/models",
    "controllers/AdministracionModulos/Modulos/OpcionesModulosController",
    "includes/classes/Modulo"
], function(angular, controllers) {

    controllers.controller('AdministracionModulosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket",
        "$timeout", "AlertService", "Usuario",
        "$modal", "Modulo", "VariableModulo",
        function($scope, $rootScope, Request,
                 $modal, API, socket, $timeout,
                 AlertService, Usuario, $modal,
                 Modulo, VariableModulo) {


            var self = this;

            $scope.rootModulos = {
                
            };
            
            $scope.opcionesListaModulos = {
                minimumInputLength: 3,
                query: function (query) {
                    console.log("query list ", query);

                   function querySucceeded(response) {
                        // give the {results:data-array} to the query callback
                        query.callback(response);
                   }

                   function queryFailed(error) {
                       // I don't know what you're supposed to do.
                       // maybe return nothing in the query callback?
                       // Tell the user SOMETHING and then
                       query.callback({results:[]});      
                   }
               }     
                        
            };
            
            
            $scope.listado_variables = {
                data: 'rootModulos.moduloAGuardar.getVariables()',
                enableColumnResize: true,
                enableRowSelection: false,
                showFilter: true,
                columnDefs: [
                    {field: 'nombre', displayName: 'Nombre Variable'},
                    {field: 'valor', displayName: 'Valor'},
                    {field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                      <button  class="btn btn-default btn-xs" ng-click="onEditarVariable(row.entity)">\
                                        <span class="glyphicon glyphicon-zoom-in"></span>\
                                      </button>\
                                      <button  class="btn btn-default btn-xs" ng-click="onBorrarVariable(row.entity)">\
                                        <span class="glyphicon glyphicon-remove"></span>\
                                      </button>\
                                      <input-check ng-if="rootOpciones.opciones.seleccionar" ng-disabled="!row.entity.estado"  ng-model="row.entity.seleccionado"  ng-change="onSeleccionarOpcion(row.entity)">\
                                   </div>'
                    }
                ]

            };
            
            $scope.onTraerModulos = function(busqueda){
                
                if(busqueda.length < 3){
                    return;
                }
                
                self.traerModulos(busqueda, function(){
                    
                });
            };
            
            $scope.onEditarVariable = function(variable){
                $scope.rootModulos.moduloAGuardar.setVariableAGuardar(variable);
            };
            
            $scope.onBorrarVariable = function(variable) {
                //console.log("opcion a eliminar ", opcion);
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                  //  size: 'sm',
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar la variable?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Variable:</h4>\
                                    <h5> {{ variable.getNombre() }}</h5>\
                                    <h4>Descripcion:</h4>\
                                    <h5> {{ variable.getObservacion() }} </h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="close()">No</button>\
                                    <button class="btn btn-warning" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance, variable) {
                        $scope.variable = variable;
                        $scope.confirmar = function() {
                            self.eliminarVariable(variable);
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };

                    },
                    resolve: {
                        variable: function() {
                            return variable;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            
            self.eliminarVariable = function(variable){
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_modulos: {
                            variable_id : variable.getId()
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.ELIMINAR_VARIABLE, "POST", obj, function(data) {
                    if (data.status === 200) {
                        
                        $scope.rootModulos.moduloAGuardar.eliminarVariable(variable);
                        AlertService.mostrarMensaje("success", "Variable eliminada correctamente");
                    }  else {
                         AlertService.mostrarMensaje("warning", data.msj);
                    }

                });

            };


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
                
                if (!modulo.getCarpetaRaiz()) {
                    validacion.valido = false;
                    validacion.msj = "El modulo debe tener una carpeta raíz";
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
            
            
            //valida que la creacion de la variable sea correcta
            self.validarCreacionVariable = function() {
                var variable = $scope.rootModulos.moduloAGuardar.getVariableAGuardar();
                
                var validacion = {
                    valido: true,
                    msj: ""
                };

                if (variable.nombre === undefined || variable.nombre.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "La variable debe tener un nombre";
                    return validacion;
                }

                if (variable.valor === undefined || variable.valor.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "La variable debe tener un valor";
                    return validacion;
                }

                if (variable.observacion === undefined || variable.observacion.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "La variable debe tener una observacion";
                    return validacion;
                }

                return validacion;

            };


            self.inicializarModuloACrear = function() {
                $scope.rootModulos.moduloAGuardar = Modulo.get();
                $scope.rootModulos.moduloAGuardar.setVariableAGuardar(VariableModulo.get());
                $scope.rootModulos.moduloAGuardar.setNodoPrincipal(false);
                $scope.rootModulos.moduloAGuardar.setEstado(false);
                $scope.rootModulos.moduloPadre = undefined;
            };

            self.traerModulos = function(termino, callback) {
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        termino:termino
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_MODULOS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_modulos.modulos;
                        
                        if(termino.length ===  0){
                            
                            $scope.rootModulos.modulos = [];
                        } else {
                            $scope.rootModulos.modulos_filtrados = [];
                        }
                        
                        

                        for (var i in datos) {


                            var modulo = Modulo.get(
                                    datos[i].id,
                                    datos[i].parent,
                                    datos[i].nombre,
                                    datos[i].url
                             );

                            modulo.setIcon(datos[i].icon);
                            modulo.setCarpetaRaiz(datos[i].carpeta_raiz);
                            
                            /*modulo.state = {
                                disabled: true
                            };*/
                            
                            if(termino.length === 0){
                                
                                $scope.rootModulos.modulos.push(modulo);
                            } else {
                                $scope.rootModulos.modulos_filtrados.push(modulo);
                            }
                        }

                        // console.log(modulos);
                        callback();
                        
                    }

                });
            };
            
            
            self.traerVariablesModulo = function() {
                                
                $scope.rootModulos.moduloAGuardar.vaciarOpciones();
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_modulos: {
                             modulo_id: $scope.rootModulos.moduloAGuardar.modulo_id
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_VARIABLES, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_modulos.variables_modulo;

                        for(var i in datos){
                            var _variable = datos[i];
                            var variable = VariableModulo.get(_variable.id, _variable.nombre, _variable.valor, _variable.observacion);
                            $scope.rootModulos.moduloAGuardar.agregarVariable(variable);
                        }

                    }

                });
            };
            

            $scope.rootModulos.session = {
                 usuario_id: Usuario.getUsuarioActual().getId(),
                 auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.rootModulos.iconos = [
                {clase: 'glyphicon glyphicon-file', nombre: 'Archivo'},
                {clase: 'glyphicon glyphicon-list-alt', nombre: 'Lista'}
            ];

            //se carga los modulos despues que el arbol esta listo
            $scope.$on("arbolListoEnDom", function() {
                self.traerModulos("", function(){
                    $scope.$broadcast("datosArbolCambiados", $scope.rootModulos.modulos);
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
                        moduloSeleccionado:function(){
                            return $scope.rootModulos.moduloAGuardar;
                        }
                    }
                };



                var modalInstance = $modal.open($scope.opts);

            };

            //limpia los datos del modulo
            $scope.onLimpiarFormulario = function() {
                self.inicializarModuloACrear();
            };
            
            $scope.onLimpiarFormularioVariable = function(){
                $scope.rootModulos.moduloAGuardar.setVariableAGuardar(VariableModulo.get());
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
                    
                } else if(modulo_guardar.parent === "#"){
                    modulo_guardar.parent = null;
                }

                modulo_guardar.url = "/" + modulo_guardar.state;
                
                //estas propiedades se borrarn porque no es necesario enviarlas al api
                delete modulo_guardar.opciones;

                delete modulo_guardar.nodo_principal;

               // console.log(JSON.stringify(modulo_guardar));


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
                        AlertService.mostrarMensaje("success", "Modulo guardado correctamente");
                        var id = data.obj.parametrizacion_modulo.modulo.id;
                        if (id) {
                            $scope.rootModulos.moduloAGuardar.setId(id);
                            modulo_guardar.setId(id);
                            
                            self.traerModulos("",function(){
                                
                                $scope.$broadcast("datosArbolCambiados", $scope.rootModulos.modulos);
                                
                                $scope.$on("arbolRefrescado",function(){
                                    console.log("arbol refrescado code 2")
                                    $scope.$broadcast("onseleccionarnodo", modulo_guardar.id, modulo_guardar.parent);
                                });
                                
                            });
                        }
                        
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });

            };
            
            $scope.onGuardarVariable = function(){
                var obj = self.validarCreacionVariable();
                if (!obj.valido) {
                    AlertService.mostrarMensaje("warning", obj.msj);
                    return;
                }
                
               var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_modulos: {
                            variable: $scope.rootModulos.moduloAGuardar.getVariableAGuardar(),
                            modulo_id: $scope.rootModulos.moduloAGuardar.getId()
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.GUARDAR_VARIABLE, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", "Variable guardada correctamente");
                        var id = data.obj.parametrizacion_modulo.variable.id;
                        if (id) {
                            $scope.rootModulos.moduloAGuardar.getVariableAGuardar().setId(id);
                            
                            self.traerVariablesModulo(function(){
                                
                                
                            });
                        }
                        
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
                
                
                
            };

            $scope.onSeleccionIcono = function(icono) {
                $scope.rootModulos.moduloAGuardar.icon = icono.clase;
            };

            $scope.onSeleccionarNodoPrincipal = function() {
                if ($scope.rootModulos.moduloAGuardar.nodo_principal) {
                    delete $scope.rootModulos.moduloPadre;
                    delete $scope.rootModulos.moduloAGuardar.icon;
                    $scope.rootModulos.moduloAGuardar.parent = null;
                    $scope.rootModulos.moduloAGuardar.parent_id = null;
                    $scope.rootModulos.moduloAGuardar.parent_name = null;
                }
            };

            $scope.onModuloPadreSeleccionado = function() {

                if ($scope.rootModulos.moduloAGuardar && $scope.rootModulos.moduloAGuardar.modulo_id === $scope.rootModulos.moduloPadre.modulo_id) {
                    console.log("modulo padre seleccionado ", $scope.rootModulos.moduloPadre);
                    delete $scope.rootModulos.moduloPadre;
                }
            };


            $scope.$on("modulosSeleccionados", function(e, modulos_seleccionado) {

                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_modulos: {
                            //solo se trae el modulo que se selecciono
                            modulos_id: [modulos_seleccionado.seleccionado]
                        }
                    }
                };

                Request.realizarRequest(API.MODULOS.OBTENER_MODULOS_POR_ID, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var modulo = data.obj.parametrizacion_modulos.modulos[0];
                        
                        //se inicializa el modulo a guardar
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
                        _modulo.setCarpetaRaiz(modulo.carpeta_raiz);
                        
                        //valida si tiene padres
                        if(modulos_seleccionado.padres.length > 0){
                            _modulo.setModulosPadre(modulos_seleccionado.padres);
                        }
                        
                        if(modulos_seleccionado.hijos.length > 0){
                            _modulo.setModulosHijo(modulos_seleccionado.hijos);
                        }
                        
                        $scope.rootModulos.moduloAGuardar = _modulo;
                        $scope.rootModulos.moduloAGuardar.setVariableAGuardar(VariableModulo.get());

                        var modulos = $scope.rootModulos.modulos;

                        if (_modulo.parent !== "#") {
                            //se determina el modulo padre
                            for (var i in  modulos) {

                                if (modulos[i].id === _modulo.parent) {
                                    //console.log("modulos select ", modulos[i].id);

                                    $scope.rootModulos.moduloPadre = modulos[i];
                                    break;
                                }
                            }
                        } else {
                            $scope.rootModulos.moduloPadre = undefined;
                        }
                        
                        $scope.$broadcast("traerOpcionesModulo");
                        
                        self.traerVariablesModulo();

                    } else {
                        AlertService.mostrarMensaje("warning", "Se ha generado un error");
                    }

                });
            });

            //fin de eventos
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.rootModulos = [];
                $scope.$$watchers = null;
            });


            self.inicializarModuloACrear();


        }]);
});