
var PedidosFarmacias = function(pedidos_farmacias) {

    console.log("Modulo Pedidos Farmacias  Cargado ");

    this.m_pedidos_farmacias = pedidos_farmacias;    

};

PedidosFarmacias.prototype.listarPedidosFarmacias = function(req, res) {
    
    var that = this;
    var empresa_id = 'FD';//req.query.empresa_id;
    var termino_busqueda = '';//req.query.termino_busqueda;
    
    this.m_pedidos_farmacias.listar_pedidos_farmacias(empresa_id, termino_busqueda, function(err, lista_pedidos_farmacias) {
         res.send(G.utils.r(req.url, 'Lista Pedidos Farmacias', 200, { pedidos_farmacias: lista_pedidos_farmacias }));
    });
};

PedidosFarmacias.$inject = ["m_pedidos_farmacias"];

module.exports = PedidosFarmacias;