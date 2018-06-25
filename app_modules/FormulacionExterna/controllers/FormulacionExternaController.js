
var FormulacionExterna = function(m_formulacion_externa, m_dispensacion_hc) {
    this.m_formulacionExterna = m_formulacion_externa;
    this.m_dispensacion_hc = m_dispensacion_hc;
};

FormulacionExterna.prototype.obtenerAfiliado = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;
    var tmp = {afiliado : null};

    G.Q.ninvoke(that.m_formulacionExterna,'existeFormulaTmp', args.tipoIdentificacion, args.identificacion).then(function(resultado){
        if(resultado.length > 0){
            //compara si el usuario actual es el mismo que esta intentando digitar la formula
            var registro = resultado[0];
            if(registro.usuario_id != usuario_id){
                res.send(G.utils.r(req.url, 'Ya se esta digitando una formula para el paciente', 404, resultado[0]));
                return;
            }
        }
        return G.Q.ninvoke(that.m_formulacionExterna,'obtenerAfiliado', args.tipoIdentificacion, args.identificacion);
    }).then(function(resultado){
        //tabla donde estan todos los planes --> estructura_planes
        if(resultado.length > 0){
            tmp.afiliado = resultado[0];
            return [];
        }

        return G.Q.ninvoke(that.m_formulacionExterna,'obtenerEstructurasPlanes');
    }).then(function(estructurasPlanes){

        if(estructurasPlanes.length > 0){
            console.log('entra a if estructurasPlanes');
            //tmp.afiliado = resultado[0];
            return G.Q.ninvoke(that.m_formulacionExterna,'obtenerAfiliadosExternos',estructurasPlanes, args.tipoIdentificacion, args.identificacion);
        }

        return [];
    }).then(function(afiliadoExterno){

        if(afiliadoExterno.length > 0){
            tmp.afiliado = afiliadoExterno[0];
        }
        res.send(G.utils.r(req.url, 'obtiene afiliado', 200, tmp.afiliado));
    }).fail(function(err){
        G.logError("FormulacionExternaController [obtenerAfiliado] " + err);
        res.send(G.utils.r(req.url, 'error al obtenerAfiliado', 500, err));
    }).done();
}

FormulacionExterna.prototype.obtenerMunicipios = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerMunicipios', args.term).then(function(municipios){
        res.send(G.utils.r(req.url, 'obtener municipio', 200, municipios));
    }).fail(function(err){
        G.logError("FormulacionExternaController [obtenerMunicipios] " + err);
        res.send(G.utils.r(req.url, 'error al obtenerMunicipios', 500, err));
    }).done();
}

FormulacionExterna.prototype.obtenerDiagnosticos = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerDiagnosticos', args.tipo_id_paciente, args.paciente_id, args.codigo, args.diagnostico).then(function(municipios){
        res.send(G.utils.r(req.url, 'obtener diagnosticos', 200, municipios));
    }).fail(function(err){
        G.logError("FormulacionExternaController [obtenerDiagnosticos] " + err);
        res.send(G.utils.r(req.url, 'error al obtenerDiagnosticos', 500, err));
    }).done();
}

FormulacionExterna.prototype.obtenerDiagnosticosTmp = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerDiagnosticosTmp', args.tmp_formula_id).then(function(diagnosticos){
        res.send(G.utils.r(req.url, 'obtener diagnosticos tmp', 200, diagnosticos));
    }).fail(function(err){
        G.logError("FormulacionExternaController [obtenerDiagnosticosTmp] " + err);
        res.send(G.utils.r(req.url, 'error al obtenerDiagnosticosTmp', 500, err));
    }).done();
}

FormulacionExterna.prototype.obtenerProfesionales = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerProfesionales', args.term).then(function(profesionales){
        res.send(G.utils.r(req.url, 'obtener profesionales', 200, profesionales));
    }).fail(function(err){
        G.logError("FormulacionExterna [obtenerProfesionales] " + err);
        res.send(G.utils.r(req.url, 'error al obtener profesionales', 500, err));
    }).done();
}

FormulacionExterna.prototype.eliminarDiagnosticoTmp = function(req, res){
    var that = this;
    var args = req.body.data;
    
    G.Q.ninvoke(that.m_formulacionExterna,'eliminarDiagnosticoTmp', args.tmp_formula_id, args.diagnostico_id).then(function(data){
        res.send(G.utils.r(req.url, 'eliminar diagnosticosTmp', 200, {}));
    }).fail(function(err){
        G.logError("FormulacionExterna [eliminarDiagnosticoTmp] " + err);
        res.send(G.utils.r(req.url, 'error elimina diagnosticosTmp ', 500, err));
    }).done();
}

