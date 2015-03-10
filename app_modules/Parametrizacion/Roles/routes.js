module.exports = function(app, di_container) {

  
    var c_roles = di_container.get("c_roles");
    
    app.post('/api/Roles/guardarRol', function(req, res) {
        c_roles.guardarRol(req, res);
    });
    
    
    app.post('/api/Modulos/listarModulos', function(req, res) {
        c_roles.listar_modulos(req, res);
    });
    
    
    
    app.post('/api/Modulos/obtenerModulosPorId', function(req, res) {
        c_roles.obtenerModulosPorId(req, res);
    });
    
    
    app.post('/api/Modulos/listarOpcionesPorModulo', function(req, res) {
        c_roles.listarOpcionesPorModulo(req, res);
    });
    
    app.post('/api/Modulos/guardarOpcion', function(req, res) {
        c_roles.guardarOpcion(req, res);
    });
    
    app.post('/api/Modulos/eliminarOpcion', function(req, res) {
        c_roles.eliminarOpcion(req, res);
    });
    
    app.post('/api/Modulos/habilitarModuloEnEmpresas', function(req, res){
        c_roles.habilitarModuloEnEmpresas(req, res);
    });
    
    app.post('/api/Modulos/listarModulosPorEmpresa', function(req, res){
        c_roles.listarModulosPorEmpresa(req, res);
    });
    
};