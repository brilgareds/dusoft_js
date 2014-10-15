module.exports = function(app, di_container) {

  
    var c_bodegas = di_container.get("c_bodegas");
    
    app.post('/api/Bodegas/listarBodegas', function(req, res) {
        c_bodegas.listar_bodegas(req, res);
    });
};