FormulacionExterna.prototype.insertarDiagnosticoTmp = function(req, res){
    var that = this;
    var args = req.body.data;

    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'insertarDiagnosticoTmp', args.tmp_formula_id, usuario_id, args.tipo_id_paciente, args.paciente_id, args.diagnostico_id).then(function(diagnosticoTmpId){
        res.send(G.utils.r(req.url, 'insertar diagnostico tmp', 200, diagnosticoTmpId));
    }).fail(function(err){
        G.logError("FormulacionExterna [insertarDiagnosticoTmp] " + err);
        res.send(G.utils.r(req.url, 'error insertar diagnostico tmp', 500, err));
    }).done();
}

FormulacionExterna.prototype.insertarFormulaTmp = function(req, res){
    var that = this;
    var args = req.body.data;

    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'insertarFormulaTmp', args.formula_papel, args.empresa_id, args.fecha_formula, args.tipo_formula, args.tipo_id_tercero, args.tercero_id, args.tipo_id_paciente, args.paciente_id, args.plan_id, args.rango, args.tipo_afiliado_id, usuario_id, args.centro_utilidad, args.bodega, args.tipo_pais_id, args.tipo_dpto_id, args.tipo_mpio_id).then(function(formula_id){
        res.send(G.utils.r(req.url, 'inserta formulaTmp', 200, {'tmp_formula_id' : formula_id}));
    }).fail(function(err){
        G.logError("FormulacionExterna [insertarFormulaTmp] " + err);
        res.send(G.utils.r(req.url, 'error insertar formulaTmp', 500, err));
    }).done();
}

FormulacionExterna.prototype.actualizarFormulaExternaTmp = function(req, res){
    var that = this;
    var args = req.body.data;

    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'actualizarFormulaExternaTmp', args.tmp_formula_id ,args.formula_papel, args.empresa_id, args.fecha_formula, args.tipo_formula, args.tipo_id_tercero, args.tercero_id, args.tipo_id_paciente, args.paciente_id, args.plan_id, args.rango, args.tipo_afiliado_id, usuario_id, args.centro_utilidad, args.bodega, args.tipo_pais_id, args.tipo_dpto_id, args.tipo_mpio_id).then(function(formula_id){
        res.send(G.utils.r(req.url, 'actualizar formulaTmp', 200, {'tmp_formula_id' : formula_id}));
    }).fail(function(err){
        G.logError("FormulacionExterna [actualizarFormulaExternaTmp] " + err);
        res.send(G.utils.r(req.url, 'error actualizar formulaTmp', 500, err));
    }).done();
}

FormulacionExterna.prototype.obtenerFormulaExternaTmp = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerFormulaExternaTmp', args.tipo_id_paciente, args.paciente_id).then(function(formulaExternaTmp){
        res.send(G.utils.r(req.url, 'obtener formulaExternaTmp', 200, formulaExternaTmp));
    }).fail(function(err){
        G.logError("FormulacionExterna [obtenerFormulaExternaTmp] " + err);
        res.send(G.utils.r(req.url, 'error obtener formulaExternaTmp', 500, err));
    }).done();
}

FormulacionExterna.prototype.buscarProductos = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'buscarProductos', args.empresa_id, args.centro_utilidad, args.bodega_id,  args.principio_activo, args.descripcion, args.codigo_barras, args.pagina).then(function(formulaExternaTmp){
        res.send(G.utils.r(req.url, 'obtener formulaExternaTmp', 200, formulaExternaTmp));
    }).fail(function(err){
        G.logError("FormulacionExterna [buscarProductos] " + err);
        res.send(G.utils.r(req.url, 'error obtener productos', 500, err));
    }).done();
}

FormulacionExterna.prototype.buscarProductosPorPrincipioActivo = function(req, res){
    var that = this;
    var args = req.body.data;
//empresa_id, centro_utilidad, bodega_id, principio_activo, pagina, 
    G.Q.ninvoke(that.m_formulacionExterna,'buscarProductosPorPrincipioActivo', args.empresa_id, args.centro_utilidad, args.bodega_id,  args.principio_activo, args.pagina).then(function(formulaExternaTmp){
        res.send(G.utils.r(req.url, 'obtener formulaExternaTmp', 200, formulaExternaTmp));
    }).fail(function(err){
        G.logError("FormulacionExterna [buscarProductosPorPrincipioActivo] " + err);
        res.send(G.utils.r(req.url, 'error obtener productos', 500, err));
    }).done();
}

