var FacturacionProveedoresModel = function () {};


/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los clientes
 * @fecha 2017-02-05 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionProveedoresModel.prototype.consultarOrdenesCompraProveedor = function(obj, callback) {

    var columnas = [
        "c.orden_pedido_id",
        "c.codigo_proveedor_id",
        "c.empresa_id",
        G.knex.raw("to_char(c.fecha_orden,'dd-MM-yyyy') as fecha_orden"),
        "c.estado",
        "c.sw_unificada",
        "c.observacion",
        "c.codigo_unidad_negocio",
        "c.sw_orden_compra_finalizada",
        "u.nombre",
        "u.usuario",
        "t.nombre_tercero",
        "a.recepcion_parcial_id",
        "a.prefijo",
        "a.numero",
        "a.fecha_registro",
        "a.recepcion_parcial_id",
        "tp.porcentaje_cree",
        "tp.porcentaje_rtf",
        "tp.porcentaje_ica",
        "tp.porcentaje_reteiva",
        G.knex.raw("(SELECT count(*) \
                    FROM\
                    inv_recepciones_parciales AS a\
                    WHERE\
                    a.orden_pedido_id = c.orden_pedido_id \
                    AND (a.empresa_id = c.empresa_id)\
                    AND sw_facturado = '0') as tiene_recepciones")
    ];
    
    var query = G.knex.select(columnas)
            .from('compras_ordenes_pedidos as c')
            .innerJoin('system_usuarios as u', function() {
        this.on("c.usuario_id", "u.usuario_id")
    })
            .innerJoin('terceros_proveedores as tp', function() {
        this.on("tp.codigo_proveedor_id", "c.codigo_proveedor_id")
    })
            .innerJoin('terceros as t', function() {
        this.on("t.tipo_id_tercero", "tp.tipo_id_tercero")
            .on("t.tercero_id", "tp.tercero_id")
    })
            .innerJoin('inv_recepciones_parciales as a', function() { 
        this.on("a.orden_pedido_id", "c.orden_pedido_id")
            .on("a.empresa_id", "c.empresa_id")
    })
            .orderBy("c.orden_pedido_id", "desc")            
            .orderBy("c.fecha_orden", "desc")            
            .where(function() {

        if (obj.porFacturar === 1) {
            
            this.andWhere(G.knex.raw("a.sw_facturado = '0'"))
        }
        if (obj.fechaInicio !== '') {
            
            this.andWhere(G.knex.raw("c.fecha_orden >= '" + obj.fechaInicio + "' "))
        }
        if (obj.fechaFin !== '') {
            
            this.andWhere(G.knex.raw("c.fecha_orden <= '" + obj.fechaFin + "' "))
        }
        if ((obj.filtro.tipo === 'Nombre') && obj.terminoBusqueda !== "") {
            this.andWhere(G.knex.raw("t.nombre_tercero  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
        }
        if ((obj.filtro.tipo === 'Orden') && obj.terminoBusqueda !== "") {
            this.andWhere(G.knex.raw("c.orden_pedido_id = " + obj.terminoBusqueda))
        }
        if ((obj.filtro.tipo === 'Recepcion') && obj.terminoBusqueda !== "") {
            this.andWhere(G.knex.raw("a.recepcion_parcial_id = " + obj.terminoBusqueda ))
        }
        if ((obj.filtro.tipo !== 'Nombre' && obj.filtro.tipo !== 'Orden'  && obj.filtro.tipo !== 'Recepcion') && obj.terminoBusqueda !== "") {
            this.andWhere(G.knex.raw("t.tercero_id  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                .andWhere(G.knex.raw("t.tipo_id_tercero = '"+obj.filtro.tipo+"'"))
        }
    }).andWhere('c.empresa_id', obj.empresaId);

//    query.limit(G.settings.limit).
//            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {
        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [consultarOrdenesCompraProveedor]:", err);
        callback(err);
    });
};  
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de consultar facturas Proveedor
 * @fecha 2017-02-05 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionProveedoresModel.prototype.consultarFacturaProveedor = function(obj, callback) {

    var columnas = [
        "a.numero_factura",
        "a.valor_factura",
        "c.mensaje",
        "b.nombre",
        "a.observaciones",
        "c.estado",
        "a.codigo_proveedor_id",
        "f.nombre_tercero",
        "f.tercero_id",
        "f.tipo_id_tercero",
        "f.direccion",
        "g.razon_social",
        "g.tipo_id_tercero",
        "g.id",
        "a.empresa_id",
        "a.valor_descuento",
        G.knex.raw("a.porc_rtf as porcentajeRtf"),
        G.knex.raw("a.porc_ica as porcentajeIca"),
        G.knex.raw("a.porc_rtiva as porcentajeReteiva"),
        G.knex.raw("a.porc_cree as porcentajeCree"),
        G.knex.raw("g.direccion as direccion_empresa"),
        G.knex.raw("TO_CHAR(a.fecha_registro,'YYYY') as anio_factura"),
        G.knex.raw("TO_CHAR(a.fecha_factura,'dd/mm/yy') as fecha_factura_n"),
        G.knex.raw("TO_CHAR(a.fecha_radicacion_factura,'dd/mm/yy') as fecha_radicacion_n"),
        G.knex.raw("to_char(a.fecha_registro,'dd-MM-yyyy') as fecha_registro"),
        G.knex.raw("(case when c.estado='0' then 'Sincronizado' else 'NO Sincronizado' end) as descripcion_estado")
    ];
    
    var query = G.knex.select(columnas)
            .from('inv_facturas_proveedores as a')
                .innerJoin('system_usuarios as b', function() {
            this.on("a.usuario_id", "b.usuario_id")
        })           
                .leftJoin('logs_facturacion_proveedores_ws_fi as c', function() {
            this.on("a.codigo_proveedor_id", "c.codigo_proveedor_id")
                .on("a.numero_factura", "c.numero_factura")
        })    
                .innerJoin('terceros_proveedores as d', function() {
            this.on("d.codigo_proveedor_id", "a.codigo_proveedor_id")
        })
                .innerJoin('terceros as f', function() {
            this.on("f.tipo_id_tercero", "d.tipo_id_tercero")
                .on("f.tercero_id", "d.tercero_id")
        })
                .innerJoin('empresas as g', function() {
            this.on("a.empresa_id", "g.empresa_id")
        })
            .orderBy("a.fecha_registro", "desc")        
            .where(function() {

        if (obj.fechaInicio !== '') {
            this.andWhere(G.knex.raw("a.fecha_registro::date  >= '" + obj.fechaInicio + "' "))
        }
        if (obj.fechaFin !== '') {
            this.andWhere(G.knex.raw("a.fecha_registro::date  <= '" + obj.fechaFin + "' "))
        }
        if ((obj.filtro.tipo === 'Nombre') && obj.terminoBusqueda !== "") {
            this.andWhere(G.knex.raw("f.nombre_tercero  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
        }        
        if ((obj.filtro.tipo === 'Factura') && obj.terminoBusqueda !== "") {
            this.andWhere(G.knex.raw("a.numero_factura = '" + obj.terminoBusqueda+"'"))
        }        
        if ((obj.filtro.tipo !== 'Nombre' && obj.filtro.tipo !== 'Factura') && obj.terminoBusqueda !== "") {
            this.andWhere(G.knex.raw("f.tercero_id  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                .andWhere(G.knex.raw("f.tipo_id_tercero = '"+obj.filtro.tipo+"'"))
        }
        if (obj.codigo_proveedor_id !== undefined) {
            this.andWhere("a.codigo_proveedor_id",obj.codigo_proveedor_id)
        }
        if (obj.numero_factura !== undefined) {
//            this.andWhere("a.numero_factura",obj.numero_factura)
            this.andWhere(G.knex.raw("a.numero_factura = '"+obj.numero_factura+"'"))
        }
    }).andWhere('a.empresa_id', obj.empresaId)
      .whereNull('c.prefijo_nota');
            
//	    console.log("Query ",query.toSQL());
   if(obj.paginaActual!== undefined ){
    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
   }
    query.then(function(resultado) {
        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [consultarFacturaProveedor]:", err);
        callback(err);
    });
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de consultar tercero Proveedor
 * @fecha 2017-02-05 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
 FacturacionProveedoresModel.prototype.consultarTerceroProveedor = function(obj, callback) {
    var columnas = [
        "b.porcentaje_rtf",
        "b.porcentaje_ica",
        "b.porcentaje_reteiva"
    ];
    
    var query = G.knex.select(columnas)
            .from('terceros as a')
                .innerJoin('terceros_proveedores as b', function() {
            this.on("a.tercero_id", "b.tercero_id")
                .on("a.tipo_id_tercero", "b.tipo_id_tercero")
           }).where(function() {
        
	    if (obj.codigo_proveedor_id !== undefined) {
		this.andWhere("b.codigo_proveedor_id",obj.codigo_proveedor_id)
	    }
	});
      

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [consultarFacturaProveedorDetalle]:", err);
        callback(err);
    });
 }
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de consultar detalle facturas Proveedor detalle
 * @fecha 2017-02-05 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionProveedoresModel.prototype.consultarFacturaProveedorDetalle = function(obj, callback) {

    var columnas = [
        "a.codigo_producto",
        "a.porc_iva",
        "a.cantidad",
        "a.valor",
        "a.lote",
	G.knex.raw("to_char(a.fecha_vencimiento,'DD/MM/YYYY') as fecha_vencimiento"),
        "a.numero_factura",
        "a.item_id",
        "a.cantidad_devuelta",
        "a.codigo_proveedor_id",
        "b.prefijo",
        "e.sw_insumos",
        "e.sw_medicamento",
        "d.codigo_cum",
        G.knex.raw("fc_descripcion_producto(a.codigo_producto) as descripcion"),
        G.knex.raw("b.prefijo||'-'||b.numero as recepcion_parcial_id"),
        G.knex.raw("(a.valor/((a.porc_iva/100)+1)) as valor_unitario"),
        G.knex.raw("(a.valor-(a.valor/((a.porc_iva/100)+1))) as iva"),
        G.knex.raw("((a.valor/((a.porc_iva/100)+1))*a.cantidad) as subtotal"),
        G.knex.raw("((a.valor-(a.valor/((a.porc_iva/100)+1)))*a.cantidad) as iva_total"),
        G.knex.raw("(a.valor * a.cantidad) as total"),
        G.knex.raw("c.descripcion as documento")
    ];
    
    var query = G.knex.select(columnas)
            .from('inv_facturas_proveedores_d as a')
                .innerJoin('inventarios_productos as d', function() {
            this.on("a.codigo_producto", "d.codigo_producto")
        })    
                .innerJoin('inv_grupos_inventarios as e', function() {
            this.on("d.grupo_id", "e.grupo_id")
        })
                .innerJoin('inv_recepciones_parciales as b', function() {
            this.on("a.recepcion_parcial_id", "b.recepcion_parcial_id")
        })
                .innerJoin('documentos as c', function() {
            this.on("b.empresa_id", "c.empresa_id")
                .on("b.prefijo", "c.prefijo")
        })
            .orderBy("a.item_id", "ASC")        
            .where(function() {
        
        if (obj.codigo_proveedor_id !== undefined) {
            this.andWhere("a.codigo_proveedor_id",obj.codigo_proveedor_id)
        }
        if (obj.numero_factura !== undefined) {
            this.andWhere("a.numero_factura",obj.numero_factura)
        }
    });
      

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [consultarFacturaProveedorDetalle]:", err);
        callback(err);
    });
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar el detalleRecepcionParcial
 * @fecha 2017-02-05 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionProveedoresModel.prototype.detalleRecepcionParcial = function(obj, callback) {

    var columnas = [
        "a.recepcion_parcial_id",
        "a.item_id",
        "a.codigo_producto",
        "a.cantidad",
        "a.valor",
        "a.porc_iva",
        "a.lote",
	G.knex.raw("to_char(a.fecha_vencimiento,'DD/MM/YYYY') as fecha_vencimiento"),
        G.knex.raw("fc_descripcion_producto(a.codigo_producto) as descripcion")
    ];

    var query = G.knex.select(columnas)
            .from('inv_recepciones_parciales_d as a')
            .where("a.recepcion_parcial_id", obj.recepcion_parcial_id)
            .orderBy("a.codigo_producto");

     query.then(function(resultado) {

        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [detalleRecepcionParcial]:", err);
        callback(err);
    });
}

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los parametros de retencion
 * @fecha 2017-05-09 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionProveedoresModel.prototype.listarParametrosRetencion = function(parametros, callback) {
    
    var anio;
    if(parametros.anio === undefined){
     var now = new Date();
      anio = G.moment(now).format('YYYY');
    }else{
      anio = parametros.anio; 
    }
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
        callback(error);
    });
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de insertar la cabecera en la tabla
 *              inv_facturas_proveedores                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedoresModel.prototype.ingresarFacturaCabecera = function(obj,transaccion, callback) {

    var query=G.knex("inv_facturas_proveedores").insert({
        
        numero_factura: obj.numero_factura,
        empresa_id: obj.empresa_id,
        centro_utilidad: obj.centro_utilidad,
        bodega: obj.bodega,
        codigo_proveedor_id: obj.codigo_proveedor_id,
        observaciones: obj.observaciones,
        porc_ica: obj.porc_ica,
        porc_rtf: obj.porc_rtf,
        porc_rtiva: obj.porc_rtiva,
        valor_descuento: obj.valor_descuento,
        fecha_factura: obj.fecha_factura,
        fecha_radicacion_factura: obj.fecha_radicacion_factura,
        usuario_id: obj.usuario_id

    });
    if(transaccion) query.transacting(transaccion); 
    query.then(function(resultado) {

        callback(false, resultado[0]);

    }). catch (function(err) {
        console.log("ERROR:::inv_facturas_proveedores ", err);
        callback(err);
    }).done();
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de insertar la cabecera en la tabla
 *              inv_facturas_proveedores                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedoresModel.prototype.ingresarFacturaDetalle = function(obj,transaccion, callback) {

   var query= G.knex("inv_facturas_proveedores_d").insert({
        
        codigo_producto: obj.codigo_producto,
        porc_iva: obj.porc_iva,
        recepcion_parcial_id: obj.recepcion_parcial_id,
        cantidad: obj.cantidad,
        valor: obj.valor,
        lote: obj.lote,
        fecha_vencimiento: obj.fecha_vencimiento,
        numero_factura: obj.numero_factura,
//        item_id: obj.item_id,
        codigo_proveedor_id: obj.codigo_proveedor_id

    });
    if(transaccion) query.transacting(transaccion); 
    query.then(function(resultado) {
        callback(false, resultado[0]);
    }). catch (function(err) {
        console.log("ERROR:::ingresarFacturaDetalle ", err);
        callback(err);
    }).done();
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de eliminar la cabecera en la tabla
 *              inv_facturas_proveedores                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedoresModel.prototype.eliminarFactura = function(obj, callback) {

    G.knex('inv_facturas_proveedores')
            .where('codigo_proveedor_id', obj.codigo_proveedor_id)
            .andWhere('numero_factura', obj.numero_factura)
            .del().then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("err [eliminarFactura]: ", error);
        callback(error);
    });
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de eliminar el detalle en la tabla
 *              inv_facturas_proveedores_d                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedoresModel.prototype.eliminarFacturaDetalle = function(obj, callback) {

    G.knex('inv_facturas_proveedores_d')
            .where('codigo_proveedor_id', obj.codigo_proveedor_id)
            .andWhere('numero_factura', obj.numero_factura)
            .del().then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("err [eliminarFacturaDetalle]: ", error);
        callback(error);
    });
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de modificar en la tabla
 *              inv_recepciones_parciales                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedoresModel.prototype.updateEstadoRecepcionParcial = function(obj,transaccion, callback) {

    var query=G.knex("inv_recepciones_parciales").
            where('recepcion_parcial_id', obj.recepcion_parcial_id).
            update({
        sw_facturado: '1'
    });
    
    if(transaccion) query.transacting(transaccion);  
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [updateEstadoRecepcionParcial]: ", err);
        callback(err);
    });
};

FacturacionProveedoresModel.$inject = [];


module.exports = FacturacionProveedoresModel;