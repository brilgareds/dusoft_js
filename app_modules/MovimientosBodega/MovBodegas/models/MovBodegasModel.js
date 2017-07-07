var MovimientosBodegasModel = function() {

};

// Consultar identificador del movimieto temporal
MovimientosBodegasModel.prototype.obtener_identificicador_movimiento_temporal = function(usuario_id, callback) {

   var sql = "SELECT (COALESCE(MAX(doc_tmp_id),0) + 1) as doc_tmp_id FROM inv_bodegas_movimiento_tmp; ";

   G.knex.raw(sql, {1 : usuario_id}).
   then(function(resultado){
       var movimiento_temporal_id = resultado.rows[0].doc_tmp_id;
       callback(false, movimiento_temporal_id);
   }).catch(function(err){
       callback(err);
   });
};

// Inserta registros (cabecera) en la tabla principal (temporal) de los movimientos de bodega
MovimientosBodegasModel.prototype.ingresar_movimiento_bodega_temporal = function(movimiento_temporal_id, usuario_id, bodegas_doc_id, observacion, transaccion, callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento_tmp (doc_tmp_id, usuario_id, bodegas_doc_id, observacion, fecha_registro) \
                VALUES ( :1, :2, :3, :4, now())";
    
    var query = G.knex.raw(sql, {1:movimiento_temporal_id, 2:usuario_id, 3:bodegas_doc_id, 4:observacion});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });
    
};

// Inserta registros (detalle) en la tabla principal (temporal) de los detalles de movimientos de bodega
MovimientosBodegasModel.prototype.ingresar_detalle_movimiento_bodega_temporal =
        function(empresa_id, centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, cantidad, lote, fecha_vencimiento, iva, valor_unitario, total_costo, total_costo_pedido, usuario_id, callback) {


  var sql = " INSERT INTO inv_bodegas_movimiento_tmp_d (doc_tmp_id, empresa_id, centro_utilidad, bodega, codigo_producto, cantidad, \
                porcentaje_gravamen, total_costo, fecha_vencimiento, lote, local_prod, total_costo_pedido, valor_unitario, usuario_id) \
                VALUES ( :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14) RETURNING item_id; ";

   G.knex.raw(sql, {1:doc_tmp_id, 2:empresa_id, 3:centro_utilidad_id, 4:bodega_id, 5:codigo_producto, 6:cantidad, 7:iva, 8:total_costo, 9:fecha_vencimiento, 10:lote, 11:'', 12:total_costo_pedido, 13:valor_unitario, 14:usuario_id}).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
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
            var sql = " UPDATE inv_bodegas_movimiento_tmp_d SET  cantidad = :2, lote = :3, fecha_vencimiento = :4, total_costo = :5   \
                       WHERE item_id = :1 RETURNING item_id; ";

            G.knex.raw(sql, {1:item_id, 2:cantidad, 3:lote, 4:fecha_vencimiento, 5:total_costo}).then(function(resultado){
               callback(false, resultado.rows, resultado);
            }).catch(function(err){
               callback(err);
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
MovimientosBodegasModel.prototype.eliminar_movimiento_bodega_temporal = function(documento_temporal_id, usuario_id, transaccion, callback) {
    __eliminar_movimiento_bodega_temporal(documento_temporal_id, usuario_id, transaccion, callback);
};

// Eliminar Todo el  Detalle del Documento Temporal 
MovimientosBodegasModel.prototype.eliminar_detalle_movimiento_bodega_temporal = function(doc_tmp_id, usuario_id, transaccion, callback) {

    var sql = " DELETE FROM inv_bodegas_movimiento_tmp_d WHERE doc_tmp_id = :1 AND usuario_id = :2 ; ";
    
    var query = G.knex.raw(sql, {1:doc_tmp_id, 2:usuario_id});
    
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });

};

// Eliminar Producto del Documento Temporal
MovimientosBodegasModel.prototype.eliminar_producto_movimiento_bodega_temporal = function(parametros, callback) {
    console.log(parametros)
    G.knex("inv_bodegas_movimiento_tmp_d").
    where('item_id', parametros.item_id || parametros).
    del().
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    }); 

};

// 
MovimientosBodegasModel.prototype.eliminar_compras_ordenes_pedidos_productosfoc = function(parametros, callback) {

    G.knex("compras_ordenes_pedidos_productosfoc").
    where('item_id', parametros.item_id).
    del().
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    }); 

};

