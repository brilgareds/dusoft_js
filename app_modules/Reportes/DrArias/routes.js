module.exports = function(app, di_container) {


    var c_Reportes = di_container.get("c_reportes");

    app.post('/api/Reportes/DrArias/listarDrArias', function(req, res) {
        c_Reportes.listarDrArias(req, res);
    });
    
    app.post('/api/Reportes/DrArias/listarPlanes', function(req, res) {
        c_Reportes.listarPlanes(req, res);
    });
    
    app.post('/api/Reportes/DrArias/guardarEstadoReporte', function(req, res) {
        c_Reportes.guardarEstadoReporte(req, res);
    });
    
    app.post('/api/Reportes/DrArias/reportesGenerados', function(req, res) {
        c_Reportes.reportesGenerados(req, res);
    });
    
    app.post('/api/Reportes/DrArias/rotacionZonas', function(req, res) {
        c_Reportes.rotacionZonas(req, res);
    });
    
    app.post('/api/Reportes/DrArias/generarRotaciones', function(req, res) {
        c_Reportes.generarRotaciones(req, res);
    });

    app.post('/api/Reportes/DrArias/generarRotacionesMovil', function(req, res) {
        c_Reportes.generarRotacionesMovil(req, res);
    });
    
    app.post('/api/Reportes/DrArias/rotacionZonasMovil', function(req, res) {
        c_Reportes.rotacionZonasMovil(req, res);
    });

     app.post('/api/Reportes/DrArias/obtenerUsuarios', function(req, res) {
        c_Reportes.obtenerUsuarios(req, res);
    });

    app.post('/api/Reportes/DrArias/guardarUsuario', function(req, res) {
        c_Reportes.guardarUsuario(req, res);
    });

    app.post('/api/Reportes/DrArias/obtenerUsuariosAsociados', function(req, res) {
        c_Reportes.obtenerUsuariosAsociados(req, res);
    });

    app.post('/api/Reportes/DrArias/eliminarUsuarioAsociado', function(req, res) {
        c_Reportes.eliminarUsuarioAsociado(req, res);
    });
};