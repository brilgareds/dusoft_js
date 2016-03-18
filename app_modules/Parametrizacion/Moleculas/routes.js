module.exports = function(app, di_container) {

  
    var c_moleculas = di_container.get("c_moleculas");
    
    app.post('/api/Laboratorios/listarMoleculas', function(req, res) {
        c_moleculas.listarMoleculas(req, res);
    });
};