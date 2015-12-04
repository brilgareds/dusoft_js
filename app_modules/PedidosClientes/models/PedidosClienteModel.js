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

PedidosClienteModel.prototype.listar_pedidos_clientes = function(empresa_id, termino_busqueda, filtro, pagina,estadoPedido,estadoSolicitud, callback) {

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

    var estado = "";

    if (filtro !== undefined) {

        if (filtro.no_asignados) {
            estado = '0';
        }

        if (filtro.asignados) {
            estado = '1';
        }
        if (filtro.auditados) {
            estado = '2';
        }

        if (filtro.en_zona_despacho) {
            estado = '3';
        }

        if (filtro.despachado) {
            estado = '4';
        }

        if (filtro.despachado_pendientes) {
            estado = '5';
        }

        if (filtro.separacion_finalizada) {
            estado = '6';
        }

        if (filtro.en_auditoria) {
            estado = '7';
        }

        if (filtro.auditados_pdtes) {
            estado = '8';
        }

        if (filtro.en_zona_despacho_pdtes) {
            estado = '9';
        }
    }

    var columns = [
        "a.empresa_id",
        "a.centro_destino as centro_utilidad_id",
        "a.bodega_destino as bodega_id",
        "a.pedido_cliente_id as numero_pedido",
        "b.tipo_id_tercero as tipo_id_cliente",
        "b.tercero_id as identificacion_cliente",
        "b.nombre_tercero as nombre_cliente",
        "b.direccion as direccion_cliente",
        "b.telefono as telefono_cliente",
        "c.tipo_id_vendedor",
        "c.vendedor_id as idetificacion_vendedor",
        "c.nombre as nombre_vendedor",
        "a.estado",
        G.knex.raw("case when a.estado = '0' then 'Inactivo '\
                    when a.estado = '1' then 'Activo'\
                    when a.estado = '2' then 'Anulado'\
                    when a.estado = '3' then 'Entregado'\
                    when a.estado = '4' then 'Debe autorizar cartera' end as descripcion_estado"),
        "a.estado_pedido as estado_actual_pedido",
        G.knex.raw("case when a.estado_pedido = '0' AND a.estado != '4' then 'No Asignado'\
                    when a.estado_pedido = '1' then 'Asignado'\
                    when a.estado_pedido = '2' then 'Auditado'\
                    when a.estado_pedido = '3' then 'En Zona Despacho'\
                    when a.estado_pedido = '4' then 'Despachado'\
                    when a.estado_pedido = '5' then 'Despachado con Pendientes'\
                    when a.estado_pedido = '6' then 'Separacion Finalizada'\
                    when a.estado_pedido = '7' then 'En Auditoria'\
                    when a.estado_pedido = '8' then 'Auditado con pdtes'\
                    when a.estado_pedido = '9' then 'En zona con pdtes'\
                    when a.estado = '4' then 'Debe autorizar cartera' end as descripcion_estado_actual_pedido"),
        "d.estado as estado_separacion",
        G.knex.raw("to_char(a.fecha_registro, 'dd-mm-yyyy') as fecha_registro")
    ];

    G.knex.column(columns).
            from("ventas_ordenes_pedidos as a").
            innerJoin("terceros as b", function() {
        this.on("a.tipo_id_tercero", "b.tipo_id_tercero").
                on("a.tercero_id", "b.tercero_id");
    }).
            innerJoin("vnts_vendedores as c", function() {
        this.on("a.tipo_id_vendedor", "c.tipo_id_vendedor").
                on("a.vendedor_id", "c.vendedor_id");
    }).
            leftJoin("inv_bodegas_movimiento_tmp_despachos_clientes as d", "a.pedido_cliente_id", "d.pedido_cliente_id").
            where(function() {
        this.where("a.empresa_id", empresa_id);

        if (estado !== "") {
            this.where("a.estado_pedido", estado);
        }
    }).
            andWhere(function() {
        this.where(G.knex.raw("a.pedido_cliente_id::varchar"), G.constants.db().LIKE, "%" + termino_busqueda + "%").
                orWhere("b.tercero_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                orWhere("b.nombre_tercero", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                orWhere("c.nombre", G.constants.db().LIKE, "%" + termino_busqueda + "%");

    }).
            andWhere('a.estado',G.constants.db().LIKE,"%" + estadoPedido + "%").
            andWhere('a.estado_pedido',G.constants.db().LIKE,"%" + estadoSolicitud + "%").
            limit(G.settings.limit).
            offset((pagina - 1) * G.settings.limit).
            orderByRaw("4 DESC").
            then(function(rows) {
      
        callback(false, rows);
    }).
            catch (function(err) {

        callback(err);
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

    var columnas = [
        "a.pedido_cliente_id as numero_pedido",
        "b.tipo_id_tercero as tipo_id_cliente",
        "b.tercero_id as identificacion_cliente",
        "b.nombre_tercero as nombre_cliente",
        "b.direccion as direccion_cliente",
        "b.telefono as telefono_cliente",
        G.knex.raw("coalesce(f.contrato_cliente_id, (SELECT contrato_cliente_id FROM vnts_contratos_clientes WHERE estado = '1' and contrato_generico = '1')) as contrato_cliente_id"),
        "c.tipo_id_vendedor",
        "c.vendedor_id as idetificacion_vendedor",
        "c.nombre as nombre_vendedor",
        "a.estado",
        G.knex.raw("case when a.estado = '0' then 'Inactivo '\
             when a.estado = '1' then 'Activo'\
             when a.estado = '2' then 'Anulado'\
             when a.estado = '3' then 'Entregado' end as descripcion_estado"),
        "a.estado_pedido as estado_actual_pedido",
        G.knex.raw("case when a.estado_pedido = '0' then 'No Asignado'\
             when a.estado_pedido = '1' then 'Asignado'\
             when a.estado_pedido = '2' then 'Auditado'\
             when a.estado_pedido = '3' then 'En Zona Despacho'\
             when a.estado_pedido = '4' then 'Despachado'\
             when a.estado_pedido = '5' then 'Despachado con Pendientes'\
             when a.estado_pedido = '6' then 'Separacion Finalizada'\
             when a.estado_pedido = '7' then 'En Auditoria'\
             when a.estado_pedido = '8' then 'Auditado con pdtes'\
             when a.estado_pedido = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido"),
        "d.estado as estado_separacion",
        "a.observacion",
        "a.observacion_cartera",
        "a.sw_aprobado_cartera",
        G.knex.raw("coalesce(a.tipo_producto,'') as tipo_producto"),
        G.knex.raw("coalesce(e.descripcion,'') as descripcion_tipo_producto"),
        "a.fecha_registro",
        "g.nombre",
        "h.razon_social"
    ];

    G.knex.column(columnas).
            from("ventas_ordenes_pedidos as a").
            innerJoin("terceros as b", function() {
        this.on("a.tipo_id_tercero", "b.tipo_id_tercero").
                on("a.tercero_id", "b.tercero_id");
    }).
            innerJoin("vnts_vendedores as c", function() {
        this.on("a.tipo_id_vendedor", "c.tipo_id_vendedor").
                on("a.vendedor_id", "c.vendedor_id");
    }).
            leftJoin("inv_bodegas_movimiento_tmp_despachos_clientes as d", "a.pedido_cliente_id", "d.pedido_cliente_id").
            leftJoin("inv_tipo_producto as e", "a.tipo_producto", "e.tipo_producto_id").
            leftJoin("vnts_contratos_clientes as f", function() {
        this.on("b.tipo_id_tercero", "f.tipo_id_tercero").
                on("b.tercero_id", "f.tercero_id").
                on("a.empresa_id", "f.empresa_id").
                on(G.knex.raw("f.estado = '1'"));
    })
            .innerJoin("system_usuarios as g", "g.usuario_id", "a.usuario_id")
            .innerJoin("empresas as h", "h.empresa_id", "a.empresa_id")

            .where("a.pedido_cliente_id", numero_pedido).
            orderByRaw("1 desc")
            .then(function(rows) {
        callback(false, rows);
    }). catch (function(err) {

        callback(err);
    }).done();


};


/*
 * @Autor : Cristian Ardila
 * +Descripcion : Se consulta el detallado de un pedido que
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Model: PedidosClienteModel
 *  --PedidosClienteModel.prototype.consultarDetallePedido
 *
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
                    /*a.cantidad_facturada::integer,*/ \
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
                    COALESCE(b.auditado, '0') as auditado,\
                    c.codigo_barras, \
                   (a.numero_unidades * a.valor_unitario)  as subtotal,\
                   ((a.valor_unitario+(a.valor_unitario*(a.porc_iva/100))) * a.numero_unidades) as total\
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
                    where a.pedido_cliente_id = ?  order by e.descripcion ;";

    G.knex.raw(sql, [numero_pedido]).
            then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        callback(err);
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

    var columnas = [
        "a.empresa_id as empresa_destino",
        "a.centro_destino",
        "a.bodega_destino",
        "f.doc_tmp_id as documento_temporal_id",
        "a.pedido_cliente_id as numero_pedido",
        "b.tipo_id_tercero as tipo_id_cliente",
        "b.tercero_id as identificacion_cliente",
        "b.nombre_tercero as nombre_cliente",
        "b.direccion as direccion_cliente",
        "b.telefono as telefono_cliente",
        "c.tipo_id_vendedor",
        "c.vendedor_id as idetificacion_vendedor",
        "c.nombre as nombre_vendedor",
        "a.estado",
        G.knex.raw("case when a.estado = '0' then 'Inactivo'\
                    when a.estado = '1' then 'Activo'\
                    when a.estado = '2' then 'Anulado'\
                    when a.estado = '3' then 'Entregado' end as descripcion_estado"),
        "a.estado_pedido as estado_actual_pedido",
        G.knex.raw("case when a.estado_pedido = '0' then 'No Asignado'\
                    when a.estado_pedido = '1' then 'Asignado'\
                    when a.estado_pedido = '2' then 'Auditado'\
                    when a.estado_pedido = '3' then 'En Zona Despacho'\
                    when a.estado_pedido = '4' then 'Despachado'\
                    when a.estado_pedido = '5' then 'Despachado con Pendientes'\
                    when a.estado_pedido = '6' then 'Separacion Finalizada'\
                    when a.estado_pedido = '7' then 'En Auditoria'\
                    when a.estado_pedido = '8' then 'Auditado con pdtes'\
                    when a.estado_pedido = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido"),
        "f.estado as estado_separacion",
        G.knex.raw("case when f.estado = '0' then 'Separacion en Proceso'\
                    when f.estado = '1' then 'Separacion Finalizada' end as descripcion_estado_separacion"),
        "a.fecha_registro",
        "d.responsable_id",
        "e.nombre as responsable_pedido",
        "d.fecha as fecha_asignacion_pedido",
        "g.fecha_registro as fecha_separacion_pedido"
    ];

    var query = G.knex.column(columnas).
            from("ventas_ordenes_pedidos as a").
            innerJoin("terceros as b", function() {
        this.on("a.tipo_id_tercero", "b.tipo_id_tercero").
                on("a.tercero_id", "b.tercero_id");
    }).
            innerJoin("vnts_vendedores as c", function() {
        this.on("a.tipo_id_vendedor", "c.tipo_id_vendedor").
                on("a.vendedor_id", "c.vendedor_id");

    }).
            innerJoin("ventas_ordenes_pedidos_estado as d", function() {
        this.on("a.pedido_cliente_id", "d.pedido_cliente_id").
                on("a.estado_pedido", "d.estado").
                on(G.knex.raw("(d.sw_terminado is null or d.sw_terminado = ?)", ['0']));

    }).
            innerJoin("operarios_bodega as e", "d.responsable_id", "e.operario_id").
            leftJoin("inv_bodegas_movimiento_tmp_despachos_clientes as f", "a.pedido_cliente_id", "f.pedido_cliente_id").
            leftJoin("inv_bodegas_movimiento_tmp as g", function() {
        this.on("f.usuario_id", "g.usuario_id").
                on("f.doc_tmp_id", "g.doc_tmp_id");
    }).
            where(function() {

        /*=========================================================================*/
        // Se implementa este filtro, para poder filtrar los pedidos del clientes 
        // asignados al operario de bodega y saber si el pedido tiene temporales o 
        // fue finalizado correctamente.
        /*=========================================================================*/

        var estado_pedido = '1';
        if (filtro !== undefined) {

            if (filtro.asignados) {
                this.whereRaw(" f.doc_tmp_id IS NULL and  e.usuario_id = ? ", [responsable]);
            }

            if (filtro.temporales) {
                this.whereRaw("  f.doc_tmp_id IS NOT NULL AND f.estado = '0' and  e.usuario_id = ? ", [responsable]);
            }
            if (filtro.finalizados) {
                estado_pedido = '7';
                this.whereRaw(" e.usuario_id = (select usuario_id from operarios_bodega where operario_id = d.responsable_id ) and  g.usuario_id = ?", [responsable]);
            }
        }

        this.where("a.estado_pedido", estado_pedido);

    });

    if (filtro.numeroPedido) {

        query.where(G.knex.raw("a.pedido_cliente_id :: varchar"), "=", termino_busqueda);
    } else {

        query.andWhere(function() {
            this.where(G.knex.raw("a.pedido_cliente_id :: varchar"), G.constants.db().LIKE, "%" + termino_busqueda + "%").
                    orWhere("b.tercero_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                    orWhere("b.nombre_tercero", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                    orWhere("c.vendedor_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
                    orWhere("c.nombre", G.constants.db().LIKE, "%" + termino_busqueda + "%");
        });
    }
    query.totalRegistros = 0;
    query.then(function(total) {
        var registros = query.
                limit(limite).
                offset((pagina - 1) * limite).
                orderBy("d.fecha", "asc");

        query.totalRegistros = total.length;
        return registros;

    }).then(function(rows) {
        callback(false, rows, query.totalRegistros);
    }).
            catch (function(err) {

        callback(err);
    }).
            done();

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
    var that = this;

    G.knex.column("*").
            from("ventas_ordenes_pedidos_estado as a").
            where("a.pedido_cliente_id", numero_pedido).
            andWhere("a.estado", estado_pedido).
            whereRaw("(a.sw_terminado is null or a.sw_terminado = '0')").then(function(responsable_estado_pedido) {
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

    }). catch (function(err) {
        callback(err);
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

    G.knex("ventas_ordenes_pedidos_estado").
            returning("venta_orden_pedido_estado_id").
            insert({pedido_cliente_id: numero_pedido, estado: estado_pedido, responsable_id: responsable, fecha: 'now()', usuario_id: usuario}).
            then(function(resultado) {

        callback(false, resultado);
    }). catch (function(err) {
        callback(err);
    }).done();

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

    G.knex("ventas_ordenes_pedidos_estado").
            where("pedido_cliente_id", numero_pedido).
            andWhere("estado", estado_pedido).
            whereRaw("(sw_terminado is null or sw_terminado = '0')").
            returning('venta_orden_pedido_estado_id').
            update({responsable_id: responsable, fecha: 'NOW()', usuario_id: usuario}).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        callback(err);
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
    G.knex("ventas_ordenes_pedidos_estado").
            where("pedido_cliente_id", numero_pedido).
            whereRaw("(sw_terminado is null or sw_terminado = '0')").del().
            then(function(rows) {
        callback(false, rows);
    }). catch (function(err) {

        callback(err);
    }).done();

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

    G.knex("ventas_ordenes_pedidos").
            where("pedido_cliente_id", numero_pedido).
            update({estado_pedido: estado_pedido}).then(function(resultado) {

        callback(false, resultado);
    }). catch (function(err) {
        callback(err);
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
                WHERE b.codigo_producto = :1 and a.estado = '1' AND a.fecha_registro < :2\
                GROUP BY b.codigo_producto";

    G.knex.raw(sql, {1: codigo_producto, 2: fecha_registro_pedido}).
    then(function(resultado){
        callback(false, resultado.rows);
    }).
    catch(function(err) {
        callback(err);
    });

};


// lista todos los responsables del pedido
PedidosClienteModel.prototype.obtener_responsables_del_pedido = function(numero_pedido, callback) {

    var columnas = [
        "a.pedido_cliente_id as numero_pedido",
        "a.estado",
        G.knex.raw("case when a.estado='0' then 'No Asignado'\
             when a.estado='1' then 'Asignado'\
             when a.estado='2' then 'Auditado'\
             when a.estado='3' then 'En Zona Despacho'\
             when a.estado='4' then 'Despachado'\
             when a.estado='5' then 'Despachado con Pendientes'\
             when a.estado='6' then 'Separacion Finalizada'\
             when a.estado='7' then 'En Auditoria'\
             when a.estado='8' then 'Auditado con pdtes'\
             when a.estado='9' then 'En zona con pdtes' end as descripcion_estado"),
        "b.operario_id",
        "b.nombre as nombre_responsable",
        "b.usuario_id as usuario_id_responsable",
        "a.usuario_id",
        "c.nombre as nombre_usuario",
        "a.fecha as fecha_asignacion",
        "a.fecha_registro",
        G.knex.raw("COALESCE(a.sw_terminado,'0') as sw_terminado")
    ];

    var sql = G.knex.columns(columnas).
            from("ventas_ordenes_pedidos_estado as a").
            innerJoin("system_usuarios as c", "a.usuario_id", "c.usuario_id").
            leftJoin("operarios_bodega as b", "a.responsable_id", "b.operario_id").
            where("a.pedido_cliente_id", numero_pedido).
            orderBy("a.fecha_registro", "desc").
            then(function(rows) {
        callback(false, rows);
    }). catch (function(err) {

        callback(err);
    }).done();

};


PedidosClienteModel.prototype.terminar_estado_pedido = function(numero_pedido, estados, terminado, callback) {

    estados = estados.join(",");

    var sql = "update ventas_ordenes_pedidos_estado set sw_terminado = :2\
               where  pedido_cliente_id = :1 and estado :: integer in(" + estados + ") and (sw_terminado is null or sw_terminado = '0')";

    G.knex.raw(sql, {1: numero_pedido, 2: terminado}).
            then(function(resultado) {
        callback(false, resultado.rows, resultado);
    }). catch (function(err) {
        callback(err);
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

PedidosClienteModel.prototype.actualizar_despachos_pedidos_cliente = function(numero_pedido, prefijo_documento, numero_documento, transaccion, callback) {
    var sql = "select b.codigo_producto, sum(b.cantidad) AS cantidad_despachada, b.prefijo, b.numero\
                from inv_bodegas_movimiento_despachos_clientes a\
                inner join inv_bodegas_movimiento_d b on a.empresa_id =b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                where a.pedido_cliente_id = :1 and a.numero= :3 and a.prefijo= :2 group by 1,3,4";


    G.knex.raw(sql, {1: numero_pedido, 2: prefijo_documento, 3: numero_documento}).
            transacting(transaccion).
            then(function(resultado) {

        var length = resultado.rows.length;

        resultado.rows.forEach(function(row) {

            var cantidad_despachada = parseInt(row.cantidad_despachada);

            sql = "UPDATE ventas_ordenes_pedidos_d\
                    SET cantidad_despachada= cantidad_despachada + :1\
                    WHERE   pedido_cliente_id = :2\
                    AND  codigo_producto = :3\
                    AND cantidad_despachada < numero_unidades ";


            G.knex.raw(sql, {1: cantidad_despachada, 2: numero_pedido, 3: row.codigo_producto}).
                    transacting(transaccion).
                    then(function(resultado2) {

                if (--length === 0) {
                    callback(false, resultado2.rows);
                    return;
                }
            }).
                    catch (function(err) {
                callback(err);
            });

        });

    }). catch (function(err) {
        callback(err);
    });
};

/*
 * Author : Camilo Orozco
 * Descripcion :  SQL listado de productos para la seleccion de medicamentos en una cotizacion o en un pedido de cliente.
 * Funciones que usan el model:
 *  (PedidosClienteController.js)-- __validar_datos_productos_archivo_plano
 */
PedidosClienteModel.prototype.listar_productos = function(empresa, centro_utilidad_id, bodega_id, contrato_cliente_id, filtro, pagina,filtros, callback) {

    var filtroProducto ="";
    var sql_aux = "";
    var termino_busqueda = filtro.termino_busqueda;
    var tipo_producto = filtro.tipo_producto;
    var laboratorio_id = filtro.laboratorio_id;
    var parametros = [empresa, centro_utilidad_id, bodega_id, contrato_cliente_id];
    
    
    if (tipo_producto !== undefined && tipo_producto !== ''){
        sql_aux = " and b.tipo_producto_id = '" + tipo_producto + "'";
    }
    if (laboratorio_id !== undefined && laboratorio_id !== ''){
        sql_aux += " and f.clase_id = '" + laboratorio_id + "'";
    }
    if(filtros.tipo_busqueda === 0){
        filtroProducto = "AND (fc_descripcion_producto(b.codigo_producto) ilike $5)";
        parametros.push(termino_busqueda + '%');
    } 
    
    if(filtros.tipo_busqueda === 1){
        filtroProducto = "AND (e.descripcion ilike $5)";
         parametros.push(termino_busqueda + '%');
    }
    
    if(filtros.tipo_busqueda === 2){
        filtroProducto = "AND (a.codigo_producto ilike $5)";
         parametros.push(termino_busqueda + '%');
    
    }
    
    if(filtros === ''){
        filtroProducto = "AND (a.codigo_producto ilike $5)";
         parametros.push(termino_busqueda + '%');
    
    }
    var sql = " select \
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                b.tipo_producto_id,\
                d.descripcion as descripcion_tipo_producto,\
                b.codigo_cum,\
                b.codigo_invima,\
                b.vencimiento_codigo_invima,\
                b.porc_iva as iva,\
                a.existencia::integer as existencia,\
                coalesce(h.cantidad_total_pendiente, 0)::integer as cantidad_total_pendiente,\
                case when coalesce((a.existencia - coalesce(h.cantidad_total_pendiente, 0) - coalesce(i.total_solicitado, 0) )::integer, 0) < 0 then 0 \
                        else coalesce((a.existencia - coalesce(h.cantidad_total_pendiente, 0) - coalesce(i.total_solicitado, 0) )::integer, 0) end as cantidad_disponible,\
                case when g.precio_pactado > 0 then true else false end as tiene_precio_pactado,\
                split_part(coalesce(fc_precio_producto_contrato_cliente($4,a.codigo_producto,$1),'0'), '@', 1) as precio_producto,\
                b.sw_regulado,\
                c.precio_regulado,\
                b.estado,\n\
                c.costo_ultima_compra\
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
                    select aa.empresa_id, aa.codigo_producto, sum(aa.cantidad_total_pendiente) as cantidad_total_pendiente\
                    from (\
                      select a.empresa_id, b.codigo_producto, SUM((b.numero_unidades - b.cantidad_despachada)) as cantidad_total_pendiente, 1\
                      from ventas_ordenes_pedidos a\
                      inner join ventas_ordenes_pedidos_d b ON a.pedido_cliente_id = b.pedido_cliente_id\
                      where (b.numero_unidades - b.cantidad_despachada) > 0  and a.estado='1' \
                      group by 1,2 \
                      UNION\
                      select a.empresa_destino as empresa_id, b.codigo_producto, SUM( b.cantidad_pendiente) AS cantidad_total_pendiente, 2\
                      from solicitud_productos_a_bodega_principal a \
                      inner join solicitud_productos_a_bodega_principal_detalle b ON a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id    \
                      where b.cantidad_pendiente > 0 \
                      group by 1,2\
                    ) aa group by 1,2\
                ) h on (a.empresa_id = h.empresa_id) and c.codigo_producto = h.codigo_producto\
                left join(\
                   SELECT aa.empresa_id, aa.codigo_producto, SUM(aa.total_reservado) as total_solicitado FROM( \
                        select b.codigo_producto, a.empresa_destino as empresa_id, /*a.centro_destino as centro_destino, a.bogega_destino as bodega_destino,*/ SUM(cantidad_solic)::integer as total_reservado\
                        from  solicitud_bodega_principal_aux a\
                        inner join solicitud_pro_a_bod_prpal_tmp b on a.farmacia_id = b.farmacia_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega and a.usuario_id = b.usuario_id\
                        group by 1,2\
                        union\
                        SELECT b.codigo_producto, a.empresa_id, sum(b.numero_unidades)::integer as total_reservado from ventas_ordenes_pedidos_tmp a\
                        INNER JOIN ventas_ordenes_pedidos_d_tmp b on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp\
                        WHERE  a.estado = '1'\
                        GROUP BY 1,2\
                    ) aa group by 1,2\
                ) i on (a.empresa_id = i.empresa_id) and c.codigo_producto = i.codigo_producto \
                where a.empresa_id = $1 and a.centro_utilidad = $2 and a.bodega = $3 " + sql_aux + " \
                 " + filtroProducto;
               
    G.db.paginated(sql, parametros, pagina, G.settings.limit, function(err, rows, result) {

        callback(err, rows);
        
    });
};


/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Insertar Cotizacion
 */
PedidosClienteModel.prototype.insertar_cotizacion = function(cotizacion, callback) {

    var sql = " INSERT INTO ventas_ordenes_pedidos_tmp (\
                empresa_id, \
                centro_destino, \
                bodega_destino, \
                tipo_id_tercero, \
                tercero_id, \
                tipo_id_vendedor, \
                vendedor_id, \
                observaciones, \
                tipo_producto, \
                estado, \
                usuario_id , \
                fecha_registro ) \
                VALUES( $1, $2, $3, $4, $5, $6, $7, $8, $9, '1', $10, NOW()) \
                RETURNING pedido_cliente_id_tmp as numero_cotizacion ;";

    var params = [
        cotizacion.empresa_id,
        cotizacion.centro_utilidad_id,
        cotizacion.bodega_id,
        cotizacion.cliente.tipo_id_tercero,
        cotizacion.cliente.id,
        cotizacion.vendedor.tipo_id_tercero,
        cotizacion.vendedor.id,
        cotizacion.observacion,
        cotizacion.tipo_producto,
        cotizacion.usuario_id
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows, result);
    });

};


/*
 * @author : Cristian Ardila
 * @fecha:  02/12/2015
 * Descripcion :  SQL Insertar Detalle Cotizacion
 */
PedidosClienteModel.prototype.insertar_detalle_cotizacion = function(cotizacion, producto, callback) {


 var sql = "  INSERT INTO ventas_ordenes_pedidos_d_tmp (pedido_cliente_id_tmp, codigo_producto, porc_iva, numero_unidades, valor_unitario,usuario_id,fecha_registro) \
                 VALUES ( :1, :2, :3, :4, :5, :6, NOW() ) ; ";

    G.knex.raw(sql, {1:cotizacion.numero_cotizacion, 2:producto.codigo_producto, 3:producto.iva, 4:producto.cantidad_solicitada, 5:producto.precio_venta, 6:cotizacion.usuario_id}).
    then(function(resultado){
       callback(false, resultado);
    }).catch(function(err){
     
       callback(err);
    });
    
   
};


/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Modificar Detalle Cotizacion
 */
PedidosClienteModel.prototype.modificar_detalle_cotizacion = function(cotizacion, producto, callback) {

    var sql = " UPDATE ventas_ordenes_pedidos_d_tmp SET porc_iva = $3, numero_unidades = $4, valor_unitario = $5, usuario_id = $6, fecha_registro = NOW() \n\
                WHERE pedido_cliente_id_tmp = $1 and codigo_producto = $2 ;";

    var params = [
        cotizacion.numero_cotizacion,
        producto.codigo_producto,
        producto.iva,
        producto.cantidad_solicitada,
        producto.precio_venta,
        cotizacion.usuario_id
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows, result);
    });

};

/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Listar Cotizaciones
 */
PedidosClienteModel.prototype.listar_cotizaciones = function(empresa_id, fecha_inicial, fecha_final, termino_busqueda, pagina,estadoCotizacion, callback) {
    
  

     var sql = " select \
     a.empresa_id,\
     a.centro_destino as centro_utilidad_id,\
     a.bodega_destino as bodega_id,\
     a.pedido_cliente_id_tmp as numero_cotizacion,\
     a.tipo_id_tercero,\
     a.tercero_id,\
     b.nombre_tercero,\
     b.direccion,\
     b.telefono,\
     b.email,\
     e.pais,\
     d.departamento,\
     c.municipio,\
     f.tipo_id_vendedor,\
     f.vendedor_id,\
     f.nombre as nombre_vendendor,\
     f.telefono as telefono_vendedor,\
     a.observaciones,\
     coalesce(a.observacion_cartera, '') as observacion_cartera,\
     coalesce(a.sw_aprobado_cartera, '') as sw_aprobado_cartera,\
     coalesce(a.tipo_producto,'') as tipo_producto,\
     coalesce(g.descripcion,'') as descripcion_tipo_producto,\
     a.estado,\
     case when a.estado = '0' then 'Inactivo'\
     when a.estado = '1' then 'Activo'\
     when a.estado = '2' then 'Anulado'\
     when a.estado = '3' then 'Aprobado cartera'\
     when a.estado = '5' then 'Tiene un pedido'\
     when a.estado = '6' then 'Se solicita autorizacion'\
     when a.estado = '4' then 'No autorizado por cartera' end as descripcion_estado,\
     a.fecha_registro\
     from ventas_ordenes_pedidos_tmp a\
     inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
     inner join tipo_mpios c on b.tipo_pais_id = c.tipo_pais_id and b.tipo_dpto_id = c.tipo_dpto_id and b.tipo_mpio_id = c.tipo_mpio_id\
     inner join tipo_dptos d on c.tipo_pais_id = d.tipo_pais_id and c.tipo_dpto_id = d.tipo_dpto_id\
     inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
     inner join vnts_vendedores f on a.tipo_id_vendedor = f.tipo_id_vendedor and a.vendedor_id = f.vendedor_id \
     left join inv_tipo_producto g on a.tipo_producto = g.tipo_producto_id \
     where a.empresa_id= $1 and a.fecha_registro between $2 and $3 and\
     (\
     a.pedido_cliente_id_tmp::varchar ilike $4 or\
     a.tercero_id ilike $4 or	\
     b.nombre_tercero ilike $4 or\
     f.vendedor_id ilike $4 or	\
     f.nombre ilike $4 \
     )\
     AND a.estado ilike $5 order by 4 desc ";
     
     G.db.paginated(sql, [empresa_id, fecha_inicial, fecha_final, "%" + termino_busqueda + "%", "%" + estadoCotizacion + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
     callback(err, rows);
     });

};

/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Consultar Cotizacion
 */
PedidosClienteModel.prototype.consultar_cotizacion = function(cotizacion, callback) {
//
    var sql = " select\
                a.empresa_id,\
                a.centro_destino as centro_utilidad_id,\
                a.bodega_destino as bodega_id,\
                a.pedido_cliente_id_tmp as numero_cotizacion,\
                coalesce(h.contrato_cliente_id, (SELECT contrato_cliente_id FROM vnts_contratos_clientes WHERE estado = '1' and contrato_generico = '1')) as contrato_cliente_id,\
                a.tipo_id_tercero,\
                a.tercero_id,\
                b.nombre_tercero,\
                b.direccion,\
                b.telefono,\
                b.email,\
                e.pais,\
                d.departamento,\
                c.municipio,\
                f.tipo_id_vendedor,\
                f.vendedor_id,\
                f.nombre as nombre_vendendor,\
                f.telefono as telefono_vendedor,\
                a.observaciones,\
                coalesce(a.observacion_cartera, '') as observacion_cartera,\
                coalesce(a.sw_aprobado_cartera, '') as sw_aprobado_cartera,\
                coalesce(a.tipo_producto,'') as tipo_producto,\
                coalesce(g.descripcion,'') as descripcion_tipo_producto,\
                a.estado,\
                case when a.estado = '0' then 'Inactivo'\
                     when a.estado = '1' then 'Activo'\
                     when a.estado = '2' then 'Anulado'\
                     when a.estado = '3' then 'Aprobado cartera'\
                     when a.estado = '5' then 'Tiene un pedido'\
                     when a.estado = '6' then 'Se solicita autorizacion'\
                     when a.estado = '4' then 'Desaprobado por cartera' end as descripcion_estado,\
                a.fecha_registro,\
                j.razon_social,\
                k.nombre as usuario_cotizacion\
                from ventas_ordenes_pedidos_tmp a\
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                inner join tipo_mpios c on b.tipo_pais_id = c.tipo_pais_id and b.tipo_dpto_id = c.tipo_dpto_id and b.tipo_mpio_id = c.tipo_mpio_id\
                inner join tipo_dptos d on c.tipo_pais_id = d.tipo_pais_id and c.tipo_dpto_id = d.tipo_dpto_id\
                inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
                inner join vnts_vendedores f on a.tipo_id_vendedor = f.tipo_id_vendedor and a.vendedor_id = f.vendedor_id \
                left join inv_tipo_producto g on a.tipo_producto = g.tipo_producto_id \
                left join vnts_contratos_clientes h ON b.tipo_id_tercero = h.tipo_id_tercero AND b.tercero_id = h.tercero_id and a.empresa_id = h.empresa_id and h.estado = '1' \
                INNER JOIN empresas j ON j.empresa_id = a.empresa_id \
                INNER JOIN system_usuarios k ON k.usuario_id = a.usuario_id\
                where a.pedido_cliente_id_tmp = $1 ";


    G.db.query(sql, [parseInt(cotizacion.numero_cotizacion)], function(err, rows, result) {
        callback(err, rows, result);
    });
};



/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Consultar Detalle Cotizacion
 */
PedidosClienteModel.prototype.consultar_detalle_cotizacion = function(cotizacion, termino_busqueda, callback) {

    var sql = " SELECT\
                a.pedido_cliente_id_tmp as numero_cotizacion,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                a.numero_unidades as cantidad_solicitada,\
                a.porc_iva as iva,\
                a.valor_unitario, \
                (a.numero_unidades * a.valor_unitario) as subtotal,\
                (a.numero_unidades * (a.valor_unitario * (a.porc_iva/100))) as valor_iva,\
                ((a.valor_unitario+(a.valor_unitario*(a.porc_iva/100))) * a.numero_unidades) as total\
                FROM ventas_ordenes_pedidos_d_tmp AS a\
                WHERE pedido_cliente_id_tmp = $1 and \
                (\
                    a.codigo_producto ilike $2 or\
                    fc_descripcion_producto(a.codigo_producto) ilike $2 \
                );";

    G.db.query(sql, [cotizacion.numero_cotizacion, '%' + termino_busqueda + '%'], function(err, rows, result) {
        callback(err, rows, result);
    });

};


/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Consultar Eliminar producto de la Cotizacion
 */
PedidosClienteModel.prototype.eliminar_producto_cotizacion = function(cotizacion, producto, callback)
{
    var sql = "DELETE FROM ventas_ordenes_pedidos_d_tmp WHERE pedido_cliente_id_tmp = $1 and codigo_producto = $2 ; ";

    G.db.query(sql, [cotizacion.numero_cotizacion, producto.codigo_producto], function(err, rows, result) {
        callback(err, rows, result);
    });
};


/*
 * Autor : Camilo Orozco
 * Descripcion : Generar las observaciones ingresadas por el area de cartera
 */
PedidosClienteModel.prototype.observacion_cartera_cotizacion = function(cotizacion, callback)
{
    var sql_aux = " ,estado = '4'"; // Estado Activo

    if (cotizacion.aprobado_cartera === 1)
        sql_aux = " ,estado = '3'"; // Estado Aprobado Cartera


    var sql = "UPDATE ventas_ordenes_pedidos_tmp SET observacion_cartera = $2, sw_aprobado_cartera = $3 " + sql_aux + " WHERE pedido_cliente_id_tmp = $1";

    var params = [cotizacion.numero_cotizacion, cotizacion.observacion_cartera, cotizacion.aprobado_cartera];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows, result);
    });
};


/*
 * @Autor : Cristian Ardila
 * +Descripcion : Actualizar estado de pedido a aprobado por cartera - No asignado
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  --PedidosCliente.prototype.observacionCarteraPedido
 */
PedidosClienteModel.prototype.actualizarPedidoCarteraEstadoNoAsigando = function(pedido, callback)
{

    var sql = "UPDATE ventas_ordenes_pedidos SET observacion_cartera = $2, sw_aprobado_cartera = $3, estado = '1' WHERE pedido_cliente_id = $1";

    var params = [pedido.numero_pedido, pedido.observacion_cartera, pedido.aprobado_cartera];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows, result);
    });
};

