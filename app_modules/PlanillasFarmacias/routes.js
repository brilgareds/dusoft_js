module.exports = function(app, di_container) {


    var c_planillas_farmacias = di_container.get("c_planillas_farmacias");
    
     app.post('/api/PlanillasFarmacias/listar', function(req, res) {
        c_planillas_farmacias.listarPlanillasFarmacias(req, res);
    });
    
   
    
    
   /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para listar los
     * documentos de planillas de farmacias
     */
    app.post('/api/PlanillasFarmacias/listarDocumentos', function(req, res) {
        
    
        c_planillas_farmacias.listarDocumentos(req, res);
    });
    
    
    
     /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para registrar
     * los documentos
     */
     app.post('/api/PlanillasFarmacias/generarPlanillaFarmacia', function(req, res) {
        
    
        c_planillas_farmacias.generarPlanillaFarmacia(req, res);
    });
    
    
     /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para registrar
     * los documentos
     */
     app.post('/api/PlanillasFarmacias/ingresarDocumentoFarmacia', function(req, res) {
        
    
        c_planillas_farmacias.generarDocumentoPlanillaFarmacia(req, res);
    });
    
    /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para actualizar 
     * el estado de la devolucion a estado despachado
     */
    app.post('/api/PlanillasFarmacias/despacharPlanilla', function(req, res) {
        c_planillas_farmacias.despacharPlanilla(req, res);
    });
    /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para consultar
     * el detalle de la planilla segun su id
     */
     app.post('/api/PlanillasFarmacias/consultarPlanillaFarmacia', function(req, res) {
        c_planillas_farmacias.consultarPlanillaFarmacia(req, res);
    });
    
    
     app.post('/api/PlanillasFarmacias/consultarDocumentosPlanillaFarmacia', function(req, res) {
        c_planillas_farmacias.consultarDocumentosPlanillaFarmacia(req, res);
    });
    
    
     app.post('/api/PlanillasFarmacias/eliminarDocumentoPlanillaFarmacia', function(req, res) {
        c_planillas_farmacias.eliminarDocumentoPlanilla(req, res);
    });
};