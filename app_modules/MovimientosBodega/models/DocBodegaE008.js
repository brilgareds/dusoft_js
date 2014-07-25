var DocuemntoBodegaE008 = function(movientos_bodegas) {

    this.m_movientos_bodegas = movientos_bodegas;

};



DocuemntoBodegaE008.prototype.ingresar_despacho_clientes_temporal = function(bodegas_doc_id, numero_pedido, tipo_tercero_id, tercero_id, observacion, usuario_id, callback) {

    var that = this;
    
    that.m_movientos_bodegas.obtener_identificicador_movimiento_temporal(usuario_id, function(err, doc_tmp_id) {

        var movimiento_temporal_id = doc_tmp_id;
        
        that.m_movientos_bodegas.ingresar_movimiento_bodega_temporal(movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion, function(){
            
            var sql = " INSERT INTO inv_bodegas_movimiento_tmp_despachos_clientes ( doc_tmp_id, pedido_cliente_id, tipo_id_tercero, tercero_id, usuario_id,) \
                    VALUES ( $1, $2, $3, $4, $5 ) ; ";

            G.db.query(sql, [movimiento_temporal_id, numero_pedido, tipo_tercero_id, tercero_id, usuario_id], function(err, rows, result) {

                callback(err, rows);
            });
            
        });

    });
};



DocuemntoBodegaE008.prototype.ingresar_despacho_farmacias_temporal = function(empresa_id, numero_pedido, usuario_id, callback) {

    var that = this;

    that.m_movientos_bodegas.obtener_identificicador_movimiento_temporal(usuario_id, function(err, doc_tmp_id) {

        var movimiento_temporal_id = doc_tmp_id;
        
        that.m_movientos_bodegas.ingresar_movimiento_bodega_temporal(movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion, function(){
            
            var sql = " INSERT INTO inv_bodegas_movimiento_tmp_despachos_farmacias ( doc_tmp_id, farmacia_id, solicitud_prod_a_bod_ppal_id, usuario_id ) \n\
                    VALUES ( $1, $2, $3, $4) ; ";

            G.db.query(sql, [movimiento_temporal_id, empresa_id, numero_pedido, usuario_id], function(err, rows, result) {

                callback(err, rows);
            });
        });
    });
};

DocuemntoBodegaE008.$inject = ["m_movientos_bodegas"];

module.exports = DocuemntoBodegaE008;