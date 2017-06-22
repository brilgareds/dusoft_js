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
                        caja: [],
                        grupo: [],
                        cheque: 'default',
                        efectivo: 'default',
                        credito: 'default'
                    };
		    $scope.root.pagoEfectivo = 'default';
                    $scope.root.pagoCredito = 'default';
                    $scope.root.grupo.gruposConcepto = '';
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
                                console.log("$scope.root.caja::: ", $scope.root.caja);
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
                    that.listarGrupos = function(control, callback) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
                                credito: $scope.root.credito, // $scope.root.credito,
                                contado: $scope.root.contado, //$scope.root.contado
                                concepto_id: $scope.root.cajas.conceptoCaja,
                                grupo_concepto: $scope.root.grupo.gruposConcepto
                            }
                        };
                        cajaGeneralService.listarGrupos(obj, function(data) {

                            if (data.status === 200) {
                                if (control) {
                                    $scope.root.grupos = cajaGeneralService.renderGrupos(data.obj.listarGrupos);
                                } else {
                                    $scope.root.conceptos = cajaGeneralService.renderGrupos(data.obj.listarGrupos);
                                }
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
                    that.listarTerceros = function(callback) {

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
                                    var _tercero = terceros[i];
                                    var tercero = Tercero.get(_tercero["nombre_tercero"], _tercero["tipo_id_tercero"], _tercero["tercero_id"], _tercero["direccion"], _tercero["telefono"]);
                                    tercero.setCorreo(_tercero["email"]);
                                    $scope.root.terceros.push(tercero);
                                }
                                callback(true);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
                                callback(false);
                            }
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion al API para traer los terceros
                     * @params callback: {function}
                     * @fecha 2017-06-01
                     */
                    that.listarConceptosDetalle = function() {
                        $scope.root.conceptoTmp = "";
                        if ($scope.root.terceros === undefined || $scope.root.terceros[0] === undefined) {
                            return;
                        }
                        if ($scope.root.cajas === undefined) {
			     AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe seleccionar la Caja");
                            return;
                        }

                        var parametros = {
                            session: $scope.session,
                            data: {
                                datos: {
                                    empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
                                    tipo_id_tercero: $scope.root.terceros[0].getTipoId(),
                                    tercero_id: $scope.root.terceros[0].getId(),
                                    concepto_id: $scope.root.cajas.conceptoCaja
                                }
                            }
                        };

                        cajaGeneralService.listarConceptosDetalle(parametros, function(data) {

                            if (data.status === 200) {
                                $scope.root.conceptoTmp = cajaGeneralService.renderConcepto(data.obj.listarConceptosDetalle);
                                console.log("$scope.root.conceptoTmp::: ", $scope.root.conceptoTmp);
                            } else {
				if(data.obj.listarConceptosDetalle !== '0'){
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
				}
                            }
                        });
                    };
		    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion al API para guardar la factura de caja general
                     * @params callback: {function}
                     * @fecha 2017-06-10
                     */
                    $scope.guardarFacturaCajaGeneral = function() {
			//sw_clase_factura 0=>contado 1=>credito
                        //tipo_factura 5 porque es conceptos
			var tipoPago=($scope.root.pagoCreditoModel === true)?1:0; 
			var prefijo=($scope.root.pagoCreditoModel === true)?$scope.root.cajas.prefijoFacCredito:$scope.root.cajas.prefijoFacContado;
			var claseFactura=($scope.root.cajas.prefijoFacCredito === undefined ? 0: 1);
			var tipoFactura='5';
			var estado='0';
                        var parametros = {
                            session: $scope.session,
                            data: {
			        prefijoFac:prefijo,
				empresaId: $scope.root.empresaSeleccionada.getCodigo(),
				centroUtilidad: empresa.getCentroUtilidadSeleccionado().getCodigo(),
				tipoIdTercero: $scope.root.terceros[0].getTipoId(),
				terceroId: $scope.root.terceros[0].getId(),
				conceptoId: $scope.root.cajas.conceptoCaja,
			        swClaseFactura: claseFactura,
			        tipoFactura : tipoFactura,
			        estado : estado,
				cajaId :$scope.root.cajas.cajaId,
				tipoPago: tipoPago
                            }
                        };
                        cajaGeneralService.guardarFacturaCajaGeneral(parametros, function(data) {

                            if (data.status === 200) {
				var nombre = data.obj.guardarFacturaCajaGeneral;
				$scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
				
				that.listarTerceros(function(respuesta) {
                                console.log("buscarTercero:: ", respuesta);
                                if (respuesta) {
                                    that.listarConceptosDetalle();
                                }
				});
				
                            } else {
				var mensaje = data.obj.guardarFacturaCajaGeneral;
				if(mensaje===""){
                                 AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
				}
                            }
                        });
                    };

                    /**
                     * +Descripcion scope del grid para mostrar los proveedores
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
                    $scope.listaConceptosTmp = {
                        data: 'root.conceptoTmp',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        showFilter: true,
			footerTemplate: '   <div class="row col-md-12">\
                                        <div class="">\
                                            <table class="table table-clear text-center">\
                                                <thead>\
                                                    <tr>\
                                                        <th class="text-center">SUBTOTAL</th>\
                                                        <th class="text-center">IVA</th>\
                                                        <th class="text-center">RET-FTE</th>\
							<th class="text-center">RETE-ICA</th>\
                                                        <th class="text-center">VALOR TOTAL</th>\
                                                    </tr>\
                                                </thead>\
                                                <tbody>\
                                                    <tr>\
                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getSubTotal()| currency:"$ "}}</td> \
                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getIva()| currency:"$ "}}</td> \
                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getValorRetFte() | currency:"$ "}}</td> \
                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getValorRetIca() | currency:"$ "}}</td> \
                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getTotal()| currency:"$ "}}</td> \
                                                    </tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>',
                        columnDefs: [
                            {field: 'Grupo', width: "15%", displayName: 'Grupo', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getDescripcionGrupo()}}</p></div>'}, //
                            {field: 'Concepto', width: "15%", displayName: 'Concepto', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getDescripcionConcepto()}}</p></div>'},
                            {field: 'Tipo Pago', width: "5%", displayName: 'Tipo Pago', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTipoPagoDescripcion()}}</p></div>'},
                            {field: 'Descripcion', width: "44%", displayName: 'Descripcion', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getDescripcion()}}</p></div>'},
                            {field: 'Valor Unitario', width: "8%", displayName: 'Valor Unitario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getValorUnitario()| currency:"$ "}}</p></div>'},
                            {field: 'Valor Gravamen', width: "8%", displayName: 'Valor Gravamen', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.getValorGravamen() | currency:"$ "}}</p></div>'},
                            {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "5%",
                                cellTemplate: ' <div class="row">\
                                                 <button class="btn btn-default btn-xs" ng-click="eliminarTmp(row.entity)">\
                                                     <span class="glyphicon glyphicon-remove"></span>\
                                                 </button>\
                                               </div>'
                            }
                        ]
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
                     * +Descripcion funcion para eliminar temporal
                     * @author Andres Mauricio Gonzalez
                     * @fecha 01/06/2017
                     * @returns {undefined}
                     */
                    $scope.eliminarTmp = function(row) {
                        console.log("Row", row);

                        var parametros = {
                            session: $scope.session,
                            data: {
                                datos: {
                                    rc_concepto_id: row.getRcConceptoId()
                                }
                            }
                        };

                        cajaGeneralService.eliminarTmpDetalleConceptos(parametros, function(data) {

                            if (data.status === 200) {
                                that.listarConceptosDetalle();
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        });
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
                                that.listarGrupos(true, function() {

                                });
                                $scope.cerrar = function() {
                                    $modalInstance.close();
                                };
                                $scope.guardarConcepto = function() {
                                    that.guardarConcepto(function(respuesta, parametros) {
                                        if (respuesta === true) {
                                            that.insertarTmpDetalleConceptos(parametros, function(respuesta) {
                                                that.listarConceptosDetalle();
                                                $modalInstance.close();
                                            });
                                        }
                                    });
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
                        console.log("root.cajas.descripcionCaja>>>> ", $scope.root.cajas);
                        //that.listarConceptosDetalle();
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.onSeleccionFiltroGrupo = function() {
                        console.log("root.cajas.grupo _______________>>> ", $scope.root.grupo.gruposConcepto);
                        that.listarGrupos(false, function() {

                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.validarCaja = function() {
                        var validar = false;
                        if ($scope.root.cajas === undefined || $scope.root.terceros === undefined) {//|| (!($scope.root.pagoEfectivoModel) && !($scope.root.pagoEfectivoModel)
                            validar = true;
                        }
                        return validar;
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.validarConcepto = function() {
                        var validar = false;
                        if ($scope.root.cajas === undefined || $scope.root.terceros === undefined || 
			    $scope.root.conceptoTmp.length === 0 || ($scope.root.pagoEfectivoModel === $scope.root.pagoCreditoModel && 
			    ($scope.root.pagoCreditoModel === undefined) && ($scope.root.pagoCreditoModel === undefined))) {
                            validar = true;
                        }
                        return validar;
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.onSeleccionFiltroConcepto = function() {
                        console.log("root.cajas.grupo>>> ", $scope.root.concepto.conceptoId);
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope guarda los conceptos
                     * @param {type} $event
                     */
                    that.guardarConcepto = function(callback) {
                        var mensaje = '';
                        if ($scope.root.grupo.gruposConcepto === "") {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Grupo');
                            return;
                        }
                        if ($scope.root.concepto === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Concepto');
                            return;
                        }
                        if ($scope.root.concepto.conceptoId === "") {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Concepto');
                            return;
                        }
                        if ($scope.root.pago === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Pago');
                            return;
                        }
                        if ($scope.root.precio === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Digitar un Precio');
                            return;
                        }
                        if (parseInt($scope.root.precio) < 0) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'El Precio debe Ser Mayor o Igual a Cero');
                            return;
                        }
                        if (parseInt($scope.root.gravamen) < 0) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'El Gravamen debe Eer Mayor o Igual a Cero');
                            return;
                        }
                        if ($scope.root.descripcion === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Digitar Una Descripcion');
                            return;
                        }
                        if ($scope.root.descripcion.length <= 6) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'La Descripcion debe Tener como Minimo 6 Caracteres');
                            return;
                        }

                        var parametros = {//$scope.root.caja
                            empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
                            centro_utilidad: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                            concepto_id: $scope.root.concepto.getConceptoId(),
                            grupo_concepto: $scope.root.grupo.getGruposConcepto(),
                            tipo_id_tercero: $scope.root.terceros[0].getTipoId(),
                            tercero_id: $scope.root.terceros[0].getId(),
                            sw_tipo: '0',
                            cantidad: '1',
                            precio: parseInt($scope.root.precio)+parseInt($scope.root.gravamen),
                            valor_total: parseInt($scope.root.precio)+parseInt($scope.root.gravamen),
                            porcentaje_gravamen: $scope.root.gravamen,
                            valor_gravamen: $scope.root.gravamen,
                            descripcion: $scope.root.descripcion,
                            tipo_pago_id: $scope.root.pago
                        };
                        callback(true, parametros);
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion al API para traer los terceros
                     * @params callback: {function}
                     * @fecha 2017-06-01
                     */
                    that.insertarTmpDetalleConceptos = function(parametros, callback) {

                        var parametro = {
                            session: $scope.session,
                            data: {
                                datos: parametros
                            }
                        };
                        cajaGeneralService.insertarTmpDetalleConceptos(parametro, function(respuesta) {
                            if (respuesta.status === 200) {
                               // AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.obj.insertarTmpDetalleConceptos);
                                callback(true);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
                                callback(false);
                            }
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.checkearEstadoPago = function(check) {
                        $scope.root.pago = check;
                        switch (check) {
                            case 1:
                                $scope.root.cheque = 'default';
                                $scope.root.efectivo = 'primary';
                                $scope.root.credito = 'default';
                                break;
                            case 2:
                                $scope.root.cheque = 'default';
                                $scope.root.efectivo = 'default';
                                $scope.root.credito = 'success';
                                break;
                            case 3:
                                $scope.root.cheque = 'danger';
                                $scope.root.efectivo = 'default';
                                $scope.root.credito = 'default';
                                break;
                            default:
                                $scope.root.cheque = 'default';
                                $scope.root.efectivo = 'default';
                                $scope.root.credito = 'default';
                        }
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.tipoFactura = function(tipo) {
                        $scope.root.pagoCreditoModel = false;
                        $scope.root.pagoEfectivoModel = false;
			
			$scope.root.pago = tipo;
                        switch (tipo) {
                            case 0:
                                $scope.root.pagoEfectivo = 'primary';
                                $scope.root.pagoCredito = 'default';
				$scope.root.pagoEfectivoModel = true;
                                break;
                            case 1:
                                $scope.root.pagoEfectivo = 'default';
                                $scope.root.pagoCredito = 'success';
				 $scope.root.pagoCreditoModel = true;
                                break;
                            default:
                                $scope.root.pagoEfectivo = 'default';
                                $scope.root.pagoCredito = 'default';
                        }
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.onSeleccionTipoTercero = function(filtro) {
                        $scope.root.filtro = filtro;
                        $scope.root.tipoTercero = filtro;
                    };

                    $scope.buscarTercero = function(event) {
                        if (event.which === 13) {
                            that.listarTerceros(function(respuesta) {
                                console.log("buscarTercero:: ", respuesta);
                                if (respuesta) {
                                    that.listarConceptosDetalle();
                                }
                            });
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
