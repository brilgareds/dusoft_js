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
                    $scope.root.prefijosNotas = [
//                        {prefijo: 'F', descripcion: "Factura"},
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
//		    
//                    /**
//                     * +Descripcion Metodo encargado de consultar grupos
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 01/06/2017
//                     * @returns {undefined}
//                     */
//                    that.listarGrupos = function(control, callback) {
//			$scope.root.grupos = null;
//			$scope.root.conceptos = null;
//
//                        var obj = {
//                            session: $scope.session,
//                            data: {
//                                empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
//                                credito: $scope.root.credito, 
//                                contado: $scope.root.contado,
//                                concepto_id: $scope.root.cajas.conceptoCaja,
//                                grupo_concepto: $scope.root.grupo.gruposConcepto
//                            }
//                        };
//                        cajaGeneralService.listarGrupos(obj, function(data) {
//
//                            if (data.status === 200) {
//                                if (control) {
//                                    $scope.root.grupos = cajaGeneralService.renderGrupos(data.obj.listarGrupos);
//				    $scope.root.grupo=$scope.root.grupos;
//				    $scope.root.concepto =null;
//                                } else {
//                                    $scope.root.conceptos = cajaGeneralService.renderGrupos(data.obj.listarGrupos);
//				    $scope.root.concepto = $scope.root.conceptos;
//                                }
//                               
//                                callback(true);
//                            } else {
//                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//                                callback(false);
//                            }
//                        });
//                    };
//		    
//		    
//                    /**
//                     * +Descripcion Metodo encargado de invocar el servicio que listara
//                     *              los tipos de terceros
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 02/05/2017 DD/MM/YYYY
//                     * @returns {undefined}
//                     */
//                    that.listarFacturasGeneradas = function(limit,callback) {
//			
//
//                        var obj = {
//                            session: $scope.session,
//                            data: {
//                                terminoBusqueda: $scope.root.termino_busqueda_tercero,
//				busquedaDocumento: $scope.root.tipoTercero.tipo,
//				empresaId: $scope.root.empresaSeleccionada.getCodigo(),
//				prefijo: $scope.root.prefijo.prefijo!=='Prefijo'?$scope.root.prefijo.prefijo:'undefined',
//				facturaFiscal: $scope.root.factura?$scope.root.factura:'undefined',
//				limit:limit
//                            }
//                        };
//                        cajaGeneralService.listarFacturasGeneradas(obj, function(data) {
//                            if (data.status === 200) {
//				
////                                $scope.root.listarFacturasGeneradasNotas=data.obj.listarFacturasGeneradas;
//				$scope.root.listarFacturasGeneradasNotas=cajaGeneralService.renderFacturasProveedores(data.obj.listarFacturasGeneradas);
//				
//				callback(data.obj.listarFacturasGeneradas);
//                            } else {
//				$scope.root.listarFacturasGeneradasNotas=null;
//                               //AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//			       callback(false);
//                            }
//
//                        });
//                    };
//
//		    /**
//                     * +Descripcion Metodo encargado de listar los impuestos de un cliente
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 27/07/2017 DD/MM/YYYY
//                     * @returns {undefined}
//                     */
//		    that.listarImpuestosTercero = function() {
//			if($scope.root.listarFacturasGeneradasNotas===undefined){
//			    return;
//			}
//			var fecha = new Date($scope.root.listarFacturasGeneradasNotas[0].getFechaRegistro());
//			var anio = fecha.getFullYear();
//			var obj = {
//			    session: $scope.session,
//			    data: {
//				empresaId: $scope.root.empresaSeleccionada.getCodigo(),
//				tipoIdTercero: $scope.root.listarFacturasGeneradasNotas[0].getTipoTercero(),
//				terceroId: $scope.root.listarFacturasGeneradasNotas[0].getTerceroId(),
//				anio: anio
//			    }
//			};
//			cajaGeneralService.listarImpuestosTercero(obj, function(data) {
//			    
//			    if (data.status === 200) {
//                              data.obj.factura=$scope.root.listarFacturasGeneradasNotas[0];
//			      $scope.root.listarImpuestos=data.obj;
////			      that.traerPorcentajeImpuestosNotas(data.obj,function(datas){
////				
////			      });
//				
//			    } else {
//				AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//			    }
//
//			});
//		    };
//		    
//                    /**
//                     * +Descripcion Metodo encargado de calcular los impuestos de una nota
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 27/07/2017 DD/MM/YYYY
//                     * @returns {undefined}
//                     */
//		     that.traerPorcentajeImpuestosNotas = function(callback) {
//		        var objs=$scope.root.listarImpuestos; 
//			var parametros=objs.retencion;
//			var terceroImpuesto=objs.retencionTercero;
//			var obj=objs.factura;
//			
//			$scope.root.totalNota=$scope.root.precioNota;
//			$scope.root.totalGravamenNota=$scope.root.gravamenNota;
//
//			    var impuestos = {
//				porcentajeRtf: '0',
//				porcentajeIca: '0',
//				porcentajeReteiva: '0',
//				porcentajeCree: '0',
//				swRtf: parametros.sw_rtf,
//				swIca: parametros.sw_ica,
//				swReteiva: parametros.sw_reteiva,
//				totalGeneral:0,
//				retencionFuente:0,
//				retencionIca:0,
//				valorSubtotal:0,
//				valorSubtotalFactura:0
//			    };
//			 
//			    impuestos.valorSubtotalFactura = obj.getSaldo();
//			//    impuestos.valorSubtotalFactura = obj.totalFactura - obj.totalGravamen;
//
//			    if (parametros.sw_rtf === '2' || parametros.sw_rtf === '3'){
//				
//				 if (parseInt(impuestos.valorSubtotalFactura) >= parseInt(parametros.base_rtf)) {
//				                                         
//				     impuestos.retencionFuente = $scope.root.totalNota * (terceroImpuesto.porcentaje_rtf / 100);				   
//
//				 }
//			    }
//
//			    if (parametros.sw_ica === '2' || parametros.sw_ica === '3'){
//				
//				 if (parseInt(impuestos.valorSubtotalFactura) >= parseInt(parametros.base_ica)) {
//				     
//				    impuestos.retencionIca = $scope.root.totalNota * (terceroImpuesto.porcentaje_ica / 1000);
//				 }
//			    }
//
//			    impuestos.valorSubtotal =$scope.root.totalNota;
//			    impuestos.iva = parseInt($scope.root.totalGravamenNota)+0;	    
//			    impuestos.totalGeneral = parseInt(impuestos.valorSubtotal) + parseInt(impuestos.iva) - (parseInt(impuestos.retencionFuente) + parseInt(impuestos.retencionIca));
//			    callback(impuestos);
//			    return;
//		    };
//		    

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
//		    
//                    /**
//                     * +Descripcion Metodo encargado de invocar el servicio que listara
//                     *              las notas de una factura
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 02/05/2017 DD/MM/YYYY
//                     * @returns {undefined}
//                     */
//                    that.listarFacConceptosNotasDetalle = function(parametros) {
//			
//			$scope.root.totalesNotaCredito=0;
//			$scope.root.totalesNotaDebito=0;
//			
//			if(parametros===undefined){
//			    return;
//			}
//			var facturaFiscal =parametros.factura_fiscal!==undefined?parametros.factura_fiscal:parametros.facturaFiscal;
//                        var obj = {
//                            session: $scope.session,
//                            data: {
//				prefijo: parametros.prefijo,
//				facturaFiscal: facturaFiscal
//                            }
//                        };
//                        cajaGeneralService.listarFacConceptosNotas(obj, function(data) {
//                            if (data.status === 200) {
//				
//                            $scope.root.listarFacConceptosNotasDetalle=data.obj.listarFacConceptosNotas;
//			    data.obj.listarFacConceptosNotas.forEach(function(value) {
//
//				if(value.nota_contable==='credito'){
//				    
//				 $scope.root.totalesNotaCredito+=parseInt(value.valor_nota_total);
//				 $scope.root.gravamenesNotaCredito+=parseInt(value.valor_gravamen);
//				 
//				}else{
//				    
//				 $scope.root.totalesNotaDebito+=parseInt(value.valor_nota_total);
//				 $scope.root.gravamenesNotaDebito+=parseInt(value.valor_gravamen);  
//				}
//
//			    });
//                            } else {
//				$scope.root.listarFacConceptosNotasDetalle={};
//                            }
//
//                        });
//                    };
//		    
//                    /**
//                     * +Descripcion Metodo encargado de invocar el servicio que listara
//                     *              los tipos de terceros
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 02/05/2017 DD/MM/YYYY
//                     * @returns {undefined}
//                     */
//                    that.listarTiposTerceros = function() {
//
//                        var obj = {
//                            session: $scope.session,
//                            data: {
//                                listar_tipo_terceros: {
//                                }
//                            }
//                        };
//                        facturacionClientesService.listarTiposTerceros(obj, function(data) {
//
//                            if (data.status === 200) {
//                                $scope.root.tipoTerceros = facturacionClientesService.renderListarTipoTerceros(data.obj.listar_tipo_terceros);
//                            } else {
//                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//                            }
//
//                        });
//                    };
//		    
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * +Descripcion Permite realiar peticion al API para traer los terceros
//                     * @params callback: {function}
//                     * @fecha 2017-06-01
//                     */
//                    that.listarTerceros = function(callback) {
//			
//                        if($scope.root.termino_busqueda_tercero===undefined){
//			    $scope.root.termino_busqueda_tercero='';
//			}
//                        var parametros = {
//                            session: $scope.session,
//                            data: {
//                                tercero: {
//                                    empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
//                                    paginaActual: '1',
//                                    busquedaDocumento: $scope.root.tipoTercero.tipo,
//                                    terminoBusqueda: $scope.root.termino_busqueda_tercero
//                                }
//                            }
//                        };
//                             
//                        cajaGeneralService.listarTerceros(parametros, function(respuesta) {
//                            if (respuesta.status === 200) {
//                                $scope.root.terceros = [];
//                                var terceros = respuesta.obj.terceros;
//                                for (var i in terceros) {
//                                    var _tercero = terceros[i];
//                                    var tercero = Tercero.get(_tercero["nombre_tercero"], _tercero["tipo_id_tercero"], _tercero["tercero_id"], _tercero["direccion"], _tercero["telefono"]);
//                                    tercero.setCorreo(_tercero["email"]);
//                                    $scope.root.terceros.push(tercero);
//                                }
//                                callback(true);
//                            } else {
//                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
//                                callback(false);
//                            }
//                        });
//                    };
//		    
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * +Descripcion Permite realiar peticion al API para traer los terceros
//                     * @params callback: {function}
//                     * @fecha 2017-06-01
//                     */		    
//                    that.listarPrefijos = function() {
//
//                        var parametros = {
//                            session: $scope.session,
//                            data: {
//                              
//                                    empresaId: $scope.root.empresaSeleccionada.getCodigo()
//                            }
//                        };
//
//                        cajaGeneralService.listarPrefijos(parametros, function(respuesta) {
//                            if (respuesta.status === 200) {
//                                $scope.root.prefijos = respuesta.obj.listarPrefijos;
//                            } else {
//                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
//                            }
//                        });
//                    };
//		    
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * +Descripcion Permite realiar peticion al API para traer los terceros
//                     * @params callback: {function}
//                     * @fecha 2017-06-01
//                     */
//                    that.listarConceptosDetalle = function() {
//                        $scope.root.conceptoTmp = "";
//                        if ($scope.root.terceros === undefined || $scope.root.terceros[0] === undefined) {
//                            return;
//                        }
//                        if ($scope.root.cajas === undefined) {
////			     AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe seleccionar la Caja");
//                            return;
//                        }
//
//                        var parametros = {
//                            session: $scope.session,
//                            data: {
//                                datos: {
//                                    empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
//                                    tipo_id_tercero: $scope.root.terceros[0].getTipoId(),
//                                    tercero_id: $scope.root.terceros[0].getId(),
//                                    concepto_id: $scope.root.cajas.conceptoCaja
//                                }
//                            }
//                        };
//
//                        cajaGeneralService.listarConceptosDetalle(parametros, function(data) {
//
//                            if (data.status === 200) {
//                                $scope.root.conceptoTmp = cajaGeneralService.renderConcepto(data.obj.listarConceptosDetalle);
//                            }else if(data.msj.status===404){
//				
//			    }else {
//				if(data.obj.listarConceptosDetalle !== '0'){
//                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//				}
//                            }
//                        });
//                    };
//		    
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * +Descripcion Permite realiar peticion al API para guardar la factura de caja general
//                     * @params callback: {function}
//                     * @fecha 2017-06-10
//                     */
//                    $scope.guardarFacturaCajaGeneral = function() {
//			//sw_clase_factura 0=>contado 1=>credito
//                        //tipo_factura 5 porque es conceptos
//			var tipoPago=($scope.root.pagoCreditoModel === true)?1:0; 
//			var prefijo=($scope.root.pagoCreditoModel === true)?$scope.root.cajas.prefijoFacCredito:$scope.root.cajas.prefijoFacContado;
//			var claseFactura=($scope.root.cajas.prefijoFacCredito === undefined ? 0: 1);
//			var tipoFactura='5';
//			var estado='0';
//                        var parametros = {
//                            session: $scope.session,
//                            data: {
//			        prefijoFac:prefijo,
//				empresaId: $scope.root.empresaSeleccionada.getCodigo(),
//				centroUtilidad: empresa.getCentroUtilidadSeleccionado().getCodigo(),
//				tipoIdTercero: $scope.root.terceros[0].getTipoId(),
//				terceroId: $scope.root.terceros[0].getId(),
//				conceptoId: $scope.root.cajas.conceptoCaja,
//			        swClaseFactura: claseFactura,
//			        tipoFactura : tipoFactura,
//			        estado : estado,
//				cajaId :$scope.root.cajas.cajaId,
//				tipoPago: tipoPago
//                            }
//                        };
//                        cajaGeneralService.guardarFacturaCajaGeneral(parametros, function(data) {
//
//                            if (data.status === 200) {
//				var nombre = data.obj.guardarFacturaCajaGeneral;
//				$scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
//				
//				that.listarTerceros(function(respuesta) {
//                                if (respuesta) {
//                                    that.listarConceptosDetalle();
//                                }
//				});
//				
//			    }else if(data.msj.status===409){ 
//				AlertService.mostrarVentanaAlerta("Mensaje del sistema",data.msj.msj);
//			    }else{
//				var mensaje = data.obj.guardarFacturaCajaGeneral;
//				if(mensaje===""){
//                                 AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//				}
//                            }
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * +Descripcion Permite realiar peticion al API para guardar la factura de caja general
//                     * @params callback: {function}
//                     * @fecha 2017-06-10
//                     */
//                    that.guardarFacFacturasConceptosNotas = function(parametros,callback) {
//			
//                        var parametros = {
//                            session: $scope.session,
//                            data: {
//			        descripcion:parametros.descripcion,
//				empresaId:parametros.empresaId,
//				bodega:empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada(),
//				facturaFiscal:parametros.facturaFiscal,
//				porcentajeGravamen:parametros.porcentajeGravamen,
//				prefijo:parametros.prefijo,
//				swContable:parametros.swContable,
//				valorNotaTotal:parametros.valorNotaTotal,
//			     valorNotaImpuestos:$scope.root.impuestos.totalGeneral
//			    }
//                        };
//                        cajaGeneralService.insertarFacFacturasConceptosNotas (parametros, function(data) {
//                          if (data.status === 200) {
//                               callback(true);
//                            } else {
//				callback(false);
//                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//                            }
//			  
//                        });
//                    };
//
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
                            {field: 'Imprimir', width: "5%", displayName: 'Imprimir', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onImprimirFacturaNotas(row.entity)"><span class="glyphicon glyphicon-print"></span> Imprimir</button></div>'},
                            {displayName: "DUSOFT FI", cellClass: "txt-center dropdown-button", width: "5%",
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
//		    
//		    $scope.root.gravamenes=0;
//		    $scope.sumarGravamen=function(gravamen){//root.gravamenes
//			$scope.root.gravamenes2=gravamen;
//		    };
//		    
//		    $scope.root.totales=0;
//		    $scope.sumarTotal=function(total){
//			$scope.root.totales=total;
//		    };
//		    
//		   /*
//		    * 1-nota credito 0 - nota debito
//		    * @param {type} tipoNota
//		    * @returns {disabled}
//		    */
//		  $scope.comparaValorNota=function(tipoNota){
//		      var disabled=false;
//                   
//		      if(tipoNota===1){
//			if(parseInt($scope.root.listarFacturasGeneradasNotas[0].saldo) <= 0){
//			   disabled=true;
//			}
//		       
//		      }
//			return disabled;
//		  };
//    
//		    
//		    /**
//			* +Descripcion sincronizar FI
//			* @author Andres Mauricio Gonzalez
//			* @fecha 18/05/2017
//			* @returns {undefined}
//			*/
//		    $scope.sincronizarFI = function(data) {
//			that.sincronizarFI(data,function(resultado){
//			});
//		    };
//		    
//			/**
//			* +Descripcion Metodo encargado de sincronizar en WS FI
//			* @author Andres Mauricio Gonzalez
//			* @fecha 18/05/2017
//			* @returns {undefined}
//			*/
//		       that.sincronizarFI = function(data,callback) {
//                           
//			   var obj = {
//			       session: $scope.session,
//			       data: {
//				   sincronizarFI: {
//				       empresaId: data.getEmpresa(),
//				       prefijo: data.getPrefijo(),
//				       factura: data.getNumeroFactura()
//				   }
//			       }
//			   };
//
//			   cajaGeneralService.sincronizarFi(obj, function(data) {
//
//			       if (data.status === 200) {
//				   that.listarFacturasGeneradas('',function(data){
//				       
//				   });
//				   that.mensajeSincronizacion(data.obj.respuestaFI.resultado.mensaje_bd,data.obj.respuestaFI.resultado.mensaje_ws);
//				   callback(true);
//			       } else {
//				   AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//				   callback(false);
//			       }
//
//			   });
//
//		       };
//		       
//		  /**
//			* +Descripcion mensaje de respuesta de WS
//			* @author Andres Mauricio Gonzalez
//			* @fecha 18/05/2017
//			* @returns {undefined}
//			*/     
//		  that.mensajeSincronizacion = function (mensaje_bd,mensaje_ws) {
//
//                       $scope.mensaje_bd = mensaje_bd;
//                       $scope.mensaje_ws = mensaje_ws;
//                       $scope.opts = {
//                           backdrop: true,
//                           backdropClick: true,
//                           dialogFade: false,
//                           keyboard: true,
//                           template: ' <div class="modal-header">\
//                                           <button type="button" class="close" ng-click="close()">&times;</button>\
//                                           <h4 class="modal-title">Resultado sincronizacion</h4>\
//                                       </div>\
//                                       <div class="modal-body">\
//                                           <h4>Respuesta WS</h4>\
//                                           <h5> {{ mensaje_ws }}</h5>\
//                                           <h4>Respuesta BD</h4>\
//                                           <h5> {{ mensaje_bd }} </h5>\
//                                       </div>\
//                                       <div class="modal-footer">\
//                                           <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
//                                       </div>',
//                           scope: $scope,
//                           controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
//
//                                   $scope.close = function () {
//                                       $modalInstance.close();
//                                   };
//                               }]
//                       };
//                       var modalInstance = $modal.open($scope.opts);
//                   };
//		    
//		    /**
//                     * +Descripcion metodo para validar sincronizacion
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 18/05/2017
//                     * @returns {undefined}
//                     */
//		    $scope.validarSincronizacion=function(estado){
//			var respuesta=false;
//			if(estado === '1' || estado === null){
//			    respuesta=true;
//			}
//			return respuesta;
//		    };

                    /**
                     * +Descripcion metodo para imprimir las facturas
                     * @author German Galvis
                     * @fecha 18/05/2017
                     * @returns {undefined}
                     */
                    $scope.onImprimirFacturaNotas = function (datos) {
                        var parametros = {
                            session: $scope.session,
                            data: {
                                prefijo: datos.getPrefijo(),
                                facturaFiscal: datos.getNumeroFactura(),
                                empresaId: $scope.root.empresaSeleccionada.getCodigo()
                            }
                        };
                        notasService.imprimirNotas(parametros, function (data) {

                            if (data.status === 200) {
                                var nombre = data.obj.imprimirFacturaNotas;
                                $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");

                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        });
                    };
//		    
//		    /**
//                     * +Descripcion metodo para imprimir las facturas
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 18/05/2017
//                     * @returns {undefined}
//                     */
//		    $scope.onImprimirNota=function(datos){
//			 var parametros = {
//                            session: $scope.session,
//                            data: {
//			        prefijo:datos.prefijo,
//			        facturaFiscal:datos.factura_fiscal,
//			        prefijoNota:datos.prefijo_nota,
//			        numeroNota:datos.numero_nota,
//				empresaId: datos.empresa_id,
//				bodega: datos.bodega
//                            }
//                        };
//                        cajaGeneralService.imprimirNota(parametros, function(data) {
//				    
//                            if (data.status === 200) {
//				var nombre = data.obj.imprimirNota;
//				$scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
//				
//                            } else {
//				AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//                            }
//                        });
//		    };
//		    /**
//                     * +Descripcion metodo para imprimir las facturas
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 18/05/2017
//                     * @returns {undefined}
//                     */
//		    $scope.onImprimirFacturaNotasDetalle=function(datos){
//			 var parametros = {
//                            session: $scope.session,
//                            data: {
//			        prefijo:datos.prefijo,
//			        facturaFiscal:datos.factura_fiscal,
//				empresaId: $scope.root.empresaSeleccionada.getCodigo()
//                            }
//                        };
//                        cajaGeneralService.imprimirFacturaNotasDetalle(parametros, function(data) {
//				    
//                            if (data.status === 200) {
//				var nombre = data.obj.imprimirFacturaNotas;
//				$scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
//				
//                            } else {
//				AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//                            }
//                        });
//		    };
//		    
//                    /**
//                     * +Descripcion scope del grid para mostrar los proveedores
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 18/05/2017
//                     * @returns {undefined}
//                     */
//                    $scope.listaConceptosTmp = {
//                        data: 'root.conceptoTmp',
//                        enableColumnResize: true,
//                        enableRowSelection: false,
//                        enableCellSelection: true,
//                        enableHighlighting: true,
//                        showFilter: true,
//			footerTemplate: '   <div class="row col-md-12">\
//                                        <div class="">\
//                                            <table class="table table-clear text-center">\
//                                                <thead>\
//                                                    <tr>\
//                                                        <th class="text-center">SUBTOTAL</th>\
//                                                        <th class="text-center">IVA</th>\
//                                                        <th class="text-center">RET-FTE</th>\
//							<th class="text-center">RETE-ICA</th>\
//                                                        <th class="text-center">VALOR TOTAL</th>\
//                                                    </tr>\
//                                                </thead>\
//                                                <tbody>\
//                                                    <tr>\
//                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getSubTotal()| currency:"$ "}}</td> \
//                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getIva()| currency:"$ "}}</td> \
//                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getValorRetFte() | currency:"$ "}}</td> \
//                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getValorRetIca() | currency:"$ "}}</td> \
//                                                        <td class="right">{{root.conceptoTmp[0].totales[0].getTotal()| currency:"$ "}}</td> \
//                                                    </tr>\
//                                                </tbody>\
//                                            </table>\
//                                        </div>\
//                                    </div>',
//                        columnDefs: [
//                            {field: 'Grupo', width: "15%", displayName: 'Grupo', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getDescripcionGrupo()}}</p></div>'}, //
//                            {field: 'Concepto', width: "15%", displayName: 'Concepto', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getDescripcionConcepto()}}</p></div>'},
//                            {field: 'Tipo Pago', width: "5%", displayName: 'Tipo Pago', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTipoPagoDescripcion()}}</p></div>'},
//                            {field: 'Descripcion', width: "44%", displayName: 'Descripcion', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getDescripcion()}}</p></div>'},
//                            {field: 'Valor Unitario', width: "8%", displayName: 'Valor Unitario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getValorUnitario()| currency:"$ "}}</p></div>'},
//                            {field: 'Valor Gravamen',  displayName: 'Valor Gravamen', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.getValorGravamen() | currency:"$ "}}</p></div>'},
//                            {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "5%",
//                                cellTemplate: ' <div class="row">\
//                                                 <button class="btn btn-default btn-xs" ng-click="eliminarTmp(row.entity)">\
//                                                     <span class="glyphicon glyphicon-remove"></span>\
//                                                 </button>\
//                                               </div>'
//                            }
//                        ]
//                    };
//
//
//                    /**
//                     * +Descripcion scope del grid para mostrar el detalle de las recepciones
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 01/06/2017
//                     * @returns {undefined}
//                     */
//                    $scope.onConcepto = function() {
//			that.limpiarVariablesConceptos();
//                        that.ver_recepcion();
//                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las facturas
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * @returns {undefined}
                     */

                    $scope.onNotaCreditoValor = function (datos) {
                        $scope.root.precioNota = 0;
                        $scope.root.gravamenNota = 0;
                        $scope.root.descripcionNota = "";
                        $scope.root.tituloNota = "Nota Credito";
                        that.verNota(1, datos);
                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las facturas
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * @returns {undefined}
                     */

                    $scope.onNotaCreditoDevolucion = function (datos) {
                        $scope.root.precioNota = 0;
                        $scope.root.gravamenNota = 0;
                        $scope.root.descripcionNota = "";
                        $scope.root.tituloNota = "Nota Credito";
                        that.verNota(2, datos);
                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las facturas
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * @returns {undefined}
                     */
                    $scope.onNotaDebito = function (datos) {
                        $scope.root.precioNota = 0;
                        $scope.root.gravamenNota = 0;
                        $scope.root.descripcionNota = "";
                        $scope.root.tituloNota = "Nota Debito";
                        that.verNota(0, datos);
                    };
//
//                    /**
//                     * +Descripcion funcion para eliminar temporal
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 01/06/2017
//                     * @returns {undefined}
//                     */
//                    $scope.eliminarTmp = function(row) {
//
//                        var parametros = {
//                            session: $scope.session,
//                            data: {
//                                datos: {
//                                    rc_concepto_id: row.getRcConceptoId()
//                                }
//                            }
//                        };
//
//                        cajaGeneralService.eliminarTmpDetalleConceptos(parametros, function(data) {
//
//                            if (data.status === 200) {
//                                that.listarConceptosDetalle();
//                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//                            } else {
//                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
//                            }
//                        });
//                    };
//
//                    /**
//                     * +Descripcion scope del grid para mostrar el detalle de las recepciones
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 01/06/2017
//                     * @returns {undefined}
//                     */
//                    that.ver_recepcion = function() {
//                        $scope.opts = {
//                            backdrop: true,
//                            backdropClick: true,
//                            dialogFade: false,
//                            windowClass: 'app-modal-window-smlg',
//                            keyboard: true,
//                            showFilter: true,
//                            cellClass: "ngCellText",
//                            templateUrl: 'views/cajaGeneral/vistaConceptos.html',
//                            scope: $scope,
//                            controller: ['$scope','$modalInstance',function($scope, $modalInstance) {
//
//                                that.listarGrupos(true, function() {
//
//                                });
//                                $scope.cerrar = function() {
//                                    $modalInstance.close();
//                                };
//                                $scope.guardarConcepto = function() {
//                                    that.guardarConcepto(function(respuesta, parametros) {
//                                        if (respuesta === true) {
//                                            that.insertarTmpDetalleConceptos(parametros, function(respuesta) {
//                                                that.listarConceptosDetalle();
//                                                $modalInstance.close();
//                                            });
//                                        }
//                                    });
//                                };
//                            }]
//                        };
//                        var modalInstance = $modal.open($scope.opts);
//                    };
//		    
//		    $scope.root.precioNota=0;
//		    $scope.root.gravamenNota=0;
//		    $scope.root.descripcionNota="";

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las notas
                     * @author German Galvis
                     * @fecha 06/08/2018
                     * @returns {undefined}
                     * nota : 0-debito 1-credito valor 2-credito devolucion
                     */
                    that.verNota = function (nota, datos) {

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
                                                tipoFactura: nota
                                            }
                                        };

                                        notasService.detalleFactura(obj, function (data) {
                                            if (data.status === 200) {

                                                $scope.root.listadoNota = notasService.renderProductoFacturas(data.obj.ConsultarDetalleFactura);

                                            } else {
                                                $scope.root.listadoNota = null;
                                            }

                                        });
                                    };

                                    that.listarDetalleFactura();

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

                                        var subtotal = 0;

                                        $scope.root.listadoNota.forEach(function (data) {
                                            if (data.seleccionado)
                                                subtotal += data.total_nota;
                                        });
                                        $scope.root.impuestosnota.valorSubtotal = subtotal;

                                        $scope.root.impuestosnota.totalGeneral = $scope.root.impuestosnota.valorSubtotal + $scope.root.impuestosnota.iva - $scope.root.impuestosnota.retencionFuente - $scope.root.impuestosnota.retencionIca;

                                    };

                                    $scope.listaNotas2 = {
                                        data: 'root.listadoNota',
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
                                                cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-disabled="row.entity.seleccionado" ng-keyup ="calcularValor(row.entity)" ng-model="row.entity.cantidad_ingresada" validacion-numero-entero  class="form-control grid-inline-input" name="cantidad_ingresada" id="cantidad_ingresada" /> </div>'},
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
                                        for (i = 0; i < $scope.root.listadoNota.length; i++) {
                                            if ($scope.root.listadoNota[i].seleccionado) {
                                                listado.push($scope.root.listadoNota[i]);
                                            }
                                        }



                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresaId: datos.empresa,
                                                factura_fiscal: datos.numeroFactura,
                                                prefijo: datos.prefijo,
                                                valor: $scope.root.impuestosnota.valorSubtotal,
                                                tipo_factura: datos.tipoFactura,
                                                listado: listado
                                            }
                                        };


                                        console.log("obj", obj);

                                        notasService.guardarNota(obj, function (data) {
                                            console.log("data", data);
                                            if (data.status === 200) {
//                                                AlertService.mostrarMensaje("warning", data.msj);
                                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj + " Numero Nota: " + data.obj.crearNota );
                                                //$scope.root.listadoNota = notasService.renderProductoFacturas(data.obj.ConsultarDetalleFactura);

                                            } else {
                                                AlertService.mostrarMensaje("warning", data.msj);
                                                //  $scope.root.listadoNota = null;
                                            }

                                        });


                                    };
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);


                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope selector del filtro
