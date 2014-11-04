var MovimientosBodegasModel = function() {

};

// Consultar identificador del movimieto temporal
MovimientosBodegasModel.prototype.obtener_identificicador_movimiento_temporal = function(usuario_id, callback) {

    var sql = "SELECT (COALESCE(MAX(doc_tmp_id),0) + 1) as doc_tmp_id FROM inv_bodegas_movimiento_tmp WHERE usuario_id = $1; "

    G.db.query(sql, [usuario_id], function(err, rows, result) {
        var movimiento_temporal_id = rows[0].doc_tmp_id;
        callback(err, movimiento_temporal_id);
    });
};

// Inserta registros (cabecera) en la tabla principal (temporal) de los movimientos de bodega
MovimientosBodegasModel.prototype.ingresar_movimiento_bodega_temporal = function(movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion, callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento_tmp (doc_tmp_id, usuario_id, bodegas_doc_id, observacion, fecha_registro) \
                VALUES ( $1, $2, $3, $4, now())";


    G.db.transaction(sql, [movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion], function(err, rows) {
        callback(err, rows);
    });
};

// Inserta registros (detalle) en la tabla principal (temporal) de los detalles de movimientos de bodega
MovimientosBodegasModel.prototype.ingresar_detalle_movimiento_bodega_temporal =
        function(empresa_id, centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, cantidad, lote, fecha_vencimiento, iva, valor_unitario, total_costo, total_costo_pedido, usuario_id, callback) {


            var sql = " INSERT INTO inv_bodegas_movimiento_tmp_d (doc_tmp_id, empresa_id, centro_utilidad, bodega, codigo_producto, cantidad, \
                        porcentaje_gravamen, total_costo, fecha_vencimiento, lote, local_prod, total_costo_pedido, valor_unitario, usuario_id) \
                        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING item_id; ";


            G.db.query(sql, [doc_tmp_id, empresa_id, centro_utilidad_id, bodega_id, codigo_producto, cantidad, iva, total_costo, fecha_vencimiento, lote, '', total_costo_pedido, valor_unitario, usuario_id], function(err, rows, result) {

                callback(err, rows);
            });
        };

MovimientosBodegasModel.prototype.modificar_detalle_movimiento_bodega_temporal = function(item_id, valor_unitario, cantidad, lote, fecha_vencimiento, callback){
    
    var total_costo = valor_unitario * cantidad;
    
    var sql = " UPDATE inv_bodegas_movimiento_tmp_d SET  cantidad = $2, lote = $3, fecha_vencimiento = $4, total_costo = $5   \
                       WHERE item_id = $1 RETURNING item_id; ";
    
     G.db.query(sql, [item_id, cantidad, lote, fecha_vencimiento, total_costo], function(err, rows, result) {

         callback(err, rows);
     });
};

// Eliminar Todo el Documento Temporal 
MovimientosBodegasModel.prototype.eliminar_movimiento_bodega_temporal = function(documento_temporal_id, usuario_id, callback) {

    __eliminar_movimiento_bodega_temporal(documento_temporal_id, usuario_id, callback);
};

// Eliminar Todo el  Detalle del Documento Temporal 
MovimientosBodegasModel.prototype.eliminar_detalle_movimiento_bodega_temporal = function(doc_tmp_id, usuario_id, callback) {

    var sql = " DELETE FROM inv_bodegas_movimiento_tmp_d WHERE doc_tmp_id = $1 AND usuario_id = $2 ; ";

    G.db.transaction(sql, [doc_tmp_id, usuario_id], function(err, rows) {
        callback(err, rows);
    });

};

// Eliminar Producto del Documento Temporal
MovimientosBodegasModel.prototype.eliminar_producto_movimiento_bodega_temporal = function(item_id, callback) {

    var sql = " DELETE FROM inv_bodegas_movimiento_tmp_d WHERE item_id = $1 ; ";

    G.db.query(sql, [item_id], function(err, rows, result) {
        callback(err, rows);
    });

};

// Auditar Producto del Documento Temporal 0 = false ; 1 = true
MovimientosBodegasModel.prototype.auditar_producto_movimiento_bodega_temporal = function(item_id, auditado, numero_caja, callback) {

    var sql = " UPDATE  inv_bodegas_movimiento_tmp_d SET auditado = $2, numero_caja = $3 WHERE item_id = $1  ; ";

    G.db.query(sql, [item_id, auditado ? 1 : 0, numero_caja], function(err, rows, result) {
        callback(err, rows, result);
    });
};

// Consultar documento temporal
MovimientosBodegasModel.prototype.consultar_documento_bodega_temporal = function(documento_temporal_id, usuario_id, callback) {

    __consultar_documento_bodega_temporal(documento_temporal_id, usuario_id, callback);
};


// Consultar detalle movimiento temporal 
MovimientosBodegasModel.prototype.consultar_detalle_movimiento_bodega_temporal = function(documento_temporal_id, usuario_id, callback) {

    __consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, callback);

};

