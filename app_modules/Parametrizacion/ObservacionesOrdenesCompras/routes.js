module.exports = function(app, di_container) {

  
    var c_observaciones = di_container.get("c_observaciones");
    
    app.post('/api/ObservacionesOrdenesCompras/listarObservaciones', function(req, res) {
        c_observaciones.listarObservaciones(req, res);
    });
};