/*
 * @Autor : Cristian Ardila
 * +Descripcion : Actualizar estado de la cotizacion cuando se crea el pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Model: PedidosClienteModel
 *  --PedidosClienteModel.prototype.generar_pedido_cliente
 */
function __CambioEstadoCotizacionCreacionProducto(cotizacion, callback)
{

    G.knex('ventas_ordenes_pedidos_tmp')
            .where('pedido_cliente_id_tmp', cotizacion.numero_cotizacion)
            .update({
        sw_aprobado_cartera: '1',
        estado: '5'
    })
            .then(function(rows) {
        callback(rows, true);
    })
            . catch (function(error) {
        callback(error, false);
    });

}
;

/*
 * @Autor : Cristian Ardila
 * +Descripcion : Actualizar estado de la cotizacion cuando se crea el pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Model: PedidosClienteModel
 *  --PedidosClienteModel.prototype.generar_pedido_cliente
 */
PedidosClienteModel.prototype.solicitarAutorizacion = function(cotizacion, callback)
{

    G.knex('ventas_ordenes_pedidos_tmp')
            .where('pedido_cliente_id_tmp', cotizacion.numeroCotizacion)
            .update({
        estado: cotizacion.estado
    })
            .then(function(rows) {
        callback(rows, true);
    })
            . catch (function(error) {
        callback(error, false);
    });

};

