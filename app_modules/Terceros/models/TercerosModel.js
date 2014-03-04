var TercerosModel = function() {

};


// Lista los operarios de bodega
TercerosModel.prototype.listar_operarios_bodega = function(callback) {

    var sql = "select operario_id, nombre as nombre_operario, usuario_id from operarios_bodega";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

// Selecciona un operario de bodega, por el ID
TercerosModel.prototype.seleccionar_operario_bodega = function(operario_id, callback) {

    var sql = "select operario_id, nombre as nombre_operario, usuario_id from operarios_bodega where operario_id = $1";

    G.db.query(sql, [operario_id], function(err, rows, result) {
        callback(err, rows);
    });

};


module.exports = TercerosModel;