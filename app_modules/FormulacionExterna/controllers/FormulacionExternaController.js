
var FormulacionExterna = function(m_formulacion_externa, m_dispensacion_hc) {
    this.m_formulacionExterna = m_formulacion_externa;
    this.m_dispensacion_hc = m_dispensacion_hc;
};

FormulacionExterna.prototype.obtenerPaciente = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerPaciente', args.tipoIdentificacion, args.identificacion).then(function(resultado){
        res.send(G.utils.r(req.url, 'obtiene pacientes', 200, resultado[0]));
    }).fail(function(err){
        console.log(" err ", err);
        G.logError("FormulacionExternaController [obtenerPaciente] " + err);
    }).done();
}

FormulacionExterna.prototype.obtenerMunicipios = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerMunicipios', args.term).then(function(municipios){
        res.send(G.utils.r(req.url, 'obtener municipio', 200, municipios));
    }).fail(function(err){
        console.log(" err ", err);
        G.logError("FormulacionExternaController [obtenerMunicipios] " + err);
    }).done();
}

FormulacionExterna.$inject = ["m_formulacion_externa", "m_dispensacion_hc"];
module.exports = FormulacionExterna;
