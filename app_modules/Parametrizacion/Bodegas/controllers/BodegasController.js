
var Bodegas = function(bodegas) {

    this.m_bodegas = bodegas;
};


Bodegas.prototype.listar_bodegas_empresa = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.bodegas === undefined || args.bodegas.empresa_id === undefined || args.bodegas.centro_utilidad_id === undefined) {
        res.send(G.utils.r(req.url, 'el empresa_id o centro_utilidad_id no esta definido', 404, {}));
        return;
    }

    if (args.bodegas.empresa_id === '' || args.bodegas.centro_utilidad_id === '') {
        res.send(G.utils.r(req.url, 'el empresa_id o centro_utilidad_id esta vacio', 404, {}));
        return;
    }

    var empresa_id = args.bodegas.empresa_id;
    var centro_utilidad_id = args.bodegas.centro_utilidad_id;

    that.m_bodegas.listar_bodegas_empresa(empresa_id, centro_utilidad_id, function(err, lista_bodegas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listado bodegas', 500, {bodegas: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Bodegas', 200, {bodegas: lista_bodegas}));
        }
    });
};

Bodegas.prototype.listar_bodegas_duana_farmacias = function(req, res) {

    var that = this;
    var args = req.body.data;

   G.Q.ninvoke( that.m_bodegas,'listar_bodegas_duana_farmacias').then(function(resultado){
   
    res.send(G.utils.r(req.url, 'Lista de Bodegas', 200, {bodegas: resultado}));
        
    }).fail(function(err){     

       res.send(G.utils.r(req.url, 'Error listado bodegas', 500, {bodegas: {}}));
    }).done();   
    
};

Bodegas.prototype.listarBodegasPorTermino = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.bodegas === undefined || args.bodegas.termino === undefined) {
        res.send(G.utils.r(req.url, 'el termino de busqueda no esta definido', 404, {}));
        return;
    }

    if (args.bodegas.termino === '') {
        res.send(G.utils.r(req.url, 'el termino de busqueda esta vacio', 404, {}));
        return;
    }

    var termino = args.bodegas.termino;

    that.m_bodegas.listarBodegasPorTermino(termino, function(err, lista_bodegas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listado bodegas', 500, {bodegas: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Bodegas', 200, {bodegas: lista_bodegas}));
        }
    });
};

Bodegas.$inject = ["m_bodegas"];

module.exports = Bodegas;