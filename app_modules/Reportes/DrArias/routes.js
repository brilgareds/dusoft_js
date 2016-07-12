module.exports = function(app, di_container) {


    var c_Reportes = di_container.get("c_reportes");

    app.post('/api/Reportes/DrArias/listarDrArias', function(req, res) {
        c_Reportes.listarDrArias(req, res);
    });
    
    app.post('/api/Reportes/DrArias/listarPlanes', function(req, res) {
        c_Reportes.listarPlanes(req, res);
    });

};