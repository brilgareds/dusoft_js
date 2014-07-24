module.exports = function(app, di_container) {

    
    var c_pedidos = di_container.get('c_pedidos');
    
    // Consultar la disponibilidad productos
    app.post('/api/Pedidos/consultarDisponibilidad', function(req, res) {
        c_pedidos.consultarDisponibilidadProducto(req, res);
    });
};