module.exports = function(app, di_container) {

    //var intravenous = require('intravenous');
    
    
    var facturacion_clientes_controller = require('./controllers/FacturacionClientesController');
    var facturacion_clientes_model = require('./models/FacturacionClientesModel');
    
    //var container = intravenous.create();
    
    di_container.register("c_facturacion_clientes", facturacion_clientes_controller);
    di_container.register("m_facturacion_clientes", facturacion_clientes_model);
    
    
    var c_facturacion_clientes = di_container.get("c_facturacion_clientes");
    
    app.get('/api/FacturacionClientes/index', function(req, res) {
        c_facturacion_clientes.index(req, res);
    });

};