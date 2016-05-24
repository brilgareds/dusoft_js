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
   var pendienteTabla = "";
   var pendienteCondicion = "";
   
   if(obj.estadoFormula === '1'){
       
       pendienteCampoEstado = ",j.sw_estado";
       pendienteTabla = "INNER JOIN HC_PENDIENTES_POR_DISPENSAR j ON (a.evolucion_id=j.evolucion_id)";
       pendienteCondicion = "AND a.sw_estado = '0'";
   }
  
   var parametros = {1: obj.fechaInicial, 2: obj.fechaFinal};
   var sqlCondicion = "";
   var sqlCondicion2 = "";
   
   
   
   if(obj.filtro.tipo === 'FO' && obj.terminoBusqueda !==""){
       sqlCondicion = " AND a.numero_formula::varchar = :3";
       sqlCondicion2  =" WHERE numero_formula::varchar = :3";
       parametros["3"]= obj.terminoBusqueda;
       
   }
   if(obj.filtro.tipo === 'EV' && obj.terminoBusqueda !==""){
       
      sqlCondicion = " AND a.evolucion_id = :3";
      parametros["3"]= obj.terminoBusqueda;
   }
   if(obj.filtro.tipo !== 'EV' && obj.filtro.tipo !== 'FO'){
       
      sqlCondicion = " AND a.tipo_id_paciente = :3 AND a.paciente_id::varchar = :4 ";
      parametros["3"]= obj.filtro.tipo;
      parametros["4"]= obj.terminoBusqueda;
     
   }
   
  /* console.log("obj parametros ==== ", obj);
   console.log("parametros ==== ", parametros);
   console.log("sqlCondicion ==== ", sqlCondicion);
   console.log("Termino de busqueda ==== ", obj.terminoBusqueda);*/
   
    var sql = "* FROM (\
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
                    ) AS a WHERE a.fecha_registro between :1 and :2 " + sqlCondicion + " " + pendienteCondicion; 
                         
  

   /*console.log(" -------------------------------------- ");
   console.log(" sql ", sql);
   console.log(" -------------------------------------- ");*/
     
    var query = G.knex.select(G.knex.raw(sql, parametros)).
    limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).orderBy("a.registro", "desc").then(function(resultado){
        console.log("resultado ==== ", resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("err ", err)
        callback(err);
       
    });

 /* G.knex.raw(sql,parametros).then(function(resultado){  
    
      callback(false, resultado.rows)
      console.log("resultado ", resultado.rows)
  }).catch(function(err){     
        console.log("err ", err)
      callback(err)
  });*/
          
    
};



/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de los tipos de documentos
 * @controller DispensacionHc.prototype.listarTipoDocumento
 */
DispensacionHcModel.prototype.listarTipoDocumento = function(callback){
    
      var sql = "SELECT tipo_id_tercero, descripcion\
                 FROM tipo_id_terceros\
                 ORDER BY  tipo_id_tercero ";
  
  G.knex.raw(sql).then(function(resultado){  
    
      callback(false, resultado.rows)
  }).catch(function(err){     
        console.log("err ", err)
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
    
      callback(false, resultado.rows)
  }).catch(function(err){     
        console.log("err ", err)
      callback(err)
  });
          
    
};
//DispensacionHcModel.$inject = ["m_productos"];


module.exports = DispensacionHcModel;