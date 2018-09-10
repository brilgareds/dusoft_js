define(["angular", "js/services"], function (angular, services) {


    services.factory('notasService',
            ['Request', 'API', 'Notas', 'ProductoFacturas', 'TipoTerceros', 'FacturaProveedores',
                function (Request, API, Notas, ProductoFacturas, TipoTerceros, FacturaProveedores) {

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
                     * @fecha  15/08/2018 DD/MM/YYYYY
                     * +Descripcion LISTAR PORCENTAJES 
                     */
                    self.listarPorcentajes = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.LISTAR_PORCENTAJES, "POST", obj, function (data) {
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
                            nota.setTipoImpresion(data.tipo_nota_impresion);
                            nota.setValorNota(data.valor_nota);
                            nota.setValorFactura(data.valor_total);
                            nota.setIdentificacion(data.tipo_id_tercero + " - " + data.tercero_id);
                            nota.setSincronizacionDian(data.sincronizacion);
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
                            producto.setEmpresaDevolucion(data.empresa_devolucion);
                            producto.setPrefijoDevolucion(data.prefijo_devolucion);
                            producto.setNumeroDevolucion(data.numero_devolucion);
                            producto.setMovimientoId(data.movimiento_id);
                            productos.push(producto);
                        });

                        return productos;
                    };

                    /**
                     * @author German Galvis
                     * @fecha  11/08/2018 DD/MM/YYYYY
                     * +Descripcion
                     */
                    self.consultarConceptos = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.LISTAR_CONCEPTOS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * @fecha  09/08/2018 DD/MM/YYYYY
                     * +Descripcion crear la nota debito
                     */
                    self.guardarNota = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.CREAR_NOTA, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * @fecha  13/08/2018 DD/MM/YYYYY
                     * +Descripcion crear la nota credito
                     */
                    self.guardarNotaCredito = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.CREAR_NOTA_CREDITO, "POST", obj, function (data) {
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

                    /**
                     * @author German Galvis
                     * @fecha  13/08/2018 DD/MM/YYYYY
                     * +Descripcion impresion de la nota
                     */
                    self.imprimirNotaCredito = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.IMPRIMIR_NOTA_CREDITO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * @fecha  14/08/2018 DD/MM/YYYYY
                     * +Descripcion sincronizar las facturas con FI 
                     */
                    self.sincronizarFi = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.SINCRONIZAR_NOTAS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * @fecha  03/09/2018 DD/MM/YYYYY
                     * +Descripcion Consulta los prefijos
                     */
                    self.listarPrefijosFacturas = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_PREFIJOS_FACTURAS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene los tipos de documentos
                     * @fecha 03/09/2018 DD/MM/YYYYY
                     */
                    self.renderListarTipoTerceros = function (tipoDocumento) {

                        var tipoDocumentos = [];
                        for (var i in tipoDocumento) {

                            var _tipoDocumento = TipoTerceros.get(tipoDocumento[i].id, tipoDocumento[i].descripcion);
                            tipoDocumentos.push(_tipoDocumento);
                        }
                        return tipoDocumentos;
                    };

                    /**
                     * @author German Galvis
                     * @fecha  04/09/2018 DD/MM/YYYYY
                     * +Descripcion envia la nota debito a la dian
                     */
                    self.generarSincronizacionDianDebito = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.GENERAR_SINCRONIZACION_DIAN_DEBITO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Galvis
                     * @fecha  04/09/2018 DD/MM/YYYYY
                     * +Descripcion envia la nota credito a la dian
                     */
                    self.generarSincronizacionDianCredito = function (obj, callback) {
                        Request.realizarRequest(API.NOTAS.GENERAR_SINCRONIZACION_DIAN_CREDITO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    return this;
                }]);

});
