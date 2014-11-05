module.exports = function(app, di_container) {

  
    var c_unidades_negocio = di_container.get("c_unidades_negocio");
    
    app.post('/api/UnidadesNegocio/listarUnidadesNegocio', function(req, res) {
        c_unidades_negocio.listarUnidadesNegocio(req, res);
    });
};