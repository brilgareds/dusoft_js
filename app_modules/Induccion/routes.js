module.exports = function(app, di_container) {


    var c_induccion = di_container.get("c_induccion");
    
    /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para listar las
     * empresas activas
     */
    app.post('/api/Induccion/listar/empresas', function(req, res) {

        c_induccion.listar_empresas(req, res);
    });
    
    /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para listar los
     * centros de utilidades disponibles segun la empresa
     */
    app.post('/api/Induccion/listar/centroutilidad', function(req, res) {

        c_induccion.listar_centro_utilidad(req, res);
    });
    
    
   /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para listar las
     * bodegas segun el centro de utilidad disponible
     */
    app.post('/api/Induccion/listar/bodegas', function(req, res) {

        c_induccion.listar_bodegas(req, res);
    });
    
    
     /**
     * @author Cristian Ardila
     * +Descripcion: path del servicio que ejecutara la funcion para listar los
     * productos
     */
    app.post('/api/Induccion/listar/productos', function(req, res) {

        c_induccion.listar_productos(req, res);
    });
};