
var I007Controller = function (movimientos_bodegas, m_i007) {

    this.m_movimientos_bodegas = movimientos_bodegas;
    this.m_i007 = m_i007;

};

/*
 * @author German Galvis
 * @fecha 2018-06-01
 * +Descripcion Controlador encargado de listar los tipos de terceros
 *              
 */
I007Controller.prototype.listarTiposTerceros = function (req, res) {

    var that = this;
    G.Q.nfcall(that.m_i007.listarTiposTerceros).
            then(function (resultado) {

                if (resultado.length > 0) {
                    res.send(G.utils.r(req.url, 'Consulta lista tipos terceros', 200, {listar_tipo_terceros: resultado}));
                } else {
                    throw 'Consulta sin resultados';
                }

            }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar lista tipos terceros', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion lista los tipos de prestamos
 * @fecha 2018-06-06
 */
I007Controller.prototype.listarPrestamos = function (req, res) {
    var that = this;
    var args = req.body.data;
    G.Q.nfcall(that.m_i007.listarPrestamos).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar prestamos ok!!!!', 200, {listarPrestamos: resultado}));
            }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar tipos de prestamos', 500, {listarPrestamos: {}}));
    }).done();
};


/**
 * @author German Galvis
 * +Descripcion trae registro del prestamo seleccionado
 * @fecha 2018-06-07
 */
I007Controller.prototype.listarPrestamoId = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        tipoprestamo: args.tipoprestamo
    };


    G.Q.nfcall(that.m_i007.listarPrestamoId, parametros)
            .then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar tercero id ok!!!!', 200, {listarPrestamo: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar el tercero', 500, {listarPrestamo: {}}));
            }).
            done();

};

/**
 * @author German Galvis
 * +Descripcion lista los terceros que concuerden con la busqueda
 * @fecha 2018-06-01
 */
I007Controller.prototype.listarTerceros = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        filtro: args.filtro,
        terminoBusqueda: args.terminoBusqueda,
        empresaId: args.empresaId,
        paginaActual: args.paginaActual
    };
    G.Q.nfcall(that.m_i007.listarTerceros, parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar terceros ok!!!!', 200, {listarTerceros: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de terceros', 500, {listarTerceros: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion trae registro del tercero seleccionado
 * @fecha 2018-06-07
 */
I007Controller.prototype.listarTerceroId = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        id: args.id,
        tipoId: args.tipoId
    };


    G.Q.nfcall(that.m_i007.listarTerceroId, parametros)
            .then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar tercero id ok!!!!', 200, {listarTercero: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar el tercero', 500, {listarTercero: {}}));
            }).
            done();

};

/**
 * @author German Galvis
 * +Descripcion lista los productos buscados
 * @fecha 2018-06-01
 */
