
var FacturacionClientes = function(facturacionClientes) {

    console.log("Controlador FacturacionClientes  Cargado ");   
    
    this.m_facturacion_clientes = facturacionClientes;
    
};

FacturacionClientes.prototype.index = function(req, res) {
    
    this.m_facturacion_clientes.sayHello(function (msj){
        res.send({msj : msj})
    });
};

FacturacionClientes.$inject = ["m_facturacion_clientes"];

module.exports = FacturacionClientes;
