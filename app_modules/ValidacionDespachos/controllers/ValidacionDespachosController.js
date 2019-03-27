
var ValidacionDespachos = function (induccion, imprimir_productos) {

    this.m_ValidacionDespachos = induccion;
    this.m_imprimir_productos = imprimir_productos;

};



/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado de invocar el modelo para listar los despachos
 * aprobados
 */
ValidacionDespachos.prototype.listarDespachosAprobados = function (req, res) {

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
        prefijo: (prefijo !== 0 ? prefijo.toUpperCase() : prefijo),
        numero: numero,
        empresa_id: empresa_id,
        paginaActual: paginaActual,
        registroUnico: registroUnico,
        idPlantilla: args.validacionDespachos.idPlantilla
    };
    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarDespachosAprobados', obj).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Lista de despachos aprobados por seguridad', 200, {validacionDespachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error consultado los de despachos', 500, {validacionDespachos: {}}));

    }).done();

};

/**
 * @author Eduar Garcia
 * @fecha  26/12/2016
 * +Descripcion Metodo encargado de listar las imagenes de una aprobacion
 * aprobados
 */
ValidacionDespachos.prototype.listarImagenes = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (args.validacionDespachos.id_aprobacion === undefined) {
        res.send(G.utils.r(req.url, 'El id de la aprobacion no esta definido ', 404, {}));
        return;
    }

    var aprobacion = args.validacionDespachos.id_aprobacion;

    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarImagenes', {id_aprobacion: aprobacion}).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Listado de imagenes', 200, {imagenes: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {validacionDespachos: {}}));

    }).done();

};

/**
 * @author Eduar Garcia
 * @fecha  26/12/2016
 * +Descripcion Metodo encargado de invocar el modelo para listar los despachos
 * aprobados
 */
ValidacionDespachos.prototype.adjuntarImagen = function (req, res) {

    var that = this;

    var args = req.body.data;
    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (!args.validacionDespachos.id_aprobacion || !args.validacionDespachos.prefijo || !args.validacionDespachos.numero) {
        res.send(G.utils.r(req.url, 'Algunos campos obligatorios estan vacios ', 404, {}));
        return;
    }

    var aprobacion = args.validacionDespachos.id_aprobacion;
    var prefijo = args.validacionDespachos.prefijo;
    var numero = args.validacionDespachos.numero;
    var file = req.files.file;
    var rutaTmp = file.path;
    var rutaNueva = G.dirname + G.settings.carpeta_aprobacion_despachos + prefijo + "-" + numero + "/" + file.name;

    if (G.fs.existsSync(rutaTmp)) {
        G.Q.nfcall(G.fs.copy, rutaTmp, rutaNueva).then(function () {
            return  G.Q.nfcall(G.fs.unlink, rutaTmp);
        }).then(function () {

            var obj = {
                id_aprobacion: aprobacion,
                path: prefijo + "-" + numero + "/" + file.name
            };
            return G.Q.ninvoke(that.m_ValidacionDespachos, 'agregarImagen', obj)

        }).then(function () {
            res.send(G.utils.r(req.url, 'Imagen guardada', 200, {validacionDespachos: {}}));

        }).fail(function (err) {
            G.fs.unlinkSync(rutaNueva);
            res.send(G.utils.r(req.url, 'Error guardando la imagen', 500, {validacionDespachos: {}}));
        }).done();
    } else {
        res.send(G.utils.r(req.url, 'Error guardando la imagen', 500, {validacionDespachos: {}}));
    }
};

/**
 * @author Eduar Garcia
 * @fecha  26/12/2016
 * +Descripcion Metodo para eliminar una imagen de la aprobacion
 */
