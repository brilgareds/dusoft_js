
var Proveedores = function(proveedores) {

    console.log("Modulo Proveedores  Cargado ");

    this.m_proveedores = proveedores;
};

Proveedores.prototype.listarProveedores = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.proveedores === undefined || args.proveedores.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda o pagina_actual no esta definido', 404, {}));
        return;
    }

    var termino_busqueda = args.proveedores.termino_busqueda;

    that.m_proveedores.listar_proveedores(termino_busqueda, function(err, lista_proveedores) {
        if (err)
            res.send(G.utils.r(req.url, 'Error listando los proveedores', 500, {}));
        else {
            res.send(G.utils.r(req.url, 'Lista de proveedores', 200, {proveedores: lista_proveedores}));
        }
    });
};

Proveedores.prototype.listarProveedoresPorCodigo = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.proveedores === undefined || args.proveedores.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda o pagina_actual no esta definido', 404, {}));
        return;
    }

    var termino_busqueda = args.proveedores.termino_busqueda;

    that.m_proveedores.obtenerProveedorPorCodigo(termino_busqueda, function(err, lista_proveedores) {
        if (err)
            res.send(G.utils.r(req.url, 'Error listando los proveedores', 500, {}));
        else {
            res.send(G.utils.r(req.url, 'Lista de proveedores', 200, {proveedores: lista_proveedores}));
        }
    });
};

Proveedores.$inject = ["m_proveedores"];

module.exports = Proveedores;