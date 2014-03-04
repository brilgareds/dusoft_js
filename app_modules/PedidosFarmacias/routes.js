module.exports = function(app, di_container, io) {

    var pedidos_farmacias_controller = require('./controllers/PedidosFarmaciasController');
    var pedidos_farmacias_model = require('./models/PedidosFarmaciasModel');
    var pedidos_farmacias_events = require('./events/PedidosFarmaciasEvents');
    var terceros_model = require('../Terceros/models/TercerosModel');

    di_container.register("socket", io);
    di_container.register("c_pedidos_farmacias", pedidos_farmacias_controller);
    di_container.register("m_pedidos_farmacias", pedidos_farmacias_model);
    di_container.register("e_pedidos_farmacias", pedidos_farmacias_events);
    di_container.register("m_terceros", terceros_model);

    var c_pedidos_farmacias = di_container.get("c_pedidos_farmacias");

    // ================= GET =======================
    
    // Listar Todos los pedidos de farmacia
    app.get('/api/PedidosFarmacias/listarPedidos', function(req, res) {
        c_pedidos_farmacias.listarPedidosFarmacias(req, res);
    });

    // Asignar o seleccionar responsables del pedido
    app.get('/api/PedidosFarmacias/asignarResponsable', function(req, res) {
        c_pedidos_farmacias.asignarResponsablesPedido(req, res);
    });
        
    // Seleccionar los pedidos de un operario de bodega
    app.get('/api/PedidosFarmacias/listaPedidosOperarioBodega', function(req, res) {
        c_pedidos_farmacias.listaPedidosOperariosBodega(req, res);
    });
    
    

    // ================= POST =======================
    
    // Asignar o seleccionar responsables del pedido
    app.post('/api/PedidosFarmacias/asignarResponsable', function(req, res) {
        c_pedidos_farmacias.asignarResponsablesPedido(req, res);
    });
};