module.exports = function(app, di_container) {

    var c_departamentos = di_container.get("c_departamentos");
    
    app.post('/api/Departamentos/listarDepartamentos', function(req, res) {
        c_departamentos.listarDepartamentos(req, res);
    });
    
    app.post('/api/Departamentos/listarDepartamentosPais', function(req, res) {
        c_departamentos.listarDepartamentosPais(req, res);
    });
    
    app.post('/api/Departamentos/seleccionarDepartamento', function(req, res) {
        c_departamentos.seleccionarDepartamento(req, res);
    });
};
