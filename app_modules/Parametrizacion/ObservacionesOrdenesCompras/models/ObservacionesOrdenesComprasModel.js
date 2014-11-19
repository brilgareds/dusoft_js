var ObservacionesOrdenesComprasModel = function() {

};


ObservacionesOrdenesComprasModel.prototype.listar_observaciones = function(termino_busqueda, callback) {


    var sql = " select * from observaciones_ordenes_compras ; ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = ObservacionesOrdenesComprasModel;