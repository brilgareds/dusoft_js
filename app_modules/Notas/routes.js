module.exports = function(app, di_container) {

    var c_notas = di_container.get("c_notas");

    app.post('/api/Notas/listarFacturas', function(req, res) {
        c_notas.listarFacturas(req, res);
    });
    
    app.post('/api/Notas/ConsultarNotas', function(req, res) {
        c_notas.ConsultarNotas(req, res);
    });

    app.post('/api/Notas/ConsultarDetalleFactura', function(req, res) {
        c_notas.ConsultarDetalleFactura(req, res);
    });

    app.post('/api/Notas/crearNota', function(req, res) {
        c_notas.crearNota(req, res);
    });

    app.post('/api/Notas/crearNotaCredito', function(req, res) {
        c_notas.crearNotaCredito(req, res);
    });
    
    app.post('/api/Notas/imprimirNota', function(req, res) {
        c_notas.imprimirNota(req, res);
    });
    
    app.post('/api/Notas/listarConceptos', function(req, res) {
        c_notas.listarConceptos(req, res);
    });
//
//    app.post('/api/Notas/eliminarTmpDetalleConceptos', function(req, res) {
//        c_notas.eliminarTmpDetalleConceptos(req, res);
//    });
//
//    app.post('/api/Notas/guardarFacturaCajaGenral', function(req, res) {
//        c_notas.guardarFacturaNotas(req, res);
//    });
//
//    app.post('/api/Notas/listarFacturasGeneradasNotas', function(req, res) {
//        c_notas.listarFacturasGeneradasNotas(req, res);
//    });
//    
//    app.post('/api/Notas/imprimirFacturaNotas', function(req, res) {
//        c_notas.imprimirFacturaNotas(req, res);
//    });
//    
//    app.post('/api/Notas/sincronizarFacturaNotas', function(req, res) {
//        c_notas.sincronizarFacturaNotas(req, res);
//    });
//    
//    app.post('/api/Notas/listarPrefijos', function(req, res) {
//        c_notas.listarPrefijos(req, res);
//    });
//    
//    app.post('/api/Notas/insertarFacFacturasConceptosNotas', function(req, res) {
//        c_notas.insertarFacFacturasConceptosNotas(req, res);
//    });
//    
//    app.post('/api/Notas/listarFacConceptosNotas', function(req, res) {
//        c_notas.listarFacConceptosNotas(req, res);
//    });
//    
//    app.post('/api/Notas/imprimirFacturaNotasDetalle', function(req, res) {
//        c_notas.imprimirFacturaNotasDetalle(req, res);
//    });
//    
//    app.post('/api/Notas/consultarImpuestosTercero', function(req, res) {
//        c_notas.consultarImpuestosTercero(req, res);
//    });
//    
//    app.post('/api/Notas/listarNotas', function(req, res) {
//        c_notas.listarNotas(req, res);
//    });
//       

};