var DevolucionesFarmacia = function (m_devoluciones_farmacia) {
    this.m_devoluciones_farmacia = m_devoluciones_farmacia;
};


/* @author German Andres Galvis H.
 * @fecha 2018-02-08
 * funcion para consultar empresas
 * @param {type} req
 * @param {type} res
 * @returns {datos de consulta}
 */
/*DevolucionesFarmacia.prototype.listarEmpresas2 = function(req, res) {
 
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
 };*/


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

/**
 * @author German Galvis
 * +Descripcion lista los centros de utilidad
 * @fecha 2018-02-08
 */
DevolucionesFarmacia.prototype.listarCentrosUtilidad = function (req, res) {
    var that = this;
    var args = req.body.data;
    var empresa_seleccionada = args.devoluciones.empresa_id;



    G.Q.nfcall(that.m_devoluciones_farmacia.listarCentrosUtilidad, empresa_seleccionada).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar centros utilidad ok!!!!', 200, {listarCentrosUtilidad: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de centros de utilidad', 500, {listarCentrosUtilidad: {}}));
            }).
            done();

};

/**
 * @author German Galvis
 * +Descripcion lista las bodegas
 * @fecha 2018-02-08
 */
DevolucionesFarmacia.prototype.listarBodegas = function (req, res) {
    var that = this;
    var args = req.body.data;
    var ids = {};

    ids.empresa = args.devoluciones.empresa_id;
    ids.centroUtilidad = args.devoluciones.centro_utilidad_id;

    G.Q.nfcall(that.m_devoluciones_farmacia.listarBodegas, ids).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar bodegas ok!!!!', 200, {listarBodegas: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de bodegas', 500, {listarBodegas: {}}));
            }).
            done();

};


DevolucionesFarmacia.$inject = ["m_devoluciones_farmacia"];

module.exports = DevolucionesFarmacia;