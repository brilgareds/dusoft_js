var PlanillasDespachosModel = function() {

};


PlanillasDespachosModel.prototype.listar_planillas_despachos = function(fecha_inicial, fecha_final, termino_busqueda, callback) {


    var sql = " select \
                a.id, \
                a.id as numero_guia,\
                a.numero_guia_externo,\
                b.transportadora_id,\
                b.descripcion as nombre_transportadora,\
                b.placa_vehiculo,\
                b.estado as estado_transportadora,\
                e.tipo_pais_id as pais_id,\
                e.pais as nombre_pais,\
                d.tipo_dpto_id as departamento_id,\
                d.departamento as nombre_departamento,\
                a.ciudad_id,\
                c.municipio as nombre_ciudad,\
                a.nombre_conductor,\
                a.observacion,\
                g.total_cajas,\
                g.total_neveras,\
                a.usuario_id,\
                f.nombre as nombre_usuario,\
                a.estado,\
                case when a.estado = '0' then 'Anulada' \
                     when a.estado = '1' then 'Activa' \
                     when a.estado = '2' then 'Despachada' end as descripcion_estado, \
                To_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro,\
                To_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho\
                from inv_planillas_despacho a \
                inner join inv_transportadoras b on a.inv_transportador_id = b.transportadora_id\
                inner join tipo_mpios c on a.ciudad_id = c.tipo_mpio_id and a.departamento_id = c.tipo_dpto_id and a.pais_id = c.tipo_pais_id\
                inner join tipo_dptos d on c.tipo_dpto_id = d.tipo_dpto_id and c.tipo_pais_id = d.tipo_pais_id\
                inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                left join (\
                    select a.planilla_id, sum(a.cantidad_cajas) as total_cajas, sum(a.cantidad_neveras) as total_neveras\
                    from (\
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, 1\
                      from inv_planillas_detalle_farmacias a\
                      union\
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, 2\
                      from inv_planillas_detalle_clientes a\
                      union \
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, 3\
                      from inv_planillas_detalle_empresas a \
                    ) as a group by 1\
                  ) as g on a.id = g.planilla_id\
                where a.fecha_registro between :1 and :2 \
                and (\
                    a.id::varchar "+G.constants.db().LIKE+" :3 or\
                    b.descripcion "+G.constants.db().LIKE+" :3 or\
                    b.placa_vehiculo "+G.constants.db().LIKE+" :3 or\
                    e.pais "+G.constants.db().LIKE+" :3 or\
                    d.departamento "+G.constants.db().LIKE+" :3 or\
                    c.municipio "+G.constants.db().LIKE+" :3 or\
                    a.nombre_conductor "+G.constants.db().LIKE+" :3 \
                ) order by a.id DESC; ";

    G.knex.raw(sql, {1: fecha_inicial, 2: fecha_final, 3: "%"+termino_busqueda+"%"}).then(function(resultado){
      
        callback(false, resultado.rows);
    }).catch(function(err) {
        callback(err);
    });
};

// Consultar los documentos de despachos de una farmacia
PlanillasDespachosModel.prototype.consultar_documentos_despachos_por_farmacia = function(empresa_id, farmacia_id, centro_utilidad_id, termino_busqueda, callback){
    
    // Nota : Solo se consultan docuementos o pedido que hayan sido auditados
        //  (select coalesce(max(aa.numero_caja),'0') as total_cajas  from inv_bodegas_movimiento_d aa where aa.empresa_id = a.empresa_id and  aa.prefijo = a.prefijo and aa.numero = a.numero and aa.tipo_caja = '0') as total_cajas,\
      //(select coalesce(max(aa.numero_caja),'0') as total_neveras  from inv_bodegas_movimiento_d aa where aa.empresa_id = a.empresa_id and  aa.prefijo = a.prefijo and aa.numero = a.numero and aa.tipo_caja = '1') as total_neveras,\

    var sql = " select \
                '0' as tipo,\
                'FARMACIAS' as descripcion_tipo,\
                b.farmacia_id,\
                b.centro_utilidad,\
                b.bodega,\
                a.empresa_id,\
                e.razon_social as nombre_empresa,\
                d.centro_utilidad as centro_utilidad_id,\
                d.descripcion as nombre_centro_utilidad,\
                c.bodega as bodega_id,\
                c.descripcion as nombre_bodega,\
                a.prefijo,\
                a.numero,\
                a.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                a.fecha_registro\
                from inv_bodegas_movimiento_despachos_farmacias a\
                inner join solicitud_productos_a_bodega_principal b on a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id\
                inner join bodegas c on b.farmacia_id = c.empresa_id and b.centro_utilidad = c.centro_utilidad and b.bodega = c.bodega\
                inner join centros_utilidad d on c.empresa_id = d.empresa_id and c.centro_utilidad = d.centro_utilidad\
                inner join empresas e on d.empresa_id = e.empresa_id\
                inner join aprobacion_despacho_planillas f on f.prefijo = a.prefijo and f.numero = a.numero and f.empresa_id = a.empresa_id\
                where a.empresa_id = :1 \
                and b.farmacia_id = :2 \
                and b.centro_utilidad  = :3 \
                and b.estado in ('2','8','9','3')\
                and a.prefijo || '-' || a.numero NOT IN( select b.prefijo || '-' || b.numero from inv_planillas_detalle_farmacias b ) and \
                (\
                    a.prefijo || ' ' || a.numero :: varchar  "+G.constants.db().LIKE+" :4 or\
                    a.numero :: varchar "+G.constants.db().LIKE+"  :4 or\
                    a.solicitud_prod_a_bod_ppal_id :: varchar "+G.constants.db().LIKE+" :4 \
                )\
                order by a.fecha_registro desc; ";
   
   
     G.knex.raw(sql, {1: empresa_id, 2: farmacia_id, 3: centro_utilidad_id, 4: "%"+termino_busqueda+"%"}).then(function(resultado){
        
        callback(false, resultado.rows, resultado);
        
    }).catch(function(err) {
        console.log("error >>>>>>>>>> ", err);
        callback(err);
    });
};

