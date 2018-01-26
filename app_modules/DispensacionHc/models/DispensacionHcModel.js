var DispensacionHcModel = function() {};
 
/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de consultar la evolucion de una formula
 * @controller DispensacionHc.prototype.insertarFormulasDispensacionEstados
 */
DispensacionHcModel.prototype.consultarEvolucionFormula = function(obj,callback){
   
    var query = G.knex.distinct('evolucion_id')
            .select()   
            .from('hc_formulacion_antecedentes')
            .where(function() {                   
                if((obj.filtro.tipo === '0'  ||
                    obj.filtro.tipo === '1'  ||
                    obj.filtro.tipo === '2'  ||
                    obj.filtro.tipo === '3') && obj.terminoBusqueda !=="" ){
                        this.where(G.knex.raw("transcripcion_medica = " + obj.filtro.tipo))
                        .andWhere(G.knex.raw("numero_formula::varchar = " + obj.terminoBusqueda));
                }                    
            });
           
    query.then(function(resultado){              
        callback(false, resultado)
    }).catch(function(err){    
        console.log("err [consultarEvolucionFormula]:", err);
        callback(err);
    });
    
};
 
 
/**                          
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado de obtener los diferentes tipos de formula
 * @controller DispensacionHc.prototype.listarTipoFormula
 */
DispensacionHcModel.prototype.consultarNumeroFormula = function(obj,callback){
     
    var columna = [G.knex.raw("formula_id"),  
                   G.knex.raw(" CASE WHEN b.tipo_formula is null THEN '0' ELSE '1' END as tipo_formula")];
     
    G.knex.select(columna)
        .from("dispensacion_estados AS a")
        .innerJoin("hc_evoluciones AS b", 
            function() {
                this.on("a.evolucion_id", "b.evolucion_id")
        })
        .where("a.evolucion_id", obj.evolucionId) 
        .then(function(resultado) {
            callback(false, resultado);
        }). catch (function(error) {
            console.log("err[consultarNumeroFormula]: ", error);
            callback(error);
        });
    
}; 
  
/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Metodo que calcula el intervalo de fecha para calcular las entregas 
 *              de una formula
 */
DispensacionHcModel.prototype.intervalo_fecha = function(parametros, callback)
{
    var sql = "select to_char(fecha, 'yyyy-mm-dd')as fecha\
               from \
	       (SELECT CAST('"+parametros.fecha+"' AS DATE) "+parametros.operacion+" CAST('"+parametros.dias+" days' AS INTERVAL) as fecha)as d;";
 
    G.knex.raw(sql).then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        console.log("error intervalo_Fecha_formula ",err);
        callback(err);
    });

};
 
/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de obtener todas las formulas segun el criterio
 *              de busqueda
 * @controller DispensacionHc.prototype.listarFormulas
 */
DispensacionHcModel.prototype.listarFormulas = function(obj, callback){
     
    var colSubQuery = [G.knex.raw(" DISTINCT '0' AS tipo_formula"),
        "a.tipo_formula as transcripcion_medica",
        G.knex.raw("CASE WHEN (a.tipo_formula='0' or a.tipo_formula ='2') THEN 'FORMULACION' ELSE 'TRANSCRIPCION' END AS descripcion_tipo_formula"),
        G.knex.raw("TO_CHAR(a.fecha_registro,'YYYY-MM-DD') AS fecha_registro"),
        "a.tipo_id_paciente",
        "a.paciente_id",
        G.knex.raw("TO_CHAR(a.fecha_registro,'YYYY-MM-DD') AS registro"),
        G.knex.raw("CURRENT_DATE as hoy"),
        "a.sw_refrendar as refrendar",
        "a.evolucion_id",
        G.knex.raw("coalesce(a.formula_id, 0) AS numero_formula"),
        G.knex.raw("edad(b.fecha_nacimiento) as edad"),
        "b.sexo_id",
        G.knex.raw("b.primer_apellido ||' '||b.segundo_apellido AS apellidos"),
        G.knex.raw("b.primer_nombre||' '||b.segundo_nombre AS nombres"),
        "b.residencia_telefono",
        "b.residencia_direccion",
        G.knex.raw("'1' as sw_entrega_med"),
        G.knex.raw("TO_CHAR(a.fecha_finalizacion,'YYYY-MM-DD') as fecha_finalizacion"),
        G.knex.raw("TO_CHAR(a.fecha_registro,'YYYY-MM-DD') as fecha_formulacion"),
        "e.nombre_medico as nombre",
        "a.numero_entrega_actual",
        "a.numero_total_entregas",
        G.knex.raw("TO_CHAR(a.fecha_entrega,'YYYY-MM-DD') as fecha_entrega"),
        "f.tipo_bloqueo_id",
        "f.descripcion AS bloqueo",
        G.knex.raw("COALESCE(i.plan_id,0) as plan_id"),
        "i.plan_descripcion",
        "a.sw_finalizado",
        "a.numero_total_entregas",
        "a.numero_entrega_actual",
        G.knex.raw("CASE WHEN (\
                                SELECT count(distinct(usuario_id)) as usuario_id \
                                FROM hc_dispensacion_medicamentos_tmp \
                                WHERE evolucion_id = a.evolucion_id) = 1 THEN (\n\
                            CASE WHEN (\
                                SELECT count(distinct(usuario_id)) as usuario_id \
                                FROM hc_dispensacion_medicamentos_tmp \n\
                                WHERE evolucion_id = a.evolucion_id and usuario_id = "+ obj.usuarioId +") = 1 THEN '0' \n\
                                ELSE '1' END ) \n\
                        WHEN (\
                                SELECT count(distinct(usuario_id)) as usuario_id \
                                FROM hc_dispensacion_medicamentos_tmp \
                                WHERE evolucion_id = a.evolucion_id) = 0 THEN '0' END AS formula_en_proceso"),
        G.knex.raw("CASE WHEN (\
                                SELECT count(distinct(usuario_id)) as usuario_id \
                                FROM hc_dispensacion_medicamentos_tmp \
                                WHERE evolucion_id = a.evolucion_id) = 1 THEN (\
                    CASE WHEN (\
                                SELECT count(distinct(usuario_id)) as usuario_id \
                                FROM hc_dispensacion_medicamentos_tmp \n\
                                WHERE evolucion_id = a.evolucion_id and usuario_id = "+ obj.usuarioId +") = 1 THEN (\
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
         END ) ELSE '5' END ) \n\
        WHEN (\
                SELECT count(distinct(usuario_id)) as usuario_id \
                FROM hc_dispensacion_medicamentos_tmp \n\
                WHERE evolucion_id = a.evolucion_id) = 0 THEN (\
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
        END ) END  AS estado_entrega"),
         
        G.knex.raw("CASE WHEN (\
                                SELECT count(distinct(usuario_id)) as usuario_id \
                                FROM hc_dispensacion_medicamentos_tmp \
                                WHERE evolucion_id = a.evolucion_id) = 1 THEN ( \n\
                    CASE WHEN (\
                                SELECT count(distinct(usuario_id)) as usuario_id \
                                FROM hc_dispensacion_medicamentos_tmp \n\
                                WHERE evolucion_id = a.evolucion_id and usuario_id = "+obj.usuarioId +") = 1 THEN (\
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
                    WHEN a.sw_pendiente = '0' OR a.sw_pendiente is NULL THEN 'Tto finalizo' \
                    WHEN a.sw_pendiente = '1' THEN 'Tratamiento finalizado' \
                    WHEN a.sw_pendiente = '2' THEN 'Todo pendiente' END\
                ) \
        END ) ELSE (SELECT nombre FROM system_usuarios WHERE usuario_id = (\
                                SELECT distinct(usuario_id) as usuario_id \
                                FROM hc_dispensacion_medicamentos_tmp \n\
                                WHERE evolucion_id = a.evolucion_id )) END )\n\
         WHEN (\
                SELECT count(distinct(usuario_id)) as usuario_id \
                FROM hc_dispensacion_medicamentos_tmp \n\
                WHERE evolucion_id = a.evolucion_id) = 0 THEN (\n\
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
                    WHEN a.sw_pendiente = '0' OR a.sw_pendiente is NULL THEN 'Tto finalizo' \
                    WHEN a.sw_pendiente = '1' THEN 'Tto finalizo' \
                    WHEN a.sw_pendiente = '2' THEN 'Todo pendiente' END\
                ) \
        END ) END  AS descripcion_estado_entrega"),

        "a.sw_pendiente as sw_estado"
    ];
    var subQuery = G.knex.select(colSubQuery)
                .from("dispensacion_estados AS a")
                .innerJoin("pacientes AS b", 
                        function() {
                            this.on("a.tipo_id_paciente", "b.tipo_id_paciente")
                                .on("a.paciente_id", "b.paciente_id")

                }).leftJoin("inv_tipos_bloqueos AS f", 
                        function() {
                            this.on("b.tipo_bloqueo_id", "f.tipo_bloqueo_id")
                                .on(G.knex.raw("f.estado='1'"))

                }).leftJoin("medico_formula AS e", 
                        function(){
                            this.on("a.medico_id", "e.tercero_id")
                                .on("a.evolucion_id", "e.evolucion_id");
                }).innerJoin("eps_afiliados AS g", 
                        function(){
                            this.on("g.afiliado_tipo_id","b.tipo_id_paciente")
                                .on("g.afiliado_id","b.paciente_id")
                }).join("planes_rangos AS h", 
                        function(){
                            this.on("g.plan_atencion","h.plan_id")
                                .on("g.tipo_afiliado_atencion","h.tipo_afiliado_id")
                                .on("g.rango_afiliado_atencion","h.rango")
                }).innerJoin("planes AS i", 
                        function(){
                            this.on("h.plan_id","i.plan_id")
                }).as("a")
                        
    var query =  G.knex(subQuery)
        .where(function() {

            if(obj.fechaInicial !=="" && obj.fechaFinal !=="" && obj.terminoBusqueda ==="" || obj.terminoBusqueda ===""){
                this.andWhere(G.knex.raw("a.fecha_registro between '"+ obj.fechaInicial + "' and '"+ obj.fechaFinal +"'"));
            }

            if((obj.filtro.tipo === '0'  ||
                obj.filtro.tipo === '1'  ||
                obj.filtro.tipo === '2'  ||
                obj.filtro.tipo === '3') && obj.terminoBusqueda !=="" ){

                    this.andWhere(G.knex.raw("a.numero_formula::varchar = " + obj.terminoBusqueda))
                    .andWhere(G.knex.raw("a.transcripcion_medica = " + obj.filtro.tipo));                       
           }

           if(obj.filtro.tipo === 'EV' && obj.terminoBusqueda !==""){
                this.andWhere("a.evolucion_id",obj.terminoBusqueda)

           }
                   
            if(obj.filtro.tipo !== 'EV' && !(obj.filtro.tipo === '0'  ||
                obj.filtro.tipo === '1'  ||
                obj.filtro.tipo === '2'  ||
                obj.filtro.tipo === '3') 
                    ){
                    this.andWhere(G.knex.raw("a.fecha_registro between '"+ obj.fechaInicial + "' and '"+ obj.fechaFinal +"'"))
                        .andWhere("a.tipo_id_paciente ",obj.filtro.tipo)
                        .andWhere(G.knex.raw("a.paciente_id::varchar = " + obj.terminoBusqueda));
            }
        });
                
    query.limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).then(function(resultado){   
        callback(false, resultado);
    }).catch(function(err){    
        console.log("err [listarFormulas]: ", err);
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
       
    var columnas = ["dd.codigo_producto",
                    G.knex.raw("round(dd.cantidad) as numero_unidades"),
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

      callback(false, resultado);
    }).catch(function(err){         
         console.log("err [listarMedicamentosPendientesDispensados]: ", err);
      callback(err);
    });            
};
 

/**
 * @author Cristian Ardila
 * @fecha 09/06/2016 (DD-MM-YYYY)
 * +Descripcion Modelo encargado de obtener la ultima dispensacion de la formula
 *              sea normal o pendientes
 * @controller DispensacionHc.prototype.
 */
