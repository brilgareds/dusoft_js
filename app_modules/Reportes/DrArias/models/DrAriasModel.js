var DrAriasModel = function() {

};

DrAriasModel.prototype.listarDrArias = function(filtro, callback) {    
    var that = this;
    var cache;   
    var diasDiferenciaSql=2;
    var mesDiferenciaSql=5;    
    var now = new Date();    
    var dateInicial = G.moment(filtro.fecha_inicial);
    var dateFinal = G.moment(filtro.fecha_final);
    var dateHoy = G.moment(now);
    var dateInicialSelect;
    var dateFinalTable;     
    var diferenciaFinal=dateHoy.diff(dateFinal,'days');
    var diferenciaInicial=dateHoy.diff(dateInicial,'days');    
    var diferenciaFinalMes=dateHoy.diff(dateFinal,'months');
    var diferenciaInicialMes=dateHoy.diff(dateInicial,'months');
  
    if(diferenciaInicialMes > mesDiferenciaSql){
      callback(true, "consulta (no esta en el rango de la tabla)");  
      console.log("consulta (no esta en el rango de la tabla)",diferenciaFinalMes);   
    }
    
    if(diferenciaInicial >= diasDiferenciaSql && diferenciaFinal >= diasDiferenciaSql ){
      console.log("tabla nueva");
      //se consulta en la tabla reporte_dr_arias 
      filtro.consulta=0;
    }else if(diferenciaInicial < diasDiferenciaSql && diferenciaFinal < diasDiferenciaSql){
      console.log("consulta");
      //se realiza la consulta de dr_arias
      filtro.consulta=1;
    }else if(diferenciaInicial >= diasDiferenciaSql && diferenciaFinal < diasDiferenciaSql){   
       //se realiza el union entre reporte_dr_arias y la consulta dr_Arias
        dateFinalTable = G.moment(dateHoy).subtract(diasDiferenciaSql, "days").format("YYYY-MM-DD");
        dateInicialSelect = G.moment(dateInicialSelect).subtract(diasDiferenciaSql-1, "days").format("YYYY-MM-DD");
        filtro.inicioFechaConsultaReporte=dateInicialSelect;
        filtro.finFechaTablaReporte=dateFinalTable;      
        filtro.consulta=2;      
    }else{
      callback(true, "consulta (no esta en el rango de la tabla)");    
      console.log("fuera de la tabla");  
    }
   
   G.redis.del("dr_arias");
   G.Q.ninvoke(G.redis, "get", "dr_arias").then(function(resultado){
       
        cache = (!resultado)? false : true;
        if(!resultado){                  
            return G.Q.ninvoke(that, "realizarReportePorRango",{filtro:filtro});
        } else {
           obj.registros = JSON.parse(resultado);
           return G.Q.nfcall(__filtrarDrAriasCache, obj);
        }
       
   }).then(function(resultado){
        if(!cache){
            G.redis.setex("dr_arias", 21600, JSON.stringify(resultado));
            callback(false, resultado.rows);
            console.log("datos guardados en cache ", resultado.length);
        } else {
           console.log("datos guardados en cache ", resultado.length);
            callback(false, resultado);
        }
       
   }).fail(function(err){
        console.log("error bd >>>>>>>>>>>>>>>>>>>>>>>>>>>>",err);
        callback(err);
   }).done();
    

};

/**
* @author Andres M Gonzalez
* +Descripcion: modelo que se ejecuta desde un crontabs a diario a las 12 am,
*               borra el primer mes de la tabla temporal_reporte_dr_arias 
*              (en esta tabla se encuentran los ultimos cinco meses del año actual hasta dos dias antes de la fecha actual)
* @fecha 2016-06-15
*/
DrAriasModel.prototype.borrarTemporalesReporteDrArias = function(callback) {
  var that = this;
    
   var query = G.knex('temporal_reporte_dr_arias');
               query.whereBetween('fecha', [G.knex.raw("date_trunc('month',current_date - interval '3 month' )"), G.knex.raw("date_trunc('month',current_date - interval '2 month') - interval '1 sec'")])
               .del().then(function(rows) { 
                    callback(false);
                }).catch(function(error){
                    callback(error);
                });
};

