var PlanillasFarmaciasModel = function() {

};

/**
 * 
 * @param {type} callback
 * @returns {undefined}
 * @author Cristian Ardila
 * +Descripcion: Metodo que ejecuta el query de la consulta encargada de listar
 * todas las empresas activas
 */
PlanillasFarmaciasModel.prototype.obtenerEmpresasActivas = function(callback) {

    var sql = "SELECT \
               empresa_id, razon_social \
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
PlanillasFarmaciasModel.prototype.obtenerCentrosUtilidades = function(idempresa, callback) {


    var sql = "SELECT \
               a.centro_utilidad, \
               a.descripcion \
               FROM centros_utilidad a \
               INNER JOIN empresas b ON a.empresa_id =  b.empresa_id \
               WHERE a.empresa_id =  $1\
               ORDER BY a.descripcion asc;";


    G.db.query(sql, [idempresa], function(err, rows, result) {
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
PlanillasFarmaciasModel.prototype.obtenerBodegas = function(centros_utilidad, callback) {

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

/**
 * 
 * @param {type} centro_utilidad: centro de utilidad
 * @param {type} callback
 * @returns {undefined}
 * @author Cristian Ardila
 * +Descripcion: Metodo que ejecuta el query de la consulta encargada de listar
 * los productos
 */
PlanillasFarmaciasModel.prototype.obtenerProductos = function(empresaId, centroUtilidad, bodega, descripcion, pagina, codigoProducto, callback) {



var sql = "select \
            d.codigo_producto, \
            d.existencia,  \
            fc_descripcion_producto(d.codigo_producto) as descripcion,\
            e.porc_iva, \
            f.costo, \
            f.precio_venta \
            FROM empresas a  \
            INNER JOIN centros_utilidad b ON a.empresa_id = b.empresa_id \
            INNER JOIN bodegas c ON c.centro_utilidad = b.centro_utilidad AND b.empresa_id = c.empresa_id \
            INNER JOIN existencias_bodegas d ON d.empresa_id = c.empresa_id AND d.centro_utilidad  = c.centro_utilidad AND d.bodega = c.bodega \
            INNER JOIN inventarios_productos e ON e.codigo_producto = d.codigo_producto \
            INNER JOIN inventarios f ON c.empresa_id = f.empresa_id AND f.codigo_producto = e.codigo_producto \
            WHERE a.empresa_id = $1 AND b.centro_utilidad = $2 AND c.bodega = $3 AND a.sw_activa = 1 and e.descripcion ilike $4 AND d.codigo_producto ilike $5 ";

    G.db.paginated(sql, [empresaId, centroUtilidad, bodega, '%' + descripcion + '%', '%' + codigoProducto + '%'], pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });

};



module.exports = PlanillasFarmaciasModel;