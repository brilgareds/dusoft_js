module.exports = function(app, di_container) {

    var terceros_controller = require('./controllers/TercerosController');
    var terceros_model = require('./models/TercerosModel');
   
    di_container.register("c_terceros", terceros_controller);
    di_container.register("m_terceros", terceros_model);
    
    
    var c_terceros = di_container.get("c_terceros");
    
    app.get('/api/Terceros/operariosBodega', function(req, res) {
         c_terceros.listarOperariosBodega(req, res);
    });
    
};