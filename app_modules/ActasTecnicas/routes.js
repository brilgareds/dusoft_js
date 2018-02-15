module.exports = function(app, di_container) {


    var c_ActasTecnicas = di_container.get("c_actasTecnicas");

    app.post('/api/ActasTecnicas/listarOrdenesParaActas', function(req, res) {
        c_ActasTecnicas.listarOrdenesParaActas(req, res);
    });
    
    app.post('/api/ActasTecnicas/listarProductosParaActas', function(req, res) {
        c_ActasTecnicas.listarProductosParaActas(req, res);
    });

};