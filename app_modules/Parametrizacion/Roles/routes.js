module.exports = function(app, di_container) {


    var c_roles = di_container.get("c_roles");

    app.post('/api/Roles/guardarRol', function(req, res) {
        c_roles.guardarRol(req, res);
    });

    app.post('/api/Roles/listarRoles', function(req, res) {
        c_roles.listar_roles(req, res);
    });

    app.post('/api/Roles/obtenerRolesPorId', function(req, res) {
        c_roles.obtenerRolesPorId(req, res);
    });

    app.post('/api/Roles/habilitarModulosEnRoles', function(req, res) {
        c_roles.habilitarModulosEnRoles(req, res);
    });


    app.post('/api/Roles/obtenerModulosPorRol', function(req, res) {
        c_roles.obtenerModulosPorRol(req, res);
    });

    app.post('/api/Modulos/guardarOpcion', function(req, res) {
        c_roles.guardarOpcion(req, res);
    });

    app.post('/api/Modulos/eliminarOpcion', function(req, res) {
        c_roles.eliminarOpcion(req, res);
    });



    app.post('/api/Modulos/listarModulosPorEmpresa', function(req, res) {
        c_roles.listarModulosPorEmpresa(req, res);
    });

};