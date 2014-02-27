module.exports = function(app, di_container) {

    var pedidos_cliente_controller = require('./controllers/PedidosClienteController');
    var pedidos_clientes_model = require('./models/PedidosClienteModel');

    di_container.register("c_pedidos_clientes", pedidos_cliente_controller);
    di_container.register("m_pedidos_clientes", pedidos_clientes_model);    

    var c_pedidos_clientes = di_container.get("c_pedidos_clientes");
    
    app.get('/api/PedidosClientes/listarPedidos', function(req, res) {
         c_pedidos_clientes.listarPedidosClientes(req, res);
    });

};