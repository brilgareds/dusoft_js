
var Clientes = function(clientes, pedidos_clientes) {

    console.log("Modulo Terceros  Cargado ");

    this.m_clientes = clientes;
    this.m_pedidos_clientes = pedidos_clientes;


};

Clientes.prototype.listarClientes = function(req, res) {
    var that = this;

    var args = req.body.data;
    
    /*
      termino_busqueda: $scope.rootSeleccionCliente.termino_busqueda,
      pagina_actual: $scope.rootSeleccionCliente.paginaactual,
     */

    if (args.clientes === undefined || args.clientes.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la página. No está definida.', 404, {}));
        return;
    }
    
    if (args.clientes.pagina_actual === '' || args.clientes.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'La página no puede ser ni vacía ni 0.', 404, {}));
        return;
    }

    var termino_busqueda = (args.clientes.termino_busqueda === undefined) ? '' : args.clientes.termino_busqueda;
    var pagina_actual = args.clientes.pagina_actual;
    
    this.m_clientes.listar_clientes( termino_busqueda, pagina_actual, function(err, listado_clientes) {
        if(err)
            res.send(G.utils.r(req.url, 'Error Consultando Clientes', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Consulta de Clientes Exitosa', 200, {listado_clientes: listado_clientes}));
    });
    
};



Clientes.$inject = ["m_clientes", "m_pedidos_clientes"];

module.exports = Clientes;