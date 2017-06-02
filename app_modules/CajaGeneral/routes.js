module.exports = function(app, di_container) {

    var c_caja_general = di_container.get("c_caja_general");

    app.post('/api/CajaGeneral/listarCajaGeneral', function(req, res) {
        c_caja_general.listarCajaGeneral(req, res);
    });
    app.post('/api/CajaGeneral/listarGrupos', function(req, res) {
        c_caja_general.listarGrupos(req, res);
    });

};