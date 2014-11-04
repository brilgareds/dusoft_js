var OrdenesCompraModel = function() {

};



// Listar las Ordenes de Compra 
OrdenesCompraModel.prototype.listar_ordenes_compra = function(fecha_inicial, fecha_final, termino_busqueda, pagina, callback) {

   
    var sql = " SELECT \
                a.orden_pedido_id as numero_orden,\
                a.empresa_id,\
                d.tipo_id_tercero as tipo_id_empresa,\
                d.id as nit_empresa,\
                d.razon_social as nombre_empresa,\
                a.codigo_proveedor_id,\
                c.tipo_id_tercero as tipo_id_proveedor,\
                c.tercero_id as nit_proveedor,\
                c.nombre_tercero as nombre_proveedor,\
                c.direccion as direccion_proveedor,\
                c.telefono as telefono_proveedor,\
                a.estado,\
                a.observacion,\
                f.codigo_unidad_negocio,\
                f.imagen,\
                f.descripcion,\
                a.usuario_id,\
                e.nombre as nombre_usuario,\
                To_char(a.fecha_orden,'dd-mm-yyyy') as fecha_registro\
                FROM compras_ordenes_pedidos a\
                inner join terceros_proveedores b on a.codigo_proveedor_id = b.codigo_proveedor_id\
                inner join terceros c on  b.tipo_id_tercero = c.tipo_id_tercero and b.tercero_id=c.tercero_id \
                inner join empresas d on a.empresa_id = d.empresa_id\
                inner join system_usuarios e on a.usuario_id = e.usuario_id\
                left join unidades_negocio f on a.codigo_unidad_negocio = f.codigo_unidad_negocio \
                WHERE a.fecha_orden between $1 and $2 and \
                (\
                    a.orden_pedido_id ilike $3 or\
                    d.razon_social ilike $3 or\
                    c.tercero_id ilike $3 or \
                    c.nombre_tercero ilike $3 \
                ) and a.sw_unificada='0' order by 1 ";

    G.db.pagination(sql, [fecha_inicial, fecha_final, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows);
    });
};


