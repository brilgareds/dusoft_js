module.exports = function(app, di_container) {

  
    var c_empresas = di_container.get("c_empresas");
    
    app.post('/api/Kardex/listarProductos', function(req, res) {
        c_empresas.listar_empresas(req, res);
    });
};