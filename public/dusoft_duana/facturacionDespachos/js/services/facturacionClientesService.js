define(["angular", "js/services"], function (angular, services) {


    services.factory('facturacionClientesService',
            ['Request', 'API', "Usuario", "TipoTerceros","TerceroDespacho","DocumentoDespacho","VendedorDespacho","PedidoDespacho","EmpresaDespacho",

                function (Request, API, Usuario,TipoTerceros,TerceroDespacho,DocumentoDespacho,VendedorDespacho,PedidoDespacho,EmpresaDespacho) {

                    var self = this;


                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  18/05/2017 DD/MM/YYYYY
                     * +Descripcion Servicio que generara el reporte con el detalle
                     *              de la factura generada
                     */
                    self.consultaFacturaGeneradaDetalle = function (obj, callback) {
                        console.log("self.consultaFacturaGeneradaDetalle");
                        Request.realizarRequest(API.FACTURACIONCLIENTES.REPORTE_FACTURA_GENERADA_DETALLE, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  05/05/2017 DD/MM/YYYYY
                     * +Descripcion Consulta todos los tipos de documentos
                     */
                    self.listarTiposTerceros = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_TIPOS_TERCEROS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  02/05/2017 DD/MM/YYYYY
                     * +Descripcion Consulta los prefijos
                     */
                    self.listarPrefijosFacturas = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_PREFIJOS_FACTURAS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  03/05/2017 DD/MM/YYYYY
                     * +Descripcion lista todos los clientes
                     */
                    self.listarClientes = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_CLIENTES, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  02/05/2017 DD/MM/YYYYY
                     * +Descripcion lista todos los clientes
                     */
                    self.listarFacturasGeneradas = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_FACTURAS_GENERADAS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  02/05/2017 DD/MM/YYYYY
                     * +Descripcion lista todos los clientes
                     */
                    self.listarPedidosClientes = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_PEDIDOS_CLIENTES, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  02/05/2017 DD/MM/YYYYY
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
                     * @fecha  09/05/2017 DD/MM/YYYYY
                     * +Descripcion Metodo encargado del Invicar el path para generar las facturas
                     *              agrupadas
                     */
                    self.generarFacturaIndividual = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.GENERAR_FACTURA_INDIVIDUAL, "POST", obj, function (data) {
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
                        
                        var facturasDespachadas = [];
                        for (var i in datos) {
                            
                            var _empresaDespacho = EmpresaDespacho.get(datos[i].razon_social || '',datos[i].empresa_id);   
                            if(estado === 0){
                                                    
                                                   _empresaDespacho.setTipoIdEmpresa(datos[i].tipo_id_empresa);
                                                    _empresaDespacho.setId(datos[i].id);
                                                    _empresaDespacho.setDigitoVerificacion(datos[i].digito_verificacion);
                                                    _empresaDespacho.setPais(datos[i].pais_empresa);
                                                    _empresaDespacho.setDepartamento(datos[i].departamento_empresa);
                                                    _empresaDespacho.setMunicipio(datos[i].municipio_empresa);
                                                    _empresaDespacho.setDireccionEmpresa(datos[i].direccion_empresa);
                                                    _empresaDespacho.setTelefonoEmpresa(datos[i].telefono_empresa);
                            }
                            
                            var _terceroDespacho = TerceroDespacho.get(datos[i].nombre_tercero, datos[i].tipo_id_tercero, 
                                                    datos[i].tercero_id,
                                                    datos[i].direccion,
                                                    datos[i].telefono||'');
                            
                            var _vendedorDespacho = VendedorDespacho.get(datos[i].nombre, datos[i].tipo_id_vendedor, 
                                                    datos[i].vendedor_id,
                                                    "",
                                                    "");
                            
                            
                            
                            var _documento = DocumentoDespacho.get(datos[i].documento_id, datos[i].prefijo, datos[i].factura_fiscal||'', datos[i].fecha_registro||'');
                              
                                        
                            if(estado === 0){                                 
                                _terceroDespacho.setMunicipio(datos[i].municipio_empresa); 
                                _terceroDespacho.setDepartamento(datos[i].departamento_empresa); 
                                _terceroDespacho.setPais(datos[i].pais_empresa); 
                                _documento.setMensaje2(datos[i].texto2);
                                _documento.setMensaje3(datos[i].texto3);
                            }
                            
                            var _pedido = PedidoDespacho.get(datos[i].empresa_id, '','');
                                _pedido.set_numero_cotizacion(datos[i].pedido_cliente_id);
                            
                            if(estado === 1){
                                _pedido.setFechaRegistro(datos[i].fecha_registro);
                                _pedido.setSeleccionado(datos[i].seleccionado);
                            }
                             
                            if(estado === 0){    
                                _documento.setValor(datos[i].valor_total);
                                _documento.setSaldo(datos[i].saldo);
                                _documento.setDescripcionEstado(datos[i].descripcion_estado);
                               
                                _documento.setEstadoSincronizacion(datos[i].estado);
                                _documento.setFechaFactura(datos[i].fecha_registro);
                                _documento.setFechaVencimientoFactura(datos[i].fecha_vencimiento_factura);
                                
                                _pedido.agregarDocumentos(_documento);
                            } 
                                
                            
                                _pedido.agregarVendedor(_vendedorDespacho);
                                _terceroDespacho.agregarPedidos(_pedido);
                                
                            if(estado === 0){
                                _empresaDespacho.agregarFacturasDespachadas(_terceroDespacho);
                                facturasDespachadas.push(_empresaDespacho);
                            }

                            if(estado === 1){

                                facturasDespachadas.push(_terceroDespacho);
                            }
                            
                        }
                        return facturasDespachadas;
                    };
                    
                    
                    self.renderDocumentosPrefijosClientes = function (documento_id,prefijo,factura_fiscal,fecha_registro,empresa_id) {     
               
                        
                         
                            var _documento = DocumentoDespacho.get(documento_id, prefijo, factura_fiscal||'', fecha_registro||'');
                                _documento.set_empresa(empresa_id);
                            return _documento;
                        
                       
                    };
                    
                    return this;
                }]);
            
            
          
 

});



