
var OrdenesCompra = function(ordenes_compras, productos) {

    console.log("Modulo Ordenes Compra  Cargado ");

    this.m_ordenes_compra = ordenes_compras;
    this.m_productos = productos;
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

    that.m_ordenes_compra.consultar_detalle_orden_compra(numero_orden, termino_busqueda, pagina_actual, function(err, lista_productos) {

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


// Modificar la unidad de negocio de una orden de compra 
OrdenesCompra.prototype.modificarUnidadNegocio = function(req, res) {

    var that = this;

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
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function(err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if (orden_compra.tiene_ingreso_temporal === 0 && orden_compra.estado === '1') {

                that.m_ordenes_compra.modificar_unidad_negocio(numero_orden, unidad_negocio, function(err, rows, result) {

                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'No se pudo actualizar la unidad de negocio', 500, {orden_compra: []}));
                        return;
                    } else {

                        res.send(G.utils.r(req.url, 'Unidad de negocio actualizada correctamente', 200, {orden_compra: []}));
                        return;
                    }
                });

            } else {
                res.send(G.utils.r(req.url, 'No se pudo actualizar, la orde de compra esta siendo ingresada.', 403, {orden_compra: []}));
                return;
            }
        }

    });
};

// Modificar Observacion de una orden de compra 
OrdenesCompra.prototype.modificarObservacion = function(req, res) {

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
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function(err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if (orden_compra.tiene_ingreso_temporal === 0 && orden_compra.estado === '1') {

                that.m_ordenes_compra.modificar_observacion(numero_orden, observacion, function(err, rows, result) {

                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'No se pudo actualizar la observacion', 500, {orden_compra: []}));
                        return;
                    } else {

                        res.send(G.utils.r(req.url, 'Observacion actualizada correctamente', 200, {orden_compra: []}));
                        return;
                    }
                });

            } else {
                res.send(G.utils.r(req.url, 'No se pudo actualizar, la orde de compra esta siendo ingresada.', 403, {orden_compra: []}));
                return;
            }
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
OrdenesCompra.prototype.anularOrdenCompra = function(req, res) {

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


    //validar que la OC no tenga NINGUN ingreso temporal.
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function(err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if (orden_compra.tiene_ingreso_temporal === 0 && orden_compra.estado === '1') {

                that.m_ordenes_compra.anular_orden_compra(numero_orden, function(err, rows, result) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Orden de Compra anulada correctamente', 200, {ordenes_compras: []}));
                        return;
                    }
                });
            } else {
                res.send(G.utils.r(req.url, 'No se pudo actualizar, la orden de compra esta siendo o ya fue ingresada.', 403, {orden_compra: []}));
                return;
            }
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


// Generar Finalizar Orden de Compra
OrdenesCompra.prototype.finalizarOrdenCompra = function(req, res) {

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
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function(err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if (orden_compra.tiene_ingreso_temporal === 0 && orden_compra.estado === '1') {

                that.m_ordenes_compra.finalizar_orden_compra(numero_orden, finalizar_orden_compra, function(err, rows, result) {

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
                res.send(G.utils.r(req.url, 'No se pudo actualizar, la orde de compra esta siendo ingresada.', 403, {orden_compra: []}));
                return;
            }
        }

    });
};


// Ingresar Novedades Orden Compra
OrdenesCompra.prototype.gestionarNovedades = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.novedad_id === undefined || args.ordenes_compras.item_id === undefined || args.ordenes_compras.observacion_id === undefined || args.ordenes_compras.descripcion === undefined) {
        res.send(G.utils.r(req.url, 'novedad_id, item_id, observacion_id no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.item_id === '' || args.ordenes_compras.item_id === 0 || args.ordenes_compras.item_id === '0') {
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



    that.m_ordenes_compra.consultar_novedad_producto(novedad_id, function(err, novedades) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando la novedad', 500, {ordenes_compras: []}));
            return;
        } else {

            if (novedades.length === 0) {
                that.m_ordenes_compra.insertar_novedad_producto(item_id, observacion_id, descripcion_novedad, usuario_id, function(err, rows, result) {

                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error registrando la novedad', 500, {ordenes_compras: []}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Novedad registrada correctamente', 200, {ordenes_compras: rows}));
                        return;
                    }
                });
            } else {
                that.m_ordenes_compra.modificar_novedad_producto(novedad_id, observacion_id, descripcion_novedad, usuario_id, function(err, rows, result) {

                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error modificando la novedad', 500, {ordenes_compras: []}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Novedad modificada correctamente', 200, {ordenes_compras: []}));
                        return;
                    }
                });
            }
        }
    });
};

