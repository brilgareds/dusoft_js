
var Autorizaciones = function(autorizaciones, pedidos_farmacias, pedidos_clientes, ordenes_compra, m_productos) {
    this.m_autorizaciones = autorizaciones;
    this.m_pedidos_farmacias = pedidos_farmacias;
    this.m_pedidos_clientes = pedidos_clientes;
    this.m_ordenes_compra = ordenes_compra;
    this.m_productos = m_productos;
};


Autorizaciones.prototype.listarProductosBloqueados = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.autorizaciones === undefined || args.autorizaciones.termino_busqueda === undefined || args.autorizaciones.pagina_actual === undefined || args.autorizaciones.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.autorizaciones.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    if (args.autorizaciones.detalle === undefined) {
        args.autorizaciones.detalle = '';
    }
    var termino_busqueda = {};
    termino_busqueda.termino = args.autorizaciones.termino_busqueda;
    termino_busqueda.empresa = args.autorizaciones.empresa_id;
    termino_busqueda.tipo_pedido = args.autorizaciones.tipo_pedido;
    termino_busqueda.detalles = args.autorizaciones.detalle;
    var pagina_actual = args.autorizaciones.pagina_actual;

    if (termino_busqueda.tipo_pedido === 0) {
        G.Q.nfcall(this.m_autorizaciones.listarProductosBloqueados, termino_busqueda, pagina_actual).
                then(function(listarProductosBloqueados) {
            res.send(G.utils.r(req.url, 'Listado de Productos Bloqueados Clientes!!!!', 200, {listarProductosBloqueados: listarProductosBloqueados}));
        }).
                fail(function(err) {
            res.send(G.utils.r(req.url, 'Error Listado de Productos Bloqueados Clientes', 500, {listarProductosBloqueados: {}}));
        }).
                done();
    } else {
        G.Q.nfcall(this.m_autorizaciones.listarProductosBloqueadosfarmacia, termino_busqueda, pagina_actual).
                then(function(listarProductosBloqueadosfarmacia) {
            res.send(G.utils.r(req.url, 'Listado de Productos Bloqueados Farmacia!!!!', 200, {listarProductosBloqueados: listarProductosBloqueadosfarmacia}));
        }).
                fail(function(err) {
            res.send(G.utils.r(req.url, 'Error Listado de Productos Bloqueados Farmacia', 500, {listarProductosBloqueadosfarmacia: {}}));
        }).
                done();
    }
};

Autorizaciones.prototype.listarVerificacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;
    if (args.verificacion === undefined || args.verificacion.pedidoId === undefined || args.verificacion.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino_busqueda = {};
    termino_busqueda.pedidoId = args.verificacion.pedidoId;
    termino_busqueda.empresa = args.verificacion.empresaid;
    termino_busqueda.tipoPedido = args.verificacion.tipoPedido;
    termino_busqueda.codigoProducto = args.verificacion.codigoProducto;

    G.Q.nfcall(this.m_verificacion.listarVerificacionProductos, termino_busqueda).
            then(function(listarVerificacionProductos) {
        res.send(G.utils.r(req.url, 'Listado Verificacion de Productos Bloqueados!!!!', 200, {listarVerificacionProductos: listarVerificacionProductos}));
    }).
            fail(function(err) {
        res.send(G.utils.r(req.url, 'Error Listado Verificacion de Productos Bloqueados', 500, {listarVerificacionProductos: {}}));
    }).
            done();

};

Autorizaciones.prototype.verificarAutorizacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.autorizarProductos === undefined || args.autorizarProductos.estado === undefined || args.autorizarProductos.autorizacionId === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.autorizarProductos.estado === '' || args.autorizarProductos.autorizacionId === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino = {};
    termino.estado = args.autorizarProductos.estado;
    termino.autorizacionId = args.autorizarProductos.autorizacionId;
    termino.usuarioId = req.body.session.usuario_id;

    G.Q.nfcall(this.m_autorizaciones.verificarAutorizacionProducto, termino).
            then(function(verificarAutorizacionProductos) {
        res.send(G.utils.r(req.url, 'Consultar Autorizacion de Productos Bloqueados ok!!!!', 200, {verificarAutorizacionProductos: verificarAutorizacionProductos}));

    }).
            fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Consultar Autorizacion de Productos Bloqueados', 500, {verificarAutorizacionProducto: {}}));
    }).
            done();

};

Autorizaciones.prototype.modificarAutorizacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.autorizarProductos === undefined || args.autorizarProductos.estado === undefined || args.autorizarProductos.autorizacionId === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.autorizarProductos.estado === '' || args.autorizarProductos.autorizacionId === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino = {};
    termino.estado = args.autorizarProductos.estado;
    termino.autorizacionId = args.autorizarProductos.autorizacionId;
    termino.usuarioId = req.body.session.usuario_id;



    G.Q.nfcall(this.m_autorizaciones.modificarAutorizacionProductos, termino).
            then(function(modificarAutorizacionProductos) {
        res.send(G.utils.r(req.url, 'Actualizo Autorizacion de Productos Bloqueados!!!!', 200, {modificarAutorizacionProductos: modificarAutorizacionProductos}));
    }).
            fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Actualizar Productos Bloqueados', 500, {modificarAutorizacionProductos: {}}));
    }).
            done();

};

Autorizaciones.prototype.insertarAutorizacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.autorizarProductos === undefined || args.autorizarProductos.estado === undefined || args.autorizarProductos.autorizacionId === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.autorizarProductos.estado === '' || args.autorizarProductos.autorizacionId === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino = {};
    termino.estado = args.autorizarProductos.estado;
    termino.autorizacionId = args.autorizarProductos.autorizacionId;
    termino.usuarioId = req.body.session.usuario_id;

    G.Q.nfcall(this.m_autorizaciones.insertarAutorizacionProductos, termino).
            then(function(insertarAutorizacionProductos) {
        res.send(G.utils.r(req.url, 'Inserto Autorizacion de Productos Bloqueados!!!!', 200, {insertarAutorizacionProductos: insertarAutorizacionProductos}));
    }).
            fail(function(err) {
        res.send(G.utils.r(req.url, 'Error Insertar Productos Bloqueados', 500, {insertarAutorizacionProductos: {}}));
    }).
            done();

};

Autorizaciones.prototype.listarVerificacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;
    if (args.verificacion === undefined || args.verificacion.codigoProducto === undefined || args.verificacion.empresaId === undefined || args.verificacion.pedidoId === undefined || args.verificacion.tipoPedido === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino = {};
    termino.codigoProducto = args.verificacion.codigoProducto;
    termino.empresaId = args.verificacion.empresaId;
    termino.pedidoId = args.verificacion.pedidoId;
    termino.tipoPedido = args.verificacion.tipoPedido;

    G.Q.nfcall(this.m_autorizaciones.listarVerificacionProductos, termino).
            then(function(listarVerificacionProductos) {
        res.send(G.utils.r(req.url, 'Listar Productos Verificados ok!!!!', 200, {listarVerificacionProductos: listarVerificacionProductos}));

    }).
            fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Consultar Productos Verificados', 500, {listarVerificacionProductos: {}}));
    }).
            done();

};

Autorizaciones.$inject = ["m_autorizaciones", "m_pedidos_farmacias", "m_pedidos_clientes", "m_ordenes_compra", "m_productos"];

module.exports = Autorizaciones;