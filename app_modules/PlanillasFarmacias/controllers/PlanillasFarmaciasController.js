
var PlanillasFarmaciasController = function(PlanillasFarmacias) {

    this.m_planillas_farmacias = PlanillasFarmacias;

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


    this.m_planillas_farmacias.obtenerTipoDocumento(empresa,centroUtilidad,bodega,function(err, listar_documentos) {

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
    
    /*if (args.planillas_despachos === undefined || args.planillas_despachos.pais_id === undefined || args.planillas_despachos.departamento_id === undefined || args.planillas_despachos.ciudad_id === undefined) {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.transportador_id === undefined || args.planillas_despachos.nombre_conductor === undefined || args.planillas_despachos.observacion === undefined) {
        res.send(G.utils.r(req.url, 'transportador_id, nombre_conductor u observacion no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.numero_guia_externo === undefined) {
        res.send(G.utils.r(req.url, 'numero_guia_externo no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.pais_id === '' || args.planillas_despachos.departamento_id === '' || args.planillas_despachos.ciudad_id === '') {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id  estan vacias', 404, {}));
        return;
    }

    if (args.planillas_despachos.transportador_id === '' || args.planillas_despachos.nombre_conductor === '' || args.planillas_despachos.observacion === '') {
        res.send(G.utils.r(req.url, 'transportador_id, nombre_conductor u observacion esta vacia', 404, {}));
        return;
    }*/


    var empresa_id = args.planillas_farmacia.empresa_id;
    var centro_utilidad = args.planillas_farmacia.centro_utilidad;
    var bodega = args.planillas_farmacia.bodega;
    var id_empresa_destino = args.planillas_farmacia.id_empresa_destino;
    var inv_transportador_id = args.planillas_farmacia.transportador_id;
    var nombre_conductor = args.planillas_farmacia.nombre_conductor;
    var observacion = args.planillas_farmacia.observacion;
    var numero_guia_externo = args.planillas_farmacia.numero_guia_externo;
    var usuario_id = req.session.user.usuario_id;
   
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
                                                                                           id_inv_planilla_farmacia_devolucion:rows}));
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
    
    console.log(args);
    
    that.m_planillas_farmacias.ingresar_documentos_planilla_farmacia(id,empresa_id, prefijo, numero, cantidad_cajas, 
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