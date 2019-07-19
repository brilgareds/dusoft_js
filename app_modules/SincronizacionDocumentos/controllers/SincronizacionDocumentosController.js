let that;

let SincronizacionDocumentos = function (sincronizacion, m_notas, m_facturacion_clientes, m_facturacion_proveedores, m_caja_general, m_movimientos_bodegas) {
    this.m_SincronizacionDoc = sincronizacion;
    this.m_notas = m_notas;
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.m_facturacion_proveedores = m_facturacion_proveedores;
    this.m_caja_general = m_caja_general;
    this.m_movimientos_bodegas = m_movimientos_bodegas;
    that = this;
};

SincronizacionDocumentos.prototype.buscarServicio = (req, res) => {
    let args = req.body.data;
    args.empresaId = req.body.session.empresaId;
    args.centroId = req.body.session.centroUtilidad;
    args.bodegaId = req.body.session.bodega;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'buscarServicio', args)
        .then(servicio => {
            res.send(G.utils.r(req.url, 'Listado de Prefijos!!!!', 200, {servicio: servicio}));
        }).fail(err => {
            res.send(G.utils.r(req.url, 'Error Listando Prefijos', 500, {servicio: false}));
        }).done();
};

SincronizacionDocumentos.prototype.listarPrefijos = (req, res) => {
    let obj = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarPrefijos', obj)
        .then(prefijos => {
            res.send(G.utils.r(req.url, 'Listado de Prefijos!', 200, {listarPrefijos: prefijos}));
        }).fail(err => {
            res.send(G.utils.r(req.url, 'Error Listando Prefijos', 500, err));
        }).done();
};

SincronizacionDocumentos.prototype.listarPrefijosEspecial = (req, res) => {
    let args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarPrefijosEspecial', args.data)
        .then(prefijos => {
            res.send(G.utils.r(req.url, 'Listado de Prefijos Especiales!!!!', 200, {listarPrefijos: prefijos}));
        }).fail(err => {
            res.send(G.utils.r(req.url, 'Error Listando Prefijos Especiales', 500, {listarPrefijos: {}}));
        }).done();
};

SincronizacionDocumentos.prototype.listarTipoCuentaCategoria = (req, res) => {
    let args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarTipoCuentaCategoria', args)
        .then(tipoCuentascategoria => {
            res.send(G.utils.r(req.url, 'Listado de TiposCuentas!!!!', 200, {listarTipoCuentaCategoria: tipoCuentascategoria}));
        }).fail(err => {
            res.send(G.utils.r(req.url, 'Error Listado de TiposCuentas', 500, {listarTipoCuentaCategoria: {}}));
        }).done();
};

SincronizacionDocumentos.prototype.listarDocumentosCuentas = (req, res) => {
    let args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarDocumentosCuentas', args)
        .then(listarDocumentosCuentas => {
            res.send(G.utils.r(req.url, 'Listado de TiposCuentas!!!!', 200, {listarDocumentosCuentas: listarDocumentosCuentas}));
        }).fail(err => {
            res.send(G.utils.r(req.url, 'Error Listado de listarDocumentosCuentas', 500, {listarDocumentosCuentas: {}}));
        }).done();
};

SincronizacionDocumentos.prototype.insertTiposCuentas = (req, res) => {
    let obj = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'insertTiposCuentas', obj)
        .then(tiposCuentas => {
            if (tiposCuentas[0] === 'repetido') {
                res.send(G.utils.r(req.url, 'Error: esos valores ya existen en la base de datos!!"', 500, {}));
            } else {
                res.send(G.utils.r(req.url, 'Cuenta creada satisfactoriamente!', 200, tiposCuentas));
            }
        }).fail(err => {
            if (!err.status) { err.status = 500; }
            if (!err.msg) { err.msg = 'Error antes de crear la cuenta!!'; }

            res.send(G.utils.r(req.url, err.msg, err.status, err));
        }).done();
};

SincronizacionDocumentos.prototype.listarTiposCuentas = (req, res) => {
    let args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarTiposCuentas', args)
        .then(entries => {
            res.send(G.utils.r(req.url, 'Listado de TiposCuentas!!!!', 200, {entries: entries}));
        }).fail(err => {
            if (!err.status) { err.status = 500; }
            if (!err.msg) { err.msg = 'Error Listado de TiposCuentas'; }

            res.send(G.utils.r(req.url, err.msg, err.status, err));
        }).done();
};

SincronizacionDocumentos.prototype.insertDocumentosCuentas = (req, res) => {
    let args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'insertDocumentosCuentas', args)
        .then(tiposCuentas => {
            res.send(G.utils.r(req.url, 'insertDocumentosCuentas!!!!', 200, {insertTiposCuentas: true}));
        }).fail(err => {
            res.send(G.utils.r(req.url, 'Error insertDocumentosCuentas', 500, {insertTiposCuentas: false}));
        }).done();
};

SincronizacionDocumentos.prototype.listarTiposServicios = (req, res) => {
    let args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarTiposServicios', args)
        .then(listarTiposServicios => {
            res.send(G.utils.r(req.url, 'listarTiposServicios!', 200, {listarTiposServicios: listarTiposServicios}));
        }).fail(err => {
            res.send(G.utils.r(req.url, 'Error listarTiposServicios', 500, {listarTiposServicios: false}));
        }).done();
};

SincronizacionDocumentos.prototype.guardarCuentas = (req, res) => {
    let args = req.body;
    var categorias = args.data.tipesEntries;
    categorias.debito = args.data.debito;
    categorias.credito = args.data.credito;
    console.log('categorias: ', categorias);

    var cuentas = {};
    var error_count = 0;
    var sw_cuenta = 0;

    for (var tipo_cuenta in categorias) {
        for (var index in categorias[tipo_cuenta]) {
            if (categorias[tipo_cuenta][index] && typeof categorias[tipo_cuenta][index] === 'object') {
                if (tipo_cuenta === 'debito') {
                    sw_cuenta = 0;
                } else if (tipo_cuenta === 'credito') {
                    sw_cuenta = 1;
                }
                cuentas = categorias[tipo_cuenta][index];
                cuentas.sw_cuenta = sw_cuenta;
                cuentas.tipo_cuenta = tipo_cuenta;
                cuentas.empresa_id = args.session.empresaId;
                cuentas.centro_id = args.session.centroUtilidad;
                cuentas.bodega_id = args.session.bodega;
                // cuentas.prefijo_id = categorias.prefijo_id;

                G.Q.ninvoke(that.m_SincronizacionDoc, 'guardarCuentas', cuentas)
                    .then(function (resultado) {

                    }).fail(function (err) {
                        console.log(err);
                        error_count++;
                    });
            }
        }
    }
    if (error_count > 0) {
        res.send(G.utils.r(req.url, 'Error guardarCuentas', 500, {status: false}));
    } else {
        res.send(G.utils.r(req.url, 'La actualización de cuentas fue exitosa!', 200, {status: true}));
    }
};