/**
* @author Andres M Gonzalez
* +Descripcion: listado de planes
* @fecha 2016-06-17
*/
DrAriasModel.prototype.listarPlanes = function(callback) {
    var that = this;
    var sql = "select plan_id,plan_descripcion\
                from planes \
                where plan_id in ('769','768','770','07','08')\
                order by plan_descripcion";
    
    var query = G.knex.raw(sql);
    query.then(function(resultado) {
       callback(false, resultado.rows);
     }).catch (function(err) {
        callback(err);
     });
};

/**
* @author Andres M Gonzalez
* +Descripcion: modelo que se ejecuta desde un crontabs a diario a las 12 am, 
*               consulta drArias con fecha (fechaActual - 2 Dias ) insertada en temporal_reporte_dr_arias 
*               ej: 2016/06/15 - 2 dias = inserta el dia 2016/06/13
* @fecha 2016-05-25
*/
DrAriasModel.prototype.addTemporalesReporteDrArias = function(callback) {
  var that = this;
  var sql = " INSERT INTO temporal_reporte_dr_arias \
                    (select * \
                        from((  select  \
                        distinct fdm.formula_id, bdd.lote, \
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
                        and cast(bd.fecha_registro as date) between (current_date - interval '2 day') and (current_date - interval '1 day' -  interval '1 sec') \
                        and bdd.total_costo >0 ) \
                    union ( \
                        select\
                        distinct dmp.formula_id, bdd.lote, \
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
                        and cast(bd.fecha_registro as date) between (current_date - interval '2 day') and (current_date - interval '1 day' -  interval '1 sec') \
                        and bdd.total_costo >0) \
                    union( \
                        select\
                        distinct d.evolucion_id as formula_id, c.lote, \
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
                        and cast(b.fecha_registro as date) between (current_date - interval '2 day') and (current_date - interval '1 day' -  interval '1 sec') )   \
                    union(  select  \
                        distinct d.evolucion_id as formula_id,c.lote, \
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
                        and cast(b.fecha_registro as date) between (current_date - interval '2 day') and (current_date - interval '1 day' -  interval '1 sec') )) as w \
                    where \
                    true  \
                    order by nom_bode,plan_descripcion,descripcion_tipo_formula,producto )";
         var query = G.knex.raw(sql);
               query.then(function(resultado) {
                  callback(false);

                }).catch (function(err) {
                   callback(err);
                });
};

