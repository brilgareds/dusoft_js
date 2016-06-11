var DrAriasModel = function() {

};

DrAriasModel.prototype.listarDrArias = function(obj, callback) {
    
    /*callback(false);
    
    var sql = "select * from prueba_andres";
    var sql = "select * from((  select  \
                    distinct fdm.formula_id, \
                    efe.formula_papel, \
                    i.descripcion_tipo_formula, \
                    epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente, \
                    efe.paciente_id, \
                    ip.codigo_cum, \
                    fc_descripcion_producto(bdd.codigo_producto) as producto, \
                    te.nombre_tercero as medico, \
                    CAST(efe.tercero_id as text) as tercero_id, \
                    (select descripcion from especialidades esp  inner join profesionales_especialidades pe ON  ( pe.especialidad = esp.especialidad) where  te.tercero_id = pe.tercero_id and te.tipo_id_tercero = pe.tipo_id_tercero limit 1) as especialidad, \
                    bd.fecha_registro  as fecha, \
                    efe.fecha_formula, \
                    bdd.bodegas_doc_id, \
                    bdd.codigo_producto, \
                    bdd.cantidad, \
                    bdd.total_costo, \
                    dn.bodega, \
                    (select descripcion from bodegas where bodega = dn.bodega and empresa_id = dn.empresa_id and centro_utilidad =dn.centro_utilidad) as nom_bode, \
                    dn.centro_utilidad, \
                    dn.empresa_id, \
                    bd.bodegas_doc_id, \
                    su.nombre as usuario_digita, \
                    efe.plan_id, \
                    efe.rango, \
                    pl.plan_descripcion, \
                    case when epaten.eps_punto_atencion_nombre !='' then epaten.eps_punto_atencion_nombre else pl.plan_descripcion END as eps_punto_atencion_nombre, \
                    (case when ip.sw_generico = '1' then (bdd.total_costo *1.35) else (bdd.total_costo*1.25) end) as precio, \
                    (case when ip.sw_generico = '1' then ((bdd.total_costo*bdd.cantidad)*1.35) else ((bdd.total_costo*bdd.cantidad)*1.25) end) as total\
                    from bodegas_doc_numeraciones dn  \
                    INNER JOIN bodegas_documentos bd on dn.bodegas_doc_id=bd.bodegas_doc_id\
                    INNER JOIN bodegas_documentos_d bdd on bd.bodegas_doc_id = bdd.bodegas_doc_id and bd.numeracion =bdd.numeracion\
                    INNER JOIN esm_formulacion_despachos_medicamentos fdm ON bd.bodegas_doc_id =fdm.bodegas_doc_id and bd.numeracion =fdm.numeracion\
                    INNER JOIN inventarios_productos ip on ip.codigo_producto = bdd.codigo_producto\
                    INNER JOIN esm_formula_externa efe on efe.formula_id  =fdm.formula_id\
                    INNER JOIN system_usuarios su on (efe.usuario_id=su.usuario_id) \
                    INNER JOIN planes pl on efe.plan_id= pl.plan_id  \
                    left JOIN eps_afiliados epa  on epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente\
                    and eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1) \
                    left join eps_afiliados_datos epad on efe.paciente_id=epad.afiliado_id and efe.tipo_id_paciente=epad.afiliado_tipo_id\
                    left JOIN eps_puntos_atencion epaten on epaten.eps_punto_atencion_id = epa.eps_punto_atencion_id\
                    inner join esm_tipos_formulas i on i.tipo_formula_id = efe.tipo_formula\
                    inner join terceros te on efe.tipo_id_tercero = te.tipo_id_tercero and efe.tercero_id = te.tercero_id\
                    where\
                    dn.empresa_id= 'FD' and efe.sw_estado not in('2') \
                    and cast(bd.fecha_registro as date) between '01-01-2016' AND '01-02-2016' \
                    and bdd.total_costo >0 ) \
                    union ( \
                    select\
                    distinct dmp.formula_id, \
                    efe.formula_papel, \
                    i.descripcion_tipo_formula, \
                    epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente, \
                    efe.paciente_id, \
                    ip.codigo_cum, \
                    fc_descripcion_producto(bdd.codigo_producto) as producto, \
                    te.nombre_tercero as medico, \
                    CAST(efe.tercero_id as text) as tercero_id, \
                    (select descripcion from especialidades esp  inner join profesionales_especialidades pe ON  ( pe.especialidad = esp.especialidad) where  te.tercero_id = pe.tercero_id and te.tipo_id_tercero = pe.tipo_id_tercero limit 1) as especialidad, \
                    bd.fecha_registro  as fecha, \
                    efe.fecha_formula, \
                    bdd.bodegas_doc_id, \
                    bdd.codigo_producto, \
                    bdd.cantidad, \
                    bdd.total_costo, \
                    dn.bodega, \
                    (select descripcion from bodegas where bodega = dn.bodega and empresa_id = dn.empresa_id and centro_utilidad =dn.centro_utilidad) as nom_bode, \
                    dn.centro_utilidad, \
                    dn.empresa_id, \
                    bd.bodegas_doc_id, \
                    su.nombre as usuario_digita, \
                    efe.plan_id, \
                    efe.rango, \
                    pl.plan_descripcion, \
                    case when epaten.eps_punto_atencion_nombre !='' then epaten.eps_punto_atencion_nombre else pl.plan_descripcion END as eps_punto_atencion_nombre, \
                    (case when ip.sw_generico = '1' then (bdd.total_costo *1.35) else (bdd.total_costo*1.25) end) as precio, \
                    (case when ip.sw_generico = '1' then ((bdd.total_costo*bdd.cantidad)*1.35) else ((bdd.total_costo*bdd.cantidad)*1.25) end) as total\
                    from bodegas_doc_numeraciones dn\
                    INNER JOIN bodegas_documentos bd on dn.bodegas_doc_id=bd.bodegas_doc_id\
                    INNER JOIN bodegas_documentos_d bdd on bd.bodegas_doc_id = bdd.bodegas_doc_id and bd.numeracion =bdd.numeracion\
                    INNER JOIN esm_formulacion_despachos_medicamentos_pendientes dmp ON bd.bodegas_doc_id =dmp.bodegas_doc_id and bd.numeracion =dmp.numeracion\
                    INNER JOIN inventarios_productos ip on ip.codigo_producto = bdd.codigo_producto\
                    INNER JOIN esm_formula_externa efe on efe.formula_id  =dmp.formula_id\
                    INNER JOIN system_usuarios su on (efe.usuario_id=su.usuario_id) \
                    INNER JOIN planes pl on efe.plan_id= pl.plan_id\
                    left JOIN eps_afiliados epa  on epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente\
                    and eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente and eps_punto_atencion_id!=''  order by 1 desc limit 1) \
                    left join eps_afiliados_datos epad on efe.paciente_id=epad.afiliado_id and efe.tipo_id_paciente=epad.afiliado_tipo_id\
                    left JOIN eps_puntos_atencion epaten on epaten.eps_punto_atencion_id = epa.eps_punto_atencion_id\
                    inner join esm_tipos_formulas i on i.tipo_formula_id = efe.tipo_formula\
                    inner join terceros te on efe.tipo_id_tercero = te.tipo_id_tercero and efe.tercero_id = te.tercero_id\
                    inner JOIN profesionales prf ON efe.tercero_id =  prf.tercero_id and efe.tipo_id_tercero = prf.tipo_id_tercero\
                    where\
                    dn.empresa_id= 'FD' and  efe.sw_estado not in('2') \
                    and cast(bd.fecha_registro as date) between '01-01-2016' AND '01-02-2016' \
                    and bdd.total_costo >0) \
                    union( \
                    select\
                    distinct d.evolucion_id as formula_id, \
                    CAST(hfc.numero_formula as text) as formula_papel, \
                    i.descripcion_tipo_formula, \
                    epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente, \
                    hfc.paciente_id, \
                    w.codigo_cum, \
                    fc_descripcion_producto(c.codigo_producto) as producto, \
                    'medico' as medico, \
                    CAST(hfc.medico_id as text) as tercero_id, \
                    'especialidad' as especialidad, \
                    b.fecha_registro  as fecha, \
                    hfc.fecha_registro as fecha_formula, \
                    c.bodegas_doc_id, \
                    c.codigo_producto, \
                    c.cantidad, \
                    c.total_costo, \
                    a.bodega, \
                    (select descripcion from bodegas where bodega = a.bodega and empresa_id = a.empresa_id and centro_utilidad =a.centro_utilidad) as nom_bode, \
                    a.centro_utilidad, \
                    a.empresa_id, \
                    a.bodegas_doc_id, \
                    su.nombre as usuario_digita, \
                    g.plan_id, \
                    '' as rango, \
                    g.plan_descripcion, \
                    case when h.eps_punto_atencion_nombre !='' then h.eps_punto_atencion_nombre else g.plan_descripcion END as eps_punto_atencion_nombre, \
                    (case when w.sw_generico = '1' then (c.total_costo *1.35) else (c.total_costo*1.25) end) as precio, \
                    (case when w.sw_generico = '1' then ((c.total_costo*c.cantidad)*1.35) else ((c.total_costo*c.cantidad)*1.25) end) as total\
                    from bodegas_doc_numeraciones a  \
                    inner JOIN bodegas_documentos b on a.bodegas_doc_id=b.bodegas_doc_id\
                    INNER JOIN system_usuarios su on (b.usuario_id=su.usuario_id) \
                    inner JOIN bodegas_documentos_d c on b.bodegas_doc_id = c.bodegas_doc_id and b.numeracion =c.numeracion\
                    inner JOIN hc_formulacion_despachos_medicamentos_pendientes d on b.bodegas_doc_id =d.bodegas_doc_id and b.numeracion =d.numeracion\
                    inner JOIN inventarios_productos w on w.codigo_producto = c.codigo_producto\
                    inner JOIN hc_formulacion_antecedentes_optima hfc on d.evolucion_id = hfc.evolucion_id\
                    left join eps_afiliados e on e.afiliado_id= hfc.paciente_id and e.afiliado_tipo_id= hfc.tipo_id_paciente\
                    and e.eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=hfc.paciente_id and epa.afiliado_tipo_id=hfc.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1) \
                    left join eps_afiliados_datos epad on hfc.paciente_id=epad.afiliado_id and hfc.tipo_id_paciente=epad.afiliado_tipo_id\
                    left join planes_rangos f on e.plan_atencion = f.plan_id\
                    left join planes g on f.plan_id= g.plan_id\
                    left join eps_puntos_atencion h on h.eps_punto_atencion_id = e.eps_punto_atencion_id\
                    inner join hc_evoluciones he on d.evolucion_id=he.evolucion_id\
                    inner join esm_tipos_formulas i on i.tipo_formula_id = he.tipo_formula\
                    where  \
                    a.empresa_id= 'FD' \
                    and c.total_costo >0\
                    and cast(b.fecha_registro as date) between '01-01-2016' AND '01-02-2016' )   \
                    union(  select  \
                    distinct d.evolucion_id as formula_id, \
                    CAST(hfc.numero_formula as text)  as formula_papel, \
                    i.descripcion_tipo_formula, \
                    epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente, \
                    hfc.paciente_id, \
                    w.codigo_cum, \
                    fc_descripcion_producto(c.codigo_producto) as producto, \
                    'medico' as medico, \
                    CAST(hfc.medico_id as text) as tercero_id, \
                    'especialidad' as especialidad, \
                    b.fecha_registro as fecha, \
                    hfc.fecha_registro as fecha_formula, \
                    c.bodegas_doc_id, \
                    c.codigo_producto, \
                    c.cantidad, \
                    c.total_costo, \
                    a.bodega, \
                    (select descripcion from bodegas where bodega = a.bodega and empresa_id = a.empresa_id and centro_utilidad =a.centro_utilidad) as nom_bode, \
                    a.centro_utilidad, \
                    a.empresa_id, \
                    a.bodegas_doc_id, \
                    su.nombre as usuario_digita, \
                    g.plan_id, \
                    '' as rango, \
                    g.plan_descripcion, \
                    case when h.eps_punto_atencion_nombre !='' then h.eps_punto_atencion_nombre else g.plan_descripcion END as eps_punto_atencion_nombre, \
                    (case when w.sw_generico = '1' then (c.total_costo *1.35) else (c.total_costo*1.25) end) as precio, \
                    (case when w.sw_generico = '1' then ((c.total_costo*c.cantidad)*1.35) else ((c.total_costo*c.cantidad)*1.25) end) as total\
                    from bodegas_doc_numeraciones as a  \
                    inner JOIN bodegas_documentos b on a.bodegas_doc_id=b.bodegas_doc_id  \
                    INNER JOIN system_usuarios su on (b.usuario_id=su.usuario_id)   \
                    inner JOIN bodegas_documentos_d c on b.bodegas_doc_id = c.bodegas_doc_id and b.numeracion =c.numeracion  \
                    inner JOIN hc_formulacion_despachos_medicamentos d on b.bodegas_doc_id =d.bodegas_doc_id and b.numeracion =d.numeracion  \
                    inner JOIN inventarios_productos w on w.codigo_producto = c.codigo_producto  \
                    inner JOIN hc_formulacion_antecedentes_optima hfc on d.evolucion_id = hfc.evolucion_id  \
                    left join eps_afiliados e on e.afiliado_id= hfc.paciente_id and e.afiliado_tipo_id= hfc.tipo_id_paciente  \
                    and e.eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=hfc.paciente_id and epa.afiliado_tipo_id=hfc.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1)  \
                    left join eps_afiliados_datos epad on hfc.paciente_id=epad.afiliado_id and hfc.tipo_id_paciente=epad.afiliado_tipo_id  \
                    left join planes_rangos f on e.plan_atencion = f.plan_id  \
                    left join planes g on f.plan_id= g.plan_id  \
                    left join eps_puntos_atencion h on h.eps_punto_atencion_id = e.eps_punto_atencion_id \
                    inner join hc_evoluciones he on d.evolucion_id=he.evolucion_id \
                    inner join esm_tipos_formulas i on i.tipo_formula_id = he.tipo_formula \
                    where \
                    a.empresa_id= 'FD'   and c.total_costo >0 \
                    and cast(b.fecha_registro as date) between '01-01-2016' AND '01-02-2016' )) as w \
                    where \
                    true  \
                    order by 18,24,3,7";
    
    var sql = "select * from esm_formulacion_despachos_medicamentos_view\
                union\
                select * from esm_formulacion_despachos_medicamentos_pendientes_view\
                union\
                select * from hc_formulacion_despachos_medicamentos_pendientes_view\
                union\
                select * from hc_formulacion_despachos_medicamentos_view";
    
    var query = G.knex.raw(sql);
    query.timeout(820000).then(function(resultado) {
       console.log("resultado >>>>>>>>>>>>>>>>> ",resultado.rows.length);
       //callback(false, resultado.rows);
        
    }).catch (function(err) {
        console.log("error bd >>>>>>>>>>>>>>>>>>>>>>>>>>>>",err);
       callback(err);
    });
    */
    
    
    
   var that = this;
   var cache;
   var filtro = {fecha_inicial:'09-06-2016', fecha_final:'10-06-2016', dias:1};
   
   callback(false);
   
   G.redis.del("dr_arias");
   G.Q.ninvoke(G.redis, "get", "dr_arias").then(function(resultado){
       
        cache = (!resultado)? false : true;
        if(!resultado){
            return G.Q.ninvoke(that, "realizarReportePorRango", {filtro:filtro});
        } else {
           obj.registros = JSON.parse(resultado);
           return G.Q.nfcall(__filtrarDrAriasCache, obj);
        }
       
   }).then(function(resultado){
        if(!cache){
            G.redis.setex("dr_arias", 21600, JSON.stringify(resultado));
            //callback(false, resultado.rows);
            console.log("datos guardados en cache ", resultado.length);
        } else {
           console.log("datos guardados en cache ", resultado.length);
          //  callback(false, resultado);
        }
       
   }).fail(function(err){
        console.log("error bd >>>>>>>>>>>>>>>>>>>>>>>>>>>>",err);
        callback(err);
   }).done();
    

};


