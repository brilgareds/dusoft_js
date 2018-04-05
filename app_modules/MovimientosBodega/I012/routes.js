module.exports = function (app, di_container) {

    var c_i012 = di_container.get("c_i012");


    app.post('/api/movBodegas/I012/listarBodegas', function (req, res) {
        c_i012.listarBodegas(req, res);
    });

    app.post('/api/movBodegas/I012/listarTiposTerceros', function (req, res) {
        c_i012.listarTiposTerceros(req, res);
    });

    app.post('/api/movBodegas/I012/listarClientes', function (req, res) {
        c_i012.listarClientes(req, res);
    });

    app.post('/api/movBodegas/I012/listarFacturas', function (req, res) {
        c_i012.listarFacturas(req, res);
    });

    app.post('/api/movBodegas/I012/listarProductosFacturas', function (req, res) {
        c_i012.listarProductosFacturas(req, res);
    });

    app.post('/api/movBodegas/I012/newDocTemporal', function (req, res) {
        c_i012.newDocTemporal(req, res);
    });

    app.post('/api/movBodegas/I012/eliminarGetDocTemporal', function (req, res) {
        c_i012.eliminarGetDocTemporal(req, res);
    });

    app.post('/api/movBodegas/I012/agregarItem', function (req, res) {
        c_i012.agregarItem(req, res);
    });

    app.post('/api/movBodegas/I012/consultarProductosDevueltos', function (req, res) {
        c_i012.consultarProductosDevueltos(req, res);
    });

    app.post('/api/movBodegas/I012/eliminarItem', function (req, res) {
        c_i012.eliminarItem(req, res);
    });

    app.post('/api/movBodegas/I012/consultarRetenciones', function (req, res) {
        c_i012.consultarRetenciones(req, res);
    });

     app.post('/api/movBodegas/I012/crearDocumento', function (req, res) {
     c_i012.crearDocumento(req, res);
     });
     
     app.post('/api/movBodegas/I012/crearHtmlDocumento', function (req, res) {
     c_i012.crearHtmlDocumento(req, res);
     });

};