
var Moleculas = function(laboratorios) {

    this.m_moleculas = laboratorios;
};


Moleculas.prototype.listarMoleculas = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.moleculas === undefined || args.moleculas.termino_busqueda === undefined ) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }
    
    var termino_busqueda = args.moleculas.termino_busqueda;

    that.m_moleculas.listar_moleculas(termino_busqueda, function(err, lista_moleculas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las moleculas', 500, {moleculas: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de moleculas', 200, {moleculas: lista_moleculas}));
        }
    });
};

Moleculas.$inject = ["m_moleculas"];

module.exports = Moleculas;