// Auditar Producto del Documento Temporal 0 = false ; 1 = true
MovimientosBodegasModel.prototype.auditar_producto_movimiento_bodega_temporal = function(item_id, auditado, numero_caja, callback) {

    var sql = " UPDATE  inv_bodegas_movimiento_tmp_d SET auditado = :2, numero_caja = :3 WHERE item_id = :1  ; ";
   
    auditado = auditado ? 1 : 0;
    
    G.knex.raw(sql, {1:item_id, 2:auditado, 3: numero_caja}).
    then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });
};


MovimientosBodegasModel.prototype.borrarJustificacionAuditor = function(usuario_id, doc_tmp_id, codigo_producto, callback) {
    console.log("borrarJustificacionAuditor usuario_id >>>>>>>>>>>>>>>>>> ", usuario_id, " doc_tmp_id ", doc_tmp_id, " codigo producto ", codigo_producto)
    var sql = " UPDATE  inv_bodegas_movimiento_tmp_justificaciones_pendientes SET justificacion_auditor = '' WHERE usuario_id = :1 and doc_tmp_id = :2\
                and codigo_producto = :3 ";

    G.knex.raw(sql, {1:usuario_id, 2:doc_tmp_id, 3:codigo_producto}).
    then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
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
        b.auditado,\
        b.empresa_id,\
        b.centro_utilidad,\
        c.existencia_actual,\
        d.existencia as existencia_bodega\
        from inv_bodegas_movimiento_tmp a\
        inner join inv_bodegas_movimiento_tmp_d b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id and b.auditado = '1'\
        left join existencias_bodegas_lote_fv c on c.empresa_id = b.empresa_id and c.centro_utilidad = b.centro_utilidad\
        and c.codigo_producto = b.codigo_producto and c.lote = b.lote and c.fecha_vencimiento = b.fecha_vencimiento and c.bodega = b.bodega\
        left join existencias_bodegas d on d.empresa_id = b.empresa_id and d.centro_utilidad = b.centro_utilidad and d.codigo_producto = b.codigo_producto and b.bodega = d.bodega\
        where a.doc_tmp_id = :1 and a.usuario_id = :2\
        UNION\
        select\
        0 as item_id,\
        b.doc_tmp_id,\
        b.codigo_producto,\
        fc_descripcion_producto(b.codigo_producto) as descripcion_producto,\
        0 as cantidad_ingresada,\
        null as fecha_vencimiento,\
        '' as lote,\
        '1' as auditado,\
        '' as empresa_id,\
        '' as centro_utilidad,\
        0 as existencia_actual,\
        0 as existencia_bodega\
        from inv_bodegas_movimiento_tmp a\
        inner join inv_bodegas_movimiento_tmp_justificaciones_pendientes b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
        where a.doc_tmp_id = :1 and a.usuario_id = :2 and b.codigo_producto not in(\
              select aa.codigo_producto from inv_bodegas_movimiento_tmp_d aa where aa.doc_tmp_id = :1 and aa.usuario_id = :2\
        ) and COALESCE(b.justificacion_auditor, '') <> ''\
      ) as a ";
    
    G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id}).
    then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        console.log("error generado ", err);
        callback(err);
    });
    
};

MovimientosBodegasModel.prototype.consultar_detalle_movimiento_bodega_temporal_por_termino = function(documento_temporal_id, usuario_id, filtro, callback) {
    console.log("consultar_detalle_movimiento_bodega_temporal_por_termino >>>>>>>>>>>>>");


    var sql_aux = "";
    var termino = "%" + filtro.termino_busqueda + "%";

    if (filtro.codigo_barras) {
        console.log(documento_temporal_id, usuario_id, filtro.termino_busqueda);
        termino = filtro.termino_busqueda;
        sql_aux = " where a.auditado = '0' and a.codigo_barras = :3";

    } else if (filtro.descripcion_producto) {
        sql_aux = " where a.auditado = '0' and  a.descripcion_producto ilike :3";

    } else if (filtro.codigo_producto) {
        termino = filtro.termino_busqueda;
        sql_aux = " where  a.codigo_producto = :3";
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
                    b.tipo_caja,\
                    '1' as tipo_estado_auditoria\
                    from inv_bodegas_movimiento_tmp a\
                    inner join inv_bodegas_movimiento_tmp_d b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                    inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                    where a.doc_tmp_id = :1 and a.usuario_id = :2\
                ) a\
        ";

    sql += sql_aux;

    
    G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id, 3:termino}).
    then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
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
                inner join inv_bodegas_documentos b on a.documento_id = b.documento_id and b.empresa_id = a.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega\
                inner join documentos c on b.documento_id = c.documento_id and b.empresa_id = c.empresa_id\
                inner join tipos_doc_generales d on c.tipo_doc_general_id = d.tipo_doc_general_id\
                where a.usuario_id = :1 and a.centro_utilidad = :2 and a.bodega= :3 " + sql_aux + " order by tipo_movimiento, tipo_doc_bodega_id ";
        
   G.knex.raw(sql, {1:usuario_id, 2:centro_utilidad_id, 3:bodega_id}).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};

