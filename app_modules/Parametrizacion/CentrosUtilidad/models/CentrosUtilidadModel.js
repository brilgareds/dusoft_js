var CentrosUtilidadModel = function () {

};


CentrosUtilidadModel.prototype.listar_centros_utilidad_empresa = function (empresa_id, callback) {


    var sql = "SELECT centro_utilidad as centro_utilidad_id, descripcion FROM centros_utilidad WHERE  empresa_id = :1; ";

    G.knex.raw(sql, {1: empresa_id}).
            then(function (resultado) {
                callback(false, resultado.rows, resultado);
            }).catch(function (err) {
        callback(err);
    });
};

CentrosUtilidadModel.prototype.listar_centros_utilidad_ciudad = function (obj, callback) {

    var where = "";
    var parametros = {};
    if (obj.estado === '0') {
        where = "where a.tipo_pais_id = :1 and a.tipo_dpto_id= :2 and a.tipo_mpio_id= :3 and estado = '1' and a.descripcion " + G.constants.db().LIKE + " :4 ";
        parametros = {1: obj.pais_id, 2: obj.departamento_id, 3: obj.ciudad_id, 4: "%" + obj.termino_busqueda + "%"};
    } else if(obj.estado === '3'){
        where = "where a.empresa_id in ('FD','99','01') AND a.descripcion " + G.constants.db().LIKE + " :1 ";
        parametros = {1: "%" + obj.termino_busqueda + "%"};
    } else {
        where = "where a.descripcion " + G.constants.db().LIKE + " :1 ";
        parametros = {1: "%" + obj.termino_busqueda + "%"};
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
                from centros_utilidad a " + where;

    var query = G.knex.raw(sql, parametros);

    query.then(function (resultado) {
        callback(false, resultado.rows, resultado);
    }).catch(function (err) {
        console.log("err [listar_centros_utilidad_ciudad]:: ", err)
        callback(err);
    });
};

/**
 *@author German Galvis
 *@fecha  08/05/2019
 *+Descripcion Metodo que contiene el SQL encargado de consultar las farmacias desde planilla
 *             medipol  
 *             
 **/
CentrosUtilidadModel.prototype.listar_centros_utilidad_bodega = function (obj, callback) {

    var where = "";
    var parametros = {};
     if(obj.estado === '3'){
        where = "where a.empresa_id in ('FD','99','01') AND b.estado ='1' AND b.descripcion " + G.constants.db().LIKE + " :1 ";
        parametros = {1: "%" + obj.termino_busqueda + "%"};
    } else {
        where = "where b.estado ='1' and b.descripcion " + G.constants.db().LIKE + " :1 ";
        parametros = {1: "%" + obj.termino_busqueda + "%"};
    }

    var sql = " select \
                a.tipo_pais_id,\
                a.tipo_dpto_id,\
                a.tipo_mpio_id,\
                a.empresa_id,\
                b.centro_utilidad as centro_utilidad_id, \
                b.descripcion,\
                b.bodega,\
                b.ubicacion,\
                a.telefono\
                from centros_utilidad a \
                INNER JOIN bodegas b ON (a.centro_utilidad = b.centro_utilidad and a.empresa_id = b.empresa_id)" + where +" order By b.descripcion ASC";

    var query = G.knex.raw(sql, parametros);

    query.then(function (resultado) {
        callback(false, resultado.rows, resultado);
    }).catch(function (err) {
        console.log("err [listar_centros_utilidad_bodega]:: ", err)
        callback(err);
    });
};

/**
 *@author German Galvis
 *@fecha  29/03/2019
 *+Descripcion Metodo que contiene el SQL encargado de consultar las farmacias de
 *             medipol  
 *             
 **/
CentrosUtilidadModel.prototype.listar_farmacias_medipol = function (obj, callback) {

    var parametros = {};
    
    var sql = " select \
                c.empresa_id,\
                c.centro_utilidad as centro_utilidad_id,\
                b.bodega,\
                b.descripcion\
                from bodegas as b\
                inner join centros_utilidad as c on (b.centro_utilidad = c.centro_utilidad and c.empresa_id = b.empresa_id)\
                where b.empresa_id ='99'  and c.estado = '1' and b.estado = '1' and b.descripcion " + G.constants.db().LIKE + " :4 \
                order By b.descripcion ASC";
//                where b.empresa_id ='99'  and c.tipo_dpto_id= :2 and c.tipo_mpio_id= :3 and c.estado = '1' and b.descripcion " + G.constants.db().LIKE + " :4 ";
//        parametros = {2: obj.departamento_id, 3: obj.ciudad_id, 4: "%" + obj.termino_busqueda + "%"};
        parametros = {4: "%" + obj.termino_busqueda + "%"};
    var query = G.knex.raw(sql, parametros);
    query.then(function (resultado) {
        callback(false, resultado.rows, resultado);
    }).catch(function (err) {
        console.log("err [listar_farmacias_medipol]:: ", err)
        callback(err);
    });
};


module.exports = CentrosUtilidadModel;