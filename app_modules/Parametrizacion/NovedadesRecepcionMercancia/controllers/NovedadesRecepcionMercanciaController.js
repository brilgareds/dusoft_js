
var NovedadesRecepcion = function(novedades_mercancia) {

    this.m_novedades_mercancia = novedades_mercancia;
};


NovedadesRecepcion.prototype.listarNovedades = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.novedades_mercancia === undefined || args.novedades_mercancia.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }

    var termino_busqueda = args.novedades_mercancia.termino_busqueda;

    that.m_novedades_mercancia.listar_novedades_mercancia(termino_busqueda, function(err, lista_novedades_mercancia) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las novedades_mercancia', 500, {novedades_mercancia: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de novedades_mercancia', 200, {novedades_mercancia: lista_novedades_mercancia}));
        }
    });
};


NovedadesRecepcion.prototype.consultarNovedad = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.novedades_mercancia === undefined || args.novedades_mercancia.novedad_id === undefined) {
        res.send(G.utils.r(req.url, 'novedad_id no esta definido', 404, {}));
        return;
    }

    if (args.novedades_mercancia.novedad_id === '') {
        res.send(G.utils.r(req.url, 'novedad_id esta vacío', 404, {}));
        return;
    }

    var novedad_id = args.novedades_mercancia.novedad_id;

    that.m_novedades_mercancia.consultar_novedad_mercancia(novedad_id, function(err, novedad_mercancia) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando la novedad', 500, {novedades_mercancia: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Novedad Mercancia', 200, {novedades_mercancia: novedad_mercancia}));
        }
    });

};


NovedadesRecepcion.prototype.ingresarNovedad = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.novedades_mercancia === undefined || args.novedades_mercancia.codigo === undefined || args.novedades_mercancia.descripcion === undefined) {
        res.send(G.utils.r(req.url, 'codigo, descripcion o usuario_id no esta definido', 404, {}));
        return;
    }

    if (args.novedades_mercancia.codigo === '' || args.novedades_mercancia.descripcion === '') {
        res.send(G.utils.r(req.url, 'codigo o descripcion esta vacío', 404, {}));
        return;
    }

    var codigo = args.novedades_mercancia.codigo;
    var descripcion = args.novedades_mercancia.descripcion;
    var usuario_id = req.session.user.usuario_id;

    that.m_novedades_mercancia.insertar_novedad_mercancia(codigo, descripcion, usuario_id, function(err, novedad_mercancia) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error ingresando la novedad', 500, {novedades_mercancia: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Novedad Mercancia ingresado correctamnte', 200, {novedades_mercancia: novedad_mercancia}));
        }
    });

};

NovedadesRecepcion.prototype.modificarNovedad = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.novedades_mercancia === undefined || args.novedades_mercancia.novedad_id === undefined || args.novedades_mercancia.descripcion === undefined) {
        res.send(G.utils.r(req.url, 'novedad_id o descripcion no esta definido', 404, {}));
        return;
    }

    if (args.novedades_mercancia.novedad_id === '' || args.novedades_mercancia.descripcion === '') {
        res.send(G.utils.r(req.url, 'novedad_id o descripcion esta vacío', 404, {}));
        return;
    }

    var novedad_id = args.novedades_mercancia.novedad_id;
    var descripcion = args.novedades_mercancia.descripcion;    

    that.m_novedades_mercancia.actualizar_novedad_mercancia(novedad_id, descripcion, function(err, novedad_mercancia) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error actualizando la novedad', 500, {novedades_mercancia: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Novedad Mercancia actualizada correctamnte', 200, {novedades_mercancia: novedad_mercancia}));
        }
    });
};


NovedadesRecepcion.prototype.inactivarNovedad = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.novedades_mercancia === undefined || args.novedades_mercancia.novedad_id === undefined) {
        res.send(G.utils.r(req.url, 'novedad_id no esta definido', 404, {}));
        return;
    }

    if (args.novedades_mercancia.novedad_id === '') {
        res.send(G.utils.r(req.url, 'novedad_id esta vacío', 404, {}));
        return;
    }

    var novedad_id = args.novedades_mercancia.novedad_id;  

    that.m_novedades_mercancia.inactivar_novedad_mercancia(novedad_id, function(err, novedad_mercancia) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error inactivando la novedad', 500, {novedades_mercancia: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Novedad Mercancia inactivada correctamente', 200, {novedades_mercancia: novedad_mercancia}));
        }
    });

};

NovedadesRecepcion.$inject = ["m_novedades_mercancia"];

module.exports = NovedadesRecepcion;