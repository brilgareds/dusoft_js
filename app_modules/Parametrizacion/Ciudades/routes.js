module.exports = function(app, di_container) {

  
    var c_ciudades = di_container.get("c_ciudades");
    
    app.post('/api/Ciudades/listar', function(req, res) {
        c_ciudades.listarCiudades(req, res);
    });
    
    app.post('/api/Ciudades/seleccionarCiudad', function(req, res) {
        c_ciudades.seleccionarCiudad(req, res);
    });
    
    app.post('/api/Ciudades/obtenerCiudadesPorDepartamento', function(req, res) {
        c_ciudades.obtenerCiudadesPorDepartamento(req, res);
    });
};