/*
 * @author : Cristian Ardila
 * @fecha   17/11/2015
 * +Descripcion :  modelo encargado de eliminar una cotizacion
 * @Funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente.prototype.eliminarCotizacion
 */
PedidosClienteModel.prototype.eliminarDetalleCotizacion = function(cotizacion, callback)
{
   
 G.knex('ventas_ordenes_pedidos_tmp')
  .where('pedido_cliente_id_tmp', cotizacion)
  .del()
  .then(function(rows) {
        callback(rows, true);
    })
  .catch (function(error) {
        callback(error, false);
    });
};




/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar si una cotizacion tiene un 
 *               pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.eliminarCotizacion
 */
PedidosClienteModel.prototype.consultaCotizacionEnPedido = function(cotizacion, callback) {

    G.knex('ventas_ordenes_pedidos').where({
        pedido_cliente_id_tmp: cotizacion
    }).select('pedido_cliente_id_tmp')
     .then(function(rows) {
        callback(true, rows);
    })
     .catch (function(error) {
        callback(false, error);
    });
};

/*
 * @Autor : Cristian Ardila
 * +Descripcion : Funcion encargada de actualizar el estado del pedido a 4 (Autorizar nuevamente cartera)
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente.prototype.modificarDetallePedido
 *  --PedidosCliente.prototype.insertarDetallePedido
 *  --PedidosCliente.prototype.eliminarProductoPedido
 *  --PedidosCliente.prototype.insertarCantidadProductoDetallePedido
 */
