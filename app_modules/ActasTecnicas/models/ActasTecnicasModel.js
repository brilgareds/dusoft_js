var ActasTecnicasModel = function() {

};

/**
* @author Andres M Gonzalez
* +Descripcion inserta una nueva autorizacion en base a otra que se haya realizado con anterioridad
* @params obj: estado de la autorizacion - usuario que autoriza
* @fecha 2016-05-25
*/
ActasTecnicasModel.prototype.listarOrdenesParaActas = function(obj, callback) {

     var columna = [
        G.knex.raw("distinct a.orden_pedido_id as numero_orden"),
        "c.tipo_id_tercero",
        "c.tercero_id",
        "c.nombre_tercero",
        "b.codigo_proveedor_id",
        "a.observacion as observaciones",
        G.knex.raw("TO_CHAR(a.fecha_registro,'DD-MM-YYYY hh:mm:ss pm') as fecha_registro")
    ];

    var query = G.knex.select(columna)
		.from('compras_ordenes_pedidos as a')
		.innerJoin('terceros_proveedores as b',
		function() {
		    this.on("a.codigo_proveedor_id", "b.codigo_proveedor_id");
		})
		.innerJoin('terceros as c',
		function() {
		    this.on("b.tipo_id_tercero", "c.tipo_id_tercero")
			.on("b.tercero_id", "c.tercero_id");
		})
		.where(function() {
                    if(obj.codigoProveedor !== undefined && obj.codigoProveedor !==""){
                        this.andWhere(G.knex.raw("b.codigo_proveedor_id = " + obj.codigoProveedor));
                    }
                    if(obj.termino!==undefined && obj.termino !== ""){
                        this.andWhere(G.knex.raw("a.orden_pedido_id = " + obj.termino));
                    }
		});

	query.then(function(resultado) {
        callback(false, resultado);
	
    }). catch (function(err) {
        console.log("err [listarOrdenesParaActas]:",query.toSQL());
        callback(err);
    });
};

/**
* @author Andres M Gonzalez
* +Descripcion inserta una nueva autorizacion en base a otra que se haya realizado con anterioridad
* @params obj: estado de la autorizacion - usuario que autoriza
* @fecha 2016-05-25
*/
ActasTecnicasModel.prototype.listarProductosParaActas = function(obj, callback) {


     var columna = [
                "a.empresa_id_pedido", 
                "a.centro_utilidad_pedido", 
                "a.bodega_pedido",
                "b.orden_pedido_id",
                "b.codigo_producto",
                G.knex.raw("fc_descripcion_producto_alterno(b.codigo_producto) AS descripcion"),
                "b.numero_unidades",
                "b.valor",
                "d.lote",
                "d.fecha_vencimiento",
                "b.porc_iva", 
                "d.recepcion_parcial_id",
                 G.knex.raw("CASE WHEN  b.codigo_producto in (\
                             select a.codigo_producto \
                             from esm_acta_tecnica a \
                             WHERE   \
                             a.orden_pedido_id=b.orden_pedido_id \
                            )\
                           THEN '1' ELSE '0' END AS estado_acta ")
    ];

    var query = G.knex.select(columna)
		.from('compras_ordenes_pedidos_detalle as b')
		.innerJoin('compras_ordenes_pedidos as a',
		function() {
		    this.on("b.orden_pedido_id", "a.orden_pedido_id");
		})
		.innerJoin('inv_recepciones_parciales as c',
		function() {
		    this.on("c.orden_pedido_id", "a.orden_pedido_id")
		})
		.innerJoin('inv_recepciones_parciales_d as d',
		function() {
		    this.on("c.recepcion_parcial_id", "d.recepcion_parcial_id")
			.on("b.codigo_producto", "d.codigo_producto");
		})
		.where(function() {
                  this.andWhere("b.orden_pedido_id",obj.ordenPedido);
                });

	query.then(function(resultado) {
        callback(false, resultado);
	
    }). catch (function(err) {
        console.log("err [listarProductosParaActas]:",query.toSQL());
        callback(err);
    });
};

module.exports = ActasTecnicasModel;