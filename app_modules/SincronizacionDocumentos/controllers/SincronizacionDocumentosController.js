
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

SincronizacionDocumentos.prototype.listarTiposFacturas = function(req, res) {
    console.log('In Controller!!');
    var that = this;
    var args = req.body.data;
    
    G.Q.ninvoke(this.m_SincronizacionDoc,'listarTiposFacturas', args).
       then(function(listarTiposFacturas) {
       res.send(G.utils.r(req.url, 'listarTiposFacturas!', 200, {listarTiposFacturas: listarTiposFacturas}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error listarTiposFacturas', 500, {listarTiposFacturas: false}));
    }).
       done();
};

SincronizacionDocumentos.prototype.guardarCuentas = function(req, res) {
    console.log('In Controller backend - guardarCuentas!!');
    var that = this;
    var args = req.body.data;
    var categorias = args.categorias;
    var sw_cuentas = [0, 1];
    var tipo_cuenta = '';
    var cuentas = {};
    var error_count = 0;
    //console.log('Array in model is: ', categorias);

    for(var index in categorias){
        var obj = categorias[index];
        sw_cuentas.forEach(function(sw_cuenta) {
            if (sw_cuenta == 0) {
                tipo_cuenta = 'debito';
            } else if (sw_cuenta == 1) {
                tipo_cuenta = 'credito';
            }
            cuentas = obj[tipo_cuenta];
            cuentas.sw_cuenta = sw_cuenta;
            cuentas.tipo_cuenta = tipo_cuenta;
            cuentas.empresa_id = args.empresa_id;
            cuentas.centro_id = args.centro_id;
            cuentas.bodega_id = args.bodega_id;
            cuentas.prefijo_id = args.prefijo_id;
            //console.log('For in Controller: ', cuentas);

            G.Q.ninvoke(that.m_SincronizacionDoc,'guardarCuentas', cuentas).
            then(function(resultado) {
                console.log('Todo bien en "guardarCuentas"');
            }).
            fail(function(err) {
                error_count++;
                console.log('Error en "guardarCuentas"');
            });
        });
    }
    if(error_count > 0){
        res.send(G.utils.r(req.url, 'Error guardarCuentas', 500, {status: false}));
    }else{
        res.send(G.utils.r(req.url, 'La actualización de cuentas fue exitosa!', 200, {status: true}));
    }
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