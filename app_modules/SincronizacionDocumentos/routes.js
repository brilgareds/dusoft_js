module.exports = function(app, di_container) {
    
    var c_SincronizacionDoc = di_container.get("c_SincronizacionDoc");

    app.post('/api/SincronizacionDocumentos/listarPrefijos', function(req, res) {
        c_SincronizacionDoc.listarPrefijos(req, res);
    });
    
    app.post('/api/SincronizacionDocumentos/listarTipoCuentaCategoria', function(req, res) {
        c_SincronizacionDoc.listarTipoCuentaCategoria(req, res);
    });
    
    app.post('/api/SincronizacionDocumentos/insertTiposCuentas', function(req, res) {
        c_SincronizacionDoc.insertTiposCuentas(req, res);
    });
    
    app.post('/api/SincronizacionDocumentos/listarDocumentosCuentas', function(req, res) {
        c_SincronizacionDoc.listarDocumentosCuentas(req, res);
    });
    
    app.post('/api/SincronizacionDocumentos/listarTiposCuentas', function(req, res) {
        c_SincronizacionDoc.listarTiposCuentas(req, res);
    });
};