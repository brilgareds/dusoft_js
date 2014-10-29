
var Empresas = function(empresas) {

    console.log("Modulo Empresas Cargado ");

    this.m_empresas = empresas;
};


Empresas.prototype.listar_empresas = function(req, res) {
    
    var that = this;

    that.m_empresas.listar_empresas(function(err, lista_empresas){
        if(err){
            res.send(G.utils.r(req.url, 'Error listado empresas', 500, {empresas: {}}));
        }else{
            res.send(G.utils.r(req.url, 'Lista de Empresas', 200, {empresas: lista_empresas}));
        }
    });
    
};

Empresas.$inject = ["m_empresas"];

module.exports = Empresas;