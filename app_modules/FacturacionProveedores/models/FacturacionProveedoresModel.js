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
            .orderBy("c.fecha_orden", "desc")
            .where(function() {

        if (obj.fechaInicio !== '') {
            console.log("obj.filtro.fechaInicio",obj.fechaInicio);
            this.andWhere(G.knex.raw("c.fecha_orden >= '" + obj.fechaInicio + "' "))
        }
        if (obj.fechaFin !== '') {
            console.log("obj.filtro.fechaFin",obj.fechaFin);
            this.andWhere(G.knex.raw("c.fecha_orden <= '" + obj.fechaFin + "' "))
        }
        if ((obj.filtro.tipo === 'Nombre') && obj.terminoBusqueda !== "") {
            this.andWhere(G.knex.raw("t.nombre_tercero  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
        }
    }).andWhere('c.empresa_id', obj.empresaId);

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {

        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [listarClientes]:", err);
        callback(err);
    });

}

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
        "a.fecha_vencimiento",
        G.knex.raw("fc_descripcion_producto(a.codigo_producto) as descripcion")
    ];

    var query = G.knex.select(columnas)
            .from('inv_recepciones_parciales_d as a')
            .where("a.recepcion_parcial_id", obj.recepcion_parcial_id)
            .orderBy("a.codigo_producto");

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)

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
    var now = new Date();
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

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de insertar la cabecera en la tabla
 *              inv_facturas_proveedores                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedoresModel.prototype.ingresarFacturaCabecera = function(obj, callback) {

    G.knex("inv_facturas_proveedores").
            insert({
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

    }).then(function(resultado) {

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
FacturacionProveedoresModel.prototype.ingresarFacturaDetalle = function(obj, callback) {

    G.knex("inv_facturas_proveedores_d").
            insert({
        codigo_producto: obj.codigo_producto,
        porc_iva: obj.porc_iva,
        recepcion_parcial_id: obj.recepcion_parcial_id,
        cantidad: obj.cantidad,
        valor: obj.valor,
        lote: obj.lote,
        fecha_vencimiento: obj.fecha_vencimiento,
        numero_factura: obj.numero_factura,
        item_id: obj.item_id,
        codigo_proveedor_id: obj.codigo_proveedor_id

    }).then(function(resultado) {
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
FacturacionProveedoresModel.prototype.updateEstadoRecepcionParcial = function(obj, callback) {

    G.knex("inv_recepciones_parciales").
            where('recepcion_parcial_id', obj.recepcion_parcial_id).
            update({
        sw_facturado: '1'
    }).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [updateEstadoRecepcionParcial]: ", err);
        callback(err);
    });
};

FacturacionProveedoresModel.$inject = [];


module.exports = FacturacionProveedoresModel;