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
		    $scope.root.gravamenesNotaCredito=0;
		    $scope.root.gravamenesNotaDebito=0;
		    $scope.root.totalesNotaCredito=0;
		    $scope.root.totalesNotaDebito=0;
		    
                    $scope.root.filtros = [
                        {tipo: '', descripcion: "Nombre"}
                    ];
		    
		    $scope.root.prefijo= 
                        {prefijo: "Prefijo"}
                    ;
                    $scope.root.filtro = $scope.root.filtros[0];
                    $scope.root.tipoTercero = $scope.root.filtros[0];
		    $scope.root.tab=1;
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
                    that.listarCajaGeneral = function(callback) {
			    if(empresa.getCentroUtilidadSeleccionado()===undefined){
				AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar la bodega");
				return;
			    }
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
//                                console.log("$scope.root.caja::: ", $scope.root.caja);
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
                    that.listarFacturasGeneradas = function(limit,callback) {
			

                        var obj = {
                            session: $scope.session,
                            data: {
                                terminoBusqueda: $scope.root.termino_busqueda_tercero,
				busquedaDocumento: $scope.root.tipoTercero.tipo,
				empresaId: $scope.root.empresaSeleccionada.getCodigo(),
				prefijo: $scope.root.prefijo.prefijo!=='Prefijo'?$scope.root.prefijo.prefijo:'undefined',
				facturaFiscal: $scope.root.factura?$scope.root.factura:'undefined',
				limit:limit
                            }
                        };
                        cajaGeneralService.listarFacturasGeneradas(obj, function(data) {
                            if (data.status === 200) {
                                $scope.root.listarFacturasGeneradasNotas=data.obj.listarFacturasGeneradas;
				callback(data.obj.listarFacturasGeneradas);
                            } else {
                               //AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
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
                    that.listarFacConceptosNotasDetalle = function(parametros) {
			$scope.root.totalesNotaCredito=0;
			$scope.root.totalesNotaDebito=0;
			
			if(parametros===undefined){
			    return;
			}
			var facturaFiscal =parametros.factura_fiscal!==undefined?parametros.factura_fiscal:parametros.facturaFiscal;
                        var obj = {
                            session: $scope.session,
                            data: {
				prefijo: parametros.prefijo,
				facturaFiscal: facturaFiscal
                            }
                        };
                        cajaGeneralService.listarFacConceptosNotas(obj, function(data) {
                            if (data.status === 200) {
                                $scope.root.listarFacConceptosNotasDetalle=data.obj.listarFacConceptosNotas;
					    data.obj.listarFacConceptosNotas.forEach(function(value) {
						
						if(value.nota_contable==='credito'){
						 $scope.root.totalesNotaCredito+=parseInt(value.valor_nota_total);
						 $scope.root.gravamenesNotaCredito+=parseInt(value.valor_gravamen);
						}else{
						 $scope.root.totalesNotaDebito+=parseInt(value.valor_nota_total);
						 $scope.root.gravamenesNotaDebito+=parseInt(value.valor_gravamen);  
						}
						
					    });
                            } else {
				$scope.root.listarFacConceptosNotasDetalle={};
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
                    that.listarPrefijos = function() {

                        var parametros = {
                            session: $scope.session,
                            data: {
                              
                                    empresaId: $scope.root.empresaSeleccionada.getCodigo()
                            }
                        };

                        cajaGeneralService.listarPrefijos(parametros, function(respuesta) {
                            if (respuesta.status === 200) {
                                $scope.root.prefijos = respuesta.obj.listarPrefijos;
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
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
                                if (respuesta) {
                                    that.listarConceptosDetalle();
                                }
				});
				
			    }else if(data.msj.status===409){ 
				AlertService.mostrarVentanaAlerta("Mensaje del sistema",data.msj.msj);
			    }else{
				console.log("data.obj ",data);
				var mensaje = data.obj.guardarFacturaCajaGeneral;
				if(mensaje===""){
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
                    that.guardarFacFacturasConceptosNotas = function(parametros,callback) {
			
                        var parametros = {
                            session: $scope.session,
                            data: {
			        descripcion:parametros.descripcion,
				empresaId:parametros.empresaId,
				bodega:empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada(),
				facturaFiscal:parametros.facturaFiscal,
				porcentajeGravamen:parametros.porcentajeGravamen,
				prefijo:parametros.prefijo,
				swContable:parametros.swContable,
				valorNotaTotal:parametros.valorNotaTotal                            
			    }
                        };
                        cajaGeneralService.insertarFacFacturasConceptosNotas (parametros, function(data) {
                          if (data.status === 200) {
                               callback(true);
                            } else {
				callback(false);
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
			  
                        });
                    };

                    /**
                     * +Descripcion 
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
                    $scope.listaFacturasGeneradas = {
                        data: 'root.listarFacturasGeneradasNotas',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
			columnDefs: [
                            {field: 'No. Factura', width: "10%", displayName: 'No. Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.prefijo}} {{row.entity.factura_fiscal}}</p></div>'}, //
                            {field: 'Identificación', width: "10%", displayName: 'Identificación', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.identificacion}}</p></div>'},
                            {field: 'Tercero', width: "30%", displayName: 'Tercero', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.nombre_tercero}}</p></div>'},
                            {field: 'Fecha Registro', width: "10%", displayName: 'Fecha Registro', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.fecha_registro | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'Usuario', width: "20%", displayName: 'Usuario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.nombre}}</p></div>'},
                            {field: 'Imprimir', width: "10%", displayName: 'Imprimir', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onImprimirFacturaNotas(row.entity)"><span class="glyphicon glyphicon-print"></span> Imprimir</button></div>'},
                            {displayName: "DUSOFT FI", cellClass: "txt-center dropdown-button", width: "10%",
			     cellTemplate: ' <div class="row">\
							  <div ng-if="validarSincronizacion(row.entity.estado)" >\
							    <button class="btn btn-danger btn-xs " ng-click="sincronizarFI(row.entity)">\
								<span class="glyphicon glyphicon-export"> Sincronizar</span>\
							    </button>\
							  </div>\
							  <div ng-if="!validarSincronizacion(row.entity.estado)" >\
							    <button class="btn btn-success btn-xs  disabled">\
								<span class="glyphicon glyphicon-saved"> Sincronizar</span>\
							    </button>\
							  </div>\
						       </div>'
			    }  
			 ]
                    };
                    /**
                     * +Descripcion 
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
                    $scope.listaNotasGeneradas = {
                        data: 'root.listarFacConceptosNotasDetalle',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        showFilter: true,
			columnDefs: [
		            {field: 'No. Nota', width: "10%", displayName: 'No. Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.prefijo_nota}} {{row.entity.numero_nota}}</p></div>'}, //
		            {field: 'No. Factura', width: "10%", displayName: 'No. Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.prefijo}} {{row.entity.factura_fiscal}}</p></div>'}, //
                            {field: 'Nota', width: "10%", displayName: 'Nota', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.nota_contable}}</p></div>'}, //
                            {field: 'Valor Total', width: "12%", displayName: 'Valor Total', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" align="right" >{{row.entity.valor_nota_total | currency:"$ " }}</p></div>'},
                            {field: 'Valor Gravamen', width: "12%", displayName: 'Valor Gravamen', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" align="right" >{{row.entity.valor_gravamen | currency:"$ " }}</p></div>'}, //
                            {field: 'Usuario', width: "26%", displayName: 'Usuario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.nombre}}</p></div>'},
                            {field: 'Fecha', width: "10%", displayName: 'Fecha', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" align="center">{{row.entity.fecha_registro | date:"dd/MM/yyyy hh:mm a"}}</p></div>'},
                            {field: 'Imprimir', width: "10%", displayName: 'Imprimir', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onImprimirNota(row.entity)"><span class="glyphicon glyphicon-print"></span> Imprimir</button></div>'},
                           
			 ]
                    };
                    /**
                     * +Descripcion 
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
                    $scope.listaFacturasGeneradasNotas = { 
                        data: 'root.listarFacturasGeneradasNotas',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        showFilter: true,
			columnDefs: [
                            {field: 'No. Factura', width: "8%", displayName: 'No. Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.prefijo}} {{row.entity.factura_fiscal}}</p></div>'}, //
                            {field: 'Identificación', width: "8%", displayName: 'Identificación', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.identificacion}}</p></div>'},
                            {field: 'Tercero', width: "21%", displayName: 'Tercero', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.nombre_tercero}}</p></div>'},
                            {field: 'Fecha', width: "10%", displayName: 'Fecha Registro', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.fecha_registro | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'Usuario', width: "15%", displayName: 'Usuario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.nombre}}</p></div>'},
                            {field: 'Total', width: "8%", displayName: 'Total', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" ng-value="sumarTotal(row.entity.total_factura)">{{row.entity.total_factura| currency:"$ "}}</p></div>'},
                            {field: 'Gravamen', width: "7%", displayName: 'Gravamen', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" ng-value="sumarGravamen(row.entity.gravamen)">{{row.entity.gravamen| currency:"$ "}}</p></div>'},
                            {field: 'Nota Credito', width: "6%", displayName: 'Nota Credito', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onNotaCredito(row.entity)" ng-disabled="comparaValorNota(1)"><span class="glyphicon glyphicon-plus-sign"></span> Nota</button></div>'},
                            {field: 'Nota Debito', width: "6%", displayName: 'Nota Debito', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onNotaDebito(row.entity)"  ng-disabled="comparaValorNota(0)"><span class="glyphicon glyphicon-plus-sign"></span> Nota</button></div>'},
                            {field: 'Imprimir2', width: "6%", displayName: 'Imprimir', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onImprimirFacturaNotas(row.entity)"><span class="glyphicon glyphicon-print"></span> Imprimir</button></div>'},
                            {displayName: "DUSOFT FI", cellClass: "txt-center dropdown-button", width: "5%",
			     cellTemplate: ' <div class="row">\
							  <div ng-if="validarSincronizacion(row.entity.estado)" >\
							    <button class="btn btn-danger btn-xs disabled">\
								<span class="glyphicon glyphicon-export"> No Sincronizado</span>\
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
		    $scope.root.gravamenes=0;
		    $scope.sumarGravamen=function(gravamen){//root.gravamenes
			$scope.root.gravamenes2=gravamen;
		    };
		    $scope.root.totales=0;
		    $scope.sumarTotal=function(total){
			$scope.root.totales=total;
		    };
		    
		   /*
		    * 1-nota credito 0 - nota debito
		    * @param {type} tipoNota
		    * @returns {disabled}
		    */
		  $scope.comparaValorNota=function(tipoNota){
		      var disabled=false;

		      var totalNota=(parseInt($scope.root.totalesNotaDebito)- parseInt($scope.root.totalesNotaCredito));
                                                           
		      if(tipoNota===1){
			if(parseInt($scope.root.totales) + totalNota <= 0){
			   disabled=true;
			}
		       
		      }else{
			if(parseInt($scope.root.totales) < totalNota ){

			   disabled=true;
			}  		       
		      }
			return disabled;
		  };
		    
		    
		    /**
			* +Descripcion sincronizar FI
			* @author Andres Mauricio Gonzalez
			* @fecha 18/05/2017
			* @returns {undefined}
			*/
		    $scope.sincronizarFI = function(data) {
			that.sincronizarFI(data,function(resultado){
			});
		    };
		    
			/**
			* +Descripcion Metodo encargado de sincronizar en WS FI
			* @author Andres Mauricio Gonzalez
			* @fecha 18/05/2017
			* @returns {undefined}
			*/
		       that.sincronizarFI = function(data,callback) {
                           
			   var obj = {
			       session: $scope.session,
			       data: {
				   sincronizarFI: {
				       empresaId: data.empresa_id,
				       prefijo: data.prefijo,
				       factura: data.factura_fiscal
				   }
			       }
			   };

			   cajaGeneralService.sincronizarFi(obj, function(data) {

			       if (data.status === 200) {
//				   console.log("data.obj.respuestaFI",data.obj.respuestaFI);
				   that.listarFacturasGeneradas('',function(data){
				       
				   });
				   that.mensajeSincronizacion(data.obj.respuestaFI.resultado.mensaje_bd,data.obj.respuestaFI.resultado.mensaje_ws);
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
		  that.mensajeSincronizacion = function (mensaje_bd,mensaje_ws) {

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
		    
		    /**
                     * +Descripcion metodo para validar sincronizacion
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
		    $scope.validarSincronizacion=function(estado){
			var respuesta=false;
			if(estado === '1' || estado === null){
			    respuesta=true;
			}
			return respuesta;
		    };
		    
		    /**
                     * +Descripcion metodo para imprimir las facturas
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
		    $scope.onImprimirFacturaNotas=function(datos){
			 var parametros = {
                            session: $scope.session,
                            data: {
			        prefijo:datos.prefijo,
			        facturaFiscal:datos.factura_fiscal,
				empresaId: $scope.root.empresaSeleccionada.getCodigo()
                            }
                        };
                        cajaGeneralService.imprimirFacturaNotas(parametros, function(data) {
				    
                            if (data.status === 200) {
				var nombre = data.obj.imprimirFacturaNotas;
				$scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
				
                            } else {
				AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        });
		    };
		    
		    /**
                     * +Descripcion metodo para imprimir las facturas
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
		    $scope.onImprimirNota=function(datos){
			 var parametros = {
                            session: $scope.session,
                            data: {
			        prefijo:datos.prefijo,
			        facturaFiscal:datos.factura_fiscal,
			        prefijoNota:datos.prefijo_nota,
			        numeroNota:datos.numero_nota,
				empresaId: datos.empresa_id,
				bodega: datos.bodega
                            }
                        };
                        cajaGeneralService.imprimirNota(parametros, function(data) {
				    
                            if (data.status === 200) {
				var nombre = data.obj.imprimirNota;
				$scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
				
                            } else {
				AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        });
		    };
		    /**
                     * +Descripcion metodo para imprimir las facturas
                     * @author Andres Mauricio Gonzalez
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
		    $scope.onImprimirFacturaNotasDetalle=function(datos){
			 var parametros = {
                            session: $scope.session,
                            data: {
			        prefijo:datos.prefijo,
			        facturaFiscal:datos.factura_fiscal,
				empresaId: $scope.root.empresaSeleccionada.getCodigo()
                            }
                        };
                        cajaGeneralService.imprimirFacturaNotasDetalle(parametros, function(data) {
				    
                            if (data.status === 200) {
				var nombre = data.obj.imprimirFacturaNotas;
				$scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
				
                            } else {
				AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
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
                     * +Descripcion scope del grid para mostrar el detalle de las recepciones
                     * @author Andres Mauricio Gonzalez
                     * @fecha 01/06/2017
                     * @returns {undefined}
                     */		    
		    
                    $scope.onNotaCredito = function(datos) {
			$scope.root.precioNota=0;
			$scope.root.gravamenNota=0;
			$scope.root.descripcionNota="";
			$scope.root.tituloNota="Nota Credito";
                        that.verNota(1,datos);		    
                    };
		    
                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las recepciones
                     * @author Andres Mauricio Gonzalez
                     * @fecha 01/06/2017
                     * @returns {undefined}
                     */
                    $scope.onNotaDebito = function(datos) {
			$scope.root.precioNota=0;
			$scope.root.gravamenNota=0;
			$scope.root.descripcionNota="";
			$scope.root.tituloNota="Nota Debito";
                        that.verNota(0,datos);	
                    };

                    /**
                     * +Descripcion funcion para eliminar temporal
                     * @author Andres Mauricio Gonzalez
                     * @fecha 01/06/2017
                     * @returns {undefined}
                     */
                    $scope.eliminarTmp = function(row) {
//                        console.log("Row", row);

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
		    
		    $scope.root.precioNota=0;
		    $scope.root.gravamenNota=0;
		    $scope.root.descripcionNota="";
                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las recepciones
                     * @author Andres Mauricio Gonzalez
                     * @fecha 01/06/2017
                     * @returns {undefined}
		     * nota : 0-debito 1-credito
                     */
                    that.verNota = function(nota,datos) {
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-smlg',
                            keyboard: true,
                            showFilter: true,
                            cellClass: "ngCellText",
                            templateUrl: 'views/cajaGeneral/vistaNotaCredito.html',
                            scope: $scope,
                            controller: function($scope, $modalInstance) {
						      
                                $scope.cerrar = function() {
                                    $modalInstance.close();
                                };
				
                                $scope.guardarFacFacturasConceptosNotas = function() {				    
				   
				    var valorIngresado=0;
				    if($scope.root.descripcionNota===''){
					 AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe digitar la Descripcion");
					 return;
				    }

				    if($scope.root.precioNota === '' ){
					 AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe digitar el Valor");
					 return;
				    }
				    if($scope.root.gravamenNota === ''){
					 AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe digitar la Descripcion");
					 return;
				    }
				    if(datos.sw_clase_factura==='0'){
					valorIngresado = valorIngresado - parseInt($scope.root.precioNota);
				    }else{
					valorIngresado += parseInt($scope.root.precioNota);
				    }
				    console.log("valor ingresado ",valorIngresado);
				    
				    var totalNota=(parseInt($scope.root.totalesNotaDebito )- parseInt($scope.root.totalesNotaCredito))+ valorIngresado;
				
				    if(parseInt($scope.root.totales) < valorIngresado){
					 AlertService.mostrarVentanaAlerta("Mensaje del sistema","El valor de la Nota Supera el Precio de la Factura");
					 return;
				    }
				    if(totalNota < 0){
					 AlertService.mostrarVentanaAlerta("Mensaje del sistema","El valor de la Nota no debe ser a Menor a la Factura");
					 return;
				    }
				    	    
//				console.log("precio ingresado ",valorIngresado);   
//				console.log("credito total ",parseInt($scope.root.totalesNotaCredito));   
//				console.log("Debito total ",parseInt($scope.root.totalesNotaDebito)); 
//				console.log("total ",totalNota);    
//				console.log("totals ",$scope.root.totales);    
//				return true; 
				    
				    var parametros={
					prefijo : datos.prefijo,
					facturaFiscal : datos.factura_fiscal,
					swContable : nota,
					valorNotaTotal : $scope.root.precioNota,
					porcentajeGravamen : $scope.root.gravamenNota,
					descripcion : $scope.root.descripcionNota,
					empresaId : $scope.root.empresaSeleccionada.getCodigo()
				};
				
                                    that.guardarFacFacturasConceptosNotas(parametros,function(respuesta){
					$modalInstance.close();
					that.listarFacConceptosNotasDetalle(parametros);
					
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
//                        console.log("root.cajas.descripcionCaja>>>> ", $scope.root.cajas);
                        //that.listarConceptosDetalle();
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.onSeleccionFiltroGrupo = function() {
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
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Tipo de Pago');
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
			
			if($scope.root.gravamen === undefined || $scope.root.gravamen === "") {
			   $scope.root.gravamen=0; 
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
			
			that.limpiarVariablesConceptos();
                        callback(true, parametros);
                    };
		    
		    that.limpiarVariablesConceptos=function(){
			$scope.root.precio="";
			$scope.root.pago="";
			$scope.root.gravamen="";
			$scope.root.descripcion="";
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
                     * +Descripcion scope selector estado de pago
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
                     * +Descripcion scope selector tipo factura
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
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 04/02/2016
                     * +Descripcion scope selector del filtro
                     * @param {type} $event
                     */
                    $scope.onSeleccionPrefijo = function(filtro) {
			$scope.root.prefijo.prefijo=filtro.prefijo;
                    };
		    
		    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 28/06/2017
                     * +Descripcion scope seleccionar tab
                     * @param {type} $event
                     */
		      $scope.tipoTab = function (valor){
			  $scope.root.tab=valor;
			  console.log("tab ",$scope.root.tab);
		      };
		      
		      /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 28/06/2017
                     * +Descripcion seleccionar busqueda
                     * @param {type} $event
                     */
                    $scope.buscarTercero = function(event,estado) {
//			if(){
//			}
			console.log("$scope.root.tab",$scope.root.tab);
                        if (event.which === 13) {
			   switch ($scope.root.tab){ 
			       case 1: console.log("buscarTercero");
					that.listarTerceros(function(respuesta) {
					    if (respuesta) {
						that.listarConceptosDetalle();
					    }
					});
					break;
			       case 2:
					that.listarFacturasGeneradas(1,function(data){
					    that.listarFacConceptosNotasDetalle(data[0]);
					});
					break;
			       case 3:				         
				         that.listarFacturasGeneradas('',function(data){
					   
					});
					 break;
			   } 
                        }
                    };
		    
		     /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 28/06/2017
                     * +Descripcion tamaño columna
                     * @param {type} $event
                     */
                    $scope.onColumnaSize = function(tipo) {

                        if (tipo === "AS" || tipo === "MS" || tipo === "CD") {
                            $scope.columnaSizeBusqueda = "col-md-4";
                        } else {
                            $scope.columnaSizeBusqueda = "col-md-4";
                        }

                    };
		    
		     /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 28/06/2017
                     * +Descripcion init
                     * @param {type} $event
                     */
                    that.init(empresa, function() {
                        that.listarTiposTerceros();
//			console.log("prefijo________________");
			that.listarPrefijos();
			
                    });
		    
                    that.listarCajaGeneral(function(data) {

                    });
		    
                }]);
});
