var DispensacionHcModel = function() {

    // Temporalmente
    //this.m_productos = productos;
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de obtener todas las formulas segun el criterio
 *              de busqueda
 * @controller DispensacionHc.prototype.listarFormulas
 */
DispensacionHcModel.prototype.listarFormulas = function(obj, callback){
    
 /**Campos exclusivos para cuando se envie la peticion 
   *solo para consultar las formulas pendientes
   **/

   var pendienteCampoEstado = "";
   var pendienteValidacion = "";
   var pendienteTabla = "";
  
   console.log("obj ", obj);
  if(obj.estadoFormula === '1'){     
        pendienteCampoEstado = ",a.sw_pendiente as sw_estado";
        pendienteValidacion = " WHERE a.sw_pendiente = '1'";
        //pendienteCampoEstado = ",j.sw_estado";
        //pendienteTabla = "INNER JOIN HC_PENDIENTES_POR_DISPENSAR j ON (a.evolucion_id=j.evolucion_id)";
       
   }
  
   var parametros = {};
   var sqlCondicion = "";
   var sqlCondicion2 = "";
   
   if(obj.fechaInicial !=="" && obj.fechaFinal !=="" && obj.terminoBusqueda ==="" || obj.terminoBusqueda ===""){
       
       sqlCondicion = " a.fecha_registro between :1 and :2 ";
        parametros["1"]= obj.fechaInicial;
        parametros["2"]= obj.fechaFinal;
         
    }
   
   if(obj.filtro.tipo === 'FO' && obj.terminoBusqueda !==""){
        
        
        
        sqlCondicion = " a.fecha_registro between :1 and :2 AND a.numero_formula::varchar = :3";
        sqlCondicion2  =" WHERE numero_formula::varchar = :3";
        
        parametros["1"]= obj.fechaInicial;
        parametros["2"]= obj.fechaFinal;
        parametros["3"]= obj.terminoBusqueda;
       
   }
   if(obj.filtro.tipo === 'EV' && obj.terminoBusqueda !==""){
       
            sqlCondicion = "  a.evolucion_id = :3";
            parametros["3"]= obj.terminoBusqueda;
        
   }
   if(obj.filtro.tipo !== 'EV' && obj.filtro.tipo !== 'FO'){
       console.log("BUSQUEDA DIFERENTE A EV o A FO")
        sqlCondicion = " a.fecha_registro between :1 and :2 AND a.tipo_id_paciente = :3 AND a.paciente_id::varchar = :4 ";
        parametros["1"]= obj.fechaInicial;
        parametros["2"]= obj.fechaFinal;
        parametros["3"]= obj.filtro.tipo;
        parametros["4"]= obj.terminoBusqueda;
     
   }
    /**
     * 0: Entrar
     * 1: Vencido
     * 2: Falta
     */
    var sql = "* FROM (\
                      SELECT DISTINCT\
                        '0' AS tipo_formula,\
                        a.tipo_formula as transcripcion_medica,\
                        CASE WHEN (a.tipo_formula='0' or a.tipo_formula ='2') THEN 'FORMULACION' ELSE 'TRANSCRIPCION' END AS descripcion_tipo_formula,\
                        TO_CHAR(a.fecha_registro,'YYYY-MM-DD') AS fecha_registro,\
                        a.tipo_id_paciente,\
                        a.paciente_id,\
                        a.fecha_registro AS registro,\
                        CURRENT_DATE as hoy,\
                        a.sw_refrendar as refrendar,\
                        a.evolucion_id,\
                        coalesce(a.formula_id, 0) AS numero_formula,\
                        edad(b.fecha_nacimiento) as edad,\
                        b.sexo_id,\
                        b.primer_apellido ||' '||b.segundo_apellido AS apellidos,\
                        b.primer_nombre||' '||b.segundo_nombre AS nombres,\
                        b.residencia_telefono,\
                        b.residencia_direccion,\
                        '1' as sw_entrega_med,\
                        a.fecha_finalizacion,\
                        a.fecha_registro as fecha_formulacion,\
                        e.nombre,\
                        f.tipo_bloqueo_id,\
                        f.descripcion AS bloqueo,\
                        COALESCE(i.plan_id,0) as plan_id,\
                        i.plan_descripcion, a.sw_finalizado, a.numero_total_entregas, a.numero_entrega_actual,\
                        CASE WHEN a.sw_finalizado = '0' OR a.sw_finalizado is NULL\
                            THEN (\
                                CASE WHEN a.fecha_minima_entrega <= now() and  now() <= a.fecha_maxima_entrega THEN '0'\
                                    WHEN now() > a.fecha_maxima_entrega THEN '1'\
                                    ELSE '2' END\
                                ) ELSE 'Tramiento finalizado' END AS estado_entrega\
                        "+pendienteCampoEstado+" FROM \
                          dispensacion_estados AS a\
                        inner join pacientes as b ON (a.tipo_id_paciente = b.tipo_id_paciente) AND (a.paciente_id = b.paciente_id)\
                        left join inv_tipos_bloqueos as f ON (b.tipo_bloqueo_id=f.tipo_bloqueo_id) AND (f.estado='1')\
                        inner join system_usuarios as e ON (a.medico_id = e.usuario_id)\
                        inner join eps_afiliados as g ON (g.afiliado_tipo_id=b.tipo_id_paciente)\
                        AND (g.afiliado_id=b.paciente_id)\
                        inner join planes_rangos AS h ON (g.plan_atencion=h.plan_id)\
                        AND (g.tipo_afiliado_atencion=h.tipo_afiliado_id)\
                        AND (g.rango_afiliado_atencion=h.rango)\
                        inner join planes as i ON (h.plan_id=i.plan_id)\
                         "+pendienteValidacion+ " ) AS  a WHERE " + sqlCondicion ;
    
    /*var sql = "* FROM (\
                        SELECT DISTINCT\
                        '0' AS tipo_formula,\
                        a.transcripcion_medica,\
                        CASE WHEN (a.transcripcion_medica='0' or a.transcripcion_medica ='2') THEN 'FORMULACION' ELSE 'TRANSCRIPCION' END AS descripcion_tipo_formula,\
                        TO_CHAR(a.fecha_registro,'YYYY-MM-DD') AS fecha_registro,\
                        a.tipo_id_paciente,\
                        a.paciente_id,\
                        a.fecha_registro AS registro,\
                        CURRENT_DATE as hoy,\
                        a.refrendar,\
                        a.evolucion_id,\
                        coalesce(a.numero_formula, 0) AS numero_formula,\
                        edad(b.fecha_nacimiento) as edad,\
                        b.sexo_id,\
                        b.primer_apellido ||' '||b.segundo_apellido AS apellidos,\
                        b.primer_nombre||' '||b.segundo_nombre AS nombres,\
                        b.residencia_telefono,\
                        b.residencia_direccion,\
                        '1' as sw_entrega_med,\
                        c.fecha_finalizacion,\
                        d.fecha_formulacion,\
                        e.nombre,\
                        f.tipo_bloqueo_id,\
                        f.descripcion AS bloqueo,\
                        COALESCE(i.plan_id,0) as plan_id,\
                        i.plan_descripcion\
                        "+pendienteCampoEstado+" FROM hc_formulacion_antecedentes AS a\
                        inner join pacientes as b ON (a.tipo_id_paciente = b.tipo_id_paciente) AND (a.paciente_id = b.paciente_id)\
                        left join inv_tipos_bloqueos as f ON (b.tipo_bloqueo_id=f.tipo_bloqueo_id) AND (f.estado='1')\
                        inner join (\
                            SELECT tipo_id_paciente,paciente_id, evolucion_id,MAX(TO_CHAR(fecha_finalizacion,'YYYY-MM-DD')) AS fecha_finalizacion\
                            FROM hc_formulacion_antecedentes "+sqlCondicion2+" GROUP BY 1,2,3\
                        ) AS c ON (a.tipo_id_paciente = c.tipo_id_paciente) AND (a.paciente_id = c.paciente_id) AND (a.evolucion_id = c.evolucion_id)\
                        join (\
                            SELECT tipo_id_paciente,paciente_id,evolucion_id,MIN(TO_CHAR(fecha_formulacion,'YYYY-MM-DD')) AS fecha_formulacion\
                            FROM hc_formulacion_antecedentes "+sqlCondicion2+" GROUP BY 1,2,3\
                        ) AS d ON (a.tipo_id_paciente = d.tipo_id_paciente)\
                        AND (a.paciente_id = d.paciente_id)\
                        AND (a.evolucion_id = d.evolucion_id)\
                        inner join system_usuarios as e ON (a.medico_id = e.usuario_id)\
                        inner join eps_afiliados as g ON (g.afiliado_tipo_id=b.tipo_id_paciente)\
                        AND (g.afiliado_id=b.paciente_id)\
                        inner join planes_rangos AS h ON (g.plan_atencion=h.plan_id)\
                        AND (g.tipo_afiliado_atencion=h.tipo_afiliado_id)\
                        AND (g.rango_afiliado_atencion=h.rango)\
                        inner join planes as i ON (h.plan_id=i.plan_id)\
                        "+pendienteTabla+" WHERE a.codigo_medicamento IS NOT NULL \
                    ) AS a WHERE  " + sqlCondicion;*/ 
              
    var query = G.knex.select(G.knex.raw(sql, parametros)).
    limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).then(function(resultado){          
        console.log("resultado ", resultado)
        callback(false, resultado);
    }).catch(function(err){    
        console.log("err ", err)
        callback("Ha ocurrido un error");      
    });
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de obtener los lotes relacionados con los productos    
 *              de los FOFO
 * @controller DispensacionHc.prototype.existenciasBodegas
 */
DispensacionHcModel.prototype.listarMedicamentosPendientesDispensados = function(obj,callback){
    
    var parametros = {1: obj.evolucionId};
    
    var sql =  "SELECT dd.codigo_producto,\
                dd.cantidad as numero_unidades,\
                dd.fecha_vencimiento,\
                dd.lote,\
                fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,\
                dd.sw_pactado,\
                fc_descripcion_producto_molecula(dd.codigo_producto) as molecula,\
                dd.total_costo,\
                to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega,\
                '1' as pendiente_dispensado,(select fecha_registro as fecha_entrega\
		from\
		hc_pendientes_por_dispensar  AS e \
		where \
		e.evolucion_id  = :1 and sw_estado='1' limit 1) as fecha_pendiente\
                FROM hc_formulacion_despachos_medicamentos_pendientes tmp\
                inner join bodegas_documentos as d on (tmp.bodegas_doc_id = d.bodegas_doc_id and tmp.numeracion = d.numeracion)\
                inner join bodegas_documentos_d AS dd on (d.bodegas_doc_id = dd.bodegas_doc_id and d.numeracion = dd.numeracion)\
                WHERE \
                tmp.evolucion_id = :1 AND d.todo_pendiente != 1";

     
    G.knex.raw(sql,parametros).then(function(resultado){ 
        console.log("resultado Pendientes por dispensar::: ", resultado);
      callback(false, resultado)
    }).catch(function(err){         
         console.log("err ", err);
      callback(err)
    });            
};

/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado de obtener quien realiza la formula
 * @controller DispensacionHc.prototype.listarMedicamentosPendientesPorDispensar
 */
DispensacionHcModel.prototype.listarMedicamentosDispensados = function(obj,callback){
    
   
    var fecha=" to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega ";
    var group;
    if(obj.ultimo ===1){
          fecha=" max(to_char(d.fecha_registro,'YYYY-mm-dd')) as fecha_entrega ";
          group=" GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12 order by fecha_entrega desc ";
      }
    var parametros = {1: obj.evolucionId};
    var sql = "SELECT\
        dd.codigo_producto,\
        dd.cantidad as numero_unidades,\
        dd.fecha_vencimiento ,\
        dd.lote,\
        fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,\
        fc_descripcion_producto_alterno(dd.codigo_producto) as molecula,\
        d.usuario_id,\
        sys.nombre,\
        sys.descripcion,\
        dd.sw_pactado,\
        dd.total_costo,\
        inv.grupo_id, "+fecha+" \
        FROM\
          hc_formulacion_despachos_medicamentos as dc,\
          bodegas_documentos as d,\
          bodegas_documentos_d AS dd,\
          system_usuarios  sys,\
          inventarios_productos inv\
        WHERE\
            dc.bodegas_doc_id = d.bodegas_doc_id\
        and dc.numeracion = d.numeracion\
        and dc.evolucion_id = :1\
        and d.bodegas_doc_id = dd.bodegas_doc_id\
        and d.numeracion = dd.numeracion\
        and d.usuario_id=sys.usuario_id\
        and inv.codigo_producto  = dd.codigo_producto " + group;
    //console.log("sql ----->>>>>>>>>> ", sql);
    G.knex.raw(sql,parametros).then(function(resultado){    
      
        callback(false, resultado)
    }).catch(function(err){        
      
        callback(err);
    });
          
    /*var group;
    if(obj.ultimo ===1){

        group="AND (to_char(d.fecha_registro,'YYYY-mm-dd')) >= \
            (\
                SELECT\
                max( to_char(d.fecha_registro,'YYYY-mm-dd') ) as fecha_entrega\
                FROM\
                hc_formulacion_despachos_medicamentos as dc,\
                bodegas_documentos as d,\
                bodegas_documentos_d AS dd,\
                system_usuarios  sys,\
                inventarios_productos inv\
                WHERE\
                    dc.bodegas_doc_id = d.bodegas_doc_id\
                    and  dc.numeracion = d.numeracion\
                    and  dc.evolucion_id = :1\
                    and  d.bodegas_doc_id = dd.bodegas_doc_id\
                    and  d.numeracion = dd.numeracion\
                    and  d.usuario_id=sys.usuario_id\
                    and  inv.codigo_producto  = dd.codigo_producto\
            )";
    }
    var parametros = {1: obj.evolucionId};
    var sql = "SELECT\
              dd.codigo_producto,\
              dd.cantidad as numero_unidades,\
              dd.fecha_vencimiento ,\
              dd.lote,\
              fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,\
              fc_descripcion_producto_alterno(dd.codigo_producto) as molecula,\
              d.usuario_id,\
              sys.nombre,\
              sys.descripcion,\
              dd.sw_pactado,\
              dd.total_costo,\
	      inv.grupo_id, to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega \
              FROM\
                hc_formulacion_despachos_medicamentos as dc,\
                bodegas_documentos as d,\
                bodegas_documentos_d AS dd,\
                system_usuarios  sys,\
		inventarios_productos inv\
              WHERE\
                   dc.bodegas_doc_id = d.bodegas_doc_id\
              and  dc.numeracion = d.numeracion\
              and  dc.evolucion_id = :1\
              and  d.bodegas_doc_id = dd.bodegas_doc_id\
              and  d.numeracion = dd.numeracion\
              and  d.usuario_id=sys.usuario_id\
	      and  inv.codigo_producto  = dd.codigo_producto " + group;
    console.log("sql ----->>>>>>>>>> ", sql);*/
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de los tipos de documentos
 * @controller DispensacionHc.prototype.listarTipoDocumento
 */
DispensacionHcModel.prototype.listarTipoDocumento = function(callback){
    
    var sql = "SELECT tipo_id_tercero as id, descripcion\
                 FROM tipo_id_terceros\
                 ORDER BY  tipo_id_tercero ";
  
    G.knex.raw(sql).then(function(resultado){      
        callback(false, resultado)
    }).catch(function(err){             
        callback(err)
    });
    
};


/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar las formulas que tienen medicamentos
 *              pendientes
 * @controller DispensacionHc.prototype.listarFormulasPendientes
 */
DispensacionHcModel.prototype.listarFormulasPendientes = function(callback){
    
    var sql = "SELECT DISTINCT HP.CODIGO_MEDICAMENTO,\
                  HF.NUMERO_FORMULA,\
                  HP.EVOLUCION_ID,\
                  (P.PRIMER_APELLIDO||' '||P.SEGUNDO_APELLIDO)  NOMBRES,\
                  (P.PRIMER_NOMBRE||' '||P.SEGUNDO_NOMBRE)  APELLIDOS,\
                  P.TIPO_ID_PACIENTE,\
                  P.PACIENTE_ID,\
                  edad(P.FECHA_NACIMIENTO)  EDAD,\
                  (CASE WHEN P.SEXO_ID='F' THEN 'FEMENINO' WHEN P.SEXO_ID='M' THEN 'MASCULINO' END)  SEXO,\
                  P.RESIDENCIA_DIRECCION,\
                  P.RESIDENCIA_TELEFONO,\
                  HP.CODIGO_MEDICAMENTO,\
                  FC_DESCRIPCION_PRODUCTO_ALTERNO(HP.CODIGO_MEDICAMENTO)  DESCRIPCION,\
                  HP.CANTIDAD,\
                  HP.hc_pendiente_dispensacion_id\
               FROM\
                  HC_PENDIENTES_POR_DISPENSAR HP\
                  INNER JOIN HC_FORMULACION_ANTECEDENTES HF  ON (HF.EVOLUCION_ID=HP.EVOLUCION_ID AND HP.SW_ESTADO='0')\
                  INNER JOIN PACIENTES P ON (P.TIPO_ID_PACIENTE=HF.TIPO_ID_PACIENTE AND P.PACIENTE_ID=HF.PACIENTE_ID)\
               WHERE\
                  HP.SW_ESTADO='0' AND HP.EVOLUCION_ID = '91671' ";
  
  
    G.knex.raw(sql).then(function(resultado){    
        callback(false, resultado)
    }).catch(function(err){          
        callback(err)
    });
          
    
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los productos formulados
 * @controller DispensacionHc.prototype.listarMedicamentosFormulados
 * --- equivale a la funcion  Consultar_Medicamentos_Detalle_ (VIEJO)
 */
DispensacionHcModel.prototype.listarMedicamentosFormulados = function(obj,callback){

    var parametros = {1: obj.evolucionId};
       
        var sql = "SELECT  hc.codigo_medicamento,\
                   ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30)  as numero_entregas,\
               (hc.fecha_finalizacion - hc.fecha_registro)  as diferencia_final_inicio,\
                hc.fecha_registro,\
                hc.fecha_finalizacion,\
                hc.dosis,\
                hc.unidad_dosificacion,\
                hc.frecuencia,\
                hc.tiempo_total,\
                hc.perioricidad_entrega,\
                hc.descripcion,\
                hc.tiempo_perioricidad_entrega,\
                hc.unidad_perioricidad_entrega,\
                hc.cantidad,\
                a.cantidad as  cantidad_entrega,\
                hc.fecha_modificacion,\
                pric.descripcion as principio_activo,\
                pric.cod_principio_activo,\
                fc_descripcion_producto_alterno(hc.codigo_medicamento) as descripcion_prod,\
                hc.sw_autorizado,\
                hc.tipo_id_paciente,\
                hc.paciente_id,\
                TO_CHAR(hc.fecha_formulacion,'YYYY-MM-DD') AS fecha_formulacion,\
                refrendar,\
                hc.numero_formula,\
                invp.cod_forma_farmacologica\
                FROM   hc_formulacion_antecedentes hc\
                LEFT JOIN  medicamentos med ON(hc.codigo_medicamento=med.codigo_medicamento)\
                LEFT JOIN inv_med_cod_principios_activos pric ON (med.cod_principio_activo=pric.cod_principio_activo)\
                LEFT JOIN  inventarios_productos invp ON(hc.codigo_medicamento=invp.codigo_producto)\
                JOIN hc_medicamentos_recetados_amb a ON hc.codigo_medicamento = a.codigo_producto AND hc.evolucion_id = a.evolucion_id\
                WHERE hc.evolucion_id = :1 ORDER BY  ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30) ";
   
    G.knex.raw(sql,parametros).then(function(resultado){    
        callback(false, resultado)
    }).catch(function(err){    
        console.log("Error listarMedicamentosFormulados ", err);
        callback(err)
    });  
};



/**
 * @author Cristian Ardila
 * @fecha 15/06/2016
 * +Descripcion Modelo encargado de listar los medicamentos pendientes por dispensar
 * @controller DispensacionHc.prototype.listarMedicamentosPendientesPorDispensar
 */
DispensacionHcModel.prototype.listarMedicamentosPendientesPorDispensar = function(obj,callback){
                     
    var parametros = {1: obj.evolucionId};
       
        var sql = "select A.codigo_medicamento,\
                    SUM(numero_unidades) as cantidad_entrega,\
                   fc_descripcion_producto_alterno(A.codigo_medicamento) as descripcion_prod,\
                   med.cod_principio_activo,hc.sw_autorizado,\
                   hc.perioricidad_entrega,\
                   hc.tiempo_total ,\
                   invp.cod_forma_farmacologica from\
                        (\
                        select\
                        dc.codigo_medicamento,\
                        SUM(dc.cantidad) as numero_unidades\
                        FROM  hc_pendientes_por_dispensar as dc\
                   WHERE      dc.evolucion_id = :1\
                   and        dc.sw_estado = '0'\
                  group by(dc.codigo_medicamento)\
                  ) as A INNER JOIN hc_formulacion_antecedentes hc ON (hc.codigo_medicamento=A.codigo_medicamento)\
                     LEFT JOIN  medicamentos med ON(A.codigo_medicamento=med.codigo_medicamento)\
                     LEFT JOIN inv_med_cod_principios_activos pric ON (med.cod_principio_activo=pric.cod_principio_activo)\
                     LEFT JOIN  inventarios_productos invp ON(hc.codigo_medicamento=invp.codigo_producto)\
                    WHERE hc.evolucion_id = :1\
                    group by med.cod_principio_activo,\
                          A.codigo_medicamento,\
                          hc.sw_autorizado,\
                          hc.perioricidad_entrega,\
                          hc.tiempo_total,\
                          invp.cod_forma_farmacologica";
    
    G.knex.raw(sql,parametros).then(function(resultado){       
       
        callback(false, resultado);
    }).catch(function(err){   
          console.log("Error listarMedicamentosPendientesPorDispensar ", err);
        callback(err);
    });  
};

/**
 * @author Cristian Ardila
 * @fecha 13/06/2016
 * +Descripcion Modelo encargado de listar los medicamentos pendientes de la
 *              formula
 * @controller DispensacionHc.prototype.listarMedicamentosPendientes
 */
DispensacionHcModel.prototype.listarMedicamentosPendientes = function(obj,callback){

    var parametros = {1: obj.evolucionId};
       
        var sql = "SELECT  a.codigo_producto,\
                          (b.cantidades - a.cantidades) as total\
                  from\
                  (\
                        SELECT codigo_formulado AS codigo_producto,\
                              SUM(cantidad_despachada) as cantidades\
                        FROM hc_dispensacion_medicamentos_tmp\
                        where evolucion_id= :1\
                        group by  codigo_formulado\
                  ) as a,\
                  (\
                  SELECT codigo_medicamento as codigo_producto,\
                            SUM(cantidad_entrega) as cantidades\
                            FROM hc_formulacion_antecedentes\
                            where evolucion_id= :1\
                      group by codigo_medicamento\
                  ) as b\
                 where\
                          a.codigo_producto = b.codigo_producto\
                UNION\
                    SELECT codigo_medicamento as codigo_producto,\
                          cantidad_entrega as cantidades\
                          FROM hc_formulacion_antecedentes\
                          where evolucion_id= :1 and sw_mostrar='1'\
                     and codigo_medicamento NOT IN( select\
                                                      codigo_formulado\
                                                      FROM hc_dispensacion_medicamentos_tmp\
                                                      where evolucion_id= :1 )";
   
    G.knex.raw(sql,parametros).then(function(resultado){    
       
        callback(false, resultado)
    }).catch(function(err){        
      
        callback(err)
    });  
};


/**
 * @author Cristian Ardila
 * @fecha 25/07/2016
 * +Descripcion Modelo encargado de consultar los medicamentos despachados
 * @controller DispensacionHc.prototype.consultarMedicamentosDespachados
 * -- Pertenece a la funcion medicamentosDespachados
 */
DispensacionHcModel.prototype.consultarMedicamentosDespachados = function(obj,callback){

    var parametros = {1: obj.evolucionId};
                     
        var sql = "SELECT * FROM(\
                        SELECT   dd.codigo_producto,\
                        dd.cantidad as numero_unidades,\
                        dd.fecha_vencimiento ,\
                        dd.lote,\
                        fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,\
                        d.usuario_id,\
                        'dispensacion_hc' as sistema,\
                        to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega,\
                        to_char(now()- d.fecha_registro,'dd') as dias_de_entregado\
			FROM  hc_formulacion_despachos_medicamentos_pendientes hc\
                        INNER JOIN bodegas_documentos d\
                         ON  hc.bodegas_doc_id = d.bodegas_doc_id AND hc.numeracion = d.numeracion\
                        INNER JOIN bodegas_documentos_d dd\
                         ON dd.bodegas_doc_id = d.bodegas_doc_id AND dd.numeracion = d.numeracion\
                        WHERE hc.evolucion_id = :1 AND d.todo_pendiente = 1\
			UNION\
                        select\
                        dd.codigo_producto,\
                        dd.cantidad as numero_unidades,\
                        dd.fecha_vencimiento ,\
                        dd.lote,\
                        fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,\
                        d.usuario_id,\
                        'dispensacion_hc' as sistema,\
                        to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega,\
                        to_char(now()- d.fecha_registro,'dd') as dias_de_entregado\
                        FROM\
                          hc_formulacion_despachos_medicamentos as dc,\
                          bodegas_documentos as d,\
                          bodegas_documentos_d AS dd\
                        WHERE\
                            dc.bodegas_doc_id = d.bodegas_doc_id\
                        and dc.numeracion = d.numeracion\
                        and dc.evolucion_id = :1\
                        and d.bodegas_doc_id = dd.bodegas_doc_id\
                        and d.numeracion = dd.numeracion\
                           )as k\
                           order by fecha_entrega asc;\
                           ";  
    G.knex.raw(sql,parametros).then(function(resultado){     
        callback(false, resultado);
    }).catch(function(err){   
        console.log("err consultarMedicamentosDespachados: ", err);   
        callback(err);
    });  
};

/**
 * @author Cristian Ardila
 * @fecha 25/07/2016
 * +Descripcion Modelo encargado de consultar los medicamentos despachados
 * @controller DispensacionHc.prototype.consultarUltimoRegistroDispensacion
 * -- Pertenece a la funcion ConsultarUltimoResg_Dispens_
 */
DispensacionHcModel.prototype.consultarUltimoRegistroDispensacion = function(obj,callback){

    var sql = "";
    var sql2 = "";
    var parametros = {1: obj.tipoIdPaciente, 2: obj.pacienteId};
    if(obj.principioActivo){
        sql = "and mm.cod_principio_activo='" + obj.principioActivo + "' ";
        sql2 = "and h.subclase_id='" + obj.principioActivo + "' ";
       
    }else{
        sql ="and inve.codigo_producto='" + obj.producto + "' ";
        sql2 ="and b.codigo_producto ='" + obj.producto + "' ";
                                     
    }
    
                     
        var sql = "SELECT A.resultado,\
                A.fecha_registro,\
                A.unidades,\
                A.nombre,\
                A.razon_social\
                FROM (\
                    SELECT to_char(d.fecha_registro,'YYYY-mm-dd') AS fecha_registro,\
                    '1' as resultado,\
                    SUM(dd.cantidad) as unidades,\
                    SYS.nombre,\
                    EMPRE.razon_social\
                    FROM hc_formulacion_despachos_medicamentos as dc\
                    JOIN hc_formulacion_antecedentes hc ON(dc.evolucion_id=hc.evolucion_id),\
                    bodegas_documentos as d,\
                    bodegas_documentos_d AS dd ,\
                    inventarios_productos inve  left join medicamentos mm ON (inve.codigo_producto=mm.codigo_medicamento),\
                    system_usuarios  SYS,\
                    bodegas_doc_numeraciones  NUME,\
                    empresas EMPRE\
                    WHERE dc.bodegas_doc_id = d.bodegas_doc_id\
                    and dc.numeracion = d.numeracion\
                    and d.bodegas_doc_id = dd.bodegas_doc_id\
                    and d.numeracion = dd.numeracion\
                    and dd.codigo_producto=inve.codigo_producto\
                    and d.usuario_id=SYS.usuario_id\
                    and d.bodegas_doc_id=NUME.bodegas_doc_id\
                    and NUME.empresa_id=EMPRE.empresa_id " + sql + "and hc.tipo_id_paciente= :1\
                    and hc.paciente_id= :2\
                    and dc.sw_estado='1'\
                    GROUP BY d.fecha_registro,resultado,SYS.nombre,razon_social\
                    UNION\
                   SELECT to_char(d.fecha_registro,'YYYY-mm-dd') AS fecha_registro,\
                    '0' as resultado,\
                    SUM(dd.cantidad) as unidades,\
                    SYS.nombre,\
                    EMPRE.razon_social\
                    FROM hc_formulacion_despachos_medicamentos_pendientes as dc\
                    JOIN hc_formulacion_antecedentes hc ON(dc.evolucion_id=hc.evolucion_id) ,\
                    bodegas_documentos as d,\
                    bodegas_documentos_d AS dd ,\
                    inventarios_productos inve  left join medicamentos mm ON (inve.codigo_producto=mm.codigo_medicamento) ,\
                    system_usuarios  SYS,\
                    bodegas_doc_numeraciones  NUME,\
                    empresas EMPRE\
                    WHERE dc.bodegas_doc_id = d.bodegas_doc_id\
                    and dc.numeracion = d.numeracion\
                    and d.bodegas_doc_id = dd.bodegas_doc_id\
                    and d.numeracion = dd.numeracion\
                    and dd.codigo_producto=inve.codigo_producto\
                    and d.usuario_id=SYS.usuario_id\
                    and d.bodegas_doc_id=NUME.bodegas_doc_id\
                    and NUME.empresa_id=EMPRE.empresa_id  " + sql +  "and hc.tipo_id_paciente= :1\
                    and hc.paciente_id= :2\
                    GROUP BY d.fecha_registro,resultado,SYS.nombre,razon_social\
                    UNION\
                SELECT\
                MAX(to_char(a.fecha_registro,'YYYY-MM-DD')) AS fecha_registro,\
                '1' as resultado,\
                SUM(b.cantidad) as unidades,\
                g.nombre,\
                f.descripcion||'-'||i.razon_social as razon_social\
                FROM\
                bodegas_documentos as a\
                JOIN bodegas_documentos_d as b ON (a.bodegas_doc_id = b.bodegas_doc_id)\
                AND (a.numeracion = b.numeracion)\
                JOIN esm_formulacion_despachos_medicamentos as c ON (a.bodegas_doc_id = c.bodegas_doc_id)\
                AND (a.numeracion = c.numeracion)\
                JOIN esm_formula_externa as d ON (c.formula_id = d.formula_id)\
                JOIN bodegas_doc_numeraciones as e ON (a.bodegas_doc_id = e.bodegas_doc_id)\
                JOIN centros_utilidad as f ON (e.empresa_id = f.empresa_id)\
                AND (e.centro_utilidad = f.centro_utilidad)\
                JOIN empresas as i ON (f.empresa_id = i.empresa_id)\
                JOIN system_usuarios as g ON (a.usuario_id = g.usuario_id)\
                JOIN inventarios_productos as h ON (b.codigo_producto = h.codigo_producto)\
                WHERE TRUE   " + sql2 +  " and d.tipo_id_paciente= :1\
                and d.paciente_id = :2\
                and c.sw_estado='1'\
                and d.sw_estado IN ('0','1')\
                and d.fecha_registro <= ('" + obj.today + "'::date +'1 day' ::interval)::date\
		and d.fecha_registro >= '" +obj.fechaDia+ "'::date\
                GROUP BY 2,4,5\
                union\
                SELECT\
                            MAX(to_char(a.fecha_registro,'YYYY-MM-DD')) AS fecha_registro,\
                            '0' as resultado,\
                            SUM(b.cantidad) as unidades,\
                            g.nombre,\
                            f.descripcion||'-'||i.razon_social as razon_social\
                            FROM\
                           bodegas_documentos as a\
                            JOIN bodegas_documentos_d as b ON (a.bodegas_doc_id = b.bodegas_doc_id)\
                            AND (a.numeracion = b.numeracion)\
                            JOIN esm_formulacion_despachos_medicamentos_pendientes as c ON (a.bodegas_doc_id = c.bodegas_doc_id)\
                            AND (a.numeracion = c.numeracion)\
                            JOIN esm_formula_externa as d ON (c.formula_id = d.formula_id)\
                            JOIN bodegas_doc_numeraciones as e ON (a.bodegas_doc_id = e.bodegas_doc_id)\
                            JOIN centros_utilidad as f ON (e.empresa_id = f.empresa_id)\
                            AND (e.centro_utilidad = f.centro_utilidad)\
                            JOIN empresas as i ON (f.empresa_id = i.empresa_id)\
                            JOIN system_usuarios as g ON (a.usuario_id = g.usuario_id)\
                            JOIN inventarios_productos as h ON (b.codigo_producto = h.codigo_producto)\
                            WHERE TRUE  " + sql2 + "and d.tipo_id_paciente = :1\
                            and d.paciente_id= :2\
                            and d.sw_estado IN ('0','1')\
                            and d.fecha_registro <= ('" +obj.today + "'::date +'1 day' ::interval)::date\
                            and d.fecha_registro >= '" +obj.fechaDia+ "'::date\
                            GROUP BY 2,4,5\
                       ) AS A ORDER BY  A.resultado ASC ";  
    G.knex.raw(sql,parametros).then(function(resultado){     
      //  console.log("resultado ", resultado)
        callback(false, resultado);
    }).catch(function(err){       
        console.log("err consultarUltimoRegistroDispensacion: ", err);   
        callback(err);
    });  
};

/**
 * @author Cristian Ardila
 * @fecha 26/07/2016
 * +Descripcion Modelo encargado de consultar si un usuario tiene privilegios
 *              para autorizar una dispensacion de un producto confrontado
 * @controller DispensacionHc.prototype.usuarioPrivilegios
 * -- Pertenece a la funcion Usuario_Privilegios_ del (VIEJO)
 */
DispensacionHcModel.prototype.usuarioPrivilegios = function(obj,callback){

    var parametros = {1: obj.empresa, 2: obj.centroUtilidad,
                      3: obj.bodega, 4: obj.usuario};
  
        var sql = "SELECT sw_privilegios\
                  FROM userpermisos_dispensacion\
                  WHERE empresa_id= :1 AND centro_utilidad = :2 AND bodega = :3\
                  AND usuario_id = :4 AND sw_activo = '1' ";
  
    G.knex.raw(sql,parametros).then(function(resultado){ 
        console.log("resultado ", resultado)
          callback(false, resultado)
    }).catch(function(err){   
        console.log("err usuarioPrivilegios: ", err);    
          callback(err);
    });
    
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de obtener la cantidad total que dispensara el
 *              producto
 * @controller DispensacionHc.prototype.cantidadProductoTemporal
 */
DispensacionHcModel.prototype.cantidadProductoTemporal = function(obj,callback){

    var parametros = {1: obj.codigoProducto, 2: obj.evolucionId, 3: obj.principioActivo};

    var condicion = "";
        if (obj.principioActivo !== "") {
            condicion =" and med.cod_principio_activo = :3 ";
        }else{
            condicion=" and invp.codigo_producto = :1 ";
        } 

        var sql = "SELECT COALESCE(sum(tmp.cantidad_despachada),0) as total,tmp.codigo_formulado\
                  FROM hc_dispensacion_medicamentos_tmp tmp\
                       LEFT JOIN medicamentos med ON(tmp.codigo_formulado=med.codigo_medicamento)\
                       LEFT JOIN inventarios_productos invp ON(tmp.codigo_formulado=invp.codigo_producto)\
                  where tmp.codigo_formulado= :1\
                  and tmp.evolucion_id = :2 "+condicion+" GROUP BY codigo_formulado";
  
    G.knex.raw(sql,parametros).then(function(resultado){      
          callback(false, resultado)
    }).catch(function(err){     
         console.log("err cantidadProductoTemporal: ", err);    
          callback(err)
    });
    
};




/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de obtener los lotes relacionados con los productos    
 *              de los FOFO
 * @controller DispensacionHc.prototype.existenciasBodegas
 */
DispensacionHcModel.prototype.existenciasBodegas = function(obj,callback){

    var parametros = {1: obj.empresa, 
                    2: obj.centroUtilidad, 
                    3: obj.bodega, 
                    4: obj.principioActivo, 
                    5: obj.codigoProducto,
                    6: obj.codigoFormaFarmacologica};
     
    var condicion = "";
    if (obj.principioActivo !== "") {
        condicion =" and med.cod_principio_activo =  :4 AND invp.cod_forma_farmacologica= :6 ";
    }else{
        condicion=" and fv.codigo_producto = :5 AND invp.cod_forma_farmacologica= :6 ";
    } 

    var sql =  " SELECT\
                invp.contenido_unidad_venta as concentracion,\
                invsinv.descripcion as molecula,\
                invmcf.descripcion as forma_farmacologica,\
                invci.descripcion as laboratorio,\
                fc_descripcion_producto_alterno(fv.codigo_producto) as producto,\
                med.cod_principio_activo,\
                fv.*\
                FROM existencias_bodegas_lote_fv AS fv\
                JOIN existencias_bodegas as ext ON (fv.empresa_id = ext.empresa_id) and (fv.centro_utilidad = ext.centro_utilidad) and (fv.bodega = ext.bodega) and (fv.codigo_producto = ext.codigo_producto)\
                JOIN inventarios as inv ON (ext.empresa_id = inv.empresa_id) and (ext.codigo_producto = inv.codigo_producto)\
                JOIN inventarios_productos as invp ON (inv.codigo_producto = invp.codigo_producto)\
                LEFT JOIN medicamentos med ON (fv.codigo_producto=med.codigo_medicamento)\
                INNER JOIN inv_subclases_inventarios invsinv ON ( invsinv.grupo_id = invp.grupo_id  ) AND (invsinv.clase_id = invp.clase_id) AND (invsinv.subclase_id = invp.subclase_id)\
                INNER JOIN inv_med_cod_forma_farmacologica invmcf ON (invmcf.cod_forma_farmacologica = invp.cod_forma_farmacologica)\
                INNER JOIN inv_clases_inventarios invci ON ( invci.grupo_id = invp.grupo_id  ) AND (invci.clase_id = invp.clase_id) \n\
                WHERE fv.empresa_id = :1 and fv.centro_utilidad = :2\
                and fv.bodega = :3 and fv.existencia_actual > 0 "+condicion+" ORDER BY invp.descripcion ASC,fv.fecha_vencimiento ASC";

     
    G.knex.raw(sql,parametros).then(function(resultado){  
      
      callback(false, resultado)
    }).catch(function(err){ 
        console.log("err existenciasBodegas: ", err);
      callback(err)
    });            
};



/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de obtener los productos temporales
 *              para validar si ya existe el producto
 * @controller DispensacionHc.prototype.listarTipoDocumento
 */
DispensacionHcModel.prototype.consultarProductoTemporal = function(obj,estado,callback){
   
    var parametros = [];
    var condicion = "";
    var descripcionProducto = "";
    if(estado === 0){
        parametros = {1: obj.evolucionId, 2: obj.codigoProducto, 3: obj.fechaVencimiento, 4: obj.lote};
        condicion = "AND codigo_producto = :2 AND fecha_vencimiento = :3 AND lote = :4";
    }else{
        parametros = {1: obj.evolucionId};
        descripcionProducto =",fc_descripcion_producto_alterno(codigo_producto) as descripcion_prod";
    }
   
    var sql = "SELECT  *"+descripcionProducto+" FROM hc_dispensacion_medicamentos_tmp \
              WHERE evolucion_id = :1 " + condicion +"";
               
  
    G.knex.raw(sql,parametros).then(function(resultado){         
        callback(false, resultado)
    }).catch(function(err){       
        callback(err);
    });
    
};



/*
 * @autor : Cristian Ardila
 * +Descripcion : Transaccion para almacenar los temporales de la formula
 *                que vendrian siendo los lotes
 * @fecha: 05/07/2015
 */
DispensacionHcModel.prototype.guardarTemporalFormula = function(producto, callback)
{   
    G.knex.transaction(function(transaccion) {          
        G.Q.nfcall(__insertarTemporalFarmacia, producto, transaccion).then(function(resultado){         
            transaccion.commit();         
        }).fail(function(err){        
           transaccion.rollback(err);
        }).done();
    }).then(function(){     
            callback(false);
    }).catch(function(err){       
            callback(err);       
    }).done(); 
    
};

/*
 * @autor : Cristian Ardila
 * +Descripcion : Transaccion para almacenar los temporales de la formula
 *                que vendrian siendo los lotes
 * @fecha: 05/07/2015
 */
DispensacionHcModel.prototype.eliminarTemporalFormula = function(producto, callback)
{ 
    G.knex.transaction(function(transaccion) {         
        G.Q.nfcall(__eliminarTemporalFarmacia, producto, transaccion).then(function(resultado){         
           transaccion.commit();       
        }).fail(function(err){    
           transaccion.rollback(err);
        }).done();
    }).then(function(){    
            callback(false);
    }).catch(function(err){       
            callback(err);       
    }).done(); 
    
};


/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado de obtener los diferentes tipos de formula
 * @controller DispensacionHc.prototype.listarTipoFormula
 */
DispensacionHcModel.prototype.listarTipoFormula = function(callback){

    var sql = "SELECT\
            a.tipo_formula_id as id,\
            a.descripcion_tipo_formula as descripcion\
            FROM esm_tipos_formulas as a\
            ORDER BY a.descripcion_tipo_formula ASC";
   
    G.knex.raw(sql).then(function(resultado){    
        callback(false, resultado)
    }).catch(function(err){          
        callback(err)
    });
          
    
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de obtener la cabecera de informacion de la formula
 * @controller DispensacionHc.prototype.listarMedicamentosPendientesPorDispensar
 */
DispensacionHcModel.prototype.obtenerCabeceraFormulaPendientesPorDispensar = function(obj,callback){
       
    var parametros = {};
        parametros["1"] = obj.evolucionId;
    var where;

    if(!obj.paciente_id){
        where=" and a.tipo_id_paciente= :2 and a.paciente_id= :3 ";
        parametros["2"]= obj.tipoIdPaciente;
        parametros["3"]= obj.pacienteId;
    }

    var sql = "select distinct  ON (a.evolucion_id)\
            a.evolucion_id,\
            a.numero_formula,\
            a.tipo_id_paciente,\
            a.paciente_id,\
            to_char(a.fecha_registro,'YYYY-MM-DD') as fecha_registro,\
            to_char(a.fecha_finalizacion,'YYYY-MM-DD') as fecha_finalizacion,\
            to_char(a.fecha_formulacion,'YYYY-MM-DD') as fecha_formulacion,\
            b.primer_apellido ||' '|| b.segundo_apellido AS apellidos,\
            b.primer_nombre||' '||b.segundo_nombre AS nombres,\
            edad(b.fecha_nacimiento) as edad,\
            b.sexo_id as sexo,\
            b.residencia_direccion,\
            b.residencia_telefono,\
            e.plan_id,\
            e.plan_descripcion,\
            f.nombre,\
            g.tipo_bloqueo_id,\
            g.descripcion AS bloqueo,\
            h.tipo_formula,\
            i.descripcion_tipo_formula\
            from hc_formulacion_antecedentes a\
            inner join hc_evoluciones h on a.evolucion_id = h.evolucion_id\
            inner join pacientes b on a.tipo_id_paciente = b.tipo_id_paciente and a.paciente_id = b.paciente_id\
            left join  eps_afiliados c on b.tipo_id_paciente = c.afiliado_tipo_id AND b.paciente_id = c.afiliado_id\
            inner join planes_rangos d on c.plan_atencion = d.plan_id and c.tipo_afiliado_atencion = d.tipo_afiliado_id and c.rango_afiliado_atencion = d.rango\
            inner join planes e on d.plan_id = e.plan_id\
            inner join system_usuarios f on a.medico_id = f.usuario_id\
            inner join inv_tipos_bloqueos g on b.tipo_bloqueo_id = g.tipo_bloqueo_id\
            left join esm_tipos_formulas i on h.tipo_formula = i.tipo_formula_id\
            where\
                a.evolucion_id= :1\
                "+where+"\
                and a.sw_formulado='1' \
                and g.estado='1' ; ";
   
    G.knex.raw(sql,parametros).then(function(resultado){
       
        callback(false, resultado);
    }).catch(function(err){        
        
        callback(err);
    });  
};

/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado de obtener quien realiza la formula
 * @controller DispensacionHc.prototype.listarMedicamentosPendientesPorDispensar
 */
DispensacionHcModel.prototype.profesionalFormula = function(obj,callback){
    
    var parametros = {1: obj.evolucionId};
    var sql = "SELECT hc.medico_id,\
              pro.nombre,\
              pro.tipo_id_tercero,\
              pro.tercero_id,\
              tipos.descripcion\
            FROM   hc_formulacion_antecedentes hc\
            LEFT JOIN profesionales_usuarios usu ON(hc.medico_id=usu.usuario_id)\
            LEFT JOIN profesionales pro ON (usu.tipo_tercero_id=pro.tipo_id_tercero) and (usu.tercero_id=pro.tercero_id)\
            LEFT JOIN tipos_profesionales tipos ON (pro.tipo_profesional=tipos.tipo_profesional)\
            WHERE  hc.evolucion_id = :1 ";
   
    G.knex.raw(sql,parametros).then(function(resultado){          
        callback(false, resultado)
    }).catch(function(err){        
        callback(err)
    });   
};

/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado consultar las formulas 
 *              las cuales se han dejado con estado todo_pendiente
 * @controller DispensacionHc.prototype.consultarProductosTodoPendiente
 */
DispensacionHcModel.prototype.consultarProductosTodoPendiente = function(evolucionId,callback){
    
    var parametros = {1: evolucionId};
    
    var sql = "SELECT   evolucion_id\
               FROM    hc_pendientes_por_dispensar\
               WHERE   todo_pendiente = 1\
	       AND bodegas_doc_id is null\
	       AND numeracion is null\
	       AND evolucion_id = :1 ";
   
    G.knex.raw(sql,parametros).then(function(resultado){ 
        console.log(" ***///888resultado ", resultado)
        callback(false, resultado)
    }).catch(function(err){   
        console.log("err ", err);
        callback(err)
    });   
};
/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion tipoVariable = 0 Modelo encargado de obtener el estado de la variable 
 *              de parametrizacion reformular 
 *              tipoVariable = 1 Modelo encargado de obtener el bodegas_doc_id
 * @controller DispensacionHc.prototype.estadoParametrizacionReformular
 */
DispensacionHcModel.prototype.estadoParametrizacionReformular = function(obj,callback){
    
   
    var sql = "a.valor FROM system_modulos_variables as a ";
    var query = G.knex.select(G.knex.raw(sql));
        query.where('a.variable',G.constants.db().LIKE,"%" + obj.variable + "%");
        if(obj.tipoVariable ===1){            
            query.andWhere('a.modulo',G.constants.db().LIKE,"%" + obj.modulo + "%")
        }
              
        query.then(function(resultado){  
        
        callback(false, resultado)
        
    }).catch(function(err){          
        
        callback(err)
    });
          
    
};


/**
 * 
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
DispensacionHcModel.prototype.actualizarTipoFormula = function(obj, callback) {
    console.log("****DispensacionHcModel.prototype.actualizarTipoFormula***");
     var sql = "UPDATE hc_evoluciones set tipo_formula = :2 WHERE evolucion_id = :1 ;";
   
    G.knex.raw(sql, {1: obj.evolucionId, 2: obj.tipoFormula}).
    then(function(resultado){ 
        console.log("resultado --->>>", resultado);
       callback(false, resultado);
    }).catch(function(err){    
        console.log("err ", err);
       callback(err);
    });
};


/**
 * 
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
DispensacionHcModel.prototype.autorizarDispensacionMedicamento = function(obj, callback) {

    console.log("****DispensacionHcModel.prototype.autorizarDispensacionMedicamento***");
    console.log("****DispensacionHcModel.prototype.autorizarDispensacionMedicamento***");
    console.log("****DispensacionHcModel.prototype.autorizarDispensacionMedicamento***");
    
     var sql = "update    hc_formulacion_antecedentes\
              set    sw_autorizado='1',\
                  usuario_autoriza_id = :2,\
                  observacion_autorizacion= :3,\
                  fecha_registro_autorizacion= :5\
            WHERE     evolucion_id = :1\
            AND     codigo_medicamento = :4 returning evolucion_id";
   
    G.knex.raw(sql, {1: obj.evolucionId, 2: obj.usuario, 3: obj.observacion, 4: obj.producto, 5: 'now()'}).
    then(function(resultado){ 
        console.log("resultado --->>>", resultado);
       callback(false, resultado);
    }).catch(function(err){    
        console.log("err ", err);
       callback(err);
    });
};
/**
 * 
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
DispensacionHcModel.prototype.asignacionNumeroDocumentoDespacho = function(obj, callback) {
    
     var sql = "UPDATE bodegas_doc_numeraciones set numeracion=numeracion + 1 \
                WHERE  bodegas_doc_id= :1 RETURNING numeracion;";
   
    G.knex.raw(sql, {1: obj.bodegasDocId}).
    then(function(resultado){   
       callback(false, resultado);
    }).catch(function(err){    
       callback(err);
    });

};

/**
 * 
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
DispensacionHcModel.prototype.bloquearTabla = function(callback) {

     var sql = "BEGIN WORK;\
                LOCK TABLE bodegas_doc_numeraciones IN ROW EXCLUSIVE MODE ;\
                COMMIT WORK;\
                ";
   
    G.knex.raw(sql).
    then(function(resultado){     
       callback(false, resultado);
    }).catch(function(err){       
       callback(err);
    });

};


/*
 * @autor : Cristian Ardila
 * Descripcion : Modelo encargado de manejar los procesos de generacion de dispensacion
 *               de una formula a traves de las transacciones, con el fin de que se
 *               cumpla cada registro prerequisito de otro y evitar la inconsistencia
 *               de datos
 * @fecha: 2016-08-01 09:45 pm 
 */
DispensacionHcModel.prototype.generarDispensacionFormulaPendientes = function(obj, callback)
{   
   console.log("***********generarDispensacionFormulaPendientes p**************");
   console.log("***********generarDispensacionFormulaPendientes P**************");
   console.log("***********generarDispensacionFormulaPendientes p**************");
   console.log("obj ", obj);
    var that = this;
    G.knex.transaction(function(transaccion) {  
        
        G.Q.nfcall(__insertarBodegasDocumentos, obj.parametro1, transaccion
            
         ).then(function(resultado){
                
            return  G.Q.nfcall(__guardarBodegasDocumentosDetalle,that,0, obj.parametro2,transaccion); 
               
        }).then(function(){
            
            return G.Q.ninvoke(that,'actualizarProductoPorBodega',obj.parametro1, transaccion);
            
        }).then(function(){
            
            return G.Q.ninvoke(that,'insertarDespachoMedicamentosPendientes',obj.parametro1, transaccion);
            
        }).then(function(){
                return G.Q.ninvoke(that,'consultarProductoTemporal',{evolucionId:obj.parametro1.evolucion},1)          
        }).then(function(resultado){
            console.log("resultado Producto temporal ", resultado.rows.length);
                if(resultado.rows.length >0){                                   
                    return G.Q.ninvoke(that,'listarMedicamentosPendientesSinDispensar',{evolucionId:obj.parametro1.evolucion});                                   
                }                    
        }).then(function(resultado){     
            
            console.log("resultado Pendientes sin dispensar ---->>>> ", resultado.rows.length);
                var def = G.Q.defer();
                if(resultado.rows.length >0){                   
                 
                    return G.Q.nfcall(__insertarMedicamentosPendientesPorDispensar,that,0, resultado.rows,obj.parametro1,transaccion);
                }else{
                    def.resolve();
                }         
            
        }).then(function(resultado){
            console.log("!resultado ? 0 : 1 ", resultado);
                obj.parametro1.conPendientes = !resultado ? 0 : resultado;
                return G.Q.ninvoke(that,'eliminarTemporalesDispensados',{evolucionId:obj.parametro1.evolucion}, transaccion); 
         
        }).then(function(){
                //console.log("obj.parametro1.conPendientes ", obj.parametro1.conPendientes);
                obj.parametro1.actualizarCampoPendiente = 1;
                return G.Q.ninvoke(that,'actualizarDispensacionEstados', obj.parametro1 , transaccion); 
                 
                 
                 
        }).then(function(){  
            console.log("COMMIT ----->>> ELIMINANDO TODO PENDIENTE **********")
            transaccion.commit();            
        }).fail(function(err){
            console.log("FAIL ", err)
                transaccion.rollback(err);
        }).done();

    }).then(function(){
       callback(false);
    }).catch(function(err){      
       callback(err.msj);
    }).done(); 
    
};

var totalInsertadosPendientes = 0;
/**
 * @author Cristian Manuel Ardila Troches  
 * +Descripcion funcion local recursiva encargada de recorrer el arreglo
 *              de los productos temporales que se insertaran en la tabla
 *              pendientes por dispensar y actualizara el disponible en bodega
 *  @fecha 08/08/2016
 **/
function __insertarMedicamentosPendientesPorDispensar(that, index, productos, parametros,transaccion, callback) {
    
    console.log("||||||||| __insertarMedicamentosPendientesPorDispensar |||||||||||||| ");
    console.log("||||||||| __insertarMedicamentosPendientesPorDispensar |||||||||||||| ");
    console.log("||||||||| __insertarMedicamentosPendientesPorDispensar |||||||||||||| ");
    console.log("totalInsertadosPendientes ****** ", totalInsertadosPendientes); 
    
    var producto = productos[index];
         
    if (!producto) {       
        callback(false,totalInsertadosPendientes);
        return; 
    }  
    
    
            
      console.log("9) Accion : insertarBodegasDocumentosDetalle ");
 
        G.Q.ninvoke(that,'actualizarProductoPendientePorBodega',parametros.evolucion,producto, transaccion).then(function(resultado){
            console.log("producto.total > 0 ::: ", producto.total);
            console.log("producto ", producto);
            if(parseInt(producto.total) > 0){
              
                G.Q.ninvoke(that,'insertarPendientesPorDispensar',producto, parametros.evolucion, 0, parametros.usuario, transaccion)
                   .then(function(resultado){                            
                           totalInsertadosPendientes = 1;
                           console.log(" -1- resultado totalInsertadosPendientes::::---:::: ", totalInsertadosPendientes);
                           console.log(" -2- resultado resultado::::---:::: ", resultado);
                        });
            }
            
             console.log("Se valida si es el ultimo producto por dispensar y si este es 0")
            if(productos.length === 1 && parseInt(producto.total) === 0){    

                        console.log("Entro se pone CERO 0")
                    totalInsertadosPendientes=0;

            }     
            
         }).fail(function(err){      
       }).done();                 
      
    index++;
    setTimeout(function() {
        __insertarMedicamentosPendientesPorDispensar(that, index, productos,parametros,transaccion, callback);
    }, 300);
   
       
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de actualizar el estado de los pendientes como entregados
 * @controller DispensacionHc.prototype.existenciasBodegas
 */
DispensacionHcModel.prototype.actualizarProductoPendientePorBodega = function(evolucion,producto,transaccion, callback){
  
   var parametros = {1: evolucion, 2: producto.codigo_producto};   
   var sql = "UPDATE hc_pendientes_por_dispensar\
		SET sw_estado='1'\
		WHERE evolucion_id = :1 AND codigo_medicamento = :2 ;";          
   var query = G.knex.raw(sql,parametros);
    
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){     
           
          callback(false, resultado);
   }).catch(function(err){       
       console.log("err ", err)
          callback({err:err, msj: "Error al realizar el despacho de los pendientes"});   
    });  
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de consultar los medicamentos pendientes sin dispensar
 * @controller DispensacionHc.prototype.existenciasBodegas
 */
DispensacionHcModel.prototype.listarMedicamentosPendientesSinDispensar = function(obj,callback){
    
    var parametros = {1: obj.evolucionId};
    
    var sql =  "Select  a.codigo_producto,\
                      (b.cantidades - a.cantidades) as total from\
                      ( \
                        SELECT codigo_formulado AS codigo_producto,\
                                SUM(cantidad_despachada) as cantidades\
                        FROM hc_dispensacion_medicamentos_tmp\
                        where evolucion_id= :1\
                        group by codigo_formulado\
              ) as a,\
              (   select  dc.codigo_medicamento as codigo_producto,\
                          SUM(dc.cantidad) as cantidades\
                  FROM  hc_pendientes_por_dispensar as dc\
                  WHERE      dc.evolucion_id = :1\
                  and        dc.sw_estado = '0'\
                  group by(dc.codigo_medicamento)\
          ) as b\
          where a.codigo_producto = b.codigo_producto\
          UNION\
          SELECT codigo_medicamento as codigo_producto,\
                  cantidad as cantidades\
          FROM hc_pendientes_por_dispensar\
          where evolucion_id= :1\
          and sw_estado = '0'\
          and codigo_medicamento\
          NOT IN( select codigo_formulado\
          FROM hc_dispensacion_medicamentos_tmp where evolucion_id= :1)  ";

     
    G.knex.raw(sql,parametros).then(function(resultado){ 
        
      callback(false, resultado)
    }).catch(function(err){         
         console.log("err ", err);
      callback(err)
    });            
};

/**
 *  
 * @author Cristian Manuel Ardila Troches
 * +Descripcion Metodo encargado de registrar el documento de despacho
 *              de los pendientes de una formula
 * @fecha 08/08/2016            
 */
DispensacionHcModel.prototype.insertarDespachoMedicamentosPendientes = function(obj,transaccion, callback){
    
   var parametros = {1: obj.bodegasDocId, 2: obj.numeracion, 3: obj.evolucion, 4: obj.todoPendiente};   
   var sql = "INSERT INTO hc_formulacion_despachos_medicamentos_pendientes\
              (bodegas_doc_id,numeracion,evolucion_id,todo_pendiente)\
               VALUES( :1, :2, :3, :4);"          
   var query = G.knex.raw(sql,parametros);
    
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){           
          callback(false, resultado);
   }).catch(function(err){
            callback({err:err, msj: "Error al generar el despacho de los medicamentos pendientes"});   
    });  
}

/**
 * @author Cristian Manuel Ardila
 * @fecha  2016/08/05
 * +Descripcion Metodo encargado de actualizar los medicamentos que estaban
 *              pendientes por ser despachados, agregandoles el bodegas_doc_id
 *              y la numeracion, este metodo se ejecutara en una transaccion
 * 
 * */
DispensacionHcModel.prototype.actualizarProductoPorBodega = function(obj,transaccion, callback){
   
   var parametros = {1: obj.bodegasDocId, 2: obj.numeracion, 3: obj.evolucion};   
   var sql = "UPDATE  hc_pendientes_por_dispensar\
		SET     bodegas_doc_id= :1,numeracion= :2\
		WHERE   evolucion_id = :3 ;";          
   var query = G.knex.raw(sql,parametros);
    
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){ 
          
          callback(false, resultado);
   }).catch(function(err){
         
          callback({err:err, msj: "Error al realizar el despacho de los pendientes"});   
    });  
};


var conPendientes;
/*
 * @autor : Cristian Ardila
 * Descripcion : Modelo encargado de manejar los procesos de generacion de dispensacion
 *               de una formula a traves de las transacciones, con el fin de que se
 *               cumpla cada registro prerequisito de otro y evitar la inconsistencia
 *               de datos
 * @fecha: 2016-08-01 09:45 pm 
 */
DispensacionHcModel.prototype.generarDispensacionFormula = function(obj, callback)
{   
   
    var that = this;

    G.knex.transaction(function(transaccion) {  
        
        G.Q.nfcall(__insertarBodegasDocumentos, obj.parametro1, transaccion).then(function(resultado){        
                return G.Q.nfcall(__insertarDespachoMedicamentos, obj.parametro1, transaccion);
        }).then(function(){          
               
                return  G.Q.nfcall(__guardarBodegasDocumentosDetalle,that,0, obj.parametro2,transaccion);  
        }).then(function(){
                return G.Q.ninvoke(that,'consultarProductoTemporal',{evolucionId:obj.parametro1.evolucion},1)          
        }).then(function(resultado){
          
                if(resultado.rows.length >0 || obj.parametro1.todoPendiente === '1'){                                   
                    return G.Q.ninvoke(that,'listarMedicamentosPendientes',{evolucionId:obj.parametro1.evolucion});                                   
                }        
        }).then(function(resultado){           
                var def = G.Q.defer();
              
                if(resultado.rows.length >0){
                    console.log("Insertar medicamentos pendientes ");
                /**
                 * +Descripcion Funcion recursiva que se encargada de almacenar los pendientes
                 */               
                    return G.Q.nfcall(__insertarMedicamentosPendientes,that,0, resultado.rows, obj.parametro1.evolucion,0, obj.parametro1.usuario,transaccion);
                }else{
                    def.resolve();
                }         
            
        }).then(function(resultado){
            
                obj.parametro1.conPendientes = !resultado ? 0 : resultado;
             
                return G.Q.ninvoke(that,'eliminarTemporalesDispensados',{evolucionId:obj.parametro1.evolucion}, transaccion); 
         
        }).then(function(){
                
                obj.parametro1.actualizarCampoPendiente = 0;
                return G.Q.ninvoke(that,'actualizarDispensacionEstados', obj.parametro1 , transaccion); 
         
        }).then(function(){  
            console.log("TRANSACCION COMMIT ");
               transaccion.commit();            
        }).fail(function(err){
            console.log("TRANSACCION FAIL ", err);
                transaccion.rollback(err);
        }).done();

    }).then(function(){
       callback(false);
    }).catch(function(err){ 
         console.log("TRANSACCION ERROR ", err);
       callback(err.msj);
    }).done(); 
    
};





/*
 * @autor : Cristian Ardila
 * Descripcion : Modelo encargado de guardar los medicamentos de una formula
 *               en pendientes por dispensar cuando el proceso se realizar
 *               por TODO PENDIENTE
 * @fecha: 2016-08-01 09:45 pm 
 */
DispensacionHcModel.prototype.guardarTodoPendiente = function(obj, callback)
{   
   console.log("*****DispensacionHcModel.prototype.guardarTodoPendiente*******");
   console.log("*****DispensacionHcModel.prototype.guardarTodoPendiente*******");
   console.log("*****DispensacionHcModel.prototype.guardarTodoPendiente*******");
   
    var that = this;                   
    var parametrosActualizarDispensacionEstados = {evolucion:obj.evolucionId, conPendientes:1, actualizarCampoPendiente:1}
    G.knex.transaction(function(transaccion) {  
        
        G.Q.ninvoke(that,'listarMedicamentosPendientes', {evolucionId:obj.evolucionId}).then(function(resultado){        
               
               console.log("listarMedicamentosPendientes ", resultado);
                if(resultado.rows.length >0){                   
                /**
                 * +Descripcion Funcion recursiva que se encargada de almacenar los pendientes
                 */
                    return G.Q.nfcall(__insertarMedicamentosPendientes,that,0, resultado.rows, obj.evolucionId,1, obj.usuario,transaccion);
                }     
                      
        }).then(function(resultado){
            
            return G.Q.ninvoke(that, 'actualizarDispensacionEstados',parametrosActualizarDispensacionEstados, transaccion);
            
        }).then(function(){  
            console.log("TRANSACCION COMMIT ");
                transaccion.commit();            
        }).fail(function(err){
            console.log("TRANSACCION FAIL ", err);
                transaccion.rollback(err);
        }).done();

    }).then(function(){
       callback(false);
    }).catch(function(err){ 
         console.log("TRANSACCION ERROR ", err);
       callback(err.msj);
    }).done(); 
    
};

/**
 * 
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
DispensacionHcModel.prototype.actualizarEstadoFormula = function(obj, callback) {
    console.log("*****DispensacionHcModel.prototype.actualizarEstadoFormula*********");
    console.log("*****DispensacionHcModel.prototype.actualizarEstadoFormula*********");
    console.log("*****DispensacionHcModel.prototype.actualizarEstadoFormula*********");
    
    var sql = "UPDATE hc_formulacion_antecedentes set sw_estado='0' WHERE evolucion_id = :1;";
   
    G.knex.raw(sql, {1: obj.evolucionId}).
    then(function(resultado){ 
        console.log("resultado --->>>", resultado);
       callback(false, resultado);
    }).catch(function(err){    
        console.log("err ", err);
       callback(err);
    });
};


/**
 * @author Cristian Manuel Ardila
 * @fecha  2016/08/08
 * +Descripcion Metodo encargado de actualizar la trazabilidad de la formula
 * 
 *                                  
 * */
DispensacionHcModel.prototype.actualizarDispensacionEstados = function(obj,transaccion, callback){
   console.log("*****DispensacionHcModel.prototype.actualizarDispensacionEstados*******");
   console.log("*****DispensacionHcModel.prototype.actualizarDispensacionEstados*******");
   console.log("*****DispensacionHcModel.prototype.actualizarDispensacionEstados*******");
   console.log("*****DispensacionHcModel.prototype.actualizarDispensacionEstados*******");
   
   var parametros = [];
       
    if(obj.actualizarCampoPendiente === 0){
        parametros = {fecha_entrega: obj.fechaEntrega,
                    fecha_minima_entrega: obj.fechaMinima,
                    fecha_maxima_entrega: obj.fechaMaxima,
                    sw_pendiente : obj.conPendientes};
    }else{
        parametros = {sw_pendiente : obj.conPendientes};
    }         
     
     console.log("parametros ", parametros);
     console.log("obj ", obj);
     
   var query = G.knex("dispensacion_estados").
            where("evolucion_id", obj.evolucion).
            update(parametros);
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){ 
          console.log("A QUI resultado ", resultado);
            callback(false, resultado);
    }).catch(function(err){
         console.log("err ", err);
            callback({err:err, msj: "Error al realizar el despacho de los pendientes"});   
    });  
};


  
/**
 * +Descripcion Variable que almacena la respuesta del servidor cuando
 *              se almacena el registro de los medicamenots pendientes
 *              por dispensar
 */
