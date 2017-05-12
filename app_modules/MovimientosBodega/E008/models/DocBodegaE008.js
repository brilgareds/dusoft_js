var DocumentoBodegaE008 = function(movientos_bodegas, m_pedidos_clientes, m_pedidos_farmacias) {

    this.m_movimientos_bodegas = movientos_bodegas;
    this.m_pedidos_clientes = m_pedidos_clientes;
    this.m_pedidos_farmacias = m_pedidos_farmacias;

};

/**
 * +Descripcion Metodo encargado de consultar el detalle de un pedido ya despachado
 * @author Cristian Ardila
 * @fecha 2017-05-12 YYYY-MM-DD
 */
DocumentoBodegaE008.prototype.consultarDatosAdicionales = function(obj, callback){
    
    console.log("********DocumentoBodegaE008.prototype.consultarDatosAdicionales*************");
    console.log("********DocumentoBodegaE008.prototype.consultarDatosAdicionales*************");
    console.log("********DocumentoBodegaE008.prototype.consultarDatosAdicionales*************");
     
    console.log("obj ", obj); 
     
    var columnSubQueryA = [
        G.knex.raw("'CLIENTES' as tipo_despacho"),
        G.knex.raw("a.tipo_id_tercero || ' ' || a.tercero_id || ' : '|| b.nombre_tercero as farmacia_cliente "),
        G.knex.raw("a.pedido_cliente_id AS numero_pedido"),
        G.knex.raw("b.direccion AS direccion"),
        G.knex.raw("b.telefono AS telefono"), 
        
   ];
   
    var columnSubQueryB = [
        G.knex.raw("'FARMACIAS' as tipo_despacho"),
        G.knex.raw("e.empresa_id || ' - '|| e.razon_social ||' ::: '||c.descripcion as farmacia_cliente "),
        G.knex.raw("a.solicitud_prod_a_bod_ppal_id AS numero_pedido"),
        G.knex.raw("e.direccion AS direccion"),
        G.knex.raw("e.telefonos AS telefono"), 
        
   ]; 
                   
   var subQueryA = G.knex.select(columnSubQueryA)
            .from("inv_bodegas_movimiento_despachos_clientes as a")
              .innerJoin("terceros as b", function () {
                this.on("a.tipo_id_tercero","b.tipo_id_tercero")
                    .on("a.tercero_id","b.tercero_id")
            
            }).where(function(){
                this.andWhere("a.empresa_id", obj.empresa_id)
                    .andWhere("a.prefijo", obj.prefijo)
                    .andWhere("a.numero", obj.numero)
            }).as("a");
    
    var subQueryB = G.knex.select(columnSubQueryB)
            .from("inv_bodegas_movimiento_despachos_farmacias as a")
              .join("solicitud_productos_a_bodega_principal as b", function () {
                this.on("a.solicitud_prod_a_bod_ppal_id","b.solicitud_prod_a_bod_ppal_id")
            }).join("bodegas as c", function(){
                this.on("b.farmacia_id","c.empresa_id")
                    .on("b.centro_utilidad","c.centro_utilidad")
                    .on("b.bodega","c.bodega")
            }).join("centros_utilidad as d", function(){
                this.on("c.centro_utilidad","d.centro_utilidad")
                    .on("c.empresa_id","d.empresa_id")
            }).join("empresas as e", function(){
                this.on("d.empresa_id","e.empresa_id")
                    
            }).where(function(){
                this.andWhere("a.empresa_id", obj.empresa_id)
                    .andWhere("a.prefijo", obj.prefijo)
                    .andWhere("a.numero", obj.numero)
            }).as("b");
    
    
    var query = G.knex.select('*')
            .from(subQueryA)
            .unionAll(function(){
                this.select('*')
                 .from(subQueryB)                           
            });
    
   query.then(function(resultado) {
        //console.log("query ", query.toSQL());
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [consultarDatosAdicionales] ", err);
        callback({err:err, msj: "Error al consultar los datos adicionales"});   
    });
       
};

