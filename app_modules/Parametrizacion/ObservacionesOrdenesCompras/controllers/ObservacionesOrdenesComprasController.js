
var ObservacionesOrdenes = function(observaciones) {

    console.log("Modulo Observaciones Ordenes Compra Cargado ");

    this.m_observaciones = observaciones;
};


ObservacionesOrdenes.prototype.listarObservaciones = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.observaciones === undefined || args.observaciones.termino_busqueda === undefined ) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }
    
    var termino_busqueda = args.observaciones.termino_busqueda;

    that.m_observaciones.listar_observaciones(termino_busqueda, function(err, lista_observaciones) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las observaciones', 500, {observaciones : {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de observaciones', 200, {observaciones: lista_observaciones}));
        }
    });
};

ObservacionesOrdenes.$inject = ["m_observaciones"];

module.exports = ObservacionesOrdenes;