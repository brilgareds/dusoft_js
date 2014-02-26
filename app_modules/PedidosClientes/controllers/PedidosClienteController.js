
var PedidosCliente = function(pedidos_clientes, kardex, facturacion_clientes) {

    console.log("Controlador Pedidos Cliente  Cargado ");

    this.m_pedidos_clientes = pedidos_clientes;
    this.m_kardex = kardex;
    this.m_facturacion_clientes = facturacion_clientes;

};

PedidosCliente.prototype.index = function(req, res) {
    var that = this;
    this.m_pedidos_clientes.sayHello(function(msj_pedidos_cliente) {
        that.m_kardex.sayHello(function(msj_kardex) {
            that.m_facturacion_clientes.sayHello(function(msj_facturacion_clientes) {
                res.send({pedidos_cliente_dice: msj_pedidos_cliente, kardex_dice: msj_kardex, facturacion_clientes_dice: msj_facturacion_clientes})
            });
        });
    });
};

PedidosCliente.$inject = ["m_pedidos_clientes", "m_kardex", "m_facturacion_clientes"];

module.exports = PedidosCliente;