// Actualizar bodegas_doc_id en documento temporal.
MovimientosBodegasModel.prototype.actualizar_tipo_documento_temporal = function(documento_temporal_id, usuario_id, bodegas_doc_id, callback) {
    console.log(documento_temporal_id, " ", usuario_id, " ", bodegas_doc_id, " >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    var sql = " update inv_bodegas_movimiento_tmp set bodegas_doc_id = :3 where doc_tmp_id = :1  and usuario_id = :2 ";
    
    G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id, 3:bodegas_doc_id}).
    then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });
};

// Crear documento 
MovimientosBodegasModel.prototype.crear_documento = function(documento_temporal_id, usuario_id, transaccion, callback) {

    // Consultar cabecera del docuemnto temporal
    __consultar_documento_bodega_temporal(documento_temporal_id, usuario_id, function(err, documento_temporal) {

        if (err || documento_temporal === null) {
            console.log('Se ha generado un error o el docuemnto está vacío.');
            callback(err);
            return;
        } else {
            console.log("documento temporal>>>>>>>>>>>>>>>>>>>>>>>> ", documento_temporal, documento_temporal.documento_id);
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
                        //console.log(numeracion);
                       // console.log(result);
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
                            __ingresar_movimiento_bodega(documento_id, empresa_id, centro_utilidad, bodega, prefijo_documento, numeracion_documento, observacion, usuario_id, transaccion, function(err, result) {

                                console.log('=============== __ingresar_movimiento_bodega ========================');
                                console.log(err, result);
                                console.log('=====================================================================');
                                
                                if(err){
                                    callback(err);
                                    return;
                                }

                                // Ingresar Detalle Documento temporal
                                __ingresar_detalle_movimiento_bodega(documento_temporal_id, usuario_id, empresa_id, prefijo_documento,
                                                                     numeracion_documento,transaccion, function(err, result) {
                                                                         
                                    if(err){
                                        callback(err);
                                        return;
                                    }
                                    callback(err, {empresa_id:empresa_id, prefijo_documento:prefijo_documento, numeracion_documento:numeracion_documento});

                                });
                            });
                        }
                    });
                }
            });
        }
    });
};

