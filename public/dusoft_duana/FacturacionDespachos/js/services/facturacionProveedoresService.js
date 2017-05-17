define(["angular", "js/services"], function (angular, services) {


    services.factory('facturacionProveedoresService',
            ['Request', 'API', "OrdenesComprasProveedores","ProductoRecepcion","Totales","FacturaProveedores",

                function (Request, API, OrdenesComprasProveedores,ProductoRecepcion,Totales,FacturaProveedores) {

                    var self = this;


                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  15/05/2017 DD/MM/YYYYY
                     * +Descripcion insertar factura proveedor
                     */
                    self.sincronizarFi = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONPROVEEDOR.SINCRONIZAR_FI, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  08/05/2017 DD/MM/YYYYY
                     * +Descripcion insertar factura proveedor
                     */
                    self.insertarFactura = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONPROVEEDOR.INSERTAR_FACTURA, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  02/05/2017 DD/MM/YYYYY
                     * +Descripcion lista todas las ordenes de compra proveedores
                     */
                    self.detalleRecepcion = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONPROVEEDOR.DETALLE_RECEPCION_PARCIAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las ordenes de compra de proveedores
                     * @fecha 02/05/2017 DD/MM/YYYYY
                     */
                    self.renderProductosRecepcion = function (productosRecepcion) {
                      
                        var productos = [];
                        
                        productosRecepcion[1].forEach(function(data) { 
                                var productoRecp = ProductoRecepcion.get(data.codigo_producto,data.descripcion,data.porc_iva,data.valor,data.lote,data.fecha_vencimiento);
                                productoRecp.set_cantidad_solicitada(data.cantidad);
                                productos.push(productoRecp);
                                
                            });

                        
                        return productos;
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las ordenes de compra de proveedores
                     * @fecha 02/05/2017 DD/MM/YYYYY
                     */
                    self.renderTotales = function (productosRecepcion) {
                      
                        var total = [];
                                            
                        var totales = Totales.get();
                        productosRecepcion[0].forEach(function(data) {                            
                            totales.setIva(data.Iva);
                            totales.setSubTotal(data.subTotal);
                            totales.setTotal(data.Total);
                            totales.setImpuestoCree(data.impuesto_cree);
                            totales.setValorRetFte(data.valorRetFte);
                            totales.setValorRetIca(data.valorRetIca);
                            totales.setValorRetIva(data.valorRetIva);
                            totales.set_iva(data._iva);
                            totales.set_subTotal(data._subTotal);
                            totales.setCantidad(data.Cantidad);
                            total.push(totales);
                        });

                        
                        return total[0];
                    };
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  21/05/2016 DD/MM/YYYYY
                     * +Descripcion lista todas las ordenes de compra proveedores
                     */
                    self.listarOrdenCompraProveedores = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONPROVEEDOR.LISTAR_ORDENES_COMPRA_PROVEEDORES, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  21/05/2016 DD/MM/YYYYY
                     * +Descripcion lista todas las facturas de proveedores
                     */
                    self.listarFacturaProveedores = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONPROVEEDOR.LISTAR_FACTURA_PROVEEDOR, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * @fecha  21/05/2016 DD/MM/YYYYY
                     * +Descripcion lista todas las facturas de proveedores
                     */
                    self.reporteFacturaProveedores = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONPROVEEDOR.REPORTE_FACTURA_PROVEEDOR, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las ordenes de compra de proveedores
                     * @fecha 02/05/2017 DD/MM/YYYYY
                     */
                    self.renderOrdenesComprasProveedores = function (comprasProveedores) {
                      
                        var compras = [];
                        comprasProveedores.forEach(function(data) {  
                                var ordenComp = OrdenesComprasProveedores.get(data.orden_pedido_id,data.estado,data.observacion,data.fecha_orden);
                                ordenComp.set_empresa(data.empresa_id);
                                ordenComp.set_proveedor(data.codigo_proveedor_id);
                                ordenComp.set_sw_unificada(data.sw_unificada);
                                ordenComp.set_unidad_negocio(data.codigo_unidad_negocio);
                                ordenComp.set_sw_orden_compra_finalizada(data.sw_orden_compra_finalizada);
                                ordenComp.set_nombre_usuario(data.nombre);
                                ordenComp.set_nombre_proveedor(data.nombre_tercero);
                                ordenComp.set_prefijo(data.prefijo);
                                ordenComp.set_numero(data.numero);
                                ordenComp.set_recepcion_parcial(data.recepcion_parcial_id);                                
                                ordenComp.set_porcentaje_cree(data.porcentaje_cree);
                                ordenComp.set_porcentaje_rtf(data.porcentaje_rtf);
                                ordenComp.set_porcentaje_ica(data.porcentaje_ica);
                                ordenComp.set_porcentaje_reteiva(data.porcentaje_reteiva);
                                ordenComp.setNumeroRecepciones(parseInt(data.tiene_recepciones));
                                compras.push(ordenComp);
                                
                            });
                        
                        return compras;
                    };
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene las ordenes de compra de proveedores
                     * @fecha 10/05/2017 DD/MM/YYYYY
                     */
                    self.renderFacturasProveedores = function (facturasProveedores) {
                      
                        var facturas = [];
                        facturasProveedores.forEach(function(data) {  
                                var factura = FacturaProveedores.get(data.numero_factura,data.codigo_proveedor_id,data.fecha_registro,data.observaciones);
                                factura.setMensaje(data.mensaje);
                                factura.setNombreUsuario(data.nombre);
                                factura.setEstado(data.estado);
                                factura.setEmpresa(data.empresa_id);
                                factura.setDescripcionEstado(data.descripcion_estado);
                                factura.setValorFactura(data.valor_factura);
                                factura.setValorDescuento(data.valor_descuento);
                                facturas.push(factura);                                
                            });
                        
                        return facturas;
                    };

                    
                    return this;
                }]);

});