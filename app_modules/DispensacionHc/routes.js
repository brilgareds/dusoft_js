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
    
    // Listar los medicamentos formulados
    app.post("/api/DispensacionHc/listarMedicamentosFormuladosPendientes", function(req, res){
        c_dispensacion_hc.listarMedicamentosFormuladosPendientes(req, res);
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
    app.post("/api/DispensacionHc/consultarLotesDispensarFormula", function(req, res){
        c_dispensacion_hc.consultarLotesDispensarFormula(req, res);
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
    
    //===============================================================REPORTE PDF
    app.post("/api/DispensacionHc/listarTodoMedicamentosDispensados", function(req, res){
        c_dispensacion_hc.listarTodoMedicamentosDispensados(req, res);
    });
    
    app.post("/api/DispensacionHc/listarTotalDispensacionesFormula", function(req, res){
        c_dispensacion_hc.listarTotalDispensacionesFormula(req, res);
    })
    
    app.post("/api/DispensacionHc/listarUltimaDispensacionPendientes", function(req, res){
        c_dispensacion_hc.listarUltimaDispensacionPendientes(req, res);
    })
    //==========================================================================
    
    // consultando los privilegios de dispensacion del usuario de session
    app.post("/api/DispensacionHc/usuarioPrivilegios", function(req, res){
        c_dispensacion_hc.usuarioPrivilegios(req, res);
    });
    
    // Autorizando la dispensacion de un medicamento confrontado
    app.post("/api/DispensacionHc/autorizarDispensacionMedicamento", function(req, res){
        c_dispensacion_hc.autorizarDispensacionMedicamento(req, res);
    });
    
    // Registrando el evento causa de la entrega o no entrega de productos pendientes del paciente
    app.post("/api/DispensacionHc/registrarEvento", function(req, res){
        c_dispensacion_hc.registrarEvento(req, res);
    });
    
    //COnsultando los eventos registrados
    app.post("/api/DispensacionHc/listarRegistroDeEventos", function(req, res){
        c_dispensacion_hc.listarRegistroDeEventos(req, res);
    });
     
    // realizando la entrega de los pendientes de la formula
    app.post("/api/DispensacionHc/realizarEntregaFormulaPendientes", function(req, res){
        c_dispensacion_hc.realizarEntregaFormulaPendientes(req, res);
    });
    
    // realizando la entrega de los pendientes de la formula
    app.post("/api/DispensacionHc/guardarTodoPendiente", function(req, res){
        c_dispensacion_hc.guardarTodoPendiente(req, res);
    });
    
    
    
    // realizando el descarte de los productos pendientes
    app.post("/api/DispensacionHc/descartarProductoPendiente", function(req, res){
        c_dispensacion_hc.descartarProductoPendiente(req, res);
    });
    
    
    
    // realizando el descarte de los productos pendientes
    app.post("/api/DispensacionHc/obtenerCabeceraFormula", function(req, res){
        c_dispensacion_hc.obtenerCabeceraFormula(req, res);
    });
    
    
    /**
     * +DESCRIPCION SERVICIO EXCLUSIVO PARA ALMACENAR LAS FORMULAS EN LA TABLA
     *              DE DISPENSACION_ESTADOS
     */
    app.post("/api/DispensacionHc/insertarFormulasDispensacionEstados", function(req, res){
        c_dispensacion_hc.insertarFormulasDispensacionEstados(req, res);
    });
    
    
};