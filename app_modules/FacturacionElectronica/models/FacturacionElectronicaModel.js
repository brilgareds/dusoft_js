var FacturacionElectronicaModel = function() {
};

// Listar las Ordenes de Compra 
FacturacionElectronicaModel.prototype.listar_ordenes_compra = function(obj, callback) {

    var subQueryTmp = G.knex.column("aa.orden_pedido_id").
                       from("inv_bodegas_movimiento_tmp_ordenes_compra as aa").as("g");
               
    var subQueryNovedades = G.knex("novedades_ordenes_compras as a").select("item_id").sum("item_id as total").groupBy("item_id").as("h");
    
    
    var columns = [
        "a.orden_pedido_id as numero_orden",
        "a.empresa_id",
        G.knex.raw("to_char(fecha_ingreso, 'DD-MM-YYYY') as fecha_ingreso"),
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
             WHEN a.estado = '6' THEN 'Verificado con Pdt' END as descripcion_estado,\
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
        G.knex.raw("COALESCE(CASE WHEN  (date_part('day',age(now(), a.fecha_orden)) > 5) AND (a.fecha_ingreso IS NULL) THEN '1' END , '0') as alerta_ingreso"),
        "h.descripcion as nombre_bodega"
    ];
    
    if(obj.sw_recepcion !== 0){     
      columns.push("i.id as recepcion_id");
    }
   
    
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
    leftJoin("bodegas as h", function(){
        this.on("h.empresa_id", "a.empresa_id_pedido").
        on("h.centro_utilidad", "a.centro_utilidad_pedido").
        on("h.bodega", "a.bodega_pedido");
    });
    if(obj.sw_recepcion !== 0){
	query.leftJoin("recepcion_mercancia as i", "i.orden_pedido_id", "a.orden_pedido_id");
    }
    query.whereBetween('a.fecha_orden', [G.knex.raw("('" + obj.fecha_inicial + "')"), G.knex.raw("('" + obj.fecha_final + "')")]).
    where({
           "a.sw_unificada"  : '0'
    }).
    andWhere(function() {
        
        if(obj.filtro && obj.filtro.sin_ingreso){
            this.whereRaw("date_part('day',age(now(), a.fecha_orden)) > 5 AND a.fecha_ingreso IS NULL").
            andWhere(function(){
                this.where("c.tercero_id", G.constants.db().LIKE, "%" + obj.termino_busqueda + "%").
                orWhere("c.nombre_tercero",  G.constants.db().LIKE, "%" + obj.termino_busqueda + "%").
                orWhere("d.razon_social", G.constants.db().LIKE, "%" + obj.termino_busqueda + "%").
                orWhere(G.knex.raw("a.orden_pedido_id::varchar"), G.constants.db().LIKE, "%" + obj.termino_busqueda + "%");
            })
        } else {
            if (obj.filtro && obj.filtro.proveedor){
                this.where("c.tercero_id", G.constants.db().LIKE, "%" + obj.termino_busqueda + "%").
                orWhere("c.nombre_tercero",  G.constants.db().LIKE, "%" + obj.termino_busqueda + "%");
    
            } else if (obj.filtro && obj.filtro.empresa){
                this.where("d.razon_social", G.constants.db().LIKE, "%" + obj.termino_busqueda + "%");

            } else {
                this.where(G.knex.raw("a.orden_pedido_id::varchar"), G.constants.db().LIKE, "%" + obj.termino_busqueda + "%");
            }
        }
        

    }).
    limit(G.settings.limit).
    offset((obj.pagina_actual - 1) * G.settings.limit).
    orderByRaw("1 DESC").as("a");
    
    var queryPrincipal = G.knex.column([
        "a.*",
         G.knex.raw("(SELECT count(bbb.item_id)\
                    FROM compras_ordenes_pedidos_detalle aaa\
                    INNER JOIN novedades_ordenes_compras bbb ON aaa.item_id = bbb.item_id\
                    WHERE aaa.orden_pedido_id = a.numero_orden) as total_novedades"),
        G.knex.raw("(SELECT count(ccc.id)\
                    FROM compras_ordenes_pedidos_detalle aaa\
                        INNER JOIN novedades_ordenes_compras bbb ON aaa.item_id = bbb.item_id\
                    INNER JOIN archivos_novedades_ordenes_compras ccc ON bbb.id = ccc.novedad_orden_compra_id\
                    WHERE aaa.orden_pedido_id = a.numero_orden\
        ) as total_archivos"),
    ]).from(query);

    /*callback(true, query.toSQL());
    return;*/

    queryPrincipal.then(function(rows){
        callback(false, rows);
    }).
    catch(function(err){
       console.log("err (/catch) [listar_ordenes_compra]: ", err);
       callback(err);
    });
    
};


FacturacionElectronicaModel.$inject = [];

module.exports = FacturacionElectronicaModel;