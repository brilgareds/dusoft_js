var ProductosModel = function() {


};

// Autor:      : Camilo Orozco 
// Descripcion : Validar si un producto existe o no en la base de datos
// Calls       : OrdenesCompra -> OrdenesCompraController -> ordenCompraArchivoPlano();
// 

ProductosModel.prototype.validar_producto = function(codigo_producto, callback) {

    var sql = " select * from inventarios_productos a where a.codigo_producto = $1 ";

    G.db.query(sql, [codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};

// Autor:      : Camilo Orozco 
// Descripcion : Buscar producto
// Calls       : PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();
//               

   

ProductosModel.prototype.buscar_productos = function(empresa_id, centro_utilidad_id, bodega_id, termino_busqueda, pagina, tipo_producto, callback) {
    
    var where_tipo = "";
    var array_parametros = [];

    if(tipo_producto !== '0') {

            where_tipo = " and b.tipo_producto_id = $5 ";
            array_parametros = [empresa_id, centro_utilidad_id, bodega_id, "%" + termino_busqueda + "%", tipo_producto];
    }
    else{
        array_parametros = [empresa_id, centro_utilidad_id, bodega_id, "%" + termino_busqueda + "%"];
    }

    var sql = " select\
                a.empresa_id, \
                a.centro_utilidad,\
                a.bodega,\
                f.descripcion as descripcion_laboratorio,    \
                e.descripcion as descripcion_molecula,\
                b.codigo_producto, \
                fc_descripcion_producto(b.codigo_producto) as nombre_producto,\
                b.unidad_id,\
                b.estado, \
                b.codigo_invima,\
                b.contenido_unidad_venta,\
                b.sw_control_fecha_vencimiento,\
                a.existencia_minima,\
                a.existencia_maxima,\
                a.existencia::integer as existencia,\
                c.existencia as existencia_total,\
                c.costo_anterior,\
                c.costo,\
                CASE WHEN c.costo > 0 THEN ROUND(((c.precio_venta/c.costo)-1) * 100) ELSE NULL END as porcentaje_utilidad,\
                c.costo_penultima_compra,\
                c.costo_ultima_compra,\
                c.precio_venta_anterior,\
                c.precio_venta,\
                c.precio_minimo,\
                c.precio_maximo,\
                c.sw_vende,\
                c.grupo_contratacion_id,\
                c.nivel_autorizacion_id,\
                b.grupo_id,\
                b.clase_id,\
                b.subclase_id,\
                b.porc_iva,\
                b.tipo_producto_id\
                from existencias_bodegas a \
                inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and a.empresa_id = c.empresa_id\
                inner join inv_tipo_producto d ON b.tipo_producto_id = d.tipo_producto_id\
                inner join inv_subclases_inventarios e ON b.grupo_id = e.grupo_id and b.clase_id = e.clase_id and b.subclase_id = e.subclase_id\
                inner join inv_clases_inventarios f ON e.grupo_id = f.grupo_id and e.clase_id = f.clase_id\
                where a.empresa_id= $1 and a.centro_utilidad = $2 and a.bodega = $3 \
                and ( b.codigo_producto ILIKE $4 or b.descripcion ILIKE $4 ) \
                "+where_tipo+"\
                ORDER BY 7 ASC ";

    G.db.pagination(sql, array_parametros, pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });

};

/**/
// Autor:      : Alexander López Guerrero
// Descripcion : Lista productos
// Calls       : Productos -> ProductosController -> listarProductosClientes();
// 
ProductosModel.prototype.listar_productos_clientes = function(empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, termino_busqueda, pagina, tipo_producto, callback) {
    
    var where_tipo = "";
    var array_parametros = [];

    if(tipo_producto !== '0') {

            where_tipo = " and b.tipo_producto_id = $6 ";
            array_parametros = [empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, "%" + termino_busqueda + "%", tipo_producto];
    }
    else {
        array_parametros = [empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, "%" + termino_busqueda + "%"];
    }
    
    var sql = 
        "select " +
        "   a.codigo_producto, " +
        "   a.precio_regulado, " +
        "   fc_descripcion_producto(a.codigo_producto) as nombre_producto, " +
        "   btrim(fc_precio_producto_contrato_cliente($4, a.codigo_producto, $1), '@') as precio_contrato, " +
        "   a.existencia as existencia_total, " +
        "   a.costo_anterior, " +
        "   a.costo, " +
        "   CASE WHEN a.costo > 0 THEN ROUND (((a.precio_venta/a.costo) - 1) * 100) ELSE NULL END as porcentaje_utilidad, " +
        "   a.costo_penultima_compra, " +
        "   (a.costo_ultima_compra)/((COALESCE(b.porc_iva,0)/100)+1) as costo_ultima_compra, " +
        "   a.precio_venta_anterior, " +
        "   a.precio_venta, " +
        "   a.precio_minimo, " +
        "   a.precio_maximo, " +
        "   SUM(a.existencia) as existencia, " +
        "   a.sw_vende, " +
        "   a.grupo_contratacion_id, " +
        "   a.nivel_autorizacion_id, " +
        "   b.sw_requiereautorizacion_despachospedidos, " +
        "   SUM(sq_b.cantidad_pendiente) as cantidad_pendiente_final, " +
        "   ((SUM(a.existencia)-SUM(COALESCE(sq_b.cantidad_pendiente,0)))-SUM(COALESCE(sq_c.total_cantidad,0))) as total_disponible, " +
        "   CASE " +
        "       WHEN ((SUM(a.existencia)-SUM(COALESCE(sq_b.cantidad_pendiente,0)))-SUM(COALESCE(sq_c.total_cantidad,0))) > 0 " +
        "       THEN ((SUM(a.existencia)-SUM(COALESCE(sq_b.cantidad_pendiente,0)))-SUM(COALESCE(sq_c.total_cantidad,0))) " +
        "       ELSE '0' " +
        "   END as disponible, " +
        "   b.estado, " +
        "   b.sw_regulado, " +
        "   b.tipo_producto_id, " +
        "   b.unidad_id, " +
        "   b.codigo_invima, " +
        "   b.vencimiento_codigo_invima, " +
        "   b.codigo_cum, " +
        "   b.contenido_unidad_venta, " +
        "   b.sw_control_fecha_vencimiento, " +
        "   b.grupo_id, " +
        "   b.clase_id, " +
        "   b.subclase_id, " +
        "   b.porc_iva, " +
        "   b.tipo_producto_id, " +
        "from " +
        "    inventarios a " +
        "    inner join inventarios_productos b on a.codigo_producto = b.codigo_producto " +
        "        and a.empresa_id = $1 " +
        "    left join ( " +
        "        select " +
        "            sq_a.codigo_producto, " +
        "            sq_a.cantidad_pendiente " +
        "        from ( " +
        "            select " +
        "                d.codigo_producto, " +
        "                sum(d.cantidad_pendiente) as cantidad_pendiente " +
        "            from " +
        "                solicitud_productos_a_bodega_principal c " +
        "                inner join solicitud_productos_a_bodega_principal_detalle d on d.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id " +
        "                    and c.empresa_destino = $1 " +
        "                    --and   c.sw_despacho = '0' " +
        "                    and d.cantidad_pendiente > 0 " +
        "            group by 1 " +
        "        ) sq_a " +
        "    ) sq_b on a.codigo_producto = sq_b.codigo_producto " +
        "    left join ( " +
        "        select " +
        "            f.codigo_producto, " +
        "            sum((f.numero_unidades - f.cantidad_despachada)) as total_cantidad " +
        "        from " +
        "            ventas_ordenes_pedidos as e " +
        "            inner join ventas_ordenes_pedidos_d as f on e.pedido_cliente_id = f.pedido_cliente_id " +
        "                and e.estado = '1' " +
        "                and e.empresa_id = $1 " +
        "                and f.numero_unidades <> f.cantidad_despachada " +
        "        group by f.codigo_producto " +
        "    ) sq_c on a.codigo_producto = sq_c.codigo_producto " +
        "    inner join inv_subclases_inventarios g on b.subclase_id = g.subclase_id " +
        "        and b.grupo_id = g.grupo_id " +
        "        and b.clase_id = g.clase_id " +
        "    inner join inv_clases_inventarios h on b.grupo_id = h.grupo_id " +
        "        and b.clase_id = h.clase_id " +
        "    inner join existencias_bodegas i on a.codigo_producto = i.codigo_producto " +
        "where " +
        "    i.empresa_id = $1 " +
        "    and i.centro_utilidad = $2 " +
        "    and i.bodega = $3 " +
        "    and ( " +
        "        a.codigo_producto ilike $5 " +
        "        or fc_descripcion_producto(a.codigo_producto) ilike $5 " +
        "        or b.codigo_cum  ilike $5 " +
        "    ) " +
        where_tipo +
        "order by 3 asc";
        

    G.db.pagination(sql, array_parametros, pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });

};
/**/

