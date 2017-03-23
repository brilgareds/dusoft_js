var DocumentoBodegaI002 = function(movientos_bodegas) {

    this.m_movimientos_bodegas = movientos_bodegas;

};

/*********************************************************************************************************************************
 * ============= DOCUMENTOS TEMPORALES =============
 /*********************************************************************************************************************************/


DocumentoBodegaI002.prototype.insertarBodegasMovimientoOrdenesCompraTmp = function(parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp_ordenes_compra").
            insert({usuario_id: parametros.usuario_id, doc_tmp_id: parametros.doc_tmp_id, orden_pedido_id: parametros.orden_pedido_id});

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        callback(err);
    }).done();

};


DocumentoBodegaI002.prototype.listarProductosParaAsignar = function(parametro, callback) {

  var filtro=" true ";
  if(parametro.tipoFiltro==='0'){
    filtro+=" AND c.descripcion ILIKE '%"+parametro.descripcion+"%' ";
  }else if(parametro.tipoFiltro==='1'){
    filtro+=" AND c.codigo_producto = "+parametro.codigo_prducto+" ";
  }
  if(parametro.fabricante_id!=="-1"){
    filtro+=" AND  fabricante_id = "+parametro.fabricante_id+"  ";
  }
  

  var sql="SELECT \
            distinct c.codigo_producto,\
            fc_descripcion_producto(c.codigo_producto) as descripcion,\
            c.porc_iva,\
            u.unidad_id,\
            CASE WHEN cd.item_id is not null or prodfoc.item_id is not null  THEN '1'\
            ELSE '0'  \
            END as orden,\
            CASE WHEN prodfoc.item_id is not null THEN '1'\
            ELSE '0'\
            END as foc\
            FROM	\
            inventarios_productos as c \
            inner join  unidades as u on (c.unidad_id = u.unidad_id )\
            left join compras_ordenes_pedidos_detalle cd on (cd.orden_pedido_id= :1 and cd.codigo_producto=c.codigo_producto)\
            left join compras_ordenes_pedidos_productosfoc prodfoc on (cd.orden_pedido_id=prodfoc.orden_pedido_id and cd.codigo_producto=prodfoc.codigo_producto AND\
            prodfoc.empresa_id = :2 \
            and \
            prodfoc.centro_utilidad = :3 \
            and \
            prodfoc.bodega = :4 \
            and \
            prodfoc.sw_autorizado = '0' \
            and \
            prodfoc.doc_tmp_id = :5) \
            WHERE \
            c.estado=1\
            AND \
            substring(c.codigo_producto from 1 for 2) <>'FO'\
            AND "+filtro;
 G.knex.raw(sql, {1:parametro.numero_orden,2:parametro.empresa_id,3:parametro.centro_utilidad,4:parametro.bodega,5:parametro.doc_tmp_id}).then(function(resultado){
       callback(false,resultado.rows);
    }).catch(function(err){
       callback(err);
    });
}; 


DocumentoBodegaI002.prototype.insertarProductoOrden = function(parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp_ordenes_compra").
            insert({usuario_id: parametros.usuario_id, doc_tmp_id: parametros.doc_tmp_id, orden_pedido_id: parametros.orden_pedido_id});

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        callback(err);
    }).done();

};


DocumentoBodegaI002.prototype.agregarItemFOC = function(parametros, transaccion, callback) {

    var query = G.knex("compras_ordenes_pedidos_productosfoc").
                insert({bodega: parametros.bodega, cantidad: parametros.cantidad, centro_utilidad: parametros.centro_utilidad,
                        codigo_producto:parametros.codigo_producto,doc_tmp_id:parametros.doc_tmp_id,empresa_id:parametros.empresa_id,
                        fecha_ingreso:parametros.fecha_ingreso,fecha_vencimiento:parametros.fecha_vencimiento,justificacion_ingreso:parametros.justificacion_ingreso,
                        lote:parametros.lote,orden_pedido_id:parametros.orden_pedido_id,porcentaje_gravamen:parametros.porcentaje_gravamen,
                        total_costo:parametros.total_costo,local_prod:parametros.local_prod,usuario_id:parametros.usuario_id,
                        item_id:parametros.item_id,valor_unitario_compra:parametros.valor_unitario_compra,valor_unitario_factura:parametros.valor_unitario_factura
                     });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        callback(err);
    }).done();

};


