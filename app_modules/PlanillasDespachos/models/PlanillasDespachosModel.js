var PlanillasDespachosModel = function() {

};


PlanillasDespachosModel.prototype.listar_planillas_despachos = function(fecha_inicial, fecha_final, termino_busqueda, callback) {


    var sql = " select \
                a.id, \
                a.id as numero_guia,\
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
                a.usuario_id,\
                f.nombre as nombre_usuario,\
                a.estado,\
                case when a.estado = 0 then 'Anulada' \
                     when a.estado = 1 then 'Activa' \
                     when a.estado = 2 then 'Despachada' end as descripcion_estado, \
                To_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro,\
                To_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho\
                from inv_planillas_despacho a \
                inner join inv_transportadoras b on a.inv_transportador_id = b.transportadora_id\
                inner join tipo_mpios c on a.ciudad_id = c.tipo_mpio_id and a.departamento_id = c.tipo_dpto_id and a.pais_id = c.tipo_pais_id\
                inner join tipo_dptos d on c.tipo_dpto_id = d.tipo_dpto_id and c.tipo_pais_id = d.tipo_pais_id\
                inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                where a.fecha_registro between $1 and $2 \
                and (\
                    a.id ilike $3 or\
                    b.descripcion ilike $3 or\
                    b.placa_vehiculo ilike $3 or\
                    e.pais ilike $3 or\
                    d.departamento ilike $3 or\
                    c.municipio ilike $3 or\
                    a.nombre_conductor ilike $3 \
                ) order by a.id DESC; ";

    G.db.query(sql, [fecha_inicial, fecha_final, "%"+termino_busqueda+"%"], function(err, rows, result) {
        callback(err, rows);
    });
};

// Consultar los documentos de despachos de una farmacia
PlanillasDespachosModel.prototype.consultar_documentos_despachos_por_farmacia = function(empresa_id, farmacia_id, centro_utilidad_id, termino_busqueda, callback){
    
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
                where a.empresa_id = $1 and b.farmacia_id = $2 and b.centro_utilidad = $3 and b.estado in ('2') and\
                (\
                    a.prefijo || ' ' || a.numero ilike $4 or\
                    a.numero ilike $4 or\
                    a.solicitud_prod_a_bod_ppal_id ilike $4 \
                )\
                order by a.fecha_registro desc; ";
    
    G.db.query(sql, [empresa_id, farmacia_id, centro_utilidad_id, "%"+termino_busqueda+"%"], function(err, rows, result) {
        callback(err, rows);
    });    
};

// Consultar los documentos de despacho de un cliente 
PlanillasDespachosModel.prototype.consultar_documentos_despachos_por_cliente = function(empresa_id, tipo_id, tercero_id, termino_busqueda, callback){
    
    var sql = " select \
                '1' as tipo,\
                'CLIENTES' as descripcion_tipo,\
                a.empresa_id,\
                a.prefijo,\
                a.numero,\
                a.pedido_cliente_id as numero_pedido,\
                a.fecha_registro\
                from inv_bodegas_movimiento_despachos_clientes a\
                where a.empresa_id= $1 and a.tipo_id_tercero = $2 and a.tercero_id = $3 and \
                ( \
                    a.prefijo || ' ' || a.numero ilike $4 or \
                    a.numero ilike $4 or \
                    a.pedido_cliente_id ilike $4 \
                )\
                order by a.fecha_registro desc";
    
    G.db.query(sql, [empresa_id, tipo_id, tercero_id, "%"+termino_busqueda+"%"], function(err, rows, result) {
        callback(err, rows);

    });    
};

PlanillasDespachosModel.prototype.consultar_planilla_despacho = function(planilla_id, callback) {


    var sql = " select \
                a.id, \
                a.id as numero_guia,\
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
                a.usuario_id,\
                f.nombre as nombre_usuario,\
                a.estado,\
                case when a.estado = 0 then 'Anulada' \
                     when a.estado = 1 then 'Activa' \
                     when a.estado = 2 then 'Despachada' end as descripcion_estado, \
                To_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro,\
                To_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho\
                from inv_planillas_despacho a \
                inner join inv_transportadoras b on a.inv_transportador_id = b.transportadora_id\
                inner join tipo_mpios c on a.ciudad_id = c.tipo_mpio_id and a.departamento_id = c.tipo_dpto_id and a.pais_id = c.tipo_pais_id\
                inner join tipo_dptos d on c.tipo_dpto_id = d.tipo_dpto_id and c.tipo_pais_id = d.tipo_pais_id\
                inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                where a.id = $1 ; ";
    
    G.db.query(sql, [planilla_id], function(err, rows, result) {
        callback(err, rows);
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
                    a.observacion\
                    from inv_planillas_detalle_farmacias a\
                    inner join inv_bodegas_movimiento_despachos_farmacias b on a.empresa_id = b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                    inner join solicitud_productos_a_bodega_principal c on b.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id\
                    inner join bodegas d on c.farmacia_id = d.empresa_id and c.centro_utilidad = d.centro_utilidad and c.bodega = d.bodega\
                    inner join centros_utilidad e on d.empresa_id = e.empresa_id and d.centro_utilidad = e.centro_utilidad\
                    UNION\
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
                    a.observacion\
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
                    a.observacion\
                    from inv_planillas_detalle_empresas a\
                ) as a where a.planilla_id = $1 and ( a.descripcion_destino ilike $2 );";
    
    G.db.query(sql, [planilla_id, '%'+termino_busqueda+'%'], function(err, rows, result) {
        callback(err, rows);
    });
};


PlanillasDespachosModel.prototype.ingresar_planilla_despacho = function(pais_id, departamento_id, ciudad_id, inv_transportador_id, nombre_conductor, observacion, usuario_id, callback) {

    var sql = " insert into  inv_planillas_despacho (pais_id, departamento_id, ciudad_id, inv_transportador_id, nombre_conductor, observacion, usuario_id ) \
                values ($1, $2, $3, $4, $5, $6, $7) RETURNING id;";
     
    G.db.query(sql, [pais_id, departamento_id, ciudad_id, inv_transportador_id, nombre_conductor, observacion, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};

PlanillasDespachosModel.prototype.ingresar_documentos_planilla = function(tabla, planilla_id, empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id, callback) {

    var sql = " insert into " + tabla + " (inv_planillas_despacho_id, empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id) \
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9)"; 
    
    G.db.query(sql, [planilla_id, empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};

PlanillasDespachosModel.prototype.eliminar_documento_planilla = function(tabla, planilla_id, empresa_id, prefijo, numero, callback) {

    var sql = " delete from " + tabla + " where inv_planillas_despacho_id = $1 and empresa_id = $2 and  prefijo = $3 and  numero =$4"; 
    
    G.db.query(sql, [planilla_id, empresa_id, prefijo, numero], function(err, rows, result) {
        callback(err, rows, result);
    });
};

PlanillasDespachosModel.prototype.modificar_estado_planilla_despacho = function(planilla_id, estado, callback) {

    var sql = " update inv_planillas_despacho set estado = $2 , fecha_despacho = NOW() where id = $1 ; "; 
    
    G.db.query(sql, [planilla_id, estado], function(err, rows, result) {
        callback(err, rows, result);
    });
};



module.exports = PlanillasDespachosModel;