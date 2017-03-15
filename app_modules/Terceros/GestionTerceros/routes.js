module.exports = function(app, di_container) {
    
    var c_terceros = di_container.get("c_terceros");
    
    app.post('/api/Terceros/GestionTerceros/obtenerParametrizacionFormularioTerceros', function(req, res) {
         c_terceros.obtenerParametrizacionFormularioTerceros(req, res);
    });    
    
    
};