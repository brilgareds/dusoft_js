var FormulacionExternaModel = function() {
};

FormulacionExternaModel.prototype.obtenerAfiliado = function(tipoIdentificacion, identificacion, callback) {
    var columnas =  [
                        "p.paciente_id",
                        "p.tipo_id_paciente",
                        G.knex.raw("p.primer_nombre || ' ' || p.segundo_nombre  as nombres"), 
                        G.knex.raw("p.primer_apellido || ' ' || p.segundo_apellido as apellidos"),
                        "ea.estado_afiliado_id",
                        "ea.plan_atencion",
                        "ea.rango_afiliado_atencion",
                        "pa.plan_descripcion",
                        "pr.tipo_afiliado_id",
                        "pr.rango"
                    ];

    var query = G.knex.select(columnas)
                        .from('eps_afiliados as ea')
                        .innerJoin('pacientes as p', function() {
                                this.on("p.tipo_id_paciente", "ea.afiliado_tipo_id")
                                    .on("p.paciente_id", "ea.afiliado_id")
                        })
                        .innerJoin('planes_rangos as pr', function(){
                            this.on('ea.plan_atencion', 'pr.plan_id')
                                .on('ea.tipo_afiliado_atencion', 'pr.tipo_afiliado_id')
                                .on('ea.rango_afiliado_atencion', 'pr.rango')
                        })
                        .innerJoin('planes as pa', function() {
                                this.on("pr.plan_id", "pa.plan_id")
                        })
                        .innerJoin('tipos_planes as tp', function(){
                            this.on('tp.sw_tipo_plan', 'pa.sw_tipo_plan')
                        })
                        .where('p.tipo_id_paciente', tipoIdentificacion).andWhere("p.paciente_id","=", identificacion);

    //G.logError(G.sqlformatter.format(query.toString()));

    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [obtenerAfiliado]: " + err);
        callback(err);
    });
};

FormulacionExternaModel.prototype.obtenerMunicipios = function(term, callback) {
    var columnas = 	[
	    				"a.tipo_pais_id",
	    				"a.tipo_dpto_id",
	    				"a.tipo_mpio_id",
	    				"a.municipio as nombre",
	    				"b.departamento"
                    ];

	var query = G.knex.select(columnas)
                        .from('tipo_mpios as a')
                        .innerJoin('tipo_dptos as b',
                            function() {
                                this.on("a.tipo_pais_id", "b.tipo_pais_id")
                                    .on("a.tipo_dpto_id", "b.tipo_dpto_id")
                        	}
                        )
                        .where('a.municipio',G.constants.db().LIKE,"%" + term + "%").limit(20);

    //G.logError(G.sqlformatter.format(query.toString()));

    query.then(function(resultado){
      	callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [obtenerMunicipios]: " + err);
	    callback(err);
    });
};

FormulacionExternaModel.prototype.obtenerProfesionales = function(term, callback) {

    var columnas = ["PR.tipo_id_tercero", "PR.tercero_id", G.knex.raw("\"PR\".\"nombre\" || ' - ' || \"TIP\".\"descripcion\" as nombre")];
    var query = G.knex.select(columnas)
                    .from('profesionales as PR')
                    .innerJoin('tipos_profesionales as TIP',
                        function(){
                            this.on('PR.tipo_profesional', 'TIP.tipo_profesional')
                        })
                    .where('PR.nombre',G.constants.db().LIKE,"%" + term + "%").limit(20)
                    .orderBy('PR.nombre', 'ASC').limit(20);

    //G.logError(G.sqlformatter.format(query.toString()));

    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [obtenerProfesionales]: " + err);
        callback(err);
    });
};

