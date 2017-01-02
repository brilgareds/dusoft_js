
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function (angular, controllers) {
    //probando branch de pedidos clientes
    controllers.controller('ValidacionDespachoDetalleController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "socket",
        "$timeout",
        "AlertService",
        "localStorageService",
        "$state",
        "$filter",
        "Usuario", "AprobacionDespacho", "EmpresaAprobacionDespacho", "ValidacionDespachosService","ImagenAprobacion",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Sesion, AprobacionDespacho, EmpresaAprobacionDespacho, ValidacionDespachosService, ImagenAprobacion) {

            var that = this;
            // Definicion Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Definicion variables del View

            $scope.datos_view = {
                seleccionarOtros: '',
                empresaSeleccionada: '',
                activar_tab: {tab_productos: true, tab_cargar_archivo: false},
                visualizar: false,
                // Opciones del Modulo 
                opciones: Sesion.getUsuarioActual().getModuloActual().opciones,
                progresoArchivo: 0,
                btnSolicitarAutorizacionCartera: true,
                estadoRegistro: 0,
                prefijoList: '',
                existenciaDocumento: true


            };

            $scope.documentoDespachoAprobado = AprobacionDespacho.get();
            $scope.despachoId = 0;
            
            $scope.cargarEmpresaSession = function () {

                if ($scope.datos_view.seleccionarOtros) {
                    var session = angular.copy(Sesion.getUsuarioActual().getEmpresa());
                    var empresa = EmpresaAprobacionDespacho.get(session.nombre, session.codigo);
                    $scope.datos_view.empresaSeleccionada = empresa;

                } else {

                    $scope.datos_view.empresaSeleccionada = "";
                }
            };
            /**
             * @author Cristian Ardila
             * @fecha 05/02/2016
             * +Descripcion Se obtienen los documentos segun la empresa
             * 
             */
            that.traerListadoDocumentosUsuario = function (callback) {
                // var session = angular.copy(Sesion.getUsuarioActual().getEmpresa());	

                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            tipo_documento: 'E008'
                        }
                    }
                };

                Request.realizarRequest(API.VALIDACIONDESPACHOS.CONSULTAR_DOCUMENTOS_USUARIOS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        callback(data);
                    }

                });

            };


            that.traerListadoDocumentosUsuario(function (data) {
                if (data.obj.movimientos_bodegas !== undefined) {

                    $scope.documentos_usuarios = data.obj.movimientos_bodegas;
                }
            });


            /**
             * @author Cristian Ardila
             * @fecha 10/02/2016
             * +Descripcion Funcion que se acciona al presionar el boton guardar
             *              de la vista Detalle de despacho aprobado
             */
            $scope.aprobarDespacho = function () {
                console.log("$scope.documentoDespachoAprobado ", $scope.documentoDespachoAprobado);
                if ($scope.documentoDespachoAprobado.getPrefijo().length === 0 || $scope.documentoDespachoAprobado.getNumero().length === 0) {

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe diligenciar los campos del formulario");
                } else {

                    if ($scope.datos_view.seleccionarOtros === true) {

                        that.registrarAprobacion(1);

                    } else {

                        that.validarCantidadCajasNeveras();

                    }
                }
            };

            /**
             * @author Cristian Ardila
             * @fecha  10/02/2016
             * +Descripcion Funcion que se ejecutar cuando el campo numero
             *              pierde el foco, lo que permitira consultar la existencia
             *              del documento 
             */
            $scope.validarExistenciaDocumento = function () {

                if ($scope.datos_view.seleccionarOtros) {

                    that.validarExistenciaDocumentoAprobado(function (data) {

                        if (data.status === 200) {
                            $scope.datos_view.existenciaDocumento = true;
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        } else {
                            $scope.datos_view.existenciaDocumento = false;
                        }

                    });
                } else {
                    that.validarExistenciaDocumentoAprobado(function (data) {

                        if (data.status === 403) {
                            that.obtenerDocumento(function (estado) {
                                $scope.datos_view.existenciaDocumento = true;
                                if (estado) {
                                    $scope.datos_view.existenciaDocumento = false;
                                }
                            });
                        }
                        if (data.status === 200) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        }
                    });
                }
            };

            /**
             * +Descripcion Metodo en el cual se valida si se enviara el prefijo
             *              desde el input o el dropdown cuando se aprobara un
             *              documento
             * @returns {unresolved}
             */
            that.validarPrefijoEmpresasOtras = function () {

                var prefijo;

                if (!$scope.datos_view.seleccionarOtros) {
                    prefijo = $scope.datos_view.prefijoList.prefijo;
                } else {
                    prefijo = $scope.documentoDespachoAprobado.prefijo;
                }
                return prefijo;
            };

            /**
             * @author Cristian Ardila
             * @fecha 10/02/2016
             * +Descripcion Metodo el cual consumira el servicio encargado de
             *              validar si un documento ya se encuentra aprobado
             * @param {type} callback
             * @returns {undefined}
             */
            that.validarExistenciaDocumentoAprobado = function (callback) {

                var prefijo = that.validarPrefijoEmpresasOtras();
                $scope.documentoDespachoAprobado.setPrefijo(prefijo);

                var obj = {
                    session: $scope.session,
                    data: {
                        validacionDespachos: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: prefijo,
                            numero: $scope.documentoDespachoAprobado.numero
                        }
                    }
                };

                Request.realizarRequest(API.VALIDACIONDESPACHOS.CONSULTAR_DOCUMENTO_APROBADO, "POST", obj, function (data) {
                    callback(data);
                });
            };
            /**
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Funcion encargada de invocar el servicio para
             *              obtener el documento consultado
             * @returns {undefined}
             */
            that.obtenerDocumento = function (callback) {

                var prefijo = that.validarPrefijoEmpresasOtras();
                $scope.documentoDespachoAprobado.setPrefijo(prefijo);

                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: prefijo,
                            numero: $scope.documentoDespachoAprobado.numero
                        }
                    }
                };

                Request.realizarRequest(API.VALIDACIONDESPACHOS.OBTENER_DOCUMENTO, "POST", obj, function (data) {

                    if (data.status === 200) {
                        callback(true);
                    } else {
                        callback(false);
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Metodo encargado de invocar el servicio para validar
             *              las cantidades de cajas y neveras que ingrese el 
             *              personal de seguridad cuando va a registrar la aprobacion
             *              de un despacho
             */
            that.validarCantidadCajasNeveras = function () {
                
                that.registrarAprobacion(0);
                //Se inactiva la validacion temporalmente 26/12/2016 hasta verificar el requerimiento
                return;
                
                var prefijo = that.validarPrefijoEmpresasOtras();
                $scope.documentoDespachoAprobado.setPrefijo(prefijo);

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: prefijo,
                            numero: $scope.documentoDespachoAprobado.numero
                        }
                    }
                };

                Request.realizarRequest(API.VALIDACIONDESPACHOS.CANTIDADES_CAJA_NEVERA, "POST", obj, function (data) {

                    if (data.status === 200) {

                        if (parseInt($scope.documentoDespachoAprobado.cantidadCajas) === data.obj.planillas_despachos.totalCajas &&
                                parseInt($scope.documentoDespachoAprobado.cantidadNeveras) === data.obj.planillas_despachos.totalNeveras) {
                            that.registrarAprobacion(0);
                        } else {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Las cantidades de cajas y/o neveras NO coinciden con las cantidades auditadas");
                        }
                    }

                    if (data.status === 500) {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Metodo encargado de registrar la aprobacion por parte
             *              del personal de seguridad sobre un despacho
             * @returns {undefined}
             */
            that.registrarAprobacion = function (estado) {

                var prefijo = that.validarPrefijoEmpresasOtras();
                $scope.documentoDespachoAprobado.setPrefijo(prefijo);

                var obj = {
                    session: $scope.session,
                    data: {
                        validacionDespachos: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: prefijo,
                            numero: $scope.documentoDespachoAprobado.numero,
                            cantidad_cajas: $scope.documentoDespachoAprobado.cantidadCajas,
                            cantidad_neveras: $scope.documentoDespachoAprobado.cantidadNeveras,
                            observacion: $scope.documentoDespachoAprobado.observacion,
                            estado: estado
                        }
                    }
                };

                Request.realizarRequest(API.VALIDACIONDESPACHOS.REGISTRAR_APROBACION, "POST", obj, function (data) {
                    console.log(">>>>>>>>>>>>>> ", data);
                    if (data.status === 200) {
                        $scope.despachoId = data.obj.validacionDespachos.id_aprobacion_planillas;
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        //$state.go('ValidacionEgresos');

                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * +Descripcion: Se activa el cambo de interfaz, cuando se selecciona
             *               el detalle de una aprobacion o se creara una aprobacion
             */
            if ($state.is("ValidacionEgresosDetalle") === true) {

                var documento = localStorageService.get("validacionEgresosDetalle");

                $scope.datos_view.estadoRegistro = 1;
                if (documento) {

                    if (documento.estado === 1) {

                        $scope.datos_view.seleccionarOtros = true;
                        var obj = {
                            session: $scope.session,
                            prefijo: documento.prefijo || 0,
                            numero: documento.numero || 0,
                            empresa_id: documento.empresa,
                            fechaInicial: "",
                            fechaFinal: "",
                            paginaactual: 1,
                            registroUnico: true
                        };

                        ValidacionDespachosService.listarDespachosAprobados(obj, function (data) {

                            if (data.status === 200) {
                                var resultado = data.obj.validacionDespachos[0];
                                console.log("ESTO QUE ES ", resultado);
                                var empresa = EmpresaAprobacionDespacho.get(resultado.razon_social, resultado.empresa_id);
                                $scope.datos_view.empresaSeleccionada = empresa;
                                $scope.despachoId = resultado.id_aprobacion_planillas;
                                $scope.documentoDespachoAprobado = AprobacionDespacho.get(1, resultado.prefijo, resultado.numero, resultado.fecha_registro)
                                $scope.documentoDespachoAprobado.setCantidadCajas(resultado.cantidad_cajas);
                                $scope.documentoDespachoAprobado.setCantidadNeveras(resultado.cantidad_neveras);
                                $scope.documentoDespachoAprobado.setObservacion(resultado.observacion);
                                that.listarImagenes(function(){
                                    
                                });
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });
                    }
                }
                if (documento.estado === 2) {
                    // $scope.datos_view.seleccionarOtros = false;
                    $scope.datos_view.estadoRegistro = 2;
                }
            };
            
          /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de subir archivo
            * @fecha 2016-12-26
            */
            $scope.subirArchivo = function(files) {
                
                var fd = new FormData();
                fd.append("file", files[0]);
                fd.append("session", JSON.stringify($scope.session));
                fd.append("data", JSON.stringify( 
                    {
                        validacionDespachos: {
                            id_aprobacion: $scope.despachoId,
                            prefijo: $scope.documentoDespachoAprobado.prefijo,
                            numero: $scope.documentoDespachoAprobado.numero
                        }
                    }
                ));
                
                
                Request.subirArchivo(API.VALIDACIONDESPACHOS.ADJUNTAR_IMAGEN, fd, function(respuesta) {
                    
                    if(respuesta.status === 200){
                        that.listarImagenes(function(){
                            
                        });
                    } else {

                    }
                    
                });
            };
            
            /*
             * @author Eduar Garcia
             * @fecha 26/12/2016
             * +Descripcion Permite listar las imagenes de una aprobacion
             */
            that.listarImagenes = function (callback) {
                $scope.documentoDespachoAprobado.vaciarImagenes();
                ValidacionDespachosService.listarImagenes($scope.session, $scope.despachoId, function (data) {

                    if (data.status === 200) {
                        var imagenes = data.obj.imagenes;
                        
                        for(var i in imagenes){
                            var _imagen = imagenes[i];
                            var imagen = ImagenAprobacion.get(_imagen.id, _imagen.path);
                            
                            $scope.documentoDespachoAprobado.agregarImagen(imagen);
                            
                        }
                        
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };
            
            /*
             * @author Eduar Garcia
             * @fecha 26/12/2016
             * +Descripcion Modal para mostrar el preview de una imagen
             */
            $scope.onBtnPreview = function(imagen){
                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    scope:$scope,
                    template: '<div class="modal-header" style="text-align:center;">\
                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                  <h4 class="modal-title" >Imagenes adjuntas</h4>\
                              </div>\
                              <!--div class="modal-body">\
                                <img ng-src="/ValidacionDespachos/{{imagen.getPath()}}" onerror="onImageError(this)" class="imagenAprobacion" />\
                              </div -->\
                                <carousel interval="myInterval" active="true">\
                                    <slide ng-repeat="slide in documentoDespachoAprobado.obtenerImagenes()" index="$index" class="carouselSlide">\
                                        <button class="btn btn-sm btn-danger btnImagen" ng-disabled="datos_view.estadoRegistro == 1" ng-click="onBtnBorrarImagen(slide)"><i class="glyphicon glyphicon-trash"></i></button>\
                                        <img ng-src="/ValidacionDespachos/{{slide.getPath()}}" class="imagenAprobacion" onerror="this.src=\'/images/noImage.gif\'" />\
                                        <div class="carousel-caption">\
                                            <h4>{{slide.text}}</h4>\
                                        </div>\
                                    </slide>\
                                </carousel>',
                    controller: ["$modalInstance", "imagen", function($modalInstance, imagen){
                        $scope.imagen = imagen;
                        
                        $scope.close = function(){
                            $modalInstance.close();
                        };
                        
                    }],
                    resolve: {
                        imagen: function() {
                            return imagen;
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);
            };
            
            
            /*
             * @author Eduar Garcia
             * @fecha 26/12/2016
             * +Descripcion Permite borrar una imagen
             */
            $scope.onBtnBorrarImagen = function(imagen){
                
                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Seguro desea borrar la imagen?", function(confirma){
                    if(confirma){                        
                        ValidacionDespachosService.eliminarImagen($scope.session, imagen, function (data) {

                            if (data.status === 200) {
                                that.listarImagenes(function(){

                                });
                            } 
                        });
                    }
                });
                
            };

            /*
             * @author Cristian Ardila
             * @fecha 05/02/2016
             * +Descripcion funcion obtiene las empresas del servidor invocando
             *              el servicio listarEmpresas de 
             *              (ValidacionDespachosSerivice.js)
             * @returns {json empresas}
             */
            that.listarEmpresas = function (callback) {

                ValidacionDespachosService.listarEmpresas($scope.session, $scope.datos_view.termino_busqueda_empresa, function (data) {

                    $scope.empresas = [];
                    if (data.status === 200) {

                        that.render_empresas(data.obj.listar_empresas);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };


            that.render_empresas = function (empresas) {
                for (var i in empresas) {
                    var _empresa = EmpresaAprobacionDespacho.get(empresas[i].razon_social, empresas[i].empresa_id);
                    $scope.empresas.push(_empresa);
                }   
                
                
            };
                   
            /*
             * funcion ejecuta listarCentroUtilidad
             * @returns {lista CentroUtilidad}
             */
            $scope.onSeleccionarEmpresa = function (empresa_Nombre) {
                if (empresa_Nombre.length < 3) {
                    return;
                }
                $scope.datos_view.termino_busqueda_empresa = empresa_Nombre;
                that.listarEmpresas(function () {
                });
            };
            /**
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Metodo encargado de llevar al usuario a la pagina
             *              inicial
             */
            $scope.regresarListaDespachosAprobados = function () {
                if($scope.documentoDespachoAprobado.obtenerImagenes().length === 0 && parseInt($scope.datos_view.estadoRegistro) !== 1){
                    
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Aun no se adjuntan imagenes, si termina el documento no podra modificarse para adjuntar nuevas imagnes. ¿Seguro desea salir?", function(confirmo){
                        if(confirmo){
                            $state.go('ValidacionEgresos');
                        }
                    });
                    
                } else {
                    $state.go('ValidacionEgresos');
                }
                
                
            };

            that.init = function () {
                
                var session = angular.copy(Sesion.getUsuarioActual().getEmpresa());
                var empresaSeleccionadas = EmpresaAprobacionDespacho.get(session.nombre, session.codigo);           
                    $scope.datos_view.empresaSeleccionada = empresaSeleccionadas;
                var prefijoSeleccionados = AprobacionDespacho.get(1, "EFC", "0", "");
                    prefijoSeleccionados.set_descripcion("-DESPACHOS A FARMACIAS Y CLIENTES");
                    $scope.datos_view.prefijoList = prefijoSeleccionados;
                   
            };
            that.init();

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
                // set localstorage
                localStorageService.add("validacionEgresosDetalle", null);
                localStorageService.add("pedido", null);
                $scope.datos_view = null;
                $scope.documentoDespachoAprobado = AprobacionDespacho.get();


            });
        }]);
});