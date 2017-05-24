var CiudadesModel = function() {

};


CiudadesModel.prototype.listar_ciudades = function(termino_busqueda, callback) {


    var sql = " select \
                c.tipo_pais_id as pais_id,\
                c.pais as nombre_pais,\
                b.tipo_dpto_id as departamento_id,\
                b.departamento as nombre_departamento,\
                a.tipo_mpio_id as id,\
                a.municipio as nombre_ciudad\
                from tipo_mpios a \
                inner join tipo_dptos b on a.tipo_pais_id = b.tipo_pais_id and a.tipo_dpto_id = b.tipo_dpto_id\
                inner join tipo_pais c on b.tipo_pais_id = c.tipo_pais_id \
                where a.municipio "+G.constants.db().LIKE+" :1 ; ";

    G.knex.raw(sql, {1:"%" + termino_busqueda + "%"}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};


CiudadesModel.prototype.listar_ciudades_departamento = function(departamento_id, callback) {

    var columns = [
        "c.tipo_pais_id as pais_id",
        "c.pais as nombre_pais",
        "b.tipo_dpto_id as departamento_id",
        "b.departamento as nombre_departamento",
        "a.tipo_mpio_id as id",
        "a.municipio as nombre_ciudad"
    ];
    
    G.knex.column(columns).
    from("tipo_mpios as a").
    innerJoin("tipo_dptos as b", function(){
        this.on("a.tipo_pais_id", "b.tipo_pais_id").
        on("a.tipo_dpto_id" , "b.tipo_dpto_id");
    }).
    innerJoin("tipo_pais as c", "b.tipo_pais_id", "c.tipo_pais_id").
    where("b.tipo_dpto_id", departamento_id).then(function(listaCiudades){
        callback(false, listaCiudades);
    }).catch(function(error){
        callback(error);
    }).done();
};

CiudadesModel.prototype.listar_ciudades_pais = function(termino_busqueda, pais_id, callback) {


    var sql = " select \
                c.tipo_pais_id as pais_id,\
                c.pais as nombre_pais,\
                b.tipo_dpto_id as departamento_id,\
                b.departamento as nombre_departamento,\
                a.tipo_mpio_id as id,\
                a.municipio as nombre_ciudad\
                from tipo_mpios a \
                inner join tipo_dptos b on a.tipo_pais_id = b.tipo_pais_id and a.tipo_dpto_id = b.tipo_dpto_id\
                inner join tipo_pais c on b.tipo_pais_id = c.tipo_pais_id \
                where c.tipo_pais_id = :1 ";
    
    G.knex.raw(sql, {1:pais_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

CiudadesModel.prototype.seleccionar_ciudad = function(ciudad_id, departamento_id, pais_id, callback) {


    var sql = " select \
                c.tipo_pais_id as pais_id,\
                c.pais as nombre_pais,\
                b.tipo_dpto_id as departamento_id,\
                b.departamento as nombre_departamento,\
                a.tipo_mpio_id as id,\
                a.municipio as nombre_ciudad\
                from tipo_mpios a \
                inner join tipo_dptos b on a.tipo_pais_id = b.tipo_pais_id and a.tipo_dpto_id = b.tipo_dpto_id\
                inner join tipo_pais c on b.tipo_pais_id = c.tipo_pais_id \
                where a.tipo_mpio_id = :1 and b.tipo_dpto_id = :2  and c.tipo_pais_id = :3 ; ";
    
    G.knex.raw(sql, {1:ciudad_id, 2:departamento_id, 3:pais_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

module.exports = CiudadesModel;