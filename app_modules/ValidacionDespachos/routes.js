module.exports = function(app, di_container) {


    var c_ValidacionDespachos = di_container.get("c_ValidacionDespachos");
    
    
    app.post('/api/ValidacionDespachos/listarempresas', function(req, res) {
        c_ValidacionDespachos.listarEmpresas(req, res);
    });
    
    app.post('/api/ValidacionDespachos/listarDespachosAprobados', function(req, res){
       c_ValidacionDespachos.listarDespachosAprobados(req, res); 
    });
    
    app.post('/api/ValidacionDespachos/registrarAprobacion', function(req, res){
       c_ValidacionDespachos.registrarAprobacion(req, res); 
    });
    
    app.post('/api/ValidacionDespachos/listarDocumentosOtrasSalidas', function(req, res){
       c_ValidacionDespachos.listarDocumentosOtrasSalidas(req, res); 
    });
    
    app.post('/api/ValidacionDespachos/listarNumeroPrefijoOtrasSalidas', function(req, res){
       c_ValidacionDespachos.listarNumeroPrefijoOtrasSalidas(req, res); 
    });
    
    
};