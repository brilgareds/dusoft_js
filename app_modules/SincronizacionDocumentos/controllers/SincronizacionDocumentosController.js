
var SincronizacionDocumentos = function(sincronizacion) {
    this.m_Sincronizacion = sincronizacion;
};

SincronizacionDocumentos.prototype.listarPrefijos = function(req, res) {
    console.log('Entro en el controlador!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_sincronizacion,'listarPrefijos', args).
       then(function(prefijos) {
       res.send(G.utils.r(req.url, 'Listado de Prefijos!!!!', 200, {listarPrefijos: prefijos}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error Listando Prefijos', 500, {listarPrefijos: {}}));
    }).
       done();
};

SincronizacionDocumentos.$inject = [
                          "m_Sincronizacion"
                         ];

module.exports = SincronizacionDocumentos;