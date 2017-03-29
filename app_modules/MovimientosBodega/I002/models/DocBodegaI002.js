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


DocumentoBodegaI002.prototype.agregarItemFOC = function(parametros, callback) {

    var query = G.knex("compras_ordenes_pedidos_productosfoc").
            insert({bodega: parametros.bodega, cantidad: parametros.cantidad, centro_utilidad: parametros.centroUtilidad,
        codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresaId,
        fecha_ingreso: parametros.fechaIngreso, fecha_vencimiento: parametros.fechaVencimiento, justificacion_ingreso: parametros.justificacionIngreso,
        lote: parametros.lote, orden_pedido_id: parametros.ordenPedidoId, porcentaje_gravamen: parametros.porcentajeGravamen,
        total_costo: parametros.totalCosto, local_prod: parametros.localProd, usuario_id: parametros.usuarioId,
        item_id: parametros.itemId, valor_unitario_compra: parametros.valorUnitarioCompra, valor_unitario_factura: parametros.valorUnitarioFactura
    });

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("agregarItemFOC", err);
        callback(err);
    }).done();
};


DocumentoBodegaI002.prototype.agregarBodegasMovimientoOrdenesCompras = function(parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_ordenes_compra").
            insert({empresa_id: parametros.empresaId, prefijo:parametros.prefijoDocumento,
                    numero:parametros.numeracionDocumento,orden_pedido_id:parametros.ordenPedidoId
    });
    if(transaccion) query.transacting(transaccion);   
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [agregarBodegasMovimientoOrdenesCompras]: ", err);
        callback(err);
    }).done();
};

DocumentoBodegaI002.prototype.updateInvBodegasMovimiento=function(parametros, transaccion, callback) {
    var query = G.knex('inv_bodegas_movimiento')
                .where('prefijo', parametros.prefijoDocumento)
                .andWhere('empresa_id', parametros.empresaId)
                .andWhere('numero', parametros.numeracionDocumento)
                .update({porcentaje_rtf:parametros.compras_ordenes_pedidos_productosfoc,porcentaje_ica:parametros.porcentaje_ica,
                     porcentaje_cree:parametros.porcentaje_cree,porcentaje_reteiva:parametros.porcentaje_reteiva});
    if(transaccion) query.transacting(transaccion);   
    query.then(function(resultado){ 
       callback(false, resultado);
    }).catch(function(err){    
       console.log("err (/catch) [updateInvBodegasMovimiento]: ", err);
       callback("Error al actualizar updateInvBodegasMovimiento");  
    });
    
};


DocumentoBodegaI002.prototype.eliminarOrdenPedidoProductosFoc = function(parametros,transaccion,callback) {
    
   var query = G.knex('compras_ordenes_pedidos_productosfoc')
        .where('orden_pedido_id', parametros.ordenPedidoId)
        .andWhere('sw_autorizado', '0')
        .del();
    
   if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){    
             
            callback(false, resultado);
   }).catch(function(err){
            console.log("err (/catch) [eliminarOrdenPedidoProductosFoc]: ", err);        
            callback({err:err, msj: "Error al eliminar los temporales"});   
    });  
};


                  //  numero_unidades_recibidas= COALESCE(numero_unidades_recibidas,0)+".$valor['cantidad'].",
                    
  DocumentoBodegaI002.prototype.updateComprasOrdenesPedidosDetalle=function(parametros, transaccion, callback) {
    
     var sql = " UPDATE compras_ordenes_pedidos_detalle \
                 SET numero_unidades_recibidas = COALESCE(numero_unidades_recibidas,0)+ "+parametros.cantidad+" , sw_ingresonc = "+parametros.sw_ingresonc+" \
                 WHERE orden_pedido_id = "+parametros.orden_pedido_id+" and codigo_producto = '"+parametros.codigo_producto+"' and item_id = '"+parametros.item_id_compras+"' ; ";
      
     params={1: parametros.sw_ingresonc,2: parametros.orden_pedido_id, 3: parametros.codigo_producto, 4: parametros.item_id_compras};
     
//     var sql = " UPDATE compras_ordenes_pedidos_detalle \
//                 SET numero_unidades_recibidas = COALESCE(numero_unidades_recibidas,0)+ "+parametros.cantidad+" , sw_ingresonc = :1 \
//                 WHERE orden_pedido_id = :2 and codigo_producto = :3 and item_id = :4 ; ";
//      
//     params={1: parametros.sw_ingresonc,2: parametros.orden_pedido_id, 3: parametros.codigo_producto, 4: parametros.item_id_compras};
//     
console.log("sql",sql);
   var query= G.knex.raw(sql);
  // if(transaccion) query.transacting(transaccion);   
   G.knex.raw(sql).
   then(function(resultado){
       console.log("resultado [resultado]: ", resultado);
       callback(false, resultado);
   }).catch(function(err){
       console.log("err (/catch) [updateComprasOrdenesPedidosDetalle]: ", err);
       callback(true,err);
   });
    
};  

//Eliminar Documento Temporal Despacho Farmacias
DocumentoBodegaI002.prototype.eliminar_documento_temporal=function(parametros, transaccion, callback) {
    
    var sql = "DELETE FROM inv_bodegas_movimiento_tmp_d WHERE  doc_tmp_id = :1 AND usuario_id = :2 ;";
  console.log("eliminar_documento_temporal 00");
    var query = G.knex.raw(sql, {1:parametros.docTmpId, 2:parametros.usuarioId});
    if(transaccion) query.transacting(transaccion);
  console.log("eliminar_documento_temporal111");          
    query.then(function(resultado){
        console.log("eliminar_documento_temporal 22");
        sql = " DELETE FROM inv_bodegas_movimiento_tmp WHERE  doc_tmp_id = :1 AND usuario_id = :2 ;";
        return G.knex.raw(sql, {1:parametros.docTmpId, 2:parametros.usuarioId}).transacting(transaccion);
    }).then(function(){
        console.log("eliminar_documento_temporal");
        callback(false);
    }).catch(function(err){
        console.log("eliminar_documento_temporal::: ",err);
        callback(err);
    });
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