SincronizacionDocumentos.prototype.insertTiposCuentasCategorias = (req, res) => {
    
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc, 'insertTiposCuentasCategorias', args)
        .then(function (tiposCuentasCategorias) {
        res.send(G.utils.r(req.url, 'insertTiposCuentasCategorias!!!!', 200, {insertTiposCuentasCategorias: true}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error insertTiposCuentasCategorias', 500, {insertTiposCuentasCategorias: false}));
    }).done();
};


SincronizacionDocumentos.prototype.sincronizarDocumentos = (req, res) => {
    let args = req.body.data;
    let param = [];
    let url;
    let sincronizar = args.data.sincronizar;
    let servicio = args.data.servicio;
    let funcion_ws = '';
    let funcionServicio = '';
    let servicioContable = 'crearInformacionContable';
    let servicioCuentasPorPagar = 'crearCuentaxPagar';
    let prefijo_fi = '';

    let obj = {
        wsFi: servicio,
        parametrizacion: servicio,
        facturaFiscal: args.data.facturaFiscal,
        factura_fiscal: args.data.facturaFiscal,
        empresaId: req.session.user.empresa,
        empresa_id: req.session.user.empresa,
        centro: req.session.user.centro_utilidad,
        centroId: req.session.user.centro_utilidad,
        bodega: req.session.user.bodega,
        bodegaId: req.session.user.bodega,
        prefijo: args.data.prefijo,
        prefijoFI: '',
        tipoLogsWs: '',
        prefijoId: args.data.prefijo,
        usuarioId: req.session.user.usuario_id,
        fechaActual: fechaActual(),
        codigoProveedor: args.data.codigoProveedor
    };

    if (req.session.user.bodega === '03') {
        url = G.constants.WS().FINANCIERO.DUANA;
    } else if (req.session.user.bodega === '06') {
        url = G.constants.WS().FINANCIERO.COSMITET;
    } else {
        res.send(G.utils.r(req.url,
            "No se encuentra creado url para esta bodega: " + req.session.user.bodega,
            '500',
            { sincronizacionDocumentos: false,
            error: ''
        }));
    }

    switch (servicio) {
        case 1:
            funcion_ws = __facturasVentaFi;
            funcionServicio = servicioContable;
            obj.tipoLogsWs = 'Clientes';
            break;
        case 2:
            funcion_ws = __facturasTalonarioFi;
            funcionServicio = servicioContable;
            obj.tipoLogsWs = 'Clientes';
            break;
        case 3:
            funcion_ws = __notasCreditoClientesFi;
            funcionServicio = servicioContable;
            obj.tipoLogsWs = 'Clientes';
            break;
        case 4:
            funcion_ws = __notasDebitoClientesFi;
            funcionServicio = servicioContable;
            obj.tipoLogsWs = 'Clientes';
            break;
        case 5:
            funcion_ws = __notasProveedor;
            obj.tipoLogsWs = 'Proveedores';
            break;
        case 6:
            funcion_ws = __ingresoBonificaciones;
            funcionServicio = servicioContable;
            obj.tipoLogsWs = 'Bonificaciones';
            break;
        case 7:
            funcion_ws = __enviarReciboRCC;
            funcionServicio = servicioContable;
            obj.tipoLogsWs = 'Recibos';
            break;
        case 8:
            funcion_ws = __enviarReciboRCD;
            funcionServicio = servicioContable;
            obj.tipoLogsWs = 'Recibos';
            break;
        case 9:
            funcion_ws = __cuentasPorPagar;
            funcionServicio = servicioCuentasPorPagar;
            obj.tipoLogsWs = 'Proveedores';
            break;
        case 10:
            funcion_ws = __ajustes;
            obj.tablaLogs = '';
            break;
        default:
            break;
    }

    G.Q.nfcall(funcion_ws, obj, that)
        .then(result => {
            param = result;
            // console.log('URL: ', url);
            //console.log('Sincronizar es: ', sincronizar);
            if (false) {
            //if (sincronizar === 1) {
                let objSincronizar = {
                    url: url,
                    funcion: funcionServicio,
                    parametros: param
                };

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'sincronizarFinaciero', objSincronizar);
            } else {
                return true;
            }
        })
        .then(result => {
            if (sincronizar === 1) {
                obj.result = result;
                obj.mensaje = result.descripcion;
                if (result.estado) {
                    obj.estado = 1;
                } else {
                    obj.estado = 0;
                }
                return G.Q.ninvoke(that.m_SincronizacionDoc, 'insertLogsWs', obj);
            } else {
                return true;
            }
        })
        .then(result => {
            res.send(G.utils.r(req.url,
                'sincronizacionDocumentos!!!!',
                200,
                { sincronizacionDocumentos: true, result: obj.result, asientosContables: param }
            ));
        }).fail(err => {
            /*
             if (err.mensaje !== undefined) {
             res.send(G.utils.r(req.url, err.respuesta.error.mensaje, err.respuesta.error.status, {sincronizacionDocumentos: false, error: err.err}));
             } else {
             res.send(G.utils.r(req.url, err.mensaje, err.status, {sincronizacionDocumentos: false, error: err.err}));
             }
             */
            res.send(G.utils.r(req.url, err.mensaje, err.status, {sincronizacionDocumentos: false, error: err.err}));
        }).done();
};

const __notasProveedor = (obj, that, callback) => {
    let nota;
    let notas;
    let parametro = {};
    let encabezado;
    let empuestos;
    let prefijo;
    let proveedor;
    let movimiento;
    let totalesFactura;
    let facturasProveedoresDetalle;
    let today = new Date();
    let formato = '';
    let fechaToday = '';
    let param = {};
    obj.numero = obj.factura_fiscal;

    G.Q.ninvoke(that.m_notas, 'consultarNotasFacturaProveedor', obj)
        .then(result => {
            if (result.length > 0) {
                notas = result;
                nota = result[0];

                return G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', nota);
                //return G.Q.ninvoke(that.m_movimientos_bodegas, 'consultar_detalle_documento_despacho',obj.factura_fiscal,obj.prefijo, obj.empresa_id);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Nota Factura Proveedor'};
            }
        }).then(result => {
            if (result.length > 0) {
                empuestos = result;

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'obtenerPrefijoFi', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de los impuestos'};
            }
        }).then(result => {
            if (result.length > 0) {
                prefijo = result;

                return G.Q.ninvoke(that.m_facturacion_proveedores, 'consultarTerceroProveedor', nota);
            } else {
                prefijo = 'AEEERTYDFSDFSDFUY';
                return G.Q.ninvoke(that.m_facturacion_proveedores, 'consultarTerceroProveedor', nota);
            }
        }).then(result => {
            if (result.length > 0) {
                proveedor = result[0];
                obj.parametrizacion = obj.wsFi;

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'parametrizacionCabeceraFi', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el proveedor'};
            }
        }).then(result => {
            if (result.length > 0) {
                formato = 'DD-MM-YYYY';
                fechaToday = G.moment(today).format(formato);

                parametro.codempresa = result[0].codempresa;
                parametro.coddocumento = prefijo[0].prefijo_fi;
                parametro.coddocumentoencabezado = prefijo[0].prefijo_fi;//verificar si puede ir
                parametro.fecharegistroencabezado = nota.fecha_nota;//verificar si puede ir
                parametro.numerofactura = nota.numero_factura;
                parametro.identerceroencabezado = proveedor.tercero_id;
                parametro.cuentaterceroencabezado = proveedor.cxp_proveedor;
                parametro.estadoencabezado = result[0].estadoencabezado;
                parametro.fecharegistro = nota.fecha_nota;
                parametro.fecharadicacion = fechaToday;
                parametro.numeroradicacion = result[0].numeroradicacion;
                parametro.plazotercero = result[0].plazotercero;
                parametro.usuariocreacion = obj.usuarioId;
                parametro.numerodocumentoencabezado = obj.factura_fiscal;
                encabezado = parametro;

                if (obj.prefijo === 'NDD') {
                    parametro.observacionencabezado = "NOTA DEBITO PROVEEDOR";
                } else if (obj.prefijo === 'NCD') {
                    parametro.observacionencabezado = "NOTA CREDITO PROVEEDOR";
                }
                // return G.Q.ninvoke(that.m_movimientos_bodegas, 'consultar_detalle_documento_despacho',obj.factura_fiscal,obj.prefijo, obj.empresa_id);
                return G.Q.ninvoke(that.m_notas, 'detalleNotasFacturaProveedor', obj);
            } else {
                throw {
                    error: 1,
                    status: 404,
                    mensaje: 'Se produjo un error al consultar la parametrizacion de la cabecera'
                };
            }
        }).then(result => {
            if (result.length > 0) {
                facturasProveedoresDetalle = result;
                let separacion = {
                    medicamentosGravados: 0,
                    costoMedicamentosGravados: 0,
                    medicamentosNoGravados: 0,
                    costoMedicamentosNoGravados: 0,
                    insumosGravados: 0,
                    costoInsumosGravados: 0,
                    insumosNoGravados: 0,
                    costoInsumosNoGravados: 0,
                    porc_iva: 0,
                    subtotal: 0,
                    iva: 0,
                    total: 0
                };
                return G.Q.nfcall(__SeparacionMedicamentosInsumos, facturasProveedoresDetalle, 0, separacion);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al consultar  detalle documento despacho'};
            }
        }).then(result => {
            if (result !== undefined) {
                totalesFactura = result;

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarCuentasDetalle', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los totales'};
            }
        }).then(result => {
            if (result.length > 0) {
                empuestos.retencion_ica = 0;
                empuestos.retencion_fuente = 0;
                empuestos.impusto_cree = 0;
                totalesFactura.identercero = proveedor.tercero_id;
                totalesFactura.cuenta = proveedor.cxp_proveedor;
                notas[0].cuenta_contable = proveedor.cxp_proveedor;

                return G.Q.nfcall(__EncabezadoFacturaDetalle, result, totalesFactura, [], 0, notas, empuestos);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al consultar las cuentas de la factura'};
            }
        }).then(result => {
            if (result !== undefined > 0) {
                param = {'encabezado': encabezado, 'detalle': result};

                callback(false, param);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los asientos contables'};
            }
        }).fail(err => {
            let mensaje = {};
            if (err.error !== undefined) {
                mensaje.status = err.status;
                mensaje.mensaje = err.mensaje;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            } else {
                mensaje.mensaje = 'Error sincronizacionDocumentos';
                mensaje.status = 500;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            }

            callback(mensaje);
        }).done();
};

