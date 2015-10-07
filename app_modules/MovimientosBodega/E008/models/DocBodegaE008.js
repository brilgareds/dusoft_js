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
        
        G.knex.transaction(function(transaccion) {  
            G.Q.nfcall(that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal, movimiento_temporal_id, usuario_id, bodegas_doc_id, 
                       observacion, transaccion).
            then(function(){
                 return G.Q.nfcall(that.ingresarMovimientoTmpClientes, movimiento_temporal_id, numero_pedido, tipo_tercero_id, tercero_id, usuario_id,
                                   transaccion);
            }).
            then(function(){
                transaccion.commit(movimiento_temporal_id);
            }).
            fail(function(err){
                transaccion.rollback(err);
            }).
            done();
        }).
        then(function(movimiento_temporal_id){
            callback(false, movimiento_temporal_id);
        }).catch(function(err){
            console.log("error generado >>>>>>>>>>>>", err);
            callback(err);
        }).
        done();        
    });
};


DocuemntoBodegaE008.prototype.ingresarMovimientoTmpClientes = function(movimiento_temporal_id, numero_pedido, tipo_tercero_id, tercero_id, usuario_id,
                                                                       transaccion, callback){
  
    var sql = " INSERT INTO inv_bodegas_movimiento_tmp_despachos_clientes ( doc_tmp_id, pedido_cliente_id, tipo_id_tercero, tercero_id, usuario_id) \
                                VALUES ( :1, :2, :3, :4, :5 ) ; ";
    
    var query = G.knex.raw(sql, {1:movimiento_temporal_id, 2:numero_pedido, 3:tipo_tercero_id, 4:tercero_id, 5:usuario_id});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });
};


DocuemntoBodegaE008.prototype.ingresarMovimientoTmpFarmacias = function(movimiento_temporal_id, empresa_id, numero_pedido, usuario_id,
                                                                        transaccion, callback){
  
    var sql = "INSERT INTO inv_bodegas_movimiento_tmp_despachos_farmacias ( doc_tmp_id, farmacia_id, solicitud_prod_a_bod_ppal_id, usuario_id ) \n\
                            VALUES ( :1, :2, :3, :4) ; ";
    
    var query = G.knex.raw(sql, {1:movimiento_temporal_id, 2:empresa_id, 3:numero_pedido, 4:usuario_id});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
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
        
        G.knex.transaction(function(transaccion) {  
            G.Q.nfcall(that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal, movimiento_temporal_id, usuario_id, bodegas_doc_id, 
                       observacion, transaccion).
            then(function(){
                 return G.Q.nfcall(that.ingresarMovimientoTmpFarmacias, movimiento_temporal_id, empresa_id, numero_pedido, usuario_id,
                                   transaccion);
            }).
            then(function(){
                transaccion.commit(movimiento_temporal_id);
            }).
            fail(function(err){
                transaccion.rollback(err);
            }).
            done();
        }).
        then(function(movimiento_temporal_id){
            callback(false, movimiento_temporal_id);
        }).catch(function(err){
            console.log("error generado >>>>>>>>>>>>", err);
            callback(err);
        }).
        done();        
    });
    
    
    

    /*that.m_movimientos_bodegas.obtener_identificicador_movimiento_temporal(usuario_id, function(err, doc_tmp_id) {

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

    });*/
};

