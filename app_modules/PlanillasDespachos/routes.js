module.exports = function(app, di_container) {

  
    var c_planillas_despachos = di_container.get("c_planillas_despachos");
    
    app.post('/api/PlanillasDespachos/listar', function(req, res) {
        c_planillas_despachos.listarPlanillasDespachos(req, res);
    });
    
    app.post('/api/PlanillasDespachos/consultarPlanillaDespacho', function(req, res) {
        c_planillas_despachos.consultarPlanillaDespacho(req, res);
    });
};