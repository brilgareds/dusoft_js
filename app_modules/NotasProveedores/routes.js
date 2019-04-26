module.exports = function(app, di_container) {
    var c_notasProveedores = di_container.get("c_notasProveedores");
    const base = "/api";

    app.post(base + '/notasProveedores/tiposDoc', (req, res) => {
        c_notasProveedores.TiposDoc(req, res);
    });

    app.post(base + '/notasProveedores/listarNotasProveedores', (req, res) => {
        c_notasProveedores.listarNotasProveedor(req, res);
    });

    app.post(base + '/notasProveedores/crearNotaTemporal', (req, res) => {
        c_notasProveedores.crearNotaTemporal(req, res);
    });

    app.post(base + '/notasProveedores/conceptosEspecificos', (req, res) => {
        c_notasProveedores.conceptosEspecificos(req, res);
    });

    app.post(base + '/notasProveedores/eliminarProductoTemporal', (req, res) => {
        c_notasProveedores.eliminarProductoTemporal(req, res);
    });

    app.post(base + '/notasProveedores/agregarDetalleTemporal', (req, res) => {
        c_notasProveedores.agregarDetalleTemporal(req, res);
    });

    app.post(base + '/notasProveedores/crearNota', (req, res) => {
        c_notasProveedores.crearNota(req, res);
    });

    app.post(base + '/notasProveedores/verNotasFactura', (req, res) => {
        c_notasProveedores.verNotasFactura(req, res);
    });
};