// Consultar documentos asigandos al usuario 
MovimientosBodegasModel.prototype.consultar_documentos_usuario = function(usuario_id, centro_utilidad_id, bodega_id, tipo_documento, callback) {

    var sql_aux = " ";

    if (tipo_documento !== '') {
        sql_aux = " AND c.tipo_doc_general_id = '" + tipo_documento + "' ";
    }

    var sql = " select \
                d.inv_tipo_movimiento as tipo_movimiento,\
                b.bodegas_doc_id,\
                c.tipo_doc_general_id as tipo_doc_bodega_id,\
                d.descripcion as tipo_clase_documento, \
                c.prefijo,\
                c.descripcion\
                from inv_bodegas_userpermisos a\
                inner join inv_bodegas_documentos b on a.documento_id = b.documento_id\
                inner join documentos c on b.documento_id = c.documento_id and b.empresa_id = c.empresa_id\
                inner join tipos_doc_generales d on c.tipo_doc_general_id = d.tipo_doc_general_id\
                where a.usuario_id = $1 and a.centro_utilidad = $2 and a.bodega= $3 " + sql_aux;

    G.db.query(sql, [usuario_id, centro_utilidad_id, bodega_id], function(err, rows, result) {

        callback(err, rows);
    });
};

// Actualizar bodegas_doc_id en documento temporal.
MovimientosBodegasModel.prototype.actualizar_tipo_documento_temporal = function(documento_temporal_id, usuario_id, bodegas_doc_id, callback) {

    var sql = " update inv_bodegas_movimiento_tmp set bodegas_doc_id = $3 where doc_tmp_id = $1  and usuario_id = $2 ";

    G.db.query(sql, [documento_temporal_id, usuario_id, bodegas_doc_id, ], function(err, rows, result) {
        callback(err, rows, result);
    });
};

// Crear documento 
MovimientosBodegasModel.prototype.crear_documento = function(documento_temporal_id, usuario_id, callback) {

    // Consultar cabecera del docuemnto temporal
    __consultar_documento_bodega_temporal(documento_temporal_id, usuario_id, function(err, documento_temporal) {

        if (err || documento_temporal === null) {
            console.log('Se ha generado un error o el docuemnto está vacío.');
            callback(err);
            return;
        } else {

            var documento_id = documento_temporal.documento_id;

            var empresa_id = documento_temporal.empresa_id;
            var centro_utilidad = documento_temporal.centro_utilidad;
            var bodega = documento_temporal.bodega;

            // Consultar detalle del docuemnto temporal
            __consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function(err, detalle_documento_temporal) {

                if (err || detalle_documento_temporal.length === 0) {
                    console.log('Se ha generado un error o el documento está vacío...');
                    callback(err);
                    return;
                } else {
                    // Consultar numeracion del documento    
                    __obtener_numeracion_documento(empresa_id, documento_id, function(err, numeracion) {

                        if (err || numeracion.length === 0) {
                            console.log('Se ha generado un error o no se pudo tener la numeracion del documento');
                            callback(err);
                            return;
                        } else {

                            var prefijo_documento = numeracion[0].prefijo;
                            var numeracion_documento = numeracion[0].numeracion;
                            var observacion = documento_temporal.observacion;

                            // Ingresar Cabecera Documento temporal
                            __ingresar_movimiento_bodega(documento_id, empresa_id, centro_utilidad, bodega, prefijo_documento, numeracion_documento, observacion, usuario_id, function(err, result) {

                                // Ingresar Detalle Documento temporal
                                __ingresar_detalle_movimiento_bodega(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numeracion_documento, function(err, result) {
                                    
                                    callback(err, empresa_id, prefijo_documento, numeracion_documento);
                                    
                                    // Eliminar Documento temporal
                                    /*__eliminar_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function() {

                                        callback(err, empresa_id, prefijo_documento, numeracion_documento);
                                    });*/
                                });
                            });
                        }
                    });
                }
            });
        }
    });
};

/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

// Consultar numeracion del documento
function __obtener_numeracion_documento(empresa_id, documento_id, callback) {

    var sql = " LOCK TABLE documentos IN ROW EXCLUSIVE MODE;"

    G.db.query(sql, [], function(err, rows, result) {

        sql = " SELECT prefijo, numeracion FROM documentos WHERE  empresa_id = $1 AND documento_id = $2 ;  ";

        G.db.query(sql, [empresa_id, documento_id], function(err, rows, result) {

            sql = " UPDATE documentos SET numeracion = numeracion + 1 WHERE empresa_id = $1 AND  documento_id = $2 ; ";

            G.db.query(sql, [empresa_id, documento_id], function(_err, _rows, _result) {

                callback(err, rows, result);
            });
        });
    });
}
;