const __cuentasPorPagar = (obj, that, callback) => {
    let parametro = {};
    let facturasProveedores;
    let facturasProveedoresDetalle;
    let contrato;
    let prefijo;
    let empuestos;
    let encabezado;
    let totalesFactura;
    let today = new Date();
    let formato = '';
    let fechaToday = '';

    G.Q.ninvoke(that.m_facturacion_proveedores, 'facturaProveedorCabecera', obj)
        .then(result => {
            if (result !== undefined && result.length > 0) {
                facturasProveedores = result;
                if (result[0].anio_factura !== undefined) {
                    obj.anio = result[0].anio_factura;
                }

                return G.Q.ninvoke(that.m_facturacion_proveedores, 'consultarFacturaProveedorDetalle', facturasProveedores[0]);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Factura'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                facturasProveedoresDetalle = result;

                return G.Q.ninvoke(that.m_facturacion_proveedores, 'consultarTerceroProveedor', facturasProveedores[0]);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el Detalle de la Factura'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                contrato = result;
                contrato[0].porcentaje_rtf = facturasProveedores[0].porcentajertf;
                contrato[0].porcentaje_ica = facturasProveedores[0].porcentajeica;
    //            contrato[0].porcentaje_rtf = facturasProveedores[0].porcentajereteiva;
                return G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se econtro el tercero proveedor'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                empuestos = result;
                obj.prefijo = facturasProveedoresDetalle[0].prefijo;
                return G.Q.ninvoke(that.m_SincronizacionDoc, 'obtenerPrefijoFi', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de los impuestos'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                prefijo = result;
                parametro.usuarioId = obj.usuario;
                parametro.prefijo = prefijo[0].prefijo_fi;
                obj.parametrizacion = obj.wsFi;
                return G.Q.ninvoke(that.m_SincronizacionDoc, 'parametrizacionCabeceraFi', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el prefijo de FI'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                formato = 'DD-MM-YYYY';
                fechaToday = G.moment(today).format(formato);
                parametro.facturaFiscal = facturasProveedores[0].numero_factura;
                parametro.terceroId = contrato[0].tercero_id;//cxp_proveedor
                parametro.cuentaterceroencabezado = contrato[0].cxp_proveedor;
                parametro.parametrizacionCabeceraFi = result[0].parametrizacionCabeceraFi;
                parametro.nombre = result[0].nombre;
                parametro.estadoencabezado = result[0].estadoencabezado;
                parametro.tipotercero = result[0].tipotercero;
                parametro.plazotercero = result[0].plazotercero;
                parametro.numeroradicacion = result[0].numeroradicacion;
                parametro.codempresa = result[0].codempresa;
                parametro.coddocumentoencabezado = result[0].coddocumentoencabezado;
                parametro.observaciones = facturasProveedores[0].observaciones;
                parametro.fechaFactura = fechaToday;
                parametro.fecharadicacion = fechaToday;

                return G.Q.nfcall(__JsonFacturaEncabezadoCliente, parametro);
            } else {
                throw {
                    error: 1,
                    status: 404,
                    mensaje: 'Se produjo un error al consultar la parametrizacion de la cabecera'
                };
            } // coddocumento
        }).then(result => {
            if (result !== undefined) {
                encabezado = result;
                //identerceroencabezado
                let separacion = {
                    medicamentosGravados: 0,
                    costoMedicamentosGravados: 0,
                    medicamentosNoGravados: 0,
                    costoMedicamentosNoGravados: 0,
                    insumosGravados: 0,
                    costoInsumosGravados: 0,
                    insumosNoGravados: 0,
                    costoInsumosNoGravados: 0,
                    porc_iva: 0,
                    subtotal: 0,
                    iva: 0,
                    total: 0
                };
                return G.Q.nfcall(__SeparacionMedicamentosInsumos, facturasProveedoresDetalle, 0, separacion);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear la cabecera'};
            }
        }).then(result => {
            if (result !== undefined) {
                totalesFactura = result;

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarCuentasDetalle', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los totales'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                empuestos.retencion_ica = 0;
                empuestos.retencion_fuente = 0;
                empuestos.impusto_cree = 0;
                totalesFactura.identercero = contrato[0].tercero_id;
                totalesFactura.cuenta = contrato[0].cuenta_contable;

                return G.Q.nfcall(__EncabezadoFacturaDetalle, result, totalesFactura, [], 0, contrato, empuestos);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al consultar las cuentas de la factura'};
            }
        }).then(result => {
            if (result !== undefined > 0) {
                param = {'encabezado': encabezado, 'detalle': result};
                callback(false, param);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los asientos contables'};
            }
        }).fail(err => {
            let mensaje = {};
            if (err.error !== undefined) {
                mensaje.status = err.status;
                mensaje.mensaje = err.mensaje;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            } else {
                mensaje.mensaje = 'Error sincronizacionDocumentos';
                mensaje.status = 500;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            }

            callback(mensaje);
        }).done();
};

const __notasDebitoClientesFi = (obj, that, callback) => {
    let notaDebito = [];
    let parametro = {};
    let contrato = [];
    let encabezado;
    let cuenta;
    let detalle;
    let detalleProductos;
    let totalesFactura;
    let tabla_1 = '';
    let tabla_2 = '';
    let tabla_3 = '';
    let tabla_4 = '';
    let empuestos = [];

    let param = {
        numero: obj.facturaFiscal,
        prefijo: obj.prefijo
    };

    G.Q.ninvoke(that.m_notas, 'ConsultarNotasDebito', param)
        .then(result => {
            if (result !== undefined && result.length > 0) {
                notaDebito = result;
                obj.terceroId = notaDebito[0].tercero_id;
                obj.tipoIdTercero = notaDebito[0].tipo_id_tercero;
                obj.anio = notaDebito[0].anio_factura;
                parametro.fechaFactura = notaDebito[0].fecha_registro_nota;

                let parametros = {
                    numeroNota: obj.facturaFiscal
                };

                if (notaDebito[0].tipo_factura === 0) {
                    tabla_1 = "notas_debito_despachos_clientes";
                    tabla_2 = "inv_facturas_despacho";
                    tabla_3 = "detalles_notas_debito_despachos_clientes";
                    tabla_4 = "inv_facturas_despacho_d";
                }

                if (notaDebito[0].tipo_factura === 1) {
                    tabla_1 = "notas_debito_despachos_clientes_agrupados";
                    tabla_2 = "inv_facturas_agrupadas_despacho";
                    tabla_3 = "detalles_notas_debito_despachos_clientes_agrupados";
                    tabla_4 = "inv_facturas_agrupadas_despacho_d";
                }
                parametros.tabla_1 = tabla_1;
                parametros.tabla_2 = tabla_2;
                parametros.tabla_3 = tabla_3;
                parametros.tabla_4 = tabla_4;

                return G.Q.ninvoke(that.m_notas, 'clienteNota', parametros);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Consulta NotasDebito'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                contrato = result;

                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el clienteNota'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                cuenta = result;
                let consult = {
                    factura_fiscal: notaDebito[0].factura_fiscal,
                    prefijo: notaDebito[0].prefijo,
                    empresa_id: obj.empresaId
                };

                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultaDetalleFacturaGenerada', consult, 1);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el contrato'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                detalleProductos = result;

                return G.Q.nfcall(__subTotalFactura, result, 0, 0);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el consultaDetalleFacturaGenerada'};
            }
        }).then(result => {
            if (result > 0) {
                detalle = result;

                return G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el detalle'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                empuestos = result;
                obj.parametrizacion = obj.wsFi;

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'parametrizacionCabeceraFi', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'Error al generar los impuestos'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                parametro.prefijo = obj.prefijo;
                parametro.facturaFiscal = obj.facturaFiscal;
                parametro.terceroId = notaDebito[0].tercero_id;
                parametro.estadoencabezado = result[0].estadoencabezado;
                parametro.tipotercero = result[0].tipotercero;
                parametro.codempresa = result[0].codempresa;
                parametro.coddocumentoencabezado = result[0].coddocumentoencabezado;
                parametro.observaciones = "Factura " + obj.prefijo + " #" + obj.facturaFiscal;

                return G.Q.nfcall(__JsonFacturaEncabezado, parametro);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de la cabecera'};
            }
        }).then(result => {
            if (result !== undefined) {
                encabezado = result;
                let paramet = {
                    empresaId: obj.empresaId,
                    empresa_id: obj.empresaId,
                    numero: obj.facturaFiscal,
                    numeroNota: obj.facturaFiscal,
                    nombreNota: 'CREDITO'
                };

                if (notaDebito[0].tipo_factura === 0) {
                    tabla_1 = "notas_debito_despachos_clientes";
                    tabla_2 = "inv_facturas_despacho";
                    tabla_3 = "detalles_notas_debito_despachos_clientes";
                    tabla_4 = "inv_facturas_despacho_d";
                }
                if (notaDebito[0].tipo_factura === 1) {
                    tabla_1 = "notas_debito_despachos_clientes_agrupados";
                    tabla_2 = "inv_facturas_agrupadas_despacho";
                    tabla_3 = "detalles_notas_debito_despachos_clientes_agrupados";
                    tabla_4 = "inv_facturas_agrupadas_despacho_d";
                }
                paramet.tabla_1 = tabla_1;
                paramet.tabla_2 = tabla_2;
                paramet.tabla_3 = tabla_3;
                paramet.tabla_4 = tabla_4;

                return G.Q.ninvoke(that.m_notas, 'consultarProductosNotasDebito', paramet);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear la cabecera'};
            }
        }).then(result => {
            if (result !== undefined) {
                let separacion = {
                    medicamentosGravados: 0,
                    costoMedicamentosGravados: 0,
                    medicamentosNoGravados: 0,
                    costoMedicamentosNoGravados: 0,
                    insumosGravados: 0,
                    costoInsumosGravados: 0,
                    insumosNoGravados: 0,
                    costoInsumosNoGravados: 0,
                    porc_iva: 0,
                    subtotal: 0,
                    iva: 0,
                    total: 0
                };

                return G.Q.nfcall(__SeparacionMedicamentosInsumos, result, 0, separacion);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error ConsultarDetalleFacturaCredito'};
            }
        }).then(result => {
            if (result !== undefined) {
                totalesFactura = result;
                return G.Q.nfcall(__impuestos, empuestos, detalle, contrato, totalesFactura);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los totales'};
            }
        }).then(result => {
            if (result !== undefined) {
                totalesFactura.total = totalesFactura.total + totalesFactura.iva - result.retencion_ica - result.retencion_fuente;
                totalesFactura.medicamentosNoGravados = totalesFactura.total;
                if (totalesFactura.total === 0) {
                    totalesFactura.total = detalle - result.retencion_ica - result.retencion_fuente;
                    totalesFactura.medicamentosNoGravados = detalle - result.retencion_ica - result.retencion_fuente;
                }

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarCuentasDetalle', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los totales'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                empuestos.retencion_ica = 0;
                empuestos.retencion_fuente = 0;
                empuestos.impusto_cree = 0;
                totalesFactura.identercero = notaDebito[0].tercero_id;
                totalesFactura.naturaleza = notaDebito[0].naturaleza;
                totalesFactura.cuentaNaturaleza = notaDebito[0].cuenta;
                totalesFactura.cuenta = cuenta[0].cuenta_contable;
                contrato[0].cuenta_contable = cuenta[0].cuenta_contable;

                return G.Q.nfcall(__EncabezadoFacturaDetalle, result, totalesFactura, [], 0, contrato, empuestos);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al consultar las cuentas de la factura'};
            }
        }).then(result => {
            param = {'encabezado': encabezado, 'detalle': result};

            callback(false, param);
        }).fail(function (err) {
            let mensaje = {
                mensaje: 'Error sincronizacionDocumentos',
                status: 500,
                respuesta: {sincronizacionDocumentos: false, error: err}
            };

            callback(mensaje);
        }).done();
};

function __impuestos(empuestos, totalesFactura, contrato, total, callback) {
    var parmetro = {
        retencion_fuente: 0,
        retencion_ica: 0
    };
    if (empuestos[0].sw_rtf === '2' || empuestos[0].sw_rtf === '3') {
        if (totalesFactura >= parseInt(empuestos[0].base_rtf)) {
            parmetro.retencion_fuente = parseInt(total.total * (contrato[0].porcentaje_rtf / 100));
        }
    }

    empuestos.retencion_ica = 0;
    if (empuestos[0].sw_ica === '2' || empuestos[0].sw_ica === '3') {
        if (totalesFactura >= empuestos[0].base_ica) {
            parmetro.retencion_ica = parseInt(total.total * (contrato[0].porcentaje_ica / 1000));
        }
    }

    callback(false, parmetro);
}

const __notasCreditoClientesFi = (obj, that, callback) => {
    let notaCredito = [];
    let parametro = {};
    let contrato = [];
    let encabezado;
    let detalle;
    let totalesFactura;
    let empuestos = [];
    let tabla_1 = '';
    let tabla_2 = '';
    let tabla_3 = '';
    let tabla_4 = '';

    let param = {
        numero: obj.facturaFiscal,
        prefijo: obj.prefijo
    };

    G.Q.ninvoke(that.m_notas, 'ConsultarNotasCredito', param)
        .then(result => {
            if (result !== undefined && result.length > 0) {
                notaCredito = result;
                obj.terceroId = notaCredito[0].tercero_id;
                obj.tipoIdTercero = notaCredito[0].tipo_id_tercero;
                obj.anio = notaCredito[0].anio_factura;
                parametro.fechaFactura = notaCredito[0].fecha_registro_nota;

                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Factura'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                contrato = result;
                let consult = {
                    factura_fiscal: notaCredito[0].factura_fiscal,
                    prefijo: notaCredito[0].prefijo,
                    empresa_id: obj.empresaId
                };

                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultaDetalleFacturaGenerada', consult, 1);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el contrato'};
            }
        }).then(result => {
            return G.Q.nfcall(__subTotalFactura, result, 0, 0);
        }).then(result => {
            if (result !== undefined && result > 0) {
                detalle = result;

                return G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el detalle'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                empuestos = result;
                obj.parametrizacion = obj.wsFi;
                return G.Q.ninvoke(that.m_SincronizacionDoc, 'parametrizacionCabeceraFi', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Parametrizacion'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                parametro.prefijo = obj.prefijo;
                parametro.facturaFiscal = obj.facturaFiscal;
                parametro.terceroId = notaCredito[0].tercero_id;
                parametro.estadoencabezado = result[0].estadoencabezado;
                parametro.tipotercero = result[0].tipotercero;
                parametro.codempresa = result[0].codempresa;
                parametro.coddocumentoencabezado = result[0].coddocumentoencabezado;
                parametro.observaciones = "Factura " + obj.prefijo + " #" + obj.facturaFiscal;

                return G.Q.nfcall(__JsonFacturaEncabezado, parametro);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de la cabecera'};
            }
        }).then(result => {
            if (result !== undefined) {
                encabezado = result;

                if (notaCredito[0].concepto_id === 1) {
                    var paramet = {
                        empresaId: obj.empresaId,
                        empresa_id: obj.empresaId,
                        numero: obj.facturaFiscal,
                        numeroNota: obj.facturaFiscal
                    };
                    paramet.nombreNota = "CREDITO";

                    if (notaCredito[0].tipo_factura === 0) {
                        tabla_1 = "notas_credito_despachos_clientes";
                        tabla_2 = "inv_facturas_despacho";
                        tabla_3 = "detalles_notas_credito_despachos_clientes";
                        tabla_4 = "inv_facturas_despacho_d";
                    }
                    if (notaCredito[0].tipo_factura === 1) {
                        tabla_1 = "notas_credito_despachos_clientes_agrupados";
                        tabla_2 = "inv_facturas_agrupadas_despacho";
                        tabla_3 = "detalles_notas_credito_despachos_clientes_agrupados";
                        tabla_4 = "inv_facturas_agrupadas_despacho_d";
                    }
                    paramet.tabla_1 = tabla_1;
                    paramet.tabla_2 = tabla_2;
                    paramet.tabla_3 = tabla_3;
                    paramet.tabla_4 = tabla_4;

                    return G.Q.ninvoke(that.m_notas, 'consultarProductosNotasCredito', paramet);
                } else {
                    return [{subtotal: 0, iva: 0, total1: notaCredito[0].valor_nota, total: notaCredito[0].valor_nota}];
                }
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear la cabecera'};
            }
        }).then(result => {
            if (result !== undefined) {
                let separacion = {
                    medicamentosGravados: 0,
                    costoMedicamentosGravados: 0,
                    medicamentosNoGravados: 0,
                    costoMedicamentosNoGravados: 0,
                    insumosGravados: 0,
                    costoInsumosGravados: 0,
                    insumosNoGravados: 0,
                    costoInsumosNoGravados: 0,
                    porc_iva: 0,
                    subtotal: 0,
                    iva: 0,
                    total: 0
                };

                return G.Q.nfcall(__SeparacionMedicamentosInsumos, result, 0, separacion);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error ConsultarDetalleFacturaCredito'};
            }
        }).then(result => {
            if (result !== undefined) {
                totalesFactura = result;

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarCuentasDetalle', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los totales'};
            }
        }).then(result => {
            if (result.length > 0) {
                empuestos.retencion_ica = 0;
                empuestos.retencion_fuente = 0;
                empuestos.impusto_cree = 0;
                totalesFactura.identercero = notaCredito[0].tercero_id;
                totalesFactura.naturaleza = notaCredito[0].naturaleza;
                totalesFactura.cuentaNaturaleza = notaCredito[0].cuenta;
                totalesFactura.cuenta = contrato[0].cuenta_contable;
                totalesFactura.subtotal = detalle;

                return G.Q.nfcall(__EncabezadoFacturaDetalle, result, totalesFactura, [], 0, contrato, empuestos);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al consultar las cuentas de la factura'};
            }
        }).then(result => {
            param = {'encabezado': encabezado, 'detalle': result};

            callback(false, param);
        }).fail(err => {
            const mensaje = {
                mensaje: 'Error sincronizacionDocumentos',
                status: 500,
                respuesta: {sincronizacionDocumentos: false, error: err}
            };
            callback(mensaje);
        }).done();
};

function __subTotalFactura(detalle, index, suma, callback) {
    item = detalle[index];
    if (!item) {
        callback(false, suma);
        return;
    }
    suma += parseInt(item.subtotal_detalle);
    index++;
    __subTotalFactura(detalle, index, suma, callback);
}

const promesa = new Promise((resolve, reject) => { resolve(true); });

const __facturasTalonarioFi = (obj, that, callback) => {
    let parametro = {};
    let facturaTalonario = [];
    let contrato = [];
    let encabezado = {};
    let empuestos = {};
    let param = {};
    //    funcionWs = "crearInformacionContable";
    G.Q.ninvoke(that.m_caja_general, 'listarFacturaTalonario', obj)
        .then(result => {
            if (result.length > 0) {
                facturaTalonario = result;
                obj.terceroId = facturaTalonario[0].tercero_id;
                obj.tipoIdTercero = facturaTalonario[0].tipo_id_tercero;
                obj.anio = facturaTalonario[0].anio_factura;
                parametro.fechaFactura = facturaTalonario[0].fecha_factura;

                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Factura'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                contrato = result;
                return G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el contrato'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                empuestos = result;
                obj.parametrizacion = obj.wsFi;
                return G.Q.ninvoke(that.m_SincronizacionDoc, 'parametrizacionCabeceraFi', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Parametrizacion'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                parametro.prefijo = obj.prefijo;
                parametro.facturaFiscal = obj.facturaFiscal;
                parametro.terceroId = facturaTalonario[0].tercero_id;
    //          parametro.parametrizacionCabeceraFi=result[0].parametrizacionCabeceraFi;
    //          parametro.nombre=result[0].nombre;
                parametro.estadoencabezado = result[0].estadoencabezado;
                parametro.tipotercero = result[0].tipotercero;
    //          parametro.plazotercero=result[0].plazotercero;
    //          parametro.numeroradicacion=result[0].numeroradicacion;
                parametro.codempresa = result[0].codempresa;
                parametro.coddocumentoencabezado = result[0].coddocumentoencabezado;
                parametro.observaciones = "Factura " + obj.prefijo + " #" + obj.facturaFiscal;

                return G.Q.nfcall(__JsonFacturaEncabezado, parametro);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de la cabecera'};
            }
        }).then(result => {
            encabezado = result;
            return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarCuentasDetalle', obj);
        }).then(result => {
            //$total = (((($subtotal + $iva) - $retencion_fuente) - $retencion_ica) - $retencion_iva);
            let totalesFactura = {
                medicamentosGravados: 0,
                costoMedicamentosGravados: 0,
                medicamentosNoGravados: 0,
                costoMedicamentosNoGravados: 0,
                insumosGravados: 0,
                costoInsumosGravados: 0,
                insumosNoGravados: 0,
                costoInsumosNoGravados: 0,
                porc_iva: 0,
                subtotal: facturaTalonario[0].total_factura - facturaTalonario[0].gravamen,
                iva: facturaTalonario[0].gravamen,
                total: (facturaTalonario[0].total_factura - facturaTalonario[0].gravamen),
                identercero: facturaTalonario[0].tercero_id,
                cuenta: contrato[0].cuenta_contable
            };
            empuestos.retencion_fuente = 0;

            return G.Q.nfcall(__EncabezadoFacturaDetalle, result, totalesFactura, [], 0, contrato, empuestos);
        }).then(result => {
            param = {'encabezado': encabezado, 'detalle': result};
            callback(false, param);
        }).fail(err => {
            const response = {
                mensaje: err.mensaje,
                status: 500,
                respuesta: {sincronizacionDocumentos: false},
                error: err
            };
            callback(response);
        }).done();
};

const __facturasVentaFi = (obj, that, callback) => {
    let parametro = {};
    let listarFacturas;
    let listarFacturasDetalle;
    let contrato;
    let empuestos;
    let encabezado;
    let totalesFactura;
    let param = {};

    G.Q.ninvoke(that.m_notas, 'listarFacturas', obj)
        .then(result => {
            if (result !== undefined && result.length > 0) {
                listarFacturas = result;
                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultaDetalleFacturaGenerada', obj, 0);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Factura'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                listarFacturasDetalle = result;
                obj.terceroId = listarFacturas[0].tercero_id;
                obj.tipoIdTercero = listarFacturas[0].tipo_id_tercero;
                obj.anio = listarFacturas[0].anio_factura;

                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el Detalle de la Factura'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                contrato = result;
                return G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se econtro el Contrato del tercero'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                empuestos = result;
                return G.Q.ninvoke(that.m_SincronizacionDoc, 'obtenerPrefijoFi', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de los impuestos'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                parametro.fechaFactura = listarFacturas[0].fecha_factura;
                parametro.usuarioId = obj.usuario;
                parametro.prefijo = result[0].prefijo_fi;
                obj.parametrizacion = '1';
                return G.Q.ninvoke(that.m_SincronizacionDoc, 'parametrizacionCabeceraFi', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el prefijo de FI'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                parametro.facturaFiscal = listarFacturas[0].factura_fiscal;
                parametro.terceroId = listarFacturas[0].tercero_id;
                parametro.parametrizacionCabeceraFi = result[0].parametrizacionCabeceraFi;
                parametro.nombre = result[0].nombre;
                parametro.estadoencabezado = result[0].estadoencabezado;
                parametro.tipotercero = result[0].tipotercero;
                parametro.plazotercero = result[0].plazotercero;
                parametro.numeroradicacion = result[0].numeroradicacion;
                parametro.codempresa = result[0].codempresa;
                parametro.coddocumentoencabezado = result[0].coddocumentoencabezado;
                parametro.observaciones = listarFacturas[0].observaciones;
                return G.Q.nfcall(__JsonFacturaEncabezado, parametro);
            } else {
                throw {
                    error: 1,
                    status: 404,
                    mensaje: 'Se produjo un error al consultar la parametrizacion de la cabecera'
                };
            }
        }).then(result => {
            if (result !== undefined) {
                encabezado = result;
                //identerceroencabezado
                let separacion = {
                    medicamentosGravados: 0,
                    costoMedicamentosGravados: 0,
                    medicamentosNoGravados: 0,
                    costoMedicamentosNoGravados: 0,
                    insumosGravados: 0,
                    costoInsumosGravados: 0,
                    insumosNoGravados: 0,
                    costoInsumosNoGravados: 0,
                    porc_iva: 0,
                    subtotal: 0,
                    iva: 0,
                    total: 0
                };
                return G.Q.nfcall(__SeparacionMedicamentosInsumos, listarFacturasDetalle, 0, separacion);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear la cabecera'};
            }
        }).then(result => {
            if (result !== undefined) {
                totalesFactura = result;
                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarCuentasDetalle', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los totales'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                empuestos.retencion_ica = 0;
                empuestos.retencion_fuente = 0;
                empuestos.impusto_cree = 0;
                totalesFactura.identercero = listarFacturas[0].tercero_id;
                totalesFactura.cuenta = contrato[0].cuenta_contable;
                return G.Q.nfcall(__EncabezadoFacturaDetalle, result, totalesFactura, [], 0, contrato, empuestos);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al consultar las cuentas de la factura'};
            }
        }).then(result => {
            if (result !== undefined > 0) {
                param = {'encabezado': encabezado, 'detalle': result};
                callback(false, param);
            } else {
                throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los asientos contables'};
            }
        }).fail(err => {
            let mensaje = {};
            if (err.error !== undefined) {
                mensaje.status = err.status;
                mensaje.mensaje = err.mensaje;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            } else {
                mensaje.mensaje = 'Error sincronizacionDocumentos';
                mensaje.status = 500;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            }
            callback(mensaje);
        }).done();
};

const __enviarReciboRCC = (obj, that, callback) => {
    let documento = {};
    let totalDebito = 0;
    let totalCredito = 0;
    let total = 0;
    let prefijoFI = 'CC';
    let cuenta = 0;
    let lineaCosto = 0;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarEncabezadoRCD', obj)
        .then(result => {
            if (result && result.length > 0) {
                documento.encabezado = result[0];
                obj.empresaRecibo = result[0].empresa_recibo;
                obj.cuentaContable = documento.encabezado.cuenta_contable;
                obj.terceroId = documento.encabezado.tercero_id;
                obj.terceroTipoId = documento.encabezado.tipotercero;
                delete documento.encabezado.cuenta_contable;
                delete documento.encabezado.tercero_id;

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarFacturasDFIN1121', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Factura'};
            }
        }).then(result => {
            if (result.facturas !== undefined && result.facturas.length > 0) {
                documento.detalle = result.facturas;
                totalCredito += parseFloat(result.credito);

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarDetalleRCWSFI', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el Detalle de la Factura'};
            }
        }).then(result => {
            if (result.debito !== undefined) {
                totalDebito += parseFloat(result.debito);
            }
            if (result.credito !== undefined) {
                totalCredito += parseFloat(result.credito);
            }
            if (result.detalle !== undefined && result.detalle.length > 0 && result.detalle[0].linea_costo) {
                lineaCosto = result.detalle[0].linea_costo;
            }

            if (obj.empresaRecibo == '0') {
                cuenta = '28050510';
            } else if (obj.empresaRecibo == '1') {
                cuenta = '13101005';
            }
            total = parseFloat(totalCredito - totalDebito);

            const ultimoAsiento = [{
                codcentrocostoasiento: "0",
                codcentroutilidadasiento: "0",
                codcuentaasiento: cuenta, // cuentaTercero,
                codlineacostoasiento: lineaCosto,
                identerceroasiento: obj.terceroId,
                observacionasiento: 'SIN OBSERVACION PARA EL ASIENTO',
                valorbaseasiento: '0',
                valorcreditoasiento: '0', // (int)($encabezado['total_abono']),
                valordebitoasiento: total, // Falta este: "$total_saldo"
                valortasaasiento: '0'
            }];

            if (result.detalle !== undefined && result.detalle.length > 0) {
                documento.detalle = documento.detalle.concat(result.detalle).concat(ultimoAsiento);
            } else {
                documento.detalle = documento.detalle.concat(ultimoAsiento);
            }

            callback(false, documento);
        }).fail(err => {
            let mensaje = {};
            if (err.error !== undefined) {
                mensaje.status = err.status;
                mensaje.mensaje = err.mensaje;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            } else {
                mensaje.mensaje = 'Error sincronizacionDocumentos';
                mensaje.status = 500;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            }

            callback(mensaje);
        }).done();
};

const __enviarReciboRCD = (obj, that, callback) => {
    let documento = {};
    let totalDebito = 0;
    let totalCredito = 0;
    let total = 0;
    let prefijoFI = 'NTC';

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarEncabezadoRCD', obj)
        .then(result => {
            if (result && result.length > 0) {
                documento.encabezado = result[0];
                obj.cuentaContable = documento.encabezado.cuenta_contable;
                obj.terceroId = documento.encabezado.tercero_id;
                obj.terceroTipoId = documento.encabezado.tipotercero;
                delete documento.encabezado.cuenta_contable;
                delete documento.encabezado.tercero_id;

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarEncabezadoRCD', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la Factura'};
            }
        }).then(result => {
            if (result.length > 0) {
                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarFacturasDFIN1121', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de la cabecera'};
            }
        }).then(result => {
            if (result.facturas !== undefined && result.facturas.length > 0) {
                documento.detalle = result.facturas;
                totalCredito += parseFloat(result.credito);

                return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarDetalleRCWSFI', obj);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el Detalle de la Factura'};
            }
        }).then(result => {
            if (result !== undefined && result.length > 0) {
                totalDebito += parseFloat(result.debito);
                totalCredito += parseFloat(result.credito);
            }
            total = parseFloat(totalCredito - totalDebito);

            const ultimoAsiento = [{
                codcentrocostoasiento: "0",
                codcentroutilidadasiento: "0",
                codcuentaasiento: '28059510', // cuentaTercero,
                codlineacostoasiento: '0',
                identerceroasiento: obj.terceroId,
                observacionasiento: 'SIN OBSERVACION PARA EL ASIENTO',
                valorbaseasiento: '0',
                valorcreditoasiento: '0', // (int)($encabezado['total_abono']),
                valordebitoasiento: total, // Falta este: "$total_saldo"
                valortasaasiento: '0'
            }];

            if (result.detalle !== undefined && result.detalle.length > 0) {
                documento.detalle = documento.detalle.concat(result.detalle).concat(ultimoAsiento);
            } else {
                documento.detalle = documento.detalle.concat(ultimoAsiento);
            }

            callback(false, documento);
        }).fail(function (err) {
            let mensaje = {};
            if (err.error !== undefined) {
                mensaje.status = err.status;
                mensaje.mensaje = err.mensaje;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            } else {
                mensaje.mensaje = 'Error sincronizacionDocumentos';
                mensaje.status = 500;
                mensaje.respuesta = {sincronizacionDocumentos: false, error: err};
            }

            callback(mensaje);
        }).done();
};

