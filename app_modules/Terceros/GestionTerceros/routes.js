module.exports = function(app, di_container) {
    
    var c_terceros = di_container.get("c_terceros");
    
    app.post('/api/Terceros/GestionTerceros/obtenerParametrizacionFormularioTerceros', function(req, res) {
         c_terceros.obtenerParametrizacionFormularioTerceros(req, res);
    });    
    
    app.post('/api/Terceros/GestionTerceros/guardarFormularioTerceros', function(req, res) {
         c_terceros.guardarFormularioTerceros(req, res);
    });    
    
    app.post('/api/Terceros/GestionTerceros/obtenerTercero', function(req, res) {
         c_terceros.obtenerTercero(req, res);
    });    
    
    app.post('/api/Terceros/GestionTerceros/listarTerceros', function(req, res) {
         c_terceros.listarTerceros(req, res);
    });    
    
    app.post('/api/Terceros/GestionTerceros/obtenerTiposDocumentos', function(req, res) {
         c_terceros.obtenerTiposDocumentos(req, res);
    });   
    
};