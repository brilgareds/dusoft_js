module.exports = function(app, di_container) {
    var c_notasProveedores = di_container.get("c_notasProveedores");

    app.post('/api/notasProveedores/tiposDoc', function(req, res) {
        c_notasProveedores.TiposDoc(req, res);
    });

    app.post('/api/notasProveedores/listarNotasProveedores', function(req, res) {
        c_notasProveedores.listarNotasProveedor(req, res);
    });

    app.post('/api/notasProveedores/guardarTemporalDetalle', function(req, res) {
        c_notasProveedores.temporalDetalle(req, res);
    });
};
