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
    
    app.post('/api/Notas/imprimirNotaCredito', function(req, res) {
        c_notas.imprimirNotaCredito(req, res);
    });
    
    app.post('/api/Notas/listarConceptos', function(req, res) {
        c_notas.listarConceptos(req, res);
    });
    
    app.post('/api/Notas/listarPorcentajes', function(req, res) {
        c_notas.listarPorcentajes(req, res);
    });
    
    app.post('/api/Notas/sincronizarNotas', function(req, res) {
        c_notas.sincronizarNotas(req, res);
    });
    
};