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
                CASE WHEN a.estado = '0' THEN 'Ingresada en bodega' \
                     WHEN a.estado = '1' THEN 'Activa' \
                     WHEN a.estado = '2' THEN 'Anulado' \
                     WHEN a.estado = '3' THEN 'Recibida en bodega' \
                     WHEN a.estado = '4' THEN 'Verificada en bodega' END as descripcion_estado, \
                a.sw_orden_compra_finalizada,\
                CASE WHEN a.sw_orden_compra_finalizada = '0' THEN 'En Proceso ...' \
                     WHEN a.sw_orden_compra_finalizada = '1' THEN 'Finalizada' END as estado_digitacion, \
                a.observacion,\
                f.codigo_unidad_negocio,\
                f.imagen,\
                f.descripcion as descripcion_unidad_negocio,\
                a.usuario_id,\
                e.nombre as nombre_usuario,\
                To_char(a.fecha_orden,'dd-mm-yyyy') as fecha_registro,\
                coalesce(To_char(a.fecha_recibido,'dd-mm-yyyy'),'') as fecha_recibido,\
                coalesce(To_char(a.fecha_verificado,'dd-mm-yyyy'),'') as fecha_verificado,\
                CASE WHEN COALESCE (g.orden_pedido_id,0)=0 then 0 else 1 end as tiene_ingreso_temporal \
                FROM compras_ordenes_pedidos a\
                inner join terceros_proveedores b on a.codigo_proveedor_id = b.codigo_proveedor_id\
                inner join terceros c on  b.tipo_id_tercero = c.tipo_id_tercero and b.tercero_id=c.tercero_id \
                inner join empresas d on a.empresa_id = d.empresa_id\
                inner join system_usuarios e on a.usuario_id = e.usuario_id\
                left join unidades_negocio f on a.codigo_unidad_negocio = f.codigo_unidad_negocio \
                left join (\
                    select aa.orden_pedido_id from inv_bodegas_movimiento_tmp_ordenes_compra aa\
                ) as g on a.orden_pedido_id = g.orden_pedido_id\
                WHERE a.fecha_orden between $1 and $2 and \
                (\
                    a.orden_pedido_id::varchar ilike $3 or\
                    d.razon_social ilike $3 or\
                    c.tercero_id ilike $3 or \
                    c.nombre_tercero ilike $3 \
                ) and a.sw_unificada='0' order by 1 DESC ";

    G.db.pagination(sql, [fecha_inicial, fecha_final, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Listar las Ordenes de Compra de un Proveedor
OrdenesCompraModel.prototype.listar_ordenes_compra_proveedor = function(codigo_proveedor_id, callback) {

    // Falta realizar un tipo de filtro, para dejar esta funcion mas global
    // se debe filtrar por el estado. ESTA ACTIVIDAD ESTA PENDIENTE

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
                CASE WHEN a.estado = '0' THEN 'Ingresada en bodega' \
                     WHEN a.estado = '1' THEN 'Activa' \
                     WHEN a.estado = '2' THEN 'Anulado' \
                     WHEN a.estado = '3' THEN 'Recibida en bodega' \
                     WHEN a.estado = '4' THEN 'Verificada en bodega' END as descripcion_estado, \
                a.sw_orden_compra_finalizada,\
                CASE WHEN a.sw_orden_compra_finalizada = '0' THEN 'En Proceso ...' \
                     WHEN a.sw_orden_compra_finalizada = '1' THEN 'Finalizada' END as estado_digitacion, \
                a.observacion,\
                f.codigo_unidad_negocio,\
                f.imagen,\
                f.descripcion as descripcion_unidad_negocio,\
                a.usuario_id,\
                e.nombre as nombre_usuario,\
                To_char(a.fecha_orden,'dd-mm-yyyy') as fecha_registro,\
                coalesce(To_char(a.fecha_recibido,'dd-mm-yyyy'),'') as fecha_recibido,\
                coalesce(To_char(a.fecha_verificado,'dd-mm-yyyy'),'') as fecha_verificado,\
                CASE WHEN COALESCE (g.orden_pedido_id,0)=0 then 0 else 1 end as tiene_ingreso_temporal \
                FROM compras_ordenes_pedidos a\
                inner join terceros_proveedores b on a.codigo_proveedor_id = b.codigo_proveedor_id\
                inner join terceros c on  b.tipo_id_tercero = c.tipo_id_tercero and b.tercero_id=c.tercero_id \
                inner join empresas d on a.empresa_id = d.empresa_id\
                inner join system_usuarios e on a.usuario_id = e.usuario_id\
                left join unidades_negocio f on a.codigo_unidad_negocio = f.codigo_unidad_negocio \
                left join (\
                    select aa.orden_pedido_id from inv_bodegas_movimiento_tmp_ordenes_compra aa\
                ) as g on a.orden_pedido_id = g.orden_pedido_id\
                WHERE a.codigo_proveedor_id = $1 and a.estado = '1' and a.sw_orden_compra_finalizada = '1' order by 1 DESC ";

    G.db.query(sql, [codigo_proveedor_id], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Listar Producto para orden de compra 
OrdenesCompraModel.prototype.listar_productos = function(empresa_id, codigo_proveedor_id, numero_orden, termino_busqueda, laboratorio_id, pagina, callback) {

    var sql_aux = " ";
    if (laboratorio_id)
        sql_aux = " AND a.clase_id = $4 ";

    if (numero_orden > 0)
        sql_aux += " AND a.codigo_producto not in ( select a.codigo_producto from compras_ordenes_pedidos_detalle a where a.orden_pedido_id = " + numero_orden + " ) ";


    var sql = " SELECT \
                e.descripcion as descripcion_grupo,\
                d.descripcion as descripcion_clase,\
                c.descripcion as descripcion_subclase,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                a.porc_iva as iva,\
                e.sw_medicamento,\
                CASE WHEN COALESCE (aa.valor_pactado,0)=0 then round((b.costo_ultima_compra)/((COALESCE(a.porc_iva,0)/100)+1),2) else aa.valor_pactado end as costo_ultima_compra,\
                CASE WHEN COALESCE (aa.valor_pactado,0)=0 then 0 else 1 end as tiene_valor_pactado,\
                a.cantidad,\
                f.descripcion as presentacion,\
                a.sw_regulado\
                FROM  inventarios_productos a\
                INNER JOIN inventarios b ON a.codigo_producto = b.codigo_producto\
                INNER JOIN inv_subclases_inventarios c ON a.subclase_id = c.subclase_id AND a.clase_id = c.clase_id AND a.grupo_id = c.grupo_id\
                INNER JOIN inv_clases_inventarios d ON c.clase_id = d.clase_id AND c.grupo_id = d.grupo_id\
                INNER JOIN inv_grupos_inventarios e ON d.grupo_id = e.grupo_id\
                LEFT JOIN inv_presentacioncomercial f ON a.presentacioncomercial_id = f.presentacioncomercial_id\
                LEFT JOIN (\
                    SELECT b.codigo_producto, b.valor_pactado \
                    FROM contratacion_produc_proveedor a \
                    INNER JOIN contratacion_produc_prov_detalle b on a.contratacion_prod_id = b.contratacion_prod_id\
                    WHERE a.empresa_id= $1 AND a.codigo_proveedor_id = $2 \
                ) as aa on a.codigo_producto = aa.codigo_producto\
                WHERE b.empresa_id = $1 AND a.estado = '1' " + sql_aux + " AND \
                (\
                    a.descripcion ILIKE $3 or\
                    a.codigo_producto ILIKE $3 or\
                    a.contenido_unidad_venta ILIKE $3 or\
                    c.descripcion ILIKE $3 \
                )";
    var parametros = (laboratorio_id) ? [empresa_id, codigo_proveedor_id, "%" + termino_busqueda + "%", laboratorio_id] : [empresa_id, codigo_proveedor_id, "%" + termino_busqueda + "%"];
    G.db.pagination(sql, parametros, pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows);
    });
};
// Consultar Ordenes de Compra  por numero de orden
OrdenesCompraModel.prototype.consultar_orden_compra = function(numero_orden, callback) {

    var sql = " SELECT \
                a.orden_pedido_id as numero_orden,\
                a.empresa_id,\
                a.codigo_proveedor_id,\
                e.tipo_id_tercero,\
                e.tercero_id,\
                e.nombre_tercero,\
                e.direccion,\
                e.telefono,\
                a.codigo_unidad_negocio,\
                d.descripcion,\
                d.imagen,\
                a.estado,\
                CASE WHEN a.estado = '0' THEN 'Ingresada en bodega' \
                     WHEN a.estado = '1' THEN 'Activa' \
                     WHEN a.estado = '2' THEN 'Anulado' \
                     WHEN a.estado = '3' THEN 'Recibida en bodega' \
                     WHEN a.estado = '4' THEN 'Verificada en bodega' END as descripcion_estado, \
                a.sw_orden_compra_finalizada,\
                CASE WHEN a.sw_orden_compra_finalizada = '0' THEN 'En Proceso ...'\
                     WHEN a.sw_orden_compra_finalizada = '1' THEN 'Finalizada' END as estado_digitacion,\
                i.observacion_contrato,\
                a.observacion,\
                a.usuario_id,\
                c.nombre,\
                h.subtotal,\
                h.valor_iva,\
                h.total,\
                To_char(a.fecha_orden, 'dd-mm-yyyy') as fecha_registro,\
                coalesce(To_char(a.fecha_recibido,'dd-mm-yyyy'),'') as fecha_recibido,\
                coalesce(To_char(a.fecha_verificado,'dd-mm-yyyy'),'') as fecha_verificado,\
                CASE WHEN COALESCE (g.orden_pedido_id, 0) = 0 then 0 else 1 end as tiene_ingreso_temporal \
                FROM compras_ordenes_pedidos a \
                inner join terceros_proveedores b on a.codigo_proveedor_id = b.codigo_proveedor_id \
                inner join terceros e on b.tipo_id_tercero = e.tipo_id_tercero and b.tercero_id = e.tercero_id \
                inner join system_usuarios c on a.usuario_id = c.usuario_id\
                left join unidades_negocio d on a.codigo_unidad_negocio = d.codigo_unidad_negocio\
                left join (\
                    select aa.orden_pedido_id from inv_bodegas_movimiento_tmp_ordenes_compra aa\
                ) as g on a.orden_pedido_id = g.orden_pedido_id\
                left join (\
                    select aa.numero_orden, SUM(subtotal) AS subtotal, SUM(valor_iva) AS valor_iva, SUM(total) AS total  from (\
                        select\
                        a.orden_pedido_id as numero_orden,\
                        (a.numero_unidades::integer * a.valor) as subtotal,\
                        ((a.porc_iva / 100) * (a.numero_unidades::integer * a.valor)) as valor_iva,\
                        ((a.numero_unidades::integer * a.valor) + ((a.porc_iva / 100) * (a.numero_unidades::integer * a.valor))) as total\
                        from compras_ordenes_pedidos_detalle as a\
                    ) aa GROUP BY 1\
                ) as h on a.orden_pedido_id = h.numero_orden\
                left join (\
                    select bb.codigo_proveedor_id, bb.observaciones as observacion_contrato from contratacion_produc_proveedor bb\
                ) as i on a.codigo_proveedor_id = i.codigo_proveedor_id\
                WHERE a.orden_pedido_id = $1 ";

    G.db.query(sql, [numero_orden], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};
// Consultar Detalle Ordene de Compra  por numero de orden
OrdenesCompraModel.prototype.consultar_detalle_orden_compra = function(numero_orden, termino_busqueda, pagina, callback) {

    var sql = " select * from (\
                    select\
                    a.item_id, \
                    a.orden_pedido_id as numero_orden,\
                    a.codigo_producto,\
                    fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                    a.numero_unidades::integer as cantidad_solicitada,\
                    a.valor,\
                    a.porc_iva,\
                    (a.numero_unidades::integer * a.valor) as subtotal,\
                    ((a.porc_iva/100) * (a.numero_unidades::integer * a.valor) ) as valor_iva,\
                    ( (a.numero_unidades::integer * a.valor) +  ((a.porc_iva/100) * (a.numero_unidades::integer * a.valor) )) as total,\
                    a.estado,\
                    f.politicas_producto,\
                    b.id as novedad_id,\
                    b.descripcion as descripcion_novedad,\
                    c.id as id_observacion,\
                    c.codigo as codigo_observacion,\
                    c.descripcion as descripcion_observacion,\
                    d.cantidad_archivos\
                    from compras_ordenes_pedidos_detalle a\
                    inner join compras_ordenes_pedidos e on a.orden_pedido_id  = e.orden_pedido_id \
                    left join novedades_ordenes_compras b on a.item_id = b.item_id\
                    left join observaciones_ordenes_compras c on b.observacion_orden_compra_id = c.id\
                    left join (\
                       select a.novedad_orden_compra_id, count(a.*) as cantidad_archivos from archivos_novedades_ordenes_compras a\
                       group by 1\
                    ) as d on b.id = d.novedad_orden_compra_id\
                    left join (\
                        select a.codigo_proveedor_id ,  b.codigo_producto , c.politica as politicas_producto\
                        from contratacion_produc_proveedor a \
                        inner join contratacion_produc_prov_detalle b on a.contratacion_prod_id = b.contratacion_prod_id\
                        left join contratacion_produc_proveedor_politicas c on b.contrato_produc_prov_det_id = c.contrato_produc_prov_det_id \
                    ) as f on e.codigo_proveedor_id = f.codigo_proveedor_id and a.codigo_producto = f.codigo_producto\
                ) AS a where a.numero_orden = $1 and a.estado = '1' and ( a.codigo_producto ilike $2 or  a.descripcion_producto ilike $2 ) ";

    G.db.query(sql, [numero_orden, "%" + termino_busqueda + "%"], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};


// Ingresar Cabecera Orden de Compra
OrdenesCompraModel.prototype.insertar_orden_compra = function(unidad_negocio, codigo_proveedor, empresa_id, observacion, usuario_id, callback) {

    var sql = " INSERT INTO compras_ordenes_pedidos ( orden_pedido_id, codigo_unidad_negocio, codigo_proveedor_id, empresa_id, observacion, usuario_id, estado, fecha_orden ) \
                 VALUES((select nextval('compras_ordenes_pedidos_orden_pedido_id_seq':: regclass )), $1, $2, $3, $4,$5, '1', NOW() ) RETURNING orden_pedido_id; ";

     G.db.query(sql, [ unidad_negocio, codigo_proveedor, empresa_id, observacion, usuario_id], function(err, rows, result) {
         callback(err, rows, result);
     });
};

// Modificar Orden de Compra
OrdenesCompraModel.prototype.actualizar_estado_orden_compra = function(numero_orden, estado, callback) {

    // Estados Orden de Compra
    // 0 => Ingresada en Bodega
    // 1 => Activa
    // 2 => Anulada
    // 3 => Recibida
    // 4 => Verificada

    var sql_aux = " ";

    if (estado === '3')
        sql_aux = " ,fecha_recibido = now() ";
    if (estado === '4')
        sql_aux = " ,fecha_verificado = now() ";

    var sql = " UPDATE compras_ordenes_pedidos SET estado = $2 " + sql_aux + " WHERE orden_pedido_id = $1  ";
    G.db.query(sql, [numero_orden, estado], function(err, rows, result) {
        callback(err, rows, result);
    });
};

// Modificar unidad de negocio de una Orden de Compra
OrdenesCompraModel.prototype.modificar_unidad_negocio = function(numero_orden, unidad_negocio, callback) {


    var sql = "  update compras_ordenes_pedidos set codigo_unidad_negocio = $2 where orden_pedido_id = $1 and estado='1' ";
    G.db.query(sql, [numero_orden, unidad_negocio], function(err, rows, result) {
        callback(err, rows, result);
    });
};

// Modificar unidad de negocio de una Orden de Compra
OrdenesCompraModel.prototype.modificar_observacion = function(numero_orden, observacion, callback) {


    var sql = "  update compras_ordenes_pedidos set observacion = $2 where orden_pedido_id = $1 and estado='1' ";
    G.db.query(sql, [numero_orden, observacion], function(err, rows, result) {
        callback(err, rows, result);
    });
};

// Anular Orden de Compra
OrdenesCompraModel.prototype.anular_orden_compra = function(numero_orden, callback) {


    var sql = " UPDATE compras_ordenes_pedidos SET estado = '2' WHERE orden_pedido_id = $1  ";
    G.db.query(sql, [numero_orden], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Ingresar Detalle Orden de Compra
OrdenesCompraModel.prototype.insertar_detalle_orden_compra = function(numero_orden, codigo_producto, cantidad_solicitada, valor, iva, callback) {


    var sql = " INSERT INTO compras_ordenes_pedidos_detalle ( orden_pedido_id,codigo_producto,numero_unidades,valor,porc_iva,estado)\
                VALUES ( $1, $2, $3, $4, $5, 1 );";
    G.db.query(sql, [numero_orden, codigo_producto, cantidad_solicitada, valor, iva], function(err, rows, result) {
        callback(err, rows, result);
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
        callback(err, rows, result);
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

// Finaliza la Orden de Compra
OrdenesCompraModel.prototype.finalizar_orden_compra = function(numero_orden, orden_compra_finalizada, callback) {


    var sql = "  update compras_ordenes_pedidos set sw_orden_compra_finalizada = $2 where orden_pedido_id = $1 and estado='1' ";
    G.db.query(sql, [numero_orden, orden_compra_finalizada], function(err, rows, result) {
        callback(err, rows, result);
    });
};

// Consultar Novedad Producto Orden de Compra
OrdenesCompraModel.prototype.consultar_novedad_producto = function(novedad_id, callback) {

    var sql = "  SELECT  * FROM novedades_ordenes_compras a WHERE a.id = $1 ; ";
    G.db.query(sql, [novedad_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};


// Registrar Novedad Producto Orden de Compra
OrdenesCompraModel.prototype.insertar_novedad_producto = function(item_id, observacion_id, descripcion_novedad, usuario_id, callback) {

    var sql = "  INSERT INTO novedades_ordenes_compras (item_id, observacion_orden_compra_id, descripcion, usuario_id) \
                 VALUES ( $1, $2, $3, $4) RETURNING id as novedad_id ; ";
    G.db.query(sql, [item_id, observacion_id, descripcion_novedad, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};

// Modificar Novedad Producto Orden de Compra 
OrdenesCompraModel.prototype.modificar_novedad_producto = function(novedad_id, observacion_id, descripcion_novedad, usuario_id, callback) {

    var sql = " UPDATE novedades_ordenes_compras SET  observacion_orden_compra_id =$2 , descripcion =$3 , usuario_id = $4 WHERE id = $1 ; ";
    G.db.query(sql, [novedad_id, observacion_id, descripcion_novedad, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};


// Modificar Novedad Producto Orden de Compra 
OrdenesCompraModel.prototype.insertar_archivo_novedad_producto = function(novedad_id, nombre_archivo, descripcion_archivo, usuario_id, callback) {

    var sql = " INSERT INTO archivos_novedades_ordenes_compras (novedad_orden_compra_id, nombre_archivo, descripcion_archivo, usuario_id, fecha_registro) \
                VALUES ( $1, $2, $3, $4, now() ) ; ";
    G.db.query(sql, [novedad_id, nombre_archivo, descripcion_archivo, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};

// Consultar Archivo Novedad Producto Orden de Compra
OrdenesCompraModel.prototype.consultar_archivo_novedad_producto = function(novedad_id, callback) {

    var sql = "  SELECT * FROM archivos_novedades_ordenes_compras a WHERE a.novedad_orden_compra_id = $1 ; ";

    G.db.query(sql, [novedad_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};


// Listado de recepciones de mercancia.
OrdenesCompraModel.prototype.listar_recepciones_mercancia = function(fecha_inicial, fecha_final, termino_busqueda, pagina, callback) {

    var sql = " select \
                a.id,\
                a.empresa_id,\
                b.tipo_id_tercero as tipo_id_empresa,\
                b.id as nit_empresa,\
                b.razon_social as nombre_empresa,\
                a.codigo_proveedor_id,\
                d.tipo_id_tercero as tipo_id_proveedor,\
                d.tercero_id as tercero_id,\
                d.nombre_tercero as nombre_proveedor,\
                d.direccion as direccion_proveedor,\
                d.telefono as telefono_proveedor,\
                a.orden_pedido_id as numero_orden,\
                a.inv_transportador_id,\
                e.descripcion as nombre_transportadora,\
                e.estado as estado_transportadora,\
                a.novedades_recepcion_id,\
                f.codigo as codigo_novedad,\
                f.descripcion as descripcion_novedad,\
                f.estado as estado_novedad,\
                a.numero_guia,\
                a.numero_factura,\
                a.cantidad_cajas,\
                a.cantidad_neveras,\
                a.temperatura_neveras,\
                a.contiene_medicamentos,\
                a.contiene_dispositivos,\
                a.estado,\
                CASE WHEN a.estado = '0' THEN 'Anulada' \
                     WHEN a.estado = '1' THEN 'Activa' \
                     WHEN a.estado = '2' THEN 'Finalizada' END as descripcion_estado, \
                to_char(a.fecha_recepcion,'dd-mm-yyyy') as fecha_recepcion,\
                to_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro\
                from recepcion_mercancia a\
                inner join empresas b on a.empresa_id = b.empresa_id\
                inner join terceros_proveedores c on a.codigo_proveedor_id = c.codigo_proveedor_id\
                inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id=d.tercero_id\
                inner join inv_transportadoras e on a.inv_transportador_id = e.transportadora_id \
                left join novedades_recepcion_mercancia f on a.novedades_recepcion_id = f.id\
                where a.fecha_registro between $1 and $2 and \
                (\
                    d.tercero_id ilike $3 or\
                    d.nombre_tercero ilike $3 or\
                    a.orden_pedido_id::varchar ilike $3 or \
                    e.descripcion ilike $3 or\
                    a.numero_guia ilike $3 or\
                    a.numero_factura::varchar ilike $3 \
                ) order by a.fecha_registro DESC ";

    G.db.pagination(sql, [fecha_inicial, fecha_final, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows);
    });
};


// Consultar recepcion de mercancia.
OrdenesCompraModel.prototype.consultar_recepcion_mercancia = function(recepcion_mercancia_id, callback) {

    var sql = " select \
                a.id,\
                a.empresa_id,\
                b.tipo_id_tercero as tipo_id_empresa,\
                b.id as nit_empresa,\
                b.razon_social as nombre_empresa,\
                a.codigo_proveedor_id,\
                d.tipo_id_tercero as tipo_id_proveedor,\
                d.tercero_id as tercero_id,\
                d.nombre_tercero as nombre_proveedor,\
                d.direccion as direccion_proveedor,\
                d.telefono as telefono_proveedor,\
                a.orden_pedido_id as numero_orden,\
                a.inv_transportador_id,\
                e.descripcion as nombre_transportadora,\
                e.estado as estado_transportadora,\
                a.novedades_recepcion_id,\
                f.codigo as codigo_novedad,\
                f.descripcion as descripcion_novedad,\
                f.estado as estado_novedad,\
                a.numero_guia,\
                a.numero_factura,\
                a.cantidad_cajas,\
                a.cantidad_neveras,\
                a.temperatura_neveras,\
                a.contiene_medicamentos,\
                a.contiene_dispositivos,\
                a.estado,\
                CASE WHEN a.estado = '0' THEN 'Anulada' \
                     WHEN a.estado = '1' THEN 'Activa' \
                     WHEN a.estado = '2' THEN 'Finalizada' END as descripcion_estado, \
                to_char(a.fecha_recepcion,'dd-mm-yyyy') as fecha_recepcion,\
                to_char(a.hora_recepcion,'HH24:MI:SS') as hora_recepcion,\
                to_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro\
                from recepcion_mercancia a\
                inner join empresas b on a.empresa_id = b.empresa_id\
                inner join terceros_proveedores c on a.codigo_proveedor_id = c.codigo_proveedor_id\
                inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id=d.tercero_id\
                inner join inv_transportadoras e on a.inv_transportador_id = e.transportadora_id \
                left join novedades_recepcion_mercancia f on a.novedades_recepcion_id = f.id\
                where a.id = $1 ;";

    G.db.query(sql, [recepcion_mercancia_id], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};


// Insertar Recepcion mercancia
OrdenesCompraModel.prototype.insertar_recepcion_mercancia = function(recepcion_mercancia, callback) {

    var that = this;

    var validacion = __validar_campos_ingreso_recepcion(recepcion_mercancia);

    if (!validacion.continuar) {
        callback(validacion, null);
        return;
    }

    if (recepcion_mercancia.novedad === undefined || recepcion_mercancia.novedad === '') {
        recepcion_mercancia.novedad = {id: null};
    }

    if (recepcion_mercancia.temperatura_neveras === '') {
        recepcion_mercancia.temperatura_neveras = null;
    }

    recepcion_mercancia.contiene_medicamentos = (recepcion_mercancia.contiene_medicamentos) ? '1' : '0';
    recepcion_mercancia.contiene_dispositivos = (recepcion_mercancia.contiene_dispositivos) ? '1' : '0';

    var fecha_recepcion = new Date(recepcion_mercancia.hora_ingreso);
    recepcion_mercancia.hora_ingreso = fecha_recepcion.toFormat('HH24:MI:SS');

    var sql = " insert into recepcion_mercancia (\
                    empresa_id,\
                    codigo_proveedor_id,\
                    orden_pedido_id,\
                    inv_transportador_id,\
                    novedades_recepcion_id,\
                    numero_guia,\
                    numero_factura,\
                    cantidad_cajas,\
                    cantidad_neveras,\
                    temperatura_neveras,\
                    contiene_medicamentos,\
                    contiene_dispositivos,\
                    usuario_id,\
                    fecha_recepcion,\
                    hora_recepcion\
                ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning id; ";

    var parametros = [
        recepcion_mercancia.empresa_id,
        recepcion_mercancia.proveedor.codigo_proveedor_id,
        recepcion_mercancia.orden_compra.numero_orden_compra,
        recepcion_mercancia.transportadora.id,
        recepcion_mercancia.novedad.id,
        recepcion_mercancia.numero_guia,
        recepcion_mercancia.numero_factura,
        recepcion_mercancia.cantidad_cajas,
        recepcion_mercancia.cantidad_neveras,
        recepcion_mercancia.temperatura_neveras,
        recepcion_mercancia.contiene_medicamentos,
        recepcion_mercancia.contiene_dispositivos,
        recepcion_mercancia.usuario_id,
        recepcion_mercancia.fecha_ingreso,
        recepcion_mercancia.hora_ingreso
    ];

    G.db.query(sql, parametros, function(err, rows, result, total_records) {

        var estado = '3'; // Recibida

        that.actualizar_estado_orden_compra(recepcion_mercancia.orden_compra.numero_orden_compra, estado, function(_err, _rows, _result) {

            callback(err, rows);
        });
    });
};


// Insertar Recepcion mercancia
OrdenesCompraModel.prototype.modificar_recepcion_mercancia = function(recepcion_mercancia, callback) {

    var validacion = __validar_campos_ingreso_recepcion(recepcion_mercancia);

    if (!validacion.continuar) {
        callback(validacion, null);
        return;
    }

    var sql = " update recepcion_mercancia set \
                empresa_id = $2,\
                codigo_proveedor_id = $3,\
                orden_pedido_id = $4,\
                inv_transportador_id = $5,\
                novedades_recepcion_id = $6,\
                numero_guia = $7,\
                numero_factura = $8,\
                cantidad_cajas = $9,\
                cantidad_neveras = $10,\
                temperatura_neveras = $11,\
                contiene_medicamentos = $12,\
                contiene_dispositivos = $13,\
                where id = $1 ; ";

    var parametros = [
        recepcion_mercancia.id,
        recepcion_mercancia.empresa_id,
        recepcion_mercancia.codigo_proveedor_id,
        recepcion_mercancia.orden_pedido_id,
        recepcion_mercancia.inv_transportador_id,
        recepcion_mercancia.novedades_recepcion_id,
        recepcion_mercancia.numero_guia,
        recepcion_mercancia.numero_factura,
        recepcion_mercancia.cantidad_cajas,
        recepcion_mercancia.cantidad_neveras,
        recepcion_mercancia.temperatura_neveras,
        recepcion_mercancia.contiene_medicamentos,
        recepcion_mercancia.contiene_dispositivos
    ];

    G.db.query(sql, [parametros], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};


// listar productos Recepcion mercancia
OrdenesCompraModel.prototype.listar_productos_recepcion_mercancia = function(recepcion_mercancia_id, callback) {

    var sql = " select \
                a.id,\
                a.recepcion_mercancia_id,\
                b.orden_pedido_id as numero_orden,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                d.numero_unidades::integer as cantidad_solicitada,\
                a.cantidad_recibida,\
                a.novedades_recepcion_id,\
                e.codigo as codigo_novedad,\
                e.descripcion as descripcion_novedad,\
                e.estado as estado_novedad,\
                a.usuario_id,\
                f.nombre as nombre_usuario,\
                a.fecha_registro\
                from recepcion_mercancia_detalle a\
                inner join recepcion_mercancia b on a.recepcion_mercancia_id = b.id\
                inner join compras_ordenes_pedidos c on b.orden_pedido_id = c.orden_pedido_id\
                inner join compras_ordenes_pedidos_detalle d on c.orden_pedido_id = d.orden_pedido_id and a.codigo_producto = d.codigo_producto\
                left join novedades_recepcion_mercancia e on a.novedades_recepcion_id = e.id\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                where a.recepcion_mercancia_id = $1 ;";

    G.db.query(sql, [recepcion_mercancia_id], function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Insertar productos Recepcion mercancia
OrdenesCompraModel.prototype.insertar_productos_recepcion_mercancia = function(producto_mercancia, callback) {


    var sql = " insert into recepcion_mercancia_detalle  ( recepcion_mercancia_id, novedades_recepcion_id, codigo_producto, cantidad_recibida, usuario_id ) \
                values ( $1, $2, $3, $4, $5) ; ";

    var parametros = [
        producto_mercancia.recepcion_mercancia_id,
        producto_mercancia.novedades_recepcion_id,
        producto_mercancia.codigo_producto,
        producto_mercancia.cantidad_recibida,
        producto_mercancia.usuario_id
    ];

    G.db.query(sql, parametros, function(err, rows, result, total_records) {
        callback(err, rows);
    });
};


// Modificar productos Recepcion mercancia
OrdenesCompraModel.prototype.modificar_productos_recepcion_mercancia = function(recepcion_mercancia, producto_mercancia, callback) {

    var validacion = __validar_campos_ingreso_producto(recepcion_mercancia, producto_mercancia);

    if (!validacion.continuar) {
        callback(validacion, null);
        return;
    }

    if (producto_mercancia.novedad_recepcion === undefined || producto_mercancia.novedad_recepcion === '') {
        producto_mercancia.novedad_recepcion = {id: null};
    }


    var sql = " update recepcion_mercancia_detalle set novedades_recepcion_id = $3, cantidad_recibida = $4 where  recepcion_mercancia_id = $1 and codigo_producto = $2 ; ";

    var parametros = [
        recepcion_mercancia.numero_recepcion,
        producto_mercancia.codigo_producto,
        producto_mercancia.novedad_recepcion.id,
        producto_mercancia.cantidad_recibida
    ];

    G.db.query(sql, parametros, function(err, rows, result, total_records) {
        callback(err, rows);
    });
};

// Modificar productos Recepcion mercancia
OrdenesCompraModel.prototype.finalizar_recepcion_mercancia = function(recepcion, callback) {

    var that = this;
    console.log(recepcion);

    var sql = " update recepcion_mercancia set estado = '2' where  id = $1 ; ";

    G.db.query(sql, [recepcion.numero_recepcion], function(err, rows, result, total_records) {

        var estado = '4'; // Verificada

        that.actualizar_estado_orden_compra(recepcion.orden_compra.numero_orden_compra, estado, function(_err, _rows, _result) {

            callback(err, rows);
        });
    });
};


function __validar_campos_ingreso_recepcion(recepcion_mercancia) {

    var continuar = true;
    var msj = '';

    if (recepcion_mercancia.empresa_id === undefined || recepcion_mercancia.proveedor === undefined || recepcion_mercancia.orden_compra === undefined) {
        continuar = false;
        msj = 'empresa_id, codigo_proveedor_id u orden_pedido_id no estan definidas';
    }

    if (recepcion_mercancia.transportadora === undefined || recepcion_mercancia.novedad === undefined) {
        continuar = false;
        msj = 'inv_transportador_id o novedades_recepcion_id no estan definidas';
    }

    if (recepcion_mercancia.numero_guia === undefined || recepcion_mercancia.numero_factura === undefined) {
        continuar = false;
        msj = 'numero_guia o numero_factura no estan definidas';
    }

    if (recepcion_mercancia.cantidad_cajas === undefined || recepcion_mercancia.cantidad_neveras === undefined) {
        continuar = false;
        msj = 'cantidad_cajas o cantidad_neveras no estan definidas';
    }

    if (recepcion_mercancia.temperatura_neveras === undefined) {
        continuar = false;
        msj = 'temperatura_neverasno estan definidas';
    }

    if (recepcion_mercancia.contiene_medicamentos === undefined || recepcion_mercancia.contiene_dispositivos === undefined) {
        continuar = false;
        msj = 'contiene_medicamentos o contiene_dispositivos no estan definidas';
    }

    if (recepcion_mercancia.fecha_ingreso === undefined || recepcion_mercancia.hora_ingreso === undefined) {
        continuar = false;
        msj = 'fecha_ingreso o hora_ingreso no estan definidas';
    }

    if (recepcion_mercancia.empresa_id === '' || recepcion_mercancia.proveedor === '' || recepcion_mercancia.orden_compra === '') {
        continuar = false;
        msj = 'empresa_id, codigo_proveedor_id u orden_pedido_id estan vacias';
    }

    if (recepcion_mercancia.transportadora === '') {
        continuar = false;
        msj = 'transportadora esta vacias';
    }

    if (recepcion_mercancia.numero_guia === '' || recepcion_mercancia.numero_factura === '') {
        continuar = false;
        msj = 'numero_guia o numero_factura esta vacias';
    }

    if (recepcion_mercancia.fecha_ingreso === undefined || recepcion_mercancia.hora_ingreso === undefined) {
        continuar = false;
        msj = 'fecha_ingreso o hora_ingreso estan vacios';
    }

    return {continuar: continuar, msj: msj};
}
;

function __validar_campos_ingreso_producto(recepcion, producto) {

    var continuar = true;
    var msj = '';

    if (recepcion.numero_recepcion === undefined) {
        continuar = false;
        msj = 'numero_recepcion no estan definidas';
    }

    if (recepcion.numero_recepcion === '' || recepcion.numero_recepcion === 0 || recepcion.numero_recepcion === '0') {
        continuar = false;
        msj = 'numero_recepcion invalido';
    }

    if (producto.codigo_producto === undefined) {
        continuar = false;
        msj = 'codigo_producto no estan definidas';
    }

    if (producto.codigo_producto === '') {
        continuar = false;
        msj = 'codigo_producto esta vacio ';
    }

    if (producto.cantidad_recibida === undefined) {
        continuar = false;
        msj = 'cantidad_recibida esta vacio ';
    }

    return {continuar: continuar, msj: msj};
}
;

module.exports = OrdenesCompraModel;