module.exports = function(app, di_container) {

    /*var terceros_controller = require('./controllers/TercerosController');
    var terceros_model = require('./models/TercerosModel');
   
    di_container.register("c_terceros", terceros_controller);
    di_container.register("m_terceros", terceros_model);*/
    
    var c_operarios = di_container.get("c_operarios");
    
    app.post('/api/Terceros/operariosBodega/listar', function(req, res) {
         c_operarios.listarOperariosBodega(req, res);
    });
    
    app.post('/api/Terceros/operariosBodega/crear', function(req, res) {
         c_operarios.crearOperariosBodega(req, res);
    });
    
    app.post('/api/Terceros/operariosBodega/modificar', function(req, res) {
         c_operarios.modificarOperariosBodega(req, res);
    });
    
};