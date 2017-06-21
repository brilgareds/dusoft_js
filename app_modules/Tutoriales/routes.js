module.exports = function(app, di_container) {

    var c_tutoriales = di_container.get("c_tutoriales");
    
 
    app.post("/api/Tutoriales/listarVideos", function(req, res){
        c_tutoriales.listarVideos(req, res);
    });
    
    app.post("/api/Tutoriales/guardarTutorial", function(req, res){
        c_tutoriales.guardarTutorial(req, res);
    });
    
    app.post("/api/Tutoriales/subirArchivoTutorial", function(req, res){
        c_tutoriales.subirArchivoTutorial(req, res);
    });
    
    
       /* var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty({ uploadDir: G.dirname + '/files/Tutoriales/Videos/' });
    
    app.post("/api/Tutoriales/subirArchivoTutorial", multipartyMiddleware, function(req, res){
        c_tutoriales.subirArchivoTutorial(req, res);
    });*/
    
};