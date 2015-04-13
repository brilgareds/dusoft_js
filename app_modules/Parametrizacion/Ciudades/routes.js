module.exports = function(app, di_container) {

  
    var c_ciudades = di_container.get("c_ciudades");
    
    app.post('/api/Ciudades/listar', function(req, res) {
        c_ciudades.listarCiudades(req, res);
    });
};