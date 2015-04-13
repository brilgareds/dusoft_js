
var Transportadoras = function(transportadoras) {

    console.log("Modulo Transportadoras Cargado ");

    this.m_transportadoras = transportadoras;
};


Transportadoras.prototype.listarTransportadoras = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.transportadoras === undefined || args.transportadoras.termino_busqueda === undefined ) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }
    
    var termino_busqueda = args.transportadoras.termino_busqueda;

    that.m_transportadoras.listar_transportadoras(termino_busqueda, function(err, lista_transportadoras) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las transportadoras', 500, {transportadoras: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de transportadoras', 200, {transportadoras: lista_transportadoras}));
        }
    });
};

Transportadoras.$inject = ["m_transportadoras"];

module.exports = Transportadoras;