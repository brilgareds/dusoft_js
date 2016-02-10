
var ValidacionDespachos = function(induccion, imprimir_productos) {

    this.m_ValidacionDespachos = induccion;
    this.m_imprimir_productos = imprimir_productos;

};



/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado de invocar el modelo para listar los despachos
 * aprobados
 */
ValidacionDespachos.prototype.listarDespachosAprobados = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (args.validacionDespachos.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido ', 404, {}));
        return;
    }

    if (args.validacionDespachos.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido ', 404, {}));
        return;
    }

    if (args.validacionDespachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'El numero no esta definido', 404, {}));
        return;
    }

    var empresa_id = args.validacionDespachos.empresa_id;
    var prefijo = args.validacionDespachos.prefijo;
    var numero = args.validacionDespachos.numero;
    var fechaInicial = args.validacionDespachos.fechaInicial;
    var fechaFinal = args.validacionDespachos.fechaFinal;
    var paginaActual = args.validacionDespachos.paginaActual;
    var registroUnico = args.validacionDespachos.registroUnico;


    var obj = {fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        prefijo: prefijo,
        numero: numero,
        empresa_id: empresa_id,
        paginaActual: paginaActual,
        registroUnico: registroUnico
    };

    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarDespachosAprobados', obj).then(function(resultado) {

        return res.send(G.utils.r(req.url, 'Lista de despachos aprobados por seguridad', 200, {validacionDespachos: resultado}));

    }).fail(function(err) {

        res.send(G.utils.r(req.url, 'Error consultado las de despachos', 500, {validacionDespachos: {}}));

    }).done();

};


/*
 * funcion para consultar empresas
 * @param {type} req
 * @param {type} res
 * @returns {datos de consulta}
 */
ValidacionDespachos.prototype.listarEmpresas = function(req, res) {

    var that = this;
    var args = req.body.data;
    var empresa = args.listar_empresas.empresaName;
    if (empresa === undefined) {
        res.send(G.utils.r(req.url, 'empresa, No esta definida', 404, {}));
        return;
    }
    that.m_ValidacionDespachos.listarEmpresas(empresa, function(err, empresas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las empresas', 500, {listar_empresas: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de empresas OK', 200, {listar_empresas: empresas}));
        }
    });
};


/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion: Controlador encargado de invocar el modelo que registrara la 
 *               aprobacion del personal de seguridad sobre un despacho
 * @returns {unresolved}
 */
ValidacionDespachos.prototype.registrarAprobacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }


    if (args.validacionDespachos.empresa_id === undefined || args.validacionDespachos.empresa_id === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido o esta vacio', 404, {}));
        return;
    }

    if (args.validacionDespachos.prefijo === undefined || args.validacionDespachos.prefijo === '') {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido o esta vacio', 404, {}));
        return;
    }

    if (args.validacionDespachos.numero === undefined || args.validacionDespachos.numero === '') {
        res.send(G.utils.r(req.url, 'El numero no esta definido o esta vacio', 404, {}));
        return;
    }
    if (args.validacionDespachos.cantidad_cajas === undefined || args.validacionDespachos.cantidad_cajas === '') {
        res.send(G.utils.r(req.url, 'La cantidad de cajas no esta definido o esta vacio', 404, {}));
        return;
    }
    if (args.validacionDespachos.cantidad_neveras === undefined || args.validacionDespachos.cantidad_neveras === '') {
        res.send(G.utils.r(req.url, 'La cantidad de neveras no esta definido o esta vacio', 404, {}));
        return;
    }
    if (args.validacionDespachos.observacion === undefined || args.validacionDespachos.observacion === '') {
        res.send(G.utils.r(req.url, 'La observacion no esta definido o esta vacio', 404, {}));
        return;
    }
    if (args.validacionDespachos.estado === undefined || args.validacionDespachos.estado === '') {
        res.send(G.utils.r(req.url, 'El estado no esta definido o esta vacio', 404, {}));
        return;
    }

    var empresa_id = args.validacionDespachos.empresa_id;
    var prefijo = args.validacionDespachos.prefijo;
    var numero = args.validacionDespachos.numero;
    var cantidad_cajas = args.validacionDespachos.cantidad_cajas;
    var cantidad_neveras = args.validacionDespachos.cantidad_neveras;
    var observacion = args.validacionDespachos.observacion;
    var estado = args.validacionDespachos.estado;

    var obj = {
        empresa_id: empresa_id,
        prefijo: prefijo,
        numero: numero,
        cantidad_cajas: cantidad_cajas,
        cantidad_neveras: cantidad_neveras,
        observacion: observacion,
        estado: estado,
        usuario_id: req.session.user.usuario_id
    };


    G.Q.ninvoke(that.m_ValidacionDespachos, 'registrarAprobacion', obj).then(function(resultado) {

        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {validacionDespachos: resultado}));

    }).fail(function(err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {validacionDespachos: {}}));

    }).done();

};


ValidacionDespachos.prototype.listarDocumentosOtrasSalidas = function(req,res){
    var that = this;
    var args = req.body.data;
    
    var obj = {
        termino_busqueda:args.validacionDespachos.termino_busqueda || ""
    };
   
    
    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarDocumentosOtrasSalidas', obj).then(function(resultado) {

        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {documentos: resultado}));

    }).fail(function(err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {documentos: {}}));

    }).done();
};

ValidacionDespachos.prototype.listarNumeroPrefijoOtrasSalidas = function(req, res){
    var that = this;
    var args = req.body.data;
    
    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }
    
    if (args.validacionDespachos.prefijo === undefined || args.validacionDespachos.prefijo === '') {
        res.send(G.utils.r(req.url, 'El Prefijo no esta definido o esta vacio', 404, {}));
        return;
    }
    
    /*if (args.validacionDespachos.empresa_id === undefined || args.validacionDespachos.empresa_id === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido o esta vacio', 404, {}));
        return;
    }*/
    
    var prefijo = args.validacionDespachos.prefijo;

    
    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarNumeroPrefijoOtrasSalidas', {prefijo:prefijo}).then(function(resultado) {

        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {planillas_despachos: resultado}));

    }).fail(function(err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {planillas_despachos: {}}));

    }).done();
};

ValidacionDespachos.$inject = ["m_ValidacionDespachos"];

module.exports = ValidacionDespachos;