MovimientosBodegasModel.prototype.consultar_detalle_documento_despacho = function(numero, prefijo, empresa, callback){
    var sql = "SELECT\
               a.codigo_producto,\
               a.lote,\
               a.cantidad::integer,\
               to_char(a.fecha_vencimiento, 'dd-mm-yyyy') as fecha_vencimiento,\
                b.descripcion,\
                b.unidad_id,\
                b.contenido_unidad_venta,\
                c.descripcion as descripcion_unidad,\
                b.codigo_invima,\
                b.codigo_cum,\
                fc_descripcion_producto(b.codigo_producto) as nombre,\
                a.porcentaje_gravamen,\
                a.total_costo,\
                (a.valor_unitario*(a.porcentaje_gravamen/100)) as iva,\
                (a.valor_unitario+(a.valor_unitario*(a.porcentaje_gravamen/100))) as valor_unitario_iva,\
                ((a.cantidad)*(a.valor_unitario+(a.valor_unitario*(a.porcentaje_gravamen/100)))) as valor_total_iva,\
                (((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad) as valor_unit_1,\
                ((a.total_costo/a.cantidad)-(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad)) as iva_1,\
                ((((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad)*a.cantidad) as valor_total_1,\
                (((a.total_costo/a.cantidad)-(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad))*a.cantidad) as iva_total_1,\
                a.valor_unitario\
                FROM\
                inv_bodegas_movimiento_d as a,\
                inventarios_productos as b,\
                unidades as c\
                WHERE\
                a.empresa_id = :3\
                AND a.prefijo = :2\
                AND a.numero = :1\
                AND b.codigo_producto = a.codigo_producto\
                AND c.unidad_id = b.unidad_id\
                ORDER BY a.codigo_producto";
    
    G.knex.raw(sql, {1:numero, 2:prefijo, 3:empresa}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};


MovimientosBodegasModel.prototype.consultar_datos_adicionales_documento = function(numero, prefijo,empresa_id, tipo_documento, callback){
    
    var sql = "";
    
    switch(tipo_documento){
        case 'E008':
            sql = "select * From\
                    (\
                        (\
                        SELECT  'CLIENTES'  as tipo_de_despacho,\
                            a.tipo_id_tercero || ' ' || a.tercero_id || ' : '|| b.nombre_tercero as cliente\
                            /*a.pedido_cliente_id AS numero_pedido,*/\
                            /*b.direccion AS direccion*/\
                            /*b.telefono AS telefono*/\
                            FROM    inv_bodegas_movimiento_despachos_clientes as a,\
                            terceros as b\
                            WHERE   a.empresa_id = :3\
                            AND a.prefijo = :2\
                            AND a.numero = :1\
                            AND b.tipo_id_tercero = a.tipo_id_tercero\
                            AND b.tercero_id = a.tercero_id\
                        )\
                        UNION ALL\
                        (\
                            SELECT  'FARMACIAS'  as tipo_de_despacho,\
                            e.empresa_id || ' - '|| e.razon_social ||' ::: '||c.descripcion as farmacia\
                            /*a.solicitud_prod_a_bod_ppal_id AS numero_pedido,*/\
                            /*e.direccion AS direccion*/\
                           /*e.telefonos AS telefono*/\
                            FROM    inv_bodegas_movimiento_despachos_farmacias as a\
                            JOIN solicitud_productos_a_bodega_principal as b ON (a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id)\
                            JOIN bodegas as c ON (b.farmacia_id = c.empresa_id)\
                            AND (b.centro_utilidad = c.centro_utilidad)\
                            AND (b.bodega = c.bodega)\
                            JOIN centros_utilidad as d ON (c.centro_utilidad = d.centro_utilidad)\
                            AND (c.empresa_id = d.empresa_id)\
                            JOIN empresas as e ON (d.empresa_id = e.empresa_id)\
                            WHERE   a.empresa_id = :3\
                            AND a.prefijo = :2\
                            AND a.numero = :1\
                        )\
                    )as x";        
        break;
    }
    
    G.knex.raw(sql, {1:numero, 2:prefijo, 3:empresa_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });

};

MovimientosBodegasModel.prototype.darFormatoTituloAdicionesDocumento = function(adicionales){
    var obj = {};
    
    for(var i in adicionales){
    	var name = i.toUpperCase().replace(/_/g," ");
    	obj[i] = {valor : adicionales[i], titulo: name};  
    }
    
    return obj;
};

MovimientosBodegasModel.prototype.isExistenciaBodega = function(parametros, callback){
    
    var columna = [
                   "c.empresa_id",
                   "c.centro_utilidad",
                   "c.bodega",
                   "c.codigo_producto"
                  ];
         
            var query  = G.knex.select(columna)
                        .from("inv_bodegas_movimiento_tmp as a")
                        .innerJoin("inv_bodegas_documentos as b",
                        function() {
                            this.on("a.bodegas_doc_id", "b.bodegas_doc_id")
                        })
                        .innerJoin("existencias_bodegas as c",
                        function() {
                            this.on("c.empresa_id", "b.empresa_id")
                                .on("c.centro_utilidad", "b.centro_utilidad")
                                .on("c.bodega", "b.bodega")
                        })
                        .where('a.usuario_id', parametros.usuarioId)
                        .andWhere('a.doc_tmp_id', parametros.docTmpId)
                        .andWhere('c.codigo_producto', parametros.codProucto);

                query.then(function(resultado) {
                    callback(false, resultado);
                }). catch (function(error) {
                    console.log("error [isExistenciaBodega]:::::: ", error,parametros);
                    callback(error);
                });
};
    
MovimientosBodegasModel.prototype.isBodegaDestino = function(parametros, callback){
    
    var columna = [
        "a.bodega_destino"
    ];

    var query = G.knex.select(columna)
                .from("inv_bodegas_movimiento_tmp_traslados as a")
                .where('a.usuario_id', parametros.usuarioId)
                .andWhere('a.doc_tmp_id', parametros.docTmpId);

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [isBodegaDestino]: ", error);
        console.log("error [isBodegaDestino]: ", parametros);
        callback(error);
    });
};

MovimientosBodegasModel.prototype.isTrasladosTmp = function(parametros, callback){

    var sql=" SELECT a.descripcion as dBodega, \
                     b.descripcion as dProducto \
              FROM   bodegas as a, \
                     inventarios_productos b \
              WHERE  a.bodega = :1 \
                     AND b.codigo_producto = :2 ";
     G.knex.raw(sql, {1:parametros.bodega, 2:parametros.codProucto}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(error){
       console.log("error [isTrasladosTmp]: ", error);
       callback(error);
    });
};

