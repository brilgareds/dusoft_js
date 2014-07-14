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


// Listar todos los pedidos de farmacias
PedidosFarmaciasModel.prototype.listar_pedidos_farmacias = function(empresa_id, termino_busqueda, pagina, callback) {

    var offset = G.settings.limit * pagina;

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
                     when a.estado = 1 then 'Separado' \
                     when a.estado = 2 then 'Auditado' \
                     when a.estado = 3 then 'En Despacho' \
                     when a.estado = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \
                a.fecha_registro::date as fecha_registro \
                from solicitud_productos_a_bodega_principal as a \
                inner join bodegas as b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad as c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas as d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios as e ON a.usuario_id = e.usuario_id \
                where a.farmacia_id = $1 \
                and ( a.solicitud_prod_a_bod_ppal_id ilike $2 \
                      or d.razon_social ilike $2 \
                      or b.descripcion ilike $2 \
                      or e.nombre ilike $2 ) \
                order by 1 desc limit $3 offset $4 ";

    G.db.query(sql, [empresa_id, "%" + termino_busqueda + "%", G.settings.limit, offset], function(err, rows, result) {
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
                     when a.estado = 1 then 'Separado' \
                     when a.estado = 2 then 'Auditado' \
                     when a.estado = 3 then 'En Despacho' \
                     when a.estado = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \
                a.fecha_registro::date as fecha_registro \
                from solicitud_productos_a_bodega_principal as a \
                inner join bodegas as b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad as c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas as d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios as e ON a.usuario_id = e.usuario_id \
                where a.solicitud_prod_a_bod_ppal_id = $1 \
                order by 1 desc";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {
        callback(err, rows);
    });
};

PedidosFarmaciasModel.prototype.listar_pedidos_del_operario = function(responsable, callback) {

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
                a.estado as estado_actual, \
                case when a.estado = 0 then 'No Asignado' \
                     when a.estado = 1 then 'Separado' \
                     when a.estado = 2 then 'Auditado' \
                     when a.estado = 3 then 'En Despacho' \
                     when a.estado = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \
                a.fecha_registro::date as fecha_registro,\
                f.responsable_id,\
                g.nombre as responsable_pedido,\
                f.fecha as fecha_asignacion_pedido \
                from solicitud_productos_a_bodega_principal as a \
                inner join bodegas as b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad as c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas as d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios as e ON a.usuario_id = e.usuario_id \
                inner join solicitud_productos_a_bodega_principal_estado f on a.solicitud_prod_a_bod_ppal_id = f.solicitud_prod_a_bod_ppal_id and a.estado = f.estado\
                inner join operarios_bodega g on f.responsable_id = g.operario_id\
                where f.responsable_id = $1 \
                and a.estado = '1'\
                order by 1 desc";

    G.db.query(sql, [responsable], function(err, rows, result) {
        callback(err, rows);
    });
};

// Asigancion de responsable al pedido 
PedidosFarmaciasModel.prototype.asignar_responsables_pedidos = function(numero_pedido, estado_pedido, responsable, usuario, callback) {

    var that = this;

    // Validar si existen responsables asigandos
    var sql = " SELECT * FROM solicitud_productos_a_bodega_principal_estado a WHERE a.solicitud_prod_a_bod_ppal_id = $1 AND a.estado = $2 ;";

    G.db.query(sql, [numero_pedido, estado_pedido], function(err, rows, result) {
        if (rows.length > 0) {
            //Actualizar
            that.actualizar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                // Actualizar Estado Actual del Pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows);
                    return;
                });
            });
        } else {
            // Asignar
            that.insertar_responsables_pedidos(numero_pedido, estado_pedido, responsable, usuario, function(_err, _rows) {
                // Actualizar Estado Actual del Pedido
                that.actualizar_estado_actual_pedido(numero_pedido, estado_pedido, function() {
                    callback(_err, _rows);
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



module.exports = PedidosFarmaciasModel;