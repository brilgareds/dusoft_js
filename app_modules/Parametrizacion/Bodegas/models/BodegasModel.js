var EmpresasModel = function() {

};


EmpresasModel.prototype.listar_bodegas_empresa = function(empresa_id, centro_utilidad_id, callback) {

    var sql = "SELECT  bodega as bodega_id, descripcion FROM bodegas WHERE empresa_id = :1 AND centro_utilidad = :2 ; ";
    
    G.knex.raw(sql, {1:empresa_id, 2:centro_utilidad_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};


EmpresasModel.prototype.listar_bodegas_duana_farmacias = function(callback) {

    var sql = "SELECT  bodega as bodega_id, descripcion FROM bodegas WHERE empresa_id in ('03','FD'); ";
    
    G.knex.raw(sql).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

EmpresasModel.prototype.listarBodegasPorTermino = function(termino, callback) {

    var sql = "SELECT  bodega as bodega_id, empresa_id, centro_utilidad, descripcion, ubicacion FROM bodegas WHERE descripcion ILIKE :1 ; ";
    
    G.knex.raw(sql, {1:"%"+termino+"%"}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

module.exports = EmpresasModel;