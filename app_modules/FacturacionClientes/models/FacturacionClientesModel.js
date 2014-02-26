
var FacturacionClientesModel = function() {

};


FacturacionClientesModel.prototype.sayHello = function(callback) {

    var str = "Saludando desde Facturacion Clientes";
    callback(str);
};

module.exports = FacturacionClientesModel;