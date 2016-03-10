var CronjobModel = function() {
    console.log("cronjob model >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
};

CronjobModel.prototype.obtenerRolesPorId = function(ids, callback) {

    ids = ids.join(",");
    var sql = "SELECT * FROM roles WHERE id in( :1 ) ";
    
    G.knex.raw(sql, {1:ids}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

CronjobModel.prototype.obtenerCronJobPorNombre = function(obj, callback) {
    var sql = "SELECT  * FROM cronjobs WHERE nombre = :1 AND estado <> '1'";
    
    G.knex.raw(sql, {1:obj.nombre}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

CronjobModel.prototype.actualizarEstado = function(obj, callback) {
    var sql = "UPDATE cronjobs  SET estado = :1 WHERE nombre = :2";
    
    G.knex.raw(sql, {1:obj.estado, 2:obj.nombre}).then(function(resultado){
        callback(false, resultado);

    }).catch(function(err){
        callback(err);
    });
};

CronjobModel.prototype.obtenerEstadoCronjob = function(obj, callback){
    var that = this;
     G.Q.ninvoke(that,'obtenerCronJobPorNombre', {nombre : obj.nombre}).then(function(resultado){
        var def = G.Q.defer();
        if(resultado.length > 0){
            return G.Q.ninvoke(that,'actualizarEstado', {estado : '1', nombre:obj.nombre});
        } else {
            def.resolve();
        }
         
     }).then(function(resultado){
         callback(false, resultado);
     }).fail(function(err){
         callback(err);
     }).done();
}; 


module.exports = CronjobModel;