module.exports = function(app, di_container) {


    var c_planillas_farmacias = di_container.get("c_planillas_farmacias");
    
     app.post('/api/PlanillasDevolucion/listar', function(req, res) {
        c_planillas_farmacias.listarPlanillasFarmacias(req, res);
    });
    
    /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para listar las
     * farmacias
     */
    app.post('/api/PlanillasFarmacias/listando/empresas', function(req, res) {
        
    
        c_planillas_farmacias.listar_farmacias(req, res);
    });
    
    
   /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para listar los
     * documentos de planillas de farmacias
     */
    app.post('/api/PlanillasFarmacias/listando/documentos', function(req, res) {
        
    
        c_planillas_farmacias.listar_documentos(req, res);
    });
    
    
    
     /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para registrar
     * los documentos
     */
     app.post('/api/PlanillasFarmacias/generar/planilla/farmacia', function(req, res) {
        
    
        c_planillas_farmacias.generarPlanillaFarmacia(req, res);
    });
    
    
     /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para registrar
     * los documentos
     */
     app.post('/api/PlanillasFarmacias/ingresar/documento/farmacia', function(req, res) {
        
    
        c_planillas_farmacias.generarDocumentoPlanillaFarmacia(req, res);
    });
    
    
};