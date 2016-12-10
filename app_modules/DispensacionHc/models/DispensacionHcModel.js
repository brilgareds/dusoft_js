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
    
    console.log("-************DispensacionHcModel.prototype.listarFormulas*************");
    console.log("-************DispensacionHcModel.prototype.listarFormulas*************");
    console.log("-************DispensacionHcModel.prototype.listarFormulas*************");
 /**Campos exclusivos para cuando se envie la peticion 
   *solo para consultar las formulas pendientes
   **/
  console.log("PARAMETROS ", obj);
   var pendienteCampoEstado = "";
   var pendienteValidacion = "";
   
  
  if(obj.estadoFormula === '1'){     
        //pendienteCampoEstado = ",a.sw_pendiente as sw_estado";
        pendienteValidacion = " WHERE a.sw_pendiente IN ('1','2')";   
        
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
                        TO_CHAR(a.fecha_registro,'YYYY-MM-DD') AS registro,\
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
                        TO_CHAR(a.fecha_finalizacion,'YYYY-MM-DD') as fecha_finalizacion,\
                        TO_CHAR(a.fecha_registro,'YYYY-MM-DD') as fecha_formulacion,\
                        e.nombre,\
                        a.numero_entrega_actual,\
                        a.numero_total_entregas,\
                        TO_CHAR(a.fecha_entrega,'YYYY-MM-DD') as fecha_entrega,\
                        f.tipo_bloqueo_id,\
                        f.descripcion AS bloqueo,\
                        COALESCE(i.plan_id,0) as plan_id,\
                        i.plan_descripcion, a.sw_finalizado, a.numero_total_entregas, a.numero_entrega_actual,\
                        CASE WHEN a.sw_finalizado = '0' OR a.sw_finalizado is NULL\
                            THEN (\
                                CASE \
                                    WHEN a.sw_pendiente = '0' OR a.sw_pendiente is NULL OR a.sw_pendiente = '1' THEN(\
                                        CASE WHEN TO_CHAR(a.fecha_minima_entrega,'YYYY-MM-DD') <= TO_CHAR(now(),'YYYY-MM-DD')\
                                         and TO_CHAR(now(),'YYYY-MM-DD') <= TO_CHAR(a.fecha_maxima_entrega,'YYYY-MM-DD') THEN '0'\
                                             WHEN TO_CHAR(now(),'YYYY-MM-DD') > TO_CHAR(a.fecha_maxima_entrega,'YYYY-MM-DD') THEN '1'\
                                             ELSE '2' END\
                                        )\
                                    WHEN a.sw_pendiente = '2' THEN '4' END\
                                )\
                        WHEN a.sw_finalizado = '1'\
                            THEN (\
                                 CASE \
                                    WHEN a.sw_pendiente = '0' OR a.sw_pendiente is NULL THEN '3' \
                                    WHEN a.sw_pendiente = '1' THEN '3' \
                                    WHEN a.sw_pendiente = '2' THEN '4' END\
                                ) \
                         END AS estado_entrega,\
                       CASE WHEN a.sw_finalizado = '0' OR a.sw_finalizado is NULL\
                            THEN (\
                                CASE \
                                    WHEN a.sw_pendiente = '0' OR a.sw_pendiente is NULL  OR a.sw_pendiente = '1' THEN(\
                                        CASE WHEN TO_CHAR(a.fecha_minima_entrega,'YYYY-MM-DD') <= TO_CHAR(now(),'YYYY-MM-DD')\
                                         and TO_CHAR(now(),'YYYY-MM-DD') <= TO_CHAR(a.fecha_maxima_entrega,'YYYY-MM-DD') THEN 'Activa'\
                                        WHEN TO_CHAR(now(),'YYYY-MM-DD') > TO_CHAR(a.fecha_maxima_entrega,'YYYY-MM-DD') THEN 'Refrendar'\
                                        ELSE 'Falta ' || EXTRACT(DAY FROM  a.fecha_minima_entrega - timestamp 'now()')+1 || ' Dias' END\
                                        )\
                                    WHEN a.sw_pendiente = '2' THEN 'Todo pendiente' END\
                                ) \
                        WHEN a.sw_finalizado = '1'\
                            THEN (\
                                 CASE \
                                    WHEN a.sw_pendiente = '0' OR a.sw_pendiente is NULL THEN 'Tratamiento finalizado' \
                                    WHEN a.sw_pendiente = '1' THEN 'Tratamiento finalizado' \
                                    WHEN a.sw_pendiente = '2' THEN 'Todo pendiente' END\
                                ) \
                        END AS descripcion_estado_entrega\
                        ,a.sw_pendiente as sw_estado FROM \
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
              
    var query = G.knex.select(G.knex.raw(sql, parametros)).
    limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).then(function(resultado){          
        //console.log("resultado ", resultado)
        callback(false, resultado);
    }).catch(function(err){    
        console.log("err [listarFormulas]: ", err)
        callback("Ha ocurrido un error");      
    });
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de obtener los medicamentos pendientes dispensados  
 * @controller DispensacionHc.prototype.listarTodoMedicamentosDispensados
 * @controller DispensacionHc.prototype.listarMedicamentosDispensados
 */
DispensacionHcModel.prototype.listarMedicamentosPendientesDispensados = function(obj,callback){
    
 /* var parametros = {1: obj.evolucionId};                                      
    var sql =  "SELECT dd.codigo_producto,\
                dd.cantidad as numero_unidades,\
                TO_CHAR(dd.fecha_vencimiento,'YYYY-MM-DD') AS fecha_vencimiento,\
                dd.lote,\
                fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,\
                dd.sw_pactado,\
                fc_descripcion_producto_molecula(dd.codigo_producto) as molecula,\
                dd.total_costo,\
                to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega,\
                '1' as pendiente_dispensado,\
                TO_CHAR((select fecha_registro as fecha_entrega\
		from\
		hc_pendientes_por_dispensar  AS e \
		where \
		e.evolucion_id  = :1 and sw_estado='1' limit 1),'YYYY-MM-DD') as fecha_pendiente\
                FROM hc_formulacion_despachos_medicamentos_pendientes tmp\
                inner join bodegas_documentos as d on (tmp.bodegas_doc_id = d.bodegas_doc_id and tmp.numeracion = d.numeracion)\
                inner join bodegas_documentos_d AS dd on (d.bodegas_doc_id = dd.bodegas_doc_id and d.numeracion = dd.numeracion)\
                WHERE \
                tmp.evolucion_id = :1 AND d.todo_pendiente != 1";
              
   var query = G.knex.raw(sql,parametros)*/
      
   var columnas = ["dd.codigo_producto",
                    "dd.cantidad as numero_unidades",
                    G.knex.raw("TO_CHAR(dd.fecha_vencimiento,'YYYY-MM-DD') AS fecha_vencimiento"),
                    "dd.lote",
                    G.knex.raw("fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod"),
                    "dd.sw_pactado",
                    G.knex.raw("fc_descripcion_producto_molecula(dd.codigo_producto) as molecula"),
                    "dd.total_costo",
                    G.knex.raw("to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega"),
                    G.knex.raw("'1' as pendiente_dispensado"),
                    G.knex.raw("TO_CHAR((select fecha_registro as fecha_entrega \
                                FROM hc_pendientes_por_dispensar  AS e \
                               WHERE e.evolucion_id  = "+obj.evolucionId+" and sw_estado='1' limit 1),'YYYY-MM-DD') as fecha_pendiente")];
                 
     var query  = G.knex.select(columnas)
                        .from('hc_formulacion_despachos_medicamentos_pendientes as tmp')
                        .innerJoin('bodegas_documentos as d', 
                            function() {
                                this.on("tmp.bodegas_doc_id", "d.bodegas_doc_id")
                                    .on("tmp.numeracion", "d.numeracion")
                        }).innerJoin('bodegas_documentos_d AS dd', function() {
                                this.on("d.bodegas_doc_id", "dd.bodegas_doc_id")
                                    .on("d.numeracion", "dd.numeracion")
                        })
                        .where('evolucion_id',obj.evolucionId).andWhere("d.todo_pendiente","!=", 1);                 
                      
            
       query.then(function(resultado){ 
         console.log("resultado [listarMedicamentosPendientesDispensados]: ", resultado);
      callback(false, resultado);
    }).catch(function(err){         
         console.log("err [listarMedicamentosPendientesDispensados]: ", err);
      callback(err)
    });            
};
 
/**
 * @author Cristian Ardila
 * @fecha 23/09/2016
 * +Descripcion Modelo encargado de obtener la ultima dispensacion de pendientes
 * @controller DispensacionHc.prototype.listarUltimaDispensacionPendientes
 */
