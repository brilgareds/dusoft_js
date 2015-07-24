var VendedoresModel = function() {

};

/**
 * @api {sql} listar_vendedores Listar Vendedores 
 * @apiName Listar Vendedores
 * @apiGroup Terceros (sql)
 * @apiDescription Lista los vendedores de la empresa.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : 
 *     Accion : 
 * @apiSuccessExample SQL.
 *      Select
 *          a.tipo_id_vendedor,
 *          a.vendedor_id,
 *          a.nombre,
 *          a.telefono
 *          from vnts_vendedores as a
 *          WHERE a.estado = '1'
 */ 
VendedoresModel.prototype.listar_vendedores = function(callback) {
    
    var sql = " select\
                a.tipo_id_vendedor,\
                a.vendedor_id,\
                a.nombre,\
                a.telefono\
                from vnts_vendedores as a\
                WHERE a.estado = '1'";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};



module.exports = VendedoresModel;