// Consultar Documentos Temporales Clientes 
DocuemntoBodegaE008.prototype.consultar_documentos_temporales_clientes = function(empresa_id, termino_busqueda, filtro, pagina, callback) {



    var campos = [
        "a.doc_tmp_id as documento_temporal_id",
        "a.usuario_id",
        "b.bodegas_doc_id",
        "a.pedido_cliente_id as numero_pedido",
        "d.tipo_id_tercero as tipo_id_cliente", 
        "d.tercero_id as identificacion_cliente", 
        "d.nombre_tercero as nombre_cliente", 
        "d.direccion as direccion_cliente", 
        "d.telefono as telefono_cliente",
        "e.tipo_id_vendedor", 
        "e.vendedor_id as idetificacion_vendedor", 
        "e.nombre as nombre_vendedor", 
        "c.estado",
        G.knex.raw("case when c.estado = '0' then 'Inactivo' when c.estado = '1' then 'Activo' end as descripcion_estado"),
        "c.estado_pedido as estado_actual_pedido", 
        G.knex.raw("case when c.estado_pedido = '0' then 'No Asignado' when c.estado_pedido = '1' then 'Asignado'\
                    when c.estado_pedido = '2' then 'Auditado'\
                    when c.estado_pedido = '3' then 'En Zona Despacho'\
                    when c.estado_pedido = '4' then 'Despachado'\
                    when c.estado_pedido = '5' then 'Despachado con Pendientes'\when c.estado_pedido = '6' then 'Separacion Finalizada'\
                    when c.estado_pedido = '7' then 'En Auditoria'\
                    when c.estado_pedido = '8' then 'Auditado con pdtes'\
                    when c.estado_pedido = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido"),    
        "a.estado as estado_separacion",     
        G.knex.raw("case when a.estado = '0' then 'Separacion en Proceso' when a.estado = '1' then 'Separacion Finalizada'\
                    when a.estado = '2' then 'En Auditoria' end as descripcion_estado_separacion"),
        G.knex.raw("to_char(c.fecha_registro, 'dd-mm-yyyy') as fecha_registro"),    
        G.knex.raw("to_char(b.fecha_registro, 'dd-mm-yyyy') as fecha_separacion_pedido"), 
        "c.empresa_id"
    ];
        
    G.knex.column(campos).
    from("inv_bodegas_movimiento_tmp_despachos_clientes as a").
    innerJoin("inv_bodegas_movimiento_tmp as b", function(){
        this.on("a.doc_tmp_id"," b.doc_tmp_id").
        on("a.usuario_id" , "b.usuario_id");
    }).
    innerJoin("ventas_ordenes_pedidos as c", "a.pedido_cliente_id", "c.pedido_cliente_id").
    innerJoin("terceros as d", function(){
        this.on("c.tipo_id_tercero", "d.tipo_id_tercero").
        on("c.tercero_id" , "d.tercero_id");
    }).
    innerJoin("vnts_vendedores as e", function(){
        this.on("c.tipo_id_vendedor" , "e.tipo_id_vendedor").
        on("c.vendedor_id" , "e.vendedor_id");
    }).
    where(function(){
        this.where("c.empresa_id", empresa_id);
                
        if (filtro !== undefined) {

            if (filtro.en_proceso) {
                this.where("a.estado" , "0");
            }
            
            if (filtro.finalizados) {
                //en auditoria se necesia filtrar por la empresa de donde sale el pedido ademas por centro de utilidad y bodega                
                this.whereRaw("a.estado IN ('1','2') and  c.bodega_destino = :1 and c.centro_destino = :2", {1:filtro.bodega_id, 2:filtro.centro_utilidad});            
            }
        }
    }).   
    andWhere(function() {
       this.where(G.knex.raw("a.pedido_cliente_id :: varchar"), G.constants.db().LIKE, "%" + termino_busqueda + "%").
       orWhere("d.tercero_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
       orWhere("d.nombre_tercero", G.constants.db().LIKE, "%" + termino_busqueda + "%").
       orWhere("e.vendedor_id", G.constants.db().LIKE, "%" + termino_busqueda + "%").
       orWhere("e.nombre", G.constants.db().LIKE, "%" + termino_busqueda + "%");
    }).
    limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).
    then(function(resultado){
        console.log(resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("errror ", err);
        callback(err);
    });
    

   /* G.db.pagination(sql, parametros, pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows, total_records);
    });*/
    
};

// Consultar Documentos Temporales Farmacias 
DocuemntoBodegaE008.prototype.consultar_documentos_temporales_farmacias = function(empresa_id, termino_busqueda, filtro, pagina, callback) {

    var campos = [
        "a.doc_tmp_id as documento_temporal_id",
        "a.usuario_id",
        "a.solicitud_prod_a_bod_ppal_id as numero_pedido",
        "c.farmacia_id",
        "f.empresa_id",
        "c.centro_utilidad",
        "c.bodega as bodega_id",
        "f.razon_social as nombre_farmacia",
        "d.descripcion as nombre_bodega",
        "c.usuario_id as usuario_genero",
        "g.nombre as nombre_usuario",
        "c.estado as esta_actual_pedido",
        G.knex.raw("case when c.estado = '0' then 'No Asignado'\
             when c.estado = '1' then 'Asignado'\
             when c.estado = '2' then 'Auditado'\
             when c.estado = '3' then 'En Zona Despacho'\
             when c.estado = '4' then 'Despachado'\
             when c.estado = '5' then 'Despachado con Pendientes'\
             when c.estado = '6' then 'Separacion Finalizada'\
             when c.estado = '7' then 'En Auditoria'\
             when c.estado = '8' then 'Auditado con pdtes'\
             when c.estado = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido"), 
        "a.estado as estado_separacion",
        G.knex.raw("case when a.estado = '0' then 'Separacion en Proceso'\
             when a.estado = '1' then 'Separacion Finalizada'\
             when a.estado = '2' then 'En Auditoria' end as descripcion_estado_separacion"),   
        G.knex.raw("to_char(c.fecha_registro, 'dd-mm-yyyy') as fecha_registro"),
        G.knex.raw("to_char(b.fecha_registro, 'dd-mm-yyyy') as fecha_separacion_pedido")
    ];
    
    G.knex.column(campos).
    from("inv_bodegas_movimiento_tmp_despachos_farmacias as a").
    innerJoin("inv_bodegas_movimiento_tmp as b", function(){
        this.on("a.doc_tmp_id"," b.doc_tmp_id").
        on("a.usuario_id" , "b.usuario_id");
    }).
    innerJoin("solicitud_productos_a_bodega_principal as c","a.solicitud_prod_a_bod_ppal_id ", "c.solicitud_prod_a_bod_ppal_id").
    innerJoin("bodegas as d", function(){
        this.on("c.farmacia_id","d.empresa_id").
        on("c.centro_utilidad" , "d.centro_utilidad").
        on("c.bodega", "d.bodega");
    }).
    innerJoin("centros_utilidad as e", function(){
        this.on("d.empresa_id" , "e.empresa_id").
        on("d.centro_utilidad" , "e.centro_utilidad");
    }).
    innerJoin("empresas as f", "e.empresa_id" , "f.empresa_id").
    innerJoin("system_usuarios as g", "c.usuario_id" , "g.usuario_id").
    where(function(){
        var sql_empresa = "c.farmacia_id";
        
        if (filtro !== undefined) {

            if (filtro.en_proceso) {
                this.where("a.estado" , "0");
            }
            
            if (filtro.finalizados) {
                //en auditoria se necesia filtrar por la empresa de donde sale el pedido ademas por centro de utilidad y bodega 
                sql_empresa = "c.empresa_destino";
                this.whereRaw("a.estado IN ('1','2') and  c.bodega_destino = :1 and c.centro_destino = :2", {1:filtro.bodega_id, 2:filtro.centro_utilidad});            
            }
        }
        
        this.where(sql_empresa, empresa_id);
    }). 
    andWhere(function() {
       this.where(G.knex.raw("a.solicitud_prod_a_bod_ppal_id :: varchar"), G.constants.db().LIKE, "%" + termino_busqueda + "%").
       orWhere("f.razon_social", G.constants.db().LIKE, "%" + termino_busqueda + "%").
       orWhere("d.descripcion", G.constants.db().LIKE, "%" + termino_busqueda + "%").
       orWhere("g.nombre", G.constants.db().LIKE, "%" + termino_busqueda + "%");
    }).
    limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).
    then(function(resultado){
        console.log(resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("errror ", err);
        callback(err);
    });
    
    /*
    G.db.pagination(sql, parametros, pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows, total_records);
    });*/
    
    
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
                case when c.estado = '0' then 'Inactivo' \
                     when c.estado = '1' then 'Activo' end as descripcion_estado,\
                c.estado_pedido as estado_actual_pedido, \
                case when c.estado_pedido = '0' then 'No Asignado' \
                     when c.estado_pedido = '1' then 'Asignado' \
                     when c.estado_pedido = '2' then 'Auditado' \
                     when c.estado_pedido = '3' then 'En Zona Despacho' \
                     when c.estado_pedido = '4' then 'Despachado'\
                     when c.estado_pedido = '5' then 'Despachado con Pendientes' \
                     when c.estado_pedido = '6' then 'Separacion Finalizada'     \
                     when c.estado_pedido = '7' then 'En Auditoria'   \
                     when c.estado_pedido = '8' then 'Auditado con pdtes'     \
                     when c.estado_pedido = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido,    \
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
                where a.pedido_cliente_id = ? ";
    
   G.knex.raw(sql, [numero_pedido]).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
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
                case when c.estado = '0' then 'No Asignado' \
                     when c.estado = '1' then 'Asignado' \
                     when c.estado = '2' then 'Auditado' \
                     when c.estado = '3' then 'En Zona Despacho' \
                     when c.estado = '4' then 'Despachado' \
                     when c.estado = '5' then 'Despachado con Pendientes' \
                     when c.estado = '6' then 'Separacion Finalizada' \
                     when c.estado = '7' then 'En Auditoria'  \
                     when c.estado = '8' then 'Auditado con pdtes'  \
                     when c.estado = '9' then 'En zona con pdtes' end as descripcion_estado_actual_pedido, \
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
                where a.solicitud_prod_a_bod_ppal_id = ? ";
    
    G.knex.raw(sql, [numero_pedido]).
    then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });
    
    
};

