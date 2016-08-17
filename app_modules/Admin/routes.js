module.exports = function(app, di_container) {

    var c_admin = di_container.get('c_admin');
    var c_configreportesAdmin = di_container.get('c_configreportesAdmin');
    
    // Consultar la disponibilidad productos
    app.post('/api/Admin/inicializarAplicacion', function(req, res) {
        c_admin.inicializarAplicacion(req, res);
    });
    
    app.post('/api/Admin/ReportesAdmin/obtenerConfiguracionReporte', function(req, res) {
        c_configreportesAdmin.obtenerConfiguracionReporte(req, res);
    });
};