define(["angular", "js/services"], function (angular, services) {


    services.factory('facturacionClientesService',
            ['Request', 'API', "Usuario", "TipoTerceros","TerceroDespacho","DocumentoDespacho","VendedorDespacho","PedidoDespacho",

                function (Request, API, Usuario,TipoTerceros,TerceroDespacho,DocumentoDespacho,VendedorDespacho,PedidoDespacho) {

                    var self = this;



                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2017 DD/MM/YYYYY
                     * +Descripcion Consulta todos los tipos de documentos
                     */
                    self.listarTiposTerceros = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_TIPOS_TERCEROS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2017 DD/MM/YYYYY
                     * +Descripcion Consulta los prefijos
                     */
                    self.listarPrefijosFacturas = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_PREFIJOS_FACTURAS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2017 DD/MM/YYYYY
                     * +Descripcion lista todos los clientes
                     */
                    self.listarClientes = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_CLIENTES, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2017 DD/MM/YYYYY
                     * +Descripcion lista todos los clientes
                     */
                    self.listarFacturasGeneradas = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_FACTURAS_GENERADAS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2017 DD/MM/YYYYY
                     * +Descripcion lista todos los clientes
                     */
                    self.listarPedidosClientes = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_PEDIDOS_CLIENTES, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2017 DD/MM/YYYYY
                     * +Descripcion Metodo encargado del Invicar el path para generar las facturas
                     *              agrupadas
                     */
                    self.generarFacturaAgrupada = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.GENERAR_FACTURA_AGRUPADA, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Cristian Ardila
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene los tipos de documentos
                     * @fecha 02/05/2017 DD/MM/YYYYY
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
                     * +Descripcion Metodo encargado de serializar el resultado de
                     *              la consulta que obtiene los clientes
                     * @param {type} tipoDocumento
                     * @returns {Array|nm$_shim-array.exports}
                     */
                    self.renderTerceroDespacho = function (tipoDocumento) {
                       
                        var tercerosDespacho = [];
                        for (var i in tipoDocumento) {

                            var _terceroDespacho = TerceroDespacho.get(tipoDocumento[i].nombre_tercero, tipoDocumento[i].tipo_id_tercero, 
                                                    tipoDocumento[i].tercero_id,
                                                    tipoDocumento[i].direccion,
                                                    tipoDocumento[i].telefono);
                                _terceroDespacho.setEmail(tipoDocumento[i].email); 
                                _terceroDespacho.setTipoBloqueoId(tipoDocumento[i].tipo_bloqueo_id); 
                                _terceroDespacho.setMunicipio(tipoDocumento[i].municipio); 
                                _terceroDespacho.setDepartamento(tipoDocumento[i].departamento); 
                                _terceroDespacho.setPais(tipoDocumento[i].pais); 
                          
                            tercerosDespacho.push(_terceroDespacho);
                        }
                        return tercerosDespacho;
                    };
                    
                    self.renderDocumentosClientes = function (datos,estado) {
                       
                        var tercerosDespacho = [];
                        for (var i in datos) {
                            console.log("A QUI ESTAN ", datos[i]);
                            var _terceroDespacho = TerceroDespacho.get(datos[i].nombre_tercero, datos[i].tipo_id_tercero, 
                                                    datos[i].tercero_id,
                                                    datos[i].direccion,
                                                    datos[i].telefono||'');
                            
                            var _vendedorDespacho = VendedorDespacho.get(datos[i].nombre, datos[i].tipo_id_vendedor, 
                                                    datos[i].vendedor_id,
                                                    "",
                                                    "");
                            
                            if(estado === 0){                                 
                                _terceroDespacho.setMunicipio(datos[i].municipio_empresa); 
                                _terceroDespacho.setDepartamento(datos[i].departamento_empresa); 
                                _terceroDespacho.setPais(datos[i].pais_empresa); 
                            }
                            
                            var _documento = DocumentoDespacho.get(datos[i].documento_id, datos[i].prefijo, datos[i].factura_fiscal||'', datos[i].fecha_registro||'');
                            
                            if(estado === 0){    
                                _documento.setValor(datos[i].valor_total);
                                _documento.setSaldo(datos[i].saldo);
                                _documento.setDescripcionEstado(datos[i].descripcion_estado);
                                _documento.setEstadoSincronizaciono(datos[i].estado);
                                _documento.setFechaFactura(datos[i].fecha_registro);
                                _documento.setFechaVencimientoFactura(datos[i].fecha_vencimiento_factura);
                            }
                                //
                            
                            
                            var _pedido = PedidoDespacho.get(datos[i].empresa_id, '','');
                                _pedido.set_numero_cotizacion(datos[i].pedido_cliente_id);
                            
                            if(estado === 1){
                                _pedido.setFechaRegistro(datos[i].fecha_registro);
                                _pedido.setSeleccionado(datos[i].seleccionado);
                            }
                             
                                _pedido.agregarDocumentos(_documento);
                            
                                _pedido.agregarVendedor(_vendedorDespacho);
                                _terceroDespacho.agregarPedidos(_pedido);
                                
                            tercerosDespacho.push(_terceroDespacho);
                        }
                        return tercerosDespacho;
                    };
                    
                    
                    
                    
                    return this;
                }]);
            
            
                
 

});



