
var Empresas = function(empresas) {

    console.log("Modulo Empresas Cargado ");

    this.m_empresas = empresas;
};


Empresas.prototype.listar_empresas = function(req, res) {
    
    var that = this;

    
};

Empresas.$inject = ["m_empresas"];

module.exports = Empresas;