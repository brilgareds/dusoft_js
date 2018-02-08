module.exports = function(app, di_container) {


    var c_Radicacion = di_container.get("c_radicacion");

    app.post('/api/Radicacion/listarConcepto', function(req, res) {
        c_Radicacion.listarConcepto(req, res);
       
    });
    app.post('/api/Radicacion/guardarConcepto', function(req, res) {
        c_Radicacion.guardarConcepto(req, res);
       
    });
    
    
};