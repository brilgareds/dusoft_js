
var PlanillasFarmaciasController = function(PlanillasFarmacias) {

    this.m_planillas_farmacias = PlanillasFarmacias;

};


PlanillasFarmaciasController.prototype.listarPlanillasFarmacias = function(req, res) {

    var that = this;


    var args = req.body.data;
    var pagina = args.listar_planillas_farmacias.pagina;

    if (args.listar_planillas_farmacias === undefined || args.listar_planillas_farmacias.fecha_inicial === undefined || args.listar_planillas_farmacias.fecha_final === undefined || args.listar_planillas_farmacias.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final o termino_busqueda no esta definido', 404, {}));
        return;
    }

    if (args.listar_planillas_farmacias.fecha_inicial === '' || args.listar_planillas_farmacias.fecha_final === '') {
        res.send(G.utils.r(req.url, 'fecha_inicial o fecha_final estan vacíos', 404, {}));
        return;
    }

    var fecha_inicial = args.listar_planillas_farmacias.fecha_inicial;
    var fecha_final = args.listar_planillas_farmacias.fecha_final;
    var termino_busqueda = args.listar_planillas_farmacias.termino_busqueda;
    var filtro = args.listar_planillas_farmacias.filtro;


    that.m_planillas_farmacias.listar_planillas_farmacias(fecha_inicial, fecha_final, filtro, termino_busqueda, pagina, function(err, listar_planillas_farmacias) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las planillas_farmacias', 500, {listar_planillas_farmacias: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de planillas_farmacias', 200, {listar_planillas_farmacias: listar_planillas_farmacias}));
        }
    });
};


/**
 * 
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 * @Author Cristian Ardila
 * +Descripcion Controlador encargado de los documentos con prefijo EDB
 */
PlanillasFarmaciasController.prototype.listarDocumentos = function(req, res) {

    var parametros = req.body.data.parametros;
    var empresa = parametros.empresa;
    var centroUtilidad = parametros.centroUtilidad;
    var bodega = parametros.bodega;
    var pagina = parametros.pagina;
    var terminoBusqueda = parametros.terminoBusqueda;
    var fechaInicial = parametros.fechaInicial;
    var fechaFinal = parametros.fechaFinal;
    /**
     * @type string parametros: arreglo con todos los parametros
     * @type string empresa: contiene el id de la empresa
     * @type string centroUtilidad: variable con el centro de utilidad
     * @type string bodega: variable de la bodega
     * +Descripcion: Se valida que las variables esten undefine o cadena vacia, si es el caso
     * retornara una excepcion y terminara la ejecucion del programa
     */
    if (parametros === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (empresa === '' || empresa === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de empresa', 404, {}));
        return;
    }

    if (centroUtilidad === '' || centroUtilidad === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de centroUtilidad', 404, {}));
        return;
    }

    if (bodega === '' || bodega === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de bodega', 404, {}));
        return;
    }


    this.m_planillas_farmacias.obtenerTipoDocumento(empresa, centroUtilidad, bodega, pagina, terminoBusqueda, fechaInicial, fechaFinal, function(err, listar_documentos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de documentos tipo EDB', 500, {listar_documentos: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de documentos EDB OK', 200, {listar_documentos: listar_documentos}));
            return;
        }
    });
};



PlanillasFarmaciasController.prototype.generarPlanillaFarmacia = function(req, res) {

    var that = this;

    var args = req.body.data;

    var empresa_id = args.planillas_farmacia.empresa_id;
    var centro_utilidad = args.planillas_farmacia.centro_utilidad;
    var bodega = args.planillas_farmacia.bodega;
    var id_empresa_destino = args.planillas_farmacia.id_empresa_destino;
    var inv_transportador_id = args.planillas_farmacia.transportador_id;
    var nombre_conductor = args.planillas_farmacia.nombre_conductor;
    var observacion = args.planillas_farmacia.observacion;
    var numero_guia_externo = args.planillas_farmacia.numero_guia_externo;
    var usuario_id = req.session.user.usuario_id;

    if (args.planillas_farmacia === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (empresa_id === '' || empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de empresa', 404, {}));
        return;
    }

    if (centro_utilidad === '' || centro_utilidad === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el centro de utilidad', 404, {}));
        return;
    }

    if (bodega === '' || bodega === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el valor de la bodega', 404, {}));
        return;
    }

    if (id_empresa_destino === '' || id_empresa_destino === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el valor de la empresa destino', 404, {}));
        return;
    }

    if (inv_transportador_id === '' || inv_transportador_id === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el identificador del transportador', 404, {}));
        return;
    }

    if (nombre_conductor === '' || nombre_conductor === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el nombre del conductor', 404, {}));
        return;


    }

    that.m_planillas_farmacias.ingresarPlanillaFarmacia(empresa_id,
            centro_utilidad,
            bodega,
            id_empresa_destino,
            inv_transportador_id,
            nombre_conductor,
            observacion,
            numero_guia_externo,
            usuario_id,
            function(err, rows) {
                console.log("//////***********************ingresarPlanillaFarmacia*******************");
                if (err) {
                    res.send(G.utils.r(req.url, 'Error Interno', 500, {ingresar_planilla_farmacia: []}));
                    return;
                } else {

                    var numero_guia = (rows.length > 0) ? rows[0].id : 0;
                    //    console.log({id_inv_planilla_farmacia_devolucion: rows});
                    res.send(G.utils.r(req.url, 'Planilla farmacia regitrada correctamente', 200,
                            {ingresar_planilla_farmacia: numero_guia,
                                id_inv_planilla_farmacia_devolucion: rows}));
                    return;
                }
            });

};






PlanillasFarmaciasController.prototype.generarDocumentoPlanillaFarmacia = function(req, res) {


    var that = this;
    var args = req.body.data;
    var id = args.planillas_farmacia.id_inv_planilla_farmacia_devolucion;//Identificador de la ultima transaccion de la tabla inv_planillas_farmacia_devolucion
    var empresa_id = args.planillas_farmacia.empresa_id;
    var prefijo = args.planillas_farmacia.prefijo;
    var numero = args.planillas_farmacia.numero;
    var cantidad_cajas = args.planillas_farmacia.cantidad_cajas;
    var cantidad_neveras = args.planillas_farmacia.cantidad_neveras;
    var temperatura_neveras = args.planillas_farmacia.temperatura_neveras;
    var observacion = args.planillas_farmacia.observacion;


    var usuario_id = req.session.user.usuario_id;


    if (args.planillas_farmacia === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (empresa_id === '' || empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de empresa', 404, {}));
        return;
    }

    if (prefijo === '' || prefijo === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el prefijo', 404, {}));
        return;
    }

    if (numero === '' || numero === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero', 404, {}));
        return;
    }



    that.m_planillas_farmacias.ingresarDocumentosPlanillaFarmacia(id, empresa_id, prefijo, numero, cantidad_cajas,
            cantidad_neveras, temperatura_neveras, observacion,
            usuario_id, function(err, rows, result) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {ingresar_documentos_planilla_farmacia: []}));
            return;
        } else {

            var numero_guia = (rows.length > 0) ? rows[0].id : 0;

            res.send(G.utils.r(req.url, 'documento farmacia regitrado correctamente', 200, {ingresar_documentos_planilla_farmacia: numero_guia}));
            return;
        }
    });

};

