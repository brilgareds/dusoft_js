
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

E009Controller.$inject = ["m_e009"];

module.exports = E009Controller;
