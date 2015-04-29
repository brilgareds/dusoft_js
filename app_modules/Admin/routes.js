module.exports = function(app, di_container) {

    
    var c_admin = di_container.get('c_admin');
    
    // Consultar la disponibilidad productos
    app.post('/api/Admin/inicializarAplicacion', function(req, res) {
        c_admin.inicializarAplicacion(req, res);
    });
};