function __camposObtenerDocumentoBodega(observacion, tablaPedidos){
    
    /*console.log("*******__camposObtenerDocumentoBodega************");
    console.log("*******__camposObtenerDocumentoBodega************");
    console.log("*******__camposObtenerDocumentoBodega************");
    console.log("tablaPedidos ", tablaPedidos);*/
    
     var columnSubQueryA = [ G.knex.raw("m.*"),
                    G.knex.raw("c.inv_tipo_movimiento as tipo_movimiento"),
                    G.knex.raw("b.tipo_doc_general_id as tipo_doc_bodega_id"),
                    G.knex.raw("c.descripcion as tipo_clase_documento"),
                    G.knex.raw("b.descripcion"),
                    observacion
                    ];
    var consulta = G.knex.select(columnSubQueryA)
            .from('inv_bodegas_movimiento as m')
            .join('inv_bodegas_documentos as a', function () {
                this.on("a.documento_id", "m.documento_id")
                        .on("a.empresa_id"," m.empresa_id")
                        .on("a.centro_utilidad"," m.centro_utilidad")
                        .on("a.bodega"," m.bodega")
            }).join('documentos as b', function(){
                this.on("b.documento_id","a.documento_id")
                        .on("b.empresa_id","a.empresa_id")
            }).join("tipos_doc_generales as c", function(){
                this.on("c.tipo_doc_general_id","b.tipo_doc_general_id")
            }).leftJoin(tablaPedidos, function(){
                this.on("m.empresa_id","dc.empresa_id")
                    .on("m.prefijo","dc.prefijo")
                    .on("m.numero","dc.numero")
            });  
        return consulta;
}
DocumentoBodegaE008.prototype.obtenerDocumentoBodega = function(obj, callback){
    
    console.log("************DocumentoBodegaE008.prototype.obtenerDocumentoBodega*************");
    console.log("************DocumentoBodegaE008.prototype.obtenerDocumentoBodega*************");
    console.log("************DocumentoBodegaE008.prototype.obtenerDocumentoBodega*************");
    
    var column = ["y.documento_id",
                "y.centro_utilidad",	
                 "y.bodega",	
                 "y.prefijo",
                 "y.numero",
                 "y.observacion",	
                 "y.sw_estado",	
                 "y.usuario_id",
                 "y.fecha_registro",
                 "y.total_costo", 
                 "y.abreviatura",
                 "y.empresa_destino",
                 "y.sw_verificado",
                 "y.porcentaje_rtf",
                 "y.porcentaje_ica",
                 "y.porcentaje_reteiva",
                 "y.tipo_movimiento",	
                 "y.tipo_doc_bodega_id",
                 "y.tipo_clase_documento",
                 "y.descripcion"/*,
                 G.knex.raw("list(y.obs_pedido) as obs_pedido")*/
]
    
    var consultaMovimientoClientes = __camposObtenerDocumentoBodega(G.knex.raw("vop.observacion as obs_pedido"),
                            "inv_bodegas_movimiento_despachos_clientes as dc");
    
    var consultaMovimientoFarmacias = __camposObtenerDocumentoBodega(G.knex.raw("sp.observacion as obs_pedido"),
                            "inv_bodegas_movimiento_despachos_farmacias as dc");
                            
    var queryA = consultaMovimientoClientes.leftJoin("ventas_ordenes_pedidos as vop", function(){
                this.on("dc.pedido_cliente_id","vop.pedido_cliente_id")
            }).where(function(){
                this.andWhere("m.empresa_id", obj.empresa_id)
                    .andWhere("m.prefijo", obj.prefijo)
                    .andWhere("m.numero", obj.numero)
            }).as("a");
         
                                                       
    var queryB = consultaMovimientoFarmacias.leftJoin("solicitud_productos_a_bodega_principal as sp", function(){
                this.on("dc.solicitud_prod_a_bod_ppal_id","sp.solicitud_prod_a_bod_ppal_id")
            }).where(function(){
                this.andWhere("m.empresa_id", obj.empresa_id)
                    .andWhere("m.prefijo", obj.prefijo)
                    .andWhere("m.numero", obj.numero)
            }).as("b");
            
    var queryUnion = G.knex.select('*')
            .from(queryA)
            .union(function(){
                this.select('*')
                 .from(queryB)                           
            }).as("y");
    
    var query =  G.knex.column(column)
            .select()
            .from(queryUnion)
            .groupBy(G.knex.raw("1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21"));
    
    queryA.then(function(resultado) {
        console.log("resultado ", resultado);
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [obtenerDocumentoBodega] ", err);
        callback({err:err, msj: "Error al obtener el documento de bodega"});   
    }); 

};
/*********************************************************************************************************************************
 * ============= DOCUMENTOS TEMPORALES =============
 /*********************************************************************************************************************************/

