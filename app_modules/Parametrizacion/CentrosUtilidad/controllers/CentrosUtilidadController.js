
var CentrosUtilidad = function (centros_utilidad) {

    this.m_centros_utilidad = centros_utilidad;
};


CentrosUtilidad.prototype.listar_centros_utilidad_empresa = function (req, res) {

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

    that.m_centros_utilidad.listar_centros_utilidad_empresa(empresa_id, function (err, lista_centros_utilidad) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listado centros utilidad', 500, {centros_utilidad: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Centros Utilidad', 200, {centros_utilidad: lista_centros_utilidad}));
        }

    });
};


CentrosUtilidad.prototype.listar_centros_utilidad_ciudad = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.centro_utilidad === undefined || args.centro_utilidad.pais_id === undefined || args.centro_utilidad.departamento_id === undefined || args.centro_utilidad.ciudad_id === undefined) {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id no esta definido', 404, {}));
        return;
    }

    if (args.centro_utilidad.pais_id === '' || args.centro_utilidad.departamento_id === '' || args.centro_utilidad.ciudad_id === '') {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id estan vacios', 404, {}));
        return;
    }

    var parametros = {
        estado: (!args.centro_utilidad.estado) ? '0' : args.centro_utilidad.estado,
        pais_id: args.centro_utilidad.pais_id,
        departamento_id: args.centro_utilidad.departamento_id,
        ciudad_id: args.centro_utilidad.ciudad_id,
        termino_busqueda: (args.centro_utilidad.termino_busqueda === undefined) ? '' : args.centro_utilidad.termino_busqueda
    };

    that.m_centros_utilidad.listar_centros_utilidad_ciudad(parametros, function (err, lista_centros_utilidad) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listado centros utilidad', 500, {centros_utilidad: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Centros Utilidad', 200, {centros_utilidad: lista_centros_utilidad}));
        }

    });
};

CentrosUtilidad.prototype.listar_centros_utilidad_bodega = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.centro_utilidad === undefined) {
        res.send(G.utils.r(req.url, 'algunos datos no estan definidos', 404, {}));
        return;
    }

    var parametros = {
        termino_busqueda: (args.centro_utilidad.termino_busqueda === undefined) ? '' : args.centro_utilidad.termino_busqueda
    };

    that.m_centros_utilidad.listar_centros_utilidad_bodega(parametros, function (err, lista_centros_utilidad) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listado centros utilidad', 500, {centros_utilidad: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Centros Utilidad', 200, {centros_utilidad: lista_centros_utilidad}));
        }

    });
};

CentrosUtilidad.prototype.listarFarmaciasTerceros = function (req, res) {

    var that = this;

    var args = req.body.data;

//    if (args.centro_utilidad === undefined ||  args.centro_utilidad.departamento_id === undefined || args.centro_utilidad.ciudad_id === undefined) {
//        res.send(G.utils.r(req.url, 'departamento_id o ciudad_id no esta definido', 404, {}));
//        return;
//    }

//    if (args.centro_utilidad.departamento_id === '' || args.centro_utilidad.ciudad_id === '' ) {
//        res.send(G.utils.r(req.url, 'departamento_id o ciudad_id estan vacios', 404, {}));
//        return;
//    }

    var parametros = {
//        departamento_id:args.centro_utilidad.departamento_id, 
//        ciudad_id:args.centro_utilidad.ciudad_id, 
        termino_busqueda: (args.centro_utilidad.termino_busqueda === undefined) ? '' : args.centro_utilidad.termino_busqueda
    };

    that.m_centros_utilidad.listar_farmacias_medipol(parametros, function (err, lista_centros_utilidad) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listado centros utilidad', 500, {centros_utilidad: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Centros Utilidad', 200, {centros_utilidad: lista_centros_utilidad}));
        }

    });
};

CentrosUtilidad.$inject = ["m_centros_utilidad"];

module.exports = CentrosUtilidad;