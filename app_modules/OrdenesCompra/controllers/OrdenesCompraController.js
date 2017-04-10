
var OrdenesCompra = function(ordenes_compras, productos, eventos_ordenes_compras, emails, m_usuarios) {


    this.m_ordenes_compra = ordenes_compras;
    this.m_productos = productos;
    this.e_ordenes_compra = eventos_ordenes_compras;
    this.emails = emails;
    this.m_usuarios = m_usuarios;
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
    var filtro = args.ordenes_compras.filtro || undefined;
    
    var parametros = { usuario_id:req.session.user.usuario_id, empresa_id:req.session.user.empresa, modulos:[req.session.user.moduloActual], convertirJSON:true };
    
    G.Q.ninvoke(that.m_usuarios, "obtenerParametrizacionUsuario", parametros).
    then(function(parametrizacion){
        
        console.log("parametrizacion ", parametrizacion.modulos);
                
        that.m_ordenes_compra.listar_ordenes_compra(fecha_inicial, fecha_final, termino_busqueda, pagina_actual, filtro, function(err, lista_ordenes_compras) {

            if (err) {
                res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
                return;
            } else {
                res.send(G.utils.r(req.url, 'Lista Ordenes Compras', 200, {ordenes_compras: lista_ordenes_compras}));
                return;
            }
        }); 
    }).fail(function(err){
        
        console.log("eror generando >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", err);
    }).done();

};