DispensacionHcModel.prototype.listarUltimaDispensacionPendientes = function(obj,callback){
    
    var parametros = {1: obj.evolucionId};
                                                       
    var sql ="SELECT * FROM (\
                SELECT dd.codigo_producto as codigo_medicamento,\
                                dd.cantidad as cantidad_entrega,\
                                dd.fecha_vencimiento,\
                                dd.lote,\
                                fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,\
                                dd.sw_pactado,\
                                fc_descripcion_producto_molecula(dd.codigo_producto) as molecula,\
                                dd.total_costo,\
                                d.fecha_registro as fecha_entrega,\
                                '1' as pendiente_dispensado,\
                                (select fecha_registro as fecha_entrega\
                                  from\
                                  hc_pendientes_por_dispensar  AS e \
                                  where \
                                  e.evolucion_id  = :1 and sw_estado='1' limit 1\
                                ) as fecha_pendiente\
                          FROM hc_formulacion_despachos_medicamentos_pendientes tmp\
                          inner join bodegas_documentos as d on (tmp.bodegas_doc_id = d.bodegas_doc_id and tmp.numeracion = d.numeracion)\
                          inner join bodegas_documentos_d AS dd on (d.bodegas_doc_id = dd.bodegas_doc_id and d.numeracion = dd.numeracion)\
                          WHERE \
                          tmp.evolucion_id = :1 AND d.todo_pendiente != 1 \
                          )as a WHERE a.fecha_entrega = ( \
                          	SELECT distinct(max(d2.fecha_registro))\
                            FROM hc_formulacion_despachos_medicamentos_pendientes tmp2\
                            inner join bodegas_documentos as d2 on \
                            (tmp2.bodegas_doc_id = d2.bodegas_doc_id and tmp2.numeracion = d2.numeracion)\
                          	WHERE tmp2.evolucion_id = :1 AND d2.todo_pendiente != 1 \
                          )";

                      
    G.knex.raw(sql,parametros).then(function(resultado){ 
        //console.log("resultado Pendientes por dispensar::: ", resultado);
      callback(false, resultado)
    }).catch(function(err){    
        console.log("parametro : ", parametros);
        console.log("err [listarUltimaDispensacionPendientes]: ", err);
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
    
    
    var parametros = {1: obj.evolucionId};
    var sql= " SELECT todo.* FROM ( \
    SELECT k.codigo_producto,\
       k.numero_unidades,\
       TO_CHAR(k.fecha_vencimiento,'YYYY-MM-DD')AS fecha_vencimiento, \
       k.lote,  \
       k.descripcion_prod, \
       fc_descripcion_producto_alterno(k.codigo_producto) as molecula,\
       k.usuario_id, \
       k.nombre,\
       k.descripcion,\
       k.sw_pactado,\
       k.total_costo,\
       k.fecha, \
       k.grupo_id,\
       k.numero_entrega_actual as entrega,\
       k.sistema, \
       k.dias_de_entregado, \
       K.fecha_entrega as fecha_entrega,\
       k.grupo_id\
    FROM(   \
            SELECT dd.codigo_producto, \
                   dd.cantidad as numero_unidades, \
                   dd.fecha_vencimiento, \
                   dd.lote, \
                   dd.sw_pactado,\
                   dd.total_costo,\
                   fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod, \
                   sys.usuario_id, \
                   sys.nombre,\
                   sys.descripcion,\
                   'dispensacion_hc' as sistema, \
                   to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega, \
                   to_char(now()- d.fecha_registro,'dd') as dias_de_entregado, \
                   ( \
                   SELECT min(hcf.fecha_formulacion)  \
                   FROM hc_formulacion_antecedentes hcf  \
                   WHERE hcf.evolucion_id = :1 \
                   )as fecha, \
                   d.fecha_registro,\
                   inv.grupo_id,\
                   d.numero_entrega_actual \
      		 FROM  hc_formulacion_despachos_medicamentos_pendientes hc \
                   INNER JOIN bodegas_documentos d ON hc.bodegas_doc_id = d.bodegas_doc_id AND hc.numeracion = d.numeracion \
                   INNER JOIN bodegas_documentos_d dd ON dd.bodegas_doc_id = d.bodegas_doc_id AND dd.numeracion = d.numeracion\
                   INNER JOIN system_usuarios sys ON sys.usuario_id = d.usuario_id\
                   INNER JOIN inventarios_productos inv ON inv.codigo_producto  = dd.codigo_producto\
             WHERE hc.evolucion_id = :1 AND d.todo_pendiente = '1' \
      UNION  \
      SELECT dd.codigo_producto, \
             dd.cantidad as numero_unidades, \
             dd.fecha_vencimiento,\
             dd.lote, \
             dd.sw_pactado,\
             dd.total_costo,\
      	     fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,  \
             sys.usuario_id, \
             sys.nombre,\
             sys.descripcion,\
             'dispensacion_hc' as sistema,\
             to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega, \
             to_char(now()- d.fecha_registro,'dd') as dias_de_entregado,\
             (SELECT min(hcf.fecha_formulacion) FROM hc_formulacion_antecedentes hcf WHERE hcf.evolucion_id = :1 )as fecha, \
             d.fecha_registro,\
             inv.grupo_id,\
             d.numero_entrega_actual\
       FROM hc_formulacion_despachos_medicamentos as dc,\
            bodegas_documentos as d,\
            bodegas_documentos_d AS dd,\
            system_usuarios  sys,\
            inventarios_productos inv  \
       WHERE dc.bodegas_doc_id = d.bodegas_doc_id\
             and dc.numeracion = d.numeracion \
             and dc.evolucion_id = :1\
             and d.bodegas_doc_id = dd.bodegas_doc_id\
             and d.numeracion = dd.numeracion\
             and d.usuario_id=sys.usuario_id \
             and inv.codigo_producto  = dd.codigo_producto\
  )as k \
  )as todo WHERE todo.entrega = (SELECT max(numero_entrega_actual) from dispensacion_estados where evolucion_id = :1 )";
   
    G.knex.raw(sql,parametros).then(function(resultado){    
      
        callback(false, resultado);
       
    }).catch(function(err){        
      console.log(" err [listarMedicamentosDispensados]: ", err);
        callback(err);
    });
          
   
};


/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado de obtener la ultima dispensacion de la formula
 *              sea normal o pendientes
 * @controller DispensacionHc.prototype.listarMedicamentosDispensados
 */
DispensacionHcModel.prototype.listarUltimaDispensacionFormula = function(obj,callback){
    
    
    var parametros = {1: obj.evolucionId};
   
    var sql= " SELECT entrega.codigo_producto,  \
       round(entrega.numero_unidades)as numero_unidades, \
       entrega.fecha_vencimiento,\
       entrega.lote,    \
       entrega.descripcion_prod, \
       entrega.molecula, \
       entrega.usuario_id,   \
       entrega.nombre,  \
       entrega.descripcion, \
      entrega.sw_pactado,  \
       entrega.total_costo, \
       entrega.fecha,   \
       case when entrega.entrega = 0 then 'Pendientes'\
            else ' No.'||entrega.entrega\
            end as entrega,\
       entrega.sistema, \
        entrega.dias_de_entregado, \
       to_char(entrega.fecha_entrega, 'YYYY-DD-MM')as fecha_entrega,  \
        entrega.grupo_id, entrega.tipo_entrega \
 FROM ( \
SELECT todo.codigo_producto,  \
       todo.numero_unidades, \
       (todo.fecha_vencimiento)AS fecha_vencimiento,   \
       todo.lote,    \
       todo.descripcion_prod, \
       fc_descripcion_producto_alterno(todo.codigo_producto) as molecula, \
       todo.usuario_id,   \
       todo.nombre,  \
       todo.descripcion, \
      todo.sw_pactado,  \
       todo.total_costo, \
       todo.fecha,   \
       todo.entrega, \
       'hc_dispensaciontodo' as sistema,\
        todo.dias_de_entregado, \
       todo.fecha_entrega as fecha_entrega,  \
        todo.grupo_id, todo.tipo_entrega  \
       FROM (   \
            SELECT k.codigo_producto,  \
               k.numero_unidades,  \
               TO_CHAR(k.fecha_vencimiento,'YYYY-MM-DD')AS fecha_vencimiento,   \
               k.lote,    \
               k.descripcion_prod,   \
               fc_descripcion_producto_alterno(k.codigo_producto) as molecula,  \
               k.usuario_id,   \
               k.nombre,  \
               k.descripcion,  \
               k.sw_pactado,  \
               k.total_costo,  \
               k.fecha,   \
               k.grupo_id,  \
               k.numero_entrega_actual as entrega,  \
               k.sistema,   \
               k.dias_de_entregado, \
               K.fecha_entrega as fecha_entrega, k.tipo_entrega \
            FROM(     \
                SELECT dd.codigo_producto,\
                       dd.cantidad as numero_unidades, \
                       dd.fecha_vencimiento,   \
                       dd.lote,   \
                       dd.sw_pactado,  \
                       dd.total_costo,  \
                       fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,   \
                       sys.usuario_id,   \
                       sys.nombre,  \
                       sys.descripcion,\
                       'dispensacion_hc' as sistema,   \
                       d.fecha_registro as fecha_entrega,   \
                       to_char(now()- d.fecha_registro,'dd') as dias_de_entregado,   \
                       (   \
                       SELECT min(hcf.fecha_formulacion)    \
                       FROM hc_formulacion_antecedentes hcf    \
                       WHERE hcf.evolucion_id = :1  \
                       )as fecha,   \
                       d.fecha_registro,  \
                       inv.grupo_id,  \
                       d.numero_entrega_actual, '1' as tipo_entrega   \
               FROM  hc_formulacion_despachos_medicamentos_pendientes hc   \
                       INNER JOIN bodegas_documentos d ON hc.bodegas_doc_id = d.bodegas_doc_id AND hc.numeracion = d.numeracion   \
                       INNER JOIN bodegas_documentos_d dd ON dd.bodegas_doc_id = d.bodegas_doc_id AND dd.numeracion = d.numeracion  \
                       INNER JOIN system_usuarios sys ON sys.usuario_id = d.usuario_id  \
                       INNER JOIN inventarios_productos inv ON inv.codigo_producto  = dd.codigo_producto  \
                 WHERE hc.evolucion_id = :1 AND d.todo_pendiente = '1'   \
      UNION    \
              SELECT dd.codigo_producto,   \
                     dd.cantidad as numero_unidades,   \
                     dd.fecha_vencimiento,  \
                     dd.lote,   \
                     dd.sw_pactado,  \
                     dd.total_costo,  \
                     fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,    \
                     sys.usuario_id,   \
                     sys.nombre,  \
                     sys.descripcion,  \
                     'dispensacion_hc' as sistema,  \
                     d.fecha_registro as fecha_entrega,   \
                     to_char(now()- d.fecha_registro,'dd') as dias_de_entregado,  \
                     (SELECT min(hcf.fecha_formulacion) FROM hc_formulacion_antecedentes hcf WHERE hcf.evolucion_id = :1 )as fecha,  \
                     d.fecha_registro,  \
                     inv.grupo_id,  \
                     d.numero_entrega_actual, '0' as tipo_entrega  \
                 FROM hc_formulacion_despachos_medicamentos as dc,  \
                      bodegas_documentos as d,  \
                      bodegas_documentos_d AS dd,  \
                      system_usuarios  sys,  \
                      inventarios_productos inv    \
                 WHERE dc.bodegas_doc_id = d.bodegas_doc_id  \
                       and dc.numeracion = d.numeracion\
                       and dc.evolucion_id = :1  \
                       and d.bodegas_doc_id = dd.bodegas_doc_id  \
                       and d.numeracion = dd.numeracion  \
                       and d.usuario_id=sys.usuario_id   \
                     and inv.codigo_producto  = dd.codigo_producto\
  )as k   \
  )as todo WHERE todo.entrega = (SELECT max(numero_entrega_actual) from dispensacion_estados where evolucion_id = :1 ) \
  UNION  \
  SELECT a.codigo_producto,  \
       a.cantidad_entrega as numero_unidades, \
       TO_CHAR(a.fecha_vencimiento,'YYYY-MM-DD')AS fecha_vencimiento,   \
       a.lote,    \
       a.descripcion_prod, \
       fc_descripcion_producto_alterno(a.codigo_producto) as molecula \
      ,a.usuario_id,   \
       a.nombre,  \
       a.descripcion, \
       a.sw_pactado,  \
       a.total_costo,\
        a.fecha,    \
       a.numero_entrega_actual as entrega, \
       'hc_dispensaciontodo' as sistema,\
       a.dias_de_entregado, \
       a.fecha_entrega as fecha_entrega,  \
        a.grupo_id, '1' as tipo_entrega \
        FROM (  \
                SELECT dd.codigo_producto,  \
                                dd.cantidad as cantidad_entrega,  \
                                dd.fecha_vencimiento,  \
                                dd.lote,  \
                                fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,  \
                                dd.sw_pactado,  \
                                fc_descripcion_producto_molecula(dd.codigo_producto) as molecula,  \
                                dd.total_costo,  \
                                '1' as pendiente_dispensado,  \
                                (select fecha_registro as fecha_entrega  \
                                  from  \
                                  hc_pendientes_por_dispensar  AS e   \
                                  where   \
                                  e.evolucion_id  = :1 and sw_estado='1' limit 1  \
                                ) as fecha_pendiente, \
                                d.usuario_id, \
                                sys.nombre,  \
                        sys.descripcion, \
                                 'dispensacion_hc' as sistema, \
                                 d.fecha_registro as fecha_entrega,  \
                                  to_char(now()- d.fecha_registro,'dd') as dias_de_entregado, \
                                   (   \
                   SELECT min(hcf.fecha_registro)  \
                   FROM dispensacion_estados hcf    \
                   WHERE hcf.evolucion_id = :1  \
                   )as fecha, \
                    d.fecha_registro,  \
                   inv.grupo_id,  \
                   d.numero_entrega_actual    \
                          FROM hc_formulacion_despachos_medicamentos_pendientes tmp  \
                          inner join bodegas_documentos as d on (tmp.bodegas_doc_id = d.bodegas_doc_id and tmp.numeracion = d.numeracion)  \
                          inner join bodegas_documentos_d AS dd on (d.bodegas_doc_id = dd.bodegas_doc_id and d.numeracion = dd.numeracion)  \
                          INNER JOIN system_usuarios sys ON sys.usuario_id = d.usuario_id \
                          INNER JOIN inventarios_productos inv ON inv.codigo_producto  = dd.codigo_producto  \
                          WHERE   \
                          tmp.evolucion_id = :1 AND d.todo_pendiente != 1   \
                          )as a WHERE a.fecha_entrega = (   \
                              SELECT distinct(max(d2.fecha_registro))  \
                            FROM hc_formulacion_despachos_medicamentos_pendientes tmp2  \
                            inner join bodegas_documentos as d2 on   \
                            (tmp2.bodegas_doc_id = d2.bodegas_doc_id and tmp2.numeracion = d2.numeracion)  \
                              WHERE tmp2.evolucion_id = :1 AND d2.todo_pendiente != 1   \
                          )  \
  )as entrega WHERE entrega.fecha_entrega ilike '%'||(SELECT fecha_ultima_entrega FROM dispensacion_estados WHERE evolucion_id = :1)||'%'";
    
    var query = G.knex.raw(sql,parametros);
     
            query.then(function(resultado){    
     
        callback(false, resultado.rows);
     
    }).catch(function(err){        
      console.log(" err [listarMedicamentosDispensados]: ", err);
        callback(err);
    });
};    

/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado de obtener quien realiza la formula
 * @controller DispensacionHc.prototype.listarTodoMedicamentosDispensados
 */
DispensacionHcModel.prototype.listarTodoMedicamentosDispensados = function(obj,callback){
    
    var parametros = {1: obj.evolucionId};
    var sql = "SELECT\
       TO_CHAR(k.fecha_registro,'YYYY-MM-DD') AS fecha_registro,\
       k.fecha,\
       cast(k.numero_entrega_actual as text) as Entrega,\
       k.codigo_producto,\
       round(k.numero_unidades) as numero_unidades,\
       TO_CHAR(k.fecha_vencimiento,'YYYY-MM-DD') AS fecha_vencimiento,\
       k.lote,\
       k.descripcion_prod,\
       k.usuario_id,\
       k.sistema,\
       k.dias_de_entregado,\
       K.fecha_entrega as fecha_entrega\
        FROM(   SELECT   dd.codigo_producto,\
                        dd.cantidad as numero_unidades,\
                        dd.fecha_vencimiento ,\
                        dd.lote,\
                        fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,\
                        d.usuario_id,\
                        'dispensacion_hc' as sistema,\
                        to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega,\
                        to_char(now()- d.fecha_registro,'dd') as dias_de_entregado,\
                                (\
                                	SELECT min(hcf.fecha_formulacion) \
                                    FROM hc_formulacion_antecedentes hcf \
                                    WHERE hcf.evolucion_id = :1 \
                                    )as fecha,\
                                d.fecha_registro,\
                        d.numero_entrega_actual\
			FROM  hc_formulacion_despachos_medicamentos_pendientes hc\
                        INNER JOIN bodegas_documentos d\
                         ON hc.bodegas_doc_id = d.bodegas_doc_id AND hc.numeracion = d.numeracion\
                        INNER JOIN bodegas_documentos_d dd ON\
                            dd.bodegas_doc_id = d.bodegas_doc_id\
                            AND dd.numeracion     = d.numeracion\
                            WHERE hc.evolucion_id = :1 AND d.todo_pendiente = '1' \
			UNION \
			select\
                                dd.codigo_producto,\
                                dd.cantidad as numero_unidades,\
                                dd.fecha_vencimiento ,\
                                dd.lote,\
                                fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod,\
                                d.usuario_id,\
                                'dispensacion_hc' as sistema,\
                                to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega,\
                                to_char(now()- d.fecha_registro,'dd') as dias_de_entregado,\
                                (\
                                	SELECT min(hcf.fecha_formulacion) \
                                    FROM hc_formulacion_antecedentes hcf \
                                    WHERE hcf.evolucion_id = :1 \
                                    )as fecha,\
                                d.fecha_registro,\
                                d.numero_entrega_actual\
                                FROM\
                                  hc_formulacion_despachos_medicamentos as dc,\
                                  bodegas_documentos as d,\
                                  bodegas_documentos_d AS dd\
                                WHERE\
                                     dc.bodegas_doc_id = d.bodegas_doc_id\
                                and        dc.numeracion = d.numeracion\
                                and        dc.evolucion_id = :1 \
                                and        d.bodegas_doc_id = dd.bodegas_doc_id\
                                and        d.numeracion = dd.numeracion\
                           )as k\
                           order by fecha_entrega asc";
    G.knex.raw(sql,parametros).then(function(resultado){    
      
        callback(false, resultado)
    }).catch(function(err){        
      console.log("err [listarTodoMedicamentosDispensados] ", err);
        callback(err);
    });
}
/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de los tipos de documentos
 * @controller DispensacionHc.prototype.listarTipoDocumento
 */
DispensacionHcModel.prototype.listarTipoDocumento = function(callback){
   
    G.knex.column('tipo_id_tercero as id', 'descripcion')
          .select()
          .from('tipo_id_terceros')
          .orderBy('tipo_id_tercero', 'asc').then(function(resultado){ 
             
        callback(false, resultado)
    }).catch(function(err){    
        console.log("err [listarTipoDocumento]:", err);
        callback(err);
    });
    
};


/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar las formulas que tienen medicamentos
 *              pendientes
 * @controller DispensacionHc.prototype.listarFormulasPendientes
 */
DispensacionHcModel.prototype.listarFormulasPendientes = function(obj,callback){
    
   var parametros = {};
   var sqlCondicion = "";
  
   if(obj.fechaInicial !=="" && obj.fechaFinal !=="" && obj.terminoBusqueda ==="" || obj.terminoBusqueda ===""){
       
       sqlCondicion = " AND HP.fecha_registro between :1 and :2 ";
        parametros["1"]= obj.fechaInicial;
        parametros["2"]= obj.fechaFinal;
         
    }
   
   if(obj.filtro.tipo === 'FO' && obj.terminoBusqueda !==""){
         
        sqlCondicion = " AND HP.fecha_registro between :1 and :2 AND HF.numero_formula::varchar = :3";
        
        parametros["1"]= obj.fechaInicial;
        parametros["2"]= obj.fechaFinal;
        parametros["3"]= obj.terminoBusqueda;
       
   }
   if(obj.filtro.tipo === 'EV' && obj.terminoBusqueda !==""){
       
        sqlCondicion = " AND HF.evolucion_id = :3";
        parametros["3"]= obj.terminoBusqueda;
        
   }
   if(obj.filtro.tipo !== 'EV' && obj.filtro.tipo !== 'FO'){
       console.log("BUSQUEDA DIFERENTE A EV o A FO")
        sqlCondicion = " AND HF.fecha_registro between :1 and :2 AND HF.tipo_id_paciente = :3 AND HF.paciente_id::varchar = :4 ";
        parametros["1"]= obj.fechaInicial;
        parametros["2"]= obj.fechaFinal;
        parametros["3"]= obj.filtro.tipo;
        parametros["4"]= obj.terminoBusqueda;
     
   }
    console.log("parametros ", parametros);
    var sql = " DISTINCT HP.CODIGO_MEDICAMENTO,\
                  HF.NUMERO_FORMULA,\
                  HP.EVOLUCION_ID,\
                  (P.PRIMER_APELLIDO||' '||P.SEGUNDO_APELLIDO) AS NOMBRES,\
                  (P.PRIMER_NOMBRE||' '||P.SEGUNDO_NOMBRE) AS  APELLIDOS,\
                  P.TIPO_ID_PACIENTE,\
                  P.PACIENTE_ID,\
                  edad(P.FECHA_NACIMIENTO) AS EDAD,\
                  (CASE WHEN P.SEXO_ID='F' THEN 'FEMENINO' WHEN P.SEXO_ID='M' THEN 'MASCULINO' END)AS  SEXO,\
                  P.RESIDENCIA_DIRECCION,\
                  P.RESIDENCIA_TELEFONO,\
                  HP.CODIGO_MEDICAMENTO,\
                  FC_DESCRIPCION_PRODUCTO_ALTERNO(HP.CODIGO_MEDICAMENTO) AS DESCRIPCION,\
                  HP.CANTIDAD,\
                  HP.hc_pendiente_dispensacion_id\
               FROM\
                  HC_PENDIENTES_POR_DISPENSAR HP\
                  INNER JOIN HC_FORMULACION_ANTECEDENTES HF  ON (HF.EVOLUCION_ID=HP.EVOLUCION_ID AND HP.SW_ESTADO='0')\
                  INNER JOIN PACIENTES P ON (P.TIPO_ID_PACIENTE=HF.TIPO_ID_PACIENTE AND P.PACIENTE_ID=HF.PACIENTE_ID)\
               WHERE\
                  HP.SW_ESTADO='0'  " + sqlCondicion;
  
  
             
    var query = G.knex.select(G.knex.raw(sql,parametros)).
    limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).then(function(resultado){          
        //console.log("resultado ", resultado)
        callback(false, resultado);
    }).catch(function(err){    
        console.log("err ", err)
        callback("Ha ocurrido un error");      
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
    
    console.log("***********DispensacionHcModel.prototype.listarMedicamentosFormulados*****************");
    console.log("***********DispensacionHcModel.prototype.listarMedicamentosFormulados*****************");
    console.log("***********DispensacionHcModel.prototype.listarMedicamentosFormulados*****************");
    var parametros = {1: obj.evolucionId};
       
        
        var sql = "SELECT * FROM (\
                SELECT  hc.codigo_medicamento,  \
                ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30)  as numero_entregas,\
               (hc.fecha_finalizacion - hc.fecha_registro)  as diferencia_final_inicio,  \
                hc.fecha_registro,   \
                hc.fecha_finalizacion,   \
                hc.dosis,  \
                hc.unidad_dosificacion,   \
                hc.frecuencia,  \
                hc.tiempo_total,  \
                hc.perioricidad_entrega,   \
                hc.descripcion,  \
                hc.tiempo_perioricidad_entrega,  \
                hc.unidad_perioricidad_entrega,  \
                round(hc.cantidad) as cantidad,  \
                round(a.cantidad) as  cantidad_entrega,  \
                hc.fecha_modificacion,  \
                pric.descripcion as principio_activo,  \
                pric.cod_principio_activo,  \
                fc_descripcion_producto_alterno(hc.codigo_medicamento) as descripcion_prod,  \
                hc.sw_autorizado,  \
                hc.tipo_id_paciente,  \
                hc.paciente_id,  \
                TO_CHAR(hc.fecha_formulacion,'YYYY-MM-DD') AS fecha_formulacion,  \
                refrendar,  \
                hc.numero_formula,  \
                invp.cod_forma_farmacologica, \
                CASE WHEN (  \
                  SELECT sum(tmp.cantidad_despachada) FROM hc_dispensacion_medicamentos_tmp tmp  \
                  WHERE tmp.evolucion_id = hc.evolucion_id AND tmp.codigo_formulado = hc.codigo_medicamento   \
                    GROUP BY tmp.codigo_formulado   \
                    ) = a.cantidad THEN '1' ELSE '0' END  AS sw_seleccionar_tmp  \
                FROM   hc_formulacion_antecedentes hc  \
                LEFT JOIN  medicamentos med ON(hc.codigo_medicamento=med.codigo_medicamento)   \
                LEFT JOIN inv_med_cod_principios_activos pric ON (med.cod_principio_activo=pric.cod_principio_activo)   \
                LEFT JOIN  inventarios_productos invp ON(hc.codigo_medicamento=invp.codigo_producto)  \
                JOIN hc_medicamentos_recetados_amb a ON hc.codigo_medicamento = a.codigo_producto AND hc.evolucion_id = a.evolucion_id  \
                WHERE hc.evolucion_id = :1 ORDER BY  ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30)                \
          )AS A WHERE A.numero_entregas > (SELECT es.numero_entrega_actual FROM dispensacion_estados es WHERE es.evolucion_id = :1 )";
   
    G.knex.raw(sql,parametros).then(function(resultado){ 
        //console.log("ESTA ES LA LISTA DE PRODUCTOS ", resultado.rows);
        callback(false, resultado)
    }).catch(function(err){    
        console.log("Error [listarMedicamentosFormulados]: ", err);
        callback(err);
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
     
    var sql = "SELECT B.codigo_medicamento,\
       B.cantidad_entrega,\
       B.descripcion_prod, \
       B.cod_principio_activo,\
       B.sw_autorizado,  \
       B.perioricidad_entrega,\
       B.tiempo_total ,  \
       B.cod_forma_farmacologica,\
       B.evolucion_id,\
       CASE WHEN(\
                 SELECT sum(tmp.cantidad_despachada) FROM hc_dispensacion_medicamentos_tmp tmp\
                 WHERE tmp.evolucion_id = B.evolucion_id AND tmp.codigo_formulado = B.codigo_medicamento \
                 GROUP BY tmp.codigo_formulado \
                 ) = B.cantidad_entrega THEN '1' ELSE '0' END  AS sw_seleccionar_tmp \
 FROM (\
		SELECT A.codigo_medicamento,  \
               SUM(numero_unidades) as cantidad_entrega,  \
               fc_descripcion_producto_alterno(A.codigo_medicamento) as descripcion_prod,  \
               med.cod_principio_activo,hc.sw_autorizado,  \
               hc.perioricidad_entrega,  \
               hc.tiempo_total,  \
               invp.cod_forma_farmacologica,\
               hc.evolucion_id\
         FROM (  \
                SELECT dc.codigo_medicamento,\
                       SUM(dc.cantidad) as numero_unidades  \
                FROM  hc_pendientes_por_dispensar as dc  \
                WHERE dc.evolucion_id = :1 \
                 AND dc.sw_estado = '0'  \
                GROUP BY(dc.codigo_medicamento)  \
                  )as A INNER JOIN hc_formulacion_antecedentes hc ON (hc.codigo_medicamento=A.codigo_medicamento)   \
                     LEFT JOIN  medicamentos med ON(A.codigo_medicamento=med.codigo_medicamento)   \
                     LEFT JOIN inv_med_cod_principios_activos pric ON (med.cod_principio_activo=pric.cod_principio_activo)  \
                     LEFT JOIN  inventarios_productos invp ON(hc.codigo_medicamento=invp.codigo_producto)   \
           WHERE hc.evolucion_id = :1  \
           GROUP BY med.cod_principio_activo,  \
                    A.codigo_medicamento,  \
                    hc.sw_autorizado,  \
                    hc.perioricidad_entrega,  \
                    hc.tiempo_total,  \
                    invp.cod_forma_farmacologica,\
                    hc.evolucion_id\
   )AS B";
                        
    
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
    
    console.log("*************DispensacionHcModel.prototype.listarMedicamentosPendientes**************");
    console.log("*************DispensacionHcModel.prototype.listarMedicamentosPendientes**************");
    console.log("*************DispensacionHcModel.prototype.listarMedicamentosPendientes**************");
    
   /* var parametros = {1: obj.evolucionId};
     
    
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
                  SELECT codigo_medicamento as codigo_producto,  \
                            SUM(cantidad_entrega) as cantidades  \
                            FROM hc_formulacion_antecedentes  \
                            where evolucion_id= :1 \
                            AND numero_total_entregas > (SELECT es.numero_entrega_actual FROM dispensacion_estados es WHERE es.evolucion_id = :1)\
                      group by codigo_medicamento  \
                  ) as b  \
                 where  \
                          a.codigo_producto = b.codigo_producto  \
                UNION  \
                    SELECT codigo_medicamento as codigo_producto,  \
                          cantidad_entrega as cantidades  \
                          FROM hc_formulacion_antecedentes\
                          where evolucion_id= :1 and sw_mostrar='1'  \
                          AND numero_total_entregas > (SELECT es.numero_entrega_actual FROM dispensacion_estados es WHERE es.evolucion_id = :1 )\
                     and codigo_medicamento NOT IN( select  \
                                                      codigo_formulado  \
                                                      FROM hc_dispensacion_medicamentos_tmp  \
                                                      where evolucion_id= :1 )";
    
    //G.knex.raw(sql,parametros).   */
   var colQuery = ["a.codigo_producto",
                 G.knex.raw('(b.cantidades - a.cantidades) as total') ];
             
   var colFormulados = ["codigo_medicamento as codigo_producto",
                       "cantidad_entrega as cantidades"];
   
   
   var colCantidadEntregas = ["codigo_medicamento as codigo_producto",
                                G.knex.raw("SUM(cantidad_entrega) as cantidades")];
                            
   var colCantidadDespachada = ["codigo_formulado as codigo_producto",
                                G.knex.raw("SUM(cantidad_despachada) as cantidades")];
   
    var queryNumeroEntregaActual = G.knex.column("numero_entrega_actual")
       .select()
       .from('dispensacion_estados')
       .where({evolucion_id:obj.evolucionId});
      
  var queryCantidadDespachada = G.knex.column(colCantidadDespachada)
        .select()
        .from('hc_dispensacion_medicamentos_tmp')
        .where({evolucion_id:obj.evolucionId})
        .groupBy('codigo_formulado').as("a");

   var queryCantidadEntregas = G.knex.column(colCantidadEntregas)
        .select()
        .from('hc_formulacion_antecedentes')
        .where({evolucion_id:obj.evolucionId})
        .andWhere('numero_total_entregas','>', queryNumeroEntregaActual)
        .groupBy('codigo_medicamento').as("b");
    
  var queryTmp = G.knex.select("codigo_formulado")
                        .from('hc_dispensacion_medicamentos_tmp')
                        .where('evolucion_id',obj.evolucionId)
                
     
 
  var query = G.knex.select(colQuery)
                .from(queryCantidadDespachada)
                .innerJoin(queryCantidadEntregas, 
                    function() {
                        this.on("a.codigo_producto", "b.codigo_producto")

                }).union(function(){
                    this.select(colFormulados)
                        .from('hc_formulacion_antecedentes')
                        .where('evolucion_id',obj.evolucionId)
                        .andWhere('sw_mostrar','1')
                        .andWhere('numero_total_entregas','>', queryNumeroEntregaActual)
                        .andWhereNot('codigo_medicamento','not in', queryTmp);
                });
               
            
      query.then(function(resultado){    
       console.log("resultado [listarMedicamentosPendientes]: ", resultado);
        callback(false, resultado)
    }).catch(function(err){        
      console.log("err [listarMedicamentosPendientes]: ", err);
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
        //console.log("err consultarMedicamentosDespachados: ", err);   
        callback(err);
    });  
};

/**
 * @author Cristian Ardila
 * @fecha 25/07/2016
 * +Descripcion Modelo encargado de consultar los medicamentos despachados
 * @controller DispensacionHc.prototype.existenciasBodegas
 * -- Pertenece a la funcion ConsultarUltimoResg_Dispens_
 */
DispensacionHcModel.prototype.consultarUltimoRegistroDispensacion = function(obj,callback){
     
    var sql = "";
    var sql2 = "";
    var limit = "";
    var sql3 = "WHERE A.fecha_registro >= '" +obj.fechaDia+ "'::date\
                        and A.fecha_registro <= ('" + obj.today + "'::date +'1 day' ::interval)::date";
    var parametros = {1: obj.tipoIdPaciente, 2: obj.pacienteId};
    
    if(obj.movimientoFormulaPaciente === 1){
        if(obj.principioActivo){
            sql = "and mm.cod_principio_activo='" + obj.principioActivo + "' ";
            sql2 = "and h.subclase_id='" + obj.principioActivo + "' ";
            sql3 = "";
        }else{
            sql ="and inve.codigo_producto='" + obj.producto + "' ";
            sql2 ="and b.codigo_producto ='" + obj.producto + "' ";
            sql3 = "";
        }
        limit = "LIMIT 1";
    }   
    
        console.log("PARAMETROS obj ", obj);          
        console.log("PARAMETROS sql3 ", sql3);          
        //max( ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30) ) as numero_total_entregas
        var sql = "SELECT  A.resultado, \
        to_char(A.fecha_registro,'YYYY-MM-DD')as fecha_registro, \
        round(A.unidades) as unidades,\
        A.nombre, \
        (SELECT bode.descripcion FROM bodegas as bode WHERE bode.empresa_id = A.empresa_id AND bode.centro_utilidad=A.centro_utilidad AND bode.bodega = A.bodega) AS razon_social, \
        A.bodega,\
        A.centro_utilidad,\
        A.formulacion, A.modulo, \
        CASE WHEN A.modulo = 0 THEN (SELECT distinct(numero_formula) FROM hc_formulacion_antecedentes WHERE evolucion_id = A.formula ) :: varchar\
                    ELSE (SELECT distinct(formula_papel) FROM esm_formula_externa WHERE formula_id = A.formula ) END  AS no_formula,\
        A.codigo_producto,\
        fc_descripcion_producto(A.codigo_producto) as descripcion,\n\
        A.usuario_id,\
        A.usuario\
                FROM ( \
                    SELECT \
                        d.fecha_registro,\
                        '1' as resultado, \
                        SUM(dd.cantidad) as unidades, \
                        SYS.nombre, \
                        EMPRE.razon_social,\
                        NUME.bodega,\
                        NUME.centro_utilidad,\
                        NUME.empresa_id,\
                        'F.historia clinica' as formulacion, '0' as modulo, \n\
                        dc.evolucion_id as formula,\
                        dd.codigo_producto,\
                        SYS.usuario_id,SYS.usuario \
                      FROM hc_formulacion_despachos_medicamentos as dc \
                        JOIN dispensacion_estados hc ON(dc.evolucion_id=hc.evolucion_id), \
                        bodegas_documentos as d, \
                        bodegas_documentos_d AS dd , \
                        inventarios_productos inve  left join medicamentos mm ON (inve.codigo_producto=mm.codigo_medicamento), \
                        system_usuarios  SYS, \
                        bodegas_doc_numeraciones  NUME, \
                        empresas EMPRE \
                    WHERE dc.bodegas_doc_id = d.bodegas_doc_id \
                        and dc.numeracion = d.numeracion \
                        and d.bodegas_doc_id = dd.bodegas_doc_id \
                        and d.numeracion = dd.numeracion \
                        and dd.codigo_producto=inve.codigo_producto \
                        and d.usuario_id=SYS.usuario_id \
                        and d.bodegas_doc_id=NUME.bodegas_doc_id \
                        and NUME.empresa_id=EMPRE.empresa_id " + sql + " and hc.tipo_id_paciente= :1 \
                        and hc.paciente_id= :2 \
                        and dc.sw_estado='1'\
                    GROUP BY d.fecha_registro,resultado,SYS.nombre,razon_social,\n\
                            NUME.bodega,NUME.centro_utilidad,NUME.empresa_id,dc.evolucion_id,dd.codigo_producto,SYS.usuario_id,SYS.usuario\
                	UNION \
                     SELECT \
                        d.fecha_registro,\
                        '0' as resultado, \
                        SUM(dd.cantidad) as unidades, \
                        SYS.nombre, \
                        EMPRE.razon_social,\
                        NUME.bodega,\
                        NUME.centro_utilidad,\
                        NUME.empresa_id,\
                        'F.historia clinica' as formulacion, '0' as modulo,dc.evolucion_id as formula,dd.codigo_producto,SYS.usuario_id,SYS.usuario \
                        FROM hc_formulacion_despachos_medicamentos_pendientes as dc \
                        JOIN dispensacion_estados hc ON(dc.evolucion_id=hc.evolucion_id) , \
                        bodegas_documentos as d, \
                        bodegas_documentos_d AS dd , \
                        inventarios_productos inve  left join medicamentos mm ON (inve.codigo_producto=mm.codigo_medicamento) , \
                        system_usuarios  SYS, \
                        bodegas_doc_numeraciones  NUME, \
                        empresas EMPRE \
                      WHERE dc.bodegas_doc_id = d.bodegas_doc_id \
                        and dc.numeracion = d.numeracion \
                        and d.bodegas_doc_id = dd.bodegas_doc_id \
                        and d.numeracion = dd.numeracion \
                        and dd.codigo_producto=inve.codigo_producto \
                        and d.usuario_id=SYS.usuario_id \
                        and d.bodegas_doc_id=NUME.bodegas_doc_id \
                        and NUME.empresa_id=EMPRE.empresa_id " + sql +  " and hc.tipo_id_paciente= :1\
                        and hc.paciente_id= :2\
                      GROUP BY d.fecha_registro,resultado,SYS.nombre,razon_social,NUME.bodega,NUME.centro_utilidad,\n\
                               NUME.empresa_id,dc.evolucion_id,dd.codigo_producto,SYS.usuario_id,SYS.usuario \
                UNION \
                      SELECT \
                        a.fecha_registro,\
                        '1' as resultado, \
                        SUM(b.cantidad) as unidades, \
                        g.nombre, \
                        f.descripcion||'-'||i.razon_social as razon_social,\
                        e.bodega,\
                        e.centro_utilidad, \
                        e.empresa_id,\
                        'F.externa' as formulacion,'1' as modulo, c.formula_id as formula,b.codigo_producto,g.usuario_id,g.usuario\
                      FROM \
                        bodegas_documentos as a \
                        JOIN bodegas_documentos_d as b ON (a.bodegas_doc_id = b.bodegas_doc_id) \
                        AND (a.numeracion = b.numeracion) \
                        JOIN esm_formulacion_despachos_medicamentos as c ON (a.bodegas_doc_id = c.bodegas_doc_id) \
                        AND (a.numeracion = c.numeracion) \
                        JOIN esm_formula_externa as d ON (c.formula_id = d.formula_id) \
                        JOIN bodegas_doc_numeraciones as e ON (a.bodegas_doc_id = e.bodegas_doc_id) \
                        JOIN centros_utilidad as f ON (e.empresa_id = f.empresa_id) \
                        AND (e.centro_utilidad = f.centro_utilidad) \
                        JOIN empresas as i ON (f.empresa_id = i.empresa_id) \
                        JOIN system_usuarios as g ON (a.usuario_id = g.usuario_id) \
                        JOIN inventarios_productos as h ON (b.codigo_producto = h.codigo_producto) \
                      WHERE TRUE   " + sql2 +  " and d.tipo_id_paciente= :1\
                        and d.paciente_id = :2\
                        and c.sw_estado='1' \
                        and d.sw_estado IN ('0','1') \
                        and a.fecha_registro >= '" +obj.fechaDia+ "'::date\
                        and a.fecha_registro <= ('" + obj.today + "'::date +'1 day' ::interval)::date\
                      GROUP BY a.fecha_registro,2,4,5,e.bodega,e.centro_utilidad,e.empresa_id,c.formula_id,b.codigo_producto,g.usuario_id,g.usuario  \
                UNION  \
                      SELECT \
                        a.fecha_registro,\
                        '0' as resultado, \
                        SUM(b.cantidad) as unidades, \
                        g.nombre, \
                        f.descripcion||'-'||i.razon_social as razon_social,\
                        e.bodega,\
                        e.centro_utilidad,\
                        e.empresa_id,\
                        'F.externa' as formulacion, '1' as modulo,c.formula_id as formula, b.codigo_producto,g.usuario_id,g.usuario\
                      FROM \
                        bodegas_documentos as a \
                        JOIN bodegas_documentos_d as b ON (a.bodegas_doc_id = b.bodegas_doc_id) \
                        AND (a.numeracion = b.numeracion) \
                        JOIN esm_formulacion_despachos_medicamentos_pendientes as c ON (a.bodegas_doc_id = c.bodegas_doc_id) \
                        AND (a.numeracion = c.numeracion) \
                        JOIN esm_formula_externa as d ON (c.formula_id = d.formula_id) \
                        JOIN bodegas_doc_numeraciones as e ON (a.bodegas_doc_id = e.bodegas_doc_id) \
                        JOIN centros_utilidad as f ON (e.empresa_id = f.empresa_id) \
                        AND (e.centro_utilidad = f.centro_utilidad) \
                        JOIN empresas as i ON (f.empresa_id = i.empresa_id) \
                        JOIN system_usuarios as g ON (a.usuario_id = g.usuario_id) \
                        JOIN inventarios_productos as h ON (b.codigo_producto = h.codigo_producto) \
                      WHERE TRUE " + sql2 + "  and d.tipo_id_paciente = :1\
                        and d.paciente_id= :2\
                        and d.sw_estado IN ('0','1') \
                        and a.fecha_registro >= '" +obj.fechaDia+ "'::date\
                        and a.fecha_registro <= ('" + obj.today + "'::date +'1 day' ::interval)::date\
                      GROUP BY a.fecha_registro,2,4,5,e.bodega,e.centro_utilidad,e.empresa_id,c.formula_id,b.codigo_producto,g.usuario_id,g.usuario \
                       ) AS A "+sql3+" ORDER BY  A.fecha_registro DESC "+ limit;
      
    G.knex.raw(sql,parametros).then(function(resultado){     
        //console.log("resultado CONFRONTADOS------///*****++++ : ", resultado.rows);
        callback(false, resultado);
    }).catch(function(err){      
        console.log("parametros: ", parametros);
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

   /* var parametros = {1: obj.empresa, 2: obj.centroUtilidad,
                      3: obj.bodega, 4: obj.usuario};
  
        var sql = "SELECT sw_privilegios\
                  FROM userpermisos_dispensacion\
                  WHERE empresa_id= :1 AND centro_utilidad = :2 AND bodega = :3\
                  AND usuario_id = :4 AND sw_activo = '1' ";
  
   var query = G.knex.raw(sql,parametros);*/
     
  var query = G.knex.column(['sw_privilegios'])
                .select()
                .from('userpermisos_dispensacion')
                .where('empresa_id',obj.empresa)
                .andWhere('centro_utilidad',obj.centroUtilidad)
                .andWhere('bodega',obj.bodega)
                .andWhere('usuario_id',obj.usuario)
                .andWhere('sw_activo','1');
            
     query.then(function(resultado){ 
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

    console.log("**********DispensacionHcModel.prototype.cantidadProductoTemporal****************");
    console.log("**********DispensacionHcModel.prototype.cantidadProductoTemporal****************");
    console.log("**********DispensacionHcModel.prototype.cantidadProductoTemporal****************");
    
   /* var parametros = {1: obj.codigoProducto, 2: obj.evolucionId, 3: obj.principioActivo};
        console.log("parametros ", parametros);
    var condicion = "";
        if (!obj.principioActivo || obj.principioActivo === null) {
            condicion=" and invp.codigo_producto = :1 ";
            
        }else{
            condicion =" and med.cod_principio_activo = :3 ";
        } 
        
        console.log("condicion ", condicion);
        var sql = "SELECT COALESCE(sum(tmp.cantidad_despachada),0) as total,tmp.codigo_formulado\
                  FROM hc_dispensacion_medicamentos_tmp tmp\
                       LEFT JOIN medicamentos med ON(tmp.codigo_formulado=med.codigo_medicamento)\
                       LEFT JOIN inventarios_productos invp ON(tmp.codigo_formulado=invp.codigo_producto)\
                  where tmp.codigo_formulado= :1\
                  and tmp.evolucion_id = :2 "+condicion+" GROUP BY codigo_formulado";
     var query =  G.knex.raw(sql,parametros);*/
    var condicion = "";
    var parametro = "";
        if (!obj.principioActivo || obj.principioActivo === null) {
            condicion="invp.codigo_producto";
            parametro = obj.codigoProducto;
        }else{
            condicion ="med.cod_principio_activo";
            parametro = obj.principioActivo;
        } 
    var columna = [G.knex.raw("COALESCE(sum(tmp.cantidad_despachada),0) as total"),
                    "tmp.codigo_formulado"];
    var query = G.knex.column(columna)
                .select()
                .from('hc_dispensacion_medicamentos_tmp as tmp')
                .leftJoin('medicamentos as med',function() {                             
                    this.on("tmp.codigo_formulado", "med.codigo_medicamento")
                        
                 })
                .leftJoin('inventarios_productos as invp',function() {                             
                    this.on("tmp.codigo_formulado", "invp.codigo_producto")                       
                 })
                .where("tmp.codigo_formulado", obj.codigoProducto)
                .andWhere("tmp.evolucion_id",obj.evolucionId)
                .andWhere(condicion,parametro)
                .groupBy("codigo_formulado");
         
   query.then(function(resultado){      
        console.log("resultado [cantidadProductoTemporal]: ", resultado);    
          callback(false, resultado);
    }).catch(function(err){     
         console.log("err [cantidadProductoTemporal]: ", err);    
          callback(err);
    });
    
};




/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de obtener los lotes relacionados con los productos    
 *              de los FOFO
 * @controller DispensacionHc.prototype.existenciasBodegas
 *             DispensacionHc.prototype.consultarLotesDispensarFormula
 */
DispensacionHcModel.prototype.existenciasBodegas = function(obj,callback){
    
    console.log("MODEL *******DispensacionHcModel.prototype.existenciasBodegas ORM******");
    console.log("MODEL *******DispensacionHcModel.prototype.existenciasBodegas ORM******");
    console.log("MODEL *******DispensacionHcModel.prototype.existenciasBodegas ORM******");
    
   /* var parametros = {1: obj.empresa, 
                    2: obj.centroUtilidad, 
                    3: obj.bodega, 
                    4: obj.principioActivo, 
                    5: obj.codigoProducto,
                    6: obj.codigoFormaFarmacologica};
     
    var condicion = "";
    if (!obj.principioActivo || obj.principioActivo === null) { 
        
        condicion=" and fv.codigo_producto = :5 ";
        
    }else{
        condicion =" and med.cod_principio_activo =  :4 ";
    } 
     
                          
    var sql =  "SELECT\
                invp.contenido_unidad_venta as concentracion,\
                invsinv.descripcion as molecula,\
                invmcf.descripcion as forma_farmacologica,\
                invci.descripcion as laboratorio,\
                fc_descripcion_producto_alterno(fv.codigo_producto) as producto,\
                med.cod_principio_activo,\
                fv.empresa_id,\
                fv.centro_utilidad, \
                fv.codigo_producto,fv.bodega,\
                fv.estado, \
                fv.existencia_actual, \
                fv.existencia_inicial, \
                to_char(fv.fecha_registro,'YYYY-MM-DD') AS fecha_registro, \
                to_char(fv.fecha_vencimiento,'YYYY-MM-DD') AS fecha_vencimiento,\
                fv.lote, \
                fv.ubicacion_id,\
                CASE WHEN extract(days from (fv.fecha_vencimiento - timestamp 'now()')) = 30 THEN 0\
                     WHEN extract(days from (fv.fecha_vencimiento - timestamp 'now()')) <= 1 THEN 1\
                    ELSE 2 END as estado_producto, \
                extract(days from (fv.fecha_vencimiento - timestamp 'now()')) as cantidad_dias\
                FROM existencias_bodegas_lote_fv AS fv\
                JOIN existencias_bodegas as ext\
                ON (fv.empresa_id = ext.empresa_id) \
                and (fv.centro_utilidad = ext.centro_utilidad) \
                and (fv.bodega = ext.bodega) and (fv.codigo_producto = ext.codigo_producto)\
                JOIN inventarios as inv ON (ext.empresa_id = inv.empresa_id) and (ext.codigo_producto = inv.codigo_producto)\
                JOIN inventarios_productos as invp ON (inv.codigo_producto = invp.codigo_producto)\
                LEFT JOIN medicamentos med ON (fv.codigo_producto=med.codigo_medicamento)\
                INNER JOIN inv_subclases_inventarios invsinv\
                ON ( invsinv.grupo_id = invp.grupo_id  ) \
                AND (invsinv.clase_id = invp.clase_id) \
                AND (invsinv.subclase_id = invp.subclase_id)\
                INNER JOIN inv_med_cod_forma_farmacologica invmcf \
                ON (invmcf.cod_forma_farmacologica = invp.cod_forma_farmacologica)\
                INNER JOIN inv_clases_inventarios invci \
                ON ( invci.grupo_id = invp.grupo_id  ) \
                AND (invci.clase_id = invp.clase_id) \
                WHERE fv.empresa_id = :1 \
                and fv.centro_utilidad = :2\
                and fv.bodega = :3 \
                and fv.existencia_actual > 0 "+condicion+" " 
                + "AND invp.cod_forma_farmacologica "+G.constants.db().LIKE+"'%" + obj.codigoFormaFarmacologica + "%'"
                +"ORDER BY invp.descripcion ASC,fv.fecha_vencimiento ASC";

     var query = G.knex.raw(sql,parametros);
     console.log("ESTE ES TODOOOOO ", obj);*/
    var condicion = "";
    var parametro = "";
    if (!obj.principioActivo || obj.principioActivo === null) { 
        
        condicion = "fv.codigo_producto";
        parametro = obj.codigoProducto;
        //condicion=" and fv.codigo_producto = :5 AND invp.cod_forma_farmacologica "+G.constants.db().LIKE+"'%" + obj.codigoFormaFarmacologica + "%'";
        
    }else{
        condicion = "med.cod_principio_activo";
        parametro = obj.principioActivo;
        //condicion =" and med.cod_principio_activo =  :4 AND invp.cod_forma_farmacologica "+G.constants.db().LIKE+"'%" + obj.codigoFormaFarmacologica + "%'";
    } 
    var columna = ["invp.contenido_unidad_venta as concentracion", 
                    "invsinv.descripcion as molecula",
                    "invmcf.descripcion as forma_farmacologica",
                    "invci.descripcion as laboratorio",
                    "invci.descripcion as laboratorio",
                    G.knex.raw("fc_descripcion_producto_alterno(fv.codigo_producto) as producto"),
                    "med.cod_principio_activo",
                    "fv.empresa_id",
                    "fv.centro_utilidad",
                    "fv.codigo_producto",
                    "fv.bodega",
                    "fv.estado",
                    "fv.existencia_actual",
                    "fv.existencia_inicial",
                    G.knex.raw("to_char(fv.fecha_registro,'YYYY-MM-DD') AS fecha_registro"),
                    G.knex.raw("to_char(fv.fecha_vencimiento,'YYYY-MM-DD') AS fecha_vencimiento"),
                    "fv.lote",
                    "fv.ubicacion_id",
                    G.knex.raw("CASE WHEN extract(days from (fv.fecha_vencimiento - timestamp 'now()')) = 30 THEN 0\
                     WHEN extract(days from (fv.fecha_vencimiento - timestamp 'now()')) <= 1 THEN 1\
                    ELSE 2 END as estado_producto"),
                    G.knex.raw("extract(days from (fv.fecha_vencimiento - timestamp 'now()')) as cantidad_dias")]; 
    var query = G.knex.column(columna)
                .select()
                .from('existencias_bodegas_lote_fv as fv')
                .join('existencias_bodegas as ext',function() {                             
                    this.on("fv.empresa_id","=", "ext.empresa_id")
                        .on("fv.centro_utilidad","=", "ext.centro_utilidad")
                        .on("fv.bodega","=", "ext.bodega")
                        .on("fv.codigo_producto", "=","ext.codigo_producto")
                 })
                 .join('inventarios as inv', function(){
                    this.on("ext.empresa_id","=", "inv.empresa_id")
                        .on("ext.codigo_producto","=", "inv.codigo_producto")
                 })
                 .join('inventarios_productos as invp', function(){
                    this.on("invp.codigo_producto","=", "inv.codigo_producto") 
                 })
                 .leftJoin('medicamentos as med', function(){
                    this.on("fv.codigo_producto", "med.codigo_medicamento") 
                 })
                 .innerJoin('inv_subclases_inventarios as invsinv', function(){
                    this.on("invsinv.grupo_id", "invp.grupo_id")
                        .on("invsinv.clase_id", "invp.clase_id")
                        .on("invsinv.subclase_id", "invp.subclase_id")
                 })
                 .innerJoin('inv_med_cod_forma_farmacologica as invmcf', function(){
                    this.on("invmcf.cod_forma_farmacologica", "invp.cod_forma_farmacologica")
                 })
                 .innerJoin('inv_clases_inventarios as invci', function(){
                    this.on("invci.grupo_id", "invp.grupo_id")
                        .on("invci.clase_id", "invp.clase_id")
                 })
                 //.
                 .where("fv.empresa_id", obj.empresa)
                 .andWhere("fv.centro_utilidad", obj.centroUtilidad)
                 .andWhere("fv.bodega", obj.bodega)
                 .andWhere("fv.existencia_actual",">", 0)
                 .andWhere(condicion,parametro)
                 //.andWhere("invp.cod_forma_farmacologica",G.constants.db().LIKE,"'%" + obj.codigoFormaFarmacologica + "%'")
                 .andWhere(G.knex.raw("invp.cod_forma_farmacologica "+G.constants.db().LIKE+"'%" + obj.codigoFormaFarmacologica + "%'"))
                 .orderBy("fv.fecha_vencimiento","ASC");
                  
    query.then(function(resultado){  
      console.log(" resultado [existenciasBodegas]: ---->>>>>>>  ", resultado);
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
   
   console.log("***********DispensacionHcModel.prototype.consultarProductoTemporal*************");
   console.log("***********DispensacionHcModel.prototype.consultarProductoTemporal*************");
   console.log("***********DispensacionHcModel.prototype.consultarProductoTemporal*************");
   console.log("estado ", estado);
    var parametros = [];
    var condicion = "";
    var descripcionProducto = "";
    /*if(estado === 0){
        parametros = {1: obj.evolucionId, 2: obj.codigoProducto, 3: obj.fechaVencimiento, 4: obj.lote};
        condicion = "AND codigo_producto = :2 AND fecha_vencimiento = :3 AND lote = :4";
    }else{
        parametros = {1: obj.evolucionId};
        descripcionProducto =",fc_descripcion_producto_alterno(codigo_producto) as descripcion_prod";
    }*/
    var columnas = [];
                    
    if(estado === 0){
        parametros = {evolucion_id: obj.evolucionId, 
                      codigo_producto: obj.codigoProducto, 
                      fecha_vencimiento: obj.fechaVencimiento, 
                      lote: obj.lote};
       var columnas = ["hc_dispen_tmp_id",
                    "evolucion_id",
                    "empresa_id",
                    "centro_utilidad",
                    "bodega", 
                    "codigo_producto",
                    "cantidad_despachada",
                    "fecha_vencimiento",
                    "lote",
                    "codigo_formulado",
                    "usuario_id",
                    "sw_entregado_off"
                    ];
        
    }else{
        parametros = {evolucion_id: obj.evolucionId};
        descripcionProducto = G.knex.raw("fc_descripcion_producto_alterno(codigo_producto) as descripcion_prod");
        var columnas = ["hc_dispen_tmp_id",
                    "evolucion_id",
                    "empresa_id",
                    "centro_utilidad",
                    "bodega", 
                    "codigo_producto",
                    "cantidad_despachada",
                    "fecha_vencimiento",
                    "lote",
                    "codigo_formulado",
                    "usuario_id",
                    "sw_entregado_off",descripcionProducto
                    ];
    }
    
    console.log("columnas ", columnas);
    
     var query = G.knex.select(columnas).where(parametros).from("hc_dispensacion_medicamentos_tmp");
        query.then(function(resultado){ 
        //console.log("resultado [consultarProductoTemporal]:", resultado);     
        callback(false, resultado)
    }).catch(function(err){    
        console.log("err [consultarProductoTemporal]:", err);
        callback(err);
    });
    
    
  /*  var sql = "SELECT  *"+descripcionProducto+" FROM hc_dispensacion_medicamentos_tmp \
              WHERE evolucion_id = :1 " + condicion +"";
               
  
    G.knex.raw(sql,parametros).then(function(resultado){     
        console.log("resultado [consultarProductoTemporal]:", resultado);   
        callback(false, resultado)
    }).catch(function(err){   
    console.log("err [consultarProductoTemporal]:", err);       
        callback(err);
    });  */
    
    
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
 * +Descripcion : Transaccion para eliminar el temporal de la formula
 *                y si el medicamento fue confrontado denegar de nuevo la autorizacion
 * @fecha: 09/11/2016
 */
DispensacionHcModel.prototype.eliminarTemporalFormula = function(producto, callback)
{  
       console.log("DispensacionHcModel.prototype.eliminarTemporalFormula ", DispensacionHcModel.prototype.eliminarTemporalFormula);
    G.knex.transaction(function(transaccion) {         
        G.Q.nfcall(__eliminarTemporalFormula, producto, transaccion).then(function(resultado){
           
            if(resultado.rowCount >0){
              
                 var parametros={evolucionId:producto.evolucionId, 
                    usuario:null, 
                    observacion: null,
                    producto:resultado.rows[0].codigo_formulado,
                    autorizado :'0'};
                
                return G.Q.nfcall(__autorizarDispensacionMedicamento, parametros, transaccion) 
            }
                                
        }).then(function(resultado){       
            
           transaccion.commit();       
        }).fail(function(err){
        console.log("err ", err);    
           transaccion.rollback(err);
        }).done();            
    }).then(function(){    
            callback(false);
    }).catch(function(err){ 
         console.log("err ", err);   
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

   /* var sql = "SELECT\
            a.tipo_formula_id as id,\
            a.descripcion_tipo_formula as descripcion\
            FROM esm_tipos_formulas as a\
            ORDER BY a.descripcion_tipo_formula ASC";
   
    G.knex.raw(sql).*/
   var columna = ["a.tipo_formula_id as id", "a.descripcion_tipo_formula as descripcion"];
     
    var query = G.knex.column(columna)
     .select()
     .from('esm_tipos_formulas as a').orderBy("a.descripcion_tipo_formula", "ASC");
              
   query.then(function(resultado){    
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
     
     console.log("***********DispensacionHcModel.prototype.obtenerCabeceraFormulaPendientesPorDispensar****************");
     console.log("***********DispensacionHcModel.prototype.obtenerCabeceraFormulaPendientesPorDispensar****************");
     console.log("***********DispensacionHcModel.prototype.obtenerCabeceraFormulaPendientesPorDispensar****************");
     
    var parametros = {};
        parametros["1"] = obj.evolucionId;
    var where = "";
        /**
         * +Descripcion 
         *              tablaUsuarioDespacho = variable que guarda la tabla de donde se extraera
         *              el bodegas_doc_id y la numeracion dependiente del estadoEntrega
         *              (0: despacho, 
         *               1: pendientes,
         *               2: entrega pendiente)
         *               
         *               tablaBodegasDocumentos = variable que guarda la tabla bodegas_documentos
         *               de donde se extraera el usuario que realizo el proceso
         *               (0: despacho, 
         *               1: se dejara en null ya que no se ha generado despacho alguno,
         *               2: entrega pendiente)
         */
   /* var tablaUsuarioDespacho;
    var tablaBodegasDocumentos;
    var campo;
        if(obj.estadoEntrega === 0){
            tablaUsuarioDespacho = "  hc_formulacion_despachos_medicamentos j "
            tablaBodegasDocumentos = "INNER JOIN bodegas_documentos k ON j.bodegas_doc_id = k.bodegas_doc_id AND k.numeracion = j.numeracion ";
            campo = "k.usuario_id";
        }
        if(obj.estadoEntrega === 1){
            tablaUsuarioDespacho = " hc_pendientes_por_dispensar j "
            tablaBodegasDocumentos = "";
            campo = "j.usuario_id";
        }
        if(obj.estadoEntrega === 2){
            tablaUsuarioDespacho = " hc_formulacion_despachos_medicamentos_pendientes j "
            tablaBodegasDocumentos = "INNER JOIN bodegas_documentos k ON j.bodegas_doc_id = k.bodegas_doc_id AND k.numeracion = j.numeracion ";
            campo = "k.usuario_id";
        }*/
    
    if(obj.pacienteId){
       
        parametros["2"]= obj.tipoIdPaciente;
        parametros["3"]= obj.pacienteId;
        where=" and a.tipo_id_paciente= :2 and a.paciente_id= :3 ";
    }
    
    /*console.log("tablaUsuarioDespacho ", tablaUsuarioDespacho);
    console.log("tablaBodegasDocumentos ", tablaBodegasDocumentos);
    console.log("obj ", obj);  */                     
                            
    
    var sql = "SELECT ca.evolucion_id,\
                      ca.numero_formula, \
                      ca.tipo_id_paciente, \
                      ca.paciente_id, \
                      ca.fecha_registro,\
                      ca.fecha_finalizacion,\
                      ca.fecha_formulacion,\
                      ca.apellidos,\
                      ca.nombres,\
                      ca.edad,\
                      ca.sexo,\
                        ca.residencia_direccion,\
                        ca.residencia_telefono,\
                        ca.plan_id,\
                        ca.plan_descripcion,\
                        ca.tipo_bloqueo_id,\
                        ca.bloqueo,\
                        ca.tipo_formula,\
                        ca.descripcion_tipo_formula,\
                        CASE WHEN ca.nombre is null\
                        THEN (SELECT sys.nombre \
                              FROM system_usuarios sys \
                              WHERE sys.usuario_id =(SELECT distinct(usuario_id) FROM hc_pendientes_por_dispensar WHERE evolucion_id = :1 limit 1))\
                                ELSE ca.nombre END  AS nombre\
            FROM(\
            select distinct  ON (a.evolucion_id)\
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
            g.tipo_bloqueo_id,\
            g.descripcion AS bloqueo,\
            h.tipo_formula,\
            i.descripcion_tipo_formula,\
            (SELECT nombre \
            FROM system_usuarios\
            WHERE usuario_id = (\
            SELECT todo.usuario_id \
            FROM (\
            SELECT distinct(bod.usuario_id) as usuario_id, bod.fecha_registro\
            FROM bodegas_documentos bod INNER JOIN ( \
            SELECT union_entrega.evolucion_id,\
                   union_entrega.bodegas_doc_id as bodegas_doc_id,\
                   union_entrega.numeracion as numeracion\
            FROM (\
            SELECT a.evolucion_id,\
                   b.bodegas_doc_id as bodegas_doc_id,\
                   b.numeracion as numeracion\
            FROM dispensacion_estados a\
            INNER JOIN hc_formulacion_despachos_medicamentos b ON a.evolucion_id = b.evolucion_id\
            UNION \
            SELECT a.evolucion_id,\
                   c.bodegas_doc_id as bodegas_doc_id,\
                   c.numeracion as numeracion\
            FROM dispensacion_estados a    \
            LEFT JOIN hc_formulacion_despachos_medicamentos_pendientes c ON a.evolucion_id = c.evolucion_id\
            ) as union_entrega\
            WHERE union_entrega.evolucion_id = :1\
            )as entrega ON entrega.bodegas_doc_id = bod.bodegas_doc_id \
                        AND entrega.numeracion = bod.numeracion\
            UNION ALL\
            SELECT distinct(p.usuario_id)as usuario_id,\
                   p.fecha_pendiente\
            FROM hc_pendientes_por_dispensar p \
            WHERE p.evolucion_id = :1 and p.bodegas_doc_id is null and p.numeracion is null  \
            ) as todo WHERE todo.fecha_registro ilike '%'||(SELECT fecha_ultima_entrega FROM dispensacion_estados WHERE evolucion_id = :1 )||'%'\
            limit 1\
            ))as nombre\
            from hc_formulacion_antecedentes a\
            inner join hc_evoluciones h on a.evolucion_id = h.evolucion_id\
            inner join pacientes b on a.tipo_id_paciente = b.tipo_id_paciente and a.paciente_id = b.paciente_id\
            left join  eps_afiliados c on b.tipo_id_paciente = c.afiliado_tipo_id AND b.paciente_id = c.afiliado_id\
            inner join planes_rangos d on c.plan_atencion = d.plan_id and c.tipo_afiliado_atencion = d.tipo_afiliado_id and c.rango_afiliado_atencion = d.rango\
            inner join planes e on d.plan_id = e.plan_id\
            inner join inv_tipos_bloqueos g on b.tipo_bloqueo_id = g.tipo_bloqueo_id\
            left join esm_tipos_formulas i on h.tipo_formula = i.tipo_formula_id\
            where\
                a.evolucion_id= :1\
                " + where + "\
                and a.sw_formulado='1' \
                and g.estado='1' ) as ca";
   
             
    G.knex.raw(sql,parametros).then(function(resultado){
       
        callback(false, resultado);
    }).catch(function(err){        
        console.log("err [obtenerCabeceraFormulaPendientesPorDispensar]: ", err);
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
    
    console.log("***DispensacionHcModel.prototype.profesionalFormula ***********");
    console.log("***DispensacionHcModel.prototype.profesionalFormula ***********");
    console.log("***DispensacionHcModel.prototype.profesionalFormula ***********");
    
  /* var parametros = {1: obj.evolucionId};
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
   
    var query = G.knex.raw(sql,parametros);*/
      
    var columnas = ["hc.medico_id",
                    "pro.nombre",
                    "pro.tipo_id_tercero",
                    "pro.tercero_id",
                    "tipos.descripcion"];
                 
     var query  = G.knex.select(columnas)
                        .from('hc_formulacion_antecedentes as hc')
                        .leftJoin('profesionales_usuarios AS usu', function() {                            
                                this.on("hc.medico_id", "usu.usuario_id")
                        }).leftJoin('profesionales AS pro', function() {
                                this.on("usu.tipo_tercero_id", "pro.tipo_id_tercero")
                                    .on("usu.tercero_id", "pro.tercero_id")
                        }).leftJoin('tipos_profesionales AS tipos', function() {
                                this.on("pro.tipo_profesional", "tipos.tipo_profesional") 
                        })
                        .where('hc.evolucion_id',obj.evolucionId);  
            
     query.then(function(resultado){ 
       console.log("resultado [profesionalFormula]:", resultado);
        callback(false, resultado);
    }).catch(function(err){
       console.log("err [profesionalFormula]:", err);
        callback(err);                
    });   
};

/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado consultar las formulas 
 *              las cuales se han dejado con estado todo_pendiente
 * @controller DispensacionHc.prototype.consultarProductosTodoPendiente
 *             DispensacionHc.prototype.descartarProductoPendiente
 */
DispensacionHcModel.prototype.consultarProductosTodoPendiente = function(obj,callback){
     
     console.log("*************DispensacionHcModel.prototype.consultarProductosTodoPendiente*****************");
     console.log("*************DispensacionHcModel.prototype.consultarProductosTodoPendiente*****************");
     console.log("*************DispensacionHcModel.prototype.consultarProductosTodoPendiente*****************");
     
    var parametros = {1: obj.evolucionId, 2: obj.estado};
    var campo = "";
    //console.log("parametros ", parametros);
   
   if(obj.estado === 0){
        campo = "sw_estado";
    }else{
        campo = "todo_pendiente";    
    }
    
    
   
   /* var sql = "SELECT   evolucion_id\
               FROM    hc_pendientes_por_dispensar\
               WHERE   "+campo+" = :2\
	       AND bodegas_doc_id is null\
	       AND numeracion is null\
	       AND evolucion_id = :1 ";
               //console.log("sql ", sql);
    var query = G.knex.raw(sql,parametros);*/
    
   /**
     * +Descripcion El estado 0 (Cero) se envia desde el controlador descartarProductoPendiente
     *              El estado 1 (Uno)  Se envia desde el controlador consultarProductosTodoPendiente
     */
    console.log("campo ", campo);
    var query = G.knex.column("evolucion_id")
                 .select()
                 .from('hc_pendientes_por_dispensar')
                 .whereNull('bodegas_doc_id')
                 .andWhere('numeracion','is', null)
                 .andWhere("evolucion_id",obj.evolucionId)
                 .andWhere(campo,obj.estado);
    
    query.then(function(resultado){ 
      console.log(" ========== RESULTADO [consultarProductosTodoPendiente]:", resultado)
        callback(false, resultado)
    }).catch(function(err){   
        console.log("err [consultarProductosTodoPendiente]: ", err);
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
    /*var sql = "UPDATE hc_evoluciones set tipo_formula = :2 WHERE evolucion_id = :1 ;";
   
    G.knex.raw(sql, {1: obj.evolucionId, 2: obj.tipoFormula}).*/
   //console.log("parametros ", parametros);
    var query = G.knex('hc_evoluciones')
            .where('evolucion_id', obj.evolucionId)
            .update({tipo_formula:obj.tipoFormula});
    
    query.then(function(resultado){ 
        console.log("resultado --->>>", resultado);
       callback(false, resultado);
    }).catch(function(err){    
        console.log("err (/catch) [actualizarTipoFormula]: ", err);
       callback(err);
    });
};




















/**
 * +Descripcion Metodo transaccion que invoca al metodo (__autorizarDispensacionMedicamento)
 */
DispensacionHcModel.prototype.autorizarDispensacionMedicamento = function(obj, callback)
{ 
     console.log("***********autorizarDispensacionMedicamento***************");
      console.log("***********autorizarDispensacionMedicamento***************");
       console.log("***********autorizarDispensacionMedicamento***************");
    var evolucionId;
    G.knex.transaction(function(transaccion) {         
        G.Q.nfcall(__autorizarDispensacionMedicamento, obj, transaccion).then(function(resultado){     
            evolucionId = resultado.rows[0];
            //console.log("resultado ", resultado);
           transaccion.commit();       
        }).fail(function(err){    
           transaccion.rollback(err);                                  
        }).done();
    }).then(function(){    
            callback(false,evolucionId);
    }).catch(function(err){       
            callback(err);       
    }).done(); 
    
};
/**
 * +Descripcion Metodo local encargado de actualizar el estado de autorizacion
 *              de un mendicamento a traves de una trasaccion
 */
function __autorizarDispensacionMedicamento(obj,transaccion, callback) {

    console.log("****_autorizarDispensacionMedicamento***");
    console.log("****_autorizarDispensacionMedicamento***");
    console.log("****_autorizarDispensacionMedicamento***");
    
     var sql = "update hc_formulacion_antecedentes\
              set sw_autorizado = :6,\
                  usuario_autoriza_id = :2,\
                  observacion_autorizacion= :3,\
                  fecha_registro_autorizacion= :5\
            WHERE     evolucion_id = :1\
            AND     codigo_medicamento = :4 returning evolucion_id";
    var parametros = {1: obj.evolucionId, 2: obj.usuario, 3: obj.observacion, 4: obj.producto, 5: 'now()', 6:obj.autorizado};
    
    var query = G.knex.raw(sql,parametros);
   
   if(transaccion) query.transacting(transaccion);                         
      query.then(function(resultado){    
       //console.log("resultado [autorizarDispensacionMedicamento]: ", resultado);   
        callback(false, resultado);
   }).catch(function(err){
        console.log("err (/catch) [autorizarDispensacionMedicamento]: ", err);
        console.log("parametros: ", parametros);
        callback({err:err, msj: "Error al autorizar la dispensacion del medicamento"});   
}); 
};




/**
 * 
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
DispensacionHcModel.prototype.asignacionNumeroDocumentoDespacho = function(obj, callback) {
    
    console.log("**************DispensacionHcModel.prototype.asignacionNumeroDocumentoDespacho**************");
    console.log("**************DispensacionHcModel.prototype.asignacionNumeroDocumentoDespacho**************");
    console.log("**************DispensacionHcModel.prototype.asignacionNumeroDocumentoDespacho**************");
    
   /*  var sql = "UPDATE bodegas_doc_numeraciones set numeracion=numeracion + 1 \
                WHERE  bodegas_doc_id= :1 RETURNING numeracion;";
   
    var query = G.knex.raw(sql, {1: obj.bodegasDocId});*/
            
    var query = G.knex('bodegas_doc_numeraciones')
                 .where('bodegas_doc_id', obj.bodegasDocId)
                 .returning("numeracion")
                 .increment('numeracion', 1);
              
    query.then(function(resultado){  
        console.log("resultado [asignacionNumeroDocumentoDespacho]: ", obj);
       callback(false, resultado);
    }).catch(function(err){  
        console.log("err (/catch) [asignacionNumeroDocumentoDespacho]: ", err);
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
        console.log("err (/catch) [bloquearTabla]: ", err);
       callback(err);
    });

};


/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado consultar el numero de la ultima entrega de la
 *              formula
 * @controller DispensacionHc.prototype.consultarNumeroTotalEntregas
 */
DispensacionHcModel.prototype.consultarUltimaEntregaFormula = function(obj,callback){
    
    console.log("********DispensacionHcModel.prototype.consultarUltimaEntregaFormula*********");
    console.log("********DispensacionHcModel.prototype.consultarUltimaEntregaFormula*********");
    console.log("********DispensacionHcModel.prototype.consultarUltimaEntregaFormula*********");
    console.log("********DispensacionHcModel.prototype.consultarUltimaEntregaFormula*********");
    
 /*   var parametros = {1: obj.evolucion};   
    var campo = "";
   if(obj.numeroEntregaActual === 0){
        campo = "(numero_total_entregas - numero_entrega_actual)";
    }else{
        campo = "numero_entrega_actual";
    }         
     var sql = "SELECT "+campo+" as numeroEntrega, sw_pendiente\
               FROM dispensacion_estados a \
               WHERE \
	        evolucion_id =  :1  ;";          
    var query = G.knex.raw(sql,parametros);  */
     
     
    var colFormulados = [];
    if(obj.numeroEntregaActual === 0){
        colFormulados = [G.knex.raw("(numero_total_entregas - numero_entrega_actual) as numeroEntrega"),"sw_pendiente"];
    }else{
        colFormulados = ["numero_entrega_actual as numeroEntrega","sw_pendiente"];
    } 
   
    var query = G.knex.column(colFormulados)
          .select()
          .from('dispensacion_estados')
          .where({evolucion_id:obj.evolucion});

     query.then(function(resultado){ 
         console.log("resultado [consultarUltimaEntregaFormula]: ", resultado);
          callback(false, resultado); 
     }).catch(function(err){
          console.log("err (/catch) [consultarUltimaEntregaFormula]: ", err);
          callback({err:err, msj: "Error al consultar el numero de entrega"});   
     });
    
};


/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado consultar el estado de la formula
 *              1: Entregado
 *              0: en proceso
 * @controller DispensacionHc.prototype.consultarNumeroTotalEntregas
 */
DispensacionHcModel.prototype.consultarNumeroTotalEntregas = function(obj,transaccion,callback){
    
    console.log("*****DispensacionHcModel.prototype.consultarNumeroTotalEntregas*********");
    console.log("*****DispensacionHcModel.prototype.consultarNumeroTotalEntregas*********");
    console.log("*****DispensacionHcModel.prototype.consultarNumeroTotalEntregas*********");
    
    var columna = [G.knex.raw("CASE WHEN numero_entrega_actual = numero_total_entregas THEN '1' ELSE '0' END  AS estado_entrega")];
     
    var query = G.knex.column(columna)
     .select()
     .from('dispensacion_estados')
     .where({evolucion_id:obj.evolucion});
    /*var parametros = {1: obj.evolucion};
    
    var sql = "SELECT\
                CASE WHEN a.numero_entrega_actual = numero_total_entregas THEN '1'\
                    ELSE '0' END  AS estado_entrega\
               FROM dispensacion_estados a\
               WHERE \
	        evolucion_id = :1;";          
   var query = G.knex.raw(sql,parametros);*/
   
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){    
       console.log("resultado [consultarNumeroTotalEntregas]: ", resultado);   
        callback(false, resultado);
   }).catch(function(err){
        console.log("err (/catch) [consultarNumeroTotalEntregas]: ", err);
       
        callback({err:err, msj: "Error al consultar el numero total de entregas"});   
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
   //console.log("obj ", obj);
    var that = this;
    var def = G.Q.defer();
    G.knex.transaction(function(transaccion) {  
        
        G.Q.nfcall(__insertarBodegasDocumentos, obj.parametro1, transaccion
            
         ).then(function(resultado){
             
                var formato = 'YYYY-MM-DD hh:mm:ss a';
                var fechaToday = G.moment(resultado[0]).format(formato);
                obj.parametro1.fecha_ultima_entrega = fechaToday;
                console.log("RETURNING RESULTADO [__insertarBodegasDocumentos]", obj.parametro1);
            return  G.Q.nfcall(__guardarBodegasDocumentosDetalle,that,0, obj.parametro2,transaccion); 
                                  
        }).then(function(){
            
            return G.Q.ninvoke(that,'actualizarProductoPorBodega',obj.parametro1, transaccion);
            
        }).then(function(){
            
            return G.Q.ninvoke(that,'insertarDespachoMedicamentosPendientes',obj.parametro1, transaccion);
            
        }).then(function(){
                return G.Q.ninvoke(that,'consultarProductoTemporal',{evolucionId:obj.parametro1.evolucion},1)          
        }).then(function(resultado){
            //console.log("resultado Producto temporal ", resultado.rows.length);
                if(resultado.length >0){                                   
                    return G.Q.ninvoke(that,'listarMedicamentosPendientesSinDispensar',{evolucionId:obj.parametro1.evolucion});                                   
                }                    
        }).then(function(resultado){     
            
            //console.log("resultado Pendientes sin dispensar ---->>>> ", resultado.rows.length);
                
            if(resultado.length >0){                   

                return G.Q.nfcall(__insertarMedicamentosPendientesPorDispensar,that,0, resultado,obj.parametro1,transaccion);
            }else{
                def.resolve();
            }         
            
        }).then(function(resultado){   
            //console.log("!resultado ? 0 : 1 ", resultado);
                obj.parametro1.conPendientes = !resultado ? 0 : resultado;
                return G.Q.ninvoke(that,'eliminarTemporalesDispensados',{evolucionId:obj.parametro1.evolucion}, transaccion); 
         
        }).then(function(){
            
                /**
                 * +Descripcion Se valida si los pendientes han sido generados 
                 *              como todo pendiente (todoPendiente: 1) se 
                 *              almacena el registro como una dispensacion de la
                 *              formula
                 *              de lo contrario el registro se almacena como un
                 *              pendiente mas
                 */
                if(obj.parametro1.todoPendiente === 0){
                    obj.parametro1.actualizarCampoPendiente = 1;
                }else{
                    obj.parametro1.actualizarCampoPendiente = 0;
                }
                
                //console.log("AQUI SE GUARDA ESTO DE A QUI ", obj.parametro1);
                
            return G.Q.ninvoke(that,'actualizarDispensacionEstados', obj.parametro1 , transaccion); 
                 
                          
                 
        }).then(function(){
                 
            return G.Q.ninvoke(that,'consultarNumeroTotalEntregas', obj.parametro1 , transaccion);
                
        }).then(function(resultado){  
            console.log(" ============= MIRAR SI A QUI PASO SATISFACTORIAMENTE ", resultado);
            if(resultado[0].estado_entrega === '1'){                
                return G.Q.ninvoke(that,'actualizarEstadoFinalizoFormula', obj.parametro1 , transaccion);
            }else{                             
                def.resolve();    
            }  
                    
        }).then(function(){  
            console.log("COMMIT ----->>> ELIMINANDO TODO PENDIENTE **********")
            transaccion.commit();            
        }).fail(function(err){
            console.log("err (/fail) [generarDispensacionFormulaPendientes]: ", err);
                transaccion.rollback(err);
        }).done();

    }).then(function(){
       callback(false);
    }).catch(function(err){      
       callback(err.msj);
    }).done(); 
    
};

var totalInsertadosPendientes = 0;
var sumaTotalDispensados = 0;  
/**
 * @author Cristian Manuel Ardila Troches  
 * +Descripcion funcion local recursiva encargada de recorrer el arreglo
 *              de los productos temporales que se insertaran en la tabla
 *              pendientes por dispensar y actualizara el disponible en bodega
 *  @fecha 08/08/2016
 **/
function __insertarMedicamentosPendientesPorDispensar(that, index, productos, parametros,transaccion, callback) {
        
    var producto = productos[index];
    
    if (!producto) {   
        sumaTotalDispensados = 0;
        callback(false,totalInsertadosPendientes);
        return; 
    }  
     
    G.Q.ninvoke(that,'actualizarProductoPendientePorBodega',parametros.evolucion,producto, transaccion).then(function(resultado){

        if(parseInt(producto.total) > 0){

            G.Q.ninvoke(that,'insertarPendientesPorDispensar',producto, parametros.evolucion, 0, parametros.usuario, transaccion).then(function(resultado){  
                                         
                totalInsertadosPendientes = 1;

            });
        }

        sumaTotalDispensados += parseInt(producto.total);

        if( sumaTotalDispensados === 0){    

            G.Q.ninvoke(that,'consultarPendientesFormula',parametros.evolucion).then(function(resultado){  

                if(resultado.rows.length > 0){
                    totalInsertadosPendientes = 1;
                }
                    totalInsertadosPendientes = 0;
            });
        }   

     }).fail(function(err){
         console.log("err (/fail) [__insertarMedicamentosPendientesPorDispensar]: ", err);
   }).done();                 
      
    index++;
    setTimeout(function() {
        __insertarMedicamentosPendientesPorDispensar(that, index, productos,parametros,transaccion, callback);
    }, 300);
   
       
};
             
/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de validar si una formula tiene medicamentos
 *               pendientes
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model :
 */
DispensacionHcModel.prototype.consultarPendientesFormula = function(evolucion, callback) {
     
   
    G.knex('hc_pendientes_por_dispensar').where({
        evolucion_id: evolucion,
        sw_estado: '0'
        
    }).select('evolucion_id').then(function(resultado) {

        callback(false, resultado);
    }). catch (function(error) {
        console.log("err (/catch) [consultarPendientesFormula]: ", error)
        console.log("parametros [evolucion]: ", evolucion);
        callback(error);
    });
};             
             
/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de actualizar el estado de los pendientes como entregados
 * @controller DispensacionHc.prototype.existenciasBodegas
 */
DispensacionHcModel.prototype.actualizarProductoPendientePorBodega = function(evolucion,producto,transaccion, callback){
    
    console.log("********DispensacionHcModel.prototype.actualizarProductoPendientePorBodega **************");
    console.log("********DispensacionHcModel.prototype.actualizarProductoPendientePorBodega **************");
    console.log("********DispensacionHcModel.prototype.actualizarProductoPendientePorBodega **************");
    
  /* var parametros = {1: evolucion, 2: producto.codigo_producto};   
   var sql = "UPDATE hc_pendientes_por_dispensar\
		SET sw_estado='1'\
		WHERE evolucion_id = :1 AND codigo_medicamento = :2 ;";          
   var query = G.knex.raw(sql,parametros);*/
   
    var query = G.knex('hc_pendientes_por_dispensar')
       .where({evolucion_id: evolucion}) 
       .andWhere({codigo_medicamento:producto.codigo_producto})             
       .update({sw_estado:'1'});
       
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){     
        console.log("resultado [actualizarProductoPendientePorBodega]: ", resultado);   
        callback(false, resultado);
   }).catch(function(err){       
        console.log("err (/catch) [actualizarProductoPendientePorBodega]: ", err);
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
    
    console.log("************DispensacionHcModel.prototype.listarMedicamentosPendientesSinDispensar ORM************************");
    console.log("************DispensacionHcModel.prototype.listarMedicamentosPendientesSinDispensar ORM************************");
    console.log("************DispensacionHcModel.prototype.listarMedicamentosPendientesSinDispensar ORM************************");
    
  /*  var parametros = {1: obj.evolucionId};   
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
          FROM hc_dispensacion_medicamentos_tmp where evolucion_id= :1)";
    
   var query = G.knex.raw(sql,parametros)*/
   var colQuery = ["a.codigo_producto",
                 G.knex.raw('(b.cantidades - a.cantidades) as total')];
   
   var colCantidadDespachada = ["codigo_formulado as codigo_producto",
                              G.knex.raw("SUM(cantidad_despachada) as cantidades")];
                            
   var colCantidadEntregas = ["codigo_medicamento as codigo_producto",
                                G.knex.raw("SUM(cantidad) as cantidades")];
                                         
  var colFormulados = ["codigo_medicamento as codigo_producto",
                       "cantidad as cantidades"];
      
  var queryCantidadDespachada = G.knex.column(colCantidadDespachada)
        .select()
        .from('hc_dispensacion_medicamentos_tmp')
        .where({evolucion_id:obj.evolucionId})
        .groupBy('codigo_formulado').as("a");

  var queryCantidadEntregas = G.knex.column(colCantidadEntregas)
        .select()
        .from('hc_pendientes_por_dispensar')
        .where({evolucion_id:obj.evolucionId})
        .andWhere('sw_estado', '0')
        .groupBy('codigo_medicamento').as("b");
    
  var queryTmp = G.knex.select("codigo_formulado")
                        .from('hc_dispensacion_medicamentos_tmp')
                        .where('evolucion_id',obj.evolucionId)
  
  var query = G.knex.select(colQuery)
                .from(queryCantidadDespachada)
                .innerJoin(queryCantidadEntregas, 
                    function() {
                        this.on("a.codigo_producto", "b.codigo_producto")

                }).union(function(){
                    this.select(colFormulados)
                        .from('hc_pendientes_por_dispensar')
                        .where('evolucion_id',obj.evolucionId)
                        .andWhere('sw_estado','0')
                        .andWhereNot('codigo_medicamento','not in', queryTmp);
                });
              
   query.then(function(resultado){ 
        console.log("resultado [listarMedicamentosPendientesSinDispensar]: ", resultado);
        callback(false, resultado)
    }).catch(function(err){         
         console.log("err (/catch) [listarMedicamentosPendientesSinDispensar]: ", err);
         
        callback(err);
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

    console.log("******DispensacionHcModel.prototype.insertarDespachoMedicamentosPendientes**********");
    console.log("******DispensacionHcModel.prototype.insertarDespachoMedicamentosPendientes**********");
    console.log("******DispensacionHcModel.prototype.insertarDespachoMedicamentosPendientes**********");
    
   /*var parametros = {1: obj.bodegasDocId, 2: obj.numeracion, 3: obj.evolucion, 4: obj.todoPendiente};   
   var sql = "INSERT INTO hc_formulacion_despachos_medicamentos_pendientes\
              (bodegas_doc_id,numeracion,evolucion_id,todo_pendiente)\
               VALUES( :1, :2, :3, :4);"          
   var query = G.knex.raw(sql,parametros);*/
   var query = G.knex('hc_formulacion_despachos_medicamentos_pendientes')
     .insert({bodegas_doc_id: obj.bodegasDocId,
            numeracion: obj.numeracion,
            evolucion_id: obj.evolucion,
            todo_pendiente: obj.todoPendiente
             });
        
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){    
          console.log("resultado [insertarDespachoMedicamentosPendientes]: ", resultado);
          callback(false, resultado);
   }).catch(function(err){
        console.log("err (/catch) [insertarDespachoMedicamentosPendientes]: ", err);
        callback({err:err, msj: "Error al generar el despacho de los medicamentos pendientes"});   
    });  
};

/**
 * @author Cristian Manuel Ardila
 * @fecha  2016/08/05
 * +Descripcion Metodo encargado de actualizar los medicamentos que estaban
 *              pendientes por ser despachados, agregandoles el bodegas_doc_id
 *              y la numeracion, este metodo se ejecutara en una transaccion
 * 
 * */
DispensacionHcModel.prototype.actualizarProductoPorBodega = function(obj,transaccion, callback){
   
   console.log("**********actualizarProductoPorBodega***************");
   console.log("**********actualizarProductoPorBodega***************");
   console.log("**********actualizarProductoPorBodega***************");
   
  /* var parametros = {1: obj.bodegasDocId, 2: obj.numeracion, 3: obj.evolucion};   
   var sql = "UPDATE  hc_pendientes_por_dispensar\
		SET     bodegas_doc_id= :1,numeracion= :2\
		WHERE   evolucion_id = :3 ;";          
   var query = G.knex.raw(sql,parametros);*/
    
   var query = G.knex('hc_pendientes_por_dispensar')
       .where({evolucion_id: obj.evolucion})              
       .update({bodegas_doc_id: obj.bodegasDocId, numeracion: obj.numeracion});
       
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){ 
       console.log("resultado [actualizarProductoPorBodega]: ", resultado); 
          callback(false, resultado);
   }).catch(function(err){
        
        console.log("err (/catch) [actualizarProductoPorBodega]: ", err); 
        callback({err:err, msj: "Error al realizar el despacho de los pendientes"});   
    });  
};
 
 
 
 
 /**
 * @author Cristian Manuel Ardila
 * @fecha  2016/08/31
 * +Descripcion Metodo encargado de actualizar la formula a estado finalizado
 * 
 * */
DispensacionHcModel.prototype.actualizarEstadoFinalizoFormula = function(obj,transaccion, callback){
   
    var query = G.knex('dispensacion_estados')
       .where({evolucion_id: obj.evolucion})              
       .update({sw_finalizado: 1, fecha_ultima_entrega: 'now()'});
   
    if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){        
          callback(false, resultado);
    }).catch(function(err){
         console.log("error [actualizarEstadoFinalizoFormula]:", err);
          callback({err:err, msj: "Error al actualizar la formula a estado finalizado"});   
    });  
};
 
  


 /**
 * @author Cristian Manuel Ardila
 * @fecha  2016/08/31
 * +Descripcion Metodo encargado de actualizar el estado de un producto pendiente
 *              para posteriormente descartarlo
 * 
 * */
DispensacionHcModel.prototype.descartarProductoPendiente = function(obj, callback){
   
   console.log("*********descartarProductoPendiente YES****************");
   console.log("*********descartarProductoPendiente YES****************");
   console.log("*********descartarProductoPendiente YES****************");
   
  /* var parametros = {1: obj.usuario, 2:obj.tipoJustificacion, 3:obj.identificadorProductoPendiente};   
   var sql = "UPDATE hc_pendientes_por_dispensar\
		SET sw_estado= '2', \
		usurio_reg_pendiente= :1,\
                fecha_noreclama = now(),\
                justificacion_pendiente = :2\
              WHERE hc_pendiente_dispensacion_id = :3 ;";          
   var query = G.knex.raw(sql,parametros);*/
    
    var query = G.knex('hc_pendientes_por_dispensar')
       .where({hc_pendiente_dispensacion_id: obj.identificadorProductoPendiente})              
       .update({sw_estado: '2', 
                usurio_reg_pendiente: obj.usuario, 
                fecha_noreclama: 'now()', 
                justificacion_pendiente: obj.tipoJustificacion });

     
      query.then(function(resultado){ 
          console.log("resultado ", resultado);
          callback(false, resultado);
   }).catch(function(err){
          console.log("error [descartarProductoPendiente]: ", err);
          callback({status:403, msj: "Error al actualizar el estado del producto pendiente"});   
    });  
};
 
 
DispensacionHcModel.prototype.actualizarEstadoFormulaSinPendientes = function(obj, callback)
{   
   console.log("********DispensacionHcModel.prototype.actualizarEstadoFormulaSinPendientes****************");
   console.log("********DispensacionHcModel.prototype.actualizarEstadoFormulaSinPendientes****************");
   console.log("********DispensacionHcModel.prototype.actualizarEstadoFormulaSinPendientes****************");
   console.log("obj ", obj);
    var that = this;
    var def = G.Q.defer();                          
    G.knex.transaction(function(transaccion) {        
                
    /**
    * +Descripcion se actualiza la tabla de estados evidenciando
    *              que la formula ya no tiene pendientes
    */          
    return G.Q.ninvoke(that,'actualizarDispensacionEstados', {actualizarCampoPendiente:1, conPendientes:0, evolucion:obj.evolucion},transaccion).then(function(){
            
            
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
 * Descripcion : Modelo encargado de manejar los procesos de generacion de dispensacion
 *               de una formula a traves de las transacciones, con el fin de que se
 *               cumpla cada registro prerequisito de otro y evitar la inconsistencia
 *               de datos
 * @fecha: 2016-08-01 09:45 pm 
 */
DispensacionHcModel.prototype.generarDispensacionFormula = function(obj, callback)
{   
       console.log("***********DispensacionHcModel.prototype.generarDispensacionFormula*************");                                           
       console.log("***********DispensacionHcModel.prototype.generarDispensacionFormula*************");                                           
       console.log("***********DispensacionHcModel.prototype.generarDispensacionFormula*************");
       
    var that = this;
    var def = G.Q.defer();
    G.knex.transaction(function(transaccion) {  
        
        G.Q.nfcall(__insertarBodegasDocumentos, obj.parametro1, transaccion)
           .then(function(resultado){  
               console.log("ESTE ES EL RESULTADO ", resultado);
                var formato = 'YYYY-MM-DD hh:mm:ss a';
                var fechaToday = G.moment(resultado[0]).format(formato);
                obj.parametro1.fecha_ultima_entrega = fechaToday;
                console.log("RETURNING RESULTADO [__insertarBodegasDocumentos]", obj.parametro1);
                
                return G.Q.nfcall(__insertarDespachoMedicamentos, obj.parametro1, transaccion);
        }).then(function(){          
               
                return  G.Q.nfcall(__guardarBodegasDocumentosDetalle,that,0, obj.parametro2,transaccion);  
        }).then(function(){
                return G.Q.ninvoke(that,'consultarProductoTemporal',{evolucionId:obj.parametro1.evolucion},1)          
        }).then(function(resultado){
          
                if(resultado.length >0 || obj.parametro1.todoPendiente === '1'){                                   
                    return G.Q.ninvoke(that,'listarMedicamentosPendientes',{evolucionId:obj.parametro1.evolucion});                                   
                }        
        }).then(function(resultado){           
                                           
              
                if(resultado.length >0){
                   // console.log("Insertar medicamentos pendientes ");
                /**
                 * +Descripcion Funcion recursiva que se encargada de almacenar los pendientes
                 */               
                    return G.Q.nfcall(__insertarMedicamentosPendientes,that,0, resultado, obj.parametro1.evolucion,0, obj.parametro1.usuario,transaccion);
                }else{
                    def.resolve();
                }         
            
        }).then(function(resultado){
            
                obj.parametro1.conPendientes = !resultado ? 0 : resultado;
             
                return G.Q.ninvoke(that,'eliminarTemporalesDispensados',{evolucionId:obj.parametro1.evolucion}, transaccion); 
         
        }).then(function(){
                
                obj.parametro1.actualizarCampoPendiente = 0;
                console.log("ESTO ES CUANDO DISPENSO POR PRIMERA VEZ ", obj.parametro1);
                return G.Q.ninvoke(that,'actualizarDispensacionEstados', obj.parametro1 , transaccion); 
         
        }).then(function(){
                 
                return G.Q.ninvoke(that,'consultarNumeroTotalEntregas', obj.parametro1 , transaccion);
                
        }).then(function(resultado){  
            console.log(" ============= MIRAR SI A QUI PASO SATISFACTORIAMENTE ", resultado); 
            if(resultado[0].estado_entrega === '1'){                
                return G.Q.ninvoke(that,'actualizarEstadoFinalizoFormula', obj.parametro1 , transaccion);
            }else{
                def.resolve();
            }  
                         
        }).then(function(resultado){  
                            
            return G.Q.ninvoke(that,'actualizarMedicamentoConfrontado', obj.parametro1 , transaccion);
                       
                         
        }).
        
        then(function(resultado){  
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
 * @author Cristian Manuel Ardila
 * @fecha  2016/10/28
 * +Descripcion Metodo encargado de actualizar el estado del medicamento que
 *              se ha confrontado a 0 CERO para que vuelva a confrontar nuevamente
 *              si se da el caso
 * 
 * */
DispensacionHcModel.prototype.actualizarMedicamentoConfrontado = function(obj,transaccion, callback){
   
   var parametros = {1: obj.evolucion};   
   var sql = "UPDATE hc_formulacion_antecedentes\
		SET sw_autorizado= 0 \
		WHERE evolucion_id = :1 ;";          
   var query = G.knex.raw(sql,parametros);
    
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){ 
          
          callback(false, resultado);
   }).catch(function(err){
         console.log("error [actualizarMedicamentoConfrontado]:", err);
          callback({err:err, msj: "Error al actualizar la formula a estado finalizado"});   
    });  
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
   
    var that = this;                   
    var parametrosActualizarDispensacionEstados = {evolucion:obj.evolucionId, conPendientes:2, actualizarCampoPendiente:1}
    G.knex.transaction(function(transaccion) {  
        
        G.Q.ninvoke(that,'listarMedicamentosPendientes', {evolucionId:obj.evolucionId}).then(function(resultado){        
                
                if(resultado.length >0){                    
                /**
                 * +Descripcion Funcion recursiva que se encargada de almacenar los pendientes
                 */
                    return G.Q.nfcall(__insertarMedicamentosPendientes,that,0, resultado, obj.evolucionId,1, obj.usuario,transaccion);
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
         console.log("err [guardarTodoPendiente]: ", err);
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
    console.log("*****DispensacionHcModel.prototype.actualizarEstadoFormula 1*********");
    console.log("*****DispensacionHcModel.prototype.actualizarEstadoFormula 2*********");
    console.log("*****DispensacionHcModel.prototype.actualizarEstadoFormula 3*********");
    
    /*var sql = "UPDATE hc_formulacion_antecedentes set sw_estado='0' WHERE evolucion_id = :1;";
    
    var query = G.knex.raw(sql, {1: obj.evolucionId});*/
            
            
    var query = G.knex('hc_formulacion_antecedentes')
        .where({evolucion_id: obj.evolucionId})                    
        .update({sw_estado: '0'})
    query.then(function(resultado){ 
       
       callback(false, resultado);
    }).catch(function(err){    
        console.log("err [actualizarEstadoFormula]:", err);
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
   
   console.log("***DispensacionHcModel.prototype.actualizarDispensacionEstados*****");
   console.log("***DispensacionHcModel.prototype.actualizarDispensacionEstados*****");
   console.log("***DispensacionHcModel.prototype.actualizarDispensacionEstados*****");
   
   console.log("obj [actualizarDispensacionEstados]: ", obj);
   
   var parametros = [];
   var sql = "";   
   var def = G.Q.defer();
    /**
     * 
     * +Descripcion Se valida si es una nueva entrega de la formula
     *              actualizarCampoPendiente: 0
     *              ó si es una dispensacion de pendientes
     *              actualizarCampoPendiente: 1
     **/
    if(obj.actualizarCampoPendiente === 0){
        
        /**
         * +Descripcion Se valida que al ser la ultima dispensacion de la formula
         *              solo se podra actualizar la fecha de la entrega
         *              La fecha minima y la fecha maxima solo se actualizaran
         *              siempre y cuando la formula tenga mas entregas pendientes
         */       
        if(obj.actualizarFechaUltimaEntrega === 1){
            parametros = {sw_pendiente : obj.conPendientes,
                         evolucion_id: obj.evolucion,
                         fecha_ultima_entrega: obj.fecha_ultima_entrega
                        };
            
            sql = "UPDATE dispensacion_estados \
                    set fecha_entrega = now(),\
                    numero_entrega_actual = numero_entrega_actual+1, \
                    sw_pendiente = :sw_pendiente,\
                    fecha_ultima_entrega = :fecha_ultima_entrega \
                    WHERE evolucion_id = :evolucion_id ";
            
        }else{        
            parametros = {fecha_entrega: obj.fechaEntrega,
                    fecha_minima_entrega: obj.fechaMinima,
                    fecha_maxima_entrega: obj.fechaMaxima,
                    sw_pendiente : obj.conPendientes,
                    evolucion_id: obj.evolucion,
                    fecha_ultima_entrega: obj.fecha_ultima_entrega
                    };
                
            sql = "UPDATE  dispensacion_estados \
                set numero_entrega_actual= numero_entrega_actual+1,\
                fecha_entrega = :fecha_entrega,\
                fecha_minima_entrega = :fecha_minima_entrega,\
                fecha_maxima_entrega = :fecha_maxima_entrega, \
                sw_pendiente = :sw_pendiente, \
                fecha_ultima_entrega = :fecha_ultima_entrega\
                WHERE   evolucion_id = :evolucion_id ";
            }       
    };
    
    if(obj.actualizarCampoPendiente === 1){
        
        var fechaUltimaEntrega = "";
        if(!obj.fecha_ultima_entrega){
            parametros = {sw_pendiente : obj.conPendientes, evolucion_id: obj.evolucion};
           fechaUltimaEntrega = "";
        }else{
            parametros = {sw_pendiente : obj.conPendientes, evolucion_id: obj.evolucion, fecha_ultima_entrega: obj.fecha_ultima_entrega};
            fechaUltimaEntrega = ",fecha_ultima_entrega = :fecha_ultima_entrega";
           
        }
       
        sql = "UPDATE dispensacion_estados \
                set sw_pendiente = :sw_pendiente \
                "+fechaUltimaEntrega+"\
               WHERE evolucion_id = :evolucion_id ";
    }                                      
                          
    var query = G.knex.raw(sql,parametros);    
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){ 
          console.log("A QUI resultado ", resultado);         
            if(obj.actualizarCampoPendiente === 0){

                parametrosNumeroEntregaBodDoc = {bodegasDocId : obj.bodegasDocId,numeracion: obj.numeracion,evolucion_id: obj.evolucion};                       
                return G.Q.nfcall(__numeroEntregaBodegasDocumentos, parametrosNumeroEntregaBodDoc,transaccion);

            }else{
                def.resolve();           
            }
           
    }).then(function(resultado){   
        
        callback(false, resultado);
    }).catch(function(err){
        console.log("err [actualizarDispensacionEstados]: ", err);
        console.log("parametros ", parametros);
        callback({err:err, msj: "Error al realizar el despacho de los pendientes"});   
    });  
};

/**
 * @author Cristian Ardila
 * +Descripcion Modelo encargado de crear el numero de despacho de la entrega
 *              de una formula
 * @fecha 11/06/2016
 */
function __numeroEntregaBodegasDocumentos(obj, transaccion, callback){
    
      console.log("****__numeroEntregaBodegasDocumentos 1*******");
      console.log("****__numeroEntregaBodegasDocumentos 2*******");
      console.log("****__numeroEntregaBodegasDocumentos 3*******");
      console.log("parametros ", obj);
   /* var parametros ={1: obj.bodegasDocId,2: obj.numeracion, 3: obj.evolucion_id};
            
        var sql = "UPDATE  bodegas_documentos \
                set numero_entrega_actual = (SELECT numero_entrega_actual FROM dispensacion_estados WHERE evolucion_id = :3 )\
                WHERE   bodegas_doc_id = :1 \
                AND  numeracion = :2 ";
     
    var query = G.knex.raw(sql, parametros); */
  
     var queryNumeroEntregaActual = G.knex.column("numero_entrega_actual")
        .select()
        .from('dispensacion_estados')
        .where({evolucion_id:obj.evolucion_id});
     
     var query = G.knex('bodegas_documentos')
        .where({bodegas_doc_id: obj.bodegasDocId,numeracion: obj.numeracion})                    
        .update({numero_entrega_actual: queryNumeroEntregaActual});
    
     if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){
            console.log("resultado: ", resultado);
            callback(false, resultado);
     }).catch(function(err){
        console.log("err (/catch) [__numeroEntregaBodegasDocumentos]: ", err);
        
        callback({err:err, msj: "Error al guardar el numero de entrega"});   
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
        sumaTotalDispensados = 0;
        callback(false,rowCount);  
        return;                     
    }  
    
    if(parseInt(producto.total) > 0){      
        G.Q.ninvoke(that,'insertarPendientesPorDispensar',producto, evolucionId, todoPendiente, usuario, transaccion).then(function(resultado){
            rowCount = 1;
           //console.log("resultado rowCount::::---:::: ", rowCount);
         }).fail(function(err){      
       }).done();   
    }
    
     console.log("Se valida si es el ultimo producto por dispensar y si este es 0");
     //console.log("productos.length ", productos.length);
     //console.log("parseInt(producto.total) ", parseInt(producto.total));
     //console.log("(producto) ", (producto));
     sumaTotalDispensados += parseInt(producto.total);
    if( sumaTotalDispensados === 0){    
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
        console.log("err (/fail) [__guardarBodegasDocumentosDetalle]: ", err);
        console.log("parametros: ", parametros);
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
    console.log("*********__actualizarExistenciasBodegasLotesFv***********");
    console.log("*********__actualizarExistenciasBodegasLotesFv***********");
    console.log("*********__actualizarExistenciasBodegasLotesFv***********");
    //Problemas con el filtro de la fecha de vencimiento    
    var formato = 'YYYY-MM-DD';
    /*var parametros = {1: obj.cantidad_despachada, 2: obj.empresa_id,  3: obj.centro_utilidad, 
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
    */
   console.log("obj ", obj);
   console.log("G.moment(obj.fecha_vencimiento, formato) ", G.moment(obj.fecha_vencimiento).format(formato));//G.moment(obj.fecha_vencimiento).add(1, 'day').format(formato)
  
    var query = G.knex('existencias_bodegas_lote_fv')
                 .where({empresa_id:obj.empresa_id,                      
                    centro_utilidad:obj.centro_utilidad,
                    bodega:obj.bodega,
                    codigo_producto:obj.codigo_producto, //to_char(d.fecha_registro,'YYYY-mm-dd') 
                    fecha_vencimiento: G.moment(obj.fecha_vencimiento).add(1, 'day').format(formato),//G.moment(obj.fecha_vencimiento, formato),
                    lote:obj.lote
            }).decrement('existencia_actual', obj.cantidad_despachada);
    
    

    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){  
        console.log("resultado [__actualizarExistenciasBodegasLotesFv]: ", resultado);
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__actualizarExistenciasBodegasLotesFv]: ", err);
        
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
    
    console.log("*********__actualizarExistenciasBodegas***********");
    console.log("*********__actualizarExistenciasBodegas***********");
    console.log("*********__actualizarExistenciasBodegas***********");
    /*var parametros = {1: obj.cantidad_despachada, 2: obj.empresa_id,  3: obj.centro_utilidad, 
                      4: obj.bodega , 5:obj.codigo_producto};
    var sql = "UPDATE  existencias_bodegas \n\
                set existencia= existencia - :1\
                WHERE   empresa_id = :2 \
                AND  centro_utilidad = :3\
                AND     bodega = :4\
                AND     codigo_producto = :5";

    var query = G.knex.raw(sql,parametros);  */
    
    var query = G.knex('existencias_bodegas')
                 .where({empresa_id:obj.empresa_id,
                    centro_utilidad:obj.centro_utilidad,
                    bodega:obj.bodega,
                    codigo_producto:obj.codigo_producto
            }).decrement('existencia', obj.cantidad_despachada );


    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){ 
        console.log("resultado [__actualizarExistenciasBodegasLotesFv]: ", resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__actualizarExistenciasBodegas]: ", err);
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
     
     console.log("************__insertarBodegasDocumentosDetalle********************");
     console.log("************__insertarBodegasDocumentosDetalle********************");
     console.log("************__insertarBodegasDocumentosDetalle********************");
     
     
    /*var parametros ={1: obj.codigo_producto,
     *                  2: obj.cantidad_despachada,
     *                  3: obj.empresa_id,
                     4: plan,
                     5: bodegasDocId,
                     6: numeracion,
                     7: obj.fecha_vencimiento,
                     8: obj.lote,
                     9: '1'};
                 
    var sql = " INSERT INTO bodegas_documentos_d(consecutivo,codigo_producto,cantidad,total_costo,total_venta,bodegas_doc_id,
                    numeracion,fecha_vencimiento,lote,sw_pactado)\
                VALUES( DEFAULT, :1, :2, (COALESCE(fc_precio_producto_plan('0', :1, :3,'0','0'),0)),\
                (COALESCE(fc_precio_producto_plan( :4, :1, :3,'0','0'),0)* :2),\
                 :5, :6, :7, :8, :9 );";
    
    var query = G.knex.raw(sql, parametros);*/
    
    var query = G.knex('bodegas_documentos_d')
     .insert({consecutivo: G.knex.raw('DEFAULT'),
            codigo_producto: obj.codigo_producto,
            cantidad: obj.cantidad_despachada,
            total_costo: G.knex.raw("(COALESCE(fc_precio_producto_plan('0','"+obj.codigo_producto+"', '"+obj.empresa_id+"','0','0'),0))"),
            total_venta:G.knex.raw("(COALESCE(fc_precio_producto_plan( "+plan+", '"+obj.codigo_producto+"', '"+obj.empresa_id+"','0','0'),0)* "+obj.cantidad_despachada+")"),
            bodegas_doc_id: bodegasDocId,
            numeracion: numeracion,
            fecha_vencimiento: obj.fecha_vencimiento,
            lote: obj.lote,
            sw_pactado: '1' });
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){ 
         //console.log("resultado [__insertarBodegasDocumentosDetalle]: ", resultado);  
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__insertarBodegasDocumentosDetalle]: ", err);
      
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
   
   console.log("*********DispensacionHcModel.prototype.insertarPendientesPorDispensar *************");
   console.log("*********DispensacionHcModel.prototype.insertarPendientesPorDispensar *************");
   console.log("*********DispensacionHcModel.prototype.insertarPendientesPorDispensar *************");
   
   /*var parametros = {1: evolucionId, 2: producto.codigo_producto, 3: Math.round(producto.total),
                     4: usuario, 5: todoPendiente, 6: 'now()'};
  //console.log("parametros ", parametros);
   var sql = "INSERT INTO hc_pendientes_por_dispensar\
      (hc_pendiente_dispensacion_id,evolucion_id,codigo_medicamento,cantidad,\
       usuario_id,todo_pendiente,fecha_registro, fecha_pendiente)\
            VALUES( DEFAULT, :1, :2, :3, :4, :5, :6, :6 );";
        
        
           
    var query = G.knex.raw(sql,parametros );*/
    
    var query = G.knex('hc_pendientes_por_dispensar')
     .insert({hc_pendiente_dispensacion_id: G.knex.raw('DEFAULT'),
              evolucion_id: evolucionId,
              codigo_medicamento: producto.codigo_producto,
              cantidad: Math.round(producto.total),
              usuario_id: usuario,
              todo_pendiente:  todoPendiente,
              fecha_registro: 'now()',
              fecha_pendiente: 'now()'});
    
   if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){ 
      
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarPendientesPorDispensar]: ", err);       
        callback({err:err, msj: "Error al guardar los medicamentos pendientes"});   
    });
};

/*
 * Autor : Cristian Ardila
 * Descripcion : SQL encargado de eliminar los productos que ya se han dispensado
 * @fecha: 08/06/2015 2:43 pm 
 */
DispensacionHcModel.prototype.eliminarTemporalesDispensados = function(obj,transaccion,callback) {
   
   console.log("*********DispensacionHcModel.prototype.eliminarTemporalesDispensados***************");
   console.log("*********DispensacionHcModel.prototype.eliminarTemporalesDispensados***************");
   console.log("*********DispensacionHcModel.prototype.eliminarTemporalesDispensados***************");
   
  /* var parametros = {1: obj.evolucionId};   
   var sql = "DELETE FROM hc_dispensacion_medicamentos_tmp WHERE evolucion_id = :1;";          
   var query = G.knex.raw(sql,parametros );*/
    
   var query = G.knex('hc_dispensacion_medicamentos_tmp')
        .where('evolucion_id', obj.evolucionId)
        .del();
    
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){    
         console.log("resultado [eliminarTemporalesDispensados]:", resultado)
          callback(false, resultado);
   }).catch(function(err){
        console.log("err (/catch) [eliminarTemporalesDispensados]: ", err);
        
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
    var that = this;
    var hcDespachoEventoId = "";
    G.knex.transaction(function(transaccion) {          
        G.Q.nfcall(__actualizarDespachoMedicamentoEvento, parametro, transaccion).then(function(resultado){                               
            return G.Q.nfcall(__insertarDespachoMedicamentoEvento,parametro, transaccion);                
        }).then(function(resultado){                  
            hcDespachoEventoId = resultado[0];
            return G.Q.ninvoke(that,'consultarMedicamentosPendientesEvento', parametro, transaccion)           

        }).then(function(resultado){           
            console.log("resultado TAMO ", resultado.length)
            if(resultado.length >0){                    
            /**
             * +Descripcion Funcion recursiva que se encargada de almacenar los pendientes
             */
                  return G.Q.nfcall(__prepararMedicamentoEventoDetalle,that,0,resultado, hcDespachoEventoId, transaccion);     
            }  

        }).then(function(resultado){
            transaccion.commit();    
        }).fail(function(err){        
           transaccion.rollback(err);
        }).done();
        
    }).then(function(){     
            callback(false);
    }).catch(function(err){
        console.log("err (/catch) [registrarEvento]: ", err);
        console.log("parametros: ", parametro);
        callback(err);       
    }).done(); 
    
};

/**
 *@author Cristian Manuel Ardila Troches
 *+Descripcion Funcion encargada de consultar los medicamentos pendientes
 *             para almacenar su registro en un evento por el cual el paciente
 *             no se haya acercado hasta la fecha a la farmacia a reclamar
 *@fecha 2016-12-09              
 **/             
DispensacionHcModel.prototype.consultarMedicamentosPendientesEvento = function(parametro,transaccion, callback)
{    
    console.log("**********DispensacionHcModel.prototype.consultarMedicamentosPendientesEvento****************");
    console.log("**********DispensacionHcModel.prototype.consultarMedicamentosPendientesEvento****************");
    console.log("**********DispensacionHcModel.prototype.consultarMedicamentosPendientesEvento****************");
    
    var columnas = [G.knex.raw("SUM(numero_unidades) as total"),
                    "codigo_medicamento",
                    "fecha_registro",
                    G.knex.raw("fc_descripcion_producto_alterno(codigo_medicamento) as descripcion_prod")]
   var colSubQuery = ["codigo_medicamento",
                      "fecha_registro",
                      G.knex.raw("SUM(cantidad) as numero_unidades")];
                  
   var subQuery = G.knex.select(colSubQuery)
                        .from('hc_pendientes_por_dispensar')
                        .where('evolucion_id',parametro.evolucionId)
                        .andWhere('sw_estado','0')
                        .groupBy('codigo_medicamento','fecha_registro').as("A");
                
         
    var query = G.knex.select(columnas).from(subQuery).groupBy('codigo_medicamento','fecha_registro');
    
     if(transaccion) query.transacting(transaccion);   
     query.then(function(resultado) {
        console.log("resultado [consultarMedicamentosPendientesEvento]: ", resultado);
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [consultarMedicamentosPendientesEvento]: ", error);
        callback(error);
    });
};

/**
*@author Cristian MAnuel Ardila Troches
*+Descripcion Metodo encargado de recorrer los productos pendientes que se almacenaran
*             como una nueva eventualidad de por que el paciente no reclamo la
*             formula
*@fecha 2016-09-12 (YYYY-DD-MM) 
* 
**/
function __prepararMedicamentoEventoDetalle(that, index, parametros,hcDespachoEventoId,transaccion, callback) {
     
    var producto = parametros[index];
    if (!producto) {             
        callback(false);
        return;
    }  
     
    G.Q.nfcall(__insertarDespachoMedicamentoEventoDetalle,producto,hcDespachoEventoId, transaccion).then(function(resultado){

    }).fail(function(err){
         console.log("err (/fail) [__prepararMedicamentoEventoDetalle]: ", err);
    }).done();               
      
    index++;
  
    setTimeout(function() {
        __prepararMedicamentoEventoDetalle(that, index, parametros,hcDespachoEventoId,transaccion, callback);
    }, 300);
}


/*
 * @autor : Cristian Ardila
 * Descripcion : SQL para actualizar el estado del evento del despacho del medicamento
 * @fecha: 08/06/2015 09:45 pm 
 */
function __actualizarDespachoMedicamentoEvento(parametro, transaccion, callback) {

   var query = G.knex("hc_despacho_medicamentos_eventos").
            where({paciente_id: parametro.pacienteId, 
                    tipo_id_paciente: parametro.tipoIdPaciente,
                    evolucion_id: parametro.evolucionId,
                    sw_estado: '1'}).
            update({sw_estado: '0'});
    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){ 
        console.log("resultado [__actualizarDespachoMedicamentoEvento]: ", resultado);
            callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [__actualizarDespachoMedicamentoEvento]: ", err);
        
        callback({err:err, msj: "Error al actualizar el evento"});
    });  
};

/*
 * @autor : Cristian Ardila
 * Descripcion : SQL para insertar un nuevo evento del despacho del medicamento
 * @fecha: 08/06/2015 09:45 pm 
 */
function __insertarDespachoMedicamentoEvento(parametro, transaccion, callback) {
 
    var query = G.knex('hc_despacho_medicamentos_eventos')
       .returning("hc_despacho_evento")
     .insert({hc_despacho_evento:G.knex.raw("nextval('hc_despacho_medicamentos_eventos_hc_despacho_evento_seq')"),
              paciente_id: parametro.pacienteId,
              tipo_id_paciente: parametro.tipoIdPaciente,
              evolucion_id: parametro.evolucionId,
              observacion: parametro.observacion,
              fecha_evento: parametro.fecha,
              fecha_registro: 'now()',
            usuario_id: parametro.usuario});
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){ 
         console.log(" resultado [__insertarDespachoMedicamentoEvento]:", resultado);
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__insertarDespachoMedicamentoEvento]: ", err);
        console.log("parametros: ", parametro);
        callback({err:err, msj: "Error al guardar el evento"});
    });  
};

/*
 * @autor : Cristian Ardila
 * Descripcion : SQL para insertar los medicamentos pendientes relacionados con 
 *              el evento de por que el paciente no reclamo la formula
 * @fecha: 09/12/2016 09:45 pm 
 */
function __insertarDespachoMedicamentoEventoDetalle(parametro,hcDespachoEventoId, transaccion, callback) {
  
   var query = G.knex('hc_despacho_medicamentos_eventos_d')
     .insert({hc_despacho_evento_d:G.knex.raw("DEFAULT"),
              hc_despacho_evento: hcDespachoEventoId,
              codigo_medicamento: parametro.codigo_medicamento,
              cantidad: parametro.total});
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){ 
         console.log(" resultado [__insertarDespachoMedicamentoEvento]:", resultado);
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__insertarDespachoMedicamentoEvento]: ", err);
        console.log("parametros: ", parametro);
        callback({err:err, msj: "Error al guardar el evento"});
    });  
};
/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado de obtener los diferentes tipos de formula
 * @controller DispensacionHc.prototype.listarTipoFormula
 */
DispensacionHcModel.prototype.listarRegistroDeEventos = function(obj,callback){
   
   var columna = ["observacion as descripcion",
                  G.knex.raw("TO_CHAR(fecha_registro,'YYYY-MM-DD')as id")];
    G.knex('hc_despacho_medicamentos_eventos').where({
        evolucion_id: obj.evolucion
    }).select(columna).then(function(resultado){    
       
        callback(false, resultado)
    }).catch(function(err){     
         console.log("err [listarRegistroDeEventos]: ", err)
        callback(err);
    });
          
};


/*
 * @autor : Cristian Ardila
 * Descripcion : SQL para eliminar el producto de la tabla temporal
 * @fecha: 08/06/2015 09:45 pm 
 */
function __eliminarTemporalFormula(producto, transaccion, callback) {
    var idTemp = "";
    if(producto.serialId > 0){
        idTemp = "hc_dispen_tmp_id = :1 AND";
    }
    var sql = "DELETE FROM hc_dispensacion_medicamentos_tmp\
               WHERE " + idTemp +"\
                  evolucion_id = :2\
               AND   codigo_producto = :3 RETURNING codigo_formulado";

    var query = G.knex.raw(sql,{1: producto.serialId,2: producto.evolucionId,3: producto.codigoProducto});    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){    
            //console.log("resultado ", resultado);
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__eliminarTemporalFormula]: ", err);
        console.log("parametros: ", producto);
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
        console.log("err (/catch) [__insertarTemporalFarmacia]: ", err);
        console.log("parametros: ", producto);
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
    
    console.log("MIGRANDO KNEX ORM (__insertarBodegasDocumentos)")
    /*var parametros ={1: obj.bodegasDocId,2: obj.numeracion,3: 'now()',
                     4: '0',5: null,6: obj.observacion,7: obj.usuario,
                     8: obj.todoPendiente,9: 'now()'};
                 
    var sql = " INSERT INTO bodegas_documentos(bodegas_doc_id,numeracion,fecha,total_costo,transaccion,observacion,usuario_id,todo_pendiente,fecha_registro)\
                VALUES( :1, :2, :3, :4, :5, :6, :7, :8, :9 ) RETURNING fecha_registro;";
    var query = G.knex.raw(sql, parametros);*/
    
     var query = G.knex('bodegas_documentos')
             .returning("fecha_registro")
     .insert({bodegas_doc_id: obj.bodegasDocId,
            numeracion: obj.numeracion,
            fecha: 'now()',
            total_costo: '0',
            transaccion: null,
            observacion: obj.observacion,
            usuario_id: obj.usuario,
            todo_pendiente: obj.todoPendiente,
            fecha_registro: 'now()' });
    
    
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){  
            //console.log("resultado ", resultado);
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__insertarBodegasDocumentos]: ", err);
         
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
    
    console.log("MIGRANDO KNEX ORM (__insertarDespachoMedicamentos)")
    /*var sql = " INSERT INTO hc_formulacion_despachos_medicamentos(hc_formulacion_despacho_id,evolucion_id,bodegas_doc_id,numeracion)\
                VALUES( DEFAULT, :1, :2, :3);";
    
     var query = G.knex.raw(sql, {1: obj.evolucion, 2: obj.bodegasDocId,3: obj.numeracion});
     */
    var query = G.knex('hc_formulacion_despachos_medicamentos')
     .insert({hc_formulacion_despacho_id: G.knex.raw('DEFAULT'),
              evolucion_id: obj.evolucion,
              bodegas_doc_id: obj.bodegasDocId,
              numeracion: obj.numeracion});
     if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){  
        //console.log("resultado(__insertarDespachoMedicamentos) ", resultado);
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__insertarDespachoMedicamentos]: ", err);
        console.log("parametros: ", obj);
        callback({err:err, msj: "Error al generar el despacho del medicamento"});  
    });
}




    

/**
 * ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 * :::::::::::::::::::::::                         ::::::::::::::::::::::::::::
 */

/**                          
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado de obtener los diferentes tipos de formula
 * @controller DispensacionHc.prototype.listarTipoFormula
 */
DispensacionHcModel.prototype.consultarFormulaAntecedentes = function(obj,callback){
        
    /*var sql = "SELECT  TO_CHAR(a.fecha_formulacion,'YYYY-MM-DD') as fecha_formulacion\
                FROM hc_formulacion_antecedentes a \
                WHERE a.evolucion_id = :1;";
      
    G.knex.raw(sql,{1: obj.evolucionId}).then(function(resultado){ 
       
        callback(false, resultado)
    }).catch(function(err){      
        console.log("err [consultarFormulaAntecedentes]: ", err);    
        callback(err)
    });  */
    var columna = [G.knex.raw("TO_CHAR(fecha_formulacion,'YYYY-MM-DD') as fecha_formulacion")];
     
     G.knex('hc_formulacion_antecedentes').where({
        evolucion_id: obj.evolucionId
    }).select(columna).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("err[consultarDispensacionesFormula]: ", error);
        callback(error);
    });
    
};
/**
 * @author Cristian Manuel Ardila Troches
 * +Descripcion Metodo encargado de invocar a traves de transacciones los metodos
 *              encargados de almacenar el movimiento de una formula
 */
DispensacionHcModel.prototype.consultarDispensacionesFormula = function(obj, callback) {
      
    var that = this;
    var def = G.Q.defer();
    var fechaEntrega;
      G.knex.transaction(function(transaccion) {          
        G.Q.nfcall(__consultarDispensacionesFormula, obj.evolucionId, transaccion).then(function(resultado){            
           //console.log("1) __consultarDispensacionesFormula ", resultado.rows);
            if(resultado.length > 0){
                return G.Q.nfcall(__actualizarNumeroEntrega,that,0,1, resultado,obj,transaccion);                      
            }else{
                def.resolve();//return transaccion.rollback("El numero de evolucion no existe");
            }
            
        }).then(function(){
            //console.log("2) __actualizarNumeroEntrega ");
            return G.Q.ninvoke(that,'insertarDispensacionEstados',obj,transaccion);   
            
            
        }).then(function(resultado){
            //console.log("3) insertarDispensacionEstados ", resultado);
            fechaEntrega = resultado;
            
            return G.Q.nfcall(__consultarMedicamentosFormulados,obj,transaccion);   
           
        }).then(function(resultado){
            //console.log("4) __consultarMedicamentosFormulados ", resultado);
            return G.Q.nfcall(__actualizarEntregaPorProducto,that,0,resultado,obj,transaccion);
            
             
        }).then(function(resultado){
            console.log("5) __actualizarEntregaPorProducto ", resultado);
            return G.Q.ninvoke(that,'consultarPendientesFormula',obj.evolucionId); 
            
        }).then(function(resultado){
         
            if(resultado.length > 0){
                return G.Q.ninvoke(that,'actualizarFechaPendientePorDispensar',obj,transaccion);  
            }else{
                def.resolve();
            }
            
        }).then(function(resultado){
            
            transaccion.commit();   
        }).fail(function(err){   
            console.log("fail transaccion rollback ", err);
           transaccion.rollback(err);
           
        }).done();
    }).then(function(){  
            
            callback(false,fechaEntrega);
    }).catch(function(err){  
        console.log("err[consultarDispensacionesFormula]: ", err);
            callback(err);       
    }).done();    
}; 

/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de consultar los documentos de despacho 
 *              de la formula a traves del numero de evolucion
 * @fecha 26-11-2016
 */
function __consultarDispensacionesFormula(evolucion,transaccion, callback) {
           
   /* var parametros = {1: evolucion};   
    var sql =  "SELECT  b.evolucion_id,\
                      date(TO_CHAR(b.fecha_entrega,'DD/MM/YYYY'))as fecha_entrega,\
                      b.bodegas_doc_id,\
                      b.numeracion\
                FROM (\
                    SELECT a.evolucion_id,\
                      a.fecha_registro as fecha_entrega,\
                      a.bodegas_doc_id,\
                      a.numeracion FROM (\
                        SELECT distinct(hp.evolucion_id)as evolucion_id, bod.fecha_registro, bod.bodegas_doc_id, bod.numeracion\
                        FROM hc_formulacion_despachos_medicamentos  hp\
                        INNER JOIN bodegas_documentos bod ON hp.bodegas_doc_id = bod.bodegas_doc_id AND hp.numeracion = bod.numeracion\
                        WHERE evolucion_id = :1\
                        UNION\
                        SELECT distinct(hp.evolucion_id)as evolucion_id, bod.fecha_registro, bod.bodegas_doc_id, bod.numeracion\
                        FROM hc_formulacion_despachos_medicamentos_pendientes hp\
                        INNER JOIN bodegas_documentos bod ON hp.bodegas_doc_id = bod.bodegas_doc_id AND hp.numeracion = bod.numeracion\
                        WHERE evolucion_id = :1 AND hp.todo_pendiente = 1)as a\
                )as b  ORDER BY b.fecha_entrega asc";
   var query = G.knex.raw(sql,parametros);
   
    if(transaccion) query.transacting(transaccion); 
    query.then(function(resultado) {
        console.log("resultado [__consultarDispensacionesFormula]: ", resultado.rows)
        callback(false, resultado.rows);
    }). catch (function(error) {
        console.log("err (/catch) [__consultarDispensacionesFormula]: ", error)
        console.log("parametros [evolucion]: ", evolucion);
        callback(error);
    });*/
    
    
    var columnasEntregas = [G.knex.raw("distinct(hp.evolucion_id)as evolucion_id"),
                                      "bod.fecha_registro",
                                      "bod.bodegas_doc_id",
                                      "bod.numeracion"];
                                  
    var columnasUnionEntregas = ["a.evolucion_id",
                      "a.fecha_registro as fecha_entrega",
                      "a.bodegas_doc_id",
                      "a.numeracion"];
    
    var columnas = [ "b.evolucion_id",
                     G.knex.raw("date(TO_CHAR(b.fecha_entrega,'DD/MM/YYYY'))as fecha_entrega"),
                     "b.bodegas_doc_id",
                     "b.numeracion"];
                 
    var queryEntregas = G.knex.select(columnasEntregas)
                        .from('hc_formulacion_despachos_medicamentos as hp')
                        .innerJoin('bodegas_documentos as bod', 
                            function() {
                                this.on("hp.bodegas_doc_id", "bod.bodegas_doc_id")
                                    .on("hp.numeracion", "bod.numeracion")
                        })
                        .where('evolucion_id',evolucion)                       
                        .union(function(){
                            this.select(columnasEntregas)
                        .from('hc_formulacion_despachos_medicamentos_pendientes as hp').innerJoin('bodegas_documentos as bod', function() {
                             this.on("hp.bodegas_doc_id", "bod.bodegas_doc_id")
                                 .on("hp.numeracion", "bod.numeracion")
                            }).whereRaw("evolucion_id = ? and hp.todo_pendiente = ?", [evolucion,1])   
                        }).as("a");
     
    var queryUnionEntregas = G.knex.select(columnasUnionEntregas).from(queryEntregas).as("b");
    
    var query = G.knex.select(columnas).from(queryUnionEntregas);
    
    query.then(function(resultado) {
        console.log("resultado [__consultarDispensacionesFormula]: ", resultado);
        callback(false, resultado);
    }). catch (function(error) {
        console.log("error [__consultarDispensacionesFormula]: ", error);
        callback(error);
    });
};

/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo recursivo encargado de actualizar el numero de entrega correspondiente
 *              de cada documento de despacho de la formula invocando el metodo
 *              actualizarNumeroEntrega
 * @fecha 26-11-2016
 */
function __actualizarNumeroEntrega(that, index,rowNum, formulas, parametros,transaccion, callback) {
     
    var formula = formulas[index];
       
    if (!formula) {   
        formula = 0; 
        rowNum = 1;
        callback(false);
        return; 
    }  
     
   G.Q.ninvoke(that,'actualizarNumeroEntrega',formula,rowNum, transaccion).then(function(resultado){
        
    }).fail(function(err){
         console.log("err (/fail) [__actualizarNumeroEntrega]: ", err);
    }).done();               
      
    index++;
    rowNum++;
    setTimeout(function() {
        __actualizarNumeroEntrega(that, index,rowNum, formulas,parametros,transaccion, callback);
    }, 300);    
};

/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de actualizar el numero de entrega de
 *              cada documento de despacho de la formula retornando el numero de entrega
 *              de despacho
 * @fecha 26-11-2016
 */
DispensacionHcModel.prototype.actualizarNumeroEntrega = function(parametro,rowNum, transaccion, callback) {
   
   console.log("*************DispensacionHcModel.prototype.actualizarNumeroEntrega****************");
   console.log("*************DispensacionHcModel.prototype.actualizarNumeroEntrega****************");
   console.log("*************DispensacionHcModel.prototype.actualizarNumeroEntrega****************");
   
    /*var sql = "update bodegas_documentos\
         set   numero_entrega_actual= :1\
         where bodegas_doc_id= :2\
         and   numeracion= :3 returning numero_entrega_actual;";*/
                 
    //var query = G.knex.raw(sql,{1: rowNum, 2: parametro.bodegas_doc_id,3: parametro.numeracion}); 
    
    /*var query = G.knex('bodegas_documentos')
            .where({bodegas_doc_id: parametro.bodegas_doc_id, numeracion: parametro.numeracion})
            .update({
        numero_entrega_actual: rowNum
    });*/
    
    var query = G.knex("bodegas_documentos").
            where({bodegas_doc_id: parametro.bodegas_doc_id, numeracion: parametro.numeracion}).
            returning('numero_entrega_actual').
            update({numero_entrega_actual: rowNum});
    if(transaccion) 
      query.transacting(transaccion).then(function(resultado){      
        console.log("resultado [actualizarNumeroEntrega]: ", resultado);
        callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [actualizarNumeroEntrega]: ", err);
        console.log("parametros: ", parametro);
        callback({err:err, msj: "Error al actualizar el evento"});
    });  
};


/**
 * @author Cristian Ardila
 * +Descripcion Modelo encargado de insertar el movimiento de la formula
 *              en la tabla de dispensacion_estados
 * @fecha 28/11/2016 (DD-MM-YYYY)
 */
DispensacionHcModel.prototype.insertarDispensacionEstados = function(obj,transaccion,callback){
      
    var parametros = {1:obj.evolucionId}; 
    var sql = "INSERT INTO dispensacion_estados \
        (formula_id, \
         evolucion_id, \
         paciente_id, \
         tipo_id_paciente, \
         numero_total_entregas, \
         numero_entrega_actual, \
         sw_refrendar, \
         sw_pendiente, \
         tipo_formula,\
         sw_finalizado,\
         fecha_entrega,\
         fecha_minima_entrega,\
         fecha_maxima_entrega,\
         medico_id,\
         fecha_registro,\
         fecha_finalizacion,\
         fecha_ultima_entrega)\
        SELECT \
         b.formula_id, \
         b.evolucion_id, \
         b.paciente_id, \
         b.tipo_id_paciente, \
         b.numero_total_entregas, \
         b.numero_entrega_actual, \
         b.sw_refrendar, \
         b.sw_pendiente, \
         b.tipo_formula,\
         b.sw_finalizado,\
         b.fecha_ultima_entrega as fecha_entrega,\
         null as fecha_minima_entrega,\
         null as fecha_maxima_entrega,\
         b.medico_id,\
         b.fecha_registro,\
         b.fecha_finalizacion,\
         b.fecha_ultima_entrega FROM (\
            SELECT a.formula_id,\
                   a.evolucion_id,\
                   a.paciente_id,\
                   a.tipo_id_paciente,\
                   a.numero_total_entregas, \
                    CASE WHEN a.numero_entrega_actual is null THEN 0 ELSE a.numero_entrega_actual END as numero_entrega_actual,\
                   0 as sw_refrendar,\
                   a.sw_pendiente,\
                   a.tipo_formula,\
                   CASE WHEN a.numero_total_entregas = a.numero_entrega_actual THEN 1 ELSE 0 END as sw_finalizado,\
                   CASE WHEN a.refrendar = 1 THEN (SELECT distinct(max(fecha_refrendacion)) as fecha_refrendacion\
                   FROM medicamentos_refrendados \
                    WHERE numero_formula = a.formula_id AND transcripcion_medica = a.tipo_formula) \
                    ELSE a.fecha_ultima_entrega END as fecha_entrega,\
                   null as fecha_minima_entrega, \
                   null as fecha_maxima_entrega, \
                   a.medico_id,\
                   a.fecha_registro,\
                   a.fecha_finalizacion,     \
                   a.fecha_ultima_entrega FROM (\
                        SELECT numero_formula as formula_id, \
                               evolucion_id,\
                               paciente_id,\
                               tipo_id_paciente, \
                               max( ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30) ) as numero_total_entregas,\
                               transcripcion_medica as tipo_formula,\
                               fecha_formulacion as fecha_registro,\
                               hc.medico_id,\
                               hc.refrendar,\
                               max(fecha_finalizacion) as fecha_finalizacion,\
                               CASE WHEN \
                               (SELECT distinct(hp.todo_pendiente) \
                               FROM hc_pendientes_por_dispensar hp \
                               WHERE hp.evolucion_id = hc.evolucion_id AND hp.bodegas_doc_id is null and hp.numeracion is null) = 0 THEN 1\
                               WHEN (SELECT distinct(hp.todo_pendiente)  \
                               FROM hc_pendientes_por_dispensar hp \
                               WHERE hp.evolucion_id = hc.evolucion_id AND hp.bodegas_doc_id is null and hp.numeracion is null) = 1 THEN 2 \
                               ELSE 0 END as sw_pendiente, \
                               (SELECT max(c.numero_entregas)as numero_entregas\
                                    FROM (\
                                    SELECT a.evolucion_id,1 from hc_formulacion_despachos_medicamentos a\
                                    union \
                                    select a.evolucion_id,2 from hc_formulacion_despachos_medicamentos_pendientes a\
                                    union\
                                    select a.evolucion_id,3 from hc_dispensacion_medicamentos_tmp a   \
                                ) as b INNER JOIN (	\
                                SELECT  sum(dispensados.numero_entregas)as numero_entregas, dispensados.evolucion_id \
                                        FROM (\
                                                SELECT count(evolucion_id) as numero_entregas, evolucion_id, 'normales' as a\
                                               FROM hc_formulacion_despachos_medicamentos WHERE evolucion_id = :1 GROUP BY evolucion_id\
                                                UNION ALL\
                                        SELECT count(desp.evolucion_id) as numero_entregas, desp.evolucion_id, 'pendientestodos' as b\
                                                                    FROM hc_formulacion_despachos_medicamentos_pendientes desp INNER JOIN bodegas_documentos pend\
                                        ON desp.bodegas_doc_id = pend.bodegas_doc_id AND desp.numeracion = pend.numeracion\
                                        WHERE desp.evolucion_id = :1 AND pend.todo_pendiente = 1  GROUP BY desp.evolucion_id	\
                                                                    )as dispensados GROUP BY dispensados.evolucion_id      \
                                    ) c ON b.evolucion_id = c.evolucion_id   \
                                                WHERE b.evolucion_id= :1)as numero_entrega_actual,\
                                                (SELECT max(a.fecha_registro) FROM (\
                                                  SELECT bod.fecha_registro\
                                                  FROM hc_formulacion_despachos_medicamentos  hp\
                                                  INNER JOIN bodegas_documentos bod ON hp.bodegas_doc_id = bod.bodegas_doc_id AND hp.numeracion = bod.numeracion\
                                                  WHERE evolucion_id = :1\
                                                  UNION\
                                                  SELECT bod.fecha_registro\
                                                   FROM hc_formulacion_despachos_medicamentos_pendientes hp\
                                                  INNER JOIN bodegas_documentos bod ON hp.bodegas_doc_id = bod.bodegas_doc_id AND hp.numeracion = bod.numeracion\
                                                  WHERE evolucion_id = :1\
                                                  ) as a) as fecha_ultima_entrega \
                        FROM hc_formulacion_antecedentes hc \
                        WHERE hc.evolucion_id = :1 \
                        GROUP BY numero_formula, \
                               evolucion_id,\
                               paciente_id,\
                               tipo_id_paciente, \
                               transcripcion_medica, \
                               fecha_formulacion,\
                               hc.medico_id,\
                               hc.refrendar\
            )as a ORDER BY a.numero_total_entregas desc limit 1\
        )as b returning fecha_entrega, numero_entrega_actual, sw_finalizado ";

    var query = G.knex.raw(sql,parametros);    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){             
        callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [insertarDispensacionEstados]: ", err);     
        callback({err:err, msj: "Error al actualizar el evento"});
    });  
     
};



/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de consultar los medicamentos asignados a una
 *              formula atraves del nuevo de evolucion
 * @fecha 28/11/2016 (DD-MM-YYYY)
 */
function __consultarMedicamentosFormulados(obj,transaccion, callback) {
       
    var query = G.knex.column('codigo_medicamento', 'evolucion_id')
      .select()
      .from('hc_formulacion_antecedentes')
      .where({evolucion_id:obj.evolucionId});
      
    if(transaccion) 
        query.transacting(transaccion).then(function(resultado){ 
            console.log("resultado [__consultarMedicamentosFormulados]: ", resultado);     
            callback(false, resultado)       
        }).catch(function(err){    
            console.log("err (/catch) [__consultarMedicamentosFormulados]: ", err)        
            callback(err);
        });
};

/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de actualizar la formula asignandole a cada 
 *              medicamento el numero de entrega que tiene
 * @fecha 28/11/2016 (DD-MM-YYYY)
 */
function __actualizarEntregaPorProducto(that, index, productos, parametros,transaccion, callback) {
    
    var producto = productos[index];

    if (!producto) {   
        callback(false);
        return; 
    }  
     
   G.Q.ninvoke(that,'actualizarEntregaPorProducto',producto, transaccion).then(function(resultado){

    }).fail(function(err){
         console.log("err (/fail) [__actualizarEntregaPorProducto]: ", err);
    }).done();               
      
    index++;
  
    setTimeout(function() {
        __actualizarEntregaPorProducto(that, index, productos,parametros,transaccion, callback);
    }, 300);    
};

/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de actualizar la formula asignandole a cada 
 *              medicamento el numero de entrega que tiene
 * @fecha 28/11/2016 (DD-MM-YYYY)
 */
DispensacionHcModel.prototype.actualizarEntregaPorProducto = function(obj, transaccion, callback) {
   
   console.log("*******DispensacionHcModel.prototype.actualizarEntregaPorProducto**********");
   console.log("*******DispensacionHcModel.prototype.actualizarEntregaPorProducto**********");
   console.log("*******DispensacionHcModel.prototype.actualizarEntregaPorProducto**********");
   
    /* var sql = "UPDATE hc_formulacion_antecedentes \
                SET numero_total_entregas = (SELECT max(ceiling(ceiling(fecha_finalizacion - fecha_registro)/30)) \n\
                FROM hc_formulacion_antecedentes WHERE evolucion_id = :1 AND codigo_medicamento = :2)\
                WHERE evolucion_id = :1 AND codigo_medicamento = :2;";
 
    var query = G.knex.raw(sql,{1: obj.evolucion_id, 2: obj.codigo_medicamento });    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){  
            callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [actualizarEntregaPorProducto]: ", err);     
        callback({err:err, msj: "Error actualizarEntregaPorProducto"});
    }); */
    var columna = [G.knex.raw('max(ceiling(ceiling(fecha_finalizacion - fecha_registro)/30))')];
     
    var queryNumeroEntrega = G.knex.column(columna)
     .select()
     .from('hc_formulacion_antecedentes')
     .where({evolucion_id:obj.evolucion_id,codigo_medicamento: obj.codigo_medicamento});
      
    var query = G.knex('hc_formulacion_antecedentes')
        .where({evolucion_id: obj.evolucion_id,codigo_medicamento: obj.codigo_medicamento })              
        .update({numero_total_entregas: queryNumeroEntrega});
                   
    if(transaccion) 
        query.transacting(transaccion).then(function(resultado) {    
             //console.log(" [actualizarEntregaPorProducto]: ", resultado);  
            callback(false, resultado);
        }).catch (function(err) {
            callback({err:err, msj: "Error actualizarEntregaPorProducto"});
             
        });
};





/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de actualizar la fecha pendiente con hora y minutos 
 *              de los medicamentos que quedaran en estado pendiente
 * @fecha 28/11/2016 (DD-MM-YYYY)
 */
DispensacionHcModel.prototype.actualizarFechaPendientePorDispensar = function(obj, transaccion, callback) {
    console.log("*****DispensacionHcModel.prototype.actualizarFechaPendientePorDispensar***********");
    console.log("*****DispensacionHcModel.prototype.actualizarFechaPendientePorDispensar***********");
    console.log("*****DispensacionHcModel.prototype.actualizarFechaPendientePorDispensar***********");
    
    /*var sql = "UPDATE hc_pendientes_por_dispensar\
                SET fecha_pendiente = fecha_registro\
                WHERE evolucion_id = :1;";
   
    var query = G.knex.raw(sql,{1: obj.evolucionId});    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){  

        callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [actualizarFechaPendientePorDispensar]: ", err);     
        callback({err:err, msj: "Error actualizarFechaPendientePorDispensar"});
    }); */
   
    var query = G.knex('hc_pendientes_por_dispensar')
            .where('evolucion_id', obj.evolucionId)
            .update({fecha_pendiente: G.knex.raw('fecha_registro')});
    
    if(transaccion) 
        query.transacting(transaccion).then(function(resultado) {
            //console.log("resultado [actualizarFechaPendientePorDispensar]: ", resultado);
            callback(false, resultado);
        }). catch (function(error) {
            console.log("error [actualizarFechaPendientePorDispensar]: ", error);
            callback(error);
        });
};

                
/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de actualizar la fecha minima la fecha maxima
 *              y la fecha de entrega de la formula que se almacenara en la
 *              tabla dispensacion_estados
 * @fecha 28/11/2016 (DD-MM-YYYY)
 */
DispensacionHcModel.prototype.actualizarFechaMinimaMaxima = function(obj, callback) {
 
 console.log("***********DispensacionHcModel.prototype.actualizarFechaMinimaMaxima *****************");
 console.log("***********DispensacionHcModel.prototype.actualizarFechaMinimaMaxima *****************");
 console.log("***********DispensacionHcModel.prototype.actualizarFechaMinimaMaxima *****************");
 
  var parametros;
   if(obj.numeroEntrega === 0){
       parametros = {
                fecha_entrega: obj.fechaEntrega,
                fecha_minima_entrega: obj.fechaMinima,
                fecha_maxima_entrega: obj.fechaMaxima,
            };
   }else{
       parametros = {
                fecha_entrega: obj.fechaEntrega,
                fecha_minima_entrega: obj.fechaMinima,
                fecha_maxima_entrega: obj.fechaMaxima,
                numero_entrega_actual: obj.numeroEntrega
            };
   }
    console.log("parametros ", parametros);
    var query = G.knex('dispensacion_estados')
            .where('evolucion_id', obj.evolucionId)
            .update(parametros);
    
    
    query.then(function(resultado){  

        callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [actualizarFechaMinimaMaxima]: ", err);      
        callback({err:err, msj: "Error actualizarFechaMinimaMaxima"});
    }); 
};


DispensacionHcModel.$inject = [];


module.exports = DispensacionHcModel;