FormulacionExterna.prototype.insertarMedicamentoTmp = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'medicamentoEstaInsertado',args.tmp_formula_id, args.codigo_producto).then(function(resultado){
        if(resultado.length > 0){
            throw 'El medicamento ya fue registrado';
        }

        return G.Q.ninvoke(that.m_formulacionExterna,'insertarMedicamentoTmp',args.tmp_formula_id, args.codigo_producto, args.cantidad, args.tiempo_tratamiento, args.unidad_tiempo_tratamiento, args.tipo_id_paciente, args.paciente_id, usuario_id);
    }).then(function(fe_medicamento_id){
        res.send(G.utils.r(req.url, 'inserto medicamento tmp', 200, fe_medicamento_id));
    }).fail(function(err){
        G.logError("FormulacionExterna [insertarMedicamentoTmp] " + err);
        res.send(G.utils.r(req.url, 'error insertando medicamentoTmp', 500, err));
    }).done();
}

FormulacionExterna.prototype.obtenerMedicamentosTmp = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerMedicamentosTmp',args.tmp_formula_id).then(function(medicamentosTmp){
        res.send(G.utils.r(req.url, 'obtuvo medicamentoTmp', 200, medicamentosTmp));
    }).fail(function(err){
        G.logError("FormulacionExterna [obtenerMedicamentosTmp] " + err);
        res.send(G.utils.r(req.url, 'error insertando medicamentoTmp', 500, err));
    }).done();
}

FormulacionExterna.prototype.eliminarMedicamentoTmp = function(req, res){
    var that = this;
    var args = req.body.data;

    //primero elimina la dispensacion del medicamento temporal
    G.Q.ninvoke(that.m_formulacionExterna,'eliminarDispensacionesMedicamentoTmp', args.fe_medicamento_id).then(function(data){
        //elimina el medicamento temporal
        return G.Q.ninvoke(that.m_formulacionExterna,'eliminarMedicamentoTmp',args.fe_medicamento_id);
    }).then(function(){
        res.send(G.utils.r(req.url, 'Eliminar Medicamento tmp', 200, {}));
    }).fail(function(err){
        G.logError("FormulacionExterna [eliminarDiagnosticoTmp] " + err);
        res.send(G.utils.r(req.url, 'error elimina diagnosticoTmp ', 500, err));
    }).done();
}

FormulacionExterna.prototype.consultaExisteFormula = function(req, res){
    var that = this;
    var args = req.body.data;
    
    G.Q.ninvoke(that.m_formulacionExterna,'consultaExisteFormula',args.tipo_id_paciente, args.paciente_id, args.formula_papel).then(function(existe){
        res.send(G.utils.r(req.url, 'consulta existe formula', 200, existe));
    }).fail(function(err){
        G.logError("FormulacionExterna [consultaExisteFormula] " + err);
        res.send(G.utils.r(req.url, 'error consultaExisteFormula', 500, err));
    }).done();
}

