module.exports = function(app, di_container) {

  
    var c_laboratorios = di_container.get("c_laboratorios");
    
    app.post('/api/Laboratorios/listarLaboratorios', function(req, res) {
        c_laboratorios.listarLaboratorios(req, res);
    });
};