ValidacionDespachos.prototype.eliminarImagen = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (!args.validacionDespachos.id || !args.validacionDespachos.path) {
        res.send(G.utils.r(req.url, 'Algunos campos obligatorios estan vacios ', 404, {}));
        return;
    }

    var id = args.validacionDespachos.id;
    var path = args.validacionDespachos.path;

    G.Q.ninvoke(that.m_ValidacionDespachos, 'eliminarImagen', {id: id}).then(function (resultado) {
        var rutaNueva = G.dirname + G.settings.carpeta_aprobacion_despachos + path;
        G.fs.unlinkSync(rutaNueva);
        return res.send(G.utils.r(req.url, 'Eliminacion exitosa', 200, {imagenes: resultado}));

    }).fail(function (err) {
        console.log("error generado ", err);
        res.send(G.utils.r(req.url, 'Error al eliminar la imagen', 500, {validacionDespachos: {}}));

    }).done();
};

/*
 * funcion para consultar empresas
 * @param {type} req
 * @param {type} res
 * @returns {datos de consulta}
 */
ValidacionDespachos.prototype.listarEmpresas = function (req, res) {

    var that = this;
    var args = req.body.data;
    var empresa = args.listar_empresas.empresaName;
    if (empresa === undefined) {
        res.send(G.utils.r(req.url, 'empresa, No esta definida', 404, {}));
        return;
    }
    that.m_ValidacionDespachos.listarEmpresas(empresa, function (err, empresas) {

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
ValidacionDespachos.prototype.registrarAprobacion = function (req, res) {
    var that = this;
    var args = req.body.data;
    var totalCajas = 0;
    var totalNeveras = 0;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (args.validacionDespachos.empresaId === undefined || args.validacionDespachos.empresaId === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido o esta vacio', 404, {}));
        return;
    }

    args.validacionDespachos.usuarioId = req.session.user.usuario_id;
    args.validacionDespachos.detalle.forEach(function (row) {
        totalCajas += parseInt(row.cantidadCajas);
        totalNeveras += parseInt(row.cantidadNeveras);
    });

    args.validacionDespachos.cantidadTotalCajas = totalCajas;
    args.validacionDespachos.cantidadTotalNeveras = totalNeveras;

    G.Q.ninvoke(that.m_ValidacionDespachos, 'transaccionRegistrarAprobacion', args.validacionDespachos).then(function (resultado) {
        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {validacionDespachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {validacionDespachos: {}}));

    }).done();
};


ValidacionDespachos.prototype.listarDocumentosOtrasSalidas = function (req, res) {
    var that = this;
    var args = req.body.data;

    var obj = {
        termino_busqueda: args.validacionDespachos.termino_busqueda || ""
    };


    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarDocumentosOtrasSalidas', obj).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {documentos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {documentos: {}}));

    }).done();
};

ValidacionDespachos.prototype.listarNumeroPrefijoOtrasSalidas = function (req, res) {
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


    var prefijo = args.validacionDespachos.prefijo.toUpperCase();


    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarNumeroPrefijoOtrasSalidas', {prefijo: prefijo}).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {planillas_despachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {planillas_despachos: {}}));

    }).done();
};



/**
 * @author Cristian Ardila 
 * @fecha  10/02/2016
 * +Descripcion Controlador que se encarga de ejecutar el modelo para validar la existencia
 *              de un documento
 * @returns {unresolved} */
ValidacionDespachos.prototype.validarExistenciaDocumento = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }


    if (args.validacionDespachos.empresa_id === undefined || args.validacionDespachos.empresa_id === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definida o esta vacia', 404, {}));
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

    var obj = {
        empresa_id: args.validacionDespachos.empresa_id,
        prefijo: args.validacionDespachos.prefijo.toUpperCase(),
        documentos: args.validacionDespachos.numero
    };

    var status = {};

    G.Q.ninvoke(that.m_ValidacionDespachos, 'validarExistenciaMultiplesDocumentos', obj).then(function (resultado) {

        return res.send(G.utils.r(req.url, status.mensaje, 200, {validacionDespachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en la consulta', 404, {validacionDespachos: {err: err}}));

    }).done();  
};


ValidacionDespachos.$inject = ["m_ValidacionDespachos"];

module.exports = ValidacionDespachos;