// Ingresar cabecera docuemento movimiento
function __ingresar_movimiento_bodega(documento_id, empresa_id, centro_utilidad, bodega, prefijo, numero, observacion, usuario_id, callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento (documento_id, empresa_id, centro_utilidad, bodega, prefijo, numero, observacion, sw_estado, usuario_id, fecha_registro, abreviatura ) \
                VALUES ( $1, $2, $3, $4, $5, $6, $7, '1', $8, NOW(), NULL) ;  ";

    G.db.transaction(sql, [documento_id, empresa_id, centro_utilidad, bodega, prefijo, numero, observacion, usuario_id], callback);
}
;

// Ingresar detalle docuemento movimiento
function __ingresar_detalle_movimiento_bodega(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numeracion_documento, callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento_d ( \
                    empresa_id, \
                    prefijo, \
                    numero, \
                    centro_utilidad, \
                    bodega, codigo_producto, \
                    cantidad, \
                    porcentaje_gravamen, \
                    total_costo, \
                    fecha_vencimiento, \
                    lote, \
                    observacion_cambio, \
                    total_costo_pedido, \
                    valor_unitario, \
                    cantidad_sistema \
                )\
                    SELECT  \
                    $3 AS empresa_id, \
                    $4 AS prefijo, \
                    $5 AS numeracion, \
                    a.centro_utilidad, \
                    a.bodega, \
                    a.codigo_producto, \
                    a.cantidad, \
                    a.porcentaje_gravamen,\
                    a.total_costo,\
                    a.fecha_vencimiento, \
                    a.lote, \
                    a.observacion_cambio,\
                    a.total_costo_pedido, \
                    (a.total_costo/a.cantidad) as valor_unitario, \
                    COALESCE(a.cantidad_sistema,0) AS cantidad_sistema \
                    FROM inv_bodegas_movimiento_tmp_d a\
                    inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                    inner join unidades c on b.unidad_id = c.unidad_id \
                    WHERE a.doc_tmp_id = $1  AND a.usuario_id = $2; ";

    G.db.transaction(sql, [documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numeracion_documento], callback);
}
;


// Consultar documento temporal
function __consultar_documento_bodega_temporal(documento_temporal_id, usuario_id, callback) {

    var sql = " SELECT\
                t.*,\
                c.inv_tipo_movimiento as tipo_movimiento,\
                b.tipo_doc_general_id as tipo_doc_bodega_id,\
                c.descripcion as tipo_clase_documento,\
                b.prefijo,\
                b.descripcion,\
                a.documento_id,\
                a.empresa_id,\
                a.centro_utilidad,\
                a.bodega\
                FROM inv_bodegas_movimiento_tmp t\
                INNER JOIN inv_bodegas_documentos a ON t.bodegas_doc_id = a.bodegas_doc_id\
                INNER JOIN documentos b ON a.empresa_id = b.empresa_id AND a.documento_id = b.documento_id\
                INNER JOIN tipos_doc_generales c ON b.tipo_doc_general_id = c.tipo_doc_general_id\
                WHERE doc_tmp_id = $1 AND usuario_id = $2;";

    G.db.query(sql, [documento_temporal_id, usuario_id], function(err, rows, result) {
        callback(err, rows.length > 0 ? rows[0] : null);
    });
}
;

// Consultar detalle movimiento temporal 
function __consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, callback) {


    var sql = " select\
                b.item_id,\
                b.doc_tmp_id,\
                b.empresa_id,\
                b.centro_utilidad as centro_utilidad_id,\
                b.bodega as bodega_id,\
                b.codigo_producto,\
                fc_descripcion_producto(b.codigo_producto) as descripcion_producto,\
                b.cantidad :: integer as cantidad_ingresada,\
                b.porcentaje_gravamen,\
                b.total_costo,\
                to_char(b.fecha_vencimiento, 'dd-mm-yyyy') as fecha_vencimiento,\
                b.lote,\
                b.local_prod,\
                b.observacion_cambio,\
                b.valor_unitario,\
                b.total_costo_pedido,\
                b.sw_ingresonc,\
                b.item_id_compras,\
                b.prefijo_temp,\
                b.lote_devuelto,\
                b.cantidad_sistema,\
                b.auditado,\
                c.codigo_barras,\
                b.numero_caja \
                from inv_bodegas_movimiento_tmp a \
                inner join inv_bodegas_movimiento_tmp_d b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                where a.doc_tmp_id = $1 and a.usuario_id = $2 ";

    G.db.query(sql, [documento_temporal_id, usuario_id], function(err, rows, result) {

        callback(err, rows);
    });
}
;

// Eliminar Todo el Documento Temporal 
function __eliminar_movimiento_bodega_temporal(documento_temporal_id, usuario_id, callback) {

    var sql = " DELETE FROM inv_bodegas_movimiento_tmp WHERE doc_tmp_id = $1 AND usuario_id = $2 ; ";

    G.db.transaction(sql, [documento_temporal_id, usuario_id], function(err, rows) {
        callback(err, rows);
    });

}
;

module.exports = MovimientosBodegasModel;