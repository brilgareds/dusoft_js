var DepartamentosModel = function() {

};


DepartamentosModel.prototype.listar_departamentos = function(param, callback) {
    var columns = [
        "b.tipo_pais_id as pais_id",
        "b.pais as nombre_pais",
        "a.tipo_dpto_id as departamento_id",
        "a.departamento as nombre_departamento"
    ];
    
    G.knex.column(columns).
    from("tipo_dptos as a").
    innerJoin("tipo_pais as b", "a.tipo_pais_id", "b.tipo_pais_id").
    then(function(listaDepartamentos){
        callback(false, listaDepartamentos);
    }).catch(function(error){
        callback(error);
    }).done();
};


DepartamentosModel.prototype.listar_departamentos_pais = function(pais_id, callback) {

    var columns = [
        "b.tipo_pais_id as pais_id",
        "b.pais as nombre_pais",
        "a.tipo_dpto_id as departamento_id",
        "a.departamento as nombre_departamento"
    ];
    
    G.knex.column(columns).
    from("tipo_dptos as a").
    innerJoin("tipo_pais as b", "a.tipo_pais_id", "b.tipo_pais_id").
    where("b.tipo_pais_id", pais_id).then(function(listaDepartamentos){
        callback(false, listaDepartamentos);
    }).catch(function(error){
        callback(error);
    }).done();
    
};

DepartamentosModel.prototype.seleccionar_departamento = function(departamento_id, pais_id, callback) {


    var sql = " select \
                b.tipo_pais_id as pais_id,\
                b.pais as nombre_pais,\
                a.tipo_dpto_id as departamento_id,\
                a.departamento as nombre_departamento\
                from tipo_dptos a\
                inner join tipo_pais b on a.tipo_pais_id = b.tipo_pais_id \
                where a.tipo_dpto_id = :1  and b.tipo_pais_id = :2 ; ";
    
    G.knex.raw(sql, {1:departamento_id, 2:pais_id}).
    then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};

module.exports = DepartamentosModel;