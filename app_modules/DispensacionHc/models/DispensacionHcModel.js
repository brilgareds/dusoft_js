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
        pendienteCondicion = " a.fecha_registro between :1 and :2 AND a.sw_estado = '0'";
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
       
        sqlCondicion = " a.fecha_registro between :1 and :2 AND a.tipo_id_paciente = :3 AND a.paciente_id::varchar = :4 ";
        parametros["1"]= obj.fechaInicial;
        parametros["2"]= obj.fechaFinal;
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
                    ) AS a WHERE  " + sqlCondicion + " " + pendienteCondicion; 
              
    var query = G.knex.select(G.knex.raw(sql, parametros)).
    limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).orderBy("a.registro", "desc").then(function(resultado){    
       
        callback(false, resultado);
    }).catch(function(err){    
       
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
    }else{
        condicion=" and fv.codigo_producto = :5 ";
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
 * @fecha: 11/06/2015 09:45 pm 
 */
DispensacionHcModel.prototype.generarDispensacionFormula = function(obj, callback)
{   
    console.log("*******DispensacionHcModel.prototype.generarDispensacionFormula*************");
    console.log("*******DispensacionHcModel.prototype.generarDispensacionFormula*************");
    console.log("*******DispensacionHcModel.prototype.generarDispensacionFormula*************");
    console.log("*******DispensacionHcModel.prototype.generarDispensacionFormula*************");
    
    G.knex.transaction(function(transaccion) {  
        
        G.Q.nfcall(__insertarBodegasDocumentos, obj, transaccion).then(function(resultado){
          
          console.log("resultado 1 ", resultado);
         return G.Q.nfcall(__insertarDespachoMedicamentos, obj, transaccion);

        }).then(function(){
           console.log("INSERTA DESPACHOS MEDICAMENTOS ");
           transaccion.commit();

        }).fail(function(err){
            console.log("err ", err);
           transaccion.rollback(err);

        }).done();

    }).then(function(){

       callback(false);

    }).catch(function(err){
        console.log("catch ", err);
       callback(err);
    }).done(); 
    
};


/*
 * @autor : Cristian Ardila
 * Descripcion : Modelo encargado de insertar el detalle de la dispensacion en
 *               la tabla bodegas_documentos_d a traves de transacciones para que
 *               la existencia de lotes sea consistente al descontarse con la
 *               cantidad dispensada
 * @fecha: 11/06/2015 09:45 pm 
 */
DispensacionHcModel.prototype.insertarBodegasDocumentosDetalle = function(obj,bodegasDocId,numeracion,plan, callback)
{   
    console.log("*******DispensacionHcModel.prototype.insertarBodegasDocumentosDetalle*************");
    
    G.knex.transaction(function(transaccion) {  
        
        G.Q.nfcall(__actualizarExistenciasBodegasLotesFv, obj, transaccion).then(function(resultado){
         
            return G.Q.nfcall(__actualizarExistenciasBodegas, obj, transaccion);

        }).then(function(){

           return G.Q.nfcall(__insertarBodegasDocumentosDetalle,obj,bodegasDocId,numeracion,plan, transaccion);

        }).then(function(){
           console.log("INSERTA DESPACHOS MEDICAMENTOS FIANLIZADO");
           transaccion.commit();

        }).fail(function(err){
            console.log("err ", err);
           transaccion.rollback(err);

        }).done();

    }).then(function(){

       callback(false);

    }).catch(function(err){
        
       callback(err);
    }).done(); 
    
};

function __convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [pad(d.getDate()+1), pad(d.getMonth()+1), d.getFullYear()].join('/');
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
    console.log("*****1)__actualizarExistenciasBodegasLotesFv****");
   
    var parametros = {1: obj.cantidad_despachada, 2: obj.empresa_id,  3: obj.centro_utilidad, 
                      4: obj.bodega , 5:obj.codigo_producto, 6:  __convertDate(obj.fecha_vencimiento), 7: obj.lote};
                  console.log("{parametros: ", parametros);
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
            console.log(" 1) resultado ", resultado)
            callback(false, resultado);
    }).catch(function(err){
             console.log(" 1) err ", err);
            callback(err);   
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
    
    console.log("*****2)__actualizarExistenciasBodegas****");
    
    var parametros = {1: obj.cantidad_despachada, 2: obj.empresa_id,  3: obj.centro_utilidad, 
                      4: obj.bodega , 5:obj.codigo_producto};
                    console.log("{parametros: ", parametros +"}");
    var sql = "UPDATE  existencias_bodegas set     existencia= existencia - :1\
                WHERE   empresa_id = :2 \
                AND  centro_utilidad = :3\
                AND     bodega = :4\
                AND     codigo_producto = :5";

    var query = G.knex.raw(sql,parametros);    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){    
              console.log("2) resultado: ", resultado);
            callback(false, resultado);
    }).catch(function(err){
        console.log("2) err: ", err);
            callback(err);   
    });  
};


