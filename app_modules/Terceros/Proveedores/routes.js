module.exports = function(app, di_container) {

    var c_proveedores = di_container.get("c_proveedores");
    
    app.post('/api/Terceros/Proveedores/listar', function(req, res) {
         c_proveedores.listarProveedores(req, res);
    });    
};