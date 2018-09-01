module.exports = function(app, di_container) {


    var c_facturacion_electronica = di_container.get('c_facturacion_electronica');
    
    app.post('/api/FacturacionElectronica/pedidoClienteAPedidoFarmacia', function(req, res) {
        c_facturacion_electronica.pedidoClienteAPedidoFarmacia(req, res);
    });
    
};