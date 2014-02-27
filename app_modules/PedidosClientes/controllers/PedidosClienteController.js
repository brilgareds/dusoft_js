
var PedidosCliente = function(pedidos_clientes) {

    console.log("Modulo Pedidos Cliente  Cargado ");

    this.m_pedidos_clientes = pedidos_clientes;    

};

PedidosCliente.prototype.listarPedidosClientes = function(req, res) {
    
    var that = this;
    var empresa_id = req.query.empresa_id;
    var termino_busqueda = req.query.termino_busqueda;
        
    this.m_pedidos_clientes.listar_pedidos_clientes(empresa_id, termino_busqueda, function(err, lista_pedidos_clientes) {
         res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, { pedidos_clientes: lista_pedidos_clientes }));
    });
};

PedidosCliente.$inject = ["m_pedidos_clientes"];

module.exports = PedidosCliente;