// Insertar la cabecera temporal del despacho de un pedido de clientes
DocumentoBodegaE008.prototype.ingresar_despacho_clientes_temporal = function(bodegas_doc_id, numero_pedido, tipo_tercero_id, tercero_id, observacion, usuario_id, callback) {

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


DocumentoBodegaE008.prototype.ingresarMovimientoTmpClientes = function(movimiento_temporal_id, numero_pedido, tipo_tercero_id, tercero_id, usuario_id,
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


DocumentoBodegaE008.prototype.ingresarMovimientoTmpFarmacias = function(movimiento_temporal_id, empresa_id, numero_pedido, usuario_id,
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
DocumentoBodegaE008.prototype.ingresar_despacho_farmacias_temporal = function(bodegas_doc_id, empresa_id, numero_pedido, observacion, usuario_id, callback) {

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
    
};

// Consultar Documentos Temporales Clientes 
DocumentoBodegaE008.prototype.consultar_documentos_temporales_clientes = function(empresa_id, termino_busqueda, filtro, pagina, callback) {



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
   
    
};

// Consultar Documentos Temporales Farmacias 
DocumentoBodegaE008.prototype.consultar_documentos_temporales_farmacias = function(empresa_id, termino_busqueda, filtro, pagina, callback) {

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
    
};

// Consultar documento temporal de clientes x numero de pedido
DocumentoBodegaE008.prototype.consultar_documento_temporal_clientes = function(numero_pedido, callback) {

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
                b.fecha_registro as fecha_separacion_pedido, \
                c.centro_destino,\
                c.bodega_destino,\
                c.empresa_id\
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
DocumentoBodegaE008.prototype.consultar_documento_temporal_farmacias = function(numero_pedido, callback) {

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
                b.fecha_registro as fecha_separacion_pedido,\
                h.descripcion as zona,\
                c.centro_destino,\
                c.bodega_destino,\
                c.empresa_destino\
                from inv_bodegas_movimiento_tmp_despachos_farmacias a\
                inner join inv_bodegas_movimiento_tmp b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join solicitud_productos_a_bodega_principal c on a.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id\
                inner join bodegas d on c.farmacia_id = d.empresa_id and c.centro_utilidad = d.centro_utilidad and c.bodega = d.bodega \
                inner join centros_utilidad e on d.empresa_id = e.empresa_id and d.centro_utilidad = e.centro_utilidad \
                inner join empresas f ON e.empresa_id = f.empresa_id \
                inner join system_usuarios g ON c.usuario_id = g.usuario_id \
                left join zonas_bodegas as h ON h.id = d.zona_id\
                where a.solicitud_prod_a_bod_ppal_id = ? ";
    
    G.knex.raw(sql, [numero_pedido]).
    then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });
    
    
};

// Eliminar Documento Temporal Clientes
DocumentoBodegaE008.prototype.eliminar_documento_temporal_clientes = function(doc_tmp_id, usuario_id, callback) {
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


DocumentoBodegaE008.prototype.eliminarDespachoTemporalClientes = function(doc_tmp_id, usuario_id, transaccion, callback){

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

DocumentoBodegaE008.prototype.eliminarDespachoTemporalFarmacias = function(doc_tmp_id, usuario_id, transaccion, callback){

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
DocumentoBodegaE008.prototype.eliminar_documento_temporal_farmacias = function(doc_tmp_id, usuario_id, callback) {

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
DocumentoBodegaE008.prototype.gestionar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia,
                                                                                justificacion, justificacion_auditor, observacionSeparador, observacionAuditor, callback) {

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
                that.actualizar_justificaciones_temporales_pendientes(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, existencia, justificacion, justificacion_auditor, observacionSeparador, observacionAuditor, callback);
                return;
            } else {
                // Ingrsar
                that.ingresar_justificaciones_temporales_pendientes(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, justificacion, existencia, justificacion_auditor, observacionSeparador, observacionAuditor, callback);
                return;
            }
        }
    });
};

// Consultar Justificacion de Productos Pendientes
DocumentoBodegaE008.prototype.consultar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, callback) {

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
DocumentoBodegaE008.prototype.ingresar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente,
justificacion, existencia, justificacion_auditor, observacionSeparador, observacionAuditor, callback) {

    console.log('========= ingresar_justificaciones_temporales_pendientes =========');

    var sql = " INSERT INTO inv_bodegas_movimiento_tmp_justificaciones_pendientes ( doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente, observacion, existencia, justificacion_auditor,observacion_justificacion_separador, observacion_justificacion_auditor ) \
                VALUES ( :1, :2, :3, :4, :5, :6, :7, :8, :9 ); ";

    G.knex.raw(sql, {1:doc_tmp_id, 2:usuario_id, 3:codigo_producto, 4:cantidad_pendiente, 5:justificacion, 6:existencia, 7:justificacion_auditor, 8:observacionSeparador, 9:observacionAuditor}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};

// Actualizar Justificacion de Productos Pendientes
DocumentoBodegaE008.prototype.actualizar_justificaciones_temporales_pendientes = function(doc_tmp_id, usuario_id, codigo_producto, cantidad_pendiente,
    existencia, justificacion, justificacion_auditor, observacionSeparador, observacionAuditor, callback) {

    console.log('========= actualizar_justificaciones_temporales_pendientes =========');
    var sqlAux = "";
    var params = {1:doc_tmp_id, 2:usuario_id, 3:codigo_producto, 4:cantidad_pendiente, 5:existencia, 6:justificacion, 7:justificacion_auditor};
    
    if(observacionSeparador.length > 0){
        sqlAux = " ,observacion_justificacion_separador = :8 ";
        params["8"] =  observacionSeparador;
    }
    
    if(observacionAuditor.length > 0){
        sqlAux += " ,observacion_justificacion_auditor = :9 ";
        params["9"] = observacionAuditor;
    }
    
    var sql = " UPDATE inv_bodegas_movimiento_tmp_justificaciones_pendientes SET cantidad_pendiente = :4 , existencia = :5, observacion = :6, justificacion_auditor = :7 "+sqlAux+
                "WHERE doc_tmp_id = :1 and usuario_id = :2 and codigo_producto = :3 ; ";
    
   G.knex.raw(sql, params).
   then(function(resultado){
       callback(false, resultado.rows, resultado);
   }).catch(function(err){
       callback(err);
   });
    
};

// Eliminar Justificacion de Productos Pendientes
// Eliminar Justificacion de Productos Pendientes
DocumentoBodegaE008.prototype.eliminar_justificaciones_temporales_pendientes = function(documento_temporal_id, usuario_id, transaccion, callback) {

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
DocumentoBodegaE008.prototype.eliminar_justificaciones_temporales_producto = function(doc_tmp_id, usuario_id, codigo_producto, callback) {

    var sql = "DELETE FROM inv_bodegas_movimiento_tmp_justificaciones_pendientes WHERE doc_tmp_id = :1 AND usuario_id = :2 AND codigo_producto = :3;";
    
    G.knex.raw(sql, {1:doc_tmp_id, 2:usuario_id, 3:codigo_producto}).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};


// Actualizar estado documento temporal de clientes 0 = En Proceso separacion, 1 = Separacion Finalizada, 2 = En auditoria
DocumentoBodegaE008.prototype.actualizar_estado_documento_temporal_clientes = function(numero_pedido, estado, callback) {

    var sql = " UPDATE inv_bodegas_movimiento_tmp_despachos_clientes SET estado = :2 WHERE pedido_cliente_id = :1 ;";
    
    G.knex.raw(sql, {1:numero_pedido, 2:estado}).
    then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });

};

