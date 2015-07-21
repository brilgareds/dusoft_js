
var Induccion = function(induccion) {

    this.m_induccion = induccion;
   
    
   
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
Induccion.prototype.listar_empresas = function(req, res) {
   
    var args = req.body.data;
    

    this.m_induccion.empresas_activas(function(err, listar_empresas) {

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
Induccion.prototype.listar_centro_utilidad = function(req, res) {
   
   
    var args = req.body.data;
    
    var id_empresa = args.induccion.id_empresa;
   
  

    this.m_induccion.centros_utilidades(id_empresa,function(err, listar_centro_utilidad) {

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
Induccion.prototype.listar_bodegas = function(req, res) {
   
   
   var args = req.body.data;
    
    var centros_utilidad = args.induccion.centros_utilidad;
   
  

    this.m_induccion.bodegas(centros_utilidad,function(err, listar_bodegas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de bodegas', 500, {listar_bodegas: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de bodegas', 200, {listar_bodegas: listar_bodegas}));
            return;
        }
    });
};
Induccion.$inject = ["m_induccion"];

module.exports = Induccion;