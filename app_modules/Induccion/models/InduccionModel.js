

var InduccionModel = function () {

};
/*
* funcion que realiza consulta a la tabla Empresas
* @param {type} callback
* @returns {datos de consulta}
*/
InduccionModel.prototype.getListarEmpresas = function (callback) {

    var column = [
        "empresa_id",
        "razon_social"
    ];

    G.knex.column(column)
            .select()
            .from('empresas')
            .then(function (rows) {
                callback(false, rows);
            })
            .catch(function (error) {
                callback(error);
            }).done();
};
/*
* funcion que realiza consulta a la tabla centros_utilidad
* @param {type} callback
* @returns {datos de consulta}
*/
InduccionModel.prototype.getListarCentroUtilidad = function (empresaId, callback) {

    var column = [
        "centro_utilidad",
        "descripcion"
    ];

    G.knex.column(column)
            .select()
            .from('centros_utilidad')
            .where('empresa_id', empresaId)//empresaId
            .limit(G.settings.limit)
            .then(function (rows) {
                callback(false, rows);
            })
            .catch(function (error) {
                callback(error);
            }).done();
};
/*
* funcion que realiza consulta a la tabla bodegas
* @param {type} callback
* @returns {datos de consulta}
*/
InduccionModel.prototype.getListarBodega = function (empresaId, centroUtilidadId, callback) {

    var column = [
        "bodega",
        "descripcion"
    ];

    G.knex.column(column)
            .select()
            .from('bodegas')
            .where({'empresa_id': empresaId,
                'centro_utilidad': centroUtilidadId})
            .limit(G.settings.limit)
            .then(function (rows) {
                callback(false, rows);
            })
            .catch(function (error) {
                callback(error);
            }).done();
};
/*
* funcion que realiza consulta a la tabla existencias_bodegas
* @param {type} callback
* @returns {datos de consulta}
*/
InduccionModel.prototype.getListarProducto = function (empresaId, centroUtilidadId, nombreProducto, bodegaId, pagina, callback) {

    var column = [
        "ip.codigo_producto",
        "ip.descripcion"
    ];
    var query = G.knex.column(column)
            .select()
            .from('existencias_bodegas as eb')
            .innerJoin('inventarios_productos as ip', 'eb.codigo_producto', 'ip.codigo_producto')
            .where({"eb.empresa_id": empresaId,
                "eb.centro_utilidad": centroUtilidadId,
                "eb.bodega": bodegaId})
            .where(G.knex.raw("ip.descripcion :: varchar"), G.constants.db().LIKE, "%" + nombreProducto + "%")
            .limit(G.settings.limit)
            .offset((pagina - 1) * G.settings.limit)
            .then(function (rows) {
                callback(false, rows);
            })
            .catch(function (error) {
                callback(error);
            }).done();
};
/*
.limit(G.settings.limit);
 callback(false, query.toSQL());
 */

module.exports = InduccionModel;