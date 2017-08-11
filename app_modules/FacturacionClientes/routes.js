module.exports = function(app, di_container) {
 
    var c_facturacion_clientes = di_container.get("c_facturacion_clientes");
    var j_facturacion_clientes = di_container.get("j_facturacion_clientes");
  
  
    //j_facturacion_clientes.ejecutarJobProcesarDespachos();
  
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
    
    app.post('/api/FacturacionClientes/consultaFacturaGeneradaDetalle', function(req, res) {     
        c_facturacion_clientes.consultaFacturaGeneradaDetalle(req, res);
    });
     
    app.post('/api/FacturacionClientes/generarReporteFacturaGenerada', function(req, res) {     
        c_facturacion_clientes.generarReporteFacturaGenerada(req, res);
    });
    
    app.post('/api/FacturacionClientes/generarReportePedido', function(req, res) {     
        c_facturacion_clientes.generarReportePedido(req, res);
    });
    
    app.post('/api/FacturacionClientes/generarReporteDespacho', function(req, res) {     
        c_facturacion_clientes.generarReporteDespacho(req, res);
    });
    
    app.post('/api/FacturacionClientes/sincronizarFactura', function(req, res) {     
        c_facturacion_clientes.sincronizarFactura(req, res);
    });
    
    app.post('/api/FacturacionClientes/procesarDespachos', function(req, res) {     
        c_facturacion_clientes.procesarDespachos(req, res);
    });
  
    app.post('/api/FacturacionClientes/procesosFacturacion', function(req, res) {     
        c_facturacion_clientes.procesosFacturacion(req, res);
    });
    
    app.post('/api/FacturacionClientes/listarDocumentosPorFacturar', function(req, res) {     
        c_facturacion_clientes.listarDocumentosPorFacturar(req, res);
    });
    
    app.post('/api/FacturacionClientes/obtenerDetallePorFacturar', function(req, res) {       
        c_facturacion_clientes.obtenerDetallePorFacturar(req, res);
    });
    
    app.post('/api/FacturacionClientes/generarTemporalFacturaConsumo', function(req, res) {       
        c_facturacion_clientes.generarTemporalFacturaConsumo(req, res);
    });
    
    
    app.post('/api/FacturacionClientes/eliminarProductoTemporalFacturaConsumo', function(req, res) {       
        c_facturacion_clientes.eliminarProductoTemporalFacturaConsumo(req, res);
    });
    
    app.post('/api/FacturacionClientes/consultarDetalleTemporalFacturaConsumo', function(req, res) {       
        c_facturacion_clientes.consultarDetalleTemporalFacturaConsumo(req, res);
    });
    
};