PedidosClienteModel.prototype.actualizarEstadoPedido = function(pedido, estado_pedido, callback)
{
    var aprobacionCartera;
    if (estado_pedido === 4) {
        aprobacionCartera = pedido.aprobado_cartera;
    } else {
        aprobacionCartera = 0;
    }    
    G.knex('ventas_ordenes_pedidos')
     .where('pedido_cliente_id', pedido.numero_pedido)
     .update({
        observacion_cartera: pedido.observacion_cartera,
        sw_aprobado_cartera: aprobacionCartera,
        estado: estado_pedido
    })
   .then(function(rows) {
        callback(false, rows);
    })
   .catch (function(error) {
        callback(error);
    });   
};

/**
 * @author Cristian Ardila
 * +Descripcion: Funcion encargada de consultar el valor total en un pedido
 * @fecha: 04/11/2015
 * @param {string} numero_pedido
 * @param {type} callback
 * @returns {void}
 * @funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente.prototype.modificarDetallePedido
 *  --PedidosCliente.prototype.insertarDetallePedido
 *  --PedidosCliente.prototype.eliminarProductoPedido  
 */
PedidosClienteModel.prototype.consultarTotalValorPedidoCliente = function(numero_pedido, callback) {

    G.knex.select(
            G.knex.raw('sum(ventas_ordenes_pedidos_d_tmp.valor_unitario * ventas_ordenes_pedidos_d_tmp.numero_unidades) as valor_total_cotizacion')
            )
            .from('ventas_ordenes_pedidos_d_tmp')
            .leftJoin('ventas_ordenes_pedidos',
            'ventas_ordenes_pedidos_d_tmp.pedido_cliente_id_tmp',
            'ventas_ordenes_pedidos.pedido_cliente_id_tmp')
            .where('ventas_ordenes_pedidos.pedido_cliente_id', numero_pedido)
            .then(function(rows) {
    
        callback(false, rows);
    }).
       catch (function(err) {
         callback(err);     
    });
};

