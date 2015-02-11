module.exports = function(app, di_container) {
    
    var c_vendedores = di_container.get("c_vendedores");
    
    app.post('/api/Terceros/Vendedores/listarVendedores', function(req, res) {
        
         c_vendedores.listarVendedores(req, res);
         
    });
    
};