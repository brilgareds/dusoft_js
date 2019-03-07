
var SincronizacionDocumentos = function (sincronizacion, m_notas, m_facturacion_clientes, m_facturacion_proveedores, m_caja_general) {
    this.m_SincronizacionDoc = sincronizacion;
    this.m_notas = m_notas;
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.m_facturacion_proveedores = m_facturacion_proveedores;
    this.m_caja_general = m_caja_general;
};


SincronizacionDocumentos.prototype.buscarServicio = function (req, res) {
    var that = this;
    var args = req.body.data;
    console.log('In Controller backend of "buscarServicio", body is: ', req.body);
    args.empresaId = req.body.session.empresaId;
    args.centroId = req.body.session.centroUtilidad;
    args.bodegaId = req.body.session.bodega;

    G.Q.ninvoke(this.m_SincronizacionDoc, 'buscarServicio', args).then(function (servicio) {
        res.send(G.utils.r(req.url, 'Listado de Prefijos!!!!', 200, {servicio: servicio}));
    }).
    fail(function (err) {
        res.send(G.utils.r(req.url, 'Error Listando Prefijos', 500, {servicio: false}));
    }).
    done();
};

SincronizacionDocumentos.prototype.listarPrefijos = function (req, res) {
//    console.log('Entro en el controlador, listarPrefijos!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc, 'listarPrefijos', args.data).then(function (prefijos) {
        res.send(G.utils.r(req.url, 'Listado de Prefijos!!!!', 200, {listarPrefijos: prefijos}));
    }).
    fail(function (err) {
        res.send(G.utils.r(req.url, 'Error Listando Prefijos', 500, {listarPrefijos: {}}));
    }).
    done();
};

SincronizacionDocumentos.prototype.listarTipoCuentaCategoria = function (req, res) {
    console.log('Entro en el controlador, listarTipoCuentascategoria!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarTipoCuentaCategoria', args).then(function (tipoCuentascategoria) {
        res.send(G.utils.r(req.url, 'Listado de TiposCuentas!!!!', 200, {listarTipoCuentaCategoria: tipoCuentascategoria}));
    }).
    fail(function (err) {
        res.send(G.utils.r(req.url, 'Error Listado de TiposCuentas', 500, {listarTipoCuentaCategoria: {}}));
    }).
    done();
};

SincronizacionDocumentos.prototype.listarDocumentosCuentas = function (req, res) {
    console.log('Entro en el controlador, listarDocumentosCuentas!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarDocumentosCuentas', args).then(function (listarDocumentosCuentas) {

        res.send(G.utils.r(req.url, 'Listado de TiposCuentas!!!!', 200, {listarDocumentosCuentas: listarDocumentosCuentas}));
    }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error Listado de listarDocumentosCuentas', 500, {listarDocumentosCuentas: {}}));
            }).
            done();
};

SincronizacionDocumentos.prototype.insertTiposCuentas = function (req, res) {
    console.log('Entro en el controlador, insertTiposCuentas!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc, 'insertTiposCuentas', args).then(function (tiposCuentas) {
        console.log('Respuesta del modelo en el controlador: ', tiposCuentas);
        if(tiposCuentas[0] === 'repetido') {
            res.send(G.utils.r(req.url, 'Error: esos valores ya existen en la base de datos!!"', 500, {}));
        }else{
            res.send(G.utils.r(req.url, 'insertTiposCuentas!!!!', 200, {insertTiposCuentas: true}));
        }
    }).
    fail(function (err) {
        res.send(G.utils.r(req.url, 'Error insertTiposCuentas', 500, {insertTiposCuentas: false}));
    }).
    done();
};