// Listar las Ordenes de Compra de un Proveedor
OrdenesCompra.prototype.listarOrdenesCompraProveedor = function(req, res) {
 
    
    
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

    var codigo_proveedor_id = args.ordenes_compras.codigo_proveedor_id;

    that.m_ordenes_compra.listar_ordenes_compra_proveedor(codigo_proveedor_id, function(err, lista_ordenes_compras) {

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

// Consultar Orden de Compra por numero de orden
OrdenesCompra.prototype.consultarDetalleOrdenCompraConNovedades = function(req, res) {

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

    that.m_ordenes_compra.consultarDetalleOrdenCompraConNovedades(numero_orden, termino_busqueda, pagina_actual, function(err, lista_productos) {

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
    var filtro = args.ordenes_compras.filtro || undefined;

    that.m_ordenes_compra.listar_productos(empresa_id, codigo_proveedor_id, numero_orden, termino_busqueda, laboratorio_id, pagina_actual, filtro, function(err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {lista_productos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista Productos', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};


OrdenesCompra.prototype.guardarBodega = function(req, res) {
    var that = this;
    var args = req.body.data;

    var bodegaDestino = args.ordenes_compras.bodegaDestino || undefined;
    var borrarBodega = args.ordenes_compras.borrarBodega;

    if (!bodegaDestino) {
        res.send(G.utils.r(req.url, 'La bodega destino no esta definida', 404, {}));
        return;
    }

    if (bodegaDestino && !borrarBodega) {
        G.Q.nfcall(that.m_ordenes_compra.guardarDestinoOrden, bodegaDestino).then(function(resultado) {
            res.send(G.utils.r(req.url, 'Se ha modificado la bodega correctamente', 200, {}));
        }).catch (function(err) {
            res.send(G.utils.r(req.url, 'Error modificando la bodega destino', 500, {}));
        });
    } else if (borrarBodega) {

        G.Q.nfcall(that.m_ordenes_compra.borrarBodegaOrden, bodegaDestino.ordenCompraId).then(function(resultado) {
            res.send(G.utils.r(req.url, 'Se ha eliminado la bodega destino correctamente', 200, {}));
        }).catch (function(err) {
            res.send(G.utils.r(req.url, 'Error modificando la bodega destino', 500, {}));
        });
    }


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
        proveedor:      args.ordenes_compras.codigo_proveedor,
        empresa_id:     args.ordenes_compras.empresa_id,
        observacion:     args.ordenes_compras.observacion,
        bodegaDestino:   args.ordenes_compras.bodegaDestino,
        usuario_id:      req.session.user.usuario_id
    }
    console.log("parametros ", parametros);
    G.Q.ninvoke(that, "__insertarOrdenCompra",parametros ).then(function (resultado) {
        console.log("__insertarOrdenCompra ", resultado);
        res.send(G.utils.r(req.url, resultado.msj, resultado.status, resultado.data));

    }).fail(function (err) {
        
        res.send(G.utils.r(req.url, err.msj, err.status, {lista_productos: err}));
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

            if (orden_compra.tiene_ingreso_temporal === 0 && (orden_compra.estado === '1' || orden_compra.estado === '3' || orden_compra.estado === '4')) {

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
                res.send(G.utils.r(req.url, 'La orden de compra no puede ser modificada en el estado actual.', 403, {orden_compra: []}));
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

            if (orden_compra.tiene_ingreso_temporal === 0 && (orden_compra.estado === '1' || orden_compra.estado === '3' || orden_compra.estado === '4')) {

                that.m_ordenes_compra.modificar_observacion(numero_orden, observacion, function(err, rows, result) {

                    if (err || result.rowCount === 0) {
                        console.log("error generado ", result, err);
                        res.send(G.utils.r(req.url, 'No se pudo actualizar la observacion', 500, {orden_compra: []}));
                        return;
                    } else {

                        res.send(G.utils.r(req.url, 'Observacion actualizada correctamente', 200, {orden_compra: []}));
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
    var modificar = args.ordenes_compras.modificar || false;


    //validar que la OC no tenga NINGUN ingreso temporal y este Activa.
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function(err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if (orden_compra.tiene_ingreso_temporal === 0 && (orden_compra.estado === '1' || orden_compra.estado === '3' || orden_compra.estado === '4')) {

                if (!modificar) {

                    that.m_ordenes_compra.insertar_detalle_orden_compra(numero_orden, codigo_producto, cantidad_solicitada, valor, iva, null, function(err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
                            return;
                        } else {
                            res.send(G.utils.r(req.url, 'Producto regitrado correctamente', 200, {ordenes_compras: {}}));
                            return;
                        }
                    });

                } else {
                    that.m_ordenes_compra.modificar_detalle_orden_compra(numero_orden, codigo_producto, cantidad_solicitada, valor, function(err, rows, result) {

                        if (err || result.rowCount === 0) {
                            res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
                            return;
                        } else {
                            res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200, {ordenes_compras: {}}));
                            return;
                        }
                    });
                }

            } else {
                res.send(G.utils.r(req.url, 'La orden de compra no puede ser modificada en el estado actual.', 403, {orden_compra: []}));
                return;
            }
        }
    });
};


OrdenesCompra.prototype.cambiarEstado = function(req, res) {

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
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function(err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if ((orden_compra.tiene_ingreso_temporal === 0 && orden_compra.estado === '1') || (estado === 1 && orden_compra.estado === '5')) {

                that.m_ordenes_compra.actualizar_estado_orden_compra(numero_orden, estado, function(err, rows, result) {

                    if (err) {
                        res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Orden de Compra modificada correctamente', 200, {ordenes_compras: []}));
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

    //validar que la OC no tenga NINGUN ingreso temporal.
    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function(err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'La orden de compra no existe', 500, {orden_compra: []}));
            return;
        } else {

            orden_compra = orden_compra[0];

            if (orden_compra.tiene_ingreso_temporal === 0 && (orden_compra.estado === '1' || orden_compra.estado === '3' || orden_compra.estado === '4')) {

                that.m_ordenes_compra.consultarDetalleOrdenCompraConNovedades(numero_orden, codigo_producto, 1, function(err, productos) {

                    if (err || productos.length === 0) {
                        res.send(G.utils.r(req.url, 'Se ha generado un erro consultado la orden de compra code 1', 404, {}));
                        return;
                    } else {
                        var producto = productos[0];

                        if (producto.novedad_id === null) {

                            that.m_ordenes_compra.eliminar_producto_orden_compra(numero_orden, codigo_producto, function(err, rows, result) {

                                if (err || result.rowCount === 0) {
                                    res.send(G.utils.r(req.url, 'Error Eliminado el producto', 500, {ordenes_compras: []}));
                                    return;
                                } else {
                                    res.send(G.utils.r(req.url, 'Producto eliminado correctamente', 200, {ordenes_compras: []}));
                                    return;
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
                res.send(G.utils.r(req.url, 'La orden de compra no puede ser modificada en el estado actual.', 403, {orden_compra: []}));
                return;
            }
        }

    });
};


OrdenesCompra.prototype.eliminarNovedad = function(req, res) {
    var that = this;
    var args = req.body.data;


    if (args.ordenes_compras === undefined || args.ordenes_compras.novedadId === undefined) {
        res.send(G.utils.r(req.url, 'novedad id no esta definida', 404, {}));
        return;
    }

    var novedadId = args.ordenes_compras.novedadId;


    G.Q.ninvoke(that.m_ordenes_compra, 'eliminarRegistroNovedad', {novedadId: novedadId}).then(function(resultado) {
        res.send(G.utils.r(req.url, 'Novedad eliminado correctamente', 200, {}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {}));
    }).done();

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
    var descripcionEntrada = args.ordenes_compras.descripcionEntrada || "";


    that.m_ordenes_compra.consultarNovedadPorObservacion(novedad_id, observacion_id, function(err, novedades) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando la novedad', 500, {ordenes_compras: []}));
            return;
        } else {

            if (novedades.length === 0) {
                that.m_ordenes_compra.insertar_novedad_producto(item_id, observacion_id, descripcion_novedad, usuario_id, descripcionEntrada, function(err, rows, result) {

                    if (err || result.rowCount === 0) {
                        res.send(G.utils.r(req.url, 'Error registrando la novedad', 500, {ordenes_compras: []}));
                        return;
                    } else {
                        res.send(G.utils.r(req.url, 'Novedad registrada correctamente', 200, {ordenes_compras: rows}));
                        return;
                    }
                });
            } else {
                that.m_ordenes_compra.modificar_novedad_producto(novedad_id, observacion_id, descripcion_novedad, usuario_id, descripcionEntrada, function(err, rows, result) {

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


OrdenesCompra.prototype.subirArchivoOrdenes = function(req, res){
    var that = this;
    var args = req.body.data;
    
    
    if (args.ordenes_compras === undefined  || args.ordenes_compras.empresa_id === undefined || args.ordenes_compras.empresa_id === "") {
        res.send(G.utils.r(req.url, 'La empresa no esta definida', 404, {}));
        return;
    }
    
    console.log("subir archivo ordenes ");
    var cabecera = ['unidad_negocio', 'codigo_proveedor', 'codigo_producto', 'cantidad', 'costo', 'observacion'];
    
    //Notificacion de la subida del archivo plano
    var notificacionArchivoPlano =  function(index, longitud){
        //console.log("notificacion de archivo plano ", index,  " longitud ", longitud);
        var porcentaje = (index * 100) / longitud;
        that.e_ordenes_compra.onNotificarProgresoArchivoPlanoOrdenes(req.session.user.usuario_id, porcentaje);
    };
    
    G.Q.nfcall(G.utils.subirArchivoPlano, req.files, cabecera).then(function(resultado){
       var parametros = {datos:resultado, empresa_id:args.ordenes_compras.empresa_id, 
                         usuario_id:req.session.user.usuario_id, notificacion:notificacionArchivoPlano};       
       return G.Q.ninvoke(that.m_ordenes_compra, 'gestionarArchivoOrdenes', parametros);
    }).then(function(resultado){
        res.send(G.utils.r(req.url, 'Archivo cargado correctamente', 200, {pdf:resultado}));
    }).fail(function(err){
        //console.log("se ha generado un error ", err);
        res.send(G.utils.r(req.url, err, 500, {ordenes_compras: []}));
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

// Generar Reporte Orden Compra
OrdenesCompra.prototype.reporteOrdenCompra = function(req, res) {

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

    that.m_ordenes_compra.consultar_orden_compra(numero_orden, function(err, orden_compra) {

        if (err || orden_compra.length === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {orden_compra: []}));
            return;
        } else {

            that.m_ordenes_compra.consultar_detalle_orden_compra(numero_orden, '', 0, function(err, lista_productos) {

                if (err) {
                    res.send(G.utils.r(req.url, 'Error Interno', 500, {lista_productos: []}));
                    return;
                } else {

                    var orden = orden_compra[0];

                    _generar_reporte_orden_compra({orden_compra: orden,
                        lista_productos: lista_productos,
                        usuario_imprime: req.session.user.nombre_usuario,
                        serverUrl: req.protocol + '://' + req.get('host') + "/"}, function(nombre_reporte) {

                        if (enviar_email) {

                            var path = G.dirname + "/public/reports/" + nombre_reporte;
                            var filename = "OrdenCompraNo-" + numero_orden + '.pdf';

                            __enviar_correo_electronico(that, emails, path, filename, subject, message, function(enviado) {

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

    G.utils.subirArchivoPlano(req.files, ['codigo', 'cantidad', 'costo'], function(error, contenido) {

        if (!error) {

            __validar_productos_archivo_plano(that, contenido, function(productos_validos, productos_invalidos) {

                __validar_costo_productos_archivo_plano(that, empresa_id, codigo_proveedor_id, numero_orden, productos_validos, req.session.user.usuario_id, function(_productos_validos, _productos_invalidos) {

                    if (_productos_validos.length === 0) {
                        res.send(G.utils.r(req.url, 'Lista de Productos', 200, {ordenes_compras: {productos_validos: _productos_validos, productos_invalidos: _productos_invalidos.concat(productos_invalidos)}}));
                        return;
                    }

                    var i = _productos_validos.length;

                    _productos_validos.forEach(function(producto) {

                        that.m_ordenes_compra.insertar_detalle_orden_compra(numero_orden, producto.codigo_producto, producto.cantidad_solicitada, producto.costo, producto.iva, null, function(err, rows, result) {
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
OrdenesCompra.prototype.listarRecepcionesMercancia = function(req, res) {

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

    that.m_ordenes_compra.listar_recepciones_mercancia(fecha_inicial, fecha_final, termino_busqueda, pagina_actual, function(err, lista_recepciones_mercancia) {

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
OrdenesCompra.prototype.consultarRecepcionMercancia = function(req, res) {

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

    that.m_ordenes_compra.consultar_recepcion_mercancia(recepcion_id, function(err, recepcion_mercancia) {

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
OrdenesCompra.prototype.insertarRecepcionMercancia = function(req, res) {

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

    that.m_ordenes_compra.insertar_recepcion_mercancia(recepcion_mercancia, function(err, response) {

        if (err || response.length === 0) {
            var msj = (err.msj !== undefined) ? err.msj : '';

            res.send(G.utils.r(req.url, 'Error insertando la recepcion ' + msj, 500, {ordenes_compras: []}));
            return;
        } else {

            // Notificacion Real Time de las Ordenes que fueron actualizadas
            var numero_orden = recepcion_mercancia.orden_compra.numero_orden_compra;
            that.e_ordenes_compra.onNotificarOrdenesComprasActualizados({numero_orden: numero_orden});

            //Insertar productos de la OC a la Recepcion de la Mercancia
            that.m_ordenes_compra.consultar_detalle_orden_compra(recepcion_mercancia.orden_compra.numero_orden_compra, '', '', function(err, lista_productos) {

                if (err || lista_productos.length === 0) {
                    res.send(G.utils.r(req.url, 'Error consultando la orden de compra', 500, {lista_productos: []}));
                    return;
                } else {

                    var numero_recepcion = response[0].id;
                    var i = lista_productos.length;

                    lista_productos.forEach(function(_producto) {

                        var producto = {
                            recepcion_mercancia_id: numero_recepcion,
                            novedades_recepcion_id: null,
                            codigo_producto: _producto.codigo_producto,
                            cantidad_recibida: 0,
                            usuario_id: usuario_id
                        };

                        that.m_ordenes_compra.insertar_productos_recepcion_mercancia(producto, function(err) {

                            if (--i === 0) {
                                res.send(G.utils.r(req.url, 'Recepcion mercancia insertada correctamente', 200, {ordenes_compras: numero_recepcion}));
                                return;
                            }
                        });
                    });
                }
            });
        }
    });
};

// Insertar recepciones de mercancia
OrdenesCompra.prototype.modificarRecepcionMercancia = function(req, res) {

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

    that.m_ordenes_compra.modificar_recepcion_mercancia(recepcion_mercancia, function(err, recepcion_mercancia) {

        if (err) {
            var msj = (err.msj !== undefined) ? err.msj : '';

            res.send(G.utils.r(req.url, 'Error modificando la recepcion ' + msj, 500, {ordenes_compras: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Recepcion mercancia modificada correctamente', 200, {ordenes_compras: recepcion_mercancia}));
            return;
        }
    });
};


// Listar productos de la recepcion de mercancia
OrdenesCompra.prototype.listarProductosRecepcionMercancia = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.recepcion_id === undefined) {
        res.send(G.utils.r(req.url, 'El objeto de parametros no esta definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.recepcion_id === '' || !args.ordenes_compras.recepcion_id ) {
        res.send(G.utils.r(req.url, 'El id de la recepcion de mercancia es un parametro obligatorio', 404, {}));
        return;
    }
    
    if (args.ordenes_compras.orden_compra.numero_orden_compra === '' || !args.ordenes_compras.orden_compra.numero_orden_compra) {
        res.send(G.utils.r(req.url, 'El numero de la orden de compra es un parametro obligatorio', 404, {}));
        return;
    }
  
    var recepcion_id = args.ordenes_compras.recepcion_id;
    var numeroOrdenCompra = args.ordenes_compras.orden_compra.numero_orden_compra;
   
    that.m_ordenes_compra.listar_productos_recepcion_mercancia({recepcion_id: recepcion_id , numero_orden_compra: numeroOrdenCompra}, function(err, productos) {

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
OrdenesCompra.prototype.insertarProductosRecepcionMercancia = function(req, res) {

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

    that.m_ordenes_compra.insertar_productos_recepcion_mercancia(producto_mercancia, function(err, productos) {

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
OrdenesCompra.prototype.modificarProductosRecepcionMercancia = function(req, res) {

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
       
    G.Q.ninvoke(that.m_ordenes_compra,"modificar_productos_recepcion_mercancia", recepcion_mercancia, producto_mercancia).then(function(resultado){
         
        if(resultado.rowCount === 1){
             
            if(resultado.rows[0].cantidad_pendiente > 0 ){
                estadoOrdenDeCompra = '6';
            }else{
                estadoOrdenDeCompra = '3';
            }
        
        return G.Q.ninvoke(that.m_ordenes_compra,"actualizar_estado_orden_compra", recepcion_mercancia.orden_compra.numero_orden_compra, estadoOrdenDeCompra)   
            
        }else{
            throw 'Error modificando productos a la recepcion ';
        }
    }).then(function(resultado){
       
        res.send(G.utils.r(req.url, 'Producto modificado correctamente', 200, {ordenes_compras: []}));
        
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error modificando productos a la recepcion', 500, {ordenes_compras: []}));
        
    }).done();
     
};

// Finalizar recepcion de mercancia
OrdenesCompra.prototype.finalizarRecepcionMercancia = function(req, res) {

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
    
    console.log("recepcion ", recepcion);
    console.log("cantidadTotalPendiente ", cantidadTotalPendiente);
    console.log("numero_orden ", numero_orden);
    
    
    that.m_ordenes_compra.finalizar_recepcion_mercancia(recepcion, function(err, result) {

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
OrdenesCompra.prototype.listarAutorizacionCompras = function(req, res) {

    var that = this;
    var args = req.body.data.listar_autorizaciones;

    if (args.empresa === undefined) {
        res.send(G.utils.r(req.url, 'La empresa no esta definida', 404, {}));
        return;
    }

    if (args.paginaActual === '') {
        args.paginaActual = 0;
    }

    G.Q.ninvoke(that.m_ordenes_compra, 'listarAutorizacionCompras', args).then(function(result) {
        res.send(G.utils.r(req.url, 'Consulta Autorizaciones de Compras - correctamente', 200, {ordenes_compras: result}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Consultar las Autorizaciones de Compras', 500, {ordenes_compras: []}));
    }).done();
};

/*
 * Método que modifica la orden por autorizar tabla compras_ordenes_pedidos_productosfoc
 * @param mapa de llave valor modifica tabla compras_ordenes_pedidos_productosfoc
 * @return mensaje el sistema
 * @utilizado Se utiliza en el cliente de angular, para el modulo autorizaciones encargado de autorizar las ordenes de compra
 */
OrdenesCompra.prototype.modificarAutorizacionCompras = function(req, res) {

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

    G.Q.ninvoke(that.m_ordenes_compra, 'modificarAutorizacionOrdenCompras', args).then(function(result) {
        res.send(G.utils.r(req.url, 'Autorizacion Orden de Compra Modificado Correctamente', 200, {ordenes_compras: result}));
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error Modificando la Autorizacion de Ordenes de Compra', 500, {ordenes_compras: []}));
    }).done();
};

/*
 * Método que inserta en la tabla inv_bodegas_movimiento_tmp_d
 * @param mapa de llave valor insertar en la tabla inv_bodegas_movimiento_tmp_d
 * @return mensaje el sistema
 * @utilizado Se utiliza en el cliente de angular, para el modulo autorizaciones encargado de autorizar las ordenes de compra.
 */
OrdenesCompra.prototype.ingresarBodegaMovimientoTmpOrden = function(req, res) {

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

    G.Q.ninvoke(that.m_ordenes_compra, 'ingresarBodegaMovimientoTmp', args).then(function(result) {
        res.send(G.utils.r(req.url, 'Insercion bodega movimiento TMP Correctamente', 200, {ordenes_compras: result}));
    }).fail(function(err) {
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

    filas.forEach(function(row) {
        var codigo_producto = row.codigo || '';
        var cantidad_solicitada = row.cantidad || 0;
        var costo = row.costo || '';

        that.m_productos.validar_producto(codigo_producto, function(err, existe_producto) {

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
    productos.forEach(function(row) {

        var codigo_producto = row.codigo_producto;

        that.m_ordenes_compra.listar_productos(empresa_id, codigo_proveedor_id, numero_orden, codigo_producto, null, 1, null, function(err, lista_productos) {

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
    }, function(err, response) {

        response.body(function(body) {

            var fecha_actual = new Date();
            var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombre_reporte, body, "binary", function(err) {

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

    smtpTransport.sendMail(settings, function(error, response) {

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
 * +Descripcion Funcion encargada de crear orden de compra invocada desde auditoria
 * 
 */
OrdenesCompra.prototype.generarOrdenDeCompraAuditado = function(req, res) {
    
    console.log("**********generarOrdenDeCompraAuditado****************");
    console.log("**********generarOrdenDeCompraAuditado****************");
    console.log("**********generarOrdenDeCompraAuditado****************");
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
 
     
    var parametros = {
        encabezado:{
            unidad_negocio: args.ordenes_compras.unidad_negocio,
            proveedor:      args.ordenes_compras.codigo_proveedor,
            empresa_id:     args.ordenes_compras.empresa_id,
            observacion:     args.ordenes_compras.observacion,
            bodegaDestino:   args.ordenes_compras.bodegaDestino,
            usuario_id:      req.session.user.usuario_id,
            detalle: args.ordenes_compras.productos,
            ordenId: 0,
            codigo_proveedor: args.ordenes_compras.codigo_proveedor
        },
        transaccion: null,
        contexto : that.m_ordenes_compra
    }
    //console.log("parametros ", parametros);
    G.Q.ninvoke(that, "__insertarOrdenCompra",parametros.encabezado ).then(function (resultado) {
         
        parametros.encabezado.ordenId = resultado.data.numero_orden;
        
        return G.Q.ninvoke(that.m_ordenes_compra, "gestionaDetalleOrden",parametros );
         
    }).then(function(resultado){
        
        return G.Q.ninvoke(that.m_ordenes_compra, "finalizar_orden_compra",parametros.encabezado.ordenId, 1);
         
        
    }).then(function(resultado){
        
        console.log("resultado [finalizar_orden_compra]: ", resultado)
        
          res.send(G.utils.r(req.url,"La orden de compra # " + parametros.encabezado.ordenId + " se ha generado satisfactoriamente", 200, {data: {numero_orden: parametros.encabezado.ordenId}}));
         
    }).fail(function (err) {
        console.log("err [generarOrdenDeCompraAuditado]: ", err);
        res.send(G.utils.r(req.url, err.msj, err.status, {ordenes_compras: err}));
    });

};


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
        parametros.usuario_id, null).then(function(rows) {
            
       
        var def = G.Q.defer();
        numero_orden = (rows.length > 0) ? rows[0].orden_pedido_id : 0;
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
        
        callback(err, {status: status, msj: msj});

    }).done();

};




OrdenesCompra.$inject = ["m_ordenes_compra", "m_productos", "e_ordenes_compra", "emails", "m_usuarios"];

module.exports = OrdenesCompra;