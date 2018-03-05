module.exports = function (app, di_container) {

    var c_i011 = di_container.get("c_i011");


    app.post('/api/movBodegas/I011/listarBodegas', function (req, res) {
        c_i011.listarBodegas(req, res);
    });

    app.post('/api/movBodegas/I011/listarDevoluciones', function (req, res) {
        c_i011.listarDevoluciones(req, res);
    });

    app.post('/api/movBodegas/I011/listarNovedades', function (req, res) {
        c_i011.listarNovedades(req, res);
    });

    app.post('/api/movBodegas/I011/newDocTemporal', function (req, res) {
        c_i011.newDocTemporal(req, res);
    });

    app.post('/api/movBodegas/I011/agregarItem', function (req, res) {
        c_i011.agregarItem(req, res);
    });

    app.post('/api/movBodegas/I011/modificarCantidad', function (req, res) {
        c_i011.modificarCantidad(req, res);
    });

    app.post('/api/movBodegas/I011/consultarProductosValidados', function (req, res) {
        c_i011.consultarProductosValidados(req, res);
    });
    
    app.post('/api/movBodegas/I011/consultarDetalleDevolucion', function (req, res) {
        c_i011.consultarDetalleDevolucion(req, res);
    });
    
    app.post('/api/movBodegas/I011/eliminarItem', function (req, res) {
        c_i011.eliminarItem(req, res);
    });
    
    app.post('/api/movBodegas/I011/eliminarGetDocTemporal', function (req, res) {
        c_i011.eliminarGetDocTemporal(req, res);
    });
    
    app.post('/api/movBodegas/I011/crearDocumento', function (req, res) {
        c_i011.crearDocumento(req, res);
    });
    
};