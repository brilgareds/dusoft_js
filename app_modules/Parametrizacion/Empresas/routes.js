module.exports = function(app, di_container) {


    var c_empresas = di_container.get("c_empresas");

    app.post('/api/Empresas/listarEmpresas', function(req, res) {
        c_empresas.listar_empresas(req, res);
    });

    app.post('/api/Empresas/listarEmpresasModulos', function(req, res) {
        c_empresas.listar_empresas_modulos(req, res);
    });
    
    app.post('/api/Empresas/listarEmpresasFarmacias', function(req, res) {
        c_empresas.listarEmpresasFarmacias(req, res);
    });
    
};