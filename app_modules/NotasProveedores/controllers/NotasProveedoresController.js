/* global G */

var NotasProveedores = function (m_notasProveedores) {
    this.m_notasProveedores = m_notasProveedores;
};

NotasProveedores.prototype.TiposDoc = function (req, res) {
    console.log('In controller "TiposDoc"');
    var that = this;

    G.Q.ninvoke(that.m_notasProveedores, 'TiposDoc', {}).then(function (resultado) {
        return res.send(G.utils.r(req.url, 'Lista de Tipos de documentos!!', 200, {tiposDoc: resultado}));
    });
};

NotasProveedores.prototype.listarNotasProveedor = function (req, res) {
    console.log('In controller "listarNotasProveedores"');
    var that = this;
    var parametros = req.body.data;
    parametros.empresaId = req.body.session.empresaId;

    G.Q.ninvoke(that.m_notasProveedores, 'listarNotasProveedor', parametros).then(function (resultado) {
        return res.send(G.utils.r(req.url, 'Lista de Notas Proveedor!!', 200, {notasProveedor: resultado}));
    }).fail(function (err) {
        return res.send(G.utils.r(req.url, 'Error al listar Nota Proveedor!!', 500, {err: err}));
    });
};

var number_money = function(price){
    console.log('\nPrecio es: '+ price);
    var number = String(price.replace(/(\D)/g, ""));
    console.log('Precio sin comas ni puntos fue de: ', number, '\n');
    price = new Intl.NumberFormat("de-DE").format(price);
    price ='$'+price.replace(/(,)/g, "coma").replace(/(\.)/g, "punto").replace(/(coma)/g, ".").replace(/(punto)/g, ",");

    console.log('Nuevo precio: ', price + '\n');
    return price;
};

NotasProveedores.prototype.temporalDetalle = function (req, res) {
    console.log('In controller "temporalDetalle"');
    var that = this;
    var parametros = req.body.data;
    var data = {};
    parametros.empresaId = req.body.session.empresaId;
    parametros.usuarioId = req.body.session.usuario_id;
    parametros.modulo = 'Inv_NotasFacturasProveedor';
    parametros.number_money = number_money;
    //console.log('Parametros son: ', parametros);

    G.Q.ninvoke(that.m_notasProveedores, 'BuscarCrearTemporal', parametros)
        .then(function (response) {
            data.temporal = response;
            return G.Q.ninvoke(that.m_notasProveedores, 'ParametrosNota', parametros);
        }).then(function (response) {
            data.parametrosNota = response;
            return G.Q.ninvoke(that.m_notasProveedores, 'DetalleNotaTemporal', parametros);
        }).then(function (response) {
            data.detalleNotaTemporal = response;
            return G.Q.ninvoke(that.m_notasProveedores, 'BuscarDetalle', parametros);
        }).then(function (response) {
            data.buscarDetalle = response;
            return G.Q.ninvoke(that.m_notasProveedores, 'BuscarGlosasConceptoGeneral', parametros);
        }).then(function (response) {
            data.glosasConceptoGeneral = response;
            return G.Q.ninvoke(that.m_notasProveedores, 'ParametrosRetencion', parametros);
        }).then(function (response) {
            data.parametrosRetencion = response;
            return res.send(G.utils.r(req.url, 'Temporal guardado con exito', 200, data));
        }).fail(function (err) {
            console.log('Error: ', err);
            return res.send(G.utils.r(req.url, 'Error al guardar temporal', 200, {err: err}));
        });
};

NotasProveedores.$inject = ["m_notasProveedores"];
module.exports = NotasProveedores;