var rowCount;
/**
 * @author Cristian Ardila
 * +Descripcion Funcion recursiva encargada de recorrer el arreglo de los productos
 *              temporales que se almacenaran como pendientes
 * @fecha 2016-08-01
 * @Funcion local
 */
function __insertarMedicamentosPendientes(that, index, productos,evolucionId,todoPendiente,usuario,transaccion, callback) {
   
    var producto = productos[index];   
    
    if (!producto) {       
        console.log("Debe salir a qui ");
        callback(false,rowCount);
        return;                     
    }  
    
    if(parseInt(producto.total) > 0){      
        G.Q.ninvoke(that,'insertarPendientesPorDispensar',producto, evolucionId, todoPendiente, usuario, transaccion).then(function(resultado){
            rowCount = 1;
           console.log("resultado rowCount::::---:::: ", rowCount);
         }).fail(function(err){      
       }).done();   
    }
    
     console.log("Se valida si es el ultimo producto por dispensar y si este es 0")
    if(productos.length === 1 && parseInt(producto.total) === 0){    
        console.log("Entro se pone CERO 0")
        rowCount=0;
    }  
    
    index++;
    setTimeout(function() {
        __insertarMedicamentosPendientes(that, index, productos,evolucionId,todoPendiente,usuario,transaccion, callback);
    }, 300);
   
};



