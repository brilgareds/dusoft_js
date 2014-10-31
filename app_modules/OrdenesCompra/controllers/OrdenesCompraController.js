
var OrdenesCompra = function(ordenes_compras) {

    console.log("Modulo Ordenes Compra  Cargado ");

    this.m_ordenes_compra = ordenes_compras;
};

OrdenesCompra.prototype.listarOrdenesCompra = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.fecha_inicial === undefined || args.ordenes_compras.fecha_final === undefined || args.ordenes_compras.termino_busqueda === undefined || args.ordenes_compras.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.termino_busqueda === undefined || args.ordenes_compras.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda, pagina_actual no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.fecha_inicial === '' || args.ordenes_compras.fecha_final === '') {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final estan vacias', 404, {}));
        return;
    }

    if (args.ordenes_compras.pagina_actual === '' || args.ordenes_compras.pagina_actual === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var fecha_inicial = args.ordenes_compras.fecha_inicial;
    var fecha_final = args.ordenes_compras.fecha_final;
    var termino_busqueda = args.ordenes_compras.termino_busqueda;
    var pagina_actual = args.ordenes_compras.pagina_actual;

    that.m_ordenes_compra.listar_ordenes_compra(fecha_inicial, fecha_final, termino_busqueda, pagina_actual, function(err, lista_ordenes_compras) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras : []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Ordenes Compras', 200, {ordenes_compras : lista_ordenes_compras}));
            return;
        }
    });
};


OrdenesCompra.$inject = ["m_ordenes_compra"];

module.exports = OrdenesCompra;