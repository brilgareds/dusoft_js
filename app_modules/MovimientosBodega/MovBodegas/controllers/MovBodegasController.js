
var MovBodegasController = function(movimientos_bodegas) {

    this.m_movientos_bodegas = movimientos_bodegas;
};

// Consultar Documentos Usuario
MovBodegasController.prototype.consultarDocumentosUsuario = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.movimientos_bodegas === undefined || args.movimientos_bodegas.centro_utilidad_id === undefined || args.movimientos_bodegas.bodega_id === undefined || args.movimientos_bodegas.tipo_documento === undefined ) {
        res.send(G.utils.r(req.url, 'El centro_utilidad_id o bodega_id NO estan definidos', 404, {}));
        return;
    }

    if (args.movimientos_bodegas.centro_utilidad_id === '' || args.movimientos_bodegas.bodega_id === '') {
        res.send(G.utils.r(req.url, 'El centro_utilidad_id o bodega_id estan vacíos', 404, {}));
        return;
    }

    var usuario_id = req.session.user.usuario_id;
    var centro_utilidad_id = args.movimientos_bodegas.centro_utilidad_id;
    var bodega_id = args.movimientos_bodegas.bodega_id;
    var tipo_documento = args.movimientos_bodegas.tipo_documento;

    that.m_movientos_bodegas.consultar_documentos_usuario(usuario_id, centro_utilidad_id, bodega_id, tipo_documento,function(err, lista_documentos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los documentos del usuario', 500, {movimientos_bodegas: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista documentos del usuario', 200, {movimientos_bodegas: lista_documentos}));
        }
    });

};


MovBodegasController.$inject = ["m_movientos_bodegas"];

module.exports = MovBodegasController;