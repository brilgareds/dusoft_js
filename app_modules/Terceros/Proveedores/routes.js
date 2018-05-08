module.exports = function(app, di_container) {

    var c_proveedores = di_container.get("c_proveedores");
    
    app.post('/api/Terceros/Proveedores/listar', function(req, res) {
         c_proveedores.listarProveedores(req, res);
    });    
    
    app.post('/api/Terceros/Proveedores/listarProveedoresPorCodigo', function(req, res) {
         c_proveedores.listarProveedoresPorCodigo(req, res);
    }); 
    
    app.post('/api/Terceros/Proveedores/listarTodosProveedores', function(req, res) {
         c_proveedores.listarTodosProveedores(req, res);
    });    
};