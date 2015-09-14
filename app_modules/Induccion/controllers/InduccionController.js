
var Induccion = function(induccion) {

    this.m_induccion = induccion;

};


Induccion.prototype.listarEmpresas = function(req, res) {
    
    var that = this;
    var args = req.body.data;
   
    that.m_induccion.getListarEmpresas(function(err, empresas ) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las empresas', 500, {listar_empresas: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de empresas OK', 200, {listar_empresas: empresas}));
        }
    });
};

Induccion.prototype.listarCentroUtilidad = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaId = args.empresaId;
    
    if (empresaId === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, empresa_id no estan definidas', 404, {}));
        return;
    }
    
    that.m_induccion.getListarCentroUtilidad(empresaId,function(err, centroUtilidad ) { 

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando centros de utilidad', 500, {listarCentroUtilidad: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de centros de utilidad OK', 200, {listarCentroUtilidad: centroUtilidad}));
        }
    });
};



Induccion.$inject = ["m_induccion"];

module.exports = Induccion;