DispensacionHcModel.prototype.listarUltimaDispensacionFormula = function(obj,callback){
    
    var colQueryTodo = [
       "todo.codigo_producto",    
       "todo.numero_unidades",   
       "todo.fecha_vencimiento AS fecha_vencimiento",     
       "todo.lote",      
       "todo.descripcion_prod",   
       G.knex.raw("fc_descripcion_producto_alterno(todo.codigo_producto) as molecula"),   
       "todo.usuario_id",     
       "todo.nombre",    
       "todo.descripcion",   
       "todo.sw_pactado",    
       "todo.total_costo",   
       "todo.fecha",     
       "todo.entrega",   
       G.knex.raw("'hc_dispensaciontodo' as sistema"),  
       "todo.dias_de_entregado",   
       "todo.fecha_entrega as fecha_entrega",    
       "todo.grupo_id", 
       "todo.tipo_entrega"
   ];
    
    var colSubQuery = ["k.codigo_producto",    
               "k.numero_unidades",    
               G.knex.raw("TO_CHAR(k.fecha_vencimiento,'YYYY-MM-DD')AS fecha_vencimiento"),     
               "k.lote",      
               "k.descripcion_prod",     
               G.knex.raw("fc_descripcion_producto_alterno(k.codigo_producto) as molecula"),    
               "k.usuario_id",     
               "k.nombre",    
               "k.descripcion",    
               "k.sw_pactado",    
               "k.total_costo",    
               "k.fecha",     
               "k.grupo_id",    
               "k.numero_entrega_actual as entrega",    
               "k.sistema",     
               "k.dias_de_entregado",   
               "k.fecha_entrega as fecha_entrega", 
               "k.tipo_entrega"
           ]
    
    var colSubQueryA = ["dd.codigo_producto",  
                       "dd.cantidad as numero_unidades",   
                       "dd.fecha_vencimiento",     
                       "dd.lote",     
                       "dd.sw_pactado",    
                       "dd.total_costo",    
                       G.knex.raw("fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod"),     
                       "sys.usuario_id",     
                       "sys.nombre",    
                       "sys.descripcion",  
                       G.knex.raw("'dispensacion_hc' as sistema"),     
                       G.knex.raw("d.fecha_registro as fecha_entrega"),     
                       G.knex.raw("to_char(now()- d.fecha_registro,'dd') as dias_de_entregado"),     
                       G.knex.raw("(SELECT min(hcf.fecha_formulacion) FROM hc_formulacion_antecedentes hcf  WHERE hcf.evolucion_id = "+obj.evolucionId + ")as fecha"),                             
                       "d.fecha_registro",    
                       "inv.grupo_id",    
                       "d.numero_entrega_actual", 
                      G.knex.raw("'1' as tipo_entrega")
                   ]
    var colSubQueryB = ["dd.codigo_producto",  
                       "dd.cantidad as numero_unidades",   
                       "dd.fecha_vencimiento",     
                       "dd.lote",     
                       "dd.sw_pactado",    
                       "dd.total_costo",    
                       G.knex.raw("fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod"),     
                       "sys.usuario_id",     
                       "sys.nombre",    
                       "sys.descripcion",  
                       G.knex.raw("'dispensacion_hc' as sistema"),     
                       G.knex.raw("d.fecha_registro as fecha_entrega"),     
                       G.knex.raw("to_char(now()- d.fecha_registro,'dd') as dias_de_entregado"),     
                       G.knex.raw("(SELECT min(hcf.fecha_formulacion) FROM hc_formulacion_antecedentes hcf  WHERE hcf.evolucion_id = "+obj.evolucionId + ")as fecha"),                             
                       "d.fecha_registro",    
                       "inv.grupo_id",    
                       "d.numero_entrega_actual", 
                      G.knex.raw("'0' as tipo_entrega")
                   ]
     
    var colSubQueryD = ["dd.codigo_producto",    
                        "dd.cantidad as cantidad_entrega",    
                        "dd.fecha_vencimiento",    
                        "dd.lote",    
                        G.knex.raw("fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod"),    
                        "dd.sw_pactado",    
                        G.knex.raw("fc_descripcion_producto_molecula(dd.codigo_producto) as molecula"),    
                        "dd.total_costo",    
                        G.knex.raw("'1' as pendiente_dispensado"),    
                        G.knex.raw("(select fecha_registro as fecha_entrega from hc_pendientes_por_dispensar  AS e where e.evolucion_id  = "+obj.evolucionId + " and sw_estado='1' limit 1) as fecha_pendiente"),   
                        "d.usuario_id",   
                        "sys.nombre",    
                        "sys.descripcion",   
                        G.knex.raw("'dispensacion_hc' as sistema"),   
                        "d.fecha_registro as fecha_entrega",    
                        G.knex.raw("to_char(now()- d.fecha_registro,'dd') as dias_de_entregado"),   
                        G.knex.raw("(SELECT min(hcf.fecha_registro) FROM dispensacion_estados hcf WHERE hcf.evolucion_id = "+obj.evolucionId + " )as fecha"),                        
                        "d.fecha_registro",    
                        "inv.grupo_id",    
                        "d.numero_entrega_actual"
                    ]
    
    var colSubQueryC = [
       "a.codigo_producto",    
       "a.cantidad_entrega as numero_unidades",   
       G.knex.raw("TO_CHAR(a.fecha_vencimiento,'YYYY-MM-DD')AS fecha_vencimiento"),     
       "a.lote",      
       "a.descripcion_prod",   
       G.knex.raw("fc_descripcion_producto_alterno(a.codigo_producto) as molecula") , 
       "a.usuario_id",     
       "a.nombre",    
       "a.descripcion",   
       "a.sw_pactado",    
       "a.total_costo",  
       "a.fecha",      
       "a.numero_entrega_actual as entrega",   
       G.knex.raw("'hc_dispensaciontodo' as sistema"),  
       "a.dias_de_entregado",   
       "a.fecha_entrega as fecha_entrega",    
       "a.grupo_id", 
       G.knex.raw("'1' as tipo_entrega")
    ];
    
    var subQueryD = G.knex.select(colSubQueryD)
        .from("hc_formulacion_despachos_medicamentos_pendientes as tmp")                 
        .innerJoin("bodegas_documentos AS d", function(){
            this.on("tmp.bodegas_doc_id", "d.bodegas_doc_id")
            .on("tmp.numeracion","d.numeracion")
        })
         .innerJoin("bodegas_documentos_d AS dd", function(){
             this.on("d.bodegas_doc_id","dd.bodegas_doc_id")
             .on("d.numeracion","dd.numeracion")
        })                           
        .innerJoin("system_usuarios AS sys", function(){
             this.on("d.usuario_id","sys.usuario_id")
        })
        .innerJoin("inventarios_productos AS inv", function(){
             this.on("dd.codigo_producto","inv.codigo_producto")   
        })
        .where(function(){
             this.where("tmp.evolucion_id",obj.evolucionId)
             .andWhere(G.knex.raw("d.todo_pendiente != 1"))

        }).as("a");
   
    
    var subQueryAUnionB = G.knex.select(colSubQueryA)
        .from("hc_formulacion_despachos_medicamentos_pendientes as hc")                 
        .innerJoin("bodegas_documentos AS d", function(){
            this.on("hc.bodegas_doc_id", "d.bodegas_doc_id")
            .on("hc.numeracion","d.numeracion")
        })
         .innerJoin("bodegas_documentos_d AS dd", function(){
             this.on("d.bodegas_doc_id","dd.bodegas_doc_id")
             .on("d.numeracion","dd.numeracion")
         })                           
         .innerJoin("system_usuarios AS sys", function(){
             this.on("d.usuario_id","sys.usuario_id")
         })
         .innerJoin("inventarios_productos AS inv", function(){
             this.on("dd.codigo_producto","inv.codigo_producto")   
         })
         .where(function(){
             this.where("hc.evolucion_id",obj.evolucionId)
             .andWhere("d.todo_pendiente", '1')
         })
         .union(function(){
              this.select(colSubQueryB)
            .from("hc_formulacion_despachos_medicamentos as hc")                 
            .innerJoin("bodegas_documentos AS d", function(){
                this.on("hc.bodegas_doc_id", "d.bodegas_doc_id")
                .on("hc.numeracion","d.numeracion")
            })
             .innerJoin("bodegas_documentos_d AS dd", function(){
                 this.on("d.bodegas_doc_id","dd.bodegas_doc_id")
                 .on("d.numeracion","dd.numeracion")
            })                           
             .innerJoin("system_usuarios AS sys", function(){
                 this.on("d.usuario_id","sys.usuario_id")
            })
             .innerJoin("inventarios_productos AS inv", function(){
                 this.on("dd.codigo_producto","inv.codigo_producto")   
            })
            .where(function(){
                this.where("hc.evolucion_id",obj.evolucionId)                              
            });
        }).as("k") 
         
    var subQueryB = G.knex.column(colSubQuery).from(subQueryAUnionB).as("todo")
    
    var subQuery = G.knex.column(colQueryTodo)
        .from(subQueryB)
        .where(G.knex.raw("todo.entrega = (SELECT max(numero_entrega_actual) from dispensacion_estados where evolucion_id = "+obj.evolucionId+" )"))
        .union(function(){
            this.select(colSubQueryC)
            .from(subQueryD)
            .where("a.fecha_entrega",G.knex.select(G.knex.raw("distinct(max(d2.fecha_registro))"))                               
            .from("hc_formulacion_despachos_medicamentos_pendientes AS tmp2")
            .innerJoin("bodegas_documentos AS d2", function(){
                this.on("tmp2.bodegas_doc_id","d2.bodegas_doc_id")
                .on("tmp2.numeracion","d2.numeracion")
            })
            .where("tmp2.evolucion_id",obj.evolucionId)
            .andWhere(G.knex.raw("d2.todo_pendiente != 1"))
               )
        }).as("entrega")    
  
    var colQuery = ["entrega.codigo_producto",    
       G.knex.raw("round(entrega.numero_unidades)as numero_unidades"),   
       "entrega.fecha_vencimiento",  
       "entrega.lote",      
       "entrega.descripcion_prod",   
       "entrega.molecula",   
       "entrega.usuario_id",     
       "entrega.nombre",    
       "entrega.descripcion",   
       "entrega.sw_pactado",    
       "entrega.total_costo",   
       "entrega.fecha",     
       G.knex.raw("case when entrega.entrega = 0 then 'Pendientes'  \
            else ' No.'||entrega.entrega  \
            end as entrega"),  
       "entrega.sistema",   
       "entrega.dias_de_entregado",   
       G.knex.raw("to_char(entrega.fecha_entrega, 'YYYY-DD-MM')as fecha_entrega"),    
        "entrega.grupo_id", 
        "entrega.tipo_entrega"
    ]
    var query = G.knex.column(colQuery)
        .from(subQuery)
        .where(G.knex.raw("entrega.fecha_entrega ilike '%'||(SELECT fecha_ultima_entrega FROM dispensacion_estados WHERE evolucion_id = "+obj.evolucionId+")||'%'"));
                        
        query.then(function(resultado){           
            callback(false, resultado);     
        }).catch(function(err){        
            console.log(" err [listarUltimaDispensacionFormula]: ", err);
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
     
    var colQuery = [G.knex.raw("TO_CHAR(k.fecha_registro,'YYYY-MM-DD') AS fecha_registro"),  
       "k.fecha",  
       G.knex.raw("cast(k.numero_entrega_actual as text) as Entrega"),  
       "k.codigo_producto",  
       G.knex.raw("round(k.numero_unidades) as numero_unidades"),  
       G.knex.raw("TO_CHAR(k.fecha_vencimiento,'YYYY-MM-DD') AS fecha_vencimiento"),  
       "k.lote",  
       "k.descripcion_prod",  
       "k.usuario_id",  
       "k.sistema",  
       "k.dias_de_entregado",  
       "k.fecha_entrega as fecha_entrega" ];
    
    var colSubQueryB =["dd.codigo_producto",  
        "dd.cantidad as numero_unidades",  
        "dd.fecha_vencimiento",  
        "dd.lote",  
        G.knex.raw("fc_descripcion_producto_alterno(dd.codigo_producto) as descripcion_prod"),  
        "d.usuario_id",  
        G.knex.raw("'dispensacion_hc' as sistema"),  
        G.knex.raw("to_char(d.fecha_registro,'YYYY-mm-dd') as fecha_entrega"),  
        G.knex.raw("to_char(now()- d.fecha_registro,'dd') as dias_de_entregado"),
       G.knex.raw("(\
        SELECT min(fecha_formulacion) \
        FROM hc_formulacion_antecedentes \
        WHERE evolucion_id ="+obj.evolucionId+" \
        )as fecha"),
        "d.fecha_registro",
        "d.numero_entrega_actual"]
    
     var subQueryB = G.knex.select(colSubQueryB).from("hc_formulacion_despachos_medicamentos_pendientes AS hc")
        .innerJoin("bodegas_documentos AS d", function(){
            this.on("hc.bodegas_doc_id","d.bodegas_doc_id")
            this.on("hc.numeracion","d.numeracion")
        }).innerJoin("bodegas_documentos_d AS dd", function(){
            this.on("dd.bodegas_doc_id","d.bodegas_doc_id")
            this.on("dd.numeracion","d.numeracion")
        }).where("hc.evolucion_id", obj.evolucionId)
          .andWhere("d.todo_pendiente",'1')
          .union(function(){
            this.select(colSubQueryB).from("hc_formulacion_despachos_medicamentos AS hc")
                .innerJoin("bodegas_documentos AS d", function(){
                    this.on("hc.bodegas_doc_id","d.bodegas_doc_id")
                    this.on("hc.numeracion","d.numeracion")
              }).innerJoin("bodegas_documentos_d AS dd", function(){
                    this.on("dd.bodegas_doc_id","d.bodegas_doc_id")
                    this.on("dd.numeracion","d.numeracion")
              }).where("hc.evolucion_id", obj.evolucionId)

        }).as("k").orderBy("fecha_entrega","asc")
    
    var query = G.knex.select(colQuery).from(subQueryB);
        query.then(function(resultado){    

            callback(false, resultado)
        }).catch(function(err){        
            console.log("err [listarTodoMedicamentosDispensados] ", err);
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
  
    var colQuery = [G.knex.raw("DISTINCT hp.CODIGO_MEDICAMENTO"),
        "hf.numero_formula",
            "hp.evolucion_id",
        G.knex.raw("(p.primer_apellido||' '||p.segundo_apellido) AS NOMBRES"),
        G.knex.raw("(p.primer_nombre||' '||p.segundo_nombre) AS  APELLIDOS"),
        "p.tipo_id_paciente",
        "p.paciente_id",
        G.knex.raw("edad(p.fecha_nacimiento) AS EDAD"),
        G.knex.raw("(CASE WHEN p.sexo_id='F' THEN 'FEMENINO' WHEN p.sexo_id='M' THEN 'MASCULINO' END)AS  SEXO"),
        "p.residencia_direccion",
        "p.residencia_telefono",
        "hp.codigo_medicamento",
        G.knex.raw("FC_DESCRIPCION_PRODUCTO_ALTERNO(hp.codigo_medicamento) AS DESCRIPCION"),
        "hp.cantidad",
        "hp.hc_pendiente_dispensacion_id"
    ];
      
    var query = G.knex.select(colQuery)
        .from("hc_pendientes_por_dispensar AS hp")
        .innerJoin("hc_formulacion_antecedentes AS hf", 
            function() {
                this.on("hf.evolucion_id", "hp.evolucion_id")
                    .on(G.knex.raw("hp.sw_estado = '0'"))
        })
        .innerJoin("pacientes AS p", 
            function() {
                this.on("p.tipo_id_paciente", "hf.tipo_id_paciente")
                    .on("p.paciente_id", "hf.paciente_id")

        })
        .where(function() {
            this.where("hp.sw_estado", '0');

            if(obj.fechaInicial !=="" && obj.fechaFinal !=="" && obj.terminoBusqueda ==="" || obj.terminoBusqueda ===""){
                this.andWhere(G.knex.raw("hp.fecha_registro between '"+ obj.fechaInicial + "' and '"+ obj.fechaFinal +"'"));
            }

            if((obj.filtro.tipo === '0'  ||
                obj.filtro.tipo === '1'  ||
                obj.filtro.tipo === '2'  ||
                obj.filtro.tipo === '3') && obj.terminoBusqueda !=="" ){
 
                this.andWhere(G.knex.raw("hf.numero_formula::varchar = " + obj.terminoBusqueda))
                    .andWhere(G.knex.raw("hf.transcripcion_medica = " + obj.filtro.tipo));

            }

            if(obj.filtro.tipo === 'EV' && obj.terminoBusqueda !==""){
                this.andWhere("hf.evolucion_id",obj.terminoBusqueda)
            }
                   
            if(obj.filtro.tipo !== 'EV' && !(obj.filtro.tipo === '0'  ||
                obj.filtro.tipo === '1'  ||
                obj.filtro.tipo === '2'  ||
                obj.filtro.tipo === '3')//obj.filtro.tipo !== 'FO' 
                    ){
                    this.andWhere("hf.tipo_id_paciente ",obj.filtro.tipo)
                        .andWhere(G.knex.raw("hf.paciente_id::varchar = " + obj.terminoBusqueda));

            }
                  
        });
               
            
    query.limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).then(function(resultado){          
        callback(false, resultado);
    }).catch(function(err){    
        console.log("err [listarFormulasPendientes]: ", err)
        callback("Ha ocurrido un error listando las formulas pendientes");      
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
       
    var colSubQuery = ["hc.codigo_medicamento",
        G.knex.raw("ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30)  as numero_entregas"),
        G.knex.raw("(hc.fecha_finalizacion - hc.fecha_registro)  as diferencia_final_inicio"),
        "hc.fecha_registro",
        "hc.fecha_finalizacion",
        "hc.dosis",
        "hc.unidad_dosificacion",
        "hc.frecuencia",
        "hc.tiempo_total",
        "hc.perioricidad_entrega",
        "hc.descripcion",
        "hc.tiempo_perioricidad_entrega",
        "hc.unidad_perioricidad_entrega",
        G.knex.raw("round(hc.cantidad) as cantidad"),
        G.knex.raw("round(a.cantidad) as  cantidad_entrega"),
        "hc.fecha_modificacion",
        "pric.descripcion as principio_activo",
        "pric.cod_principio_activo",
        G.knex.raw("fc_descripcion_producto_alterno(hc.codigo_medicamento) as descripcion_prod"),
        "hc.sw_autorizado",
        "hc.tipo_id_paciente",
        "hc.paciente_id",
        G.knex.raw("TO_CHAR(hc.fecha_formulacion,'YYYY-MM-DD') AS fecha_formulacion"),
        "refrendar",
        "hc.numero_formula",
        "invp.cod_forma_farmacologica",
        G.knex.raw("CASE WHEN (  \
            SELECT sum(tmp.cantidad_despachada) FROM hc_dispensacion_medicamentos_tmp tmp  \
            WHERE tmp.evolucion_id = hc.evolucion_id AND tmp.codigo_formulado = hc.codigo_medicamento   \
            GROUP BY tmp.codigo_formulado   \
            ) = a.cantidad THEN '1' ELSE '0' END  AS sw_seleccionar_tmp")
    ];
    
    var subQuery = G.knex.select(colSubQuery)
        .from("hc_formulacion_antecedentes AS hc")
        .leftJoin("medicamentos AS med", 
            function() {
                this.on("hc.codigo_medicamento", "med.codigo_medicamento")

        }).leftJoin("inv_med_cod_principios_activos AS pric", 
            function() {
                this.on("med.cod_principio_activo", "pric.cod_principio_activo")

        }).leftJoin("inventarios_productos AS invp",
            function(){
                this.on("hc.codigo_medicamento", "invp.codigo_producto")
        }).join("hc_medicamentos_recetados_amb AS a", function(){
                this.on("hc.codigo_medicamento ", "=", "a.codigo_producto")
                    .on("hc.evolucion_id", "=", "a.evolucion_id")
        }).where("hc.evolucion_id",obj.evolucionId)
          .orderBy(G.knex.raw("ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30)"))
          .as("A");
   
    var subQueryB = G.knex.select("numero_entrega_actual").from("dispensacion_estados").where("evolucion_id",obj.evolucionId)
         
    var query = G.knex.from(subQuery).where("A.numero_entregas", ">", subQueryB);
   
        query.then(function(resultado){ 
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
   
    var colSubQuery = ["b.codigo_medicamento",  
        "b.cantidad_entrega",  
        "b.descripcion_prod",   
        "b.cod_principio_activo",  
        "b.sw_autorizado",    
        "b.perioricidad_entrega",  
        "b.tiempo_total" ,    
        "b.cod_forma_farmacologica",  
        "b.evolucion_id",  
        G.knex.raw("CASE WHEN(  \
                  SELECT sum(tmp.cantidad_despachada) FROM hc_dispensacion_medicamentos_tmp tmp  \
                  WHERE tmp.evolucion_id = b.evolucion_id AND tmp.codigo_formulado = b.codigo_medicamento   \
                  GROUP BY tmp.codigo_formulado   \
                  ) = b.cantidad_entrega THEN '1' ELSE '0' END  AS sw_seleccionar_tmp") ];
    
    var colSubQueryB = ["a.codigo_medicamento",    
        G.knex.raw("SUM(numero_unidades) as cantidad_entrega"),    
        G.knex.raw("fc_descripcion_producto_alterno(a.codigo_medicamento) as descripcion_prod"),    
       "med.cod_principio_activo",
       "hc.sw_autorizado",    
       "hc.perioricidad_entrega",    
       "hc.tiempo_total",    
       "invp.cod_forma_farmacologica",  
       "hc.evolucion_id"  
    ];
    
    var colSubQueryC = ["dc.codigo_medicamento",  
        G.knex.raw("SUM(dc.cantidad) as numero_unidades")];
    var subQueryC =  G.knex.select(colSubQueryC)
        .from("hc_pendientes_por_dispensar as dc")
        .where("dc.evolucion_id",obj.evolucionId)
        .andWhere("dc.sw_estado",'0')
        .groupBy("dc.codigo_medicamento").as("a");
    
    var subQueryB = G.knex.select(colSubQueryB).from( subQueryC )
        .leftJoin("hc_formulacion_antecedentes AS hc", function(){
              this.on("hc.codigo_medicamento","a.codigo_medicamento")
        })
        .leftJoin("medicamentos AS med", function(){
              this.on("a.codigo_medicamento","med.codigo_medicamento")
        })
        .leftJoin("inv_med_cod_principios_activos AS pric", function(){
              this.on("med.cod_principio_activo","pric.cod_principio_activo")
        })
        .leftJoin("inventarios_productos AS invp", function(){
              this.on("hc.codigo_medicamento","invp.codigo_producto")
        })
        .where("hc.evolucion_id",obj.evolucionId)
        .groupBy("med.cod_principio_activo",    
                  "a.codigo_medicamento",    
                  "hc.sw_autorizado",    
                  "hc.perioricidad_entrega",    
                  "hc.tiempo_total",    
                  "invp.cod_forma_farmacologica",  
                  "hc.evolucion_id").as("b")
                   
    
    var query = G.knex.select(colSubQuery).from(subQueryB);
              
        query.then(function(resultado){       

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
            callback(false, resultado)
        }).catch(function(err){        
            console.log("err [listarMedicamentosPendientes]: ", err);
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
 
    var limite = "1000";
    if(obj.movimientoFormulaPaciente === 1){
        limite = "1";  
    } 
    
    var colSubQuery = ["a.resultado",   
        G.knex.raw("to_char(a.fecha_registro,'YYYY-MM-DD')as fecha_registro"),   
        G.knex.raw("round(a.unidades) as unidades"),  
        "a.nombre",   
        G.knex.raw("(SELECT bode.descripcion FROM bodegas as bode WHERE bode.empresa_id = a.empresa_id AND bode.centro_utilidad=a.centro_utilidad AND bode.bodega = A.bodega) AS razon_social"),   
        "a.bodega",  
        "a.centro_utilidad",  
        "a.formulacion", "a.modulo",   
        G.knex.raw("CASE WHEN A.modulo = 0 THEN (SELECT distinct(numero_formula) FROM hc_formulacion_antecedentes WHERE evolucion_id = A.formula ) :: varchar  \
                    ELSE (SELECT distinct(formula_papel) FROM esm_formula_externa WHERE formula_id = a.formula ) END  AS no_formula  "),
        "a.codigo_producto",  
        G.knex.raw("fc_descripcion_producto(a.codigo_producto) as descripcion"), 
        "a.usuario_id",  
        "a.usuario"
    ];
    
    var colSubQueryA = ["d.fecha_registro",  
        G.knex.raw("'1' as resultado"),   
        G.knex.raw("SUM(dd.cantidad) as unidades"),   
        "sys.nombre",   
        "empre.razon_social",  
        "nume.bodega",  
        "nume.centro_utilidad",  
        "nume.empresa_id",                       
        G.knex.raw("'F.historia clinica' as formulacion"),
        G.knex.raw("'0' as modulo"), 
         "dc.evolucion_id as formula",  
        "dd.codigo_producto",  
        "sys.usuario_id",
        "sys.usuario"
    ];
    
    
    var colSubQueryB = ["d.fecha_registro",  
        G.knex.raw("'0' as resultado"),   
        G.knex.raw("SUM(dd.cantidad) as unidades"),   
        "sys.nombre",   
        "empre.razon_social",  
        "nume.bodega",  
        "nume.centro_utilidad",  
        "nume.empresa_id",                         
        G.knex.raw("'F.historia clinica' as formulacion"),
        G.knex.raw("'0' as modulo"), 
        "dc.evolucion_id as formula",  
        "dd.codigo_producto",  
        "sys.usuario_id",
        "sys.usuario"
    ];
    
    var colSubQueryC = ["a.fecha_registro",  
        G.knex.raw("'1' as resultado"),   
        G.knex.raw("SUM(b.cantidad) as unidades"),   
        "g.nombre",   
        G.knex.raw("f.descripcion||'-'||i.razon_social as razon_social"),  
        "e.bodega",  
        "e.centro_utilidad",   
        "e.empresa_id",  
        G.knex.raw("'F.externa' as formulacion"),
        G.knex.raw("'1' as modulo"), 
        "c.formula_id as formula",
        "b.codigo_producto",
        "g.usuario_id",
        "g.usuario"
    ];
                    
    var colSubQueryD = ["a.fecha_registro",  
        G.knex.raw("'0' as resultado"),   
        G.knex.raw("SUM(b.cantidad) as unidades"),   
        "g.nombre",   
        G.knex.raw("f.descripcion||'-'||i.razon_social as razon_social"),  
        "e.bodega",  
        "e.centro_utilidad",   
        "e.empresa_id",  
        G.knex.raw("'F.externa' as formulacion"),
        G.knex.raw("'1' as modulo"), 
        "c.formula_id as formula",
        "b.codigo_producto",
        "g.usuario_id",
        "g.usuario"
    ];         
    
    var queryDispensacionEstados = G.knex.column(
        [G.knex.raw("distinct(evolucion_id) as evolucion_id"),
        "tipo_id_paciente",
        "paciente_id"
        ])
        .select()
        .from("hc_formulacion_antecedentes")
        .where("tipo_id_paciente",obj.tipoIdPaciente)
        .andWhere("paciente_id", obj.pacienteId).as("hc");
    
    var subQuery = G.knex.select(colSubQueryB)
        .from("hc_formulacion_despachos_medicamentos_pendientes as dc")                          
        .join(queryDispensacionEstados, 
             function() {
                 this.on("dc.evolucion_id","=","hc.evolucion_id")
         })
        .innerJoin("bodegas_documentos AS d", function(){
            this.on("dc.bodegas_doc_id", "d.bodegas_doc_id")
            .on("dc.numeracion","d.numeracion")
        })
         .innerJoin("bodegas_documentos_d AS dd", function(){
             this.on("d.bodegas_doc_id","dd.bodegas_doc_id")
             .on("d.numeracion","dd.numeracion")
        })
        .innerJoin("inventarios_productos AS inve", function(){
             this.on("dd.codigo_producto","inve.codigo_producto")   
        })
        .leftJoin("medicamentos AS mm", function(){
             this.on("inve.codigo_producto","mm.codigo_medicamento")
        })
        .innerJoin("system_usuarios AS sys", function(){
             this.on("d.usuario_id","sys.usuario_id")
        })
        .innerJoin("bodegas_doc_numeraciones AS nume", function(){
             this.on("d.bodegas_doc_id","nume.bodegas_doc_id")
        })
        .innerJoin("empresas AS empre", function(){
             this.on("nume.empresa_id","empre.empresa_id")
        })
        .where(function(){
            this.where("hc.tipo_id_paciente",obj.tipoIdPaciente)
            .andWhere("hc.paciente_id",obj.pacienteId)

            if(obj.movimientoFormulaPaciente === 1){

                if(obj.principioActivo){                                       
                    this.andWhere(G.knex.raw("mm.cod_principio_activo='" + obj.principioActivo + "' "))                                      
                }else{                                      
                    this.andWhere(G.knex.raw("inve.codigo_producto='" + obj.producto + "' "))                                       
                }

            }  
        })
        .groupBy("d.fecha_registro",
            "resultado",
            "sys.nombre","razon_social",  
            "nume.bodega","nume.centro_utilidad","nume.empresa_id","formulacion","modulo",
            "dc.evolucion_id","dd.codigo_producto","sys.usuario_id","sys.usuario").as("A")
         
    var query = G.knex.column('*')
        .from(subQuery) 
        .union(function(){
            this.select(colSubQueryA)
        .from("hc_formulacion_despachos_medicamentos as dc")
        .join(queryDispensacionEstados, 
            function() {
                this.on("dc.evolucion_id","=","hc.evolucion_id")
        })
       .innerJoin("bodegas_documentos AS d", function(){
           this.on("dc.bodegas_doc_id", "d.bodegas_doc_id")
           .on("dc.numeracion","d.numeracion")
        })
        .innerJoin("bodegas_documentos_d AS dd", function(){
            this.on("d.bodegas_doc_id","dd.bodegas_doc_id")
            .on("d.numeracion","dd.numeracion")
        })
        .innerJoin("inventarios_productos AS inve", function(){
            this.on("dd.codigo_producto","inve.codigo_producto")   
        })
        .leftJoin("medicamentos AS mm", function(){
            this.on("inve.codigo_producto","mm.codigo_medicamento")
        })
        .innerJoin("system_usuarios AS sys", function(){
            this.on("d.usuario_id","sys.usuario_id")
        })
        .innerJoin("bodegas_doc_numeraciones AS nume", function(){
            this.on("d.bodegas_doc_id","nume.bodegas_doc_id")
        })
        .innerJoin("empresas AS empre", function(){
            this.on("nume.empresa_id","empre.empresa_id")
        })
        .where(function(){
            this.where("hc.tipo_id_paciente",obj.tipoIdPaciente)
            .andWhere("hc.paciente_id",obj.pacienteId)
            .andWhere("dc.sw_estado",'1')

            if(obj.movimientoFormulaPaciente === 1){

                if(obj.principioActivo){

                    this.andWhere(G.knex.raw("mm.cod_principio_activo='" + obj.principioActivo + "' "))

                }else{

                    this.andWhere(G.knex.raw("inve.codigo_producto='" + obj.producto + "' "))

                }

            } 
        }).groupBy("d.fecha_registro", 
                "resultado",
                "sys.nombre","razon_social",  
                "nume.bodega","nume.centro_utilidad","nume.empresa_id","formulacion","modulo",
                "dc.evolucion_id","dd.codigo_producto","sys.usuario_id","sys.usuario")

        })
        //union 3       
        .union(function(){
                this.select(colSubQueryC)                          
        .from("esm_formula_externa AS d")
        .join("esm_formulacion_despachos_medicamentos AS c", function(){
            this.on("c.formula_id","=","d.formula_id")  
        })
        .join("bodegas_documentos AS a", function(){
            this.on("c.bodegas_doc_id","=","a.bodegas_doc_id")
            .on("c.numeracion","=","a.numeracion")
        })
        .join("bodegas_documentos_d AS b", function(){
            this.on("a.bodegas_doc_id","=","b.bodegas_doc_id")
            .on("a.numeracion","=","b.numeracion")
        })
        .join("inventarios_productos AS h", function(){
            this.on("b.codigo_producto","=","h.codigo_producto")                               
        })                                         
        .join("bodegas_doc_numeraciones AS e", function(){
            this.on("a.bodegas_doc_id","=","e.bodegas_doc_id")                               
        })    
        .join("system_usuarios AS g", function(){
            this.on("a.usuario_id","=","g.usuario_id")

        }) 
        .join("centros_utilidad AS f", function(){
            this.on("d.empresa_id","=","f.empresa_id")
            .on("d.centro_utilidad","=","f.centro_utilidad")
        })                                    
        .join("empresas AS i", function(){
            this.on("f.empresa_id","=","i.empresa_id")                             
        })                                     
                                   
       
        .where(function(){
            this.where(G.knex.raw("TRUE and d.tipo_id_paciente = '"+obj.tipoIdPaciente+"'"))
            .andWhere("d.paciente_id",obj.pacienteId)
            .andWhere("c.sw_estado",'not in',['0','2'])
            .andWhere("d.sw_estado",'in',['0','1'])
            .andWhere(G.knex.raw("a.fecha_registro >= '" +obj.fechaDia+ "'::date"))  
            .andWhere(G.knex.raw("a.fecha_registro <= ('" + obj.today + "'::date +'1 day' ::interval)::date "))
            if(obj.movimientoFormulaPaciente === 1){
                if(obj.principioActivo){
                    this.andWhere(G.knex.raw("h.subclase_id='" + obj.principioActivo + "' "))
                }else{
                    this.andWhere(G.knex.raw("b.codigo_producto ='" + obj.producto + "' "))
                }
            } 
        }).groupBy("a.fecha_registro","resultado","g.nombre","f.descripcion","i.razon_social",
        "e.bodega","e.centro_utilidad","e.empresa_id","c.formula_id","b.codigo_producto","g.usuario_id","g.usuario")
        })                  
        //union 4
        .union(function(){
                this.select(colSubQueryD)

        .from("bodegas_documentos AS a")
        .join("bodegas_documentos_d AS b", function(){
            this.on("a.bodegas_doc_id","=","b.bodegas_doc_id")
            .on("a.numeracion","=","b.numeracion")
        })                           
        .join("esm_formulacion_despachos_medicamentos_pendientes AS c", function(){
            this.on("c.bodegas_doc_id","=","a.bodegas_doc_id")
            .on("c.numeracion","=","a.numeracion")
        })                                
        .join("esm_formula_externa AS d", function(){
            this.on("c.formula_id","=","d.formula_id")                               
        })      

        .join("bodegas_doc_numeraciones AS e", function(){
            this.on("a.bodegas_doc_id","=","e.bodegas_doc_id")                               
        })                                    
        .join("centros_utilidad AS f", function(){
            this.on("e.empresa_id","=","f.empresa_id")
            .on("e.centro_utilidad","=","f.centro_utilidad")
        })                            
        .join("empresas AS i", function(){
            this.on("f.empresa_id","=","i.empresa_id")                             
        })                                                        
        .join("system_usuarios AS g", function(){
            this.on("a.usuario_id","=","g.usuario_id")

        })
        .join("inventarios_productos AS h", function(){
            this.on("b.codigo_producto","=","h.codigo_producto")                               
        })
        .where(function(){
            this.where(G.knex.raw("TRUE and d.tipo_id_paciente = '"+obj.tipoIdPaciente+"'"))
            .andWhere("d.paciente_id",obj.pacienteId)    
            .andWhere("d.sw_estado",'in',['0','1'])
            .andWhere(G.knex.raw("a.fecha_registro >= '" +obj.fechaDia+ "'::date"))  
            .andWhere(G.knex.raw("a.fecha_registro <= ('" + obj.today + "'::date +'1 day' ::interval)::date "))
             if(obj.movimientoFormulaPaciente === 1){
                if(obj.principioActivo){
                    this.andWhere(G.knex.raw("h.subclase_id='" + obj.principioActivo + "' "))

                }else{
                    this.andWhere(G.knex.raw("b.codigo_producto ='" + obj.producto + "' "))

                }

            }  

        })
        .groupBy("a.fecha_registro","resultado","g.nombre","f.descripcion","i.razon_social",
            "e.bodega","e.centro_utilidad","e.empresa_id","c.formula_id","b.codigo_producto","g.usuario_id","g.usuario")
        }).as("a");  
                            
    var queryS = G.knex.column(colSubQuery)
            .from(query)
            .where(G.knex.raw("a.fecha_registro >= '" +obj.fechaDia+ "'::date"))  
            .andWhere(G.knex.raw("a.fecha_registro <= ('" + obj.today + "'::date +'1 day' ::interval)::date "))
            .orderBy("a.fecha_registro","desc").limit(limite);
          
        queryS.then(function(resultado){       
            callback(false, resultado);
        }).catch(function(err){      
            console.log("err consultarUltimoRegistroDispensacion: ", err);   
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
  
    var condicion = "";
    var parametro = "";
    if (!obj.principioActivo || obj.principioActivo === null) {         
        condicion = "fv.codigo_producto";
        parametro = obj.codigoProducto;
         
    }else{
        condicion = "med.cod_principio_activo";
        parametro = obj.principioActivo;
    } 
    var columna = ["invp.contenido_unidad_venta as concentracion", 
        "invsinv.descripcion as molecula",
        "invmcf.descripcion as forma_farmacologica",
        "invci.descripcion as laboratorio",
        "invp.descripcion as producto",//G.knex.raw("fc_descripcion_producto(fv.codigo_producto) as producto"),
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
        G.knex.raw("CASE WHEN extract(days from (fv.fecha_vencimiento - timestamp 'now()')) <= 30 \
        and extract(days from (fv.fecha_vencimiento - timestamp 'now()')) > 1 THEN 0 \
         WHEN extract(days from (fv.fecha_vencimiento - timestamp 'now()')) <= 1 THEN 1\
         WHEN extract(days from (fv.fecha_vencimiento - timestamp 'now()')) > 30 THEN 2 END as estado_producto"),
        G.knex.raw("extract(days from (fv.fecha_vencimiento - timestamp 'now()')) as cantidad_dias")
    ]; 
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
        .where("fv.empresa_id", obj.empresa)
        .andWhere("fv.centro_utilidad", obj.centroUtilidad)
        .andWhere("fv.bodega", obj.bodega)
        .andWhere("fv.existencia_actual",">", 0)
        .andWhere(condicion,parametro)
        .orderBy("fv.fecha_vencimiento","ASC");
                  
    query.then(function(resultado){  
      
        callback(false, resultado);
    }).catch(function(err){ 
        console.log("err [existenciasBodegas]: ", err);
        callback(err);
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
    var descripcionProducto = "";   
    var columnas = [];
                    
    if(estado === 0){
        parametros = {evolucion_id: obj.evolucionId, 
            codigo_producto: obj.codigoProducto, 
            fecha_vencimiento: obj.fechaVencimiento, 
            lote: obj.lote
        };
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
     
    var query = G.knex.select(columnas).where(parametros).from("hc_dispensacion_medicamentos_tmp");
        query.then(function(resultado){   
            callback(false, resultado)
        }).catch(function(err){    
            console.log("err [consultarProductoTemporal]:", err);
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
 * +Descripcion : Transaccion para eliminar el temporal de la formula
 *                y si el medicamento fue confrontado denegar de nuevo la autorizacion
 * @fecha: 09/11/2016
 */
DispensacionHcModel.prototype.eliminarTemporalFormula = function(producto, callback){
    
    G.knex.transaction(function(transaccion) {         
        G.Q.nfcall(__eliminarTemporalFormula, producto, transaccion).then(function(resultado){
            
            if(resultado.length >0){
              
                var parametros={evolucionId:producto.evolucionId, 
                    usuario:null, 
                    observacion: null,
                    producto:resultado[0],
                    autorizado :'0'};
                
                return G.Q.nfcall(__autorizarDispensacionMedicamento, parametros, transaccion) 
            }
                                
        }).then(function(resultado){       
            
           transaccion.commit();       
        }).fail(function(err){
           console.log("err (/fail) [eliminarTemporalFormula]:", err);    
           transaccion.rollback(err);
        }).done();            
    }).then(function(){    
            callback(false);
    }).catch(function(err){ 
            console.log("err (/catch) [eliminarTemporalFormula]:", err); 
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
DispensacionHcModel.prototype.obtenerCabeceraFormula = function(obj,callback){
   
    var colQuery = ["ca.evolucion_id",  
        "ca.numero_formula",   
        "ca.tipo_id_paciente",   
        "ca.paciente_id",   
        "ca.fecha_registro",  
        "ca.fecha_finalizacion",  
        "ca.fecha_formulacion",  
        "ca.apellidos",  
        "ca.nombres",  
        "ca.edad",  
        "ca.sexo",  
        "ca.residencia_direccion",  
        "ca.residencia_telefono",  
        "ca.plan_id",  
        "ca.plan_descripcion",  
        "ca.tipo_bloqueo_id",  
        "ca.bloqueo",  
        "ca.tipo_formula",  
        "ca.descripcion_tipo_formula",  
        G.knex.raw("CASE WHEN ca.nombre is null  \
        THEN (SELECT sys.nombre   \
            FROM system_usuarios sys   \
            WHERE sys.usuario_id =(SELECT distinct(usuario_id) FROM hc_pendientes_por_dispensar WHERE evolucion_id = "+obj.evolucionId+" limit 1))  \
        ELSE ca.nombre END  AS nombre"),                       
    ];
    
    var colSubQueryNombreE = [ "a.evolucion_id", 
        "b.bodegas_doc_id as bodegas_doc_id",
        "b.numeracion as numeracion"
    ];
    var subQueryNombreE = G.knex.select(colSubQueryNombreE)
        .from("dispensacion_estados AS a")
        .innerJoin("hc_formulacion_despachos_medicamentos AS b",
            function(){
                this.on("a.evolucion_id","b.evolucion_id")
            })
        .union(function(){
             this.select(colSubQueryNombreE)
             .from("dispensacion_estados AS a")
             .leftJoin("hc_formulacion_despachos_medicamentos_pendientes AS b",
             function(){
                 this.on("a.evolucion_id","b.evolucion_id")
             })

        }).as("union_entrega")
    
    var subQueryNombreD = G.knex.select(["union_entrega.evolucion_id", 
        "union_entrega.bodegas_doc_id as bodegas_doc_id",
        "union_entrega.numeracion as numeracion"
    ]).from(subQueryNombreE).where("union_entrega.evolucion_id",obj.evolucionId).as("entrega")
    
    var subQueryNombreC = G.knex.select([G.knex.raw("distinct(bod.usuario_id) as usuario_id"), "bod.fecha_registro"])
        .from("bodegas_documentos AS bod")
        .innerJoin(subQueryNombreD, function(){
               this.on("entrega.bodegas_doc_id","bod.bodegas_doc_id")
                   .on("entrega.numeracion","bod.numeracion")
        }).unionAll(function(){
           this.select([G.knex.raw("distinct(p.usuario_id)as usuario_id"),"p.fecha_pendiente"]) 
               .from("hc_pendientes_por_dispensar AS p")
               .where("p.evolucion_id",obj.evolucionId)
               .andWhere("p.bodegas_doc_id","is",null)
               .andWhere("p.numeracion","is",null)


        }).as("todo")
                              
    var subQueryNombreB = G.knex.select("todo.usuario_id")
        .from(subQueryNombreC)
        .where(G.knex.raw("todo.fecha_registro ilike '%'||(SELECT fecha_ultima_entrega FROM dispensacion_estados WHERE evolucion_id = "+obj.evolucionId+" )||'%' limit 1"))

    
    var subQueryNombre = G.knex.select("nombre")
        .from("system_usuarios")
        .where("usuario_id", subQueryNombreB).as("nombre");
    
    
    var colSubQuery = [G.knex.raw("distinct ON(a.evolucion_id) a.evolucion_id"),
        "a.numero_formula",  
        "a.tipo_id_paciente",  
        "a.paciente_id",  
        G.knex.raw("to_char(a.fecha_registro,'YYYY-MM-DD') as fecha_registro"),  
        G.knex.raw("to_char(a.fecha_finalizacion,'YYYY-MM-DD') as fecha_finalizacion"),  
        G.knex.raw("to_char(a.fecha_formulacion,'YYYY-MM-DD') as fecha_formulacion"),  
        G.knex.raw("b.primer_apellido ||' '|| b.segundo_apellido AS apellidos"),  
        G.knex.raw("b.primer_nombre||' '||b.segundo_nombre AS nombres"),  
        G.knex.raw("edad(b.fecha_nacimiento) as edad"),  
        "b.sexo_id as sexo",  
        "b.residencia_direccion",  
        "b.residencia_telefono",  
        "e.plan_id",  
        "e.plan_descripcion",  
        "g.tipo_bloqueo_id",  
        "g.descripcion AS bloqueo",  
        "h.tipo_formula",  
        "i.descripcion_tipo_formula",
        subQueryNombre
    ];
    
    var subQuery = G.knex.select(colSubQuery)
        .from("hc_formulacion_antecedentes AS a")
        .innerJoin("hc_evoluciones AS h", function(){
          this.on("a.evolucion_id","h.evolucion_id")
        })
        .innerJoin("pacientes AS b", function(){
          this.on("a.tipo_id_paciente","b.tipo_id_paciente")
              .on("a.paciente_id","b.paciente_id")
        })
        .leftJoin("eps_afiliados AS c", function(){
            this.on("b.tipo_id_paciente","c.afiliado_tipo_id")
                .on("b.paciente_id","c.afiliado_id")
        })
        .innerJoin("planes_rangos AS d", function(){
            this.on("c.plan_atencion","d.plan_id")
                .on("c.tipo_afiliado_atencion","d.tipo_afiliado_id")
                .on("c.rango_afiliado_atencion","d.rango")
        })
        .innerJoin("planes AS e", function(){
            this.on("d.plan_id","e.plan_id")
        })
        .innerJoin("inv_tipos_bloqueos AS g", function(){
            this.on("b.tipo_bloqueo_id","g.tipo_bloqueo_id")
        })
        .leftJoin("esm_tipos_formulas AS i", function(){
            this.on("h.tipo_formula","i.tipo_formula_id")

        })
        .where(function(){
            this.where("a.evolucion_id",obj.evolucionId)
                .andWhere("a.sw_formulado",'1')
                .andWhere("g.estado",'1')
            if(obj.pacienteId){
                this.andWhere("a.tipo_id_paciente", obj.tipoIdPaciente)
                    .andWhere("a.paciente_id",obj.pacienteId)                               
            }
        }).as("ca");
       
    var query = G.knex.select(colQuery).from(subQuery)
                        
        query.then(function(resultado){
            callback(false, resultado);
        }).catch(function(err){        
            console.log("err [obtenerCabeceraFormula]: ", err);
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
      
    var columnas = ["hc.medico_id",
        "pro.nombre",
        "pro.tipo_id_tercero",
        "pro.tercero_id",
        "tipos.descripcion"
    ];
                 
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
 
    var campo = "";
    
    if(obj.estado === 0){
        campo = "sw_estado";
    }else{
        campo = "todo_pendiente";    
    }
    
    /**
     * +Descripcion El estado 0 (Cero) se envia desde el controlador descartarProductoPendiente
     *              El estado 1 (Uno)  Se envia desde el controlador consultarProductosTodoPendiente
     */

    var query = G.knex.column("evolucion_id")
        .select()
        .from('hc_pendientes_por_dispensar')
        .whereNull('bodegas_doc_id')
        .andWhere('numeracion','is', null)
        .andWhere("evolucion_id",obj.evolucionId)
        .andWhere(campo,obj.estado);
    
    query.then(function(resultado){ 
        callback(false, resultado)
    }).catch(function(err){   
        console.log("err [consultarProductosTodoPendiente]: ", err);
        callback(err);
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
 
    var query = G.knex('hc_evoluciones')
        .where('evolucion_id', obj.evolucionId)
        .update({tipo_formula:obj.tipoFormula});
    
    query.then(function(resultado){ 
       callback(false, resultado);
    }).catch(function(err){    
       console.log("err (/catch) [actualizarTipoFormula]: ", err);
       callback("Error al actualizar el tipo de formula");  
    });
};


/**
 * +Descripcion Metodo transaccion que invoca al metodo (__autorizarDispensacionMedicamento)
 */
DispensacionHcModel.prototype.autorizarDispensacionMedicamento = function(obj, callback)
{ 
          
    var evolucionId;
    G.knex.transaction(function(transaccion) {         
        G.Q.nfcall(__autorizarDispensacionMedicamento, obj, transaccion).then(function(resultado){     
            evolucionId = resultado[0];
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
      
    var query = G.knex('hc_formulacion_antecedentes')
       .where({evolucion_id: obj.evolucionId}) 
       .andWhere({codigo_medicamento:obj.producto})   
       .returning('evolucion_id')          
       .update({sw_autorizado:obj.autorizado, 
            usuario_autoriza_id: obj.usuario,
            observacion_autorizacion: obj.observacion,
            fecha_registro_autorizacion: 'now()'
        });
            
       
   if(transaccion) query.transacting(transaccion);                         
      query.then(function(resultado){      
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [autorizarDispensacionMedicamento]: ", err);
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
              
    var query = G.knex('bodegas_doc_numeraciones')
        .where('bodegas_doc_id', obj.bodegasDocId)
        .returning("numeracion")
        .increment('numeracion', 1);
              
    query.then(function(resultado){  
        
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
      
    var colFormulados = [];
    if(obj.numeroEntregaActual === 0){
        colFormulados = [G.knex.raw("(numero_total_entregas - numero_entrega_actual) as numeroentrega"),"sw_pendiente"];
    }else{
        colFormulados = ["numero_entrega_actual as numeroentrega","sw_pendiente", "numero_total_entregas"];
    } 
   
    var query = G.knex.column(colFormulados)
        .select()
        .from('dispensacion_estados')
        .where({evolucion_id:obj.evolucion});

        query.then(function(resultado){ 
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
       
    var columna = [G.knex.raw("CASE WHEN numero_entrega_actual = numero_total_entregas THEN '1' ELSE '0' END  AS estado_entrega")];
     
    var query = G.knex.column(columna)
     .select()
     .from('dispensacion_estados')
     .where({evolucion_id:obj.evolucion});
   
   if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){           
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
    var that = this;
    var def = G.Q.defer();
    G.knex.transaction(function(transaccion) {  
        
        G.Q.nfcall(__insertarBodegasDocumentos, obj.parametro1, transaccion
            
         ).then(function(resultado){
             
                var formato = 'YYYY-MM-DD hh:mm:ss a';
                var fechaToday = G.moment(resultado[0]).format(formato);
                obj.parametro1.fecha_ultima_entrega = fechaToday;

            return  G.Q.nfcall(__guardarBodegasDocumentosDetalle,that,0, obj.parametro2,transaccion); //obj.parametro2 producto a entregar
                                  
        }).then(function(){
            
            return G.Q.ninvoke(that,'actualizarProductoPorBodega',obj.parametro1, transaccion);
            
        }).then(function(){
            
            return G.Q.ninvoke(that,'insertarDespachoMedicamentosPendientes',obj.parametro1, transaccion);
            
        }).then(function(){
                return G.Q.ninvoke(that,'consultarProductoTemporal',{evolucionId:obj.parametro1.evolucion},1);
        }).then(function(resultado){
            
                if(resultado.length >0){                                   
                    return G.Q.ninvoke(that,'listarMedicamentosPendientesSinDispensar',{evolucionId:obj.parametro1.evolucion});                                   
                }                    
        }).then(function(resultado){     

            if(resultado.length >0){                   

                return G.Q.nfcall(__insertarMedicamentosPendientesPorDispensar,that,0, resultado,obj.parametro1,transaccion);
            }else{
                def.resolve();
            }         
            
        }).then(function(resultado){   

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
                 
            return G.Q.ninvoke(that,'actualizarDispensacionEstados', obj.parametro1 , transaccion); 
                 
                          
                 
        }).then(function(){
                 
            return G.Q.ninvoke(that,'consultarNumeroTotalEntregas', obj.parametro1 , transaccion);
                
        }).then(function(resultado){  
             
            if(resultado[0].estado_entrega === '1'){                
                return G.Q.ninvoke(that,'actualizarEstadoFinalizoFormula', obj.parametro1 , transaccion);
            }else{                             
                def.resolve();    
            }  
                    
        }).then(function(resultado){      
                            
            return G.Q.ninvoke(that,'actualizarMedicamentoConfrontado', obj.parametro1 , transaccion);
                         
        }).then(function(){  
             
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
    console.log("parametros:: ",parametros);
    var producto = productos[index];
    
    if (!producto) {   
        sumaTotalDispensados = 0;
        callback(false,totalInsertadosPendientes);
        return; 
    }  

    G.Q.ninvoke(that,'consultarPendientesMedicamento',{evolucion:parametros.evolucion,codigo_producto:producto.codigo_producto}).then(function(resultado){
        //consulta si esta insertado sino lo esta lo inserta si lo esta lo actualiza
         if(resultado.evolucion_id !== undefined){  
                producto.sw_estado_pendiente=0;
                if(parseInt(producto.total) === 0 ){
                    producto.sw_estado_pendiente=1;
                }
                    G.Q.ninvoke(that,'updatePendientesPorDispensar',producto, parametros, transaccion).then(function(resultado){  

                        totalInsertadosPendientes = 1;

                    });  
            
         }else{

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
 * Autor : Cristian Ardila
 * Descripcion : SQL para qye ingresara los productos que quedan pendientes
 *               por dispensar
 * @fecha: 08/06/2015 2:43 pm 
 */
DispensacionHcModel.prototype.updatePendientesPorDispensar = function(producto,obj,transaccion,callback) {
      var query = G.knex('hc_pendientes_por_dispensar')
       .where({evolucion_id: obj.evolucion}) 
       .andWhere({codigo_medicamento:producto.codigo_producto})             
       .update({
            cantidad: Math.round(producto.total),
            usurio_reg_pendiente: obj.usuario,
            todo_pendiente:  0,
            bodegas_doc_id: obj.bodegas_doc_id,
            numeracion: obj.numeracion,
            sw_estado:producto.sw_estado_pendiente,
            fecha_registro: 'now()',
            fecha_pendiente: 'now()'
    });
    
   if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){       
            callback(false, resultado);
    }).catch(function(err){
            console.log("err (/catch) [updatePendientesPorDispensar]: ", err);       
            callback({err:err, msj: "Error al modificar los medicamentos pendientes"});   
    });
};
             
/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de validar si una formula tiene medicamentos
 *               pendientes
 * @fecha: 05/11/2015
 * @Funciones que hacen uso del model :
 */
DispensacionHcModel.prototype.consultarPendientesMedicamento = function(obj, callback) {
 
    G.knex('hc_pendientes_por_dispensar').where({
        evolucion_id: obj.evolucion,
        codigo_medicamento:obj.codigo_producto
    }).select('evolucion_id').then(function(resultado) {
        
        callback(false, resultado[0]);
    }). catch (function(error) {
        console.log("err (/catch) [consultarPendientesFormula]: ", error)
        callback(error);
    });
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
     
    var query = G.knex('hc_pendientes_por_dispensar')
       .where({evolucion_id: evolucion}) 
       .andWhere({codigo_medicamento:producto.codigo_producto})             
       .update({sw_estado:'1'});
       
   if(transaccion) query.transacting(transaccion);     
      query.then(function(resultado){       
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
 
    var query = G.knex('hc_formulacion_despachos_medicamentos_pendientes')
        .insert({bodegas_doc_id: obj.bodegasDocId,
        numeracion: obj.numeracion,
        evolucion_id: obj.evolucion,
        todo_pendiente: obj.todoPendiente
    });
        
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){    
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
 
   var query = G.knex('hc_pendientes_por_dispensar')
       .where({evolucion_id: obj.evolucion})              
       .update({bodegas_doc_id: obj.bodegasDocId, numeracion: obj.numeracion});
       
   if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){ 
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
    
    var query = G.knex('hc_pendientes_por_dispensar')
       .where({hc_pendiente_dispensacion_id: obj.identificadorProductoPendiente})              
       .update({sw_estado: '2', 
            usurio_reg_pendiente: obj.usuario, 
            fecha_noreclama: 'now()', 
            justificacion_pendiente: obj.tipoJustificacion 
        });
 
        query.then(function(resultado){          
            callback(false, resultado);
        }).catch(function(err){
            console.log("error [descartarProductoPendiente]: ", err);
            callback({status:403, msj: "Error al actualizar el estado del producto pendiente"});   
    });  
};
 
 
DispensacionHcModel.prototype.actualizarEstadoFormulaSinPendientes = function(obj, callback)
{   
    var that = this;
    var def = G.Q.defer();                          
    G.knex.transaction(function(transaccion) {        
                
        /**
        * +Descripcion se actualiza la tabla de estados evidenciando
        *              que la formula ya no tiene pendientes
        */          
        return G.Q.ninvoke(that,'actualizarDispensacionEstados', {actualizarCampoPendiente:1, conPendientes:0, evolucion:obj.evolucion},transaccion).then(function(){             
            transaccion.commit(); 
        }).fail(function(err){
            transaccion.rollback(err);
        }).done();
         
    }).then(function(){
        callback(false);
    }).catch(function(err){ 
        console.log("err [actualizarEstadoFormulaSinPendientes]: ", err);
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
    var that = this;
    var def = G.Q.defer();
    G.knex.transaction(function(transaccion) {  
        
        G.Q.nfcall(__insertarBodegasDocumentos, obj.parametro1, transaccion)
            .then(function(resultado){  
                
                var formato = 'YYYY-MM-DD hh:mm:ss a';
                var fechaToday = G.moment(resultado[0]).format(formato);
                obj.parametro1.fecha_ultima_entrega = fechaToday;
                 
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

            return G.Q.ninvoke(that,'actualizarDispensacionEstados', obj.parametro1 , transaccion); 
         
        }).then(function(){                 
            return G.Q.ninvoke(that,'consultarNumeroTotalEntregas', obj.parametro1 , transaccion);                
        }).then(function(resultado){  
            
            if(resultado[0].estado_entrega === '1'){                
                return G.Q.ninvoke(that,'actualizarEstadoFinalizoFormula', obj.parametro1 , transaccion);
            }else{
                def.resolve();
            }  
                         
        }).then(function(resultado){  
                            
            return G.Q.ninvoke(that,'actualizarMedicamentoConfrontado', obj.parametro1 , transaccion);
                         
        }).then(function(resultado){  
                
            transaccion.commit(); 
                
        }).fail(function(err){
            
            transaccion.rollback(err);
        }).done();

    }).then(function(){
       callback(false);
    }).catch(function(err){ 
        console.log("err [generarDispensacionFormula]:", err);
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
   
    var query = G.knex('hc_formulacion_antecedentes')
        .where({evolucion_id: obj.evolucion})                    
        .update({sw_autorizado: 0});

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
    var parametrosActualizarDispensacionEstados = {evolucion:obj.evolucionId, conPendientes:2, actualizarCampoPendiente:1,farmacia:obj.farmacia}
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
          
                transaccion.commit();            
        }).fail(function(err){
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
   
   var parametros = [];
   var sql = "";  
   var update ="";
   var def = G.Q.defer();
   if(obj.farmacia !== undefined && (obj.conPendientes === 1 || obj.conPendientes === 2)){
       update =",empresa_id ='"+obj.farmacia.empresa+"',"+
               "centro_utilidad ='"+obj.farmacia.centro_utilidad+"',"+
               "bodega ='"+obj.farmacia.bodega+"' ";
   }
    
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
                    "+update+"\
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
                "+update+"\
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
                "+update+"\
               WHERE evolucion_id = :evolucion_id ";
    }                                      
                     
    var query = G.knex.raw(sql,parametros);    
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){ 
                   
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
   
    var queryNumeroEntregaActual = G.knex.column("numero_entrega_actual")
        .select()
        .from('dispensacion_estados')
        .where({evolucion_id:obj.evolucion_id});
     
    var query = G.knex('bodegas_documentos')
        .where({bodegas_doc_id: obj.bodegasDocId,numeracion: obj.numeracion})                    
        .update({numero_entrega_actual: queryNumeroEntregaActual});
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){
             
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
        
        sumaTotalDispensados = 0;
        callback(false,rowCount);  
        return;                     
    }  
    
    if(parseInt(producto.total) > 0){      
        G.Q.ninvoke(that,'insertarPendientesPorDispensar',producto, evolucionId, todoPendiente, usuario, transaccion).then(function(resultado){
            rowCount = 1;
            
         }).fail(function(err){      
       }).done();   
    }
     
    sumaTotalDispensados += parseInt(producto.total);
    if( sumaTotalDispensados === 0){    
         
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
        
    G.Q.nfcall(__actualizarExistenciasBodegasLotesFv, producto, transaccion).then(function(resultado){    
       
        if(resultado >= 1){      
            return  G.Q.nfcall(__actualizarExistenciasBodegas, producto, transaccion);      
        }else{
            throw 'Error al actualizar las existencias de los lotes por que no pueden ser menores a 0'
        }
         
    }).then(function(resultado){
        
       if(resultado >= 1){      
            return G.Q.nfcall(__insertarBodegasDocumentosDetalle,producto,parametros.bodegasDocId, parametros.numeracion, parametros.planId,transaccion);
        }else{
            throw 'Error al actualizar las existencias de bodega por que no pueden ser menores a 0'
        }
        
    
    }).then(function(resultado){
     
        setTimeout(function() {
            __guardarBodegasDocumentosDetalle(that, index, parametros,transaccion, callback);
        }, 300);
        
    }).fail(function(err){ 
        console.log("err (/fail) [__guardarBodegasDocumentosDetalle]: ", err);
        callback(err);            
    }).done();
};


 
/**
 * @author Cristian Ardila
 * +Descripcion Query invocado desde una transaccion para actualizar
 *              la existencia actual de un producto cuando se dispensar
 *              una formula
 * @fecha 11/06/2016 (DD-MM-YYYY)
 */
function __actualizarExistenciasBodegasLotesFv(obj,transaccion,callback) {
      
    var formato = 'YYYY-MM-DD';
     
    var query = G.knex('existencias_bodegas_lote_fv')
        .where({empresa_id:obj.empresa_id,                      
            centro_utilidad:obj.centro_utilidad,
            bodega:obj.bodega,
            codigo_producto:obj.codigo_producto, 
            fecha_vencimiento: G.moment(obj.fecha_vencimiento).add(1, 'day').format(formato),
            lote:obj.lote
        }).decrement('existencia_actual', obj.cantidad_despachada);
        
     
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){         
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
    
    var query = G.knex('existencias_bodegas')
        .where({empresa_id:obj.empresa_id,
            centro_utilidad:obj.centro_utilidad,
            bodega:obj.bodega,
            codigo_producto:obj.codigo_producto
       }).decrement('existencia', obj.cantidad_despachada );


    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){ 
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
            sw_pactado: '1' 
    });
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){           
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

    var query = G.knex('hc_pendientes_por_dispensar')
        .insert({hc_pendiente_dispensacion_id: G.knex.raw('DEFAULT'),
            evolucion_id: evolucionId,
            codigo_medicamento: producto.codigo_producto,
            cantidad: Math.round(producto.total),
            usuario_id: usuario,
            todo_pendiente:  todoPendiente,
            fecha_registro: 'now()',
            fecha_pendiente: 'now()'
    });
    
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
    
   var query = G.knex('hc_dispensacion_medicamentos_tmp')
        .where('evolucion_id', obj.evolucionId)
        .del();
    
   if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){    
             
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
         
    var columnas = [G.knex.raw("SUM(numero_unidades) as total"),
        "codigo_medicamento",
        "fecha_registro",
        G.knex.raw("fc_descripcion_producto_alterno(codigo_medicamento) as descripcion_prod")
    ]
    var colSubQuery = ["codigo_medicamento",
        "fecha_registro",
        G.knex.raw("SUM(cantidad) as numero_unidades")
    ];
                  
    var subQuery = G.knex.select(colSubQuery)
        .from('hc_pendientes_por_dispensar')
        .where('evolucion_id',parametro.evolucionId)
        .andWhere('sw_estado','0')
        .groupBy('codigo_medicamento','fecha_registro').as("A");
                
         
    var query = G.knex.select(columnas).from(subQuery).groupBy('codigo_medicamento','fecha_registro');
    
    if(transaccion) query.transacting(transaccion);   
        query.then(function(resultado) {        
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

   var query = G.knex("hc_despacho_medicamentos_eventos")
        .where({paciente_id: parametro.pacienteId, 
            tipo_id_paciente: parametro.tipoIdPaciente,
            evolucion_id: parametro.evolucionId,
            sw_estado: '1'})
        .update({sw_estado: '0'});
    
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){          
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
            usuario_id: parametro.usuario
        });
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){ 
            callback(false, resultado);
    }).catch(function(err){
            console.log("err (/catch) [__insertarDespachoMedicamentoEvento]: ", err);
             
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
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__insertarDespachoMedicamentoEvento]: ", err);
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
                
    var query = G.knex('hc_dispensacion_medicamentos_tmp').returning("codigo_formulado")      
        .where(function(){
            this.where('evolucion_id', producto.evolucionId)
                .andWhere('codigo_producto',producto.codigoProducto)
            if (producto.serialId > 0) {
                this.where("hc_dispen_tmp_id", producto.serialId);
            }
        }).del();
         
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){    
            callback(false, resultado);
    }).catch(function(err){
            console.log("err (/catch) [__eliminarTemporalFormula]: ", err);
             
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
    
    var query = G.knex('hc_dispensacion_medicamentos_tmp')
        .insert({hc_dispen_tmp_id: G.knex.raw('DEFAULT'),
            evolucion_id: producto.evolucionId,
            empresa_id: producto.empresa,
            centro_utilidad: producto.centroUtilidad,
            bodega: producto.bodega,
            codigo_producto: producto.codigoProducto,
            cantidad_despachada: producto.cantidad,
            fecha_vencimiento: producto.fechaVencimiento,
            lote: producto.lote,
            codigo_formulado:producto.formulado,
            usuario_id:producto.usuario,
            sw_entregado_off:producto.rango
        });
    
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){            
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__insertarTemporalFarmacia]: ", err);     
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
            fecha_registro: 'now()' 
        });
    
    
    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){  
           
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
     
    var query = G.knex('hc_formulacion_despachos_medicamentos')
        .insert({hc_formulacion_despacho_id: G.knex.raw('DEFAULT'),
            evolucion_id: obj.evolucion,
            bodegas_doc_id: obj.bodegasDocId,
            numeracion: obj.numeracion
        });
     if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){  
            callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__insertarDespachoMedicamentos]: ", err);
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
     
    var columna = [G.knex.raw("TO_CHAR(fecha_formulacion,'YYYY-MM-DD') as fecha_formulacion")];
     
    G.knex('hc_formulacion_antecedentes').where({
        evolucion_id: obj.evolucionId
    }).select(columna).then(function(resultado) {
        callback(false, resultado);
    }). catch (function(error) {
        console.log("err[consultarFormulaAntecedentes]: ", error);
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
            
            if(resultado.length > 0){
                return G.Q.nfcall(__actualizarNumeroEntrega,that,0,1, resultado,obj,transaccion);                      
            }else{
                def.resolve(); 
            }
            
        }).then(function(){       
            
            return G.Q.ninvoke(that,'consultarDispensacionEstadosFormula',obj,transaccion);   
           
        }).then(function(resultado){
            
            fechaEntrega = resultado;
            
            return G.Q.nfcall(__consultarMedicamentosFormulados,obj,transaccion);   
           
        }).then(function(resultado){
            
            return G.Q.nfcall(__actualizarEntregaPorProducto,that,0,resultado,obj,transaccion);
              
        }).then(function(resultado){
             
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
            console.log("fail transaccion rollback [consultarDispensacionesFormula]: ", err);
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
    
    var columnasEntregas = [G.knex.raw("distinct(hp.evolucion_id)as evolucion_id"),
                                      "bod.fecha_registro",
                                      "bod.bodegas_doc_id",
                                      "bod.numeracion"];
                                  
    var columnasUnionEntregas = ["a.evolucion_id",
        "a.fecha_registro as fecha_entrega",
        "a.bodegas_doc_id",
        "a.numeracion"
    ];
    
    var columnas = [ "b.evolucion_id",
        G.knex.raw("date(TO_CHAR(b.fecha_entrega,'DD/MM/YYYY'))as fecha_entrega"),
        "b.bodegas_doc_id",
        "b.numeracion"
    ];
                 
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
    
    var query = G.knex("bodegas_documentos").
        where({bodegas_doc_id: parametro.bodegas_doc_id, numeracion: parametro.numeracion}).
        returning('numero_entrega_actual').
        update({numero_entrega_actual: rowNum});
    if(transaccion) 
      query.transacting(transaccion).then(function(resultado){              
        callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [actualizarNumeroEntrega]: ", err);
         
        callback({err:err, msj: "Error al actualizar el evento"});
    });  
};


/**
 * @author Cristian Ardila
 * +Descripcion Modelo encargado de insertar el movimiento de la formula
 *              en la tabla de dispensacion_estados
 * @fecha 28/11/2016 (DD-MM-YYYY)
 */
DispensacionHcModel.prototype.consultarDispensacionEstadosFormula = function(obj,transaccion,callback){
      
    var that = this;
    var subQueryB = G.knex.select([G.knex.raw("count(evolucion_id) as numero_entregas"),
        "evolucion_id", 
        G.knex.raw("'normales' as a")])
        .from("hc_formulacion_despachos_medicamentos")
        .where(G.knex.raw("evolucion_id = "+obj.evolucionId+" group by evolucion_id"))

        .union(function(){
            this.select([G.knex.raw("count(desp.evolucion_id) as numero_entregas"),
                    G.knex.raw("desp.evolucion_id as evolucion_id"), 
                    G.knex.raw("'pendientestodos' as b")
                ])
                .from("hc_formulacion_despachos_medicamentos_pendientes AS desp")
                .innerJoin("bodegas_documentos AS pend", function(){
                    this.on("desp.bodegas_doc_id","pend.bodegas_doc_id")
                        .on("desp.numeracion","pend.numeracion")
                })                   
                .where("desp.evolucion_id",obj.evolucionId)
                .andWhere("pend.todo_pendiente",1)
                .groupBy("desp.evolucion_id");
    }).as("dispensados")
     
    //+Descripcion Query que consulta la ultima fecha de entrega de la formula
     
    var subQueryA = G.knex.select("bod.fecha_registro")  
        .from("hc_formulacion_despachos_medicamentos AS hp")
        .innerJoin("bodegas_documentos AS bod", function(){
            this.on("hp.bodegas_doc_id","bod.bodegas_doc_id")
            .on("hp.numeracion","bod.numeracion")
        }).where("evolucion_id", obj.evolucionId)
          .union(function(){
            this.select("bod.fecha_registro")  
                .from("hc_formulacion_despachos_medicamentos_pendientes AS hp")
                .innerJoin("bodegas_documentos AS bod", function(){
                    this.on("hp.bodegas_doc_id","bod.bodegas_doc_id")
                    .on("hp.numeracion","bod.numeracion")
                }).where("evolucion_id", obj.evolucionId)
        }).as("a");
            
     var subQueryFechaRegistro = G.knex.select("bod.fecha_registro")  
        .from("hc_formulacion_despachos_medicamentos AS hp")
        .innerJoin("bodegas_documentos AS bod", function(){
            this.on("hp.bodegas_doc_id","bod.bodegas_doc_id")
            .on("hp.numeracion","bod.numeracion")
        }).where("evolucion_id", obj.evolucionId)
          .union(function(){
            this.select("bod.fecha_registro")  
                .from("hc_formulacion_despachos_medicamentos_pendientes AS hp")
                .innerJoin("bodegas_documentos AS bod", function(){
                    this.on("hp.bodegas_doc_id","bod.bodegas_doc_id")
                    .on("hp.numeracion","bod.numeracion")
                }).where("evolucion_id", obj.evolucionId)
                        .andWhere("bod.todo_pendiente", 1)
        }).as("a")
    
    var numeroEntregaActualSubQuery = G.knex.select(
        [G.knex.raw("sum(dispensados.numero_entregas)as numero_entregas"),"dispensados.evolucion_id"])
       .from(subQueryB)
       .groupBy("dispensados.evolucion_id")
       .as("c")
    
    var subQueryC = G.knex.select(["evolucion_id", G.knex.raw("1")])
        .from("hc_formulacion_despachos_medicamentos").as("a")
        .union(function(){
            this.select(["evolucion_id", G.knex.raw("2")])
        .from("hc_formulacion_despachos_medicamentos_pendientes")
        })
        .union(function(){
            this.select(["evolucion_id", G.knex.raw("3")])
        .from("hc_dispensacion_medicamentos_tmp")
        }).as("b");
   
    var campoNumeroEntregaActual = G.knex.select(G.knex.raw("max(c.numero_entregas)as numero_entregas"))
        .from(subQueryC)
        .innerJoin(numeroEntregaActualSubQuery, function(){
            this.on("b.evolucion_id","c.evolucion_id")
        }).as("numero_entrega_actual")
        .where("b.evolucion_id",obj.evolucionId);   
    
    var campoFechaUltimaEntrega = G.knex.max("a.fecha_registro")
        .from(subQueryA).as("fecha_ultima_entrega")
    
    var campoFechaRegistro = G.knex.max("a.fecha_registro")
        .from(subQueryFechaRegistro).as("fecha_registro_formula")
    
    
    var campoSubQueryMovFormulaA = ["numero_formula as formula_id",   
        "evolucion_id",  
        "paciente_id",  
        "tipo_id_paciente",   
        G.knex.raw("max( ceiling(ceiling(hc.fecha_finalizacion - hc.fecha_registro)/30) ) as numero_total_entregas"),  
        "transcripcion_medica as tipo_formula",  
        "fecha_formulacion as fecha_registro",  
        "hc.medico_id",  
        "hc.refrendar",  
        G.knex.raw("max(fecha_finalizacion) as fecha_finalizacion"),
        G.knex.raw("CASE \
        WHEN(\
             SELECT max(distinct(hp.todo_pendiente))\
             FROM hc_pendientes_por_dispensar hp   \
             WHERE hp.evolucion_id = hc.evolucion_id \
             AND hp.bodegas_doc_id is null \
             AND hp.numeracion is null\
             AND hp.sw_estado not in(2)\
        ) = 0 THEN 1  \
        WHEN(\
             SELECT max(distinct(hp.todo_pendiente))\
             FROM hc_pendientes_por_dispensar hp   \
             WHERE hp.evolucion_id = hc.evolucion_id \
             AND hp.bodegas_doc_id is null \
             AND hp.numeracion is null\
             AND hp.sw_estado not in(2)\
         ) = 1 THEN 2   \
        ELSE 0 END as sw_pendiente"),
        campoNumeroEntregaActual,
        campoFechaUltimaEntrega,
        campoFechaRegistro
     ]
    var subQueryMovFormulaA = G.knex.select(campoSubQueryMovFormulaA)
        .from("hc_formulacion_antecedentes as hc")
        .where("hc.evolucion_id",obj.evolucionId)
        .groupBy("numero_formula",   
            "evolucion_id",  
            "paciente_id",  
            "tipo_id_paciente",   
            "transcripcion_medica",   
            "fecha_formulacion",  
            "hc.medico_id",  
            "hc.refrendar").as("a")
                          
    
    var campoSubQueryMovFormulaB = ["a.formula_id",  
        "a.evolucion_id",  
        "a.paciente_id",  
        "a.tipo_id_paciente",  
        "a.numero_total_entregas",   
        G.knex.raw("CASE WHEN a.numero_entrega_actual is null THEN 0 ELSE a.numero_entrega_actual END as numero_entrega_actual"),  
        G.knex.raw("0 as sw_refrendar"),  
        "a.sw_pendiente",  
        "a.tipo_formula",  
        G.knex.raw("CASE WHEN a.numero_total_entregas = a.numero_entrega_actual THEN 1 ELSE 0 END as sw_finalizado"),  
        G.knex.raw("CASE WHEN a.refrendar = 1 THEN (\
         SELECT CASE WHEN ref.fecha_refrendacion  >= \
            CASE WHEN a.fecha_registro_formula IS NULL \
                 THEN a.fecha_registro ELSE a.fecha_registro_formula END\
            THEN ref.fecha_refrendacion\
                ELSE \
                CASE WHEN a.fecha_registro_formula IS NULL \
                     THEN a.fecha_registro \
                     ELSE a.fecha_registro_formula END \
                END\
            FROM (\
                SELECT distinct(max(fecha_refrendacion)) as fecha_refrendacion\
                FROM medicamentos_refrendados   \
                WHERE numero_formula = a.formula_id AND transcripcion_medica = a.tipo_formula\
            )as ref)\
        ELSE  a.fecha_registro_formula\
        END as fecha_entrega"), 
        G.knex.raw("CASE WHEN a.refrendar = 1 \
        THEN ( \
            SELECT CASE WHEN ref.fecha_refrendacion  >=\
                CASE WHEN a.fecha_registro_formula IS NULL \
                     THEN a.fecha_registro ELSE a.fecha_registro_formula END\
                THEN '1'\
                ELSE '0' END\
                FROM (\
                     SELECT distinct(max(fecha_refrendacion)) as fecha_refrendacion\
                     FROM medicamentos_refrendados   \
                     WHERE numero_formula = a.formula_id AND transcripcion_medica = a.tipo_formula\
                )as ref)\
            ELSE '0'\
        END as estado_fecha_refrendacion"),
       G.knex.raw("null as fecha_minima_entrega"),   
       G.knex.raw("null as fecha_maxima_entrega"),   
       "a.medico_id",  
       "a.fecha_registro",  
       "a.fecha_finalizacion",       
       "a.fecha_ultima_entrega"
       ];
    
    var campoSubQueryMovFormulaC = ["b.formula_id",   
        "b.evolucion_id",   
        "b.paciente_id",   
        "b.tipo_id_paciente",   
        "b.numero_total_entregas",   
        "b.numero_entrega_actual",   
        "b.sw_refrendar",   
        "b.sw_pendiente",   
        "b.tipo_formula",  
        "b.sw_finalizado",  
        "b.fecha_entrega as fecha_entrega",  
        G.knex.raw("null as fecha_minima_entrega"),  
        G.knex.raw("null as fecha_maxima_entrega"),  
        "b.medico_id",  
        G.knex.raw("TO_CHAR(b.fecha_registro,'YYYY-MM-DD') as fecha_registro"),  
        G.knex.raw("TO_CHAR(b.fecha_finalizacion,'YYYY-MM-DD') as fecha_finalizacion"),  
         G.knex.raw("b.fecha_ultima_entrega as fecha_ultima_entrega"),
         "estado_fecha_refrendacion"
     ];
     
    var subQueryMovFormulaB = G.knex.select(campoSubQueryMovFormulaB)
        .from(subQueryMovFormulaA)
        .orderBy("a.numero_total_entregas","desc")
        .limit("1").as("b")
                        
    var query = G.knex.select(campoSubQueryMovFormulaC)
        .from(subQueryMovFormulaB)
                       
    if(transaccion) query.transacting(transaccion);    
        query.then(function(resultado){  
        
        return  G.Q.ninvoke(that,'insertarDispensacionEstadosFormula',resultado[0], transaccion);
            
    }).then(function(resultado){       
        callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [consultarDispensacionEstadosFormula]: ", err);     
        callback({err:err, msj: "Error al consultar el movimiento de la formula"});
    });  
     
};

/**
 * @author Cristian Manuel Ardila Troches
 * +Descripcion Metodo encargado de insertar el movimiento de la formula en la tabla
 *              dispensacion_estados                                                    
 * @fecha 2016-12-14 (YYYY-MM-DD)
 */
DispensacionHcModel.prototype.insertarDispensacionEstadosFormula = function(obj, transaccion, callback) {
     
    var query = G.knex('dispensacion_estados')
        .returning(["fecha_entrega","numero_entrega_actual","sw_finalizado", "estado_fecha_refrendacion","fecha_registro"])
        .insert({formula_id:obj.formula_id,   
            evolucion_id:obj.evolucion_id,   
            paciente_id:obj.paciente_id,   
            tipo_id_paciente:obj.tipo_id_paciente,   
            numero_total_entregas:obj.numero_total_entregas,   
            numero_entrega_actual:obj.numero_entrega_actual,   
            sw_refrendar:obj.sw_refrendar,   
            sw_pendiente:obj.sw_pendiente,   
            tipo_formula:obj.tipo_formula,  
            sw_finalizado:obj.sw_finalizado,  
            fecha_entrega:obj.fecha_entrega,  
            fecha_minima_entrega:obj.fecha_minima_entrega,  
            fecha_maxima_entrega:obj.fecha_maxima_entrega,  
            medico_id:obj.medico_id,  
            fecha_registro:obj.fecha_registro,  
            fecha_finalizacion:obj.fecha_finalizacion,  
            fecha_ultima_entrega:obj.fecha_ultima_entrega,          
            estado_fecha_refrendacion:obj.estado_fecha_refrendacion          
        });
                   
    if(transaccion) 
        query.transacting(transaccion).then(function(resultado) {   
            
            callback(false, resultado);
        }).catch (function(err) {
             console.log("err (/catch) [insertarDispensacionEstadosFormula]: ", err);  
            callback({err:err, msj: "Error insertarDispensacionEstadosFormula"});             
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

    var query = G.knex('hc_pendientes_por_dispensar')
        .where('evolucion_id', obj.evolucionId)
        .update({fecha_pendiente: G.knex.raw('fecha_registro')});
    
    if(transaccion) 
        query.transacting(transaccion).then(function(resultado) {
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

DispensacionHcModel.prototype.listarEvoluciones = function(callback){
   G.knex.select(G.knex.raw('distinct(evolucion_id) as evolucion_id'))
    .from("hc_formulacion_antecedentes")
    .where(G.knex.raw("fecha_formulacion between '2017-02-22' and '2017-02-22'"))
    .then(function(resultado){                
            
        callback(false, resultado)
    }).catch(function(err){    
        console.log("err [listarTipoDocumento]:", err);
        callback(err);
    });
    
};

/**
 * +Descripcion Metodo que eliminara las formulas que se encuentren sin movimiento
 *              a traves de una tarea programa todos los dias a las 10 pm
 * @author Cristian Ardila
 * @fecha  27/06/2017
 */
DispensacionHcModel.prototype.eliminarFormulasSinMovimiento = function(callback) {
    
    var sql = "DELETE FROM dispensacion_estados  \
                WHERE numero_entrega_actual = 0 AND sw_refrendar is null or sw_refrendar = 0 AND sw_pendiente is null or sw_pendiente = 0 AND sw_pendiente is null or sw_pendiente = 0 AND fecha_ultima_entrega is null";
    G.knex.raw(sql).then(function(resultado){   
      
        callback(false, resultado);
   }).catch(function(err){
        console.log("err (/catch) [eliminarFormulasSinMovimiento]: ", err);        
        callback({err:err, msj: "Error al eliminar los temporales"});   
    });  
};


DispensacionHcModel.$inject = [];


module.exports = DispensacionHcModel;