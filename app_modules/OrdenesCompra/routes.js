module.exports = function(app, di_container) {


    var c_ordenes_compra = di_container.get('c_ordenes_compra');

    // Listar Ordenes de Compras
    app.post('/api/OrdenesCompra/listarOrdenesCompra', function(req, res) {
        c_ordenes_compra.listarOrdenesCompra(req, res);
    });
    
    
    // Consultar Orden de Compra por numero de orden
    app.post('/api/OrdenesCompra/consultarOrdenesCompra', function(req, res) {
        c_ordenes_compra.consultarOrdenesCompra(req, res);
    });

};