// Actualizar estado documento temporal de farmacias 0 = En Proceso separacion, 1 = Separacion Finalizada, 2 = En auditoria
DocumentoBodegaE008.prototype.actualizar_estado_documento_temporal_farmacias = function(numero_pedido, estado, callback) {

    var sql = " UPDATE inv_bodegas_movimiento_tmp_despachos_farmacias SET estado = :2 WHERE solicitud_prod_a_bod_ppal_id = :1 ;";
    
    G.knex.raw(sql, {1:numero_pedido, 2:estado}).
    then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });

};

// Consultar el rotulo mayor para validar el consecutivo de la caja o nevera 
DocumentoBodegaE008.prototype.consultarNumeroMayorRotulo = function(documento_id, numero_pedido, tipoCaja, tipoPedido, callback) {
    var sql = " select coalesce(max(a.numero_caja), 0) as numero_caja from inv_rotulo_caja a \
                where  a.documento_temporal_id = :1  and   solicitud_prod_a_bod_ppal_id = :2 and (sw_despachado = '0' or sw_despachado is null) and a.tipo = :3 and tipo_pedido = :4;";
    
   G.knex.raw(sql, {1:documento_id, 2:numero_pedido, 3:tipoCaja, 4:tipoPedido}).
   then(function(resultado){
       callback(false, resultado.rows, resultado);
   }).catch(function(err){
       console.log("err ",err);
       callback(err);
   });
};

// Consultar el rotulo de una caja 
DocumentoBodegaE008.prototype.consultar_rotulo_caja = function(documento_id, numero_caja, numero_pedido, tipoPedido, callback) {
    console.log("arguments  consultar_rotulo_caja() ",arguments);
    var sql = " select * from inv_rotulo_caja a where  a.documento_temporal_id = :1 and  numero_caja = :2 and solicitud_prod_a_bod_ppal_id = :3 and (sw_despachado = '0' or sw_despachado is null) and tipo_pedido = :4; ";

        
   G.knex.raw(sql, {1:documento_id, 2:numero_caja, 3:numero_pedido, 4:tipoPedido}).
   then(function(resultado){  
       callback(false, resultado.rows, resultado);
   }).catch(function(err){
       callback(err);
   });
    
};

