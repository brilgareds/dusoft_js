var PedidosFarmaciasModel = function() {

};


PedidosFarmaciasModel.prototype.listar_pedidos_farmacias = function(empresa_id, termino_busqueda, callback) {

    var sql = " select \
                a.solicitud_prod_a_bod_ppal_id as numero_pedido, \
                a.farmacia_id, \
                d.empresa_id, \
                a.centro_utilidad, \
                a.bodega, \
                d.razon_social as descripcion_farmacia, \
                b.descripcion as descripcion_bodega,\
                a.usuario_id, \
                e.nombre as nombre_usuario ,\
                a.estado, \
                case when a.estado = 0 then 'Registrado ' \
                     when a.estado = 1 then 'Separado' \
                     when a.estado = 2 then 'Auditado' \
                     when a.estado = 3 then 'En despacho' end as descripcion_estado, \
                a.fecha_registro::date as fecha \
                from solicitud_productos_a_bodega_principal as a \
                inner join bodegas as b on a.farmacia_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega \
                inner join centros_utilidad as c on b.empresa_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad \
                inner join empresas as d ON c.empresa_id = d.empresa_id \
                inner join system_usuarios as e ON a.usuario_id = e.usuario_id \
                where a.farmacia_id = $1 \
                and ( a.solicitud_prod_a_bod_ppal_id ilike $2 \
                      or d.razon_social ilike $2 \
                      or b.descripcion ilike $2 \
                      or e.nombre ilike $2 ) \
                order by 1 desc";

    G.db.query(sql, [empresa_id, "%"+termino_busqueda+"%"], function(err, rows, result) {
        callback(err, rows);
    });

};

module.exports = PedidosFarmaciasModel;