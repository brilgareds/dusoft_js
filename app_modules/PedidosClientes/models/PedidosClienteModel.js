var PedidosClienteModel = function(productos) {

    // Temporalmente
    this.m_productos = productos;
};

/**
 * @api {sql} listar_pedidos_clientes Pedidos Clientes 
 * @apiName Pedidos Clientes
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Lista todos los pedidos realizados a clientes.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {String} empresa_id Identificador de la Empresa que realizó el pedido
 * @apiParam {String} termino_busqueda Termino por el cual desea filtrar lo pedidos.
 *                    Se puede filtrar por:
 *                    numero del pedido
 *                    identificacion del tercero
 *                    nombre del tercero
 *                    direccion
 *                    telefono
 *                    identificacion del vendedor
 *                    nombre del vendedor.
 *                      
 * @apiParam {Number} pagina Numero de la pagina, actualmente se traen 1000 registros por pagina (Cambiar en configuraciones de empresa)
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Controller - listarPedidosClientes();
 * @apiSuccessExample SQL.
 *          select 
 a.pedido_cliente_id as numero_pedido, 
 b.tipo_id_tercero as tipo_id_cliente, 
 b.tercero_id as identificacion_cliente, 
 b.nombre_tercero as nombre_cliente, 
 b.direccion as direccion_cliente, 
 b.telefono as telefono_cliente, 
 c.tipo_id_vendedor, 
 c.vendedor_id as idetificacion_vendedor, 
 c.nombre as nombre_vendedor, 
 a.estado, 
 case when a.estado = 0 then 'Inactivo ' 
 when a.estado = 1 then 'Activo' 
 when a.estado = 2 then 'Anulado' 
 when a.estado = 3 then 'Entregado' end as descripcion_estado, 
 a.estado_pedido as estado_actual_pedido, 
 case when a.estado_pedido = 0 then 'No Asignado' 
 when a.estado_pedido = 1 then 'Asignado' 
 when a.estado_pedido = 2 then 'Auditado' 
 when a.estado_pedido = 3 then 'En Despacho' 
 when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, 
 a.fecha_registro 
 from ventas_ordenes_pedidos a 
 inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id 
 inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id 
 where a.empresa_id = $1 
 and (   a.pedido_cliente_id ilike $2  
 or b.tercero_id ilike $2 
 or b.nombre_tercero ilike $2 
 or b.direccion ilike $2  
 or b.telefono ilike $2   
 or c.vendedor_id ilike $2 
 or c.nombre ilike $2) 
 AND (a.estado IN ('0','1','2','3')) order by 1 desc  limit $3 offset $4
 *      
 */

PedidosClienteModel.prototype.listar_pedidos_clientes = function(empresa_id, termino_busqueda, filtro, pagina, callback) {


    /*=========================================================================*/
    // Se implementa este filtro, para poder filtrar los pedidos por el estado actual
    // 0 - No Asignado 
    // 1 - Asignado
    // 2 - Auditado
    // 3 - En Zona Despacho
    // 4 - Despachado
    // 5 - Despachado con Pendientes
    // 6 - separacion finalizada
    // 7 - En Auditoria
    // 8 - Auditado con Pdtes
    // 9 - En Zona con Pdtes
    /*=========================================================================*/

    var sql_aux = " ";

    if (filtro !== undefined) {

        if (filtro.no_asignados) {
            sql_aux = " AND a.estado_pedido = '0' ";
        }

        if (filtro.asignados) {
            sql_aux = " AND a.estado_pedido = '1' ";
        }
        if (filtro.auditados) {
            sql_aux = " AND a.estado_pedido = '2'  ";
        }

        if (filtro.en_zona_despacho) {
            sql_aux = " AND  a.estado_pedido = '3' ";
        }

        if (filtro.despachado) {
            sql_aux = " AND a.estado_pedido = '4' ";
        }

        if (filtro.despachado_pendientes) {
            sql_aux = " AND a.estado_pedido = '5' ";
        }

        if (filtro.separacion_finalizada) {
            sql_aux = " AND a.estado_pedido = '6' ";
        }

        if (filtro.en_auditoria) {
            sql_aux = " AND a.estado_pedido = '7' ";
        }
        
        if (filtro.auditados_pdtes) {
            sql_aux = " AND a.estado_pedido = '8' ";
        }
        
        if (filtro.en_zona_despacho_pdtes) {
            sql_aux = " AND a.estado_pedido = '9' ";
        }
    }

    var sql = " select \
                a.pedido_cliente_id as numero_pedido, \
                b.tipo_id_tercero as tipo_id_cliente, \
                b.tercero_id as identificacion_cliente, \
                b.nombre_tercero as nombre_cliente, \
                b.direccion as direccion_cliente, \
                b.telefono as telefono_cliente, \
                c.tipo_id_vendedor, \
                c.vendedor_id as idetificacion_vendedor, \
                c.nombre as nombre_vendedor, \
                a.estado, \
                case when a.estado = 0 then 'Inactivo ' \
                when a.estado = 1 then 'Activo' \
                when a.estado = 2 then 'Anulado' \
                when a.estado = 3 then 'Entregado' end as descripcion_estado, \
                a.estado_pedido as estado_actual_pedido, \
                case when a.estado_pedido = 0 then 'No Asignado' \
                when a.estado_pedido = 1 then 'Asignado' \
                when a.estado_pedido = 2 then 'Auditado' \
                when a.estado_pedido = 3 then 'En Zona Despacho' \
                when a.estado_pedido = 4 then 'Despachado' \
                when a.estado_pedido = 5 then 'Despachado con Pendientes' \
                when a.estado_pedido = 6 then 'Separacion Finalizada' \
                when a.estado_pedido = 7 then 'En Auditoria'\
                when a.estado_pedido = 8 then 'Auditado con pdtes' \
                when a.estado_pedido = 9 then 'En zona con pdtes' end as descripcion_estado_actual_pedido,\
                d.estado as estado_separacion, \
                to_char(a.fecha_registro, 'dd-mm-yyyy') as fecha_registro \
                from ventas_ordenes_pedidos a \
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \
                inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \
                left join inv_bodegas_movimiento_tmp_despachos_clientes d on a.pedido_cliente_id = d.pedido_cliente_id  \
                where a.empresa_id = $1 " + sql_aux + "\
                and (   a.pedido_cliente_id ilike $2  \
                        or b.tercero_id ilike $2 \
                        or b.nombre_tercero ilike $2 \
                        or b.direccion ilike $2  \
                        or b.telefono ilike $2   \
                        or c.vendedor_id ilike $2 \
                        or c.nombre ilike $2) \
                /*AND (a.estado IN ('0','1','2','3'))*/  order by 1 desc ";

    G.db.paginated(sql, [empresa_id, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows);
    });

};

/**
 * @api {sql} consultar_pedido Consultar Pedido
 * @apiName Consultar Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Consulta la información principal del pedido seleccionado.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del Pedido
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Evento - onNotificarPedidosActualizados();
 *     
 *     Modulo : PedidosClientes
 *     Accion : Evento - onNotificacionOperarioPedidosAsignados();
 * @apiSuccessExample SQL.
 *          select 
 a.pedido_cliente_id as numero_pedido, 
 b.tipo_id_tercero as tipo_id_cliente, 
 b.tercero_id as identificacion_cliente, 
 b.nombre_tercero as nombre_cliente, 
 b.direccion as direccion_cliente, 
 b.telefono as telefono_cliente, 
 c.tipo_id_vendedor, 
 c.vendedor_id as idetificacion_vendedor, 
 c.nombre as nombre_vendedor, 
 a.estado, 
 case when a.estado = 0 then 'Inactivo ' 
 when a.estado = 1 then 'Activo' 
 when a.estado = 2 then 'Anulado' 
 when a.estado = 3 then 'Entregado' end as descripcion_estado, 
 a.estado_pedido as estado_actual_pedido, 
 case when a.estado_pedido = 0 then 'No Asignado' 
 when a.estado_pedido = 1 then 'Asignado' 
 when a.estado_pedido = 2 then 'Auditado' 
 when a.estado_pedido = 3 then 'En Despacho' 
 when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, 
 a.fecha_registro 
 from ventas_ordenes_pedidos a 
 inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id 
 inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id 
 where a.pedido_cliente_id = $1  
 AND (a.estado IN ('0','1','2','3')) order by 1 desc;
 *      
 */

