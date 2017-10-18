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

DocumentoBodegaI002.prototype.insertarRecepcionParcialCabecera = function(parametros, transaccion, callback) {

    var query = G.knex("inv_recepciones_parciales").
            insert({empresa_id: parametros.empresa_id,
        bodega: parametros.bodega,
        centro_utilidad: parametros.centro_utilidad,
        orden_pedido_id: parametros.orden_pedido_id,
        usuario_id: parametros.usuario_id,
        prefijo: parametros.prefijo,
        numero: parametros.numero}).
            returning("recepcion_parcial_id");

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("ERROR insertarRecepcionParcialCabecera ", err);
        callback(err);
    }).done();

};

DocumentoBodegaI002.prototype.insertarRecepcionParcialDetalle = function(parametros, transaccion, callback) {

    var query = G.knex("inv_recepciones_parciales_d").
            insert({cantidad: parametros.cantidad,
        codigo_producto: parametros.codigo_producto,
        fecha_vencimiento: parametros.fecha_vencimiento,
        lote: parametros.lote,
        porc_iva: parametros.porcentaje_gravamen,
        recepcion_parcial_id: parametros.recepcion_parcial_id,
        valor: (parametros.total_costo / parametros.cantidad)});

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("Error insertarRecepcionParcialDetalle", err);
        callback(err);
    }).done();

};
/*
 * @Andres M. Gonzalez. 
 * @param {type} parametros
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined} */
DocumentoBodegaI002.prototype.consultarAutorizacionesIngreso = function(parametros,callback) {

    var columna = [
        "empresa_id",
	"numero",
	"prefijo",
	"orden_pedido_id",
	"codigo_producto",
	"lote",
	G.knex.raw("to_char(fecha_vencimiento,'DD/MM/YYYY') as fecha_vencimiento"),
	G.knex.raw("(select nombre from system_usuarios where usuario_id = usuario_id_autorizador)  as usuario_id_autorizadors_1"),
	G.knex.raw("(select nombre from system_usuarios where usuario_id = usuario_id_autorizador_2)  as usuario_id_autorizadors_2"),
	"usuario_id_autorizador_2",
	"observacion_autorizacion",
	"porcentaje_gravamen",
	"valor_unitario_compra",
	"valor_unitario_factura",
	"justificacion_ingreso",
	"cantidad",
	"total_costo",
	"fecha_solicitud",
	"autorizados_id",
	G.knex.raw("fc_descripcion_producto(codigo_producto) as descripcion_producto")
    ];

    var subQuery = G.knex.select(columna)
            .from("inv_bodegas_movimiento_ordenes_compra_prod_autorizados as a")
            .as("a");

    var query = G.knex(G.knex.raw("a.*")).from(subQuery)
            .where('empresa_id', parametros.empresaId)
            .andWhere('prefijo', parametros.prefijoDocumento)
            .andWhere('numero', parametros.numeracionDocumento);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [consultarAutorizacionesIngreso]: ", error);
        callback(error);
    });

};
/*
 * @Andres M. Gonzalez. 
 * @param {type} parametros
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined} */
DocumentoBodegaI002.prototype.consultarAutorizacionesProveedor = function(parametros,callback) {

    var columna = [
        G.knex.raw("a.orden_pedido_id"),
	G.knex.raw("d.tipo_id_tercero || ' ' || d.tercero_id || ' : '|| d.nombre_tercero as proveedor")
    ];

    var subQuery = G.knex.select(columna)
            .from("inv_bodegas_movimiento_ordenes_compra as a")
            .innerJoin("compras_ordenes_pedidos as b",
            function() {
                this.on("a.orden_pedido_id", "b.orden_pedido_id")
            })
            .innerJoin("terceros_proveedores as c",
            function() {
                this.on("b.codigo_proveedor_id", "c.codigo_proveedor_id")
            })
            .innerJoin("terceros as d",
            function() {
                this.on("c.tipo_id_tercero", "d.tipo_id_tercero")
                this.on("c.tercero_id", "d.tercero_id")
            })
	    .where('a.empresa_id', parametros.empresaId)
            .andWhere('a.prefijo', parametros.prefijoDocumento)
            .andWhere('a.numero', parametros.numeracionDocumento)
            .as("a");

    var query = G.knex(G.knex.raw("a.*")).from(subQuery);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [consultarAutorizacionesIngreso]: ", error);
        callback(error);
    });

};