FormulacionExterna.prototype.obtenerLotesDeProducto = function(req, res){
    var that = this;
    var args = req.body.data;
    var def = G.Q.defer();

    var today = new Date();
    var formato = 'YYYY-MM-DD';
    var fechaRegistro = "";
    var fechaDespacho = "";
    var fechaExtTicinco=G.moment().subtract(25,'days').format(formato);
    var fechaToday = G.moment(today).format(formato);

    var parametrosUltimoRegistroDispensacion = {
        tipoIdPaciente: args.tipo_paciente_id,
        pacienteId:args.paciente_id,
        principioActivo: args.principio_activo, 
        producto: args.codigo_producto,
        fechaDia: fechaExtTicinco,
        today: fechaToday,
        movimientoFormulaPaciente: 1
    };

    G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimoRegistroDispensacion', parametrosUltimoRegistroDispensacion).then(function(resultado){
        if(resultado.length > 0){ 
            fechaRegistro = resultado[0].fecha_registro;
        }

        if(fechaToday >= fechaRegistro){
            if(!fechaRegistro){                
                 fechaDespacho = fechaExtTicinco;
            }else{
                fechaDespacho = fechaRegistro;
            }
        }
 
        var fechaActual = G.moment(fechaToday);
        var fechaUltimaEntregaProducto  = G.moment(fechaDespacho);
        var diferenciaDeDias = fechaActual.diff(fechaUltimaEntregaProducto, 'days');

        if(diferenciaDeDias > 23 || args.existenciasBodegas.autorizado === '1' || args.existenciasBodegas.autorizado === ""){
            return G.Q.ninvoke(that.m_formulacionExterna,'obtenerLotesDeProducto', args.empresa_id, args.centro_utilidad, args.bodega, args.codigo_producto, args.formula_id_tmp);
        }else{
            def.resolve();             
            throw {msj: resultado, codigo: 204};
        }
    }).then(function(lotesProducto){
        if(lotesProducto || lotesProducto.length > 0){
             res.send(G.utils.r(req.url, 'Lotes del producto', 200, lotesProducto));
        }else{
             res.send(G.utils.r(req.url, 'Lotes del producto', 200, []));
        }
    }).fail(function(err){     
        G.logError('FormulacionExterna  [obtenerLotesDeProducto] ' + err);
        res.send(G.utils.r(req.url, err.msj, err.codigo, {existenciasBodegas: []}));
    }).done(); 
}

FormulacionExterna.prototype.insertarDispensacionMedicamentoTmp = function(req, res){
    var that = this;
    var args = req.body.data;

    var usuario_id = req.session.user.usuario_id;
    G.Q.ninvoke(that.m_formulacionExterna,'verificarLoteEstaInsertado', args.formula_id_tmp, args.codigo_producto, args.fecha_vencimiento, args.lote).then(function(resultado){
        if(resultado.length > 0){
            throw 'El lote ya se encuentra registrado en temporal';
        }else{
            return G.Q.ninvoke(that.m_formulacionExterna,'insertarDispensacionMedicamentoTmp', args.empresa_id, args.centro_utilidad, args.bodega, args.codigo_producto, args.cantidad_despachada, args.fecha_vencimiento, args.lote, args.codigo_producto, usuario_id, 0, args.formula_id_tmp, args.formula_id, args.cantidad_solicitada);
        }
    }).then(function(esm_dispen_tmp_id){
    //G.Q.ninvoke(that.m_formulacionExterna,'insertarDispensacionMedicamentoTmp', args.empresa_id, args.centro_utilidad, args.bodega, args.codigo_producto, args.cantidad_despachada, args.fecha_vencimiento, args.lote, args.codigo_producto, usuario_id, 0, args.formula_id_tmp, args.formula_id, args.cantidad_solicitada).then(function(esm_dispen_tmp_id){
        res.send(G.utils.r(req.url, 'Inserto dispensacion medicamento', 200, esm_dispen_tmp_id));
    }).fail(function(err){
        console.log('el resultado ', err);
        G.logError("FormulacionExterna [insertarDispensacionMedicamentoTmp] " + err);
        res.send(G.utils.r(req.url, 'Error insertando dispensacion medicamento', 500, err));
    }).done();
}

FormulacionExterna.prototype.eliminarDispensacionMedicamentoTmp  = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'eliminarDispensacionMedicamentoTmp', args.esm_dispen_tmp_id).then(function(resultado){
        res.send(G.utils.r(req.url, 'se elimino la dispensacion del medicamento', 200, resultado));
    }).fail(function(err){
        G.logError("FormulacionExterna [eliminarDispensacionMedicamentoTmp] " + err);
        res.send(G.utils.r(req.url, 'Error eliminando dispensacion medicamento tmp', 500, err));
    }).done();
}

FormulacionExterna.prototype.obtenerDispensacionMedicamentosTmp  = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerDispensacionMedicamentosTmp', args.formula_id_tmp, args.formula_id).then(function(resultado){
        res.send(G.utils.r(req.url, 'se elimino la dispensacion del medicamento', 200, resultado));
    }).fail(function(err){
        G.logError("FormulacionExterna [obtenerDispensacionMedicamentosTmp] " + err);
        res.send(G.utils.r(req.url, 'Error eliminando dispensacion medicamento tmp', 500, err));
    }).done();
}

