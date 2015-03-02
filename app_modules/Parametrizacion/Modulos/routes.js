module.exports = function(app, di_container) {

  
    var c_modulos = di_container.get("c_modulos");
    
    app.post('/api/Modulos/listarModulos', function(req, res) {
        c_modulos.listar_modulos(req, res);
    });
    
    app.post('/api/Modulos/guardarModulo', function(req, res) {
        c_modulos.guardarModulo(req, res);
    });
    
    
    app.post('/api/Modulos/obtenerModulosPorId', function(req, res) {
        c_modulos.obtenerModulosPorId(req, res);
    });
    
    
    app.post('/api/Modulos/listarOpcionesPorModulo', function(req, res) {
        c_modulos.listarOpcionesPorModulo(req, res);
    });
    
    app.post('/api/Modulos/guardarOpcion', function(req, res) {
        c_modulos.guardarOpcion(req, res);
    });
    
    app.post('/api/Modulos/eliminarOpcion', function(req, res) {
        c_modulos.eliminarOpcion(req, res);
    });
    
    app.post('/api/Modulos/eliminarOpcion', function(req, res) {
        c_modulos.eliminarOpcion(req, res);
    });
    
    app.post('/api/Modulos/habilitarModuloEnEmpresas', function(req, res){
        c_modulos.habilitarModuloEnEmpresas(req, res);
    });
    
};