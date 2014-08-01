var DocuemntoBodegaE008 = function(movientos_bodegas) {

    this.m_movientos_bodegas = movientos_bodegas;

};


// Insertar la cabecera temporal del despacho de un pedido de clientes
DocuemntoBodegaE008.prototype.ingresar_despacho_clientes_temporal = function(bodegas_doc_id, numero_pedido, tipo_tercero_id, tercero_id, observacion, usuario_id, callback) {

    var that = this;


    that.m_movientos_bodegas.obtener_identificicador_movimiento_temporal(usuario_id, function(err, doc_tmp_id) {

        if (err) {
            callback(err);
            return;
        }

        var movimiento_temporal_id = doc_tmp_id;

        console.log('*** ID *****');
        console.log(movimiento_temporal_id);
        console.log('********');

        G.db.begin(function() {

            that.m_movientos_bodegas.ingresar_movimiento_bodega_temporal(movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion, function(err) {

                if (err) {
                    console.log('**** ERR 1****');
                    console.log(err);
                    callback(err);
                    return;
                } else {

                    var sql = " INSERT INTO inv_bodegas_movimiento_tmp_despachos_clientes ( doc_tmp_id, pedido_cliente_id, tipo_id_tercero, tercero_id, usuario_id) \
                                VALUES ( $1, $2, $3, $4, $5 ) ; ";

                    G.db.transaction(sql, [movimiento_temporal_id, numero_pedido, tipo_tercero_id, tercero_id, usuario_id], function(err, rows) {

                        if (err) {
                            callback(err);
                            return;
                        } else {
                            G.db.commit(function(err, rows) {
                                console.log('****ERR2****');
                                console.log(err);
                                callback(err, movimiento_temporal_id, rows)
                            });
                        }
                    });
                }
            });
        });
    });
};


// Insertar la cabecera temporal del despacho de un pedido de farmacias
DocuemntoBodegaE008.prototype.ingresar_despacho_farmacias_temporal = function(bodegas_doc_id, empresa_id, numero_pedido, observacion, usuario_id, callback) {

    var that = this;

    that.m_movientos_bodegas.obtener_identificicador_movimiento_temporal(usuario_id, function(err, doc_tmp_id) {

        if (err) {
            callback(err);
            return;
        }

        var movimiento_temporal_id = doc_tmp_id;

        G.db.begin(function() {

            that.m_movientos_bodegas.ingresar_movimiento_bodega_temporal(movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion, function(err) {

                if (err) {
                    callback(err);
                    return;
                }

                var sql = " INSERT INTO inv_bodegas_movimiento_tmp_despachos_farmacias ( doc_tmp_id, farmacia_id, solicitud_prod_a_bod_ppal_id, usuario_id ) \n\
                            VALUES ( $1, $2, $3, $4) ; ";

                G.db.transaction(sql, [movimiento_temporal_id, empresa_id, numero_pedido, usuario_id], function(err, rows) {

                    if (err) {
                        callback(err);
                        return;
                    } else {
                        G.db.commit(function(err, rows) {
                            callback(err, movimiento_temporal_id, rows);
                        });
                    }
                });
            });
        });

    });
};


// Consultar documento temporal de clientes x numero de pedido
DocuemntoBodegaE008.prototype.consultar_documento_temporal_clientes = function(numero_pedido, callback) {

    var sql = " select\
                a.doc_tmp_id,\
                b.bodegas_doc_id,\
                a.pedido_cliente_id as numero_pedido,\
                a.tipo_id_tercero as tipo_id_cliente,\
                a.tercero_id as identificacion_cliente,\
                d.nombre_tercero as nombre_cliente, \
                d.direccion as direccion_cliente, \
                d.telefono as telefono_cliente, \
                e.tipo_id_vendedor, \
                e.vendedor_id as idetificacion_vendedor, \
                e.nombre as nombre_vendedor, \
                c.estado,  \
                a.observacion,\
                b.fecha_registro,\
                a.usuario_id\
                from inv_bodegas_movimiento_tmp_despachos_clientes a\
                inner join inv_bodegas_movimiento_tmp b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join ventas_ordenes_pedidos c on a.pedido_cliente_id = c.pedido_cliente_id\
                inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id = d.tercero_id \
                inner join vnts_vendedores e on c.tipo_id_vendedor = e.tipo_id_vendedor and c.vendedor_id = e.vendedor_id \
                inner join ventas_ordenes_pedidos_estado f on c.pedido_cliente_id = f.pedido_cliente_id and c.estado_pedido = f.estado\
                inner join operarios_bodega g on f.responsable_id = g.operario_id \
                where a.pedido_cliente_id = $1 ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {

        callback(err, rows);
    });

};

