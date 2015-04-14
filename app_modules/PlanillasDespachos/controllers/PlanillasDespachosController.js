
var PlanillasDespachos = function(planillas_despachos) {

    console.log("Modulo Planillas Despachos Cargado ");

    this.m_planillas_despachos = planillas_despachos;
};


PlanillasDespachos.prototype.listarPlanillasDespachos = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.termino_busqueda === undefined ) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }
    
    var termino_busqueda = args.planillas_despachos.termino_busqueda;

    that.m_planillas_despachos.listar_planillas_despachos(termino_busqueda, function(err, lista_planillas_despachos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las planillas_despachos', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de planillas_despachos', 200, {planillas_despachos: lista_planillas_despachos}));
        }
    });
};

PlanillasDespachos.prototype.consultarPlanillaDespacho = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.termino_busqueda === undefined ) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }
    
    var termino_busqueda = args.planillas_despachos.termino_busqueda;

    that.m_planillas_despachos.consultar_planilla_despacho(termino_busqueda, function(err, lista_planillas_despachos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las planillas_despachos', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de planillas_despachos', 200, {planillas_despachos: lista_planillas_despachos}));
        }
    });
};

PlanillasDespachos.$inject = ["m_planillas_despachos"];

module.exports = PlanillasDespachos;