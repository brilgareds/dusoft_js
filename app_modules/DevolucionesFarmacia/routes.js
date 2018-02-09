module.exports = function(app, di_container) {


    var c_devoluciones_farmacia = di_container.get("c_devoluciones_farmacia");

       app.post('/api/DevolucionesFarmacia/listarempresas', function(req, res) {
        c_devoluciones_farmacia.listarEmpresas(req, res);
    });

    app.post('/api/DevolucionesFarmacia/listarCentrosUtilidad', function(req, res) {
        c_devoluciones_farmacia.listarCentrosUtilidad(req, res);
    });

    app.post('/api/DevolucionesFarmacia/listarBodegas', function(req, res) {
        c_devoluciones_farmacia.listarBodegas(req, res);
    });

    /*app.post('/api/DevolucionesFarmacia/insertarAutorizacionProductos', function(req, res) {
        c_devoluciones_farmacia.insertarAutorizacionProductos(req, res);
    });

    app.post('/api/DevolucionesFarmacia/listarVerificacionProductos', function(req, res) {
        c_devoluciones_farmacia.listarVerificacionProductos(req, res);
    });*/

};