// Consultar Ordenes de Compra  por numero de orden
OrdenesCompraModel.prototype.consultar_orden_compra = function(numero_orden, callback) {

   
    var sql = " SELECT \
                a.orden_pedido_id as numero_orden,\
                a.empresa_id,\
                d.tipo_id_tercero as tipo_id_empresa,\
                d.id as nit_empresa,\
                d.razon_social as nombre_empresa,\
                a.codigo_proveedor_id,\
                c.tipo_id_tercero as tipo_id_proveedor,\
                c.tercero_id as nit_proveedor,\
                c.nombre_tercero as nombre_proveedor,\
                c.direccion as direccion_proveedor,\
                c.telefono as telefono_proveedor,\
                a.estado,\
                a.observacion,\
                f.codigo_unidad_negocio,\
                f.imagen,\
                f.descripcion,\
                a.usuario_id,\
                e.nombre as nombre_usuario,\
                To_char(a.fecha_orden,'dd-mm-yyyy') as fecha_registro\
                FROM compras_ordenes_pedidos a\
                inner join terceros_proveedores b on a.codigo_proveedor_id = b.codigo_proveedor_id\
                inner join terceros c on  b.tipo_id_tercero = c.tipo_id_tercero and b.tercero_id=c.tercero_id \
                inner join empresas d on a.empresa_id = d.empresa_id\
                inner join system_usuarios e on a.usuario_id = e.usuario_id\
                left join unidades_negocio f on a.codigo_unidad_negocio = f.codigo_unidad_negocio \
                WHERE a.orden_pedido_id = $1 ";

    G.db.query(sql, [numero_orden], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Consultar Detalle Ordene de Compra  por numero de orden
OrdenesCompraModel.prototype.consultar_detalle_orden_compra = function(numero_orden, callback) {

   
    var sql = " select\
                a.orden_pedido_id as numero_orden,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                a.numero_unidades::integer as cantidad_solicitada,\
                a.valor,\
                a.porc_iva,\
                a.estado \
                from compras_ordenes_pedidos_detalle as a\
                where a.orden_pedido_id = $1 and a.estado = '1' ; ";

    G.db.query(sql, [numero_orden], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Ingresar Cabecera Orden de Compra
OrdenesCompraModel.prototype.insertar_orden_compra = function(unidad_negocio, codigo_proveedor, empresa_id, observacion, usuario_id, callback) {

   
    var sql = " INSERT INTO compras_ordenes_pedidos ( codigo_unidad_negocio, codigo_proveedor_id, empresa_id, observacion, usuario_id, estado, fecha_orden ) \
                VALUES( $1, $2, $3, $4, '1', NOW() ) RETURNING orden_pedido_id; ";

    G.db.query(sql, [unidad_negocio, codigo_proveedor, empresa_id, observacion, usuario_id], function(err, rows, result, total_records) {
        callback(err, rows, result);
    });
};

// Modificar Orden de Compra
OrdenesCompraModel.prototype.modificar_orden_compra = function(numero_orden, callback) {

   
    var sql = "  ";

    G.db.query(sql, [numero_orden], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Eliminar Orden de Compra
OrdenesCompraModel.prototype.eliminar_orden_compra = function(numero_orden, callback) {

   
    var sql = " DELETE FROM compras_ordenes_pedidos WHERE orden_pedido_id = $1  ";

    G.db.query(sql, [numero_orden], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Ingresar Detalle Orden de Compra
OrdenesCompraModel.prototype.insertar_detalle_orden_compra = function(numero_orden, codigo_producto, cantidad_solicitada ,valor, iva ,estado, callback) {

   
    var sql = " INSERT INTO compras_ordenes_pedidos_detalle ( orden_pedido_id,codigo_producto,numero_unidades,valor,porc_iva,estado)\
                VALUES ( $1, $2, $3, $4, $5, 1 );";

    G.db.query(sql, [numero_orden, codigo_producto, cantidad_solicitada ,valor, iva ,estado], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};


// Modificar Detalle Orden de Compra
OrdenesCompraModel.prototype.modificar_detalle_orden_compra = function(numero_orden, callback) {

   
    var sql = "  ";

    G.db.query(sql, [numero_orden], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Eliminar Detalle Orden de Compra
OrdenesCompraModel.prototype.eliminar_detalle_orden_compra = function(numero_orden, callback) {

   
    var sql = "  DELETE FROM compras_ordenes_pedidos_detalle WHERE orden_pedido_id = $1 ";

    G.db.query(sql, [numero_orden], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Eliminar producto Orden de Compra
OrdenesCompraModel.prototype.eliminar_producto_orden_compra = function(numero_orden, codigo_producto, callback) {

   
    var sql = "  DELETE FROM compras_ordenes_pedidos_detalle WHERE orden_pedido_id= $1 AND codigo_producto=$2 ";

    G.db.query(sql, [numero_orden, codigo_producto], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};


// Listar Las Ordenes de Compra Pendientes con ese producto
OrdenesCompraModel.prototype.listar_ordenes_compra_pendientes_by_producto = function(empresa_id, codigo_producto, callback) {

   
    var sql = " select \
                a.codigo_proveedor_id,\
                a.orden_pedido_id as numero_orden_compra,\
                b.numero_unidades::integer as cantidad_solicitada, \
                ((b.numero_unidades)-COALESCE(b.numero_unidades_recibidas,0))::integer as cantidad_pendiente,\
                d.tipo_id_tercero,\
                d.tercero_id,\
                d.nombre_tercero,\
                e.usuario,\
                a.fecha_registro\
                from compras_ordenes_pedidos a \
                inner join compras_ordenes_pedidos_detalle b on a.orden_pedido_id = b.orden_pedido_id\
                inner join terceros_proveedores c on a.codigo_proveedor_id = c.codigo_proveedor_id\
                inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id = d.tercero_id\
                inner join system_usuarios e on a.usuario_id = e.usuario_id\
                where a.empresa_id = $1 and b.codigo_producto = $2 and b.numero_unidades <> COALESCE(b.numero_unidades_recibidas,0)\
                and a.estado = '1' ; ";

    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {              
        callback(err, rows);
    });
};

module.exports = OrdenesCompraModel;