// Eliminar Documento Temporal Clientes
DocuemntoBodegaE008.prototype.eliminar_documento_temporal_clientes = function(doc_tmp_id, usuario_id, callback) {
    var that = this;    
    
    G.knex.transaction(function(transaccion) {   
        // Eliminar Detalle del Documento Temporal
        
        G.Q.nfcall(that.m_movimientos_bodegas.eliminar_detalle_movimiento_bodega_temporal, doc_tmp_id, usuario_id, transaccion).

        then(function(lista_pedidos_farmacias){
            return G.Q.nfcall( that.eliminar_justificaciones_temporales_pendientes, doc_tmp_id, usuario_id, transaccion);
        }).
        then(function(){
            return G.Q.nfcall(that.eliminarDespachoTemporalClientes,doc_tmp_id, usuario_id, transaccion);
        }). 
        then(function(){
            return G.Q.nfcall(that.m_movimientos_bodegas.eliminar_movimiento_bodega_temporal, doc_tmp_id, usuario_id,transaccion);
        }).
        then(function(){
            transaccion.commit();
        }).
        fail(function(err){
            transaccion.rollback(err);

        }).
        done();

    }).then(function(re){
        callback(false);
    }).catch(function(err){
        console.log("error generado >>>>>>>>>>>>", err);
        callback(err);
    }).
    done();
};


