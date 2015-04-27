module.exports = function(app, di_container) {

  
    var c_planillas_despachos = di_container.get("c_planillas_despachos");
    
    app.post('/api/PlanillasDespachos/listar', function(req, res) {
        c_planillas_despachos.listarPlanillasDespachos(req, res);
    });
    
    app.post('/api/PlanillasDespachos/consultarPlanillaDespacho', function(req, res) {
        c_planillas_despachos.consultarPlanillaDespacho(req, res);
    });
    
    app.post('/api/PlanillasDespachos/consultarDocumentosPlanillaDespacho', function(req, res) {
        c_planillas_despachos.consultarDocumentosPlanillaDespacho(req, res);
    });
    
    app.post('/api/PlanillasDespachos/generarPlanillaDespacho', function(req, res) {
        c_planillas_despachos.generarPlanillaDespacho(req, res);
    });
    
    app.post('/api/PlanillasDespachos/ingresarDocumentosPlanilla', function(req, res) {
        c_planillas_despachos.ingresarDocumentosPlanillaDespacho(req, res);
    });
    
    app.post('/api/PlanillasDespachos/despacharPlanilla', function(req, res) {
        c_planillas_despachos.despacharPlanilla(req, res);
    });
};