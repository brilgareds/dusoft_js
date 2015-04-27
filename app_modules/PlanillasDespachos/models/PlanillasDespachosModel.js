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
                ); ";

    G.db.query(sql, [fecha_inicial, fecha_final, "%"+termino_busqueda+"%"], function(err, rows, result) {
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



module.exports = PlanillasDespachosModel;