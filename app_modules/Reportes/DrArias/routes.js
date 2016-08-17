module.exports = function(app, di_container) {


    var c_Reportes = di_container.get("c_reportes");

    app.post('/api/Reportes/DrArias/listarDrArias', function(req, res) {
        c_Reportes.listarDrArias(req, res);
    });
    
    app.post('/api/Reportes/DrArias/listarPlanes', function(req, res) {
        c_Reportes.listarPlanes(req, res);
    });
    
    app.post('/api/Reportes/DrArias/guardarEstadoReporte', function(req, res) {
        c_Reportes.guardarEstadoReporte(req, res);
    });
    
    app.post('/api/Reportes/DrArias/reportesGenerados', function(req, res) {
        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        c_Reportes.reportesGenerados(req, res);
    });

};