//                     * @param {type} $event
//                     */
//                    $scope.onSeleccionFiltro = function() {
//			
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope selector del filtro
//                     * @param {type} $event
//                     */
//                    $scope.onSeleccionFiltroGrupo = function() {
//                        that.listarGrupos(false, function() {
//
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope selector del filtro
//                     * @param {type} $event
//                     */
//                    $scope.validarCaja = function() {
//                        var validar = false;
//                        if ($scope.root.cajas === undefined || $scope.root.terceros === undefined) {//|| (!($scope.root.pagoEfectivoModel) && !($scope.root.pagoEfectivoModel)
//                            validar = true;
//                        }
//                        return validar;
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope selector del filtro
//                     * @param {type} $event
//                     */
//                    $scope.validarConcepto = function() { 
//                        var validar = false;
//                        if ($scope.root.cajas === undefined || $scope.root.terceros === undefined || 
//			    $scope.root.conceptoTmp.length === 0 || ($scope.root.pagoEfectivoModel === $scope.root.pagoCreditoModel && 
//			    ($scope.root.pagoCreditoModel === undefined) && ($scope.root.pagoEfectivoModel === undefined))) {
//			
//                            validar = true;
//                        }
//                        return validar;
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope selector del filtro
//                     * @param {type} $event
//                     */
//                    $scope.onSeleccionFiltroConcepto = function() {
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope guarda los conceptos
//                     * @param {type} $event
//                     */
//                    that.guardarConcepto = function(callback) {
//                        var mensaje = '';
//                        if ($scope.root.grupo.gruposConcepto === "") {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Grupo');
//                            return;
//                        }
//                        if ($scope.root.concepto === undefined) {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Concepto');
//                            return;
//                        }
//                        if ($scope.root.concepto.conceptoId === "") {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Concepto');
//                            return;
//                        }
//			
//                        if ($scope.root.pago === undefined) {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Tipo de Pago');
//                            return;
//                        }
//                        if ($scope.root.pago === '') {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Seleccionar Un Tipo de Pago');
//                            return;
//                        }
//                        if ($scope.root.precio === undefined) {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Digitar un Precio');
//                            return;
//                        }
//                        if (parseInt($scope.root.precio) < 0) {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'El Precio debe Ser Mayor o Igual a Cero');
//                            return;
//                        }
//                        if (parseInt($scope.root.gravamen) < 0) {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'El Gravamen debe Eer Mayor o Igual a Cero');
//                            return;
//                        }
//                        if ($scope.root.descripcion === undefined) {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'Debe Digitar Una Descripcion');
//                            return;
//                        }
//                        if ($scope.root.descripcion.length <= 6) {
//                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", 'La Descripcion debe Tener como Minimo 6 Caracteres');
//                            return;
//                        }
//			
//			if($scope.root.gravamen === undefined || $scope.root.gravamen === "") {
//			   $scope.root.gravamen=0; 
//			}
//
//                        var parametros = {//$scope.root.caja
//                            empresa_id: $scope.root.empresaSeleccionada.getCodigo(),
//                            centro_utilidad: empresa.getCentroUtilidadSeleccionado().getCodigo(),
//                            concepto_id: $scope.root.concepto.getConceptoId(),
//                            grupo_concepto: $scope.root.grupo.getGruposConcepto(),
//                            tipo_id_tercero: $scope.root.terceros[0].getTipoId(),
//                            tercero_id: $scope.root.terceros[0].getId(),
//                            sw_tipo: '0',
//                            cantidad: '1',
//                            precio: parseInt($scope.root.precio)+parseInt($scope.root.gravamen),
//                            valor_total: parseInt($scope.root.precio)+parseInt($scope.root.gravamen),
//                            porcentaje_gravamen: $scope.root.gravamen,
//                            valor_gravamen: $scope.root.gravamen,
//                            descripcion: $scope.root.descripcion,
//                            tipo_pago_id: $scope.root.pago
//                        };
//			
//			that.limpiarVariablesConceptos();
//                        callback(true, parametros);
//                    };
//		    
//		    that.limpiarVariablesConceptos=function(){
//			$scope.root.precio="";
//			$scope.root.pago="";
//			$scope.root.gravamen="";
//			$scope.root.descripcion="";
//			$scope.checkearEstadoPago();
//		    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * +Descripcion Permite realiar peticion al API para traer los terceros
//                     * @params callback: {function}
//                     * @fecha 2017-06-01
//                     */
//                    that.insertarTmpDetalleConceptos = function(parametros, callback) {
//
//                        var parametro = {
//                            session: $scope.session,
//                            data: {
//                                datos: parametros
//                            }
//                        };
//                        cajaGeneralService.insertarTmpDetalleConceptos(parametro, function(respuesta) {
//                            if (respuesta.status === 200) {
//                               // AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.obj.insertarTmpDetalleConceptos);
//                                callback(true);
//                            } else {
//                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
//                                callback(false);
//                            }
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope selector estado de pago
//                     * @param {type} $event
//                     */
//                    $scope.checkearEstadoPago = function(check) {
//			
//                        $scope.root.pago = check;
//                        switch (check) {
//                            case 1:
//                                $scope.root.cheque = 'default';
//                                $scope.root.efectivo = 'primary';
//                                $scope.root.credito = 'default';
//                                break;
//                            case 2:
//                                $scope.root.cheque = 'default';
//                                $scope.root.efectivo = 'default';
//                                $scope.root.credito = 'success';
//                                break;
//                            case 3:
//                                $scope.root.cheque = 'danger';
//                                $scope.root.efectivo = 'default';
//                                $scope.root.credito = 'default';
//                                break;
//                            default:
//                                $scope.root.cheque = 'default';
//                                $scope.root.efectivo = 'default';
//                                $scope.root.credito = 'default';
//                        }
//                    };
//                    
//		      
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope selector tipo factura
//                     * @param {type} $event
//                     */
//                    $scope.tipoFactura = function(tipo) {
//		
//                        $scope.root.pagoCreditoModel = false;
//                        $scope.root.pagoEfectivoModel = false;
//			
//			$scope.root.pago = tipo;
//                        switch (tipo) {
//                            case 0:
//                                $scope.root.pagoEfectivo = 'primary';
//                                $scope.root.pagoCredito = 'default';
//				$scope.root.pagoEfectivoModel = true;
//                                break;
//                            case 1:
//                                $scope.root.pagoEfectivo = 'default';
//                                $scope.root.pagoCredito = 'success';
//				 $scope.root.pagoCreditoModel = true;
//                                break;
//                            default:
//                                $scope.root.pagoEfectivo = 'default';
//                                $scope.root.pagoCredito = 'default';
//                        }
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope selector del filtro
//                     * @param {type} $event
//                     */
//                    $scope.onSeleccionTipoTercero = function(filtro) {
//                        $scope.root.filtro = filtro;
//                        $scope.root.tipoTercero = filtro;
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 04/02/2016
//                     * +Descripcion scope selector del filtro
//                     * @param {type} $event
//                     */
//                    $scope.onSeleccionPrefijo = function(filtro) {
//			$scope.root.prefijo.prefijo=filtro.prefijo;
//                    };


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
                            that.listarFacturasGeneradas(function (data) {
//					       if(data!==false){
//						that.listarFacConceptosNotasDetalle(data[0]);
//						that.listarImpuestosTercero();
//					       }else{
//						$scope.root.listarFacConceptosNotasDetalle = null;  
//					       }
                            });
                        }
                    };