const __ingresoBonificaciones = (obj, that, callback) => {
    let documento = {};
    let resultado_sincronizacion = false;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'obtenerEncabezadoBonificacion', obj)
        .then(result => {
            if (result.length > 0) {
                documento.encabezado = jsonIngresoBonificaciones(result[0], obj);
                obj.tercero_id = result[0].tercero_id;
                let errorValidacion = validacionEncabezadoBonificacion(documento.encabezadofactura);

                if (errorValidacion.contador === 0) {
                    resultado_sincronizacion = true;

                    return G.Q.ninvoke(that.m_SincronizacionDoc, 'obtenerDetalleBonificacion', obj);
                } else {
                    throw {error: 1, status: 404, mensaje: 'error en validacion: "' + errorValidacion.msj + '" '};
                }
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el Encabezado!!'};
            }
        }).then(result => {
            if (result.asientos !== undefined && result.asientos.length > 0) {
                documento.detalle = result.asientos;

                callback(false, documento);
            } else {
                throw {error: 1, status: 404, mensaje: 'No se encontro el detalle de la bonificacion!!'};
            }
        }).fail(err => {
            callback(err);
        }).done();
};

const __EncabezadoFacturaDetalle = (detalle, totalesFactura, arreglo, index, contrato, empuestos, callback) => {
    let cuentas = detalle[index]; //categoria_id
    let idtercero = null;
    if (!cuentas) {
        callback(false, arreglo);
        return;
    }

    idtercero = cuentas.id_tercero_asiento;
    if (cuentas.id_tercero_asiento === null) {
        cuentas.id_tercero_asiento = totalesFactura.identercero;
    }
    cuentas.valortasaasiento = 0;
    cuentas.valorbaseasiento = 0;

    switch (cuentas.categoria_id) {
        case 12://MEDICAMENTOS GRAVADOS
            if (totalesFactura.medicamentosGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.medicamentosGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.medicamentosGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 3://COSTO MEDICAMENTOS GRAVADOS
            if (totalesFactura.costoMedicamentosGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.costoMedicamentosGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.costoMedicamentosGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 16://INVENTARIO MEDICAMENTOS GRAVADOS
            if (totalesFactura.costoMedicamentosGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.costoMedicamentosGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.costoMedicamentosGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 4://MEDICAMENTOS NO GRAVADOS
            if (totalesFactura.medicamentosNoGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.medicamentosNoGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.medicamentosNoGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 13://COSTO MEDICAMENTOS NO GRAVADOS
            if (parseInt(totalesFactura.costoMedicamentosNoGravados) > 0) {

                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.costoMedicamentosNoGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.costoMedicamentosNoGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 14://INVENTARIO MEDICAMENTOS NO GRAVADOS
            //diferente Cuenta representa inventario_medicamentos_no_gravados
            if (totalesFactura.costoMedicamentosNoGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.costoMedicamentosNoGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.costoMedicamentosNoGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 15://INSUMOS GRAVADOS
            if (totalesFactura.insumosGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.insumosGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.insumosGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 17://COSTO INSUMOS GRAVADOS
            if (totalesFactura.costoInsumosGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.costoInsumosGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.costoInsumosGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 18://INVENTARIO INSUMOS GRAVADOS
            //diferente Cuenta representa inventario_insumos_gravados
            if (totalesFactura.costoInsumosGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.costoInsumosGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.costoInsumosGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 19://INSUMOS NO GRAVADOS
            if (totalesFactura.insumosNoGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.insumosNoGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.insumosNoGravados;
                    cuentas.valordebitoasiento = 0;
                }
                if (cuentas.parametrizacion_ws_fi === 3) {
                    break;
                } else {
                    __JsonFacturaDetalle(cuentas, function (data) {
                        arreglo.push(data)
                    });
                }
            }
            break;
        case 20://COSTO INSUMOS NO GRAVADO
            if (totalesFactura.costoInsumosNoGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.costoInsumosNoGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.costoInsumosNoGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 21://INVENTARIOS INSUMOS NO GRAVADOS
            //diferente Cuenta representa inventario_insumos_no_gravados
            if (totalesFactura.costoInsumosNoGravados > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = totalesFactura.costoInsumosNoGravados;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = totalesFactura.costoInsumosNoGravados;
                    cuentas.valordebitoasiento = 0;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data);
                });
            }
            break;
        case 5://IVA
            if (parseFloat(totalesFactura.iva) > 0) {
                if (cuentas.parametrizacion_ws_fi === 9) {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = Math.round(totalesFactura.iva);
                } else {
                    cuentas.valorcreditoasiento = totalesFactura.iva;
                    cuentas.valordebitoasiento = 0;
                }

                if (cuentas.parametrizacion_ws_fi === 1 || cuentas.parametrizacion_ws_fi === 9) {
                    cuentas.valortasaasiento = 0;
                } else {
                    cuentas.valortasaasiento = totalesFactura.porc_iva;
                }
                if (cuentas.parametrizacion_ws_fi === 2) {
                    let subtotal = totalesFactura.total - totalesFactura.iva;
                    let porc = (totalesFactura.total / subtotal) - 1;
                    cuentas.valortasaasiento = porc;

                    if (cuentas.cuenta === "24080604") {
                        cuentas.valorbaseasiento = totalesFactura.iva;

                    } else if (cuentas.cuenta === "41353803") {
                        let base = 0;
//                        if (totalesFactura.porc_iva !== 0) {
                        base = (totalesFactura.iva / 0.19);
//                            base = (totalesFactura.iva / totalesFactura.porc_iva);
//                        }
                        cuentas.valorcreditoasiento = base;
                        cuentas.valordebitoasiento = 0;
                        cuentas.valorbaseasiento = 0;
                    }
                } else {
                    cuentas.valorbaseasiento = totalesFactura.medicamentosGravados + totalesFactura.insumosGravados;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data);
                });
            }
            break;
        case 6: //RETEFUENTE
            if (empuestos[0].sw_rtf === '2' || empuestos[0].sw_rtf === '3' && (parseFloat(contrato[0].porcentaje_rtf) === parseFloat(cuentas.rtf_porcentaje))) {
                empuestos.retencion_fuente = 0;

                if (totalesFactura.subtotal >= parseInt(empuestos[0].base_rtf)) {
                    if (cuentas.parametrizacion_ws_fi === 3) {
                        empuestos.retencion_fuente = parseInt(totalesFactura.total * (contrato[0].porcentaje_rtf / 100));
                    } else {
                        empuestos.retencion_fuente = parseInt(totalesFactura.subtotal * (contrato[0].porcentaje_rtf / 100));
                    }

                    if (empuestos.retencion_fuente > 0) {
                        if (cuentas.parametrizacion_ws_fi === 9) {
                            cuentas.valorcreditoasiento = empuestos.retencion_fuente;
                            cuentas.valordebitoasiento = 0;
                        } else {
                            cuentas.valorcreditoasiento = 0;
                            cuentas.valordebitoasiento = empuestos.retencion_fuente;
                        }
                        cuentas.valorbaseasiento = totalesFactura.subtotal;
                        cuentas.valortasaasiento = contrato[0].porcentaje_rtf;

                        if (cuentas.parametrizacion_ws_fi === 3 || cuentas.parametrizacion_ws_fi === 4) {
                            break;
                        } else {
                            __JsonFacturaDetalle(cuentas, function (data) {
                                arreglo.push(data);
                            });
                        }
                    } else {

                    }
                } else {

                }
            } else {

            }
            break;
        case 7: //ICA
            if (empuestos[0].sw_ica === '2' || empuestos[0].sw_ica === '3' && (parseFloat(contrato[0].porcentaje_ica) === parseFloat(cuentas.ica_porcentaje))) {
                empuestos.retencion_ica = 0;
                if (totalesFactura.subtotal >= empuestos[0].base_ica) {
                    if (cuentas.parametrizacion_ws_fi === 3) {
                        empuestos.retencion_ica = parseFloat(totalesFactura.total * (contrato[0].porcentaje_ica / 1000));
                    } else {
                        empuestos.retencion_ica = parseFloat(totalesFactura.subtotal * (contrato[0].porcentaje_ica / 1000));
                    }

                    if (empuestos.retencion_ica > 0) {
                        if (cuentas.parametrizacion_ws_fi === 9) {
                            cuentas.valorcreditoasiento = Math.round(empuestos.retencion_ica);
                            cuentas.valordebitoasiento = 0;
                        } else {
                            cuentas.valorcreditoasiento = 0;
                            cuentas.valordebitoasiento = empuestos.retencion_ica;
                        }
                        cuentas.valorbaseasiento = totalesFactura.subtotal;

                        if (cuentas.parametrizacion_ws_fi === 1) {
                            cuentas.valortasaasiento = 0;
                        } else {
                            cuentas.valortasaasiento = contrato[0].porcentaje_ica;
                        }
                        if (cuentas.parametrizacion_ws_fi === 3 || cuentas.parametrizacion_ws_fi === 4) {
                            break;
                        } else {
                            __JsonFacturaDetalle(cuentas, function (data) {
                                arreglo.push(data);
                            });
                        }
                    }
                }
            }
            break;
        case 8: //NOTA
            cuentas.valordebitoasiento = 0;
            cuentas.valorcreditoasiento = 0;
            if (totalesFactura.naturaleza === 'D') {
                cuentas.valordebitoasiento = totalesFactura.total;
            } else {
                cuentas.valorcreditoasiento = totalesFactura.total;
            }
            cuentas.cuenta = totalesFactura.cuentaNaturaleza;
            if (cuentas.cuenta !== undefined && cuentas.cuenta !== "" && cuentas.cuenta !== null) {
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 10: //CREE DEBITO
            empuestos.impusto_cree = parseInt(totalesFactura.subtotal * cuentas.cree_porcentaje);
            if (empuestos.impusto_cree > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = empuestos.impusto_cree;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = empuestos.impusto_cree;
                    cuentas.valordebitoasiento = 0;
                }
                if (cuentas.parametrizacion_ws_fi === 1 || cuentas.parametrizacion_ws_fi === 2) {
                    cuentas.valorbaseasiento = 0;
                    cuentas.valortasaasiento = 0;
                } else {
                    cuentas.valortasaasiento = cuentas.cree_porcentaje;
                    cuentas.valorbaseasiento = totalesFactura.subtotal;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data);
                });
            }
            break;
        case 23: //TOTAL
            let total = 0;
            total = ((((totalesFactura.medicamentosGravados + totalesFactura.medicamentosNoGravados + totalesFactura.insumosGravados + totalesFactura.insumosNoGravados + totalesFactura.iva) - empuestos.retencion_fuente) - empuestos.retencion_ica));

            if (cuentas.parametrizacion_ws_fi === 1) {
                total = parseInt((((parseInt(totalesFactura.medicamentosGravados) + parseInt(totalesFactura.medicamentosNoGravados) + parseInt(totalesFactura.insumosGravados) + parseInt(totalesFactura.insumosNoGravados + parseInt(totalesFactura.iva))) - parseInt(empuestos.retencion_fuente)) - parseInt(empuestos.retencion_ica)));
            }
            if (cuentas.parametrizacion_ws_fi === 2) {
                let subtotal = totalesFactura.total - totalesFactura.iva;
                let porc = (totalesFactura.total / subtotal) - 1;
                cuentas.valortasaasiento = porc;
                total = parseFloat(totalesFactura.subtotal) + parseFloat(totalesFactura.iva) - parseFloat(empuestos.retencion_fuente) - parseFloat(empuestos.retencion_ica);
            }
            if (cuentas.parametrizacion_ws_fi === 3) {
                //total = totalesFactura.total;
                //console.log('Before total is: ', totalesFactura.total);
                total = parseFloat(totalesFactura.total) + parseFloat(totalesFactura.iva) - parseFloat(empuestos.retencion_ica) - parseFloat(empuestos.retencion_fuente);
            } else {
                cuentas.cuenta = contrato[0].cuenta_contable;
            }

            if (cuentas.parametrizacion_ws_fi === 4) {
                total = totalesFactura.total;
            }
            if (cuentas.sw_cuenta === '0') {
                cuentas.valorcreditoasiento = 0;
                cuentas.valordebitoasiento = total;
            } else if (cuentas.sw_cuenta === '1') {
                cuentas.valorcreditoasiento = total;
                cuentas.valordebitoasiento = 0;
            }
            cuentas.valorbaseasiento = 0;
//            cuentas.cuenta = totalesFactura.cuenta;
            __JsonFacturaDetalle(cuentas, function (data) {
                arreglo.push(data);
            });
            break;
        case 22: //TALONARIO
            let base = 0;
            let entrar = false;
//            if(totalesFactura.porc_iva!==0){
//              base=(totalesFactura.iva / totalesFactura.porc_iva);
//            }
            base = (totalesFactura.iva / 0.19);
            let valor = parseInt(totalesFactura.subtotal) - parseInt(base);

            if ("830023202" === "" + cuentas.id_tercero_asiento && cuentas.cuenta === "41651005") {
                entrar = true;
            } else if ("830023202" !== totalesFactura.identercero && idtercero === null) {
                entrar = true;
            }

            if (entrar && valor > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = valor;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = valor;
                    cuentas.valordebitoasiento = 0;
                }
                cuentas.valorbaseasiento = 0;
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data);
                });
            }
            break;
    }
    if (cuentas.cuenta === '23680505') {

    }
    let timer = setTimeout(function () {
        index++;
        __EncabezadoFacturaDetalle(detalle, totalesFactura, arreglo, index, contrato, empuestos, callback);
        clearTimeout(timer);
    }, 0);
};

function __JsonFacturaDetalle(obj, callback) {
    if (obj.parametrizacion_ws_fi === 9 && obj.categoria_id === 7) {
        var detalle = {
            codcentrocostoasiento: obj.centro_costos_asientos,
            codcentroutilidadasiento: obj.centro_utilidad_asiento,
            codcuentaasiento: obj.cuenta,
            codlineacostoasiento: obj.cod_linea_costo_asiento,
            identerceroasiento: obj.id_tercero_asiento,
            observacionasiento: obj.observacion_asiento,
            valorbaseasiento: parseInt(obj.valorbaseasiento),
            valorcreditoasiento: parseFloat(obj.valorcreditoasiento),
            valordebitoasiento: parseFloat(obj.valordebitoasiento),
            valortasaasiento: obj.valortasaasiento
        };
    } else {
        var detalle = {
            codcentrocostoasiento: obj.centro_costos_asientos,
            codcentroutilidadasiento: obj.centro_utilidad_asiento,
            codcuentaasiento: obj.cuenta,
            codlineacostoasiento: obj.cod_linea_costo_asiento,
            identerceroasiento: obj.id_tercero_asiento,
            observacionasiento: obj.observacion_asiento,
            valorbaseasiento: parseInt(obj.valorbaseasiento),
            valorcreditoasiento: parseInt(obj.valorcreditoasiento),
            valordebitoasiento: parseInt(obj.valordebitoasiento),
            valortasaasiento: obj.valortasaasiento
        };
    }
    callback(detalle);
}

