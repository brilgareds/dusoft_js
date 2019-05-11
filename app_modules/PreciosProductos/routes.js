module.exports = function (app, di_container) {


    var c_precios_productos = di_container.get("c_precios_productos");

    app.post('/api/Radicacion/listarConcepto', function (req, res) {
        c_precios_productos.listarConcepto(req, res);

    });

    app.post('/api/Radicacion/listarFactura', function (req, res) {
        c_precios_productos.listarFactura(req, res);

    });

    app.post('/api/Radicacion/guardarConcepto', function (req, res) {
        c_precios_productos.guardarConcepto(req, res);

    });

    app.post('/api/Radicacion/guardarFactura', function (req, res) {
        c_precios_productos.guardarFactura(req, res);
    });

    app.post('/api/Radicacion/subirArchivo', function (req, res) {
        c_precios_productos.subirArchivo(req, res);
    });

    app.post('/api/Radicacion/modificarFactura', function (req, res) {
        c_precios_productos.modificarFactura(req, res);
    });

    app.post('/api/Radicacion/subirArchivoFactura', function (req, res) {
        c_precios_productos.subirArchivoFactura(req, res);
    });
    app.post('/api/Radicacion/agruparFactura', function (req, res) {
        c_precios_productos.insertAgruparFactura(req, res);
    });

    app.post('/api/Radicacion/listarAgrupar', function (req, res) {
        c_precios_productos.listarAgrupar(req, res);
    });

    app.post('/api/Radicacion/modificarEntregado', function (req, res) {
        c_precios_productos.modificarEntregado(req, res);
    });
    app.post('/api/Radicacion/eliminarGrupoFactura', function (req, res) {
        c_precios_productos.eliminarGrupoFactura(req, res);
    });

    app.post('/api/Radicacion/listarFacturaEntregado', function (req, res) {
        c_precios_productos.eliminarGrupoFactura(req, res);
    });

    app.post('/api/Radicacion/agregarFacturaEntregado', function (req, res) {
        c_precios_productos.agregarFacturaEntregado(req, res);
    });

    app.post('/api/Radicacion/planillaRadicacion', function (req, res) {
        c_precios_productos.planillaRadicacion(req, res);
    });
    app.post('/api/Radicacion/modificarNombreArchivo', function (req, res) {
        c_precios_productos.modificarNombreArchivo(req, res);
    });
    app.post('/api/Precios_productos/listarAgrupar', function (req, res) {
        c_precios_productos.listarAgrupar(req, res);
    });

    
//    app.post('/api/Parametrizacion/listarMunicipio', function(req, res){
//        c_precios_productos.listarMunicipio (req, res);
//    });



};  