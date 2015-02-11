var MovimientosBodegasModel = function() {

};

// Consultar identificador del movimieto temporal
MovimientosBodegasModel.prototype.obtener_identificicador_movimiento_temporal = function(usuario_id, callback) {

    var sql = "SELECT (COALESCE(MAX(doc_tmp_id),0) + 1) as doc_tmp_id FROM inv_bodegas_movimiento_tmp WHERE usuario_id = $1; ";

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

MovimientosBodegasModel.prototype.modificar_detalle_movimiento_bodega_temporal = function(item_id, valor_unitario, cantidad, lote, fecha_vencimiento, usuario_id, empresa_id,
        centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, iva, callback) {

    var total_costo = valor_unitario * cantidad;
    var total_costo_pedido = valor_unitario;
    var that = this;

    __obtenerItemDocumentoTemporal(item_id, function(err, detalle_documento_temporal) {


        console.log("modificar_detalle_movimiento_bodega_temporal >>>>>>>>>>>>");
        console.log(detalle_documento_temporal);

        if (detalle_documento_temporal.length > 0) {
            var sql = " UPDATE inv_bodegas_movimiento_tmp_d SET  cantidad = $2, lote = $3, fecha_vencimiento = $4, total_costo = $5   \
                       WHERE item_id = $1 RETURNING item_id; ";

            G.db.query(sql, [item_id, cantidad, lote, fecha_vencimiento, total_costo], function(err, rows, result) {

                callback(err, rows);
            });
        } else {
            that.ingresar_detalle_movimiento_bodega_temporal(empresa_id, centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, cantidad, lote, fecha_vencimiento, iva,
                    valor_unitario, total_costo, total_costo_pedido, usuario_id, callback);
        }

    });


};

MovimientosBodegasModel.prototype.gestionar_detalle_movimiento_bodega_temporal = function(empresa_id, centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, cantidad, lote, fecha_vencimiento, iva, valor_unitario, total_costo, total_costo_pedido, usuario_id, callback) {

    __consultar_detalle_movimiento_bodega_temporal(doc_tmp_id, usuario_id, function(err, detalle_documento_temporal) {

        if (detalle_documento_temporal.length > 0) {

        }

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


MovimientosBodegasModel.prototype.borrarJustificacionAuditor = function(usuario_id, doc_tmp_id, codigo_producto, callback) {
    console.log("borrarJustificacionAuditor usuario_id >>>>>>>>>>>>>>>>>> ", usuario_id, " doc_tmp_id ", doc_tmp_id, " codigo producto ", codigo_producto)
    var sql = " UPDATE  inv_bodegas_movimiento_tmp_justificaciones_pendientes SET justificacion_auditor = '' WHERE usuario_id = $1 and doc_tmp_id = $2\
                and codigo_producto = $3 ";

    G.db.query(sql, [usuario_id, doc_tmp_id, codigo_producto], function(err, rows, result) {
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



MovimientosBodegasModel.prototype.consultar_productos_auditados = function(documento_temporal_id, usuario_id, callback) {
    var sql = " select distinct doc_tmp_id, * from (\
        select\
        b.item_id,\
        b.doc_tmp_id,\
        b.codigo_producto,\
        fc_descripcion_producto(b.codigo_producto) as descripcion_producto,\
        b.cantidad :: integer as cantidad_ingresada,\
        to_char(b.fecha_vencimiento, 'dd-mm-yyyy') as fecha_vencimiento,\
        b.lote,\
        b.auditado\
        from inv_bodegas_movimiento_tmp a\
        inner join inv_bodegas_movimiento_tmp_d b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id and b.auditado = '1'\
        where a.doc_tmp_id = $1 and a.usuario_id = $2\
        UNION\
        select\
        0 as item_id,\
        b.doc_tmp_id,\
        b.codigo_producto,\
        fc_descripcion_producto(b.codigo_producto) as descripcion_producto,\
        0 as cantidad_ingresada,\
        null as fecha_vencimiento,\
        '' as lote,\
        '1' as auditado\
        from inv_bodegas_movimiento_tmp a\
        inner join inv_bodegas_movimiento_tmp_justificaciones_pendientes b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
        where a.doc_tmp_id = $1 and a.usuario_id = $2 and b.codigo_producto not in(\
              select aa.codigo_producto from inv_bodegas_movimiento_tmp_d aa where aa.doc_tmp_id = $1 and aa.usuario_id = $2\
        ) and COALESCE(b.justificacion_auditor, '') <> ''\
      ) as a ";


    G.db.query(sql, [documento_temporal_id, usuario_id], function(err, rows, result) {

        callback(err, rows);
    });

};

MovimientosBodegasModel.prototype.consultar_detalle_movimiento_bodega_temporal_por_termino = function(documento_temporal_id, usuario_id, filtro, callback) {
    console.log("consultar_detalle_movimiento_bodega_temporal_por_termino >>>>>>>>>>>>>");


    var sql_aux = "";
    var termino = "%" + filtro.termino_busqueda + "%";

    if (filtro.codigo_barras) {
        console.log(documento_temporal_id, usuario_id, filtro.termino_busqueda);
        termino = filtro.termino_busqueda;
        sql_aux = " where a.auditado = '0' and a.codigo_barras = $3";

    } else if (filtro.descripcion_producto) {
        sql_aux = " where a.auditado = '0' and  a.descripcion_producto ilike $3";

    } else if (filtro.codigo_producto) {
        termino = filtro.termino_busqueda;
        sql_aux = " where  a.codigo_producto = $3";
    }



    var sql = " select * from (\
            select\
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
            b.numero_caja,\
            '1' as tipo_estado_auditoria\
            from inv_bodegas_movimiento_tmp a\
            inner join inv_bodegas_movimiento_tmp_d b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
            inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
            where a.doc_tmp_id = $1 and a.usuario_id = $2\
        ) a\
        ";

    sql += sql_aux;

    G.db.query(sql, [documento_temporal_id, usuario_id, termino], function(err, rows, result) {

        callback(err, rows);
    });
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
                b.empresa_id,\
                b.centro_utilidad,\
                b.bodega,\
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
    console.log(documento_temporal_id, " ", usuario_id, " ", bodegas_doc_id, " >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    var sql = " update inv_bodegas_movimiento_tmp set bodegas_doc_id = $3 where doc_tmp_id = $1  and usuario_id = $2 ";

    G.db.query(sql, [documento_temporal_id, usuario_id, bodegas_doc_id], function(err, rows, result) {
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
                console.log("__consultar_detalle_movimiento_bodega_temporal >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                if (err || detalle_documento_temporal.length === 0) {
                    console.log('Se ha generado un error o el documento está vacío...');
                    callback(err);
                    return;
                } else {
                    // Consultar numeracion del documento    
                    __obtener_numeracion_documento(empresa_id, documento_id, function(err, numeracion, result) {

                        console.log('============= Obtener Numeracion ============= ');
                        console.log(err);
                        console.log(numeracion);
                        console.log(result);
                        console.log('============================================= ');

                        if (err || numeracion.length === 0) {
                            console.log('Se ha generado un error o no se pudo tener la numeracion del documento');
                            callback(err);
                            return;
                        } else {

                            //var prefijo_documento = numeracion.rows[0].prefijo;
                            //var numeracion_documento = numeracion.rows[0].numeracion;
                            //var observacion = documento_temporal.observacion;
                            
                            var prefijo_documento = numeracion[0].prefijo;
                            var numeracion_documento = numeracion[0].numeracion;
                            var observacion = documento_temporal.observacion;

                            console.log("resultado de numetacion ", numeracion.rows, result);

                            // Ingresar Cabecera Documento temporal
                            __ingresar_movimiento_bodega(documento_id, empresa_id, centro_utilidad, bodega, prefijo_documento, numeracion_documento, observacion, usuario_id, function(err, result) {

                                console.log('=============== __ingresar_movimiento_bodega ========================');
                                console.log(err, result);
                                console.log('=====================================================================');

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


MovimientosBodegasModel.prototype.obtenerEncabezadoDocumentoDespacho = function(numero, prefijo, empresa, callback){
    var sql = "select a.*, d.inv_tipo_movimiento as tipo_movimiento , d.descripcion as tipo_clase_documento,\
                c.descripcion, e.pedido_cliente_id as numero_pedido,\
                c.tipo_doc_general_id as tipo_doc_bodega_id,\
                f.nombre as nombre_usuario\
                from  inv_bodegas_movimiento as a\
                inner join inv_bodegas_documentos as b on  a.documento_id = b.documento_id AND a.empresa_id = b.empresa_id AND a.centro_utilidad = b.centro_utilidad AND a.bodega = b.bodega\
                inner join documentos as c on  c.documento_id = a.documento_id AND c.empresa_id = a.empresa_id\
                inner join tipos_doc_generales as d on  d.tipo_doc_general_id = c.tipo_doc_general_id\
                inner join inv_bodegas_movimiento_despachos_clientes as e on  e.empresa_id = a.empresa_id AND e.prefijo = a.prefijo AND e.numero = a.numero\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                where a.empresa_id = $3\
                and a.prefijo = $2\
                and a.numero = $1\
                union\
                select a.*, d.inv_tipo_movimiento as tipo_movimiento , d.descripcion as tipo_clase_documento,\
                c.descripcion, e.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                c.tipo_doc_general_id as tipo_doc_bodega_id,\
                f.nombre as nombre_usuario\
                from  inv_bodegas_movimiento as a\
                inner join inv_bodegas_documentos as b on  a.documento_id = b.documento_id AND a.empresa_id = b.empresa_id AND a.centro_utilidad = b.centro_utilidad AND a.bodega = b.bodega\
                inner join documentos as c on  c.documento_id = a.documento_id AND c.empresa_id = a.empresa_id\
                inner join tipos_doc_generales as d on  d.tipo_doc_general_id = c.tipo_doc_general_id\
                inner join inv_bodegas_movimiento_despachos_farmacias as e on  e.empresa_id = a.empresa_id AND e.prefijo = a.prefijo AND e.numero = a.numero\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                where a.empresa_id = $3\
                and a.prefijo = $2\
                and a.numero = $1";
    
    G.db.query(sql, [numero, prefijo, empresa], function(err, rows, result) {
        callback(err, rows);

    });
    
};


MovimientosBodegasModel.prototype.obtenerDetalleDocumentoDespacho = function(numero, prefijo, empresa, callback){
    var sql = "SELECT\
                a.*,\
                b.descripcion,\
                b.unidad_id,\
                b.contenido_unidad_venta,\
                c.descripcion as descripcion_unidad,\
                b.codigo_invima,\
                b.codigo_cum,\
                fc_descripcion_producto(b.codigo_producto) as nombre,\
                (a.valor_unitario*(a.porcentaje_gravamen/100)) as iva,\
                (a.valor_unitario+(a.valor_unitario*(a.porcentaje_gravamen/100))) as valor_unitario_iva,\
                ((a.cantidad)*(a.valor_unitario+(a.valor_unitario*(a.porcentaje_gravamen/100)))) as valor_total_iva,\
                (((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad) as valor_unit_1,\
                ((a.total_costo/a.cantidad)-(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad)) as iva_1,\
                ((((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad)*a.cantidad) as valor_total_1,\
                (((a.total_costo/a.cantidad)-(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad))*a.cantidad) as iva_total_1\
                FROM\
                inv_bodegas_movimiento_d as a,\
                inventarios_productos as b,\
                unidades as c\
                WHERE\
                a.empresa_id = $3\
                AND a.prefijo = $2\
                AND a.numero = $1\
                AND b.codigo_producto = a.codigo_producto\
                AND c.unidad_id = b.unidad_id\
                ORDER BY a.codigo_producto";
    
    G.db.query(sql, [numero, prefijo, empresa], function(err, rows, result) {
        callback(err, rows);
    });
};


/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

// Consultar numeracion del documento
function __obtener_numeracion_documento(empresa_id, documento_id, callback) {

//    var sql = " LOCK TABLE documentos IN ROW EXCLUSIVE MODE;";
//
//    G.db.transaction(sql, [], function(err, rows, result) {
//
//        sql = " SELECT prefijo, numeracion FROM documentos WHERE  empresa_id = $1 AND documento_id = $2 ;  ";
//
//        G.db.transaction(sql, [empresa_id, documento_id], function(err, rows, result) {
//
//            console.log('============= Obtener Numeracio ============= ');
//            console.log(err, rows, result);
//            console.log('============================================= ');
//
//            sql = " UPDATE documentos SET numeracion = numeracion + 1 WHERE empresa_id = $1 AND  documento_id = $2 ; ";
//
//            G.db.transaction(sql, [empresa_id, documento_id], function(_err, _rows, _result) {
//
//                callback(err, rows, result);
//            });
//        });
//    });

    var sql = " SELECT prefijo, numeracion FROM documentos WHERE  empresa_id = $1 AND documento_id = $2 ;  ";

    G.db.query(sql, [empresa_id, documento_id], function(err, rows, result) {

        sql = " UPDATE documentos SET numeracion = numeracion + 1 WHERE empresa_id = $1 AND  documento_id = $2 ; ";

        G.db.query(sql, [empresa_id, documento_id], function(_err, _rows, _result) {

            callback(err, rows, result);
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
                b.numero_caja, \
                c.porc_iva as porcentaje_gravament\
                from inv_bodegas_movimiento_tmp a \
                inner join inv_bodegas_movimiento_tmp_d b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                where a.doc_tmp_id = $1 and a.usuario_id = $2 ";

    G.db.query(sql, [documento_temporal_id, usuario_id], function(err, rows, result) {

        callback(err, rows);
    });
}
;


function __obtenerItemDocumentoTemporal(item_id, callback) {
    var sql = " select *\
                from inv_bodegas_movimiento_tmp_d a \
                where a.item_id = $1";

    G.db.query(sql, [item_id], function(err, rows, result) {

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