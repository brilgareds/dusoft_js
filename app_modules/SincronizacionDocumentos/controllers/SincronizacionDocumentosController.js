
var SincronizacionDocumentos = function(sincronizacion) {
    this.m_SincronizacionDoc = sincronizacion;
};

SincronizacionDocumentos.prototype.listarPrefijos = function(req, res) {
//    console.log('Entro en el controlador, listarPrefijos!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc,'listarPrefijos', args.data).then(function(prefijos) {
      
       res.send(G.utils.r(req.url, 'Listado de Prefijos!!!!', 200, {listarPrefijos: prefijos}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error Listando Prefijos', 500, {listarPrefijos: {}}));
    }).
       done();
};

SincronizacionDocumentos.prototype.listarTipoCuentaCategoria = function(req, res) {
    console.log('Entro en el controlador, listarTipoCuentascategoria!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc,'listarTipoCuentaCategoria', args).then(function(tipoCuentascategoria) {
        
       res.send(G.utils.r(req.url, 'Listado de TiposCuentas!!!!', 200, {listarTipoCuentaCategoria: tipoCuentascategoria}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error Listado de TiposCuentas', 500, {listarTipoCuentaCategoria: {}}));
    }).
       done();
};

SincronizacionDocumentos.prototype.listarDocumentosCuentas = function(req, res) {
    console.log('Entro en el controlador, listarDocumentosCuentas!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc,'listarDocumentosCuentas', args).then(function(listarDocumentosCuentas) {
        
       res.send(G.utils.r(req.url, 'Listado de TiposCuentas!!!!', 200, {listarDocumentosCuentas: listarDocumentosCuentas}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error Listado de listarDocumentosCuentas', 500, {listarDocumentosCuentas: {}}));
    }).
       done();
};

SincronizacionDocumentos.prototype.insertTiposCuentas = function(req, res) {
    console.log('Entro en el controlador, insertTiposCuentas!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc,'insertTiposCuentas', args).then(function(tiposCuentas) {
       res.send(G.utils.r(req.url, 'insertTiposCuentas!!!!', 200, {insertTiposCuentas: true}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error insertTiposCuentas', 500, {insertTiposCuentas: false}));
    }).
       done();
};


SincronizacionDocumentos.prototype.listarTiposCuentas = function(req, res) {
    console.log('Entro en el controlador, listarTiposCuentas!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc,'listarTiposCuentas', args).
       then(function(tiposCuentas) {
       res.send(G.utils.r(req.url, 'Listado de TiposCuentas!!!!', 200, {listarTiposCuentas: tiposCuentas}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error Listado de TiposCuentas', 500, {listarTiposCuentas: {}}));
    }).
       done();
};

SincronizacionDocumentos.prototype.insertDocumentosCuentas = function(req, res) {
    console.log('Entro en el controlador, insertDocumentosCuentas!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc,'insertDocumentosCuentas', args).
       then(function(tiposCuentas) {
       res.send(G.utils.r(req.url, 'insertDocumentosCuentas!!!!', 200, {insertTiposCuentas: true}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error insertDocumentosCuentas', 500, {insertTiposCuentas: false}));
    }).
       done();
};



SincronizacionDocumentos.prototype.insertTiposCuentasCategorias = function(req, res) {
    console.log('Entro en el controlador, insertTiposCuentasCategorias!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc,'insertTiposCuentasCategorias', args).
       then(function(tiposCuentasCategorias) {
       res.send(G.utils.r(req.url, 'insertTiposCuentasCategorias!!!!', 200, {insertTiposCuentasCategorias: true}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error insertTiposCuentasCategorias', 500, {insertTiposCuentasCategorias: false}));
    }).
       done();
};


SincronizacionDocumentos.$inject = [
    "m_SincronizacionDoc"
];

module.exports = SincronizacionDocumentos;