/**
 * @author Cristian Ardila
 * +Descripcion Funcion encargada de actualizar la existencias de bodegas
 *              y bodegas lotes fv a insertar el detalle de la dispensacion
 *              a traves de una funcion recursiva encargada de recorrer el arreglo de los productos
 *              temporales que se dispensaran 
 * @fecha 2016-08-01
 */
function __guardarBodegasDocumentosDetalle(that, index, parametros,transaccion, callback) {
    
    var producto = parametros.temporales[index];
   
    if (!producto) {       
        callback(false);
        return;
    }  
    index++;
       console.log("3 Accion : insertarBodegasDocumentosDetalle ");
     
    G.Q.nfcall(__actualizarExistenciasBodegasLotesFv, producto, transaccion).then(function(resultado){    
            
       console.log("4 Accion : __actualizarExistenciasBodegasLotesFv ");
       return  G.Q.nfcall(__actualizarExistenciasBodegas, producto, transaccion);
        
       
    }).then(function(resultado){
            
       console.log("5 Accion : __insertarBodegasDocumentosDetalle ");
       return G.Q.nfcall(__insertarBodegasDocumentosDetalle,producto,parametros.bodegasDocId, parametros.numeracion, parametros.planId,transaccion);
   
    
    }).then(function(resultado){
      
        
        setTimeout(function() {
            __guardarBodegasDocumentosDetalle(that, index, parametros,transaccion, callback);
        }, 300);
        
    }).fail(function(err){      
        callback(err);            
    }).done();
}


 
/**
 * @author Cristian Ardila
 * +Descripcion Query invocado desde una transaccion para actualizar
 *              la existencia actual de un producto cuando se dispensar
 *              una formula
 * @fecha 11/06/2016 (DD-MM-YYYY)
 */
