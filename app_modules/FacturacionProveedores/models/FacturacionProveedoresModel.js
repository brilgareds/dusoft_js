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
        "c.fecha_orden",
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
            .orderBy("c.fecha_orden")
            .where(function() {

        if (obj.filtro.fechaInicio !== undefined) {
            this.andWhere(G.knex.raw("c.fecha_orden >= " + obj.filtro.fechaInicio + " "))
        }
        if (obj.filtro.fechaFin !== undefined) {
            this.andWhere(G.knex.raw("c.fecha_orden <= " + obj.filtro.fechaFin + " "))
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

FacturacionProveedoresModel.$inject = [];


module.exports = FacturacionProveedoresModel;