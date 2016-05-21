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
        console.log("ÑÑÑÑLLLLLEGO AL ROUTE")
        c_dispensacion_hc.listarFormulasPendientes(req, res);
    });

    
    
};