DocuemntoBodegaE008.prototype.eliminarDespachoTemporalClientes = function(doc_tmp_id, usuario_id, transaccion, callback){

    var sql = " DELETE FROM inv_bodegas_movimiento_tmp_despachos_clientes WHERE  doc_tmp_id = :1 AND usuario_id = :2;";
                        
    G.knex.raw(sql, {1:doc_tmp_id, 2:usuario_id}).
    transacting(transaccion).
    then(function(resultado){
        // Eliminar Cabecera Documento Temporal
        callback(false, resultado);
    }).catch(function(err){
        transaccion.rollback();
        callback(err);
    });
};

DocuemntoBodegaE008.prototype.eliminarDespachoTemporalFarmacias = function(doc_tmp_id, usuario_id, transaccion, callback){

    var sql = "DELETE FROM inv_bodegas_movimiento_tmp_despachos_farmacias WHERE  doc_tmp_id = :1 AND usuario_id = :2 ;";
                        
    G.knex.raw(sql, {1:doc_tmp_id, 2:usuario_id}).
    transacting(transaccion).
    then(function(resultado){
        // Eliminar Cabecera Documento Temporal
        callback(false, resultado);
    }).catch(function(err){
        transaccion.rollback();
        callback(err);
    });
};

// Eliminar Documento Temporal Farmacias
DocuemntoBodegaE008.prototype.eliminar_documento_temporal_farmacias = function(doc_tmp_id, usuario_id, callback) {

    var that = this;
    
    
    G.knex.transaction(function(transaccion) {   
        // Eliminar Detalle del Documento Temporal
        
        G.Q.nfcall(that.m_movimientos_bodegas.eliminar_detalle_movimiento_bodega_temporal, doc_tmp_id, usuario_id, transaccion).

        then(function(lista_pedidos_farmacias){
            return G.Q.nfcall( that.eliminar_justificaciones_temporales_pendientes, doc_tmp_id, usuario_id, transaccion);
        }).
        then(function(){
            return G.Q.nfcall(that.eliminarDespachoTemporalFarmacias,doc_tmp_id, usuario_id, transaccion);
        }). 
        then(function(){
            return G.Q.nfcall(that.m_movimientos_bodegas.eliminar_movimiento_bodega_temporal, doc_tmp_id, usuario_id,transaccion);
        }).
        then(function(){
            transaccion.commit();
        }).
        fail(function(err){
            transaccion.rollback(err);

        }).
        done();

    }).then(function(re){
        callback(false);
    }).catch(function(err){
        console.log("error generado >>>>>>>>>>>>", err);
        callback(err);
    }).
    done();
    
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
                WHERE a.doc_tmp_id = :1 and a.usuario_id = :2 and a.codigo_producto = :3 ;";
    
    G.knex.raw(sql, {1:doc_tmp_id, 2:usuario_id, 3:codigo_producto}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};


// Ingresar Justificacion de Productos Pendientes
DocuemntoBodegaE008.prototype.ingresar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, justificacion, existencia, justificacion_auditor, callback) {

    console.log('========= ingresar_justificaciones_temporales_pendientes =========');

    var sql = " INSERT INTO inv_bodegas_movimiento_tmp_justificaciones_pendientes ( doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, observacion, existencia, justificacion_auditor ) \
                VALUES ( :1, :2, :3, :4, :5, :6, :7 ); ";

    G.knex.raw(sql, {1:doc_tmp_id, 2:usuario_id, 3:codigo_producto, 4:cantidad_pendiente, 5:justificacion, 6:existencia, 7:justificacion_auditor}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};

// Actualizar Justificacion de Productos Pendientes
DocuemntoBodegaE008.prototype.actualizar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor, callback) {

    console.log('========= actualizar_justificaciones_temporales_pendientes =========');

    var sql = " UPDATE inv_bodegas_movimiento_tmp_justificaciones_pendientes SET cantidad_pendiente = :4 , existencia = :5, observacion = :6, justificacion_auditor = :7  \
                WHERE doc_tmp_id = :1 and usuario_id = :2 and codigo_producto = :3 ; ";
    
   G.knex.raw(sql, {1:doc_tmp_id, 2:usuario_id, 3:codigo_producto, 4:cantidad_pendiente, 5:existencia, 6:justificacion, 7:justificacion_auditor}).
   then(function(resultado){
       callback(false, resultado.rows, resultado);
   }).catch(function(err){
       callback(err);
   });
    
};

