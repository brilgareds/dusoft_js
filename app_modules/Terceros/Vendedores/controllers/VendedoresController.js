
var Vendedores = function(vendedores, pedidos_clientes) {

    this.m_vendedores = vendedores;
    this.m_pedidos_clientes = pedidos_clientes;

};

Vendedores.prototype.listarVendedores = function(req, res) {
    var that = this;

    var args = req.body.data;

    this.m_vendedores.listar_vendedores(function(err, listado_vendedores) {
        if(err)
            res.send(G.utils.r(req.url, 'Error Consultando Vendedores', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Consulta de Vendedores Exitosa', 200, {listado_vendedores: listado_vendedores}));
    });
    
};

Vendedores.$inject = ["m_vendedores", "m_pedidos_clientes"];

module.exports = Vendedores;