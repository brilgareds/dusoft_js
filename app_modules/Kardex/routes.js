module.exports = function(app, di_container) {

  
    var c_kardex = di_container.get("c_kardex");
    
    app.post('/api/Kardex/listarProductos', function(req, res) {
        c_kardex.listar_productos(req, res);
    });
    

    app.post('/api/Kardex/obtenerMovimientosProducto', function(req, res) {
        c_kardex.obtener_movimientos_producto(req, res);
    });
};