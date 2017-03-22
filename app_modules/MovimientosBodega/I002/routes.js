module.exports = function(app, di_container) {

    // ======== Rutas para Documentos Temporales E008 =============

    var c_i002 = di_container.get("c_i002");
//    var e_i002 = di_container.get("e_i002");
//    var io = di_container.get("socket");


    app.post('/api/movBodegas/I002/newDocTemporal', function(req, res) {
        c_i002.newDocTemporal(req, res);
    });
    
    app.post('/api/movBodegas/I002/listarInvBodegasMovimientoTmpOrden', function(req, res) {
        c_i002.listarInvBodegasMovimientoTmpOrden(req, res);
    });
    
    app.post('/api/movBodegas/I002/listarParametrosRetencion', function(req, res) {
        c_i002.listarParametrosRetencion(req, res);
    });
    
    app.post('/api/movBodegas/I002/listarGetItemsDocTemporal', function(req, res) {
        c_i002.listarGetItemsDocTemporal(req, res);
    });
    
    app.post('/api/movBodegas/I002/listarGetDocTemporal', function(req, res) {
        c_i002.listarGetDocTemporal(req, res);
    });
    
    app.post('/api/movBodegas/I002/listarProductosPorAutorizar', function(req, res) {
        c_i002.listarProductosPorAutorizar(req, res);
    });
    
    app.post('/api/movBodegas/I002/listarProductosParaAsignar', function(req, res) {
        c_i002.listarProductosParaAsignar(req, res);
    });
      
};