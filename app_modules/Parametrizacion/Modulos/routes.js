module.exports = function(app, di_container) {


    var c_modulos = di_container.get("c_modulos");

    app.post('/api/Modulos/listarModulos', function(req, res) {
        c_modulos.listar_modulos(req, res);
    });

    app.post('/api/Modulos/obtenerCantidadModulos', function(req, res) {
        c_modulos.obtenerCantidadModulos(req, res);
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

    app.post('/api/Modulos/habilitarModuloEnEmpresas', function(req, res) {
        c_modulos.habilitarModuloEnEmpresas(req, res);
    });

    app.post('/api/Modulos/listarModulosPorEmpresa', function(req, res) {
        c_modulos.listarModulosPorEmpresa(req, res);
    });

    app.post('/api/Modulos/listarRolesPorModulo', function(req, res) {
        c_modulos.listarRolesPorModulo(req, res);
    });

    app.post('/api/Modulos/guardarVariable', function(req, res) {
        c_modulos.guardarVariable(req, res);
    });

    app.post('/api/Modulos/listarVariablesPorModulo', function(req, res) {
        c_modulos.listarVariablesPorModulo(req, res);
    });

    app.post('/api/Modulos/eliminarVariable', function(req, res) {
        c_modulos.eliminarVariable(req, res);
    });

};