const __JsonFacturaEncabezado = (obj, callback) => {

    /*
        Facturas Ventas FI,
        Facturas Talonario,
        Notas Debito Cliente,
        Notas Credito Cliente
    */

    let encabezado = {
        codempresa: obj.codempresa, //fijo
        coddocumentoencabezado: obj.prefijo.trim(),
        numerodocumentoencabezado: obj.facturaFiscal,
        identerceroencabezado: obj.terceroId,
        observacionencabezado: obj.observaciones, //variable
        estadoencabezado: obj.estadoencabezado, //ventas - talonario - notas proveedor   3//notas credito debito cuentas_x_pagar_fi
        fecharegistroencabezado: obj.fechaFactura,
        usuariocreacion: 0, //obj.usuarioId,
        tipotercero: obj.tipotercero //ventas - talonario -     2 //notas credito debito   //notas proveedor(N/A)
    }; //cabecera notas proveedor aplica mas campos y se quita el campo tipotercero - cuentas_x_pagar_fi igual que anterior

    callback(false, encabezado);
};

function __JsonFacturaEncabezadoCliente(obj, callback) {
    var encabezado = {
        codempresa: obj.codempresa, //fijo
        coddocumento: obj.prefijo.trim(),
        numerofactura: obj.facturaFiscal,
        identerceroencabezado: obj.terceroId,
        cuentaterceroencabezado: obj.cuentaterceroencabezado,
        observacionencabezado: obj.observaciones, //variable
        estadoencabezado: obj.estadoencabezado, //ventas - talonario - notas proveedor   3//notas credito debito cuentas_x_pagar_fi
        fechafactura: obj.fechaFactura,
        fecharadicacion: obj.fecharadicacion,
        numeroradicacion: obj.numeroradicacion,
        plazotercero: obj.plazotercero,
        usuariocreacion: 0 //obj.usuarioId,
    }; //cabecera notas proveedor aplica mas campos y se quita el campo tipotercero - cuentas_x_pagar_fi igual que anterior
    callback(false, encabezado);
}

