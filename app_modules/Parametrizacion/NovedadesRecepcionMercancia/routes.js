module.exports = function(app, di_container) {

  
    var c_novedades_mercancia = di_container.get("c_novedades_mercancia");
    
    app.post('/api/NovedadesRecepcion/listarNovedades', function(req, res) {
        c_novedades_mercancia.listarNovedades(req, res);
    });
    
    app.post('/api/NovedadesRecepcion/consultarNovedad', function(req, res) {
        c_novedades_mercancia.consultarNovedad(req, res);
    });
    
    app.post('/api/NovedadesRecepcion/ingresarNovedad', function(req, res) {
        c_novedades_mercancia.ingresarNovedad(req, res);
    });
    
    app.post('/api/NovedadesRecepcion/modificarNovedad', function(req, res) {
        c_novedades_mercancia.modificarNovedad(req, res);
    });
    
    app.post('/api/NovedadesRecepcion/inactivarNovedad', function(req, res) {
        c_novedades_mercancia.inactivarNovedad(req, res);
    });
};