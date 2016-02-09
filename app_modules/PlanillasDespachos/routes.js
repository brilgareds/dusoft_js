module.exports = function(app, di_container) {


    var c_planillas_despachos = di_container.get("c_planillas_despachos");

    app.post('/api/PlanillasDespachos/listar', function(req, res) {
        c_planillas_despachos.listarPlanillasDespachos(req, res);
    });

    // Consultar los documentos de despacho de un farmacua 
    app.post('/api/PlanillasDespachos/documentosDespachosPorFarmacia', function(req, res) {
        c_planillas_despachos.consultarDocumentosDespachosPorFarmacia(req, res);
    });

    // Consultar los documentos de despacho de un cliente 
    app.post('/api/PlanillasDespachos/documentosDespachosPorCliente', function(req, res) {
        c_planillas_despachos.consultarDocumentosDespachosPorCliente(req, res);
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

    app.post('/api/PlanillasDespachos/eliminarDocumentoPlanilla', function(req, res) {
        c_planillas_despachos.eliminarDocumentoPlanilla(req, res);
    });

    app.post('/api/PlanillasDespachos/despacharPlanilla', function(req, res) {
        c_planillas_despachos.despacharPlanilla(req, res);
    });

    //Generar Reporte Planilla Despacho
    app.post('/api/PlanillasDespachos/reportePlanillaDespacho', function(req, res) {
        c_planillas_despachos.reportePlanillaDespacho(req, res);
    });
    
    
    
    
    /**
     * @author Cristian Ardila
     * @fecha 02/02/2016
     * +Descripcion: METODO ENCARGADO DE CONSULTAR LAS CANTIDADES DE CAJAS Y NEVERAS AUDITADAS
     */
    app.post('/api/PlanillasDespachos/consultarCantidadCajaNevera', function(req, res) {
        c_planillas_despachos.consultarCantidadCajaNevera(req, res);
    });
    
   /**
     * @author Cristian Ardila
     * @fecha 02/02/2016
     * +Descripcion: METODO ENCARGADO DE CONSULTAR LAS CANTIDADES DE CAJAS
     */
    app.post('/api/PlanillasDespachos/gestionarLios', function(req, res) {
        c_planillas_despachos.gestionarLios(req, res);
    });
};