/**
 * 
 * @param {type} req
 * @param {type} res
 * @returns {void}
 * +Descripcion: Metodo encargado de ejecutar el query para actualizar el estado
 *  de una planilla de farmacia de Activo a despachado
 * 
 */
PlanillasFarmaciasController.prototype.despacharPlanilla = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_farmacia === undefined || args.planillas_farmacia.planilla_id === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_farmacia.planilla_id === '') {
        res.send(G.utils.r(req.url, 'planilla_id esta vacio', 404, {}));
        return;
    }

    var planilla_id = args.planillas_farmacia.planilla_id;
    var estado = '2'; // 0 = Anulada, 1 = Activa, 2 = Despachada

    that.m_planillas_farmacias.modificar_estado_planilla_despacho(planilla_id, estado, function(err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno code 4', 500, {planillas_farmacia: []}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Planilla despachada correctamente', 200, {planillas_farmacia: {}}));
            return;
        }
    });

};


PlanillasFarmaciasController.prototype.consultarPlanillaFarmacia = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.planillas_farmacia === undefined || args.planillas_farmacia.planilla_id === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    var planilla_id = args.planillas_farmacia.planilla_id;


    that.m_planillas_farmacias.verificarPlanillaFarmacia(planilla_id, function(err, consultarPlanillaFarmacia) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado la planilla', 500, {consultarPlanillaFarmacia: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Planilla farmacia', 200, {consultarPlanillaFarmacia: consultarPlanillaFarmacia}));
        }
    });
};



PlanillasFarmaciasController.prototype.consultarDocumentosPlanillaFarmacia = function(req, res) {

    var that = this;

    var args = req.body.data;


    if (args.planillas_farmacia === undefined || args.planillas_farmacia.planilla_id === undefined || args.planillas_farmacia.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_farmacia.planilla_id === '') {
        res.send(G.utils.r(req.url, 'planilla_id esta vacio', 404, {}));
        return;
    }

    var planilla_id = args.planillas_farmacia.planilla_id;
    var termino_busqueda = args.planillas_farmacia.termino_busqueda;

    that.m_planillas_farmacias.consultar_documentos_planilla_farmacia(planilla_id, termino_busqueda, function(err, planilla_farmacia) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado los documentos de la planilla', 500, {planillas_farmacia: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Documentos planilla farmacia', 200, {planillas_farmacias: planilla_farmacia}));
        }
    });
};


PlanillasFarmaciasController.prototype.eliminarDocumentoPlanilla = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_farmacia === undefined
            || args.planillas_farmacia.planilla_id === undefined
            || args.planillas_farmacia.empresa_id === undefined
            || args.planillas_farmacia.prefijo === undefined
            || args.planillas_farmacia.numero === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id, empresa_id, prefijo o numero no esta definido', 404, {}));
        return;
    }

    if (args.planillas_farmacia.planilla_id === ''
            || args.planillas_farmacia.empresa_id === ''
            || args.planillas_farmacia.prefijo === ''
            || args.planillas_farmacia.numero === '') {
        res.send(G.utils.r(req.url, 'planilla_id, empresa_id, prefijo o numero estan vacios', 404, {}));
        return;
    }




    var planilla_id = args.planillas_farmacia.planilla_id;
    var empresa_id = args.planillas_farmacia.empresa_id;
    var prefijo = args.planillas_farmacia.prefijo;
    var numero = args.planillas_farmacia.numero;


    that.m_planillas_farmacias.eliminar_documento_planilla(planilla_id, empresa_id, prefijo, numero, function(err, rows, result) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error eliminando el documento de la planilla', 500, {planillas_farmacia: {}}));
        } else {
            res.send(G.utils.r(req.url, 'El documento se ha eliminado ', 200, {planillas_farmacias: {}}));
        }
    });


};
PlanillasFarmaciasController.$inject = ["m_planillas_farmacias"];

module.exports = PlanillasFarmaciasController;