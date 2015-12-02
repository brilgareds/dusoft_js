var PaisesModel = function() {

};


PaisesModel.prototype.listar_paises = function(callback) {


    var sql = " select \
                tipo_pais_id as pais_id,\
                pais as nombre_pais\
                from tipo_pais ";
    
    G.knex.raw(sql).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

PaisesModel.prototype.seleccionar_pais = function(pais_id, callback) {


    var sql = " select \
                tipo_pais_id as pais_id,\
                pais as nombre_pais\
                from tipo_pais\
                where tipo_pais_id = :1 ; ";

    G.knex.raw(sql, {1:pais_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

module.exports = PaisesModel;