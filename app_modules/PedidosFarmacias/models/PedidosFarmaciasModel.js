var PedidosFarmaciasModel = function() {

};

PedidosFarmaciasModel.prototype.listar_empresas = function(usuario, callback) {

    var sql = " SELECT	b.empresa_id, b.tipo_id_tercero as tipo_identificacion, b.id as identificacion, b.razon_social AS razon_social \
                FROM userpermisos_reportes_gral a \
                inner join empresas b on a.empresa_id = b.empresa_id \
                where a.usuario_id = $1 ";

    G.db.query(sql, [usuario], function(err, rows, result) {
        callback(err, rows);
    });

};

PedidosFarmaciasModel.prototype.listar_farmacias_usuario = function(tipo, usuario, empresa_id, centro_utilidad_id, callback) {

    var sql = "";
    var parametros = "";

    if (tipo === '1') {

        sql = " SELECT\
                a.empresa_id,\
                d.razon_social as nombre_empresa\
                FROM userpermisos_pedidos_farmacia_a_bprincipal AS a\
                JOIN bodegas as b ON (a.empresa_id = b.empresa_id) AND (a.centro_utilidad = b.centro_utilidad) AND (b.estado = '1')\
                JOIN centros_utilidad as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad)\
                JOIN empresas as d ON (c.empresa_id = d.empresa_id) AND (sw_activa = '1')\
                WHERE a.usuario_id = $1 group by 1,2; ";

        parametros = [usuario];
    }

    if (tipo === '2') {

        sql = " SELECT\
                a.centro_utilidad as centro_utilidad_id,\
                c.descripcion as nombre_centro_utilidad\
                FROM userpermisos_pedidos_farmacia_a_bprincipal AS a\
                JOIN bodegas as b ON (a.empresa_id = b.empresa_id) AND (a.centro_utilidad = b.centro_utilidad) AND (b.estado = '1')\
                JOIN centros_utilidad as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad)\
                JOIN empresas as d ON (c.empresa_id = d.empresa_id) AND (sw_activa = '1')\
                WHERE a.usuario_id = $1 and a.empresa_id = $2 group by 1,2 ";

        parametros = [usuario, empresa_id];
    }

    if (tipo === '3') {

        sql = " SELECT\
                b.bodega as bodega_id,\
                b.descripcion as nombre_bodega,\
                a.sw_anular_pedido, a.sw_anular_reserva, a.sw_anular_reserva, a.sw_eliminar_productos, a.sw_modificar_pedido\
                FROM userpermisos_pedidos_farmacia_a_bprincipal AS a\
                JOIN bodegas as b ON (a.empresa_id = b.empresa_id) AND (a.centro_utilidad = b.centro_utilidad) AND (b.estado = '1')\
                JOIN centros_utilidad as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad)\
                JOIN empresas as d ON (c.empresa_id = d.empresa_id) AND (sw_activa = '1')\
                WHERE a.usuario_id = $1 and a.empresa_id = $2 and a.centro_utilidad = $3;  ";

        parametros = [usuario, empresa_id, centro_utilidad_id];
    }


    G.db.query(sql, parametros, function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosFarmaciasModel.prototype.existe_registro_encabezado_temporal = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback)
{
    var sql = "SELECT COUNT(*) FROM solicitud_Bodega_principal_aux WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.existe_registro_detalle_temporal = function(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id, callback)
{
    var sql = "SELECT COUNT(*) FROM solicitud_pro_a_bod_prpal_tmp WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and codigo_producto = $4 and usuario_id = $5";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.listar_detalle_pedido_temporal = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback)
{
    var sql = "SELECT codigo_producto, fc_descripcion_producto(codigo_producto) as descripcion, cantidad_solic::integer as cantidad_solicitada, cantidad_pendiente, tipo_producto as tipo_producto_id\
                FROM solicitud_pro_a_bod_prpal_tmp WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.insertar_pedido_farmacia_temporal = function(empresa_id, centro_utilidad_id, bodega_id, empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, observacion, usuario_id, callback) {

    var sql = " INSERT INTO solicitud_Bodega_principal_aux ( farmacia_id, centro_utilidad, bodega, empresa_destino, centro_destino, bogega_destino, observacion, usuario_id )\
                VALUES( $1,$2,$3,$4,$5,$6,$7, $8);";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, empresa_destino_id, centro_utilidad_destino_id, bodega_destino_id, observacion, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosFarmaciasModel.prototype.insertar_detalle_pedido_farmacia_temporal = function(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, codigo_producto, cantidad_solicitada,  tipo_producto_id, cantidad_pendiente, usuario_id, callback) {

    var sql = " INSERT INTO solicitud_pro_a_bod_prpal_tmp ( soli_a_bod_prpal_tmp_id, farmacia_id, centro_utilidad, bodega, codigo_producto, cantidad_solic, tipo_producto, cantidad_pendiente, usuario_id ) \
                VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 ) ;";

    G.db.query(sql, [numero_pedido, empresa_id, centro_utilidad_id, bodega_id, codigo_producto, cantidad_solicitada,  tipo_producto_id, cantidad_pendiente, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosFarmaciasModel.prototype.eliminar_registro_encabezado_temporal = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback)
{
    var sql = "DELETE FROM solicitud_Bodega_principal_aux WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.eliminar_registro_detalle_temporal = function(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id, callback)
{
    var sql = "DELETE FROM solicitud_pro_a_bod_prpal_tmp WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and codigo_producto = $4 and usuario_id = $5";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, codigo_producto, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.eliminar_detalle_temporal_completo = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback)
{
    var sql = "DELETE FROM solicitud_pro_a_bod_prpal_tmp WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.insertar_pedido_farmacia_definitivo = function(empresa_id, centro_utilidad_id, bodega_id, usuario_id, observacion, tipo_pedido, callback) {
    
    var sql = "INSERT INTO solicitud_productos_a_bodega_principal(farmacia_id, centro_utilidad, bodega, observacion, usuario_id, fecha_registro, empresa_destino, sw_despacho, estado, tipo_pedido) \
                SELECT farmacia_id, centro_utilidad, bodega, $5, usuario_id, CURRENT_TIMESTAMP, empresa_destino, 0, 0, $6 from solicitud_Bodega_principal_aux \
                WHERE farmacia_id = $1 and centro_utilidad = $2 and bodega = $3 and usuario_id = $4 \
                RETURNING solicitud_prod_a_bod_ppal_id";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, usuario_id, observacion, tipo_pedido], function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosFarmaciasModel.prototype.insertar_detalle_pedido_farmacia_definitivo = function(numero_pedido, empresa_id, centro_utilidad_id, bodega_id, usuario_id, callback) {
    
    var sql = "INSERT INTO solicitud_productos_a_bodega_principal_detalle(solicitud_prod_a_bod_ppal_id, farmacia_id, centro_utilidad, bodega, codigo_producto, cantidad_solic, tipo_producto, usuario_id, fecha_registro, sw_pendiente, cantidad_pendiente) \
                SELECT $1, farmacia_id, centro_utilidad, bodega, codigo_producto, cantidad_solic, tipo_producto, usuario_id, CURRENT_TIMESTAMP, 0, cantidad_solic from solicitud_pro_a_bod_prpal_tmp \
                WHERE farmacia_id = $2 and centro_utilidad = $3 and bodega = $4 and usuario_id = $5";

    G.db.query(sql, [numero_pedido, empresa_id, centro_utilidad_id, bodega_id, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosFarmaciasModel.prototype.consultar_encabezado_pedido_final = function(numero_pedido, callback)
{
    var sql = "SELECT farmacia_id, centro_utilidad, bodega, observacion, usuario_id, fecha_registro, empresa_destino, sw_despacho, estado, tipo_pedido\
                FROM solicitud_productos_a_bodega_principal\
                WHERE solicitud_prod_a_bod_ppal_id = $1";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.consultar_detalle_pedido_final = function(numero_pedido, callback)
{
    	
    var sql = "SELECT solicitud_prod_a_bod_ppal_det_id as numero_detalle_pedido, farmacia_id, centro_utilidad, bodega, codigo_producto, fc_descripcion_producto(codigo_producto) as descripcion, cantidad_solic::integer as cantidad_solicitada, tipo_producto, usuario_id, fecha_registro, sw_pendiente, cantidad_pendiente\
                FROM solicitud_productos_a_bodega_principal_detalle\
                WHERE solicitud_prod_a_bod_ppal_id = $1";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.actualizar_cantidades_detalle_pedido_final = function(numero_pedido, numero_detalle_pedido, cantidad_solicitada, cantidad_pendiente, callback)
{    
    G.db.begin(function() {
        
        //Los logs de modificaciones se registran en la misma tabla de registro de los eliminados
        __log_eliminar_producto_detalle_pedido_final(numero_pedido, numero_detalle_pedido, function(err, result) {

            if(err){
                callback(err);
                return;
            }

            __actualizar_cantidades_detalle_pedido_final(numero_pedido, numero_detalle_pedido, cantidad_solicitada, cantidad_pendiente, function(err, rows) {

                if(err){
                    callback(err);
                    return;
                }

                // Finalizar Transacción.
                G.db.commit(function(){
                    callback(err, rows);
                });
            });
        });
     });
};

PedidosFarmaciasModel.prototype.eliminar_producto_detalle_pedido_final = function(numero_pedido, numero_detalle_pedido, callback)
{
    G.db.begin(function() {
        
       __log_eliminar_producto_detalle_pedido_final(numero_pedido, numero_detalle_pedido, function(err, result) {

           if(err){
               callback(err);
               return;
           }

           __eliminar_producto_detalle_pedido_final(numero_pedido, numero_detalle_pedido, function(err, rows) {

               if(err){
                   callback(err);
                   return;
               }

               // Finalizar Transacción.
               G.db.commit(function(){
                   callback(err, rows);
               });
           });
       });
    });
};

function __actualizar_cantidades_detalle_pedido_final(numero_pedido, numero_detalle_pedido, cantidad_solicitada, cantidad_pendiente, callback)
{
    
    var sql = "UPDATE solicitud_productos_a_bodega_principal_detalle\
                SET cantidad_solic = $3, cantidad_pendiente = $4\
                WHERE solicitud_prod_a_bod_ppal_id = $1 and solicitud_prod_a_bod_ppal_det_id = $2";

    G.db.transaction(sql, [numero_pedido, numero_detalle_pedido, cantidad_solicitada, cantidad_pendiente], callback);
};

function __eliminar_producto_detalle_pedido_final(numero_pedido, numero_detalle_pedido, callback) {

    var sql = "DELETE FROM solicitud_productos_a_bodega_principal_detalle\
                WHERE solicitud_prod_a_bod_ppal_id = $1 and solicitud_prod_a_bod_ppal_det_id = $2";

    G.db.transaction(sql, [numero_pedido, numero_detalle_pedido], callback);
};

function __log_eliminar_producto_detalle_pedido_final(numero_pedido, numero_detalle_pedido, callback)
{
    
    var sql = "INSERT INTO log_eliminacion_pedidos_farmacia(pedido_id,farmacia,usuario_solicitud,codigo_producto,cant_solicita,cant_pendiente,usuario_id,fecha_registro,usuario_ejecuta)\
                SELECT a.solicitud_prod_a_bod_ppal_id as pedido_id, b.razon_social as farmacia, c.usuario as usuario_solicitud, a.codigo_producto, a.cantidad_solic as cant_solicita, a.cantidad_pendiente as cant_pendiente, a.usuario_id, CURRENT_TIMESTAMP as fecha_registro, c.nombre as usuario_ejecuta\
                FROM solicitud_productos_a_bodega_principal_detalle a\
                LEFT JOIN empresas b on b.empresa_id = a.farmacia_id\
                LEFT JOIN system_usuarios c on c.usuario_id = a.usuario_id\
                WHERE a.solicitud_prod_a_bod_ppal_id = $1\
                AND a.solicitud_prod_a_bod_ppal_det_id = $2";

    G.db.transaction(sql, [numero_pedido, numero_detalle_pedido], callback);
};

// Listar todos los pedidos de farmacias
PedidosFarmaciasModel.prototype.listar_pedidos_farmacias = function(empresa_id, termino_busqueda, filtro, pagina, callback) {

    /*=========================================================================*/
    // Se implementa este filtro, para poder filtrar los pedidos por el estado actual
    // 0 - No Asignado 
    // 1 - Asignado
    // 2 - Auditado
    // 3 - En Zona Despacho
    // 4 - Despachado
    // 5 - Despachado con Pendientes
    /*=========================================================================*/

    var sql_aux = " ";

    if (filtro !== undefined) {

        if (filtro.no_asignados) {
            sql_aux = " AND a.estado = '0'";
        }

        if (filtro.asignados) {
            sql_aux = " AND a.estado = '1' ";
        }
        if (filtro.auditados) {
            sql_aux = " AND a.estado = '2'  ";
        }

        if (filtro.en_zona_despacho) {
            sql_aux = " AND  a.estado = '3' ";
        }

        if (filtro.despachado) {
            sql_aux = " AND a.estado = '4' ";
        }

        if (filtro.despachado_pendientes) {
            sql_aux = " AND a.estado = '5' ";
        }
    }

    var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido, \
                a.farmacia_id, \
                d.empresa_id, \
                a.centro_utilidad, \
                a.bodega as bodega_id, \
                d.razon_social as nombre_farmacia, \
                b.descripcion as nombre_bodega,\
                a.usuario_id, \
                e.nombre as nombre_usuario ,\
                a.estado as estado_actual_pedido, \
                case when a.estado = 0 then 'No Asignado' \
                     when a.estado = 1 then 'Asignado' \
                     when a.estado = 2 then 'Auditado' \
                     when a.estado = 3 then 'En Despacho' \
                     when a.estado = 4 then 'Despachado' \
                     when a.estado = 5 then 'Despachado con Pendientes' \
                     when a.estado = 6 then 'En Auditoria' end as descripcion_estado_actual_pedido, \
                f.estado as estado_separacion, \
                to_char(a.fecha_registro, 'dd-mm-yyyy') as fecha_registro,\
                c.descripcion as nombre_centro_utilidad,\
                a.empresa_destino as empresa_origen_id,\
                a.observacion\
                from solicitud_productos_a_bodega_principal as a \
                inner join bodegas as b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad as c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas as d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios as e ON a.usuario_id = e.usuario_id \
                left join inv_bodegas_movimiento_tmp_despachos_farmacias f on a.solicitud_prod_a_bod_ppal_id = f.solicitud_prod_a_bod_ppal_id  \
                where a.farmacia_id = $1 " + sql_aux + "\
                and ( a.solicitud_prod_a_bod_ppal_id ilike $2 \
                      or d.razon_social ilike $2 \
                      or b.descripcion ilike $2 \
                      or e.nombre ilike $2 ) \
                order by 1 desc ";

    G.db.pagination(sql, [empresa_id, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });
};


// Seleccionar Pedido Por un numero de pedido
PedidosFarmaciasModel.prototype.consultar_pedido = function(numero_pedido, callback) {

    var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido, \
                a.farmacia_id, \
                d.empresa_id, \
                a.centro_utilidad, \
                a.bodega as bodega_id, \
                d.razon_social as nombre_farmacia, \
                b.descripcion as nombre_bodega,\
                a.usuario_id, \
                e.nombre as nombre_usuario ,\
                a.estado as estado_actual_pedido, \
                case when a.estado = 0 then 'No Asignado' \
                     when a.estado = 1 then 'Asignado' \
                     when a.estado = 2 then 'Auditado' \
                     when a.estado = 3 then 'En Despacho' \
                     when a.estado = 4 then 'Despachado' \
                     when a.estado = 5 then 'Despachado con Pendientes' \
                     when a.estado = 6 then 'En Auditoria' end as descripcion_estado_actual_pedido, \
                f.estado as estado_separacion, \
                to_char(a.fecha_registro, 'dd-mm-yyyy HH24:MI:SS.MS') as fecha_registro \
                from solicitud_productos_a_bodega_principal as a \
                inner join bodegas as b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad as c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas as d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios as e ON a.usuario_id = e.usuario_id \
                left join inv_bodegas_movimiento_tmp_despachos_farmacias f on a.solicitud_prod_a_bod_ppal_id = f.solicitud_prod_a_bod_ppal_id \
                where a.solicitud_prod_a_bod_ppal_id = $1 \
                order by 1 desc";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.consultar_detalle_pedido = function(numero_pedido, callback) {

    var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                a.cantidad_solic::integer as cantidad_solicitada,\
                ABS((a.cantidad_solic - a.cantidad_pendiente - COALESCE(b.cantidad_temporalmente_separada,0))::integer) as cantidad_despachada,\
                (a.cantidad_solic - ABS((a.cantidad_solic - a.cantidad_pendiente - COALESCE(b.cantidad_temporalmente_separada,0))::integer))::integer as cantidad_pendiente,\
                a.cantidad_pendiente as cantidad_pendiente_real,\
                f.costo as valor_unitario,\
                c.porc_iva as porcentaje_iva,\
                (f.costo+(f.costo*(c.porc_iva/100)))as valor_unitario_con_iva,\
                (a.cantidad_solic*(f.costo*(c.porc_iva/100))) as valor_iva,\
                COALESCE(b.justificacion, '') as justificacion, \
                COALESCE(b.justificacion_auditor, '') as justificacion_auditor, \
                COALESCE(b.lote, '') as lote,\
                b.fecha_vencimiento,\
                b.item_id,\
                b.tipo_estado_auditoria,\
                b.cantidad_ingresada,\
                COALESCE(b.auditado, '0') as auditado\
                from solicitud_productos_a_bodega_principal_detalle a\
                inner join solicitud_productos_a_bodega_principal g on a.solicitud_prod_a_bod_ppal_id = g.solicitud_prod_a_bod_ppal_id\
                inner join inventarios f on a.codigo_producto = f.codigo_producto and g.empresa_destino = f.empresa_id\
                inner join inventarios_productos c on f.codigo_producto = c.codigo_producto \
                inner join inv_clases_inventarios e on c.grupo_id = e.grupo_id and c.clase_id = e.clase_id \
                left join (\
                    SELECT a.numero_pedido, a.codigo_producto, a.justificacion, a.justificacion_auditor, sum(a.cantidad_temporalmente_separada) as cantidad_temporalmente_separada, a.lote, a.fecha_vencimiento, a.item_id, a.tipo_estado_auditoria, a.cantidad_ingresada, a.auditado \
                    FROM ( \
                      select a.solicitud_prod_a_bod_ppal_id as numero_pedido, b.codigo_producto, c.observacion as justificacion, c.justificacion_auditor, SUM(b.cantidad) as cantidad_temporalmente_separada, b.lote, to_char(b.fecha_vencimiento, 'dd-mm-yyyy') as fecha_vencimiento, b.item_id, '2' as tipo_estado_auditoria, b.cantidad :: integer as cantidad_ingresada, b.auditado\
                      from inv_bodegas_movimiento_tmp_despachos_farmacias a\
                      inner join inv_bodegas_movimiento_tmp_d b on a.usuario_id = b.usuario_id and a.doc_tmp_id = b.doc_tmp_id\
                      left join inv_bodegas_movimiento_tmp_justificaciones_pendientes c on b.doc_tmp_id = c.doc_tmp_id and b.usuario_id = c.usuario_id and b.codigo_producto = c.codigo_producto\
                      group by 1,2,3,4,6,7, 8,9, 10, 11\
                      UNION\
                      select a.solicitud_prod_a_bod_ppal_id  as numero_pedido, b.codigo_producto, b.observacion as justificacion, b.justificacion_auditor, 0 as cantidad_temporalmente_separada, '' as lote, null as fecha_vencimiento,  0 as item_id, '3' as tipo_estado_auditoria, 0 as cantidad_ingresada, '0' as auditado\
                      from inv_bodegas_movimiento_tmp_despachos_farmacias a \
                      left join inv_bodegas_movimiento_tmp_justificaciones_pendientes b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                       and b.codigo_producto not in(\
                            select aa.codigo_producto from inv_bodegas_movimiento_tmp_d aa where aa.doc_tmp_id = b.doc_tmp_id and aa.usuario_id = b.usuario_id\
                       )\
                    ) a group by 1,2,3,4, 6, 7, 8,9, 10, 11\
                ) as b on a.solicitud_prod_a_bod_ppal_id = b.numero_pedido and a.codigo_producto = b.codigo_producto\
                where a.solicitud_prod_a_bod_ppal_id= $1 order by e.descripcion ; ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });

};

PedidosFarmaciasModel.prototype.listar_pedidos_del_operario = function(responsable, termino_busqueda, filtro, pagina, limite, callback) {

    var sql_aux = " ";

    /*=========================================================================*/
    // Se implementa este filtro, para poder filtrar los pedidos del clientes 
    // asignados al operario de bodega y saber si el pedido tiene temporales o 
    // fue finalizado correctamente.
    /*=========================================================================*/

    if (filtro !== undefined) {

        if (filtro.asignados) {
            sql_aux = " AND h.doc_tmp_id IS NULL ";
        }

        if (filtro.temporales) {
            sql_aux = " AND h.doc_tmp_id IS NOT NULL AND h.estado = '0' ";
        }
        if (filtro.finalizados) {
            sql_aux = " AND h.estado = '1' ";
        }
    }

    var sql = " select \
                h.doc_tmp_id as documento_temporal_id,\
                h.usuario_id,\
                a.solicitud_prod_a_bod_ppal_id as numero_pedido, \
                a.farmacia_id, \
                d.empresa_id, \
                a.centro_utilidad, \
                a.bodega as bodega_id, \
                d.razon_social as nombre_farmacia, \
                b.descripcion as nombre_bodega,\
                a.usuario_id, \
                e.nombre as nombre_usuario ,\
                a.estado as estado_actual_pedido, \
                case when a.estado = 0 then 'No Asignado' \
                     when a.estado = 1 then 'Asignado' \
                     when a.estado = 2 then 'Auditado' \
                     when a.estado = 3 then 'En Despacho' \
                     when a.estado = 4 then 'Despachado' \
                     when a.estado = 5 then 'Despachado con Pendientes' \
                     when a.estado = 6 then 'En Auditoria' end as descripcion_estado_actual_pedido, \
                h.estado as estado_separacion,     \
                case when h.estado = '0' then 'Separacion en Proceso' \
                     when h.estado = '1' then 'Separacion Finalizada' \
                     when h.estado = '2' then 'En Auditoria' end as descripcion_estado_separacion, \
                a.fecha_registro::date as fecha_registro, \
                f.responsable_id,\
                g.nombre as responsable_pedido,\
                f.fecha as fecha_asignacion_pedido, \
                i.fecha_registro as fecha_separacion_pedido  \
                from solicitud_productos_a_bodega_principal a \
                inner join bodegas b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios e ON a.usuario_id = e.usuario_id \
                inner join solicitud_productos_a_bodega_principal_estado f on a.solicitud_prod_a_bod_ppal_id = f.solicitud_prod_a_bod_ppal_id and a.estado = f.estado\
                inner join operarios_bodega g on f.responsable_id = g.operario_id\
                left join inv_bodegas_movimiento_tmp_despachos_farmacias h on a.solicitud_prod_a_bod_ppal_id = h.solicitud_prod_a_bod_ppal_id \
                left join inv_bodegas_movimiento_tmp i on h.doc_tmp_id = i.doc_tmp_id and h.usuario_id = i.usuario_id \
                where g.usuario_id = $1 " + sql_aux + " \
                and a.estado = '1' AND a.sw_despacho = 0 \
                and (\
                    a.solicitud_prod_a_bod_ppal_id ilike $2 or\
                    d.razon_social ilike  $2 or\
                    b.descripcion ilike $2 or\
                    e.nombre  ilike $2 \
                ) order by f.fecha asc ";
    
    //La clausula AND a.sw_despacho = 0 en la consulta SQL, se agrega temporalemente mientras se corrgigen los estados de los pedidos
    //esta clausula permite determinar si un pedido esta pendiente por despachaar (0) o despachado (1)

    G.db.pagination(sql, [responsable, "%" + termino_busqueda + "%"], pagina, limite, function(err, rows, result, total_records) {

        callback(err, rows, total_records);
    });
};

// Asigancion de responsable al pedido 
PedidosFarmaciasModel.prototype.asignar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var that = this;

    // Validar si existen responsables asigandos
    var sql = " SELECT * FROM solicitud_productos_a_bodega_principal_estado a WHERE a.solicitud_prod_a_bod_ppal_id = $1 AND a.estado = $2 ;";

    G.db.query(sql, [numero_pedido, estado_pedido], function(err, responsable_estado_pedido, result) {
        if (responsable_estado_pedido.length > 0) {
            //Actualizar
            that.actualizar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                // Actualizar Estado Actual del Pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows, responsable_estado_pedido);
                    return;
                });
            });
        } else {
            // Asignar
            that.insertar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                // Actualizar Estado Actual del Pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows, responsable_estado_pedido);
                    return;
                });
            });
        }
    });
};


