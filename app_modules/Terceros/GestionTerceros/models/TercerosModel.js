var TercerosModel = function() {

};

/**
 * @api {sql} listar_clientes Listar Clientes 
 * @apiName Listar Clientes
 * @apiGroup Terceros (sql)
 * @apiDescription Lista los clientes de la empresa.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */
TercerosModel.prototype.obtenerParametrizacionFormularioTerceros = function(parametros, callback) {

    
    
};

TercerosModel.prototype.obtenerGeneros = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("genero as a").then(function(generos){
        callback(false, generos);
    }).catch(function(error){
        callback(error);
    }).done();
    
    
};


TercerosModel.prototype.obtenterClientePorId = function(parametros, callback) {

    var sql = " SELECT\
                a.tipo_id_tercero,\
                a.tercero_id,\
                a.direccion,\
                a.telefono,\
                a.email,\
                a.nombre_tercero,\
                a.tipo_bloqueo_id\
                FROM terceros as a\
                LEFT JOIN inv_tipos_bloqueos b ON a.tipo_bloqueo_id = b.tipo_bloqueo_id\
                WHERE \
                    a.tercero_id = :1  AND \
                    a.tipo_id_tercero = :2";
    
    
    var query = G.knex.raw(sql, {1:parametros.tercero_id, 2:parametros.tipo_id_tercero});
    
    query.then(function(resultado){
       callback(false, resultado.rows);
    }).catch(function(err){
         console.log(" err [obtenterClientePorId] ", err);
        callback(err);
    });
    
};

TercerosModel.prototype.listar_clientes_ciudad = function(empresa_id, pais_id, departamento_id, ciudad_id, termino_busqueda, callback) {

    var sql = " a.tipo_id_tercero,\
                a.tercero_id,\
                a.nombre_tercero,\
                g.tipo_pais_id as pais_id,\
                g.pais as nombre_pais,\
                f.tipo_dpto_id as departamento_id,\
                f.departamento as nombre_departamento,\
                e.tipo_mpio_id as ciudad_id,\
                e.municipio as nombre_ciudad,\
                a.direccion,\
                a.telefono,\
                a.email,\
                a.tipo_bloqueo_id,\
                c.descripcion as bloqueo\
                from terceros a\
                inner join terceros_clientes b on a.tipo_id_tercero = b.tipo_id_tercero AND a.tercero_id = b.tercero_id \
                left join inv_tipos_bloqueos c on a.tipo_bloqueo_id = c.tipo_bloqueo_id\
                left join tipo_mpios e on a.tipo_pais_id = e.tipo_pais_id AND a.tipo_dpto_id = e.tipo_dpto_id AND a.tipo_mpio_id = e.tipo_mpio_id\
                left join tipo_dptos f on e.tipo_pais_id = f.tipo_pais_id AND e.tipo_dpto_id = f.tipo_dpto_id \
                left join tipo_pais g on f.tipo_pais_id = g.tipo_pais_id\
                WHERE b.empresa_id = :1 and a.tipo_pais_id = :2  and a.tipo_dpto_id= :3 and a.tipo_mpio_id= :4 and \
                (\
                    a.tipo_id_tercero :: varchar "+G.constants.db().LIKE+" :5 or\
                    a.tercero_id :: varchar "+G.constants.db().LIKE+"  :5 or\
                    a.nombre_tercero :: varchar "+G.constants.db().LIKE+" :5 \
                )\
                ORDER BY a.nombre_tercero ";

    
   G.knex.select(G.knex.raw(sql, {1:empresa_id, 2:pais_id, 3:departamento_id, 4:ciudad_id, 5:"%" + termino_busqueda + "%"})).
   then(function(resultado){
       callback(false, resultado);
   }).catch(function(err){
       callback(err);
   });

};

/**
 * @api {sql} consultar_contrato_cliente Consultar Contrato Cliente
 * @apiName Consultar Contrato Cliente
 * @apiGroup Terceros (sql)
 * @apiDescription Consulta el contrato del cliente.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : 
 *     Accion : 
 * @apiSuccessExample SQL.
 *   SELECT
 */
TercerosModel.prototype.consultar_contrato_cliente = function(tipo_id_cliente, cliente_id, callback) {

    var sql = " SELECT\
                    a.tipo_id_tercero, a.tercero_id, COALESCE(b.contrato_cliente_id, 0) as contrato_cliente_id, COALESCE(b.empresa_id, '0') as empresa_id,\
                    COALESCE(b.estado, '0') as estado\
                FROM terceros a\
                    LEFT JOIN vnts_contratos_clientes b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                WHERE a.tipo_id_tercero = :1 \
                    AND a.tercero_id = :2 ";
    
   G.knex.raw(sql, {1:tipo_id_cliente, 2:cliente_id}).
   then(function(resultado){
       callback(false, resultado.rows, resultado);
   }).catch(function(err){
       callback(err);
   });

};

module.exports = TercerosModel;