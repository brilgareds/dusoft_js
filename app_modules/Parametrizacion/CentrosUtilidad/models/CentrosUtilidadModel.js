var CentrosUtilidadModel = function() {

};


CentrosUtilidadModel.prototype.listar_centros_utilidad_empresa = function(empresa_id, callback) {


    var sql = "SELECT centro_utilidad as centro_utilidad_id, descripcion FROM centros_utilidad WHERE  empresa_id = $1; ";

    G.db.query(sql,[empresa_id] , function(err, rows, result) {
        callback(err, rows, result);
    });
};

CentrosUtilidadModel.prototype.listar_centros_utilidad_ciudad= function(pais_id, departamento_id, ciudad_id, termino_busqueda, callback) {


    var sql = " select \
                a.tipo_pais_id,\
                a.tipo_dpto_id,\
                a.tipo_mpio_id,\
                a.empresa_id,\
                a.centro_utilidad as centro_utilidad_id, \
                a.descripcion,\
                a.ubicacion,\
                a.telefono\
                from centros_utilidad a\
                where a.tipo_pais_id = $1 and a.tipo_dpto_id= $2 and a.tipo_mpio_id= $3 and estado = '1' and a.descripcion ilike $4 ";

    G.db.query(sql,[pais_id, departamento_id, ciudad_id, "%"+termino_busqueda+"%"] , function(err, rows, result) {
        callback(err, rows, result);
    });
};


module.exports = CentrosUtilidadModel;