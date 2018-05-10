module.exports = function (app, di_container) {

    // ======== Rutas para Documentos Temporales I015 =============

    var c_i015 = di_container.get("c_i015");

    app.post('/api/movBodegas/I015/listarBodegas', function (req, res) {
        c_i015.listarBodegas(req, res);
    });

    app.post('/api/movBodegas/I015/listarTraslados', function (req, res) {
        c_i015.listarTraslados(req, res);
    });

    app.post('/api/movBodegas/I015/listarProductosTraslados', function (req, res) {
        c_i015.listarProductosTraslados(req, res);
    });

    app.post('/api/movBodegas/I015/newDocTemporal', function (req, res) {
        c_i015.newDocTemporal(req, res);
    });
       
    app.post('/api/movBodegas/I015/eliminarGetDocTemporal', function (req, res) {
        c_i015.eliminarGetDocTemporal(req, res);
    });
    
    app.post('/api/movBodegas/I015/agregarItem', function (req, res) {
        c_i015.agregarItem(req, res);
    });
    
    app.post('/api/movBodegas/I015/listarProductosValidados', function (req, res) {
        c_i015.listarProductosValidados(req, res);
    });
    
    app.post('/api/movBodegas/I015/eliminarItem', function (req, res) {
        c_i015.eliminarItem(req, res);
    });
    
    app.post('/api/movBodegas/I015/listarDocumentoId', function (req, res) {
        c_i015.listarDocumentoId(req, res);
    });
    
    app.post('/api/movBodegas/I015/listarFarmaciaId', function (req, res) {
        c_i015.listarFarmaciaId(req, res);
    });
//
//    app.post('/api/movBodegas/I015/crearDocumento', function (req, res) {
//        c_i015.crearDocumento(req, res);
//    });
//    
//    app.post('/api/movBodegas/I015/crearHtmlDocumento', function (req, res) {
//        c_i015.crearHtmlDocumento(req, res);
//    });

};