I007Controller.prototype.listarProductos = function (req, res) {
    var that = this;
    var args = req.body.data;

    var parametros = {
        empresa_id: args.empresa_id,
        centro_utilidad: args.centro_utilidad,
        bodega: args.bodega,
        descripcion: args.descripcion,
        tipoFiltro: args.tipoFiltro,
        paginaActual: args.paginaActual
    };

    G.Q.nfcall(that.m_i007.listarProductos, parametros).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Listar Productos a trasladar', 200, {listarProductos: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Listar Productos a trasladar', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion crea un nuevo documento temporal
 * @fecha 2018-06-06
 */
I007Controller.prototype.newDocTemporal = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var bodega_doc_id = args.bodega_doc_id;
    var tipo_id_tercero = args.tipo_id_tercero;
    var tercero_id = args.tercero_id;
    var observacion = args.observacion;
    var movimiento_temporal_id;

    if (args.observacion === undefined) {
        res.send(G.utils.r(req.url, 'La observacion NO esta definida', 404, {}));
        return;
    }


    G.Q.ninvoke(that.m_movimientos_bodegas, "obtener_identificicador_movimiento_temporal", usuarioId).then(function (doc_tmp_id) {
        movimiento_temporal_id = doc_tmp_id;
        G.knex.transaction(function (transaccion) {

            G.Q.nfcall(that.m_movimientos_bodegas.ingresar_movimiento_bodega_temporal,
                    movimiento_temporal_id, usuarioId, bodega_doc_id, observacion, transaccion).then(function () {
                var parametros = {
                    doc_tmp_id: movimiento_temporal_id,
                    prestamo: args.prestamo,
                    tipo_id_tercero: tipo_id_tercero,
                    tercero_id: tercero_id,
                    usuario_id: usuarioId
                };
                return G.Q.nfcall(that.m_i007.generarMovimientoPrestamoTmp, parametros, transaccion);
            }).then(function () {
                transaccion.commit(movimiento_temporal_id);
            }).fail(function (err) {
                transaccion.rollback(err);
            }).done();
        }).then(function (movimiento_temporal_id) {
            res.send(G.utils.r(req.url, 'Temporal guardado correctamente', 200, {movimiento_temporal_id: movimiento_temporal_id}));
        }).catch(function (err) {
            res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
        }).done();
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion elimina el documento temporal
 * @fecha 2018-06-06
 */
I007Controller.prototype.eliminarGetDocTemporal = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;


    if (usuarioId === undefined) {
        res.send(G.utils.r(req.url, 'EL usuario_id NO esta definido', 404, {}));
        return;
    }

    if (args.doc_tmp_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }

    var parametros = {
        docTmpId: args.doc_tmp_id,
        usuarioId: usuarioId
    };


    G.knex.transaction(function (transaccion) {

        G.Q.nfcall(that.m_i007.eliminarDocumentoTemporal_d, parametros, transaccion).then(function () {

            return G.Q.nfcall(that.m_i007.eliminarDocumentoTemporal, parametros, transaccion);

        }).then(function () {

            return G.Q.nfcall(that.m_i007.eliminarPrestamoTemporal, parametros, transaccion);

        }).then(function () {
            transaccion.commit();

        }).fail(function (err) {

            console.log("Error rollback ", err);
            transaccion.rollback(err);

        }).done();

    }).then(function () {

        res.send(G.utils.r(req.url, 'SE HA BORRADO EL DOCUMENTO EXITOSAMENTE', 200, {eliminarGetDocTemporal: parametros}));

    }).catch(function (err) {

        console.log("eliminarGetDocTemporal>>>>", err);
        res.send(G.utils.r(req.url, 'ERROR AL BORRAR EL DOCUMENTO', 500, {err: err}));

    }).done();
};

/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal y tablas tmp
 * @fecha 2018-06-07
 */
I007Controller.prototype.agregarItem = function (req, res) {

    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var total = (args.cantidad * args.costo);
    var parametros = {
        usuarioId: usuarioId,
        cantidad: args.cantidad,
        codigoProducto: args.codigoProducto,
        bodega: args.bodega,
        centro: args.centro_utilidad,
        lote: args.lote,
        gravemen: args.gravemen,
        costo: args.costo,
        total: total,
        fechaVencimiento: args.fechaVencimiento,
        empresa: args.empresa_id,
        docTmpId: args.docTmpId

    };
    G.Q.nfcall(that.m_i007.consultarItem, parametros).then(function (result) {
        if (result.length > 0) {
            msj = "El producto " + parametros.codigoProducto + " ya se encuentra registrado en el documento de traslado.";
        } else {
            msj = "producto agregado correctamente";
            return G.Q.nfcall(that.m_i007.agregarItem, parametros);
        }
    }).then(function (resultado) {
        res.send(G.utils.r(req.url, msj, 200, {agregarItem: resultado}));
    }).fail(function (err) {
        console.log("EROR ", err);
        res.send(G.utils.r(req.url, 'Error al insertar el cuerpo del temporal', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion lista los productos del documento tmp
 * @fecha 2018-06-07
 */
I007Controller.prototype.consultarProductosTraslado = function (req, res) {
    var that = this;
    var usuarioId = req.session.user.usuario_id;
    var args = req.body.data;
    if (args.docTmpId === undefined || args.docTmpId === '00000') {
        res.send(G.utils.r(req.url, 'documento_id no esta definida', 404, {}));
        return;
    }

    var parametro = {
        docTmpId: args.docTmpId,
        usuario_id: usuarioId
    };
    G.Q.nfcall(that.m_i007.consultarProductosTraslado, parametro).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar productos a trasladar ok!!!!', 200, {lista_productos: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de productos a trasladar', 500, {lista_productos: {}}));
            }).
            done();
};

/**
 * @author German Galvis
 * +Descripcion Elimina un  producto del documento temporal
 * @fecha 2018-05-24
 */
I007Controller.prototype.eliminarItem = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    if (args.item_id === undefined) {
        res.send(G.utils.r(req.url, 'El item_id NO estan definido', 404, {}));
        return;
    }

    var parametros = {
        item_id: args.item_id,
        docTmpId: args.docTmpId,
        usuarioId: usuarioId
    };
    G.Q.nfcall(that.m_i007.eliminarItem, parametros)

            .then(function (resultado) {
                res.send(G.utils.r(req.url, 'Producto Borrado Correctamente', 200, {eliminarItem: resultado}));
            }).fail(function (err) {
        console.log("eliminarItem  ", err);
        res.send(G.utils.r(req.url, 'Error al borrar Producto', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion genera el documento definitivo ETB
 * @fecha 2018-06-08
 */
I007Controller.prototype.crearDocumento = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId;
    var nombreTercero = args.nombreTercero;
    var prestamo = args.prestamo;
    var valorTotal = "0";
    var parametros = {};
    if (args.docTmpId === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }
    if (args.usuario_id === '') {
        usuarioId = req.session.user.usuario_id;
    } else {
        usuarioId = args.usuario_id;
    }

    var docTmpId = args.docTmpId;
    var cabecera = [];
    G.knex.transaction(function (transaccion) {
        G.Q.nfcall(that.m_movimientos_bodegas.crear_documento, docTmpId, usuarioId, transaccion).then(function (result) {

            parametros.empresaId = result.empresa_id;
            parametros.prefijoDocumento = result.prefijo_documento;
            parametros.numeracionDocumento = result.numeracion_documento;
            parametros.tipo_id_tercero = args.tipo_id_tercero;
            parametros.tercero_id = args.tercero_id;
            parametros.tipo_prestamo_id = args.prestamo_id;
            parametros.tipo_movimiento = 'I';
            parametros.docTmpId = args.docTmpId;
            parametros.usuario_id = usuarioId;
            parametros.usuarioId = usuarioId;
            return G.Q.nfcall(that.m_i007.agregarMovimientoPrestamo, parametros, transaccion);
        }).then(function () {
            return G.Q.nfcall(that.m_i007.eliminarPrestamoTemporal, parametros, transaccion);
        }).then(function (result) {
            if (result >= 1) {
                return G.Q.nfcall(that.m_i007.eliminarDocumentoTemporal_d, parametros, transaccion);
            } else {
                throw 'eliminarPrestamoTemporal Fallo';
            }

        }).then(function (result) {

            if (result >= 1) {
                return G.Q.nfcall(that.m_i007.eliminarDocumentoTemporal, parametros, transaccion);
            } else {
                throw 'eliminar_documento_temporal_d Fallo';
            }

        }).then(function (result) {

            if (result >= 1) {
                transaccion.commit();
                return false;
            } else {
                throw ' Fallo ';
            }

        }).fail(function (err) {

            console.log("Error rollback ", err);
            transaccion.rollback(err);
        }).done();
    }).then(function () {
        return G.Q.nfcall(that.m_movimientos_bodegas.getDoc, parametros);
    }).then(function (resultado) {
        cabecera = resultado;
        valorTotal = parseFloat(cabecera[0].total_costo).toFixed(2);
        if (resultado.length > 0) {
            return G.Q.nfcall(that.m_i007.consultar_detalle_documento, parametros);
        } else {
            throw 'Consulta sin resultados';
        }

    }).then(function (resultado) {

        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.usuario_id + ' - ' + req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};
        if (resultado.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            cabecera[0].tercero = parametros.tipo_id_tercero + " " + parametros.tercero_id + " : " + nombreTercero;
            cabecera[0].prestamo = "(" + parametros.tipo_prestamo_id + ") " + prestamo;
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: resultado,
                impresion: impresion,
                valorTotal: valorTotal,
                archivoHtml: 'documentoI007.html',
                reporte: "documentoI007"}, function (nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
            });
        } else {
            throw 'Consulta consultar_detalle_documento sin resultados';
        }

    }).catch(function (err) {
        console.log("crearDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el Documento', 500, {err: err}));
    }).done();
};

// imprime el documento desde buscador de documentos
I007Controller.prototype.crearHtmlDocumento = function (req, res) {
    var that = this;
    var args = req.body.data;
    var nombreTercero = "";
    var prestamo = "";
    var valorTotal = '0';
    var cabecera = [];
    var detallea = [];
    if (args.empresaId === '' || args.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'El empresa_id esta vacío', 404, {}));
        return;
    }
    if (args.prefijo === '' || args.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo esta vacío', 404, {}));
        return;
    }
    if (args.numeracion === '' || args.numeracion === undefined) {
        res.send(G.utils.r(req.url, 'El numeracion esta vacío', 404, {}));
        return;
    }

    var parametros = {
        empresaId: args.empresaId,
        empresa_id: args.empresaId,
        prefijoDocumento: args.prefijo,
        numeracionDocumento: args.numeracion,
        tipo_id_tercero: args.tipoTercero,
        tercero_id: args.terceroId,
        tipoprestamo: args.tipo_prestamo_id,
        id: args.terceroId,
        tipoId: args.tipoTercero
    };
    try {
        var nomb_pdf = "documentoI007" + parametros.prefijoDocumento + parametros.numeracionDocumento + ".html";
        if (G.fs.readFileSync("public/reports/" + nomb_pdf)) {
            res.send(G.utils.r(req.url, 'SE HA ENCONTRADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nomb_pdf, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento}));
            return;
        }
    } catch (e) {
        console.log("NO EXISTE ARCHIVO  ");
    }

    G.Q.nfcall(that.m_movimientos_bodegas.getDoc, parametros).then(function (result) {
        cabecera = result;
        if (result.length > 0) {

            valorTotal = parseFloat(cabecera[0].total_costo).toFixed(2);
            
            return G.Q.nfcall(that.m_i007.consultar_detalle_documento, parametros);
        } else {
            throw 'Consulta getDoc sin resultados';
        }
    }).then(function (resultado) {
        detallea = resultado;
        return G.Q.nfcall(that.m_i007.listarTerceroId, parametros);
    }).then(function (resultado) {

        if (resultado.length > 0) {

            nombreTercero = resultado[0].nombre_tercero;
        }
        return G.Q.nfcall(that.m_i007.listarPrestamoId, parametros);
    }).then(function (resultado) {

        if (resultado.length > 0) {

            prestamo = resultado[0].descripcion;
        }

        var fecha = new Date();
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        var usuario = req.session.user.usuario_id + ' - ' + req.session.user.nombre_usuario;
        var impresion = {usuarioId: usuario, formatoFecha: formatoFecha};
        if (detallea.length > 0) {

            cabecera[0].fecha_registro = cabecera[0].fecha_registro.toFormat('DD/MM/YYYY HH24:MI:SS');
            cabecera[0].tercero = parametros.tipo_id_tercero + " " + parametros.tercero_id + " : " + nombreTercero;
            cabecera[0].prestamo = "(" + parametros.tipoprestamo + ") " + prestamo;
            __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                cabecerae: cabecera[0],
                detalle: detallea,
                impresion: impresion,
                valorTotal: valorTotal,
                archivoHtml: 'documentoI007.html',
                reporte: "documentoI007"}, function (nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf, prefijo: cabecera[0].prefijo, numero: cabecera[0].numero}));
            });
        } else {
            throw 'Consulta consultar_detalle_documento sin resultados';
        }

    }).catch(function (err) {
        console.log("crearDocumento>>>>", err);
        res.send(G.utils.r(req.url, 'Error al Crear el Documento', 500, {err: err}));
    }).done();
};

/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

function __generarPdf(datos, callback) {
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/reportes/' + datos.archivoHtml, 'utf8'),
            helpers: G.fs.readFileSync('app_modules/MovimientosBodega/I007/reports/javascripts/rotulos.js', 'utf8'),
            recipe: "html",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function (err, response) {

        response.body(function (body) {
            var fecha = new Date();
            var nombreTmp = datos.reporte + datos.cabecerae.prefijo + datos.cabecerae.numero + ".html";
            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                if (err) {
                    console.log("err [__generarPdf]: ", err);
                    callback(true, err);
                    return;
                } else {

                    callback(nombreTmp);
                    return;
                }
            });
        });
    });
}
;

I007Controller.$inject = ["m_movimientos_bodegas", "m_i007"];
module.exports = I007Controller;
