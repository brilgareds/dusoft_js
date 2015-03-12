
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

    if (args.clientes === undefined || args.clientes.empresa_id === undefined || args.clientes.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id o pagina_actual no están definidas.', 404, {}));
        return;
    }
    
    if (args.clientes.empresa_id === '' || args.clientes.pagina_actual === '' || args.clientes.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'empresa_id está vacio o pagina_actual es vacio o 0.', 404, {}));
        return;
    }

    var empresa_id = args.clientes.empresa_id;
    var termino_busqueda = (args.clientes.termino_busqueda === undefined) ? '' : args.clientes.termino_busqueda;
    var pagina_actual = args.clientes.pagina_actual;
    
    this.m_clientes.listar_clientes( empresa_id,termino_busqueda, pagina_actual, function(err, listado_clientes) {
        if(err)
            res.send(G.utils.r(req.url, 'Error Consultando Clientes', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Consulta de Clientes Exitosa', 200, {listado_clientes: listado_clientes}));
    });
    
};

Clientes.prototype.consultarContratoCliente = function(req, res) {
    var that = this;

    var args = req.body.data;
    
    //tipo_id_tercero, tercero_id, empresa_id

    if (args.contrato_cliente === undefined || args.contrato_cliente.tipo_id_cliente === undefined || args.contrato_cliente.cliente_id === undefined)
    {
        res.send(G.utils.r(req.url, 'tipo_id_tercero o tercero_id no están definidas.', 404, {}));
        return;
    }
    
    if (args.contrato_cliente.tipo_id_cliente === undefined || args.contrato_cliente.cliente_id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_id_tercero o tercero_id están vacios.', 404, {}));
        return;
    }

    var tipo_id_cliente = args.contrato_cliente.tipo_id_cliente;
    var cliente_id = args.contrato_cliente.cliente_id;
    
    this.m_clientes.consultar_contrato_cliente( tipo_id_cliente, cliente_id, function(err, contrato_cliente) {
        if(err)
            res.send(G.utils.r(req.url, 'Error Consultando Contrato Clientes', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Consulta de Contrato Clientes Exitosa', 200, {resultado_consulta: contrato_cliente}));
    });
    
};



Clientes.$inject = ["m_clientes", "m_pedidos_clientes"];

module.exports = Clientes;