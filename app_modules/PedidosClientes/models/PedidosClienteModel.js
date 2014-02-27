var PedidosClienteModel = function() {

};


PedidosClienteModel.prototype.listar_pedidos_clientes = function(empresa_id, termino_busqueda, callback) {

    var sql = " select \
                a.pedido_cliente_id as numero_pedido, \
                b.tipo_id_tercero as tipo_id_cliente, \
                b.tercero_id as identificacion_cliente, \
                b.nombre_tercero as nombre_cliente, \
                b.direccion as direccion_cliente, \
                b.telefono as telefono_cliente, \
                c.tipo_id_vendedor, \
                c.vendedor_id as idetificacion_vendedor, \
                c.nombre as nombre_vendedor, \
                a.estado, \
                case when a.estado = 0 then 'Inactivo ' \
                     when a.estado = 1 then 'Activo' \
                     when a.estado = 2 then 'Anulado' \
                     when a.estado = 3 then 'Entregado' end as descripcion_estado, \
                a.fecha_registro \
                from ventas_ordenes_pedidos a \
                inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \
                inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \
                where a.empresa_id = $1 \
                and (   a.pedido_cliente_id ilike $2  \
                        or b.tercero_id ilike $2 \
                        or b.nombre_tercero ilike $2 \
                        or b.direccion ilike $2  \
                        or b.telefono ilike $2   \
                        or c.vendedor_id ilike $2 \
                        or c.nombre ilike $2) \
                AND (a.estado IN ('0','1','2','3')) order by 1 desc; ";

    G.db.query(sql, [empresa_id, "%"+termino_busqueda+"%" ], function(err, rows, result) {
        callback(err, rows);
    });

};

module.exports = PedidosClienteModel;