/**
* @author Andres M Gonzalez
* +Descripcion inserta una nueva autorizacion en base a otra que se haya realizado con anterioridad
* @params obj: estado de la autorizacion - usuario que autoriza
* @fecha 2016-05-25
*/
DrAriasModel.prototype.realizarReportePorRango = function(obj, callback) {
    
    var that = this;
//    var formato = 'DD-mm-YYYY';
//    var fechaInicial = G.moment(obj.filtro.fecha_inicial, formato);
//    var fechaFinal   = G.moment(obj.filtro.fecha_inicial, formato);
//    var diasDelMes = G.moment(obj.filtro.fecha_inicial, formato).daysInMonth();
//    var suma = fechaFinal.date() + obj.filtro.dias;
    var sql;
    var filtro;
   
   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>",obj);
  // callback(false);
   
//    if(!obj.resultado){
//       console.log("setting new result");
//       obj.resultado = [];
//    }
   
    //Determina si se pueden sumar los dias a la fecha, de lo contrario se suma la diferencia
//    if(suma <= diasDelMes){
//        fechaFinal.add(obj.filtro.dias, 'days');
//    } else {//diferencia
//        var dias =  obj.filtro.dias - (suma - diasDelMes);
//        fechaFinal.add( dias, 'days');
//    }

//    console.log("fecha a buscar ", fechaInicial.format(formato), " a ", fechaFinal.format(formato));
   
  
//   var sqlTablaNueva =" select * from reporte_dr_arias where fecha between :3 AND :4 ";
   var sqlTablaNueva =" (select \
                        to_char(fecha,'YYYY/MM/DD HH:MM:SS') as fecha,to_char(fecha_formula,'YYYY/MM/DD') as fecha_formula,formula_id,formula_papel,nom_bode,plan_descripcion,usuario_digita,\
                        descripcion_tipo_formula,paciente_id,paciente,tercero_id,medico,especialidad,\
                        codigo_producto,codigo_cum,producto,replace(cantidad,'.',',') as cantidad,replace(precio,'.',',') as precio,replace(total,'.',',') as total,eps_punto_atencion_nombre\
                        from \
                        temporal_reporte_dr_arias \
                        where \
                            case when '"+obj.filtro.empresa_seleccion+"' is not null then empresa_id = '"+obj.filtro.empresa_seleccion+"' else true end \
                            and case when "+obj.filtro.centro_seleccion+" is not null then centro_utilidad = '"+obj.filtro.centro_seleccion+"' else true end \
                            and case when "+obj.filtro.bodega_seleccion+" is not null then bodega = '"+obj.filtro.bodega_seleccion+"' else true end \
                            and case when '"+obj.filtro.documento+"' != 'null' then paciente_id= '"+obj.filtro.documento+"' else true end \
                            and case when '"+obj.filtro.codigo+"' != 'null' then codigo_producto= '"+obj.filtro.codigo+"' else true end \
                            and case when "+obj.filtro.plan_seleccion+"  is not null then plan_id= "+obj.filtro.plan_seleccion+" else true end \
                            and case when "+obj.filtro.descripcion+" is not null then producto ilike '%"+obj.filtro.descripcion+"%' else true end \
                            and fecha between :3 AND :4 \
                        order by nom_bode,plan_descripcion,descripcion_tipo_formula,producto) \
                        ";//order by centro_utilidad,plan_descripcion,descripcion_tipo_formula,producto
    
   var sqlConsulta = "\
                    (select to_char(fecha,'YYYY/MM/DD HH:MM:SS') as fecha,to_char(fecha_formula,'YYYY/MM/DD') as fecha_formula,formula_id,formula_papel,nom_bode,plan_descripcion,usuario_digita,\
                         descripcion_tipo_formula,paciente_id,paciente,tercero_id,medico,especialidad,\
                         codigo_producto,codigo_cum,producto,replace(cantidad,'.',',') as cantidad,replace(precio,'.',',') as precio,replace(total,'.',',') as total,eps_punto_atencion_nombre\
                        from((  select  \
                        distinct fdm.formula_id, bdd.lote, \
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
                            efe.sw_estado not in('2')  \
                            and case when '"+obj.filtro.empresa_seleccion+"' is not null then dn.empresa_id = '"+obj.filtro.empresa_seleccion+"' else true end \
                            and case when "+obj.filtro.centro_seleccion+" is not null then dn.centro_utilidad = '"+obj.filtro.centro_seleccion+"' else true end \
                            and case when "+obj.filtro.bodega_seleccion+" is not null then dn.bodega = '"+obj.filtro.bodega_seleccion+"' else true end \
                            and case when '"+obj.filtro.documento+"' != 'null' then efe.paciente_id= '"+obj.filtro.documento+"' else true end \
                            and case when '"+obj.filtro.codigo+"' != 'null' then bdd.codigo_producto= '"+obj.filtro.codigo+"' else true end \
                            and case when "+obj.filtro.plan_seleccion+" is not null then efe.plan_id= "+obj.filtro.plan_seleccion+" else true end \
                            and cast(bd.fecha_registro as date) between :1 AND :2  \
                            and bdd.total_costo >0 )  \
                    union (  \
                        select \
                        distinct dmp.formula_id, bdd.lote,  \
                        efe.formula_papel,  \
                        i.descripcion_tipo_formula,  \
                        epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente,  \
                        efe.paciente_id,  \
                        ip.codigo_cum,  \
                        fc_descripcion_producto(bdd.codigo_producto) as producto,  \
                        te.nombre_tercero as medico,  \
                        CAST(efe.tercero_id as text) as tercero_id,  \
                        (select descripcion from especialidades esp  inner join profesionales_especialidades pe ON  ( pe.especialidad = esp.especialidad) where  te.tercero_id = pe.tercero_id and te.tipo_id_tercero = pe.tipo_id_tercero limit 1) as especialidad,  \
                        bd.fecha_registro  as fecha,  \
                        efe.fecha_formula,  \
                        bdd.codigo_producto,  \
                        bdd.cantidad,  \
                        bdd.total_costo,  \
                        dn.bodega,  \
                        (select descripcion from bodegas where bodega = dn.bodega and empresa_id = dn.empresa_id and centro_utilidad =dn.centro_utilidad) as nom_bode,  \
                        dn.centro_utilidad,  \
                        dn.empresa_id,  \
                        bd.bodegas_doc_id,  \
                        su.nombre as usuario_digita,  \
                        efe.plan_id,  \
                        efe.rango,  \
                        pl.plan_descripcion,  \
                        case when epaten.eps_punto_atencion_nombre !='' then epaten.eps_punto_atencion_nombre else pl.plan_descripcion END as eps_punto_atencion_nombre,  \
                        (case when ip.sw_generico = '1' then (bdd.total_costo *1.35) else (bdd.total_costo*1.25) end) as precio,  \
                        (case when ip.sw_generico = '1' then ((bdd.total_costo*bdd.cantidad)*1.35) else ((bdd.total_costo*bdd.cantidad)*1.25) end) as total \
                        from bodegas_doc_numeraciones dn \
                        INNER JOIN bodegas_documentos bd on dn.bodegas_doc_id=bd.bodegas_doc_id \
                        INNER JOIN bodegas_documentos_d bdd on bd.bodegas_doc_id = bdd.bodegas_doc_id and bd.numeracion =bdd.numeracion \
                        INNER JOIN esm_formulacion_despachos_medicamentos_pendientes dmp ON bd.bodegas_doc_id =dmp.bodegas_doc_id and bd.numeracion =dmp.numeracion \
                        INNER JOIN inventarios_productos ip on ip.codigo_producto = bdd.codigo_producto \
                        INNER JOIN esm_formula_externa efe on efe.formula_id  =dmp.formula_id \
                        INNER JOIN system_usuarios su on (efe.usuario_id=su.usuario_id)  \
                        INNER JOIN planes pl on efe.plan_id= pl.plan_id \
                        left JOIN eps_afiliados epa  on epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente \
                        and eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente and eps_punto_atencion_id!=''  order by 1 desc limit 1)  \
                        left join eps_afiliados_datos epad on efe.paciente_id=epad.afiliado_id and efe.tipo_id_paciente=epad.afiliado_tipo_id \
                        left JOIN eps_puntos_atencion epaten on epaten.eps_punto_atencion_id = epa.eps_punto_atencion_id \
                        inner join esm_tipos_formulas i on i.tipo_formula_id = efe.tipo_formula \
                        inner join terceros te on efe.tipo_id_tercero = te.tipo_id_tercero and efe.tercero_id = te.tercero_id \
                        inner JOIN profesionales prf ON efe.tercero_id =  prf.tercero_id and efe.tipo_id_tercero = prf.tipo_id_tercero \
                        where \
                            efe.sw_estado not in('2')  \
                            and case when '"+obj.filtro.empresa_seleccion+"' is not null then dn.empresa_id = '"+obj.filtro.empresa_seleccion+"' else true end \
                            and case when "+obj.filtro.centro_seleccion+" is not null then dn.centro_utilidad = '"+obj.filtro.centro_seleccion+"' else true end \
                            and case when "+obj.filtro.bodega_seleccion+" is not null then dn.bodega = '"+obj.filtro.bodega_seleccion+"' else true end \
                            and case when '"+obj.filtro.documento+"' != 'null' then efe.paciente_id= '"+obj.filtro.documento+"' else true end \
                            and case when '"+obj.filtro.codigo+"' != 'null' then bdd.codigo_producto= '"+obj.filtro.codigo+"' else true end \
                            and case when "+obj.filtro.plan_seleccion+" is not null then efe.plan_id= "+obj.filtro.plan_seleccion+" else true end \
                            and cast(bd.fecha_registro as date) between :1 AND :2  \
                            and bdd.total_costo >0)  \
                    union(  \
                        select \
                        distinct d.evolucion_id as formula_id, c.lote,  \
                        CAST(hfc.numero_formula as text) as formula_papel,  \
                        i.descripcion_tipo_formula,  \
                        epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente,  \
                        hfc.paciente_id,  \
                        w.codigo_cum,  \
                        fc_descripcion_producto(c.codigo_producto) as producto,  \
                        'medico' as medico,  \
                        CAST(hfc.medico_id as text) as tercero_id,  \
                        'especialidad' as especialidad,  \
                        b.fecha_registro  as fecha,  \
                        hfc.fecha_registro as fecha_formula,  \
                        c.codigo_producto,  \
                        c.cantidad,  \
                        c.total_costo,  \
                        a.bodega,  \
                        (select descripcion from bodegas where bodega = a.bodega and empresa_id = a.empresa_id and centro_utilidad =a.centro_utilidad) as nom_bode,  \
                        a.centro_utilidad,  \
                        a.empresa_id,  \
                        a.bodegas_doc_id,  \
                        su.nombre as usuario_digita,  \
                        g.plan_id,  \
                        '' as rango,  \
                        g.plan_descripcion,  \
                        case when h.eps_punto_atencion_nombre !='' then h.eps_punto_atencion_nombre else g.plan_descripcion END as eps_punto_atencion_nombre,  \
                        (case when w.sw_generico = '1' then (c.total_costo *1.35) else (c.total_costo*1.25) end) as precio,  \
                        (case when w.sw_generico = '1' then ((c.total_costo*c.cantidad)*1.35) else ((c.total_costo*c.cantidad)*1.25) end) as total \
                        from bodegas_doc_numeraciones a   \
                        inner JOIN bodegas_documentos b on a.bodegas_doc_id=b.bodegas_doc_id \
                        INNER JOIN system_usuarios su on (b.usuario_id=su.usuario_id)  \
                        inner JOIN bodegas_documentos_d c on b.bodegas_doc_id = c.bodegas_doc_id and b.numeracion =c.numeracion \
                        inner JOIN hc_formulacion_despachos_medicamentos_pendientes d on b.bodegas_doc_id =d.bodegas_doc_id and b.numeracion =d.numeracion \
                        inner JOIN inventarios_productos w on w.codigo_producto = c.codigo_producto \
                        inner JOIN hc_formulacion_antecedentes_optima hfc on d.evolucion_id = hfc.evolucion_id \
                        left join eps_afiliados e on e.afiliado_id= hfc.paciente_id and e.afiliado_tipo_id= hfc.tipo_id_paciente \
                        and e.eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=hfc.paciente_id and epa.afiliado_tipo_id=hfc.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1)  \
                        left join eps_afiliados_datos epad on hfc.paciente_id=epad.afiliado_id and hfc.tipo_id_paciente=epad.afiliado_tipo_id \
                        left join planes_rangos f on e.plan_atencion = f.plan_id \
                        left join planes g on f.plan_id= g.plan_id \
                        left join eps_puntos_atencion h on h.eps_punto_atencion_id = e.eps_punto_atencion_id \
                        inner join hc_evoluciones he on d.evolucion_id=he.evolucion_id \
                        inner join esm_tipos_formulas i on i.tipo_formula_id = he.tipo_formula \
                        where   \
                                c.total_costo >0  \
                                and case when '"+obj.filtro.empresa_seleccion+"' is not null then a.empresa_id = '"+obj.filtro.empresa_seleccion+"' else true end \
                                and case when "+obj.filtro.centro_seleccion+" is not null then a.centro_utilidad = '"+obj.filtro.centro_seleccion+"' else true end \
                                and case when "+obj.filtro.bodega_seleccion+" is not null then a.bodega = '"+obj.filtro.bodega_seleccion+"' else true end \
                                and case when '"+obj.filtro.documento+"' != 'null' then hfc.paciente_id= '"+obj.filtro.documento+"' else true end \
                                and case when '"+obj.filtro.codigo+"' != 'null' then c.codigo_producto= '"+obj.filtro.codigo+"' else true end \
                                and case when "+obj.filtro.plan_seleccion+"  is not null then g.plan_id= "+obj.filtro.plan_seleccion+" else true end \
                                and cast(b.fecha_registro as date) between :1 AND :2 )    \
                    union(  select   \
                        distinct d.evolucion_id as formula_id,c.lote,  \
                        CAST(hfc.numero_formula as text)  as formula_papel,  \
                        i.descripcion_tipo_formula,  \
                        epad.primer_apellido||' '||epad.segundo_apellido||' '||epad.primer_nombre||' '||epad.segundo_nombre as paciente,  \
                        hfc.paciente_id,  \
                        w.codigo_cum,  \
                        fc_descripcion_producto(c.codigo_producto) as producto,  \
                        'medico' as medico,  \
                        CAST(hfc.medico_id as text) as tercero_id,  \
                        'especialidad' as especialidad,  \
                        b.fecha_registro as fecha,  \
                        hfc.fecha_registro as fecha_formula,  \
                        c.codigo_producto,  \
                        c.cantidad,  \
                        c.total_costo,  \
                        a.bodega,  \
                        (select descripcion from bodegas where bodega = a.bodega and empresa_id = a.empresa_id and centro_utilidad =a.centro_utilidad) as nom_bode,  \
                        a.centro_utilidad,  \
                        a.empresa_id,  \
                        a.bodegas_doc_id,  \
                        su.nombre as usuario_digita,  \
                        g.plan_id,  \
                        '' as rango,  \
                        g.plan_descripcion,  \
                        case when h.eps_punto_atencion_nombre !='' then h.eps_punto_atencion_nombre else g.plan_descripcion END as eps_punto_atencion_nombre,  \
                        (case when w.sw_generico = '1' then (c.total_costo *1.35) else (c.total_costo*1.25) end) as precio,  \
                        (case when w.sw_generico = '1' then ((c.total_costo*c.cantidad)*1.35) else ((c.total_costo*c.cantidad)*1.25) end) as total \
                        from bodegas_doc_numeraciones as a   \
                        inner JOIN bodegas_documentos b on a.bodegas_doc_id=b.bodegas_doc_id   \
                        INNER JOIN system_usuarios su on (b.usuario_id=su.usuario_id)    \
                        inner JOIN bodegas_documentos_d c on b.bodegas_doc_id = c.bodegas_doc_id and b.numeracion =c.numeracion   \
                        inner JOIN hc_formulacion_despachos_medicamentos d on b.bodegas_doc_id =d.bodegas_doc_id and b.numeracion =d.numeracion   \
                        inner JOIN inventarios_productos w on w.codigo_producto = c.codigo_producto   \
                        inner JOIN hc_formulacion_antecedentes_optima hfc on d.evolucion_id = hfc.evolucion_id   \
                        left join eps_afiliados e on e.afiliado_id= hfc.paciente_id and e.afiliado_tipo_id= hfc.tipo_id_paciente   \
                        and e.eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=hfc.paciente_id and epa.afiliado_tipo_id=hfc.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1)   \
                        left join eps_afiliados_datos epad on hfc.paciente_id=epad.afiliado_id and hfc.tipo_id_paciente=epad.afiliado_tipo_id   \
                        left join planes_rangos f on e.plan_atencion = f.plan_id   \
                        left join planes g on f.plan_id= g.plan_id   \
                        left join eps_puntos_atencion h on h.eps_punto_atencion_id = e.eps_punto_atencion_id  \
                        inner join hc_evoluciones he on d.evolucion_id=he.evolucion_id  \
                        inner join esm_tipos_formulas i on i.tipo_formula_id = he.tipo_formula  \
                        where  \
                            c.total_costo >0  \
                            and case when '"+obj.filtro.empresa_seleccion+"' is not null then a.empresa_id = '"+obj.filtro.empresa_seleccion+"' else true end \
                            and case when "+obj.filtro.centro_seleccion+" is not null then a.centro_utilidad = '"+obj.filtro.centro_seleccion+"' else true end \
                            and case when "+obj.filtro.bodega_seleccion+" is not null then a.bodega = '"+obj.filtro.bodega_seleccion+"' else true end \
                            and case when '"+obj.filtro.documento+"' != 'null' then hfc.paciente_id = '"+obj.filtro.documento+"' else true end \
                            and case when '"+obj.filtro.codigo+"' != 'null' then c.codigo_producto = '"+obj.filtro.codigo+"' else true end \
                            and case when "+obj.filtro.plan_seleccion+" is not null then g.plan_id = "+obj.filtro.plan_seleccion+" else true end \
                            and cast(b.fecha_registro as date) between :1 AND :2 )) as w  \
                    where  \
                    true   \
                    and case when '"+obj.filtro.descripcion+"' != 'null' then producto ilike '%"+obj.filtro.descripcion+"%' else true end \
                     order by nom_bode,plan_descripcion,descripcion_tipo_formula,producto ) ";//order by centro_utilidad,plan_descripcion,descripcion_tipo_formula,producto
    //order by nom_bode,plan_descripcion,descripcion_tipo_formula,producto
             //       and case when '"+obj.filtro.descripcion+"' is not null then producto ilike '%"+obj.filtro.descripcion+"%' else true end \
             //
               //     and case when '"+obj.filtro.descripcion+"' != null then producto ilike '%"+obj.filtro.descripcion+"%' else true end \
                
             if(obj.filtro.consulta === 0){
                    
                // sql = "select nom_bode,formula_id,count(formula_id) as plan_descripcion,count(paciente_id ) as plan_descripcion from (select distinct on (formula_id) formula_id,nom_bode,paciente_id ,count(formula_id) as plan_descripcion from "+sqlTablaNueva+" as b group by 1,2,3 order by 1,2,3) as c group by 1,2 ";
                 sql = sqlTablaNueva;
                 filtro={3:obj.filtro.fecha_inicial+' 00:00:00 ',4:obj.filtro.fecha_final+' 23:59:59 '};
              //   console.log("sql Nueva",filtro);
                }else if(obj.filtro.consulta === 1){
                    
                 sql = sqlConsulta;
                 filtro={1:obj.filtro.fecha_inicial+' 00:00:00 ',2:obj.filtro.fecha_final+' 23:59:59 '};
               //  console.log("sql ACTUAL",filtro);
                }else if(obj.filtro.consulta === 2){
                    
                 sql = " "+sqlConsulta+ " union  "+sqlTablaNueva+ " order by nom_bode,plan_descripcion,descripcion_tipo_formula,producto;" ;      
                 filtro={1:obj.filtro.fecha_inicial+' 00:00:00 ',4:obj.filtro.fecha_final+' 23:59:59 ' ,3:obj.filtro.inicioFechaConsultaReporte+' 00:00:00 ',2:obj.filtro.finFechaTablaReporte+' 23:59:59 '};
               //  console.log("sql union",filtro);
                }  
                console.log("json1: ",new Date());
