
var Kardex = function(terceros) {

    console.log("Modulo Terceros  Cargado ");

    this.m_terceros = terceros;

};


Kardex.prototype.listarTerceros = function(req, res) {
    
};

Kardex.prototype.listarClientes = function(req, res) {
    
};

Kardex.prototype.listarProveedores = function(req, res) {
    
};

Kardex.prototype.listarOperariosBodega = function(req, res) {
    var that = this;
    
    this.m_terceros.listar_operarios_bodega(function (err, lista_operarios){
        res.send(G.utils.r(req.url, 'Lista Operarios Bodega', 200, { lista_operarios: lista_operarios}));
    });    
};

Kardex.$inject = ["m_terceros"];

module.exports = Kardex;