// Eliminar Justificacion de Productos Pendientes
// Eliminar Justificacion de Productos Pendientes
DocuemntoBodegaE008.prototype.eliminar_justificaciones_temporales_pendientes = function(documento_temporal_id, usuario_id, transaccion, callback) {

    var sql = "DELETE FROM inv_bodegas_movimiento_tmp_justificaciones_pendientes WHERE doc_tmp_id = :1 AND usuario_id = :2;";    
    
    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id});

    if(transaccion) query.transacting(transaccion);

    query.then(function(resultado){
       callback(false, resultado.rows);
    }).catch(function(err){
       callback(err);
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

    var sql = " UPDATE inv_bodegas_movimiento_tmp_despachos_clientes SET estado = :2 WHERE pedido_cliente_id = :1 ;";
    
    G.knex.raw(sql, {1:numero_pedido, 2:estado}).
    then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
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
                where a.documento_id = :1 and  solicitud_prod_a_bod_ppal_id = :2 and (sw_despachado = '0' or sw_despachado is null) and a.tipo = :3; ";
    
   G.knex.raw(sql, {1:documento_id, 2:numero_pedido, 3:tipo}).
   then(function(resultado){
       callback(false, resultado.rows, resultado);
   }).catch(function(err){
       callback(err);
   });
};

// Consultar el rotulo de una caja 
DocuemntoBodegaE008.prototype.consultar_rotulo_caja = function(documento_id, numero_caja, numero_pedido, callback) {
    var sql = " select * from inv_rotulo_caja a where a.documento_id = :1 and numero_caja = :2 and solicitud_prod_a_bod_ppal_id = :3 and (sw_despachado = '0' or sw_despachado is null); ";

        
   G.knex.raw(sql, {1:documento_id, 2:numero_caja, 3:numero_pedido}).
   then(function(resultado){
       callback(false, resultado.rows, resultado);
   }).catch(function(err){
       callback(err);
   });
    
};

// Inserta el rotulo de una caja
DocuemntoBodegaE008.prototype.generar_rotulo_caja = function(documento_id, numero_pedido, cliente, direccion, cantidad, ruta, contenido, numero_caja, usuario_id, tipo, callback) {

    var sql = " INSERT INTO inv_rotulo_caja (documento_id, solicitud_prod_a_bod_ppal_id, cliente, direccion, cantidad, ruta, contenido, usuario_registro, fecha_registro, numero_caja, tipo) \
                VALUES ( :1, :2, :3, :4, :5, :6, :7, :8, NOW(), :9, :10 ) ;";
    
    G.knex.raw(sql, {1:documento_id, 2:numero_pedido, 3:cliente, 4:direccion, 5:cantidad, 6:ruta, 7:contenido, 8:usuario_id, 9:numero_caja, 10:tipo}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
        console.log("error generado ",err);
       callback(err);
    });
    
};

