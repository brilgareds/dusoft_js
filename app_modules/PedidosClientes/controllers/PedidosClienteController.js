
var PedidosCliente = function(pedidos_clientes) {

    console.log("Modulo Pedidos Cliente  Cargado ");

    this.m_pedidos_clientes = pedidos_clientes;

};

PedidosCliente.prototype.listarPedidosClientes = function(req, res) {

    var that = this;
    var empresa_id = req.query.empresa_id;
    var termino_busqueda = req.query.termino_busqueda;

    this.m_pedidos_clientes.listar_pedidos_clientes(empresa_id, termino_busqueda, function(err, lista_pedidos_clientes) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, { tipo_cliente: 'cliente', pedidos_clientes: lista_pedidos_clientes}));
    });
};

PedidosCliente.prototype.asignarResponsablesPedido = function(req, res) {

    var that = this;


    var pedidos = [33902, 320, 29402];
    var estado_pedido = 4;
    var responsable = 16;
    var usuario = 1350;
    var i = pedidos.length;

    pedidos.forEach(function(numero_pedido) {

        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(err, rows) {
            
            if( err ){
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }
            
            if (--i === 0)
                res.send(G.utils.r(req.url, 'Asignacion de Resposables', 200, {}));
        });
    });
};

PedidosCliente.$inject = ["m_pedidos_clientes"];

module.exports = PedidosCliente;