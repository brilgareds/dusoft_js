
var Terceros = function(terceros) {

    console.log("Modulo Terceros  Cargado ");

    this.m_terceros = terceros;

};



Terceros.prototype.listarOperariosBodega = function(req, res) {
    var that = this;

    var termino_busqueda = (req.query.termino_busqueda === undefined) ? '' : req.query.termino_busqueda;
    var estado_registro = (req.query.estado_registro === undefined) ? '' : req.query.estado_registro;


    this.m_terceros.listar_operarios_bodega(termino_busqueda, estado_registro, function(err, lista_operarios) {
        res.send(G.utils.r(req.url, 'Lista Operarios Bodega', 200, {lista_operarios: lista_operarios}));
    });
};

Terceros.prototype.crearOperariosBodega = function(req, res) {


    var operario = req.body.operario;

    this.m_terceros.crear_operarios_bodega(operario.nombre_operario, operario.usuario_id, operario.estado, function(err, rows) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Registrando el Operario', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Operario Bodega Registrado Correctamente', 200, {}));

    });
};

Terceros.prototype.modificarOperariosBodega = function(req, res) {

    var operario = req.body.operario;

    this.m_terceros.modificar_operarios_bodega(operario.operario_id, operario.nombre_operario, operario.usuario_id, operario.estado, function(err, rows) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Modificando el Operario', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Operario Bodega Modificado Correctamente', 200, {}));
    });
};


Terceros.$inject = ["m_terceros"];

module.exports = Terceros;