FormulacionExternaModel.prototype.obtenerDiagnosticos = function(tipo_id_paciente, paciente_id, codigo, diagnostico, callback) {

    var columnas = ["diagnostico_id as id", G.knex.raw("diagnostico_id || ' - ' || diagnostico_nombre as nombre")];
    var query = G.knex.select(columnas)
                    .from('diagnosticos')
                    .where('diagnostico_id',G.constants.db().LIKE,"%" + codigo + "%")
                    .andWhere('diagnostico_nombre',G.constants.db().LIKE,"%" + diagnostico + "%")
                    .whereNotIn('diagnostico_id', G.knex.select('diagnostico_id')
                        .from('esm_formula_externa_diagnosticos_tmp')
                        .where('tipo_id_paciente', tipo_id_paciente)
                        .andWhere('paciente_id', paciente_id))
                    .limit(20)
                    .orderBy('diagnostico_nombre', 'ASC').limit(20);

    //G.logError(G.sqlformatter.format(query.toString()));

    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [obtenerDiagnosticos]: " + err);
        callback(err);
    });                   
};


FormulacionExternaModel.prototype.obtenerDiagnosticosTmp = function(tmp_formula_id, callback) {
    var columnas = ["fedt.diagnostico_id as id", G.knex.raw("fedt.diagnostico_id || ' - ' || d.diagnostico_nombre as nombre")];
    var query = G.knex.select(columnas)
                    .from('esm_formula_externa_diagnosticos_tmp as fedt')
                    .innerJoin('diagnosticos as d',
                        function(){
                            this.on('fedt.diagnostico_id', 'd.diagnostico_id')
                        })
                    .where('fedt.tmp_formula_id', tmp_formula_id);
    //G.logError(G.sqlformatter.format(query.toString()));

    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [obtenerDiagnosticosTmp]: " + err);
        callback(err);
    });                   
};

FormulacionExternaModel.prototype.eliminarDiagnosticoTmp = function(tmp_formula_id, diagnostico_id, callback) {
    var query = G.knex('esm_formula_externa_diagnosticos_tmp')
        .where('tmp_formula_id', tmp_formula_id)
        .where('diagnostico_id', diagnostico_id)
        .del();

    //G.logError(G.sqlformatter.format(query.toString()));
    
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [eliminarDiagnosticoTmp]: " + err);
        callback(err);
    });                   
};

FormulacionExternaModel.prototype.insertarDiagnosticoTmp = function(tmp_formula_id, usuario_id, tipo_id_paciente, paciente_id, diagnostico_id, callback) {

    var query = G.knex('esm_formula_externa_diagnosticos_tmp')
    .insert({
        tmp_formula_id : tmp_formula_id,
        usuario_id: usuario_id,
        tipo_id_paciente: tipo_id_paciente,
        paciente_id: paciente_id,
        diagnostico_id: diagnostico_id 
    });

    //G.logError(G.sqlformatter.format(query.toString()));

    query.then(function(resultado){    
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err (/catch) FormulacionExternaModel [insertarDiagnosticoTmp]: " +  err);
        callback({err:err, msj: "Se genero un error en insertarDiagnosticoTmp"});   
    });
};

FormulacionExternaModel.prototype.insertarFormulaTmp = function(formula_papel, empresa_id, fecha_formula, tipo_formula, tipo_id_tercero, tercero_id, tipo_id_paciente, paciente_id, plan_id, rango, tipo_afiliado_id, usuario_id,  centro_utilidad, bodega, tipo_pais_id, tipo_dpto_id, tipo_mpio_id, callback) {
    var query = G.knex('esm_formula_externa_tmp')
    .insert({
        tmp_empresa_id: empresa_id,
        tmp_formula_papel: formula_papel,
        fecha_formula: fecha_formula,
        tipo_formula: tipo_formula,
        tipo_id_tercero: tipo_id_tercero,
        tercero_id: tercero_id,
        tipo_id_paciente: tipo_id_paciente,
        paciente_id: paciente_id,
        plan_id: plan_id,
        rango: rango,
        tipo_afiliado_id: tipo_afiliado_id,
        usuario_id: usuario_id,
        tipo_pais_id: tipo_pais_id,
        tipo_dpto_id: tipo_dpto_id,
        tipo_mpio_id: tipo_mpio_id
    }).returning('tmp_formula_id');

    //G.logError(G.sqlformatter.format(query.toString()));

    query.then(function(resultado){    
        callback(false, resultado[0]);
    }).catch(function(err){
        G.logError("err (/catch) FormulacionExternaModel [insertarFormulaTmp]: " +  err);
        callback({err:err, msj: "Se genero un error en insertarFormulaTmp"});
    });
};

