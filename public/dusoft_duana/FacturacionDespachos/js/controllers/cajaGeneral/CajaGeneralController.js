define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('CajaGeneralController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService", "facturacionProveedoresService",
                "EmpresaDespacho", "Usuario", "cajaGeneralService", "CajaGeneral", "Tercero",
                function($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, $modal, socket,
                        facturacionClientesService, facturacionProveedoresService, EmpresaDespacho,
                        Sesion, cajaGeneralService, CajaGeneral, Tercero) {

                    var that = this;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());

                    $scope.root = {
                        caja: []
                    };

                    $scope.root.filtros = [
                        {tipo: '', descripcion: "Nombre"}
                    ];
                    $scope.root.filtro = $scope.root.filtros[0];
                    $scope.root.tipoTercero = $scope.root.filtros[0];

                    /*
                     * Inicializacion de variables
                     * @param {type} empresa
                     * @param {type} callback
                     * @returns {void}
                     */
                    that.init = function(empresa, callback) {
                        // that.cargar_permisos();
                        $scope.root.empresaSeleccionada = EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo());
                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };
                        $scope.documentosAprobados = [];
                        that.centroUtilidad = [];

                        $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";
                        $scope.columnaSizeBusqueda = "col-md-3";
                        $scope.root.visibleBuscador = true;
                        $scope.root.visibleBotonBuscador = true;

                        callback();
                    };

                    /**
                     * +Descripcion Metodo encargado de consultar la caja general
                     * @author Andres Mauricio Gonzalez
                     * @fecha 01/06/2017
                     * @returns {undefined}
                     */
                    // $scope.root.caja = [];
                    that.listarCajaGeneral = function(callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                usuario_id: $scope.session.usuario_id,
                                empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
                                centro_utilidad: empresa.getCentroUtilidadSeleccionado().getCodigo()
                            }
                        };

                        cajaGeneralService.listarCajaGeneral(obj, function(data) {

                            if (data.status === 200) {
                                $scope.root.caja = cajaGeneralService.renderCajaGeneral(data.obj.listarCajaGeneral);
                                //$scope.root.cajas = $scope.root.caja[0];
                                callback(true);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                callback(false);
                            }
                        });
                    };

                    /**
                     * +Descripcion Metodo encargado de consultar grupos
                     * @author Andres Mauricio Gonzalez
                     * @fecha 01/06/2017
                     * @returns {undefined}
                     */
                    that.listarGrupos = function(callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
                                credito: $scope.root.credito, // $scope.root.credito,
                                contado: $scope.root.contado, //$scope.root.contado
                                concepto_id: $scope.root.cajas.conceptoCaja,
                                grupo_concepto: ''
                            }
                        };

                        cajaGeneralService.listarGrupos(obj, function(data) {

                            if (data.status === 200) {
                                console.log("data.obj.listarGrupos ", data.obj.listarGrupos);
                                $scope.root.grupos = cajaGeneralService.renderGrupos(data.obj.listarGrupos);
                                //$scope.root.grupo = $scope.root.grupos[0];
                                callback(true);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                callback(false);
                            }
                        });
                    };

                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara
                     *              los tipos de terceros
                     * @author Andres Mauricio Gonzalez
                     * @fecha 02/05/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarTiposTerceros = function() {

                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_tipo_terceros: {
                                }
                            }
                        };

                        facturacionClientesService.listarTiposTerceros(obj, function(data) {

                            if (data.status === 200) {
                                $scope.root.tipoTerceros = facturacionClientesService.renderListarTipoTerceros(data.obj.listar_tipo_terceros);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });

                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion al API para traer los terceros
                     * @params callback: {function}
                     * @fecha 2017-06-01
                     */
                    that.listarTerceros = function() {

                        var parametros = {
                            session: $scope.session,
                            data: {
                                tercero: {
                                    empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
                                    paginaActual: '1',
                                    busquedaDocumento: $scope.root.tipoTercero.tipo,
                                    terminoBusqueda: $scope.root.termino_busqueda_tercero
                                }
                            }
                        };

                        cajaGeneralService.listarTerceros(parametros, function(respuesta) {
                            if (respuesta.status === 200) {
                                $scope.root.terceros = [];
                                var terceros = respuesta.obj.terceros;

                                for (var i in terceros) {
                                    var _tercero = terceros[i];//nombre, tipo_id_tercero, id, direccion, telefono
                                    var tercero = Tercero.get(_tercero["nombre_tercero"], _tercero["tipo_id_tercero"], _tercero["tercero_id"], _tercero["direccion"], _tercero["telefono"]);
                                    tercero.setCorreo(_tercero["email"]);
                                    $scope.root.terceros.push(tercero);
                                }

                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
                            }
                        });
                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las recepciones
                     * @author Andres Mauricio Gonzalez
                     * @fecha 01/06/2017
                     * @returns {undefined}
                     */
                    $scope.onConcepto = function() {
                        that.ver_recepcion();
                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las recepciones
                     * @author Andres Mauricio Gonzalez
                     * @fecha 01/06/2017
                     * @returns {undefined}
                     */
                    that.ver_recepcion = function() {
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-smlg',
                            keyboard: true,
                            showFilter: true,
                            cellClass: "ngCellText",
                            templateUrl: 'views/cajaGeneral/vistaConceptos.html',
                            scope: $scope,
                            controller: function($scope, $modalInstance) {
                                that.listarGrupos();
                                $scope.cerrar = function() {
                                    $modalInstance.close();
                                };

                            }
                        };
                        var modalInstance = $modal.open($scope.opts);
                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.onSeleccionFiltro = function() {
                        console.log("root.cajas.descripcionCaja>>>> ", $scope.root.cajas.conceptoCaja);
                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.onSeleccionFiltroGrupo = function() {
                        console.log("root.cajas.grupo>>> ", $scope.root.grupo.gruposConcepto);
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.tipoFactura = function(tipo) {
                        $scope.root.credito = false;
                        $scope.root.contado = false;
                        if (tipo === 1) {
                            $scope.root.credito = true;
                        } else {
                            $scope.root.contado = true;
                        }
                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.onSeleccionTipoTercero = function(filtro) {
                        console.log("filtro", filtro);
                        $scope.root.filtro = filtro;
                        $scope.root.tipoTercero = filtro;
                    };

                    $scope.buscarTercero = function(event) {
                        if (event.which === 13) {
                            that.listarTerceros();
//                            console.log("AAAAAAAAAAAAA", $scope.root.termino_busqueda_tercero);
//                            console.log("AAAAAAAAAAAAAQQQ", $scope.root.tipoTercero);
                        }
                    };


                    $scope.onColumnaSize = function(tipo) {

                        if (tipo === "AS" || tipo === "MS" || tipo === "CD") {
                            $scope.columnaSizeBusqueda = "col-md-4";
                        } else {
                            $scope.columnaSizeBusqueda = "col-md-3";
                        }

                    };

                    that.init(empresa, function() {
                        that.listarTiposTerceros();
                    });


                    that.listarCajaGeneral(function(data) {

                    });


                }]);
});
