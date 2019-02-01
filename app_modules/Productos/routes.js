module.exports = function(app, di_container) {

    /*var productos_controller = require('./controllers/ProductosController');
    var productos_model = require('./models/ProductosModel');
   
    di_container.register("c_productos", productos_controller);
    di_container.register("m_productos", productos_model);*/
    

    var c_productos = di_container.get("c_productos");

    // Listar productos
    app.post('/api/Productos/listarProductos', function(req, res) {
        c_productos.listar_productos(req, res);
    });

    // Sube el costo de un producto
    app.post('/api/Productos/subeCosto', function(req, res) {
        c_productos.subeCosto(req, res);
    });
    // Baje el costo de un producto
    app.post('/api/Productos/bajeCosto', function(req, res) {
        c_productos.bajeCosto(req, res);
    });

    // Consulta la existencias de un producto
    app.post('/api/Productos/consultarExistencias', function(req, res) {
        c_productos.consultarExistenciasProducto(req, res);
    });
    
    //Listar Tipo Productos
    app.post('/api/Productos/listarTipoProductos', function(req, res) {
        c_productos.listarTipoProductos(req, res);
    });
    
    //Listar Productos Clientes
    app.post('/api/Productos/listarProductosClientes', function(req, res) {
        c_productos.listarProductosClientes(req, res);
    });
    
    app.post('/api/Productos/guardarExistenciaBodega', function(req, res) {
        c_productos.guardarExistenciaBodega(req, res);
    });
    
    app.post('/api/Productos/actualizarExistenciasProducto', function(req, res) {
        c_productos.actualizarExistenciasProducto(req, res);
    });
    
    app.post('/api/Productos/listarHomologacionProductos', function(req, res) {
        c_productos.listarHomologacionProductos(req, res);
    });
    
   
};