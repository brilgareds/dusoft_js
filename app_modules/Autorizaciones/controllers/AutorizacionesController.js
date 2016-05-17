
var Autorizaciones = function(autorizaciones, pedidos_farmacias, pedidos_clientes, ordenes_compra, m_productos) {
    this.m_autorizaciones = autorizaciones;
    this.m_pedidos_farmacias = pedidos_farmacias;
    this.m_pedidos_clientes = pedidos_clientes;
    this.m_ordenes_compra = ordenes_compra;
    this.m_productos = m_productos;
};


Autorizaciones.prototype.listarProductosBloqueados = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.autorizaciones === undefined || args.autorizaciones.termino_busqueda === undefined || args.autorizaciones.pagina_actual === undefined || args.autorizaciones.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.autorizaciones.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var termino_busqueda = {};
    termino_busqueda.termino = args.autorizaciones.termino_busqueda;
    termino_busqueda.empresa = args.autorizaciones.empresa_id;
    termino_busqueda.tipo_pedido = args.autorizaciones.tipo_pedido;
    var pagina_actual = args.autorizaciones.pagina_actual;
    G.Q.nfcall(this.m_autorizaciones.listarProductosBloqueados, termino_busqueda, pagina_actual).
            then(function(listarProductosBloqueados) {
        res.send(G.utils.r(req.url, 'Listado de Productos Bloqueados!!!!', 200, {listarProductosBloqueados: listarProductosBloqueados}));
    }).
            fail(function(err) {
        res.send(G.utils.r(req.url, 'Error Listado de Productos Bloqueados', 500, {listarProductosBloqueados: {}}));
    }).
            done();

};

Autorizaciones.$inject = ["m_autorizaciones", "m_pedidos_farmacias", "m_pedidos_clientes", "m_ordenes_compra", "m_productos"];

module.exports = Autorizaciones;