function jsonIngresoBonificaciones(encabezado, obj) {
    let encabezadoFormatiado = {
        codempresa: 'DUA',
        coddocumentoencabezado: encabezado.coddocumentoencabezado,
        numerodocumentoencabezado: String(encabezado.numero),
        identerceroencabezado: encabezado.tercero_id,
        observacionencabezado: encabezado.observacion,
        estadoencabezado: '3',
        fecharegistroencabezado: obj.fechaActual,
        usuariocreacion: obj.usuarioId,
        tipotercero: 3
    };

    return encabezadoFormatiado;
}

function fechaActual() {
    let date = new Date();
    let day = String(date.getDate());
    let month = String(parseInt(date.getMonth()) + 1);
    let year = String(date.getFullYear());
    if (day.length === 1) {
        day = '0' + day;
    }
    if (month.length === 1) {
        month = '0' + month;
    }

    return day + '/' + month + '/' + year;
}

function validacionEncabezadoBonificacion(encabezado) {

    let error = {contador: 0, msj: ''};


    if (!encabezado.codempresa) {
        error.contador++;
        error.msj += 'El Codigo de la Empresa no esta definido';
    }

    if (!encabezado.coddocumentoencabezado) {
        error.contador++;
        error.msj += 'El Prefijo FI no esta parametrizado para ese documento';
    }

    if (!encabezado.numerodocumentoencabezado) {
        error.contador++;
        error.msj = 'El numero de factura es obligatorio';
    }

    if (!encabezado.identerceroencabezado) {
        error.contador++;
        error.msj = 'El proveedor no posee una identificacion valid';
    }

    if (!encabezado.observacionencabezado) {
        error.contador++;
        error.msj = 'Debe Ingresar una observacion';
    }

    return error;
}

