module.exports = function(app, di_container) {

    // ======== Rutas para Documentos E008 =============

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

    // ======== FIN Rutas para Documentos E008 =============    

    // Events E008
    io.sockets.on('connection', function(socket) {

        console.log('=== onConnection E008 ====');
        console.log(socket.id);

        var socket_id = socket.id;
        socket.on('onObtenerTiempoSeparacionCliente', function(datos) {
            e_e008.onObtenerTiempoSeparacionCliente(socket_id, datos);
        });

        socket.on('onObtenerTiempoSeparacionFarmacias', function(datos) {
            e_e008.onObtenerTiempoSeparacionFarmacias(socket_id, datos);
        });

        socket.on('disconnect', function() {
            // reconnect
            console.log('============= onDisConnection E008 =============');
            console.log(socket.id);
        });
    });

};