module.exports = function(app, di_container) {
 
  var c_facturacion_clientes = di_container.get("c_facturacion_clientes");
  //var io = di_container.get("socket");

    // Listar los tipos terceros
    app.post('/api/FacturacionClientes/listarTiposTerceros', function(req, res) {
       
        c_facturacion_clientes.listarTiposTerceros(req, res);
    });
    
    app.post('/api/FacturacionClientes/listarPrefijosFacturas', function(req, res) {
       
        c_facturacion_clientes.listarPrefijosFacturas(req, res);
    });
    
    // Listar los clientes
    app.post('/api/FacturacionClientes/listarClientes', function(req, res) {       
        c_facturacion_clientes.listarClientes(req, res);
    });
    
    //listar las facturas generadas
    app.post('/api/FacturacionClientes/listarFacturasGeneradas', function(req, res) {       
        c_facturacion_clientes.listarFacturasGeneradas(req, res);
    });
  
    //listar los pedidos de los clientes
    app.post('/api/FacturacionClientes/listarPedidosClientes', function(req, res) {       
        c_facturacion_clientes.listarPedidosClientes(req, res);
    });
    
    //Generar la facturacion agrupada
    app.post('/api/FacturacionClientes/generarFacturasAgrupadas', function(req, res) {       
        c_facturacion_clientes.generarFacturasAgrupadas(req, res);
    });
    
    
    app.post('/api/FacturacionClientes/generarFacturaIndividual', function(req, res) {       
        c_facturacion_clientes.generarFacturaIndividual(req, res);
    });
};