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
    
  
    
};