MovimientosBodegasModel.prototype.isExistenciaEnBodega = function(parametros, callback){
    
    var columna = [
                   "a.codigo_producto"
                  ];

       var subQuery = G.knex.select(columna)
               .from("existencias_bodegas as a")
               .as("a");

       var query = G.knex(G.knex.raw("a.*")).from(subQuery)
                   .where('a.codigo_producto', parametros.codProucto)
                   .andWhere('a.bodega', parametros.bodegaDestino);

       query.then(function(resultado) {
           callback(false, resultado);
       }). catch (function(error) {
           console.log("error [isExistenciaEnBodega]: ", error);
           callback(error);
       });
};

MovimientosBodegasModel.prototype.isExistenciaEnBodegaDestino = function(parametros, callback){
  
       G.knex.select('*').from("existencias_bodegas as a")
        .where('a.codigo_producto', parametros.codigoProducto)
        .andWhere('a.empresa_id', parametros.empresaId)
        .andWhere('a.centro_utilidad', parametros.centroUtilidad)
        .andWhere('a.bodega', parametros.bodega)
        .then(function(resultado){
    console.log("resultado:: ",resultado);
            callback(false, resultado);
        }).catch(function(err){
            console.log("error sql",err);
            callback(err);       
        });
};

MovimientosBodegasModel.prototype.ordenTercero = function(parametros, callback){

       var columna = [
                        G.knex.raw("a.orden_pedido_id as orden"),
                        G.knex.raw("d.tipo_id_tercero || ' ' || d.tercero_id || ' : '|| d.nombre_tercero as proveedor")
                     ];
                     
       G.knex.select(columna).from("inv_bodegas_movimiento_ordenes_compra as a")
        .innerJoin("compras_ordenes_pedidos as b",
                        function() {
                            this.on("b.orden_pedido_id", "a.orden_pedido_id")
         })
        .innerJoin("terceros_proveedores as c",
                        function() {
                            this.on("c.codigo_proveedor_id", "b.codigo_proveedor_id")
         })
        .innerJoin("terceros as d",
                        function() {
                            this.on("d.tipo_id_tercero", "c.tipo_id_tercero")
                                .on("d.tercero_id", "c.tercero_id")
         })
        .where('a.empresa_id', parametros.empresaId)
        .andWhere('a.prefijo', parametros.prefijoDocumento)
        .andWhere('a.numero', parametros.numeracionDocumento)
        .then(function(resultado){
    console.log("resultado:: ",resultado);
            callback(false, resultado);
        }).catch(function(err){
            console.log("error sql",err);
            callback(err);       
        });
};

MovimientosBodegasModel.prototype.getItemId = function(callback){
    var sql=" SELECT nextval('inv_bodegas_movimiento_tmp_d_item_id_seq'::regclass); ";
     G.knex.raw(sql).
    then(function(resultado){
       callback(false, resultado.rows);
    }).catch(function(error){
       console.log("error [getItemId]: ", error);
       callback(error);
    });
};

MovimientosBodegasModel.prototype.lokTableDocumetos = function(parametros,transaccion,callback){
    var sql ="LOCK TABLE documentos IN ROW EXCLUSIVE MODE;";
        sql+="SELECT prefijo,numeracion FROM documentos";
        sql+="WHERE documento_id = :1 AND empresa_id = :2 ;";
         
    var query = G.knex.raw(sql, {1:parametros.documentoId, 2:parametros.empresaId});
    
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });
};

MovimientosBodegasModel.prototype.consultarDocumentoBodegaTemporal = function(documentoTemporalId, usuarioId,callback){
  __consultar_documento_bodega_temporal(documentoTemporalId, usuarioId,function(err, resultado){
      if (err || resultado === null) {
            console.log('Se ha generado un error o el docuemnto está vacío.');
            callback(err);
            return;
        } else {
            callback(false,resultado);  
        }
  });
};