function __actualizarExistenciasBodegasLotesFv(obj,transaccion,callback) {
    //Problemas con el filtro de la fecha de vencimiento    
    var formato = 'DD/mm/YYYY';
    var parametros = {1: obj.cantidad_despachada, 2: obj.empresa_id,  3: obj.centro_utilidad, 
                      4: obj.bodega , 5:obj.codigo_producto, 6:  G.moment(obj.fecha_vencimiento, formato), 7: obj.lote};
          
    var sql = "UPDATE  existencias_bodegas_lote_fv \
                set existencia_actual= existencia_actual - :1\
                WHERE   empresa_id = :2 \
                AND  centro_utilidad = :3\
                AND     bodega = :4\
                AND     codigo_producto = :5\
                AND     fecha_vencimiento = :6\
                AND     lote = :7 ";

    var query = G.knex.raw(sql,parametros);    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){     
            callback(false, resultado);
    }).catch(function(err){
            callback({err:err, msj: "Error al actualizar las existencias de los lotes por que no pueden ser menores a 0"});   
    });  

};

/**
 * @author Cristian Ardila
 * +Descripcion Query invocado desde una transaccion para actualizar
 *              la existencia actual de un producto cuando se dispensar
 *              una formula
 * @fecha 11/06/2016 (DD-MM-YYYY)
 */
