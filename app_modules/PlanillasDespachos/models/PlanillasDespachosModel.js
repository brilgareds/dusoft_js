var PlanillasDespachosModel = function() {

};


PlanillasDespachosModel.prototype.listar_planillas_despachos = function(termino_busqueda, callback) {


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
                a.fecha_registro,\
                a.fecha_despacho\
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
                )";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

PlanillasDespachosModel.prototype.consultar_planilla_despacho = function(termino_busqueda, callback) {


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
                a.fecha_registro,\
                a.fecha_despacho\
                from inv_planillas_despacho a \
                inner join inv_transportadoras b on a.inv_transportador_id = b.transportadora_id\
                inner join tipo_mpios c on a.ciudad_id = c.tipo_mpio_id and a.departamento_id = c.tipo_dpto_id and a.pais_id = c.tipo_pais_id\
                inner join tipo_dptos d on c.tipo_dpto_id = d.tipo_dpto_id and c.tipo_pais_id = d.tipo_pais_id\
                inner join tipo_pais e on d.tipo_pais_id = e.tipo_pais_id\
                inner join system_usuarios f on a.usuario_id = f.usuario_id\
                where a.id = $1 ";
    
    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = PlanillasDespachosModel;