/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar el estado de un pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.consultarEstadoPedido
 */
PedidosClienteModel.prototype.consultarEstadoPedido = function(numero_pedido, callback) {

    G.knex('ventas_ordenes_pedidos').where({
        pedido_cliente_id: numero_pedido
    }).select('estado')
            .then(function(rows) {
        callback(true, rows);
    })
            . catch (function(error) {
        callback(false, error);
    });
};


/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar ela existencia de un producto en
 *               la cotizacion
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.consultarEstadoPedido
 */
PedidosClienteModel.prototype.consultarProductoDetalleCotizacion = function(numero_pedido,codigo_producto, callback) {

    G.knex('ventas_ordenes_pedidos_d_tmp').where({
        pedido_cliente_id_tmp: numero_pedido,
        codigo_producto: codigo_producto
    }).select('pedido_cliente_id_tmp').
    then(function(rows) {       
        callback(false, rows);    
    }).
    catch (function(error) {
        callback(error);
    });
};


/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar ela existencia de un producto en
 *               un producto
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.consultarEstadoPedido
 */
PedidosClienteModel.prototype.consultarProductoDetallePedido = function(pedido,producto, callback) {

    G.knex('ventas_ordenes_pedidos_d').where({
        pedido_cliente_id: pedido.numero_pedido,
        codigo_producto: producto.codigo_producto
    }).select('pedido_cliente_id')
         .then(function(rows) {
       
       // callback(true, rows); 
       callback(false, rows);
    })
        . catch (function(error) {
       // callback(false, error);
       callback(error);
    });
};
/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar el estado de un pedido
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.consultarEstadoPedido
 */
