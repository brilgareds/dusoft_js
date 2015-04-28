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

    //G.db.paginated(sql, array_parametros, pagina, G.settings.limit, function(err, rows, result) {
    G.db.paginated(sql, array_parametros, pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });

};

/**/
// Autor:      : Alexander López Guerrero
// Descripcion : Lista productos Clientes
// Calls       : Productos -> ProductosController -> listarProductosClientes();
// 
ProductosModel.prototype.listar_productos_clientes = function(empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, termino_busqueda, pedido_cliente_id_tmp, tipo_producto, pagina, filtro, callback) {
    
    var sql_aux = "";
    var sql_filter = "";
    
    //Armar String y Array para restricción de búsqueda según tipo de producto
    var array_parametros = [];

    if(tipo_producto !== '0') {

        sql_aux = " and b.tipo_producto_id = $6 ";
         
        array_parametros = [empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, "%" + termino_busqueda + "%", tipo_producto];
    }
    else {
        array_parametros = [empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, "%" + termino_busqueda + "%"];
    }
    
    //Armar String para filtar termino_busqueda por código de producto, molécula o descripción
    
    if(filtro.buscar_todo) {
        sql_filter = " a.codigo_producto ilike $5 \
                       or fc_descripcion_producto(a.codigo_producto) ilike $5 \
                       or g.descripcion  ilike $5 ";
    }
    else if(filtro.buscar_por_codigo) {
        sql_filter = " a.codigo_producto ilike $5 ";
    }
    else if(filtro.buscar_por_molecula) {
        sql_filter = " g.descripcion  ilike $5 ";
    }
    else if(filtro.buscar_por_descripcion) {
        sql_filter = " fc_descripcion_producto(a.codigo_producto) ilike $5 ";
    }
    
    var sql = " select\n\
                    a.codigo_producto,\n\
                    a.precio_regulado,\n\
                    fc_descripcion_producto(a.codigo_producto) as nombre_producto,\n\
                    btrim(fc_precio_producto_contrato_cliente($4, a.codigo_producto, $1), '@') as precio_contrato,\n\
                    a.existencia as existencia_total,\n\
                    a.costo_anterior,\n\
                    a.costo,\n\
                    CASE WHEN a.costo > 0 THEN ROUND (((a.precio_venta/a.costo) - 1) * 100) ELSE NULL END as porcentaje_utilidad,\n\
                    a.costo_penultima_compra,\n\
                    round((a.costo_ultima_compra)/((COALESCE(b.porc_iva,0)/100)+1),2) as costo_ultima_compra,\n\
                    a.precio_venta_anterior,\n\
                    a.precio_venta,\n\
                    a.precio_minimo,\n\
                    a.precio_maximo,\n\
                    a.sw_vende,\n\
                    a.grupo_contratacion_id,\n\
                    a.nivel_autorizacion_id,\n\
                    b.sw_requiereautorizacion_despachospedidos,\n\
                    b.estado,\n\
                    b.sw_regulado,\n\
                    b.tipo_producto_id,\n\
                    b.unidad_id,\n\
                    b.codigo_invima,\n\
                    to_char(b.vencimiento_codigo_invima, 'DD-MM-YYYY') as vencimiento_codigo_invima,\n\
                    b.codigo_cum,\n\
                    b.contenido_unidad_venta,\n\
                    b.sw_control_fecha_vencimiento,\n\
                    b.grupo_id,\n\
                    b.clase_id,\n\
                    b.subclase_id,\n\
                    b.porc_iva,\n\
                    b.tipo_producto_id, \n\
                    g.subclase_id as molecula_id,\n\
                    g.descripcion as molecula_descripcion,\n\
                    i.existencia as existencia\n\
                from    inventarios a \n\
                    inner join inventarios_productos b on a.codigo_producto = b.codigo_producto \n\
                         and a.empresa_id = $1 \n\
                     inner join inv_subclases_inventarios g on b.subclase_id = g.subclase_id \n\
                         and b.grupo_id = g.grupo_id \n\
                         and b.clase_id = g.clase_id \n\
                     inner join inv_clases_inventarios h on b.grupo_id = h.grupo_id \n\
                         and b.clase_id = h.clase_id \n\
                     inner join existencias_bodegas i on a.codigo_producto = i.codigo_producto \n\
                where \n\
                     i.empresa_id = $1 \n\
                     and i.centro_utilidad = $2 \n\
                     and i.bodega = $3 \n\
                     and ( " + sql_filter + " ) " +
                     sql_aux + 
                "group by a.codigo_producto, a.precio_regulado, a.existencia, a.costo_anterior, a.costo, a.costo_penultima_compra, \n\
                    a.costo_ultima_compra, a.precio_venta_anterior, a.precio_venta, a.precio_minimo, a.precio_maximo, a.sw_vende, \n\
                    a.grupo_contratacion_id, a.nivel_autorizacion_id, b.sw_requiereautorizacion_despachospedidos, b.estado, \n\
                    b.sw_regulado, b.tipo_producto_id, b.unidad_id, b.codigo_invima, b.vencimiento_codigo_invima, b.codigo_cum, \n\
                    b.contenido_unidad_venta, b.sw_control_fecha_vencimiento, b.grupo_id, b.clase_id, b.subclase_id, b.porc_iva, \n\
                    b.tipo_producto_id, g.subclase_id, g.descripcion, i.existencia\n\
                order by 3 asc";
    

    G.db.paginated(sql, array_parametros, pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });

};

