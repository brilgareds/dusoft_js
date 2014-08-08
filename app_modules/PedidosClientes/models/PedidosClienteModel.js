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

PedidosClienteModel.prototype.listar_pedidos_clientes = function(empresa_id, termino_busqueda, pagina, callback) {

    //var offset = G.settings.limit * pagina;

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
                when a.estado_pedido = 3 then 'En Despacho' \
                when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \
                a.fecha_registro \
                from ventas_ordenes_pedidos a \
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \
                inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \
                where a.empresa_id = $1 \
                and (   a.pedido_cliente_id ilike $2  \
                        or b.tercero_id ilike $2 \
                        or b.nombre_tercero ilike $2 \
                        or b.direccion ilike $2  \
                        or b.telefono ilike $2   \
                        or c.vendedor_id ilike $2 \
                        or c.nombre ilike $2) \
                AND (a.estado IN ('0','1','2','3')) order by 1 desc ";

    /*G.db.query(sql, [empresa_id, "%" + termino_busqueda + "%", G.settings.limit, offset], function(err, rows, result) {
        callback(err, rows);
    });*/
    
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
                     when a.estado_pedido = 3 then 'En Despacho' \
                     when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \
                a.fecha_registro \
                from ventas_ordenes_pedidos a \
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \
                inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \
                where a.pedido_cliente_id = $1  \
                AND (a.estado IN ('0','1','2','3')) order by 1 desc; ";

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
                a.cantidad_despachada::integer,\
                (a.numero_unidades - a.cantidad_despachada - COALESCE(b.cantidad_temporalmente_separada,0))::integer as cantidad_pendiente,\
                a.cantidad_facturada::integer,\
                a.valor_unitario,\
                a.porc_iva as porcentaje_iva,\
                (a.valor_unitario+(a.valor_unitario*(a.porc_iva/100)))as valor_unitario_con_iva,\
                (a.numero_unidades*(a.valor_unitario*(a.porc_iva/100))) as valor_iva,\
                COALESCE(b.justificacion, '') as justificacion \
                from ventas_ordenes_pedidos_d a \
                left join (\
                    select \
                    a.pedido_cliente_id as numero_pedido,\
                    b.codigo_producto,\
                    c.observacion as justificacion,\
                    SUM(b.cantidad) as cantidad_temporalmente_separada\
                    from inv_bodegas_movimiento_tmp_despachos_clientes a \
                    inner join inv_bodegas_movimiento_tmp_d b on a.usuario_id = b.usuario_id and a.doc_tmp_id = b.doc_tmp_id\
                    left join inv_bodegas_movimiento_tmp_justificaciones_pendientes c on b.doc_tmp_id = c.doc_tmp_id and b.usuario_id = c.usuario_id and b.codigo_producto = c.codigo_producto\
                    group by 1,2,3\
                ) as b on a.pedido_cliente_id = b.numero_pedido and a.codigo_producto = b.codigo_producto\
                where a.pedido_cliente_id = $1 ;";

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

PedidosClienteModel.prototype.listar_pedidos_del_operario = function(responsable, termino_busqueda, pagina, limite, callback) {


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
                     when a.estado_pedido = 3 then 'En Despacho' \
                     when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \
                a.fecha_registro,\
                d.responsable_id,\
                e.nombre as responsable_pedido,\
                d.fecha as fecha_asignacion_pedido \
                from ventas_ordenes_pedidos a \
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \
                inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \
                inner join ventas_ordenes_pedidos_estado d on a.pedido_cliente_id = d.pedido_cliente_id and a.estado_pedido = d.estado\
                inner join operarios_bodega e on d.responsable_id = e.operario_id\
                left join inv_bodegas_movimiento_tmp_despachos_clientes f on a.pedido_cliente_id = f.pedido_cliente_id\
                where d.responsable_id = $1  \
                and a.estado_pedido = '1' \
                AND (a.estado IN ('1'))   \
                and (\
                        a.pedido_cliente_id ilike $2 or\
                        b.tercero_id ilike $2 or\
                        b.nombre_tercero  ilike $2 or\
                        c.vendedor_id ilike $2 or\
                        c.nombre ilike $2\
                    )\
                order by d.fecha asc ";
    
    G.db.pagination(sql, [responsable, "%" + termino_busqueda + "%"], pagina, limite, function(err, rows, result, total_records) {        
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

    var that = this;

    // Validar si existen responsables asigandos
    var sql = " SELECT * FROM ventas_ordenes_pedidos_estado a WHERE a.pedido_cliente_id=$1 AND a.estado = $2 ;";

    G.db.query(sql, [numero_pedido, estado_pedido], function(err, rows, result) {
        if (rows.length > 0) {
            //Actualizar
            that.actualizar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                //Actualizar estado actual del pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows);
                    return;
                });
            });
        } else {
            // Asignar
            that.insertar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                //Actualizar estado actual del pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows);
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
            "WHERE pedido_cliente_id=$1 AND estado=$2;";

    G.db.query(sql, [numero_pedido, estado_pedido, responsable, usuario], function(err, rows, result) {
        callback(err, rows);
    });
};

/**
 * @api {sql} actualizar_responsables_pedidos Actualizar Responsables Pedido 
 * @apiName Actualizar Responsables Pedido
 * @apiGroup PedidosClientes (sql)
 * @apiDescription Permite cambiar el estado actual del pedido, dependiendo en momento o gestion determinada en donde se encuentre.
 * Los estados permitidos son:
 * 0 = No Asignado. Cuando se crea el pedido por primera vez
 * 1 = Asignado, cuando el pedido fue asignado a un operario de bodega para ser despachado
 * 2 = Auditado, Cuando se ha separado el pedido y lo estan auditando para verificar su correcta separacion.
 * 3 = En Despacho, Cuando se encuentra listo para ser despachado al lugar de destino.
 * 4 = Despachado, Cuando el pedido ha sido despachado en su total al lugar de destino.
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
                     when a.estado=3 then 'En Despacho' \
                     when a.estado=4 then 'Despachado' end as descripcion_estado,\
                b.operario_id,\
                b.nombre as nombre_responsable,\
                a.usuario_id,\
                c.nombre as nombre_usuario,\
                a.fecha as fecha_asignacion,\
                a.fecha_registro    \
                from ventas_ordenes_pedidos_estado a \
                inner join system_usuarios c on a.usuario_id = c.usuario_id\
                left join operarios_bodega b on a.responsable_id = b.operario_id\
                where a.pedido_cliente_id=$1";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
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


PedidosClienteModel.$inject = ["m_productos"];


module.exports = PedidosClienteModel;