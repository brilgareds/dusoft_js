
var Clientes = function(clientes) {

    console.log("Modulo Clientes  Cargado ");

    this.m_clientes = clientes;
};

Clientes.prototype.listarClientes = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.clientes === undefined || args.clientes.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id  no están definidas.', 404, {}));
        return;
    }

    // Autor .  Camilo Orozco
    // Se implementa esta condicion para permitir mostrar los clientes tanto en un select como en una tabla
    // En un select NO se requiere paginacion, mientras que en la tabla si, por lo tanto 
    // cuando se requiere paginar se envia en parametro paginacion en True.
    if (args.clientes.paginacion !== undefined && args.clientes.paginacion === true) {

        if (args.clientes.pagina_actual === undefined || args.clientes.pagina_actual === '' || args.clientes.pagina_actual === '0' ) {
            res.send(G.utils.r(req.url, 'pagina_actual no están definidas o es cero', 404, {}));
            return;
        }
    }

    if (args.clientes.empresa_id === '' ) {
        res.send(G.utils.r(req.url, 'empresa_id está vacio.', 404, {}));
        return;
    }

    var empresa_id = args.clientes.empresa_id;
    var termino_busqueda = (args.clientes.termino_busqueda === undefined) ? '' : args.clientes.termino_busqueda;
    var paginacion = (args.clientes.paginacion === undefined) ? false : args.clientes.paginacion;
    var pagina_actual = (args.clientes.pagina_actual === undefined) ? '' : args.clientes.pagina_actual;
    
    that.m_clientes.listar_clientes(empresa_id, termino_busqueda, paginacion, pagina_actual, function(err, listado_clientes) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Consultando Clientes', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Listado de Clientes', 200, {listado_clientes: listado_clientes}));
    });

};

Clientes.prototype.listarClientesCiudad = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.clientes === undefined || args.clientes.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id no están definidas.', 404, {}));
        return;
    }

    if (args.clientes.pais_id === undefined || args.clientes.departamento_id === undefined || args.clientes.ciudad_id === undefined) {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id no están definidas.', 404, {}));
        return;
    }

    if (args.clientes.empresa_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id está vacio', 404, {}));
        return;
    }
    if (args.clientes.pais_id === '' || args.clientes.departamento_id === '' || args.clientes.ciudad_id === '') {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id están vacios.', 404, {}));
        return;
    }


    var empresa_id = args.clientes.empresa_id;
    var pais_id = args.clientes.pais_id;
    var departamento_id = args.clientes.departamento_id;
    var ciudad_id = args.clientes.ciudad_id;

    var termino_busqueda = (args.clientes.termino_busqueda === undefined) ? '' : args.clientes.termino_busqueda;

    that.m_clientes.listar_clientes_ciudad(empresa_id, pais_id, departamento_id, ciudad_id, termino_busqueda, function(err, listado_clientes) {
        if (err)
            res.send(G.utils.r(req.url, 'Error consultando clientes', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Lista de clientes', 200, {listado_clientes: listado_clientes}));
    });

};

Clientes.prototype.consultarContratoCliente = function(req, res) {

    var that = this;

    var args = req.body.data;

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

    this.m_clientes.consultar_contrato_cliente(tipo_id_cliente, cliente_id, function(err, contrato_cliente) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Consultando Contrato Clientes', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Consulta de Contrato Clientes Exitosa', 200, {resultado_consulta: contrato_cliente}));
    });

};

Clientes.$inject = ["m_clientes"];

module.exports = Clientes;