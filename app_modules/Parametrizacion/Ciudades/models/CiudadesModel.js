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
                where a.municipio ilike $1 ; ";

    G.db.query(sql, ["%"+termino_busqueda+"%"], function(err, rows, result) {
        callback(err, rows);
    });
};


CiudadesModel.prototype.listar_ciudades_departamento = function(termino_busqueda, departamento_id, callback) {


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
                where b.tipo_dpto_id = $1 ";

    G.db.query(sql, [departamento_id], function(err, rows, result) {
        callback(err, rows);
    });
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
                where c.tipo_pais_id = $1 ";

    G.db.query(sql, [pais_id], function(err, rows, result) {
        callback(err, rows);
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
                where a.tipo_mpio_id = $1 and b.tipo_dpto_id = $2  and c.tipo_pais_id = $3 ; ";

    G.db.query(sql, [ciudad_id, departamento_id, pais_id], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = CiudadesModel;