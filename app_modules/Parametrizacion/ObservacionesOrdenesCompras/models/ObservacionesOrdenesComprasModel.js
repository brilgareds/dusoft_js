var ObservacionesOrdenesComprasModel = function() {

};


ObservacionesOrdenesComprasModel.prototype.listar_observaciones = function(termino_busqueda, callback) {


    var sql = " select * from observaciones_ordenes_compras ; ";
    
    G.knex.raw(sql).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

module.exports = ObservacionesOrdenesComprasModel;