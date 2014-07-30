
var E008Controller = function(movientos_bodegas, e008_sql) {

    this.m_movientos_bodegas = movientos_bodegas;
    this.m_e008 = e008_sql;
};

E008Controller.prototype.documentoTemporalClientes = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.tipo_tercero_id === undefined || args.documento_temporal.tercero_id === undefined || args.documento_temporal.observacion === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.tipo_tercero_id === '' || args.documento_temporal.tercero_id === '' || args.documento_temporal.observacion === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacíos', 404, {}));
        return;
    }

    var bodegas_doc_id = 0;
    var numero_pedido = args.documento_temporal.numero_pedido;
    var tipo_tercero_id = args.documento_temporal.tipo_tercero_id;
    var tercero_id = args.documento_temporal.tercero_id;
    var observacion = args.documento_temporal.observacion;
    var usuario_id = req.session.user.usuario_id;

    that.m_e008.ingresar_despacho_clientes_temporal(bodegas_doc_id, numero_pedido, tipo_tercero_id, tercero_id, observacion, usuario_id, function(err, doc_tmp_id) {
        if (err) {
            console.log('******** Responder Error *********');
            console.log(err);
            res.send(G.utils.r(req.url, 'Error Creando el Documento Temporal Clientes', 500, {documento_temporal: {}}));
            return;
        } else {
            console.log('******** Doc tmp id **************');
            console.log(doc_tmp_id);
            console.log('**********************');
            res.send(G.utils.r(req.url, 'Documento Temporal Cliente Creado Correctamente', 200, {documento_temporal: {doc_tmp_id: doc_tmp_id}}));
            return;
        }
    });
};

E008Controller.prototype.documentoTemporalFarmacias = function(req, res) {


    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.numero_pedido === undefined || args.documento_temporal.empresa_id === undefined || args.documento_temporal.observacion === undefined) {
        res.send(G.utils.r(req.url, 'El numero_pedido, empresa_id u observacion no estan definidos ', 404, {}));
        return;
    }

    if (args.documento_temporal.numero_pedido === '' || args.documento_temporal.empresa_id === '' || args.documento_temporal.observacion === '') {
        res.send(G.utils.r(req.url, 'El numero_pedido, empresa_id u observacion estan vacios ', 404, {}));
        return;
    }

    var bodegas_doc_id = 0;
    var empresa_id = args.documento_temporal.empresa_id;
    var numero_pedido = args.documento_temporal.numero_pedido;
    var observacion = args.documento_temporal.observacion;
    var usuario_id = req.session.user.usuario_id;

    that.m_e008.ingresar_despacho_farmacias_temporal(bodegas_doc_id, empresa_id, numero_pedido, observacion, usuario_id, function(err, doc_tmp_id, resultado) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Creando el Documento Temporal Farmacias', 500, {documento_temporal: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Documento Temporal Farmacias Creado Correctamente', 200, {documento_temporal: {doc_tmp_id: doc_tmp_id}}));
            return;
        }
    });


};

