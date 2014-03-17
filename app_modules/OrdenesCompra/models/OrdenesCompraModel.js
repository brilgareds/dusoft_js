var OrdenesCompraModel = function() {

};



// Listar Las Ordenes de Compra Pendientes con ese producto
OrdenesCompraModel.prototype.listar_ordenes_compra_pendientes_by_producto = function(empresa_id, codigo_producto, callback) {

    console.log('============ Modelo Ordenes Compras 4');
    var sql = " select \
                a.orden_pedido_id as numero_orden_compra,\
                b.numero_unidades as cantidad_solicitada, \
                ((b.numero_unidades)-COALESCE(b.numero_unidades_recibidas,0)) as cantidad_pendiente,\
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
                where a.empresa_id = $1 and b.codigo_producto = $2 and b.numero_unidades <> COALESCE(b.numero_unidades_recibidas,0)\
                and a.estado = '1' ; ";

    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {
        console.log('=======================================================================')
        console.log(err)
        console.log(rows)
        console.log('=======================================================================')
        
        callback(err, rows);
    });
};

module.exports = OrdenesCompraModel;