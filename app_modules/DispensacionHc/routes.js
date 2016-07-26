module.exports = function(app, di_container) {

    var c_dispensacion_hc = di_container.get("c_dispensacion_hc");
    

    //var io = di_container.get("socket");

    

    // ================= POST =======================

    // Listar las formulas medicas
    app.post('/api/DispensacionHc/listarFormulas', function(req, res) {
     
        c_dispensacion_hc.listarFormulas(req, res);
    });
    
    // Listar los tipos de documentos
    app.post("/api/DispensacionHc/listarTipoDocumento", function(req, res){
       
        c_dispensacion_hc.listarTipoDocumento(req, res);
    });
    
     // Listar las formulas medicas con pendientes
    app.post("/api/DispensacionHc/listarFormulasPendientes", function(req, res){
        c_dispensacion_hc.listarFormulasPendientes(req, res);
    });
    
    // Listar los medicamentos formulados
    app.post("/api/DispensacionHc/listarMedicamentosFormulados", function(req, res){
        c_dispensacion_hc.listarMedicamentosFormulados(req, res);
    });
    
    // consultar los medicamentos despachados
    app.post("/api/DispensacionHc/consultarMedicamentosDespachados", function(req, res){
        c_dispensacion_hc.consultarMedicamentosDespachados(req, res);
    });
  
        // cantidad de producto temporal
    app.post("/api/DispensacionHc/cantidadProductoTemporal", function(req, res){
        c_dispensacion_hc.cantidadProductoTemporal(req, res);
    });
    
    // lotes de los productos de cada FOFO
    app.post("/api/DispensacionHc/existenciasBodegas", function(req, res){
        c_dispensacion_hc.existenciasBodegas(req, res);
    });
    
    // lotes de los productos de cada FOFO
    app.post("/api/DispensacionHc/temporalLotes", function(req, res){
        c_dispensacion_hc.temporalLotes(req, res);
    });
    
    // Medicamentos temporales
    app.post("/api/DispensacionHc/listarMedicamentosTemporales", function(req, res){
        c_dispensacion_hc.listarMedicamentosTemporales(req, res);
    });
    
    // Eliminar Medicamentos temporales
    app.post("/api/DispensacionHc/eliminarTemporalFormula", function(req, res){
        c_dispensacion_hc.eliminarTemporalFormula(req, res);
    });
    
    
    // consultar tipos de formulas
    app.post("/api/DispensacionHc/listarTipoFormula", function(req, res){
        c_dispensacion_hc.listarTipoFormula(req, res);
    });
    
    // realizando la entrega de la formula
    app.post("/api/DispensacionHc/realizarEntregaFormula", function(req, res){
        c_dispensacion_hc.realizarEntregaFormula(req, res);
    });
    
    // consultando los medicamentos pendientes por dispensar
    app.post("/api/DispensacionHc/listarMedicamentosPendientesPorDispensar", function(req, res){
        c_dispensacion_hc.listarMedicamentosPendientesPorDispensar(req, res);
    });
    
    // consultando los medicamentos dispensados
    app.post("/api/DispensacionHc/listarMedicamentosDispensados", function(req, res){
        c_dispensacion_hc.listarMedicamentosDispensados(req, res);
    });

};