PedidosClienteModel.prototype.consultar_pedido = function(numero_pedido, callback) {

    var sql = " select \
                a.pedido_cliente_id as numero_pedido, \
                b.tipo_id_tercero as tipo_id_cliente, \
                b.tercero_id as identificacion_cliente, \
                b.nombre_tercero as nombre_cliente, \
                b.direccion as direccion_cliente, \
                b.telefono as telefono_cliente, \
                c.tipo_id_vendedor, \
                c.vendedor_id as idetificacion_vendedor, \
                c.nombre as nombre_vendedor, \
                a.estado, \
                case when a.estado = 0 then 'Inactivo ' \
                     when a.estado = 1 then 'Activo' \
                     when a.estado = 2 then 'Anulado' \
                     when a.estado = 3 then 'Entregado' end as descripcion_estado, \
                a.estado_pedido as estado_actual_pedido, \
                case when a.estado_pedido = 0 then 'No Asignado' \
                     when a.estado_pedido = 1 then 'Asignado' \
                     when a.estado_pedido = 2 then 'Auditado' \
                     when a.estado_pedido = 3 then 'En Zona Despacho' \
                     when a.estado_pedido = 4 then 'Despachado' \
                     when a.estado_pedido = 5 then 'Despachado con Pendientes' \
                     when a.estado_pedido = 6 then 'Separacion Finalizada' \
                     when a.estado_pedido = 7 then 'En Auditoria'\
                     when a.estado_pedido = 8 then 'Auditado con pdtes' \
                     when a.estado_pedido = 9 then 'En zona con pdtes' end as descripcion_estado_actual_pedido,\
                d.estado as estado_separacion, \
                a.fecha_registro \
                from ventas_ordenes_pedidos a \
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \
                inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \
                left join inv_bodegas_movimiento_tmp_despachos_clientes d on a.pedido_cliente_id = d.pedido_cliente_id\
                where a.pedido_cliente_id = $1  \
                /*AND (a.estado IN ('0','1','2','3'))*/ order by 1 desc; ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};

/**
 * @api {sql} consultar_detalle_pedido Detalle Pedido 
 * @apiName Detalle Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Consulta toda la informacion detallada del pedido como productos, cantidades, precios, iva etc.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del Pedido
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Controller - listaPedidosOperariosBodega();
 * @apiSuccessExample SQL.
 *          select
 a.pedido_cliente_id as numero_pedido,
 a.codigo_producto,
 fc_descripcion_producto(a.codigo_producto) as descripcion_producto,
 a.numero_unidades as cantidad_solicitada,
 a.cantidad_despachada,
 a.numero_unidades - a.cantidad_despachada as cantidad_pendiente,
 a.cantidad_facturada,
 a.valor_unitario,
 a.porc_iva as porcentaje_iva,
 (a.valor_unitario+(a.valor_unitario*(a.porc_iva/100)))as valor_unitario_con_iva,
 (a.numero_unidades*(a.valor_unitario*(a.porc_iva/100))) as valor_iva
 from ventas_ordenes_pedidos_d a where a.pedido_cliente_id = $1 ;
 *      
 */

PedidosClienteModel.prototype.consultar_detalle_pedido = function(numero_pedido, callback) {

    var sql = " select\
                    a.pedido_cliente_id as numero_pedido,\
                    a.codigo_producto,\
                    fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                    a.numero_unidades::integer as cantidad_solicitada,\
                    a.cantidad_despachada::integer as cantidad_despachada_real,\
                    (a.numero_unidades - a.cantidad_despachada)::integer as cantidad_pendiente_real,\
                    COALESCE(b.cantidad_temporalmente_separada,0)::integer as cantidad_temporalmente_separada,\
                    ABS( a.cantidad_despachada +  COALESCE(b.cantidad_temporalmente_separada,0) )::integer as cantidad_despachada,\
                    (a.numero_unidades - ABS( a.cantidad_despachada +  COALESCE(b.cantidad_temporalmente_separada,0) ) )::integer as cantidad_pendiente,\
                    a.cantidad_facturada::integer,\
                    a.valor_unitario,\
                    a.porc_iva as porcentaje_iva,\
                    (a.valor_unitario+(a.valor_unitario*(a.porc_iva/100)))as valor_unitario_con_iva,\
                    (a.numero_unidades*(a.valor_unitario*(a.porc_iva/100))) as valor_iva,\
                    COALESCE(b.justificacion, '') as justificacion, \
                    COALESCE(b.justificacion_auditor, '') as justificacion_auditor, \
                    COALESCE(b.lote, '') as lote,\
                    b.fecha_vencimiento,\
                    b.item_id,\
                    b.tipo_estado_auditoria,\
                    b.cantidad_ingresada,\
                    COALESCE(b.auditado, '0') as auditado\
                    from ventas_ordenes_pedidos_d a \
                    inner join inventarios_productos c on a.codigo_producto = c.codigo_producto \
                    inner join inv_subclases_inventarios d on c.grupo_id = d.grupo_id and c.clase_id = d.clase_id and c.subclase_id = d.subclase_id \
                    inner join inv_clases_inventarios e on d.grupo_id = e.grupo_id and d.clase_id = e.clase_id \
                    left join (\
                        select a.numero_pedido, a.codigo_producto, a.justificacion, a.justificacion_auditor, sum(a.cantidad_temporalmente_separada) as cantidad_temporalmente_separada,\
                        a.lote, a.fecha_vencimiento, a.item_id, a.tipo_estado_auditoria, a.cantidad_ingresada, a.auditado\
                        from (\
                                select a.pedido_cliente_id as numero_pedido,  b.codigo_producto,  c.observacion as justificacion, c.justificacion_auditor, SUM(b.cantidad) as cantidad_temporalmente_separada, b.lote, to_char(b.fecha_vencimiento, 'dd-mm-yyyy') as fecha_vencimiento, b.item_id, '2' as tipo_estado_auditoria, b.cantidad :: integer as cantidad_ingresada, b.auditado\
                                from inv_bodegas_movimiento_tmp_despachos_clientes a \
                                inner join inv_bodegas_movimiento_tmp_d b on a.usuario_id = b.usuario_id and a.doc_tmp_id = b.doc_tmp_id\
                                left join inv_bodegas_movimiento_tmp_justificaciones_pendientes c on b.doc_tmp_id = c.doc_tmp_id and b.usuario_id = c.usuario_id and b.codigo_producto = c.codigo_producto\
                                group by 1,2,3,4,6, 7, 8, 9, 10, 11\
                                union \
                                select a.pedido_cliente_id  as numero_pedido, b.codigo_producto, b.observacion as justificacion, b.justificacion_auditor, 0 as cantidad_temporalmente_separada, '' as lote, null as fecha_vencimiento, 0 as item_id, '3' as tipo_estado_auditoria, 0 as  cantidad_ingresada, '0' as auditado\
                                from inv_bodegas_movimiento_tmp_despachos_clientes a \
                                left join inv_bodegas_movimiento_tmp_justificaciones_pendientes b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                                and b.codigo_producto not in(\
                                      select aa.codigo_producto from inv_bodegas_movimiento_tmp_d aa where aa.doc_tmp_id = b.doc_tmp_id and aa.usuario_id = b.usuario_id\
                                )\
                        ) a group by 1,2,3,4,6, 7, 8, 9, 10, 11 \
                    ) as b on a.pedido_cliente_id = b.numero_pedido and a.codigo_producto = b.codigo_producto\
                    where a.pedido_cliente_id = $1  order by e.descripcion ;";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });

};

/**
 * @api {sql} listar_pedidos_del_operario Listar Pedidos Operarios 
 * @apiName Listar Pedidos Operarios
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Listar los pedidos asignados a un operario de bodega.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} responsable Nombre del Operario
 * @apiParam {Number} pagina Número de la pagina que requiere traer registros
 * @apiParam {Number} limite Cantidad de resgistros por pagina, si no se envia el limite default es 1000
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Controller - listaPedidosOperariosBodega();
 * @apiSuccessExample SQL.
 *      select 
 *      a.pedido_cliente_id as numero_pedido, 
 *      b.tipo_id_tercero as tipo_id_cliente, 
 *      b.tercero_id as identificacion_cliente, 
 *      b.nombre_tercero as nombre_cliente, 
 *      b.direccion as direccion_cliente, 
 *      b.telefono as telefono_cliente, 
 *      c.tipo_id_vendedor, 
 *      c.vendedor_id as idetificacion_vendedor, 
 *      c.nombre as nombre_vendedor, 
 *      a.estado, 
 *      case when a.estado = 0 then 'Inactivo' 
 *      when a.estado = 1 then 'Activo' 
 *      when a.estado = 2 then 'Anulado' 
 *      when a.estado = 3 then 'Entregado' end as descripcion_estado, 
 *      a.estado_pedido as estado_actual_pedido, 
 *      case when a.estado_pedido = 0 then 'No Asignado' 
 *      when a.estado_pedido = 1 then 'Asignado' 
 *      when a.estado_pedido = 2 then 'Auditado' 
 *      when a.estado_pedido = 3 then 'En Despacho' 
 *      when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, 
 *      a.fecha_registro,
 *      d.responsable_id,
 *      e.nombre as responsable_pedido,
 *      d.fecha as fecha_asignacion_pedido 
 *      from ventas_ordenes_pedidos a 
 *      inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id 
 *      inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id 
 *      inner join ventas_ordenes_pedidos_estado d on a.pedido_cliente_id = d.pedido_cliente_id and a.estado_pedido = d.estado
 *      inner join operarios_bodega e on d.responsable_id = e.operario_id
 *      where d.responsable_id = $1  
 *      and a.estado_pedido = '1' 
 *      AND (a.estado IN ('1'))   
 *      order by by d.fecha desc limit $2 offset $3 ;;
 */

