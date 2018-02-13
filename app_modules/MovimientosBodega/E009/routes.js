module.exports = function(app, di_container) {

    // ======== Rutas para Documentos Temporales E009 =============

    var c_e009 = di_container.get("c_e009");

    // Generar Documento temporal de despacho clientes
    app.post('/api/movBodegas/E009/documentoTemporalClientes', function(req, res) {
        c_e009.documentoTemporalClientes(req, res);
    });
    
    app.post('/api/movBodegas/E009/listarBodegas', function(req, res) {
        c_e009.listarBodegas(req, res);
    });

};