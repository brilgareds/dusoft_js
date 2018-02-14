
var E009Controller = function( m_e009) {

    this.m_e009 = m_e009;
};

/**
 * @author German Galvis
 * +Descripcion lista las bodegas
 * @fecha 2018-02-12
 */
E009Controller.prototype.listarBodegas = function (req, res) {
    var that = this;
    G.Q.nfcall(that.m_e009.listarBodegas).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar bodegas ok!!!!', 200, {listarBodegas: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de bodegas', 500, {listarBodegas: {}}));
            }).
            done();

};

E009Controller.prototype.listarProductos = function(req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        empresa_id: args.empresa_id, //Sesion.getUsuarioActual().getEmpresa().getCodigo()
        centro_utilidad: args.centro_utilidad,
        bodega: args.bodega,
        descripcion: args.descripcion,
        tipoFiltro: args.tipoFiltro
    };

     G.Q.nfcall(that.m_e009.listarProductos, parametros).then(function(resultado) {
        res.send(G.utils.r(req.url, 'Listar Productos Para Asignar', 200, {listarProductos: resultado}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Listar Productos Para Asignar', 500, {}));
    }).done();
};

E009Controller.$inject = ["m_e009"];

module.exports = E009Controller;
