var MoleculasModel = function() {

};


MoleculasModel.prototype.listar_moleculas = function(termino_busqueda, callback) {

    var sql = " SELECT subclase_id, descripcion AS descripcion_molecula FROM inv_subclases_inventarios WHERE descripcion "+G.constants.db().LIKE+" :1";
    
    G.knex.raw(sql, {1: "%" + termino_busqueda + "%", }).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

module.exports = MoleculasModel;