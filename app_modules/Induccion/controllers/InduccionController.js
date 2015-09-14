
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



Induccion.$inject = ["m_induccion"];

module.exports = Induccion;