module.exports = function(app, di_container) {

  
    var c_modulos = di_container.get("c_modulos");
    
    app.post('/api/Modulos/listarModulos', function(req, res) {
        c_modulos.listar_modulos(req, res);
    });
};