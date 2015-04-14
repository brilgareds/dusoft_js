module.exports = function(app, di_container) {

  
    var c_transportadoras = di_container.get("c_transportadoras");
    
    app.post('/api/Transportadoras/listar', function(req, res) {
        c_transportadoras.listarTransportadoras(req, res);
    });
};