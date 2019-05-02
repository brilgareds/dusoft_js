/* global G */

var NotasProveedores = function (m_notasProveedores) {
    this.m_notasProveedores = m_notasProveedores;
};

NotasProveedores.prototype.TiposDoc = function (req, res) {
    console.log('In controller "TiposDoc"');
    var that = this;

    G.Q.ninvoke(that.m_notasProveedores, 'TiposDoc', {}).then(function(resultado){
        return res.send(G.utils.r(req.url, 'Lista de Tipos de documentos!!', 200, {tiposDoc: resultado}));
    });
};

NotasProveedores.prototype.listarNotasProveedor = function(req, res){
    console.log('In controller "listarNotasProveedores"');
    var that = this;
    var parametros = req.body.data;
    parametros.empresaId = req.body.session.empresaId;

    G.Q.ninvoke(that.m_notasProveedores, 'listarNotasProveedor', parametros).then(function(resultado) {
        return res.send(G.utils.r(req.url, 'Lista de Notas Proveedor!!', 200, {notasProveedor: resultado}));
    }).fail(function(err){
        return res.send(G.utils.r(req.url, 'Error al listar Nota Proveedor!!', 500, {err: err}));
    });
};

NotasProveedores.$inject = ["m_notasProveedores"];
module.exports = NotasProveedores;