/*
 * Metodo que recibe un arreglo del detalle de la factura 
 * y separa los medicamentos e insumos con sus respetivos impuestos
 */
function __SeparacionMedicamentosInsumos(detalleFactura, index, separacion, callback) {
    var item = detalleFactura[index];

    if (!item) {
        callback(false, separacion);
        return;
    }
    if (item.sw_medicamento === '1') {

        if (item.iva_total > 0) {
            separacion.medicamentosGravados += parseFloat(item.subtotal);
            separacion.costoMedicamentosGravados += parseFloat(item.costo);
            if (item.porc_iva >= 0) {
                separacion.porc_iva = item.porc_iva;
            }
        } else {
            separacion.medicamentosNoGravados += parseFloat(item.subtotal);
            separacion.costoMedicamentosNoGravados += parseFloat(item.costo);
        }
    } else if (item.sw_insumos === '1') {
        if (item.iva_total > 0) {
            separacion.insumosGravados += parseFloat(item.subtotal);
            separacion.costoInsumosGravados += parseFloat(item.costo);
            if (item.porc_iva >= 0) {
                separacion.porc_iva = item.porc_iva;
            }
        } else {
            separacion.insumosNoGravados += parseFloat(item.subtotal);
            separacion.costoInsumosNoGravados += parseFloat(item.costo);
        }
    }

    separacion.subtotal += parseFloat(item.subtotal);
    separacion.iva += parseFloat(item.iva_total);
    separacion.total += parseFloat(item.total1);

    var timer = setTimeout(function () {
        index++;
        __SeparacionMedicamentosInsumos(detalleFactura, index, separacion, callback);
        clearTimeout(timer);
    }, 0);
}

SincronizacionDocumentos.$inject = [
    "m_SincronizacionDoc",
    "m_notas",
    "m_facturacion_clientes",
    "m_facturacion_proveedores",
    "m_caja_general",
    "m_movimientos_bodegas"
];

module.exports = SincronizacionDocumentos;
