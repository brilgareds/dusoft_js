module.exports = function(app, di_container) {
   
    var c_formulacion_externa = di_container.get("c_formulacion_externa");
    var c_dispensacion_hc = di_container.get("c_dispensacion_hc");
    
    app.post('/api/FormulacionExterna/obtenerTiposDocumento', function(req, res) {
        c_dispensacion_hc.listarTipoDocumento(req, res);
    });    

    app.post('/api/FormulacionExterna/obtenerAfiliado', function(req, res) {
        c_formulacion_externa.obtenerAfiliado(req, res);
    });

    app.post('/api/FormulacionExterna/obtenerTipoFormula', function(req, res) {
        c_dispensacion_hc.listarTipoFormula(req, res);
    });

    app.post('/api/FormulacionExterna/obtenerMunicipios', function(req, res) {
        c_formulacion_externa.obtenerMunicipios(req, res);
    });

    app.post('/api/FormulacionExterna/obtenerDiagnosticos', function(req, res) {
        c_formulacion_externa.obtenerDiagnosticos(req, res);
    });

    app.post('/api/FormulacionExterna/obtenerDiagnosticosTmp', function(req, res) {
        c_formulacion_externa.obtenerDiagnosticosTmp(req, res);
    });

    app.post('/api/FormulacionExterna/obtenerProfesionales', function(req, res) {
        c_formulacion_externa.obtenerProfesionales(req, res);
    }); 

    app.post('/api/FormulacionExterna/eliminarDiagnosticoTmp', function(req, res) {
        c_formulacion_externa.eliminarDiagnosticoTmp(req, res);
    });    

    app.post('/api/FormulacionExterna/insertarDiagnosticoTmp', function(req, res) {
        c_formulacion_externa.insertarDiagnosticoTmp(req, res);
    });    

    app.post('/api/FormulacionExterna/insertarFormulaTmp', function(req, res) {
        c_formulacion_externa.insertarFormulaTmp(req, res);
    });    

    app.post('/api/FormulacionExterna/obtenerFormulaExternaTmp', function(req, res) {
        c_formulacion_externa.obtenerFormulaExternaTmp(req, res);
    });   

    app.post('/api/FormulacionExterna/buscarProductos', function(req, res) {
        c_formulacion_externa.buscarProductos(req, res);
    });       

    app.post('/api/FormulacionExterna/insertarMedicamentoTmp', function(req, res) {
        c_formulacion_externa.insertarMedicamentoTmp(req, res);
    });       

    app.post('/api/FormulacionExterna/obtenerMedicamentosTmp', function(req, res) {
        c_formulacion_externa.obtenerMedicamentosTmp(req, res);
    });  

    app.post('/api/FormulacionExterna/eliminarMedicamentoTmp', function(req, res) {
        c_formulacion_externa.eliminarMedicamentoTmp (req, res);
    });   

    app.post('/api/FormulacionExterna/eliminarDispensacionMedicamentoTmp', function(req, res) {
        c_formulacion_externa.eliminarDispensacionMedicamentoTmp (req, res);
    });       

    app.post('/api/FormulacionExterna/consultaExisteFormula', function(req, res) {
        c_formulacion_externa.consultaExisteFormula(req, res);
    });       

    app.post('/api/FormulacionExterna/obtenerLotesDeProducto', function(req, res) {
        c_formulacion_externa.obtenerLotesDeProducto(req, res);
    });   

    app.post('/api/FormulacionExterna/insertarDispensacionMedicamentoTmp', function(req, res) {
        c_formulacion_externa.insertarDispensacionMedicamentoTmp(req, res);
    });   

    app.post('/api/FormulacionExterna/obtenerDispensacionMedicamentosTmp', function(req, res) {
        c_formulacion_externa.obtenerDispensacionMedicamentosTmp(req, res);
    });

    app.post('/api/FormulacionExterna/generarEntrega', function(req, res) {
        c_formulacion_externa.generarEntrega(req, res);
    });       
};