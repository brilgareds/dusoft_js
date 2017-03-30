module.exports = function(app, di_container) {
    
    var c_terceros = di_container.get("c_terceros");
    
    app.post('/api/Terceros/GestionTerceros/obtenerParametrizacionFormularioTerceros', function(req, res) {
         c_terceros.obtenerParametrizacionFormularioTerceros(req, res);
    });    
    
    app.post('/api/Terceros/GestionTerceros/guardarFormularioTerceros', function(req, res) {
         c_terceros.guardarFormularioTerceros(req, res);
    });    
    
    
};