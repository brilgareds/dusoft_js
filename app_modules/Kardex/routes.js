module.exports = function(app, di_container) {

    var kardex_controller = require('./controllers/KardexController');
    var kardex_model = require('./models/KardexModel');
   
    di_container.register("c_kardex", kardex_controller);
    di_container.register("m_kardex", kardex_model);
    
    
    var c_kardex = di_container.get("c_kardex");
    
    app.get('/api/Kardex/index', function(req, res) {
         c_kardex.index(req, res);
    });
    
    
    app.get('/api/Kardex/listarProductos', function(req, res) {
         c_kardex.listar_productos(req, res);
    });
    
    app.get('/api/Kardex/obtenerMovimientosProducto', function(req, res) {
         c_kardex.obtener_movimientos_producto(req, res);
    });

};