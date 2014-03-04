module.exports = function(app, di_container, io) {

    var pedidos_cliente_controller = require('./controllers/PedidosClienteController');
    var pedidos_clientes_model = require('./models/PedidosClienteModel');
    var pedidos_clientes_events = require('./events/PedidosClientesEvents');
    var terceros_model = require('../Terceros/models/TercerosModel');

    di_container.register("socket", io);
    di_container.register("c_pedidos_clientes", pedidos_cliente_controller);
    di_container.register("m_pedidos_clientes", pedidos_clientes_model);
    di_container.register("e_pedidos_clientes", pedidos_clientes_events);
    di_container.register("m_terceros", terceros_model);

    var c_pedidos_clientes = di_container.get("c_pedidos_clientes");
    var e_pedidos_clientes = di_container.get("e_pedidos_clientes");


    // ================= GET =======================
    
    // Listar todos los pedidos de los Clientes
    app.get('/api/PedidosClientes/listarPedidos', function(req, res) {
        c_pedidos_clientes.listarPedidosClientes(req, res);
    });

    // Asignar o seleccionar responsables del pedido
    app.get('/api/PedidosClientes/asignarResponsable', function(req, res) {
        c_pedidos_clientes.asignarResponsablesPedido(req, res);
    });

    // Seleccionar los pedidos de un operario de bodega
    app.get('/api/PedidosClientes/listaPedidosOperarioBodega', function(req, res) {
        c_pedidos_clientes.listaPedidosOperariosBodega(req, res);
    });


    // ================= POST =======================
    app.post('/api/PedidosClientes/asignarResponsable', function(req, res) {
        c_pedidos_clientes.asignarResponsablesPedido(req, res);
    });



    // ================= REAL TIME EVENTS =======================
    io.sockets.on('connection', function(socket) {
        console.log('=========== Conectado =============');
        console.log(socket.id);

        /*socket.on('notificar_asignacion', function(datos) {
         e_pedidos_clientes.notificar_asignacion_pedido(datos);
         });*/
    });

};