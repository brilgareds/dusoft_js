define(["angular", "js/services"], function(angular, services) {


    services.factory('cajaGeneralService',
            ['Request', 'API', 'CajaGeneral', 'Grupos', 'ConceptoCaja','Totales',
                function(Request, API, CajaGeneral, Grupos, ConceptoCaja,Totales) {

                    var self = this;


                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  23/06/2017 DD/MM/YYYYY
                     * +Descripcion LISTAR FACTURAS GENERADAS
                     */
                    self.listarFacturasGeneradas = function(obj, callback) {
                        Request.realizarRequest(API.CAJA_GENERAL.LISTAR_FACTURAS_GENERADAS_NOTAS, "POST", obj, function(data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  31/05/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.listarConceptosDetalle = function(obj, callback) {
                        Request.realizarRequest(API.CAJA_GENERAL.LISTAR_CONCEPTOS_DETALLE, "POST", obj, function(data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  31/05/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.listarCajaGeneral = function(obj, callback) {
                        Request.realizarRequest(API.CAJA_GENERAL.LISTAR_CAJA_GENERAL, "POST", obj, function(data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  31/05/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.insertarTmpDetalleConceptos = function(obj, callback) {
                        Request.realizarRequest(API.CAJA_GENERAL.INSERTAR_TMP_DETALLE_CONCEPTOS, "POST", obj, function(data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  31/05/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.listarGrupos = function(obj, callback) {
                        Request.realizarRequest(API.CAJA_GENERAL.LISTAR_GRUPOS, "POST", obj, function(data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  08/06/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.eliminarTmpDetalleConceptos = function(parametros, callback) {

                        Request.realizarRequest(API.CAJA_GENERAL.ELIMINAR_TMP_DETALLE_CONCEPTOS, "POST", parametros, function(data) {
                            console.log("data:::", data);
                            callback(data);

                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  10/06/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.guardarFacturaCajaGeneral = function(parametros, callback) {

                        Request.realizarRequest(API.CAJA_GENERAL.GUARDAR_FACTURA_CAJA_GENERAL, "POST", parametros, function(data) {
                            callback(data);

                        });
                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  31/05/2017 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.listarTerceros = function(parametros, callback) {

                        Request.realizarRequest(API.TERCEROS.LISTAR_TERCEROS, "POST", parametros, function(data) {
                            callback(data);

                        });
                    };

                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las cajas
                     * @fecha 02/05/2017 DD/MM/YYYYY
                     */
                    self.renderCajaGeneral = function(caja) {

                        var cajaGeneral = [];

                        caja.forEach(function(dato) {
                            var _cajaGeneral = CajaGeneral.get(dato.caja_id, dato.empresa_id, dato.centro_utilidad);
                            _cajaGeneral.setDescripcionCaja(dato.descripcion3);
                            _cajaGeneral.setNombreEmpresa(dato.descripcion1);
                            _cajaGeneral.setNombreCentroUtilidad(dato.descripcion2);
                            _cajaGeneral.setCuentaTipoId(dato.cuenta_tipo_id);
                            _cajaGeneral.setPrefijoFacContado(dato.prefijo_fac_contado);
                            _cajaGeneral.setPrefijoFacCredito(dato.prefijo_fac_credito);
                            _cajaGeneral.setConceptoCaja(dato.concepto_caja);
                            cajaGeneral.push(_cajaGeneral);
                        });
                        return cajaGeneral;
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las conceptos
                     * @fecha 08/06/2017 DD/MM/YYYYY
                     */
                    self.renderConcepto = function(conceptos) {

                        var concepto = [];
			var total = [];

                        var totales = Totales.get();
			totales.setValorRetFte(conceptos.impuestos.retencionFuente);
			totales.setValorRetIca(conceptos.impuestos.retencionIca);
			totales.setIva(conceptos.impuestos.iva);
			totales.setSubTotal(conceptos.impuestos.valorSubtotal);
			totales.setTotal(conceptos.impuestos.totalGeneral);
                        conceptos.detalle.forEach(function(dato) {
                            var _concepto = ConceptoCaja.get(dato.concepto_id);
                            _concepto.setCantidad(dato.cantidad);
                            _concepto.setPrecio(dato.precio);
                            _concepto.setDescripcion(dato.descripcion);
                            _concepto.setPorcentajeGravamen(dato.porcentaje_gravamen);
                            _concepto.setGrupoConcepto(dato.grupo_concepto);
                            _concepto.setDescripcionConcepto(dato.desconcepto);
                            _concepto.setDescripcionGrupo(dato.desgrupo);
                            _concepto.setTipoIdTercero(dato.tipo_id_tercero);
                            _concepto.setRcConceptoId(dato.rc_concepto_id);
                            _concepto.setEmpresa(dato.empresa_id);
                            _concepto.setCentroUtilidad(dato.centro_utilidad);
                            _concepto.setSwTipo(dato.sw_tipo);
                            _concepto.setValorTotal(dato.valor_total);
                            _concepto.setValorGravamen(dato.valor_gravamen);
                            _concepto.setTipoPagoId(dato.tipo_pago_id);
                            _concepto.agregarToltales(totales);
                            concepto.push(_concepto);
                        });
                        console.log("concepto", concepto);
                        return concepto;
                    };


                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las cajas
                     * @fecha 02/05/2017 DD/MM/YYYYY
                     */
                    self.renderGrupos = function(datos) {

                        var grupos = [];

                        datos.forEach(function(dato) {
                            var _grupo = Grupos.get(dato.grupo_concepto, dato.descripcion);
                            _grupo.setPrecio(dato.precio);
                            _grupo.setPorcentajeGravamen(dato.porcentaje_gravamen);
                            _grupo.setSwPrecioManual(dato.sw_precio_manual);
                            _grupo.setSwCantidad(dato.sw_cantidad);
                            _grupo.setConceptoId(dato.concepto_id);
                            _grupo.setDescripcionConcepto(dato.descripcion_concepto);
                            grupos.push(_grupo);
                        });
                        console.log("grupo", grupos);
                        return grupos;
                    };


                    return this;
                }]);

});