PedidosClienteModel.prototype.listar_pedidos_del_operario = function(responsable, termino_busqueda, filtro, pagina, limite, callback) {

    var sql_aux = " ";

    /*=========================================================================*/
    // Se implementa este filtro, para poder filtrar los pedidos del clientes 
    // asignados al operario de bodega y saber si el pedido tiene temporales o 
    // fue finalizado correctamente.
    /*=========================================================================*/
    var estado_pedido = '1';
    if (filtro !== undefined) {

        if (filtro.asignados) {
            sql_aux = "  f.doc_tmp_id IS NULL and  e.usuario_id = " + responsable + " and  ";
        }

        if (filtro.temporales) {
            sql_aux = "  f.doc_tmp_id IS NOT NULL AND f.estado = '0' and  e.usuario_id = " + responsable + " and ";
        }
        if (filtro.finalizados) {
            estado_pedido = '7';
            sql_aux = " e.usuario_id = (select usuario_id from operarios_bodega where operario_id = d.responsable_id ) and  g.usuario_id = " + responsable + " and ";
        }
    }

    var sql = " select \
                a.empresa_id as empresa_destino,\
                a.centro_destino,\
                a.bodega_destino,\
                f.doc_tmp_id as documento_temporal_id,\
                a.pedido_cliente_id as numero_pedido, \
                b.tipo_id_tercero as tipo_id_cliente, \
                b.tercero_id as identificacion_cliente, \
                b.nombre_tercero as nombre_cliente, \
                b.direccion as direccion_cliente, \
                b.telefono as telefono_cliente, \
                c.tipo_id_vendedor, \
                c.vendedor_id as idetificacion_vendedor, \
                c.nombre as nombre_vendedor, \
                a.estado, \
                case when a.estado = 0 then 'Inactivo' \
                     when a.estado = 1 then 'Activo' \
                     when a.estado = 2 then 'Anulado' \
                     when a.estado = 3 then 'Entregado' end as descripcion_estado, \
                a.estado_pedido as estado_actual_pedido, \
                case when a.estado_pedido = 0 then 'No Asignado' \
                     when a.estado_pedido = 1 then 'Asignado' \
                     when a.estado_pedido = 2 then 'Auditado' \
                     when a.estado_pedido = 3 then 'En Zona Despacho' \
                     when a.estado_pedido = 4 then 'Despachado' \
                     when a.estado_pedido = 5 then 'Despachado con Pendientes' \
                     when a.estado_pedido = 6 then 'Separacion Finalizada' \
                     when a.estado_pedido = 7 then 'En Auditoria'\
                     when a.estado_pedido = 8 then 'Auditado con pdtes' \
                     when a.estado_pedido = 9 then 'En zona con pdtes' end as descripcion_estado_actual_pedido,\
                f.estado as estado_separacion,     \
                case when f.estado = '0' then 'Separacion en Proceso' \
                     when f.estado = '1' then 'Separacion Finalizada' end as descripcion_estado_separacion,\
                a.fecha_registro,\
                d.responsable_id,\
                e.nombre as responsable_pedido,\
                d.fecha as fecha_asignacion_pedido, \
                g.fecha_registro as fecha_separacion_pedido \
                from ventas_ordenes_pedidos a \
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \
                inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \
                inner join ventas_ordenes_pedidos_estado d on a.pedido_cliente_id = d.pedido_cliente_id and a.estado_pedido = d.estado and (d.sw_terminado is null or d.sw_terminado = '0')\
                inner join operarios_bodega e on d.responsable_id = e.operario_id\
                left join inv_bodegas_movimiento_tmp_despachos_clientes f on a.pedido_cliente_id = f.pedido_cliente_id\
                left join inv_bodegas_movimiento_tmp g on f.usuario_id = g.usuario_id and f.doc_tmp_id = g.doc_tmp_id \
                where " + sql_aux + " \
                a.estado_pedido = " + estado_pedido + " \
                /*AND (a.estado IN ('1'))*/   \
                and (\
                        a.pedido_cliente_id ilike $1 or\
                        b.tercero_id ilike $1 or\
                        b.nombre_tercero  ilike $1 or\
                        c.vendedor_id ilike $1 or\
                        c.nombre ilike $1\
                    )\
                order by d.fecha asc ";

    G.db.pagination(sql, ["%" + termino_busqueda + "%"], pagina, limite, function(err, rows, result, total_records) {
        callback(err, rows, total_records);
    });


};


/**
 * @api {sql} asignar_responsables_pedidos Asignar Responsables 
 * @apiName Asignar Responsables
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Se le asignan pedidos a un operario de bodega para ser separados.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {String} estado_pedido Estado del pedido
 * @apiParam {Number} responsable Id del Operario de bodega
 * @apiParam {Number} usuario Id del usuario que registra la asignacion.
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Controller - asignarResponsablesPedido();
 */

PedidosClienteModel.prototype.asignar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    /*console.log('========== asignar_responsables_pedidos ==========');
     console.log(responsable);
     console.log(usuario);
     console.log('==================================================');*/

    var that = this;

    // Validar si existen responsables asignados
    var sql = " SELECT * FROM ventas_ordenes_pedidos_estado a WHERE a.pedido_cliente_id=$1 AND a.estado = $2 and (a.sw_terminado is null or a.sw_terminado = '0');";

    G.db.query(sql, [numero_pedido, estado_pedido], function(err, responsable_estado_pedido, result) {
        if (responsable_estado_pedido.length > 0) {
            //Actualizar
            that.actualizar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                //Actualizar estado actual del pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows, responsable_estado_pedido);
                    return;
                });
            });
        } else {
            // Asignar
            that.insertar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                //Actualizar estado actual del pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows, responsable_estado_pedido);
                    return;
                });
            });
        }
    });
};


/**
 * @api {sql} insertar_responsables_pedidos Ingresar Responsables Pedido 
 * @apiName Ingresar Responsables Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Ingresar el responsable del pedido asignado
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {String} estado_pedido Estado del pedido
 * @apiParam {Number} responsable Id del Operario de bodega
 * @apiParam {Number} usuario Id del usuario que registra la asignacion.
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Modelo - asignar_responsables_pedidos();
 * @apiSuccessExample SQL.
 *          INSERT INTO ventas_ordenes_pedidos_estado( pedido_cliente_id, estado, responsable_id, fecha, usuario_id) VALUES ($1, $2, $3, now(), $4);
 */

//  Almacenar responsable al pedido 
// Callbacks :  * Modulo :  PedidosClientes 
//                          Modelo - asignar_responsables_pedidos();
PedidosClienteModel.prototype.insertar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var sql = "INSERT INTO ventas_ordenes_pedidos_estado( pedido_cliente_id, estado, responsable_id, fecha, usuario_id) " +
            "VALUES ($1, $2, $3, now(), $4);";

    G.db.query(sql, [numero_pedido, estado_pedido, responsable, usuario], function(err, rows, result) {
        callback(err, rows);
    });
};

/**
 * @api {sql} actualizar_responsables_pedidos Actualizar Responsables Pedido 
 * @apiName Actualizar Responsables Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Asigna el Pedido a otro operario de bodega.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {String} estado_pedido Estado del pedido
 * @apiParam {Number} responsable Id del Operario de bodega
 * @apiParam {Number} usuario Id del usuario que registra la asignacion.
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Modelo - asignar_responsables_pedidos();
 * @apiSuccessExample SQL.
 *          UPDATE ventas_ordenes_pedidos_estado SET responsable_id=$3, fecha=NOW(), usuario_id=$4  WHERE pedido_cliente_id=$1 AND estado=$2;
 */

PedidosClienteModel.prototype.actualizar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var sql = "UPDATE ventas_ordenes_pedidos_estado SET responsable_id=$3, fecha=NOW(), usuario_id=$4 " +
            "WHERE pedido_cliente_id=$1 AND estado=$2 and (sw_terminado is null or sw_terminado = '0');";

    G.db.query(sql, [numero_pedido, estado_pedido, responsable, usuario], function(err, rows, result) {
        callback(err, rows);
    });
};


/**
 * @api {sql} eliminar_responsables_pedidos Eliminar el responsable de un pedido
 * @apiName Eliminar Responsables Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Permite eliminar el / los responsable de un pedido
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Modelo - asignar_responsables_pedidos();
 * @apiSuccessExample SQL.
 *          UPDATE ventas_ordenes_pedidos_estado SET responsable_id=$3, fecha=NOW(), usuario_id=$4  WHERE pedido_cliente_id=$1 AND estado=$2;
 */

PedidosClienteModel.prototype.eliminar_responsables_pedidos = function(numero_pedido, callback) {

    var sql = "DELETE FROM ventas_ordenes_pedidos_estado WHERE pedido_cliente_id=$1 and (sw_terminado is null or sw_terminado = '0'); ; ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows, result);
    });
};

/**
 * @api {sql} actualizar_estado_actual_pedido Actualizar Estado Actual del Peedido
 * @apiName Actualizar Estado Actual
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Permite cambiar el estado actual del pedido, dependiendo en momento o gestion determinada en donde se encuentre.
 * Los estados permitidos son:
 * 0 = No Asignado. Cuando se crea el pedido por primera vez
 * 1 = Asignado, cuando el pedido fue asignado a un operario de bodega para ser despachado
 * 2 = En Auditoria, Cuando se ha separado el pedido y lo estan auditando para verificar su correcta separacion.
 * 3 = Auditado, Cuando se ha separado el pedido y lo estan auditando para verificar su correcta separacion.
 * 4 = En Despacho, Cuando se encuentra listo para ser despachado al lugar de destino.
 * 5 = Despachado, Cuando el pedido ha sido despachado en su total al lugar de destino.
 * 6 = Despachado con Pendientes, Cuando el pedido ha sido despachado en su total al lugar de destino.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {String} estado_pedido Estado del pedido
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Modelo - asignar_responsables_pedidos();
 * @apiSuccessExample SQL.
 *          UPDATE ventas_ordenes_pedidos SET estado_pedido=$2 WHERE pedido_cliente_id=$1;
 */

PedidosClienteModel.prototype.actualizar_estado_actual_pedido = function(numero_pedido, estado_pedido, callback) {

    var sql = "UPDATE ventas_ordenes_pedidos SET estado_pedido=$2 WHERE pedido_cliente_id=$1;";

    G.db.query(sql, [numero_pedido, estado_pedido], function(err, rows, result) {
        callback(err, rows, result);
    });
};


// Autor:      : Camilo Orozco 
// Descripcion : Calcula la cantidad TOTAL pendiente de un producto en pedidos clientes
// Calls       : PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();
//               

PedidosClienteModel.prototype.calcular_cantidad_total_pendiente_producto = function(empresa_id, codigo_producto, callback) {

    var sql = " SELECT\
                b.codigo_producto,\
                SUM((b.numero_unidades - b.cantidad_despachada)) as cantidad_total_pendiente\
                FROM ventas_ordenes_pedidos a\
                inner join ventas_ordenes_pedidos_d b ON a.pedido_cliente_id = b.pedido_cliente_id\
                where a.empresa_id = $1 and b.codigo_producto = $2 and (b.numero_unidades - b.cantidad_despachada) > 0  \
                GROUP BY 1";

    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {        
        callback(err, rows);
    });
};

// Autor:      : Alexander López
// Descripcion : Calcula la cantidad TOTAL de un producto que está reservada en cotizaciones de Clientes
// Calls       : PedidosFarmacias -> PedidosFarmaciasController -> listar_productos(); PedidosClientes -> PedidosClienteController -> listarProductosClientes();
//               

PedidosClienteModel.prototype.calcular_cantidad_reservada_cotizaciones_clientes = function(codigo_producto, callback) {

    var sql = " SELECT b.codigo_producto, sum(b.numero_unidades)::integer as total_reservado from ventas_ordenes_pedidos_tmp a\
                INNER JOIN ventas_ordenes_pedidos_d_tmp b on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp\
                WHERE b.codigo_producto = $1 and a.estado = '1'\
                GROUP BY b.codigo_producto";

    G.db.query(sql, [codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};


// Autor:      : Eduar Garcia
// Descripcion : Calcula la cantidad TOTAL de un producto que está reservada en cotizaciones de Clientes por fecha
// Calls       : Pedidos -> PedidosModel -> calcular_disponibilidad_producto();
//               

PedidosClienteModel.prototype.calcular_cantidad_reservada_cotizaciones_clientes_por_fecha = function(codigo_producto, fecha_registro_pedido, callback) {

    var sql = " SELECT b.codigo_producto, sum(b.numero_unidades)::integer as total_reservado from ventas_ordenes_pedidos_tmp a\
                INNER JOIN ventas_ordenes_pedidos_d_tmp b on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp\
                WHERE b.codigo_producto = $1 and a.estado = '1' AND a.fecha_registro < $2\
                GROUP BY b.codigo_producto";

    G.db.query(sql, [codigo_producto, fecha_registro_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};


// lista todos los responsables del pedido
PedidosClienteModel.prototype.obtener_responsables_del_pedido = function(numero_pedido, callback) {


    var sql = " select \
                a.pedido_cliente_id as numero_pedido,  \
                a.estado,\
                case when a.estado=0 then 'No Asignado'\
                     when a.estado=1 then 'Asignado'\
                     when a.estado=2 then 'Auditado'\
                     when a.estado=3 then 'En Zona Despacho' \
                     when a.estado=4 then 'Despachado'\
                     when a.estado=5 then 'Despachado con Pendientes' \
                     when a.estado=6 then 'Separacion Finalizada' \
                     when a.estado=7 then 'En Auditoria'\
                     when a.estado=8 then 'Auditado con pdtes' \
                     when a.estado=9 then 'En zona con pdtes' end as descripcion_estado,\
                b.operario_id,\
                b.nombre as nombre_responsable,\
                b.usuario_id as usuario_id_responsable,\
                a.usuario_id,\
                c.nombre as nombre_usuario,\
                a.fecha as fecha_asignacion,\
                a.fecha_registro,    \
                COALESCE(a.sw_terminado,'0') as sw_terminado\
                from ventas_ordenes_pedidos_estado a \
                inner join system_usuarios c on a.usuario_id = c.usuario_id\
                left join operarios_bodega b on a.responsable_id = b.operario_id\
                where a.pedido_cliente_id=$1 order by a.fecha_registro DESC; ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};


PedidosClienteModel.prototype.terminar_estado_pedido = function(numero_pedido, estados, terminado, callback) {

    estados = estados.join(",");

    var sql = "update ventas_ordenes_pedidos_estado set sw_terminado = $2\
               where  pedido_cliente_id = $1 and estado in(" + estados + ") and (sw_terminado is null or sw_terminado = '0')";

    G.db.query(sql, [numero_pedido, terminado], function(err, rows, result) {
        callback(err, rows, result);
    });
};

// obtiene informacion del rotulo para imprimir
PedidosClienteModel.prototype.obtenerDetalleRotulo = function(numero_pedido, numero_caja, tipo, callback) {


    var sql = "SELECT a.direccion, a.cliente, '' AS departamento, a.numero_caja, a.tipo FROM inv_rotulo_caja a\
               WHERE a.solicitud_prod_a_bod_ppal_id = $1 AND a.numero_caja = $2 AND a.tipo = $3; ";

    G.db.query(sql, [numero_pedido, numero_caja, tipo], function(err, rows, result) {
        callback(err, rows);
    });
};


// Pedidos en Donde esta pendiente por entregar el Producto
PedidosClienteModel.prototype.listar_pedidos_pendientes_by_producto = function(empresa, codigo_producto, callback) {

    var sql = " SELECT\
                a.pedido_cliente_id as numero_pedido,\
                b.numero_unidades as cantidad_solicitada,\
                ((b.numero_unidades - b.cantidad_despachada)) as cantidad_pendiente,\
                a.tipo_id_tercero,\
                a.tercero_id,\
                c.nombre_tercero,\
                d.usuario,\
                a.fecha_registro,\
                e.justificacion_separador,\
                e.justificacion_auditor\
                FROM ventas_ordenes_pedidos a\
                inner JOIN ventas_ordenes_pedidos_d AS b ON a.pedido_cliente_id = b.pedido_cliente_id\
                inner JOIN terceros as c ON (a.tipo_id_tercero = c.tipo_id_tercero) AND (a.tercero_id = c.tercero_id)\
                JOIN system_usuarios as d ON (a.usuario_id = d.usuario_id)\
                left join(\
                      select bb.observacion as justificacion_separador, bb.justificacion_auditor, aa.pedido_cliente_id, bb.codigo_producto\
                      from inv_bodegas_movimiento_despachos_clientes aa\
                      inner join inv_bodegas_movimiento_justificaciones_pendientes bb on aa.numero = bb.numero and aa.prefijo = bb.prefijo\
                ) e on e.pedido_cliente_id = a.pedido_cliente_id  and e.codigo_producto = b.codigo_producto\
                WHERE a.empresa_id = $1 and b.codigo_producto=$2 and a.estado = '1' and b.numero_unidades <> b.cantidad_despachada\
                ORDER BY a.pedido_cliente_id; ";

    G.db.query(sql, [empresa, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};


/**
 * @api {sql} actualizar_despachos_pedidos_cliente Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription se actualiza la cantidad despachada del pedido al genear el despacho
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */

PedidosClienteModel.prototype.actualizar_despachos_pedidos_cliente = function(numero_pedido, prefijo_documento, numero_documento, callback) {
    var sql = "select b.codigo_producto, sum(b.cantidad) AS cantidad_despachada, b.prefijo, b.numero\
                from inv_bodegas_movimiento_despachos_clientes a\
                inner join inv_bodegas_movimiento_d b on a.empresa_id =b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                where a.pedido_cliente_id = $1 and a.numero= $3 and a.prefijo= $2 group by 1,3,4";


    G.db.query(sql, [numero_pedido, prefijo_documento, numero_documento], function(err, rows, result) {

        if (err) {
            callback(err, null);
            return;
        }

        var length = rows.length;

        G.db.begin(function() {
            rows.forEach(function(row) {

                var cantidad_despachada = parseInt(row.cantidad_despachada);
                sql = "UPDATE ventas_ordenes_pedidos_d\
                        SET cantidad_despachada=cantidad_despachada+$1\
                        WHERE   pedido_cliente_id=$2\
                        AND  codigo_producto=$3\
                        AND cantidad_despachada < numero_unidades ";


                G.db.transaction(sql, [cantidad_despachada, numero_pedido, row.codigo_producto], function(err, rows, result) {

                    if (--length === 0) {
                        G.db.commit(function() {
                            callback(err, rows);
                            return;
                        });
                    }
                });

            });
        });
    });
};

/*
 * Author : Camilo Orozco
 * Descripcion :  SQL listado de productos para la seleccion de medicamentos en una cotizacion o en un pedido de cliente.
 */
PedidosClienteModel.prototype.listar_productos = function(empresa, centro_utilidad_id, bodega_id, contrato_cliente_id, termino_busqueda, pagina, callback) {

    var sql = " select \
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as nombre_producto,\
                b.codigo_cum,\
                b.codigo_invima,\
                b.vencimiento_codigo_invima,\
                b.porc_iva as iva,\
                a.existencia::integer as existencia,\
                coalesce(h.cantidad_total_pendiente, 0) as cantidad_total_pendiente,\
                case when coalesce((a.existencia - h.cantidad_total_pendiente)::integer, 0) < 0 then 0 \
                        else coalesce((a.existencia - h.cantidad_total_pendiente)::integer, 0) end as cantidad_disponible,\
                case when g.precio_pactado > 0 then true else false end as tiene_precio_pactado,\
                split_part(fc_precio_producto_contrato_cliente($4,a.codigo_producto,$1), '@', 1) as precio_producto,\
                b.sw_regulado,\
                c.precio_regulado\
                from existencias_bodegas a \
                inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and a.empresa_id = c.empresa_id\
                inner join inv_tipo_producto d ON b.tipo_producto_id = d.tipo_producto_id\
                inner join inv_subclases_inventarios e ON b.grupo_id = e.grupo_id and b.clase_id = e.clase_id and b.subclase_id = e.subclase_id\
                inner join inv_clases_inventarios f ON e.grupo_id = f.grupo_id and e.clase_id = f.clase_id\
                left join (\
                    select b.codigo_producto, coalesce(b.precio_pactado,0) as precio_pactado\
                    from vnts_contratos_clientes a\
                    inner join vnts_contratos_clientes_productos b on a.contrato_cliente_id = b.contrato_cliente_id\
                    where a.contrato_cliente_id = $4\
                ) g on c.codigo_producto = g.codigo_producto\
                left join (\
                  select aa.codigo_producto, sum(aa.cantidad_total_pendiente) as cantidad_total_pendiente\
                  from (\
                    select b.codigo_producto, SUM((b.numero_unidades - b.cantidad_despachada)) as cantidad_total_pendiente, 1\
                    from ventas_ordenes_pedidos a\
                    inner join ventas_ordenes_pedidos_d b ON a.pedido_cliente_id = b.pedido_cliente_id\
                    where a.empresa_id = $1 and (b.numero_unidades - b.cantidad_despachada) > 0  \
                    group by 1\
                    UNION\
                    select b.codigo_producto, SUM( b.cantidad_pendiente) AS cantidad_total_pendiente, 2\
                    from solicitud_productos_a_bodega_principal a \
                    inner join solicitud_productos_a_bodega_principal_detalle b ON a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id    \
                    where a.empresa_destino = $1 and b.cantidad_pendiente > 0 \
                    group by 1\
                  ) aa group by 1\
                ) h on c.codigo_producto = h.codigo_producto\
                where a.empresa_id = $1 and a.centro_utilidad = $2 and a.bodega = $3 \
                and (\
                    a.codigo_producto ilike $5 or\
                    fc_descripcion_producto(a.codigo_producto) ilike $5 or\
                    e.descripcion ilike $5\
                ) order by 2";
    
    console.log(sql);

    G.db.paginated(sql, [empresa, centro_utilidad_id, bodega_id,contrato_cliente_id, '%'+termino_busqueda+'%'], pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });
};





/**************************************************
 * 
 *  REVISAR DESDE ACA HACIA ABAJO 
 *
/**************************************************



/**
 * @api {sql} insertar_cotizacion Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription Inserta encabezado de cotización
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */
PedidosClienteModel.prototype.insertar_cotizacion = function(empresa_id, tipo_id_tercero, tercero_id, usuario_id, 
                                                             tipo_id_vendedor, vendedor_id, estado, observaciones, centro_utilidad, bodega, callback) {
    
    var sql = "INSERT INTO ventas_ordenes_pedidos_tmp(empresa_id, tipo_id_tercero, tercero_id, fecha_registro, usuario_id, tipo_id_vendedor, vendedor_id, estado, observaciones, centro_destino, bodega_destino) \
                VALUES($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7, $8, $9, $10) \
                RETURNING pedido_cliente_id_tmp, fecha_registro";

    G.db.query(sql, [empresa_id, tipo_id_tercero, tercero_id, usuario_id, tipo_id_vendedor, vendedor_id, estado, observaciones ,centro_utilidad, bodega], function(err, rows, result) {
        callback(err, rows, result);
    });

};


/**
 * @api {sql} insertar_detalle_cotizacion Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription Inserta detalle de cotización
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */
PedidosClienteModel.prototype.insertar_detalle_cotizacion = function(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto, callback) {
    
//    var sql = "INSERT INTO ventas_ordenes_pedidos_d_tmp(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, fecha_registro, usuario_id, tipo_producto) \
//                VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7)";
//
//    G.db.query(sql, [pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto], function(err, rows, result) {
//        callback(err, rows, result);
//    });

    var numero_cotizacion = pedido_cliente_id_tmp;

    G.db.begin(function() {
           
           __cambiar_estado_cotizacion(numero_cotizacion, '1', function(err, rows, result){
               if(err){
                    callback(err);
                    return;
                }
                
                __insertar_detalle_cotizacion(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto, function(err, rows, result) {

                    if(err){
                        callback(err);
                        return;
                    }

                    // Finalizar Transacción.
                    G.db.commit(function(){
                        callback(err, rows, result);
                    });
                });
                
           });
           
    });
};


function __insertar_detalle_cotizacion(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto, callback){
    
    var sql = "INSERT INTO ventas_ordenes_pedidos_d_tmp(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, fecha_registro, usuario_id, tipo_producto) \
                VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7)";
    
    G.db.transaction(sql, [pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto], function(err, rows, result){
        callback(err, rows, result);
    });
};

/**
 * @api {sql} listar_cotizaciones Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription Lista cotizaciones
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */
PedidosClienteModel.prototype.listar_cotizaciones = function(empresa_id, termino_busqueda, pagina, callback) {
    
    var sql = " select\
                    a.pedido_cliente_id_tmp as numero_cotizacion,\
                    a.empresa_id,\
                    a.tipo_id_tercero as tipo_id_cliente,\
                    a.tercero_id as cliente_id,\
                    to_char(a.fecha_registro, 'dd-mm-yyyy hh:mm:ss') as fecha_registro,\
                    a.usuario_id,\
                    to_char(a.fecha_envio, 'dd-mm-yyyy hh:mm:ss') as fecha_envio,\
                    a.tipo_id_vendedor,\
                    a.vendedor_id,\
                    round(SUM((b.valor_unitario + (b.valor_unitario * COALESCE(b.porc_iva, 0))/100) * b.numero_unidades),2) as valor_cotizacion,\
                    a.estado,\
                    a.observaciones,\
                    c.tipo_pais_id as tipo_pais_cliente,\
                    c.tipo_dpto_id as tipo_departamento_cliente,\
                    c.tipo_mpio_id as tipo_municipio_cliente,\
                    c.direccion as direccion_cliente,\
                    c.telefono as telefono_cliente,\
                    c.nombre_tercero as nombre_cliente,\
                    d.nombre as nombre_vendedor,\
                    d.telefono as telefono_vendedor,\
                    e.pais,\
                    f.departamento,\
                    g.municipio\
                    from ventas_ordenes_pedidos_tmp a\
                    left join ventas_ordenes_pedidos_d_tmp b on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp\
                    join terceros c on c.tipo_id_tercero = a.tipo_id_tercero\
                        and c.tercero_id = a.tercero_id\
                    join vnts_vendedores d on d.tipo_id_vendedor = a.tipo_id_vendedor\
                        and d.vendedor_id = a.vendedor_id\
                    left join tipo_pais as e on e.tipo_pais_id = c.tipo_pais_id\
                    left join tipo_dptos as f on f.tipo_dpto_id = c.tipo_dpto_id\
                        and f.tipo_pais_id = e.tipo_pais_id \
                    left join tipo_mpios as g on g.tipo_mpio_id = c.tipo_mpio_id\
                        and g.tipo_dpto_id = f.tipo_dpto_id\
                        and g.tipo_pais_id = e.tipo_pais_id\
                where a.empresa_id = $1\
                    and (   a.pedido_cliente_id_tmp ilike $2\
                            or c.nombre_tercero ilike $2\
                            or d.nombre ilike $2    )\
                group by a.pedido_cliente_id_tmp, a.empresa_id, a.tipo_id_tercero, a.tercero_id, a.fecha_registro, a.usuario_id, a.fecha_envio,\
                    a.tipo_id_vendedor, a.vendedor_id, a.estado, a.observaciones, c.tipo_pais_id, c.tipo_dpto_id, c.tipo_mpio_id, c.direccion,\
                    c.telefono, c.nombre_tercero, d.nombre, d.telefono, e.pais, f.departamento, g.municipio\
                order by 1 desc\
";
    
    G.db.paginated(sql, [empresa_id, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows);
    }); 

};

/**
 * @api {sql} listar_pedidos Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription Lista pedidos
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */
PedidosClienteModel.prototype.listado_pedidos_clientes = function(empresa_id, termino_busqueda, pagina, callback) {
    
    var sql = " select\
                    a.pedido_cliente_id as numero_pedido,\
                    a.empresa_id,\
                    a.tipo_id_tercero as tipo_id_cliente,\
                    a.tercero_id as cliente_id,\
                    to_char(a.fecha_registro, 'dd-mm-yyyy hh:mm:ss') as fecha_registro,\
                    a.usuario_id,\
                    to_char(a.fecha_envio, 'dd-mm-yyyy hh:mm:ss') as fecha_envio,\
                    a.tipo_id_vendedor,\
                    a.vendedor_id,\
                    round(SUM((b.valor_unitario + (b.valor_unitario * COALESCE(b.porc_iva, 0))/100) * b.numero_unidades),2) as valor_pedido,\
                    a.estado,\
                    a.estado_pedido,\
                    a.fecha_registro_anulacion,\
                    a.usuario_anulador,\
                    a.observacion_anulacion,\
                    a.observacion,\
                    c.tipo_pais_id as tipo_pais_cliente,\
                    c.tipo_dpto_id as tipo_departamento_cliente,\
                    c.tipo_mpio_id as tipo_municipio_cliente,\
                    c.direccion as direccion_cliente,\
                    c.telefono as telefono_cliente,\
                    c.nombre_tercero as nombre_cliente,\
                    d.nombre as nombre_vendedor,\
                    d.telefono as telefono_vendedor,\
                    e.estado as estado_separacion,\
                    f.empresa_id as despacho_empresa_id,\
                    f.prefijo as despacho_prefijo, \
                    f.numero as despacho_numero, \
                    CASE WHEN f.numero IS NOT NULL THEN true ELSE false END as tiene_despacho \
                from ventas_ordenes_pedidos a\
                    left join ventas_ordenes_pedidos_d b on b.pedido_cliente_id = a.pedido_cliente_id\
                    join terceros c on c.tipo_id_tercero = a.tipo_id_tercero\
                        and c.tercero_id = a.tercero_id\
                    join vnts_vendedores d on d.tipo_id_vendedor = a.tipo_id_vendedor\
                        and d.vendedor_id = a.vendedor_id\
                    left join inv_bodegas_movimiento_tmp_despachos_clientes e on a.pedido_cliente_id = e.pedido_cliente_id  \
                    left join inv_bodegas_movimiento_despachos_clientes f on a.pedido_cliente_id = f.pedido_cliente_id \
                where a.empresa_id = $1\
                    and (   a.pedido_cliente_id ilike $2\
                            or c.nombre_tercero ilike $2\
                            or d.nombre ilike $2 )\
                group by a.pedido_cliente_id, a.empresa_id, a.tipo_id_tercero, a.tercero_id, a.fecha_registro, a.usuario_id, a.fecha_envio,\
                    a.tipo_id_vendedor, a.vendedor_id, a.estado, a.estado_pedido, a.fecha_registro_anulacion, a.usuario_anulador, a.observacion_anulacion,\
                    a.observacion, c.tipo_pais_id, c.tipo_dpto_id, c.tipo_mpio_id, c.direccion, c.telefono, c.nombre_tercero, d.nombre, d.telefono, e.estado,\
                    f.empresa_id, f.prefijo, f.numero \
                order by 1 desc\
";
    
    G.db.paginated(sql, [empresa_id, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    }); 
    
    /*G.db.query(sql, [empresa_id, "%" + termino_busqueda + "%"], function(err, rows, result) {
        callback(err, rows, result);
    });*/
};

//************ NUEVO *******************
PedidosClienteModel.prototype.consultar_encabezado_cotizacion = function(numero_cotizacion, callback) {
    
    var sql = " select\
                    a.pedido_cliente_id_tmp as numero_cotizacion,\
                    a.empresa_id,\
                    a.tipo_id_tercero as tipo_id_cliente,\
                    a.tercero_id as cliente_id,\
                    to_char(a.fecha_registro, 'dd-mm-yyyy hh:mm:ss') as fecha_registro,\
                    a.usuario_id,\
                    to_char(a.fecha_envio, 'dd-mm-yyyy hh:mm:ss') as fecha_envio,\
                    a.tipo_id_vendedor,\
                    a.vendedor_id,\
                    a.estado,\
                    a.observaciones,\
                    c.tipo_pais_id as tipo_pais_cliente,\
                    c.tipo_dpto_id as tipo_departamento_cliente,\
                    c.tipo_mpio_id as tipo_municipio_cliente,\
                    c.direccion as direccion_cliente,\
                    c.telefono as telefono_cliente,\
                    c.nombre_tercero as nombre_cliente,\
                    d.nombre as nombre_vendedor,\
                    d.telefono as telefono_vendedor,\
                    e.pais,\
                    f.departamento,\
                    g.municipio\
                from ventas_ordenes_pedidos_tmp a\
                    join terceros c on c.tipo_id_tercero = a.tipo_id_tercero\
                        and c.tercero_id = a.tercero_id\
                    join vnts_vendedores d on d.tipo_id_vendedor = a.tipo_id_vendedor\
                        and d.vendedor_id = a.vendedor_id\
                    left join tipo_pais as e on e.tipo_pais_id = c.tipo_pais_id\
                    left join tipo_dptos as f on f.tipo_dpto_id = c.tipo_dpto_id\
                        and f.tipo_pais_id = e.tipo_pais_id \
                    left join tipo_mpios as g on g.tipo_mpio_id = c.tipo_mpio_id\
                        and g.tipo_dpto_id = f.tipo_dpto_id\
                        and g.tipo_pais_id = e.tipo_pais_id\
                where a.pedido_cliente_id_tmp = $1";
    
    G.db.query(sql, [numero_cotizacion], function(err, rows, result) {
        callback(err, rows, result);
    }); 

};

PedidosClienteModel.prototype.consultar_encabezado_pedido = function(numero_pedido, callback) {
    
    var sql = " select\
                    a.pedido_cliente_id as numero_pedido,\
                    a.empresa_id,\
                    a.tipo_id_tercero as tipo_id_cliente,\
                    a.tercero_id as cliente_id,\
                    to_char(a.fecha_registro, 'dd-mm-yyyy hh:mm:ss') as fecha_registro,\
                    a.usuario_id,\
                    to_char(a.fecha_envio, 'dd-mm-yyyy hh:mm:ss') as fecha_envio,\
                    a.tipo_id_vendedor,\
                    a.vendedor_id,\
                    a.estado,\
                    a.estado_pedido,\
                    a.fecha_registro_anulacion,\
                    a.usuario_anulador,\
                    a.observacion_anulacion,\
                    a.observacion,\
                    c.tipo_pais_id as tipo_pais_cliente,\
                    c.tipo_dpto_id as tipo_departamento_cliente,\
                    c.tipo_mpio_id as tipo_municipio_cliente,\
                    c.direccion as direccion_cliente,\
                    c.telefono as telefono_cliente,\
                    c.nombre_tercero as nombre_cliente,\
                    d.nombre as nombre_vendedor,\
                    d.telefono as telefono_vendedor,\
                    e.pais,\
                    f.departamento,\
                    g.municipio,\
                    h.estado as estado_separacion\
                from ventas_ordenes_pedidos a\
                    join terceros c on c.tipo_id_tercero = a.tipo_id_tercero\
                        and c.tercero_id = a.tercero_id\
                    join vnts_vendedores d on d.tipo_id_vendedor = a.tipo_id_vendedor\
                        and d.vendedor_id = a.vendedor_id\
                    left join tipo_pais as e on e.tipo_pais_id = c.tipo_pais_id\
                    left join tipo_dptos as f on f.tipo_dpto_id = c.tipo_dpto_id\
                        and f.tipo_pais_id = e.tipo_pais_id \
                    left join tipo_mpios as g on g.tipo_mpio_id = c.tipo_mpio_id\
                        and g.tipo_dpto_id = f.tipo_dpto_id\
                        and g.tipo_pais_id = e.tipo_pais_id\
                    left join inv_bodegas_movimiento_tmp_despachos_clientes h on a.pedido_cliente_id = h.pedido_cliente_id  \
                where a.pedido_cliente_id = $1";
    
    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows, result);
    });
};

//************ NUEVO END ******************


/**
 * @api {sql} estado_cotizacion Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription Estado de Cotización
 * @apiDefinePermission autenticado Requiere Autenticación
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_cotizacion Numero de cotizacion a consultar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */
PedidosClienteModel.prototype.estado_cotizacion = function(numero_cotizacion, callback) {
    
    var sql = "select estado from ventas_ordenes_pedidos_tmp where pedido_cliente_id_tmp = $1";
    
    G.db.query(sql, [numero_cotizacion], function(err, rows, result) {
        callback(err, rows, result);
    });
};

/**
 * @api {sql} estado_pedido Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription Estado de Pedido
 * @apiDefinePermission autenticado Requiere Autenticación
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero de pedido a consultar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */
PedidosClienteModel.prototype.estado_pedido = function(numero_pedido, callback) {
    
    var sql = " select a.estado_pedido, b.estado as estado_separacion from ventas_ordenes_pedidos a\
                left join inv_bodegas_movimiento_tmp_despachos_clientes b on a.pedido_cliente_id = b.pedido_cliente_id\
                where a.pedido_cliente_id = $1";
    
    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows, result);
    });
};

/**
 * @api {sql} listar_detalle_cotizacion Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription Lista detalle de cotización
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */
PedidosClienteModel.prototype.listar_detalle_cotizacion = function(numero_cotizacion, callback) {
    
    var sql = " select\
                    codigo_producto,\
                    fc_descripcion_producto(codigo_producto) as nombre_producto,\
                    porc_iva,\
                    numero_unidades,\
                    valor_unitario,\
                    to_char(fecha_registro, 'dd-mm-yyyy hh:mm:ss') as fecha_registro,\
                    valor_unitario*numero_unidades as total_sin_iva,\
                    round((valor_unitario + (valor_unitario * COALESCE(porc_iva, 0))/100) * numero_unidades, 2) as total_con_iva,\
                    tipo_producto\
                from\
                    ventas_ordenes_pedidos_d_tmp\
                where pedido_cliente_id_tmp = $1";
    
    G.db.query(sql, [numero_cotizacion], function(err, rows, result) {
        callback(err, rows, result);
    });

};

/**
 * @api {sql} listar_detalle_pedido Pedidos clientes model
 * @apiName Pedidos Clientes
 * @apiGroup PedidosCliente (sql)
 * @apiDescription Lista detalle de pedido
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} numero_pedido Numero del pedido a asignar
 * @apiParam {Function} callback Funcion de retorno de informacion.
 */
PedidosClienteModel.prototype.listar_detalle_pedido = function(numero_pedido, callback) {
    
    var sql = " select\
                    codigo_producto,\
                    fc_descripcion_producto(codigo_producto) as nombre_producto,\
                    porc_iva,\
                    numero_unidades,\
                    valor_unitario,\
                    to_char(fecha_registro, 'dd-mm-yyyy hh:mm:ss') as fecha_registro,\
                    valor_unitario*numero_unidades as total_sin_iva,\
                    round((valor_unitario + (valor_unitario * COALESCE(porc_iva, 0))/100) * numero_unidades, 2) as total_con_iva,\
                    tipo_producto\
                from\
                    ventas_ordenes_pedidos_d\
                where pedido_cliente_id = $1";
    
    /*
    //--item_id serial NOT NULL, -- Es la llave primaria del item de un pedido
  //--pedido_cliente_id integer NOT NULL, -- Es el Pedido (foranea)
  codigo_producto character varying(50) NOT NULL, -- Es el Producto inscrito en el pedido de un cliente
  porc_iva numeric(5,3) NOT NULL, -- Es el Iva del Producto
  numero_unidades integer NOT NULL DEFAULT 0, -- Numero de Unidades Solicitadas por el Cliente
  valor_unitario numeric(15,2) NOT NULL, -- Es el valor unitario del producto, calculado segun el contrato inscrito en el sistema
  fecha_registro timestamp(1) without time zone NOT NULL DEFAULT now(), -- Fecha de Registro
  //--usuario_id integer NOT NULL, -- Usuario que registra el Item
  //--cantidad_despachada integer NOT NULL DEFAULT 0, -- CANTIDAD DESPACHADA A UN CLIENTE
  //--cantidad_facturada integer NOT NULL DEFAULT 0, 
     */
    
    
    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows, result);
    });

};

PedidosClienteModel.prototype.eliminar_registro_detalle_cotizacion = function(numero_cotizacion, codigo_producto, usuario_solicitud, callback)
{
    /*var sql = "DELETE FROM ventas_ordenes_pedidos_d_tmp WHERE pedido_cliente_id_tmp = $1 and codigo_producto = $2";

    G.db.query(sql, [numero_cotizacion, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });*/
    
    G.db.begin(function(){
        
        __log_eliminar_producto_detalle_cotizacion(numero_cotizacion, codigo_producto, usuario_solicitud, function(err, rows, result){
            
            if(err){
                    callback(err);
                    return;
                }
            
            __eliminar_registro_detalle_cotizacion(numero_cotizacion, codigo_producto, function(err, rows, result){
               
                if(err){
                    callback(err);
                    return;
                }
                
                G.db.commit(function(){
                    callback(err, rows);
                });
            });
        });
        
    });  
};

function __eliminar_registro_detalle_cotizacion(numero_cotizacion, codigo_producto, callback){
    
    var sql = "DELETE FROM ventas_ordenes_pedidos_d_tmp WHERE pedido_cliente_id_tmp = $1 and codigo_producto = $2";
    
    G.db.transaction(sql, [numero_cotizacion, codigo_producto], function(err, rows, result){
        callback(err, rows, result);
    });
};

PedidosClienteModel.prototype.cambiar_estado_cotizacion = function(numero_cotizacion, nuevo_estado, callback)
{
    var sql = "UPDATE ventas_ordenes_pedidos_tmp SET estado = $2 WHERE pedido_cliente_id_tmp = $1";
    
    G.db.query(sql, [numero_cotizacion, nuevo_estado], function(err, rows, result) {
        callback(err, rows, result);
    });
};

PedidosClienteModel.prototype.cambiar_estado_aprobacion_cotizacion = function(numero_cotizacion, nuevo_estado, observacion, callback)
{
    var sql = "UPDATE ventas_ordenes_pedidos_tmp SET estado = $2, observaciones = $3 WHERE pedido_cliente_id_tmp = $1";
    
    G.db.query(sql, [numero_cotizacion, nuevo_estado, observacion], function(err, rows, result) {
        callback(err, rows, result);
    });
};

PedidosClienteModel.prototype.cambiar_estado_aprobacion_pedido = function(numero_pedido, nuevo_estado, observacion, callback)
{
    var sql = "UPDATE ventas_ordenes_pedidos SET estado = $2, observacion = $3 WHERE pedido_cliente_id = $1";
    
    G.db.query(sql, [numero_pedido, nuevo_estado, observacion], function(err, rows, result) {
        callback(err, rows, result);
    });
};

function __cambiar_estado_cotizacion(numero_cotizacion, nuevo_estado, callback)
{
    
    var sql = "UPDATE ventas_ordenes_pedidos_tmp SET estado = $2 WHERE pedido_cliente_id_tmp = $1";

    G.db.transaction(sql, [numero_cotizacion, nuevo_estado], function(err, rows, result){
        callback(err, rows, result);
    });

};

//Insert con Transacción para generación de pedidos
PedidosClienteModel.prototype.insertar_pedido_cliente = function(numero_cotizacion, callback)
{
    G.db.begin(function() {
        
       __insertar_encabezado_pedido_cliente(numero_cotizacion, function(err, rows, result) {

           if(err){
               callback(err);
               return;
           }

           //console.log(">>>>> DATA ROWS: ", rows.rows[0].pedido_cliente_id);
           //console.log(">>>>> DATA RESULT: ", result);
           var numero_pedido = rows.rows[0].pedido_cliente_id;
           var fecha_registro_encabezado = rows.rows[0].fecha_registro;
           
           //console.log(">>>>> DATA INSERTAR ENCABEZADO: ", rows);
           //console.log(">>>>> Número Pedido: ", numero_pedido);
           
           __cambiar_estado_cotizacion(numero_cotizacion, '0', function(err, rows, result){
               if(err){
                    callback(err);
                    return;
                }
                
                /* Insertar Detalle */
                __insertar_detalle_pedido_cliente(numero_pedido, numero_cotizacion, function(err, rows, result) {

                    if(err){
                        callback(err);
                        return;
                    }

                    // Finalizar Transacción.
                    G.db.commit(function(){
                        callback(err, rows, fecha_registro_encabezado);
                    });
                });
                /* Insertar Detalle */
           });

       });
    });
};

function __insertar_encabezado_pedido_cliente(numero_cotizacion, callback)
{
    
    /*
     Los camposiguientes se usan solo para anulación:
    
        fecha_registro_anulacion,
	usuario_anulador,
	observacion_anulacion,
     */
    
    var sql = " INSERT INTO ventas_ordenes_pedidos( empresa_id, tipo_id_tercero, tercero_id, fecha_registro, usuario_id, estado, tipo_id_vendedor,\
                    vendedor_id, observacion, estado_pedido, centro_destino, bodega_destino) \
                SELECT empresa_id, tipo_id_tercero, tercero_id, CURRENT_TIMESTAMP, usuario_id, 1, tipo_id_vendedor,\
                    vendedor_id, observaciones, 0, centro_destino, bodega_destino\
                FROM ventas_ordenes_pedidos_tmp \
                WHERE pedido_cliente_id_tmp = $1 \
                RETURNING pedido_cliente_id, fecha_registro";

    G.db.transaction(sql, [numero_cotizacion], function(err, rows, result){
        callback(err, rows, result);
    });
};

function __insertar_detalle_pedido_cliente(numero_pedido, numero_cotizacion, callback) {
    
    /*
     Los campos siguientes se usan solo para despacho y facturación:
    
        cantidad_despachada
        cantidad_facturada
    */
    var sql = " INSERT INTO ventas_ordenes_pedidos_d(pedido_cliente_id, codigo_producto, porc_iva, numero_unidades, valor_unitario, fecha_registro, usuario_id, tipo_producto)\
                SELECT $1, codigo_producto, porc_iva, numero_unidades, valor_unitario, CURRENT_TIMESTAMP, usuario_id, tipo_producto\
                FROM ventas_ordenes_pedidos_d_tmp \
                WHERE pedido_cliente_id_tmp = $2\
                RETURNING pedido_cliente_id";

    G.db.transaction(sql, [numero_pedido, numero_cotizacion], function(err, rows, result){
        callback(err, rows, result);
    });
};


PedidosClienteModel.prototype.insertar_detalle_pedido = function(numero_pedido, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto, callback) {
    
    
    G.db.begin(function() {
        
        //función por implementar - conveniente hacerlo pero se debe validar primero con Mauricio - Se debe crear tabla para ello
        
//        __log_insertar_producto_detalle_pedido(numero_pedido, codigo_producto, usuario_id, function(err, rows, result){
//            
//            if(err){
//                    callback(err);
//                    return;
//                }
                
            __cambiar_estado_pedido(numero_pedido, function(err, rows, result){
                
                if(err){
                        callback(err);
                        return;
                    }
            
                __insertar_detalle_pedido(numero_pedido, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto, function(err, rows, result){

                    if(err){
                        callback(err);
                        return;
                    }

                    G.db.commit(function(){
                        callback(err, rows);
                    });
                });
            
            });
//        });
    });
    
    
    
//    var sql = "INSERT INTO ventas_ordenes_pedidos_d(pedido_cliente_id, codigo_producto, porc_iva, numero_unidades, valor_unitario, fecha_registro, usuario_id, tipo_producto)\n\
//                    VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7)";
//    
//    G.db.query(sql, [numero_pedido, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto], function(err, rows, result) {
//        callback(err, rows, result);
//    });
};

function __insertar_detalle_pedido(numero_pedido, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto, callback) {
    
    var sql = "INSERT INTO ventas_ordenes_pedidos_d(pedido_cliente_id, codigo_producto, porc_iva, numero_unidades, valor_unitario, fecha_registro, usuario_id, tipo_producto)\n\
                    VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7)";
    
    G.db.transaction(sql, [numero_pedido, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, tipo_producto], function(err, rows, result) {
        callback(err, rows, result);
    });
};

//eliminar_registro_detalle_pedido
PedidosClienteModel.prototype.eliminar_registro_detalle_pedido = function(numero_pedido, codigo_producto, usuario_solicitud, callback)
{
    /*var sql = "DELETE FROM ventas_ordenes_pedidos_d WHERE pedido_cliente_id = $1 and codigo_producto = $2";

    G.db.query(sql, [numero_pedido, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });*/
    
    G.db.begin(function() {
        
        __log_eliminar_producto_detalle_pedido(numero_pedido, codigo_producto, usuario_solicitud, function(err, rows, result){
            
            if(err){
                    callback(err);
                    return;
                }
            
            __eliminar_registro_detalle_pedido(numero_pedido, codigo_producto, function(err, rows, result){
               
                if(err){
                    callback(err);
                    return;
                }
                
                G.db.commit(function(){
                    callback(err, rows);
                });
            });
        });
    });
};

function __eliminar_registro_detalle_pedido(numero_cotizacion, codigo_producto, callback)
{
    var sql = "DELETE FROM ventas_ordenes_pedidos_d WHERE pedido_cliente_id = $1 and codigo_producto = $2";
    
    G.db.transaction(sql, [numero_cotizacion, codigo_producto], function(err, rows, result){
        callback(err, rows, result);
    });
};

function __log_eliminar_producto_detalle_cotizacion(numero_cotizacion, codigo_producto, usuario_solicitud, callback)
{
    
    var sql = " INSERT INTO log_eliminacion_cotizaciones_cliente(cotizacion_id,usuario_solicitud,codigo_producto,porc_iva,numero_unidades,valor_unitario,usuario_id,fecha_registro,usuario_ejecuta)\
                SELECT a.pedido_cliente_id_tmp, b.usuario, a.codigo_producto, a.porc_iva, a.numero_unidades, a.valor_unitario, a.usuario_id,CURRENT_TIMESTAMP, b.nombre\
                FROM ventas_ordenes_pedidos_d_tmp a\
                LEFT JOIN system_usuarios b on b.usuario_id = $3\
                WHERE a.pedido_cliente_id_tmp = $1\
                AND a.codigo_producto = $2";

    G.db.transaction(sql, [numero_cotizacion, codigo_producto, usuario_solicitud], function(err, rows, result){
        callback(err, rows, result);
    });
};

function __log_eliminar_producto_detalle_pedido(numero_pedido, codigo_producto, usuario_solicitud, callback)
{
    
    var sql = " INSERT INTO log_eliminacion_pedidos_cliente(pedido_id,usuario_solicitud,codigo_producto,porc_iva,numero_unidades,valor_unitario,usuario_id,fecha_registro,usuario_ejecuta)\
                SELECT a.pedido_cliente_id, b.usuario, a.codigo_producto, a.porc_iva, a.numero_unidades, a.valor_unitario, a.usuario_id,CURRENT_TIMESTAMP, b.nombre\
                FROM ventas_ordenes_pedidos_d a\
                LEFT JOIN system_usuarios b on b.usuario_id = $3\
                WHERE a.pedido_cliente_id = $1\
                AND a.codigo_producto = $2";

    G.db.transaction(sql, [numero_pedido, codigo_producto, usuario_solicitud], function(err, rows, result){
        callback(err, rows, result);
    });
};

//Modelo Modificar Cantidades Cotizacion
PedidosClienteModel.prototype.modificar_cantidades_cotizacion = function(numero_cotizacion, codigo_producto, usuario_solicitud, cantidad, callback)
{
    
    G.db.begin(function() {
        
        __log_eliminar_producto_detalle_cotizacion(numero_cotizacion, codigo_producto, usuario_solicitud, function(err, rows, result){
            
            if(err){
                    callback(err);
                    return;
                }
                
            __cambiar_estado_cotizacion(numero_cotizacion, '1', function(err, rows, result){
               if(err){
                    callback(err);
                    return;
                }
            
                __modificar_cantidades_cotizacion(numero_cotizacion, codigo_producto, cantidad, function(err, rows, result){

                    if(err){
                        callback(err);
                        return;
                    }

                    G.db.commit(function(){
                        callback(err, rows);
                    });
                });
            });
        });
    });
};


//Modelo Modificar Cantidades Pedido
PedidosClienteModel.prototype.modificar_cantidades_pedido = function(numero_pedido, codigo_producto, usuario_solicitud, cantidad, callback)
{
    
    G.db.begin(function() {
        
        __log_eliminar_producto_detalle_pedido(numero_pedido, codigo_producto, usuario_solicitud, function(err, rows, result){
            
            if(err){
                    callback(err);
                    return;
                }
                
            __cambiar_estado_pedido(numero_pedido, function(err, rows, result){
                
                if(err){
                        callback(err);
                        return;
                    }
            
                __modificar_cantidades_pedido(numero_pedido, codigo_producto, cantidad, function(err, rows, result){

                    if(err){
                        callback(err);
                        return;
                    }

                    G.db.commit(function(){
                        callback(err, rows);
                    });
                });
            
            });
        });
    });
};

//FUNCIONES DE ACTUALIZAR

function __modificar_cantidades_cotizacion(numero_cotizacion, codigo_producto, cantidad, callback)
{
    
    var sql = " UPDATE ventas_ordenes_pedidos_d_tmp SET numero_unidades = $3\
                WHERE pedido_cliente_id_tmp = $1\
                AND codigo_producto = $2";

    G.db.transaction(sql, [numero_cotizacion, codigo_producto, cantidad], function(err, rows, result){
        callback(err, rows, result);
    });
};

function __modificar_cantidades_pedido(numero_pedido, codigo_producto, cantidad, callback)
{
    
    var sql = " UPDATE ventas_ordenes_pedidos_d SET numero_unidades = $3\
                WHERE pedido_cliente_id = $1\
                AND codigo_producto = $2";

    G.db.transaction(sql, [numero_pedido, codigo_producto, cantidad], function(err, rows, result){
        callback(err, rows, result);
    });
};

function __cambiar_estado_pedido(numero_pedido, callback)
{
    
    var sql = " UPDATE ventas_ordenes_pedidos SET estado = '0'\
                WHERE pedido_cliente_id = $1";

    G.db.transaction(sql, [numero_pedido], function(err, rows, result){
        callback(err, rows, result);
    });
};

PedidosClienteModel.$inject = ["m_productos"];


module.exports = PedidosClienteModel;