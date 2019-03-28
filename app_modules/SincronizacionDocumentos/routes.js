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

    app.post('/api/SincronizacionDocumentos/listarTiposServicios', function(req, res) {
        c_SincronizacionDoc.listarTiposServicios(req, res);
    });

    app.post('/api/SincronizacionDocumentos/sincronizarDocumentos', function(req, res) {
        c_SincronizacionDoc.sincronizarDocumentos(req, res);
    });

    app.post('/api/SincronizacionDocumentos/listarTiposFacturas', function(req, res) {
        c_SincronizacionDoc.listarTiposFacturas(req, res);
    });
    
    app.post('/api/SincronizacionDocumentos/guardarCuentas', function(req, res) {
        c_SincronizacionDoc.guardarCuentas(req, res);
    });

    app.post('/api/SincronizacionDocumentos/buscarServicio', function(req, res) {
        c_SincronizacionDoc.buscarServicio(req, res);
    });
};