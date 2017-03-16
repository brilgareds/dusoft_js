module.exports = function(app, di_container) {

    var c_tutoriales = di_container.get("c_tutoriales");
    
 
    app.post("/api/Tutoriales/listarVideos", function(req, res){
        c_tutoriales.listarVideos(req, res);
    });
    
    
    
};