// Consultar documento temporal de clientes x usuario
DocuemntoBodegaE008.prototype.consultar_documentos_temporales_clientes_por_usuario = function(usuario_id, termino_busqueda, pagina, limite, callback) {

    var sql = " select\
                a.doc_tmp_id,\
                b.bodegas_doc_id,\
                a.pedido_cliente_id as numero_pedido,\
                a.tipo_id_tercero as tipo_id_cliente,\
                a.tercero_id as identificacion_cliente,\
                d.nombre_tercero as nombre_cliente, \
                d.direccion as direccion_cliente, \
                d.telefono as telefono_cliente, \
                e.tipo_id_vendedor, \
                e.vendedor_id as idetificacion_vendedor, \
                e.nombre as nombre_vendedor, \
                c.estado,  \
                a.observacion,\
                b.fecha_registro,\
                a.usuario_id\
                from inv_bodegas_movimiento_tmp_despachos_clientes a\
                inner join inv_bodegas_movimiento_tmp b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join ventas_ordenes_pedidos c on a.pedido_cliente_id = c.pedido_cliente_id\
                inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id = d.tercero_id \
                inner join vnts_vendedores e on c.tipo_id_vendedor = e.tipo_id_vendedor and c.vendedor_id = e.vendedor_id \
                inner join ventas_ordenes_pedidos_estado f on c.pedido_cliente_id = f.pedido_cliente_id and c.estado_pedido = f.estado\
                inner join operarios_bodega g on f.responsable_id = g.operario_id \
                where a.usuario_id = $1 \
                and (\
                    a.pedido_cliente_id ilike $2 OR\
                    a.tercero_id ilike $2 OR\
                    d.nombre_tercero ilike $2 OR\
                    e.nombre ilike $2 \
                ) order by b.fecha_registro desc ";

    G.db.pagination(sql, [usuario_id, "%" + termino_busqueda + "%"], pagina, limite, function(err, rows, result, total_records) {

        callback(err, rows, total_records);
    });
};

// Consultar documento temporal de farmacias x usuario
DocuemntoBodegaE008.prototype.consultar_documentos_temporales_farmacias_por_usuario = function(usuario_id, termino_busqueda, pagina, limite, callback) {

    var sql = "";

    G.db.pagination(sql, [usuario_id, "%" + termino_busqueda + "%"], pagina, limite, function(err, rows, result, total_records) {

        callback(err, rows, total_records);
    });

};

// Eliminar Documento Temporal Clientes
DocuemntoBodegaE008.prototype.eliminar_documento_temporal_clientes = function(doc_tmp_id, usuario_id, callback) {

    var that = this;

    G.db.begin(function() {
        // Eliminar Detalle del Documento Temporal
        that.m_movientos_bodegas.eliminar_detalle_movimiento_bodega_temporal(doc_tmp_id, usuario_id, function(err) {
            if (err) {
                callback(err);
                return;
            } else {
                // Eliminar Cabecera Documento Temporal Clientes
                var sql = " DELETE FROM inv_bodegas_movimiento_tmp_despachos_clientes WHERE  doc_tmp_id = $1 AND usuario_id = $2;";

                G.db.transaction(sql, [doc_tmp_id, usuario_id], function(err, rows) {
                    if (err) {
                        callback(err);
                        return;
                    } else {
                        // Eliminar Cabecera Documento Temporal
                        that.m_movientos_bodegas.eliminar_movimiento_bodega_temporal(doc_tmp_id, usuario_id, function(err, rows) {
                            if (err) {
                                callback(err);
                                return;
                            } else {
                                G.db.commit(function(err, rows) {
                                    callback(err, rows);
                                });
                            }
                        });
                    }
                });
            }
        });
    });







};


DocuemntoBodegaE008.$inject = ["m_movientos_bodegas"];

module.exports = DocuemntoBodegaE008;