function __actualizarExistenciasBodegas(obj,transaccion,callback) {

    var parametros = {1: obj.cantidad_despachada, 2: obj.empresa_id,  3: obj.centro_utilidad, 
                      4: obj.bodega , 5:obj.codigo_producto};
    var sql = "UPDATE  existencias_bodegas set     existencia= existencia - :1\
                WHERE   empresa_id = :2 \
                AND  centro_utilidad = :3\
                AND     bodega = :4\
                AND     codigo_producto = :5";

    var query = G.knex.raw(sql,parametros);    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){    
            callback(false, resultado);
    }).catch(function(err){
            callback({err:err, msj: "Error al actualizar las existencias de bodega por que no pueden ser menores a 0"});   
    });  
};


/**
 * @author Cristian Ardila
 * +Descripcion Modelo encargado insertar el detalle del pedido en la tabla
 *              de documentos
 * @fecha 11/06/2016
 */
function __insertarBodegasDocumentosDetalle(obj,bodegasDocId,numeracion,plan,transaccion, callback){
    
    var parametros ={1: obj.codigo_producto,2: obj.cantidad_despachada,3: obj.empresa_id,
                     4: plan,5: bodegasDocId,6: numeracion,7: obj.fecha_vencimiento,
                     8: obj.lote,9: '1'};
                 
    var sql = " INSERT INTO bodegas_documentos_d(consecutivo,codigo_producto,cantidad,total_costo,total_venta,bodegas_doc_id,numeracion,fecha_vencimiento,lote,sw_pactado)\
                VALUES( DEFAULT, :1, :2, (COALESCE(fc_precio_producto_plan('0', :1, :3,'0','0'),0)),\
                (COALESCE(fc_precio_producto_plan( :4, :1, :3,'0','0'),0)* :2),\
                 :5, :6, :7, :8, :9 );";
    
    var query = G.knex.raw(sql, parametros);
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){ 
          
            callback(false, resultado);
    }).catch(function(err){
            callback({err:err, msj: "Error al guardar el detalle de los productos dispensados"});   
    });
};


