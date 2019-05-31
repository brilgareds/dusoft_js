module.exports = function (app, di_container) {


    var c_contratos = di_container.get("c_contratos");

    app.post('/api/Auditorias/Contratos/listarProductosContrato', function (req, res) {
        c_contratos.listarProductosContrato(req, res);
    });

    app.post('/api/Auditorias/Contratos/descargarProductosContrato', function (req, res) {
        c_contratos.descargarProductosContrato(req, res);
    });

};