/**
 * @author Cristian Ardila
 * +Descripcion Modelo encargado insertar el detalle del pedido en la tabla
 *              de documentos
 * @fecha 11/06/2016
 */
function __insertarBodegasDocumentosDetalle(obj,bodegasDocId,numeracion,plan,transaccion, callback){
    
    console.log("********3)__insertarBodegasDocumentosDetalle************");
   
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
            callback(err);   
    });
};


/*
 * Autor : Cristian Ardila
 * Descripcion : SQL para qye ingresara los productos que quedan pendientes
 *               por dispensar
 * @fecha: 08/06/2015 2:43 pm 
 */
DispensacionHcModel.prototype.insertarPendientesPorDispensar = function(producto,evolucionId,todoPendiente,usuario,callback) {
   
   var parametros = {1: evolucionId, 2: producto.codigo_producto, 3: Math.round(producto.total),
                     4: usuario, 5: todoPendiente, 6: 'now()'};
   console.log("********__insertarPendientesPorDispensar************ ", parametros );
   
    var sql = "INSERT INTO hc_pendientes_por_dispensar\
      (hc_pendiente_dispensacion_id,evolucion_id,codigo_medicamento,cantidad,\
       usuario_id,todo_pendiente,fecha_registro)\
            VALUES( DEFAULT, :1, :2, :3, :4, :5, :6 );";

           
    var query = G.knex.raw(sql,parametros );
    
    query.then(function(resultado){
        console.log("resultado ", resultado);
       callback(false, resultado);
    }).catch(function(err){
     console.log("err ", err);
       callback(err);
    });
   
};

/*
 * Autor : Cristian Ardila
 * Descripcion : SQL encargado de eliminar los productos que ya se han dispensado
 * @fecha: 08/06/2015 2:43 pm 
 */
DispensacionHcModel.prototype.eliminarTemporalesDispensados = function(obj,callback) {
   
   var parametros = {1: obj.evolucionId};
   console.log("********eliminarTemporalesDispensados************ ", parametros );
   
    var sql = "DELETE FROM hc_dispensacion_medicamentos_tmp WHERE  evolucion_id = :1;";

           
    var query = G.knex.raw(sql,parametros );
    
    query.then(function(resultado){
        console.log("resultado ELiminar", resultado);
       callback(false, resultado);
    }).catch(function(err){
     console.log("err ELiminar", err);
       callback(err);
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
                     8: obj.estadoPendiente,9: 'now()'};
                 
    var sql = " INSERT INTO bodegas_documentos(bodegas_doc_id,numeracion,fecha,total_costo,transaccion,observacion,usuario_id,todo_pendiente,fecha_registro)\
                VALUES( :1, :2, :3, :4, :5, :6, :7, :8, :9 );";
    
    var query = G.knex.raw(sql, parametros);
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){           
            callback(false, resultado);
    }).catch(function(err){
            callback(err);   
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
            callback(err);   
    });
}


DispensacionHcModel.$inject = [];


module.exports = DispensacionHcModel;