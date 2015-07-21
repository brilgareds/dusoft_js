var InduccionModel = function() {

};

/**
 * 
 * @param {type} callback
 * @returns {undefined}
 * @author Cristian Ardila
 * +Descripcion: Metodo que ejecuta el query de la consulta encargada de listar
 * todas las empresas activas
 */
InduccionModel.prototype.empresas_activas = function(callback) {

    var sql = "SELECT \
               id,razon_social \
               FROM empresas \
               WHERE sw_activa = 1 \
               ORDER BY razon_social asc;";
  

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });

};

/**
 * 
 * @param {type} id_empresa: identificador de la empresa
 * @param {type} callback
 * @returns {undefined}
 * @author Cristian Ardila
 * +Descripcion: Metodo que ejecuta el query de la consulta encargada de listar
 * todos los centros de utilidades segun la empresa
 */
InduccionModel.prototype.centros_utilidades = function(id_empresa,callback) {
 
    var sql = "SELECT \
               a.centro_utilidad, \
               a.descripcion \
               FROM centros_utilidad a \
               INNER JOIN empresas b ON a.empresa_id =  b.empresa_id \
               WHERE a.empresa_id like  $1\
               ORDER BY a.descripcion asc;";
               

    G.db.query(sql, ["%" + id_empresa + "%"], function(err, rows, result) {
        callback(err, rows);
    });

};

/**
 * 
 * @param {type} centro_utilidad: centro de utilidad
 * @param {type} callback
 * @returns {undefined}
 * @author Cristian Ardila
 * +Descripcion: Metodo que ejecuta el query de la consulta encargada de listar
 * todos las bodegas segun el centro de utilidad
 */
InduccionModel.prototype.bodegas = function(centros_utilidad,callback) {
 
    var sql = "SELECT \
               a.bodega, \
               a.descripcion \
               FROM bodegas a \
               INNER JOIN empresas b ON  a.empresa_id =  b.empresa_id \
               WHERE a.centro_utilidad like  $1;";
               
    G.db.query(sql, ["%" + centros_utilidad + "%"], function(err, rows, result) {
        callback(err, rows);
    });

};
module.exports = InduccionModel;