/*
 * Autor : Cristian Ardila
 * Descripcion : SQL para qye ingresara los productos que quedan pendientes
 *               por dispensar
 * @fecha: 08/06/2015 2:43 pm 
 */
DispensacionHcModel.prototype.insertarPendientesPorDispensar = function(producto,evolucionId,todoPendiente,usuario,transaccion,callback) {
   
   var parametros = {1: evolucionId, 2: producto.codigo_producto, 3: Math.round(producto.total),
                     4: usuario, 5: todoPendiente, 6: 'now()'};
  //console.log("parametros ", parametros);
   var sql = "INSERT INTO hc_pendientes_por_dispensar\
      (hc_pendiente_dispensacion_id,evolucion_id,codigo_medicamento,cantidad,\
       usuario_id,todo_pendiente,fecha_registro)\
            VALUES( DEFAULT, :1, :2, :3, :4, :5, :6 );";

           
    var query = G.knex.raw(sql,parametros );
    
   if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){ 
          console.log("resultado >>> ", resultado);
            callback(false, resultado);
    }).catch(function(err){
            callback({err:err, msj: "Error al guardar los medicamentos pendientes"});   
    });
};

/*
 * Autor : Cristian Ardila
 * Descripcion : SQL encargado de eliminar los productos que ya se han dispensado
 * @fecha: 08/06/2015 2:43 pm 
 */
