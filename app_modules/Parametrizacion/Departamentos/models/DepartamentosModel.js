var DepartamentosModel = function() {

};


DepartamentosModel.prototype.listar_departamentos = function(param, callback) {


    var sql = " select \
                b.tipo_pais_id as pais_id,\
                b.pais as nombre_pais,\
                a.tipo_dpto_id as departamento_id,\
                a.departamento as nombre_departamento,\
                from tipo_dptos a\
                inner join tipo_pais b on a.tipo_pais_id = b.tipo_pais_id ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};


DepartamentosModel.prototype.listar_departamentos_pais = function(pais_id, callback) {


    var sql = " select \
                b.tipo_pais_id as pais_id,\
                b.pais as nombre_pais,\
                a.tipo_dpto_id as departamento_id,\
                a.departamento as nombre_departamento\
                from tipo_dptos a\
                inner join tipo_pais b on a.tipo_pais_id = b.tipo_pais_id \
                where b.tipo_pais_id = $1 ";

    G.db.query(sql, [pais_id], function(err, rows, result) {
        callback(err, rows);
    });
};

DepartamentosModel.prototype.seleccionar_departamento = function(departamento_id, pais_id, callback) {


    var sql = " select \
                b.tipo_pais_id as pais_id,\
                b.pais as nombre_pais,\
                a.tipo_dpto_id as departamento_id,\
                a.departamento as nombre_departamento\
                from tipo_dptos a\
                inner join tipo_pais b on a.tipo_pais_id = b.tipo_pais_id \
                where a.tipo_dpto_id = $1  and b.tipo_pais_id = $2 ; ";

    G.db.query(sql, [departamento_id, pais_id], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = DepartamentosModel;