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
                when a.estado_pedido = 7 then 'En Auditoria' end as descripcion_estado_actual_pedido, \
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

    G.db.pagination(sql, [empresa_id, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
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
                     when a.estado_pedido = 7 then 'En Auditoria' end as descripcion_estado_actual_pedido, \
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
                     when a.estado_pedido = 7 then 'En Auditoria' end as descripcion_estado_actual_pedido, \
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
                where a.empresa_id = $1 and b.codigo_producto = $2 and b.numero_unidades <> b.cantidad_despachada and a.estado = '1'  \
                GROUP BY 1";

    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {
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
                     when a.estado=7 then 'En Auditoria' end as descripcion_estado,\
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
PedidosClienteModel.prototype.obtenerDetalleRotulo = function(numero_pedido, numero_caja, callback) {


    var sql = "SELECT a.direccion, a.cliente, '' AS departamento, a.numero_caja FROM inv_rotulo_caja a\
               WHERE a.solicitud_prod_a_bod_ppal_id = $1 AND a.numero_caja = $2;";

    G.db.query(sql, [numero_pedido, numero_caja], function(err, rows, result) {
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
                a.fecha_registro\
                FROM ventas_ordenes_pedidos a\
                inner JOIN ventas_ordenes_pedidos_d AS b ON a.pedido_cliente_id = b.pedido_cliente_id\
                inner JOIN terceros as c ON (a.tipo_id_tercero = c.tipo_id_tercero) AND (a.tercero_id = c.tercero_id)\
                JOIN system_usuarios as d ON (a.usuario_id = d.usuario_id)\
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
PedidosClienteModel.prototype.insertar_cotizacion = function(empresa_id, tipo_id_tercero, tercero_id, usuario_id, tipo_id_vendedor, vendedor_id, estado, observaciones, callback) {
    
    var sql = "INSERT INTO ventas_ordenes_pedidos_tmp(empresa_id, tipo_id_tercero, tercero_id, fecha_registro, usuario_id, tipo_id_vendedor, vendedor_id, estado, observaciones) \
                VALUES($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7, $8) \
                RETURNING pedido_cliente_id_tmp";

    G.db.query(sql, [empresa_id, tipo_id_tercero, tercero_id, usuario_id, tipo_id_vendedor, vendedor_id, estado, observaciones], function(err, rows, result) {
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
PedidosClienteModel.prototype.insertar_detalle_cotizacion = function(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id, callback) {
    
    var sql = "INSERT INTO ventas_ordenes_pedidos_d_tmp(pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, fecha_registro, usuario_id) \
                VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)";

    G.db.query(sql, [pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario, usuario_id], function(err, rows, result) {
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
                    a.fecha_registro,\
                    a.usuario_id,\
                    a.fecha_envio,\
                    a.tipo_id_vendedor,\
                    a.vendedor_id,\
                    SUM((b.valor_unitario + (b.valor_unitario * b.porc_iva)/100) * b.numero_unidades) as valor_cotizacion,\
                    a.estado,\
                    a.observaciones,\
                    c.tipo_pais_id as tipo_pais_cliente,\
                    c.tipo_dpto_id as tipo_departamento_cliente,\
                    c.tipo_mpio_id as tipo_municipio_cliente,\
                    c.direccion as direccion_cliente,\
                    c.telefono as telefono_cliente,\
                    c.nombre_tercero as nombre_cliente,\
                    d.nombre as nombre_vendedor,\
                    d.telefono as telefono_vendedor\
                from ventas_ordenes_pedidos_tmp a\
                    join ventas_ordenes_pedidos_d_tmp b on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp\
                    join terceros c on c.tipo_id_tercero = a.tipo_id_tercero\
                        and c.tercero_id = a.tercero_id\
                    join vnts_vendedores d on d.tipo_id_vendedor = a.tipo_id_vendedor\
                        and d.vendedor_id = a.vendedor_id\
                where a.empresa_id = $1\
                    and a.estado = 1\
                    and (   a.pedido_cliente_id_tmp ilike $2\
                            or c.nombre_tercero ilike $2\
                            or d.nombre ilike $2    )\
                group by a.pedido_cliente_id_tmp, a.empresa_id, a.tipo_id_tercero, a.tercero_id, a.fecha_registro, a.usuario_id, a.fecha_envio,\
                a.tipo_id_vendedor, a.vendedor_id, a.estado, a.observaciones, c.tipo_pais_id, c.tipo_dpto_id, c.tipo_mpio_id, c.direccion,\
                c.telefono, c.nombre_tercero, d.nombre, d.telefono\
";
    
    G.db.pagination(sql, [empresa_id, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows);
    }); 

};

PedidosClienteModel.$inject = ["m_productos"];


module.exports = PedidosClienteModel;