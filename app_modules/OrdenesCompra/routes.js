module.exports = function(app, di_container) {


    var c_ordenes_compra = di_container.get('c_ordenes_compra');

    // Listar Ordenes de Compras
    app.post('/api/OrdenesCompra/listarOrdenesCompra', function(req, res) {
        c_ordenes_compra.listarOrdenesCompra(req, res);
    });
    
    // Listar Ordenes de Compras
    app.post('/api/OrdenesCompra/listarProductos', function(req, res) {
        c_ordenes_compra.listarProductos(req, res);
    });
    
    // Insertar Ordenes de Compras
    app.post('/api/OrdenesCompra/insertarOrdenCompra', function(req, res) {
        c_ordenes_compra.insertarOrdenCompra(req, res);
    });
    
    // Modificar la unidad de negocio de una orden de compra 
    app.post('/api/OrdenesCompra/modificarUnidadNegocio', function(req, res) {
        c_ordenes_compra.modificarUnidadNegocio(req, res);
    });
    
    // Modificar Observacion de una orden de compra 
    app.post('/api/OrdenesCompra/modificarObservacion', function(req, res) {
        c_ordenes_compra.modificarObservacion(req, res);
    });
    
    // Insertar Detalle Ordene de Compras
    app.post('/api/OrdenesCompra/insertarDetalleOrdenCompra', function(req, res) {
        c_ordenes_compra.insertarDetalleOrdenCompra(req, res);
    });
    
    // Eliminar Orden de Compras
    app.post('/api/OrdenesCompra/anularOrdenCompra', function(req, res) {
        c_ordenes_compra.anularOrdenCompra(req, res);
    });
    
    // Eliminar Producto de una Orden de Compra
    app.post('/api/OrdenesCompra/eliminarProductoOrdenCompra', function(req, res) {
        c_ordenes_compra.eliminarProductoOrdenCompra(req, res);
    });
        
    // Consultar Orden de Compra por numero de orden
    app.post('/api/OrdenesCompra/consultarOrdenCompra', function(req, res) {
        c_ordenes_compra.consultarOrdenCompra(req, res);
    });
    
    // Consultar Detalle Orden de Compra por numero de orden
    app.post('/api/OrdenesCompra/consultarDetalleOrdenCompra', function(req, res) {
        c_ordenes_compra.consultarDetalleOrdenCompra(req, res);
    });
    
    // Generar Orden de Compra
    app.post('/api/OrdenesCompra/finalizarOrdenCompra', function(req, res) {
        c_ordenes_compra.finalizarOrdenCompra(req, res);
    });
    
    // Subir Plano Orden de Compra
    //app.post('/api/OrdenesCompra/subirPlano', function(req, res) {
    app.post('/subirPlano', function(req, res) {
        c_ordenes_compra.subirPlano(req, res);
    });

};