DrAriasModel.prototype.realizarReportePorRango = function(obj, callback) {
    
    var that = this;
    var formato = 'DD-mm-YYYY';
    var fechaInicial = G.moment(obj.filtro.fecha_inicial, formato);
    var fechaFinal   = G.moment(obj.filtro.fecha_inicial, formato);
    var diasDelMes = G.moment(obj.filtro.fecha_inicial, formato).daysInMonth();
    var suma = fechaFinal.date() + obj.filtro.dias;
   
    if(!obj.resultado){
       console.log("setting new result");
       obj.resultado = [];
    }
   
    //Determina si se pueden sumar los dias a la fecha, de lo contrario se suma la diferencia
    if(suma <= diasDelMes){
        fechaFinal.add(obj.filtro.dias, 'days');
    } else {//diferencia
        var dias =  obj.filtro.dias - (suma - diasDelMes);
        fechaFinal.add( dias, 'days');
    }

    console.log("fecha a buscar ", fechaInicial.format(formato), " a ", fechaFinal.format(formato));
   

   var sql = "\
         select * from((  select  \
                    distinct fdm.formula_id, \
                    efe.formula_papel, \
                    i.descripcion_tipo_formula, \
                    epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente, \
                    efe.paciente_id, \
                    ip.codigo_cum, \
                    fc_descripcion_producto(bdd.codigo_producto) as producto, \
                    te.nombre_tercero as medico, \
                    CAST(efe.tercero_id as text) as tercero_id, \
                    (select descripcion from especialidades esp  inner join profesionales_especialidades pe ON  ( pe.especialidad = esp.especialidad) where  te.tercero_id = pe.tercero_id and te.tipo_id_tercero = pe.tipo_id_tercero limit 1) as especialidad, \
                    bd.fecha_registro  as fecha, \
                    efe.fecha_formula, \
                    bdd.bodegas_doc_id, \
                    bdd.codigo_producto, \
                    bdd.cantidad, \
                    bdd.total_costo, \
                    dn.bodega, \
                    (select descripcion from bodegas where bodega = dn.bodega and empresa_id = dn.empresa_id and centro_utilidad =dn.centro_utilidad) as nom_bode, \
                    dn.centro_utilidad, \
                    dn.empresa_id, \
                    bd.bodegas_doc_id, \
                    su.nombre as usuario_digita, \
                    efe.plan_id, \
                    efe.rango, \
                    pl.plan_descripcion, \
                    case when epaten.eps_punto_atencion_nombre !='' then epaten.eps_punto_atencion_nombre else pl.plan_descripcion END as eps_punto_atencion_nombre, \
                    (case when ip.sw_generico = '1' then (bdd.total_costo *1.35) else (bdd.total_costo*1.25) end) as precio, \
                    (case when ip.sw_generico = '1' then ((bdd.total_costo*bdd.cantidad)*1.35) else ((bdd.total_costo*bdd.cantidad)*1.25) end) as total\
                    from bodegas_doc_numeraciones dn  \
                    INNER JOIN bodegas_documentos bd on dn.bodegas_doc_id=bd.bodegas_doc_id\
                    INNER JOIN bodegas_documentos_d bdd on bd.bodegas_doc_id = bdd.bodegas_doc_id and bd.numeracion =bdd.numeracion\
                    INNER JOIN esm_formulacion_despachos_medicamentos fdm ON bd.bodegas_doc_id =fdm.bodegas_doc_id and bd.numeracion =fdm.numeracion\
                    INNER JOIN inventarios_productos ip on ip.codigo_producto = bdd.codigo_producto\
                    INNER JOIN esm_formula_externa efe on efe.formula_id  =fdm.formula_id\
                    INNER JOIN system_usuarios su on (efe.usuario_id=su.usuario_id) \
                    INNER JOIN planes pl on efe.plan_id= pl.plan_id  \
                    left JOIN eps_afiliados epa  on epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente\
                    and eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1) \
                    left join eps_afiliados_datos epad on efe.paciente_id=epad.afiliado_id and efe.tipo_id_paciente=epad.afiliado_tipo_id\
                    left JOIN eps_puntos_atencion epaten on epaten.eps_punto_atencion_id = epa.eps_punto_atencion_id\
                    inner join esm_tipos_formulas i on i.tipo_formula_id = efe.tipo_formula\
                    inner join terceros te on efe.tipo_id_tercero = te.tipo_id_tercero and efe.tercero_id = te.tercero_id\
                    where\
                    dn.empresa_id= 'FD' and efe.sw_estado not in('2') \
                    and cast(bd.fecha_registro as date) between :1 AND :2 \
                    and bdd.total_costo >0 ) \
                    union ( \
                    select\
                    distinct dmp.formula_id, \
                    efe.formula_papel, \
                    i.descripcion_tipo_formula, \
                    epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente, \
                    efe.paciente_id, \
                    ip.codigo_cum, \
                    fc_descripcion_producto(bdd.codigo_producto) as producto, \
                    te.nombre_tercero as medico, \
                    CAST(efe.tercero_id as text) as tercero_id, \
                    (select descripcion from especialidades esp  inner join profesionales_especialidades pe ON  ( pe.especialidad = esp.especialidad) where  te.tercero_id = pe.tercero_id and te.tipo_id_tercero = pe.tipo_id_tercero limit 1) as especialidad, \
                    bd.fecha_registro  as fecha, \
                    efe.fecha_formula, \
                    bdd.bodegas_doc_id, \
                    bdd.codigo_producto, \
                    bdd.cantidad, \
                    bdd.total_costo, \
                    dn.bodega, \
                    (select descripcion from bodegas where bodega = dn.bodega and empresa_id = dn.empresa_id and centro_utilidad =dn.centro_utilidad) as nom_bode, \
                    dn.centro_utilidad, \
                    dn.empresa_id, \
                    bd.bodegas_doc_id, \
                    su.nombre as usuario_digita, \
                    efe.plan_id, \
                    efe.rango, \
                    pl.plan_descripcion, \
                    case when epaten.eps_punto_atencion_nombre !='' then epaten.eps_punto_atencion_nombre else pl.plan_descripcion END as eps_punto_atencion_nombre, \
                    (case when ip.sw_generico = '1' then (bdd.total_costo *1.35) else (bdd.total_costo*1.25) end) as precio, \
                    (case when ip.sw_generico = '1' then ((bdd.total_costo*bdd.cantidad)*1.35) else ((bdd.total_costo*bdd.cantidad)*1.25) end) as total\
                    from bodegas_doc_numeraciones dn\
                    INNER JOIN bodegas_documentos bd on dn.bodegas_doc_id=bd.bodegas_doc_id\
                    INNER JOIN bodegas_documentos_d bdd on bd.bodegas_doc_id = bdd.bodegas_doc_id and bd.numeracion =bdd.numeracion\
                    INNER JOIN esm_formulacion_despachos_medicamentos_pendientes dmp ON bd.bodegas_doc_id =dmp.bodegas_doc_id and bd.numeracion =dmp.numeracion\
                    INNER JOIN inventarios_productos ip on ip.codigo_producto = bdd.codigo_producto\
                    INNER JOIN esm_formula_externa efe on efe.formula_id  =dmp.formula_id\
                    INNER JOIN system_usuarios su on (efe.usuario_id=su.usuario_id) \
                    INNER JOIN planes pl on efe.plan_id= pl.plan_id\
                    left JOIN eps_afiliados epa  on epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente\
                    and eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente and eps_punto_atencion_id!=''  order by 1 desc limit 1) \
                    left join eps_afiliados_datos epad on efe.paciente_id=epad.afiliado_id and efe.tipo_id_paciente=epad.afiliado_tipo_id\
                    left JOIN eps_puntos_atencion epaten on epaten.eps_punto_atencion_id = epa.eps_punto_atencion_id\
                    inner join esm_tipos_formulas i on i.tipo_formula_id = efe.tipo_formula\
                    inner join terceros te on efe.tipo_id_tercero = te.tipo_id_tercero and efe.tercero_id = te.tercero_id\
                    inner JOIN profesionales prf ON efe.tercero_id =  prf.tercero_id and efe.tipo_id_tercero = prf.tipo_id_tercero\
                    where\
                    dn.empresa_id= 'FD' and  efe.sw_estado not in('2') \
                    and cast(bd.fecha_registro as date) between :1 AND :2 \
                    and bdd.total_costo >0) \
                    union( \
                    select\
                    distinct d.evolucion_id as formula_id, \
                    CAST(hfc.numero_formula as text) as formula_papel, \
                    i.descripcion_tipo_formula, \
                    epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente, \
                    hfc.paciente_id, \
                    w.codigo_cum, \
                    fc_descripcion_producto(c.codigo_producto) as producto, \
                    'medico' as medico, \
                    CAST(hfc.medico_id as text) as tercero_id, \
                    'especialidad' as especialidad, \
                    b.fecha_registro  as fecha, \
                    hfc.fecha_registro as fecha_formula, \
                    c.bodegas_doc_id, \
                    c.codigo_producto, \
                    c.cantidad, \
                    c.total_costo, \
                    a.bodega, \
                    (select descripcion from bodegas where bodega = a.bodega and empresa_id = a.empresa_id and centro_utilidad =a.centro_utilidad) as nom_bode, \
                    a.centro_utilidad, \
                    a.empresa_id, \
                    a.bodegas_doc_id, \
                    su.nombre as usuario_digita, \
                    g.plan_id, \
                    '' as rango, \
                    g.plan_descripcion, \
                    case when h.eps_punto_atencion_nombre !='' then h.eps_punto_atencion_nombre else g.plan_descripcion END as eps_punto_atencion_nombre, \
                    (case when w.sw_generico = '1' then (c.total_costo *1.35) else (c.total_costo*1.25) end) as precio, \
                    (case when w.sw_generico = '1' then ((c.total_costo*c.cantidad)*1.35) else ((c.total_costo*c.cantidad)*1.25) end) as total\
                    from bodegas_doc_numeraciones a  \
                    inner JOIN bodegas_documentos b on a.bodegas_doc_id=b.bodegas_doc_id\
                    INNER JOIN system_usuarios su on (b.usuario_id=su.usuario_id) \
                    inner JOIN bodegas_documentos_d c on b.bodegas_doc_id = c.bodegas_doc_id and b.numeracion =c.numeracion\
                    inner JOIN hc_formulacion_despachos_medicamentos_pendientes d on b.bodegas_doc_id =d.bodegas_doc_id and b.numeracion =d.numeracion\
                    inner JOIN inventarios_productos w on w.codigo_producto = c.codigo_producto\
                    inner JOIN hc_formulacion_antecedentes_optima hfc on d.evolucion_id = hfc.evolucion_id\
                    left join eps_afiliados e on e.afiliado_id= hfc.paciente_id and e.afiliado_tipo_id= hfc.tipo_id_paciente\
                    and e.eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=hfc.paciente_id and epa.afiliado_tipo_id=hfc.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1) \
                    left join eps_afiliados_datos epad on hfc.paciente_id=epad.afiliado_id and hfc.tipo_id_paciente=epad.afiliado_tipo_id\
                    left join planes_rangos f on e.plan_atencion = f.plan_id\
                    left join planes g on f.plan_id= g.plan_id\
                    left join eps_puntos_atencion h on h.eps_punto_atencion_id = e.eps_punto_atencion_id\
                    inner join hc_evoluciones he on d.evolucion_id=he.evolucion_id\
                    inner join esm_tipos_formulas i on i.tipo_formula_id = he.tipo_formula\
                    where  \
                    a.empresa_id= 'FD' \
                    and c.total_costo >0\
                    and cast(b.fecha_registro as date) between :1 AND :2 )   \
                    union(  select  \
                    distinct d.evolucion_id as formula_id, \
                    CAST(hfc.numero_formula as text)  as formula_papel, \
                    i.descripcion_tipo_formula, \
                    epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente, \
                    hfc.paciente_id, \
                    w.codigo_cum, \
                    fc_descripcion_producto(c.codigo_producto) as producto, \
                    'medico' as medico, \
                    CAST(hfc.medico_id as text) as tercero_id, \
                    'especialidad' as especialidad, \
                    b.fecha_registro as fecha, \
                    hfc.fecha_registro as fecha_formula, \
                    c.bodegas_doc_id, \
                    c.codigo_producto, \
                    c.cantidad, \
                    c.total_costo, \
                    a.bodega, \
                    (select descripcion from bodegas where bodega = a.bodega and empresa_id = a.empresa_id and centro_utilidad =a.centro_utilidad) as nom_bode, \
                    a.centro_utilidad, \
                    a.empresa_id, \
                    a.bodegas_doc_id, \
                    su.nombre as usuario_digita, \
                    g.plan_id, \
                    '' as rango, \
                    g.plan_descripcion, \
                    case when h.eps_punto_atencion_nombre !='' then h.eps_punto_atencion_nombre else g.plan_descripcion END as eps_punto_atencion_nombre, \
                    (case when w.sw_generico = '1' then (c.total_costo *1.35) else (c.total_costo*1.25) end) as precio, \
                    (case when w.sw_generico = '1' then ((c.total_costo*c.cantidad)*1.35) else ((c.total_costo*c.cantidad)*1.25) end) as total\
                    from bodegas_doc_numeraciones as a  \
                    inner JOIN bodegas_documentos b on a.bodegas_doc_id=b.bodegas_doc_id  \
                    INNER JOIN system_usuarios su on (b.usuario_id=su.usuario_id)   \
                    inner JOIN bodegas_documentos_d c on b.bodegas_doc_id = c.bodegas_doc_id and b.numeracion =c.numeracion  \
                    inner JOIN hc_formulacion_despachos_medicamentos d on b.bodegas_doc_id =d.bodegas_doc_id and b.numeracion =d.numeracion  \
                    inner JOIN inventarios_productos w on w.codigo_producto = c.codigo_producto  \
                    inner JOIN hc_formulacion_antecedentes_optima hfc on d.evolucion_id = hfc.evolucion_id  \
                    left join eps_afiliados e on e.afiliado_id= hfc.paciente_id and e.afiliado_tipo_id= hfc.tipo_id_paciente  \
                    and e.eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=hfc.paciente_id and epa.afiliado_tipo_id=hfc.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1)  \
                    left join eps_afiliados_datos epad on hfc.paciente_id=epad.afiliado_id and hfc.tipo_id_paciente=epad.afiliado_tipo_id  \
                    left join planes_rangos f on e.plan_atencion = f.plan_id  \
                    left join planes g on f.plan_id= g.plan_id  \
                    left join eps_puntos_atencion h on h.eps_punto_atencion_id = e.eps_punto_atencion_id \
                    inner join hc_evoluciones he on d.evolucion_id=he.evolucion_id \
                    inner join esm_tipos_formulas i on i.tipo_formula_id = he.tipo_formula \
                    where \
                    a.empresa_id= 'FD'   and c.total_costo >0 \
                    and cast(b.fecha_registro as date) between :1 AND :2 )) as w \
                    where \
                    true  \
                    order by 18,24,3,7";
    
    
    //sql = "select * from prueba_andres  ";
    
    var query = G.knex.raw(sql, {1:fechaInicial.format(formato), 2:fechaFinal.format(formato)});
    query.timeout(200000).then(function(resultado) {
                
        //console.log("fecha final format ", resultado.rows);
         obj.resultado = obj.resultado.concat(resultado.rows);
        if(fechaFinal.format(formato) >= obj.filtro.fecha_final){
            callback(false, obj.resultado);
            return;
        } else {
            //Aumenta un dia de la fecha inicial para continuar con el recorrido de fechas
            obj.filtro.fecha_inicial = fechaFinal.add(1, 'days').format(formato);
            that.realizarReportePorRango(obj, callback);
            return;
        }
        
    }).catch (function(err) {
        console.log("error bd >>>>>>>>>>>>>>>>>>>>>>>>>>>>",err);
       callback(err);
    });

};


function __filtrarDrAriasCache(obj, callback){
    var resultado = new G.jsonQuery().
                    from(obj.registros)
                    .where("fecha_formula = "+new Date())
                    .select();
    
   // console.log("resultado>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", resultado);
    callback(false, resultado);
}

module.exports = DrAriasModel;