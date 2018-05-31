define(["angular", "js/services"], function (angular, services) {


    services.factory('facturacionClientesService',
            ['Request', 'API', "Usuario", "TipoTerceros","TerceroDespacho","DocumentoDespacho","VendedorDespacho","PedidoDespacho","EmpresaDespacho","DocumentoDetalleConsumo",
                "FacturaConsumo",
                function (Request, API, Usuario,TipoTerceros,TerceroDespacho,DocumentoDespacho,VendedorDespacho,PedidoDespacho,EmpresaDespacho,DocumentoDetalleConsumo,
                FacturaConsumo) {

                    var self = this;
 
                    /**
                     * @author Cristian Ardila
                     * @fecha  25/08/2017 DD/MM/YYYYY
                     * +Descripcion lista las facturas en temporal
                     */
                    self.listarFacturasTemporal = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_FACTURAS_TEMPORALES, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  18/05/2017 DD/MM/YYYYY
                     * +Descripcion Servicio que sincronizara una factura
                     */
                    self.procesarDespachos = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.PROCESAR_DESPACHOS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  18/05/2017 DD/MM/YYYYY
                     * +Descripcion Servicio que consulta los procesos de facturacion cosmitet
                     */
                    self.facturasEnProceso = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.FACTURAS_EN_PROCESO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    /**
                     * @author Cristian Ardila
                     * @fecha  18/05/2017 DD/MM/YYYYY
                     * +Descripcion Servicio que sincronizara una factura
                     */
                    self.sincronizarFactura = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.SINCRONIZAR_FI, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  18/05/2017 DD/MM/YYYYY
                     * +Descripcion Servicio que generara el reporte con el detalle
                     *              de la factura generada
                     */
                    self.consultaFacturaGeneradaDetalle = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.REPORTE_FACTURA_GENERADA_DETALLE, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  18/05/2017 DD/MM/YYYYY
                     * +Descripcion Servicio que generara el reporte con el detalle
                     *              del pedido
                     */
                    self.imprimirReporteFactura = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.IMPRIMIR_REPORTE_FACTURA, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  18/05/2017 DD/MM/YYYYY
                     * +Descripcion Servicio que generara el reporte con el detalle
                     *              del pedido
                     */
                    self.imprimirReportePedido = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.IMPRIMIR_REPORTE_PEDIDO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  18/05/2017 DD/MM/YYYYY
                     * +Descripcion Servicio que generara el reporte con el detalle
                     *              del despacho
                     */
                    self.imprimirReporteDespacho = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.IMPRIMIR_REPORTE_DESPACHO, "POST", obj, function (data) {
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
                     * @author Eduar Garcia
                     * @fecha  24/07/2017 DD/MM/YYYYY
                     * +Descripcion Permite traer los documentos del cliente seleccionado
                     */
                    self.listarDocumentos = function(obj, callback){
                        Request.realizarRequest(API.FACTURACIONCLIENTES.DOCUMENTOS_POR_FACTURAR, "POST", obj, function (data) {
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
                     * @author Eduar Garcia
                     * +Descripcion Permite traer el detalle del documento para facturar por consumo
                     * @fecha 10/05/2017 DD/MM/YYYYY
                     */
                    self.obtenerDetallePorFacturar = function(obj, callback){
                        
                        Request.realizarRequest(API.FACTURACIONCLIENTES.OBTENER_DETALLE_POR_FACTURAR, "POST", obj, function(data) {
                            callback(data);
                        });
                    };
                   
                   /**
                     * @author Cristian Ardila
                     * @fecha  02/05/2017 DD/MM/YYYYY
                     * +Descripcion Metodo encargado del Invocar el path para generar las facturas
                     *              agrupadas
                     */
                    self.generarTemporalFacturaConsumo = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.GENERAR_TMP_FACTURA_CONSUMO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  02/05/2017 DD/MM/YYYYY
                     * +Descripcion Metodo encargado del Invocar el path 
                     *              para eliminar las facturas agrupadas
                     *              
                     */
                    self.eliminarProductoTemporalFacturaConsumo = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.ELIMINAR_PRODUCTO_TEMPORAL_FACTURA_CONSUMO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  02/05/2017 DD/MM/YYYYY
                     * +Descripcion Metodo encargado del Invocar el path 
                     *              para todo el detalle de un temporal
                     *              
                     */
                    self.eliminarTotalTemporalFacturaConsumo = function (obj, callback) {
                        console.log("eliminarTotalTemporalFacturaConsumo>>",obj);
                        Request.realizarRequest(API.FACTURACIONCLIENTES.ELIMINAR_TOTAL_TEMPORAL_FACTURA_CONSUMO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  02/05/2017 DD/MM/YYYYY
                     * +Descripcion Metodo encargado del Invocar el path para consultar el detalle del temporal de facturas de consumo
                     */
                    self.consultarDetalleTemporalFacturaConsumo = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.CONSULTAR_DETALLE_TMP_FACTURA_CONSUMO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * @fecha  02/05/2017 DD/MM/YYYYY
                     * +Descripcion Metodo encargado del Invocar el path para consultar el detalle del temporal de facturas de consumo
                     */
                    self.generarFacturaXConsumo = function (obj, callback) {
                        Request.realizarRequest(API.FACTURACIONCLIENTES.GENERAR_FACTURA_POR_CONSUMO, "POST", obj, function (data) {
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
                                _terceroDespacho.setContratoClienteId(tipoDocumento[i].contrato_cliente_id); 
                                
                          
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
                             
                            
                            var _pedido = PedidoDespacho.get(datos[i].empresa_id, '','');
                                _pedido.set_numero_cotizacion(datos[i].pedido_cliente_id);
                            
                            if(estado === 1){
                                _pedido.setFechaRegistro(datos[i].fecha_registro);
                                _pedido.setSeleccionado(datos[i].seleccionado);
                                _pedido.set_observacion(datos[i].observacion);
                                _vendedorDespacho.setNumeroTelefonico(datos[i].telefono);
                            }
                             
                            if(estado === 0){    
                                _documento.setValor(datos[i].valor_total);
                                _documento.setSaldo(datos[i].saldo);
                                _documento.setDescripcionEstado(datos[i].descripcion_estado);                              
                                _documento.setEstadoSincronizacion(datos[i].estado);
                                _documento.setFechaFactura(datos[i].fecha_registro);
                                _documento.setFechaVencimientoFactura(datos[i].fecha_vencimiento_factura);
                                _documento.setMensaje2(datos[i].texto2);
                                _documento.setMensaje3(datos[i].texto3);
                                _documento.setMensaje1(datos[i].texto1);
                                _documento.setMensaje4(datos[i].mensaje);
                                _documento.setObservacion(datos[i].observaciones);
                                _documento.setTipoFactura(datos[i].factura_agrupada);
                                _documento.setPorcentajeRtf(datos[i].porcentaje_rtf);
                                _documento.setPorcentajeReteIva(datos[i].porcentaje_reteiva);
                                _documento.setPorcentajeIca(datos[i].porcentaje_ica);
                                // _documento.setDescripcionEstadoFacturacion(datos[i].descripcion_estado_facturacion);
                                _terceroDespacho.setMunicipio(datos[i].municipio_empresa); 
                                _terceroDespacho.setDepartamento(datos[i].departamento_empresa); 
                                _terceroDespacho.setPais(datos[i].pais_empresa); 
                                _terceroDespacho.setUbicacion(datos[i].ubicacion);
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
                                //setDocumentoSeleccionado
                            return _documento;
                        
                       
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * +Descripcion Metodo encargado de generar la factura individual 
                     * @fecha 2017/25/05
                     */
                    self.generarFacturaIndividualCompleta = function (parametros,callback) {
                     
                        parametros.AlertService.mostrarVentanaAlerta("Generar factura individual",  "Confirma que realizara la facturacion ?",
                            function(estadoConfirm){                
                                if(estadoConfirm){

                                    var documentosSeleccionadosFiltrados = [];
                                    /**
                                     * +Descripcion Se recorren los documentos checkeados en los pedidos
                                     *              y se valida cual corresponde con cada pedido
                                     *              para almacenarlos en un nuevo arreglo el cual sera
                                     *              enviado al servidor para posteriormente ser
                                     *              registrados
                                     */
                                    parametros.documentoSeleccionados.forEach(function(documentos){

                                        if(parametros.pedido.pedidos[0].numero_cotizacion === documentos.bodegas_doc_id ){

                                          documentosSeleccionadosFiltrados.push(documentos);

                                        }

                                    });

                                    var obj = {
                                        session: parametros.session,
                                        data: {
                                            generar_factura_individual: {
                                                terminoBusqueda: parametros.termino_busqueda, //$scope.root.numero,
                                                empresaId: parametros.empresaSeleccionada.getCodigo(),
                                                paginaActual: parametros.paginaactual,
                                                tipoIdTercero: parametros.tipoIdTercero,
                                                terceroId: parametros.terceroId,
                                                tipoPago: parametros.tipoPagoFactura,  
                                                pedido: parametros.pedido,
                                                documentos: documentosSeleccionadosFiltrados,
                                                facturacionCosmitet:parametros.facturacionCosmitet
                                            }
                                        }
                                    };

                                    self.generarFacturaIndividual(obj, function (data) {
                                        callback(data);
                                    });                                            
                                }
                            }
                        );                            
                    };
                    
                    
                    /**
                     * @author Cristian Ardila
                     * +Descripcion Metodo encargado de generar la factura agrupada 
                     * @fecha 2017/25/05
                     */
                    self.generarFacturasAgrupadasCompleta = function (parametros, callback) {

                        parametros.AlertService.mostrarVentanaAlerta("Generar factura agrupada", "Confirma que realizara la facturacion ? ",
                            function (estadoConfirm) {
                                if (estadoConfirm) {

                                    /**
                                     * +Descripcion Se recorren los documentos checkeados en los pedidos
                                     *              y se valida cual corresponde con cada pedido
                                     *              para almacenarlos en un nuevo arreglo el cual sera
                                     *              enviado al servidor para posteriormente ser
                                     *              registrados
                                     */
                                    parametros.pedidosSeleccionados.forEach(function (row) {

                                        row.pedidos[0].vaciarDocumentosSeleccionados();
                                        parametros.documentoSeleccionados.forEach(function (documentos) {

                                            if (row.pedidos[0].numero_cotizacion === documentos.bodegas_doc_id) {
                                                row.pedidos[0].agregarDocumentosSeleccionados(documentos);
                                            }
                                        });

                                    });

                                    var obj = {
                                        session: parametros.session,
                                        data: {
                                            generar_factura_agrupada: {
                                                terminoBusqueda: parametros.terminoBusqueda, //$scope.root.numero,
                                                empresaId: parametros.empresaSeleccionada.getCodigo(),
                                                paginaActual: parametros.paginaactual,
                                                tipoIdTercero: parametros.tipoIdTercero,
                                                terceroId: parametros.terceroId,
                                                tipoPago: parametros.tipoPagoFactura,
                                                documentos: parametros.pedidosSeleccionados,
                                                facturacionCosmitet: parametros.facturacionCosmitet
                                            }
                                        }
                                    };

                                    self.generarFacturaAgrupada(obj, function (data) {
                                        callback(data);
                                    });
                                }
                            }
                        );
                    };
                    
                    self.renderFacturasEnProceso = function (datos) {      
                            
                        var facturaProceso = [];
                        for (var i in datos) {

                            var _documento = DocumentoDespacho.get(datos[i].empresa_id, 
                            datos[i].prefijo, 
                            datos[i].factura_fiscal||'', 
                            datos[i].fecha_creacion||'');
                            _documento.set_empresa(datos[i].nombre_empresa);
                            _documento.setFechaInicial(datos[i].fecha_inicial);
                            _documento.setFechaFinal(datos[i].fecha_final);
                            _documento.setDescripcionEstadoFacturacion(datos[i].descripcion_estado_facturacion);
                            _documento.setEstadoFacturacion(datos[i].estado);
                           
                            facturaProceso.push(_documento);
                        }
                        return facturaProceso;
                    };
                    
                    self.renderDetalleTmpFacturaConsumo = function (datos) {      
                      
                        var detalleFacturaTmp = [];
                        for (var i in datos) {                                            
                            var _documento = DocumentoDetalleConsumo.get(datos[i].codigo_producto, 
                            datos[i].cantidad_despachada, 
                            datos[i].lote, 
                            datos[i].fecha_vencimiento,
                            datos[i].prefijo,
                            datos[i].factura_fiscal);
                                                     
                            _documento.setValorUnitario(datos[i].valor_unitario);                          
                            _documento.setPorcIva(datos[i].porc_iva);                          
                            _documento.setPorcIvaTotal(datos[i].porc_iva_total);                          
                            _documento.setId(datos[i].id_factura_xconsumo); 
                            _documento.setDescripcionProducto(datos[i].descripcion);
                            
                           
                            detalleFacturaTmp.push(_documento);
                        }
                        return detalleFacturaTmp;
                    };
                    
                    self.renderCabeceraTmpFacturaConsumo = function (datos) {      
                       
                        var cabeceraFacturaTmp = [];
                        for (var i in datos) {
                            
                            var _documento = FacturaConsumo.get(datos[i].documento_id,datos[i].prefijo,datos[i].factura_fiscal,1);
                            var _terceroDespacho = TerceroDespacho.get(datos[i].nombre_tercero, datos[i].tipo_id_tercero, 
                                datos[i].tercero_id,
                                datos[i].direccion,
                                datos[i].telefono||'');
                                _terceroDespacho.setContratoClienteId(datos[i].contrato_cliente_id);
                                
                            _documento.setId(datos[i].id_factura_xconsumo);                          
                            _documento.setEmpresaId(datos[i].empresa_id);                          
                            _documento.setEmpresa(datos[i].nombre_empresa);                          
                            _documento.setTipoPago(datos[i].descripcion_tipo_pago);                          
                            _documento.setTipoPagoId(datos[i].tipo_pago_id);                          
                            _documento.setUsuario(datos[i].nombre_usuario);                          
                            _documento.setFechaRegistro(datos[i].fecha_registro_corte);                          
                            _documento.setValorTotal(datos[i].valor_total);                          
                            _documento.setValorSubTotal(datos[i].valor_sub_total);                          
                            _documento.setObservaciones(datos[i].observaciones);  
                            _documento.setDescripcionEstadoFacturacion(datos[i].descripcion_estado_facturacion);
                            _documento.setEstadoFacturacion(datos[i].sw_facturacion);
                            
                            _documento.agregarTerceros(_terceroDespacho);
                            cabeceraFacturaTmp.push(_documento);
                        }
                        return cabeceraFacturaTmp;
                    };
                    
                   
                    return this;
                }]);
             

});



