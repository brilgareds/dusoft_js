
var Induccion = function(induccion) {

    this.m_induccion = induccion;

};
/*
* funcion para consultar empresas
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
Induccion.prototype.listarEmpresas = function(req, res) {
    
    var that = this;
    var args = req.body.data;
   
    that.m_induccion.getListarEmpresas(function(err, empresas ) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las empresas', 500, {listar_empresas: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de empresas OK', 200, {listar_empresas: empresas}));
        }
    });
};
/*
* funcion para consultar CentroUtilidad
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
Induccion.prototype.listarCentroUtilidad = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaId = args.listarCentroUtilidad.empresaId;
    
    if (empresaId === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, empresa_id no estan definidas', 404, {}));
        return;
    }
    
    that.m_induccion.getListarCentroUtilidad(empresaId,function(err, centroUtilidad ) { 

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando centros de utilidad', 500, {listar_CentroUtilidad: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de centros de utilidad OK', 200, {listar_CentroUtilidad: centroUtilidad}));
        }
    });
};
/*
* funcion para consultar Bodega
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
Induccion.prototype.listarBodega = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaId = args.listarBodegas.empresaId;
    var centroUtilidadId = args.listarBodegas.centroUtilidadId;
    
    if (empresaId === undefined || centroUtilidadId === undefined   ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    that.m_induccion.getListarBodega(empresaId,centroUtilidadId,function(err, bodega ) { //,centroUtilidad
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Bodegas', 500, {listar_Bodega: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Bodegas OK', 200, {listar_Bodega: bodega}));
        }
    });
};
/*
* funcion para Producto
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
Induccion.prototype.listarProducto = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaIds = args.listarProducto.empresaId;
    var centroUtilidadId = args.listarProducto.centroUtilidadId;
    var bodegaId = args.listarProducto.bodegaId;
    var nombreProducto = args.listarProducto.nombreProducto;
    var pagina = args.listarProducto.pagina;
    console.log("paginaactual",args.listarProducto);
    if (empresaIds === undefined || centroUtilidadId === undefined || bodegaId === undefined || nombreProducto === undefined  ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }                                                   
    that.m_induccion.getListarProducto(empresaIds,centroUtilidadId,nombreProducto,bodegaId,pagina,function(err, bodega ) { 
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Producto', 500, {listar_Producto: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Producto OK', 200, {listar_Producto: bodega}));
        }
    });
};

Induccion.$inject = ["m_induccion"];

module.exports = Induccion;