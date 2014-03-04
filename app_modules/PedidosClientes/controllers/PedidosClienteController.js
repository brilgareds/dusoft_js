
var PedidosCliente = function(pedidos_clientes, eventos_pedidos_clientes) {

    console.log("Modulo Pedidos Cliente  Cargado ");

    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_clientes = eventos_pedidos_clientes;

};

PedidosCliente.prototype.listarPedidosClientes = function(req, res) {

    var that = this;
    var empresa_id = req.query.empresa_id;
    var termino_busqueda = req.query.termino_busqueda;

    this.m_pedidos_clientes.listar_pedidos_clientes(empresa_id, termino_busqueda, function(err, lista_pedidos_clientes) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {tipo_cliente: 'cliente', pedidos_clientes: lista_pedidos_clientes}));
    });
};

PedidosCliente.prototype.asignarResponsablesPedido = function(req, res) {

    var that = this;

    //this.e_pedidos_clientes.onNotificarPedidosActualizados({ numero_pedido : 33895 });
    //return;

    var pedidos = req.body.pedidos;
    var estado_pedido = req.body.estado_pedido;
    var responsable = req.body.responsable;
    var usuario = req.body.usuario;

    var i = pedidos.length;

    pedidos.forEach(function(numero_pedido) {

        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(err, rows) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }
            
            // Notificando Pedidos Actualizados en Real Time
            that.e_pedidos_clientes.onNotificarPedidosActualizados({ numero_pedido : numero_pedido });
            
            if (--i === 0) {
                res.send(G.utils.r(req.url, 'Asignacion de Resposables', 200, {}));
                // Notificacion al operario de los pedidos que le fueron asigandos
                that.e_pedidos_clientes.onNotificacionOperarioPedidosAsignados();
            }
        });
    });
};

PedidosCliente.$inject = ["m_pedidos_clientes", "e_pedidos_clientes"];

module.exports = PedidosCliente;