module.exports = function(app, di_container) {

    var c_paises = di_container.get("c_paises");
    
    app.post('/api/Paises/listarPaises', function(req, res) {
        c_paises.listarPaises(req, res);
    });
    
    app.post('/api/Paises/seleccionarPais', function(req, res) {
        c_paises.seleccionarPais(req, res);
    });
};