OrdenesCompra.prototype.subirArchivoNovedades = function(req, res) {


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

    that.m_ordenes_compra.consultar_novedad_producto(novedad_id, function(err, novedades) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando la novedad', 500, {ordenes_compras: []}));
            return;
        } else {

            if (novedades.length === 0) {
                res.send(G.utils.r(req.url, 'La novedad no existe', 500, {ordenes_compras: []}));
                return;
            } else {

                __subir_archivo_novedad(req.body, req.files, function(continuar, nombre_archivo) {

                    if (continuar) {

                        that.m_ordenes_compra.insertar_archivo_novedad_producto(novedad_id, nombre_archivo, nombre_archivo, usuario_id, function(err, rows, result) {

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
OrdenesCompra.prototype.consultarArchivosNovedades = function(req, res) {


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

    that.m_ordenes_compra.consultar_archivo_novedad_producto(novedad_id, function(err, lista_archivos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando los archivos de novedad', 500, {lista_archivos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Archivos Novedad', 200, {lista_archivos: lista_archivos}));
            return;
        }
    });
};



// Subir Plano Orden de Compra
OrdenesCompra.prototype.ordenCompraArchivoPlano = function(req, res) {

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

    __subir_archivo_plano(req.files, function(continuar, contenido) {

        if (continuar) {

            __validar_productos_archivo_plano(that, contenido, function(productos_validos, productos_invalidos) {

                __validar_costo_productos_archivo_plano(that, empresa_id, codigo_proveedor_id, numero_orden, productos_validos, function(_productos_validos, _productos_invalidos) {

                    if (_productos_validos.length === 0) {
                        res.send(G.utils.r(req.url, 'Lista de Productos', 200, {ordenes_compras: {productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                        return;
                    }

                    var i = _productos_validos.length;

                    _productos_validos.forEach(function(producto) {

                        that.m_ordenes_compra.insertar_detalle_orden_compra(numero_orden, producto.codigo_producto, producto.cantidad_solicitada, producto.costo, producto.iva, function(err, rows, result) {
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


function __subir_archivo_plano(files, callback) {

    var ruta_tmp = files.file.path;
    var ext = G.path.extname(ruta_tmp);
    var nombre_archivo = G.random.randomKey(3, 3) + ext;
    var ruta_nueva = G.dirname + G.settings.carpeta_temporal + nombre_archivo;
    var contenido_archivo_plano = [];

    if (G.fs.existsSync(ruta_tmp)) {
        // Copiar Archivo
        G.fs.copy(ruta_tmp, ruta_nueva, function(err) {
            if (err) {
                // Borrar archivo fisico
                G.fs.unlinkSync(ruta_tmp);
                callback(false);
                return;
            } else {
                G.fs.unlink(ruta_tmp, function(err) {
                    if (err) {
                        callback(false);
                        return;
                    } else {
                        // Cargar Contenido
                        contenido_archivo_plano = G.xlsx.parse(ruta_nueva);
                        // Borrar archivo fisico
                        G.fs.unlinkSync(ruta_nueva);
                        callback(true, contenido_archivo_plano);
                    }
                });
            }
        });
    } else {
        callback(false);
    }
}


function __subir_archivo_novedad(data, files, callback) {

    var ruta_tmp = files.file.path;
    var ext = G.path.extname(data.flowFilename);
    var nombre_archivo = 'NOC_' + G.random.randomKey(3, 3) + ext;
    var ruta_nueva = G.dirname + G.settings.carpeta_ordenes_compra + 'Novedades/' + nombre_archivo;

    if (G.fs.existsSync(ruta_tmp)) {
        // Copiar Archivo
        G.fs.copy(ruta_tmp, ruta_nueva, function(err) {
            if (err) {
                // Borrar archivo fisico
                G.fs.unlinkSync(ruta_tmp);
                callback(false);
                return;
            } else {
                G.fs.unlink(ruta_tmp, function(err) {
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
        callback(false);
    }
}
;


function __validar_productos_archivo_plano(contexto, contenido_archivo_plano, callback) {

    var that = contexto;

    var productos_validos = [];
    var productos_invalidos = [];
    var rows = [];

    contenido_archivo_plano.forEach(function(obj) {
        obj.data.forEach(function(row) {
            rows.push(row);
        });
    });

    var i = rows.length;

    rows.forEach(function(row) {
        var codigo_producto = row[0] || '';
        var cantidad_solicitada = row[1] || 0;
        var costo = row[2] || '';

        that.m_productos.validar_producto(codigo_producto, function(err, existe_producto) {

            var producto = {codigo_producto: codigo_producto, cantidad_solicitada: cantidad_solicitada, costo: costo};

            if (existe_producto.length > 0 && cantidad_solicitada > 0) {
                productos_validos.push(producto);
            } else {
                productos_invalidos.push(producto);
            }

            if (--i === 0) {
                callback(productos_validos, productos_invalidos);
            }
        });
    });
}
;


function __validar_costo_productos_archivo_plano(contexto, empresa_id, codigo_proveedor_id, numero_orden, productos, callback) {

    var that = contexto;
    var productos_validos = [];
    var productos_invalidos = [];

    var i = productos.length;

    if (productos.length === 0) {
        callback(productos_validos, productos_invalidos);
        return;
    }

    productos.forEach(function(row) {

        var codigo_producto = row.codigo_producto;

        that.m_ordenes_compra.listar_productos(empresa_id, codigo_proveedor_id, numero_orden, codigo_producto, null, 1, function(err, lista_productos) {

            if (err || lista_productos.length === 0) {
                productos_invalidos.push(row);
            } else {
                var producto = lista_productos[0];
                row.costo = (row.length > 2 && !isNaN(row.costo)) ? row.costo : producto.costo_ultima_compra;
                row.iva = producto.iva;
                productos_validos.push(row);
            }

            if (--i === 0) {
                callback(productos_validos, productos_invalidos);
            }
        });
    });
}
;


OrdenesCompra.$inject = ["m_ordenes_compra", "m_productos"];

module.exports = OrdenesCompra;