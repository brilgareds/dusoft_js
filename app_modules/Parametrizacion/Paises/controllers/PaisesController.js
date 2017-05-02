
var Paises = function(paises) {

    console.log("Modulo Paises Cargado ");

    this.m_paises = paises;
};


Paises.prototype.listarPaises = function(req, res) {

    var that = this;

    that.m_paises.listar_paises(function(err, listaPaises) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los paises', 500, {ciudades: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de paises', 200, {ciudades: listaPaises}));
        }
    });
};

Paises.prototype.seleccionarPais = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.paises === undefined || args.paises.pais_id === undefined ) {
        res.send(G.utils.r(req.url, 'pais_id no está definido', 404, {}));
        return;
    }
    
    var pais_id = args.paises.pais_id;

    that.m_paises.seleccionar_pais(pais_id, function(err, lista_paises) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando el País', 500, {paises: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Consulta de País Exitosa', 200, {paises: lista_paises}));
        }
    });
};

Paises.$inject = ["m_paises"];

module.exports = Paises;