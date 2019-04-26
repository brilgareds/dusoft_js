/* global G */
let that;

var NotasProveedores = function (m_notasProveedores) {
    that = this;
    that.m_notasProveedores = m_notasProveedores;
};

/****************************************/
/********* FUNCIONES PRINCIPALES ******/
/************************************/

NotasProveedores.prototype.TiposDoc = (req, res) => {
    console.log('In controller "TiposDoc"');

    G.Q.ninvoke(that.m_notasProveedores, 'TiposDoc', {})
        .then(resultado => {
            return res.send(G.utils.r(req.url, 'Lista de Tipos de documentos!!', 200, {tiposDoc: resultado}));
        }).fail(err => {
            console.log('Hubo un error: ', err);
            return res.send(G.utils.r(req.url, 'Error al listar Nota Proveedor!!', 500, {err: err}));
        });
};

NotasProveedores.prototype.listarNotasProveedor = (req, res) => {
    console.log('In controller "listarNotasProveedores"');
    let parametros = req.body.data;
    parametros.empresaId = req.body.session.empresaId;

    G.Q.ninvoke(that.m_notasProveedores, 'listarNotasProveedor', parametros)
        .then(resultado => {
            return res.send(G.utils.r(req.url, 'Lista de Notas Proveedor!!', 200, {notasProveedor: resultado}));
        }).fail(err => {
        return res.send(G.utils.r(req.url, 'Error al listar Nota Proveedor!!', 500, {err: err}));
    });
};

NotasProveedores.prototype.conceptosEspecificos = (req, res) => {
    console.log('In controller "conceptosEspecificos"');
    let obj = req.body.data;

    G.Q.ninvoke(that.m_notasProveedores, 'conceptosEspecificos', obj)
        .then(response => {
            return res.send(G.utils.r(req.url, 'Glosas Concepto Especifico encontradas!', 200, response));
        })
        .fail(err => {
            console.log(err);
            return res.send(G.utils.r(req.url, 'Error al guardar temporal', 500, {err: err}));
        });
};

NotasProveedores.prototype.agregarDetalleTemporal = (req, res) => {
    let obj = req.body.data;
    obj.errCount = 0;
    obj.empresaId = req.body.session.empresaId;
    obj.usuarioId = req.body.session.usuario_id;
    console.log('In controller "crearNota"');

    G.Q.nfcall(__guardarTemporalDetalle, obj)
        .then(response => {
            res.send(G.utils.r(res.url, 'Detalle del temporal creado con exito!!', 200, {}));
        })
        .catch(err => {
            console.log('Error: ', err);
            res.send(G.utils.r(res.url, err, 500, {err}));
        });
};

NotasProveedores.prototype.eliminarProductoTemporal = (req, res) => {
    console.log('In controller "eliminarProductoTemporal"');
    let parametros = req.body.data;

    G.Q.ninvoke(that.m_notasProveedores, 'eliminarProductoTemporal', parametros)
        .then(response => {
            res.send(G.utils.r(req.url, 'Producto eliminado!!', 200, response));
        }).fail(err => {
        console.log('err: ', err);
        res.send(G.utils.r(req.url, 'Hubo un error', 500, {err: err}));
    });
};

NotasProveedores.prototype.crearNotaTemporal = (req, res) => {
    console.log('In controller "temporalDetalle"');
    let parametros = req.body.data;
    var data = {temporal: {}, factura: {}};
    parametros.empresaId = req.body.session.empresaId;
    parametros.usuarioId = req.body.session.usuario_id;
    parametros.modulo = 'Inv_NotasFacturasProveedor';
    parametros.number_money = number_money;

    G.Q.ninvoke(that.m_notasProveedores, 'temporalEncabezado', parametros) // Busca o crea el encabezado del temporal
        .then(response => {
            data.temporal.encabezado = response;
            return G.Q.ninvoke(that.m_notasProveedores, 'temporalDetalle', parametros);
        }).then(response => {
        data.temporal.detalle = response;
        data.temporal.detalle.totalBajaCostoString = number_money(String(data.temporal.detalle.totalBajaCosto));
        data.temporal.detalle.totalSubeCostoString = number_money(String(data.temporal.detalle.totalSubeCosto));
        return G.Q.ninvoke(that.m_notasProveedores, 'ParametrosNota', parametros);
    }).then(response => {
        data.parametrosNota = response;
        return G.Q.ninvoke(that.m_notasProveedores, 'facturaDetalle', parametros, data.temporal.detalle.all);
    }).then(response => {
        data.factura.detalle = response;
        return G.Q.ninvoke(that.m_notasProveedores, 'conceptosGenerales', parametros);
    }).then(response => {
        data.conceptosGenerales = response;
        return G.Q.ninvoke(that.m_notasProveedores, 'ParametrosRetencion', parametros, data.temporal);
    }).then(response => {
        data.retencionAnual = response;
        data.temporal.encabezado.totalConRetenciones =
            (
                (
                    (
                        (
                            (data.temporal.encabezado.total) -
                            data.retencionAnual.retencionFuente) -
                        data.retencionAnual.retencionIca) -
                    data.retencionAnual.retencionIva) -
                data.temporal.encabezado.valor_descuento);
        data.temporal.encabezado.totalConRetencionesString = number_money(String(data.temporal.encabezado.totalConRetenciones));
        return res.send(G.utils.r(req.url, 'Temporal guardado con exito', 200, data));
    }).fail(function (err) {
        console.log('Error: ', err);
        return res.send(G.utils.r(req.url, 'Error al guardar temporal', 500, {err: err}));
    });
};

