var UnidadesNegocioModel = function() {

};


UnidadesNegocioModel.prototype.listar_unidades_negocio = function(termino_busqueda, callback) {


    var sql = "SELECT codigo_unidad_negocio, descripcion, imagen FROM unidades_negocio where estado = '1'; ";
    
    G.knex.raw(sql).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

module.exports = UnidadesNegocioModel;