MovimientosBodegasModel.prototype.getDoc = function(parametros, callback){

    var sql="select\
                y.documento_id,	y.empresa_id,	y.centro_utilidad,	y.bodega,	y.prefijo,	y.numero,\
                y.observacion,	y.sw_estado,	y.usuario_id,	y.fecha_registro,	y.total_costo, y.abreviatura,\
                y.empresa_destino,	y.sw_verificado,	y.porcentaje_rtf,	y.porcentaje_ica,	y.porcentaje_reteiva,	y.tipo_movimiento,	\
                y.tipo_doc_bodega_id,	y.tipo_clase_documento,	y.descripcion,	list(y.obs_pedido) as obs_pedido,\
                e.razon_social,c.descripcion as centro_utilidad ,f.descripcion as bodega, nombre\
                from(\
                (\
                        SELECT\
                        m.*,\
                        c.inv_tipo_movimiento as tipo_movimiento,\
                        b.tipo_doc_general_id as tipo_doc_bodega_id,\
                        c.descripcion as tipo_clase_documento,\
                        b.descripcion,\
                        vop.observacion as obs_pedido\
                        FROM\
                        inv_bodegas_movimiento as m\
                        JOIN inv_bodegas_documentos as a ON a.documento_id = m.documento_id AND a.empresa_id = m.empresa_id AND a.centro_utilidad = m.centro_utilidad AND a.bodega = m.bodega\
                        JOIN documentos as b ON b.documento_id = a.documento_id AND b.empresa_id = a.empresa_id\
                        JOIN tipos_doc_generales as c ON c.tipo_doc_general_id = b.tipo_doc_general_id\
                        left join inv_bodegas_movimiento_despachos_clientes as dc ON m.empresa_id = dc.empresa_id AND m.prefijo = dc.prefijo AND m.numero = dc.numero\
                        Left JOIN ventas_ordenes_pedidos vop ON dc.pedido_cliente_id = vop.pedido_cliente_id\
                        WHERE \
                        m.empresa_id = :1 \
                        AND m.prefijo = :2 \
                        AND m.numero = :3 \
                )\
                UNION\
                (\
                        SELECT\
                        m.*,\
                        c.inv_tipo_movimiento as tipo_movimiento,\
                        b.tipo_doc_general_id as tipo_doc_bodega_id,\
                        c.descripcion as tipo_clase_documento,\
                        b.descripcion,\
                        sp.observacion as obs_pedido\
                        FROM\
                        inv_bodegas_movimiento as m\
                        JOIN inv_bodegas_documentos as a ON a.documento_id = m.documento_id AND a.empresa_id = m.empresa_id AND a.centro_utilidad = m.centro_utilidad AND a.bodega = m.bodega\
                        JOIN documentos as b ON b.documento_id = a.documento_id AND b.empresa_id = a.empresa_id \
                        JOIN tipos_doc_generales as c ON c.tipo_doc_general_id = b.tipo_doc_general_id\
                        Left join inv_bodegas_movimiento_despachos_farmacias as df on m.empresa_id = df.empresa_id AND m.prefijo = df.prefijo AND m.numero = df.numero\
                        left JOIN public.solicitud_productos_a_bodega_principal as sp\
                        ON  df.solicitud_prod_a_bod_ppal_id = sp.solicitud_prod_a_bod_ppal_id\
                        WHERE \
                        m.empresa_id = :1 \
                        AND m.prefijo = :2 \
                        AND m.numero = :3 \
                )\
                                 ) as y\
                inner join empresas as e on (y.empresa_id=e.empresa_id)\
                inner join centros_utilidad as c on (c.empresa_id=y.empresa_id and c.centro_utilidad=y.centro_utilidad )\
                inner join bodegas as f on (y.empresa_id=f.empresa_id and y.centro_utilidad=f.centro_utilidad and f.bodega=y.bodega)\
                inner join system_usuarios k on (k.usuario_id=y.usuario_id)\
                group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,24,25,26; ";
    
     G.knex.raw(sql, {1:parametros.empresaId, 2:parametros.prefijoDocumento , 3:parametros.numeracionDocumento}).
    then(function(resultado){
       callback(false, resultado.rows);
    }).catch(function(error){
       console.log("error [getDoc]: ", error);
       callback(error);
    });
};


MovimientosBodegasModel.prototype.obtenerDocumetosTemporales = function(parametro, callback) {
    var inner='';
    var select="''";
    var where="";
    if(parametro.tipoDocGeneralId==='I002'){
     select=" cop.codigo_proveedor_id, oc.orden_pedido_id ";   
     inner  =" join inv_bodegas_movimiento_tmp_ordenes_compra as oc on (t.usuario_id=oc.usuario_id and t.doc_tmp_id=oc.doc_tmp_id) ";     
     inner +=" join compras_ordenes_pedidos as cop on (oc.orden_pedido_id=cop.orden_pedido_id)";     
    }
    if(parametro.numeroDocumento !== ''){
      where = " AND t.doc_tmp_id ilike '%"+parametro.numeroDocumento+"%'";
    }
    var sql = "  \
		t.*, \
		c.inv_tipo_movimiento AS tipo_movimiento, \
		b.tipo_doc_general_id AS tipo_doc_bodega_id, \
		c.descripcion AS tipo_clase_documento, \
		b.prefijo, \
		b.descripcion, \
		a.empresa_id, \
		a.centro_utilidad, \
		a.bodega, \
		SU.nombre, \
                "+select+" as orden\
		FROM inv_bodegas_movimiento_tmp t \
		JOIN inv_bodegas_documentos as a ON (t.bodegas_doc_id = a.bodegas_doc_id) \
		JOIN documentos as b  ON (a.documento_id = b.documento_id)\
		AND (a.empresa_id = b.empresa_id)\
		JOIN tipos_doc_generales as c ON (b.tipo_doc_general_id = c.tipo_doc_general_id) \
		JOIN system_usuarios as SU ON (t.usuario_id = SU.usuario_id) \
                "+inner+"\
		WHERE TRUE AND a.empresa_id = :1 AND a.centro_utilidad = :2 AND a.bodega = :3 AND b.tipo_doc_general_id = :4 AND c.inv_tipo_movimiento = :5 "+where;
    console.log("as",sql);
    var datos ={1: parametro.empresaId, 2: parametro.centroUtilidadId, 3: parametro.bodegaId, 4: parametro.tipoDocGeneralId, 5: parametro.invTipoMovimiento};
    var query = G.knex.select(G.knex.raw(sql, datos)).
    limit(G.settings.limit).
    offset((parametro.paginaActual - 1) * G.settings.limit).
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });
};

