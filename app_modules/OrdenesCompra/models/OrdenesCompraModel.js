var OrdenesCompraModel = function(m_unidad_negocio, m_proveedores) {
    this.m_unidad_negocio = m_unidad_negocio;
    this.m_proveedores    = m_proveedores;
};

// Listar las Ordenes de Compra 
OrdenesCompraModel.prototype.listar_ordenes_compra = function(fecha_inicial, fecha_final, termino_busqueda, pagina, filtro, callback) {
 
    var subQueryTmp = G.knex.column("aa.orden_pedido_id").
                       from("inv_bodegas_movimiento_tmp_ordenes_compra as aa").as("g");
               
    var subQueryNovedades = G.knex("novedades_ordenes_compras as a").select("item_id").sum("item_id as total").groupBy("item_id").as("h");
    
    
    var columns = [
        "a.orden_pedido_id as numero_orden",
        "a.empresa_id",
        "d.tipo_id_tercero as tipo_id_empresa",
        "d.id as nit_empresa",
        "d.razon_social as nombre_empresa",
        "a.codigo_proveedor_id",
        "c.tipo_id_tercero as tipo_id_proveedor",
        "c.tercero_id as nit_proveedor",
        "c.nombre_tercero as nombre_proveedor",
        "c.direccion as direccion_proveedor",
        "c.telefono as telefono_proveedor",
        "a.estado",
        G.knex.raw("CASE WHEN a.estado = '0' THEN 'Ingresada en bodega'\
             WHEN a.estado = '1' THEN 'Activa'\
             WHEN a.estado = '2' THEN 'Anulado'\
             WHEN a.estado = '3' THEN 'Recibida en bodega'\
             WHEN a.estado = '4' THEN 'Verificada en bodega'\
             WHEN a.estado = '5' THEN 'Bloqueada' \
             WHEN a.estado = '6' THEN 'Con Pdt' END as descripcion_estado,\
        a.sw_orden_compra_finalizada"),
        G.knex.raw("CASE WHEN a.sw_orden_compra_finalizada = '0' THEN 'En Proceso ...'\
             WHEN a.sw_orden_compra_finalizada = '1' THEN 'Finalizada' END as estado_digitacion"), 
        "a.observacion",
        "f.codigo_unidad_negocio",
        "f.imagen",
        "f.descripcion as descripcion_unidad_negocio",
        "a.usuario_id",
        "e.nombre as nombre_usuario",
        G.knex.raw("To_char(a.fecha_orden,'dd-mm-yyyy') as fecha_registro"),
        G.knex.raw("coalesce(To_char(a.fecha_recibido,'dd-mm-yyyy'),'') as fecha_recibido"),
        G.knex.raw("coalesce(To_char(a.fecha_verificado,'dd-mm-yyyy'),'') as fecha_verificado"),
        G.knex.raw("CASE WHEN COALESCE (g.orden_pedido_id,0)=0 then 0 else 1 end as tiene_ingreso_temporal"),
        G.knex.raw("(SELECT count(bbb.item_id)\
                    FROM compras_ordenes_pedidos_detalle aaa\
                    INNER JOIN novedades_ordenes_compras bbb ON aaa.item_id = bbb.item_id\
                    WHERE aaa.orden_pedido_id = a.orden_pedido_id) as total_novedades")
    ];
    
    var query = G.knex.column(columns).
    from("compras_ordenes_pedidos  as a").

    innerJoin("terceros_proveedores as b", "a.codigo_proveedor_id", "b.codigo_proveedor_id").
    innerJoin("terceros as c", function(){
         this.on("b.tipo_id_tercero", "c.tipo_id_tercero" ).
         on("b.tercero_id", "c.tercero_id");
    }).
    innerJoin("empresas as d", "a.empresa_id", "d.empresa_id").
    innerJoin("system_usuarios as e", "a.usuario_id", "e.usuario_id").
    leftJoin("unidades_negocio as f", "a.codigo_unidad_negocio", "f.codigo_unidad_negocio").
    leftJoin(subQueryTmp,"a.orden_pedido_id", "g.orden_pedido_id").    
    whereBetween('a.fecha_orden', [G.knex.raw("('" + fecha_inicial + "')"), G.knex.raw("('" + fecha_final + "')")]).
    where({
           "a.sw_unificada"  : '0'
    }).
    andWhere(function() {

        if (filtro && filtro.proveedor){
            this.where("c.tercero_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
            orWhere("c.nombre_tercero",  G.constants.db().LIKE, "%" + termino_busqueda + "%");
    
        } else if (filtro && filtro.empresa){
            this.where("d.razon_social", G.constants.db().LIKE, "%" + termino_busqueda + "%");
            
        } else {
            this.where(G.knex.raw("a.orden_pedido_id::varchar"), G.constants.db().LIKE, "%" + termino_busqueda + "%");
        }

    }).
    limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).
    orderByRaw("1 DESC").
    
    /*callback(true, query.toSQL());
    return;*/
    then(function(rows){
        callback(false, rows);
    }).
    catch(function(err){
       console.log("err (/catch) [listar_ordenes_compra]: ", err);
       callback(err);
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
                WHERE a.codigo_proveedor_id = :1 and (a.estado = '1' OR a.estado = '6')  and a.sw_orden_compra_finalizada = '1' order by 1 DESC ";
    
    G.knex.raw(sql, {1:codigo_proveedor_id}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

// Listar Producto para orden de compra 
OrdenesCompraModel.prototype.listar_productos = function(empresa_id, codigo_proveedor_id, numero_orden, termino_busqueda, laboratorio_id, pagina, filtro, callback) {

    var subQueryContrato = G.knex.column("b.codigo_producto", "b.valor_pactado").
                        from("contratacion_produc_proveedor as a").
                        innerJoin("contratacion_produc_prov_detalle as b", "a.contratacion_prod_id", "b.contratacion_prod_id").
                        where("a.empresa_id", empresa_id).andWhere("a.codigo_proveedor_id",codigo_proveedor_id ).as("aa");
    
    
    var columns = [
        "e.descripcion as descripcion_grupo",
        "d.descripcion as descripcion_clase",
        "c.descripcion as descripcion_subclase",
        "a.codigo_producto",
        G.knex.raw("fc_descripcion_producto(a.codigo_producto) as descripcion_producto"),
        "a.porc_iva as iva",
        "e.sw_medicamento",
        G.knex.raw("CASE WHEN COALESCE (aa.valor_pactado,0)=0 then round((b.costo_ultima_compra)/((COALESCE(a.porc_iva,0)/100)+1),2) else aa.valor_pactado end as costo_ultima_compra"),
        G.knex.raw("CASE WHEN COALESCE (aa.valor_pactado,0)=0 then 0 else 1 end as tiene_valor_pactado"),
        "a.cantidad",
        "f.descripcion as presentacion",
        "a.sw_regulado"
    ];                  
    
   var query = G.knex.column(columns).
    from("inventarios_productos  as a").

    innerJoin("inventarios as b", "a.codigo_producto", "b.codigo_producto").
    innerJoin("inv_subclases_inventarios as c", function(){
         this.on("a.subclase_id", "c.subclase_id" ).
         on("a.clase_id", "c.clase_id").
         on("a.grupo_id", "c.grupo_id");
    }).
    innerJoin("inv_clases_inventarios as d", function(){
         this.on("c.clase_id", "d.clase_id" ).
         on("c.grupo_id", "d.grupo_id");
    }).
    innerJoin("inv_grupos_inventarios as e", function(){
         this.on("d.grupo_id", "e.grupo_id" );
    }).
    innerJoin("inv_presentacioncomercial as f", function(){
         this.on("a.presentacioncomercial_id", "f.presentacioncomercial_id" );
    }).   
    leftJoin(subQueryContrato,"a.codigo_producto", "aa.codigo_producto").    
    where({
           "b.empresa_id" : empresa_id
           //se comenta por requerimiento 09/12/2015
          // "a.estado"  : '1'
    }).
    andWhere(function() {
        if (laboratorio_id)
          this.where("a.clase_id", laboratorio_id);

        if (numero_orden > 0){
          this.whereRaw(
            "a.codigo_producto not in ( select a.codigo_producto from compras_ordenes_pedidos_detalle a where a.orden_pedido_id = ?)", [numero_orden]
          );
        }
        
        if(filtro && filtro.descripcionProducto){
            this.where("a.descripcion", G.constants.db().LIKE, "%" + termino_busqueda + "%");
        } else if (filtro && filtro.molecula){
            this.where("c.descripcion", G.constants.db().LIKE, "%" + termino_busqueda + "%");
        } else if (filtro && filtro.unidadVenta){
            this.where("a.contenido_unidad_venta", G.constants.db().LIKE, "%" + termino_busqueda + "%");            
        } else {
            this.where("a.codigo_producto", G.constants.db().LIKE, "%" + termino_busqueda + "%");  
        }

    })
    query.limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).then(function(rows){
      
        callback(false, rows);
    }).catch(function(err){
      console.log("err (/catch) [listar_productos]: ", err);
       callback(err);
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
                a.estado, \
                j.id as nit,\
                CASE WHEN a.estado = '0' THEN 'Ingresada en bodega' \
                     WHEN a.estado = '1' THEN 'Activa' \
                     WHEN a.estado = '2' THEN 'Anulado' \
                     WHEN a.estado = '3' THEN 'Recibida en bodega' \
                     WHEN a.estado = '4' THEN 'Verificada en bodega' \
                     WHEN a.estado = '5' THEN 'Bloqueada'\
                     WHEN a.estado = '6' THEN 'Con Pdt' END as descripcion_estado,\
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
                CASE WHEN COALESCE (g.orden_pedido_id, 0) = 0 then 0 else 1 end as tiene_ingreso_temporal, \
                k.bodega as bodega_destino,\
                k.empresa_id as empresa_destino,\
                k.centro_utilidad as centro_utilidad_destino,\
                l.descripcion as descripcion_bodega_destino,\
                l.ubicacion as ubicacion_bodega_destino,\
                m.id as unidad_negocio_nit\
                FROM compras_ordenes_pedidos a \
                INNER JOIN empresas j ON j.empresa_id=a.empresa_id \
                inner join terceros_proveedores b on a.codigo_proveedor_id = b.codigo_proveedor_id \
                inner join terceros e on b.tipo_id_tercero = e.tipo_id_tercero and b.tercero_id = e.tercero_id \
                inner join system_usuarios c on a.usuario_id = c.usuario_id\
                left join unidades_negocio d on a.codigo_unidad_negocio = d.codigo_unidad_negocio\
                left join empresas as m on d.empresa_id = m.empresa_id\
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
                left join compras_ordenes_destino k on k.orden_compra_id = a.orden_pedido_id\
                left join bodegas l on l.bodega = k.bodega and l.empresa_id = k.empresa_id and l.centro_utilidad = k.centro_utilidad\
                WHERE a.orden_pedido_id = :1 ";
    
    G.knex.raw(sql, {1:numero_orden}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       console.log("error consultado orden ", err);
       callback(err);
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
                    a.numero_unidades_recibidas::integer as cantidad_recibida,\
                    (a.numero_unidades - coalesce(a.numero_unidades_recibidas, 0))::integer as cantidadPendiente,\
                    a.valor,\
                    a.porc_iva,\
                    (a.numero_unidades::integer * a.valor) as subtotal,\
                    ((a.porc_iva/100) * (a.numero_unidades::integer * a.valor) ) as valor_iva,\
                    ( (a.numero_unidades::integer * a.valor) +  ((a.porc_iva/100) * (a.numero_unidades::integer * a.valor) )) as total,\
                    a.estado,\
                    f.politicas_producto,\
                    CASE WHEN COALESCE (f.valor_pactado,0)=0 then 0 else 1 end as tiene_valor_pactado\
                    from compras_ordenes_pedidos_detalle a\
                    inner join compras_ordenes_pedidos e on a.orden_pedido_id  = e.orden_pedido_id \
                    left join (\
                        select a.codigo_proveedor_id ,  b.codigo_producto , c.politica as politicas_producto, b.valor_pactado\
                        from contratacion_produc_proveedor a \
                        inner join contratacion_produc_prov_detalle b on a.contratacion_prod_id = b.contratacion_prod_id\
                        left join contratacion_produc_proveedor_politicas c on b.contrato_produc_prov_det_id = c.contrato_produc_prov_det_id \
                    ) as f on e.codigo_proveedor_id = f.codigo_proveedor_id and a.codigo_producto = f.codigo_producto\
                ) AS a where a.numero_orden = :1 and a.estado = '1' and ( a.codigo_producto "+G.constants.db().LIKE+" :2 or\
                  a.descripcion_producto "+G.constants.db().LIKE+" :2 ) ";


    G.knex.raw(sql, {1:numero_orden, 2:"%" + termino_busqueda + "%"}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       console.log("err (/catch) [consultar_detalle_orden_compra]: ", err);
       callback(err);
    });
};

OrdenesCompraModel.prototype.consultarDetalleOrdenCompraConNovedades = function(numero_orden, termino_busqueda, pagina, callback){
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
                    d.cantidad_archivos,\
                    coalesce(g.total_novedades, 0) as total_novedades,\
                    b.descripcion_entrada\
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
                    left join(\
                	select count(a.item_id) as total_novedades, a.item_id from novedades_ordenes_compras a group by 2\
                    ) as g on g.item_id = a.item_id\
                ) AS a where a.numero_orden = :1 and a.estado = '1' and ( a.codigo_producto "+G.constants.db().LIKE+" :2 or\
                  a.descripcion_producto "+G.constants.db().LIKE+" :2 )\
                order by 19 desc ";
    
    G.knex.raw(sql, {1:numero_orden, 2:"%" + termino_busqueda + "%"}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
        console.log("err [consultarDetalleOrdenCompraConNovedades]: ", err);
       callback(err);
    });

}

// Ingresar Cabecera Orden de Compra
OrdenesCompraModel.prototype.insertar_orden_compra = function(unidad_negocio, codigo_proveedor, empresa_id, observacion, usuario_id, transaccion, callback) {

    var sql = " INSERT INTO compras_ordenes_pedidos ( orden_pedido_id, codigo_unidad_negocio, codigo_proveedor_id, empresa_id, observacion, usuario_id, estado, fecha_orden ) \
                 VALUES((select max(orden_pedido_id) +1 from compras_ordenes_pedidos), :1, :2, :3, :4, :5, '1', NOW() ) RETURNING orden_pedido_id; ";
     
    var query = G.knex.raw(sql, {1:unidad_negocio, 2:codigo_proveedor, 3:empresa_id, 4:observacion, 5:usuario_id}); 
     
    if(transaccion) query.transacting(transaccion);
     
    query.then(function(resultado){
       callback(false, resultado.rows);
    }).catch(function(err){
       console.log("erro (/catch) [insertar_orden_compra]: ", err);
       callback(err);
    });
     
};

OrdenesCompraModel.prototype.guardarDestinoOrden = function(parametros, callback) {

    var sql = " SELECT id FROM compras_ordenes_destino WHERE orden_compra_id = :1 ";
     
    G.knex.raw(sql, {1:parametros.ordenCompraId}).then(function(resultado){
       
       if(resultado.rows.length > 0){
           sql = "UPDATE compras_ordenes_destino set empresa_id = :2, centro_utilidad = :3, bodega = :4 WHERE orden_compra_id = :1 ";
           return G.knex.raw(sql, {1:parametros.ordenCompraId, 2:parametros.empresaId, 3:parametros.centroUtilidad, 4:parametros.bodega});
       } else {
           sql = "INSERT INTO compras_ordenes_destino (orden_compra_id, empresa_id, centro_utilidad, bodega)\
                  VALUES( :1, :2, :3, :4 )";
           return G.knex.raw(sql, {1:parametros.ordenCompraId, 2:parametros.empresaId, 3:parametros.centroUtilidad, 4:parametros.bodega});
       }
       
    }).then(function(resultado){
        
        callback(false, resultado);
    }).catch(function(err){
       console.log("error [guardarDestinoOrden]: ", err);
       callback(err);
    });
     
};

OrdenesCompraModel.prototype.borrarBodegaOrden = function(orden, callback) {
    var sql = " DELETE  FROM compras_ordenes_destino WHERE orden_compra_id = :1 ";
    
    G.knex.raw(sql, {1:orden}).then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
       callback(err);
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
    // 5 => Bloqueada

    var sql_aux = " ";

    if (estado === '3')
        sql_aux = " ,fecha_recibido = now() ";
    if (estado === '4')
        sql_aux = " ,fecha_verificado = now() ";
    
    if (estado === '6')
        sql_aux = " ,fecha_verificado = now() ";
    
    var sql = " UPDATE compras_ordenes_pedidos SET estado = :2 " + sql_aux + " WHERE orden_pedido_id = :1  ";
    
    G.knex.raw(sql, {1:numero_orden, 2:estado}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
        console.log("actualizar_estado_orden_compra ", err)
       callback(err);
    });
};

// Modificar unidad de negocio de una Orden de Compra
OrdenesCompraModel.prototype.modificar_unidad_negocio = function(numero_orden, unidad_negocio, callback) {


    var sql = "  update compras_ordenes_pedidos set codigo_unidad_negocio = :2 where orden_pedido_id = :1 and (estado= '1' or estado = '3' or estado = '4') ";
    
    G.knex.raw(sql, {1:numero_orden, 2:unidad_negocio}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};

// Modificar unidad de negocio de una Orden de Compra
OrdenesCompraModel.prototype.modificar_observacion = function(numero_orden, observacion, callback) {


    var sql = "  update compras_ordenes_pedidos set observacion = :2 where orden_pedido_id = :1 and (estado= '1' or estado = '3' or estado = '4') ";
    
    G.knex.raw(sql, {1:numero_orden, 2:observacion}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

// Anular Orden de Compra //obsoleto
OrdenesCompraModel.prototype.anular_orden_compra = function(numero_orden, callback) {


    var sql = " UPDATE compras_ordenes_pedidos SET estado = '2' WHERE orden_pedido_id = :1  ";
    
    G.knex.raw(sql, {1:numero_orden}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

// Ingresar Detalle Orden de Compra
OrdenesCompraModel.prototype.insertar_detalle_orden_compra = function(numero_orden, codigo_producto, cantidad_solicitada, valor, iva, transaccion, callback) {


    var sql = " INSERT INTO compras_ordenes_pedidos_detalle ( orden_pedido_id,codigo_producto,numero_unidades,valor,porc_iva,estado)\
                VALUES ( :1, :2, :3, :4, :5, 1 );";
    
    var query = G.knex.raw(sql, {1:numero_orden, 2:codigo_producto, 3:cantidad_solicitada, 4:valor, 5:iva});
    
    if(transaccion) query.transacting(transaccion);
    
    query.then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       console.log("err (/catch) [insertar_detalle_orden_compra]: ", err);
       callback(err);
    });
};

// Modificar Detalle Orden de Compra
OrdenesCompraModel.prototype.modificar_detalle_orden_compra = function(numero_orden, codigo_producto, cantidad_solicitada, valor, callback) {


    var sql = " UPDATE  compras_ordenes_pedidos_detalle SET numero_unidades = :3, valor = :4 where orden_pedido_id = :1 and codigo_producto = :2";
    
    G.knex.raw(sql, {1:numero_orden, 2:codigo_producto, 3:cantidad_solicitada, 4:valor}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};

// Eliminar Detalle Orden de Compra
OrdenesCompraModel.prototype.eliminar_detalle_orden_compra = function(numero_orden, callback) {


    var sql = "  DELETE FROM compras_ordenes_pedidos_detalle WHERE orden_pedido_id = :1 ";
    
    G.knex.raw(sql, {1:numero_orden}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};

// Eliminar producto Orden de Compra
OrdenesCompraModel.prototype.eliminar_producto_orden_compra = function(numero_orden, codigo_producto, callback) {


    var sql = "  DELETE FROM compras_ordenes_pedidos_detalle WHERE orden_pedido_id= :1 AND codigo_producto= :2 ";
    
    G.knex.raw(sql, {1:numero_orden, 2:codigo_producto}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
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
                where a.empresa_id = :1 and b.codigo_producto = :2 and b.numero_unidades <> COALESCE(b.numero_unidades_recibidas,0)\
                and a.estado = '1' ; ";

    
    G.knex.raw(sql, {1:empresa_id, 2:codigo_producto}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

// Finaliza la Orden de Compra
OrdenesCompraModel.prototype.finalizar_orden_compra = function(numero_orden, orden_compra_finalizada, callback) {


    var sql = "  update compras_ordenes_pedidos set sw_orden_compra_finalizada = :2 where orden_pedido_id = :1 and estado='1' ";
    
    G.knex.raw(sql, {1:numero_orden, 2:orden_compra_finalizada}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

// Consultar Novedad Producto Orden de Compra
OrdenesCompraModel.prototype.consultar_novedad_producto = function(novedad_id, callback) {

    var sql = "  SELECT  * FROM novedades_ordenes_compras a WHERE a.id = :1 ; ";
    
    G.knex.raw(sql, {1:novedad_id}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

OrdenesCompraModel.prototype.consultarNovedadPorObservacion = function(novedadId, observacionId, callback) {

    var sql = "  SELECT  * FROM novedades_ordenes_compras a WHERE a.id = :1 and observacion_orden_compra_id = :2; ";
    
    G.knex.raw(sql, {1:novedadId, 2:observacionId}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

/*
 * @param {Object} parametros {novedadId : Int}
 * @param {type} callback
 * Metodo que gestiona la eliminacion de la novedad de un producto
 * */

OrdenesCompraModel.prototype.eliminarRegistroNovedad = function(parametros, callback){
    var that = this;
    
    G.Q.ninvoke(that, 'consultar_archivo_novedad_producto', parametros.novedadId).then(function(archivos){
        return G.Q.ninvoke(that, 'eliminarArchivosNovedad', archivos);
    }).then(function(){
        return G.Q.ninvoke(that, 'eliminarNovedad', parametros);
    }).then(function(){
        callback(false);
    }).fail(function(err){
        console.log("err (/fail) [eliminarRegistroNovedad]: ", err);
        callback(err);
    });
   
};

/*
 * @param {Object} parametros {novedadId : Int}
 * @param {type} callback
 * Metodo que elimina la novedad de un producto
 */

OrdenesCompraModel.prototype.eliminarNovedad = function(parametros, callback){
    var sql = "DELETE FROM novedades_ordenes_compras WHERE id = :1";
    
    G.knex.raw(sql, {1:parametros.novedadId}).then(function(resultado){
       callback(false);
    }).catch(function(err){
       console.log("err (/catch) [eliminarNovedad]: ", err);
       callback(err);
    });
};


/*
 * @param {Object} parametros
 * @param {type} callback
 * Metodo que elimina el registro de los archivos de la base de datos y el servidor de la novedad
 */
OrdenesCompraModel.prototype.eliminarArchivosNovedad = function(archivos, callback){

    var archivo =  archivos[0];
    var that = this;
    if(!archivo){
        callback(false);
        return;
    }
    
    var sql = "DELETE FROM archivos_novedades_ordenes_compras WHERE id = :1";
    
    G.knex.raw(sql, {1:archivo.id}).then(function(resultado){
       G.fs.unlinkSync(G.dirname + G.settings.carpeta_ordenes_compra + 'Novedades/' + archivo.nombre_archivo);
       archivos.splice(0,1);
       that.eliminarArchivosNovedad(archivos, callback);
    }).catch(function(err){
        console.log("err (/catch) [eliminarArchivosNovedad]: ", err);
       callback(err);
    });
    
};


// Registrar Novedad Producto Orden de Compra
OrdenesCompraModel.prototype.insertar_novedad_producto = function(item_id, observacion_id, descripcion_novedad, usuario_id, descripcionEntrada, callback) {

    var sql = "  INSERT INTO novedades_ordenes_compras (item_id, observacion_orden_compra_id, descripcion, usuario_id, descripcion_entrada) \
                 VALUES ( :1, :2, :3, :4, :5 ) RETURNING id as novedad_id ; ";

    G.knex.raw(sql, {1:item_id, 2:observacion_id, 3:descripcion_novedad, 4:usuario_id, 5:descripcionEntrada}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       console.log("err (/catch) [insertar_novedad_producto]: ", err);
       callback(err);
    });
};

// Modificar Novedad Producto Orden de Compra 
OrdenesCompraModel.prototype.modificar_novedad_producto = function(novedad_id, observacion_id, descripcion_novedad, usuario_id, descripcionEntrada, callback) {

    var sql = " UPDATE novedades_ordenes_compras SET  observacion_orden_compra_id = :2 , descripcion = :3 , usuario_id = :4 , descripcion_entrada = :5  WHERE id = :1 ; ";
    
    G.knex.raw(sql, {1:novedad_id, 2:observacion_id, 3:descripcion_novedad, 4:usuario_id, 5:descripcionEntrada}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};


/*
 * @Author: Eduar
 * @param {Object} params
 * @param {function} callback
 * +Descripcion: Metodo que inicializa el proceso de ordenes masivas.
 */
OrdenesCompraModel.prototype.gestionarArchivoOrdenes = function(params, callback){
    
    var that = this;
    var ordenesAgrupadas = {};
    var def = G.Q.defer();
    
    G.knex.transaction(function(transaccion) {  
         G.Q.ninvoke(that,'agruparOrdenes', params).then(function(resultado){
             var parametros = {contexto : that, ordenes:resultado, index:0, transaccion:transaccion, notificacion:params.notificacion};
             return G.Q.nfcall(__gestionarOrdenesAgrupadas, parametros);
         }).then(function(resultado){         
            
            return G.Q.nfcall(_generarReporteOrdenes, resultado);
         }).then(function(pdf){
            transaccion.commit(pdf); 
         }).fail(function(err){
             console.log("error (/fail) [gestionarArchivoOrdenes]: ", err);
             transaccion.rollback(err);
         }).done();
     }).then(function(pdf){
         def.notify();
         callback(false, pdf);
     }).catch(function(err){
         console.log("error (/catch) [gestionarArchivoOrdenes]: ", err);
            callback(err);
     }).done();   
};

/*
 * @Author: Eduar
 * @param {Object} params
 * @param {function} callback
 * +Descripcion: Metodo que gestiona el agrupamiento de las ordenes
 */
OrdenesCompraModel.prototype.agruparOrdenes = function(params, callback){
    var that = this;
    var ordenes = {};
    var obj = {contexto:that, datos:params.datos, ordenes:ordenes, empresa_id:params.empresa_id, usuario_id:params.usuario_id};
    
    G.Q.nfcall(__agruparOrdenes, obj).then(function(ordenesAgrupadas){
        callback(false, ordenesAgrupadas);
        
    }).fail(function(err){
        callback(err);
    });
   
};

// Modificar Novedad Producto Orden de Compra 
OrdenesCompraModel.prototype.insertar_archivo_novedad_producto = function(novedad_id, nombre_archivo, descripcion_archivo, usuario_id, callback) {

    var sql = " INSERT INTO archivos_novedades_ordenes_compras (novedad_orden_compra_id, nombre_archivo, descripcion_archivo, usuario_id, fecha_registro) \
                VALUES ( :1, :2, :3, :4, now() ) ; ";
    
    G.knex.raw(sql, {1:novedad_id, 2:nombre_archivo, 3:descripcion_archivo, 4:usuario_id}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

// Consultar Archivo Novedad Producto Orden de Compra
OrdenesCompraModel.prototype.consultar_archivo_novedad_producto = function(novedad_id, callback) {

    var sql = "  SELECT * FROM archivos_novedades_ordenes_compras a WHERE a.novedad_orden_compra_id = :1 ; ";
    G.knex.raw(sql, {1:novedad_id}).then(function(resultado){
       //console.log("archivos encontrados ", resultado);
       callback(false, resultado.rows);
    }).catch(function(err){
       console.log("err (/catch) [consultar_archivo_novedad_producto]: ", err);
       callback(err);
    });
    
};


// Listado de recepciones de mercancia. pendiente
OrdenesCompraModel.prototype.listar_recepciones_mercancia = function(fecha_inicial, fecha_final, termino_busqueda, pagina, callback) {
   
    var columnas = [
        "a.id",
        "a.empresa_id",
        "b.tipo_id_tercero as tipo_id_empresa",
        "b.id as nit_empresa",
        "b.razon_social as nombre_empresa",
        "a.codigo_proveedor_id",
        "d.tipo_id_tercero as tipo_id_proveedor",
        "d.tercero_id as tercero_id",
        "d.nombre_tercero as nombre_proveedor",
        "d.direccion as direccion_proveedor",
        "d.telefono as telefono_proveedor",
        "a.orden_pedido_id as numero_orden",
        "a.inv_transportador_id",
        "e.descripcion as nombre_transportadora",
        "e.estado as estado_transportadora",
        "a.novedades_recepcion_id",
        "f.codigo as codigo_novedad",
        "f.descripcion as descripcion_novedad",
        "f.estado as estado_novedad",
        "a.numero_guia",
        "a.numero_factura",
        "a.cantidad_cajas",
        "a.cantidad_neveras",
        "a.temperatura_neveras",
        "a.contiene_medicamentos",
        "a.contiene_dispositivos",
        "a.estado",
        G.knex.raw("CASE WHEN a.estado = '0' THEN 'Anulada'\
             WHEN a.estado = '1' THEN 'Activa'\
             WHEN a.estado = '2' THEN 'Finalizada' END as descripcion_estado"), 
        G.knex.raw("to_char(a.fecha_recepcion,'dd-mm-yyyy') as fecha_recepcion"),
        G.knex.raw("to_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro")
    ];
    
    var query = G.knex.column(columnas).
    from("recepcion_mercancia as a").
    innerJoin("empresas as b", "a.empresa_id", "b.empresa_id").
    innerJoin("terceros_proveedores as c", "a.codigo_proveedor_id", "c.codigo_proveedor_id").
    innerJoin("terceros as d",function(){
        this.on("c.tipo_id_tercero", "d.tipo_id_tercero").
        on("c.tercero_id", "d.tercero_id");
    }).
    innerJoin("inv_transportadoras as e", "a.inv_transportador_id", "e.transportadora_id").
    leftJoin("novedades_recepcion_mercancia as f", "a.novedades_recepcion_id", "f.id").
    whereBetween('a.fecha_registro', [G.knex.raw("('" + fecha_inicial + "')"), G.knex.raw("('" + fecha_final + "')")]).
    andWhere(function() {

        this.where("d.tercero_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
        orWhere("d.nombre_tercero",  G.constants.db().LIKE, "%" + termino_busqueda + "%").
        orWhere(G.knex.raw("a.orden_pedido_id::varchar"),  G.constants.db().LIKE, "%" + termino_busqueda + "%").
        orWhere("e.descripcion",  G.constants.db().LIKE, "%" + termino_busqueda + "%").
        orWhere("a.numero_guia",  G.constants.db().LIKE, "%" + termino_busqueda + "%").
        orWhere(G.knex.raw("a.numero_factura::varchar"),  G.constants.db().LIKE, "%" + termino_busqueda + "%");
    
    }).
    orderBy("a.fecha_registro", "desc").
    limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).
    then(function(resultado){
       callback(false, resultado);
    }).catch(function(err){
       console.log("err (/catch) [listar_recepciones_mercancia]: ", err);
       callback(err);
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
                where a.id = :1 ;";
    
    G.knex.raw(sql, {1:recepcion_mercancia_id}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
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
                ) values ( :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15 ) returning id; ";

    var parametros = {
        1:recepcion_mercancia.empresa_id,
        2:recepcion_mercancia.proveedor.codigo_proveedor_id,
        3:recepcion_mercancia.orden_compra.numero_orden_compra,
        4:recepcion_mercancia.transportadora.id,
        5:recepcion_mercancia.novedad.id,
        6:recepcion_mercancia.numero_guia,
        7:recepcion_mercancia.numero_factura,
        8:recepcion_mercancia.cantidad_cajas,
        9:recepcion_mercancia.cantidad_neveras,
        10:recepcion_mercancia.temperatura_neveras,
        11:recepcion_mercancia.contiene_medicamentos,
        12:recepcion_mercancia.contiene_dispositivos,
        13:recepcion_mercancia.usuario_id,
        14:recepcion_mercancia.fecha_ingreso,
        15:recepcion_mercancia.hora_ingreso
    };
    
    
    G.knex.raw(sql, parametros).then(function(resultado){
       
        var estado = '3'; // Recibida

        that.actualizar_estado_orden_compra(recepcion_mercancia.orden_compra.numero_orden_compra, estado, function(_err, _rows, _result) {

            callback(false, resultado.rows, resultado);
        });
    }).catch(function(err){
       callback(err);
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
                empresa_id = :2,\
                codigo_proveedor_id = :3,\
                orden_pedido_id = :4,\
                inv_transportador_id = :5,\
                novedades_recepcion_id = :6,\
                numero_guia = :7,\
                numero_factura = :8,\
                cantidad_cajas = :9,\
                cantidad_neveras = :10,\
                temperatura_neveras = :11,\
                contiene_medicamentos = :12,\
                contiene_dispositivos = :13,\
                where id = :1 ; ";

    var parametros = {
        1:recepcion_mercancia.id,
        2:recepcion_mercancia.empresa_id,
        3:recepcion_mercancia.codigo_proveedor_id,
        4:recepcion_mercancia.orden_pedido_id,
        5:recepcion_mercancia.inv_transportador_id,
        6:recepcion_mercancia.novedades_recepcion_id,
        7:recepcion_mercancia.numero_guia,
        8:recepcion_mercancia.numero_factura,
        9:recepcion_mercancia.cantidad_cajas,
        10:recepcion_mercancia.cantidad_neveras,
        11:recepcion_mercancia.temperatura_neveras,
        12:recepcion_mercancia.contiene_medicamentos,
        13:recepcion_mercancia.contiene_dispositivos
    };
    
    G.knex.raw(sql, parametros).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};


// listar productos Recepcion mercancia
OrdenesCompraModel.prototype.listar_productos_recepcion_mercancia = function(obj, callback) {

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
                a.fecha_registro,\
                 (SELECT (copd.numero_unidades::integer - sum(recd.cantidad_recibida)) as cantidad_pendiente\
                 FROM recepcion_mercancia rec \
                 INNER JOIN recepcion_mercancia_detalle recd ON rec.id =  recd.recepcion_mercancia_id\
                 INNER JOIN compras_ordenes_pedidos cop on rec.orden_pedido_id = cop.orden_pedido_id\
                 INNER JOIN compras_ordenes_pedidos_detalle copd on cop.orden_pedido_id = copd.orden_pedido_id \
                 AND recd.codigo_producto = copd.codigo_producto\
                  WHERE rec.orden_pedido_id = :2 AND recd.codigo_producto = a.codigo_producto\
                  GROUP BY copd.numero_unidades, rec.orden_pedido_id, recd.codigo_producto)as cantidad_pendiente\
                from recepcion_mercancia_detalle a\
                inner join recepcion_mercancia b on a.recepcion_mercancia_id = b.id\
                inner join compras_ordenes_pedidos c on b.orden_pedido_id = c.orden_pedido_id\
                inner join compras_ordenes_pedidos_detalle d on c.orden_pedido_id = d.orden_pedido_id and a.codigo_producto = d.codigo_producto\
                left join novedades_recepcion_mercancia e on a.novedades_recepcion_id = e.id\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                where a.recepcion_mercancia_id = :1 ;";
    
    G.knex.raw(sql, {1:obj.recepcion_id, 2: obj.numero_orden_compra}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       console.log("err [listar_productos_recepcion_mercancia]: ", err);
       callback(err);
    });
};

/*
* funcion que realiza consulta a las ordenes de compras por autorizar
* @param {type} callback
* @returns {datos de consulta}
*/
OrdenesCompraModel.prototype.listarAutorizacionCompras = function(autorizacion, callback) {
    var estado = '0';
    var column = [
        "b.codigo_producto",
        "b.doc_tmp_id",
        "b.empresa_id",
        "b.centro_utilidad",
        "b.bodega",
        "b.orden_pedido_id",
        "b.usuario_id",
        "b.justificacion_ingreso",
        "b.fecha_ingreso",
        "b.cantidad",
        "b.lote",
        "b.fecha_vencimiento",
        "b.porcentaje_gravamen",
        "b.total_costo",
        "b.local_prod",
        "b.sw_autorizado",
        "b.item_id",
        "b.sw_no_autoriza",
        "b.valor_unitario_compra",
        "b.valor_unitario_factura",
        G.knex.raw("fc_descripcion_producto(b.codigo_producto) as producto"),
        "c.nombre as usuario_ingreso",
        "b.observacion_autorizacion",
        "b.usuario_id_autorizador",
        "b.usuario_id_autorizador_2",
        "d.nombre as nombre_autorizador",
        "e.nombre  as nombre_autorizador2"
    ];

    var query = G.knex.column(column)
    .select()
    .from('inventarios_productos as a')
    .innerJoin('compras_ordenes_pedidos_productosfoc as b', 'a.codigo_producto', 'b.codigo_producto')
    .innerJoin('system_usuarios as c', 'b.usuario_id', 'c.usuario_id')
    .leftJoin('system_usuarios as d', 'b.usuario_id_autorizador', 'd.usuario_id')
    .leftJoin('system_usuarios as e', 'b.usuario_id_autorizador_2', 'e.usuario_id')
    .where({"b.empresa_id": autorizacion.empresa,
             "b.sw_autorizado": estado})
    .andWhere(function() {
        if (autorizacion.filtro === '1' && autorizacion.terminoBusqueda !== '') {
            this.where(G.knex.raw("a.descripcion :: varchar"), G.constants.db().LIKE, "%" + autorizacion.terminoBusqueda + "%");
        } else if (autorizacion.filtro === '0' && autorizacion.terminoBusqueda !== '') {
            this.where(G.knex.raw("b.orden_pedido_id :: varchar"), G.constants.db().LIKE, "%" + autorizacion.terminoBusqueda + "%");
        }
     })
    .limit(G.settings.limit)
    .offset((autorizacion.paginaActual - 1) * G.settings.limit).then(function(rows) {
        callback(false, rows);
     }).catch (function(error) {
        callback(error);
     }).done();
};
/*
* funcion que realiza el Update a compras_ordenes_pedidos_productosfoc
* @param {type} callback
* @returns {datos de consulta}
*/
OrdenesCompraModel.prototype.modificarAutorizacionOrdenCompras = function(datos, callback) {
   
    var parametros = {
        1: datos.usuarioAutorizador,
        2: datos.swAutorizado,
        3: datos.observacion,
        4: datos.usuarioAutorizador2,
        5: datos.swNoAutoriza,
        6: datos.empresa,
        7: datos.centroUtilidad,
        8: datos.bodega,
        9: datos.orden,
        10: datos.codProucto,
        11: datos.lote
    };
    
     var sql = " update compras_ordenes_pedidos_productosfoc set \
                usuario_id_autorizador = :1,\
                sw_autorizado = :2,\
                observacion_autorizacion = :3,\
                usuario_id_autorizador_2 = :4,\
                sw_no_autoriza = :5\
                where empresa_id = :6 and\
                centro_utilidad = :7 and\
                bodega = :8 and\n\
                orden_pedido_id = :9 and\
                codigo_producto = :10 and\
                lote = :11 \
                ; ";
    
    G.knex.raw(sql, parametros).then(function(resultado) {
        callback(false, resultado.rows, resultado);
    }).catch(function(err) {
        callback(err);
    });
};

/*
* funcion que realiza el Insert a inv_bodegas_movimiento_tmp_d
* @param {type} callback
* @returns {datos de consulta}
*/
OrdenesCompraModel.prototype.ingresarBodegaMovimientoTmp = function(datos, callback) {

    var sql = " insert into \n\
                inv_bodegas_movimiento_tmp_d ( \
                        usuario_id,\
                        doc_tmp_id,\
                        empresa_id,\
                        centro_utilidad,\
                        bodega,\
                        codigo_producto,\
                        cantidad,\
                        porcentaje_gravamen,\
                        total_costo,\
                        fecha_vencimiento,\
                        lote,\
                        local_prod,\
                        item_id_compras\
                        )\
                values( :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13) ";

    var parametros = {
        1: datos.usuarioId,
        2: datos.docTmpId,
        3: datos.empresa,
        4: datos.centroUtilidad,
        5: datos.bodega,
        6: datos.codProucto,
        7: datos.cantidad,
        8: datos.porcentajeGravamen,
        9: datos.totalCosto,
        10: datos.fechaVencimiento,
        11: datos.lote,
        12: datos.localProd,
        13: datos.orden
    };

    G.knex.raw(sql, parametros).then(function(resultado) {
      
        callback(false, resultado.rows, resultado);
    }).catch (function(err) {
        console.log("err (/catch) [ingresarBodegaMovimientoTmp]: ", err);
        callback(err);
    });
};


// Insertar productos Recepcion mercancia
OrdenesCompraModel.prototype.insertar_productos_recepcion_mercancia = function(producto_mercancia, callback) {


    var sql = " insert into recepcion_mercancia_detalle  ( recepcion_mercancia_id, novedades_recepcion_id, codigo_producto, cantidad_recibida, usuario_id ) \
                values ( :1, :2, :3, :4, :5 ) ; ";

    var parametros = {
        1:producto_mercancia.recepcion_mercancia_id,
        2:producto_mercancia.novedades_recepcion_id,
        3:producto_mercancia.codigo_producto,
        4:producto_mercancia.cantidad_recibida,
        5:producto_mercancia.usuario_id
    };

    G.knex.raw(sql, parametros).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
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
 
    var sql = " update recepcion_mercancia_detalle \
                set novedades_recepcion_id = :3, \
                cantidad_recibida = :4, \
                cantidad_pendiente = :5 \
                where  recepcion_mercancia_id = :1 \
                and codigo_producto =  :2 RETURNING cantidad_pendiente ; ";

    var parametros = {
        1:recepcion_mercancia.numero_recepcion,
        2:producto_mercancia.codigo_producto,
        3:producto_mercancia.novedad_recepcion.id,
        4:producto_mercancia.cantidad_recibida,
        5:producto_mercancia.cantidadPendiente
    };
    
    G.knex.raw(sql, parametros).then(function(resultado){
       callback(false, resultado);
    }).catch(function(err){
       console.log("err [modificar_productos_recepcion_mercancia]: ", err)
       callback(err);
    });
};

// Modificar productos Recepcion mercancia
OrdenesCompraModel.prototype.finalizar_recepcion_mercancia = function(recepcion, callback) {

    console.log("******OrdenesCompraModel.prototype.finalizar_recepcion_mercancia MODEL**********");
    console.log("******OrdenesCompraModel.prototype.finalizar_recepcion_mercancia MODEL**********");
    
    console.log("recepcion.orden_compra ", recepcion.orden_compra);
    var that = this;
    var sql = " update recepcion_mercancia set estado = '2' where  id = :1 ; ";
    
    G.knex.raw(sql, {1:recepcion.numero_recepcion}).then(function(resultado){
       
        
        var estado = '4'; // Verificada
        
        if(recepcion.orden_compra.cantidadTotalPendiente > 0){
            estado = '6';
        }
        
        that.actualizar_estado_orden_compra(recepcion.orden_compra.numero_orden_compra, estado, function(_err, _rows, _result) {

            callback(false, resultado.rows, resultado);
        });
       
    }).catch(function(err){
       callback(err);
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
};

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
};



function _generarReporteOrdenes(obj, callback) {
        
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/OrdenesCompra/reports/ordenes_creadas.html', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: {ordenes:Object.keys(obj).map(function (key) {return obj[key]})}
    }, function(err, response) {

        response.body(function(body) {
            var fecha = new Date();
            var nombreTmp = G.random.randomKey(2, 5) + "_" + fecha.toFormat('DD-MM-YYYY') + ".pdf";
            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function(err) {
                if (err) {
                    console.log("err [_generarReporteOrdenes]: ", err);
                    callback(err);
                } else {
                    callback(false, nombreTmp);
                }
            });


        });


    });
};

/*
 * @Author: Eduar
 * @param {Object} params
 * @param {function} callback
 * +Descripcion: Funcion recursiva que permite crear el encabezado y el detalle de la orden de compra
 */
function __gestionarOrdenesAgrupadas(params, callback){
    var ordenes = params.ordenes;
    
    var llave = Object.keys(ordenes)[params.index];
    var encabezado = ordenes[llave];
    var def = G.Q.defer();
    
    if(!encabezado){
        callback(false, ordenes);
        return;
    }
        
    //Crea el encabezado de la orden
    G.Q.ninvoke(params.contexto, 'insertar_orden_compra', encabezado.codigo_unidad_negocio, encabezado.codigo_proveedor, 
                encabezado.empresa_id, encabezado.observacion, encabezado.usuario_id, params.transaccion).then(function(id){
         
        encabezado.ordenId = id[0].orden_pedido_id;
        var detalle = {transaccion:params.transaccion, encabezado:encabezado, contexto:params.contexto};
        
        return G.Q.nfcall(__gestionarDetalleOrdenesAgrupadas, detalle)
        
    }).then(function(resultado){
       params.index++;
         
       setTimeout(function(){
           def.notify(params.index);
           params.notificacion(params.index, Object.keys(ordenes).length);
            __gestionarOrdenesAgrupadas(params, callback);
            def.resolve();
       }, 0);
    }).fail(function(err){
       console.log("err (/fail) [__gestionarOrdenesAgrupadas]: ", err);
       callback(err);
    });

};

/*
 * @Author: Eduar
 * @param {Object} params
 * @param {function} callback
 * +Descripcion: Funcion recursiva que permite crear el detalle de la orden de compra
 */
function __gestionarDetalleOrdenesAgrupadas(params, callback){
   var producto = params.encabezado.detalle[0];
   var def = G.Q.defer();
   if(!producto){
       callback(false);
       return;
   }
      
   G.Q.ninvoke(params.contexto, "listar_productos", params.encabezado.empresa_id, params.encabezado.codigo_proveedor, params.encabezado.ordenId,
               producto.codigo_producto, null, 1, null).then(function(_producto){
           
      if(_producto.length === 0){
         throw "El producto no pudo ser registrado " + producto.codigo_producto + "-"+(producto.__rownum__ + 1);
      } else {
          producto.iva = _producto[0].iva;
          
          return G.Q.ninvoke(params.contexto, "insertar_detalle_orden_compra", params.encabezado.ordenId, producto.codigo_producto, producto.cantidad,
                             producto.costo, producto.iva, params.transaccion);
      }
                   
   }).then(function(resultado){
       
       setTimeout(function(){
            params.encabezado.detalle.splice(0,1);
            __gestionarDetalleOrdenesAgrupadas(params,callback);
            def.resolve();
       },0);
       
   }).fail(function(err){
      console.log("err (/fail) [__gestionarDetalleOrdenesAgrupadas]: ", err);
       callback(err);
   });
}

/*
 * @Author: Eduar
 * @param {Object} params
 * @param {function} callback
 * +Descripcion: Agrupa las ordenes que estan en el archivo de excel por codigo proveedor y unidad de negocio
 */
function  __agruparOrdenes(params, callback ){
    params.orden = params.datos[0];
    var def = G.Q.defer();
    
    if(!params.orden){
        callback(false, params.ordenes);
        return;
    } 
    
    params.orden.__rownum__ = params.datos.indexOf(params.orden);
    params.orden.empresa_id = params.empresa_id;
    
    G.Q.nfcall(__validarFilaOrden, params).then(function(ordenValidada){
        var _orden = params.ordenes[params.orden.codigo_proveedor + "_" + params.orden.unidad_negocio];
        params.orden = ordenValidada;
        
        //Valida si no existe el grupo de codigo_proveedor y unidad de negocio, para crearlo
        if(!_orden){
            _orden= {};
            _orden.detalle = [];
            _orden.proveedor_id = ordenValidada.proveedor_id;
            _orden.proveedor_tipo_id = ordenValidada.proveedor_tipo_id;
            _orden.codigo_unidad_negocio = ordenValidada.codigo_unidad;
            _orden.empresa_id = params.empresa_id;
            _orden.usuario_id = params.usuario_id;
            _orden.observacion = params.orden.observacion;
            _orden.codigo_proveedor = params.orden.codigo_proveedor;
            _orden.nombre_proveedor = params.orden.nombre_proveedor;
            
            params.ordenes[params.orden.codigo_proveedor + "_" + params.orden.unidad_negocio] = _orden;
        }
        
        params.ordenes[params.orden.codigo_proveedor + "_" + params.orden.unidad_negocio].detalle.push(params.orden);
        params.datos.splice(0, 1);
        
        setTimeout(function(){
            __agruparOrdenes(params, callback);
            def.resolve();
        },0);

    }).fail(function(err){
        callback(err);
    });
}


/*
 * @Author: Eduar
 * @param {Object} params
 * @param {function} callback
 * +Descripcion: Permite validar el registro en cada fila del archivo sea valido, (unidad de negocio, proveedor, producto etc);
 */ 
function __validarFilaOrden(params, callback){
    if(!params.orden.codigo_proveedor || params.orden.unidad_negocio === undefined || params.orden.unidad_negocio === null || !params.orden.codigo_producto ||
       !params.orden.costo || !params.orden.cantidad || !params.orden.observacion){
        callback({error:true, msj:"Los campos son requeridos para todas las filas, producto " + params.orden.codigo_producto }) ;
        return;
    } 
    
    var error = " Codigo producto: " + params.orden.codigo_producto + " y codigo proveedor: "+params.orden.codigo_proveedor;
    
    var costo = params.orden.costo;
    var cantidad = params.orden.cantidad;
    var reg = /^-?\d+\.?,?\d*$/;
        
    if(!reg.test(costo) || !reg.test(cantidad) || parseInt(costo) <= 0 || parseInt(cantidad) <= 0){
        console.log("error fila ", cantidad, " costo ", costo);
        callback({error:true, msj:"La cantidad o costo no son validos." + error}) ;
        return;
    }
    
    var def = G.Q.defer();
    
    G.Q.ninvoke(params.contexto.m_unidad_negocio, 'obtenerUnidadNegocioPorEmpresa', params.orden.empresa_id, params.orden.unidad_negocio).then(function(resultado){
        
        if(resultado.length === 0){
            throw "No se encontro la unidad de negocio" + error;
        } else {
            params.orden.codigo_unidad = resultado[0].codigo_unidad_negocio;
            return G.Q.ninvoke(params.contexto.m_proveedores, 'obtenerProveedorPorCodigo', params.orden.codigo_proveedor);
        }
    }).then(function(resultado){
        if(resultado.length === 0){
            throw "No se encontro el proveedor" + error;
        } else {
            params.orden.proveedor_id = resultado[0].tercero_id;
            params.orden.proveedor_tipo_id = resultado[0].tipo_id_tercero;
            params.orden.nombre_proveedor = resultado[0].nombre_proveedor;
            callback(false, params.orden);
            def.resolve();
        }
    }).fail(function(err){
        callback(err);
    });
}


OrdenesCompraModel.$inject = ["m_unidad_negocio", "m_proveedores"];

module.exports = OrdenesCompraModel;