// Consultar los documentos de despacho de un cliente 
PlanillasDespachosModel.prototype.consultar_documentos_despachos_por_cliente = function(empresa_id, tipo_id, tercero_id, termino_busqueda, callback){
    
    // Nota : Solo se consultan docuementos o pedido que hayan sido auditados
    var sql = " select \
                '1' as tipo,\
                'CLIENTES' as descripcion_tipo,\
                a.empresa_id,\
                a.prefijo,\
                a.numero,\
                a.pedido_cliente_id as numero_pedido,\
                a.fecha_registro\
                from inv_bodegas_movimiento_despachos_clientes a\
                inner join ventas_ordenes_pedidos b on a.pedido_cliente_id = b.pedido_cliente_id \
                inner join aprobacion_despacho_planillas c on c.prefijo = a.prefijo and c.numero = a.numero and c.empresa_id = a.empresa_id\
                where a.empresa_id= :1 and a.tipo_id_tercero = :2 and a.tercero_id = :3 and b.estado_pedido in ('2','8','9','3') \
                and a.prefijo || '-' || a.numero NOT IN( select b.prefijo || '-' || b.numero from inv_planillas_detalle_clientes b ) and \
                ( \
                    a.prefijo || ' ' || a.numero :: varchar "+G.constants.db().LIKE+"  :4 or \
                    a.numero :: varchar "+G.constants.db().LIKE+"  :4 or \
                    a.pedido_cliente_id :: varchar "+G.constants.db().LIKE+"  :4 \
                )\
                order by a.fecha_registro desc ; ";
    
 
    G.knex.raw(sql, {1: empresa_id, 2: tipo_id, 3: tercero_id, 4: "%"+termino_busqueda+"%"}).then(function(resultado){
       
        callback(false, resultado.rows);
        
    }).catch(function(err) {
        console.log("error en planillas clientes ", err);
        callback(err);
    });
};

PlanillasDespachosModel.prototype.consultar_planilla_despacho = function(planilla_id, callback) {

    var sql = " select \
                a.id, \
                a.id as numero_guia,\
                a.numero_guia_externo,\
                b.transportadora_id,\
                b.descripcion as nombre_transportadora,\
                b.placa_vehiculo,\
                b.estado as estado_transportadora,\
                e.tipo_pais_id as pais_id,\
                e.pais as nombre_pais,\
                d.tipo_dpto_id as departamento_id,\
                d.departamento as nombre_departamento,\
                a.ciudad_id,\
                c.municipio as nombre_ciudad,\
                a.nombre_conductor,\
                a.observacion,\
                g.total_cajas,\
                g.total_neveras,\
                a.usuario_id,\
                f.nombre as nombre_usuario,\
                a.estado,\
                case when a.estado = '0' then 'Anulada' \
                     when a.estado = '1' then 'Activa' \
                     when a.estado = '2' then 'Despachada' end as descripcion_estado, \
                To_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro,\
                To_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho\
                from inv_planillas_despacho a \
                inner join inv_transportadoras b on a.inv_transportador_id = b.transportadora_id\
                inner join tipo_mpios c on a.ciudad_id = c.tipo_mpio_id and a.departamento_id = c.tipo_dpto_id and a.pais_id = c.tipo_pais_id\
                inner join tipo_dptos d on c.tipo_dpto_id = d.tipo_dpto_id and c.tipo_pais_id = d.tipo_pais_id\
                inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                left join (\
                    select a.planilla_id, sum(a.cantidad_cajas) as total_cajas, sum(a.cantidad_neveras) as total_neveras\
                    from (\
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, 1\
                      from inv_planillas_detalle_farmacias a\
                      union\
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, 2\
                      from inv_planillas_detalle_clientes a\
                      union \
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, 3\
                      from inv_planillas_detalle_empresas a \
                    ) as a group by 1\
                  ) as g on a.id = g.planilla_id\
                where a.id = :1 ; ";
    
  
     G.knex.raw(sql, {1: planilla_id}).then(function(resultado){
        callback(false, resultado.rows);     
    }).catch(function(err) {
        callback(err);
    });
};

