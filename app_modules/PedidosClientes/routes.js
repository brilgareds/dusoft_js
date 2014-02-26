module.exports = function(app, di_container) {


    //var intravenous = require('intravenous');


    var pedidos_cliente_controller = require('./controllers/PedidosClienteController');
    var pedidos_clientes_model = require('./models/PedidosClienteModel');
    
    // Requiriendo otro modelo
    var kardex_model = require('../Kardex/models/KardexModel');   
    var facturacion_clientes_model = require('../FacturacionClientes/models/FacturacionClientesModel');   
    
    
    //var container = intravenous.create();

    di_container.register("c_pedidos_clientes", pedidos_cliente_controller);
    di_container.register("m_pedidos_clientes", pedidos_clientes_model);
    
    //Regitrando Otro modelo
    di_container.register("m_kardex", kardex_model);
    di_container.register("m_facturacion_clientes", facturacion_clientes_model);


    var c_pedidos_clientes = di_container.get("c_pedidos_clientes");
    
    app.get('/api/PedidosClientes/index', function(req, res) {
         c_pedidos_clientes.index(req, res);
    });

};