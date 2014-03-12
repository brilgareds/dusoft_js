
var Terceros = function(terceros) {

    console.log("Modulo Terceros  Cargado ");

    this.m_terceros = terceros;

};



Terceros.prototype.listarOperariosBodega = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.lista_operarios === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino_busqueda = (args.lista_operarios.termino_busqueda === undefined) ? '' : args.lista_operarios.termino_busqueda;
    var estado_registro = (args.lista_operarios.estado_registro === undefined) ? '' : args.lista_operarios.estado_registro;


    this.m_terceros.listar_operarios_bodega(termino_busqueda, estado_registro, function(err, lista_operarios) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Listado Los Operarios de Bodega', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Lista Operarios Bodega', 200, {lista_operarios: lista_operarios}));
    });
};

Terceros.prototype.crearOperariosBodega = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.operario === undefined || args.operario.nombre_operario === undefined || args.operario.usuario_id === undefined || args.operario.estado === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.operario.nombre_operario === "" || args.operario.usuario_id === "" || args.operario.estado === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }

    var operario = args.operario;

    this.m_terceros.crear_operarios_bodega(operario.nombre_operario, operario.usuario_id, operario.estado, function(err, rows) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Registrando el Operario', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Operario Bodega Registrado Correctamente', 200, {}));

    });
};

Terceros.prototype.modificarOperariosBodega = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.operario === undefined || args.operario.operario_id === undefined  || args.operario.nombre_operario === undefined || args.operario.usuario_id === undefined || args.operario.estado === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.operario.operario_id === ""  ||args.operario.nombre_operario === "" || args.operario.usuario_id === "" || args.operario.estado === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }
    
    var operario = args.operario;

    this.m_terceros.modificar_operarios_bodega(operario.operario_id, operario.nombre_operario, operario.usuario_id, operario.estado, function(err, rows) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Modificando el Operario', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Operario Bodega Modificado Correctamente', 200, {}));
    });
};


Terceros.$inject = ["m_terceros"];

module.exports = Terceros;