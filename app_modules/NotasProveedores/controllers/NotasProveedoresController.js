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
  

    G.Q.ninvoke(that.m_notasProveedores, 'TiposDoc', {})
        .then(resultado => {
            return res.send(G.utils.r(req.url, 'Lista de Tipos de documentos!!', 200, {tiposDoc: resultado}));
        }).fail(err => {
            console.log('Hubo un error: ', err);
            return res.send(G.utils.r(req.url, 'Error al listar Nota Proveedor!!', 500, {err: err}));
        });
};

NotasProveedores.prototype.listarNotasProveedor = (req, res) => {
   
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
    console.log('In controller "agregarDetalleTemporal"');

    G.Q.nfcall(__guardarTemporalDetalle, obj, 0)
        .then(response => {
            res.send(G.utils.r(res.url, 'Detalle del temporal creado con exito!!', 200, {}));
        })
        .catch(err => {
            console.log('Error: ', err);
            res.send(G.utils.r(res.url, err, 500, {err}));
        });
};

NotasProveedores.prototype.eliminarProductoTemporal = (req, res) => {
  
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
  
    let parametros = req.body.data;
    var data = {temporal: {}, factura: {}};
    parametros.empresaId = req.body.session.empresaId;
    parametros.usuarioId = req.body.session.usuario_id;
    parametros.modulo = 'Inv_NotasFacturasProveedor';
    parametros.number_money = number_money;
    parametros.conceptoGeneralDefaultCod = '1';
    parametros.conceptoGeneralDefaultNombre = 'Facturacion';
    parametros.conceptoEspecificoDefaultCod = '07';
    parametros.conceptoEspecificoDefaultNombre = 'Medicamentos';
    const concepGenId = parametros.conceptoGeneralDefaultCod;

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
            return G.Q.ninvoke(that.m_notasProveedores, 'conceptosGenerales', parametros);
        }).then(response => {
            data.conceptosGenerales = response;
            return G.Q.ninvoke(that.m_notasProveedores, 'conceptosEspecificos', {conceptoGeneral: concepGenId});
        }).then(response => {
            data.conceptosEspecificos = response;
            return G.Q.ninvoke(that.m_notasProveedores, 'facturaDetalle', parametros, data.temporal.detalle.all, response);
        }).then(response => {
            data.factura.detalle = response; //
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
        }).fail(err => {
            console.log('Error: ', err);
            return res.send(G.utils.r(req.url, 'Error al guardar temporal', 500, {err: err}));
        });
};

