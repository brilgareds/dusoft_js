
/* global G */

var OrdenesCompra = function (ordenes_compras, productos, eventos_ordenes_compras, emails, m_usuarios, m_actasTecnicas, m_e008, m_movimientos_bodegas, m_i002, c_i002, c_pedidos_clientes, m_pedidos_clientes, c_e008, c_pedidos_farmacias, m_pedidos_farmacias) {

    this.m_ordenes_compra = ordenes_compras;
    this.m_productos = productos;
    this.e_ordenes_compra = eventos_ordenes_compras;
    this.emails = emails;
    this.m_usuarios = m_usuarios;
    this.m_actasTecnicas = m_actasTecnicas;
    this.m_e008 = m_e008;
    this.m_movimientos_bodegas = m_movimientos_bodegas;
    this.m_i002 = m_i002;
    this.c_i002 = c_i002;
    this.c_pedidos_clientes = c_pedidos_clientes;
    this.c_pedidos_farmacias = c_pedidos_farmacias;
    this.m_pedidos_clientes = m_pedidos_clientes;
    this.m_pedidos_farmacias = m_pedidos_farmacias;
    this.c_e008 = c_e008;
};


// Listar las ordenes de compra
OrdenesCompra.prototype.listarOrdenesCompra = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.fecha_inicial === undefined || args.ordenes_compras.fecha_final === undefined) {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.termino_busqueda === undefined || args.ordenes_compras.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda, pagina_actual no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.fecha_inicial === '' || args.ordenes_compras.fecha_final === '') {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final estan vacias', 404, {}));
        return;
    }

    if (args.ordenes_compras.pagina_actual === '' || args.ordenes_compras.pagina_actual === 0 || args.ordenes_compras.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }


    var parametros = {fecha_inicial: args.ordenes_compras.fecha_inicial,
        fecha_final: args.ordenes_compras.fecha_final,
        termino_busqueda: args.ordenes_compras.termino_busqueda,
        pagina_actual: args.ordenes_compras.pagina_actual,
        filtro: args.ordenes_compras.filtro || undefined,
        sw_recepcion: args.ordenes_compras.sw_recepcion
    };

    G.Q.ninvoke(that.m_ordenes_compra, "listar_ordenes_compra", parametros).
            then(function (resultado) {

                res.send(G.utils.r(req.url, 'Lista Ordenes Compras', 200, {ordenes_compras: resultado}));
            }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));

    }).done();

};


// Listar las Ordenes de Compra de un Proveedor
OrdenesCompra.prototype.listarOrdenesCompraProveedor = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.codigo_proveedor_id === undefined) {
        res.send(G.utils.r(req.url, 'codigo_proveedor_id no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.codigo_proveedor_id === '') {
        res.send(G.utils.r(req.url, 'codigo_proveedor_id estan vacias', 404, {}));
        return;
    }

    if (args.ordenes_compras.bloquearEstados === undefined) {
        args.ordenes_compras.bloquearEstados = false;
    }

    if (args.ordenes_compras.empresaId === undefined) {
        args.ordenes_compras.empresaId = "";
    }

    if (args.ordenes_compras.centroUtilidad === undefined) {
        args.ordenes_compras.centroUtilidad = "";
    }

    if (args.ordenes_compras.bodega === undefined) {
        args.ordenes_compras.bodega = "";
    }

    var codigo_proveedor_id = args.ordenes_compras.codigo_proveedor_id;
    var bloquearestado = args.ordenes_compras.bloquearEstados;
    var filtraUnidadNegocio = args.ordenes_compras.filtraUnidadNegocio;

    var paremetros = {
        codigo_proveedor_id: codigo_proveedor_id,
        bloquearestado: bloquearestado,
        empresaId: args.ordenes_compras.empresaId,
        centroUtilidad: args.ordenes_compras.centroUtilidad,
        bodega: args.ordenes_compras.bodega,
        termino_busqueda: (args.ordenes_compras.termino_busqueda === undefined ? "" : args.ordenes_compras.termino_busqueda),
        filtraUnidadNegocio: filtraUnidadNegocio
    };

    that.m_ordenes_compra.listar_ordenes_compra_proveedor(paremetros, function (err, lista_ordenes_compras) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Ordenes Compras', 200, {ordenes_compras: lista_ordenes_compras}));
            return;
        }
    });
};


// Consultar Orden de Compra por numero de orden
OrdenesCompra.prototype.consultarOrdenCompra = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.numero_orden === 0 || args.ordenes_compras.numero_orden === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero_orden', 404, {}));
        return;
    }

    var numero_orden = args.ordenes_compras.numero_orden;

    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function (err, orden_compra) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {orden_compra: []}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Orden de Compra', 200, {orden_compra: orden_compra}));
            return;
        }
    });
};

