module.exports = function (app, di_container) {

    var c_i011 = di_container.get("c_i011");


    app.post('/api/movBodegas/I011/listarBodegas', function (req, res) {
        c_i011.listarBodegas(req, res);
    });

    app.post('/api/movBodegas/I011/listarDevoluciones', function (req, res) {
        c_i011.listarDevoluciones(req, res);
    });
    
    app.post('/api/movBodegas/I011/consultarDetalleDevolucion', function (req, res) {
        c_i011.consultarDetalleDevolucion(req, res);
    });

};