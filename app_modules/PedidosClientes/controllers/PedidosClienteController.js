
var PedidosCliente = function(pedidos_clientes, eventos_pedidos_clientes) {

    console.log("Modulo Pedidos Cliente  Cargado ");

    this.m_pedidos_clientes = pedidos_clientes;
    this.e_pedidos_clientes = eventos_pedidos_clientes;

};

PedidosCliente.prototype.listarPedidosClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_clientes === undefined || args.pedidos_clientes.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }


    
    var empresa_id = '03';
    var termino_busqueda = args.pedidos_clientes.termino_busqueda;

    this.m_pedidos_clientes.listar_pedidos_clientes(empresa_id, termino_busqueda, function(err, lista_pedidos_clientes) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, { pedidos_clientes: lista_pedidos_clientes}));
    });
};

PedidosCliente.prototype.asignarResponsablesPedido = function(req, res) {

    var that = this;
    
    var args = req.body.data;
    
    if (args.asignacion_pedidos === undefined || args.asignacion_pedidos.pedidos === undefined || args.asignacion_pedidos.estado_pedido === undefined || args.asignacion_pedidos.responsable === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    var params = args.asignacion_pedidos;
    
    if (params.pedidos.length === 0 || params.estado_pedido === "" || params.responsable === "" ){
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }
    
    

    //var empresa_id = req.body.empresa_id;
    var pedidos = params.pedidos;
    var estado_pedido = params.estado_pedido;
    var responsable = params.responsable;
    var usuario = req.session.user.usuario_id;

    var i = pedidos.length;

    pedidos.forEach(function(numero_pedido) {

        that.m_pedidos_clientes.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(err, rows) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }

            // Notificando Pedidos Actualizados en Real Time
            that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
            // Notificacion al operario de los pedidos que le fueron asigandos
            that.e_pedidos_clientes.onNotificacionOperarioPedidosAsignados({numero_pedido: numero_pedido, responsable: responsable});

            if (--i === 0) {
                res.send(G.utils.r(req.url, 'Asignacion de Resposables', 200, {}));
            }
        });
    });
};


PedidosCliente.prototype.listaPedidosOperariosBodega = function(req, res) {

    var that = this;

    var operario_bodega = req.query.operario_id;

    this.m_pedidos_clientes.listar_pedidos_del_operario(operario_bodega, function(err, lista_pedidos_clientes) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Clientes', 200, {pedidos_clientes: lista_pedidos_clientes}));
    });

};


PedidosCliente.$inject = ["m_pedidos_clientes", "e_pedidos_clientes"];

module.exports = PedidosCliente;