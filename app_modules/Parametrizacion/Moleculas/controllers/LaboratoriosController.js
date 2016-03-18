
var Laboratorios = function(laboratorios) {

    console.log("Modulo Laboratorios Cargado ");

    this.m_laboratorios = laboratorios;
};


Laboratorios.prototype.listarLaboratorios = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.laboratorios === undefined || args.laboratorios.termino_busqueda === undefined ) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }
    
    var termino_busqueda = args.laboratorios.termino_busqueda;

    that.m_laboratorios.listar_laboratorios(termino_busqueda, function(err, lista_laboratorios) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los laboratorios', 500, {laboratorios: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de laboratorios', 200, {laboratorios: lista_laboratorios}));
        }
    });
};

Laboratorios.$inject = ["m_laboratorios"];

module.exports = Laboratorios;