DocumentoBodegaI002.prototype.listarInvBodegasMovimientoTmpOrden = function(parametros, callback) {
console.log("*****parametros********",parametros);
    var columna = ["a.usuario_id",
        "a.doc_tmp_id",
        "orden_pedido_id",
        "observacion",
        "fecha_registro",
        "abreviatura",
        "empresa_destino",
        "porcentaje_rtf",
        "porcentaje_ica",
        "porcentaje_reteiva",
        G.knex.raw("(select count(*) as numero_productos_tmp from inv_bodegas_movimiento_tmp_d as c where b.doc_tmp_id=c.doc_tmp_id) as numero_productos_tmp")];

    var subQuery = G.knex.select(columna)
            .from("inv_bodegas_movimiento_tmp AS a")
            .innerJoin("inv_bodegas_movimiento_tmp_ordenes_compra AS b",
            function() {
                this.on("a.usuario_id", "b.usuario_id")
                    .on("a.doc_tmp_id", "b.doc_tmp_id")
            }).as("a");

    var query = G.knex(G.knex.raw("a.*")).from(subQuery)
                .where('a.usuario_id', parametros.usuarioId)
                .andWhere('a.orden_pedido_id', parametros.orden_pedido_id);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [listarInvBodegasMovimientoTmpOrden]: ", error);
        callback(error);
    });
}; 

DocumentoBodegaI002.prototype.listarParametrosRetencion = function(parametros, callback) {
    var now = new Date();
    var anio = G.moment(now).format('YYYY');
console.log("*****parametrosRetencion********",G.moment(now).format('YYYY'));

    var columna = [ "anio",
                    "base_rtf",
                    "base_ica",
                    "base_reteiva",
                    "sw_rtf",
                    "sw_ica",
                    "sw_reteiva",
                    "porcentaje_rtf",
                    "porcentaje_ica",
                    "porcentaje_reteiva",
                    "estado",
                    "empresa_id"
                  ];

    var subQuery = G.knex.select(columna)
            .from("vnts_bases_retenciones").as("a");

    var query = G.knex(G.knex.raw("a.*")).from(subQuery)
                .where('a.estado', '1')
                .andWhere('a.empresa_id', parametros.empresa_id)
                .andWhere('a.anio', anio);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [parametrosRetencion]: ", error);
        callback(error);
    });
}; 

DocumentoBodegaI002.prototype.listarGetItemsDocTemporal = function(parametros, callback) {
    
console.log("*****listarGetItemsDocTemporal********",parametros);

    var columna = [ 
                    "a.item_id",
                    "a.usuario_id",
                    "a.doc_tmp_id",
                    "a.empresa_id",
                    "a.centro_utilidad",
                    "a.bodega",
                    "a.codigo_producto",
                    "a.cantidad",
                    "a.porcentaje_gravamen",
                    "a.total_costo",
                    "a.fecha_vencimiento",
                    "a.lote",
                    "a.local_prod",
                    "a.valor_unitario",
                    "a.total_costo_pedido",
                    "a.sw_ingresonc",
                    "a.item_id_compras",
                    "a.lote_devuelto",
                    "a.prefijo_temp",
                    "a.observacion_cambio",
                    "d.orden_pedido_id",
                    G.knex.raw("COALESCE(a.cantidad_sistema,0)as cantidad_sistema"),
                    G.knex.raw("fc_descripcion_producto(b.codigo_producto) as descripcion"),
                    "b.contenido_unidad_venta",
                    "b.unidad_id",
                    "c.descripcion as descripcion_unidad",
                    G.knex.raw("(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad) as valor_unit"),
                    G.knex.raw("((a.total_costo/a.cantidad)-(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad)) as iva"),
                    G.knex.raw("((((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad)*a.cantidad) as valor_total"),
                    G.knex.raw("(((a.total_costo/a.cantidad)-(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad))*a.cantidad) as iva_total")
                  ];
              

    var subQuery = G.knex.select(columna)
                    .from("inv_bodegas_movimiento_tmp_d as a")
                    .innerJoin("inventarios_productos as b",
                    function() {
                        this.on("b.codigo_producto", "a.codigo_producto")
                    })
                    .innerJoin("unidades as c",
                    function() {
                        this.on("c.unidad_id", "b.unidad_id")
                    })
                    .innerJoin("inv_bodegas_movimiento_tmp_ordenes_compra as d",
                    function() {
                        this.on("d.usuario_id", "a.usuario_id")
                            .on("a.doc_tmp_id", "d.doc_tmp_id")
                    })
                   .as("a");

    var query = G.knex(G.knex.raw("a.*"))
                .from(subQuery)
                .where('a.usuario_id', parametros.usuario_id)
                .andWhere('a.orden_pedido_id ', parametros.orden_pedido_id)
                .orderBy("a.item_id", "desc");
        
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [listarGetItemsDocTemporal]: ", error);
        callback(error);
    });
}; 

