
var OrdenesCompra = function(ordenes_compras) {

    console.log("Modulo Ordenes Compra  Cargado ");

    this.m_ordenes_compra = ordenes_compras;
};


// Listar las ordenes de compra
OrdenesCompra.prototype.listarOrdenesCompra = function(req, res) {

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

    that.m_ordenes_compra.listar_ordenes_compra(fecha_inicial, fecha_final, termino_busqueda, pagina_actual, function(err, lista_ordenes_compras) {

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
OrdenesCompra.prototype.consultarOrdenCompra = function(req, res) {

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
    
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function(err, orden_compra) {

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
OrdenesCompra.prototype.consultarDetalleOrdenCompra = function(req, res) {

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
    
    that.m_ordenes_compra.consultar_detalle_orden_compra(numero_orden, function(err, lista_productos) {

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
OrdenesCompra.prototype.listarProductos = function(req, res) {

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

    that.m_ordenes_compra.listar_productos(empresa_id, codigo_proveedor_id, numero_orden, termino_busqueda, laboratorio_id, pagina_actual, function(err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {lista_productos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Productos', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};


// Insertar una orden de compra 
OrdenesCompra.prototype.insertarOrdenCompra = function(req, res) {

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


    var unidad_negocio = args.ordenes_compras.unidad_negocio;
    var proveedor = args.ordenes_compras.codigo_proveedor;
    var empresa_id = args.ordenes_compras.empresa_id;
    var observacion = args.ordenes_compras.observacion;
    var usuario_id = req.session.user.usuario_id;


    /*console.log('==== Parametros =========');
     console.log(unidad_negocio);
     console.log(proveedor);
     console.log(empresa_id);
     console.log(observacion);
     console.log(usuario_id);
     console.log('==========================');
     return;*/

    that.m_ordenes_compra.insertar_orden_compra(unidad_negocio, proveedor, empresa_id, observacion, usuario_id, function(err, rows, result) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
            return;
        } else {

            var numero_orden = (rows.length > 0) ? rows[0].orden_pedido_id : 0;

            res.send(G.utils.r(req.url, 'Orden de Compra regitrada correctamente', 200, {numero_orden: numero_orden}));
            return;
        }
    });
};

// Insertar Detalle una orden de compra 
OrdenesCompra.prototype.insertarDetalleOrdenCompra = function(req, res) {

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


    var numero_orden = args.ordenes_compras.numero_orden;
    var codigo_producto = args.ordenes_compras.codigo_producto;
    var cantidad_solicitada = args.ordenes_compras.cantidad_solicitada;
    var valor = args.ordenes_compras.valor;
    var iva = args.ordenes_compras.iva;


    /*console.log('==== Parametros =========');
    console.log(numero_orden);
    console.log(codigo_producto);
    console.log(cantidad_solicitada);
    console.log(valor);
    console.log(iva);
    console.log('==========================');
    return;*/

    that.m_ordenes_compra.insertar_detalle_orden_compra(numero_orden, codigo_producto, cantidad_solicitada, valor, iva, function(err, rows, result) {
        
        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Producto regitrado correctamente', 200, {ordenes_compras: {}}));
            return;
        }
    });
};


// Eliminar una orden de compra 
OrdenesCompra.prototype.eliminarOrdenCompra = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.numero_orden === undefined) {
        res.send(G.utils.r(req.url, 'numero_orden  no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.numero_orden === '') {
        res.send(G.utils.r(req.url, 'numero_orden esta vacias', 404, {}));
        return;
    }

    var numero_orden = args.ordenes_compras.numero_orden;


    that.m_ordenes_compra.eliminar_detalle_orden_compra(numero_orden, function(err, rows, result) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
            return;
        } else {
            that.m_ordenes_compra.eliminar_orden_compra(numero_orden, function(err, rows, result) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
                    return;
                } else {
                    res.send(G.utils.r(req.url, 'Orden de Compra eliminada correctamente', 200, {ordenes_compras: []}));
                    return;
                }
            });
        }
    });
};


// Eliminar una orden de compra 
OrdenesCompra.prototype.eliminarProductoOrdenCompra = function(req, res) {

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

    that.m_ordenes_compra.eliminar_producto_orden_compra(numero_orden, codigo_producto, function(err, rows, result) {
        
        console.log('====== resultado ========');
        console.log(err, rows, result);
        console.log('=========================');
        
        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Eliminado el producto', 500, {ordenes_compras: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Producto eliminado correctamente', 200, {ordenes_compras: []}));
            return;
        }
    });
};


OrdenesCompra.$inject = ["m_ordenes_compra"];

module.exports = OrdenesCompra;