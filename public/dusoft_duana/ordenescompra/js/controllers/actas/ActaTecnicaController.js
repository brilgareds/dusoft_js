define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('ActaTecnicaController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                "$timeout",
                "$filter",
                "localStorageService",
                "$state",
                "$modalInstance", "socket", "productoItem", "ordenItem",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, $modalInstance, socket, productoItem, ordenItem) {

                    var that = this;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                    $scope.form = {};

                    /*
                     * @Author: AMGT
                     * +Descripcion: seleccion para escoger en el formulario
                     */
                    $scope.filtrosRelacion = [
                        {nombre: "N/A", selec: '0'},
                        {nombre: "Critico", selec: '1'},
                        {nombre: "Mayor", selec: '2'},
                        {nombre: "Menor", selec: '3'}
                    ];

                    /*
                     * @Author: AMGT
                     * +Descripcion: seleccion para escoger en el formulario
                     */
                    $scope.form.filtror = {nombre: "Seleccionar", selec: ''};

                    $scope.onSeleccionFiltro = function (filtro) {
                        $scope.form.filtror = filtro;
                    };

                    /*
                     * @Author: AMGT
                     * +Descripcion: seleccion para escoger en el formulario
                     */
                    $scope.filtrosAprobacion = [
                        {nombre: "Aprobado", selec: '1'},
                        {nombre: "Rechazado", selec: '2'},
                        {nombre: "Retenido en Cuarentena", selec: '3'}
                    ];


                    /*
                     * @Author: AMGT
                     * +Descripcion: metodo que selecciona el filtro
                     */
                    $scope.form.filtroAprobacion = {nombre: "Seleccionar", selec: ''};

                    $scope.onSeleccionFiltroAprobacion = function (filtro) {

                        $scope.form.filtroAprobacion = filtro;
                    };

                    /*
                     * @Author: AMGT
                     * +Descripcion: lista el detalle del producto que se va a realizar el acta tecnica
                     */
                    that.listaProduto = function (callback) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                codigoProducto: productoItem.codigo_producto,
                                ordenPedido: ordenItem.orden.numero_orden
                            }
                        };

                        Request.realizarRequest(API.ACTAS_TECNICAS.LISTA_PRODUCTO, "POST", obj, function (data) {

                            if (data.status === 200) {

                                callback(data.obj.listarProducto[0]);
                            }
                        });
                    };

                    /*
                     * @Author: AMGT
                     * +Descripcion: almacena el formulario de acta tecnica
                     */
                    that.guardarActa = function (callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                formulario: $scope.form
                            }
                        };

                        Request.realizarRequest(API.ACTAS_TECNICAS.GUARDAR_ACTA, "POST", obj, function (data) {

                            if (data.status === 200) {
                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    };

                    /*
                     * @Author: AMGT
                     * +Descripcion: inicializa el formulario
                     */
                    that.listaProduto(function (data) {
                        $scope.form.codigoProducto = productoItem.codigo_producto;
                        $scope.form.orden = ordenItem.orden.numero_orden;
                        $scope.form.nombreComercial = data.descripcion_producto;
                        $scope.form.nombreGenerico = data.nombre_generico;
                        $scope.form.presentacion = data.presentacion_comercial;
                        $scope.form.origen = ordenItem.orden.nombre_tercero;
                        $scope.form.registroSanitario = data.codigo_invima;
                        $scope.form.cantidad = data.cantidad;
                        $scope.form.aparienciaC = {evaluacion_visual_id: 1, sw_cumple: 1};
                        $scope.form.rotuloC = {evaluacion_visual_id: 2, sw_cumple: 1};
                        $scope.form.empaqueC = {evaluacion_visual_id: 3, sw_cumple: 1};
                        $scope.form.otroC = {evaluacion_visual_id: 4, sw_cumple: 1};
                    });

                    /*
                     * @Author: AMGT
                     * +Descripcion: almacena y redirige al servidor la info a guardar del formulario
                     */
                    $scope.guardarActa = function () {
                        that.validarActa(function (data) {
                            if (!data) {
                                var visual = [];
                                visual.push($scope.form.aparienciaC);
                                visual.push($scope.form.rotuloC);
                                visual.push($scope.form.empaqueC);
                                visual.push($scope.form.otroC);
                                $scope.form.visual = visual;
                                $scope.form.usuarioVerifica = Usuario.getUsuarioActual().getModuloActual().variables.PersonaAprueba;
                                that.guardarActa(function (data) {
                                    if (data) {
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Acta Tecnica Guardada Correctamente");
                                        $scope.form = {};
                                        $modalInstance.close();
                                    } else {
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al Guardar Acta Tecnica");
                                    }
                                });
                            }
                        });
                    };

                    /*
                     * @Author: AMGT
                     * +Descripcion: valida los datos ingresados en el formulario
                     */
                    that.validarActa = function (callback) {
                        var dato = false;
                        $scope.form.va_lote = $scope.form.lote === undefined ? true : false;
                        $scope.form.va_vencimiento = $scope.form.vencimiento === undefined ? true : false;
                        $scope.form.va_fabricante = $scope.form.fabricante === undefined ? true : false;
                        if ($scope.form.remision === undefined && $scope.form.factura === undefined) {
                            $scope.form.va_remision = $scope.form.remision === undefined ? true : false;
                            $scope.form.va_factura = $scope.form.factura === undefined ? true : false;
                        } else {
                            $scope.form.va_remision = false;
                            $scope.form.va_factura = false;
                        }
                        $scope.form.va_totalCorrugado = $scope.form.totalCorrugado === undefined ? true : false;
                        $scope.form.va_unCorrugada = $scope.form.unCorrugada === undefined ? true : false;
                        $scope.form.va_corrugadaMst = $scope.form.corrugadaMst === undefined ? true : false;
                        $scope.form.va_unCorugadaMst = $scope.form.unCorugadaMst === undefined ? true : false;
                        $scope.form.va_unidadesMst = $scope.form.unidadesMst === undefined ? true : false;
                        $scope.form.va_unidAdicionales = $scope.form.unidAdicionales === undefined ? true : false;
                        $scope.form.va_argumentacionDobleMst = $scope.form.va_unidAdicionales === true ? false : ($scope.form.argumentacionDobleMst === undefined ? true : false);
                        $scope.form.va_observacionEvaluacion = false;
                        if ($scope.form.otroC.sw_cumple == 0 || $scope.form.empaqueC.sw_cumple == 0 || $scope.form.rotuloC.sw_cumple == 0 || $scope.form.aparienciaC.sw_cumple == 0) {

                            $scope.form.va_observacionEvaluacion = true;
                        }

                        if ($scope.form.filtror.selec !== "" && $scope.form.filtror.selec != 0) {

                            $scope.form.va_filtror = $scope.form.filtror.selec === "" ? true : false;
                            $scope.form.va_cantidadRelacion = $scope.form.cantidadRelacion === undefined ? true : false;
                            $scope.form.va_maximoPermitidoRelacion = $scope.form.maximoPermitidoRelacion === undefined ? true : false;
                            $scope.form.va_observacionDefectuosos = $scope.form.observacionDefectuosos === undefined ? true : false;
                        } else {
                            $scope.form.va_cantidadRelacion = false;
                            $scope.form.va_maximoPermitidoRelacion = false;
                            $scope.form.va_observacionDefectuosos = false;
                        }

                        if ($scope.form.filtroAprobacion.selec != 1 && $scope.form.filtroAprobacion.selec != undefined) {
                            $scope.form.va_observacionConcepto = $scope.form.observacionConcepto === undefined ? true : false;
                        } else {

                            $scope.form.va_observacionConcepto = false;
                        }

                        $scope.form.va_filtroAprobacion = $scope.form.filtroAprobacion.selec === "" ? true : false;

                        $scope.form.va_loteC = $scope.form.loteC === undefined ? true : false;
                        $scope.form.va_vencimientoC = $scope.form.vencimientoC === undefined ? true : false;

                        if ($scope.form.va_lote || $scope.form.va_vencimiento || ($scope.form.va_fabricante && $scope.form.va_remision) || $scope.form.va_factura || $scope.form.va_totalCorrugado ||
                                $scope.form.va_unCorrugada || $scope.form.va_corrugadaMst || $scope.form.va_unCorugadaMst || $scope.form.va_unidadesMst || $scope.root.va_observacionEvaluacion ||
                                $scope.form.va_argumentacionDobleMst || $scope.form.va_filtror || $scope.form.va_filtroAprobacion || $scope.form.va_observacionConcepto ||
                                $scope.form.va_observacionDefectuosos || $scope.form.va_maximoPermitidoRelacion) {
                            dato = true;
                        }

                        callback(dato);
                    };

                    /*
                     * @Author: AMGT
                     * +Descripcion: manejador de la fecha del formulario
                     */
                    $scope.abrir_fecha_corte = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.datepicker_fecha_corte = true;

                    };

                    /*
                     * Inicializacion de variables
                     * * @author AMGT
                     * @param {type} empresa
                     * @param {type} callback
                     * @returns {void}
                     */
                    that.init = function (empresa, callback) {
                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };
                        callback();
                    };



                    /**
                     * @author AMGT
                     * +Descripcion Metodo encargado de cerrar la ventana actual
                     * @fecha 20/02/2018 (DD/MM/YYYY)
                     */
                    $scope.cerrarVentana = function () {

                        $modalInstance.close();
                    };

                    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                        $scope.$$watchers = null;
                        $scope.root = null;

                    });

                }]);
});