PedidosClienteModel.prototype.consultarEstadoPedidoEstado = function(numero_pedido, callback) {

    G.knex('ventas_ordenes_pedidos').where({
        pedido_cliente_id: numero_pedido,
    }).select('estado', 'estado_pedido').then(function(rows) {      
        callback(false, rows);
    }).catch (function(error) {
      
        callback(error);
    });
};


/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar si la cotizacion ya tiene un pedido
 * @fecha: 11/11/2015
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.generarPedido
 */
PedidosClienteModel.prototype.consultarExistenciaPedidoCotizacion = function(numeroCotizacion, callback) {

    G.knex('ventas_ordenes_pedidos').where({
        pedido_cliente_id_tmp: numeroCotizacion

    }).select('pedido_cliente_id_tmp')
            .then(function(rows) {
        callback(true, rows);
    })
            . catch (function(error) {
        callback(false, error);
    });
};
/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar el estado de una cotizacion
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.consultarEstadoCotizacion
 *  --PedidosClientesEvents.prototype.onNotificarEstadoCotizacion
 *  --PedidosCliente.prototype.generarPedido
 *  --PedidosCliente.prototype.eliminarCotizacion
 */
PedidosClienteModel.prototype.consultarEstadoCotizacion = function(numeroCotizacion, callback) {

    G.knex('ventas_ordenes_pedidos_tmp').where({
        pedido_cliente_id_tmp: numeroCotizacion
    }).select('estado')
      .then(function(rows) {
        callback(false, rows);
    })
      . catch (function(error) {
       
        callback(true, error);
    });
};

