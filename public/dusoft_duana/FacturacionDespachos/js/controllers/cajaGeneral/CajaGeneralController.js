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
		    
		    $scope.root.termino_busqueda_tercero={};
		    
                    $scope.root.filtros = [
                        {tipo: '', descripcion: "Nombre"}
                    ];
		    
		    $scope.root.prefijo= 
                        {prefijo: "Prefijo"}
                    ;
                    $scope.root.filtro = $scope.root.filtros[0];
                    $scope.root.tipoTercero = $scope.root.filtros[0];
		    $scope.root.tab=1;
		    $scope.terceroSeleccionado=null;
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
			$scope.root.grupos = null;
			$scope.root.conceptos = null;

                        var obj = {
                            session: $scope.session,
                            data: {
                                empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
                                credito: $scope.root.credito, 
                                contado: $scope.root.contado,
                                concepto_id: $scope.root.cajas.conceptoCaja,
                                grupo_concepto: $scope.root.grupo.gruposConcepto
                            }
                        };
                        cajaGeneralService.listarGrupos(obj, function(data) {

                            if (data.status === 200) {
                                if (control) {
                                    $scope.root.grupos = cajaGeneralService.renderGrupos(data.obj.listarGrupos);
				    $scope.root.grupo=$scope.root.grupos;
				    $scope.root.concepto =null;
                                } else {
                                    $scope.root.conceptos = cajaGeneralService.renderGrupos(data.obj.listarGrupos);
				    $scope.root.concepto = $scope.root.conceptos;
                                }
                               
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
				console.log("listarFacturasGeneradas");
//                                $scope.root.listarFacturasGeneradasNotas=data.obj.listarFacturasGeneradas;
				$scope.root.listarFacturasGeneradasNotas=cajaGeneralService.renderFacturasProveedores(data.obj.listarFacturasGeneradas);
				
				callback(data.obj.listarFacturasGeneradas);
                            } else {
				$scope.root.listarFacturasGeneradasNotas=null;
                               //AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
			       callback(false);
                            }

                        });
                    };

		    /**
                     * +Descripcion Metodo encargado de listar los impuestos de un cliente
                     * @author Andres Mauricio Gonzalez
                     * @fecha 27/07/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
		    that.listarImpuestosTercero = function() {
			if($scope.root.listarFacturasGeneradasNotas===undefined){
			    return;
			}
			var fecha = new Date($scope.root.listarFacturasGeneradasNotas[0].getFechaRegistro());
			var anio = fecha.getFullYear();
			var obj = {
			    session: $scope.session,
			    data: {
				empresaId: $scope.root.empresaSeleccionada.getCodigo(),
				tipoIdTercero: $scope.root.listarFacturasGeneradasNotas[0].getTipoTercero(),
				terceroId: $scope.root.listarFacturasGeneradasNotas[0].getTerceroId(),
				anio: anio
			    }
			};
			cajaGeneralService.listarImpuestosTercero(obj, function(data) {
			    
			    if (data.status === 200) {
                              data.obj.factura=$scope.root.listarFacturasGeneradasNotas[0];
			      $scope.root.listarImpuestos=data.obj;
//			      that.traerPorcentajeImpuestosNotas(data.obj,function(datas){
//				  console.log("Data ",datas);
//			      });
				
			    } else {
				AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
			    }

			});
		    };
		    
                    /**
                     * +Descripcion Metodo encargado de calcular los impuestos de una nota
                     * @author Andres Mauricio Gonzalez
                     * @fecha 27/07/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
		     that.traerPorcentajeImpuestosNotas = function(callback) {
		        var objs=$scope.root.listarImpuestos; 
			var parametros=objs.retencion;
			var terceroImpuesto=objs.retencionTercero;
			var obj=objs.factura;
			
			$scope.root.totalNota=$scope.root.precioNota;
			$scope.root.totalGravamenNota=$scope.root.gravamenNota;

			    var impuestos = {
				porcentajeRtf: '0',
				porcentajeIca: '0',
				porcentajeReteiva: '0',
				porcentajeCree: '0',
				swRtf: parametros.sw_rtf,
				swIca: parametros.sw_ica,
				swReteiva: parametros.sw_reteiva,
				totalGeneral:0,
				retencionFuente:0,
				retencionIca:0,
				valorSubtotal:0,
				valorSubtotalFactura:0
			    };
			    console.log("saldo",obj.getSaldo());
			    impuestos.valorSubtotalFactura = obj.getSaldo();
			//    impuestos.valorSubtotalFactura = obj.totalFactura - obj.totalGravamen;

			    if (parametros.sw_rtf === '2' || parametros.sw_rtf === '3'){
				
				 if (parseInt(impuestos.valorSubtotalFactura) >= parseInt(parametros.base_rtf)) {
				                                         
				     impuestos.retencionFuente = $scope.root.totalNota * (terceroImpuesto.porcentaje_rtf / 100);				   

				 }
			    }

			    if (parametros.sw_ica === '2' || parametros.sw_ica === '3'){
				
				 if (parseInt(impuestos.valorSubtotalFactura) >= parseInt(parametros.base_ica)) {
				     
				    impuestos.retencionIca = $scope.root.totalNota * (terceroImpuesto.porcentaje_ica / 1000);
				 }
			    }

			    impuestos.valorSubtotal =$scope.root.totalNota;
			    impuestos.iva = parseInt($scope.root.totalGravamenNota)+0;	    
			    impuestos.totalGeneral = parseInt(impuestos.valorSubtotal) + parseInt(impuestos.iva) - (parseInt(impuestos.retencionFuente) + parseInt(impuestos.retencionIca));
			    callback(impuestos);
			    return;
		    };
		    
		    
		    
                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara
                     *              los tipos de terceros
                     * @author Andres Mauricio Gonzalez
                     * @fecha 02/05/2017 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarFacConceptosNotasDetalle = function(parametros) {
			console.log("listarFacConceptosNotasDetalle parametros:: ",parametros);
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
			console.log("____",$scope.root.termino_busqueda_tercero);
                        if($scope.root.termino_busqueda_tercero===undefined){
			    $scope.root.termino_busqueda_tercero='';
			}
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
//			     AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe seleccionar la Caja");
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
                            }else if(data.msj.status===404){
				
			    }else {
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
				valorNotaTotal:parametros.valorNotaTotal,
			     valorNotaImpuestos:$scope.root.impuestos.totalGeneral
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
                            {field: 'No. Factura', width: "10%", displayName: 'No. Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getPrefijo()}} {{row.entity.getNumeroFactura()}}</p></div>'}, //
                            {field: 'Identificación', width: "10%", displayName: 'Identificación', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getIdentificacion()}}</p></div>'},
                            {field: 'Tercero', width: "30%", displayName: 'Tercero', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombreProveedor()}}</p></div>'},
                            {field: 'Fecha Registro', width: "10%", displayName: 'Fecha Registro', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistro() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'Usuario', width: "20%", displayName: 'Usuario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombreUsuario()}}</p></div>'},
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
                            {field: 'SubTotal', width: "11%", displayName: 'SubTotal', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" align="right" >{{row.entity.valor_nota_total | currency:"$ " }}</p></div>'},
                            {field: 'Valor Gravamen', width: "11%", displayName: 'Valor Gravamen', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" align="right" >{{row.entity.valor_gravamen | currency:"$ " }}</p></div>'}, //
                            {field: 'Valor Total', width: "11%", displayName: 'Valor Total', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" align="right" >{{row.entity.total | currency:"$ "}}</p></div>'}, //
                            {field: 'Usuario', width: "13%", displayName: 'Usuario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.nombre}}</p></div>'},
                            {field: 'Fecha', width: "8%", displayName: 'Fecha', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" align="center">{{row.entity.fecha_registro | date:"dd/MM/yyyy hh:mm a"}}</p></div>'},
                            {field: 'Imprimir', width: "8%", displayName: 'Imprimir', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onImprimirNota(row.entity)"><span class="glyphicon glyphicon-print"></span> Imprimir</button></div>'},
                            {displayName: "DUSOFT FI", cellClass: "txt-center dropdown-button", width: "8%",
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
                            {field: 'No. Factura', width: "70px", displayName: 'No. Factura', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getPrefijo()}} {{row.entity.getNumeroFactura()}}</p></div>'}, //
                            {field: 'Identificación', width: "70px", displayName: 'Identificación', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getIdentificacion()}}</p></div>'},
                            {field: 'Tercero', width: "76px", displayName: 'Tercero', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombreProveedor()}}</p></div>'},
                            {field: 'Fecha', width: "70px", displayName: 'Fecha Registro', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistro() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'Usuario', displayName: 'Usuario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombreUsuario()}}</p></div>'},
                            {field: 'Saldo', width: "70px", displayName: 'Saldo', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" ng-value="sumarTotal(row.entity.getSaldo())">{{row.entity.getSaldo()| currency:"$ "}}</p></div>'},
                            {field: 'SubTotal', width: "70px", displayName: 'SubTotal', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" ng-value="sumarTotal(row.entity.getSubTotal())">{{row.entity.getSubTotal()| currency:"$ "}}</p></div>'},
                            {field: 'Gravamen', width: "70px", displayName: 'Gravamen', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" ng-value="sumarGravamen(row.entity.getGravamen())">{{row.entity.getGravamen()| currency:"$ "}}</p></div>'},
			    {field: 'Total', width: "70px", displayName: 'Total', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase" >{{row.entity.getValorFactura()| currency:"$ "}}</p></div>'},
                            {field: 'NC', width: "70px", displayName: 'NC', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onNotaCredito(row.entity)" ng-disabled="comparaValorNota(1) || !validarSincronizacion(row.entity.estado)"><span class="glyphicon glyphicon-plus-sign"></span></button></div>'},
                            {field: 'ND', width: "70px", displayName: 'ND', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onNotaDebito(row.entity)"  ng-disabled="comparaValorNota(0) || !validarSincronizacion(row.entity.estado)"><span class="glyphicon glyphicon-plus-sign"></span></button></div>'},
                            {field: 'Imprimir2', width: "70px", displayName: 'Imprimir', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onImprimirFacturaNotas(row.entity)"><span class="glyphicon glyphicon-print"></span></button></div>'},
                            {displayName: "DUSOFT FI", cellClass: "txt-center dropdown-button", width: "50px",
			     cellTemplate: ' <div class="row">\
							  <div ng-if="validarSincronizacion(row.entity.estado)" >\
							    <button class="btn btn-danger btn-xs disabled">\
								<span class="glyphicon glyphicon-export"></span>\
							    </button>\
							  </div>\
							  <div ng-if="!validarSincronizacion(row.entity.estado)" >\
							    <button class="btn btn-success btn-xs  disabled">\
								<span class="glyphicon glyphicon-saved"></span>\
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
                   
		      if(tipoNota===1){
			if(parseInt($scope.root.listarFacturasGeneradasNotas[0].saldo) <= 0){
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
				       empresaId: data.getEmpresa(),
				       prefijo: data.getPrefijo(),
				       factura: data.getNumeroFactura()
				   }
			       }
			   };

			   cajaGeneralService.sincronizarFi(obj, function(data) {

			       if (data.status === 200) {
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
			        prefijo:datos.getPrefijo(),
			        facturaFiscal:datos.getNumeroFactura(),
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
                            {field: 'Valor Gravamen',  displayName: 'Valor Gravamen', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.getValorGravamen() | currency:"$ "}}</p></div>'},
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
			that.limpiarVariablesConceptos();
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
			console.log("nota ",nota);
			console.log("datos ",datos);
			$scope.root.impuestos="";
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
				    var saldo=0;
				    var valorIngresado=0;
				    
				    if($scope.root.descripcionNota===''){
					 AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe digitar la Descripcion");
					 return;
				    }

				    if($scope.root.precioNota === '' ){
					 AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe digitar el Precio");
					 return;
				    }
				    if($scope.root.gravamenNota === ''){
					 AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe digitar la Descripcion");
					 return;
				    }
				    
				     if($scope.root.precioNota === 0){
					 AlertService.mostrarVentanaAlerta("Mensaje del sistema","El valor de la Nota debe ser Mayor a cero");
					 return;
				    }
				    
				    if(nota === 1){
					saldo=(parseInt($scope.root.listarFacturasGeneradasNotas[0].saldo) - parseInt($scope.root.precioNota));
					valorIngresado = valorIngresado - parseInt($scope.root.precioNota);
				    }else{
					valorIngresado += parseInt($scope.root.precioNota);
					$scope.root.totalesNotaCredito=parseInt($scope.root.totalesNotaCredito)-parseInt(datos.gravamen);
				    }
				     			
				    
				    if( saldo < 0 && nota === 1){
					 AlertService.mostrarVentanaAlerta(" Mensaje del sistema","El valor de la Nota credito no debe ser Mayor al saldo de la Factura ");
					 return;
				    }
				    				   
				    var parametros={
					prefijo : datos.getPrefijo(),
					facturaFiscal : datos.getNumeroFactura(),
					swContable : nota,
					valorNotaTotal : $scope.root.precioNota,
					porcentajeGravamen : $scope.root.gravamenNota,
					descripcion : $scope.root.descripcionNota,
					empresaId : $scope.root.empresaSeleccionada.getCodigo()
				    };
				
                                    that.guardarFacFacturasConceptosNotas(parametros,function(respuesta){
					$modalInstance.close();
//					that.listarImpuestosTercero();
					that.listarFacturasGeneradas(1,function(){});
					that.listarFacConceptosNotasDetalle(parametros);
					
				    });
                                };
					$scope.onImpuesto=function(){
					    
						   
						   that.traerPorcentajeImpuestosNotas(function(datas){
							 $scope.root.impuestos=datas;
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
			
			console.log("____________________");
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
			    ($scope.root.pagoCreditoModel === undefined) && ($scope.root.pagoEfectivoModel === undefined))) {
			
                            validar = true;
                        }
//			console.log("validarConcepto 2 ",validar);
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
			console.log("$scope.root.pago ",$scope.root.pago);
                        if ($scope.root.pago === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Tipo de Pago');
                            return;
                        }
                        if ($scope.root.pago === '') {
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
			$scope.checkearEstadoPago();
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
			console.log("checkearEstadoPago ",check);
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
			console.log("tipoFactura ",tipo);
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
		      };
		      
		      /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha 28/06/2017
                     * +Descripcion seleccionar busqueda
                     * @param {type} $event
                     */
                    $scope.buscarTercero = function(event,estado,busqueda) {
                           
			   
//                        if (event.which === 13) {
			   switch ($scope.root.tab){ 
			       case 1: $scope.root.termino_busqueda_tercero=busqueda;
				        if($scope.root.termino_busqueda_tercero.length> 3){
					that.listarTerceros(function(respuesta) {
					    if (respuesta) {
						that.listarConceptosDetalle();
					    }
					});
					}
					break;
			       case 2:  
				      if (event.which === 13) {
					  if($scope.root.prefijo.prefijo==='Prefijo'){
					     AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe seleccionar un prefijo");  
					  }else{
//					  console.log("Prefijo ",$scope.root.prefijo.prefijo);
					    that.listarFacturasGeneradas(1,function(data){
					       if(data!==false){
						that.listarFacConceptosNotasDetalle(data[0]);
						that.listarImpuestosTercero();
					       }else{
						$scope.root.listarFacConceptosNotasDetalle = null;  
					       }
					    });
					  }
					}
					break;
			       case 3:	
				       if (event.which === 13) {
					  if($scope.root.prefijo.prefijo==='Prefijo'){
					     AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe seleccionar un prefijo");  
					  }else{
					    $scope.root.termino_busqueda_tercero=busqueda;		         
					     that.listarFacturasGeneradas('',function(data){
					    });
					  }
				       }
					 break;
			   } 
//                        }
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
			that.listarPrefijos();
                    });
		    
                    that.listarCajaGeneral(function(data) {

                    });
		    
		    
                }]);
});