FormulacionExternaModel.prototype.obtenerFormulaExternaTmp = function(tipo_id_paciente, paciente_id, callback){
    var columnas = [
        //campos esm_formula_externa_tmp
        "fe.tmp_formula_id",
        "fe.tmp_empresa_id",
        "fe.tmp_formula_papel",
        "fe.fecha_formula",
        "fe.tipo_formula",
        "fe.tipo_id_tercero",
        "fe.tercero_id",
        "fe.tipo_id_paciente",
        "fe.paciente_id",
        "fe.plan_id",
        "fe.rango",
        "fe.tipo_afiliado_id",
        "fe.tipo_pais_id",
        "fe.tipo_dpto_id",
        "fe.tipo_mpio_id",
        //campos tipo_mpios
        "tm.municipio",
        //campos prefesionales
        "p.nombre as nombre_profesional",
        //campos tipos_profesionales
        "tp.descripcion as tipo_profesional",
        //campos esm_tipos_formulas
        "etf.descripcion_tipo_formula"
    ];

    var query = G.knex.select(columnas)
                    .from('esm_formula_externa_tmp as fe')
                    .leftJoin('tipo_mpios as tm', function(){
                        this.on('fe.tipo_pais_id', 'tm.tipo_pais_id');
                        this.on('fe.tipo_dpto_id', 'tm.tipo_dpto_id');
                        this.on('fe.tipo_mpio_id', 'tm.tipo_mpio_id');
                    })
                    .innerJoin('profesionales as p', function(){
                        this.on('fe.tipo_id_tercero', 'p.tipo_id_tercero');
                        this.on('fe.tercero_id', 'p.tercero_id');
                    })
                    .leftJoin('tipos_profesionales as tp', function(){
                        this.on('p.tipo_profesional', 'tp.tipo_profesional');
                    })
                    .leftJoin('esm_tipos_formulas as etf', function(){
                        this.on('fe.tipo_formula', 'etf.tipo_formula_id')
                    })
                    .where('tipo_id_paciente', tipo_id_paciente)
                    .andWhere('paciente_id', paciente_id);

    //G.logError(G.sqlformatter.format(query.toString()));

    query.then(function(resultado){
        callback(false, resultado[0]);
    }).catch(function(err){
        G.logError("err (/catch) FormulacionExternaModel [obtenerFormulaExternaTmp]: " +  err);
        callback({err:err, msj: "Se genero un error en obtenerFormulaExternaTmp"});
    });   
};