DispensacionHcModel.prototype.eliminarTemporalesDispensados = function(obj,transaccion,callback) {
   
   var parametros = {1: obj.evolucionId};   
   var sql = "DELETE FROM hc_dispensacion_medicamentos_tmp WHERE  evolucion_id = :1;";          
   var query = G.knex.raw(sql,parametros );
    
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){    
          console.log("Eliminar resultado ", resultado)
          callback(false, resultado);
   }).catch(function(err){
            callback({err:err, msj: "Error al eliminar los temporales"});   
    });  
};



/*
 * @autor : Cristian Ardila
 * +Descripcion : Transaccion encargada de actualizar el ultimo evento
 *                del despacho de medicamentos prosiguiendo a registrar un 
 *                nuevo evento
 * @fecha: 05/07/2015
 */
DispensacionHcModel.prototype.registrarEvento = function(parametro, callback)
{  
    G.knex.transaction(function(transaccion) {          
        G.Q.nfcall(__actualizarDespachoMedicamentoEvento, parametro, transaccion).then(function(resultado){                               
            return G.Q.nfcall(__insertarDespachoMedicamentoEvento,parametro, transaccion);                
        }).then(function(resultado){      
           
            transaccion.commit();    
        }).fail(function(err){        
           transaccion.rollback(err);
        }).done();
        
    }).then(function(){     
            callback(false);
    }).catch(function(err){       
            callback(err);       
    }).done(); 
    
};