PlanillasDespachosModel.prototype.consultar_documentos_planilla_despacho = function(planilla_id, termino_busqueda, callback) {

    var sql = " select * from (\
                    select \
                    '0' as tipo,\
                    'FARMACIAS' as descripcion_tipo,\
                    a.id,\
                    a.inv_planillas_despacho_id as planilla_id,\
                    a.empresa_id,\
                    e.descripcion as descripcion_destino,\
                    e.ubicacion as direccion_destino,\
                    a.prefijo,\
                    a.numero,\
                    b.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                    a.cantidad_cajas,\
                    a.cantidad_neveras,\
                    a.temperatura_neveras,\
                    a.observacion,\
                    a.usuario_id \
                    from inv_planillas_detalle_farmacias a\
                    inner join inv_bodegas_movimiento_despachos_farmacias b on a.empresa_id = b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                    inner join solicitud_productos_a_bodega_principal c on b.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id\
                    inner join bodegas d on c.farmacia_id = d.empresa_id and c.centro_utilidad = d.centro_utilidad and c.bodega = d.bodega\
                    inner join centros_utilidad e on d.empresa_id = e.empresa_id and d.centro_utilidad = e.centro_utilidad\
                    UNION \
                    select \
                    '1' as tipo,\
                    'CLIENTES' as descripcion_tipo,\
                    a.id,\
                    a.inv_planillas_despacho_id as planilla_id,\
                    a.empresa_id,\
                    d.nombre_tercero as descripcion_destino,\
                    d.direccion as direccion_destino,\
                    a.prefijo,\
                    a.numero,\
                    b.pedido_cliente_id as numero_pedido,\
                    a.cantidad_cajas,\
                    a.cantidad_neveras,\
                    a.temperatura_neveras,\
                    a.observacion,\
                    a.usuario_id\
                    from inv_planillas_detalle_clientes a\
                    inner join inv_bodegas_movimiento_despachos_clientes b on a.empresa_id = b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                    inner join ventas_ordenes_pedidos c on b.pedido_cliente_id = c.pedido_cliente_id\
                    inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id = d.tercero_id\
                    UNION\
                    select \
                    '2' as tipo,\
                    'EMPRESAS' as descripcion_tipo,\
                    a.id,\
                    a.inv_planillas_despacho_id as planilla_id,\
                    a.empresa_id,\
                    '' as descripcion_destino,\
                    '' as direccion_destino,\
                    a.prefijo,\
                    a.numero,\
                    0 as numero_pedido,\
                    a.cantidad_cajas,\
                    a.cantidad_neveras,\
                    a.temperatura_neveras,\
                    a.observacion,\
                    a.usuario_id\
                    from inv_planillas_detalle_empresas a\
                ) as a where a.planilla_id = :1 and ( a.descripcion_destino "+G.constants.db().LIKE+" :2 );";
    
    G.knex.raw(sql, {1: planilla_id,2:'%'+termino_busqueda+'%'}).then(function(resultado){
       
        callback(false, resultado.rows);                
    }).catch(function(err) {
        
        callback(err);
    });
  
};

/**
 * +Descripcion: Funcion encargada de ingresar planilla 
 * @param {type} pais_id
 * @param {type} departamento_id
 * @param {type} ciudad_id
 * @param {type} inv_transportador_id
 * @param {type} nombre_conductor
 * @param {type} observacion
 * @param {type} numero_guia_externo
 * @param {type} usuario_id
 * @param {type} callback
 * @returns {undefined} */