/*
 * @Autor : Cristian Ardila
 * +Descripcion : Actualizar la cabecera de una cotizacion
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del modelo:
 *  Model: PedidosClienteModel
 *  --PedidosClienteModel.prototype.actualizarCabeceraCotizacion
 */
PedidosClienteModel.prototype.actualizarCabeceraCotizacion = function(cotizacion, callback)
{

    G.knex('ventas_ordenes_pedidos_tmp')
    .where('pedido_cliente_id_tmp', cotizacion.numero_cotizacion)
    .update({
        observaciones: cotizacion.observacion
    }).then(function(rows) {    
        callback(true, rows);
    }).catch (function(error) {
        callback(false, error);
    });

};
/*
 * @author : Cristian Ardila
 * @fecha:  05/11/2015
 * Descripcion :  Funcion encargada de almacenar el detalle del pedido
 */
PedidosClienteModel.prototype.insertarDetallePedido = function(pedido, producto, callback) {

  
 var sql = "INSERT INTO ventas_ordenes_pedidos_d (pedido_cliente_id, codigo_producto, porc_iva, numero_unidades, valor_unitario,fecha_registro,usuario_id) \
                 VALUES ( :1, :2, :3, :4, :5,NOW(), :6);";

    G.knex.raw(sql, {1:pedido.numero_pedido, 2:producto.codigo_producto, 3:producto.iva, 4:producto.cantidad_solicitada, 5:producto.precio_venta, 6:pedido.usuario_id}).
    then(function(resultado){
       callback(false, resultado);
    }).catch(function(err){
     
       callback(err);
    });
    
   


};
/*
 * Autor : Camilo Orozco
 * Descripcion : Transaccion para la generación del pedido
 * +Modificacion: Se modifica la funcion reemplazando la funcion interna (__actualizar_estado_cotizacion)
 *                por la siguiente (__CambioEstadoCotizacionCreacionProducto)
 *                esto con el objetivo de añadirle un nuevo estado = 5 el cual consiste en indicar
 *                que la cotizacion ya tiene un pedido asignado
 * @fecha: 04/11/2015
 */

