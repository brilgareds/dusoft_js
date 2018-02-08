var DevolucionesFarmacia = function(ordenes_devoluciones, m_productos, m_usuarios) {
    this.m_ordenes_devoluciones = ordenes_devoluciones;
    this.m_productos = m_productos;
    this.m_usuarios = m_usuarios;
};


/* @author German Andres Galvis H.
 * @fecha 2018-02-08
 * funcion para consultar empresas
 * @param {type} req
 * @param {type} res
 * @returns {datos de consulta}
 */
DevolucionesFarmacia.prototype.listarEmpresas = function(req, res) {

    var that = this;
    var args = req.body.data;
    var empresa = args.listar_empresas.empresaName;
    if (empresa === undefined) {
        res.send(G.utils.r(req.url, 'empresa, No esta definida', 404, {}));
        return;
    }
    that.m_devoluciones_farmacia.listarEmpresas(empresa, function(err, empresas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las empresas', 500, {listar_empresas: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de empresas OK', 200, {listar_empresas: empresas}));
        }
    });
};