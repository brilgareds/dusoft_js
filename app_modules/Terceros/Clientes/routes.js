module.exports = function(app, di_container) {
    
    var c_clientes = di_container.get("c_clientes");
    
    app.post('/api/Terceros/Clientes/listarClientes', function(req, res) {
        console.log(">>>>> Llegando a consulta de Clientes");
         c_clientes.listarClientes(req, res);
    });
    
};