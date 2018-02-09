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
DevolucionesFarmacia.prototype.listarEmpresas2 = function(req, res) {

console.log("controller back listarEmpresas2");

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


/**
 * @author German Galvis
 * +Descripcion lista las empresas
 * @fecha 2018-02-08
 */
DevolucionesFarmacia.prototype.listarEmpresas = function (req, res) {
    
    console.log("controller back listarEmpresas");
    var that = this;
    var args = req.body.data;
    G.Q.nfcall(that.m_devoluciones_farmacia.listarEmpresas).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar Empresas ok!!!!', 200, {listarEmpresas: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listar Empresas', 500, {listarEmpresas: {}}));
            }).
            done();

};