FormulacionExterna.prototype.updateAutorizacionPorMedicamento  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'updateAutorizacionPorMedicamento', args.fe_medicamento_id, args.observacion_autorizacion, usuario_id).then(function(resultado){
        res.send(G.utils.r(req.url, 'autoriza el medicamento', 200, resultado));
    }).fail(function(err){
        G.logError("FormulacionExterna [updateAutorizacionPorMedicamento] " + err);
        res.send(G.utils.r(req.url, 'Error actualizando autoriza el medicamento', 500, err));
    }).done();
}

FormulacionExterna.prototype.buscarFormulas  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;


    G.Q.ninvoke(that.m_formulacionExterna,'buscarFormulas', args.fecha_inicial, args.fecha_final, args.nombre_paciente, args.formula_papel, args.tipo_id_paciente, args.paciente_id, args.pagina).then(function(resultado){
        res.send(G.utils.r(req.url, 'resultado buscar formulas', 200, resultado));
    }).fail(function(err){
        G.logError("FormulacionExterna [buscarFormulas] " + err);
        res.send(G.utils.r(req.url, 'buscarFormulas', 500, err));
    }).done();
}

FormulacionExterna.prototype.insertarLlamadaPacientes  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'insertarLlamadaPacientes', args.formula_id, args.contacto_nombre, args.contacto_parentezco, args.observacion, args.tel_contacto, usuario_id).then(function(resultado){
        res.send(G.utils.r(req.url, 'resultado insertarLlamadaPacientes', 200, resultado));
    }).fail(function(err){
        console.log('error ', err);
        G.logError("FormulacionExterna [buscarFormulas] " + err);
        res.send(G.utils.r(req.url, 'buscarFormulas', 500, err));
    }).done();
}

FormulacionExterna.prototype.listarLlamadasPacientes  = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'listarLlamadasPacientes', args.formula_id).then(function(resultado){
        res.send(G.utils.r(req.url, 'resultado listarLlamadasPacientes', 200, resultado));
    }).fail(function(err){
        console.log('error ', err);
        G.logError("FormulacionExterna [listarLlamadasPacientes] " + err);
        res.send(G.utils.r(req.url, 'listarLlamadasPacientes', 500, err));
    }).done();
}

FormulacionExterna.prototype.listarMedicamentosPendientes  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'listarMedicamentosPendientesPorDispensar', args.formula_id).then(function(resultado){
        res.send(G.utils.r(req.url, 'resultado listarMedicamentosPendientes', 200, resultado));
    }).fail(function(err){
        G.logError("FormulacionExterna [listarMedicamentosPendientes] " + err);
        res.send(G.utils.r(req.url, 'listarMedicamentosPendientes', 500, err));
    }).done();
}

FormulacionExterna.prototype.inactivarPendiente  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'inactivarPendiente', args.esm_pendiente_dispensacion_id).then(function(resultado){
        res.send(G.utils.r(req.url, 'resultado inactivarPendiente', 200, resultado));
    }).fail(function(err){
        G.logError("FormulacionExterna [inactivarPendiente] " + err);
        res.send(G.utils.r(req.url, 'inactivarPendiente', 500, err));
    }).done();
}

FormulacionExterna.prototype.marcar  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'marcar', args.fe_medicamento_id, args.sw_marcado).then(function(resultado){
        res.send(G.utils.r(req.url, 'resultado marcar', 200, resultado));
    }).fail(function(err){
        G.logError("FormulacionExterna [marcar] " + err);
        res.send(G.utils.r(req.url, 'marcar', 500, err));
    }).done();
}

FormulacionExterna.prototype.guardarNuevaCantidadPendiente  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'guardarNuevaCantidadPendiente', args.esm_pendiente_dispensacion_id, args.cantidad).then(function(resultado){
        res.send(G.utils.r(req.url, 'guarda nueva cantidad pendiente', 200, resultado));
    }).fail(function(err){
        G.logError("FormulacionExterna [guardarNuevaCantidadPendiente] " + err);
        res.send(G.utils.r(req.url, 'guardarNuevaCantidadPendiente', 500, err));
    }).done();
}

