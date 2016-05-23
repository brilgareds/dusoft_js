module.exports = function(app, di_container) {


    var c_Autorizaciones = di_container.get("c_autorizaciones");

    app.post('/api/Autorizaciones/listarProductosBloqueados', function(req, res) {
        c_Autorizaciones.listarProductosBloqueados(req, res);
    });

    app.post('/api/Autorizaciones/VerificarAutorizacionProductos', function(req, res) {
        c_Autorizaciones.verificarAutorizacionProductos(req, res);
    });

    app.post('/api/Autorizaciones/modificarAutorizacionProductos', function(req, res) {
        c_Autorizaciones.modificarAutorizacionProductos(req, res);
    });

    app.post('/api/Autorizaciones/insertarAutorizacionProductos', function(req, res) {
        c_Autorizaciones.insertarAutorizacionProductos(req, res);
    });

    app.post('/api/Autorizaciones/listarVerificacionProductos', function(req, res) {
        c_Autorizaciones.listarVerificacionProductos(req, res);
    });

};