module.exports = function (app, di_container) {

    var c_e007 = di_container.get("c_e007");


    app.post('/api/movBodegas/E007/listarEgresos', function (req, res) {
        c_e007.listarEgresos(req, res);
    });

    app.post('/api/movBodegas/E007/listarTiposTerceros', function (req, res) {
        c_e007.listarTiposTerceros(req, res);
    });

    app.post('/api/movBodegas/E007/listarClientes', function (req, res) {
        c_e007.listarClientes(req, res);
    });

    app.post('/api/movBodegas/E007/newDocTemporal', function (req, res) {
        c_e007.newDocTemporal(req, res);
    });

    app.post('/api/movBodegas/E007/eliminarGetDocTemporal', function (req, res) {
        c_e007.eliminarGetDocTemporal(req, res);
    });

    app.post('/api/movBodegas/E007/listarProductos', function (req, res) {
        c_e007.listarProductos(req, res);
    });

    app.post('/api/movBodegas/E007/agregarItem', function (req, res) {
        c_e007.agregarItem(req, res);
    });

    app.post('/api/movBodegas/E007/listarProductosTraslado', function (req, res) {
        c_e007.consultarProductosTraslado(req, res);
    });

    app.post('/api/movBodegas/E007/eliminarItem', function (req, res) {
        c_e007.eliminarItem(req, res);
    });

    app.post('/api/movBodegas/E007/listarClienteId', function (req, res) {
        c_e007.listarClienteId(req, res);
    });

    app.post('/api/movBodegas/E007/listarEgresoId', function (req, res) {
        c_e007.listarEgresoId(req, res);
    });

     app.post('/api/movBodegas/E007/crearDocumento', function (req, res) {
     c_e007.crearDocumento(req, res);
     });

     app.post('/api/movBodegas/E007/consultarLotesProducto', function (req, res) {
     c_e007.consultarLotesProducto(req, res);
     });
//     
//     app.post('/api/movBodegas/E007/crearHtmlDocumento', function (req, res) {
//     c_e007.crearHtmlDocumento(req, res);
//     });

};