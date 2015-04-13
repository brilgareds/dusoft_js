
var Ciudades = function(ciudades) {

    console.log("Modulo Ciudades Cargado ");

    this.m_ciudades = ciudades;
};


Ciudades.prototype.listarCiudades = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.ciudades === undefined || args.ciudades.termino_busqueda === undefined ) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }
    
    var termino_busqueda = args.ciudades.termino_busqueda;

    that.m_ciudades.listar_ciudades(termino_busqueda, function(err, lista_ciudades) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las ciudades', 500, {ciudades: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de ciudades', 200, {ciudades: lista_ciudades}));
        }
    });
};

Ciudades.$inject = ["m_ciudades"];

module.exports = Ciudades;