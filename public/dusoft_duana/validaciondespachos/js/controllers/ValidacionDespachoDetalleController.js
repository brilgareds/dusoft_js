
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
        "Usuario", "AprobacionDespacho", "EmpresaAprobacionDespacho", "ValidacionDespachosService", "ImagenAprobacion", "DocumentoDespacho",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Sesion, AprobacionDespacho, EmpresaAprobacionDespacho, ValidacionDespachosService, ImagenAprobacion, DocumentoDespacho) {

            var that = this;
            that.observacionValidacion = "";
            that.documentosSeleccionados;
            // Definicion Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };
            $scope.listaCentrosUtilidad = [];
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
                existenciaDocumento: true,
                disabledBtnGuardar: false,
                documentosMedipol: []

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
             *              de la vista Detalle de despacho aprobado,
             *              si el documento ya fue aprobado, o el numero del documento
             *              contiene comas se mostrar un mensaje de alerta por pantalla
             *              restringiendo la accion al usuario
             */
            $scope.aprobarDespacho = function () {

                if ($scope.datos_view.disabledBtnGuardar === true || $scope.datos_view.existenciaDocumento === true) {

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Algunas restricciones no se estan cumpliendo");
                    return;
                }

                if ($scope.datos_view.seleccionarOtros === true) {

                    if ($scope.datos_view.documentosMedipol.length > 0) {
                        that.registrarAprobacionTabla(1);
                    } else {
                        that.registrarAprobacion(1);
                    }

                } else {

                    that.validarCantidadCajasNeveras();

                }

            };

            /**
             * +Descripcion Metodo encargado de desplegar una ventana con los documentos
             *              que ya han sido aprobados
             */
            that.ventanaDocumentosAprobados = function (documentos) {

                if (documentos) {
                    $scope.documentos = documentos;
                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        template:
                                '<div class="modal-header">\
                        <button type="button" class="close" ng-click="close()">&times;</button>\
                        <h4 class="modal-title">Lista de documentos aprobados</h4>\
                    </div>\
                    <div class="modal-body row">\
                        <div class="col-md-12">\
                            <h4 >Lista Documentos ya aprobados.</h4>\
                            <div class="row" style="max-height:300px; overflow:hidden; overflow-y:auto;">\
                                <div class="list-group">\
                                    <a ng-repeat="documento in documentos" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                        {{ documento.prefijo}} - {{ documento.numero }}\
                                    </a>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="modal-footer">\
                        <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                    </div>',
                        scope: $scope,
                        controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
                                $scope.close = function () {
                                    $scope.datos_view.progresoArchivo = 0;
                                    $modalInstance.close();
                                };
                            }]
                    };
                    var modalInstance = $modal.open($scope.opts);
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

                var prefijo = that.validarPrefijoEmpresasOtras();
                $scope.documentoDespachoAprobado.setPrefijo(prefijo);

                /**
                 * +Descripcion validar que el campo de texto (Numero documento)
                 *              no contenga caracteres de COMA al inicio de la cadena
                 *              se limpiara el campo a CERO y se bloqueara el boton GUARDAR
                 */
                if ($scope.documentoDespachoAprobado.numero[0] === ",") {
                    $scope.datos_view.disabledBtnGuardar = true;
                    $scope.documentoDespachoAprobado.numero = 0;
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Caracter invalido");
                    return;
                } else {
                    $scope.datos_view.disabledBtnGuardar = false;
                }

                if ($scope.datos_view.seleccionarOtros) {

                    var multiplesDocumentosOtros = __multiplesDocumentosOtros(1);
                    that.validarExistenciaDocumentoAprobado(prefijo, multiplesDocumentosOtros, function (data) {

                        if (data.status === 200) {
                            if (data.obj.validacionDespachos.documentosAprobados.length > 0) {
                                $scope.datos_view.existenciaDocumento = true;
                                that.ventanaDocumentosAprobados(data.obj.validacionDespachos.documentosAprobados);
                            } else {
                                $scope.datos_view.existenciaDocumento = false;
                            }
                        } else {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        }
                    });
                } else {

                    var numeroLastIndex = $scope.documentoDespachoAprobado.numero.toString().lastIndexOf(",");

                    /**
                     * +Descripcion Si el campo de texto en el cual se ingresa el numero del documento
                     *              contiene una coma se bloquea el boton guardar y se muestra un mensaje
                     *              de alerta al usuario
                     */
                    if (numeroLastIndex > 0) {

                        $scope.datos_view.disabledBtnGuardar = true;
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El numero no debe contener Comas");
                        return;

                    } else {

                        $scope.datos_view.disabledBtnGuardar = false;

                    }
                    var documentoUnico = [];
                    documentoUnico.push({numero: $scope.documentoDespachoAprobado.numero, prefijo: prefijo})
                    that.validarExistenciaDocumentoAprobado(prefijo, documentoUnico, function (data) {

                        if (data.status === 200) {
                            if (data.obj.validacionDespachos.documentosAprobados.length > 0) {
                                $scope.datos_view.existenciaDocumento = true;
                                that.ventanaDocumentosAprobados(data.obj.validacionDespachos.documentosAprobados);

                            } else {

                                that.obtenerDocumento(function (estado) {
                                    $scope.datos_view.existenciaDocumento = true;
                                    if (estado) {
                                        $scope.datos_view.existenciaDocumento = false;
                                    }
                                });
                            }
                        } else {
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
            that.validarExistenciaDocumentoAprobado = function (prefijo, numeroDocumentos, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        validacionDespachos: {
                            empresa_id: $scope.datos_view.empresaSeleccionada.codigo,
                            prefijo: prefijo,
                            numero: numeroDocumentos//$scope.documentoDespachoAprobado.numero
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
                                parseInt($scope.documentoDespachoAprobado.cantidadNeveras) === parseInt(data.obj.planillas_despachos.totalNeveras)) {
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
             * +Descripcion Funcion que convierte en arreglo una cadena de numeros
             *              separada por comas
             * @fecha 18/10/2017
             */

            function __multiplesDocumentosOtros(estado) {

                var prefijoDocumento = that.validarPrefijoEmpresasOtras();
                var multiplesDocumentosOtros = [];
                var numeroIngresado = $scope.documentoDespachoAprobado.numero.toString();
                if (numeroIngresado === 0) {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe diligenciar los campos del formulario");
                }
                var numeroLastIndex = numeroIngresado.lastIndexOf(",");
                var numero;
                var caracter = ","
                var i = 0;
                var counter = 0;
                var res = 0;
                var totalDecimal = 0;
                var cantidadCajas = 0;
                var totalDecimalNeveras = 0;
                var cantidadNeveras = 0;
                var pos = "";
                /**
                 * +Descripcion Contar las veces que aparece el caracter [COMA] en la cadena String
                 */
                while (i !== -1) {
                    var i = numeroIngresado.indexOf(caracter, i);
                    if (i !== -1) {
                        i++;
                        counter++;
                    }
                }

                /**
                 * +Descripcion (numeroLastIndex >0) que posicion ocupa la COMA en la cadena String
                 *              se validara si la coma se encuentra al final de la cadena
                 *              y posteriormente se substraera toda la cadena excepto la coma
                 */
                if (numeroLastIndex > 0) {

                    if (numeroLastIndex === numeroIngresado.length - 1) {
                        numero = numeroIngresado.substr(0, numeroIngresado.length - 1);

                    } else {
                        numero = numeroIngresado;
                    }

                } else {
                    numero = numeroIngresado;
                }

                var numeroArray = numero.split(",");

                var index = 0;
                res = 0;
                totalDecimal = 0;
                totalDecimalNeveras = 0;
                cantidadCajas = 0;
                cantidadNeveras = 0;
                numeroArray.forEach(function (rowNumero) {

                    index++;
                    cantidadCajas = parseInt($scope.documentoDespachoAprobado.cantidadCajas) / numeroArray.length;
                    pos = cantidadCajas.toString().indexOf(".");
                    if (pos > 0) {
                        res = String(cantidadCajas).substring((pos + 1), cantidadCajas.length);
                        totalDecimal += parseFloat("0." + res);
                    }

                    cantidadNeveras = parseInt($scope.documentoDespachoAprobado.cantidadNeveras) / numeroArray.length;
                    pos = cantidadNeveras.toString().indexOf(".");
                    if (pos > 0) {
                        res = String(cantidadNeveras).substring((pos + 1), cantidadNeveras.length);
                        totalDecimalNeveras += parseFloat("0." + res);
                    }

                    if (index === numeroArray.length - 1) {

                        multiplesDocumentosOtros.push({
                            prefijo: prefijoDocumento,
                            numero: rowNumero,
                            cantidadCajas: parseInt(cantidadCajas) + parseInt(Math.ceil(totalDecimal)),
                            cantidadNeveras: parseInt(cantidadNeveras) + parseInt(Math.ceil(totalDecimalNeveras)),
                            estado: estado
                        });
                        return multiplesDocumentosOtros;
                    }
                    multiplesDocumentosOtros.push({
                        prefijo: prefijoDocumento,
                        numero: rowNumero,
                        cantidadCajas: parseInt(cantidadCajas),
                        cantidadNeveras: parseInt(cantidadNeveras),
                        estado: estado
                    });

                });

                return multiplesDocumentosOtros;

            }
            ;
            /**
             * @author Cristian Ardila
             * @fecha 04/02/2016
             * +Descripcion Metodo encargado de registrar la aprobacion por parte
             *              del personal de seguridad sobre un despacho
             * @returns {undefined}
             */
            that.registrarAprobacion = function (estado) {

                var obj = {};
                var prefijo = that.validarPrefijoEmpresasOtras();
                $scope.documentoDespachoAprobado.setPrefijo(prefijo);
                var multiplesDocumentosOtros = __multiplesDocumentosOtros(estado);
                that.documentosSeleccionados = localStorageService.get("documentosSeleccionados");
                var numeroDocumento = $scope.documentoDespachoAprobado.numero;
                var cantidadCajas = $scope.documentoDespachoAprobado.cantidadCajas;
                var cantidadNeveras = parseInt($scope.documentoDespachoAprobado.cantidadNeveras);

                if (that.documentosSeleccionados) {

                    if (that.documentosSeleccionados.documentos.length > 0) {

                        if (multiplesDocumentosOtros.length > 1) {

                            multiplesDocumentosOtros.forEach(function (row) {
                                that.documentosSeleccionados.documentos.push(row);
                            });

                        } else {

                            if (multiplesDocumentosOtros[0].numero > 0) {
                                that.documentosSeleccionados.documentos.push(multiplesDocumentosOtros[0]);
                            }
                        }

//                    that.observacionValidacion = "";
                        that.observacionValidacion = $scope.documentoDespachoAprobado.observacion !== undefined ? $scope.documentoDespachoAprobado.observacion + " " : "";
//                    that.documentosSeleccionados.documentos.forEach(function(row){
//                       
//                        var observacion="";
//                        if(row.cantidadCajas>0){
//                            var s=row.cantidadCajas>1?"S":"";
//                            observacion=" | CAJA"+s+": " + row.cantidadCajas;
//                        }
//                        if(row.cantidadNeveras>0){
//                            var s=row.cantidadNeveras>1?"S":"";
//                            observacion+=" | NEVERA"+s+": " + row.cantidadNeveras; 
//                        }
//                        that.observacionValidacion += "("+row.prefijo +"-"+ row.numero +" "+observacion+") ";
//                    });
                        obj = {
                            session: $scope.session,
                            data: {
                                validacionDespachos: {
                                    empresaId: $scope.datos_view.empresaSeleccionada.codigo,
                                    observacion: that.observacionValidacion, //+ " - No Cajas: "+ that.documentosSeleccionados.totalCajas
                                    detalle: that.documentosSeleccionados.documentos
                                }
                            }
                        };

                        /**
                         * +Descripcion Si el campo de texto NUMERO no contiene valor,
                         *              este se diligenciara con el primer elemento del arreglo
                         *              que contendra los documentos seleccionados y agregara el numero
                         *              de cajas
                         */
                        if (numeroDocumento === 0 || numeroDocumento === undefined) {
                            $scope.documentoDespachoAprobado.numero = that.documentosSeleccionados.documentos[0].numero;
                            numeroDocumento = that.documentosSeleccionados.documentos[0].numero;
                            $scope.documentoDespachoAprobado.cantidadCajas = that.documentosSeleccionados.totalCajas;
                            $scope.documentoDespachoAprobado.cantidadNeveras = that.documentosSeleccionados.totalNeveras;
                            cantidadCajas = that.documentosSeleccionados.totalCajas;
                            cantidadNeveras = parseInt(that.documentosSeleccionados.totalNeveras);
                        }

                        /**
                         * +Descripcion Si el campo de texto contiene un numero de documento,
                         *              se validara que obligatoriamente tenga unidad de caja o de nevera
                         *              diligenciada
                         */
                        if (numeroDocumento.toString().length > 0 && cantidadCajas.toString() === "0" && cantidadNeveras.toString() === "0") {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe agregar la cantidad correspondiente de Cajas/Neveras");
                            return;
                        }

                        that.ejecutarServicioRegistroAprobacion(obj);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe diligenciar los campos del formulario");
                    }

                } else {

                    if (multiplesDocumentosOtros[0].prefijo.length > 0 && multiplesDocumentosOtros[0].numero > 0 && (cantidadCajas > 0 || cantidadNeveras > 0)) {
                        that.llenarObservacion(1);
                        obj = {
                            session: $scope.session,
                            data: {
                                validacionDespachos: {
                                    empresaId: $scope.datos_view.empresaSeleccionada.codigo,
                                    observacion: that.observacionValidacion,
                                    estado: estado,
                                    detalle: multiplesDocumentosOtros
                                }
                            }
                        };
                        that.ejecutarServicioRegistroAprobacion(obj);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe diligenciar los campos del formulario");
                    }
                }
            };

            /**
             * @author German Galvis
             * @fecha 01/04/2019 DD/MM/YYYY
             * +Descripcion Metodo encargado de registrar la aprobacion por parte
             *              del personal de seguridad sobre un despacho desde la tabla
             * @returns {undefined}
             */
            that.registrarAprobacionTabla = function (estado) {

                var obj = {};
                var prefijo = that.validarPrefijoEmpresasOtras();
                var totalCajas = 0;
                var totalNeveras = 0;
                var documentos = $scope.datos_view.documentosMedipol;
                $scope.documentoDespachoAprobado.setPrefijo(prefijo);
                var numeroDocumento = $scope.documentoDespachoAprobado.numero;

                that.documentosSeleccionados = localStorageService.get("documentosSeleccionados");

                if (documentos.length > 0) {

                    that.observacionValidacion = $scope.documentoDespachoAprobado.observacion !== undefined ? $scope.documentoDespachoAprobado.observacion + " " : "";


                    documentos.forEach(function (data) {

                        var observacion = "";
                        if (data.cantidadCajas > 0) {
                            var s = data.cantidadCajas > 1 ? "S" : "";
                            observacion = " | CAJA" + s + ": " + data.cantidadCajas;
                        }
                        if (data.cantidadNeveras > 0) {
                            var s = data.cantidadNeveras > 1 ? "S" : "";
                            observacion += " | NEVERA" + s + ": " + data.cantidadNeveras;
                        }
                        that.observacionValidacion += "(" + data.prefijo + "-" + data.numero + " " + observacion + ") ";


                        totalCajas = totalCajas + data.cantidadCajas;
                        totalNeveras = totalNeveras + data.cantidadNeveras;


                    });

                    if (that.documentosSeleccionados) {
                        if (that.documentosSeleccionados.documentos.length > 0) {

                            that.documentosSeleccionados.documentos.forEach(function (row) {
                                documentos.push(row);
                            });
                        }
                    }
                    
                    obj = {
                        session: $scope.session,
                        data: {
                            validacionDespachos: {
                                empresaId: $scope.datos_view.empresaSeleccionada.codigo,
                                observacion: that.observacionValidacion,
                                estado: estado,
                                detalle: documentos
                            }
                        }
                    };

                    /**
                     * +Descripcion Si el campo de texto NUMERO no contiene valor,
                     *              este se diligenciara con el primer elemento del arreglo
                     *              que contendra los documentos seleccionados y agregara el numero
                     *              de cajas
                     */
                    if (numeroDocumento === 0 || numeroDocumento === undefined || numeroDocumento === '') {
                        $scope.documentoDespachoAprobado.numero = $scope.datos_view.documentosMedipol[0].numero;
                        $scope.documentoDespachoAprobado.prefijo = $scope.datos_view.documentosMedipol[0].prefijo;
                        numeroDocumento = $scope.datos_view.documentosMedipol[0].numero;
                        $scope.documentoDespachoAprobado.cantidadCajas = totalCajas;
                        $scope.documentoDespachoAprobado.cantidadNeveras = totalNeveras;
                        $scope.documentoDespachoAprobado.observacion = that.observacionValidacion;
                    }



                    that.ejecutarServicioRegistroAprobacion(obj);
                } else {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe diligenciar los campos del formulario");
                }

            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que registrara
             *              la aprobacion del usuario de seguridad
             */
            that.ejecutarServicioRegistroAprobacion = function (obj) {

                Request.realizarRequest(API.VALIDACIONDESPACHOS.REGISTRAR_APROBACION, "POST", obj, function (data) {

                    if (data.status === 200) {
                        $scope.despachoId = data.obj.validacionDespachos.id_aprobacion_planillas;
                        $scope.documentoDespachoAprobado.observacion = that.observacionValidacion;

                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

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
                            registroUnico: true,
                            idPlantilla: documento.id_plantilla
                        };
                        ValidacionDespachosService.listarDespachosAprobados(obj, function (data) {

                            if (data.status === 200) {
                                var resultado = data.obj.validacionDespachos[data.obj.validacionDespachos.length - 1];
                                var empresa = EmpresaAprobacionDespacho.get(resultado.razon_social, resultado.empresa_id);
                                $scope.datos_view.empresaSeleccionada = empresa;
                                $scope.despachoId = resultado.id_aprobacion_planillas;
                                $scope.documentoDespachoAprobado = AprobacionDespacho.get(1, resultado.prefijo, resultado.numero, resultado.fecha_registro)
                                $scope.documentoDespachoAprobado.setCantidadCajas(resultado.cantidad_cajas);
                                $scope.documentoDespachoAprobado.setCantidadNeveras(resultado.cantidad_neveras);
                                $scope.documentoDespachoAprobado.setObservacion(resultado.observacion);
                                that.listarImagenes(function () {

                                });
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });
                    }
                }
                if (documento.estado === 2) {
                    $scope.datos_view.estadoRegistro = 2;
                }
            }
            ;

            /**
             * @author Eduar Garcia
             * +Descripcion Handler del boton de subir archivo
             * @fecha 2016-12-26
             */
            $scope.subirArchivo = function (files) {

                var multiplesDocumentosOtros = __multiplesDocumentosOtros(1);
                var fd = new FormData();
                fd.append("file", files[0]);
                fd.append("session", JSON.stringify($scope.session));
                fd.append("data", JSON.stringify(
                        {
                            validacionDespachos: {
                                id_aprobacion: $scope.despachoId,
                                prefijo: multiplesDocumentosOtros[0].prefijo,
                                numero: multiplesDocumentosOtros[0].numero
                            }
                        }
                ));


                Request.subirArchivo(API.VALIDACIONDESPACHOS.ADJUNTAR_IMAGEN, fd, function (respuesta) {

                    if (respuesta.status === 200) {
                        that.listarImagenes(function () {

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

                        for (var i in imagenes) {
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
            $scope.onBtnPreview = function (imagen) {
                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    scope: $scope,
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
                                        <img ng-src="http://10.0.2.117:8080/images/produccion/ValidacionDespachos/{{slide.getPath()}}" class="imagenAprobacion" onerror="this.src=\'/images/noImage.gif\'" />\
                                                                <div class="carousel-caption">\
                                                                    <h4>{{slide.text}}</h4>\
                                                                </div>\
                                                            </slide>\
                                                        </carousel>',
                    controller: ["$modalInstance", "imagen", function ($modalInstance, imagen) {
                            $scope.imagen = imagen;

                            $scope.close = function () {
                                $modalInstance.close();
                            };

                        }],

                    resolve: {
                        imagen: function () {
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
            $scope.onBtnBorrarImagen = function (imagen) {

                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Seguro desea borrar la imagen?", function (confirma) {
                    if (confirma) {
                        ValidacionDespachosService.eliminarImagen($scope.session, imagen, function (data) {

                            if (data.status === 200) {
                                that.listarImagenes(function () {

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
                if ($scope.documentoDespachoAprobado.obtenerImagenes().length === 0 && parseInt($scope.datos_view.estadoRegistro) !== 1) {

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Aun no se adjuntan imagenes, si termina el documento no podra modificarse para adjuntar nuevas imagnes. ¿Seguro desea salir?", function (confirmo) {
                        if (confirmo) {
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

            /**
             * @author Cristian Ardila
             * +Descripcion Metodo encargado de llenar el campo de texto de la observacion
             *              con los documentos seleccionados
             * @fecha 12/10/2017
             */
            that.llenarObservacion = function (estado) {

                that.observacionValidacion = $scope.documentoDespachoAprobado.observacion !== undefined ? $scope.documentoDespachoAprobado.observacion + " " : "";

                if (estado === 1) {
                    that.documentosSeleccionados = __multiplesDocumentosOtros(estado);
                } else {
                    if (localStorageService.get("documentosSeleccionados")) {
                        that.documentosSeleccionados = localStorageService.get("documentosSeleccionados").documentos;

                    } else {
                        return;
                    }
                }
                var cantidadCajas = 0;
                var cantidadNeveras = 0;
                that.documentosSeleccionados.forEach(function (row) {
                    var observacion = "";


                    if (parseInt(row.cantidadCajas) > 0) {
                        cantidadCajas += row.cantidadCajas;
                        var s = parseInt(row.cantidadCajas) > 1 ? "S" : "";
                        observacion = " | CAJA" + s + ": " + row.cantidadCajas + " ";
                    }
                    if (parseInt(row.cantidadNeveras) > 0) {
                        cantidadNeveras += row.cantidadNeveras;
                        var s = parseInt(row.cantidadNeveras) > 1 ? "S" : "";
                        observacion += " | NEVERA" + s + ": " + row.cantidadNeveras + " ";
                    }
                    that.observacionValidacion += "(" + row.prefijo + "-" + row.numero + " " + observacion + ") "

                });
                $scope.documentoDespachoAprobado.cantidadCajas = cantidadCajas;
                $scope.documentoDespachoAprobado.cantidadNeveras = cantidadNeveras;
                $scope.documentoDespachoAprobado.observacion = that.observacionValidacion;//+ " - Total Cajas: "+ that.documentosSeleccionados.totalCajas

            };

            /**
             * @author Cristian Ardila
             * +Descripcion Ventana encargada de desplegar el grid de datos con
             *              los documentos segun la empresa seleccionada para 
             *              validarlos por parte de la persona encargada de la
             *              seguridad de la bodega
             * @fecha 18/10/2017
             */
            $scope.ventanaMultiplesEFC = function () {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    templateUrl: 'views/validaciondespachos/ventanaValidarEgresos.html',
                    scope: $scope,
                    controller: "VentanaValidarEgresosController",

                };
                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function () {

                    if (localStorageService.get("documentosSeleccionados")) {

                        if (localStorageService.get("documentosSeleccionados").documentos.length > 0) {
                            $scope.datos_view.disabledBtnGuardar = false;
                            $scope.datos_view.existenciaDocumento = false;
                            $scope.despachoId = 0;
                        }
                    }

                    that.llenarObservacion(0);

                }, function () {

                    if (localStorageService.get("documentosSeleccionados")) {
                        if (localStorageService.get("documentosSeleccionados").documentos.length > 0) {
                            $scope.datos_view.disabledBtnGuardar = false;
                            $scope.datos_view.existenciaDocumento = false;
                            $scope.despachoId = 0;
                        }
                    }
                    that.llenarObservacion(0);

                });
            };

            $scope.lista_remisiones_bodega = {
                data: 'datos_view.documentosMedipol',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'get_prefijo()', displayName: 'Prefijo', width: "10%"},
                    {field: 'get_numero()', displayName: 'Nro Documento', width: "20%"},
                    {field: 'cantidadCajas', displayName: 'Cajas', width: "15%"},
                    {field: 'cantidadNeveras', displayName: 'Nevera', width: "15%"},
                    {field: 'temperatura_neveras', displayName: 'Temperatura', width: "15%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminar_documento_tabla(row.entity)" ng-disabled="despachoId > 0" style="margin-right:5px;" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };

            /**
             * @author German Galvis
             * @fecha 01/04/2019 DD/MM/YYYY
             * +Descripcion Agrega un documento al array de seleccionados y selecciona el objeto
             * @returns {undefined}
             */
            $scope.agregarDocumento = function () {

                var prefijo = that.validarPrefijoEmpresasOtras();
                $scope.documentoDespachoAprobado.setPrefijo(prefijo);
                var multiplesDocumentosOtros = __multiplesDocumentosOtros(1);

                if (multiplesDocumentosOtros[0].prefijo.length > 0 && multiplesDocumentosOtros[0].numero > 0 /*&& (cantidadCajas > 0 || cantidadNeveras > 0)*/) {

                    multiplesDocumentosOtros.forEach(function (data) {

                        var documento = DocumentoDespacho.get(0, data.prefijo, data.numero, $scope.datos_view.empresaSeleccionada.codigo);

                        documento.setSeleccionado(true);
                        documento.setCantidadCajas(data.cantidadCajas);
                        documento.setCantidadNeveras(data.cantidadNeveras);
                        documento.setEstado(1);
                        documento.temperatura_neveras = data.cantidadNeveras > 0 ? '3,2' : '';

                        $scope.datos_view.documentosMedipol.push(documento);

                    });
                    that.limpiarVariables();
                } else {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe diligenciar los campos del formulario");
                }
            };


            /**
             * @author German Galvis
             * @fecha 02/04/2019 DD/MM/YYYY
             * +Descripcion Metodo encargado de eliminar un doc de la tabla
             * @returns {undefined}
             */
            $scope.eliminar_documento_tabla = function (documento) {

                for (i = 0; i < $scope.datos_view.documentosMedipol.length; i++) {

                    if ($scope.datos_view.documentosMedipol[i].prefijo === documento.prefijo && $scope.datos_view.documentosMedipol[i].numero === documento.numero) {

                        $scope.datos_view.documentosMedipol.splice(i, 1);
                    }
                }

            };

            /**
             * @author German Galvis
             * @fecha 09/04/2019 DD/MM/YYYY
             * +Descripcion Metodo encargado de activar o desactivar el checkbox para seleccionar otras salidas
             * @returns {undefined}
             */
            $scope.validarCheck = function () {
                var resul = false;

                if ($scope.datos_view.documentosMedipol.length > 0 || $scope.datos_view.estadoRegistro === 1) {
                    resul = true;
                }

                if (localStorageService.get("documentosSeleccionados")) {
                    if (localStorageService.get("documentosSeleccionados").documentos.length > 0) {
                        resul = true;
                    }
                }


                return resul;
            };

            that.limpiarVariables = function () {
                $scope.documentoDespachoAprobado.prefijo = '';
                $scope.documentoDespachoAprobado.numero = '';
                $scope.documentoDespachoAprobado.cantidadCajas = 0;
                $scope.documentoDespachoAprobado.cantidadNeveras = 0;
            };

            that.init();

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                localStorageService.add("documentosSeleccionados", null);
                localStorageService.add("validacionEgresosDetalle", null);
                localStorageService.add("pedido", null);
                $scope.datos_view = null;
                $scope.documentoDespachoAprobado = AprobacionDespacho.get();
            });
        }]);
});