DocumentoBodegaI002.prototype.ingresoAutorizacion = function(parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_ordenes_compra_prod_autorizados").
            insert({orden_pedido_id: parametros.orden_pedido_id,
        codigo_producto: parametros.codigo_producto,
        justificacion_ingreso: parametros.justificacion_ingreso,
        usuario_id_autorizador: parametros.usuario_id_autorizador,
        usuario_id_autorizador_2: parametros.usuario_id_autorizador_2,
        observacion_autorizacion: parametros.observacion_autorizacion,
        lote: parametros.lote,
        fecha_vencimiento: parametros.fecha_vencimiento,
        cantidad: parametros.cantidad,
        fecha_solicitud: parametros.fecha_ingreso,
        porcentaje_gravamen: parametros.porcentaje_gravamen,
        valor_unitario_compra: parametros.valor_unitario_compra,
        valor_unitario_factura: parametros.valor_unitario_factura,
        total_costo: parametros.total_costo,
        empresa_id: parametros.empresa_id,
        prefijo: parametros.prefijo,
        numero: parametros.numero});

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
	
        callback(false, resultado);
    }). catch (function(err) {
        console.log("Error ingresoAutorizacion", err);
        callback(err);
    }).done();

};

DocumentoBodegaI002.prototype.listarDocumentoTempIngresoCompras = function(parametros, callback) {

    var columna = [
        "a.usuario_id",
        "a.doc_tmp_id",
        "a.bodegas_doc_id",
        "a.observacion",
        "a.fecha_registro",
        "a.abreviatura",
        "a.empresa_destino",
        "a.porcentaje_rtf",
        "a.porcentaje_ica",
        "a.porcentaje_reteiva",
        "b.orden_pedido_id",
        "c.documento_id",
        "c.empresa_id",
        "c.centro_utilidad",
        "c.bodega"
    ];

    var subQuery = G.knex.select(columna)
            .from("inv_bodegas_movimiento_tmp as a")
            .innerJoin("inv_bodegas_documentos as c",
            function() {
                this.on("c.bodegas_doc_id", "a.bodegas_doc_id")
            })
            .leftJoin("inv_bodegas_movimiento_tmp_ordenes_compra as b",
            function() {
                this.on("b.usuario_id", "a.usuario_id")
                        .on("b.doc_tmp_id", "a.doc_tmp_id")
            }).as("a");


    var query = G.knex(G.knex.raw("a.*")).from(subQuery)
            .where('usuario_id', parametros.usuarioId)
            .andWhere('doc_tmp_id', parametros.docTmpId);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [listarDocumentoTempIngresoCompras]: ", error);
        callback(error);
    });
};

DocumentoBodegaI002.prototype.listarIngresosAutorizados = function(parametros, callback) {
  
    var columna = [
        "orden_pedido_id",
        "codigo_producto",
        "usuario_id",
        "justificacion_ingreso",
        "fecha_ingreso",
        "sw_autorizado",
        "usuario_id_autorizador",
        "observacion_autorizacion",
        "doc_tmp_id",
        "empresa_id",
        "centro_utilidad",
        "bodega",
        "cantidad",
        "lote",
        "fecha_vencimiento",
        "porcentaje_gravamen",
        "total_costo",
        "local_prod",
        "item_id",
        "usuario_id_autorizador_2",
        "valor_unitario_compra",
        "valor_unitario_factura"
    ];

    var subQuery = G.knex.select(columna)
            .from("compras_ordenes_pedidos_productosfoc")
            .as("a");

    var query = G.knex(G.knex.raw("a.*")).from(subQuery)
            .where('usuario_id', parametros.usuario_id)
            .andWhere('doc_tmp_id', parametros.doc_tmp_id)
            .andWhere('empresa_id', parametros.empresa_id)
            .andWhere('centro_utilidad', parametros.centro_utilidad)
            .andWhere('bodega', parametros.bodega)
            .andWhere('orden_pedido_id', parametros.orden_pedido_id)
            .andWhere('sw_autorizado', '1');

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [listarIngresosAutorizados]: ", error);
        callback(error);
    });
};

