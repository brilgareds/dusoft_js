
var Terceros = function(terceros) {

    console.log("Modulo Terceros  Cargado ");

    this.m_terceros = terceros;
};



/**
* @author Eduar Garcia
* +Descripcion consulta los grupos del chat, permite tener un termino de busqueda
* @params obj: {pagina, termino_busqueda}
* @fecha 2017-03-15
*/
Terceros.prototype.obtenerParametrizacionFormularioTerceros = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.terceros === undefined || args.terceros.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id  no están definidas.', 404, {}));
        return;
    }

    // Autor .  Camilo Orozco
    // Se implementa esta condicion para permitir mostrar los terceros tanto en un select como en una tabla
    // En un select NO se requiere paginacion, mientras que en la tabla si, por lo tanto 
    // cuando se requiere paginar se envia en parametro paginacion en True.
    if (args.terceros.paginacion !== undefined && args.terceros.paginacion === true) {

        if (args.terceros.pagina_actual === undefined || args.terceros.pagina_actual === '' || args.terceros.pagina_actual === '0' ) {
            res.send(G.utils.r(req.url, 'pagina_actual no están definidas o es cero', 404, {}));
            return;
        }
    }

    if (args.terceros.empresa_id === '' ) {
        res.send(G.utils.r(req.url, 'empresa_id está vacio.', 404, {}));
        return;
    }

    var empresa_id = args.terceros.empresa_id;
    var termino_busqueda = (args.terceros.termino_busqueda === undefined) ? '' : args.terceros.termino_busqueda;
    var paginacion = (args.terceros.paginacion === undefined) ? false : args.terceros.paginacion;
    var pagina_actual = (args.terceros.pagina_actual === undefined) ? '' : args.terceros.pagina_actual;
    
    that.m_terceros.listar_terceros(empresa_id, termino_busqueda, paginacion, pagina_actual, function(err, listado_terceros) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Consultando Terceros', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Listado de Terceros', 200, {listado_terceros: listado_terceros}));
    });

};

Terceros.prototype.listarTercerosCiudad = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.terceros === undefined || args.terceros.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id no están definidas.', 404, {}));
        return;
    }

    if (args.terceros.pais_id === undefined || args.terceros.departamento_id === undefined || args.terceros.ciudad_id === undefined) {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id no están definidas.', 404, {}));
        return;
    }

    if (args.terceros.empresa_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id está vacio', 404, {}));
        return;
    }
    if (args.terceros.pais_id === '' || args.terceros.departamento_id === '' || args.terceros.ciudad_id === '') {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id están vacios.', 404, {}));
        return;
    }


    var empresa_id = args.terceros.empresa_id;
    var pais_id = args.terceros.pais_id;
    var departamento_id = args.terceros.departamento_id;
    var ciudad_id = args.terceros.ciudad_id;

    var termino_busqueda = (args.terceros.termino_busqueda === undefined) ? '' : args.terceros.termino_busqueda;

    that.m_terceros.listar_terceros_ciudad(empresa_id, pais_id, departamento_id, ciudad_id, termino_busqueda, function(err, listado_terceros) {
        if (err)
            res.send(G.utils.r(req.url, 'Error consultando terceros', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Lista de terceros', 200, {listado_terceros: listado_terceros}));
    });

};

Terceros.prototype.consultarContratoCliente = function(req, res) {

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

    this.m_terceros.consultar_contrato_cliente(tipo_id_cliente, cliente_id, function(err, contrato_cliente) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Consultando Contrato Terceros', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Consulta de Contrato Terceros Exitosa', 200, {resultado_consulta: contrato_cliente}));
    });

};

Terceros.$inject = ["m_terceros"];

module.exports = Terceros;