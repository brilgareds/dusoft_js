
var PlanillasFarmaciasController = function(induccion) {

    this.m_planillas_farmacias = induccion;

};

/**
 * 
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 * @Author Cristian Ardila
 * +Descripcion Controlador encargado de invocar el metodo model para listar
 * las empresas activas
 */
PlanillasFarmaciasController.prototype.listar_empresas = function(req, res) {

    var args = req.body.data;

     if (args.induccion === undefined ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    this.m_planillas_farmacias.obtenerEmpresasActivas(function(err, listar_empresas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Empresas Activas', 500, {listar_empresas: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de Empresas Activas', 200, {listar_empresas: listar_empresas}));
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
 * +Descripcion Controlador encargado de invocar el metodo model para listar
 * los centros de utilidades segun la empresa
 */
PlanillasFarmaciasController.prototype.listar_centro_utilidad = function(req, res) {


    var args = req.body.data;

    var idempresa = args.induccion.idempresa;

     if (args.induccion === undefined ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    

    if (idempresa === '' || idempresa === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de empresa', 404, {}));
        return;
    }

    this.m_planillas_farmacias.obtenerCentrosUtilidades(idempresa, function(err, listar_centro_utilidad) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Centros de utilidad', 500, {listar_centro_utilidad: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de Centros de utilidad segun la empresa', 200, {listar_centro_utilidad: listar_centro_utilidad}));
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
 * +Descripcion Controlador encargado de invocar el metodo model para listar
 * los centros de utilidades segun la empresa
 */
PlanillasFarmaciasController.prototype.listar_bodegas = function(req, res) {

    var args = req.body.data;

    var centros_utilidad = args.induccion.centros_utilidad;
    
     if (args.induccion === undefined ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    

    if (centros_utilidad === '' || centros_utilidad === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de centro de utilidad', 404, {}));
        return;
    }

  

    this.m_planillas_farmacias.obtenerBodegas(centros_utilidad, function(err, listar_bodegas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de bodegas', 500, {listar_bodegas: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de bodegas', 200, {listar_bodegas: listar_bodegas}));
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
 * +Descripcion Controlador encargado de invocar el metodo model para listar
 * los productos
 */
PlanillasFarmaciasController.prototype.listar_productos = function(req, res) {
    
 
    var args = req.body.data;
    var induccion =args.induccion;
    var empresaId = induccion.empresaId;
    var centroUtilidad = induccion.centroUtilidad;
    var bodega = induccion.bodega;
    var descripcion = induccion.descripcion;
    var pagina = induccion.pagina;
    var codigoProducto = induccion.codigoProducto;
  
  
     if (args.induccion === undefined ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    /**
     * +Descripcion: se valida que el identificador de la empresa este vacio
     * ó indefinido
     */
    if (empresaId === '' || empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {}));
        return;
    }
     /**
     * +Descripcion: se valida que el identificador del centro de utilidad este 
     * vacio ó indefinido
     */
    if (centroUtilidad === '' || centroUtilidad === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el centro de utilidad', 404, {}));
        return;
    }
    /**
     * +Descripcion: valida que el identificador de la bodega seleccionada este 
     * vacio ó indefinido
     */
     if (bodega === '' || bodega === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la bodega', 404, {}));
        return;
    }
    
    this.m_planillas_farmacias.obtenerProductos(empresaId,centroUtilidad,bodega,descripcion,pagina,codigoProducto,function(err, listar_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Productos Activos', 500, {listar_productos: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de Productos Activos', 200, {listar_productos: listar_productos}));
            return;
        }
    });
};
PlanillasFarmaciasController.$inject = ["m_planillas_farmacias"];

module.exports = PlanillasFarmaciasController;