NotasProveedores.prototype.crearNota = (req, res) => {
 
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

NotasProveedores.prototype.listarRetencionesAnuales = (req, res) => {
  
    let parametros = req.body.data;
    let retenciones = {};

    G.Q.ninvoke(that.m_notasProveedores, 'ParametrosRetencion', parametros, temporal)
        .then(response => {
            retenciones = response;
            res.send(G.utils.r(req.url, 'Listando Retenciones', 200, retenciones));
        }).fail(err => {
            res.send(G.utils.r(req.url, 'Hubo un error', 500, err));
        });
};

const promesa = new Promise((resolve, reject) => { resolve(true); });

NotasProveedores.prototype.imprimirNota = (req, res) => {
   
    let session = req.body.session;
    let parametros = req.body.data;
    parametros.rows.totalReteFuente = 0;
    parametros.rows.totalReteIca = 0;
    parametros.rows.totalReteIva = 0;
    parametros.rows.totalIva = 0;
    parametros.rows.reteFuente = 0;
    parametros.rows.reteIca = 0;
    parametros.rows.totalNotaConRetenciones = 0;
    parametros.number_money = number_money;
    let reteFuente = 0;
    let reteIca = 0;
    let reteIva = 0;
    let totalIva = 0;

    parametros.empresaId = session.empresaId;
    parametros.bodegaId = session.bodega;
    parametros.facturaPrefijo = parametros.rows.prefijo;
    parametros.facturaNumero = parametros.rows.numero;
    parametros.tabla = parametros.rows.tabla;
    parametros.rows.base_url = G.dirname + '/public/dusoft_duana/NotasProveedores/reports';
    parametros.rows.bootstrap = G.dirname + '/public/stylesheets/bootstrap.min.css';
    // parametros.rows.style0 = parametros.rows.base_url + "/style.css";
    parametros.rows.style = parametros.rows.base_url + "/style-print.css";
    parametros.rows.logo = '';
    parametros.rows.itemsHtml = `
        <tr align="center">
            <td><p><b>CODIGO PRODUCTO</b></p></td>
            <td><p><b>DESCRIPCION</b></p></td>
            <td><b>CANTIDAD</b></td>
            <td><b>%IVA</b></td>
            <td><b>VALOR UND.</b></td>
            <td><b>VALOR C./UND.</b></td>         
            <td><b>VALOR C.</b></td>                                           
        </tr>
    `;

    parametros.rows.tipoNota = parametros.rows.tipoNota.toUpperCase();

    for (let item of parametros.rows.detalle) {
        item.descripcion = item.descripcion.toLowerCase();

        reteFuente = 0;
        reteIca = 0;
        reteIva = 0;
        totalIva = 0;

        if(!item.cantidad_devuelta) {
            item.cantidad_devuelta = 0;
        }

        if(item.porc_iva > 0) {
            item.porc_iva = item.porc_iva / 100;
        }else{
            item.porc_iva = 0;
        }
        totalIva = (item.valorUnitario * (item.cantidad - item.cantidad_devuelta)) * item.porc_iva;

        if(parametros.rows.retencionAnual.sw_rtf === '2' || parametros.rows.retencionAnual.sw_rtf === '3') {
            if (item.subtotal >= parametros.rows.retencionAnual.base_rtf) {
                parseFloat(reteFuente = item.valor_concepto * (item.porc_rtf / 100));
            }
        }
        if(parametros.rows.retencionAnual.sw_ica === '2' || parametros.rows.retencionAnual.sw_ica === '3') {
            if(item.subtotal >= parametros.rows.retencionAnual.base_ica) {
                parseFloat(reteIca = item.valor_concepto * (item.porc_ica / 1000));
            }
        }
        /*  CONDICIONAL COMENTADO EN EL PHP
            if($parametros_retencion['sw_reteiva']=='2' ||$parametros_retencion['sw_reteiva']=='3')
                if($dtl['iva'] >= $parametros_retencion['base_reteiva'])
                    $ret_iva = $dtl['iva']*($this->datos['porc_rtiva']/100);
        */
        parametros.rows.totalReteFuente += reteFuente;
        parametros.rows.totalReteIca += reteIca;
        parametros.rows.totalReteIva += reteIva;
        parametros.rows.totalIva += totalIva;

        // item.descripcion.charAt(0) = item.descripcion.charAt(0).toUpperCase();

        parametros.rows.itemsHtml += `                    
            <tr align="center">
                <td>${item.codigo_producto}</td>
                <td align="left">${item.descripcion}</td>
                <td>${item.cantidad}<input type="hidden" name="cantidad0" id="cantidad0" value="40040"></td>
                <td class="normal_10AN">${item.porc_iva}</td>
                <td class="normal_10AN">${item.valorUnitarioString}</td>                       
                <td class="normal_10AN">${item.conceptoUnidadString}</td>     
                <td class="normal_10AN">${item.valorConceptoString}</td>                                                                                                                                                                               
            </tr>
            <tr class="modulo_list_oscuro">
                <td style="border-right: 0px;">
                    <p><b>OBSERVACION:</b></p>                                                                                                                                                                                                                            
                </td>
                <td colspan="6" style="border-left: 0px; text-align: justify;">
                    <p>${item.observacion}</p>
                </td>                        
            </tr>
        `;
    }
    parametros.rows.totalReteFuenteString = parametros.number_money(String(parametros.rows.totalReteFuente));
    parametros.rows.totalReteIcaString = parametros.number_money(String(parametros.rows.totalReteIca));
    parametros.rows.totalReteIvaString = parametros.number_money(String(parametros.rows.totalReteIva));
    parametros.rows.totalIvaString = parametros.number_money(String(parametros.rows.totalIva));
    parametros.rows.totalNotaConRetenciones = parseFloat(parametros.rows.valorNota + parametros.rows.totalReteFuente + parametros.rows.totalReteIca + parametros.rows.totalReteIva + parametros.rows.totalIva);
    parametros.rows.totalNotaConRetencionesString = parametros.number_money(String(parametros.rows.totalNotaConRetenciones));
    // console.log('Html es:\n\n', parametros.rows.itemsHtml, '\n\n');

    if(parametros.bodegaId === '06') {
        parametros.rows.logo = '<img src="{#asset /cosmitet.png @encoding=dataURI}" style="display:block" border="0" width="300px" height="80px"/>';
    } else {
        parametros.rows.logo = '<img src="{#asset /logocliente.png @encoding=dataURI}" style="display:block" border="0" width="300px" height="80px"/>';
    }

    promesa
        .then(response => {

            let obj = {
                parametrosImpresion: {
                    template: {
                        content: G.fs.readFileSync('app_modules/NotasProveedores/reports/nota_base.html', 'utf8'),
                        helpers: G.fs.readFileSync('app_modules/NotasProveedores/reports/javascript/helpers.js', 'utf8'),
                        recipe: "phantom-pdf",
                        engine: 'jsrender',
                        phantom: {
                            margin: "10px",
                            width: '792px',
                            headerHeight: "290px", // .imagent{position: absolute;top: 10px;}
                            footer: ``,
                            header:
                                `<head>
                                    <link href=${parametros.rows.style} rel="stylesheet" type="text/css">
                                </head>
                                <table width="100%" border="0" cellpadding="4" cellspacing="4">
                                    <tbody>
                                    <tr>
                                        <td rowspan="2">
                                            ${parametros.rows.logo}                                                                                     
                                        </td>
                                        <td width="100%" align="center" valign="center">
                                            <center><b style="font-family: sans_serif, Verdana, helvetica, Arial; font-weight:bold;font-size:10pt">NOTA {{:tipoNota}} PROVEEDOR</b>
                                            </center>
                                            <b style="font-family: sans_serif, Verdana, helvetica, Arial; font-weight:bold;font-size:10pt"><br></b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" valign="top"></td>
                                    </tr>
                                    </tbody>
                                </table>
                                `

                        }
                    },
                    data: parametros.rows
                }
            };
            return G.Q.nfcall(__generarReporteFactura, obj);
        }).then(resultado6 => {
            parametros.url = resultado6;
            return G.Q.ninvoke(that.m_notasProveedores, 'updateUrlNota', parametros);
        }).then(response => {
            res.send(G.utils.r(req.url, 'Fine!', 200, parametros.url));
        }).catch(err => {
            console.log('Error: ', err);
            res.send(G.utils.r(req.url, 'Bad!', 500, err));
        });
};

NotasProveedores.prototype.verNotasFactura = function(req, res){
  
    let notas = {
        encabezado: {},
        tipos: {
            all: [],
            debito: {
                detalle: []
            },
            credito: {
                detalle: []
            }
        }
    };
    let parametros = req.body.data;
    parametros.number_money = number_money;
    parametros.tabla = 'inv_notas_debito_proveedor';
    parametros.empresaId = req.body.session.empresaId;

    G.Q.ninvoke(that.m_notasProveedores, 'verNotasFactura', parametros)
        .then(notasDebito => {
            notas.tipos.debito.titulo = 'Debito';
            notas.tipos.debito.nombre = 'debito';
            if(notasDebito && notasDebito.length > 0){
                notas.tipos.debito.detalle = notasDebito;
                notas.tipos.all = notas.tipos.all.concat(notas.tipos.debito);
            }
            parametros.tabla = 'inv_notas_credito_proveedor';
            return G.Q.ninvoke(that.m_notasProveedores, 'verNotasFactura', parametros);
        }).then(notasCredito => {
            notas.tipos.credito.titulo = 'Credito';
            notas.tipos.credito.nombre = 'credito';
            if(notasCredito && notasCredito.length > 0){
                notas.tipos.credito.detalle = notasCredito;
                notas.tipos.all = notas.tipos.all.concat(notas.tipos.credito);
            }
            if(notas.tipos.all.length > 0){
                notas.encabezado.facturaId = notas.tipos.all[0].detalle[0].numero_factura;
            }
            res.send(G.utils.r(req.url, 'Notas encontradas', 200, notas));
        }).fail(err => {
            console.log('Hubo un error: ', err);
            res.send(G.utils.r(req.url, 'Notas encontradas', 500, err));
        });
};

/*************************************/
/********* FUNCIONES FORMATO ********/
/***********************************/

const number_money = (price) => {
    let newPrice = new Intl.NumberFormat("de-DE").format(price);
    newPrice = '$' + newPrice
        .replace(/(,)/g, "coma")
        .replace(/(\.)/g, "punto")
        .replace(/(coma)/g, ".")
        .replace(/(punto)/g, ",");
    return newPrice;
};

const __generarReporteFactura = (data, callback) => {
    G.jsreport.render(data.parametrosImpresion, (err, response) => {
        if(err) {
            console.log('Error en funcion PDF', err);
            callback(err);
        } else {
            response.body(body => {
                let fecha_actual = new Date();
                let nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";
                let reporte = "/public/reports/" + nombre_reporte;
                let reporte_imprimir = "/reports/" + nombre_reporte;
                G.fs.writeFile(G.dirname + reporte, body, "binary", err => {
                    if (err) {
                        console.log('error2 en funcion PDF', err);
                        callback(err);
                    } else {
                        callback(false, reporte_imprimir);
                    }
                });
            });
        }
    });
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
            return G.Q.ninvoke(that.m_notasProveedores, 'insertNotaProveedorDetalle', nota, transaccion);
        }).then(response => {
            return G.Q.ninvoke(that.m_notasProveedores, 'updateFacturasProveedores', nota, transaccion);
        }).then(response => {
            return G.Q.ninvoke(that.m_notasProveedores, 'updateDocumentos', nota, transaccion);
        }).then(response => {
            return G.Q.ninvoke(that.m_notasProveedores, 'eliminarProductosTemporal', nota, transaccion);
        }).then(response => {
            index++;
            __recorrerNotas(notas, index, transaccion, callback);
        }).fail(err => {
            let error = {err: err, transaccion: transaccion};
            callback(error);
        }).done();
}

NotasProveedores.$inject = ["m_notasProveedores"];
module.exports = NotasProveedores;
