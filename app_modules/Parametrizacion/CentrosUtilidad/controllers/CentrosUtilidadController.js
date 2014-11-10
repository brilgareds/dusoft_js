
var CentrosUtilidad = function(centros_utilidad) {

    console.log("Modulo CentrosUtilidad  Cargado ");

    this.m_centros_utilidad = centros_utilidad;
};


CentrosUtilidad.prototype.listar_centros_utilidad_empresa = function(req, res) {

    var that = this;
    
    var args = req.body.data;

    if (args.centro_utilidad === undefined || args.centro_utilidad.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'el empresa_id no esta definido', 404, {}));
        return;
    }
    
    if (args.centro_utilidad.empresa_id === '') {
        res.send(G.utils.r(req.url, 'el empresa_id esta vacio', 404, {}));
        return;
    }

    var empresa_id = args.centro_utilidad.empresa_id;

    that.m_centros_utilidad.listar_centros_utilidad_empresa(empresa_id, function(err, lista_centros_utilidad) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listado centros utilidad', 500, {centros_utilidad: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Centros Utilidad', 200, {centros_utilidad: lista_centros_utilidad}));
        }

    });
};

CentrosUtilidad.$inject = ["m_centros_utilidad"];

module.exports = CentrosUtilidad;