DocumentoBodegaI002.prototype.listarGetDocTemporal = function(parametros, callback) {
    
console.log("*****parametrosRetencion********",parametros);

    var columna = [ 
                    "a.usuario_id",
                    "a.doc_tmp_id",
                    "a.bodegas_doc_id",
                    "a.observacion",
                    "a.fecha_registro",
                    "a.abreviatura",
                    "a.empresa_destino",
                    "b.orden_pedido_id", 
                    "f.documento_id", 
                    "f.empresa_id", 
                    "f.centro_utilidad", 
                    "f.bodega",
                    "e.tipo_id_tercero",
                    "e.tercero_id",
                    "e.nombre_tercero",
                    G.knex.raw("CASE WHEN d.sw_rtf = '1' THEN d.porcentaje_rtf ELSE 0 END as porcentaje_rtf"),
                    G.knex.raw("CASE WHEN d.sw_ica = '1' THEN d.porcentaje_ica ELSE 0 END as porcentaje_ica"),
                    G.knex.raw("CASE WHEN d.sw_reteiva = '1' THEN d.porcentaje_reteiva ELSE 0 END as porcentaje_reteiva"),
                    G.knex.raw("CASE WHEN d.sw_cree = '1' THEN d.porcentaje_cree ELSE 0 END as porcentaje_cree")
                  ];
                                                
    var subQuery = G.knex.select(columna)
                    .from("inv_bodegas_movimiento_tmp as a")
                    .innerJoin("inv_bodegas_movimiento_tmp_ordenes_compra as b",
                    function() {
                        this.on("b.usuario_id", "a.usuario_id")
                            .on("b.doc_tmp_id", "a.doc_tmp_id")
                    })
                    .innerJoin("compras_ordenes_pedidos as c",
                    function() {
                        this.on("b.orden_pedido_id", "c.orden_pedido_id")
                    })
                    .innerJoin("terceros_proveedores as d",
                    function() {
                        this.on("c.codigo_proveedor_id", "d.codigo_proveedor_id")
                    })
                    .innerJoin("terceros as e",
                    function() {
                        this.on("d.tipo_id_tercero", "e.tipo_id_tercero")
                            .on("d.tercero_id", "e.tercero_id")
                    })
                    .innerJoin("inv_bodegas_documentos as f",
                    function() {
                        this.on("f.bodegas_doc_id", "a.bodegas_doc_id")
                    })
                   .as("a");
                
    var query = G.knex(G.knex.raw("a.*"))
                .from(subQuery)
                .where('a.usuario_id', parametros.usuario_id)
                .andWhere('a.orden_pedido_id ', parametros.orden_pedido_id);
        
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [listarGetDocTemporal]: ", error);
        callback(error);
    });
}; 


DocumentoBodegaI002.prototype.listarProductosPorAutorizar = function(parametros, callback) {
    
console.log("*****parametrosRetencion********",parametros);

    var columna = [ 
                    "c.codigo_producto",
                    "c.doc_tmp_id",
                    "c.empresa_id",
                    "c.centro_utilidad",
                    "c.bodega",
                    "c.orden_pedido_id",
                    "c.usuario_id",
                    "c.justificacion_ingreso",
                    "c.fecha_ingreso",
                    "c.cantidad",
                    "c.lote",
                    "c.fecha_vencimiento",
                    "c.porcentaje_gravamen",
                    "c.total_costo",
                    "c.local_prod",
                    "c.sw_autorizado",
                    "c.item_id",
                    "c.valor_unitario_compra",
                    "c.valor_unitario_factura",
                    G.knex.raw("fc_descripcion_producto(c.codigo_producto) as descripcion"), 
                    "b.nombre",
                    G.knex.raw("0 as iva"),
                  ];
                                                
    var subQuery = G.knex.select(columna)
                    .from("inventarios_productos as a")                    
                    .innerJoin("compras_ordenes_pedidos_productosfoc as c",
                    function() {
                        this.on("a.codigo_producto", "c.codigo_producto")                            
                    })
                    .innerJoin("system_usuarios as b",
                    function() {
                        this.on("c.usuario_id", "b.usuario_id")
                    })
                    .as("d");
                
    var query = G.knex(G.knex.raw("d.*"))
                .from(subQuery)
                .where('d.empresa_id', parametros.empresa_id)
                .andWhere('d.orden_pedido_id ', parametros.orden_pedido_id)
                .andWhere('d.sw_autorizado ', '0');
        
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [listarProductosPorAutorizar]: ", error);
        callback(error);
    });
}; 


DocumentoBodegaI002.$inject = ["m_movimientos_bodegas"];

module.exports = DocumentoBodegaI002;