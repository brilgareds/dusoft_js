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
               
    var query = G.knex.select(G.knex.raw(sql, parametros)).
    limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).orderBy("a.registro", "desc").then(function(resultado){
        
        callback(false, resultado);
    }).catch(function(err){
       console.log("err ", err)
        callback(err);
       
    });
 
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
        console.log("err ", err)
      callback(err)
  });
          
    
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los productos formulados
 * @controller DispensacionHc.prototype.listarMedicamentosFormulados
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
                hc.numero_formula\
                FROM   hc_formulacion_antecedentes hc\
                LEFT JOIN  medicamentos med ON(hc.codigo_medicamento=med.codigo_medicamento)\
                LEFT JOIN inv_med_cod_principios_activos pric ON (med.cod_principio_activo=pric.cod_principio_activo)\
                LEFT JOIN  inventarios_productos invp ON(hc.codigo_medicamento=invp.codigo_producto)\
                JOIN hc_medicamentos_recetados_amb a ON hc.codigo_medicamento = a.codigo_producto AND hc.evolucion_id = a.evolucion_id\
                WHERE hc.evolucion_id = :1 ORDER BY  ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30) ";
   
  G.knex.raw(sql,parametros).then(function(resultado){  
   
      callback(false, resultado)
  }).catch(function(err){     
      
      callback(err)
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
        } else {
           condicion=" and invp.codigo_producto = :1 ";
        } 
       
        var sql =  "SELECT COALESCE(sum(tmp.cantidad_despachada),0) as total,tmp.codigo_formulado\
                    FROM hc_dispensacion_medicamentos_tmp tmp\
                         LEFT JOIN medicamentos med ON(tmp.codigo_formulado=med.codigo_medicamento)\
                         LEFT JOIN inventarios_productos invp ON(tmp.codigo_formulado=invp.codigo_producto)\
                    where tmp.codigo_formulado= :1\
                    and tmp.evolucion_id = :2 "+condicion+" GROUP BY codigo_formulado";
  
        console.log("parametros ", parametros);
  
    
  G.knex.raw(sql,parametros).then(function(resultado){  
      console.log("resultado ", resultado);
      callback(false, resultado)
  }).catch(function(err){     
     
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

      var parametros = {1: obj.empresa, 2: obj.centroUtilidad, 3: obj.bodega, 4: obj.principioActivo, 5: obj.codigoProducto};
    
      var condicion = "";
       if (obj.principioActivo !== "") {

           condicion =" and med.cod_principio_activo =  :4 ";
        } else {

           condicion=" and fv.codigo_producto = :5 ";
        } 
       
        var sql =  " SELECT\
                    invp.contenido_unidad_venta as concentracion,\
                    invsinv.descripcion as molecula,\
                    invmcf.descripcion as forma_farmacologica,\
                    invci.descripcion as laboratorio,\
                    fc_descripcion_producto_alterno(fv.codigo_producto) as producto,\
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
     console.log("cantidadProductoTemporal resultado = ", resultado)
      callback(false, resultado)
  }).catch(function(err){     
        console.log("err cantidadProductoTemporal = ", err)
      callback(err)
  });
          
    
};
//DispensacionHcModel.$inject = ["m_productos"];


module.exports = DispensacionHcModel;