FormulacionExternaModel.prototype.buscarProductos = function(empresa_id, centro_utilidad, bodega_id, codigo_producto, principio_activo, descripcion, codigo_barras, pagina, callback){
    var columnas = [
        "exis.codigo_producto",
        G.knex.raw("CASE WHEN (exis.existencia - COALESCE(x.total,0)) >0 THEN (exis.existencia - COALESCE(x.total,0)) ELSE '0' END as existencia"),
        "invp.sw_requiereautorizacion_despachospedidos",
        G.knex.raw("fc_descripcion_producto_molecula(exis.codigo_producto) as molecula"),
        "invp.descripcion",
        "med.cod_principio_activo",
        G.knex.raw("CASE WHEN x.codigo_medicamento IS NOT NULL THEN 'style=\"width:100%;background:#00FF40;\" ' ELSE ''END as color"),
        G.knex.raw("COALESCE(inv.cantidad_max_formulacion,0)as cantidad_max_formulacion")
    ];

    var subQueryColumnas = [
        G.knex.raw("SUM(a.cantidad) as total"),
        "a.codigo_medicamento"
    ];

    var subquery = G.knex.select(subQueryColumnas)
            .from("esm_pendientes_por_dispensar AS a")
            .join("inventarios_productos as b", function(){
                this.on("a.codigo_medicamento" , "b.codigo_producto");
            })
            .join("esm_formula_externa as c", function(){
                this.on("a.formula_id", "c.formula_id")
            })
            .whereNotNull("b.tratamiento_id")
            .whereIn("c.sw_estado", ['0', '1'])
            .andWhere("a.sw_estado", "0")
            .andWhere("c.empresa_id", empresa_id)
            .andWhere("c.centro_utilidad", centro_utilidad)
            .andWhere("c.bodega", bodega_id)
            .groupBy("a.codigo_medicamento").as("x");

    var columnasExistenciasBodegas = ["codigo_producto", "existencia", "empresa_id", "centro_utilidad", "bodega", "estado"];

    var query = G.knex.select(columnas)
                    .from(function(){
                        this.select(columnasExistenciasBodegas)
                                            .from("existencias_bodegas")
                                            .where("empresa_id", empresa_id).andWhere("centro_utilidad", centro_utilidad).andWhere("bodega", bodega_id).andWhere("estado", "1").andWhere("codigo_producto", "ilike", '%' + codigo_producto + '%').as("exis");
                    })
                    .join("inventarios_productos as invp", function(){
                        this.on("exis.codigo_producto", "invp.codigo_producto");
                    })
                    .leftJoin("inventarios as inv", function(){
                        this.on("exis.codigo_producto", "inv.codigo_producto");
                        this.andOn("exis.empresa_id", "inv.empresa_id")
                    })
                    .leftJoin("medicamentos as med", function(){
                        this.on("invp.codigo_producto", "med.codigo_medicamento");
                    })
                    .leftJoin("inv_med_cod_principios_activos as ppa", function(){
                        this.on("med.cod_principio_activo", "ppa.cod_principio_activo")
                    })
                    .leftJoin(subquery, function(){
                        this.on("exis.codigo_producto", "x.codigo_medicamento")
                    })
                    .where('ppa.descripcion', 'ilike', '%' + principio_activo + '%').andWhere('invp.descripcion', 'ilike', '%' + descripcion + '%').andWhere('invp.codigo_barras', 'ilike', '%'+codigo_barras+'%');

    //G.logError(G.sqlformatter.format(query.toString()));

    query.limit(16).
    offset((pagina - 1) * G.settings.limit).then(function(resultado){   
        callback(false, resultado);
    }).catch(function(err){    
        G.logError("err (/catch) [buscarProductos]: " +  err);
        callback("Ha ocurrido un error");      
    });
};

FormulacionExternaModel.prototype.insertarMedicamentoTmp = function(tmp_formula_id, codigo_producto, cantidad, tiempo_tratamiento, unidad_tiempo_tratamiento, tipo_id_paciente, paciente_id, usuario_id, callback){
    var query = G.knex('esm_formula_externa_medicamentos_tmp')
    .insert({
        tmp_formula_id: tmp_formula_id,
        codigo_producto: codigo_producto,
        cantidad: cantidad,
        tiempo_tratamiento: tiempo_tratamiento,
        unidad_tiempo_tratamiento: unidad_tiempo_tratamiento,
        tipo_id_paciente: tipo_id_paciente,
        paciente_id: paciente_id,
        usuario_id: usuario_id
    }).returning('fe_medicamento_id');

    //G.logError(G.sqlformatter.format(query.toString()));

    query.then(function(resultado){
        callback(false, resultado[0]);
    }).catch(function(err){
        G.logError("err (/catch) FormulacionExternaModel [insertarMedicamentoTmp]: " +  err);
        callback({err:err, msj: "Se genero un error en insertarMedicamentoTmp"});   
    });
};