//		     /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 28/06/2017
//                     * +Descripcion tamaño columna
//                     * @param {type} $event
//                     */
//                    $scope.onColumnaSize = function(tipo) {
//
//                        if (tipo === "AS" || tipo === "MS" || tipo === "CD") {
//                            $scope.columnaSizeBusqueda = "col-md-4";
//                        } else {
//                            $scope.columnaSizeBusqueda = "col-md-4";
//                        }
//
//                    };
//		     /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha 28/06/2017
//                     * +Descripcion tamaño columna
//                     * @param {type} $event
//                     */
//                    $scope.onColumnaSizeNota = function(tipo) {
//
//                        if (tipo === "NC" || tipo === "NC") {
//                            $scope.columnaSizeBusqueda = "col-md-4";
//                        } else {
//                            $scope.columnaSizeBusqueda = "col-md-12";
//                        }
//
//                    };

                    /**
                     * +Descripcion Metodo encargado de invocar el servicio que listara
                     *              las facturas
                     * @author German Galvis
                     * @fecha 02/08/2018 DD/MM/YYYY
                     * @returns {undefined}
                     */
                    that.listarFacturasGeneradas = function (callback) {

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

                                callback(data.obj.listarFacturas);
                            } else {
                                $scope.root.listarFacturas = null;
                                callback(false);
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
                            {field: 'Saldo', width: "10%", displayName: 'Saldo', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getSaldo()| currency:"$ "}}</p></div>'},
                            {field: 'Fecha', width: "10%", displayName: 'Fecha Registro', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaRegistro() | date:"dd/MM/yyyy HH:mma"}}</p></div>'},
                            {field: 'NC', width: "3%", displayName: 'NC', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="btn_seleccionar_nota(row.entity)"><span class="glyphicon glyphicon-plus-sign"></span></button></div>'},
                            {field: 'ND', width: "3%", displayName: 'ND', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onNotaDebito(row.entity)"><span class="glyphicon glyphicon-plus-sign"></span></button></div>'},
                            {field: 'Imprimir', width: "5%", displayName: 'Imprimir', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 align-items-center"><button class="btn btn-default btn-xs center-block" ng-click="onImprimirFacturaNotas(row.entity)"><span class="glyphicon glyphicon-print"></span></button></div>'}
                        ]
                    };

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
                                    <button class="btn btn-primary" ng-click="valor()">Valor</button>\
                                    <button class="btn btn-primary" ng-click="devolucion()">Devolucion</button>\
                                </div>',
                            scope: $scope,
                            controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

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
