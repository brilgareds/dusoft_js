var NovedadesRecepcionMercanciaModel = function() {

};


NovedadesRecepcionMercanciaModel.prototype.listar_novedades_mercancia = function(termino_busqueda, callback) {


    var sql = " select a.id, a.codigo, a.descripcion, a.estado, a.fecha_registro from novedades_recepcion_mercancia a where a.estado='1' ; ";
    
    G.knex.raw(sql).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
        console.log("error listando novedades ", err);
       callback(err);
    });
};

NovedadesRecepcionMercanciaModel.prototype.consultar_novedad_mercancia = function(novedad_id, callback) {

    var sql = " select a.id, a.codigo, a.descripcion, a.estado, a.fecha_registro from novedades_recepcion_mercancia a where id = :1 and a.estado='1' ; ";
    
    G.knex.raw(sql, {1:novedad_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

NovedadesRecepcionMercanciaModel.prototype.insertar_novedad_mercancia = function(codigo, descripcion, usuario_id, callback) {

    var sql = " insert into novedades_recepcion_mercancia (codigo, descripcion, usuario_id)\
                values ( :1, :2, :3 ) ; ";
    
    G.knex.raw(sql, {1:codigo, 2:descripcion, 3:usuario_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

NovedadesRecepcionMercanciaModel.prototype.actualizar_novedad_mercancia = function(novedad_id, descripcion, callback) {

    var sql = " update novedades_recepcion_mercancia set descripcion = :2 where id = :1 ; ";
    
    G.knex.raw(sql, {1:novedad_id, 2:descripcion}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

NovedadesRecepcionMercanciaModel.prototype.inactivar_novedad_mercancia = function(novedad_id, callback) {

    var sql = " update novedades_recepcion_mercancia set estado = '0' where id = :1 ; ";
    
    G.knex.raw(sql, {1:novedad_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

module.exports = NovedadesRecepcionMercanciaModel;