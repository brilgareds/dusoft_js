
var PlanillasFarmaciasController = function(PlanillasFarmacias) {

    this.m_planillas_farmacias = PlanillasFarmacias;

};


PlanillasFarmaciasController.prototype.listarPlanillasFarmacias = function(req, res) {

    var that = this;


    var args = req.body.data;

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

    that.m_planillas_farmacias.listar_planillas_farmacias(fecha_inicial, fecha_final, termino_busqueda, function(err, listar_planillas_farmacias) {

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
 * +Descripcion Controlador encargado de invocar el metodo model para listar
 * las farmacias
 */
PlanillasFarmaciasController.prototype.listar_farmacias = function(req, res) {

    var args = req.body.data;
    var codigoempresa = req.body.data.planillasfarmacias.codigoempresa;

    /*  if (args.induccion === undefined ) { 
     res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
     return;
     }*/

    this.m_planillas_farmacias.obtenerFarmacias(codigoempresa, function(err, listar_farmacias) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Farmacias', 500, {listar_farmacias: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de Farmacias OK', 200, {listar_farmacias: listar_farmacias}));
            return;
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
PlanillasFarmaciasController.prototype.listar_documentos = function(req, res) {

    var parametros = req.body.data.parametros;
    var empresa = parametros.empresa;
    var centroUtilidad = parametros.centroUtilidad;
    var bodega = parametros.bodega;
    var pagina = parametros.pagina;
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


    this.m_planillas_farmacias.obtenerTipoDocumento(empresa, centroUtilidad, bodega,pagina, function(err, listar_documentos) {

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

    that.m_planillas_farmacias.ingresar_planilla_farmacia(empresa_id,
            centro_utilidad,
            bodega,
            id_empresa_destino,
            inv_transportador_id,
            nombre_conductor,
            observacion,
            numero_guia_externo,
            usuario_id,
            function(err, rows, result) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Error Interno', 500, {ingresar_planilla_farmacia: []}));
                    return;
                } else {

                    var numero_guia = (rows.length > 0) ? rows[0].id : 0;

                    res.send(G.utils.r(req.url, 'Planilla farmacia regitrada correctamente', 200, {ingresar_planilla_farmacia: numero_guia,
                        id_inv_planilla_farmacia_devolucion: rows}));
                    return;
                }
            });

};






PlanillasFarmaciasController.prototype.generarDocumentoPlanillaFarmacia = function(req, res) {

    console.log("<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log("generarDocumentoPlanillaFarmacia");
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

    /*if (cantidad_cajas === '' || cantidad_cajas === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el valor de la cantidad de cajas', 404, {}));
        return;
    }
*/
      
    if (cantidad_neveras.length > 0) {
       
        if (temperatura_neveras === '' || temperatura_neveras === undefined) {
            res.send(G.utils.r(req.url, 'Se requiere el valor de la temperatura', 404, {}));
            return;
        }

    }



    that.m_planillas_farmacias.ingresar_documentos_planilla_farmacia(id, empresa_id, prefijo, numero, cantidad_cajas,
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


PlanillasFarmaciasController.$inject = ["m_planillas_farmacias"];

module.exports = PlanillasFarmaciasController;