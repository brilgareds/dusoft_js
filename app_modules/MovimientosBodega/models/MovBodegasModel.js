var MovimientosBodegasModel = function() {

};


MovimientosBodegasModel.prototype.obtener_identificicador_movimiento_temporal = function(usuario_id, callback) {

    var sql = "SELECT (COALESCE(MAX(doc_tmp_id),0) + 1) FROM inv_bodegas_movimiento_tmp WHERE usuario_id = $1; "

    G.db.query(sql, [usuario_id], function(err, rows, result) {
        var movimiento_temporal_id = rows[0];
        callback(err, movimiento_temporal_id);
    });
};

MovimientosBodegasModel.prototype.ingresar_movimiento_bodega_temporal = function(movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion, callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento_tmp (doc_tmp_id, usuario_id, bodegas_doc_id, observacion, fecha_registro) \
                VALUES ( $1, $2, $3, $4, now())";
    

    G.db.query(sql, [movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion], function(err, rows, result) {
        
        callback(err, rows);
    });
};

MovimientosBodegasModel.prototype.ingresar_detalle_movimiento_bodega_temporal = function(callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento_tmp_d ( item_id, usuario_id, doc_tmp_id, empresa_id, centro_utilidad, bodega, codigo_producto, cantidad, \n\
                porcentaje_gravamen, total_costo, fecha_vencimiento, lote, local_prod, total_costo_pedido, valor_unitario ) \n\
                VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15); ";
        

    G.db.query(sql, [], function(err, rows, result) {
        
        callback(err, rows);
    });
};

module.exports = MovimientosBodegasModel;