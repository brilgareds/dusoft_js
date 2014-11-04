module.exports = function(app, di_container) {


    var c_ordenes_compra = di_container.get('c_ordenes_compra');

    // Listar Ordenes de Compras
    app.post('/api/OrdenesCompra/listarOrdenesCompra', function(req, res) {
        c_ordenes_compra.listarOrdenesCompra(req, res);
    });
    
    // Insertar Ordenes de Compras
    app.post('/api/OrdenesCompra/insertarOrdenCompra', function(req, res) {
        c_ordenes_compra.insertarOrdenCompra(req, res);
    });
    
    // Insertar Detalle Ordene de Compras
    app.post('/api/OrdenesCompra/insertarDetalleOrdenCompra', function(req, res) {
        c_ordenes_compra.insertarDetalleOrdenCompra(req, res);
    });
    
    // Eliminar Orden de Compras
    app.post('/api/OrdenesCompra/eliminarOrdenCompra', function(req, res) {
        c_ordenes_compra.eliminarOrdenCompra(req, res);
    });
    
    // Eliminar Producto de una Orden de Compra
    app.post('/api/OrdenesCompra/eliminarProductoOrdenCompra', function(req, res) {
        c_ordenes_compra.eliminarProductoOrdenCompra(req, res);
    });
        
    // Consultar Orden de Compra por numero de orden
    app.post('/api/OrdenesCompra/consultarOrdenesCompra', function(req, res) {
        c_ordenes_compra.consultarOrdenesCompra(req, res);
    });

};