DocumentoBodegaI002.prototype.listarProductosParaAsignar = function(parametro, callback) {
console.log("parametro.tipoFiltro",parametro);
    var columna = [
        G.knex.raw("distinct c.codigo_producto"),
        G.knex.raw("fc_descripcion_producto(c.codigo_producto) as descripcion"),
        G.knex.raw("c.porc_iva"),
        G.knex.raw("u.unidad_id"),
        G.knex.raw("CASE WHEN cd.item_id is not null or prodfoc.item_id is not null  THEN '1'\
                                ELSE '0'  \
                                END as orden,\
                                CASE WHEN prodfoc.item_id is not null THEN '1'\
                                ELSE '0'\
                                END as foc")
    ];

    var query = G.knex.column(columna)
            .from("inventarios_productos as c")
            .innerJoin("unidades as u", "c.unidad_id", "u.unidad_id")
            .leftJoin("compras_ordenes_pedidos_detalle as cd",
            function() {
                this.on("cd.orden_pedido_id", parametro.numero_orden)
                        .on("cd.codigo_producto", "c.codigo_producto")

            })
            .leftJoin("compras_ordenes_pedidos_productosfoc as prodfoc",
            function() {
                this.on("cd.orden_pedido_id", "prodfoc.orden_pedido_id")
                        .on("cd.codigo_producto", "prodfoc.codigo_producto")
                        .on(G.knex.raw("prodfoc.empresa_id = " + parametro.empresa_id))
                        .on(G.knex.raw("prodfoc.centro_utilidad = " + parametro.centro_utilidad))
                        .on(G.knex.raw("prodfoc.bodega = " + parametro.bodega))
                        .on("prodfoc.sw_autorizado", 0)
                        .on("prodfoc.doc_tmp_id", parseInt(parametro.doc_tmp_id))
            })
            .where('c.estado', '1')
            .andWhere(function() {
        if (parametro.tipoFiltro === '0') {
            this.andWhere("c.descripcion", G.constants.db().LIKE, "%" + parametro.descripcion + "%");
        } else {
            this.andWhere("c.codigo_producto", parametro.descripcion);
        }

        if (parametro.fabricante_id !== "-1") {
            this.andWhere("fabricante_id", parametro.fabricante_id);
        }
    }).andWhere(G.knex.raw("substring(c.codigo_producto from 1 for 2) <> 'FO' "));
    
//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", query.toSQL());

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
//	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", query.toSQL());
        console.log("Error [listarProductosParaAsignar]: ", err);
        callback("Ha ocurrido un error");
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
        console.log("Error agregarItemFOC parametros", parametros);
        console.log("Error agregarItemFOC", err);
        callback(err);
    }).done();
};


DocumentoBodegaI002.prototype.agregarBodegasMovimientoOrdenesCompras = function(parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_ordenes_compra").
            insert({
		    empresa_id: parametros.empresaId, 
		    prefijo: parametros.prefijoDocumento,
		    numero: parametros.numeracionDocumento, 
		    orden_pedido_id: parametros.ordenPedidoId
		    });
    if (transaccion)
        query.transacting(transaccion);
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [agregarBodegasMovimientoOrdenesCompras]: ", err);
        callback(err);
    }).done();
};

DocumentoBodegaI002.prototype.updateInvBodegasMovimiento = function(parametros, transaccion, callback) {
    var query = G.knex('inv_bodegas_movimiento')
            .where('prefijo', parametros.prefijoDocumento)
            .andWhere('empresa_id', parametros.empresaId)
            .andWhere('numero', parametros.numeracionDocumento)
            .update({	porcentaje_rtf: parametros.porcentaje_rtf, 
			porcentaje_ica: parametros.porcentaje_ica,
			porcentaje_cree: parametros.porcentaje_cree, 
			porcentaje_reteiva: parametros.porcentaje_reteiva
		    });
    if (transaccion)
        query.transacting(transaccion);
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [updateInvBodegasMovimiento]: ", err);
        callback("Error al actualizar updateInvBodegasMovimiento");
    });

};

// Fecha ingreso a el documento
DocumentoBodegaI002.prototype.fecha_ingreso_orden_compra = function(parametros, transaccion, callback) {
    var today = new Date();
    var formato = 'DD-MM-YYYY';
    var fechaToday = G.moment(today).format(formato);

    var query = G.knex('compras_ordenes_pedidos')
            .where('orden_pedido_id', parametros.ordenPedidoId)
            //.andWhere('estado', '1')//comentado por el estado conque eduar crea el pedido de farmacia
            .update({fecha_ingreso: fechaToday});
    if (transaccion)
        query.transacting(transaccion);
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [fecha_ingreso_orden_compra]: ", err);
        callback("Error al actualizar fecha_ingreso_orden_compra");
    });
};