MovimientosBodegasModel.prototype.getDocumentosBodegaUsuario = function(parametro, callback) {
    var where="";
    if(parametro.numeroDocumento !== ''){
       where=" WHERE numero_doc ilike '%"+parametro.numeroDocumento+"%' ";  
    }
    
    var sql = "  * from (\
                        select \
                            m.*,\
                            m.prefijo||'-'||m.numero as numero_doc,\
                            c.inv_tipo_movimiento as tipo_movimiento, \
                            b.tipo_doc_general_id as tipo_doc_bodega_id, \
                            c.descripcion as tipo_clase_documento,\
                            b.descripcion \
                        FROM\
                            inv_bodegas_movimiento as m \
                            inner join inv_bodegas_documentos as a on (a.documento_id = m.documento_id AND a.empresa_id = m.empresa_id AND a.centro_utilidad = m.centro_utilidad  AND a.bodega = m.bodega)\
                            inner join documentos as b on (b.documento_id = a.documento_id AND b.empresa_id = a.empresa_id AND b.tipo_doc_general_id = :4)\
                            inner join tipos_doc_generales as c on (c.tipo_doc_general_id = b.tipo_doc_general_id AND c.inv_tipo_movimiento = :5 )\
                        WHERE \
                            m.empresa_id = :1 \
                            AND m.centro_utilidad = :2 \
                            AND m.bodega = :3 \
                            ORDER BY m.fecha_registro DESC ) as a "+where;

    var datos={1: parametro.empresaId, 2: parametro.centroUtilidadId, 3: parametro.bodegaId, 4: parametro.tipoDocGeneralId, 5: parametro.invTipoMovimiento}
    
    var query = G.knex.select(G.knex.raw(sql, datos)).
    limit(G.settings.limit).
    offset((parametro.paginaActual - 1) * G.settings.limit).
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });   
    
};

MovimientosBodegasModel.prototype.getTiposDocumentosBodegaUsuario = function(parametro, callback) {
    
    var sql = "SELECT DISTINCT \
                b.tipo_doc_general_id as tipo_doc_bodega_id,\
                c.descripcion as tipo_clase_documento\
                FROM\
                inv_bodegas_movimiento as m\
                inner join inv_bodegas_documentos as a on (a.documento_id = m.documento_id AND a.empresa_id = m.empresa_id AND a.centro_utilidad = m.centro_utilidad AND a.bodega = m.bodega)\
                inner join documentos as b on (b.documento_id = a.documento_id AND b.empresa_id = a.empresa_id)\
                inner join tipos_doc_generales as c on (c.tipo_doc_general_id = b.tipo_doc_general_id AND c.inv_tipo_movimiento = :4 )\
                WHERE\
                m.empresa_id = :1 \
                AND m.centro_utilidad = :2 \
                AND m.bodega = :3 ;";
   
   G.knex.raw(sql, {1: parametro.empresaId, 2: parametro.centroUtilidadId, 3: parametro.bodegaId, 4: parametro.invTipoMovimiento}).
   then(function(resultado){    
       callback(false, resultado.rows);
   }).catch(function(err){
       console.log("ERROR ",err);
       callback(err);
   });
};


