
var Ciudades = function(ciudades) {

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

Ciudades.prototype.seleccionarCiudad = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.ciudades === undefined || args.ciudades.ciudad_id === undefined || args.ciudades.departamento_id === undefined || args.ciudades.pais_id === undefined) {
        res.send(G.utils.r(req.url, 'ciudad_id, departamento_id o pais_id no esta definido', 404, {}));
        return;
    }
    
    var ciudad_id = args.ciudades.ciudad_id;
    var departamento_id = args.ciudades.departamento_id;
    var pais_id = args.ciudades.pais_id;

    that.m_ciudades.seleccionar_ciudad(ciudad_id, departamento_id, pais_id, function(err, lista_ciudades) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error al consultar la ciudad', 500, {ciudades: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Consulta de ciudad exitosa', 200, {ciudades: lista_ciudades}));
        }
        
    });
};

Ciudades.prototype.obtenerCiudadesPorDepartamento = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.ciudades === undefined || args.ciudades.departamento_id === undefined) {
        res.send(G.utils.r(req.url, 'departamento_id  no esta definido', 404, {}));
        return;
    }
    
    var departamento_id = args.ciudades.departamento_id;

    that.m_ciudades.listar_ciudades_departamento(departamento_id, function(err, lista_ciudades) {

        if (err) {
            console.log("error generaod ", err);
            res.send(G.utils.r(req.url, 'Error al consultar las ciudades', 500, {ciudades: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Consulta de ciudades exitosa', 200, {ciudades: lista_ciudades}));
        }
        
    });
};

Ciudades.$inject = ["m_ciudades"];

module.exports = Ciudades;