DocumentoBodegaI002.prototype.eliminarOrdenPedidoProductosFoc = function(parametros, transaccion, callback) {

    var query = G.knex('compras_ordenes_pedidos_productosfoc')
            .where('orden_pedido_id', parametros.ordenPedidoId)
            .andWhere('sw_autorizado', '0')
            .del();

    if (transaccion)
        query.transacting(transaccion);
    query.then(function(resultado) {

        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [eliminarOrdenPedidoProductosFoc]: ", err);
        callback({err: err, msj: "Error al eliminar los temporales"});
    });
};

DocumentoBodegaI002.prototype.valorCantidad = function(parametros, callback) {

    var coalesce = G.knex.select()
            .column([G.knex.raw('CASE WHEN numero_unidades_recibidas is null THEN (0 + ' + parseInt(parametros.cantidad) + ')::integer ELSE (numero_unidades_recibidas + ' + parseInt(parametros.cantidad) + ')::integer END  AS valores')])
            .from("compras_ordenes_pedidos_detalle")
            .where(function() {
        this.andWhere("orden_pedido_id", parametros.orden_pedido_id)
                .andWhere("codigo_producto", parametros.codigo_producto)
                .andWhere("item_id", parametros.item_id_compras)
    });
      
    coalesce.then(function(resultado) {
	console.log("resultado----->>>>",resultado);
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [valorCantidad]: ", err);
        callback("Error al actualizar el tipo de formula");
    });
}

DocumentoBodegaI002.prototype.updateComprasOrdenesPedidosDetalles = function(parametros, transaccion, callback) {

    var query = G.knex('compras_ordenes_pedidos_detalle')
            .where('orden_pedido_id', parametros.orden_pedido_id)
            .andWhere('codigo_producto', parametros.codigo_producto)
            .andWhere('item_id', parametros.item_id_compras)
            .update({
        numero_unidades_recibidas: parametros.dato,
        sw_ingresonc: parametros.sw_ingresonc
    });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("Error [modificar_detalle_cotizacion]: ", error);
        callback(error);
    });
};

DocumentoBodegaI002.prototype.updateComprasOrdenesPedidosDetalle = function(parametros, transaccion, callback) {
console.log("__________________updateComprasOrdenesPedidosDetalle________________________");
    var that = this;
    G.Q.ninvoke(that, 'valorCantidad', parametros).then(function(dato) {
	
	if(dato.length===0){
          return 1; 
	}else{
	  parametros.dato = dato[0].valores;
          return G.Q.ninvoke(that, 'updateComprasOrdenesPedidosDetalles', parametros, transaccion); 
	}
    }).then(function(resultado) {
        callback(false, resultado);
    }).fail(function(err) {
        console.log("Error updateComprasOrdenesPedidosDetalle ", err);
        callback(err);
    }).done();
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Remueve un usuario de una conversacion
 * @params obj: {docTmpId, usuario_id}
 * @fecha 2017-06-03
 */
DocumentoBodegaI002.prototype.eliminar_documento_temporal_d = function(parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp_d").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("Error eliminar_documento_temporal", err);
        callback(err);
    });
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Remueve un usuario de una conversacion
 * @params obj: {docTmpId, usuario_id}
 * @fecha 2017-06-03
 */
DocumentoBodegaI002.prototype.eliminar_documento_temporal = function(parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("Error __eliminar", err);
        callback(err);
    });
}
;

DocumentoBodegaI002.prototype.listarInvBodegasMovimientoTmpOrden = function(parametros, callback) {

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
    if(parametros.fecha !== undefined){
	now = parametros.fecha;
    }
    var anio = G.moment(now).format('YYYY');

    var columna = ["anio",
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
        console.log("error [parametros.empresa_id]: ", parametros.empresa_id);
        callback(error);
    });
};

DocumentoBodegaI002.prototype.listarGetItemsDocTemporal = function(parametros, callback) {

    
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
	G.knex.raw("to_char(a.fecha_vencimiento,'DD/MM/YYYY') as fecha_vencimiento"),
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