FormulacionExterna.prototype.cambiarCodigoPendiente  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;
    console.log('los argmumentos', args);

    G.Q.ninvoke(that.m_formulacionExterna,'cambiarCodigoPendientePorDispensar',  args.esm_pendiente_dispensacion_id, args.codigo_medicamento).then(function(resultado){
        return G.Q.ninvoke(that.m_formulacionExterna,'cambiarCodigoFormulaExternaMedicamentos',args.formula_id, args.codigo_cambiar, args.codigo_medicamento ); 
    }).then(function(resultado){
        res.send(G.utils.r(req.url, 'resultado cambiarCodigoPendiente', 200, resultado));
    }).fail(function(err){
        console.log('el error ------------------>', err);
        G.logError("FormulacionExterna [cambiarCodigoPendiente] " + err);
        res.send(G.utils.r(req.url, 'cambiarCodigoPendiente', 500, err));
    }).done();
}

FormulacionExterna.prototype.generarEntrega  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    var tmp = {};
    //Pasa la formula de temporal a las tablas finales
    G.Q.ninvoke(that.m_formulacionExterna,'registrarFormulaReal', args.formula_id_tmp, args.empresa_id, args.centro_utilidad, args.bodega, usuario_id).then(function(formula_id){
        console.log('registrarFormulaReal', formula_id);
        tmp.formula_id = formula_id;
        //consultar el id del documento de bodega
        var parametroBodegaDocId = {variable:"documento_dispensacion_"+args.empresa_id+"_"+args.bodega, tipoVariable:1, modulo:'Formulacion_Externa'};
        return G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametroBodegaDocId); 
    }).then(function(resultado){
        console.log('estadoParametrizacionReformular', resultado);
        if(resultado.length > 0){
            tmp.bodegasDocId = resultado[0].valor;          
            return G.Q.ninvoke(that.m_dispensacion_hc,'asignacionNumeroDocumentoDespacho',{bodegasDocId: tmp.bodegasDocId}); 
        }else{
            throw 'El id del documento de bodega no se encuentra parametrizado'
        }
    }).then(function(resultado){
        console.log('asignacionNumeroDocumentoDespacho', resultado);
        tmp.numeracion = resultado[0];
        return G.Q.ninvoke(that.m_formulacionExterna,'generarDispensacionFormula', args.empresa_id, args.centro_utilidad, args.bodega, args.plan, tmp.bodegasDocId, tmp.numeracion, args.formula_id_tmp, tmp.formula_id, args.observacion, usuario_id, args.todo_pendiente); 
    }).then(function(resultado){
        console.log('generarDispensacionFormula', resultado);
        var resultado = {
            formula_id : tmp.formula_id,
            generoPendientes : resultado.generoPendientes
        } 
        res.send(G.utils.r(req.url, 'Entrega generada', 200, resultado));
    }).fail(function(err){
        console.log('el error', err);
        G.logError("FormulacionExterna [generarEntrega] " + err);
        res.send(G.utils.r(req.url, 'Error generando entrega', 500, err));
    }).done();
}

FormulacionExterna.prototype.generarEntregaPendientes  = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    var tmp = {};
    //Pasa la formula de temporal a las tablas finales
    var parametroBodegaDocId = {variable:"documento_dispensacion_"+args.empresa_id+"_"+args.bodega, tipoVariable:1, modulo:'Formulacion_Externa'};
    G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular', parametroBodegaDocId).then(function(resultado){
        if(resultado.length > 0){
            tmp.bodegasDocId = resultado[0].valor;
            return G.Q.ninvoke(that.m_dispensacion_hc,'asignacionNumeroDocumentoDespacho',{bodegasDocId: tmp.bodegasDocId});
        }else{
            throw 'El id del documento de bodega no se encuentra parametrizado';
        }
    }).then(function(resultado){
        tmp.numeracion = resultado[0];
        return G.Q.ninvoke(that.m_formulacionExterna,'generarDispensacionFormulaPendientes', args.empresa_id, args.centro_utilidad, args.bodega, args.plan, tmp.bodegasDocId, tmp.numeracion, args.formula_id, args.observacion, usuario_id, args.todo_pendiente); 
    }).then(function(resultado){
        var resultado = {
            formula_id : tmp.formula_id,
            generoPendientes : resultado.generoPendientes
        } 
        res.send(G.utils.r(req.url, 'Entrega generada', 200, resultado));
    }).fail(function(err){
        console.log('el error', err);
        G.logError("FormulacionExterna [generarEntrega] " + err);
        res.send(G.utils.r(req.url, 'Error generando entrega', 500, err));
    }).done();
}

