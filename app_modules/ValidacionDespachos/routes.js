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
    
    /**
     * +Descripcion Servicio encargado de validar la existencia de un documento
     *              si ya se encuentra aprobado o no
     */
    app.post('/api/ValidacionDespachos/validarExistenciaDocumento', function(req, res){
       c_ValidacionDespachos.validarExistenciaDocumento(req, res); 
    });
    
    app.post('/api/ValidacionDespachos/adjuntarImagen', function(req, res){
       c_ValidacionDespachos.adjuntarImagen(req, res); 
    });
    
    app.post('/api/ValidacionDespachos/listarImagenes', function(req, res){
       c_ValidacionDespachos.listarImagenes(req, res); 
    });
    
    app.post('/api/ValidacionDespachos/eliminarImagen', function(req, res){
       c_ValidacionDespachos.eliminarImagen(req, res); 
    });
    
    app.post('/api/ValidacionDespachos/modificarRegistroEntradaBodega', function(req, res){
       c_ValidacionDespachos.modificarRegistroEntradaBodega(req, res); 
    });
    app.post('/api/ValidacionDespachos/registroEntradaBodega', function(req, res){
       c_ValidacionDespachos.registroEntradaBodega(req, res); 
    });
    app.post('/api/ValidacionDespachos/listarRegistroEntrada', function(req, res){
       c_ValidacionDespachos.listarRegistroEntrada(req, res); 
    });
    
    app.post('/api/ValidacionDespachos/listarPrefijos', function(req, res){
        console.log("--------/api/ValidacionDespachos/listarPrefijos");
       c_ValidacionDespachos.listarPrefijos(req, res); 
    });
    
    
    
};