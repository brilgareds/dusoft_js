
define([
    "angular", "js/controllers", "js/models",
    "controllers/AdministracionModulos/Modulos/OpcionesModulosController",
    "models/Modulo/Modulo"
], function(angular, controllers) {

    controllers.controller('AdministracionModulosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket",
        "$timeout", "AlertService", "Usuario",
        "$modal", "Modulo",
        function($scope, $rootScope, Request,
                 $modal, API, socket, $timeout,
                 AlertService, Usuario, $modal,
                 Modulo) {


            var self = this;

            $scope.rootModulos = {
                
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
                $scope.rootModulos.moduloPadre = undefined;

            };

            self.traerModulos = function() {
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
                            
                            /*modulo.state = {
                                disabled: true
                            };*/

                            $scope.rootModulos.modulos.push(modulo);
                        }

                        // console.log(modulos);
                        $scope.$broadcast("datosArbolCambiados", $scope.rootModulos.modulos);

                    }

                });
            };

            $scope.rootModulos.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            $scope.rootModulos.iconos = [
                {clase: 'glyphicon glyphicon-file', nombre: 'Archivo'},
                {clase: 'glyphicon glyphicon-list-alt', nombre: 'Lista'}
            ];

            //se carga los modulos despues que el arbol esta listo
            $scope.$on("arbolListoEnDom", function() {
                self.traerModulos();
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
                    console.log("tratando de guardar modulo");
                    modulo_guardar.parent = moduloPadre.modulo_id;
                    modulo_guardar.parent_name = moduloPadre.text;
                    
                } else if(modulo_guardar.parent === "#"){
                    modulo_guardar.parent = null;
                }

                modulo_guardar.url = "/" + modulo_guardar.state;
                
                //estas propiedades se borrarn porque no es necesario enviarlas al api
                delete modulo_guardar.opciones;

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
                        console.log("modulo guardado con exito ", data);
                        AlertService.mostrarMensaje("success", "Modulo guardado correctamente");
                        var id = data.obj.parametrizacion_modulo.modulo.id;
                        if (id) {
                            $scope.rootModulos.moduloAGuardar.setId(id);
                        }
                        self.traerModulos();
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });

            };

            $scope.onSeleccionIcono = function(icono) {
                $scope.rootModulos.moduloAGuardar.icon = icono.clase;
            };

            $scope.onSeleccionarNodoPrincipal = function() {
                console.log("es modulo principal ", $scope.rootModulos.moduloAGuardar.nodo_principal);
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
            
           /* $scope.$on("traerOpcioesModuloSeleccionado", function(e, modulo_id) {

                $scope.$broadcast("traerOpcionesModulo");
            });*/

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
                        
                        //valida si tiene padres
                        if(modulos_seleccionado.padres.length > 0){
                            _modulo.setModulosPadre(modulos_seleccionado.padres);
                        }
                        
                        if(modulos_seleccionado.hijos.length > 0){
                            _modulo.setModulosHijo(modulos_seleccionado.hijos);
                        }
                        
                        $scope.rootModulos.moduloAGuardar = _modulo;

                        var modulos = $scope.rootModulos.modulos;

                        if (_modulo.parent !== "#") {
                            //se determina el modulo padre
                            for (var i in  modulos) {

                                if (modulos[i].id === _modulo.parent) {
                                    console.log("modulos select ", modulos[i].id);

                                    $scope.rootModulos.moduloPadre = modulos[i];
                                    break;
                                }
                            }
                        } else {
                            $scope.rootModulos.moduloPadre = undefined;
                        }
                        
                        $scope.$broadcast("traerOpcionesModulo");

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