//                console.log(filtro);
               var query = G.knex.raw(sql,filtro);
               query.then(function(resultado) {
                   
                ///////////////////////////////////////////////////     
//                    var jsonArray = [
//                    { "user": { "id": 100, "screen_name": "d_linq" }, "text": "to objects" },
//                    { "user": { "id": 130, "screen_name": "c_bill" }, "text": "g" },
//                    { "user": { "id": 155, "screen_name": "b_mskk" }, "text": "kabushiki kaisha" },
//                    { "user": { "id": 301, "screen_name": "a_xbox" }, "text": "halo reach" }
//                ]
//                // ["b_mskk:kabushiki kaisha", "c_bill:g", "d_linq:to objects"]
////                var queryResult = Enumerable.From(jsonArray)
////                    .Where(function (x) { return x.user.id < 200 })
////                    .OrderBy(function (x) { return x.user.screen_name })
////                    .Select(function (x) { return x.user.screen_name + ':' + x.text })
////                    .ToArray();
//                // shortcut! string lambda selector
 var Enumerable = require('linq');
var jsonArray = [
    { "user": { "id": 100, "screen_name": "d_linq" }, "text": "to objects" },
    { "user": { "id": 130, "screen_name": "c_bill" }, "text": "g" },
    { "user": { "id": 155, "screen_name": "b_mskk" }, "text": "kabushiki kaisha" },
    { "user": { "id": 301, "screen_name": "a_xbox" }, "text": "halo reach" }
]
// ["b_mskk:kabushiki kaisha", "c_bill:g", "d_linq:to objects"]
var queryResult = Enumerable.From(jsonArray)
    .Where(function (x) { return x.user.id < 200 })
    .OrderBy(function (x) { return x.user.screen_name })
    .Select(function (x) { return x.user.screen_name + ':' + x.text })
    .ToArray();
// shortcut! string lambda selector

                   console.log("json2: ",queryResult);      
//                
                /////////////////////////////////////////   
                  callback(false, resultado);

                }).catch (function(err) {
                   console.log("error bd >>>>>>>>>>>>>>>>>>>>>>>>>>>>",err);
                   callback(err);
                });
    
   /* var query = G.knex.raw(sql, {1:fechaInicial.format(formato), 2:fechaFinal.format(formato)});
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
    });*/

};


function __filtrarDrAriasCache(obj, callback){
    var resultado = new G.jsonQuery().
                    from(obj.registros)
                    .where("fecha_formula = "+new Date())
                    .select();
    callback(false, resultado);
}

module.exports = DrAriasModel;