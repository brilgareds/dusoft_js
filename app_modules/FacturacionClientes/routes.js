module.exports = function(app, di_container) {
 
  var c_facturacion_clientes = di_container.get("c_facturacion_clientes");
  //var io = di_container.get("socket");

    // Listar las formulas medicas
    app.post('/api/FacturacionClientes/listarTiposTerceros', function(req, res) {
       
        c_facturacion_clientes.listarTiposTerceros(req, res);
    });
    
    
};