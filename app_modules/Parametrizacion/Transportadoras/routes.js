module.exports = function(app, di_container) {

  
    var c_transportadoras = di_container.get("c_transportadoras");
    
    app.post('/api/Transportadoras/listar', function(req, res) {
        c_transportadoras.listarTransportadoras(req, res);
    });
    
    app.post('/api/Transportadoras/consultarTransportadora', function(req, res) {
        c_transportadoras.consultarTransportadora(req, res);
    });
    
    app.post('/api/Transportadoras/ingresarTransportadora', function(req, res) {
        c_transportadoras.ingresarTransportadora(req, res);
    });
    
    app.post('/api/Transportadoras/modificarTransportadora', function(req, res) {
        c_transportadoras.modificarTransportadora(req, res);
    });
    
    app.post('/api/Transportadoras/inactivarTransportadora', function(req, res) {
        c_transportadoras.inactivarTransportadora(req, res);
    });
    
};