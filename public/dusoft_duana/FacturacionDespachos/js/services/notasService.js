define(["angular", "js/services"], function (angular, services) {


    services.factory('notasService',
            ['Request', 'API', 'Notas', 'ProductoFacturas', 'ConceptoCaja', 'Totales', 'FacturaProveedores',
                function (Request, API, Notas, ProductoFacturas, ConceptoCaja, Totales, FacturaProveedores) {

                    var self = this;

                    /**
                     * @author German Galvis
                     * @fecha  02/08/2018 DD/MM/YYYYY
                     * +Descripcion LISTAR FACTURAS 
                     */
                    self.listarFacturas = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.LISTAR_FACTURAS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las facturas
                     * @fecha 03/08/2018 DD/MM/YYYYY
                     */
                    self.renderFacturas = function (facturasProveedores) {

                        var facturas = [];
                        facturasProveedores.forEach(function (data) {
                            var factura = FacturaProveedores.get(data.factura_fiscal, data.codigo_proveedor_id, data.fecha_registro, data.observaciones);
                            factura.setNombreUsuario(data.nombre);
                            factura.setEmpresa(data.empresa_id);
                            factura.setValorFactura(data.valor_total);
                            factura.setNombreProveedor(data.nombre_tercero);
                            factura.setSaldo(data.saldo);
                            factura.setIdentificacion(data.tipo_id_tercero + " - " + data.tercero_id);
                            factura.setPrefijo(data.prefijo);
                            factura.setTipoFactura(data.tipo_factura);
                            facturas.push(factura);
                        });

                        return facturas;
                    };

                    /**
                     * @author German Galvis
                     * @fecha  06/08/2018 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.consultarNotas = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.CONSULTAR_NOTAS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las notas
                     * @fecha 06/08/2018 DD/MM/YYYYY
                     */
                    self.renderNotas = function (notasEnviadas) {

                        var notas = [];
                        notasEnviadas.forEach(function (data) {
                            var nota = Notas.get(data.numero, data.factura_fiscal, data.fecha_registro_nota, data.fecha_registro);
                            nota.setDescripcionEstado(data.descripcion_estado);
                            nota.setEstado(data.estado);
                            nota.setNombreTercero(data.nombre_tercero);
                            nota.setPrefijo(data.prefijo);
                            nota.setSaldo(data.saldo);
                            nota.setTerceroId(data.tercero_id);
                            nota.setTipoNota(data.tipo_nota || "VALOR");
                            nota.setConcepto(data.descripcion_concepto);
                            nota.setTipoTercero(data.tipo_id_tercero);
                            nota.setValorNota(data.valor_nota);
                            nota.setValorFactura(data.valor_total);
                            nota.setIdentificacion(data.tipo_id_tercero + " - " + data.tercero_id);
                            notas.push(nota);
                        });

                        return notas;
                    };

                    /**
                     * @author German Galvis
                     * @fecha  06/08/2018 DD/MM/YYYYY
                     * +Descripcion consulta el detalle de la factura seleccionada
                     */
                    self.detalleFactura = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.DETALLE_FACTURA, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene los productos de las facturas
                     * @fecha 06/08/2018 DD/MM/YYYYY
                     */
                    self.renderProductoFacturas = function (productosFactura) {

                        var productos = [];
                        productosFactura.forEach(function (data) {
                            var producto = ProductoFacturas.get(data.codigo_producto, data.producto, data.lote, data.cantidad, data.item_id, data.valor_unitario);
                            producto.setCantidadIngresada(data.valor_digitado_nota || 0);
                            producto.setObservacion(data.observacion);
                            producto.setTotalNota((data.cantidad * data.valor_digitado_nota) || 0);
                            producto.setPorcentajeIva(data.porc_iva || 0);
                            productos.push(producto);
                        });

                        return productos;
                    };

                    /**
                     * @author German Galvis
                     * @fecha  09/08/2018 DD/MM/YYYYY
                     * +Descripcion crear la nota
                     */
                    self.guardarNota = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.CREAR_NOTA, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * @fecha  10/08/2018 DD/MM/YYYYY
                     * +Descripcion impresion de la nota
                     */
                    self.imprimirNota = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.IMPRIMIR_NOTA, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.listarConceptosDetalle = function (obj, callback) {
//                        Request.realizarRequest(API.NOTAS.LISTAR_CONCEPTOS_DETALLE, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.listarFacConceptosNotas = function (obj, callback) {
//                        Request.realizarRequest(API.NOTAS.LISTAR_FAC_FACTURAS_CONCEPTOS_NOTAS, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion consulta los parametros para calcular los impuestos
//                     */
//                    self.listarImpuestosTercero = function (obj, callback) {
//                        Request.realizarRequest(API.NOTAS.LISTAR_IMPUESTOS_TERCERO, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.listarCajaGeneral = function (obj, callback) {
//                        Request.realizarRequest(API.NOTAS.LISTAR_NOTAS, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.imprimirFacturaNotas = function (obj, callback) {
//                        Request.realizarRequest(API.NOTAS.IMPRIMIR_FACTURA_NOTAS, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.imprimirFacturaNotasDetalle = function (obj, callback) {
//                        Request.realizarRequest(API.NOTAS.IMPRIMIR_FACTURA_NOTAS_DETALLE, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.insertarTmpDetalleConceptos = function (obj, callback) {
//                        Request.realizarRequest(API.NOTAS.INSERTAR_TMP_DETALLE_CONCEPTOS, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.listarGrupos = function (obj, callback) {
//                        Request.realizarRequest(API.NOTAS.LISTAR_GRUPOS, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };
//
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  08/06/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.eliminarTmpDetalleConceptos = function (parametros, callback) {
//
//                        Request.realizarRequest(API.NOTAS.ELIMINAR_TMP_DETALLE_CONCEPTOS, "POST", parametros, function (data) {
//
//                            callback(data);
//
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  10/06/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.guardarFacturaCajaGeneral = function (parametros, callback) {
//
//                        Request.realizarRequest(API.NOTAS.GUARDAR_FACTURA_NOTAS, "POST", parametros, function (data) {
//                            callback(data);
//
//                        });
//                    };
//
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.listarTerceros = function (parametros, callback) {
//
//                        Request.realizarRequest(API.TERCEROS.LISTAR_TERCEROS, "POST", parametros, function (data) {
//                            callback(data);
//
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.listarPrefijos = function (parametros, callback) {
//
//                        Request.realizarRequest(API.NOTAS.LISTAR_PREFIJOS, "POST", parametros, function (data) {
//                            callback(data);
//
//                        });
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  31/05/2017 DD/MM/YYYYY
//                     * +Descripcion
//                     */
//                    self.insertarFacFacturasConceptosNotas = function (parametros, callback) {
//
//                        Request.realizarRequest(API.NOTAS.INSERTAR_FAC_FACTURAS_CONCEPTOS_NOTAS, "POST", parametros, function (data) {
//                            callback(data);
//
//                        });
//                    };
//
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * +Descripcion Funcion encargada de serializar el resultado de la
//                     *              consulta que obtiene las cajas
//                     * @fecha 02/05/2017 DD/MM/YYYYY
//                     */
//                    self.renderCajaGeneral = function (caja) {
//
//                        var cajaGeneral = [];
//
//                        caja.forEach(function (dato) {
//                            var _cajaGeneral = CajaGeneral.get(dato.caja_id, dato.empresa_id, dato.centro_utilidad);
//                            _cajaGeneral.setDescripcionCaja(dato.descripcion3);
//                            _cajaGeneral.setNombreEmpresa(dato.descripcion1);
//                            _cajaGeneral.setNombreCentroUtilidad(dato.descripcion2);
//                            _cajaGeneral.setCuentaTipoId(dato.cuenta_tipo_id);
//                            _cajaGeneral.setPrefijoFacContado(dato.prefijo_fac_contado);
//                            _cajaGeneral.setPrefijoFacCredito(dato.prefijo_fac_credito);
//                            _cajaGeneral.setConceptoCaja(dato.concepto_caja);
//                            cajaGeneral.push(_cajaGeneral);
//                        });
//                        return cajaGeneral;
//                    };
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * +Descripcion Funcion encargada de serializar el resultado de la
//                     *              consulta que obtiene las conceptos
//                     * @fecha 08/06/2017 DD/MM/YYYYY
//                     */
//                    self.renderConcepto = function (conceptos) {
//
//                        var concepto = [];
//                        var total = [];
//
//                        var totales = Totales.get();
//                        totales.setValorRetFte(conceptos.impuestos.retencionFuente);
//                        totales.setValorRetIca(conceptos.impuestos.retencionIca);
//                        totales.setIva(conceptos.impuestos.iva);
//                        totales.setSubTotal(conceptos.impuestos.valorSubtotal);
//                        totales.setTotal(conceptos.impuestos.totalGeneral);
//                        conceptos.detalle.forEach(function (dato) {
//                            var _concepto = ConceptoCaja.get(dato.concepto_id);
//                            _concepto.setCantidad(dato.cantidad);
//                            _concepto.setPrecio(dato.precio);
//                            _concepto.setDescripcion(dato.descripcion);
//                            _concepto.setPorcentajeGravamen(dato.porcentaje_gravamen);
//                            _concepto.setGrupoConcepto(dato.grupo_concepto);
//                            _concepto.setDescripcionConcepto(dato.desconcepto);
//                            _concepto.setDescripcionGrupo(dato.desgrupo);
//                            _concepto.setTipoIdTercero(dato.tipo_id_tercero);
//                            _concepto.setRcConceptoId(dato.rc_concepto_id);
//                            _concepto.setEmpresa(dato.empresa_id);
//                            _concepto.setCentroUtilidad(dato.centro_utilidad);
//                            _concepto.setSwTipo(dato.sw_tipo);
//                            _concepto.setValorTotal(dato.valor_total);
//                            _concepto.setValorGravamen(dato.valor_gravamen);
//                            _concepto.setTipoPagoId(dato.tipo_pago_id);
//                            _concepto.agregarToltales(totales);
//                            concepto.push(_concepto);
//                        });
//
//                        return concepto;
//                    };
//
//
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * +Descripcion Funcion encargada de serializar el resultado de la
//                     *              consulta que obtiene las cajas
//                     * @fecha 02/05/2017 DD/MM/YYYYY
//                     */
//                    self.renderGrupos = function (datos) {
//
//                        var grupos = [];
//
//                        datos.forEach(function (dato) {
//                            var _grupo = Grupos.get(dato.grupo_concepto, dato.descripcion);
//                            _grupo.setPrecio(dato.precio);
//                            _grupo.setPorcentajeGravamen(dato.porcentaje_gravamen);
//                            _grupo.setSwPrecioManual(dato.sw_precio_manual);
//                            _grupo.setSwCantidad(dato.sw_cantidad);
//                            _grupo.setConceptoId(dato.concepto_id);
//                            _grupo.setDescripcionConcepto(dato.descripcion_concepto);
//                            grupos.push(_grupo);
//                        });
//
//                        return grupos;
//                    };
//
//                    /**
//                     * @author Andres Mauricio Gonzalez
//                     * @fecha  15/05/2017 DD/MM/YYYYY
//                     * +Descripcion sincronizar las facturas con FI 
//                     */
//                    self.sincronizarFi = function (obj, callback) {
//                        Request.realizarRequest(API.NOTAS.SINCRONIZAR_FACTURA_NOTAS, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };


                    return this;
                }]);

});