/*
 * @autor : Cristian Ardila
 * Descripcion : SQL para actualizar el estado del evento del despacho del medicamento
 * @fecha: 08/06/2015 09:45 pm 
 */
function __actualizarDespachoMedicamentoEvento(parametro, transaccion, callback) {
   
    var sql = "update hc_despacho_medicamentos_eventos\
         set   sw_estado='0'\
         where paciente_id= :1\
         and   tipo_id_paciente= :2\
         and   evolucion_id = :3\
         and   sw_estado ='1';";

    var query = G.knex.raw(sql,{1: parametro.pacienteId,2: parametro.tipoIdPaciente,3: parametro.evolucionId});    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){          
            callback(false, resultado);
    }).catch(function(err){   
           callback({err:err, msj: "Error al actualizar el evento"});
    });  
};

/*
 * @autor : Cristian Ardila
 * Descripcion : SQL para insertar un nuevo evento del despacho del medicamento
 * @fecha: 08/06/2015 09:45 pm 
 */
function __insertarDespachoMedicamentoEvento(parametro, transaccion, callback) {
  
    var sql = "INSERT INTO hc_despacho_medicamentos_eventos(\
         hc_despacho_evento,\
        paciente_id,\
       tipo_id_paciente,\
        evolucion_id,\
         observacion,\
        fecha_evento,\
        Fecha_Registro,\
       Usuario_id\
       )VALUES(\
       nextval('hc_despacho_medicamentos_eventos_hc_despacho_evento_seq'),\
        :1, :2, :3, :4, :5, :6, :7) RETURNING hc_despacho_evento;   ";

    var query = G.knex.raw(sql,{1: parametro.pacienteId,
                                2: parametro.tipoIdPaciente,
                                3: parametro.evolucionId, 
                                4: parametro.observacion,
                                5: parametro.fecha,
                                6: 'now()',
                                7: parametro.usuario});    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){ 
            console.log(" resultado ", resultado);
            callback(false, resultado);
    }).catch(function(err){
        console.log(" err ", err);
           callback({err:err, msj: "Error al guardar el evento"});
    });  
};

/*
 * @autor : Cristian Ardila
 * Descripcion : SQL para eliminar el producto de la tabla temporal
 * @fecha: 08/06/2015 09:45 pm 
 */
function __eliminarTemporalFarmacia(producto, transaccion, callback) {
   
    var sql = "DELETE FROM hc_dispensacion_medicamentos_tmp\
               WHERE hc_dispen_tmp_id = :1 \
               AND   evolucion_id = :2\
               AND   codigo_producto = :3";

    var query = G.knex.raw(sql,{1: producto.serialId,2: producto.evolucionId,3: producto.codigoProducto});    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){          
            callback(false, resultado);
    }).catch(function(err){
            callback(err);   
    });  
};



/*
 * Autor : Cristian Ardila
 * Descripcion : SQL para ingresar el producto en la tabla temporal
 *               cada vez que se dispensa el lote de la formula
 * @fecha: 08/06/2015 2:43 pm 
 */
function __insertarTemporalFarmacia(producto, transaccion, callback) {
   
    var sql = "INSERT INTO hc_dispensacion_medicamentos_tmp\
      (hc_dispen_tmp_id,evolucion_id,empresa_id,centro_utilidad,\
       bodega,codigo_producto,cantidad_despachada,fecha_vencimiento, \
        lote, codigo_formulado,usuario_id,sw_entregado_off\)\
            VALUES( DEFAULT, :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11 );";

 
    var query = G.knex.raw(sql, {1: producto.evolucionId, 
                                 2: producto.empresa, 
                                 3: producto.centroUtilidad,
                                 4: producto.bodega,
                                 5: producto.codigoProducto,
                                 6: producto.cantidad,
                                 7: producto.fechaVencimiento,
                                 8: producto.lote,
                                 9: producto.formulado,
                                 10: producto.usuario,
                                 11: producto.rango});
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){           
            callback(false, resultado);
    }).catch(function(err){
            callback(err);   
    });
   
};


/**
 * @author Cristian Ardila
 * +Descripcion Modelo encargado de crear el numero de despacho de la entrega
 *              de una formula
 * @fecha 11/06/2016
 */
function __insertarBodegasDocumentos(obj, transaccion, callback){
    
    var parametros ={1: obj.bodegasDocId,2: obj.numeracion,3: 'now()',
                     4: '0',5: null,6: obj.observacion,7: obj.usuario,
                     8: obj.todoPendiente,9: 'now()'};
                 
    var sql = " INSERT INTO bodegas_documentos(bodegas_doc_id,numeracion,fecha,total_costo,transaccion,observacion,usuario_id,todo_pendiente,fecha_registro)\
                VALUES( :1, :2, :3, :4, :5, :6, :7, :8, :9 );";
    
    var query = G.knex.raw(sql, parametros);
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){  
            console.log("resultado ", resultado);
            callback(false, resultado);
    }).catch(function(err){
            console.log("err ", err);
            callback({err:err, msj: "Error al generar el documento de bodega"});   
    });
};

/**
 * @author Cristian Ardila
 * +Descripcion Modelo encargado de registrar el despacho de medicamentos
 *              de una entrega de la formula
 * @fecha 11/06/2016
 */                   
function __insertarDespachoMedicamentos(obj, transaccion, callback){

    var sql = " INSERT INTO hc_formulacion_despachos_medicamentos(hc_formulacion_despacho_id,evolucion_id,bodegas_doc_id,numeracion)\
                VALUES( DEFAULT, :1, :2, :3);";
    
     var query = G.knex.raw(sql, {1: obj.evolucion, 2: obj.bodegasDocId,3: obj.numeracion});
                             
     if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){           
            callback(false, resultado);
    }).catch(function(err){
            callback({err:err, msj: "Error al generar el despacho del medicamento"});  
    });
}


DispensacionHcModel.$inject = [];


module.exports = DispensacionHcModel;