DocuemntoBodegaE008.prototype.marcar_cajas_como_despachadas = function(documento_id, numero_pedido, callback) {
    var sql = " UPDATE inv_rotulo_caja SET sw_despachado='1' WHERE documento_id = :1 and solicitud_prod_a_bod_ppal_id = :2; ";
    
    G.knex.raw(sql, {1:documento_id, 2:numero_pedido}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};

// Cierra la caja
DocuemntoBodegaE008.prototype.cerrar_caja = function(documento_id, numero_caja, tipo, callback) {

    var sql = " UPDATE inv_rotulo_caja SET caja_cerrada='1' WHERE documento_id = :1 and numero_caja = :2 and tipo = :3; ";
      
    G.knex.raw(sql, {1:documento_id, 2:numero_caja, 3:tipo}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });

};

DocuemntoBodegaE008.prototype.actualizarCajaDeTemporal = function(item_id, numero_caja, tipo, callback) {
   var sql = " UPDATE inv_bodegas_movimiento_tmp_d SET numero_caja= :2, tipo_caja = :3 WHERE item_id = :1 ";
       
   G.knex.raw(sql, {1:item_id, 2:numero_caja, 3:tipo}).
   then(function(resultado){
       callback(false, resultado.rows, resultado);
   }).catch(function(err){
       callback(err);
   });
    
    
};



/*********************************************************************************************************************************
 * ============= DOCUMENTOS DESPACHO =============
 /*********************************************************************************************************************************/