FormulacionExternaModel.prototype.obtenerMedicamentosTmp = function(tmp_formula_id ,callback){
    var columnas = [
                        'tmp.fe_medicamento_id',
                        'tmp.codigo_producto', 
                        G.knex.raw("fc_descripcion_producto_alterno(tmp.codigo_producto) as molecula"),
                        'tmp.cantidad',
                        'tmp.tiempo_tratamiento',
                        'tmp.unidad_tiempo_tratamiento',
                        'tmp.sw_marcado',
                        'tmp.sw_ocultar',
                        G.knex.raw("(select COALESCE(sum(cantidad_despachada), 0) from esm_dispensacion_medicamentos_tmp where formula_id_tmp = " + tmp_formula_id + " and codigo_producto = tmp.codigo_producto) as cantidad_despachada"),
                        G.knex.raw("cantidad - (select COALESCE(sum(cantidad_despachada), 0) from esm_dispensacion_medicamentos_tmp where formula_id_tmp = " + tmp_formula_id + " and codigo_producto = tmp.codigo_producto) as cantidad_pendiente")
                    ];

    var query = G.knex.select(columnas)
                        .from('esm_formula_externa_medicamentos_tmp as tmp')
                        .where('tmp.tmp_formula_id', tmp_formula_id);
    //G.logError(G.sqlformatter.format(query.toString()));
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err (/catch) FormulacionExternaModel [obtenerMedicamentosTmp]: " +  err);
        callback({err:err, msj: "Se genero un error en obtenerMedicamentosTmp"});
    });
};

FormulacionExternaModel.prototype.eliminarMedicamentoTmp = function(fe_medicamento_id ,callback){
    var query = G.knex('esm_formula_externa_medicamentos_tmp')
        .where('fe_medicamento_id', fe_medicamento_id)
        .del();

    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err (/catch) FormulacionExternaModel [eliminarMedicamentoTmp]: " +  err);
        callback({err:err, msj: "Se genero un error en eliminarMedicamentoTmp"});
    });
};

FormulacionExternaModel.prototype.consultaExisteFormula = function(tipo_id_paciente, paciente_id, formula_papel, callback){
    var query = G.knex.select('formula_id')
        .from('esm_formula_externa')
        .where('tipo_id_paciente', tipo_id_paciente)
        .andWhere('paciente_id', paciente_id)
        .andWhere('formula_papel', formula_papel)
        //G.logError(G.sqlformatter.format(query.toString()));
    query.then(function(resultado){
        existe = resultado[0] ? true : false;
        callback(false, existe);
    }).catch(function(err){
        G.logError("err (/catch) FormulacionExternaModel [consultaExisteFormula]: " +  err);
        callback({err:err, msj: "Se genero un error en consultaExisteFormula"});
    });
};


FormulacionExternaModel.prototype.obtenerLotesDeProducto = function(empresa_id, centro_utilidad, bodega, codigo_producto, formula_id_tmp, callback){

    var columna = ["invp.contenido_unidad_venta as concentracion", 
        "invsinv.descripcion as molecula",
        "invmcf.descripcion as forma_farmacologica",
        "invci.descripcion as laboratorio",
        "invp.descripcion as producto",
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

    var columnasExistenciasBodegasLote = ["empresa_id", "centro_utilidad", "codigo_producto", "lote", "ubicacion_id","bodega", "estado", "existencia_actual", "existencia_inicial", "fecha_registro", "fecha_vencimiento"];

    var query = G.knex.column(columna)
        .select(columna)
        .from(function(){
            this.select(columnasExistenciasBodegasLote)
                .from("existencias_bodegas_lote_fv")
                .where("empresa_id", empresa_id)
                .andWhere("centro_utilidad", centro_utilidad)
                .andWhere("bodega", bodega)
                .andWhere("existencia_actual", ">",  0)
                .andWhere("codigo_producto", codigo_producto)
                .orderBy("fecha_vencimiento", "ASC").as("fv");
        })
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
        });

        //G.logError(G.sqlformatter.format(query.toString()));
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err (/catch) FormulacionExternaModel [obtenerLotesDeProducto]: " +  err);
        callback({err:err, msj: "Se genero un error en "});
    });                       
};