// Consultar Orden de Compra por numero de orden
OrdenesCompra.prototype.consultarDetalleOrdenCompra = function (req, res) {

    var that = this;

    var args = req.body.data;
    var filtro = '';
    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.termino_busqueda === undefined || args.ordenes_compras.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda, pagina_actual no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.numero_orden === 0 || args.ordenes_compras.numero_orden === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero_orden', 404, {}));
        return;
    }

    if (args.ordenes_compras.pagina_actual === '' || args.ordenes_compras.pagina_actual === 0 || args.ordenes_compras.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    if (args.ordenes_compras.filtro !== undefined || args.ordenes_compras.filtro !== '') {
        filtro = args.ordenes_compras.filtro;
    }

    var numero_orden = args.ordenes_compras.numero_orden;
    var termino_busqueda = args.ordenes_compras.termino_busqueda;
    var pagina_actual = args.ordenes_compras.pagina_actual;
    var parametros = {
        numero_orden: numero_orden,
        termino_busqueda: termino_busqueda,
        pagina_actual: pagina_actual,
        filtro: filtro};

    that.m_ordenes_compra.consultar_detalle_orden_compra(parametros, function (err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {lista_productos: []}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Orden de Compra', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};

// Consultar Orden de Compra por numero de orden
OrdenesCompra.prototype.consultarDetalleOrdenCompraConNovedades = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.termino_busqueda === undefined || args.ordenes_compras.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda, pagina_actual no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.numero_orden === 0 || args.ordenes_compras.numero_orden === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero_orden', 404, {}));
        return;
    }

    if (args.ordenes_compras.pagina_actual === '' || args.ordenes_compras.pagina_actual === 0 || args.ordenes_compras.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var numero_orden = args.ordenes_compras.numero_orden;
    var termino_busqueda = args.ordenes_compras.termino_busqueda;
    var pagina_actual = args.ordenes_compras.pagina_actual;

    that.m_ordenes_compra.consultarDetalleOrdenCompraConNovedades(numero_orden, termino_busqueda, pagina_actual, function (err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {lista_productos: []}));
            return;
        } else {

            res.send(G.utils.r(req.url, 'Orden de Compra', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};




// Listar productos para ordenes de compra
OrdenesCompra.prototype.listarProductos = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.empresa_id === undefined || args.ordenes_compras.codigo_proveedor_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, codigo_proveedor_id no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === undefined) {
        res.send(G.utils.r(req.url, 'numero_pedido no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.laboratorio_id === undefined) {
        res.send(G.utils.r(req.url, 'laboratorio_id no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.termino_busqueda === undefined || args.ordenes_compras.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda, pagina_actual no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.empresa_id === '' || args.ordenes_compras.codigo_proveedor_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, codigo_proveedor_id estan vacias', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '') {
        res.send(G.utils.r(req.url, 'numero_pedido no esta vacio', 404, {}));
        return;
    }

    if (args.ordenes_compras.pagina_actual === '' || args.ordenes_compras.pagina_actual === 0 || args.ordenes_compras.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var numero_orden = args.ordenes_compras.numero_orden;
    var empresa_id = args.ordenes_compras.empresa_id;
    var codigo_proveedor_id = args.ordenes_compras.codigo_proveedor_id;
    var laboratorio_id = args.ordenes_compras.laboratorio_id;

    var termino_busqueda = args.ordenes_compras.termino_busqueda;
    var pagina_actual = args.ordenes_compras.pagina_actual;
    var filtro = args.ordenes_compras.filtro || undefined;

    that.m_ordenes_compra.listar_productos(empresa_id, codigo_proveedor_id, numero_orden, termino_busqueda, laboratorio_id, pagina_actual, filtro, function (err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {lista_productos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Productos', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};


OrdenesCompra.prototype.guardarBodega = function (req, res) {
    var that = this;
    var args = req.body.data;

    var bodegaDestino = args.ordenes_compras.bodegaDestino || undefined;
    var borrarBodega = args.ordenes_compras.borrarBodega;
    var ante = [];

    if (!bodegaDestino) {
        res.send(G.utils.r(req.url, 'La bodega destino no esta definida', 404, {}));
        return;
    }

    var parametro = {
        orden_compra_id: bodegaDestino.ordenCompraId,
        usuario_id: req.session.user.usuario_id,
        fecha: new Date()
    };

    if (bodegaDestino && !borrarBodega) {
        G.Q.nfcall(that.m_ordenes_compra.listOrdenCompraDestino, parametro).then(function (resultado) {
            if (resultado.length > 0) {
                parametro.anterior = JSON.stringify({"bodega": resultado[0].bodega});
            } else {
                parametro.anterior = JSON.stringify("");
            }

            return G.Q.nfcall(that.m_ordenes_compra.guardarDestinoOrden, bodegaDestino);

        }).then(function (resultado) {

            parametro.accion = resultado.accion;
            return G.Q.nfcall(that.m_ordenes_compra.listOrdenCompraDestino, parametro);

        }).then(function (resultado) {

            /*
             * @Andres M. Gonzalez
             * Fecha: 09-10-2017
             * +Descripcion: se modifica para realizar el log del modulo
             */
            parametro.actual = JSON.stringify({"bodega": resultado[0].bodega});
            bodegaDestino.descripcionAccion = 'Inserta Orden de Compra Destino ';

            if (parametro.accion === '2') {
                bodegaDestino.descripcionAccion = 'Modifica Orden de Compra Destino ';
            }

            parametro.tabla = 'compras_ordenes_destino';
            parametro.detalle = JSON.stringify(bodegaDestino);

            return G.Q.nfcall(that.m_ordenes_compra.insertar_orden_compra_logs, parametro);

        }).then(function (resultado) {
            res.send(G.utils.r(req.url, 'Se ha modificado la bodega correctamente', 200, {}));
        }).catch(function (err) {
            res.send(G.utils.r(req.url, 'Error modificando la bodega destino', 500, {}));
        });

    } else if (borrarBodega) {

        G.Q.nfcall(that.m_ordenes_compra.listOrdenCompraDestino, parametro).then(function (resultado) {

            parametro.anterior = JSON.stringify({"bodega": +resultado[0].bodega});

            return G.Q.nfcall(that.m_ordenes_compra.borrarBodegaOrden, bodegaDestino.ordenCompraId);

        }).then(function (resultado) {
            /*
             * @Andres M. Gonzalez
             * Fecha: 09-10-2017
             * +Descripcion: se modifica para realizar el log del modulo
             */

            parametro.accion = '0';
            parametro.tabla = 'compras_ordenes_destino';

            parametro.actual = "";
            bodegaDestino.descripcionAccion = 'Elimina Orden de Compra Destino';
            parametro.detalle = JSON.stringify(bodegaDestino);

            return G.Q.nfcall(that.m_ordenes_compra.insertar_orden_compra_logs, parametro);

        }).then(function (resultado) {

            res.send(G.utils.r(req.url, 'Se ha eliminado la bodega destino correctamente', 200, {}));

        }).catch(function (err) {
            res.send(G.utils.r(req.url, 'Error modificando la bodega destino', 500, {}));
        });
    }
};

// Insertar una orden de compra 
OrdenesCompra.prototype.insertarOrdenCompra = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.unidad_negocio === undefined || args.ordenes_compras.codigo_proveedor === undefined || args.ordenes_compras.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'unidad_negocio, codigo_proveedor, empresa_id no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.observacion === undefined) {
        res.send(G.utils.r(req.url, 'observacion no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.unidad_negocio === '' || args.ordenes_compras.codigo_proveedor === '' || args.ordenes_compras.empresa_id === '') {
        res.send(G.utils.r(req.url, 'unidad_negocio, codigo_proveedor o empresa_id  estan vacias', 404, {}));
        return;
    }

    if (args.ordenes_compras.observacion === '') {
        res.send(G.utils.r(req.url, 'observacion esta vacia', 404, {}));
        return;
    }

    /*G.Q.nfcall(that.m_ordenes_compra.insertar_orden_compra, unidad_negocio, proveedor, empresa_id, observacion, usuario_id, null).then(function(rows) {
     var def = G.Q.defer();
     numero_orden = (rows.length > 0) ? rows[0].orden_pedido_id : 0;
     //Se guarda la ubicacion de la bodega destino de la orden
     if (bodegaDestino) {
     bodegaDestino.ordenCompraId = numero_orden;
     return G.Q.nfcall(that.m_ordenes_compra.guardarDestinoOrden, bodegaDestino);
     } else {
     def.resolve();
     }
     
     }).then(function(resulado) {
     res.send(G.utils.r(req.url, 'Orden de Compra regitrada correctamente', 200, {numero_orden: numero_orden}));
     }).fail(function(err) {
     console.log("error generado ", err);
     res.send(G.utils.r(req.url, 'Se ha generado un error', 500, {lista_productos: {}}));
     }).done();*/

    var parametros = {
        unidad_negocio: args.ordenes_compras.unidad_negocio,
        proveedor: args.ordenes_compras.codigo_proveedor,
        empresa_id: args.ordenes_compras.empresa_id,
        observacion: args.ordenes_compras.observacion,
        bodegaDestino: args.ordenes_compras.bodegaDestino,
        usuario_id: req.session.user.usuario_id,
        empresa_pedido: args.ordenes_compras.empresa_pedido,
        centro_utilidad_pedido: args.ordenes_compras.centro_utilidad_pedido,
        bodega_pedido: args.ordenes_compras.bodega_pedido,
        terminar_orden: false
    };


    G.Q.ninvoke(that, "__insertarOrdenCompra", parametros).then(function (resultado) {

        res.send(G.utils.r(req.url, resultado.msj, resultado.status, resultado.data));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, err.msj, err.status, {lista_productos: err}));
    });
};

// Modificar la unidad de negocio de una orden de compra 
OrdenesCompra.prototype.modificarUnidadNegocio = function (req, res) {
    var that = this;
    var orden_compra = [];

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined || args.ordenes_compras.unidad_negocio === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.numero_orden === 0 || args.ordenes_compras.numero_orden === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero_orden', 404, {}));
        return;
    }

    if (args.ordenes_compras.unidad_negocio === '') {
        res.send(G.utils.r(req.url, 'Se requiere la unidad de negocio', 404, {}));
        return;
    }

    var numero_orden = args.ordenes_compras.numero_orden;
    var unidad_negocio = args.ordenes_compras.unidad_negocio;


    //validar que la OC no tenga NINGUN ingreso temporal y este Activa.
    G.Q.nfcall(that.m_ordenes_compra.consultar_orden_compra, numero_orden).then(function (orden_compras) {

        orden_compra = orden_compras[0][0];

        if (orden_compra.tiene_ingreso_temporal === 0 && (orden_compra.estado === '1' || orden_compra.estado === '3' || orden_compra.estado === '4' || orden_compra.estado === '6')) {

            return G.Q.nfcall(that.m_ordenes_compra.modificar_unidad_negocio, numero_orden, unidad_negocio);

        } else {
            res.send(G.utils.r(req.url, 'La orden de compra no puede ser modificada en el estado actual.', 403, {orden_compra: []}));
            return;
        }

    }).then(function (resultado) {

        return G.Q.nfcall(that.m_ordenes_compra.listarComprasOrdenesPedidos, numero_orden);

    }).then(function (resultado) {
        var actual = resultado[0][0];

        var parametros = {
            unidad_negocio: unidad_negocio,
            numero_orden: numero_orden,
            descripcion: 'modificar_unidad_negocio',
            descripcionAccion: 'modifico unidad de negocio'
        };

        var parametro = {
            orden_compra_id: numero_orden,
            usuario_id: req.session.user.usuario_id,
            tabla: 'compras_ordenes_pedidos',
            accion: '2',
            actual: JSON.stringify({"unidad_de_negocio": actual.unidad_negocio}),
            anterior: JSON.stringify({"unidad_de_negocio": orden_compra.descripcion}),
            detalle: JSON.stringify(parametros),
            fecha: new Date()
        };

        return G.Q.nfcall(that.m_ordenes_compra.insertar_orden_compra_logs, parametro);

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Unidad de negocio actualizada correctamente', 200, {orden_compra: []}));

    }).catch(function (err) {


        var msj = "No se pudo actualizar la unidad de negocio";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }

        res.send(G.utils.r(req.url, msj, status, {sesion: err.obj || {}}));

//        res.send(G.utils.r(req.url, 'No se pudo actualizar la unidad de negocio', 500, {orden_compra: []}));

    });
};


// Modificar Observacion de una orden de compra 
OrdenesCompra.prototype.modificarObservacion = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined || args.ordenes_compras.observacion === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.numero_orden === 0 || args.ordenes_compras.numero_orden === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero_orden', 404, {}));
        return;
    }

    if (args.ordenes_compras.observacion === '') {
        res.send(G.utils.r(req.url, 'Se requiere la observacion', 404, {}));
        return;
    }

    var numero_orden = args.ordenes_compras.numero_orden;
    var observacion = args.ordenes_compras.observacion;


    //validar que la OC no tenga NINGUN ingreso temporal y este Activa.
//    G.Q.nfcall(that.m_ordenes_compra.consultar_orden_compra, numero_orden).then(function(orden_compras) {
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function (err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if (orden_compra.tiene_ingreso_temporal === 0 && (orden_compra.estado === '1' || orden_compra.estado === '3' || orden_compra.estado === '4' || orden_compra.estado === '6')) {

                that.m_ordenes_compra.modificar_observacion(numero_orden, observacion, function (err, rows, result) {

                    if (err || result.rowCount === 0) {

                        res.send(G.utils.r(req.url, 'No se pudo actualizar la observacion', 500, {orden_compra: []}));
                        return;
                    } else {
                        var parametros = {
                            observacion: observacion,
                            numero_orden: numero_orden,
                            descripcion: 'modificar_observacion',
                            estado: orden_compra.estado,
                            tiene_ingreso_temporal: orden_compra.tiene_ingreso_temporal,
                            descripcionAccion: 'modifico observacion'
                        };

                        var parametro = {
                            orden_compra_id: numero_orden,
                            usuario_id: req.session.user.usuario_id,
                            tabla: 'compras_ordenes_pedidos',
                            accion: '2',
                            anterior: JSON.stringify({"observacion": orden_compra.observacion}),
                            detalle: JSON.stringify(parametros),
                            fecha: new Date()
                        };
                        that.m_ordenes_compra.consultar_orden_compra(numero_orden, function (err, orden_compras) {

                            parametro.actual = JSON.stringify({"observacion": orden_compras[0].observacion});

                            that.m_ordenes_compra.insertar_orden_compra_logs(parametro, function (err, rows, result) {

                                res.send(G.utils.r(req.url, 'Observacion actualizada correctamente', 200, {orden_compra: []}));
                                return;
                            });
                        });
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'La orden de compra no puede ser modificada en el estado actual.', 403, {orden_compra: []}));
                return;
            }
        }
    });
};



// Insertar Detalle una orden de compra 
OrdenesCompra.prototype.insertarDetalleOrdenCompra = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined || args.ordenes_compras.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden o codigo_producto no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.cantidad_solicitada === undefined || args.ordenes_compras.valor === undefined || args.ordenes_compras.iva === undefined) {
        res.send(G.utils.r(req.url, 'cantidad_solicitada, valor o iva no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'numero_orden o codigo_producto  estan vacias', 404, {}));
        return;
    }

    if (args.ordenes_compras.cantidad_solicitada === '' || args.ordenes_compras.valor === '' || args.ordenes_compras.iva === '') {
        res.send(G.utils.r(req.url, 'cantidad_solicitada, valor o iva esta vacia', 404, {}));
        return;
    }

    if (args.ordenes_compras.estado_documento === undefined) {
        args.ordenes_compras.estado_documento = false;
    }

    var numero_orden = args.ordenes_compras.numero_orden;
    var codigo_producto = args.ordenes_compras.codigo_producto;
    var cantidad_solicitada = args.ordenes_compras.cantidad_solicitada;
    var valor = args.ordenes_compras.valor;
    var iva = args.ordenes_compras.iva;
    var modificar = args.ordenes_compras.modificar || false;
    var entrar;
    var item_id = '';


    //validar que la OC no tenga NINGUN ingreso temporal y este Activa.
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function (err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];


            if (orden_compra.tiene_ingreso_temporal === 0 && orden_compra.estado === '1') {
                entrar = true;
            } else {
                entrar = args.ordenes_compras.estado_documento;
                item_id = args.ordenes_compras.item_id;
            }
            entrar = true;//se deja temporal la modificacion
            /*
             * @Andres mauricio gonzalez
             * +descripcion: se comento la validacion de los estados y se valida con la entrada
             */

            if (entrar) {

//            if (orden_compra.tiene_ingreso_temporal === 0 && (orden_compra.estado === '1' || orden_compra.estado === '3' || orden_compra.estado === '4' || orden_compra.estado === '6')) {


                if (!modificar) {

                    that.m_ordenes_compra.insertar_detalle_orden_compra(numero_orden, codigo_producto, cantidad_solicitada, valor, iva, null, null, null, function (err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
                            return;
                        } else {
                            //se reutiliza esta funcion para el ingreso de productos al I002, se envia el item_id
                            if (item_id !== undefined && item_id !== '') {

                                that.m_ordenes_compra.modificar_detalle_orden_compra_item(numero_orden, codigo_producto, cantidad_solicitada, item_id, function (err, rows, result) {
                                    res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200, {ordenes_compras: {}}));
                                    return;
                                });
                            } else {
                                res.send(G.utils.r(req.url, 'Producto regitrado correctamente', 200, {ordenes_compras: {}}));
                                return;
                            }
                        }
                    });

                } else {
                    var lista_productos;
                    that.m_ordenes_compra.consultar_detalle_orden_compra({numero_orden: numero_orden, termino_busqueda: codigo_producto}, function (err, lista_productos) {
                        lista_productos = lista_productos[0];

                        that.m_ordenes_compra.modificar_detalle_orden_compra(numero_orden, codigo_producto, cantidad_solicitada, valor, function (err, rows, result) {

                            if (err || result.rowCount === 0) {
                                res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
                                return;
                            } else {

                                var parametros = {
                                    numero_orden: numero_orden,
                                    codigo_producto: codigo_producto,
                                    cantidad_solicitada: cantidad_solicitada,
                                    valor: valor,
                                    descripcion: 'modificar_detalle_orden_compra',
                                    descripcionAccion: 'modifico (unidad y/o valor)'

                                };

                                var parametro = {
                                    orden_compra_id: numero_orden,
                                    usuario_id: req.session.user.usuario_id,
                                    codigo_producto: codigo_producto,
                                    tabla: 'compras_ordenes_pedidos_detalle',
                                    accion: '2',
                                    anterior: JSON.stringify({"cantidad_solicitada": lista_productos.cantidad_solicitada, "valor": lista_productos.valor}),
                                    detalle: JSON.stringify(parametros),
                                    fecha: new Date()
                                };
                                that.m_ordenes_compra.consultar_detalle_orden_compra({numero_orden: numero_orden, termino_busqueda: codigo_producto}, function (err, lista_productos) {
                                    lista_productos = lista_productos[0];
                                    parametro.actual = JSON.stringify({"cantidad_solicitada": lista_productos.cantidad_solicitada, "valor": lista_productos.valor})
                                    that.m_ordenes_compra.insertar_orden_compra_logs(parametro, function (err, rows, result) {
                                        res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200, {ordenes_compras: {}}));
                                        return;
                                    });
                                });
                            }
                        });
                    });
                }

            } else {
                res.send(G.utils.r(req.url, 'La orden de compra no puede ser modificada en el estado actual.', 403, {orden_compra: []}));
                return;
            }
        }
    });
};


