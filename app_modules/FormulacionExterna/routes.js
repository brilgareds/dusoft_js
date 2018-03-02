module.exports = function(app, di_container) {
   
    var c_formulacion_externa = di_container.get("c_formulacion_externa");
    var c_dispensacion_hc = di_container.get("c_dispensacion_hc");
    
    app.post('/api/FormulacionExterna/obtenerTiposDocumento', function(req, res) {
        c_dispensacion_hc.listarTipoDocumento(req, res);
    });    

    app.post('/api/FormulacionExterna/obtenerPaciente', function(req, res) {
        c_formulacion_externa.obtenerPaciente(req, res);
    });

    app.post('/api/FormulacionExterna/obtenerTipoFormula', function(req, res) {
        c_dispensacion_hc.listarTipoFormula(req, res);
    });

    app.post('/api/FormulacionExterna/obtenerMunicipios', function(req, res) {
        c_formulacion_externa.obtenerMunicipios(req, res);
    });

};