DocuemntoBodegaE008.prototype.generar_documento_despacho_farmacias = function(documento_temporal_id, numero_pedido, usuario_id, auditor_id, callback) {

    var that = this;

    // Iniciar TransacciÃ³n
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
                                // Finalizar TransacciÃ³n.
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
    var doc = {};
    
    G.knex.transaction(function(transaccion) {  
        G.Q.nfcall(that.m_movimientos_bodegas.crear_documento, documento_temporal_id, usuario_id, transaccion).
        then(function(result){
             doc = result;
             return G.Q.nfcall(__asignar_responsable_despacho, doc.empresa_id, doc.prefijo_documento, doc.numeracion_documento, usuario_id, transaccion);
        }).
        then(function(result){
             return G.Q.nfcall(__ingresar_documento_despacho_clientes, documento_temporal_id, usuario_id, doc.empresa_id, doc.prefijo_documento,
                              doc.numeracion_documento, auditor_id, transaccion);
        }).
        then(function(result){
             return G.Q.nfcall(__ingresar_justificaciones_despachos, documento_temporal_id, usuario_id, doc.empresa_id, doc.prefijo_documento,
                              doc.numeracion_documento, transaccion);
        }).
        then(function(result){
             return G.Q.nfcall(__eliminar_documento_temporal_clientes,documento_temporal_id, usuario_id, transaccion);
        }).
        then(function(){
            return G.Q.nfcall( that.eliminar_justificaciones_temporales_pendientes, documento_temporal_id, usuario_id, transaccion);
        }).
        then(function(){
            return G.Q.nfcall( that.m_pedidos_clientes.actualizar_despachos_pedidos_cliente, numero_pedido, doc.prefijo_documento,
                              doc.numeracion_documento, transaccion);
        }).
        fail(function(err){
            console.log("error generado >>>>>>>>>>>>", err);
            transaccion.rollback(err);
        }).
        done();
    }).
    then(function(){
        
       callback(false, doc.empresa_id, doc.prefijo_documento, doc.numeracion_documento);
        
    }).catch(function(err){
        //console.log("error generado >>>>>>>>>>>>", err);
        callback(err);
    }).
    done();        
      
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
                (select nombre from system_usuarios where usuario_id = :4) as usuario_imprime,\
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
                where a.empresa_id = :3\
                and a.prefijo = :2\
                and a.numero = :1\
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
                (select nombre from system_usuarios where usuario_id = :4) as usuario_imprime,\
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
                where a.empresa_id = :3\
                and a.prefijo = :2\
                and a.numero = :1";
    
    
    G.knex.raw(sql, {1:numero, 2:prefijo, 3:empresa, 4:usuario_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
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
function __ingresar_documento_despacho_clientes(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, auditor_id, 
                                                transaccion, callback) {


    var sql = " INSERT INTO inv_bodegas_movimiento_despachos_clientes(empresa_id, prefijo, numero, tipo_id_tercero, tercero_id, pedido_cliente_id, rutaviaje_destinoempresa_id, observacion, fecha_registro, usuario_id )\
                SELECT :3 as empresa_id, :4 as prefijo, :5 as numero, a.tipo_id_tercero, a.tercero_id, a.pedido_cliente_id, a.rutaviaje_destinoempresa_id, a.observacion, NOW() as fecha_registro, :2 as usuario_id \
                FROM inv_bodegas_movimiento_tmp_despachos_clientes a WHERE a.doc_tmp_id = :1 AND a.usuario_id = :2 ";

    
    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id, 3:empresa_id, 4:prefijo_documento, 5:numero_documento});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });
    
};

// Ingresar Justificacion despacho
function __ingresar_justificaciones_despachos(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, transaccion, callback) {


    var sql = " INSERT INTO inv_bodegas_movimiento_justificaciones_pendientes ( empresa_id, prefijo, numero, codigo_producto, cantidad_pendiente, observacion, existencia, usuario_id, justificacion_auditor ) \
                SELECT :3 AS empresa_id, :4 AS prefijo, :5 AS numero, codigo_producto, cantidad_pendiente, observacion, existencia, usuario_id, justificacion_auditor FROM inv_bodegas_movimiento_tmp_justificaciones_pendientes\
                WHERE doc_tmp_id = :1 AND usuario_id = :2 ;  ";

    
    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id, 3:empresa_id, 4:prefijo_documento, 5:numero_documento});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });
    
};

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
function __eliminar_documento_temporal_clientes(documento_temporal_id, usuario_id, transaccion, callback) {


    var sql = " DELETE FROM inv_bodegas_movimiento_tmp_despachos_clientes WHERE  doc_tmp_id = :1 AND usuario_id = :2;";
    
    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        sql = " DELETE FROM inv_bodegas_movimiento_tmp_d WHERE  doc_tmp_id = :1 AND usuario_id = :2;";
        return G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id}).transacting(transaccion);
        
    }).
    then(function(){
        sql = " DELETE FROM inv_bodegas_movimiento_tmp WHERE  doc_tmp_id = :1 AND usuario_id = :2";
        return G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id}).transacting(transaccion);
    }).
    then(function(){
        callback(false);
    }).
    catch(function(err){
        callback(err);
    });
    



    /*G.db.transaction(sql, [documento_temporal_id, usuario_id], function(err, result) {
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

    });*/

}
;


// Asignar Auditor Como Responsable del Desapcho
function __asignar_responsable_despacho(empresa_id, prefijo_documento, numero_documento, auditor_id, transaccion, callback) {
    var sql = " UPDATE inv_bodegas_movimiento SET usuario_id = :4 WHERE empresa_id = :1 AND prefijo = :2 AND numero = :3 ;";
    var query = G.knex.raw(sql, {1:empresa_id, 2:prefijo_documento, 3:numero_documento, 4:auditor_id});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });
    
};

DocuemntoBodegaE008.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocuemntoBodegaE008;