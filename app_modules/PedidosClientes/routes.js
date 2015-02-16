module.exports = function(app, di_container) {

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
    
    // Asignar o seleccionar responsables del pedido
    app.post('/api/PedidosClientes/eliminarResponsablesPedido', function(req, res) {
        c_pedidos_clientes.eliminarResponsablesPedido(req, res);
    });

    // Seleccionar los pedidos de un operario de bodega
    app.post('/api/PedidosClientes/listaPedidosOperarioBodega', function(req, res) {
        c_pedidos_clientes.listaPedidosOperariosBodega(req, res);
    });
    
    // Insertar Encabezado de Cotización
    app.post('/api/PedidosClientes/insertarCotizacion', function(req, res) {
        c_pedidos_clientes.insertarCotizacion(req, res);
    });
           
};