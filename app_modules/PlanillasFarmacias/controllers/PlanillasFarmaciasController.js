
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




PlanillasFarmaciasController.$inject = ["m_planillas_farmacias"];

module.exports = PlanillasFarmaciasController;