PedidosClienteModel.prototype.generar_pedido_cliente = function(cotizacion, callback)
{
    G.db.begin(function() {

        // Ingresar encabezado pedido
        __insertar_encabezado_pedido_cliente(cotizacion, function(err, rows, result) {

            if (err) {
                callback(err);
                return;
            }

            var pedido = {numero_pedido: (rows.rows.length > 0) ? rows.rows[0].numero_pedido : 0, estado: 0};

            // ingresar detalle del pedido, a partir de la cotizacion
            __generar_detalle_pedido_cliente(cotizacion, pedido, function(err, rows, result) {

                if (err) {
                    callback(err);
                    return;
                }

                // Inactivar cotizacion
                //       cotizacion.estado = '0';


                __CambioEstadoCotizacionCreacionProducto(cotizacion, function(rows, estado) {


                    // Finalizar Transacción.
                    G.db.commit(function() {
                        callback(estado, rows, pedido);
                    });

                });

            });
        });
    });
};




/*
 * Author : Eduar Garcia
 * Descripcion :  Cambia el estado de una cotizacion
 */
PedidosClienteModel.prototype.modificarEstadoCotizacion = function(cotizacion, callback) {
    __actualizar_estado_cotizacion(cotizacion, function(err, rows, result) {

        callback(err, rows);

    });
};



/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Modificar Detalle Pedido
 * @Funciones que hacen uso del modelo:
 *  Controller: PedidosClienteController
 *  --PedidosCliente.prototype.insertarCantidadProductoDetallePedido
 *  --PedidosCliente.prototype.modificarDetallePedido
 */

PedidosClienteModel.prototype.modificar_detalle_pedido = function(pedido, producto, callback) {

         
    var sql = " UPDATE ventas_ordenes_pedidos_d SET porc_iva = $3, numero_unidades = $4, valor_unitario = $5, usuario_id = $6 , fecha_registro = NOW() \
                WHERE  pedido_cliente_id = $1 AND codigo_producto = $2 ;";

    var params = [
        pedido.numero_pedido,
        producto.codigo_producto,
        producto.iva,
        producto.cantidad_solicitada,
        producto.precio_venta,
        pedido.usuario_id
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows, result);
    });
};


/*
 * Author : Camilo Orozco
 * Descripcion :  SQL Eliminar producto del pedido
 */
PedidosClienteModel.prototype.eliminar_producto_pedido = function(pedido, producto, callback)
{
    var sql = "DELETE FROM ventas_ordenes_pedidos_d WHERE pedido_cliente_id = $1 and codigo_producto = $2 ; ";

    G.db.query(sql, [pedido.numero_pedido, producto.codigo_producto], function(err, rows, result) {
        callback(err, rows, result);
    });
};


/*************************************************
 * 
 *  FUNCIONES PRIVADAS 
 * 
 *************************************************/

/*
 * Autor : Camilo Orozco
 * Descripcion : SQL para ingresar encabezado pedido cliente
 */
function __insertar_encabezado_pedido_cliente(cotizacion, callback) {

    var sql = " INSERT INTO ventas_ordenes_pedidos(\
                    empresa_id,\
                    centro_destino,\
                    bodega_destino,\
                    tipo_id_tercero,\
                    tercero_id,\
                    tipo_id_vendedor,\
                    vendedor_id,\
                    observacion,    \
                    observacion_cartera,\
                    sw_aprobado_cartera,\
                    estado,\
                    estado_pedido,\
                    tipo_producto,\
                    usuario_id,\
                    fecha_registro,\
                    pedido_cliente_id_tmp,\
                    valor_total_cotizacion\
                    ) (\
                  select\
                  a.empresa_id,\
                  a.centro_destino,\
                  a.bodega_destino,\
                  a.tipo_id_tercero,\
                  a.tercero_id,\
                  a.tipo_id_vendedor,\
                  a.vendedor_id,\
                  a.observaciones,\
                  a.observacion_cartera,\
                  a.sw_aprobado_cartera,\
                  '1' as estado,\
                  '0' as estado_pedido,\
                  a.tipo_producto,\
                  $2 as usuario_id,\
                  now() as fecha_registro,\
                  $1 as pedido_cliente_id_tmp,\
                  $3 as valor_total_cotizacion\
                  from ventas_ordenes_pedidos_tmp a\
                  where a.pedido_cliente_id_tmp = $1\
                ) returning pedido_cliente_id as numero_pedido ";

    var params = [cotizacion.numero_cotizacion, cotizacion.usuario_id, cotizacion.total];

    G.db.transaction(sql, params, function(err, rows, result) {
        callback(err, rows, result);
    });
}
;

/*
 * Autor : Camilo Orozco
 * Descripcion : SQL para generar el detalle del pedido cliente, a partir de una cotizacion
 */
function __generar_detalle_pedido_cliente(cotizacion, pedido, callback) {

    var sql = " INSERT INTO ventas_ordenes_pedidos_d(\
                    pedido_cliente_id, \
                    codigo_producto, \
                    porc_iva, \
                    numero_unidades, \
                    valor_unitario, \
                    usuario_id,    \
                    fecha_registro\
                )(\
                    SELECT \
                    $1 as numero_pedido, \
                    codigo_producto, \
                    porc_iva, \
                    numero_unidades, \
                    valor_unitario, \
                    $3 as usuario_id,    \
                    NOW() as fecha_registro\
                    FROM ventas_ordenes_pedidos_d_tmp \
                    WHERE pedido_cliente_id_tmp = $2\
                ) ;";

    var params = [pedido.numero_pedido, cotizacion.numero_cotizacion, cotizacion.usuario_id];

    G.db.transaction(sql, params, function(err, rows, result) {
        callback(err, rows, result);
    });
}
;

/*
 * Autor : Camilo Orozco
 * Descripcion : SQL para actualizar estados de la cotizacion
 */
function __actualizar_estado_cotizacion(cotizacion, callback) {

    // Estados Cotizacion
    // 0 => Inactiva
    // 1 => Activo     
    // 2 => Anulado
    // 3 => Aprobado Cartera

    var sql = "UPDATE ventas_ordenes_pedidos_tmp SET estado = $2 WHERE pedido_cliente_id_tmp = $1";

    var params = [cotizacion.numero_cotizacion, cotizacion.estado];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows, result);
    });
}
;


PedidosClienteModel.$inject = ["m_productos"];


module.exports = PedidosClienteModel;