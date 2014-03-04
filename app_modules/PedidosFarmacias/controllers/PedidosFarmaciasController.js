
var PedidosFarmacias = function(pedidos_farmacias) {

    console.log("Modulo Pedidos Farmacias  Cargado ");

    this.m_pedidos_farmacias = pedidos_farmacias;

};

PedidosFarmacias.prototype.listarPedidosFarmacias = function(req, res) {

    var that = this;
    var empresa_id = req.query.empresa_id;
    var termino_busqueda = req.query.termino_busqueda;

    this.m_pedidos_farmacias.listar_pedidos_farmacias(empresa_id, termino_busqueda, function(err, lista_pedidos_farmacias) {
        res.send(G.utils.r(req.url, 'Lista Pedidos Farmacias', 200, {pedidos_farmacias: lista_pedidos_farmacias}));
    });
};

PedidosFarmacias.prototype.asignarResponsablesPedido = function(req, res) {

    var that = this;

    var pedidos = req.body.pedidos;
    var estado_pedido = req.body.estado_pedido;
    var responsable = req.body.responsable;
    var usuario = req.body.usuario;

    var i = pedidos.length;

    pedidos.forEach(function(numero_pedido) {

        that.m_pedidos_farmacias.asignar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(err, rows) {

            if (err) {
                res.send(G.utils.r(req.url, 'Se ha Generado un Error en la Asignacion de Resposables', 500, {}));
                return;
            }

            if (--i === 0)
                res.send(G.utils.r(req.url, 'Asignacion de Resposables', 200, {}));
        });
    });
};

PedidosFarmacias.$inject = ["m_pedidos_farmacias"];

module.exports = PedidosFarmacias;