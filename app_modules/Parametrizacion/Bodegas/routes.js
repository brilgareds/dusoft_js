module.exports = function(app, di_container) {

  
    var c_bodegas = di_container.get("c_bodegas");
    
    app.post('/api/Bodegas/listarBodegasEmpresas', function(req, res) {
        c_bodegas.listar_bodegas_empresa(req, res);
    });
    
    app.post('/api/Bodegas/listarBodegasPorTermino', function(req, res) {
        c_bodegas.listarBodegasPorTermino(req, res);
    });
    
    app.post('/api/Bodegas/listar_bodegas_duana_farmacias', function(req, res) {
        c_bodegas.listar_bodegas_duana_farmacias(req, res);
    });
    
};