var ClientesModel = function() {

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
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : 
 *     Accion : 
 * @apiSuccessExample SQL.
 *   SELECT
 *       a.tipo_id_tercero,
 *       a.tercero_id,
 *       a.direccion,
 *       a.telefono,
 *       a.email,
 *       a.nombre_tercero,
 *       a.tipo_bloqueo_id,
 *       c.descripcion as bloqueo,
 *       COALESCE(d.tipo_id_tercero,'0') as contrato_cliente_id,
 *       g.pais,
 *       f.departamento,
 *       municipio
 *       FROM
 *       terceros as a
 *       JOIN terceros_clientes as b ON (a.tipo_id_tercero = b.tipo_id_tercero)
 *       AND (a.tercero_id = b.tercero_id)
 *       AND (b.empresa_id = $1)
 *       LEFT JOIN inv_tipos_bloqueos as c ON (a.tipo_bloqueo_id = c.tipo_bloqueo_id)
 *       LEFT JOIN vnts_contratos_clientes as d ON (a.tipo_id_tercero = d.tipo_id_tercero)
 *       AND (a.tercero_id = d.tercero_id)
 *       AND (d.empresa_id = $1)
 *       AND (d.estado = '1')
 *       LEFT JOIN tipo_mpios as e ON (a.tipo_pais_id = e.tipo_pais_id)
 *       AND (a.tipo_dpto_id = e.tipo_dpto_id)
 *       AND (a.tipo_mpio_id = e.tipo_mpio_id)
 *       LEFT JOIN tipo_dptos as f ON (e.tipo_pais_id = f.tipo_pais_id)
 *       AND (e.tipo_dpto_id = f.tipo_dpto_id)
 *       LEFT JOIN tipo_pais as g ON (f.tipo_pais_id = g.tipo_pais_id)
 *       WHERE a.tercero_id ilike $2
 *       or a.nombre_tercero ilike $2;
 */ 
ClientesModel.prototype.listar_clientes = function(empresa_id, termino_busqueda, pagina, callback) {

    var sql = "SELECT\
                    a.tipo_id_tercero,\
                    a.tercero_id,\
                    a.direccion,\
                    a.telefono,\
                    a.email,\
                    a.nombre_tercero,\
                    a.tipo_bloqueo_id,\
                    c.descripcion as bloqueo,\
                    COALESCE(d.contrato_cliente_id,0) as contrato_cliente_id,\
                    g.pais,\
                    f.departamento,\
                    e.municipio,\
                    d.estado as estado_contrato,\
                    case when fecha_final >= CURRENT_TIMESTAMP\
                        THEN true\
                        ELSE false\
                    END as contrato_vigente\
		FROM\
                    terceros as a\
                    JOIN terceros_clientes as b ON (a.tipo_id_tercero = b.tipo_id_tercero)\
                        AND (a.tercero_id = b.tercero_id)\
                        AND (b.empresa_id = $1)\
                    LEFT JOIN inv_tipos_bloqueos as c ON (a.tipo_bloqueo_id = c.tipo_bloqueo_id)\
                    LEFT JOIN vnts_contratos_clientes as d ON (a.tipo_id_tercero = d.tipo_id_tercero)\
                        AND (a.tercero_id = d.tercero_id)\
                        AND (d.empresa_id = $1)\
                        /*AND (d.estado = '1')*/\
                    LEFT JOIN tipo_mpios as e ON (a.tipo_pais_id = e.tipo_pais_id)\
                        AND (a.tipo_dpto_id = e.tipo_dpto_id)\
                        AND (a.tipo_mpio_id = e.tipo_mpio_id)\
                    LEFT JOIN tipo_dptos as f ON (e.tipo_pais_id = f.tipo_pais_id)\
                        AND (e.tipo_dpto_id = f.tipo_dpto_id)\
                    LEFT JOIN tipo_pais as g ON (f.tipo_pais_id = g.tipo_pais_id)\
                WHERE a.tipo_bloqueo_id = 1\
                    AND (a.tercero_id ilike $2 OR a.nombre_tercero ilike $2)";

    G.db.pagination(sql, [empresa_id,"%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows);
    });
    
};

ClientesModel.prototype.listar_clientes_ciudad = function(empresa_id, pais_id, departamento_id, ciudad_id, termino_busqueda, callback) {

    var sql = " select\
                a.tipo_id_tercero,\
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
                WHERE b.empresa_id = $1 and a.tipo_pais_id = $2  and a.tipo_dpto_id= $3 and a.tipo_mpio_id= $4 and \
                (\
                    a.tipo_id_tercero ILIKE $5 or\
                    a.tercero_id ILIKE $5 or\
                    a.nombre_tercero ILIKE $5 \
                )\
                ORDER BY a.nombre_tercero ";

    G.db.query(sql, [empresa_id, pais_id, departamento_id, ciudad_id, "%" + termino_busqueda + "%"], function(err, rows, result, total_records) {
        callback(err, rows);
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
ClientesModel.prototype.consultar_contrato_cliente = function(tipo_id_cliente, cliente_id, callback) {

    var sql = " SELECT\
                    a.tipo_id_tercero, a.tercero_id, COALESCE(b.contrato_cliente_id, 0) as contrato_cliente_id, COALESCE(b.empresa_id, '0') as empresa_id,\
                    COALESCE(b.estado, '0') as estado\
                FROM terceros a\
                    LEFT JOIN vnts_contratos_clientes b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                WHERE a.tipo_id_tercero = $1\
                    AND a.tercero_id = $2 ";

    G.db.query(sql, [tipo_id_cliente, cliente_id], function(err, rows, result) {
        callback(err, rows, result);
    });
    
};

module.exports = ClientesModel;