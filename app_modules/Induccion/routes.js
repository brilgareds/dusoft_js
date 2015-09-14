module.exports = function(app, di_container) {


    var c_induccion = di_container.get("c_induccion");
    
    
     app.post('/api/induccion/listarempresas', function(req, res) {
        
    
        c_induccion.listarEmpresas(req, res);
    });
    
};