MovimientosBodegasModel.prototype.getTiposDocumentosBodegaEmpresa = function(parametro, callback) {
    
    var sql = "SELECT DISTINCT \
                b.tipo_doc_general_id as tipo_doc_bodega_id,\
                c.descripcion as tipo_clase_documento\
                FROM\
                inv_bodegas_documentos as a\
                inner join documentos as b on (b.documento_id = a.documento_id AND b.empresa_id = a.empresa_id)\
                inner join tipos_doc_generales as c on (c.tipo_doc_general_id = b.tipo_doc_general_id AND c.inv_tipo_movimiento = :4 )\
                WHERE\
                a.empresa_id = :1 \
                AND a.centro_utilidad = :2 \
                AND a.bodega = :3 ;";
   
   G.knex.raw(sql, {1: parametro.empresaId, 2: parametro.centroUtilidadId, 3: parametro.bodegaId, 4: parametro.invTipoMovimiento}).
   then(function(resultado){    
       callback(false, resultado.rows);
   }).catch(function(err){
       console.log("ERROR ",err);
       callback(err);
   });
};

/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

// Consultar numeracion del documento
function __obtener_numeracion_documento(empresa_id, documento_id, callback) { 

    var sql = " SELECT prefijo, numeracion FROM documentos WHERE  empresa_id = :1 AND documento_id = :2 ;  ";
    G.knex.raw(sql, {1:empresa_id, 2:documento_id}).
    then(function(resultado){
        sql = " UPDATE documentos SET numeracion = numeracion + 1 WHERE empresa_id = :1 AND  documento_id = :2 ; ";
        
        G.knex.raw(sql, {1:empresa_id, 2:documento_id}).
        then(function(resultado2){
            callback(false, resultado.rows, resultado);
        }).catch(function(err){
            callback(err);
        })
        
    }).catch(function(err){
        callback(err);
    });
    
};

// Ingresar cabecera docuemento movimiento
function __ingresar_movimiento_bodega(documento_id, empresa_id, centro_utilidad, bodega, prefijo, numero, observacion, usuario_id, transaccion, callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento (documento_id, empresa_id, centro_utilidad, bodega, prefijo, numero, observacion, sw_estado, usuario_id, fecha_registro, abreviatura ) \
                VALUES ( :1, :2, :3, :4, :5, :6, :7, '1', :8, NOW(), NULL) ;  ";
    
    var query = G.knex.raw(sql, {1:documento_id, 2:empresa_id, 3:centro_utilidad, 4:bodega, 5:prefijo, 6:numero, 7:observacion, 8:usuario_id});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });
    
};

// Ingresar detalle docuemento movimiento
function __ingresar_detalle_movimiento_bodega(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numeracion_documento, transaccion, callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento_d ( \
                    empresa_id, \
                    prefijo, \
                    numero, \
                    centro_utilidad, \
                    bodega, \
                    codigo_producto, \
                    cantidad, \
                    porcentaje_gravamen, \
                    total_costo, \
                    fecha_vencimiento, \
                    lote, \
                    observacion_cambio, \
                    total_costo_pedido, \
                    valor_unitario, \
                    cantidad_sistema,\
                    numero_caja,\
                    tipo_caja \
                )\
                    SELECT  \
                    :3 AS empresa_id, \
                    :4 AS prefijo, \
                    :5 AS numeracion, \
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
                    COALESCE(a.cantidad_sistema,0) AS cantidad_sistema, \
                    a.numero_caja,\
                    a.tipo_caja \
                    FROM inv_bodegas_movimiento_tmp_d a\
                    inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                    inner join unidades c on b.unidad_id = c.unidad_id \
                    WHERE a.doc_tmp_id = :1  AND a.usuario_id = :2; ";


    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id, 3:empresa_id, 4:prefijo_documento, 5:numeracion_documento});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });
    
};


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
                WHERE doc_tmp_id = :1 AND usuario_id = :2;";
    
    G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id}).
    then(function(resultado){
        callback(false, resultado.rows.length > 0 ? resultado.rows[0] : null);
    }).catch(function(err){
        callback(err);
    });
    
};

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
                c.porc_iva as porcentaje_gravament,\
                a.usuario_id\
                from inv_bodegas_movimiento_tmp a \
                inner join inv_bodegas_movimiento_tmp_d b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                where a.doc_tmp_id = :1 and a.usuario_id = :2 ";

    G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id}).
    then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });
};


function __obtenerItemDocumentoTemporal(item_id, callback) {
    var sql = " select *\
                from inv_bodegas_movimiento_tmp_d a \
                where a.item_id = :1";
    
    G.knex.raw(sql, {1:item_id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

// Eliminar Todo el Documento Temporal 
function __eliminar_movimiento_bodega_temporal(documento_temporal_id, usuario_id, transaccion, callback) {

    var sql = " DELETE FROM inv_bodegas_movimiento_tmp WHERE doc_tmp_id = :1 AND usuario_id = :2 ; ";
    
    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
       // console.log("catch error________________________ ", err);
        callback(err);
    });

};

module.exports = MovimientosBodegasModel;