module.exports = function(app, di_container) {
 
  var c_facturacion_proveedores = di_container.get("c_facturacion_proveedores");
  //var io = di_container.get("socket");

    
    
    app.post('/api/FacturacionProveedores/listarOrdenesCompraProveedor', function(req, res) {
       
        c_facturacion_proveedores.listarOrdenesCompraProveedor(req, res);
    });
    
    app.post('/api/FacturacionProveedores/detalleRecepcionParcial', function(req, res) {
       
        c_facturacion_proveedores.detalleRecepcionParcial(req, res);
    });
    
    app.post('/api/FacturacionProveedores/ingresarFactura', function(req, res) {
       
        c_facturacion_proveedores.ingresarFactura(req, res);
    });
    
    app.post('/api/FacturacionProveedores/listarFacturaProveedor', function(req, res) {
       
        c_facturacion_proveedores.listarFacturaProveedor(req, res);
    });
    
    app.post('/api/FacturacionProveedores/reporteFacturaProveedor', function(req, res) {
       
        c_facturacion_proveedores.reporteFacturaProveedor(req, res);
    });
    
    
    
};