FormulacionExternaModel.prototype.eliminarDispensacionesMedicamentoTmp  = function(fe_medicamento_id, callback){
    var query = G.knex.raw('DELETE FROM esm_dispensacion_medicamentos_tmp WHERE esm_dispen_tmp_id IN (SELECT esm_dispen_tmp_id\
                                                                                                        FROM esm_dispensacion_medicamentos_tmp edmt \
                                                                                                            INNER JOIN (SELECT tmp_formula_id, codigo_producto  \
                                                                                                                        FROM esm_formula_externa_medicamentos_tmp \
                                                                                                                        WHERE fe_medicamento_id = '+ fe_medicamento_id +') sefemt on (edmt.formula_id_tmp = sefemt.tmp_formula_id and edmt.codigo_producto = sefemt.codigo_producto))');
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err (/catch) FormulacionExternaModel [eliminarDispensacionesMedicamentoTmp]: " +  err);
        callback({err:err, msj: "Se genero un error mientras se elimiaban los medicamentos dispensados"});
    });   
};

FormulacionExternaModel.prototype.eliminarDispensacionMedicamentoTmp = function(esm_dispen_tmp_id, callback){
    var query = G.knex('esm_dispensacion_medicamentos_tmp')
        .where('esm_dispen_tmp_id', esm_dispen_tmp_id)
        .del();

    //G.logError(G.sqlformatter.format(query.toString()));
    
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [eliminarDispensacionMedicamentoTmp]: " + err);
        callback(err);
    });
};

FormulacionExternaModel.prototype.insertarDispensacionMedicamentoTmp = function(empresa_id, centro_utilidad, bodega, codigo_producto, cantidad_despachada, fecha_vencimiento, lote, codigo_formulado, usuario_id, sw_entregado_off, formula_id_tmp, cantidad_solicitada, callback){
    var tmp = {};
    G.knex.transaction(function(transaccion) {
        //se consulta primero la cantidad ya dispensada y almacenada en temporal.
        G.Q.nfcall(__cantidadProductoTemporal, formula_id_tmp, codigo_producto, transaccion).then(function(cantidadProductoTemporal){
            cantidad_despachada = parseInt(cantidad_despachada);
            cantidadProductoTemporal = parseInt(cantidadProductoTemporal);
            cantidad_solicitada = parseInt(cantidad_solicitada);
            //si la cantidad ya dispensada + la cantidad a despachar no supera la cantidad solicitada se inserta la dispensacion.
            if (cantidad_despachada + cantidadProductoTemporal <= cantidad_solicitada) {
                return G.Q.nfcall(__insertarDispensacionMedicamentoTmp, empresa_id, centro_utilidad, bodega, codigo_producto, cantidad_despachada, fecha_vencimiento, lote, codigo_formulado, usuario_id, sw_entregado_off, formula_id_tmp, transaccion);
            } else {
                throw 'La cantidad dispensada supera la cantidada solicitada.';
            }
        }).then(function(resultado){
            //Id de dispensacion temporal insertado
            tmp.esm_dispen_tmp_id = resultado[0];
            transaccion.commit();
        }).fail(function(err){
            G.logError("err FormulacionExternaModel [insertarDispensacionMedicamento]: " + err);
            transaccion.rollback(err);
        }).done();
    }).then(function(){
        callback(false, tmp.esm_dispen_tmp_id);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [insertarDispensacionMedicamento]: " + err);
        callback(err);
    }).done();
};

FormulacionExternaModel.prototype.obtenerDispensacionMedicamentosTmp = function(formula_id_tmp, callback){
    var columnas = [
        "esm_dispen_tmp_id",
        "codigo_producto",
        G.knex.raw("fc_descripcion_producto_molecula(codigo_producto) as molecula"),
        "cantidad_despachada",
        "fecha_vencimiento",
        "lote",
    ];

    var query = G.knex.select(columnas)
    .from('esm_dispensacion_medicamentos_tmp')
    .where('formula_id_tmp', formula_id_tmp);

    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [obtenerDispensacionMedicamentosTmp]: " + err);
        callback(err);
    }).done();
};