OrdenesCompra.prototype.cambiarEstado = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined || args.ordenes_compras.estado === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden o estado  no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.estado === '') {
        res.send(G.utils.r(req.url, 'numero_orden o estado esta vacias', 404, {}));
        return;
    }

    var numero_orden = args.ordenes_compras.numero_orden;
    var estado = args.ordenes_compras.estado;


    //validar que la OC no tenga NINGUN ingreso temporal.
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function (err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if ((orden_compra.tiene_ingreso_temporal === 0 && orden_compra.estado === '1') || (estado === 1 && orden_compra.estado === '5')) {

                that.m_ordenes_compra.actualizar_estado_orden_compra(numero_orden, estado, function (err, rows, result) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
                        return;
                    } else {
                        //Estado Orden de Compra 0 => Recibida (Ingresada en Bodega), 1 => Activa, 2 => Anulada , 3 => Recibido en bodega, 4 => Verificado en bodega, 5 => Bloqueada
                        var descripcionEstado = "";
                        switch (estado) {
                            case 0:
                                descripcionEstado = "Ingresada en bodega";
                                break;
                            case 1:
                                descripcionEstado = "Activa";
                                break;
                            case 2:
                                descripcionEstado = "Anulado";
                                break;
                            case 3:
                                descripcionEstado = "Recibida en bodega";
                                break;
                            case 4:
                                descripcionEstado = "Verificada en bodega";
                                break;
                            case 5:
                                descripcionEstado = "Bloqueada";
                                break;
                            case 6:
                                descripcionEstado = "Verificado con Pdt";
                                break;
                            default:
                                descripcionEstado = "";
                        }

                        var parametros = {
                            numero_orden: numero_orden,
                            estado: estado,
                            descripcion: 'actualizar_estado_orden_compra',
                            descripcionAccion: 'modifico estado de la orden de compra'
                        };

                        var parametro = {
                            orden_compra_id: numero_orden,
                            usuario_id: req.session.user.usuario_id,
                            tabla: 'compras_ordenes_pedidos',
                            accion: '2',
                            anterior: JSON.stringify({"estado": orden_compra.descripcion_estado}),
                            actual: JSON.stringify({"estado": +descripcionEstado}),
                            detalle: JSON.stringify(parametros),
                            fecha: new Date()
                        };

                        that.m_ordenes_compra.insertar_orden_compra_logs(parametro, function (err, rows, result) {
                            res.send(G.utils.r(req.url, 'Orden de Compra modificada correctamente', 200, {ordenes_compras: []}));
                            return;
                        });
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'La orden de compra no puede ser modificada en el estado actual.', 403, {orden_compra: []}));
                return;
            }
        }
    });
};


// Eliminar una orden de compra 
OrdenesCompra.prototype.eliminarProductoOrdenCompra = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined || args.ordenes_compras.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden o codigo_producto no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'numero_orden o codigo_producto estan vacias', 404, {}));
        return;
    }

    var numero_orden = args.ordenes_compras.numero_orden;
    var codigo_producto = args.ordenes_compras.codigo_producto;

    //validar que la OC no tenga NINGUN ingreso temporal.
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function (err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if (orden_compra.tiene_ingreso_temporal === 0 && (orden_compra.estado === '1' || orden_compra.estado === '3' || orden_compra.estado === '4' || orden_compra.estado === '6')) {

                that.m_ordenes_compra.consultarDetalleOrdenCompraConNovedades(numero_orden, codigo_producto, 1, function (err, productos) {

                    if (err || productos.length === 0) {
                        res.send(G.utils.r(req.url, 'Se ha generado un erro consultado la orden de compra code 1', 404, {}));
                        return;
                    } else {
                        var producto = productos[0];

                        if (producto.novedad_id === null) {

                            that.m_ordenes_compra.eliminar_producto_orden_compra(numero_orden, codigo_producto, function (err, rows, result) {

                                if (err || result.rowCount === 0) {
                                    res.send(G.utils.r(req.url, 'Error Eliminado el producto', 500, {ordenes_compras: []}));
                                    return;
                                } else {

                                    var parametros = {
                                        numero_orden: numero_orden,
                                        codigo_producto: codigo_producto,
                                        descripcion: 'eliminar_producto_orden_compra',
                                        descripcionAccion: 'elimino producto'
                                    };

                                    var parametro = {
                                        orden_compra_id: numero_orden,
                                        codigo_producto: codigo_producto,
                                        usuario_id: req.session.user.usuario_id,
                                        tabla: 'compras_ordenes_pedidos_detalle',
                                        accion: '0',
                                        anterior: JSON.stringify({"producto": codigo_producto}),
                                        actual: JSON.stringify({"producto": ""}),
                                        detalle: JSON.stringify(parametros),
                                        fecha: new Date()
                                    };

                                    that.m_ordenes_compra.insertar_orden_compra_logs(parametro, function (err, rows, result) {
                                        res.send(G.utils.r(req.url, 'Producto eliminado correctamente', 200, {ordenes_compras: []}));
                                        return;
                                    });
                                }
                            });
                        } else {
                            res.send(G.utils.r(req.url, 'El producto contiene una novedad diligenciada, No se puede borrar', 404, {}));
                            return;
                        }
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'La orden de compra no puede ser modificada en el estado actual.', 403, {orden_compra: []}));
                return;
            }
        }
    });
};


// Generar Finalizar Orden de Compra
OrdenesCompra.prototype.finalizarOrdenCompra = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined || args.ordenes_compras.finalizar_orden_compra === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.numero_orden === 0 || args.ordenes_compras.numero_orden === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero_orden', 404, {}));
        return;
    }


    var numero_orden = args.ordenes_compras.numero_orden;
    var finalizar_orden_compra = (args.ordenes_compras.finalizar_orden_compra) ? '1' : '0';


    //validar que la OC no tenga NINGUN ingreso temporal y este Activa.
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function (err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];
            if (orden_compra.tiene_ingreso_temporal === 0 && (orden_compra.estado === '1' || orden_compra.estado === '3' || orden_compra.estado === '4' || orden_compra.estado === '6')) {

                that.m_ordenes_compra.finalizar_orden_compra(numero_orden, finalizar_orden_compra, function (err, rows, result) {

                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error Interno', 500, {orden_compra: []}));
                        return;
                    } else {
                        var msj = " Orden de Compra Finalizada Correctamente"
                        if (finalizar_orden_compra === '0')
                            msj = ' Orden de Compra en proceso de modificacion';

                        res.send(G.utils.r(req.url, msj, 200, {orden_compra: []}));
                        return;
                    }
                });

            } else {
                res.send(G.utils.r(req.url, 'La orden de compra no puede ser modificada en el estado actual.', 403, {orden_compra: []}));
                return;
            }
        }

    });
};


OrdenesCompra.prototype.eliminarNovedad = function (req, res) {
    var that = this;
    var args = req.body.data;


    if (args.ordenes_compras === undefined || args.ordenes_compras.novedadId === undefined) {
        res.send(G.utils.r(req.url, 'novedad id no esta definida', 404, {}));
        return;
    }

    var novedadId = args.ordenes_compras.novedadId;


    G.Q.ninvoke(that.m_ordenes_compra, 'eliminarRegistroNovedad', {novedadId: novedadId}).then(function (resultado) {

        /*
         * @Andres M. Gonzalez
         * Fecha: 09-10-2017
         * +Descripcion: se modifica para realizar el log del modulo
         */
        var parametro = {
            usuario_id: req.session.user.usuario_id,
            tabla: 'consultar_archivo_novedad_producto',
            accion: '0',
            detalle: JSON.stringify({novedadId: novedadId, descripcion: 'eliminarRegistroNovedad', descripcionAccion: 'elimino registro de novedad'}),
            fecha: new Date(),
            anterior: JSON.stringify({novedadId: novedadId}),
            actual: JSON.stringify({'novedadId': ''}),
        };

        return G.Q.nfcall(that.m_ordenes_compra.insertar_orden_compra_logs, parametro);

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Novedad eliminado correctamente', 200, {}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {}));
    }).done();

};

// Ingresar Novedades Orden Compra
OrdenesCompra.prototype.gestionarNovedades = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.novedad_id === undefined || args.ordenes_compras.productos === undefined || args.ordenes_compras.observacion_id === undefined || args.ordenes_compras.descripcion === undefined) {
        res.send(G.utils.r(req.url, 'novedad_id, productos, observacion_id no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.productos.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el item_id', 404, {}));
        return;
    }
    if (args.ordenes_compras.observacion_id === '' || args.ordenes_compras.descripcion === '') {
        res.send(G.utils.r(req.url, 'Se requiere el observacion_id, descripcion de la novedad', 404, {}));
        return;
    }

    var novedad_id = args.ordenes_compras.novedad_id;
    var item_id = args.ordenes_compras.item_id;
    var observacion_id = args.ordenes_compras.observacion_id;
    var descripcion_novedad = args.ordenes_compras.descripcion;
    var usuario_id = req.session.user.usuario_id;
    var descripcionEntrada = args.ordenes_compras.descripcionEntrada || "";
    var productos = args.ordenes_compras.productos;


    G.Q.ninvoke(that.m_ordenes_compra, "guardarNovedades", productos, novedad_id, observacion_id, descripcion_novedad, usuario_id, descripcionEntrada, []).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Novedad guardada correctamente', 200, {ordenes_compras: resultado}));
            }).fail(function (err) {
        var msj = err.msj || "Ha ocurrido un error...";
        var status = err.status || 500;

        res.send(G.utils.r(req.url, msj, status, {ordenes_compras: []}));
    }).done();

    /*G.Q.ninvoke(that.m_ordenes_compra, "consultarNovedadPorObservacion", novedad_id, observacion_id).
     spread(function(novedades){
     
     if(!args.ordenes_compras.todosLosProductos){
     
     if (novedades.length === 0) {
     return G.Q.ninvoke(that.m_ordenes_compra, "insertar_novedad_producto", item_id, observacion_id, descripcion_novedad, usuario_id, descripcionEntrada);
     } else {
     return G.Q.ninvoke(that.m_ordenes_compra, "modificar_novedad_producto", novedad_id, observacion_id, descripcion_novedad, usuario_id, descripcionEntrada);
     }
     } else {
     
     return G.Q.ninvoke(that.m_ordenes_compra, "agregarMultiplesNovedades", productos, observacion_id, descripcion_novedad, usuario_id, descripcionEntrada);
     }
     
     }).spread(function(rows, result){
     if (result.rowCount === 0) {
     throw {msj:"Error guardando la novedad", status:500};
     } else {
     res.send(G.utils.r(req.url, 'Novedad guardada correctamente', 200, {ordenes_compras: rows}));
     }
     }).fail(function(err){
     var msj = err.msj || "Ha ocurrido un error...";
     var status = err.status || 500;
     
     res.send(G.utils.r(req.url, msj, status, {ordenes_compras: []}));
     }).done();*/

};


OrdenesCompra.prototype.subirArchivoOrdenes = function (req, res) {
    var that = this;
    var args = req.body.data;


    if (args.ordenes_compras === undefined || args.ordenes_compras.empresa_id === undefined || args.ordenes_compras.empresa_id === "") {
        res.send(G.utils.r(req.url, 'La empresa no esta definida', 404, {}));
        return;
    }

    var cabecera = ['unidad_negocio', 'codigo_proveedor', 'codigo_producto', 'cantidad', 'costo', 'observacion'];

    //Notificacion de la subida del archivo plano
    var notificacionArchivoPlano = function (index, longitud) {
        var porcentaje = (index * 100) / longitud;
        that.e_ordenes_compra.onNotificarProgresoArchivoPlanoOrdenes(req.session.user.usuario_id, porcentaje);
    };

    G.Q.nfcall(G.utils.subirArchivoPlano, req.files, cabecera).then(function (resultado) {
        var parametros = {datos: resultado, empresa_id: args.ordenes_compras.empresa_id,
            usuario_id: req.session.user.usuario_id, notificacion: notificacionArchivoPlano};
        return G.Q.ninvoke(that.m_ordenes_compra, 'gestionarArchivoOrdenes', parametros);
    }).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Archivo cargado correctamente', 200, {pdf: resultado}));
    }).fail(function (err) {
        console.log("se ha generado un error subirArchivoOrdenes ", err);
        res.send(G.utils.r(req.url, err, 500, {ordenes_compras: []}));
    });

};