E008Controller.prototype.detalleDocumentoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.documento_temporal === undefined || args.documento_temporal.doc_tmp_id === undefined || args.documento_temporal.empresa_id === undefined || args.documento_temporal.centro_utilidad_id === undefined || args.documento_temporal.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'El doc_tmp_id, empresa_id, centro_utilidad_id o  bodega_id No Estan Definidos', 404, {}));
        return;
    }

    if (args.documento_temporal.codigo_producto === undefined || args.documento_temporal.cantidad_ingresada === undefined) {
        res.send(G.utils.r(req.url, 'El código de producto o la cantidad ingresada no están definidas', 404, {}));
        return;
    }

    if (args.documento_temporal.lote === undefined || args.documento_temporal.fecha_vencimiento === undefined) {
        res.send(G.utils.r(req.url, 'El lote o la fecha de vencimiento no están definidas', 404, {}));
        return;
    }

    if (args.documento_temporal.iva === undefined || args.documento_temporal.valor_unitario === undefined) {
        res.send(G.utils.r(req.url, 'El IVA o El vlr Unitario no están definidas', 404, {}));
        return;
    }

    if (args.documento_temporal.total_costo === undefined || args.documento_temporal.total_costo_pedido === undefined) {
        res.send(G.utils.r(req.url, 'El costo total y el costo total del pedido no están definidas', 404, {}));
        return;
    }

    if (args.documento_temporal.doc_tmp_id === '' || args.documento_temporal.empresa_id === '' || args.documento_temporal.centro_utilidad_id === '' || args.documento_temporal.bodega_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id, empresa_id, centro_utilidad_id o  bodega_id estan vacios', 404, {}));
        return;
    }

    if (args.documento_temporal.codigo_producto === '' || args.documento_temporal.cantidad_ingresada === '' || args.documento_temporal.cantidad_ingresada === 0) {
        res.send(G.utils.r(req.url, 'El código de producto esta vacio o la cantidad ingresada es igual a 0', 404, {}));
        return;
    }

    if (args.documento_temporal.lote === '' || args.documento_temporal.fecha_vencimiento === '') {
        res.send(G.utils.r(req.url, 'El lote o la fecha de vencimiento están vacias', 404, {}));
        return;
    }

    if (args.documento_temporal.iva === '' || args.documento_temporal.valor_unitario === '') {
        res.send(G.utils.r(req.url, 'El IVA o El vlr Unitario están Vacíos', 404, {}));
        return;
    }

    if (args.documento_temporal.total_costo === '' || args.documento_temporal.total_costo_pedido === '') {
        res.send(G.utils.r(req.url, 'El costo total y el costo total del pedido están vacíos', 404, {}));
        return;
    }


    var empresa_id = args.documento_temporal.empresa_id;
    var centro_utilidad_id = args.documento_temporal.centro_utilidad_id;
    var bodega_id = args.documento_temporal.bodega_id;
    var doc_tmp_id = args.documento_temporal.doc_tmp_id;
    var codigo_producto = args.documento_temporal.codigo_producto;
    var lote = args.documento_temporal.lote;
    var fecha_vencimiento = args.documento_temporal.fecha_vencimiento;
    var cantidad_ingresada = args.documento_temporal.cantidad_ingresada;
    var valor_unitario = args.documento_temporal.valor_unitario;
    var iva = args.documento_temporal.iva;
    var total_costo = args.documento_temporal.total_costo;
    var total_costo_pedido = args.documento_temporal.total_costo_pedido;
    var usuario_id = req.session.user.usuario_id;


    that.m_movientos_bodegas.ingresar_detalle_movimiento_bodega_temporal(empresa_id, centro_utilidad_id, bodega_id, doc_tmp_id, codigo_producto, cantidad_ingresada, lote, fecha_vencimiento, iva, valor_unitario, total_costo, total_costo_pedido, usuario_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Creando Ingresando el Producto en el documento', 500, {}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Producto registrado correctamente en el documento temporal', 200, {}));
            return;
        }
    });
};

E008Controller.prototype.consultarDocumentoTemporalClientes = function(req, res) {

    var that = this;

    var numero_pedido = 33823;
    var termino_busqueda = "";
    var pagina_actual = "";
    var limite = "";

    that.m_e008.consultar_documento_temporal_clientes(numero_pedido, termino_busqueda, pagina_actual, limite, function(err, documento_temporal, total_registros) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Consultado el Documento Temporal ', 500, {}));
            return;
        }

        var i = documento_temporal.length;
        documento_temporal.forEach(function(documento) {
            that.m_movientos_bodegas.consultar_detalle_movimiento_bodega_temporal(documento.doc_tmp_id, documento.usuario_id, function(err, detalle_documento_temporal) {
                documento.lista_productos = detalle_documento_temporal;
                if (--i === 0)
                    res.send(G.utils.r(req.url, 'Información Documento Temporal Clientes ', 200, {documento_temporal: documento_temporal, total_registros: total_registros}));
            });
        });

        if (documento_temporal.length === 0) {
            // No Existe el Documento
            res.send(G.utils.r(req.url, 'Información Documento Temporal Clientes ', 200, {documento_temporal: documento_temporal, total_registros: total_registros}));
        }
    });
};

E008Controller.prototype.consultarDocumentoTemporalFarmacias = function(req, res) {

};

E008Controller.prototype.eliminarProductoDocumentoTemporal = function(req, res) {

};

E008Controller.prototype.eliminarDocumentoTemporalClientes = function(req, res) {

};
E008Controller.prototype.eliminarDocumentoTemporalFarmacias = function(req, res) {

};

E008Controller.$inject = ["m_movientos_bodegas", "m_e008"];

module.exports = E008Controller;