/*
INSERT INTO esm_formula_externa (formula_id, empresa_id, centro_utilidad, bodega, formula_papel, fecha_formula, tipo_formula, tipo_id_tercero, tercero_id, tipo_id_paciente, paciente_id, plan_id, rango, tipo_afiliado_id, usuario_id,
sw_estado, sw_autorizado, usuario_autoriza_id, observacion_autorizacion, fecha_registro_autorizacion, tipo_pais_id, tipo_dpto_id, tipo_mpio_id)
*/
FormulacionExternaModel.prototype.generarEntrega = function(formula_id_tmp, callback){
    var tmp = {};

    G.knex.transaction(function(transaccion) {
        //se consulta primero la cantidad ya dispensada y almacenada en temporal.
        G.Q.nfcall(__cantidadProductoTemporal, formula_id_tmp, codigo_producto, transaccion).then(function(cantidadProductoTemporal){
            cantidad_despachada = parseInt(cantidad_despachada);
            cantidadProductoTemporal = parseInt(cantidadProductoTemporal);
            cantidad_solicitada = parseInt(cantidad_solicitada);
            //si la cantidad ya dispensada + la cantidad a despachar no supera la cantidad solicitada se inserta la dispensacion.
            if (cantidad_despachada + cantidadProductoTemporal <= cantidad_solicitada) {
                return G.Q.nfcall(__insertarDispensacionMedicamentoTmp, empresa_id, centro_utilidad, bodega, codigo_producto, cantidad_despachada, fecha_vencimiento, lote, codigo_formulado, usuario_id, sw_entregado_off, formula_id_tmp, transaccion);
            } else {
                throw 'La cantidad dispensada supera la cantidada solicitada.';
            }
        }).then(function(resultado){
            //Id de dispensacion temporal insertado
            tmp.esm_dispen_tmp_id = resultado[0];
            transaccion.commit();
        }).fail(function(err){
            G.logError("err FormulacionExternaModel [insertarDispensacionMedicamento]: " + err);
            transaccion.rollback(err);
        }).done();
    }).then(function(){
        callback(false, tmp.esm_dispen_tmp_id);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [insertarDispensacionMedicamento]: " + err);
        callback(err);
    }).done();
};

function __insertarDispensacionMedicamentoTmp(empresa_id, centro_utilidad, bodega, codigo_producto, cantidad_despachada, fecha_vencimiento, lote, codigo_formulado, usuario_id, sw_entregado_off, formula_id_tmp, transaccion, callback){
    var query = G.knex('esm_dispensacion_medicamentos_tmp')
    .insert({
        empresa_id : empresa_id,
        centro_utilidad: centro_utilidad,
        bodega: bodega,
        codigo_producto: codigo_producto,
        cantidad_despachada: cantidad_despachada,
        fecha_vencimiento: fecha_vencimiento,
        lote: lote,
        codigo_formulado: codigo_formulado,
        usuario_id: usuario_id,
        sw_entregado_off: sw_entregado_off,
        formula_id_tmp : formula_id_tmp
    }).returning('esm_dispen_tmp_id');

    if(transaccion) query.transacting(transaccion);
        query.then(function(resultado){
            callback(false, resultado);
    }).catch(function(err){
        G.logError("err (/catch) [__insertarDispensacionMedicamentoTmp]: " +  err);
        callback(err);
    });
};

