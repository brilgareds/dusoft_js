module.exports = function(app, di_container) {
    
    var c_Autorizaciones = di_container.get("c_autorizaciones");

    app.post('/api/SincronizacionDocumentos/listarPrefijos', function(req, res) {
        c_Autorizaciones.listarProductosBloqueados(req, res);
    });

    app.post('/api/SincronizacionDocumentos/verificarAutorizacionProductos', function(req, res) {
        c_Autorizaciones.verificarAutorizacionProductos(req, res);
    });

};