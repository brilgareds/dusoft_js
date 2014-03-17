
var PedidosFarmacias = function(pedidos_farmacias, eventos_pedidos_farmacias) {

    console.log("Modulo Pedidos Farmacias  Cargado ");

    this.m_pedidos_farmacias = pedidos_farmacias;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;

};


PedidosFarmacias.prototype.obtenerEmpresas = function(req, res) {

    var that = this;

    var usuario = req.session.user.usuario_id;

    this.m_pedidos_farmacias.listar_empresas(usuario, function(err, lista_empresas) {
        res.send(G.utils.r(req.url, 'Lista de Empresas', 200, {empresas: lista_empresas}));
    });
};


PedidosFarmacias.prototype.listarPedidosFarmacias = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pedidos_farmacias === undefined || args.pedidos_farmacias.empresa_id === undefined || args.pedidos_farmacias.termino_busqueda === undefined || args.pedidos_farmacias.pagina_actual === undefined ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.pedidos_farmacias.empresa_id === "" || args.pedidos_farmacias.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }


    var empresa_id = args.pedidos_farmacias.empresa_id;
    var termino_busqueda = args.pedidos_farmacias.termino_busqueda;
    var pagina_actual = args.pedidos_farmacias.pagina_actual;

    this.m_pedidos_farmacias.listar_pedidos_farmacias(empresa_id, termino_busqueda, pagina_actual, function(err, lista_pedidos_farmacias) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Farmacias', 200, {pedidos_farmacias: lista_pedidos_farmacias}));
    });
};

PedidosFarmacias.prototype.asignarResponsablesPedido = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.asignacion_pedidos === undefined || args.asignacion_pedidos.pedidos === undefined || args.asignacion_pedidos.estado_pedido === undefined || args.asignacion_pedidos.responsable === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var params = args.asignacion_pedidos;

    if (params.pedidos.length === 0 || params.estado_pedido === "" || params.responsable === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }

    var pedidos = params.pedidos;
    var estado_pedido = params.estado_pedido;
    var responsable = params.responsable;
    var usuario = req.session.user.usuario_id;
       var i = pedidos.length;

    pedidos.forEach(function(numero_pedido) {

        that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(err, rows) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }

            // Notificando Pedidos Actualizados en Real Time
            that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
            // Notificar al operario, los pedidos Asignados en Real Time
            that.e_pedidos_farmacias.onNotificacionOperarioPedidosAsignados({numero_pedido: numero_pedido, responsable: responsable});

            if (--i === 0) {
                res.send(G.utils.r(req.url, 'Asignacion de Resposables', 200, {}));
            }
        });
    });
};


PedidosFarmacias.prototype.listaPedidosOperariosBodega = function(req, res) {

    var that = this;

    //var operario_bodega = req.body.responsable;
    var operario_bodega = req.query.operario_id;

    this.m_pedidos_farmacias.listar_pedidos_del_operario(operario_bodega, function(err, lista_pedidos_farmacias) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Farmacias', 200, {pedidos_farmacias: lista_pedidos_farmacias}));
    });

};

PedidosFarmacias.$inject = ["m_pedidos_farmacias", "e_pedidos_farmacias"];

module.exports = PedidosFarmacias;