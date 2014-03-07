var PedidosClienteModel = function() {

};

// Buscar Todos los pedidos de los clientes, permitiendo filtrar por cada uno de los campos
PedidosClienteModel.prototype.listar_pedidos_clientes = function(empresa_id, termino_busqueda, callback) {


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
                when a.estado_pedido = 1 then 'Separado' \
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
                AND (a.estado IN ('0','1','2','3')) order by 1 desc; ";
    
    /*var sql = " select \
                a.pedido_cliente_id as numero_pedido, \
                b.tipo_id_tercero as tipo_id_cliente, \
                b.tercero_id as identificacion_cliente, \
                b.nombre_tercero as nombre_cliente, \
                b.direccion as direccion_cliente, \
                b.telefono as telefono_cliente, \
                c.tipo_id_vendedor, \
                c.vendedor_id as idetificacion_vendedor, \
                c.nombre as nombre_vendedor,\
                a.estado, \
                case when a.estado = 0 then 'Inactivo' \
                when a.estado = 1 then 'Activo' \
                when a.estado = 2 then 'Anulado' \
                when a.estado = 3 then 'Entregado' end as descripcion_estado, \
                a.estado_pedido as estado_actual_pedido, \
                case when a.estado_pedido = 0 then 'No Asignado' \
                when a.estado_pedido = 1 then 'Separado' \
                when a.estado_pedido = 2 then 'Auditado' \
                when a.estado_pedido = 3 then 'En Despacho' \
                when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \
                a.fecha_registro,\
                d.responsable_id,\
                e.nombre as nombre_operario\
                from ventas_ordenes_pedidos a \
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \
                inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \
                left join ventas_ordenes_pedidos_estado d on a.pedido_cliente_id = d.pedido_cliente_id and a.estado_pedido = d.estado \
                left join operarios_bodega e on d.responsable_id = e.operario_id \
                where a.empresa_id = $1 \
                and (   a.pedido_cliente_id ilike $2  \
                        or b.tercero_id ilike $2 \
                        or b.nombre_tercero ilike $2 \
                        or b.direccion ilike $2  \
                        or b.telefono ilike $2   \
                        or c.vendedor_id ilike $2 \
                        or c.nombre ilike $2 \
                        or e.nombre ilike $2 ) \
                AND (a.estado IN ('0','1','2','3')) order by 1 desc; ";*/


    G.db.query(sql, [empresa_id, "%" + termino_busqueda + "%"], function(err, rows, result) {
        callback(err, rows);
    });

};

// Seleccionar Pedido Por un numero de pedido
PedidosClienteModel.prototype.seleccionar_pedido_by_numero_pedido = function(numero_pedido, callback) {

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
                     when a.estado_pedido = 1 then 'Separado' \
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

// Lista Todos los Pedidos Activos que le corresponden a un operario de bodega para separar
PedidosClienteModel.prototype.listar_pedidos_del_operario = function(responsable, callback) {

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
                case when a.estado = 0 then 'Inactivo' \
                     when a.estado = 1 then 'Activo' \
                     when a.estado = 2 then 'Anulado' \
                     when a.estado = 3 then 'Entregado' end as descripcion_estado, \
                a.estado_pedido as estado_actual_pedido, \
                case when a.estado_pedido = 0 then 'No Asignado' \
                     when a.estado_pedido = 1 then 'Separado' \
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
                where d.responsable_id = $1  \
                and a.estado_pedido = '1' \
                AND (a.estado IN ('1'))   \
                order by 1 desc;";

    G.db.query(sql, [responsable], function(err, rows, result) {
        callback(err, rows);
    });
};


// Asigancion de responsable al pedido 
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


//  Almacenar responsable al pedido 
PedidosClienteModel.prototype.insertar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var sql = "INSERT INTO ventas_ordenes_pedidos_estado( pedido_cliente_id, estado, responsable_id, fecha, usuario_id) " +
            "VALUES ($1, $2, $3, now(), $4);";

    G.db.query(sql, [numero_pedido, estado_pedido, responsable, usuario], function(err, rows, result) {
        callback(err, rows);
    });
};

// actualizacion del responsable del pedido
PedidosClienteModel.prototype.actualizar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var sql = "UPDATE ventas_ordenes_pedidos_estado SET responsable_id=$3, fecha=NOW(), usuario_id=$4 " +
            "WHERE pedido_cliente_id=$1 AND estado=$2;";

    G.db.query(sql, [numero_pedido, estado_pedido, responsable, usuario], function(err, rows, result) {
        callback(err, rows);
    });
};

// actualizacion el estado actual del pedido
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
                case when a.estado=0 then 'Registrado'\
                     when a.estado=1 then 'Separado'\
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




module.exports = PedidosClienteModel;