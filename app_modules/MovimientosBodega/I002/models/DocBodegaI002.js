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

DocumentoBodegaI002.$inject = ["m_movimientos_bodegas"];

module.exports = DocumentoBodegaI002;