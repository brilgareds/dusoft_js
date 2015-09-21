module.exports = function(app, di_container) {


    var c_induccion = di_container.get("c_induccion");
    
    
     app.post('/api/induccion/listarempresas', function(req, res) {
        c_induccion.listarEmpresas(req, res);
    });
                              
     app.post('/api/induccion/listarCentroUtilidad', function(req, res) {
        c_induccion.listarCentroUtilidad(req, res);
    });
    
     app.post('/api/induccion/listarBodega', function(req, res) {
        c_induccion.listarBodega(req, res);
    });
    
     app.post('/api/induccion/listarProducto', function(req, res) {
        c_induccion.listarProducto(req, res);
    });
    
};