PlanillasDespachosModel.prototype.ingresar_planilla_despacho = function(pais_id, departamento_id, ciudad_id, inv_transportador_id, nombre_conductor, observacion, numero_guia_externo, usuario_id, callback) {

  
    var sql = " insert into  inv_planillas_despacho (pais_id, departamento_id, ciudad_id, inv_transportador_id, nombre_conductor, observacion, numero_guia_externo, usuario_id ) \
                values ( :1, :2, :3, :4, :5, :6, :7, :8 ) RETURNING id;";
     
    var parametros = {1:pais_id, 2:departamento_id, 3:ciudad_id, 4:inv_transportador_id, 5:nombre_conductor, 6:observacion, 7:numero_guia_externo, 8:usuario_id};
         
    G.knex.raw(sql,parametros).then(function(resultado){
       callback(false, resultado.rows,resultado);
    }).catch(function(err){
       callback(err);
    });
   
    
    
};

PlanillasDespachosModel.prototype.ingresar_documentos_planilla = function(tabla, planilla_id, empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id, callback) {

  
    var sql = " insert into " + tabla + " (inv_planillas_despacho_id, empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id) \
                values ( :1, :2, :3, :4, :5, :6, :7, :8, :9 )"; 
    
   var parametros = {1:planilla_id, 2:empresa_id, 3:prefijo, 4:numero, 5:cantidad_cajas, 6:cantidad_neveras, 7:temperatura_neveras, 8:observacion, 9:usuario_id};
         
    G.knex.raw(sql,parametros).then(function(resultado){
       callback(false, resultado.rows,resultado);
    }).catch(function(err){      
       callback(err);
    });
};

PlanillasDespachosModel.prototype.eliminar_documento_planilla = function(tabla, planilla_id, empresa_id, prefijo, numero, callback) {

    var sql = " delete from " + tabla + " where inv_planillas_despacho_id = :1 and empresa_id = :2 and  prefijo = :3 and  numero = :4"; 
    var parametros = {1:planilla_id, 2:empresa_id, 3:prefijo, 4:numero};
         
    G.knex.raw(sql,parametros).then(function(resultado){
       callback(false, resultado.rows,resultado);
    }).catch(function(err){
       callback(err);
    });
};

PlanillasDespachosModel.prototype.modificar_estado_planilla_despacho = function(planilla_id, estado, callback) {
    
  
    var sql = " update inv_planillas_despacho set estado = :2, fecha_despacho = NOW() where id = :1; ";   
   
    var parametros = {1:planilla_id, 2:estado};
         
    G.knex.raw(sql,parametros).then(function(resultado){
     
       callback(false, resultado.rows,resultado);
    }).catch(function(err){
      
       callback(err);
    });
};



// Consultar las cajas y neveras de un documento (se usa en aprobacion de despachos y planillas)
PlanillasDespachosModel.prototype.consultarCantidadCajaNevera = function(obj, callback){
    var params = {1: obj.empresa_id, 2: obj.prefijo, 3: obj.numero};
    var sql = "";
    
    if(obj.esPlanillas){
        sql = " SELECT aa.cantidad_cajas as total_cajas, aa.cantidad_neveras as total_neveras\
                    FROM aprobacion_despacho_planillas aa  where aa.empresa_id = :1 \
                    AND  aa.prefijo = :2 AND aa.numero = :3; ";
    } else {
        
        sql = " SELECT\
                    (\
                            SELECT coalesce(max(b.numero_caja),'0') as total_cajas\
                            FROM inv_bodegas_movimiento_d b  where b.empresa_id = :1\
                            AND  b.prefijo = :2 AND b.numero = :3  and b.tipo_caja = '0'\
                    ) as total_cajas,\
                    (\
                            SELECT coalesce(max(b.numero_caja),'0') as total_neveras\
                            FROM inv_bodegas_movimiento_d b  where b.empresa_id = :1\
                            AND  b.prefijo = :2 AND b.numero = :3  and b.tipo_caja = '1'\
                    ) as total_neveras; ";
    }
    
 
    G.knex.raw(sql,params).then(function(resultado){
        callback(false, resultado.rows);
        
    }).catch(function(err) {
        callback(err);
    });
};




/**
 *@author Cristian Ardila
 *@fecha  06/02/2016
 *+Descripcion Metodo que contiene el SQL encargado de consultar el total de
 *             numero de cajas de un grupo de documentos  
 *             
 **/ 
