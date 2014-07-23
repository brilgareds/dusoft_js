module.exports = function(app, di_container, io) {

    /*var pedidos_cliente_controller = require('./controllers/PedidosClienteController');
    var pedidos_clientes_model = require('./models/PedidosClienteModel');
    var pedidos_clientes_events = require('./events/PedidosClientesEvents');
    
    var terceros_model = require('../Terceros/models/TercerosModel');
    var productos_model = require('../Productos/models/ProductosModel');

    di_container.register("socket", io);
    di_container.register("c_pedidos_clientes", pedidos_cliente_controller);
    di_container.register("m_pedidos_clientes", pedidos_clientes_model);
    di_container.register("e_pedidos_clientes", pedidos_clientes_events);
    
    di_container.register("m_terceros", terceros_model);
    di_container.register("m_productos", productos_model);*/

    var c_pedidos_clientes = di_container.get("c_pedidos_clientes");
    var e_pedidos_clientes = di_container.get("e_pedidos_clientes");



    // ================= POST =======================

    // Listar todos los pedidos de los Clientes
    app.post('/api/PedidosClientes/listarPedidos', function(req, res) {
        c_pedidos_clientes.listarPedidosClientes(req, res);
    });
    
    // Obtiene la informacion especifica del pedido seleccionado, busca por numero de pedido.
    app.post('/api/PedidosClientes/obtenerPedido', function(req, res) {
        c_pedidos_clientes.obtenerPedido(req, res);
    });
    
    // Asignar o seleccionar responsables del pedido
    app.post('/api/PedidosClientes/asignarResponsable', function(req, res) {
        c_pedidos_clientes.asignarResponsablesPedido(req, res);
    });

    // Seleccionar los pedidos de un operario de bodega
    app.post('/api/PedidosClientes/listaPedidosOperarioBodega', function(req, res) {
        c_pedidos_clientes.listaPedidosOperariosBodega(req, res);
    });
    
    // Consultar la disponibilidad productos
    app.post('/api/Pedidos/consultarDisponibilidad', function(req, res) {
        c_pedidos_clientes.consultarDisponibilidadProducto(req, res);
    });
};