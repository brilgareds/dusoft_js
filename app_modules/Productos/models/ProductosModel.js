var ProductosModel = function() {

};

ProductosModel.prototype.consultar_existencias_producto = function(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, callback) {

    var sql = " select \
                a.empresa_id,\
                a.centro_utilidad,\
                a.bodega as bodega_id,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                a.lote,\
                a.fecha_vencimiento,\
                a.existencia_actual\
                from existencias_bodegas_lote_fv a \
                inner join existencias_bodegas b on a.empresa_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega and a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and b.empresa_id = c.empresa_id\
                inner join inventarios_productos d on c.codigo_producto = d.codigo_producto\
                where a.empresa_id = $1 \
                and a.centro_utilidad = $2 \
                and a.bodega = $3 \
                and a.codigo_producto = $4 \
                and a.existencia_actual > 0\
                and a.estado = '1'\
                and d.estado = '1'\
                order by a.fecha_vencimiento desc ;";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });

};




module.exports = ProductosModel;