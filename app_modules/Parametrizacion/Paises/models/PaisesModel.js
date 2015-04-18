var PaisesModel = function() {

};


PaisesModel.prototype.listar_paises = function(callback) {


    var sql = " select \
                tipo_pais_id as pais_id,\
                pais as nombre_pais\
                from tipo_pais ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

PaisesModel.prototype.seleccionar_pais = function(pais_id, callback) {


    var sql = " select \
                tipo_pais_id as pais_id,\
                pais as nombre_pais\
                from tipo_pais\
                where tipo_pais_id = $1 ; ";

    G.db.query(sql, [pais_id], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = PaisesModel;