NotasProveedores.prototype.crearNota = (req, res) => {
    console.log('In controller "crearNota"');
    let parametros = req.body.data;
    let parametrosNota = parametros.parametrosNota;
    let temporal = parametros.temporal;
    let tiposNotas = [];

    const debito = {
        encabezado: temporal.encabezado,
        documentoId: parametrosNota.documento_id_debito,
        parametros: parametrosNota,
        prefijo: parametrosNota.prefijo_debito,
        numeracion: parametrosNota.numeracion_debito,
        items: temporal.detalle.bajaCosto,
        tabla: 'inv_notas_debito_proveedor',
        tablaDetalle: 'inv_notas_debito_proveedor_d',
        tipoNota: 'debito',
        valorNota: temporal.detalle.totalBajaCosto,
        signo: '-'
    };
    const credito = {
        encabezado: temporal.encabezado,
        documentoId: parametrosNota.documento_id_credito,
        parametros: parametrosNota,
        prefijo: parametrosNota.prefijo_credito,
        numeracion: parametrosNota.numeracion_credito,
        items: temporal.detalle.subeCosto,
        tabla: 'inv_notas_credito_proveedor',
        tablaDetalle: 'inv_notas_credito_proveedor_d',
        tipoNota: 'credito',
        valorNota: temporal.detalle.totalSubeCosto,
        signo: '+'
    };

    if(debito.items.length > 0){
        tiposNotas.push(debito);
    }
    if(credito.items.length > 0){
        tiposNotas.push(credito);
    }

    G.knex.transaction(transaccion => {
        return G.Q.nfcall(__recorrerNotas, tiposNotas, 0, transaccion);
    }).then(transaccion => {
        transaccion.commit();
        return res.send(G.utils.r(req.url, 'fine!', 200, true));
    }).catch(err => {
        console.log('Obj Error es: ', err);
        err.transaccion.rollback();
        console.log('Hubo un error: ', err.err);
        return res.send(G.utils.r(req.url, 'Hubo un error!', 500, err.err));
    });
};

NotasProveedores.prototype.verNotasFactura = function(req, res){
    console.log('In controller "verNotasFactura"');
    let notas = { all: [] };
    let parametros = req.body.data;
    parametros.tabla = 'inv_notas_debito_proveedor';

    G.Q.ninvoke(that.m_notasProveedores, 'verNotasFactura', parametros)
        .then(notasDebito => {
            if(notasDebito && notasDebito.length > 0){
                notas.debito = notasDebito;
                notas.all = notas.all.concat(notasDebito);
            }
            parametros.tabla = 'inv_notas_credito_proveedor';
            return G.Q.ninvoke(that.m_notasProveedores, 'verNotasFactura', parametros);
        }).then(notasCredito => {
            if(notasCredito && notasCredito.length > 0){
                notas.credito = notasCredito;
                notas.all = notas.all.concat(notasCredito);
            }
            res.send(G.utils.r(req.url, 'Notas encontradas', 200, notas));
        }).fail(err => {
            res.send(G.utils.r(req.url, 'Notas encontradas', 500, err));
        });
};

/*************************************/
/********* FUNCIONES FORMATO ********/
/***********************************/

let number_money = (price) => {
    const number = String(price.replace(/(\D)/g, ""));
    price = new Intl.NumberFormat("de-DE").format(number);
    price = '$' + price.replace(/(,)/g, "coma").replace(/(\.)/g, "punto").replace(/(coma)/g, ".").replace(/(punto)/g, ",");
    return price;
};

/****************************************/
/********* FUNCIONES RECURSIVAS ********/
/***************************************/

function __guardarTemporalDetalle(detalles, index=0, callback) {
    let detalle = detalles[index];
    if(!detalle){
        callback(false, true);
        return true;
    }
    detalle.empresaId = detalles.empresaId;
    detalle.usuarioId = detalles.usuarioId;

    G.Q.ninvoke(that.m_notasProveedores, 'guardarTemporalDetalle', detalle)
        .then(response => {
            __guardarTemporalDetalle(detalles, index+1, callback);
        })
        .catch(err => {
            callback(err);
        });
}

function __insertNotaProveedor(tiposNotas, transaccion, callback) {
    const magnitud = tiposNotas.length;

    tiposNotas.forEach((nota, key) => {
        G.Q.ninvoke(that.m_notasProveedores, 'insertNotaProveedor', nota, transaccion)
            .then(response => {
                if (key === magnitud - 1) {
                    callback(false, response);
                }
            }).catch(err => {
            console.log('Hubo un error: ', err);
            transaccion.rollback(err);
            callback(err);
        });
    });
}

function __recorrerNotas(notas, index, transaccion, callback) {
    let nota = notas[index];
    if(!nota){
        callback(false, transaccion);
        return true;
    }

    G.Q.ninvoke(that.m_notasProveedores, 'insertNotaProveedor', nota, transaccion)
        .then(response => {
            return G.Q.ninvoke(that.m_notasProveedores, 'insertNotaProveedorDetalle', nota, transaccion)
        }).then(response => {
            return G.Q.ninvoke(that.m_notasProveedores, 'updateFacturasProveedores', nota, transaccion)
        }).then(response => {
            return G.Q.ninvoke(that.m_notasProveedores, 'updateDocumentos', nota, transaccion)
        }).then(response =>{
            index++;
            __recorrerNotas(notas, index, transaccion, callback);
        }).fail(err => {
            let error = {err: err, transaccion: transaccion};
            callback(error);
        }).done();
}

NotasProveedores.$inject = ["m_notasProveedores"];
module.exports = NotasProveedores;