//  Almacenar responsable al pedido 
PedidosFarmaciasModel.prototype.insertar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var sql = "INSERT INTO solicitud_productos_a_bodega_principal_estado( solicitud_prod_a_bod_ppal_id, estado, responsable_id, fecha, usuario_id) " +
            "VALUES ($1, $2, $3, now(), $4);";

    G.db.query(sql, [numero_pedido, estado_pedido, responsable, usuario], function(err, rows, result) {
        callback(err, rows);
    });
};

// actualizacion del responsable del pedido
PedidosFarmaciasModel.prototype.actualizar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var sql = "UPDATE solicitud_productos_a_bodega_principal_estado SET responsable_id=$3, fecha=NOW(), usuario_id=$4 " +
            "WHERE solicitud_prod_a_bod_ppal_id=$1 AND estado=$2;";

    G.db.query(sql, [numero_pedido, estado_pedido, responsable, usuario], function(err, rows, result) {
        callback(err, rows);
    });
};


// actualizacion el estado actual del pedido
PedidosFarmaciasModel.prototype.actualizar_estado_actual_pedido = function(numero_pedido, estado_pedido, callback) {

    var sql = "UPDATE solicitud_productos_a_bodega_principal SET estado=$2 WHERE solicitud_prod_a_bod_ppal_id=$1;";

    G.db.query(sql, [numero_pedido, estado_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};


// lista todos los responsables del pedido
PedidosFarmaciasModel.prototype.obtener_responsables_del_pedido = function(numero_pedido, callback) {

    var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,  \
                a.estado,\
                case when a.estado=0 then 'Registrado'\
                     when a.estado=1 then 'Asignado'\
                     when a.estado=2 then 'Auditado'\
                     when a.estado=3 then 'En Despacho' \
                     when a.estado=4 then 'Despachado' \
                     when a.estado=5 then 'Despachado con Pendientes' \
                     when a.estado=6 then 'En Auditoria' end as descripcion_estado,\
                b.operario_id,\
                b.nombre as nombre_responsable,\
                b.usuario_id as usuario_id_responsable,\
                a.usuario_id,\
                c.nombre as nombre_usuario,\
                a.fecha as fecha_asignacion,\
                a.fecha_registro    \
                from solicitud_productos_a_bodega_principal_estado a \
                inner join system_usuarios c on a.usuario_id = c.usuario_id\
                left join operarios_bodega b on a.responsable_id = b.operario_id\
                where a.solicitud_prod_a_bod_ppal_id=$1 ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};

// Pedidos en Donde esta pendiente por entregar el Producto
PedidosFarmaciasModel.prototype.listar_pedidos_pendientes_by_producto = function(empresa, codigo_producto, callback) {

    var sql = " select \
                a.farmacia_id,\
                c.razon_social,\
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                b.cantidad_solic as cantidad_solicitada,\
                b.cantidad_pendiente,\
                d.usuario_id,\
                d.usuario,\
                a.fecha_registro \
                from solicitud_productos_a_bodega_principal a \
                inner join solicitud_productos_a_bodega_principal_detalle b on a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id\
                inner join empresas c on a.farmacia_id = c.empresa_id\
                inner join system_usuarios d on a.usuario_id = d.usuario_id \
                where a.empresa_destino = $1 and b.codigo_producto = $2 and b.cantidad_pendiente > 0 ; ";

    var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                a.cantidad_pendiente,\
                a.cantidad_solicitada,\
                a.farmacia_id,\
                b.razon_social,\
                a.usuario_id,\
                c.usuario,\n\
                a.fecha_registro \
                from \
                (  \
                  select \
                  a.solicitud_prod_a_bod_ppal_id,\
                  a.cantidad_solic as cantidad_pendiente,\
                  a.cantidad_solic as cantidad_solicitada,\
                  a.farmacia_id,\
                  b.usuario_id,\n\
                  b.fecha_registro   \
                  from solicitud_productos_a_bodega_principal_detalle a \
                  inner join solicitud_productos_a_bodega_principal b on a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id\
                  where b.empresa_destino = $1 and a.codigo_producto= $2 and b.sw_despacho = '0'  \
                  union  \
                  select \
                  a.solicitud_prod_a_bod_ppal_id,\
                  c.cantidad_pendiente,\
                  c.cantidad_solicitad as cantidad_solicitada,\
                  c.farmacia_id,\
                  b.usuario_id,\n\
                  b.fecha_registro  \
                  from solicitud_productos_a_bodega_principal_detalle a \
                  inner join solicitud_productos_a_bodega_principal b on a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id\
                  inner join inv_mov_pendientes_solicitudes_frm c on a.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id and a.solicitud_prod_a_bod_ppal_det_id = c.solicitud_prod_a_bod_ppal_det_id\
                  where b.empresa_destino = $1 and a.codigo_producto = $2 and b.sw_despacho = '1'\
                ) as a \
                inner join empresas b on a.farmacia_id = b.empresa_id\
                inner join system_usuarios c on a.usuario_id = c.usuario_id";

    G.db.query(sql, [empresa, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });

};


// Autor:      : Camilo Orozco 
// Descripcion : Calcula la cantidad TOTAL pendiente de un producto en pedidos farmacia
// Calls       : PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();
//               

PedidosFarmaciasModel.prototype.calcular_cantidad_total_pendiente_producto = function(empresa_id, codigo_producto, callback) {
    
    var sql = " select b.codigo_producto, SUM( b.cantidad_pendiente) AS cantidad_total_pendiente\
                from solicitud_productos_a_bodega_principal a \
                inner join solicitud_productos_a_bodega_principal_detalle b ON a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id    \
                where a.empresa_destino = $1 and b.codigo_producto = $2 and b.cantidad_pendiente > 0 \
                group by 1";
    
    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};


module.exports = PedidosFarmaciasModel;