PlanillasDespachosModel.prototype.gestionarLios = function(obj, callback){
    
    var lenght = obj.documentos;
    var vEmpresaId = [];
    var vNumero = [];
    var vPrefijo = [];
 
    for(var i in lenght) {

            vEmpresaId.push("'"+obj.documentos[i].empresa_id+"'")
            vNumero.push("'"+obj.documentos[i].numero+"'")
            vPrefijo.push("'"+obj.documentos[i].prefijo+"'")

    };
        
  
   var sql = "SELECT coalesce(sum(aa.cantidad_cajas),'0') as totalCajas, coalesce(sum(aa.cantidad_neveras),'0') as totalNeveras \
               FROM aprobacion_despacho_planillas aa\
               WHERE aa.empresa_id::varchar IN ("+vEmpresaId.toString()+") AND  aa.prefijo::varchar IN ("+vPrefijo.toString()+") AND aa.numero::varchar IN ("+vNumero.toString()+") ;";
    
    G.knex.raw(sql, {}).then(function(resultado){
        
        callback(false, resultado.rows);
        
    }).catch(function(err) {
       
        callback(err);
    });
};




/**
 *@author Cristian Ardila
 *@fecha  06/02/2016
 *+Descripcion Metodo que contiene el SQL encargado de atualizar el numero de lio
 *             en un grupo de EFC
 *              
 *             
 **/
PlanillasDespachosModel.prototype.insertarLioDocumento = function(obj, callback) {
   
    G.knex.transaction(function(transaccion) {  
          obj.transaccion = transaccion;
          G.Q.nfcall(__insertarLioDocumento, obj).then(function(){

             transaccion.commit();

          }).fail(function(err){

             transaccion.rollback(err);

          }).done();

      }).then(function(resultado){

         callback(false,resultado);

      }).catch(function(err){

         callback(err);
      }).done(); 
    
    
};


function __insertarLioDocumento(obj, callback){
     
     var documento =  obj.documentos[0];
     var sql = "";
     if(!documento){
        callback(false);
        return;
     }
     var observacion = obj.observacion.lenght ===0? documento.prefijo + " - " + documento.numero:"'"+obj.observacion+"'";
     
   if(obj.tabla === "inv_planillas_detalle_farmacias" || obj.tabla === "inv_planillas_detalle_clientes"){
    
      sql = "INSERT INTO "+obj.tabla+" (\n\
                inv_planillas_despacho_id, \n\
                empresa_id, \
                prefijo,\
                numero, \
                cantidad_cajas,\
                cantidad_neveras,\
                temperatura_neveras,\
                observacion, \
                usuario_id,\
                fecha_registro,\
                numero_lios)\
                (select "+obj.numeroGuia+" as inv_planillas_despacho_id,\
                empresa_id,\
                prefijo,\
                numero,\
                "+obj.totalCaja+" as totalCajas,\
                "+obj.cantidadNeveras+" as cantidad_neveras,\
                0 as temperatura_neveras,\
                "+observacion+" as observacion,\
                "+parseInt(obj.usuario_id)+ " as usuario_id,\
                now() as fecha_registro,\
                "+obj.cantidadLios+" as numero_lios \
                 FROM inv_bodegas_movimiento_d\
                 WHERE empresa_id = :1\
                 AND prefijo= :2\
                 AND numero = :3\
                 GROUP BY 1,2,3,4,6,7,8,9,10,1)";
    
   }else{
       
        sql = "INSERT INTO inv_planillas_detalle_empresas(\
                inv_planillas_despacho_id, \
                empresa_id, \
                prefijo,\
                numero, \
                cantidad_cajas,\
                cantidad_neveras,\
                temperatura_neveras,\
                observacion, \
                usuario_id,\
                fecha_registro,\
                numero_lios\
                )\
                (select "+obj.numeroGuia+" as inv_planillas_despacho_id,\
                empresa_id,\
                prefijo,\
                numero,\
                coalesce(max(cantidad_cajas),'0') as totalCajas,\
                coalesce(max(cantidad_neveras),'0') as cantidad_neveras,\
                0 as temperatura_neveras,\
                "+observacion+" as observacion,\
                "+parseInt(obj.usuario_id)+ " as usuario_id,\
                now() as fecha_registro,\
                "+obj.cantidadLios+" as numero_lios \
                 FROM aprobacion_despacho_planillas\
                 WHERE empresa_id = :1\
                 AND prefijo= :2\
                 AND numero = :3\
                 AND sw_otras_salidas = '1'\
                 GROUP BY 1,2,3,4,6,7,8,9,10,1)";
   }
   
    var query = G.knex.raw(sql, {1: documento.empresa_id, 2: documento.prefijo, 3: documento.numero});
    
    if(obj.transaccion) query.transacting(obj.transaccion);
      
    query.then(function(resultado){       
        
        obj.documentos.splice(0,1);
        __insertarLioDocumento(obj, callback);
        
    }).catch(function(err){
       
        callback(err);   
    });
    
}
    


module.exports = PlanillasDespachosModel;