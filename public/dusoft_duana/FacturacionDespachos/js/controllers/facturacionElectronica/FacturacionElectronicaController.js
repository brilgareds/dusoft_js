define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('FacturacionElectronicaController',
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
                        callback();
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
                            {field: 'Fecha Nota', width: "7%", displayName: 'Fecha Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistroNota() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'No. Factura', width: "7%", displayName: 'No. Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getPrefijo()}} {{row.entity.getNumeroFactura()}}</p></div>'}, //
                            {field: 'Tercero', width: "24%", displayName: 'Tercero', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombreTercero()}}</p></div>'},
                            {field: 'Identificación', width: "7%", displayName: 'Identificación', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getIdentificacion()}}</p></div>'},
                            {field: 'Valor Factura', width: "8%", displayName: 'Valor Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getValorFactura()| currency:"$ "}}</p></div>'},
                            {field: 'Saldo Factura', width: "7%", displayName: 'Saldo Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getSaldo()| currency:"$ "}}</p></div>'},
                            {field: 'Fecha Factura', width: "7%", displayName: 'Fecha Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistroFactura() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'Tipo Nota', width: "6%", displayName: 'Tipo Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTipoNota()}}</p></div>'},
                            {field: 'concepto', width: "5%", displayName: 'concepto', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getConcepto()}}</p></div>'},
                            {displayName: "DIAN", cellClass: "txt-center dropdown-button", width: "10%",
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
                            }
                        ]
                    };


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
                        if (estado === '1') {
                            respuesta = true;
                        }
                        return respuesta;
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
                            } else {

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
                            {field: 'Tercero', width: "30%", displayName: 'Tercero', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombreProveedor()}}</p></div>'},
                            {field: 'Valor', width: "10%", displayName: 'Total', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" >{{row.entity.getValorFactura()| currency:"$ "}}</p></div>'},
                            {field: 'Saldo', width: "10%", displayName: 'Saldo', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getSaldo()| currency:"$ "}}</p></div>'},
                            {field: 'Fecha', width: "10%", displayName: 'Fecha Registro', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistro() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'estado', width: "6%", displayName: 'Estado', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistro() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {displayName: "DIAN", cellClass: "txt-center dropdown-button", width: "10%",
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
                            }
                        ]
                    };

                    that.init(empresa, function () {
                    });

                }]);
});
