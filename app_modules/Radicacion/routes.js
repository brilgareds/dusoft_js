module.exports = function (app, di_container) {


    var c_Radicacion = di_container.get("c_radicacion");

    app.post('/api/Radicacion/listarConcepto', function (req, res) {
        c_Radicacion.listarConcepto(req, res);

    });

    app.post('/api/Radicacion/listarFactura', function (req, res) {
        c_Radicacion.listarFactura(req, res);

    });

    app.post('/api/Radicacion/guardarConcepto', function (req, res) {
        c_Radicacion.guardarConcepto(req, res);

    });

    app.post('/api/Radicacion/guardarFactura', function (req, res) {
        c_Radicacion.guardarFactura(req, res);
    });
    
    app.post('/api/Radicacion/subirArchivo', function(req, res) {
        console.log('ejecuta cotroller');
        c_Radicacion.subirArchivo(req, res);
    });
};  