define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('NotasController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "EmpresaDespacho", "Usuario", "notasService", "ProductoFacturas", "Tercero",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, $modal, socket,
                        EmpresaDespacho, Sesion, notasService, ProductoFacturas, Tercero) {

                    var that = this;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                    $scope.root = {
                    };

                    $scope.root.prefijoBusquedaNota = 'seleccionar';
                    $scope.root.concepto = [];
                    $scope.root.filtroPrefijo;
                    $scope.root.filtroPrefijo = {descripcion: "seleccionar"};
                    $scope.root.prefijosNotas = [
                        {prefijo: 'NC', descripcion: "Nota Credito"},
                        {prefijo: 'ND', descripcion: "Nota Debito"}
                    ];

                    /*
                     * Inicializacion de variables
                     * @param {type} empresa
                     * @param {type} callback
                     * @returns {void}
                     */
                    that.init = function (empresa, callback) {

                        $scope.root.empresaSeleccionada = EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo());
                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };
                        $scope.documentosAprobados = [];
                        $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";
                        $scope.columnaSizeBusqueda = "col-md-3";
                        $scope.root.visibleBuscador = true;
                        $scope.root.visibleBotonBuscador = true;
                        that.listarPrefijosFacturas();
                        callback();
                    };

                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara 
                     *              los tipos de facturas
                     * @author German Galvis
                     * @fecha 03/09/2018 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarPrefijosFacturas = function () {

                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_prefijos: {
                                    empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                                }
                            }
                        };

                        notasService.listarPrefijosFacturas(obj, function (data) {

                            if (data.status === 200) {

                                $scope.tipoPrefijoFactura = notasService.renderListarTipoTerceros(data.obj.listar_prefijos);
                            } else {
                                AlertService.mostrarMensaje("Mensaje del sistema", data.msj);
                            }

                        });

                    };

                    /**
                     * +Descripcion Metodo encargado de visualizar en el boton del dropdwn
                     *              el tipo de prefijo
                     * @param {type} filtro
                     * @returns {undefined}
                     */
                    $scope.onSeleccionFiltroPrefijos = function (filtroPrefijo) {

                        $scope.root.filtroPrefijo = filtroPrefijo;
                    };

                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara
                     *              los conceptos de las notas credito
                     * @author German Galvis
                     * @fecha 11/08/2018 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarConceptos = function () {
                        var obj = {
                            session: $scope.session,
                            data: {}
                        };

                        notasService.consultarConceptos(obj, function (data) {
                            if (data.status === 200) {
                                $scope.conceptos = data.obj.listarConceptos;
                            } else {
                                AlertService.mostrarMensaje("Mensaje del sistema", data.msj);
                            }
                        });
                    };

                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara
                     *              las Notas
                     * @author German Galvis
                     * @fecha 06/08/2018 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarNotas = function (parametros) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                tipoConsulta: parametros.tipoConsulta,
                                numero: parametros.numero,
                                empresaId: parametros.empresaId
                            }
                        };

                        notasService.consultarNotas(obj, function (data) {
                            if (data.status === 200) {
                                $scope.root.listadoNota = notasService.renderNotas(data.obj.ConsultarNotas);
                            } else {
                                $scope.root.listadoNota = {};
                                AlertService.mostrarMensaje("warning", data.msj);
                            }

                        });
                    };


                    /**
                     * +Descripcion 
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
                    $scope.listaNotas = {
                        data: 'root.listadoNota',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        columnDefs: [
                            {field: 'No. Nota', width: "5%", displayName: 'No. Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNumeroNota()}}</p></div>'}, //
                            {field: 'Valor Nota', width: "7%", displayName: 'Valor Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getValorNota()| currency:"$ "}}</p></div>'},
                            {field: 'Fecha Nota', width: "5%", displayName: 'Fecha Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistroNota() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'No. Factura', width: "5%", displayName: 'No. Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getPrefijo()}} {{row.entity.getNumeroFactura()}}</p></div>'}, //
                            {field: 'Tercero', width: "21%", displayName: 'Tercero', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombreTercero()}}</p></div>'},
                            {field: 'Identificación', width: "7%", displayName: 'Identificación', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getIdentificacion()}}</p></div>'},
                            {field: 'Valor Factura', width: "8%", displayName: 'Valor Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getValorFactura()| currency:"$ "}}</p></div>'},
                            {field: 'Saldo Factura', width: "7%", displayName: 'Saldo Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getSaldo()| currency:"$ "}}</p></div>'},
                            {field: 'Fecha Factura', width: "7%", displayName: 'Fecha Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistroFactura() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'Tipo Nota', width: "6%", displayName: 'Tipo Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTipoNota()}}</p></div>'},
                            {field: 'concepto', width: "5%", displayName: 'concepto', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getConcepto()}}</p></div>'},
                            {displayName: "Opc", width: "5%", cellClass: "txt-center dropdown-button",
                                cellTemplate: '<div class="btn-group">\
                           <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                           <ul class="dropdown-menu dropdown-options">\
                                <li>\
                                   <a href="javascript:void(0);" ng-click="onImprimirNota(row.entity)" class = "glyphicon glyphicon-print"> Imprimir </a>\
                                </li>\
                                <li ng-if="verificaFactuta(row.entity.getPrefijo())">\
                                   <a href="javascript:void(0);" ng-click="imprimirReporteFacturaDian(row.entity)" class = "glyphicon glyphicon-print"> Nota DIAN </a>\
                                </li>\
                           </ul>\
                      </div>'
                            },
                            {displayName: "DUSOFT FI", cellClass: "txt-center dropdown-button", width: "6%",
                                cellTemplate: ' <div class="row">\
							  <div ng-if="validarSincronizacion(row.entity.estado)" >\
							    <button class="btn btn-danger btn-xs " ng-click="sincronizarFI(row.entity)">\
								<span class="glyphicon glyphicon-export"> Sincronizar</span>\
							    </button>\
							  </div>\
							  <div ng-if="!validarSincronizacion(row.entity.estado)" >\
							    <button class="btn btn-success btn-xs  disabled">\
								<span class="glyphicon glyphicon-saved"> Sincronizado</span>\
							    </button>\
							  </div>\
						       </div>'
                            },
                            {displayName: "DIAN", width: "6%", cellClass: "txt-center dropdown-button",
                                cellTemplate: '\
                        <div class="btn-group" >\
                            <div ng-if="(row.entity.sincronizacionDian >= 1)" >\
                               <button class="btn btn-success btn-xs" ng-disabled="{{!(row.entity.sincronizacionDian > 1)}}" data-toggle="dropdown">\
                                 <span class="glyphicon glyphicon-saved"> Sincronizado</span>\
                               </button>\
                            </div>\
                            <div ng-if="(row.entity.sincronizacionDian == 0 && verificaFactuta(row.entity.getPrefijo()))" >\
                               <button class="btn btn-danger btn-xs"  ng-click="generarSincronizacionDian(row.entity)" data-toggle="dropdown">\
                                 <span class="glyphicon glyphicon-export"> Sincronizar</span>\
                               </button>\
                            </div>\
                        </div>'
                            }
                        ]
                    };


                    $scope.verificaFactuta = function (pref) {
                        var prefijo = false;
                        if (pref === 'FDC' || pref === 'FDB') {
                            prefijo = true;
                        }
                        return prefijo;
                    }

                    /**
                     * +Descripcion sincronizar FI
                     * @author German Galvis
                     * @fecha 14/08/2018
                     * @returns {undefined}
                     */
                    $scope.sincronizarFI = function (data) {

                        that.sincronizarFI(data, function (resultado) {
                        });
                    };

                    /**
                     * +Descripcion Metodo encargado de sincronizar en WS FI
                     * @author German Galvis
                     * @fecha 14/08/2018
                     * @returns {undefined}
                     */
                    that.sincronizarFI = function (data, callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                sincronizarFI: {
                                    nota: data.numeroNota,
                                    tipoNota: data.tipoImpresion
                                }
                            }
                        };

                        notasService.sincronizarFi(obj, function (data) {
                            if (data.status === 200) {

                                $scope.buscarNota({which: 13});
                                that.mensajeSincronizacion(data.obj.respuestaFI.resultado.mensaje_bd, data.obj.respuestaFI.resultado.mensaje_ws);
                                callback(true);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                callback(false);
                            }

                        });

                    };

                    /**
                     * +Descripcion mensaje de respuesta de WS
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
                    that.mensajeSincronizacion = function (mensaje_bd, mensaje_ws) {

                        $scope.mensaje_bd = mensaje_bd;
                        $scope.mensaje_ws = mensaje_ws;
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                           <button type="button" class="close" ng-click="close()">&times;</button>\
                                           <h4 class="modal-title">Resultado sincronizacion</h4>\
                                       </div>\
                                       <div class="modal-body">\
                                           <h4>Respuesta WS</h4>\
                                           <h5> {{ mensaje_ws }}</h5>\
                                           <h4>Respuesta BD</h4>\
                                           <h5> {{ mensaje_bd }} </h5>\
                                       </div>\
                                       <div class="modal-footer">\
                                           <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                       </div>',
                            scope: $scope,
                            controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

                                    $scope.close = function () {
                                        $modalInstance.close();
                                    };
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                    };

                    that.mensajeCreacion = function (nota, mensaje_ws) {

                        $scope.nota = nota;
                        $scope.mensaje_ws = mensaje_ws;
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                           <button type="button" class="close" ng-click="close()">&times;</button>\
                                           <h4 class="modal-title">Resultado Creacion</h4>\
                                       </div>\
                                       <div class="modal-body">\
                                           <h4>Numero Nota</h4>\
                                           <h5> {{ nota }} </h5>\
                                           <h4>Respuesta WS</h4>\
                                           <h5> {{ mensaje_ws }}</h5>\
                                       </div>\
                                       <div class="modal-footer">\
                                           <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                       </div>',
                            scope: $scope,
                            controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

                                    $scope.close = function () {
                                        $modalInstance.close();
                                    };
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                    };

                    /**
                     * +Descripcion metodo para validar sincronizacion
                     * @author German Galvis
                     * @fecha 13/08/2018
                     * @returns {undefined}
                     */
                    $scope.validarSincronizacion = function (estado) {
                        var respuesta = false;
                        if (estado === '1' || estado === null) {
                            respuesta = true;
                        }
                        return respuesta;
                    };

                    /**
                     * +Descripcion metodo para imprimir las notas
                     * @author German Galvis
                     * @fecha 10/08/2018
                     * @returns {undefined}
                     */
                    $scope.onImprimirNota = function (datos) {
                        var parametros = {
                            session: $scope.session,
                            data: {
                                numeroNota: datos.numeroNota,
                                empresaId: Usuario.getUsuarioActual().getEmpresa().getCodigo()
                            }
                        };

                        if (datos.tipoImpresion === "D") {
                            notasService.imprimirNota(parametros, function (data) {

                                if (data.status === 200) {
                                    var nombre = data.obj.imprimirNota;
                                    $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");

                                } else {
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                }
                            });

                        } else if (datos.tipoImpresion === "C") {
                            notasService.imprimirNotaCredito(parametros, function (data) {

                                if (data.status === 200) {
                                    var nombre = data.obj.imprimirNota;
                                    $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");

                                } else {
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                }
                            });
                        }
                    };

                    /**
                     * +Descripcion Metodo encargado de imprimir la factura desde certicamara
                     * @author German Galvis
                     * @fecha 25/11/2018
                     * @returns {undefined}
                     */
                    $scope.imprimirReporteFacturaDian = function (entity) {
                        
                        var obj = {
                            session: $scope.session,
                            data: {
                                imprimir_reporte_factura: {
                                    numero: entity.numeroNota,
                                    tipo_documento: entity.tipoImpresion === "C" ? 3 : 2
                                }
                            }
                        };

                        notasService.imprimirReporteFacturaDian(obj, function (data) {
                            
                            if (data.status === 200) {
                                var nombre = data.obj.consulta_factura_generada_detalle.nombre_pdf;
                                $scope.visualizarReporte("/reports/doc_dian/" + nombre, nombre, "_blank");
                            } else if (data.status === 500) {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "<p class='bg-danger'><h3 align='justify'>" + data.msj + "</h3></br></p>");
                                return;
                            }
                        });
                    };

                    /**
                     * +Descripcion Metodo encargado de sincronizar en WS certicamara
                     * @author German Galvis
                     * @fecha 04/09/2018
                     * @returns {undefined}
                     */
                    $scope.generarSincronizacionDian = function (datos) {
                        var parametros = {
                            session: $scope.session,
                            data: {
                                numeroNota: datos.numeroNota,
                                empresaId: Usuario.getUsuarioActual().getEmpresa().getCodigo()
                            }
                        };

                        if (datos.tipoImpresion === "D") {
                            notasService.generarSincronizacionDianDebito(parametros, function (data) {

                                if (data.status === 200) {
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "<h3 align='justify'>" + data.msj + "</h3></br><p class='bg-success'>&nbsp;</p></br>");
                                    that.listarNotas({empresaId: Usuario.getUsuarioActual().getEmpresa().getCodigo(), numero: datos.numeroNota, tipoConsulta: "ND"});
                                    return;
                                } else {
                                    if (data.obj.response.statusCode === 500) {
                                        var msj = data.obj.root.Envelope.Body.Fault.detail.ExcepcionServiciosNegocio.mensaje;
                                        var codigo = data.obj.root.Envelope.Body.Fault.detail.ExcepcionServiciosNegocio.codigo;
                                        var valor = data.obj.root.Envelope.Body.Fault.detail.ExcepcionServiciosNegocio.valor;

                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "<h3 align='justify'>" + msj + "</h3></br><p class='bg-danger'><b>Certicamara dice:</b></p></br>" + codigo + ": " + valor);
                                        return;
                                    }
                                }
                            });

                        } else if (datos.tipoImpresion === "C") {
                            notasService.generarSincronizacionDianCredito(parametros, function (data) {

                                if (data.status === 200) {
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "<h3 align='justify'>" + data.msj + "</h3></br><p class='bg-success'>&nbsp;</p></br>");
                                    that.listarNotas({empresaId: Usuario.getUsuarioActual().getEmpresa().getCodigo(), numero: datos.numeroNota, tipoConsulta: "NC"});
                                    return;
                                } else {
                                    if (data.obj.response.statusCode === 500) {
                                        var msj = data.obj.root.Envelope.Body.Fault.detail.ExcepcionServiciosNegocio.mensaje;
                                        var codigo = data.obj.root.Envelope.Body.Fault.detail.ExcepcionServiciosNegocio.codigo;
                                        var valor = data.obj.root.Envelope.Body.Fault.detail.ExcepcionServiciosNegocio.valor;

                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "<h3 align='justify'>" + msj + "</h3></br><p class='bg-danger'><b>Certicamara dice:</b></p></br>" + codigo + ": " + valor);
                                        return;
                                    }
                                }

                            });
                        }

                    };



                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las facturas
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * @returns {undefined}
                     */

                    $scope.onNotaCreditoValor = function (datos) {
                        $scope.root.mostrarConcepto = true;
                        $scope.root.gravamenNota = 0;
                        $scope.root.descripcionNota = "";
                        $scope.root.tituloNota = "Nota Credito";
                        that.listarConceptos();
                        that.verNotaCredito(1, datos);
                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las facturas
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * @returns {undefined}
                     */

                    $scope.onNotaCreditoDevolucion = function (datos) {
                        $scope.root.mostrarConcepto = false;
                        $scope.root.descripcionNota = "";
                        $scope.root.tituloNota = "Nota Credito";
                        that.verNotaCredito(2, datos);
                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las facturas
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * @returns {undefined}
                     */
                    $scope.onNotaDebito = function (datos) {
                        $scope.root.descripcionNota = "";
                        $scope.root.tituloNota = "Nota Debito";
                        that.verNotaDebito(0, datos);
                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las notas
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * @returns {undefined}
                     * nota : 0-debito 1-credito valor 2-credito devolucion
                     */
                    that.verNotaDebito = function (nota, datos) {

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-xlg-ls',
                            keyboard: true,
                            showFilter: true,
                            cellClass: "ngCellText",
                            templateUrl: 'views/notas/vistaNotaDebito.html',
                            scope: $scope,
                            controller: ['$scope', '$modalInstance', 'notasService', function ($scope, $modalInstance, notasService) {

                                    $scope.root.impuestosnota = {
                                        valorSubtotal: 0,
                                        iva: 0,
                                        retencionFuente: 0,
                                        retencionIca: 0,
                                        totalGeneral: 0
                                    };


                                    /**
                                     * +Descripcion Metodo encargado de invocar el servicio que consulta
                                     *              el detalle de la factura
                                     * @author German Galvis
                                     * @fecha 08/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    that.listarDetalleFactura = function () {

                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresa_id: datos.empresa,
                                                facturaFiscal: datos.numeroFactura,
                                                tipoFactura: nota
                                            }
                                        };

                                        notasService.detalleFactura(obj, function (data) {
                                            if (data.status === 200) {

                                                $scope.root.listadoProductos = notasService.renderProductoFacturas(data.obj.ConsultarDetalleFactura);

                                            } else {
                                                $scope.root.listadoProductos = null;
                                            }

                                        });
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de invocar el servicio que consulta
                                     *              los porcentajes de iva,ica,rete-fte
                                     * @author German Galvis
                                     * @fecha 15/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    that.listarPorcentajes = function () {

                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresaId: datos.empresa,
                                                prefijo: datos.prefijo,
                                                tipo_factura: datos.tipoFactura,
                                                factura_fiscal: datos.numeroFactura
                                            }
                                        };

                                        notasService.listarPorcentajes(obj, function (data) {

                                            if (data.status === 200) {
                                                $scope.root.porcentajes = data.obj.listarPorcentajes;
                                            } else {
                                                $scope.root.porcentajes = null;
                                            }

                                        });
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de invocar el servicio que consulta
                                     *              los porcentajes de iva,ica,rete-fte del año 
                                     * @author German Galvis
                                     * @fecha 10/09/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    that.listarPorcentajesAnio = function () {

                                        var fecha = new Date(datos.fechaRegistro);
                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresaId: datos.empresa,
                                                fecha: fecha.getFullYear()
                                            }
                                        };

                                        notasService.listarPorcentajesAnio(obj, function (data) {

                                            if (data.status === 200) {
                                                $scope.root.porcentajesAnio = data.obj.listarPorcentajesAnio;
                                            } else {
                                                $scope.root.porcentajesAnio = null;
                                            }

                                        });
                                    };

                                    that.listarDetalleFactura();
                                    that.listarPorcentajes();
                                    that.listarPorcentajesAnio();

                                    $scope.cerrar = function () {
                                        $modalInstance.close();
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de validar la activacion del check
                                     * @author German Galvis
                                     * @fecha 09/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.habilitarCheck = function (producto) {
                                        var disabled = false;

                                        if (producto.cantidad_ingresada === undefined || producto.cantidad_ingresada === "" || parseInt(producto.cantidad_ingresada) <= 0) {
                                            disabled = true;
                                        }

                                        return disabled;
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de calcular el valor de la nota del producto
                                     * @author German Galvis
                                     * @fecha 09/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.calcularValor = function (producto) {
                                        var suma;
                                        suma = (parseFloat(producto.cantidad) * parseFloat(producto.cantidad_ingresada));

                                        producto.setTotalNota(suma);

                                    };

                                    /**
                                     * +Descripcion Metodo encargado de calcular los valores de la nota 
                                     * @author German Galvis
                                     * @fecha 09/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.onSeleccionarOpcion = function () {

                                        var subtotal = 0;
                                        var iva = 0;

                                        $scope.root.listadoProductos.forEach(function (data) {
                                            if (data.seleccionado) {
                                                subtotal += data.total_nota;
                                                iva += ((data.cantidad_ingresada * (data.porc_iva / 100)) * data.cantidad);
                                            }
                                        });
                                        $scope.root.impuestosnota.valorSubtotal = subtotal;
                                        $scope.root.impuestosnota.iva = iva;

                                        if ($scope.root.porcentajes.length > 0) {
                                            if ($scope.root.porcentajes[0].valor_total >= parseFloat($scope.root.porcentajesAnio[0].base_rtf)) {
                                                $scope.root.impuestosnota.retencionFuente = ($scope.root.impuestosnota.valorSubtotal * (($scope.root.porcentajes[0].porcentaje_rtf) / 100));
                                            }
                                            if ($scope.root.porcentajes[0].valor_total >= parseFloat($scope.root.porcentajesAnio[0].base_ica)) {
                                                $scope.root.impuestosnota.retencionIca = ($scope.root.impuestosnota.valorSubtotal) * (parseFloat($scope.root.porcentajes[0].porcentaje_ica) / 1000);
                                            }

                                        }

                                        $scope.root.impuestosnota.totalGeneral = $scope.root.impuestosnota.valorSubtotal + $scope.root.impuestosnota.iva - $scope.root.impuestosnota.retencionFuente - $scope.root.impuestosnota.retencionIca;

                                    };

                                    $scope.listaNotas2 = {
                                        data: 'root.listadoProductos',
                                        enableColumnResize: true,
                                        enableRowSelection: false,
                                        enableCellSelection: true,
                                        enableHighlighting: true,
                                        columnDefs: [
                                            {field: 'Codigo', width: "10%", displayName: 'Codigo', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getCodigo()}}</p></div>'}, //
                                            {field: 'Producto', width: "22%", displayName: 'Producto', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombre()}}</p></div>'},
                                            {field: 'Cantidad', width: "6%", displayName: 'Cantidad', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getCantidad()}}</p></div>'},
                                            {field: 'Lote', width: "6%", displayName: 'Lote', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getLote()}}</p></div>'},
                                            {field: 'Valor Unitario', width: "10%", displayName: 'Valor Unitario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getValorUnitario()}}</p></div>'},
                                            {field: 'Valor Nota', width: "10%", displayName: 'Valor Nota', cellClass: "ngCellText",
                                                cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-disabled="row.entity.seleccionado" ng-keyup ="calcularValor(row.entity)" ng-model="row.entity.cantidad_ingresada" validacion-numero-decimal  class="form-control grid-inline-input" name="cantidad_ingresada" id="cantidad_ingresada" /> </div>'},
                                            {field: 'Total Nota', width: "10%", displayName: 'Total Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTotalNota()}}</p></div>'},
                                            {field: 'Observacion', width: "20%", displayName: 'Observacion', cellClass: "ngCellText",
                                                cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text"  ng-model="row.entity.observacion" class="form-control grid-inline-input" name="observacion" id="observacion" /> </div>'},
                                            {field: 'Opcion', width: "6%", displayName: 'Opcion', cellClass: "ngCellText",
                                                cellTemplate: '<div class="col-xs-16 align-items-center">\
                                                                    <input-check  ng-disabled="habilitarCheck(row.entity)" class="btn btn-default btn-xs center-block" ng-model="row.entity.seleccionado"  ng-change="onSeleccionarOpcion()">\
                                                               </div>'}
                                        ]
                                    };


                                    $scope.guardarNotas = function () {

                                        var listado = [];
                                        var i;
                                        for (i = 0; i < $scope.root.listadoProductos.length; i++) {
                                            if ($scope.root.listadoProductos[i].seleccionado) {
                                                listado.push($scope.root.listadoProductos[i]);
                                            }
                                        }



                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresaId: datos.empresa,
                                                factura_fiscal: datos.numeroFactura,
                                                prefijo: datos.prefijo,
                                                valor: $scope.root.impuestosnota.valorSubtotal,
                                                total: $scope.root.impuestosnota.totalGeneral,
                                                tipo_factura: datos.tipoFactura,
                                                listado: listado
                                            }
                                        };

                                        notasService.guardarNota(obj, function (data) {

                                            if (data.status === 200) {
                                                that.mensajeCreacion(data.obj.crearNota, data.obj.respuestaFI.resultado.mensaje_ws);
                                                that.listarFacturasGeneradas();
                                                $modalInstance.close();
                                            } else {
                                                AlertService.mostrarMensaje("warning", data.msj);
                                            }

                                        });


                                    };
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);


                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las notas
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * @returns {undefined}
                     * nota : 0-debito 1-credito valor 2-credito devolucion
                     */
                    that.verNotaCredito = function (nota, datos) {

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-xlg-ls',
                            keyboard: true,
                            showFilter: true,
                            cellClass: "ngCellText",
                            templateUrl: 'views/notas/vistaNotaCredito.html',
                            scope: $scope,
                            controller: ['$scope', '$modalInstance', 'notasService', function ($scope, $modalInstance, notasService) {

                                    $scope.root.impuestosnota = {
                                        valorSubtotal: 0,
                                        iva: 0,
                                        retencionFuente: 0,
                                        retencionIca: 0,
                                        totalGeneral: 0
                                    };


                                    /**
                                     * +Descripcion Metodo encargado de invocar el servicio que consulta
                                     *              el detalle de la factura
                                     * @author German Galvis
                                     * @fecha 08/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    that.listarDetalleFactura = function () {

                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresa_id: datos.empresa,
                                                facturaFiscal: datos.numeroFactura,
                                                factura_agrupada: datos.tipoFactura,
                                                tipoFactura: nota
                                            }
                                        };

                                        notasService.detalleFactura(obj, function (data) {
                                            if (data.status === 200) {
                                                $scope.root.listadoProductos = notasService.renderProductoFacturas(data.obj.ConsultarDetalleFactura);
                                            } else {
                                                $scope.root.listadoProductos = null;
                                            }

                                        });
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de invocar el servicio que consulta
                                     *              los porcentajes de iva,ica,rete-fte
                                     * @author German Galvis
                                     * @fecha 15/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    that.listarPorcentajes1 = function () {

                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresaId: datos.empresa,
                                                prefijo: datos.prefijo,
                                                tipo_factura: datos.tipoFactura,
                                                factura_fiscal: datos.numeroFactura
                                            }
                                        };

                                        notasService.listarPorcentajes(obj, function (data) {

                                            if (data.status === 200) {
                                                $scope.root.porcentajes = data.obj.listarPorcentajes;
                                            } else {
                                                $scope.root.porcentajes = null;
                                            }

                                        });
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de invocar el servicio que consulta
                                     *              los porcentajes de iva,ica,rete-fte del año 
                                     * @author German Galvis
                                     * @fecha 10/09/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    that.listarPorcentajesAnio1 = function () {

                                        var fecha = new Date(datos.fechaRegistro);
                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresaId: datos.empresa,
                                                fecha: fecha.getFullYear()
                                            }
                                        };

                                        notasService.listarPorcentajesAnio(obj, function (data) {

                                            if (data.status === 200) {
                                                $scope.root.porcentajesAnio = data.obj.listarPorcentajesAnio;
                                            } else {
                                                $scope.root.porcentajesAnio = null;
                                            }

                                        });
                                    };

                                    that.listarDetalleFactura();
                                    that.listarPorcentajes1();
                                    that.listarPorcentajesAnio1();

                                    $scope.cerrar = function () {
                                        $scope.root.concepto = [];
                                        $modalInstance.close();
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de validar la activacion del check
                                     * @author German Galvis
                                     * @fecha 09/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.habilitarCheck = function (producto) {
                                        var disabled = false;

                                        if (producto.cantidad_ingresada === undefined || producto.cantidad_ingresada === "" || parseInt(producto.cantidad_ingresada) <= 0) {
                                            disabled = true;
                                        }

                                        return disabled;
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de validar la activacion del check
                                     * @author German Galvis
                                     * @fecha 09/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.ocultarValor = function () {
                                        var disabled = false;

                                        if (nota === 2) {
                                            disabled = true;
                                        }

                                        return disabled;
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de validar la activacion de el valor nota
                                     * @author German Galvis
                                     * @fecha 15/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.habilitarValorNota = function () {
                                        var disabled = false;
                                        if ($scope.root.concepto.id === undefined || $scope.root.concepto.id === 1) {
                                            disabled = true;
                                        }

                                        return disabled;
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de validar el cambio del concepto
                                     * @author German Galvis
                                     * @fecha 15/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.cambioConcepto = function () {
                                        var i;

                                        $scope.root.impuestosnota.valorSubtotal = 0;
                                        $scope.root.impuestosnota.iva = 0;
                                        $scope.root.impuestosnota.retencionFuente = 0;
                                        $scope.root.impuestosnota.retencionIca = 0;
                                        $scope.root.impuestosnota.totalGeneral = 0;

                                        for (i = 0; i < $scope.root.listadoProductos.length; i++) {
                                            if ($scope.root.listadoProductos[i].seleccionado) {
                                                $scope.root.listadoProductos[i].seleccionado = false;
                                            }
                                        }
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de setear el valor total de la factura
                                     * @author German Galvis
                                     * @fecha 15/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.cambioValorNota = function () {

                                        $scope.root.impuestosnota.totalGeneral = parseInt($scope.root.impuestosnota.valorSubtotal);
                                    };

                                    /**
                                     * +Descripcion Metodo encargado de calcular el valor de la nota del producto
                                     * @author German Galvis
                                     * @fecha 09/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.calcularValor = function (producto) {
                                        var suma;
                                        suma = (parseInt(producto.cantidad) * parseInt(producto.cantidad_ingresada));

                                        producto.setTotalNota(suma);

                                    };

                                    /**
                                     * +Descripcion Metodo encargado de calcular los valores de la nota 
                                     * @author German Galvis
                                     * @fecha 09/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.onSeleccionarOpcion = function () {

                                        var subtotal = 0, iva = 0;

                                        $scope.root.listadoProductos.forEach(function (data) {
                                            if (data.seleccionado) {
                                                subtotal += data.total_nota;
                                                iva += ((data.cantidad_ingresada * (data.porc_iva / 100)) * data.cantidad);
                                            }
                                        });
                                        $scope.root.impuestosnota.valorSubtotal = subtotal;
                                        $scope.root.impuestosnota.iva = iva;
                                        if ($scope.root.porcentajes.length > 0) {
                                            if ($scope.root.porcentajes[0].valor_total >= parseFloat($scope.root.porcentajesAnio[0].base_rtf)) {
                                                $scope.root.impuestosnota.retencionFuente = ($scope.root.impuestosnota.valorSubtotal * (($scope.root.porcentajes[0].porcentaje_rtf) / 100));
                                            }
                                            if ($scope.root.porcentajes[0].valor_total >= parseFloat($scope.root.porcentajesAnio[0].base_ica)) {
                                                $scope.root.impuestosnota.retencionIca = ($scope.root.impuestosnota.valorSubtotal) * (parseFloat($scope.root.porcentajes[0].porcentaje_ica) / 1000);

                                            }

                                        }


                                        $scope.root.impuestosnota.totalGeneral = $scope.root.impuestosnota.valorSubtotal + $scope.root.impuestosnota.iva - $scope.root.impuestosnota.retencionFuente - $scope.root.impuestosnota.retencionIca;

                                    };

                                    /**
                                     * +Descripcion Metodo encargado de validar la activacion del boton crear
                                     * @author German Galvis
                                     * @fecha 09/08/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    $scope.habilitarCrear = function () {
                                        var disabled = false;
                                        if (nota === 1 && ($scope.root.concepto.id === undefined || $scope.root.concepto.id === "")) {
                                            disabled = true;
                                        }
                                        if (parseInt($scope.root.impuestosnota.totalGeneral) > parseInt(datos.saldo) && nota === 1) {
                                            AlertService.mostrarMensaje("warning", "el total de la nota no puede superar el saldo " + datos.saldo);
                                            disabled = true;
                                        }
                                        if (parseInt($scope.root.impuestosnota.totalGeneral) <= 0) {
                                            disabled = true;
                                        }


                                        return disabled;
                                    };

                                    $scope.listaNotas2 = {
                                        data: 'root.listadoProductos',
                                        enableColumnResize: true,
                                        enableRowSelection: false,
                                        enableCellSelection: true,
                                        enableHighlighting: true,
                                        columnDefs: [
                                            {field: 'Codigo', width: "10%", displayName: 'Codigo', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getCodigo()}}</p></div>'}, //
                                            {field: 'Producto', width: "22%", displayName: 'Producto', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombre()}}</p></div>'},
                                            {field: 'Cantidad', width: "6%", displayName: 'Cantidad', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getCantidad()}}</p></div>'},
                                            {field: 'Lote', width: "6%", displayName: 'Lote', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getLote()}}</p></div>'},
                                            {field: 'Valor Unitario', width: "10%", displayName: 'Valor Unitario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getValorUnitario()}}</p></div>'},
                                            {field: 'Valor Nota', width: "10%", displayName: 'Valor Nota', cellClass: "ngCellText",
                                                cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-hide="ocultarValor()" ng-disabled="row.entity.seleccionado" ng-keyup ="calcularValor(row.entity)" ng-model="row.entity.cantidad_ingresada" validacion-numero-decimal  class="form-control grid-inline-input" name="cantidad_ingresada" id="cantidad_ingresada" /> </div>'},
                                            {field: 'Total Nota', width: "10%", displayName: 'Total Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTotalNota()}}</p></div>'},
                                            {field: 'Observacion', width: "20%", displayName: 'Observacion', cellClass: "ngCellText",
                                                cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text"  ng-model="row.entity.observacion" class="form-control grid-inline-input" name="observacion" id="observacion" /> </div>'},
                                            {field: 'Opcion', width: "6%", displayName: 'Opcion', cellClass: "ngCellText",
                                                cellTemplate: '<div class="col-xs-16 align-items-center">\
                                                                    <input-check  ng-disabled="habilitarCheck(row.entity)" class="btn btn-default btn-xs center-block" ng-model="row.entity.seleccionado"  ng-change="onSeleccionarOpcion()">\
                                                               </div>'}
                                        ]
                                    };


                                    $scope.guardarNotas = function () {
                                        var listado = [];
                                        var i;
                                        for (i = 0; i < $scope.root.listadoProductos.length; i++) {
                                            if ($scope.root.listadoProductos[i].seleccionado) {
                                                listado.push($scope.root.listadoProductos[i]);
                                            }
                                        }

                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresaId: datos.empresa,
                                                factura_fiscal: datos.numeroFactura,
                                                prefijo: datos.prefijo,
                                                valor: $scope.root.impuestosnota.valorSubtotal,
                                                total: $scope.root.impuestosnota.totalGeneral,
                                                tipo_factura: datos.tipoFactura,
                                                listado: listado,
                                                tipo_nota: nota
                                            }
                                        };

                                        if (nota === 1) {
                                            obj.data.concepto = $scope.root.concepto.id;
                                            obj.data.descripcionNota = $scope.root.descripcionNota;
                                        }
                                        if (nota === 2) {
                                            obj.data.empresa_id_devolucion = listado[0].empresa_devolucion;
                                            obj.data.prefijo_devolucion = listado[0].prefijo_devolucion;
                                            obj.data.numero_devolucion = listado[0].numero_devolucion;
                                        }

                                        notasService.guardarNotaCredito(obj, function (data) {

                                            if (data.status === 200) {
                                                that.mensajeCreacion(data.obj.crearNota, data.obj.respuestaFI.resultado.mensaje_ws);
                                                that.listarFacturasGeneradas();
                                                $modalInstance.close();

                                            } else {
                                                AlertService.mostrarMensaje("warning", data.msj);
                                            }

                                        });


                                    };
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);


                    };

                    /**
                     * @author German Galvis
                     * @fecha 02/08/2018
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.onSeleccionPrefijoNota = function (filtro) {
                        $scope.root.prefijoBusquedaNota = filtro.descripcion;
                        $scope.root.tipoBusquedaNota = filtro.prefijo;
                    };

                    /**
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * +Descripcion seleccionar busqueda
                     * @param {type} $event
                     */
                    $scope.buscarNota = function (event) {

                        if (event.which === 13) {

                            if ($scope.root.prefijoBusquedaNota !== 'seleccionar' && $scope.root.numeroBusquedaNota !== '') {
                                var parametros = {
                                    tipoConsulta: $scope.root.tipoBusquedaNota,
                                    numero: $scope.root.numeroBusquedaNota,
                                    empresaId: $scope.root.empresaSeleccionada.getCodigo()
                                };
                                that.listarNotas(parametros);
                            }
                        }
                    };

                    /**
                     * @author German Galvis
                     * @fecha 02/08/2018
                     * +Descripcion seleccionar busqueda
                     * @param {type} $event
                     */
                    $scope.buscarTercero = function (event) {
                        if (event.which === 13) {
                            that.listarFacturasGeneradas();
                        }
                    };

                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara
                     *              las facturas
                     * @author German Galvis
                     * @fecha 02/08/2018 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarFacturasGeneradas = function () {

                        var obj = {
                            session: $scope.session,
                            data: {
                                empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                                prefijo: $scope.root.filtroPrefijo.descripcion,
                                facturaFiscal: $scope.root.factura ? $scope.root.factura : 'undefined'
                            }
                        };
                        notasService.listarFacturas(obj, function (data) {

                            if (data.status === 200) {

                                $scope.root.listarFacturas = notasService.renderFacturas(data.obj.listarFacturas);

                            } else {
                                $scope.root.listarFacturas = null;

                            }

                        });
                    };

                    /**
                     * +Descripcion 
                     * @author German Galvis
                     * @fecha 08/02/2018 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    $scope.listaFacturas = {
                        data: 'root.listarFacturas',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        showFilter: true,
                        columnDefs: [
                            {field: 'No. Factura', width: "9%", displayName: 'No. Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getPrefijo()}} {{row.entity.getNumeroFactura()}}</p></div>'}, //
                            {field: 'Identificación', width: "15%", displayName: 'Identificación', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getIdentificacion()}}</p></div>'},
                            {field: 'Tercero', width: "35%", displayName: 'Tercero', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombreProveedor()}}</p></div>'},
                            {field: 'Valor', width: "10%", displayName: 'Total', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" >{{row.entity.getValorFactura()| currency:"$ "}}</p></div>'},
                            {field: 'Saldo', width: "10%", displayName: 'Saldo', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.saldo}}</p></div>'},
                            {field: 'Fecha', width: "10%", displayName: 'Fecha Registro', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistro() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'NC', width: "6%", displayName: 'NC', cellClass: "ngCellText", cellTemplate: `
                                <!--<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-disabled="row.entity.deshabilitarNotaCredito" ng-click="btn_seleccionar_nota(row.entity)" ><span class="glyphicon glyphicon-plus-sign"></span></button></div>-->
                                <div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="btn_seleccionar_nota(row.entity)" ><span class="glyphicon glyphicon-plus-sign"></span></button></div>`
                            },
                            {field: 'ND', width: "6%", displayName: 'ND', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onNotaDebito(row.entity)"><span class="glyphicon glyphicon-plus-sign"></span></button></div>'}
                        ]
                    };

                    /**
                     * +Descripcion Metodo encargado de validar la activacion del check
                     * @author German Galvis
                     * @fecha 15/08/2018 DD/MM/YYYY
                     * @returns {undefined}
                     */
//                    $scope.habilitarCredito = function (factura) {
//                        console.log("hola",factura);
//                        var disabled = false;
//                        if (factura.saldo === undefined || factura.saldo === "" || parseInt(factura.saldo) <= 0) {
//                            disabled = true;
//                        }
//
//                        return disabled;
//                    };


                    $scope.btn_seleccionar_nota = function (datos) {

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Seleccione tipo de nota credito</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">Cerrar</button>\
                                    <button class="btn btn-primary" ng-disabled="habilitarCredito()" ng-click="valor()">Valor</button>\
                                    <button class="btn btn-primary" ng-click="devolucion()">Devolucion</button>\
                                </div>',
                            scope: $scope,
                            controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

                                    $scope.habilitarCredito = function () {

                                        var disabled = false;
                                        if (datos.saldo === undefined || datos.saldo === "" || parseInt(datos.saldo) <= 0) {
                                            disabled = true;
                                        }

                                        return disabled;
                                    };
                                    $scope.valor = function () {
                                        $scope.onNotaCreditoValor(datos);
                                        $modalInstance.close();
                                    };
                                    $scope.devolucion = function () {
                                        $scope.onNotaCreditoDevolucion(datos);
                                        $modalInstance.close();
                                    };
                                    $scope.close = function () {
                                        $modalInstance.close();
                                    };
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                    };

                    that.init(empresa, function () {
                    });

                }]);
});