// Inserta el rotulo de una caja
DocumentoBodegaE008.prototype.generar_rotulo_caja = function(documento_id, numero_pedido, cliente, direccion, cantidad, ruta,
                                                             contenido, numero_caja, usuario_id, tipo, tipoPedido, callback) {
    console.log("arguments  generar_rotulo_caja() ",arguments);
    var sql = " INSERT INTO inv_rotulo_caja (documento_id, solicitud_prod_a_bod_ppal_id, cliente, direccion, cantidad, ruta, contenido, usuario_registro, fecha_registro, numero_caja, tipo, documento_temporal_id, tipo_pedido) \
                VALUES ( :1, :2, :3, :4, :5, :6, :7, :8, NOW(), :9, :10, :1, :11 ) ;";
    
    G.knex.raw(sql, {1:documento_id, 2:numero_pedido, 3:cliente, 4:direccion, 5:cantidad, 6:ruta, 7:contenido, 8:usuario_id,
                     9:numero_caja, 10:tipo, 11:tipoPedido}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
        console.log("error generado ",err);
       callback(err);
    });
    
};

DocumentoBodegaE008.prototype.validarTemporal = function(doc_tmp_id, usuario_id, callback){


    var sql = " SELECT * FROM inv_bodegas_movimiento_tmp a\
                WHERE a.doc_tmp_id = :1 and a.usuario_id = :2;";
    
    G.knex.raw(sql, {1:doc_tmp_id, 2:usuario_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });


};

DocumentoBodegaE008.prototype.marcar_cajas_como_despachadas = function(documento_id, numero_pedido, tipoPedido, callback) {
    var sql = " UPDATE inv_rotulo_caja SET sw_despachado='1' WHERE documento_temporal_id = :1 and solicitud_prod_a_bod_ppal_id = :2 and tipo_pedido = :3  ";
    console.log("arguments  marcar_cajas_como_despachadas() ",arguments);
    G.knex.raw(sql, {1:documento_id, 2:numero_pedido, 3:tipoPedido}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};

// Cierra la caja
DocumentoBodegaE008.prototype.cerrar_caja = function(documento_id, numero_caja, tipo, tipoPedido, callback) {
    console.log("arguments  cerrar_caja() ",arguments);
    var sql = " UPDATE inv_rotulo_caja SET caja_cerrada='0' WHERE documento_temporal_id = :1 and numero_caja = :2 and tipo = :3  and tipo_pedido = :4; ";
      
    G.knex.raw(sql, {1:documento_id, 2:numero_caja, 3:tipo, 4:tipoPedido}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });

};