// Autor:      : Camilo Orozco 
// Descripcion : Consultar stock producto o existencias empresa de un producto
// Calls       : Pedidos -> PedidosModel -> calcular_disponibilidad_producto();
//               PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();

ProductosModel.prototype.consultar_stock_producto = function(empresa_id, codigo_producto, callback) {

    var sql = " select SUM(a.existencia::integer) as existencia from existencias_bodegas a\
                inner join inventarios b on a.codigo_producto = b.codigo_producto and a.empresa_id = b.empresa_id\
                inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                where a.empresa_id = $1 and a.codigo_producto = $2 and a.estado = '1' and c.estado = '1'";

    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};


// Consultar lotes y fechas vencimientos produto
ProductosModel.prototype.consultar_existencias_producto = function(empresa_id, codigo_producto, callback) {

    var sql = " select \
                a.empresa_id,\
                a.centro_utilidad,\
                a.bodega as bodega_id,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                a.lote,\
                to_char(a.fecha_vencimiento, 'dd-mm-yyyy') AS fecha_vencimiento,\
                a.existencia_actual\
                from existencias_bodegas_lote_fv a \
                inner join existencias_bodegas b on a.empresa_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega and a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and b.empresa_id = c.empresa_id\
                inner join inventarios_productos d on c.codigo_producto = d.codigo_producto\
                where a.empresa_id = $1 \
                and a.codigo_producto = $2 \
                and a.existencia_actual > 0\
                and a.estado = '1'\
                and d.estado = '1'\
                order by a.fecha_vencimiento desc ;";

    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};

//Consultar tipo de productos
ProductosModel.prototype.listar_tipo_productos = function(callback) {
    
    var sql = "select tipo_producto_id, descripcion from inv_tipo_producto";
    
    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};


ProductosModel.prototype.obtenerDescripcionProducto = function(codigo , callback) {
    
    var sql = "select fc_descripcion_producto($1) as descripcion_producto";
    
    G.db.query(sql, [codigo], function(err, rows, result) {
        callback(err, rows);
    });
};



module.exports = ProductosModel;