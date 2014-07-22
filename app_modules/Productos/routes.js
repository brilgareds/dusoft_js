module.exports = function(app, di_container, io) {

    var productos_controller = require('./controllers/ProductosController');
    var productos_model = require('./models/ProductosModel');
   
    di_container.register("c_productos", productos_controller);
    di_container.register("m_productos", productos_model);
    

    var c_productos = di_container.get("c_productos");

    // Listar productos
    app.post('/api/Productos/listarProductos', function(req, res) {
        c_productos.listar_productos(req, res);
    });

    // Consulta la existencias de un producto
    app.post('/api/Productos/consultarExistencias', function(req, res) {
        c_productos.consultarExistenciasProducto(req, res);
    });
    
};