function __cantidadProductoTemporal(formula_id_tmp, codigo_producto, transaccion, callback) {
    var columnas = [
        G.knex.raw("COALESCE(sum(cantidad_despachada),0) as total")
    ];

    var query = G.knex.select(columnas).from("esm_dispensacion_medicamentos_tmp").where("codigo_formulado", codigo_producto).andWhere("formula_id_tmp", formula_id_tmp);

    //G.logError(G.sqlformatter.format(query.toString()));

    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){            
            callback(false, resultado[0].total);
    }).catch(function(err){
        G.logError("err (/catch) [__cantidadProductoTemporal]: " +  err);
        callback(err);   
    });
};

function __insertarFormulaExterna(empresa_id, centro_utilidad, bodega, formula_papel, fecha_formula, tipo_id_tercero, tercero_id, tipo_id_paciente, paciente_id, plan_id, rango, tipo_afiliado_id, usuario_id, sw_estado, sw_autorizado, usuario_autoriza_id, observacion_autorizacion, fecha_registro_autorizacion, tipo_pais_id, tipo_dpto_id, tipo_mpio_id, transaccion, callback){
    var query = G.knex('esm_formula_externa')
    .insert({
        empresa_id : empresa_id,
        centro_utilidad : centro_utilidad,
        bodega : bodega,
        formula_papel: formula_papel,
        fecha_formula : fecha_formula,
        tipo_formula : tipo_formula,
        tipo_id_tercero : tipo_id_tercero,
        tercero_id : tercero_id,
        tipo_id_paciente : tipo_id_tercero,
        tercero_id : tercero_id,
        tipo_id_paciente : tipo_id_paciente,
        paciente_id : paciente_id,
        plan_id : plan_id,
        rango : rango,
        tipo_afiliado_id : tipo_afiliado_id,
        usuario_id : usuario_id,
        sw_estado : sw_estado,
        sw_autorizado : sw_autorizado,
        usuario_autoriza_id : usuario_autoriza_id,
        observacion_autorizacion : observacion_autorizacion,
        fecha_registro_autorizacion : fecha_registro_autorizacion,
        tipo_pais_id : tipo_pais_id,
        tipo_dpto_id : tipo_dpto_id,
        tipo_mpio_id : tipo_mpio_id
    }).returning('formula_id');

    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){
            callback(false, resultado[0].total);
    }).catch(function(err){
        G.logError("err (/catch) [__insertarFormulaESM]: " +  err);
        callback(err);
    });
};

function __insertaFormulaExternaDiagnosticos(fe_diagnostico_id, formula_id, diagnostico_id, transaccion, callback){
    var query = G.knex('esm_formula_externa_diagnosticos')
        .insert({
            formula_id : formula_id, 
            diagnostico_id : diagnostico_id
        });

    if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){            
            callback(false, resultado[0].total);
    }).catch(function(err){
        G.logError("err (/catch) [__insertarFormulaExternaDianosticos]: " +  err);
        callback(err);   
    });
};

function __insertarFormulaExternaMedicamentos(fomrula_id, codigo_producto, cantidad, tiempo_tratamiento, unidad_tiempo_tratamiento, sw_marcado, sw_autorizado, usuario_autoriza_id, observacion_autorizacion, fecha_registro_autorizacion,transaccion, callback){
    var query = G.knex('esm_formula_externa_medicamentos')
        .insert({
            formula_id : formula_id, 
            codigo_producto  : codigo_producto, 
            cantidad : cantidad,
            tiempo_tratamiento : tiempo_tratamiento,
            unidad_tiempo_tratamiento : unidad_tiempo_tratamiento,
            sw_marcado : sw_marcado,
            sw_autorizado : sw_autorizado,
            usuario_autoriza_id : usuario_autoriza_id,
            observacion_autorizacion : observacion_autorizacion,
            fecha_registro_autorizacion : fecha_registro_autorizacion
        });

     if(transaccion) query.transacting(transaccion);     
        query.then(function(resultado){            
            callback(false, resultado[0].total);
    }).catch(function(err){
        G.logError("err (/catch) [__insertarFormulaExternaMedicamentos]: " +  err);
        callback(err);   
    });   
};


FormulacionExternaModel.$inject = [];

module.exports = FormulacionExternaModel;