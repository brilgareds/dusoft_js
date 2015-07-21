var DocuemntoBodegaE008 = function(movientos_bodegas, m_pedidos_clientes, m_pedidos_farmacias) {

    this.m_movimientos_bodegas = movientos_bodegas;
    this.m_pedidos_clientes = m_pedidos_clientes;
    this.m_pedidos_farmacias = m_pedidos_farmacias;

};

/*********************************************************************************************************************************
 * ============= DOCUMENTOS TEMPORALES =============
 /*********************************************************************************************************************************/

// Insertar la cabecera temporal del despacho de un pedido de clientes
DocuemntoBodegaE008.prototype.ingresar_despacho_clientes_temporal = function(bodegas_doc_id, numero_pedido, tipo_tercero_id, tercero_id, observacion, usuario_id, callback) {

    var that = this;


    that.m_movimientos_bodegas.obtener_identificicador_movimiento_temporal(usuario_id, function(err, doc_tmp_id) {

        if (err) {
            callback(err);
            return;
        }

        var movimiento_temporal_id = doc_tmp_id;

        G.db.begin(function() {

            that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal(movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion, function(err) {

                if (err) {
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
                                callback(err, movimiento_temporal_id, rows);
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

    that.m_movimientos_bodegas.obtener_identificicador_movimiento_temporal(usuario_id, function(err, doc_tmp_id) {

        if (err) {
            callback(err);
            return;
        }

        var movimiento_temporal_id = doc_tmp_id;


        G.db.begin(function() {

            that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal(movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion, function(err) {

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

// Consultar Documentos Temporales Clientes 
DocuemntoBodegaE008.prototype.consultar_documentos_temporales_clientes = function(empresa_id, termino_busqueda, filtro, pagina, callback) {

    /*=========================================================================*/
    // Se implementa este filtro, para poder filtrar todos los docuemntos 
    // temporales de clientes o solo los finalizados
    /*=========================================================================*/

    var sql_aux = " ";
    var parametros = [empresa_id, "%" + termino_busqueda + "%"];

    if (filtro !== undefined) {

        if (filtro.en_proceso) {
            sql_aux = " AND a.estado = '0' ";
        }
        if (filtro.finalizados) {
            //en auditoria se necesia filtrar por la empresa de donde sale el pedido ademas por centro de utilidad y bodega
            sql_aux = " and a.estado IN ('1','2') and  c.bodega_destino = $3 and c.centro_destino = $4 ";
            parametros = [empresa_id, "%" + termino_busqueda + "%", filtro.bodega_id, filtro.centro_utilidad];
        }
    }

    var sql = " select \
                a.doc_tmp_id as documento_temporal_id,\
                a.usuario_id,\
                b.bodegas_doc_id,\
                a.pedido_cliente_id as numero_pedido,\
                d.tipo_id_tercero as tipo_id_cliente, \
                d.tercero_id as identificacion_cliente, \
                d.nombre_tercero as nombre_cliente, \
                d.direccion as direccion_cliente, \
                d.telefono as telefono_cliente,\
                e.tipo_id_vendedor, \
                e.vendedor_id as idetificacion_vendedor, \
                e.nombre as nombre_vendedor, \
                c.estado,\
                case when c.estado = 0 then 'Inactivo' \
                     when c.estado = 1 then 'Activo' end as descripcion_estado,\
                c.estado_pedido as estado_actual_pedido, \
                case when c.estado_pedido = 0 then 'No Asignado' \
                     when c.estado_pedido = 1 then 'Asignado' \
                     when c.estado_pedido = 2 then 'Auditado' \
                     when c.estado_pedido = 3 then 'En Zona Despacho' \
                     when c.estado_pedido = 4 then 'Despachado'\
                     when c.estado_pedido = 5 then 'Despachado con Pendientes' \
                     when c.estado_pedido = 6 then 'Separacion Finalizada'     \
                     when c.estado_pedido = 7 then 'En Auditoria'     \
                     when c.estado_pedido = 8 then 'Auditado con pdtes'   \
                     when c.estado_pedido = 9 then 'En zona con pdtes' end as descripcion_estado_actual_pedido,    \
                a.estado as estado_separacion,     \
                case when a.estado = '0' then 'Separacion en Proceso' \
                     when a.estado = '1' then 'Separacion Finalizada' \
                     when a.estado = '2' then 'En Auditoria' end as descripcion_estado_separacion,     \
                to_char(c.fecha_registro, 'dd-mm-yyyy') as fecha_registro,    \
                to_char(b.fecha_registro, 'dd-mm-yyyy') as fecha_separacion_pedido, \
                c.empresa_id\
                from inv_bodegas_movimiento_tmp_despachos_clientes a\
                inner join inv_bodegas_movimiento_tmp b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join ventas_ordenes_pedidos c on a.pedido_cliente_id = c.pedido_cliente_id\
                inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id = d.tercero_id \
                inner join vnts_vendedores e on c.tipo_id_vendedor = e.tipo_id_vendedor and c.vendedor_id = e.vendedor_id \
                where c.empresa_id = $1 " + sql_aux + "\
                and (\
                     a.pedido_cliente_id ilike $2 or\
                     d.tercero_id ilike $2 or\
                     d.nombre_tercero  ilike $2 or\
                     e.vendedor_id ilike $2 or\
                     e.nombre ilike $2 \
                )";

    G.db.pagination(sql, parametros, pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows, total_records);
    });
};

// Consultar Documentos Temporales Farmacias 
DocuemntoBodegaE008.prototype.consultar_documentos_temporales_farmacias = function(empresa_id, termino_busqueda, filtro, pagina, callback) {

    var sql_aux = " ";
    var sql_empresa = " c.farmacia_id = $1 ";
    var parametros = [empresa_id, "%" + termino_busqueda + "%"];

    if (filtro !== undefined) {

        if (filtro.en_proceso) {
            sql_aux = " AND a.estado = '0' ";
        }
        if (filtro.finalizados) {
            //en auditoria se necesia filtrar por la empresa de donde sale el pedido ademas por centro de utilidad y bodega
            sql_empresa = " c.empresa_destino = $1 ";
            sql_aux = " and a.estado IN ('1','2') and  c.bodega_destino = $3 and c.centro_destino = $4 ";
            parametros = [empresa_id, "%" + termino_busqueda + "%", filtro.bodega_id, filtro.centro_utilidad];
        }
    }

    var sql = " select \
                a.doc_tmp_id as documento_temporal_id,\
                a.usuario_id,\
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                c.farmacia_id,\
                f.empresa_id,\
                c.centro_utilidad,\
                c.bodega as bodega_id,\
                f.razon_social as nombre_farmacia,\
                d.descripcion as nombre_bodega,\
                c.usuario_id as usuario_genero,\
                g.nombre as nombre_usuario,\
                c.estado as esta_actual_pedido,\
                case when c.estado = 0 then 'No Asignado' \
                     when c.estado = 1 then 'Asignado' \
                     when c.estado = 2 then 'Auditado' \
                     when c.estado = 3 then 'En Zona Despacho' \
                     when c.estado = 4 then 'Despachado' \
                     when c.estado = 5 then 'Despachado con Pendientes' \
                     when c.estado = 6 then 'Separacion Finalizada' \
                     when c.estado = 7 then 'En Auditoria'  \
                     when c.estado = 8 then 'Auditado con pdtes'  \
                     when c.estado = 9 then 'En zona con pdtes' end as descripcion_estado_actual_pedido, \
                a.estado as estado_separacion,\
                case when a.estado = '0' then 'Separacion en Proceso' \
                     when a.estado = '1' then 'Separacion Finalizada' \
                     when a.estado = '2' then 'En Auditoria' end as descripcion_estado_separacion,   \
                to_char(c.fecha_registro, 'dd-mm-yyyy') as fecha_registro,\
                to_char(b.fecha_registro, 'dd-mm-yyyy') as fecha_separacion_pedido\
                from inv_bodegas_movimiento_tmp_despachos_farmacias a\
                inner join inv_bodegas_movimiento_tmp b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join solicitud_productos_a_bodega_principal c on a.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id\
                inner join bodegas d on c.farmacia_id = d.empresa_id and c.centro_utilidad = d.centro_utilidad and c.bodega = d.bodega \
                inner join centros_utilidad e on d.empresa_id = e.empresa_id and d.centro_utilidad = e.centro_utilidad \
                inner join empresas f ON e.empresa_id = f.empresa_id \
                inner join system_usuarios g ON c.usuario_id = g.usuario_id \
                where " +sql_empresa + sql_aux + "\
                and (\
                        a.solicitud_prod_a_bod_ppal_id ilike $2 or\
                        f.razon_social ilike $2 or\
                        d.descripcion ilike $2 or\
                        g.nombre ilike $2 \
                )";

    G.db.pagination(sql, parametros, pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows, total_records);
    });
};

// Consultar documento temporal de clientes x numero de pedido
DocuemntoBodegaE008.prototype.consultar_documento_temporal_clientes = function(numero_pedido, callback) {

    var sql = " select \
                a.doc_tmp_id as documento_temporal_id,\
                a.usuario_id,\
                b.bodegas_doc_id,\
                a.pedido_cliente_id as numero_pedido,\
                d.tipo_id_tercero as tipo_id_cliente, \
                d.tercero_id as identificacion_cliente, \
                d.nombre_tercero as nombre_cliente, \
                d.direccion as direccion_cliente, \
                d.telefono as telefono_cliente,\
                e.tipo_id_vendedor, \
                e.vendedor_id as idetificacion_vendedor, \
                e.nombre as nombre_vendedor, \
                c.estado,\
                case when c.estado = 0 then 'Inactivo' \
                     when c.estado = 1 then 'Activo' end as descripcion_estado,\
                c.estado_pedido as estado_actual_pedido, \
                case when c.estado_pedido = 0 then 'No Asignado' \
                     when c.estado_pedido = 1 then 'Asignado' \
                     when c.estado_pedido = 2 then 'Auditado' \
                     when c.estado_pedido = 3 then 'En Zona Despacho' \
                     when c.estado_pedido = 4 then 'Despachado'\
                     when c.estado_pedido = 5 then 'Despachado con Pendientes' \
                     when c.estado_pedido = 6 then 'Separacion Finalizada'     \
                     when c.estado_pedido = 7 then 'En Auditoria'   \
                     when c.estado_pedido = 8 then 'Auditado con pdtes'     \
                     when c.estado_pedido = 9 then 'En zona con pdtes' end as descripcion_estado_actual_pedido,    \
                a.estado as estado_separacion,     \
                case when a.estado = '0' then 'Separacion en Proceso' \
                     when a.estado = '1' then 'Separacion Finalizada' \
                     when a.estado = '2' then 'En Auditoria' end as descripcion_estado_separacion,     \
                c.fecha_registro,    \
                b.fecha_registro as fecha_separacion_pedido \
                from inv_bodegas_movimiento_tmp_despachos_clientes a\
                inner join inv_bodegas_movimiento_tmp b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join ventas_ordenes_pedidos c on a.pedido_cliente_id = c.pedido_cliente_id\
                inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id = d.tercero_id \
                inner join vnts_vendedores e on c.tipo_id_vendedor = e.tipo_id_vendedor and c.vendedor_id = e.vendedor_id \
                where a.pedido_cliente_id = $1 ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {

        callback(err, rows);
    });

};

// Consultar documento temporal de Farmacias x numero de pedido
DocuemntoBodegaE008.prototype.consultar_documento_temporal_farmacias = function(numero_pedido, callback) {

    var sql = " select \
                a.doc_tmp_id as documento_temporal_id,\
                a.usuario_id,\
                b.bodegas_doc_id,\
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                c.farmacia_id,\
                f.empresa_id,\
                c.centro_utilidad,\
                c.bodega as bodega_id,\
                f.razon_social as nombre_farmacia,\
                d.descripcion as nombre_bodega,\
                c.usuario_id as usuario_genero,\
                g.nombre as nombre_usuario,\
                c.estado as esta_actual_pedido,\
                case when c.estado = 0 then 'No Asignado' \
                     when c.estado = 1 then 'Asignado' \
                     when c.estado = 2 then 'Auditado' \
                     when c.estado = 3 then 'En Zona Despacho' \
                     when c.estado = 4 then 'Despachado' \
                     when c.estado = 5 then 'Despachado con Pendientes' \
                     when c.estado = 6 then 'Separacion Finalizada' \
                     when c.estado = 7 then 'En Auditoria'  \
                     when c.estado = 8 then 'Auditado con pdtes'  \
                     when c.estado = 9 then 'En zona con pdtes' end as descripcion_estado_actual_pedido, \
                a.estado as estado_separacion,\
                case when a.estado = '0' then 'Separacion en Proceso' \
                     when a.estado = '1' then 'Separacion Finalizada' \
                     when a.estado = '2' then 'En Auditoria' end as descripcion_estado_separacion,   \
                c.fecha_registro,\
                b.fecha_registro as fecha_separacion_pedido\
                from inv_bodegas_movimiento_tmp_despachos_farmacias a\
                inner join inv_bodegas_movimiento_tmp b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join solicitud_productos_a_bodega_principal c on a.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id\
                inner join bodegas d on c.farmacia_id = d.empresa_id and c.centro_utilidad = d.centro_utilidad and c.bodega = d.bodega \
                inner join centros_utilidad e on d.empresa_id = e.empresa_id and d.centro_utilidad = e.centro_utilidad \
                inner join empresas f ON e.empresa_id = f.empresa_id \
                inner join system_usuarios g ON c.usuario_id = g.usuario_id \
                where a.solicitud_prod_a_bod_ppal_id = $1 ";

    G.db.query(sql, [numero_pedido], function(err, rows, result) {

        callback(err, rows);
    });
};

// Eliminar Documento Temporal Clientes
DocuemntoBodegaE008.prototype.eliminar_documento_temporal_clientes = function(doc_tmp_id, usuario_id, callback) {
    var that = this;
    G.db.begin(function() {

        // Eliminar Detalle del Documento Temporal
        that.m_movimientos_bodegas.eliminar_detalle_movimiento_bodega_temporal(doc_tmp_id, usuario_id, function(err) {
            if (err) {
                callback(err);
                return;
            } else {
                //Eliminar Justificaciones
                that.eliminar_justificaciones_temporales_pendientes(doc_tmp_id, usuario_id, function(err) {
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
                                that.m_movimientos_bodegas.eliminar_movimiento_bodega_temporal(doc_tmp_id, usuario_id, function(err, rows) {
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
            }
        });
    });
};

// Eliminar Documento Temporal Farmacias
DocuemntoBodegaE008.prototype.eliminar_documento_temporal_farmacias = function(doc_tmp_id, usuario_id, callback) {

    var that = this;

    // Inicia Transaccion.
    G.db.begin(function() {
        // Eliminar Detalle del Documento Temporal
        that.m_movimientos_bodegas.eliminar_detalle_movimiento_bodega_temporal(doc_tmp_id, usuario_id, function(err) {
            if (err) {
                callback(err);
                return;
            } else {
                // Eliminar Cabecera Documento Temporal Farmacias
                var sql = " DELETE FROM inv_bodegas_movimiento_tmp_despachos_farmacias WHERE  doc_tmp_id = $1 AND usuario_id = $2;";

                G.db.transaction(sql, [doc_tmp_id, usuario_id], function(err, rows) {
                    if (err) {
                        callback(err);
                        return;
                    } else {
                        // Eliminar Cabecera Documento Temporal
                        that.m_movimientos_bodegas.eliminar_movimiento_bodega_temporal(doc_tmp_id, usuario_id, function(err, rows) {
                            if (err) {
                                callback(err);
                                return;
                            } else {
                                // Termina Transaccion.
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

// Consultar Justificacion de Productos Pendientes
DocuemntoBodegaE008.prototype.gestionar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor, callback) {

    var that = this;

    that.consultar_justificaciones_temporales_pendientes(doc_tmp_id, usuario_id, codigo_producto, function(err, justificaciones) {

        /*console.log('======================= JUSTIFICACIONES ==============');
         console.log(err);
         console.log(justificaciones);
         console.log('======================================================');
         return*/

        if (err) {
            callback(err, justificaciones);
            return;
        } else {
            if (justificaciones.length > 0) {
                // Modificar
                that.actualizar_justificaciones_temporales_pendientes(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor, callback);
                return;
            } else {
                // Ingrsar
                that.ingresar_justificaciones_temporales_pendientes(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, justificacion, existencia, justificacion_auditor, callback);
                return;
            }
        }
    });
};

// Consultar Justificacion de Productos Pendientes
DocuemntoBodegaE008.prototype.consultar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, callback) {

    console.log('========= consultar_justificaciones_temporales_pendientes =========');

    var sql = " SELECT * FROM inv_bodegas_movimiento_tmp_justificaciones_pendientes a\
                WHERE a.doc_tmp_id = $1 and a.usuario_id = $2 and a.codigo_producto = $3 ;";

    G.db.query(sql, [doc_tmp_id, usuario_id, codigo_producto], function(err, rows, result) {

        callback(err, rows);
    });
};


// Ingresar Justificacion de Productos Pendientes
DocuemntoBodegaE008.prototype.ingresar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, justificacion, existencia, justificacion_auditor, callback) {

    console.log('========= ingresar_justificaciones_temporales_pendientes =========');

    var sql = " INSERT INTO inv_bodegas_movimiento_tmp_justificaciones_pendientes ( doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, observacion, existencia, justificacion_auditor ) \
                VALUES ($1, $2, $3, $4, $5, $6, $7 ); ";

    G.db.query(sql, [doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, justificacion, existencia, justificacion_auditor], function(err, rows, result) {

        callback(err, rows, result);
    });
};

// Actualizar Justificacion de Productos Pendientes
DocuemntoBodegaE008.prototype.actualizar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor, callback) {

    console.log('========= actualizar_justificaciones_temporales_pendientes =========');

    var sql = " UPDATE inv_bodegas_movimiento_tmp_justificaciones_pendientes SET cantidad_pendiente = $4 , existencia = $5, observacion = $6, justificacion_auditor = $7  \
                WHERE doc_tmp_id = $1 and usuario_id = $2 and codigo_producto = $3 ; ";

    G.db.query(sql, [doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor], function(err, rows, result) {

        callback(err, rows, result);
    });
};

// Eliminar Justificacion de Productos Pendientes
DocuemntoBodegaE008.prototype.eliminar_justificaciones_temporales_pendientes = function(documento_temporal_id, usuario_id, callback) {

    var sql = "DELETE FROM inv_bodegas_movimiento_tmp_justificaciones_pendientes WHERE doc_tmp_id = $1 AND usuario_id = $2;";

    G.db.transaction(sql, [documento_temporal_id, usuario_id], function(err, rows, result) {

        callback(err, rows);
    });
};

// Eliminar Justificacion de Producto
DocuemntoBodegaE008.prototype.eliminar_justificaciones_temporales_producto = function(doc_tmp_id, usuario_id, codigo_producto, callback) {

    var sql = "DELETE FROM inv_bodegas_movimiento_tmp_justificaciones_pendientes WHERE doc_tmp_id = $1 AND usuario_id = $2 AND codigo_producto = $3;";

    G.db.query(sql, [doc_tmp_id, usuario_id, codigo_producto], function(err, rows, result) {

        callback(err, rows);
    });
};


// Actualizar estado documento temporal de clientes 0 = En Proceso separacion, 1 = Separacion Finalizada, 2 = En auditoria
DocuemntoBodegaE008.prototype.actualizar_estado_documento_temporal_clientes = function(numero_pedido, estado, callback) {

    var sql = " UPDATE inv_bodegas_movimiento_tmp_despachos_clientes SET estado = $2 WHERE pedido_cliente_id = $1 ;";

    G.db.query(sql, [numero_pedido, estado], function(err, rows, result) {

        callback(err, rows, result);
    });

};

// Actualizar estado documento temporal de farmacias 0 = En Proceso separacion, 1 = Separacion Finalizada, 2 = En auditoria
DocuemntoBodegaE008.prototype.actualizar_estado_documento_temporal_farmacias = function(numero_pedido, estado, callback) {

    var sql = " UPDATE inv_bodegas_movimiento_tmp_despachos_farmacias SET estado = $2 WHERE solicitud_prod_a_bod_ppal_id = $1 ;";

    G.db.query(sql, [numero_pedido, estado], function(err, rows, result) {

        callback(err, rows, result);
    });

};

// Consultar el rotulo mayor para validar el consecutivo de la caja o nevera 
DocuemntoBodegaE008.prototype.consultarNumeroMayorRotulo = function(documento_id, numero_pedido, tipo, callback) {
    var sql = " select coalesce(max(a.numero_caja), 0) as numero_caja from inv_rotulo_caja a \
                where a.documento_id = $1 and  solicitud_prod_a_bod_ppal_id = $2 and (sw_despachado = '0' or sw_despachado is null) and a.tipo = $3; ";

    G.db.query(sql, [documento_id, numero_pedido, tipo], function(err, rows, result) {

        callback(err, rows, result);
    });
};

// Consultar el rotulo de una caja 
DocuemntoBodegaE008.prototype.consultar_rotulo_caja = function(documento_id, numero_caja, numero_pedido, callback) {
    var sql = " select * from inv_rotulo_caja a where a.documento_id = $1 and numero_caja = $2 and solicitud_prod_a_bod_ppal_id = $3 and (sw_despachado = '0' or sw_despachado is null); ";

    G.db.query(sql, [documento_id, numero_caja, numero_pedido], function(err, rows, result) {

        callback(err, rows, result);
    });
};

// Inserta el rotulo de una caja
DocuemntoBodegaE008.prototype.generar_rotulo_caja = function(documento_id, numero_pedido, cliente, direccion, cantidad, ruta, contenido, numero_caja, usuario_id, tipo, callback) {

    var sql = " INSERT INTO inv_rotulo_caja (documento_id, solicitud_prod_a_bod_ppal_id, cliente, direccion, cantidad, ruta, contenido, usuario_registro, fecha_registro, numero_caja, tipo) \
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10 ) ;";


    G.db.query(sql, [documento_id, numero_pedido, cliente, direccion, cantidad, ruta, contenido, usuario_id, numero_caja, tipo], function(err, rows, result) {

        callback(err, rows, result);
    });
};

DocuemntoBodegaE008.prototype.marcar_cajas_como_despachadas = function(documento_id, numero_pedido, callback) {
    var sql = " UPDATE inv_rotulo_caja SET sw_despachado='1' WHERE documento_id = $1 and solicitud_prod_a_bod_ppal_id = $2; ";

    G.db.query(sql, [documento_id, numero_pedido], function(err, rows, result) {

        callback(err, rows, result);
    });
};

// Cierra la caja
DocuemntoBodegaE008.prototype.cerrar_caja = function(documento_id, numero_caja, tipo, callback) {

    var sql = " UPDATE inv_rotulo_caja SET caja_cerrada='1' WHERE documento_id = $1 and numero_caja = $2 and tipo = $3; ";


    G.db.query(sql, [documento_id, numero_caja, tipo], function(err, rows, result) {

        callback(err, rows, result);
    });

};

DocuemntoBodegaE008.prototype.actualizarCajaDeTemporal = function(item_id, numero_caja, tipo, callback) {
    var sql = " UPDATE inv_bodegas_movimiento_tmp_d SET numero_caja=$2, tipo_caja = $3 WHERE item_id = $1 ";


    G.db.query(sql, [item_id, numero_caja, tipo], function(err, rows, result) {

        callback(err, rows, result);
    });
};



/*********************************************************************************************************************************
 * ============= DOCUMENTOS DESPACHO =============
 /*********************************************************************************************************************************/
DocuemntoBodegaE008.prototype.generar_documento_despacho_farmacias = function(documento_temporal_id, numero_pedido, usuario_id, auditor_id, callback) {

    var that = this;

    // Iniciar Transacción
    G.db.begin(function() {

        // Generar Documento de Despacho.
        that.m_movimientos_bodegas.crear_documento(documento_temporal_id, usuario_id, function(err, empresa_id, prefijo_documento, numero_documento) {

            if (err) {
                callback(err);
                return;
            }


            // Asignar Auditor Como Responsable del Despacho.
            __asignar_responsable_despacho(empresa_id, prefijo_documento, numero_documento, usuario_id, function(err, result) {

                if (err) {
                    callback(err);
                    return;
                }

                // Generar Cabecera Documento Despacho.
                __ingresar_documento_despacho_farmacias(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, auditor_id, function(err, result) {

                    if (err) {
                        callback(err);
                        return;
                    }
                    // Generar Justificaciones Documento Despacho.
                    __ingresar_justificaciones_despachos(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, function(err, result) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        // Eliminar Temporales Despachos Clientes.
                        __eliminar_documento_temporal_farmacias(documento_temporal_id, usuario_id, function(err, result) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            // Eliminar Temporales Justificaciones.
                            that.eliminar_justificaciones_temporales_pendientes(documento_temporal_id, usuario_id, function(err, result) {
                                if (err) {
                                    callback(err);
                                    return;
                                }
                                // Finalizar Transacción.
                                G.db.commit(function() {
                                    that.m_pedidos_farmacias.actualizar_cantidad_pendiente_en_solicitud(numero_pedido, function(err, results) {
                                        callback(err, empresa_id, prefijo_documento, numero_documento);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};



DocuemntoBodegaE008.prototype.generar_documento_despacho_clientes = function(documento_temporal_id, numero_pedido, usuario_id, auditor_id, callback) {

    var that = this;

    // Iniciar Transacción
    G.db.begin(function() {

        // Generar Documento de Despacho.
        that.m_movimientos_bodegas.crear_documento(documento_temporal_id, usuario_id, function(err, empresa_id, prefijo_documento, numero_documento) {

            if (err) {
                callback(err);
                return;
            }

            // Asignar Auditor Como Responsable del Despacho.
            __asignar_responsable_despacho(empresa_id, prefijo_documento, numero_documento, usuario_id, function(err, result) {

                if (err) {
                    callback(err);
                    return;
                }

                // Generar Cabecera Documento Despacho.
                __ingresar_documento_despacho_clientes(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, auditor_id, function(err, result) {

                    if (err) {
                        callback(err);
                        return;
                    }
                    // Generar Justificaciones Documento Despacho.
                    __ingresar_justificaciones_despachos(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, function(err, result) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        // Eliminar Temporales Despachos Clientes.
                        __eliminar_documento_temporal_clientes(documento_temporal_id, usuario_id, function(err, result) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            // Eliminar Temporales Justificaciones.
                            that.eliminar_justificaciones_temporales_pendientes(documento_temporal_id, usuario_id, function(err, result) {
                                if (err) {
                                    callback(err);
                                    return;
                                }
                                // Finalizar Transacción.
                                G.db.commit(function() {
                                    that.m_pedidos_clientes.actualizar_despachos_pedidos_cliente(numero_pedido, prefijo_documento, numero_documento, function(err) {
                                        callback(err, empresa_id, prefijo_documento, numero_documento);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};


DocuemntoBodegaE008.prototype.consultar_documento_despacho = function(numero, prefijo, empresa, usuario_id, callback){
    
    var sql = "select to_char(a.fecha_registro, 'dd-mm-yyyy hh:mi am') as fecha_registro,\
                a.prefijo,\
                a.numero,\
                j.pedido_cliente_id as numero_pedido,\
                j.estado_pedido,\
                d.inv_tipo_movimiento as tipo_movimiento , d.descripcion as tipo_clase_documento,\
                c.descripcion, e.pedido_cliente_id as numero_pedido,\
                c.tipo_doc_general_id as tipo_doc_bodega_id,\
                f.nombre as nombre_usuario,\
                g.razon_social as nombre_empresa_destino,\
                h.descripcion as nombre_bodega_destino,\
                i.descripcion as nombre_centro_utilidad,\
                (select nombre from system_usuarios where usuario_id = $4) as usuario_imprime,\
                to_char(now(), 'dd-mm-yyyy hh:mi AM') as fecha_impresion,\
                to_char(j.fecha_registro, 'dd-mm-yyyy hh:mi AM') as fecha_pedido\
                from  inv_bodegas_movimiento as a\
                inner join inv_bodegas_documentos as b on  a.documento_id = b.documento_id AND a.empresa_id = b.empresa_id AND a.centro_utilidad = b.centro_utilidad AND a.bodega = b.bodega\
                inner join documentos as c on  c.documento_id = a.documento_id AND c.empresa_id = a.empresa_id\
                inner join tipos_doc_generales as d on  d.tipo_doc_general_id = c.tipo_doc_general_id\
                inner join inv_bodegas_movimiento_despachos_clientes as e on  e.empresa_id = a.empresa_id AND e.prefijo = a.prefijo AND e.numero = a.numero\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                inner join empresas g on g.empresa_id = a.empresa_id\
                inner join bodegas h on h.bodega = a.bodega and h.centro_utilidad = a.centro_utilidad and h.empresa_id = a.empresa_id\
                inner join centros_utilidad i on  i.centro_utilidad = a.centro_utilidad and i.empresa_id = a.empresa_id\
                inner join ventas_ordenes_pedidos j on j.pedido_cliente_id = e.pedido_cliente_id\
                where a.empresa_id = $3\
                and a.prefijo = $2\
                and a.numero = $1\
                union\
                select to_char(a.fecha_registro, 'dd-mm-yyyy hh:mi am') as fecha_registro,\
                a.prefijo,\
                a.numero,\
                j.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                j.estado as estado_pedido,\
                d.inv_tipo_movimiento as tipo_movimiento , d.descripcion as tipo_clase_documento,\
                c.descripcion, e.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                c.tipo_doc_general_id as tipo_doc_bodega_id,\
                f.nombre as nombre_usuario,\
                g.razon_social as nombre_empresa_destino,\
                h.descripcion as nombre_bodega_destino,\
                i.descripcion as nombre_centro_utilidad,\
                (select nombre from system_usuarios where usuario_id = $4) as usuario_imprime,\
                to_char(now(), 'dd-mm-yyyy hh:mi AM') as fecha_impresion,\
                to_char(j.fecha_registro, 'dd-mm-yyyy hh:mi AM') as fecha_pedido\
                from  inv_bodegas_movimiento as a\
                inner join inv_bodegas_documentos as b on  a.documento_id = b.documento_id AND a.empresa_id = b.empresa_id AND a.centro_utilidad = b.centro_utilidad AND a.bodega = b.bodega\
                inner join documentos as c on  c.documento_id = a.documento_id AND c.empresa_id = a.empresa_id\
                inner join tipos_doc_generales as d on  d.tipo_doc_general_id = c.tipo_doc_general_id\
                inner join inv_bodegas_movimiento_despachos_farmacias as e on  e.empresa_id = a.empresa_id AND e.prefijo = a.prefijo AND e.numero = a.numero\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                inner join empresas g on g.empresa_id = a.empresa_id\
                inner join bodegas h on h.bodega = a.bodega and h.centro_utilidad = a.centro_utilidad and h.empresa_id = a.empresa_id\
                inner join centros_utilidad i on  i.centro_utilidad = a.centro_utilidad and i.empresa_id = a.empresa_id\
                inner join solicitud_productos_a_bodega_principal j on j.solicitud_prod_a_bod_ppal_id = e.solicitud_prod_a_bod_ppal_id\
                where a.empresa_id = $3\
                and a.prefijo = $2\
                and a.numero = $1";
    
    G.db.query(sql, [numero, prefijo, empresa, usuario_id], function(err, rows, result) {
        callback(err, rows);

    });
    
};

/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/


function __errorGenerandoDocumento(err, callback) {
    if (err) {
        callback(err);
    }
}

//Ingresar cabecera documento despacho farmacias
function __ingresar_documento_despacho_farmacias(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, auditor_id, callback) {
    var sql = " INSERT INTO inv_bodegas_movimiento_despachos_farmacias(empresa_id, prefijo, numero, farmacia_id, solicitud_prod_a_bod_ppal_id, usuario_id,fecha_registro,rutaviaje_destinoempresa_id, sw_revisado, sw_entregado_off )\
                SELECT $3 as empresa_id, $4 as prefijo, $5 as numero, a.farmacia_id, a.solicitud_prod_a_bod_ppal_id, $2 as usuario_id, NOW() as fecha_registro, a.rutaviaje_destinoempresa_id, '1' as sw_revisado, '1' as sw_entregado_off\
                FROM inv_bodegas_movimiento_tmp_despachos_farmacias a WHERE a.doc_tmp_id =$1 AND a.usuario_id =$2 ";

    G.db.transaction(sql, [documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento], callback);
}
;



// Ingresar cabecera docuemento despacho clientes
function __ingresar_documento_despacho_clientes(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, auditor_id, callback) {


    var sql = " INSERT INTO inv_bodegas_movimiento_despachos_clientes(empresa_id, prefijo, numero, tipo_id_tercero, tercero_id, pedido_cliente_id, rutaviaje_destinoempresa_id, observacion, fecha_registro, usuario_id )\
                SELECT $3 as empresa_id, $4 as prefijo, $5 as numero, a.tipo_id_tercero, a.tercero_id, a.pedido_cliente_id, a.rutaviaje_destinoempresa_id, a.observacion, NOW() as fecha_registro,$2 as usuario_id \
                FROM inv_bodegas_movimiento_tmp_despachos_clientes a WHERE a.doc_tmp_id =$1 AND a.usuario_id =$2 ";

    G.db.transaction(sql, [documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento], callback);
}
;

// Ingresar Justificacion despacho
function __ingresar_justificaciones_despachos(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, callback) {

    console.log('========= ingresar_justificaciones_despachos =========');

    var sql = " INSERT INTO inv_bodegas_movimiento_justificaciones_pendientes ( empresa_id, prefijo, numero, codigo_producto, cantidad_pendiente, observacion, existencia, usuario_id, justificacion_auditor ) \
                SELECT $3 AS empresa_id, $4 AS prefijo, $5 AS numero, codigo_producto, cantidad_pendiente, observacion, existencia, usuario_id, justificacion_auditor FROM inv_bodegas_movimiento_tmp_justificaciones_pendientes\
                WHERE doc_tmp_id = $1 AND usuario_id = $2 ;  ";

    G.db.transaction(sql, [documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento], callback);
}
;

// Ingresar Autorizaciones despacho
function __ingresar_autorizaciones_despachos(documento_temporal_id, usuario_id, callback) {

    console.log('========= ingresar_autorizaciones_despachos =========');

    var sql = " INSERT INTO inv_bodegas_movimiento_autorizaciones_despachos \
                    (empresa_id, prefijo, numero,centro_utilidad,bodega,codigo_producto, lote,fecha_vencimiento, cantidad,porcentaje_gravamen,total_costo,fecha_registro,usuario_id_autorizador,observacion,fecha_autorizacion)\
                SELECT  \
                    '%empresa_id%' AS empresa_id, '%prefijo%' AS prefijo, %numero% AS numero, centro_utilidad, bodega, codigo_producto, lote,fecha_vencimiento,\
                    cantidad, porcentaje_gravamen, total_costo, fecha_registro, usuario_id_autorizador, observacion, fecha_autorizacion   \
                FROM inv_bodegas_movimiento_tmp_autorizaciones_despachos WHERE TRUE  AND sw_autorizado = '1' AND doc_tmp_id = $1 AND usuario_id = $2 ; ";

    G.db.transaction(sql, [documento_temporal_id, usuario_id], function(err, rows, result) {

        callback(err, rows, result);
    });
}
;

//Eliminar Documento Temporal Despacho Farmacias
function __eliminar_documento_temporal_farmacias(documento_temporal_id, usuario_id, callback) {

    var sql = " DELETE FROM inv_bodegas_movimiento_tmp_despachos_farmacias WHERE  doc_tmp_id = $1 AND usuario_id = $2;";




    G.db.transaction(sql, [documento_temporal_id, usuario_id], function(err, result) {
        if (err) {
            callback(err);
            return;
        }

        sql = "DELETE FROM inv_bodegas_movimiento_tmp_d WHERE  doc_tmp_id = $1 AND usuario_id = $2;";
        G.db.transaction(sql, [documento_temporal_id, usuario_id], function(err, result) {
            if (err) {
                callback(err);
                return;
            }
            sql = " DELETE FROM inv_bodegas_movimiento_tmp WHERE  doc_tmp_id = $1 AND usuario_id = $2;";
            G.db.transaction(sql, [documento_temporal_id, usuario_id], callback);
        });

    });


}
;



// Eliminar Documento Temporal Despacho Clientes
function __eliminar_documento_temporal_clientes(documento_temporal_id, usuario_id, callback) {



    var sql = " DELETE FROM inv_bodegas_movimiento_tmp_despachos_clientes WHERE  doc_tmp_id = $1 AND usuario_id = $2;";




    G.db.transaction(sql, [documento_temporal_id, usuario_id], function(err, result) {
        if (err) {
            callback(err);
            return;
        }

        sql = " DELETE FROM inv_bodegas_movimiento_tmp_d WHERE  doc_tmp_id = $1 AND usuario_id = $2;";
        G.db.transaction(sql, [documento_temporal_id, usuario_id], function(err, result) {
            if (err) {
                callback(err);
                return;
            }
            sql = " DELETE FROM inv_bodegas_movimiento_tmp WHERE  doc_tmp_id = $1 AND usuario_id = $2";
            G.db.transaction(sql, [documento_temporal_id, usuario_id], callback);
        });

    });

}
;


// Asignar Auditor Como Responsable del Desapcho
function __asignar_responsable_despacho(empresa_id, prefijo_documento, numero_documento, auditor_id, callback) {

    var sql = " UPDATE inv_bodegas_movimiento SET usuario_id = $4 WHERE empresa_id = $1 AND prefijo = $2 AND numero = $3 ;";

    //console.log("usuario id ", auditor_id, " empresa id ", empresa_id, " prefijo ", prefijo_documento, " numero ", numero_documento , " ");

    G.db.transaction(sql, [empresa_id, prefijo_documento, numero_documento, auditor_id], callback);
}
;

DocuemntoBodegaE008.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocuemntoBodegaE008;