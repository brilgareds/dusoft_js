
var FormulacionExterna = function(m_formulacion_externa, m_dispensacion_hc) {
    this.m_formulacionExterna = m_formulacion_externa;
    this.m_dispensacion_hc = m_dispensacion_hc;
};

FormulacionExterna.prototype.obtenerAfiliado = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerAfiliado', args.tipoIdentificacion, args.identificacion).then(function(resultado){
        res.send(G.utils.r(req.url, 'obtiene afilaido', 200, resultado[0]));
    }).fail(function(err){
        G.logError("FormulacionExternaController [obtenerAfiliado] " + err);
    }).done();
}

FormulacionExterna.prototype.obtenerMunicipios = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerMunicipios', args.term).then(function(municipios){
        res.send(G.utils.r(req.url, 'obtener municipio', 200, municipios));
    }).fail(function(err){
        G.logError("FormulacionExternaController [obtenerMunicipios] " + err);
    }).done();
}

FormulacionExterna.prototype.obtenerDiagnosticos = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerDiagnosticos', args.tipo_id_paciente, args.paciente_id, args.codigo, args.diagnostico).then(function(municipios){
        res.send(G.utils.r(req.url, 'obtener diagnosticos', 200, municipios));
    }).fail(function(err){
        G.logError("FormulacionExternaController [obtenerDiagnosticos] " + err);
    }).done();
}

FormulacionExterna.prototype.obtenerDiagnosticosTmp = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerDiagnosticosTmp', args.tmp_formula_id).then(function(diagnosticos){
        res.send(G.utils.r(req.url, 'obtener diagnosticos tmp', 200, diagnosticos));
    }).fail(function(err){
        G.logError("FormulacionExternaController [obtenerDiagnosticosTmp] " + err);
    }).done();
}

FormulacionExterna.prototype.obtenerProfesionales = function(req, res){
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerProfesionales', args.term).then(function(profesionales){
        res.send(G.utils.r(req.url, 'obtener profesionales', 200, profesionales));
    }).fail(function(err){
        G.logError("FormulacionExterna [obtenerProfesionales] " + err);
        res.send(G.utils.r(req.url, 'error obtener profesionales', 500, err));
    }).done();
}

FormulacionExterna.prototype.eliminarDiagnosticoTmp = function(req, res){
    var that = this;
    var args = req.body.data;
    
    console.log('eliminarDiagnosticoTmp', args);
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

    G.Q.ninvoke(that.m_formulacionExterna,'buscarProductos', args.empresa_id, args.centro_utilidad, args.bodega_id, args.codigo_producto, args.principio_activo, args.descripcion, args.codigo_barras, args.pagina).then(function(formulaExternaTmp){
        res.send(G.utils.r(req.url, 'obtener formulaExternaTmp', 200, formulaExternaTmp));
    }).fail(function(err){
        G.logError("FormulacionExterna [buscarProductos] " + err);
        res.send(G.utils.r(req.url, 'error obtener productos', 500, err));
    }).done();
}

FormulacionExterna.prototype.insertarMedicamentoTmp = function(req, res){
    var that = this;
    var args = req.body.data;
    var usuario_id = req.session.user.usuario_id;

    G.Q.ninvoke(that.m_formulacionExterna,'insertarMedicamentoTmp',args.tmp_formula_id, args.codigo_producto, args.cantidad, args.tiempo_tratamiento, args.unidad_tiempo_tratamiento, args.tipo_id_paciente, args.paciente_id, usuario_id).then(function(fe_medicamento_id){
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
    
    console.log('eliminarDiagnosticoTmp', args);
    G.Q.ninvoke(that.m_formulacionExterna,'eliminarMedicamentoTmp', args.fe_medicamento_id).then(function(data){
        return G.Q.ninvoke(that.m_dispensacion_hc,'existenciasBodegas',parametros);
    }).then(function(resultado){
        res.send(G.utils.r(req.url, 'eliminar diagnosticosTmp', 200, {}));
    }).fail(function(err){
        G.logError("FormulacionExterna [eliminarDiagnosticoTmp] " + err);
        res.send(G.utils.r(req.url, 'error elimina diagnosticoTmp ', 500, err));
    }).done();
}

FormulacionExterna.prototype.consultaExisteFormula = function(req, res){
    var that = this;
    var args = req.body.data;
    
    console.log('eliminarDiagnosticoTmp', args);
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

    G.Q.ninvoke(that.m_formulacionExterna,'obtenerLotesDeProducto', args.empresa_id, args.centro_utilidad, args.bodega, args.codigo_producto, args.formula_id_tmp).then(function(lotesProductos){
        res.send(G.utils.r(req.url, 'obtuvo lotes productos', 200, lotesProductos));
    }).fail(function(err){
        G.logError("FormulacionExterna [obtenerLotesDeProducto] " + err);
        res.send(G.utils.r(req.url, 'Error obteniendo lotes del producto', 500, err));
    }).done();
}

FormulacionExterna.prototype.insertarDispensacionMedicamentoTmp = function(req, res){
    var that = this;
    var args = req.body.data;

    var usuario_id = req.session.user.usuario_id;
    G.Q.ninvoke(that.m_formulacionExterna,'insertarDispensacionMedicamentoTmp', args.empresa_id, args.centro_utilidad, args.bodega, args.codigo_producto, args.cantidad_despachada, args.fecha_vencimiento, args.lote, args.codigo_producto, usuario_id, 0, args.formula_id_tmp, args.cantidad_solicitada).then(function(esm_dispen_tmp_id){
        res.send(G.utils.r(req.url, 'Inserto dispensacion medicamento', 200, esm_dispen_tmp_id));
    }).fail(function(err){
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

FormulacionExterna.$inject = ["m_formulacion_externa", "m_dispensacion_hc"];
module.exports = FormulacionExterna;
