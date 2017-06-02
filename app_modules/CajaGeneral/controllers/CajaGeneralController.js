var CajaGeneral = function(m_caja_general, m_sincronizacion) {
    this.m_caja_general = m_caja_general;
    this.m_sincronizacion = m_sincronizacion;
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
CajaGeneral.prototype.listarCajaGeneral = function(req, res) {

    var that = this;
    var args = req.body.data;

//    if (args.listar_clientes === undefined || args.listar_clientes.paginaActual === undefined) {
//        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
//        return;
//    }
    console.log("args::: ", args);
    var parametros = {
        usuario_id: args.usuario_id,
        empresa_id: args.empresa_id,
        centro_utilidad: args.centro_utilidad
    };

    G.Q.ninvoke(that.m_caja_general, 'listarCajaGeneral', parametros).then(function(resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'Consulta Caja General', 200, {listarCajaGeneral: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function(err) {
        console.log("Error listarCajaGeneral ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
CajaGeneral.prototype.listarGrupos = function(req, res) {

    var that = this;
    var args = req.body.data;

//    if (args.listar_clientes === undefined || args.listar_clientes.paginaActual === undefined) {
//        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
//        return;
//    }
//    console.log("args::: ", args);
    var parametros = {
        empresa_id: args.empresa_id,
        contado: args.contado,
        credito: args.credito,
        conceptoId: args.concepto_id,
        grupoConcepto: args.grupo_concepto
    };

    G.Q.ninvoke(that.m_caja_general, 'listarGrupos', parametros).then(function(resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listarGrupos: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function(err) {
        console.log("Error listarGrupos ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


CajaGeneral.$inject = ["m_caja_general", "m_sincronizacion", "m_gestion_terceros"];

module.exports = CajaGeneral;