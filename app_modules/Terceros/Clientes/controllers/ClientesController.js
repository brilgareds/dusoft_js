
var Clientes = function(clientes) {

    console.log("Modulo Clientes  Cargado ");

    this.m_clientes = clientes;


};

Clientes.prototype.listarClientes = function(req, res) {
    var that = this;

    var args = req.body.data;
   
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

Clientes.prototype.listarClientesCiudad = function(req, res) {
    
    var that = this;

    var args = req.body.data;
   
    if (args.clientes === undefined || args.clientes.empresa_id === undefined || args.clientes.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id o pagina_actual no están definidas.', 404, {}));
        return;
    }
    
    if (args.clientes.pais_id === undefined || args.clientes.departamento_id === undefined || args.clientes.ciudad_id=== undefined) {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id no están definidas.', 404, {}));
        return;
    }
    
    if (args.clientes.empresa_id === '' || args.clientes.pagina_actual === '' || args.clientes.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'empresa_id está vacio o pagina_actual es vacio o 0.', 404, {}));
        return;
    }
    if (args.clientes.pais_id === '' || args.clientes.departamento_id === '' || args.clientes.ciudad_id=== '') {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id están vacios.', 404, {}));
        return;
    }
    

    var empresa_id = args.clientes.empresa_id;
    var pais_id = args.clientes.pais_id;
    var departamento_id = args.clientes.departamento_id;
    var ciudad_id = args.clientes.ciudad_id;
    
    var termino_busqueda = (args.clientes.termino_busqueda === undefined) ? '' : args.clientes.termino_busqueda;
    var pagina_actual = args.clientes.pagina_actual;
    
    that.m_clientes.listar_clientes_ciudad(empresa_id, pais_id, departamento_id, ciudad_id, termino_busqueda, pagina_actual, function(err, listado_clientes) {
        if(err)
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
    
    this.m_clientes.consultar_contrato_cliente( tipo_id_cliente, cliente_id, function(err, contrato_cliente) {
        if(err)
            res.send(G.utils.r(req.url, 'Error Consultando Contrato Clientes', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Consulta de Contrato Clientes Exitosa', 200, {resultado_consulta: contrato_cliente}));
    });
    
};

/* Consultas Paises Depto and Mpio*/

//NOMBRE PAIS
Clientes.prototype.nombrePais = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.pais === undefined || args.pais.tipo_pais_id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_pais_id No Está Definido', 404, {}));
        return;
    }
    
    if (args.pais.tipo_pais_id === '') {
        res.send(G.utils.r(req.url, 'tipo_pais_id Está Vacio', 404, {}));
        return;
    }

    //Parámetro a insertar
    var tipo_pais_id = args.pais.tipo_pais_id;

    that.m_clientes.nombre_pais(tipo_pais_id, function(err, array_nombre_pais) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de País', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta de País Exitosa', 200, {resultado_consulta: array_nombre_pais}));
    });
};

Clientes.prototype.nombreDepartamento = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.departamento === undefined || args.departamento.tipo_pais_id === undefined || args.departamento.tipo_dpto_id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_pais_id o tipo_dpto_id No Están Definidos', 404, {}));
        return;
    }
    
    if (args.departamento.tipo_pais_id === '' || args.departamento.tipo_dpto_id === '') {
        res.send(G.utils.r(req.url, 'tipo_pais_id o tipo_dpto_id Está Vacio', 404, {}));
        return;
    }

    //Parámetro a insertar
    var tipo_pais_id = args.departamento.tipo_pais_id;
    var tipo_dpto_id = args.departamento.tipo_dpto_id;

    that.m_clientes.nombre_departamento(tipo_pais_id, tipo_dpto_id, function(err, array_nombre_departamento) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de Departamento', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta de Departamento Exitosa', 200, {resultado_consulta: array_nombre_departamento}));
    });
};

Clientes.prototype.nombreMunicipio = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.municipio === undefined || args.municipio.tipo_pais_id === undefined || args.municipio.tipo_dpto_id === undefined || args.municipio.tipo_mpio_id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_pais_id, tipo_dpto_id o tipo_mpio_id No Están Definidos', 404, {}));
        return;
    }
    
    if (args.municipio.tipo_pais_id === '' || args.municipio.tipo_dpto_id === '' || args.municipio.tipo_mpio_id === '') {
        res.send(G.utils.r(req.url, 'tipo_pais_id, tipo_dpto_id o tipo_mpio_id Está Vacio', 404, {}));
        return;
    }

    //Parámetro a insertar
    var tipo_pais_id = args.municipio.tipo_pais_id;
    var tipo_dpto_id = args.municipio.tipo_dpto_id;
    var tipo_mpio_id = args.municipio.tipo_mpio_id;

    that.m_clientes.nombre_municipio(tipo_pais_id, tipo_dpto_id, tipo_mpio_id, function(err, array_nombre_municipio) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de Departamento', 500, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Consulta de Departamento Exitosa', 200, {resultado_consulta: array_nombre_municipio}));
    });
};

/* CPDM */


Clientes.$inject = ["m_clientes"];

module.exports = Clientes;