module.exports = function(app, di_container) {

    var c_tutoriales = di_container.get("c_tutoriales");
    
 
    app.post("/api/DispensacionHc/insertarFormulasDispensacionEstadosAutomatico", function(req, res){
        c_tutoriales.insertarFormulasDispensacionEstadosAutomatico(req, res);
    });
    
    
    
};