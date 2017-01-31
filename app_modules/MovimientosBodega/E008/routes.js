module.exports = function(app, di_container) {

    // ======== Rutas para Documentos Temporales E008 =============

    var c_e008 = di_container.get("c_e008");
    var e_e008 = di_container.get("e_e008");
    var io = di_container.get("socket");

    // Generar Documento temporal de despacho clientes
    app.post('/api/movBodegas/E008/documentoTemporalClientes', function(req, res) {
        c_e008.documentoTemporalClientes(req, res);
    });

    // Finalizar Documento Temporal Clientes
    app.post('/api/movBodegas/E008/finalizarDocumentoTemporalClientes', function(req, res) {
        c_e008.finalizarDocumentoTemporalClientes(req, res);
    });

    // Generar Documento temporal de despacho farmacias
    app.post('/api/movBodegas/E008/documentoTemporalFarmacias', function(req, res) {
        c_e008.documentoTemporalFarmacias(req, res);
    });

    // Finalizar Documento Temporal FARMACIAS
    app.post('/api/movBodegas/E008/finalizarDocumentoTemporalFarmacias', function(req, res) {
        c_e008.finalizarDocumentoTemporalFarmacias(req, res);
    });

    // Ingresar Detalle Documento temporal de farmacias/clientes
    app.post('/api/movBodegas/E008/detalleDocumentoTemporal', function(req, res) {
        c_e008.detalleDocumentoTemporal(req, res);
    });

    // Consultar TODOS los documentos temporales de despacho clientes 
    app.post('/api/movBodegas/E008/consultarDocumentosTemporalesClientes', function(req, res) {
        c_e008.consultarDocumentosTemporalesClientes(req, res);
    });

    // Consultar TODOS los documentos temporales de despacho farmacias  
    app.post('/api/movBodegas/E008/consultarDocumentosTemporalesFarmacias', function(req, res) {
        c_e008.consultarDocumentosTemporalesFarmacias(req, res);
    });

    // Consultar Documento Temporal Clientes x numero de pedido
    app.post('/api/movBodegas/E008/consultarDocumentoTemporalClientes', function(req, res) {
        c_e008.consultarDocumentoTemporalClientes(req, res);
    });

    // Consultar Documento Temporal Farmacias x numero de pedido
    app.post('/api/movBodegas/E008/consultarDocumentoTemporalFarmacias', function(req, res) {
        c_e008.consultarDocumentoTemporalFarmacias(req, res);
    });
    
    // Eliminar Producto Documento Temporal CLIENTES / FARMACIAS
    app.post('/api/movBodegas/E008/eliminarProductoDocumentoTemporal', function(req, res) {
        c_e008.eliminarProductoDocumentoTemporal(req, res);
    });

    // Eliminar Documento Temporal Despacho Clientes
    app.post('/api/movBodegas/E008/eliminarDocumentoTemporalClientes', function(req, res) {
        c_e008.eliminarDocumentoTemporalClientes(req, res);
    });

    // Eliminar Documento Temporal Clientes
    app.post('/api/movBodegas/E008/eliminarDocumentoTemporalFarmacias', function(req, res) {
        c_e008.eliminarDocumentoTemporalFarmacias(req, res);
    });

    // Ingresar Justificacion de productos pendientes en despachos CLIENTES y FARMACIAS
    app.post('/api/movBodegas/E008/justificacionPendientes', function(req, res) {
        c_e008.justificacionPendientes(req, res);
    });

    // Actualizar bodegas_doc_id en documento temporal Clientes.
    app.post('/api/movBodegas/E008/actualizarTipoDocumentoTemporalClientes', function(req, res) {
        c_e008.actualizarTipoDocumentoTemporalClientes(req, res);
    });

    // Actualizar bodegas_doc_id en documento temporal Clientes.
    app.post('/api/movBodegas/E008/actualizarTipoDocumentoTemporalFarmacias', function(req, res) {
        c_e008.actualizarTipoDocumentoTemporalFarmacias(req, res);
    });

    // ======== FIN Rutas para Documentos Temporales E008 =============    

    // ======== Auditoria de Documento de Despacho ====================

    // Buscar productos para auditar de Clientes
    app.post('/api/movBodegas/E008/auditoriaProductosClientes', function(req, res) {
        c_e008.auditoriaProductosClientes(req, res);
    });
    
    // Consultar para auditar productos documento temporal Farmacias
    app.post('/api/movBodegas/E008/auditoriaProductosFarmacias', function(req, res) {
        c_e008.auditoriaProductosFarmacias(req, res);
    });

    // Consultar productos Auditados ---- hacer aqui tambien el buscardor para los no auditados
    app.post('/api/movBodegas/E008/consultarProductosAuditados', function(req, res) {
        c_e008.consultarProductosAuditados(req, res);
    });
    
    app.post('/api/movBodegas/E008/buscarItemsTemporal', function(req, res){
        c_e008.buscarItemsTemporal(req, res);
    });

    // Modificar detalle Documento Temporal
    app.post('/api/movBodegas/E008/modificarDetalleDocumentoTemporal', function(req, res) {
        c_e008.modificarDetalleDocumentoTemporal(req,res);
    });

    // Validar que el numero de caja sea valido 
    app.post('/api/movBodegas/E008/validarCajaProducto', function(req, res) {
        c_e008.validarCajaProducto(req, res);
    });
    
    // Generar Rotulo 
    app.post('/api/movBodegas/E008/generarRotuloCaja', function(req, res) {
        c_e008.generarRotuloCaja(req, res);
    });
    
    //actualiza caja de item en temporal
    app.post('/api/movBodegas/E008/actualizarCajaDeTemporales', function(req, res) {
        c_e008.actualizarCajaDeTemporales(req, res);
    });

    // Auditar Producto Documento Temporal
    app.post('/api/movBodegas/E008/auditarProductoDocumentoTemporal', function(req, res) {
        c_e008.auditarProductoDocumentoTemporal(req, res);
    });

    // Generar Documento Despacho Clientes
    app.post('/api/movBodegas/E008/generarDocumentoDespachoClientes', function(req, res) {
        c_e008.generarDocumentoDespachoClientes(req, res);
    });

    // Generar Documento Despacho Farmacias
    app.post('/api/movBodegas/E008/generarDocumentoDespachoFarmacias', function(req, res) {
        c_e008.generarDocumentoDespachoFarmacias(req, res);
    });
    
    //generar rotulo por caja
    app.post('/api/movBodegas/E008/imprimirRotuloClientes', function(req, res){
       c_e008.imprimirRotuloClientes(req, res); 
    });
    
    app.post('/api/movBodegas/E008/imprimirRotuloFarmacias', function(req, res){
       c_e008.imprimirRotuloFarmacias(req, res); 
    });
    
    app.post('/api/movBodegas/E008/imprimirDocumentoDespacho', function(req, res) {
        c_e008.imprimirDocumentoDespacho(req, res);
    });
    
     /**
     * @author Cristian Ardila
     * @fecha  16/02/2016
     * +Descripcion Servicio para consultar los despachos auditados
     */
    app.post('/api/movBodegas/E008/listarDespachosAuditados', function(req, res) {
        c_e008.listarDespachosAuditados(req, res);
    });
    
    /**
     * @author Cristian Ardila
     * @fecha  16/02/2016
     * +Descripcion Servicio para consultar los despachos auditados
     */
    app.post('/api/movBodegas/E008/detalleDocumentoAuditado', function(req, res) {
        c_e008.detalleDocumentoAuditado(req, res);
    });
    
    /**
     * @author Cristian Ardila
     * @fecha  16/02/2016
     * +Descripcion Servicio para consultar los pedidos de un documento
     */
    app.post('/api/movBodegas/E008/detallePedidoClienteDocumento', function(req, res) {
        c_e008.detallePedidoClienteDocumento(req, res);
    });
    
   /**
     * @author Cristian Ardila
     * @fecha  16/02/2016
     * +Descripcion Servicio para consultar los pedidos de farmacia de un documento
     */
    app.post('/api/movBodegas/E008/detallePedidoFarmaciaDocumento', function(req, res) {
        c_e008.detallePedidoFarmaciaDocumento(req, res);
    });
    
    
    
    // ======== FIN Auditoria de Documento de Despacho ====================
    
    
    //========================== Despachos de bodegas ==========================
    
    // Consultar todos los documentos de despachos generados
    app.post('/api/movBodegas/E008/consultarDocumentosDespachos', function(req, res) {
        
    });
    
    // Consultar los documentos de despachos clientes generados
    app.post('/api/movBodegas/E008/consultarDocumentosDespachosClientes', function(req, res) {
        
    });
    
    // Consultar los documentos de despachos farmacias generados
    app.post('/api/movBodegas/E008/consultarDocumentosDespachosFarmacias', function(req, res) {
        
    });    
      
     // Consultar el documento de la tabla inventario movimientos
    app.post('/api/movBodegas/E008/obtenerDocumento', function(req, res) {     
        c_e008.obtenerDocumento(req, res);
    });  
    
   app.post('/api/movBodegas/E008/consultarNumeroMayorRotulo', function(req, res) {
       
        c_e008.consultarNumeroMayorRotulo(req, res);
    }); 
    
    app.post('/api/movBodegas/E008/sincronizarDocumentoDespacho', function(req, res) {
       
        c_e008.sincronizarDocumentoDespacho(req, res);
    }); 
    
    app.post('/api/movBodegas/E008/obtenerJustificaciones', function(req, res) {
       
        c_e008.obtenerJustificaciones(req, res);
    }); 
      
    //========================== FIN Despachos bodegas =========================
    
    

    // ======== Events E008 ========
    io.sockets.on('connection', function(socket) {

        /*console.log('=== onConnection E008 ====');
        console.log(socket.id);*/

        var socket_id = socket.id;
        socket.on('onObtenerTiempoSeparacionCliente', function(datos) {
            e_e008.onObtenerTiempoSeparacionCliente(socket_id, datos);
        });

        socket.on('onObtenerTiempoSeparacionFarmacias', function(datos) {
            e_e008.onObtenerTiempoSeparacionFarmacias(socket_id, datos);
        });

        socket.on('disconnect', function(data) {
            console.log("onDisconnect with data ", data);
            // reconnect
           /* console.log('============= onDisConnection E008 =============');
            console.log(socket.id);*/
        });
    });

};