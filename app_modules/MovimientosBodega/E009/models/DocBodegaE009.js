var DocumentoBodegaE009 = function() {
};

/**
 * @author German Galvis
 * +Descripcion consulta todas las bodegas que pertenezcan a la empresa y la bodega
 * seleccionada
 * @params obj: pedidoId
 * @fecha 2018-02-05
 */
DocumentoBodegaE009.prototype.listarBodegas = function (callback) {
    var query = G.knex
            .select()
            .from('bodegas');
            //.where('bodega','03');
    
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarBodegas]:", err);
        callback(err);
    });
};


//DocumentoBodegaE009.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocumentoBodegaE009;
