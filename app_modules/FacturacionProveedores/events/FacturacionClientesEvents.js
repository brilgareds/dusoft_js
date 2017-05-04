
var FacturacionClientesEvents = function(socket, m_facturacion_clientes) {

    this.io = socket;
    this.m_facturacion_clientes = m_facturacion_clientes;
};



FacturacionClientesEvents.$inject = ["socket", "m_facturacion_clientes"];

module.exports = FacturacionClientesEvents;