SincronizacionDocumentos.prototype.listarTiposCuentas = function (req, res) {
    //console.log('Entro en el controlador, listarTiposCuentas!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc, 'listarTiposCuentas', args).
    then(function (tiposCuentas) {
        res.send(G.utils.r(req.url, 'Listado de TiposCuentas!!!!', 200, {listarTiposCuentas: tiposCuentas}));
    }).
    fail(function (err) {
        res.send(G.utils.r(req.url, 'Error Listado de TiposCuentas', 500, {listarTiposCuentas: {}}));
    }).
    done();
};

SincronizacionDocumentos.prototype.insertDocumentosCuentas = function (req, res) {
    //console.log('Entro en el controlador, insertDocumentosCuentas!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc, 'insertDocumentosCuentas', args).
    then(function (tiposCuentas) {
        res.send(G.utils.r(req.url, 'insertDocumentosCuentas!!!!', 200, {insertTiposCuentas: true}));
    }).
    fail(function (err) {
        res.send(G.utils.r(req.url, 'Error insertDocumentosCuentas', 500, {insertTiposCuentas: false}));
    }).
    done();
};

SincronizacionDocumentos.prototype.listarTiposServicios = function(req, res) {
    //console.log('In Controller!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc,'listarTiposServicios', args).
       then(function(listarTiposServicios) {
       res.send(G.utils.r(req.url, 'listarTiposServicios!', 200, {listarTiposServicios: listarTiposServicios}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error listarTiposServicios', 500, {listarTiposServicios: false}));
    }).
       done();
};

SincronizacionDocumentos.prototype.guardarCuentas = function (req, res) {
    console.log('In Controller backend - guardarCuentas!!');
    var that = this;
    var args = req.body;
    var categorias = args.data;
    var cuentas = {};
    var error_count = 0;
    var sw_cuenta = 0;
    console.log('args Entry is: ', args);

    for(var tipo_cuenta in categorias){
        for(var index in categorias[tipo_cuenta]){
            console.log('For in Controller: ', categorias[tipo_cuenta]);
            if(categorias[tipo_cuenta][index] !== undefined){
                if(tipo_cuenta === 'debito'){
                    sw_cuenta = 0;
                }else if(tipo_cuenta === 'credito'){
                    sw_cuenta = 1;
                }
                cuentas = categorias[tipo_cuenta][index];
                cuentas.sw_cuenta = sw_cuenta;
                cuentas.tipo_cuenta = tipo_cuenta;
                cuentas.empresa_id = args.session.empresaId;
                cuentas.centro_id = args.session.centroUtilidad;
                cuentas.bodega_id = args.session.bodega;
                cuentas.prefijo_id = categorias.prefijo_id;
                console.log('Array final: ', cuentas);

                G.Q.ninvoke(that.m_SincronizacionDoc,'guardarCuentas', cuentas).
                then(function(resultado) {
                    console.log('All fine in "guardarCuentas"');
                }).
                fail(function(err) {
                    error_count++;
                    console.log('Error en "guardarCuentas"');
                });
            }
        }
    }
    if(error_count > 0){
        res.send(G.utils.r(req.url, 'Error guardarCuentas', 500, {status: false}));
    }else{
        res.send(G.utils.r(req.url, 'La actualización de cuentas fue exitosa!', 200, {status: true}));
    }
};

SincronizacionDocumentos.prototype.insertTiposCuentasCategorias = function (req, res) {
    console.log('Entro en el controlador, insertTiposCuentasCategorias!!!');
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(this.m_SincronizacionDoc, 'insertTiposCuentasCategorias', args).
        then(function (tiposCuentasCategorias) {
            res.send(G.utils.r(req.url, 'insertTiposCuentasCategorias!!!!', 200, {insertTiposCuentasCategorias: true}));
        }).
        fail(function (err) {
            res.send(G.utils.r(req.url, 'Error insertTiposCuentasCategorias', 500, {insertTiposCuentasCategorias: false}));
        }).
        done();
};

SincronizacionDocumentos.prototype.sincronizarDocumentos = function (req, res) {
    console.log('Entro en el controlador, sincronizacionDocumentos!!!');
    var that = this;
    var args = req.body.data;
    var param;
    var sincronizar = args.data.sincronizar;
    var servicio = args.data.servicio;
    var funcion_ws = '';
    var prefijo_fi = '';

    console.log('Usuario: ', req.session.user);

    var obj = {
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
        prefijo: args.data.prefijo.prefijo,
        prefijoFI: '',
        prefijoId: args.data.prefijo.prefijo,
        usuarioId: req.session.user.usuario_id
    };

    console.log("Objeto para sincronizacion: ", obj);

    switch (servicio) {
        case 1:
            funcion_ws = __facturasVentaFi;
            break;
        case 2:
            funcion_ws = __facturasTalonarioFi;
            break;
        case 5:
            funcion_ws = __ingresoBonificaciones;
            break;
        case 7:
            funcion_ws = __enviarReciboRCC;
            break;
        case 8:
            funcion_ws = __enviarReciboRCD;
            break;
        default:
            console.log('Error, funcion no asignada!!');
            break;
    }
    //console.log('Funcion: "'+funcion_ws+'"');

    G.Q.nfcall(funcion_ws, obj, that).then(function (result) {
        console.log('Funcion: "'+funcion_ws+'"');
        param = result;

        // if (sincronizar === 1) {    CONDICIONAL ORIGI9NAL DE ANDRES
        if (false) {
            var obj = {
                url: G.constants.WS().FINANCIERO.DUANA,
                funcion: "crearInformacionContable",
                parametros: param
            };
            return G.Q.ninvoke(that.m_SincronizacionDoc, 'sincronizarFinaciero', obj);
        } else {
            return param;
        }
    }).then(function (result) {
        console.log("result ", result);
        res.send(G.utils.r(req.url, 'sincronizacionDocumentos!!!!', 200, {sincronizacionDocumentos: true, result: result, parametro: param}));

    }).fail(function (err) {
        if (err.mensaje !== undefined) {
            res.send(G.utils.r(req.url, err.respuesta.error.mensaje, err.respuesta.error.status, {sincronizacionDocumentos: false, error: err.err}));
        } else {
            res.send(G.utils.r(req.url, err.mensaje, err.status, {sincronizacionDocumentos: false, error: err.err}));
        }

    }).done();
};





function __facturasTalonarioFi(obj, that, callback) {
    console.log("00--->>> ", obj);
    var parametro = {};
    var facturaTalonario;
    var contrato;
    var enacabezado;
    //    funcionWs = "crearInformacionContable";

    G.Q.ninvoke(that.m_caja_general, 'listarFacturaTalonario', obj).then(function (result) {
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

    }).then(function (result) {
        if (result.length > 0) {
            contrato = result;
            return G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro el contrato'};
        }

    }).then(function (result) {
        if (result.length > 0) {
            empuestos = result;
            obj.parametrizacion = obj.wsFi;
            return G.Q.ninvoke(that.m_SincronizacionDoc, 'parametrizacionCabeceraFi', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro la Parametrizacion'};
        }

    }).then(function (result) {

        if (result.length > 0) {
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


    }).then(function (result) {
        encabezado = result;
        return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarCuentasDetalle', obj);

    }).then(function (result) {
        //$total = (((($subtotal + $iva) - $retencion_fuente) - $retencion_ica) - $retencion_iva);
        var totalesFactura = {
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
            identercero:facturaTalonario[0].tercero_id,
            cuenta:contrato[0].cuenta_contable
        };
        console.log("totalesFactura----------",totalesFactura);
        return G.Q.nfcall(__EncabezadoFacturaDetalle, result, totalesFactura, [], 0, contrato, empuestos);

    }).then(function (result) {
        
        param = {'encabezadofactura': encabezado, 'asientoscontables': result};
        callback(false, param);

    }).fail(function (err) {
        var mensaje = {
            mensaje: 'Error sincronizacionDocumentos',
            status: 500,
            respuesta: {sincronizacionDocumentos: false, error: err}
        };
        callback(mensaje);
    }).done();
}




function __facturasVentaFi(obj, that, callback) {
    var parametro = {};
    var listarFacturas;
    var listarFacturasDetalle;
    var contrato;
    var empuestos;
    var encabezado;
    var totalesFactura;

    G.Q.ninvoke(that.m_notas, 'listarFacturas', obj).then(function (result) {
        console.log('listarFacturas in controller!!');

        if (result.length > 0) {
            listarFacturas = result;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultaDetalleFacturaGenerada', obj, 0);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro la Factura'};
        }
    }).then(function (result) {
        console.log('funcion "consultaDetalleFacturaGenerada" fine!!');
        if (result.length > 0) {
            listarFacturasDetalle = result;
            obj.terceroId = listarFacturas[0].tercero_id;
            obj.tipoIdTercero = listarFacturas[0].tipo_id_tercero;
            obj.anio = listarFacturas[0].anio_factura;
            return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro el Detalle de la Factura'};
        }
    }).then(function (result) {
        console.log('funcion "consultarTerceroContrato" fine!!');
        if (result.length > 0) {
            contrato = result;
            return G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se econtro el Contrato del tercero'};
        }
    }).then(function (result) {
        console.log('funcion "listarParametrosRetencion" fine!!');
        if (result.length > 0) {
            empuestos = result;
            return G.Q.ninvoke(that.m_SincronizacionDoc, 'obtenerPrefijoFi', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de los impuestos'};
        }

    }).then(function (result) {
        console.log('funcion "obtenerPrefijoFi" fine!!');
        if (result.length > 0) {
            parametro.fechaFactura = listarFacturas[0].fecha_factura;
            parametro.usuarioId = obj.usuario;
            parametro.prefijo = result[0].prefijo_fi;
            obj.parametrizacion = '1';
            return G.Q.ninvoke(that.m_SincronizacionDoc, 'parametrizacionCabeceraFi', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro el prefijo de FI'};
        }

    }).then(function (result) {
        if (result.length > 0) {
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
            throw {error: 1, status: 404, mensaje: 'Se produjo un error al consultar la parametrizacion de la cabecera'};
        }

    }).then(function (result) {

        if (result !== undefined) {
            encabezado = result;
            //identerceroencabezado
            var separacion = {
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
    }).then(function (result) {
        if (result !== undefined) {
            totalesFactura = result;
            return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarCuentasDetalle', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los totales'};
        }

    }).then(function (result) {
        console.log("listarCuentasDetalle", result);
        if (result.length > 0) {
            empuestos.retencion_ica = 0;
            empuestos.retencion_fuente = 0;
            empuestos.impusto_cree = 0;
            totalesFactura.identercero = listarFacturas[0].tercero_id;
            totalesFactura.cuenta = contrato[0].cuenta_contable;
            return G.Q.nfcall(__EncabezadoFacturaDetalle, result, totalesFactura, [], 0, contrato, empuestos);
        } else {
            throw {error: 1, status: 404, mensaje: 'Se produjo un error al consultar las cuentas de la factura'};
        }

    }).then(function (result) {
        if (result !== undefined > 0) {
            param = {'encabezadofactura': encabezado, 'asientoscontables': result};
            callback(false, param);
        } else {
            throw {error: 1, status: 404, mensaje: 'Se produjo un error al crear los asientos contables'};
        }
    }).fail(function (err) {
        var mensaje = {};
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
}

function __enviarReciboRCC(obj, that, callback){
    console.log('In __enviarReciboRCC!!!');
    var documento = {};
    var totalDebito = 0;
    var totalCredito = 0;
    var total = 0;
    var prefijoFI = 'CC';
    var cuenta = 0;
    var lineaCosto = 0;

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarEncabezadoRCD', obj).then(function (result) {
        if (result.length > 0) {
            console.log('\n\n\n\n\n\n\n\n\n');
            console.log('Encabezado: ', result[0]);
            documento.encabezadofactura = result[0];
            obj.empresaRecibo = result[0].empresa_recibo;
            obj.cuentaContable = documento.encabezadofactura.cuenta_contable;
            obj.terceroId = documento.encabezadofactura.tercero_id;
            obj.terceroTipoId = documento.encabezadofactura.tipotercero;
            delete documento.encabezadofactura.cuenta_contable;
            delete documento.encabezadofactura.tercero_id;
            return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarEncabezadoRCD', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro la Factura'};
        }
    }).then(function (result) {
        if (result.length > 0) {
            return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarFacturasDFIN1121', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de la cabecera'};
        }
    }).then(function (result) {
        console.log('listarFacturasDFIN1121: ', result);

        if (result.facturas !== undefined && result.facturas.length > 0) {
            documento.asientoscontables = result.facturas;
            totalCredito += parseFloat(result.credito);

            return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarDetalleRCWSFI', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro el Detalle de la Factura'};
        }
    }).then(function (result) {
        console.log('listarDetalleRCWSFI: ', result);

        if(result.debito !== undefined){
            totalDebito += parseFloat(result.debito);
        }
        if(result.credito !== undefined){
            totalCredito += parseFloat(result.credito);
        }
        if(result.detalle !== undefined && result.detalle.length > 0 && result.detalle[0].linea_costo){
            lineaCosto = result.detalle[0].linea_costo;
        }

        console.log('Fine1!!');

        total = parseFloat(totalCredito - totalDebito);

        console.log('Fine2!!');

        if(obj.empresaRecibo == '0'){
            cuenta = "28050510";
        }else if(obj.empresaRecibo == '1'){
            cuenta = "13101005";
        }
        console.log('Fine3!!');

        var ultimoAsiento = [{
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

        console.log('Fine4!!');

        if(result.detalle != undefined && result.detalle.length > 0){
            documento.asientoscontables = documento.asientoscontables.concat(result.detalle).concat(ultimoAsiento);
        }else{
            documento.asientoscontables = documento.asientoscontables.concat(ultimoAsiento);
        }

        console.log('Fine5!!');

        //console.log('\n\n\n\n\n\n\n\n\n-----------------------------------11', (JSON.stringify(documento)));
        // res.send(G.utils.r(req.url, 'sincronizacionDocumentos!!!!', 200, {sincronizacionDocumentos: true, result: result, parametro: param}));

        callback(false, documento);
    }).fail(function (err) {
        var mensaje = {};
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
}

function __enviarReciboRCD(obj, that, callback) {
    console.log('In __enviarReciboRCD!!!');
    var documento = {};
    var totalDebito = 0;
    var totalCredito = 0;
    var total = 0;
    var prefijoFI = 'NTC';

    G.Q.ninvoke(that.m_SincronizacionDoc, 'listarEncabezadoRCD', obj).then(function (result) {
        if (result.length > 0) {
            console.log('\n\n\n\n\n\n\n\n\n');
            console.log('Encabezado: ', result[0]);
            documento.encabezadofactura = result[0];
            obj.cuentaContable = documento.encabezadofactura.cuenta_contable;
            obj.terceroId = documento.encabezadofactura.tercero_id;
            obj.terceroTipoId = documento.encabezadofactura.tipotercero;
            delete documento.encabezadofactura.cuenta_contable;
            delete documento.encabezadofactura.tercero_id;
            return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarEncabezadoRCD', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro la Factura'};
        }
    }).then(function (result) {
        if (result.length > 0) {

            /*
            result.prefijo = obj.prefijo;
            result.facturaFiscal = obj.facturaFiscal;
            result.terceroId = facturaTalonario[0].tercero_id;
//          parametro.parametrizacionCabeceraFi=result[0].parametrizacionCabeceraFi;
//          parametro.nombre=result[0].nombre;
            result.estadoencabezado = result[0].estadoencabezado;
            result.tipotercero = result[0].tipotercero;
//          parametro.plazotercero=result[0].plazotercero;
//          parametro.numeroradicacion=result[0].numeroradicacion;
            result.codempresa = result[0].codempresa;
            result.coddocumentoencabezado = result[0].coddocumentoencabezado;
            result.observaciones = "Factura " + obj.prefijo + " #" + obj.facturaFiscal;
            */

            return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarFacturasDFIN1121', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de la cabecera'};
        }
    }).then(function (result) {
        console.log('listarFacturasDFIN1121: ', result);

        if (result.facturas !== undefined && result.facturas.length > 0) {
            documento.asientoscontables = result.facturas;

            totalCredito += parseFloat(result.credito);

            return G.Q.ninvoke(that.m_SincronizacionDoc, 'listarDetalleRCWSFI', obj);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro el Detalle de la Factura'};
        }
    }).then(function (result) {
        console.log('listarDetalleRCWSFI: ', result);

        if (result.detalle !== undefined && result.detalle.length > 0) {
            totalDebito += parseFloat(result.debito);
            totalCredito += parseFloat(result.credito);
            total = parseFloat(totalCredito - totalDebito);

            var ultimoAsiento = [{
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

            documento.asientoscontables = documento.asientoscontables.concat(result.detalle).concat(ultimoAsiento);
            //console.log('\n\n\n\n\n\n\n\n\n-----------------------------------11', (JSON.stringify(documento)));
            // res.send(G.utils.r(req.url, 'sincronizacionDocumentos!!!!', 200, {sincronizacionDocumentos: true, result: result, parametro: param}));

            callback(false, documento);
        } else {
            throw {error: 1, status: 404, mensaje: 'No se encontro la parametrizacion de los impuestos'};
        }
    }).fail(function (err) {
        var mensaje = {};
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
}

function __ingresoBonificaciones(obj, that, callback) {
    console.log('In "__ingresoBonificaciones"');
    var documento = {};

    G.Q.ninvoke(that.m_SincronizacionDoc, 'obtenerEncabezadoBonificacion', obj).then(function (result) {
        console.log('"obtenerEncabezadoBonificacion" fine!!');
        if(result !== undefined && result.length > 0){
            documento.encabezadofactura = result[0];

            return G.Q.ninvoke(that.m_SincronizacionDoc, 'obtenerDetalleBonificacion', obj);
        }else{
            throw {error: 1, status: 404, mensaje: 'No se encontro el Encabezado!!'};
        }
    }).then(function(result){
        console.log('"obtenerDetalleBonificacion" fine!!');

        if(result !== undefined && result.facturas !== undefined && result.facturas.length > 0){
            documento.asientoscontables = result.facturas;
            documento.medicamentos_gravados = result.medicamentos_gravados;
            documento.medicamentos_no_gravados = result.medicamentos_no_gravados;
            documento.insumos_gravados = result.insumos_gravados;
            documento.insumos_no_gravados = result.insumos_no_gravados;
            documento.iva = result.iva;
            documento.subtotal = result.subtotal;
            documento.total = result.total;

            return G.Q.ninvoke(that.m_SincronizacionDoc, 'obtenerPrefijoFI', obj);
        }else{
            throw {error: 1, status: 404, mensaje: 'No se encontro el detalle de la bonificacion!!'};
        }
    }).then(function (result) {
        console.log('Finish all function!!');

        if(result !== undefined && result.length > 0){
            obj.prefijoFI = result[0].prefijo_fi; // codigo_documento
            obj.estado = 3;

            //var $encabezado['numerodocumentoencabezado'] = documento.encabezadofactura.numero;
            var date = new Date();
            var mes = String(parseInt(date.getMonth())+1);
            if(mes.length === 1){ mes = '0'+mes; }

            var fecha_documento = date.getDate()+'/'+mes+'/'+date.getFullYear();
            var identificacion_tercero = documento.encabezadofactura.tercero_id;
            var observacion_encabezado = documento.encabezadofactura.observacion;
            var error = { contador: 0, msj: '' };
            var resultado_sincronizacion = false;

            //var usuario_creacion = UserGetUID();

            documento.encabezadofactura.codempresa = "DUA";
            documento.encabezadofactura.coddocumentoencabezado = obj.prefijoFI;

            console.log('Objeto "Documento": ', documento);

            /* =============================== Estructura WS de Bonificaciones =============================== */
            // $encabezado['codempresa'] = $codigo_empresa;

            if (documento.encabezadofactura.codempresa) {
                error.contador++;
                error.msj += 'El Codigo de la Empresa no esta definido';
            }

            if (documento.encabezadofactura.coddocumentoencabezado) {
                error.contador++;
                error.msj += 'El Prefijo FI, no esta parametrizado para ese documento';
            }

            if (documento.encabezadofactura.numero) {
                error.contador++;
                error.msj = 'El numero de factura es obligatorio';
            }

            if (documento.encabezadofactura.tercero_id) {
                error.contador++;
                error.msj = 'El proveedor no posee una identificacion valid';
            }

            if (documento.encabezadofactura.observacion) {
                error.contador++;
                error.msj = 'Debe Ingresar una observacion';
            }

            if(error.contador === 0){
                resultado_sincronizacion = true;
            }

            documento.encabezadofactura.estadoencabezado = 3;
            documento.encabezadofactura.fecharegistroencabezado = fecha_documento;
            documento.encabezadofactura.usuariocreacion = 1350;
            documento.encabezadofactura.tipotercero = 3;

            return G.Q.ninvoke(that.m_SincronizacionDoc, 'cuentasFiltradas', obj);
        }else{
            throw {error: 1, status: 404, mensaje: 'No se encontro el Prefijo del Fi'};
        }
    }).then(function(result){
        console.log('In "cuentasFiltradas"');

        callback(false, result);
    }).fail(function(){
        callback('Hubo un error!!!');
    }).done();
}

function __EncabezadoFacturaDetalle(detalle, totalesFactura, arreglo, index, contrato, empuestos, callback) {

    var cuentas = detalle[index]; //categoria_id

    if (!cuentas) {
        callback(false, arreglo);
        return;
    }

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
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
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
                    ;
                }
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 5://IVA
            if (parseFloat(totalesFactura.iva) > 0) {
                cuentas.valorcreditoasiento = totalesFactura.iva;
                cuentas.valordebitoasiento = 0;
                cuentas.valortasaasiento = totalesFactura.porc_iva;
                cuentas.valorbaseasiento = totalesFactura.medicamentosGravados + totalesFactura.insumosGravados;
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data)
                });
            }
            break;
        case 6://RETEFUENTE

            if (empuestos[0].sw_rtf === '2' || empuestos[0].sw_rtf === '3') {
                if (totalesFactura.subtotal >= parseInt(empuestos[0].base_rtf)) {
                    empuestos.retencion_fuente = parseInt(totalesFactura.subtotal * (contrato[0].porcentaje_rtf / 100));
                    if (empuestos.retencion_fuente > 0) {
                        cuentas.valorcreditoasiento = 0;
                        cuentas.valordebitoasiento = empuestos.retencion_fuente;
                        cuentas.valorbaseasiento = totalesFactura.subtotal;
                        cuentas.valortasaasiento = contrato[0].porcentaje_rtf;
                        __JsonFacturaDetalle(cuentas, function (data) {
                            arreglo.push(data)
                        });
                    }
                }
            }
            break;
        case 7://ICA
            if (empuestos[0].sw_ica === '2' || empuestos[0].sw_ica === '3' && (contrato[0].porcentaje_ica === cuentas.ica_porcentaje)) {
                if (totalesFactura.subtotal >= empuestos[0].base_ica) {
                    empuestos.retencion_ica = parseInt(totalesFactura.subtotal * (contrato[0].porcentaje_ica / 1000));
                  
                    if (empuestos.retencion_ica > 0) {
                        cuentas.valorcreditoasiento = 0;
                        cuentas.valordebitoasiento = empuestos.retencion_ica;
                        cuentas.valorbaseasiento = totalesFactura.subtotal;
                        cuentas.valortasaasiento = contrato[0].porcentaje_ica;
                        __JsonFacturaDetalle(cuentas, function (data) {
                            arreglo.push(data)
                        });
                    }
                }
            }
            break;
        case 10://CREE DEBITO
            empuestos.impusto_cree = Math.round(totalesFactura.subtotal * cuentas.cree_porcentaje);
            if (empuestos.impusto_cree > 0) {
                if (cuentas.sw_cuenta === '0') {
                cuentas.valorcreditoasiento = 0;
                cuentas.valordebitoasiento = empuestos.impusto_cree;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = empuestos.impusto_cree;
                    cuentas.valordebitoasiento = 0;
                }
                cuentas.valorbaseasiento = totalesFactura.subtotal;
                cuentas.valortasaasiento = cuentas.cree_porcentaje;
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data);
                });
            }
            break;
     
        case 23://TOTAL
            var total=0;
            
             total = ((((totalesFactura.medicamentosGravados + totalesFactura.medicamentosNoGravados + totalesFactura.insumosGravados + totalesFactura.insumosNoGravados + totalesFactura.iva) - empuestos.retencion_fuente) - empuestos.retencion_ica));
            console.log("Total1:: ",total);
            if(cuentas.parametrizacion_ws_fi===2){
                total = parseFloat(totalesFactura.subtotal) + parseFloat(totalesFactura.iva) - parseFloat(empuestos.retencion_fuente) - parseFloat(empuestos.retencion_ica);
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
            cuentas.cuenta = contrato[0].cuenta_contable;
            __JsonFacturaDetalle(cuentas, function (data) {
                arreglo.push(data);
            });
            break;
            
        case 28://TOTAL
            var base=0;
            if(totalesFactura.porc_iva!==0){
              base=(totalesFactura.iva / totalesFactura.porc_iva);
            }
            
            var valor=(parseFloat(totalesFactura.subtotal) - base);
//            if (totalesFactura.identercero === cuentas.id_tercero_asiento) {
//
//            }
console.log("/*/*/***/subtotal: ",parseFloat(totalesFactura.subtotal));
console.log("/*/*/***/iva: ",parseFloat(totalesFactura.iva));
console.log("/*/*/***/porc_iva: ",parseFloat(totalesFactura.porc_iva));
console.log("/*/*/***/",valor);
            if (valor > 0) {
                if (cuentas.sw_cuenta === '0') {
                    cuentas.valorcreditoasiento = 0;
                    cuentas.valordebitoasiento = valor;
                } else if (cuentas.sw_cuenta === '1') {
                    cuentas.valorcreditoasiento = valor;
                    cuentas.valordebitoasiento = 0;
                }
                cuentas.valorbaseasiento = 0;

                cuentas.cuenta = contrato[0].cuenta_contable;
                __JsonFacturaDetalle(cuentas, function (data) {
                    arreglo.push(data);
                });
            }
            break;
    }

    var timer = setTimeout(function () {
        index++;
        __EncabezadoFacturaDetalle(detalle, totalesFactura, arreglo, index, contrato, empuestos, callback);
        clearTimeout(timer);
    }, 0);
}

function __JsonFacturaDetalle(obj, callback) {
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
    callback(detalle);
}

function __JsonFacturaEncabezado(obj, callback) {
    var encabezado = {
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
    "m_caja_general"
];

module.exports = SincronizacionDocumentos;