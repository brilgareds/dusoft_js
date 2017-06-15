module.exports = function(app, di_container) {

    var c_caja_general = di_container.get("c_caja_general");

    app.post('/api/CajaGeneral/listarCajaGeneral', function(req, res) {
        c_caja_general.listarCajaGeneral(req, res);
    });

    app.post('/api/CajaGeneral/listarGrupos', function(req, res) {
        c_caja_general.listarGrupos(req, res);
    });

    app.post('/api/CajaGeneral/insertarTmpDetalleConceptos', function(req, res) {
        c_caja_general.insertarTmpDetalleConceptos(req, res);
    });

    app.post('/api/CajaGeneral/listarConceptosDetalle', function(req, res) {
        c_caja_general.listarConceptosDetalle(req, res);
    });

    app.post('/api/CajaGeneral/eliminarTmpDetalleConceptos', function(req, res) {
        c_caja_general.eliminarTmpDetalleConceptos(req, res);
    });

    app.post('/api/CajaGeneral/guardarFacturaCajaGenral', function(req, res) {
        c_caja_general.guardarFacturaCajaGenral(req, res);
    });

};