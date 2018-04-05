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

    app.post('/api/Radicacion/subirArchivo', function (req, res) {
        c_Radicacion.subirArchivo(req, res);
    });

    app.post('/api/Radicacion/modificarFactura', function (req, res) {
        c_Radicacion.modificarFactura(req, res);
    });

    app.post('/api/Radicacion/subirArchivoFactura', function (req, res) {
        c_Radicacion.subirArchivoFactura(req, res);
    });
    app.post('/api/Radicacion/agruparFactura', function (req, res) {
        c_Radicacion.insertAgruparFactura(req, res);
    });

    app.post('/api/Radicacion/listarAgrupar', function (req, res) {
        c_Radicacion.listarAgrupar(req, res);
    });

    app.post('/api/Radicacion/modificarEntregado', function (req, res) {
        c_Radicacion.modificarEntregado(req, res);
    });
    app.post('/api/Radicacion/eliminarGrupoFactura', function (req, res) {
        c_Radicacion.eliminarGrupoFactura(req, res);
    });

    app.post('/api/Radicacion/listarFacturaEntregado', function (req, res) {
        c_Radicacion.eliminarGrupoFactura(req, res);
    });

    app.post('/api/Radicacion/agregarFacturaEntregado', function (req, res) {
        c_Radicacion.agregarFacturaEntregado(req, res);
    });

    app.post('/api/Radicacion/planillaRadicacion', function (req, res) {
        c_Radicacion.planillaRadicacion(req, res);
    });
    app.post('/api/Radicacion/modificarNombreArchivo', function (req, res) {
        c_Radicacion.modificarNombreArchivo(req, res);
    });

    
//    app.post('/api/Parametrizacion/listarMunicipio', function(req, res){
//        c_Radicacion.listarMunicipio (req, res);
//    });



};  