DocumentoBodegaE008.prototype.actualizarCajaDeTemporal = function(item_id, numero_caja, tipo, callback) {
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
DocumentoBodegaE008.prototype.generar_documento_despacho_farmacias = function(documento_temporal_id, numero_pedido, usuario_id, auditor_id, callback) {

    var that = this;
    var doc  = {};
    
    G.knex.transaction(function(transaccion) {  
        G.Q.nfcall(that.m_movimientos_bodegas.crear_documento, documento_temporal_id, usuario_id, transaccion).
        then(function(result){
             doc = result;
             return G.Q.nfcall(__asignar_responsable_despacho, doc.empresa_id, doc.prefijo_documento, doc.numeracion_documento, usuario_id, transaccion);
        }).
        then(function(result){
             return G.Q.nfcall(__ingresar_documento_despacho_farmacias, documento_temporal_id, usuario_id, doc.empresa_id, doc.prefijo_documento,
                              doc.numeracion_documento, auditor_id, transaccion);
        }).
        then(function(result){
             return G.Q.nfcall(__ingresar_justificaciones_despachos, documento_temporal_id, usuario_id, doc.empresa_id, doc.prefijo_documento,
                              doc.numeracion_documento, transaccion);
        }).
        then(function(result){
             return G.Q.nfcall(__eliminar_documento_temporal_farmacias,documento_temporal_id, usuario_id, transaccion);
        }).
        then(function(){
            return G.Q.nfcall( that.eliminar_justificaciones_temporales_pendientes, documento_temporal_id, usuario_id, transaccion);
        }).
        then(function(){
            return G.Q.nfcall( that.m_pedidos_farmacias.actualizar_cantidad_pendiente_en_solicitud, numero_pedido,
                               transaccion);
        }).
        then(function(){
            transaccion.commit();
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



DocumentoBodegaE008.prototype.generar_documento_despacho_clientes = function(documento_temporal_id, numero_pedido, usuario_id, auditor_id, callback) {

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
        then(function(){
            transaccion.commit();
        }).
        fail(function(err){
            //console.log("error generado >>>>>>>>>>>>", err);
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


DocumentoBodegaE008.prototype.consultar_documento_despacho = function(numero, prefijo, empresa, usuario_id, callback){
    
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
                to_char(j.fecha_registro, 'dd-mm-yyyy hh:mi AM') as fecha_pedido,\
                '1' as tipo_pedido,\
                '' as farmacia_id,\
                j.observacion as descripcion_pedido\
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
                to_char(j.fecha_registro, 'dd-mm-yyyy hh:mi AM') as fecha_pedido,\
                '2' as tipo_pedido,\
                j.farmacia_id,\
                j.observacion as descripcion_pedido\
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
function __ingresar_documento_despacho_farmacias(documento_temporal_id, usuario_id, empresa_id, prefijo_documento, numero_documento, auditor_id,
                                                 transaccion, callback) {
    var sql = " INSERT INTO inv_bodegas_movimiento_despachos_farmacias(empresa_id, prefijo, numero, farmacia_id, solicitud_prod_a_bod_ppal_id, usuario_id,fecha_registro,rutaviaje_destinoempresa_id, sw_revisado, sw_entregado_off )\
                SELECT :3 as empresa_id, :4 as prefijo, :5 as numero, a.farmacia_id, a.solicitud_prod_a_bod_ppal_id, :2 as usuario_id, NOW() as fecha_registro, a.rutaviaje_destinoempresa_id, '1' as sw_revisado, '1' as sw_entregado_off\
                FROM inv_bodegas_movimiento_tmp_despachos_farmacias a WHERE a.doc_tmp_id = :1 AND a.usuario_id = :2 ";

    
    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id, 3:empresa_id, 4:prefijo_documento, 5:numero_documento});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });
    
};



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


    var sql = " INSERT INTO inv_bodegas_movimiento_justificaciones_pendientes ( empresa_id, prefijo, numero, codigo_producto, cantidad_pendiente, observacion, existencia, usuario_id, justificacion_auditor, observacion_justificacion_separador, observacion_justificacion_auditor ) \
                SELECT :3 AS empresa_id, :4 AS prefijo, :5 AS numero, codigo_producto, cantidad_pendiente, observacion, existencia, usuario_id, justificacion_auditor, observacion_justificacion_separador, observacion_justificacion_auditor  FROM inv_bodegas_movimiento_tmp_justificaciones_pendientes\
                WHERE doc_tmp_id = :1 AND usuario_id = :2 ;  ";

    
    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id, 3:empresa_id, 4:prefijo_documento, 5:numero_documento});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });
    
};


//Eliminar Documento Temporal Despacho Farmacias
function __eliminar_documento_temporal_farmacias(documento_temporal_id, usuario_id, transaccion, callback) {
    
    var sql = "DELETE FROM inv_bodegas_movimiento_tmp_despachos_farmacias WHERE  doc_tmp_id = :1 AND usuario_id = :2;";
    
    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        sql = "DELETE FROM inv_bodegas_movimiento_tmp_d WHERE  doc_tmp_id = :1 AND usuario_id = :2 ;";
        return G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id}).transacting(transaccion);
        
    }).then(function(){
        sql = " DELETE FROM inv_bodegas_movimiento_tmp WHERE  doc_tmp_id = :1 AND usuario_id = :2 ;";
        return G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id}).transacting(transaccion);
    }).then(function(){
        callback(false);
    }).catch(function(err){
        callback(err);
    });

};

// Eliminar Documento Temporal Despacho Clientes
function __eliminar_documento_temporal_clientes(documento_temporal_id, usuario_id, transaccion, callback) {

    var sql = " DELETE FROM inv_bodegas_movimiento_tmp_despachos_clientes WHERE  doc_tmp_id = :1 AND usuario_id = :2;";
    
    var query = G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id});
    if(transaccion) query.transacting(transaccion);
            
    query.then(function(resultado){
        sql = " DELETE FROM inv_bodegas_movimiento_tmp_d WHERE  doc_tmp_id = :1 AND usuario_id = :2;";
        return G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id}).transacting(transaccion);
        
    }).then(function(){
        sql = " DELETE FROM inv_bodegas_movimiento_tmp WHERE  doc_tmp_id = :1 AND usuario_id = :2";
        return G.knex.raw(sql, {1:documento_temporal_id, 2:usuario_id}).transacting(transaccion);
    }).then(function(){
        callback(false);
    }).catch(function(err){
        callback(err);
    });
    
};


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