FormulacionExterna.prototype.imprimirMedicamentosPendientesPorDispensar = function(req, res){
    var that = this;
    var args = req.body.data;

    var tmp = {};
    var date = new Date();
    tmp.fecha_impresion = date.getFullYear()  + '-' +("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '  (' + ("0" + date.getHours()).slice(-2) +':'+ ("0" + date.getMinutes()).slice(-2) + ':' + ("0" + date.getSeconds()).slice(-2) +')';
   
    G.Q.ninvoke(that.m_formulacionExterna,'listarMedicamentosPendientesPorDispensarNoOcultos', args.formula_id).then(function(resultado){
        if(resultado.length > 0){
            tmp.pendientes = resultado;
            return G.Q.ninvoke(that.m_formulacionExterna,'obtenerCabeceraFormula', args.formula_id)
        }else{
           throw 'No hay pendientes por dispensar';
        }
   }).then(function(resultado){
        if(resultado.length > 0){
            tmp.formula = resultado[0];          

            return G.Q.ninvoke(that.m_formulacionExterna,'obtenerDiagnosticosDeFormula', args.formula_id)
        }else{
           throw 'Error recuperando formula';
        }
   }).then(function(resultado){
        tmp.diagnosticos = resultado; 
        var parametrosPDF = {
                        serverUrl:req.protocol + '://' + req.get('host')+ "/", 
                        formula: tmp.formula, 
                        pendientes: tmp.pendientes,//resultado[0],
                        diagnosticos: tmp.diagnosticos, 
                        fecha_impresion : tmp.fecha_impresion,
                        archivoHtml: 'medicamentosPendientesPorDispensar.html',
                        reporte: "Medicamentos_pendientes_por_dispensar_"
                    };

        __generarPdf(parametrosPDF, function(nombre_pdf) {
            res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{
                listar_medicamentos_pendientes: {nombre_pdf: nombre_pdf, resultados: tmp.pendientes}
            }));
        });
    }).fail(function(err){
        G.logError("FormulacionExterna [imprimirMedicamentosPendientesPorDispensar] Error " + err)
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

FormulacionExterna.prototype.imprimirMedicamentosDispensados = function(req, res){
    var that = this;
    var args = req.body.data;
    var tmp = {};
    var date = new Date();
    tmp.fecha_impresion = date.getFullYear()  + '-' +("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '  (' + ("0" + date.getHours()).slice(-2) +':'+ ("0" + date.getMinutes()).slice(-2) + ':' + ("0" + date.getSeconds()).slice(-2) +')';

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerCabeceraFormula', args.formula_id).then(function(resultado){
        tmp.formula = resultado[0];
        return G.Q.ninvoke(that.m_formulacionExterna,'listarMedicamentosEsmXLote', args.formula_id, args.imprimir_actual);
    }).then(function(resultado){
        tmp.dispensados = resultado;
        return G.Q.ninvoke(that.m_formulacionExterna,'obtenerDiagnosticosDeFormula', args.formula_id);
    }).then(function(resultado){
        tmp.diagnosticos = resultado;
        var parametrosPDF = {
            serverUrl:req.protocol + '://' + req.get('host')+ "/", 
            formula: tmp.formula, 
            dispensados: tmp.dispensados,
            diagnosticos: tmp.diagnosticos, 
            esDispensacionPendientes : false,
            fecha_impresion : tmp.fecha_impresion,
            archivoHtml: 'medicamentosDispensados.html',
            reporte: "Medicamentos_dispensados_"
        };
        __generarPdf(parametrosPDF, function(nombre_pdf) {
            res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{
                listar_medicamentos_pendientes: {nombre_pdf: nombre_pdf, resultados: tmp.dispensados}
            }));
        });
    }).fail(function(err){
        G.logError("FormulacionExterna [imprimirMedicamentosDispensados] Error imprimiendo medicamentos Dispensados" + err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

FormulacionExterna.prototype.imprimirMedicamentosPendientesDispensados = function(req, res){
    var that = this;
    var args = req.body.data;
    var tmp = {};
    var date = new Date();
    tmp.fecha_impresion = date.getFullYear()  + '-' +("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '  (' + ("0" + date.getHours()).slice(-2) +':'+ ("0" + date.getMinutes()).slice(-2) + ':' + ("0" + date.getSeconds()).slice(-2) +')';

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerCabeceraFormula', args.formula_id).then(function(resultado){
        tmp.formula = resultado[0];
        return G.Q.ninvoke(that.m_formulacionExterna,'obtenerPendientesEnt', args.formula_id, args.imprimir_actual);
    }).then(function(resultado){
        tmp.pendientesDispensados = resultado;
        return G.Q.ninvoke(that.m_formulacionExterna,'obtenerDiagnosticosDeFormula', args.formula_id);
    }).then(function(resultado){
        tmp.diagnosticos = resultado;
        var parametrosPDF = {
            serverUrl:req.protocol + '://' + req.get('host')+ "/", 
            formula: tmp.formula, 
            dispensados: tmp.pendientesDispensados,
            diagnosticos: tmp.diagnosticos,
            esDispensacionPendientes : true,
            fecha_impresion : tmp.fecha_impresion,
            archivoHtml: 'medicamentosDispensados.html',
            reporte: "Medicamentos_dispensados_"
        };
        __generarPdf(parametrosPDF, function(nombre_pdf) {
            res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{
                listar_medicamentos_pendientes: {nombre_pdf: nombre_pdf, resultados: tmp.dispensados}
            }));
        });
    }).fail(function(err){
        console.log('imprimirMedicamentosPendientesDispensados', err)
        G.logError("FormulacionExterna [imprimirMedicamentosDispensados] Error imprimiendo medicamentos Dispensados" + err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
}

FormulacionExterna.prototype.imprimirTodoDispensado = function(req, res){
    var that = this;
    var args = req.body.data;
    var tmp = {};
    var date = new Date();
    tmp.fecha_impresion = date.getFullYear()  + '-' +("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '  (' + ("0" + date.getHours()).slice(-2) +':'+ ("0" + date.getMinutes()).slice(-2) + ':' + ("0" + date.getSeconds()).slice(-2) +')';

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerCabeceraFormula', args.formula_id).then(function(resultado){
        tmp.formula = resultado[0];
        return G.Q.ninvoke(that.m_formulacionExterna,'obtenerPendientesEnt', args.formula_id, args.imprimir_actual);
    }).then(function(resultado){
        tmp.tieneMedicamentosPendientesDispensados = resultado.length > 0 ? true : false;
        tmp.pendientesDispensados = resultado;
        return G.Q.ninvoke(that.m_formulacionExterna,'listarMedicamentosEsmXLote', args.formula_id, args.imprimir_actual);
    }).then(function(resultado){
        tmp.tieneMedicamentosDispensados = resultado.length > 0 ? true : false;
        tmp.dispensados = resultado;
        return G.Q.ninvoke(that.m_formulacionExterna,'obtenerDiagnosticosDeFormula', args.formula_id);
    }).then(function(resultado){
        var parametrosPDF = {
            serverUrl:req.protocol + '://' + req.get('host')+ "/", 
            formula: tmp.formula, 
            tieneMedicamentosDispensados : tmp.tieneMedicamentosDispensados ,
            tieneMedicamentosPendientesDispensados : tmp.tieneMedicamentosPendientesDispensados ,
            dispensados: tmp.dispensados,
            pendientesDispensados: tmp.pendientesDispensados,
            diagnosticos: tmp.diagnosticos,
            fecha_impresion : tmp.fecha_impresion,
            archivoHtml: 'medicamentosDispensadosTodo.html',
            reporte: "Medicamentos_dispensados_todo_"
        };
        
        __generarPdf(parametrosPDF, function(nombre_pdf) {
            res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{
                listar_medicamentos_pendientes: {nombre_pdf: nombre_pdf, resultados: tmp.dispensados}
            }));
        });
    }).fail(function(err){
        console.log('imprimirMedicamentosPendientesDispensados', err)
        G.logError("FormulacionExterna [imprimirMedicamentosDispensados] Error imprimiendo medicamentos Dispensados" + err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
}

function __generarPdf(datos, callback) {
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/FormulacionExterna/reports/'+datos.archivoHtml, 'utf8'),
            recipe: "html",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function(err, response) {
        //console.log('error creando impresion',err);
        response.body(function(body) {
           var fecha = new Date();
           var nombreTmp = datos.reporte + fecha.getTime() + ".html";
           G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body,  "binary",function(err) {
                if(err) {
                    G.logError("Error en funcion __generarPdf [FormulacionExterna] " + err);
                } else {
                    callback(nombreTmp);
                }
            });                            
        });
    });
};

FormulacionExterna.$inject = ["m_formulacion_externa", "m_dispensacion_hc"];
module.exports = FormulacionExterna;
