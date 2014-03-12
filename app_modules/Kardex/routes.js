module.exports = function(app, di_container) {

    var kardex_controller = require('./controllers/KardexController');
    var kardex_model = require('./models/KardexModel');
    var pedidos_farmacias_model = require('../PedidosFarmacias/models/PedidosFarmaciasModel');
    var pedidos_clientes_model = require('../PedidosClientes/models/PedidosClienteModel');

    di_container.register("c_kardex", kardex_controller);
    di_container.register("m_kardex", kardex_model);
    di_container.register("m_pedidos_farmacias", pedidos_farmacias_model);
    di_container.register("m_pedidos_clientes", pedidos_clientes_model);


    var c_kardex = di_container.get("c_kardex");

    app.post('/api/Kardex/listarProductos', function(req, res) {
        c_kardex.listar_productos(req, res);
    });

    app.post('/api/Kardex/obtenerMovimientosProducto', function(req, res) {
        c_kardex.obtener_movimientos_producto(req, res);
    });

};