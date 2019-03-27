var CentrosUtilidadModel = function() {

};


CentrosUtilidadModel.prototype.listar_centros_utilidad_empresa = function(empresa_id, callback) {


    var sql = "SELECT centro_utilidad as centro_utilidad_id, descripcion FROM centros_utilidad WHERE  empresa_id = :1; ";
    
    G.knex.raw(sql, {1:empresa_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

CentrosUtilidadModel.prototype.listar_centros_utilidad_ciudad= function(obj, callback) {
    
    var where = "";
    var parametros = {};
    if(obj.estado === '0'){
        where = "where a.tipo_pais_id = :1 and a.tipo_dpto_id= :2 and a.tipo_mpio_id= :3 and estado = '1' and a.descripcion "+G.constants.db().LIKE+" :4 ";
        parametros = {1:obj.pais_id, 2:obj.departamento_id, 3:obj.ciudad_id, 4:"%"+obj.termino_busqueda+"%"};
    }else{
        where = "where a.descripcion "+G.constants.db().LIKE+" :1 ";
        parametros = {1:"%"+obj.termino_busqueda+"%"};
    }

    var sql = " select \
                a.tipo_pais_id,\
                a.tipo_dpto_id,\
                a.tipo_mpio_id,\
                a.empresa_id,\
                a.centro_utilidad as centro_utilidad_id, \
                a.descripcion,\
                a.ubicacion,\
                a.telefono\
                from centros_utilidad a "+where;

   var query = G.knex.raw(sql, parametros);

            query.then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
        console.log("err [listar_centros_utilidad_ciudad]:: ", err)
       callback(err);
    });
};


module.exports = CentrosUtilidadModel;