module.exports = function(app, di_container) {

  
    var c_centros_utilidad = di_container.get("c_centros_utilidad");
    
    app.post('/api/CentrosUtilidad/listarCentrosUtilidadEmpresa', function(req, res) {
        c_centros_utilidad.listar_centros_utilidad_empresa(req, res);
    });
    
    app.post('/api/CentrosUtilidad/listarCentrosUtilidadCiudad', function(req, res) {
        c_centros_utilidad.listar_centros_utilidad_ciudad(req, res);
    });
    
    app.post('/api/CentrosUtilidad/listarCentrosUtilidadbodega', function(req, res) {
        c_centros_utilidad.listar_centros_utilidad_bodega(req, res);
    });
    
    app.post('/api/CentrosUtilidad/listarFarmaciasTerceros', function(req, res) {
        c_centros_utilidad.listarFarmaciasTerceros(req, res);
    });
};