OrdenesCompra.prototype.subirArchivoNovedades = function (req, res) {


    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.novedad_id === undefined) {
        res.send(G.utils.r(req.url, 'novedad_id  no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.novedad_id === '' || args.ordenes_compras.novedad_id === 0 || args.ordenes_compras.novedad_id === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el novedad_id', 404, {}));
        return;
    }

    var novedad_id = args.ordenes_compras.novedad_id;
    var usuario_id = req.session.user.usuario_id;

    that.m_ordenes_compra.consultar_novedad_producto(novedad_id, function (err, novedades) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando la novedad', 500, {ordenes_compras: []}));
            return;
        } else {

            if (novedades.length === 0) {
                res.send(G.utils.r(req.url, 'La novedad no existe', 500, {ordenes_compras: []}));
                return;
            } else {

                __subir_archivo_novedad(req.body, req.files, function (continuar, nombre_archivo) {

                    if (continuar) {

                        that.m_ordenes_compra.insertar_archivo_novedad_producto(novedad_id, nombre_archivo, nombre_archivo, usuario_id, function (err, rows, result) {

                            if (err || result.rowCount === 0) {

                                var ruta_novedades = G.dirname + G.settings.carpeta_ordenes_compra + 'Novedades/' + nombre_archivo;
                                G.fs.unlinkSync(ruta_novedades);

                                res.send(G.utils.r(req.url, 'Error subiendo el archivo de novedad', 500, {}));
                                return;
                            } else {
                                res.send(G.utils.r(req.url, 'Archivo cargado correctamente', 200, {}));
                                return;
                            }
                        });
                    } else {
                        res.send(G.utils.r(req.url, 'Error subiendo el archivo de novedad', 500, {}));
                        return;
                    }
                });
            }
        }
    });
};

// Consultar Archivos Novedad Orden de Compra
OrdenesCompra.prototype.consultarArchivosNovedades = function (req, res) {


    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.novedad_id === undefined) {
        res.send(G.utils.r(req.url, 'novedad_id  no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.novedad_id === '' || args.ordenes_compras.novedad_id === 0 || args.ordenes_compras.novedad_id === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el novedad_id', 404, {}));
        return;
    }

    var novedad_id = args.ordenes_compras.novedad_id;

    that.m_ordenes_compra.consultar_archivo_novedad_producto(novedad_id, function (err, lista_archivos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando los archivos de novedad', 500, {lista_archivos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Archivos Novedad', 200, {lista_archivos: lista_archivos}));
            return;
        }
    });
};

OrdenesCompra.prototype.obtenerArchivosNovedades = function (req, res) {


    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined) {
        res.send(G.utils.r(req.url, 'La orden no esta definida', 404, {}));
        return;
    }

    var numeroOrden = args.ordenes_compras.numero_orden;

    G.Q.ninvoke(that.m_ordenes_compra, "obtenerArchivosNovedades", {numeroOrden: numeroOrden}).
            then(function (listaArchivos) {
                res.send(G.utils.r(req.url, 'Lista Archivos Novedad', 200, {lista_archivos: listaArchivos}));
            }).fail(function (err) {
        console.log("error generado subirArchivoOrdenes", err);
        res.send(G.utils.r(req.url, 'Error consultando los archivos de novedad', 500, {lista_archivos: []}));
    }).done();

};


// Generar Reporte Orden Compra
OrdenesCompra.prototype.reporteOrdenCompra = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.numero_orden === 0 || args.ordenes_compras.numero_orden === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero_orden', 404, {}));
        return;
    }

    if (args.ordenes_compras.enviar_email !== undefined) {

        if (args.ordenes_compras.emails === undefined || args.ordenes_compras.subject === undefined || args.ordenes_compras.message === undefined) {
            res.send(G.utils.r(req.url, 'emails, subject o message no esta definidas', 404, {}));
            return;
        }

        if (args.ordenes_compras.emails.length === 0 || args.ordenes_compras.subject === '') {
            res.send(G.utils.r(req.url, 'emails, subject o message estan vacios', 404, {}));
            return;
        }

        var emails = args.ordenes_compras.emails;
        var subject = args.ordenes_compras.subject;
        var message = args.ordenes_compras.message;
    }

    var numero_orden = args.ordenes_compras.numero_orden;
    var enviar_email = args.ordenes_compras.enviar_email;

    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function (err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {orden_compra: []}));
            return;
        } else {
            var parametros = {numero_orden: numero_orden, termino_busqueda: '', pagina_actual: 0, filtro: ''};
            that.m_ordenes_compra.consultar_detalle_orden_compra(parametros, function (err, lista_productos) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Error Interno', 500, {lista_productos: []}));
                    return;
                } else {

                    var orden = orden_compra[0];

                    _generar_reporte_orden_compra({orden_compra: orden,
                        lista_productos: lista_productos,
                        usuario_imprime: req.session.user.nombre_usuario,
                        serverUrl: req.protocol + '://' + req.get('host') + "/"}, function (nombre_reporte) {

                        if (enviar_email) {

                            var path = G.dirname + "/public/reports/" + nombre_reporte;
                            var filename = "OrdenCompraNo-" + numero_orden + '.pdf';

                            __enviar_correo_electronico(that, emails, path, filename, subject, message, function (enviado) {

                                if (!enviado) {
                                    res.send(G.utils.r(req.url, 'Se genero un error al enviar el reporte', 500, {ordenes_compras: {nombre_reporte: nombre_reporte}}));
                                    return;
                                } else {
                                    res.send(G.utils.r(req.url, 'Reporte enviado correctamente', 200, {ordenes_compras: {nombre_reporte: nombre_reporte}}));
                                    return;
                                }
                            });
                        } else {
                            res.send(G.utils.r(req.url, 'Nombre Reporte', 200, {ordenes_compras: {nombre_reporte: nombre_reporte}}));
                            return;
                        }
                    });
                }
            });
        }
    });
};



// Subir Plano Orden de Compra
OrdenesCompra.prototype.ordenCompraArchivoPlano = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined || args.ordenes_compras.empresa_id === undefined || args.ordenes_compras.codigo_proveedor_id === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden, empresa_id, codigo_proveedor_id no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '' || args.ordenes_compras.numero_orden === 0 || args.ordenes_compras.numero_orden === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero_orden', 404, {}));
        return;
    }

    if (args.ordenes_compras.empresa_id === '' || args.ordenes_compras.codigo_proveedor_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere el empresa_id, codigo_proveedor_id', 404, {}));
        return;
    }

    if (req.files === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere un archivo plano', 404, {}));
        return;
    }

    var empresa_id = args.ordenes_compras.empresa_id;
    var codigo_proveedor_id = args.ordenes_compras.codigo_proveedor_id;
    var numero_orden = args.ordenes_compras.numero_orden;

    G.utils.subirArchivoPlano(req.files, ['codigo', 'cantidad', 'costo'], function (error, contenido) {

        if (!error) {

            __validar_productos_archivo_plano(that, contenido, function (productos_validos, productos_invalidos) {

                __validar_costo_productos_archivo_plano(that, empresa_id, codigo_proveedor_id, numero_orden, productos_validos, req.session.user.usuario_id, function (_productos_validos, _productos_invalidos) {

                    if (_productos_validos.length === 0) {
                        res.send(G.utils.r(req.url, 'Lista de Productos', 200, {ordenes_compras: {productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                        return;
                    }

                    var i = _productos_validos.length;

                    _productos_validos.forEach(function (producto) {

                        that.m_ordenes_compra.insertar_detalle_orden_compra(numero_orden, producto.codigo_producto, producto.cantidad_solicitada, producto.costo, producto.iva, null, null, null, function (err, rows, result) {
                            if (err) {
                                _productos_invalidos.push(producto);
                            }
                            if (--i === 0) {
                                res.send(G.utils.r(req.url, 'Lista de Productos', 200, {ordenes_compras: {productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                                return;
                            }
                        });
                    });
                });
            });
        } else {
            res.send(G.utils.r(req.url, 'Error subiendo el archivo plano', 404, {}));
            return;
        }
    });
};


// Listar las recepciones de mercancia
OrdenesCompra.prototype.listarRecepcionesMercancia = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.fecha_inicial === undefined || args.ordenes_compras.fecha_final === undefined) {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.termino_busqueda === undefined || args.ordenes_compras.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda, pagina_actual no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.fecha_inicial === '' || args.ordenes_compras.fecha_final === '') {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final estan vacias', 404, {}));
        return;
    }

    if (args.ordenes_compras.pagina_actual === '' || args.ordenes_compras.pagina_actual === 0 || args.ordenes_compras.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var fecha_inicial = args.ordenes_compras.fecha_inicial;
    var fecha_final = args.ordenes_compras.fecha_final;
    var termino_busqueda = args.ordenes_compras.termino_busqueda;
    var pagina_actual = args.ordenes_compras.pagina_actual;

    that.m_ordenes_compra.listar_recepciones_mercancia(fecha_inicial, fecha_final, termino_busqueda, pagina_actual, function (err, lista_recepciones_mercancia) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Recepciones Mercancia', 200, {ordenes_compras: {recepciones_mercancia: lista_recepciones_mercancia}}));
            return;
        }
    });
};


// Listar las recepciones de mercancia
OrdenesCompra.prototype.consultarRecepcionMercancia = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.recepcion_id === undefined) {
        res.send(G.utils.r(req.url, 'recepcion_id no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.recepcion_id === '') {
        res.send(G.utils.r(req.url, 'recepcion_id estan vacias', 404, {}));
        return;
    }

    var recepcion_id = args.ordenes_compras.recepcion_id;

    that.m_ordenes_compra.consultar_recepcion_mercancia(recepcion_id, function (err, recepcion_mercancia) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando la recepcion', 500, {ordenes_compras: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Recepcion Mercancia', 200, {ordenes_compras: {recepcion_mercancia: recepcion_mercancia}}));
            return;
        }
    });
};