DocumentoBodegaE008.prototype.obtenerDocumento = function(obj, callback) {
   
    var sql = "SELECT numero FROM inv_bodegas_movimiento WHERE empresa_id = :1 AND prefijo = :2 AND numero = :3; ";


     G.knex.raw(sql, {1: obj.empresa_id, 2: obj.prefijo, 3: obj.numero}). then(function(resultado){       
        callback(false, resultado.rows);   
    }).catch(function(err) { 
      
        callback(err);
    });
};



/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado listar los despachos auditados
 */
DocumentoBodegaE008.prototype.listarDespachosAuditados = function(obj, callback){
   
     var fecha = "";
    
     if(!obj.registroUnico){
        fecha = "a.fecha_registro between :fechaInicial and :fechaFinal and";

     }
     
     var sql = "a.prefijo,\
                a.numero,\
                b.razon_social,\
                a.empresa_id,\
                to_char(a.fecha_registro, 'DD Mon YYYY')as fecha_registro,\
                a.empresa_destino,\
               (SELECT empr.razon_social FROM empresas empr WHERE empr.empresa_id = a.empresa_destino) as desc_empresa_destino, \
                a.observacion,\
                CASE WHEN c.pedido_cliente_id is null THEN d.solicitud_prod_a_bod_ppal_id WHEN d.solicitud_prod_a_bod_ppal_id is null THEN c.pedido_cliente_id end as pedido,\
                CASE WHEN c.pedido_cliente_id is not null THEN 1 WHEN d.solicitud_prod_a_bod_ppal_id is not null THEN 2 end as tipo_pedido,\
                e.bodega as bodega_destino,\
                e.farmacia_id as empresa_destino\
                FROM inv_bodegas_movimiento a\
                INNER JOIN  empresas b ON b.empresa_id = a.empresa_id\
                LEFT JOIN inv_bodegas_movimiento_despachos_clientes c\
                ON  a.prefijo = c.prefijo AND a.numero = c.numero AND a.empresa_id = c.empresa_id\
                LEFT JOIN inv_bodegas_movimiento_despachos_farmacias d ON  a.prefijo = d.prefijo AND a.numero = d.numero AND a.empresa_id = d.empresa_id\
                LEFT JOIN solicitud_productos_a_bodega_principal e ON d.solicitud_prod_a_bod_ppal_id = e.solicitud_prod_a_bod_ppal_id\
                WHERE "+fecha+"\
                ( \
                    a.prefijo :: varchar "+G.constants.db().LIKE+"  :prefijo and\
                    a.numero  :: varchar "+G.constants.db().LIKE+"  :numero\
                   \
                ) AND a.empresa_id :: varchar "+G.constants.db().LIKE+"  :empresa_id\
                AND a.prefijo IN ('DTM','EFM','EDFM','EFC')";
   
    var parametros = {
        fechaInicial: obj.fechaInicial, 
        fechaFinal: obj.fechaFinal, 
        prefijo: "%"+ obj.prefijo +"%", 
        numero: "%"+ obj.numero  +"%",
        empresa_id: obj.empresa_id
    };
    
    var query = G.knex.select(G.knex.raw(sql, parametros)).
    limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).orderBy("a.prefijo", "desc").then(function(resultado){
        
        callback(false, resultado);
    }).catch(function(err){
     
        callback(err);
       
    });
};



/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado mostrar el detalle de un documento
 */
