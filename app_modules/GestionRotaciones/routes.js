module.exports = function (app, di_container) {


    var c_rotacion = di_container.get("c_rotacion");

   app.post('/api/Rotacion/listarRotacion', function (req, res) {
        c_rotacion.listarRotacion(req, res);
    });
   app.post('/api/Rotacion/listarEmpresas', function (req, res) {
        c_rotacion.listarEmpresas(req, res);
    });
   app.post('/api/Rotacion/listarFarmacias', function (req, res) {
        c_rotacion.listarFarmacias(req, res);
    });
   app.post('/api/Rotacion/listarZonas', function (req, res) {
        c_rotacion.listarZonas(req, res);
    });
   app.post('/api/Rotacion/modificarRotacion', function (req, res) {
        c_rotacion.modificarRotacion(req, res);
    });
    
   app.post('/api/Rotacion/guardarRotacion', function (req, res) {
        c_rotacion.guardarRotacion(req, res);
    });

    app.post('/api/Rotacion/Buscar', function (req, res) {
        c_rotacion.Buscar(req, res);
    });
    
    app.post('/api/Rotacion/eliminarRotacion', function (req, res) {
        c_rotacion.eliminarRotacion(req, res);
    });
   

  
 
};
