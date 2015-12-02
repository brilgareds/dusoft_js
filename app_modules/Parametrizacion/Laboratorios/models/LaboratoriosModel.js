var LaboratoriosModel = function() {

};


LaboratoriosModel.prototype.listar_laboratorios = function(termino_busqueda, callback) {

    var sql = " SELECT laboratorio_id, descripcion AS descripcion_laboratorio FROM inv_laboratorios WHERE estado = :1";
    
    G.knex.raw(sql, {1:'1'}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

module.exports = LaboratoriosModel;