// Insertar recepciones de mercancia
OrdenesCompra.prototype.insertarRecepcionMercancia = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.recepcion_mercancia === undefined) {
        res.send(G.utils.r(req.url, 'recepcion_mercancia no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.recepcion_mercancia === '') {
        res.send(G.utils.r(req.url, 'recepcion_mercancia esta vacias', 404, {}));
        return;
    }

    var recepcion_mercancia = args.ordenes_compras.recepcion_mercancia;
    var usuario_id = req.session.user.usuario_id;
    recepcion_mercancia.usuario_id = usuario_id;
    var seleccionarOtros = args.ordenes_compras.seleccionarOtros;
    if (!recepcion_mercancia.observacion) {
        recepcion_mercancia.observacion = "";
    }


    that.m_ordenes_compra.insertar_recepcion_mercancia(recepcion_mercancia, function (err, response) {

        if (err || response.length === 0) {
            var msj = (err.msj !== undefined) ? err.msj : '';

            res.send(G.utils.r(req.url, 'Error insertando la recepcion ' + msj, 500, {ordenes_compras: []}));
            return;
        } else {

            if (!seleccionarOtros) {
                // Notificacion Real Time de las Ordenes que fueron actualizadas
                var numero_orden = recepcion_mercancia.orden_compra.numero_orden_compra;
                that.e_ordenes_compra.onNotificarOrdenesComprasActualizados({numero_orden: numero_orden});
                var parametros = {numero_orden: recepcion_mercancia.orden_compra.numero_orden_compra, termino_busqueda: '', pagina_actual: 0, filtro: ''};
                //Insertar productos de la OC a la Recepcion de la Mercancia
                that.m_ordenes_compra.consultar_detalle_orden_compra(parametros, function (err, lista_productos) {

                    if (err || lista_productos.length === 0) {
                        res.send(G.utils.r(req.url, 'Error consultando la orden de compra', 500, {lista_productos: []}));
                        return;
                    } else {

                        var numero_recepcion = response[0].id;
                        var i = lista_productos.length;

                        lista_productos.forEach(function (_producto) {

                            var producto = {
                                recepcion_mercancia_id: numero_recepcion,
                                novedades_recepcion_id: null,
                                codigo_producto: _producto.codigo_producto,
                                cantidad_recibida: 0,
                                usuario_id: usuario_id,
                                cantidad_pendiente: _producto.cantidadpendiente,
                                recepcion_mercancia: recepcion_mercancia.orden_compra.numero_orden_compra
                            };

                            that.m_ordenes_compra.insertar_productos_recepcion_mercancia(producto, function (err) {

                                if (--i === 0) {
                                    res.send(G.utils.r(req.url, 'Recepcion mercancia insertada correctamente', 200, {ordenes_compras: numero_recepcion}));
                                    return;
                                }
                            });
                        });
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'Recepcion mercancia insertada correctamente', 200, {ordenes_compras: response[0].id}));
                return;
            }
        }
    });
};

// Insertar recepciones de mercancia
OrdenesCompra.prototype.modificarRecepcionMercancia = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.recepcion_mercancia === undefined) {
        res.send(G.utils.r(req.url, 'recepcion_mercancia no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.recepcion_mercancia === '') {
        res.send(G.utils.r(req.url, 'recepcion_mercancia esta vacias', 404, {}));
        return;
    }

    var recepcion_mercancia = args.ordenes_compras.recepcion_mercancia;

    that.m_ordenes_compra.modificar_recepcion_mercancia(recepcion_mercancia, function (err, recepcion_mercancia) {

        if (err) {
            var msj = (err.msj !== undefined) ? err.msj : '';

            res.send(G.utils.r(req.url, 'Error modificando la recepcion ' + msj, 500, {ordenes_compras: []}));
            return;
        } else {

//		recepcion_mercancia.descripcion = 'modificar_recepcion_mercancia';
//		recepcion_mercancia.descripcionAccion = 'modifico la recepcion de mercancias';
//		
//		var parametro={
//		    usuario_id : req.session.user.usuario_id,
//		    tabla : 'recepcion_mercancia',
//		    accion : '2',
//		    detalle: JSON.stringify(recepcion_mercancia) ,
//		    fecha : new Date()
//		  };
//			  
//	     that.m_ordenes_compra.insertar_orden_compra_logs(parametro, function(err, rows, result) { 
            res.send(G.utils.r(req.url, 'Recepcion mercancia modificada correctamente', 200, {ordenes_compras: recepcion_mercancia}));
            return;
//	     });
        }
    });
};


// Listar productos de la recepcion de mercancia
OrdenesCompra.prototype.listarProductosRecepcionMercancia = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.recepcion_id === undefined) {
        res.send(G.utils.r(req.url, 'El objeto de parametros no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.recepcion_id === '' || !args.ordenes_compras.recepcion_id) {
        res.send(G.utils.r(req.url, 'El id de la recepcion de mercancia es un parametro obligatorio', 404, {}));
        return;
    }

    if (args.ordenes_compras.orden_compra.numero_orden_compra === '' || !args.ordenes_compras.orden_compra.numero_orden_compra) {
        res.send(G.utils.r(req.url, 'El numero de la orden de compra es un parametro obligatorio', 404, {}));
        return;
    }

    var recepcion_id = args.ordenes_compras.recepcion_id;
    var numeroOrdenCompra = args.ordenes_compras.orden_compra.numero_orden_compra;

    that.m_ordenes_compra.listar_productos_recepcion_mercancia({recepcion_id: recepcion_id, numero_orden_compra: numeroOrdenCompra}, function (err, productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando productos de la recepcion ', 500, {ordenes_compras: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'lista de productos', 200, {ordenes_compras: {recepcion_mercancia: productos}}));
            return;
        }
    });
};

// Insertar producto a recepcion de mercancia
OrdenesCompra.prototype.insertarProductosRecepcionMercancia = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.producto_mercancia === undefined) {
        res.send(G.utils.r(req.url, 'producto_mercancia no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.producto_mercancia === '') {
        res.send(G.utils.r(req.url, 'producto_mercancia esta vacias', 404, {}));
        return;
    }

    var producto_mercancia = args.ordenes_compras.producto_mercancia;

    that.m_ordenes_compra.insertar_productos_recepcion_mercancia(producto_mercancia, function (err, productos) {

        if (err) {
            var msj = (err.msj !== undefined) ? err.msj : '';

            res.send(G.utils.r(req.url, 'Error insertando productos a la recepcion ' + msj, 500, {ordenes_compras: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Producto registrado correctamente', 200, {ordenes_compras: productos}));
            return;
        }
    });
};


// Modificar producto a recepcion de mercancia
OrdenesCompra.prototype.modificarProductosRecepcionMercancia = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.recepcion_mercancia === undefined || args.ordenes_compras.producto_mercancia === undefined) {
        res.send(G.utils.r(req.url, 'recepcion_mercancia o producto_mercancia no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.recepcion_mercancia === '' || args.ordenes_compras.producto_mercancia === '') {
        res.send(G.utils.r(req.url, 'producto_mercancia esta vacias', 404, {}));
        return;
    }

    var recepcion_mercancia = args.ordenes_compras.recepcion_mercancia;
    var producto_mercancia = args.ordenes_compras.producto_mercancia;
    var estadoOrdenDeCompra;

    G.Q.ninvoke(that.m_ordenes_compra, "modificar_productos_recepcion_mercancia", recepcion_mercancia, producto_mercancia).then(function (resultado) {

        if (resultado.rowCount === 1) {

            if (resultado.rows[0].cantidad_pendiente > 0) {
                estadoOrdenDeCompra = '6';
            } else {
                estadoOrdenDeCompra = '3';
            }
//	/*
//	 * @Andres M. Gonzalez
//	 * Fecha: 09-10-2017
//	 * +Descripcion: se modifica para realizar el log del modulo
//	 */
//	
//	args.ordenes_compras.descripcion = 'modificar_productos_recepcion_mercancia';
//	args.ordenes_compras.descripcionAccion  = 'modifico productos de recepcion mercancia';
//	   
//	var parametro={
//          usuario_id : req.session.user.usuario_id,
//          tabla : 'consultar_archivo_novedad_producto',
//	  codigo_producto : producto_mercancia,
//	  accion : '2',
//	  detalle: JSON.stringify(args.ordenes_compras) ,
//	  fecha : new Date()
//	};
//	
//         return G.Q.nfcall(that.m_ordenes_compra.insertar_orden_compra_logs,parametro);
            return true;
        } else {
            throw 'Error modificando productos a la recepcion ';
        }
    }).then(function (resultado) {

        return G.Q.ninvoke(that.m_ordenes_compra, "actualizar_estado_orden_compra", recepcion_mercancia.orden_compra.numero_orden_compra, estadoOrdenDeCompra);

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200, {ordenes_compras: []}));

    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error modificando productos a la recepcion', 500, {ordenes_compras: []}));

    }).done();

};

// Finalizar recepcion de mercancia
OrdenesCompra.prototype.finalizarRecepcionMercancia = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.recepcion_mercancia === undefined) {
        res.send(G.utils.r(req.url, 'recepcion_mercancia  no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.recepcion_mercancia.numero_recepcion === undefined) {
        res.send(G.utils.r(req.url, 'numero_recepcion no esta definido', 404, {}));
        return;
    }

    if (args.ordenes_compras.recepcion_mercancia.numero_recepcion === '') {
        res.send(G.utils.r(req.url, 'numero_recepcion  esta vacias', 404, {}));
        return;
    }

    var recepcion = args.ordenes_compras.recepcion_mercancia;
    var cantidadTotalPendiente = args.ordenes_compras.recepcion_mercancia.orden_compra.cantidadTotalPendiente;
    var numero_orden = recepcion.orden_compra.numero_orden_compra;


    that.m_ordenes_compra.finalizar_recepcion_mercancia(recepcion, function (err, result) {

        if (err || result.rowCount === 0) {

            res.send(G.utils.r(req.url, 'Error finalizando la recepcion ', 500, {ordenes_compras: []}));
            return;
        } else {

            // Notificacion Real Time de las Ordenes que fueron actualizadas
            that.e_ordenes_compra.onNotificarOrdenesComprasActualizados({numero_orden: numero_orden});

            res.send(G.utils.r(req.url, 'Recepcion finalizada correctamente', 200, {ordenes_compras: {}}));
            return;
        }
    });
};



/**
 * Método que lista todas las ordenes por autorizar
 * @param mapa de llave valor empresa, terminoBusqueda,filtro,paginaActual
 * @return mapa de las ordenes sin autorizar
 * @utilizado Se utiliza en el cliente de angular, para el modulo autorizaciones encargado de autorizar las ordenes de compra
 */
OrdenesCompra.prototype.listarAutorizacionCompras = function (req, res) {

    var that = this;
    var args = req.body.data.listar_autorizaciones;

    if (args.empresa === undefined) {
        res.send(G.utils.r(req.url, 'La empresa no esta definida', 404, {}));
        return;
    }

    if (args.paginaActual === '') {
        args.paginaActual = 0;
    }

    G.Q.ninvoke(that.m_ordenes_compra, 'listarAutorizacionCompras', args).then(function (result) {
        res.send(G.utils.r(req.url, 'Consulta Autorizaciones de Compras - correctamente', 200, {ordenes_compras: result}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar las Autorizaciones de Compras', 500, {ordenes_compras: []}));
    }).done();
};

/*
 * Método que modifica la orden por autorizar tabla compras_ordenes_pedidos_productosfoc
 * @param mapa de llave valor modifica tabla compras_ordenes_pedidos_productosfoc
 * @return mensaje el sistema
 * @utilizado Se utiliza en el cliente de angular, para el modulo autorizaciones encargado de autorizar las ordenes de compra
 */
OrdenesCompra.prototype.modificarAutorizacionCompras = function (req, res) {

    var that = this;
    var args = req.body.data.autorizacion;

    if (args.empresa === undefined) {
        res.send(G.utils.r(req.url, 'empresa  no esta definidas', 404, {}));
        return;
    }
    if (args.centroUtilidad === undefined) {
        res.send(G.utils.r(req.url, 'centroUtilidad  no esta definidas', 404, {}));
        return;
    }

    if (args.bodega === undefined) {
        res.send(G.utils.r(req.url, 'bodega no esta definido', 404, {}));
        return;
    }
    if (args.orden === undefined) {
        res.send(G.utils.r(req.url, 'orden no esta definido', 404, {}));
        return;
    }

    if (args.codProucto === undefined) {
        res.send(G.utils.r(req.url, 'codProucto no esta definido', 404, {}));
        return;
    }
    if (args.lote === undefined) {
        res.send(G.utils.r(req.url, 'lote no esta definido', 404, {}));
        return;
    }

    G.Q.ninvoke(that.m_ordenes_compra, 'modificarAutorizacionOrdenCompras', args).then(function (result) {
        /*
         * @Andres M. Gonzalez
         * Fecha: 09-10-2017
         * +Descripcion: se modifica para realizar el log del modulo
         */
        args.descripcion = 'modificarAutorizacionOrdenCompras';
        args.insertar_orden_compra_logs = 'modifico Autorizacion Orden de Compras';

        var parametro = {
            orden_compra_id: args.orden,
            usuario_id: req.session.user.usuario_id,
            tabla: 'compras_ordenes_pedidos_productosfoc',
            accion: '2',
            detalle: JSON.stringify(args),
            anterior: JSON.stringify({'novedadId': novedadId}),
            actual: JSON.stringify({novedadId: ''}),
            fecha: new Date()
        };

        return G.Q.nfcall(that.m_ordenes_compra.insertar_orden_compra_logs, parametro);

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Autorizacion Orden de Compra Modificado Correctamente', 200, {ordenes_compras: result}));

    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error Modificando la Autorizacion de Ordenes de Compra', 500, {ordenes_compras: []}));
    }).done();
};

OrdenesCompra.prototype.listarLogOrdenCompra = function (req, res) {

    var that = this;
    var args = req.body.data.ordenesCompras;

    if (args.numeroOrden === undefined) {
        res.send(G.utils.r(req.url, 'empresa  no esta definidas', 404, {}));
        return;
    }

    G.Q.ninvoke(that.m_ordenes_compra, 'listarLogsOrdenesCompras', args).then(function (result) {

        res.send(G.utils.r(req.url, 'Listar logs ordenes de compra', 200, {logOrdenesCompras: result}));

    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error Modificando la Autorizacion de Ordenes de Compra', 500, {ordenes_compras: []}));
    }).done();
};

/*
 * Método que inserta en la tabla inv_bodegas_movimiento_tmp_d
 * @param mapa de llave valor insertar en la tabla inv_bodegas_movimiento_tmp_d
 * @return mensaje el sistema
 * @utilizado Se utiliza en el cliente de angular, para el modulo autorizaciones encargado de autorizar las ordenes de compra.
 */
OrdenesCompra.prototype.ingresarBodegaMovimientoTmpOrden = function (req, res) {

    var that = this;
    var args = req.body.data.autorizacion;

    if (args.empresa === undefined) {
        res.send(G.utils.r(req.url, 'empresa  no esta definidas', 404, {}));
        return;
    }
    if (args.centroUtilidad === undefined) {
        res.send(G.utils.r(req.url, 'centroUtilidad  no esta definidas', 404, {}));
        return;
    }

    if (args.bodega === undefined) {
        res.send(G.utils.r(req.url, 'bodega no esta definido', 404, {}));
        return;
    }
    if (args.orden === undefined) {
        res.send(G.utils.r(req.url, 'orden no esta definido', 404, {}));
        return;
    }

    if (args.codProucto === undefined) {
        res.send(G.utils.r(req.url, 'codProucto no esta definido', 404, {}));
        return;
    }
    if (args.lote === undefined) {
        res.send(G.utils.r(req.url, 'lote no esta definido', 404, {}));
        return;
    }

    if (args.usuarioId === undefined) {
        res.send(G.utils.r(req.url, 'usuarioId  no esta definidas', 404, {}));
        return;
    }

    if (args.cantidad === undefined) {
        res.send(G.utils.r(req.url, 'cantidad  no esta definidas', 404, {}));
        return;
    }

    if (args.porcentajeGravamen === undefined) {
        res.send(G.utils.r(req.url, 'porcentajeGravamen no esta definido', 404, {}));
        return;
    }
    if (args.totalCosto === undefined) {
        res.send(G.utils.r(req.url, 'totalCosto no esta definido', 404, {}));
        return;
    }
    if (args.fechaVencimiento === undefined) {
        res.send(G.utils.r(req.url, 'fechaVencimiento no esta definido', 404, {}));
        return;
    }
    if (args.localProd === undefined) {
        res.send(G.utils.r(req.url, 'localProd no esta definido', 404, {}));
        return;
    }
    if (args.orden === undefined) {
        res.send(G.utils.r(req.url, 'orden no esta definido', 404, {}));
        return;
    }

    G.Q.ninvoke(that.m_ordenes_compra, 'ingresarBodegaMovimientoTmpProducto', args).then(function (result) {
        res.send(G.utils.r(req.url, 'Insercion bodega movimiento TMP Correctamente', 200, {ordenes_compras: result}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error Insertar a la tabla bodega movimiento TMP', 500, {ordenes_compras: []}));
    }).done();
};



function __subir_archivo_novedad(data, files, callback) {

    var ruta_tmp = files.file.path;
    var ext = G.path.extname(data.flowFilename);
    var nombre_archivo = 'NOC_' + G.random.randomKey(3, 3) + ext;
    var ruta_nueva = G.dirname + G.settings.carpeta_ordenes_compra + 'Novedades/' + nombre_archivo;

    if (G.fs.existsSync(ruta_tmp)) {
        // Copiar Archivo
        G.fs.copy(ruta_tmp, ruta_nueva, function (err) {
            if (err) {
                // Borrar archivo fisico
                G.fs.unlinkSync(ruta_tmp);
                callback(false);
                return;
            } else {
                G.fs.unlink(ruta_tmp, function (err) {
                    if (err) {
                        callback(false);
                        return;
                    } else {
                        callback(true, nombre_archivo);
                    }
                });
            }
        });
    } else {
        callback(true);
    }
}
;

// Funcion que valida que los codigos de los productos del archivo plano sean validos.
function __validar_productos_archivo_plano(contexto, filas, callback) {

    var that = contexto;

    var productos_validos = [];
    var productos_invalidos = [];

    var i = filas.length;

    filas.forEach(function (row) {
        var codigo_producto = row.codigo || '';
        var cantidad_solicitada = row.cantidad || 0;
        var costo = row.costo || '';

        that.m_productos.validar_producto(codigo_producto, function (err, existe_producto) {

            var producto = {codigo_producto: codigo_producto, cantidad_solicitada: cantidad_solicitada, costo: costo};

            if (existe_producto.length > 0 && cantidad_solicitada > 0) {
                productos_validos.push(producto);
            } else {
                producto.error = "El producto no se encunetra o no tiene cantidad valida";
                productos_invalidos.push(producto);
            }

            if (--i === 0) {
                callback(productos_validos, productos_invalidos);
            }
        });
    });
}
;


// Funcion que valida que los datos del archivo plano tengan el costo del producto.
function __validar_costo_productos_archivo_plano(contexto, empresa_id, codigo_proveedor_id, numero_orden, productos, usuario_id, callback) {

    var that = contexto;
    var productos_validos = [];
    var productos_invalidos = [];

    var i = productos.length;

    if (productos.length === 0) {
        callback(productos_validos, productos_invalidos);
        return;
    }


    var index = 1;
    productos.forEach(function (row) {

        var codigo_producto = row.codigo_producto;

        that.m_ordenes_compra.listar_productos(empresa_id, codigo_proveedor_id, numero_orden, codigo_producto, null, 1, null, function (err, lista_productos) {

            if (err || lista_productos.length === 0) {
                row.error = "El producto esta en la orden, o no esta activo";
                productos_invalidos.push(row);
            } else {
                var producto = lista_productos[0];
                row.costo = (row.length > 2 && !isNaN(row.costo)) ? row.costo : producto.costo_ultima_compra;
                row.iva = producto.iva;
                productos_validos.push(row);
            }

            index++;
            var porcentaje = (index * 100) / productos.length;
            that.e_ordenes_compra.onNotificarProgresoArchivoPlanoOrdenes(usuario_id, porcentaje);

            if (--i === 0) {
                callback(productos_validos, productos_invalidos);
            }
        });
    });
}
;


// Funcion que genera el reporte en formato PDF usando la libreria JSReport
function _generar_reporte_orden_compra(rows, callback) {


    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/OrdenesCompra/reports/orden_compra.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/OrdenesCompra/reports/javascripts/helpers.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: {
            style: G.dirname + "/public/stylesheets/bootstrap.min.css",
            orden_compra: rows.orden_compra,
            lista_productos: rows.lista_productos,
            fecha_actual: new Date().toFormat('DD/MM/YYYY HH24:MI:SS'),
            usuario_imprime: rows.usuario_imprime,
            serverUrl: rows.serverUrl
        }
    }, function (err, response) {

        response.body(function (body) {

            var fecha_actual = new Date();
            var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombre_reporte, body, "binary", function (err) {

                if (err) {

                    res.send(G.utils.r(req.url, 'Se ha generado un error generando el reporte', 200, {nombre_reporte: {}}));
                } else {
                    callback(nombre_reporte);
                }
            });

        });
    });
}


// Funcion para enviar correos electronicos usando nodemailer
function __enviar_correo_electronico(that, to, ruta_archivo, nombre_archivo, subject, message, callback) {

    //var smtpTransport = that.emails.createTransport();
    var smtpTransport = that.emails.createTransport("SMTP", {
        host: G.settings.email_host, // hostname
        secureConnection: true, // use SSL
        port: G.settings.email_port, // port for secure SMTP
        auth: {
            user: G.settings.email_user,
            pass: G.settings.email_password
        }
    });

    var settings = {
        from: G.settings.email_compras,
        to: to,
        subject: subject,
        html: message,
        attachments: [{'filename': nombre_archivo, 'contents': G.fs.readFileSync(ruta_archivo)}]
    };

    smtpTransport.sendMail(settings, function (error, response) {

        if (error) {
            callback(false);
            return;
        } else {
            smtpTransport.close();
            callback(true);
            return;
        }
    });
}
;

/***
 * @author Cristian Ardila
 * +Descripcion Funcion encargada de crear orden de compra invocada desde auditoria
 * @fecha 2017-04-10
 * 
 */
OrdenesCompra.prototype.generarOrdenDeCompraAuditado = function (args) {

    var that = this;

    if (args.ordenes_compras === undefined || args.ordenes_compras.unidad_negocio === undefined || args.ordenes_compras.codigo_proveedor === undefined || args.ordenes_compras.empresa_id === undefined) {
        //res.send(G.utils.r(req.url, 'unidad_negocio, codigo_proveedor, empresa_id no estan definidas', 404, {}));
        G.eventEmitter.emit("onGenerarOrdenDeCompraRespuesta", {msj: 'unidad_negocio, codigo_proveedor, empresa_id no estan definidas', status: 404, data: {}});

        return;
    }

    if (args.ordenes_compras.observacion === undefined) {
        G.eventEmitter.emit("onGenerarOrdenDeCompraRespuesta", {msj: 'observacion no estan definidas', status: 404, data: {}});
        //res.send(G.utils.r(req.url, 'observacion no estan definidas', 404, {}));

        return;
    }

    if (args.ordenes_compras.unidad_negocio === '' || args.ordenes_compras.codigo_proveedor === '' || args.ordenes_compras.empresa_id === '') {
        G.eventEmitter.emit("onGenerarOrdenDeCompraRespuesta", {msj: 'unidad_negocio, codigo_proveedor o empresa_id  estan vacias', status: 404, data: {}});
        //res.send(G.utils.r(req.url, 'unidad_negocio, codigo_proveedor o empresa_id  estan vacias', 404, {}));

        return;
    }

    if (args.ordenes_compras.observacion === '') {
        G.eventEmitter.emit("onGenerarOrdenDeCompraRespuesta", {msj: 'observacion esta vacia', status: 404, data: {}});

        return;
    }
    var respuesta = {};
    var productosActas;
    var parametros = {
        encabezado: {
            unidad_negocio: args.ordenes_compras.unidad_negocio,
            proveedor: args.ordenes_compras.codigo_proveedor,
            empresa_id: args.ordenes_compras.empresa_id,
            observacion: args.ordenes_compras.observacion,
            bodegaDestino: args.ordenes_compras.bodegaDestino,
            usuario_id: args.ordenes_compras.usuario_id,
            detalle: args.ordenes_compras.productos,
            ordenId: 0,
            codigo_proveedor: args.ordenes_compras.codigo_proveedor,
            empresa_pedido: args.ordenes_compras.empresa_pedido,
            centro_utilidad_pedido: args.ordenes_compras.centro_utilidad_pedido,
            bodega_pedido: args.ordenes_compras.bodega_pedido,
            terminarOrden: true
        },
        transaccion: null,
        contexto: that.m_ordenes_compra,
        filtro: {auditoria: true}
    };

    G.Q.ninvoke(that, "__insertarOrdenCompra", parametros.encabezado).then(function (resultado) {

        parametros.encabezado.ordenId = resultado.data.numero_orden;

        return G.Q.ninvoke(that.m_ordenes_compra, "gestionaDetalleOrden", parametros);

    }).then(function (resultado) {

        return G.Q.ninvoke(that.m_ordenes_compra, "finalizar_orden_compra", parametros.encabezado.ordenId, 1);

    }).then(function (resultado) {

        var param = {
            ordenPedido: parametros.encabezado.ordenId
        };

        return G.Q.ninvoke(that.m_actasTecnicas, "listarProductosParaActas", param);

    }).then(function (resultado) {
        productosActas = resultado;

        if (args.ordenes_compras.empresa_id === '03' && (args.ordenes_compras.bodega_pedido === '03' || args.ordenes_compras.bodega_pedido === '06')) {

            return G.Q.ninvoke(that.m_e008, "obtenerTotalDetalleDespachoAutomatico", {empresa: args.ordenes_compras.empresa_id, prefijoDocumento: args.ordenes_compras.prefijo_documento, numeroDocumento: args.ordenes_compras.numero_documento});

        } else {

            return false;
        }
    }).then(function (resultado) {

        respuesta = {
            msj: "La orden de compra # " + parametros.encabezado.ordenId + " se ha generado satisfactoriamente",
            status: 200,
            data: {
                numero_orden: parametros.encabezado.ordenId,
                parametros: parametros,
                productosActas: productosActas,
                productos2: args.ordenes_compras.productos,
                productos: resultado,
                sw_origen_destino: args.ordenes_compras.sw_origen_destino,
                numero_pedido: args.ordenes_compras.numero_pedido,
                sw_tipo_pedido: args.ordenes_compras.sw_tipo_pedido,
                sw_estado: args.ordenes_compras.estado,
                id_orden_cotizacion_origen: args.ordenes_compras.id_orden_cotizacion_origen,
                id_orden_cotizacion_destino: args.ordenes_compras.id_orden_cotizacion_destino,
                bodega: args.ordenes_compras.bodega,
                session: args.ordenes_compras.session,
                that: that,
                protocolo: args.ordenes_compras.protocolo,
                req: args.ordenes_compras.req,
                empresa: args.ordenes_compras.empresa_id,
                prefijo_documento: args.ordenes_compras.prefijo_documento,
                numero_documento: args.ordenes_compras.numero_documento,
            }
        };

        return G.Q.ninvoke(that.m_pedidos_clientes, "verificarPedidoMultiple", respuesta.data);

    }).then(function (resultado) {
        
        respuesta.data.id_orden_pedido_origen = resultado[0].id_orden_pedido_origen;
        if (resultado.length > 0) {
            return G.Q.nfcall(__generacionAutomatica, respuesta);
        } else {
            throw {msj: 'No se genera Documento de Entrada porque no es pedido Multiple', status: 500};
        }
    }).then(function (resultado) {
        that.e_ordenes_compra.onNotificarGenerarI002(args.ordenes_compras.usuario_id, resultado);


    }).fail(function (err) {
        console.log("err [generarOrdenDeCompraAuditado]: ", err);
        G.eventEmitter.emit("onGenerarOrdenDeCompraRespuesta", {msj: err.msj, status: err.status, data: err});
        //res.send(G.utils.r(req.url, err.msj, err.status, {ordenes_compras: err}));
    });

};

/**/
function __generacionAutomatica(datos, callback) {
    var that = datos.data.that;

    var bodega = datos.data.bodega;
    var ejecutar = true;
    var movimiento_temporal_id;
    if (datos.status === 200 && ejecutar && datos.data.sw_estado === '0' && ((bodega === '03' && datos.data.sw_origen_destino === 1) || (bodega === '06' && datos.data.sw_origen_destino === 0) || (bodega === '06' && datos.data.sw_origen_destino === 1))) {
        ejecutar = false;
        var cotizacion = {
            id_orden_cotizacion_origen: datos.data.id_orden_cotizacion_origen,
            id_orden_cotizacion_destino: datos.data.id_orden_cotizacion_destino
        };

        var obj = {
            session: datos.data.session,
            that: that,
            data: {
                orden_pedido_id: datos.data.numero_orden,
                bodegas_doc_id: datos.data.sw_origen_destino == 1 ? '1634' : '80', //'1634' : '80' ojo en produccion va 1634 en pruebas 1541
                observacion: datos.data.parametros.encabezado.observacion
            }
        };

        G.Q.nfcall(__newDocTemporalI002, obj).then(function (resultado) {
            movimiento_temporal_id = resultado.movimiento_temporal_id;
            datos.movimiento_temporal_id = movimiento_temporal_id;
            return G.Q.nfcall(__recursivaProductosTemporalI002, datos, 0);

        }).then(function (resultado) {
         
            var parametros = {
                usuario_id: datos.data.parametros.encabezado.usuario_id,
                orden: datos.data.numero_orden,
                pedido: datos.data.numero_pedido,
                sw_origen_destino: datos.data.sw_origen_destino,
                productos: datos.data.productos,
                swTipoPedido: datos.data.sw_tipo_pedido,
                cotizacion: cotizacion,
                session: datos.data.session,
                doc_tmp_id: movimiento_temporal_id,
                that: that,
                id_orden_pedido_origen: datos.data.id_orden_pedido_origen,
                protocolo: datos.data.protocolo,
                req: datos.data.req,
                empresa: datos.data.empresa,
                prefijo_documento: datos.data.prefijo_documento,
                numero_documento: datos.data.numero_documento,
            };

            return G.Q.nfcall(__ejecutarDocumento, parametros);

        }).then(function (resultado) {

            callback(false, resultado);
        }).fail(function (err) {

            console.log("[generarOrdenDeCompraAuditado]", err);
            callback(err);

        });

    } else {
        console.log("---------no valido-------------- ");
        console.log("---------no valido-------------- ", (datos.status === 200 && ejecutar && datos.data.sw_estado === '0' && ((bodega === '03' && datos.data.sw_origen_destino === 1) || (bodega === '06' && datos.data.sw_origen_destino === 0) || (bodega === '06' && datos.data.sw_origen_destino === 1))));
        console.log("---------no valido--------------datos.status:: ", datos.status);
        console.log("---------no valido--------------ejecutar ", ejecutar);
        console.log("---------no valido--------------datos.data.sw_estado ", datos.data.sw_estado);
        console.log("---------no valido--------------datos.data.sw_origen_destino ", datos.data.sw_origen_destino);
        console.log("---------no valido--------------bodega ", bodega);
    }
}

function __newDocTemporalI002(req, callback) {

    var that = req.that;
    var args = req.data;
    var usuarioId = req.session.user.usuario_id;
    var orden_pedido_id = args.orden_pedido_id;
    var bodegas_doc_id = args.bodegas_doc_id;
    var observacion = args.observacion;
    var movimiento_temporal_id;

    G.Q.ninvoke(that.m_movimientos_bodegas, "obtener_identificador_movimiento_temporal_returning", usuarioId, bodegas_doc_id).then(function (doc_tmp_id) {

        movimiento_temporal_id = doc_tmp_id[0].doc_tmp_id;

        G.knex.transaction(function (transaccion) {

            G.Q.nfcall(that.m_movimientos_bodegas.modificar_movimiento_bodega_temporal,
                    movimiento_temporal_id, usuarioId, bodegas_doc_id, observacion, transaccion).then(function () {

                var parametros = {
                    usuario_id: usuarioId,
                    doc_tmp_id: movimiento_temporal_id,
                    orden_pedido_id: orden_pedido_id
                };

                return G.Q.nfcall(that.m_i002.insertarBodegasMovimientoOrdenesCompraTmp, parametros, transaccion);

            }).then(function () {

                transaccion.commit(movimiento_temporal_id);

            }).fail(function (err) {

                transaccion.rollback(err);
            }).done();

        }).then(function (movimiento_temporal_id) {

            callback(false, {movimiento_temporal_id: movimiento_temporal_id});
        }).catch(function (err) {
            callback(err);
        }).done();

    }).fail(function (err) {
        console.log("Error [__newDocTemporalI002]", err);
        callback(err);
    }).done();
}
;

/*
 * 
 * @param {type} data
 * @param {type} index entero inicia en 0
 * @param {type} callback
 * @returns true
 */
function __recursivaProductosTemporalI002(datos, index, callback) {

    if (datos.data.productos[index] === undefined) {
        callback(false, true);
        return;
    }
    var productos = datos.data.productos[index];
    var productosActas = datos.data.productosActas[index];

    var movimientos_bodegas = {
        doc_tmp_id: datos.movimiento_temporal_id,
        bodegas_doc_id: datos.data.sw_origen_destino == 1 ? '1634' : '80', //'1634' : '80' ojo en produccion va 1634 en pruebas 1541
        codigo_producto: productos.codigo_producto,
        cantidad: productos.cantidad,
        porcentaje_gravamen: productos.porcentaje_gravamen,
        total_costo: (productos.valor_unitario * (1 + (productos.porcentaje_gravamen / 100))) * productos.cantidad,
        fecha_vencimiento: productos.fecha_vencimiento,
        lote: productos.lote,
        localizacion: 'NA',
        total_costo_ped: '0',
        valor_unitario: '0',
        usuario_id: datos.data.session,
        item_id_compras: productosActas.item_id,
        prefijo: datos.data.sw_origen_destino == 1 ? '06' : '03'
    };

    var obj = {
        that: datos.data.that,
        session: datos.data.session,
        data: {
            movimientos_bodegas: movimientos_bodegas
        }
    };

    G.Q.nfcall(__addItemDocTemporalI002, obj).then(function (data) {
        index++;
        __recursivaProductosTemporalI002(datos, index, callback);
    }).fail(function (err) {
        console.log("Error [__recursivaProductosTemporalI002]", err);
        callback(err);
    });
}

function __addItemDocTemporalI002(req, callback) {

    var that = req.that;
    var args = req.data;

    var bodega = "";
    if (args.movimientos_bodegas.prefijo !== '') {
        bodega = args.movimientos_bodegas.prefijo;
    }

    parametros = {
        usuarioId: args.movimientos_bodegas.usuario_id.user.usuario_id,
        docTmpId: args.movimientos_bodegas.doc_tmp_id,
        codProucto: args.movimientos_bodegas.codigo_producto,
        cantidad: args.movimientos_bodegas.cantidad,
        porcentajeGravamen: args.movimientos_bodegas.porcentaje_gravamen,
        totalCosto: args.movimientos_bodegas.total_costo,
        fechaVencimiento: args.movimientos_bodegas.fecha_vencimiento,
        lote: args.movimientos_bodegas.lote,
        localProd: args.movimientos_bodegas.localizacion,
        totalCostoPed: args.movimientos_bodegas.total_costo_ped,
        valorUnitario: args.movimientos_bodegas.valor_unitario,
        itemIdCompras: args.movimientos_bodegas.item_id_compras
    };

    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaBodega", parametros).then(function (result) {

        if (result.length === 0) {
            throw {msj: "EL producto " + args.movimientos_bodegas.codigo_producto + " no esta relacionado en existencias_bodega.", status: 403};
        } else {
            parametros.empresa = (bodega !== '' && bodega !== undefined) ? '03' : result[0].empresa_id;
            parametros.centroUtilidad = (bodega !== '' && bodega !== undefined) ? '1 ' : result[0].centro_utilidad;
            parametros.bodega = (bodega !== '' && bodega !== undefined) ? bodega : result[0].bodega;

            return G.Q.ninvoke(that.m_movimientos_bodegas, "isBodegaDestino", parametros);
        }
    }).then(function (result) {

        if (result.length !== 0) {

            parametros.bodegaDestino = result.bodega_destino;
            return G.Q.nfcall(__traslado, that, parametros);
        }
        return false;
    }).then(function (result) {
        return G.Q.ninvoke(that.m_ordenes_compra, "ingresarBodegaMovimientoTmpProducto", parametros);
    }).then(function (result) {
        callback(false, {status: 200, addItemDocTemporal: result});
    }).fail(function (err) {
        console.log("Error [__addItemDocTemporalI002]", err);
        callback(err);
    }).done();
}

function __traslado(that, parametros, callback) {
    var dBodega;
    var dProducto;
    G.Q.ninvoke(that.m_movimientos_bodegas, "isTrasladosTmp", parametros).then(function (result) {
        if (result.length === 0) {
            throw {msj: "EL producto " + parametros.codigo_producto + " no esta relacionado en existencias_bodega.", status: 403};
        } else {
            dBodega = result.dBodega;
            dProducto = result.dProducto;
            return G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodega", parametros);
        }
    }).then(function (result) {
        if (result.codigo_producto === '') {
            throw {msj: "EL PRODUCTO:" + parametros.codigo_producto + " - " + dProducto + " NO EXISTE EN BODEGA: " + dBodega, status: 403};
        } else {
            callback(false);
        }
    }).fail(function (err) {
        console.log("Error [__traslado]", err);
        callback(true, err);
    }).done();
}

/*
 * 
 * @param {type} parametros
 * @param {type} callback
 * @returns ejecuta documento y crea pedido automatico
 */
function __ejecutarDocumento(parametros, callback) {
    var that = parametros.that;
    var documentoI002;

    var body = {
        session: parametros.session,
        data: {
            movimientos_bodegas: {
                orden_pedido_id: parametros.orden,
                doc_tmp_id: parametros.doc_tmp_id,
//                    usuario_id: parametros.session.user.usuario_id,
                usuario_id: parametros.usuario_id,
                automatico: true
            }
        }
    };

    parametros.req.body = body;

    G.Q.ninvoke(that.c_i002, "execCrearDocumentoAutomatico", parametros.req).then(function (result) {

        documentoI002 = result.respuesta;
        if (parametros.swTipoPedido === '0') {

            if (parametros.id_orden_pedido_origen === null && parametros.cotizacion.id_orden_cotizacion_origen === null) {

                return G.Q.ninvoke(that.m_pedidos_clientes, "consultarEstadoCotizacion", parametros.cotizacion.id_orden_cotizacion_destino);
            } else {
                parametros.orden_id_ct = parametros.id_orden_pedido_origen;
                return G.Q.ninvoke(that.m_pedidos_farmacias, "consulta_solicitud_productos_a_bodega_principal", parametros);
            }

        } else {
            return  true;
        }

    }).then(function (result) {

        if (parametros.swTipoPedido === '0') {
            var obj = {
                session: parametros.session,
                body: {
                    data: {
                        numero_pedido: parametros.pedido,
                        productos: parametros.productos,
                        usuario_id: result[0].usuario_id
                    }
                }
            };

            return G.Q.ninvoke(that.c_pedidos_clientes, "pedidoClienteAPedidoFarmaciaAutomatico", obj);//

        } else if (parametros.swTipoPedido === '1') {
            return G.Q.ninvoke(that.m_pedidos_clientes, "duplicarPedido", parametros.pedido, parametros.sw_origen_destino);
        } else {
            throw {msj: "Tipo pedido inexistente", status: 403};
        }

    }).then(function (result) {

        if (parametros.swTipoPedido === '0') {

            var obj = {
                id_orden_pedido_final: result.respuesta.pedido,
                cotizacion_origen: parametros.cotizacion.id_orden_cotizacion_origen,
                cotizacion_destino: parametros.cotizacion.id_orden_cotizacion_destino
            };

        } else if (parametros.swTipoPedido === '1') {

            var obj = {
                id_orden_pedido_final: result.numero_pedido,
                cotizacion_origen: parametros.cotizacion.id_orden_cotizacion_origen,
                cotizacion_destino: parametros.cotizacion.id_orden_cotizacion_destino
            };
        }

        documentoI002.pedidoFinal = obj.id_orden_pedido_final;
        return G.Q.ninvoke(that.m_pedidos_clientes, "actualizarPedidoMultipleCliente", obj);

    }).then(function (result) {

        parametros.pedidos = result;
        parametros.pedido = result[0].id_orden_pedido_destino;
        parametros.pedidoFinal = documentoI002.pedidoFinal;
        parametros.estado = '1';

        return G.Q.nfcall(__ejecutaAsignacionDePedido, that, parametros);

    }).then(function (result) {

        callback(false, {status: 200, respuesta: documentoI002});
    }).fail(function (err) {
        console.log("Error [__ejecutarDocumento]", err);
        callback(err);
    }).done();
}
;

/*
 * 
 * @param {type} that
 * @param {type} parametros
 * @param {type} callback
 * @returns asigna pedido automatico al separador, asigna caja o nevera e invoca la separacion
 */
function __ejecutaAsignacionDePedido(that, parametros, callback) {

    var responsable;
    var pedidos;
    G.Q.ninvoke(that.m_pedidos_clientes, "consultarResponsablePedido", parametros).then(function (result) {
        var pedidos = [];
        pedidos.push(parametros.pedidoFinal);
        var obj = {
            session: parametros.session,
            body: {
                data: {
                    asignacion_pedidos: {
                        pedidos: pedidos,
                        estado_pedido: "1",
                        responsable: result[0].responsable_id
                    }
                }
            }
        };
        responsable = result[0].responsable_id;
        if (parametros.pedidos[0].sw_tipo_pedido === '0') {//farmacia

            return G.Q.ninvoke(that.c_pedidos_farmacias, "asignarResponsablesPedidoAutomatico", obj);
        } else {

            return G.Q.ninvoke(that.c_pedidos_clientes, "asignarResponsablesPedidoAutomatico", obj);
        }

    }).then(function (result) {

        var filtro = {numeroPedido: parametros.pedidoFinal};
        if (parametros.pedidos[0].sw_tipo_pedido === '0') {//farmacia

            return G.Q.ninvoke(that.m_pedidos_farmacias, "listar_pedidos_del_operario", responsable, parametros.pedidoFinal, filtro, 0, 1);

        } else {

            return G.Q.ninvoke(that.m_pedidos_clientes, "listar_pedidos_del_operario", responsable, parametros.pedidoFinal, filtro, 0, 1);

        }

    }).then(function (result) {

        pedidos = result[0];
        return G.Q.ninvoke(that.m_e008, "consultar_rotulo_caja_tipo", parametros.pedidos[0].id_orden_pedido_destino);

    }).then(function (result) {

        var obj = {
            session: parametros.session,
            body: {
                data: {
                    documento_temporal: {
                        documento_temporal_id: 0,
                        numero_caja: '1',
                        numero_pedido: parametros.pedidoFinal,
                        tipo: result[0][0].tipo,
                        tipo_pedido: 1
                    }
                }
            }
        };

        if (parametros.pedidos[0].sw_tipo_pedido === '0') {//farmacia
            obj.body.data.documento_temporal.direccion_cliente = pedidos[0].nombre_farmacia;
            obj.body.data.documento_temporal.nombre_cliente = pedidos[0].nombre_farmacia;
            obj.body.data.documento_temporal.tipo_pedido = 2;
        } else {

            var direccion = '';
            if (pedidos[0].direccion_sede) {
                direccion = pedidos[0].direccion_sede;
            } else {
                direccion = pedidos[0].direccion_cliente;
            }
            obj.body.data.documento_temporal.direccion_cliente = direccion;
            obj.body.data.documento_temporal.nombre_cliente = pedidos[0].nombre_cliente;
            obj.body.data.documento_temporal.nombre_sede = pedidos[0].nombre_sede;
        }
        return G.Q.ninvoke(that.c_e008, "validarCajaProductoAutomatico", obj);

    }).then(function (result) {

        var obj = {
            numero_pedido: parametros.pedidoFinal,
            empresa_id: pedidos[0].empresa_destino,
            observacion: "Pedido #" + parametros.pedidoFinal
        };

        obj.tercero_id = pedidos[0].identificacion_cliente;
        obj.tipo_tercero_id = pedidos[0].tipo_id_cliente;

        var obj = {
            session: parametros.session,
            body: {
                data: {
                    documento_temporal: obj
                }
            }
        };

        if (parametros.pedidos[0].sw_tipo_pedido === '0') {//farmacia
            return G.Q.ninvoke(that.c_e008, "documentoTemporalFarmaciasAutomatico", obj);
        } else {
            return G.Q.ninvoke(that.c_e008, "documentoTemporalClientesAutomatico", obj);
        }

    }).then(function (result) {

        parametros.doc_tmp_id = result.respuesta.documento_temporal.doc_tmp_id;

        return G.Q.ninvoke(that.m_e008, "obtenerTotalDetalleDespachoAutomatico", {empresa: parametros.empresa, prefijoDocumento: parametros.prefijo_documento, numeroDocumento: parametros.numero_documento});

    }).then(function (result) {

        parametros.productos = result;
        return G.Q.nfcall(__enviarDocumentoTemporal, that, parametros, pedidos, 0);

    }).then(function (result) {

        callback(false, result);

    }).fail(function (err) {
        console.log("Error [__ejecutarDocumento] ", err);
        callback(err);
    }).done();
}

/*
 * 
 * @param {type} that
 * @param {type} parametros
 * @param {type} pedidos
 * @param {type} index
 * @param {type} callback
 * @returns asigna los productos al temporal de separacion
 */
function __enviarDocumentoTemporal(that, parametros, pedidos, index, callback) {

    var producto = parametros.productos[index];
    if (producto === undefined) {
        callback(false, true);
        return;
    }


//parametros.cotizacion.id_orden_cotizacion_origen
    var param = {
        cotizacion: parametros.cotizacion.id_orden_cotizacion_origen,
        codigo_producto: producto.codigo_producto
    };

    G.Q.ninvoke(that.m_pedidos_clientes, "consultarValorUnitarioCotizacionProducto", param).then(function (result) {

        var valor_unitario;
        var total_costo;

        if (parametros.pedidos[0].sw_tipo_pedido === '0') {//farmacia
            valor_unitario = producto.valor_unitario;
            total_costo = producto.total_costo;
        } else {
            valor_unitario = result[0].valor_unitario;
            total_costo = result[0].valor_unitario * producto.cantidad;
        }

        var obj = {
            session: parametros.session,
            body: {
                data: {
                    documento_temporal: {
                        empresa_id: pedidos[0].empresa_destino,
                        centro_utilidad_id: pedidos[0].centro_destino,
                        bodega_id: pedidos[0].bodega_destino,
                        doc_tmp_id: parametros.doc_tmp_id,
                        codigo_producto: producto.codigo_producto,
                        lote: producto.lote,
                        fecha_vencimiento: producto.fecha_vencimiento,
                        cantidad_ingresada: producto.cantidad,
                        valor_unitario: valor_unitario,
                        iva: producto.porcentaje_gravamen,
                        total_costo: total_costo,
                        total_costo_pedido: producto.total_costo_pedido,
                        cantidad_solicitada: producto.cantidad,
                        valida: true
                    }
                }
            }
        };
        return G.Q.ninvoke(that.c_e008, "detalleDocumentoTemporalConValidacionCantidadIngresadaAutomatico", obj);


    }).then(function (result) {

        return G.Q.ninvoke(that.m_e008, "actualizarCajaDeTemporal", result.respuesta.documento_temporal.item_id, producto.numero_caja, producto.tipo_caja);

    }).then(function (result) {
        index++;
        __enviarDocumentoTemporal(that, parametros, pedidos, index, callback);

    }).fail(function (err) {
        console.log("Error [__enviarDocumentoTemporal]", err);
        callback(err);
        return;
    }).done();
}

/**
 * @author Cristian Manuel Ardila Troches
 * +Descripcion Metodo encargado de asignar el responsable del pedido, actualizar
 *              el estado terminado del pedido, y si es el caso almacenar los productos
 *              proximos a autorizar
 * @fecha 03/02/2017 (DD/MM/YYYY)
 */
OrdenesCompra.prototype.__insertarOrdenCompra = function (parametros, callback) {

    //cotizacion, pedidoGenerado
    var that = this;
    var numero_orden;

    G.Q.nfcall(that.m_ordenes_compra.insertar_orden_compra,
            parametros.unidad_negocio,
            parametros.proveedor,
            parametros.empresa_id,
            parametros.observacion,
            parametros.usuario_id,
            parametros.empresa_pedido,
            parametros.centro_utilidad_pedido,
            parametros.bodega_pedido,
            parametros.terminarOrden,
            null).then(function (rows) {

        var def = G.Q.defer();
        numero_orden = (rows.length > 0) ? rows[0] : 0;
        //Se guarda la ubicacion de la bodega destino de la orden
        if (parametros.bodegaDestino) {
            parametros.bodegaDestino.ordenCompraId = numero_orden;
            return G.Q.nfcall(that.m_ordenes_compra.guardarDestinoOrden, parametros.bodegaDestino);
        } else {
            def.resolve();
        }

    }).then(function (resultado) {

        callback(false, {status: 200, msj: 'Orden de compra registrada correctamente', data: {numero_orden: numero_orden}});

    }).fail(function (err) {
        var msj = "Erro Interno";
        var status = 500;

        if (err.status) {
            msj = err.msj;
            status = err.status;
        }
        console.log("Error [__insertarOrdenCompra]", err);
        callback(err, {status: status, msj: msj});

    }).done();

};



OrdenesCompra.$inject = ["m_ordenes_compra", "m_productos", "e_ordenes_compra", "emails", "m_usuarios", "m_actasTecnicas", "m_e008", "m_movimientos_bodegas", "m_i002", "c_i002", "c_pedidos_clientes", "m_pedidos_clientes", "c_e008", "c_pedidos_farmacias", "m_pedidos_farmacias"];

module.exports = OrdenesCompra;