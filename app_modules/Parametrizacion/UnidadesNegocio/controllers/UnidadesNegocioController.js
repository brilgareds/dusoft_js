
var UnidadesNegocio = function(unidades_negocio) {

    console.log("Modulo Unidades Negocio Cargado ");

    this.m_unidades_negocio = unidades_negocio;
};


UnidadesNegocio.prototype.listarUnidadesNegocio = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.unidades_negocio === undefined || args.unidades_negocio.termino_busqueda === undefined ) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }
    
    var termino_busqueda = args.unidades_negocio.termino_busqueda;

    that.m_unidades_negocio.listar_unidades_negocio(termino_busqueda, function(err, lista_unidades_negocios) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las unidades de negocio', 500, {unidades_negocio: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de unidades de negocio', 200, {unidades_negocio: lista_unidades_negocios}));
        }
    });
};

UnidadesNegocio.$inject = ["m_unidades_negocio"];

module.exports = UnidadesNegocio;