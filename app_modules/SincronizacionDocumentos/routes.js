module.exports = function(app, di_container) {


    var c_Autorizaciones = di_container.get("c_autorizaciones");

    app.post('/api/Autorizaciones/listarProductosBloqueados', function(req, res) {
        c_Autorizaciones.listarProductosBloqueados(req, res);
    });

};