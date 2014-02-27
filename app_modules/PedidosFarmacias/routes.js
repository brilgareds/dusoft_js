module.exports = function(app, di_container) {

    var pedidos_farmacias_controller = require('./controllers/PedidosFarmaciasController');
    var pedidos_farmacias_model = require('./models/PedidosFarmaciasModel');

    di_container.register("c_pedidos_farmacias", pedidos_farmacias_controller);
    di_container.register("m_pedidos_farmacias", pedidos_farmacias_model);    

    var c_pedidos_farmacias = di_container.get("c_pedidos_farmacias");
    
    app.get('/api/PedidosFarmacias/listarPedidos', function(req, res) {
         c_pedidos_farmacias.listarPedidosFarmacias(req, res);
    });

};