ProductosModel.prototype.listar_productos_clientes_test = function(empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, termino_busqueda, pedido_cliente_id_tmp, tipo_producto, pagina, filtro, callback) {
    
    var sql_aux = "";
    var sql_filter = "";
    
    //Armar String y Array para restricción de búsqueda según tipo de producto
    var array_parametros = [];

    if(tipo_producto !== '0') {

        sql_aux = " and b.tipo_producto_id = $6 ";
         
        array_parametros = [empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, "%" + termino_busqueda + "%", tipo_producto];
    }
    else {
        array_parametros = [empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, "%" + termino_busqueda + "%"];
    }
    
    //Armar String para filtar termino_busqueda por código de producto, molécula o descripción
    
    if(filtro.buscar_todo) {
        sql_filter = " a.codigo_producto ilike $5 \
                       or fc_descripcion_producto(a.codigo_producto) ilike $5 \
                       or g.descripcion  ilike $5 ";
    }
    else if(filtro.buscar_por_codigo) {
        sql_filter = " a.codigo_producto ilike $5 ";
    }
    else if(filtro.buscar_por_molecula) {
        sql_filter = " g.descripcion  ilike $5 ";
    }
    else if(filtro.buscar_por_descripcion) {
        sql_filter = " fc_descripcion_producto(a.codigo_producto) ilike $5 ";
    }
    
//    var sql = " select\n\
//                    a.codigo_producto,\n\
//                    a.precio_regulado,\n\
//                    fc_descripcion_producto(a.codigo_producto) as nombre_producto,\n\
//                    btrim(fc_precio_producto_contrato_cliente($4, a.codigo_producto, $1), '@') as precio_contrato,\n\
//                    a.existencia as existencia_total,\n\
//                    a.costo_anterior,\n\
//                    a.costo,\n\
//                    CASE WHEN a.costo > 0 THEN ROUND (((a.precio_venta/a.costo) - 1) * 100) ELSE NULL END as porcentaje_utilidad,\n\
//                    a.costo_penultima_compra,\n\
//                    round((a.costo_ultima_compra)/((COALESCE(b.porc_iva,0)/100)+1),2) as costo_ultima_compra,\n\
//                    a.precio_venta_anterior,\n\
//                    a.precio_venta,\n\
//                    a.precio_minimo,\n\
//                    a.precio_maximo,\n\
//                    SUM(a.existencia) as existencia,\n\
//                    a.sw_vende,\n\
//                    a.grupo_contratacion_id,\n\
//                    a.nivel_autorizacion_id,\n\
//                    b.sw_requiereautorizacion_despachospedidos,\n\
//                    SUM(sq_b.cantidad_pendiente) as cantidad_pendiente_final,\n\
//                    ((SUM(a.existencia)-SUM(COALESCE(sq_b.cantidad_pendiente,0)))-SUM(COALESCE(sq_c.total_cantidad,0))) as total_disponible,\n\
//                    CASE\n\
//                        WHEN ((SUM(a.existencia)-SUM(COALESCE(sq_b.cantidad_pendiente,0)))-SUM(COALESCE(sq_c.total_cantidad,0))) > 0\n\
//                        THEN ((SUM(a.existencia)-SUM(COALESCE(sq_b.cantidad_pendiente,0)))-SUM(COALESCE(sq_c.total_cantidad,0)))\n\
//                        ELSE '0'\n\
//                    END as disponible,\n\
//                    b.estado,\n\
//                    b.sw_regulado,\n\
//                    b.tipo_producto_id,\n\
//                    b.unidad_id,\n\
//                    b.codigo_invima,\n\
//                    to_char(b.vencimiento_codigo_invima, 'DD-MM-YYYY') as vencimiento_codigo_invima,\n\
//                    b.codigo_cum,\n\
//                    b.contenido_unidad_venta,\n\
//                    b.sw_control_fecha_vencimiento,\n\
//                    b.grupo_id,\n\
//                    b.clase_id,\n\
//                    b.subclase_id,\n\
//                    b.porc_iva,\n\
//                    b.tipo_producto_id, \n\
//                    g.subclase_id as molecula_id,\n\
//                    g.descripcion as molecula_descripcion\n\
//                from    inventarios a \n\
//                    inner join inventarios_productos b on a.codigo_producto = b.codigo_producto \n\
//                         and a.empresa_id = $1 \n\
//                    left join ( \n\
//                         select \n\
//                             sq_a.codigo_producto, \n\
//                             sq_a.cantidad_pendiente \n\
//                         from ( \n\
//                             select \n\
//                                d.codigo_producto, \n\
//                                sum(d.cantidad_pendiente) as cantidad_pendiente \n\
//                             from \n\
//                                 solicitud_productos_a_bodega_principal c \n\
//                                 inner join solicitud_productos_a_bodega_principal_detalle d on d.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id \n\
//                                     and c.empresa_destino = $1 \n\
//                                     --and   c.sw_despacho = '0' \n\
//                                     and d.cantidad_pendiente > 0 \n\
//                             group by 1 \n\
//                         ) sq_a \n\
//                     ) sq_b on a.codigo_producto = sq_b.codigo_producto \n\
//                     left join ( \n\
//                         select \n\
//                             f.codigo_producto, \n\
//                             sum((f.numero_unidades - f.cantidad_despachada)) as total_cantidad \n\
//                         from \n\
//                             ventas_ordenes_pedidos as e \n\
//                              inner join ventas_ordenes_pedidos_d as f on e.pedido_cliente_id = f.pedido_cliente_id \n\
//                                 and e.estado = '1' \n\
//                                 and e.empresa_id = $1 \n\
//                                 and f.numero_unidades <> f.cantidad_despachada \n\
//                         group by f.codigo_producto \n\
//                     ) sq_c on a.codigo_producto = sq_c.codigo_producto \n\
//                     inner join inv_subclases_inventarios g on b.subclase_id = g.subclase_id \n\
//                         and b.grupo_id = g.grupo_id \n\
//                         and b.clase_id = g.clase_id \n\
//                     inner join inv_clases_inventarios h on b.grupo_id = h.grupo_id \n\
//                         and b.clase_id = h.clase_id \n\
//                     inner join existencias_bodegas i on a.codigo_producto = i.codigo_producto \n\
//                where \n\
//                     i.empresa_id = $1 \n\
//                     and i.centro_utilidad = $2 \n\
//                     and i.bodega = $3 \n\
//                     and ( " + sql_filter + " ) " +
//                     sql_aux + 
//                "group by a.codigo_producto, a.precio_regulado, a.existencia, a.costo_anterior, a.costo, a.costo_penultima_compra, \n\
//                    a.costo_ultima_compra, a.precio_venta_anterior, a.precio_venta, a.precio_minimo, a.precio_maximo, a.sw_vende, \n\
//                    a.grupo_contratacion_id, a.nivel_autorizacion_id, b.sw_requiereautorizacion_despachospedidos, b.estado, \n\
//                    b.sw_regulado, b.tipo_producto_id, b.unidad_id, b.codigo_invima, b.vencimiento_codigo_invima, b.codigo_cum, \n\
//                    b.contenido_unidad_venta, b.sw_control_fecha_vencimiento, b.grupo_id, b.clase_id, b.subclase_id, b.porc_iva, \n\
//                    b.tipo_producto_id, g.subclase_id, g.descripcion\n\
//                order by 22 desc, 3 asc";

var sql = " select\n\
                    a.codigo_producto,\n\
                    a.precio_regulado,\n\
                    fc_descripcion_producto(a.codigo_producto) as nombre_producto,\n\
                    btrim(fc_precio_producto_contrato_cliente($4, a.codigo_producto, $1), '@') as precio_contrato,\n\
                    a.existencia as existencia_total,\n\
                    a.costo_anterior,\n\
                    a.costo,\n\
                    CASE WHEN a.costo > 0 THEN ROUND (((a.precio_venta/a.costo) - 1) * 100) ELSE NULL END as porcentaje_utilidad,\n\
                    a.costo_penultima_compra,\n\
                    round((a.costo_ultima_compra)/((COALESCE(b.porc_iva,0)/100)+1),2) as costo_ultima_compra,\n\
                    a.precio_venta_anterior,\n\
                    a.precio_venta,\n\
                    a.precio_minimo,\n\
                    a.precio_maximo,\n\
                    a.sw_vende,\n\
                    a.grupo_contratacion_id,\n\
                    a.nivel_autorizacion_id,\n\
                    b.sw_requiereautorizacion_despachospedidos,\n\
                    CASE\n\
                        WHEN ((SUM(a.existencia)-SUM(COALESCE(sq_a.cantidad_pendiente,0)))-SUM(COALESCE(sq_c.total_cantidad,0))) > 0\n\
                        THEN ((SUM(a.existencia)-SUM(COALESCE(sq_a.cantidad_pendiente,0)))-SUM(COALESCE(sq_c.total_cantidad,0)))\n\
                        ELSE '0'\n\
                    END as disponible,\n\
                    b.estado,\n\
                    b.sw_regulado,\n\
                    b.tipo_producto_id,\n\
                    b.unidad_id,\n\
                    b.codigo_invima,\n\
                    to_char(b.vencimiento_codigo_invima, 'DD-MM-YYYY') as vencimiento_codigo_invima,\n\
                    b.codigo_cum,\n\
                    b.contenido_unidad_venta,\n\
                    b.sw_control_fecha_vencimiento,\n\
                    b.grupo_id,\n\
                    b.clase_id,\n\
                    b.subclase_id,\n\
                    b.porc_iva,\n\
                    b.tipo_producto_id, \n\
                    g.subclase_id as molecula_id,\n\
                    g.descripcion as molecula_descripcion,\n\
                    i.existencia as existencia\n\
                from    inventarios a \n\
                    inner join inventarios_productos b on a.codigo_producto = b.codigo_producto \n\
                         and a.empresa_id = $1 \n\
                    left join ( \n\
                        select \n\
                           d.codigo_producto, \n\
                           sum(d.cantidad_pendiente) as cantidad_pendiente \n\
                        from \n\
                            solicitud_productos_a_bodega_principal c \n\
                            inner join solicitud_productos_a_bodega_principal_detalle d on d.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id \n\
                                and c.empresa_destino = $1 \n\
                                and d.cantidad_pendiente > 0 \n\
                        group by 1 \n\
                         ) sq_a on a.codigo_producto = sq_a.codigo_producto\n\
                     left join ( \n\
                        select \n\
                            f.codigo_producto, \n\
                            sum((f.numero_unidades - f.cantidad_despachada)) as total_cantidad \n\
                        from \n\
                            ventas_ordenes_pedidos as e \n\
                             inner join ventas_ordenes_pedidos_d as f on e.pedido_cliente_id = f.pedido_cliente_id \n\
                                and e.estado = '1' \n\
                                and e.empresa_id = $1 \n\
                                and f.numero_unidades <> f.cantidad_despachada \n\
                        group by f.codigo_producto \n\
                     ) sq_c on a.codigo_producto = sq_c.codigo_producto \n\
                     inner join inv_subclases_inventarios g on b.subclase_id = g.subclase_id \n\
                         and b.grupo_id = g.grupo_id \n\
                         and b.clase_id = g.clase_id \n\
                     inner join inv_clases_inventarios h on b.grupo_id = h.grupo_id \n\
                         and b.clase_id = h.clase_id \n\
                     inner join existencias_bodegas i on a.codigo_producto = i.codigo_producto \n\
                where \n\
                     i.empresa_id = $1 \n\
                     and i.centro_utilidad = $2 \n\
                     and i.bodega = $3 \n\
                     and ( " + sql_filter + " ) " +
                     sql_aux + 
                "group by a.codigo_producto, a.precio_regulado, a.existencia, a.costo_anterior, a.costo, a.costo_penultima_compra, \n\
                    a.costo_ultima_compra, a.precio_venta_anterior, a.precio_venta, a.precio_minimo, a.precio_maximo, a.sw_vende, \n\
                    a.grupo_contratacion_id, a.nivel_autorizacion_id, b.sw_requiereautorizacion_despachospedidos, b.estado, \n\
                    b.sw_regulado, b.tipo_producto_id, b.unidad_id, b.codigo_invima, b.vencimiento_codigo_invima, b.codigo_cum, \n\
                    b.contenido_unidad_venta, b.sw_control_fecha_vencimiento, b.grupo_id, b.clase_id, b.subclase_id, b.porc_iva, \n\
                    b.tipo_producto_id, g.subclase_id, g.descripcion, i.existencia\n\
                order by 19 desc, 3 asc";

    G.db.paginated(sql, array_parametros, pagina, G.settings.limit, function(err, rows, result) {
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