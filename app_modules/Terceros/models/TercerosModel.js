var TercerosModel = function() {

};


TercerosModel.prototype.listar_operarios_bodega = function(callback) {

    var sql = "select operario_id, nombre as nombre_operario from operarios_bodega";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });

};




module.exports = TercerosModel;