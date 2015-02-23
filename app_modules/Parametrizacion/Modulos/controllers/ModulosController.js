
var Modulos = function(m_modulo) {

    console.log("Modulo parametrizacion modulos  Cargado ******************* ");

    this.m_modulo = m_modulo;
};


Modulos.prototype.listar_modulos = function(req, res) {

    var that = this;


    var args = req.body.data;


    that.m_modulo.listar_modulos(function(err, lista_modulos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Modulos', 500, {modulos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Modulos del sistema', 200, {modulos: lista_modulos}));
        }
    });
};

Modulos.prototype.guardarModulo = function(req, res){
    var that = this;

    var args = req.body.data;
    
    
    
    
};


Modulos.$inject = ["m_modulo"];

module.exports = Modulos;