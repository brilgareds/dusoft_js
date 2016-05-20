module.exports = function(app, di_container) {

    var c_dispensacion_hc = di_container.get("c_dispensacion_hc");
    

    //var io = di_container.get("socket");

    

    // ================= POST =======================

    // Listar todos los pedidos de los Clientes
    app.post('/api/DispensacionHc/listarFormulas', function(req, res) {
     
        c_dispensacion_hc.listarFormulas(req, res);
    });
    
    app.post("/api/DispensacionHc/listarTipoDocumento", function(req, res){
        console.log("ROOROROROPROOROROOROORO")
        c_dispensacion_hc.listarTipoDocumento(req, res);
    });
    
    

    
    
};