DocumentoBodegaE008.prototype.detalleDocumentoAuditado = function(obj, callback){
     
     var sql = "SELECT a.codigo_producto,fc_descripcion_producto(a.codigo_producto) as descripcion, a.numero_caja, a.cantidad as cantidad_recibida,\
        CASE WHEN a.tipo_caja = '0' THEN 'CAJA' WHEN a.tipo_caja = '1' THEN 'Nevera' end as tipo, a.tipo_caja,\
        CASE WHEN b.pedido_cliente_id is null THEN c.solicitud_prod_a_bod_ppal_id WHEN c.solicitud_prod_a_bod_ppal_id is null THEN b.pedido_cliente_id end as pedido,\
        CASE WHEN b.pedido_cliente_id is not null THEN 0 WHEN c.solicitud_prod_a_bod_ppal_id is not null THEN 1 end as tipo_pedido\n\
        FROM inv_bodegas_movimiento_d a LEFT JOIN inv_bodegas_movimiento_despachos_clientes b\
        ON  a.prefijo = b.prefijo AND a.numero = b.numero AND a.empresa_id = b.empresa_id\
        LEFT JOIN inv_bodegas_movimiento_despachos_farmacias c\
        ON  a.prefijo = c.prefijo AND a.numero = c.numero AND a.empresa_id = c.empresa_id\
        WHERE a.prefijo :: varchar "+G.constants.db().LIKE+"  :prefijo\
        AND a.numero  :: varchar "+G.constants.db().LIKE+"  :numero\
        AND a.empresa_id :: varchar "+G.constants.db().LIKE+"  :empresa;";
   
    var parametros = {
        prefijo: "%"+ obj.prefijo +"%", 
        numero: "%"+ obj.numero  +"%",
        empresa: obj.empresa_id 
    };
       
     G.knex.raw(sql, parametros). then(function(resultado){       
        callback(false, resultado.rows);   
    }).catch(function(err) { 
     
        callback(err);
    });        
};


DocumentoBodegaE008.prototype.obtenerTotalDetalleDespacho = function(obj, callback){
     
     var sql = "SELECT\
                    a.*,\
                    to_char(a.fecha_vencimiento, 'YYYY-MM-DD') AS fecha_vencimiento_producto,\
                    b.descripcion,\
                    b.unidad_id,\
		    b.contenido_unidad_venta,\
		    b.codigo_cum,\
		    b.codigo_invima,\
                    c.descripcion as descripcion_unidad,\
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
                    a.empresa_id = :1\
                    AND a.prefijo = :2\
                    AND a.numero = :3\
                    AND b.codigo_producto = a.codigo_producto\
                    AND c.unidad_id = b.unidad_id\
                    ORDER BY a.codigo_producto";
   
    var parametros = {
        1: obj.empresa,
        2: obj.prefijoDocumento , 
        3: obj.numeroDocumento 
    };
       
     G.knex.raw(sql, parametros). then(function(resultado){       
        callback(false, resultado.rows);   
    }).catch(function(err) { 
     
        callback(err);
    });        
};


/**
 * @author Cristian Ardila 
 * @fecha  18/002/2016
 * +Descripcion Modelo que consulta el pedido amarrado a un documento
 * @param {type} callback
 * @returns {undefined} */
DocumentoBodegaE008.prototype.detallePedidoClienteDocumento = function(obj, callback) {
   
    var sql = "SELECT a.empresa_id, a.prefijo, a.numero, a.empresa_id, a.pedido_cliente_id as pedido\
               FROM inv_bodegas_movimiento_despachos_clientes a\
               WHERE empresa_id = :1 AND prefijo = :2 AND numero = :3;";


     G.knex.raw(sql, {1: obj.empresa_id, 2: obj.prefijo, 3: obj.numero}). then(function(resultado){     
         
        callback(false, resultado.rows);   
    }).catch(function(err) { 
      
        callback(err);
    });
};


/**
 * @author Cristian Ardila 
 * @fecha  18/002/2016
 * +Descripcion Modelo que consulta el pedido amarrado a un documento
 * @param {type} callback
 * @returns {undefined} */
DocumentoBodegaE008.prototype.detallePedidoFarmaciaDocumento = function(obj, callback) {
   
    var sql = "SELECT a.empresa_id, a.prefijo, a.numero, a.empresa_id, a.solicitud_prod_a_bod_ppal_id as pedido\
               FROM inv_bodegas_movimiento_despachos_farmacias a\
               WHERE empresa_id = :1 AND prefijo = :2 AND numero = :3;";


     G.knex.raw(sql, {1: obj.empresa_id, 2: obj.prefijo, 3: obj.numero}). then(function(resultado){       
       
        callback(false, resultado.rows);   
    }).catch(function(err) { 
       
        callback(err);
    });
};


/**
 * @author Eduar Garcia 
 * @fecha  22/06/2016
 * +Descripcion Permite obtener las jusitificaciones que se listan en separacion o auditoria
 * @param {type} callback
 * @returns {undefined} */
DocumentoBodegaE008.prototype.obtenerJustificaciones = function(obj, callback) {
   
    //var sql = "SELECT * FROM justificaciones_bodega";
    G.knex.select().table("justificaciones_bodega").where({empresa_id:obj.empresa_id}).then(function(resultado){       
       
        callback(false, resultado);   
    }).catch(function(err) { 
       
        callback(err);
    });
};



DocumentoBodegaE008.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocumentoBodegaE008;