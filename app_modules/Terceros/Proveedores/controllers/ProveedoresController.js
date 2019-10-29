let that;
var Proveedores = function(proveedores) {
    this.m_proveedores = proveedores;
    that = this;
};

Proveedores.prototype.listarProveedores = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.proveedores === undefined || args.proveedores.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda o pagina_actual no esta definido', 404, {}));
        return;
    }

    var termino_busqueda = args.proveedores.termino_busqueda;

    that.m_proveedores.listar_proveedores(termino_busqueda, function(err, lista_proveedores) {
        if (err)
            res.send(G.utils.r(req.url, 'Error listando los proveedores', 500, {}));
        else {
            res.send(G.utils.r(req.url, 'Lista de proveedores', 200, {proveedores: lista_proveedores}));
        }
    });
};

const ws_buscar_tercero = (obj, callback) => {
    const url = 'http://172.16.29.240:8080/SinergiasFinanciero3-ejb/terceroGeneralGet/terceroGeneralGet?wsdl';
    let response;

    G.Q.nfcall(G.soap.createClient, url)
        .then(client => {
            return G.Q.ninvoke(client, "buscarTerceroGeneralDocumento", obj);
        }).spread((result, raw, soapHeader) => {
            if (result && result.buscarTerceroGeneralDocumentoResult) {
                response = result.buscarTerceroGeneralDocumentoResult;
            }
            callback(false, response);
        }).fail(err => {
            console.log('Error in "ws_buscar_tercero"');
            callback(err);
        });
};

const ws_buscar_direccion_tercero = (obj, callback) => {
    const url = 'http://172.16.29.240:8080/SinergiasFinanciero3-ejb/terceroGeneralGet/terceroGeneralGet?wsdl';
    let response = {};

    Promise.resolve(true)
        .then(response => {
            return G.Q.nfcall(G.soap.createClient, url);
        }).then(client => {
            return G.Q.ninvoke(client, "buscarTerceroId", { idtercero: obj.idtercero }); // metodo = 'todos_pacientes';
        }).then(result => {
            if (!result || !result[0] || !result[0].buscarTerceroIdResult) {
                const err = {
                    status: 300,
                    msg: 'No se encontro direccion del tercero\n'
                };
                throw err;
            }

            response = result[0].buscarTerceroIdResult;

            callback(false, response);
        }).catch(err => { callback(false, err); } );
};

const ws_tercero_clasificacionFiscal = (obj, callback) => {
    const url = 'http://172.16.29.240:8080/SinergiasFinanciero3-ejb/TerceroClasificacionFiscalGet/TerceroClasificacionFiscalGet?wsdl';
    let response;

    Promise.resolve(true)
        .then(response => {
            return G.Q.nfcall(G.soap.createClient, url);
        }).then(client => {
            return G.Q.ninvoke(client, "datosClasificacionFiscalTercero", obj); // metodo = 'todos_pacientes';
        }).then(result => { // Service without response
            if (result && result.length && result[0] && result[0].datosClasificacionFiscalTerceroResult) {
                response = result[0].datosClasificacionFiscalTerceroResult;
            }
            callback(false, response);
        }).catch(err => {
            console.log('Error in "ws_tercero_clasificacionFiscal": ', err);
            callback(err);
        });
};

const ws_tercero_naturaleza = (obj, callback) => {
    const url = 'http://172.16.29.240:8080/SinergiasFinanciero3-ejb/terceroGeneralGet/terceroGeneralGet?wsdl';
    let naturaleza;

    Promise.resolve(true)
        .then(response => {
            return G.Q.nfcall(G.soap.createClient, url);
        }).then(client => {
            return G.Q.ninvoke(client, 'buscarNaturalezaTercero', obj); // metodo = 'todos_pacientes'; 4488190001850797
        }).then(result => {
            if (result && result.length) {
                const natura = result[0].buscarNaturalezaTerceroResult.split(',');
                naturaleza = natura[0] === '0' ? 1:0;
            }
            callback(false, naturaleza);
        }).catch(err => {
            console.log('Error in "ws_tercero_naturaleza": ', err);
            callback(err);
        });
};

const ws_buscar_tercero_proveedor = (obj, callback) => {
    const url = 'http://172.16.29.240:8080/SinergiasFinanciero3-ejb/getTercerosProveedorWS/getTercerosProveedorWS?wsdl';
    let response;

    Promise.resolve(true)
        .then(response => {
            return G.Q.nfcall(G.soap.createClient, url);
        }).then(client => {
            return G.Q.ninvoke(client, 'terceroProveedorClienteIden', obj); // metodo = 'todos_pacientes'; 4488190001850797
        }).then(result => {
            if (result && result.length && result[0] && result[0].terceroProveedorClienteIdenResult) {
                response = result[0].terceroProveedorClienteIdenResult;
            }
            callback(false, response);
        }).catch(err => {
            console.log('Error in "ws_buscar_tercero_proveedor": ', err);
            callback(err);
        });
};

const ws_tercero_impuestos = (obj, callback) => {
    const url = 'http://172.16.29.240:8080/SinergiasFinanciero3-ejb/TerceroClasificacionFiscalGet/TerceroClasificacionFiscalGet?wsdl';
    let response;

    Promise.resolve(true)
        .then(response => {
            return G.Q.nfcall(G.soap.createClient, url);
        }).then(client => {
            return G.Q.ninvoke(client, 'impuestoretefuentecodigo', obj); // metodo = 'todos_pacientes'; 4488190001850797
        }).then(result => {
            if (result && result.length && result[0].impuestoretefuentecodigoResult) {
                response = result[0].impuestoretefuentecodigoResult;
            }
            callback(false, response);
        }).catch(err => {
            console.log('Error in "ws_buscar_tercero_proveedor": ', err);
            callback(err);
        });
};

const ws_tercero_impuestoRteIca = (obj, callback) => {
    const url = 'http://172.16.29.240:8080/SinergiasFinanciero3-ejb/TerceroClasificacionFiscalGet/TerceroClasificacionFiscalGet?wsdl';
    let response;

    Promise.resolve(true)
        .then(response => {
            return G.Q.nfcall(G.soap.createClient, url);
        }).then(client => {
            return G.Q.ninvoke(client, 'impuestoreteica', obj); // metodo = 'todos_pacientes'; 4488190001850797
        }).then(result => {
            if (result && result.length && result[0].impuestoreteicaResult) {
                response = result[0].impuestoreteicaResult;
            }
            callback(false, response);
        }).catch(err => {
            console.log('Error in "ws_buscar_tercero_proveedor": ', err);
            callback(err);
        });
};

const ws_tercero_impuestoReteIvaCodigo = (obj, callback) => {
    const url = 'http://172.16.29.240:8080/SinergiasFinanciero3-ejb/TerceroClasificacionFiscalGet/TerceroClasificacionFiscalGet?wsdl';
    let response;

    Promise.resolve(true)
        .then(response => {
            return G.Q.nfcall(G.soap.createClient, url);
        }).then(client => {
            // RETE IVA
            return G.Q.ninvoke(client, 'impuestoreteivacodigo', obj); // metodo = 'todos_pacientes'; 4488190001850797
        }).then(result => {
            if (result && result.length && result[0].impuestoreteivacodigoResult) {
                response = result[0].impuestoreteivacodigoResult;
            }
            callback(false, response);
        }).catch(err => {
            console.log('Error in "ws_buscar_tercero_proveedor": ', err);
            callback(err);
        });
};

const ws_tercero_proveedor = (data, callback) => {
    // data viene desde "listarOrdenesCompra", se reciben tres valores......1º nit, 2º tercero_id, 3º tipo
    const tipo = data.tipo;
    const tercero_documento = data.tercero_documento;
    const userId = data.userId;
    const codigofuente = 33; // Con esto sacan el reteFuente
    const codigoiva = 13; // Con esto sacan el reteIva
    const codigoempresa = 'MAD'; // Con esto sacan el ica, tipoContribuyente y el tipoRetencion

    let existeTerceroEnAsistencial = false;
    let existeProveedorEnAsistencial = false;
    let existeTerceroEnFinanciero = false;
    let existeProveedorEnFinanciero = false;
    var logs = '';
    let finish = false;
    let existe = 0;
    var tercero = {};
    let idtercero = '';

    // tipo = 0 AFECTA SOLO LA TABLA DE TERCEROS
    // tipo = 1 AFECTA TABLA DE TERCEROS Y TERCEROS PROVEEDORES

    Promise.resolve(true)
        .then(response => {
            const promiseAsistencialTercero = Promise.resolve(true)
                .then(response => {
                    return G.Q.ninvoke(that.m_proveedores, 'verExistenciaTerceroAsistencial', tercero_documento);
                }).then(response => {
                    existeTerceroEnAsistencial = response;
                    return true;
                }).catch(err => { logs += err.msg; });
            const promiseAsistencialProveedor = Promise.resolve(true)
                .then(response => {
                    return G.Q.ninvoke(that.m_proveedores, 'verExistenciaProveedorAsistencial', tercero_documento);
                }).then(response => {
                    existeProveedorEnAsistencial = response;
                    if (!existeProveedorEnAsistencial) {
                        logs += 'Tercero no existe como proveedor en Asistencial\n';
                        return logs;
                    } else {
                        const err = { status: 300, msg: 'Tercero ya existe como proveedor en Asistencial\n' };
                        throw err;
                    }
                }).catch(err => { throw err; });
            const promiseFinancieroTercero = Promise.resolve(true)
                .then(response => {
                    const obj = { numeroidentificacion: tercero_documento };
                    return G.Q.nfcall(ws_buscar_tercero, obj);
                }).then(response => {
                    if (!response || !response.estadotercero) {
                        const err = {
                            status: 300,
                            msg: 'Tercero no existe como proveedor en el FI\n'
                        };

                        throw err;
                    } else {
                        existeTerceroEnFinanciero = true;

                        Object.assign(tercero, {
                            id : response.idtercero,
                            documento : tercero_documento,
                            tipodocumento : response.tipodocumento,
                            estado : response.estadotercero,
                            userId : userId
                        });

                        idtercero = response.idtercero;
                        // throw { status: 300, msg: 'Vamos bien!' };
                        // EMPIEZA INTEGRACIÓN DUSOFT FINANCIERO Y DUSOFT ASISTENCIAL PARA CREAR TERCERO EN CASO DE LA NO EXISTENCIA
                        return true;
                    }
                }).catch(err => { throw err; });
            const promiseFinancieroProveedor = Promise.resolve(true)
                .then(response => {
                    return true;
                }).then(response => {
                    if (tipo === 1) {
                        const obj = { idempresa: 1, numeroidentificacion: tercero_documento };
                        return G.Q.nfcall(ws_buscar_tercero_proveedor, obj); // funcion ws "terceroProveedorClienteIden"
                    } else { return 'finish'; }
                }).then(response => {
                    if (response === 'finish') return true;

                    if (!response || !response.idtercero) {
                        const err = {
                            status: 300,
                            msg: 'No se encontro Id del tercero!'
                        };
                        throw err;
                    } else {
                        existeProveedorEnFinanciero = true;
                        tercero.estadoproveedor = response.estadotercero;
                        tercero.razonsocial = response.razonsocial;
                        tercero.id = response.idtercero;
                        return tercero.id;
                    }
                }).catch(err => { logs += (err.msg || ''); } );
            return Promise.all([promiseFinancieroProveedor, promiseAsistencialTercero, promiseAsistencialProveedor, promiseFinancieroTercero]);
        }).then(response => {
            if (!existeTerceroEnFinanciero || !existeProveedorEnFinanciero || (existeTerceroEnAsistencial && existeProveedorEnAsistencial)) {
                throw false;
            } else {
                const promiseFinancieroDireccionTercero = Promise.resolve(true)
                    .then(response => {
                        return G.Q.nfcall(ws_buscar_direccion_tercero, {idtercero: tercero.id});
                    }).then(response => {
                        logs += (response.msg || '');

                        if (response && response.razonsocial) {
                            Object.assign(tercero, {
                                tipo_pais_id: response.prefijopais,
                                tipo_dpto_id: response.coddepartamento,
                                tipo_mpio_id: response.codmunicipio,
                                razonsocial: response.razonsocial,
                                direccion: response.direccion,
                                telefono: response.numerotelefonico,
                                email: response.email || ''
                            });
                        }

                        return true;
                    }).catch(err => {
                        if (err.msg) { logs += err.msg; }
                        throw err;
                    });


                const promiseFinancieroClasificacionFiscal = Promise.resolve(true)
                    .then(response => {
                        // CLASIFICACION FISCAL
                        const obj = { codigoempresa, idtercero: tercero.id };
                        return G.Q.nfcall(ws_tercero_clasificacionFiscal, obj); // funcion ws "datosClasificacionFiscalTercero" // Este metodo Webservice no funciona!! dañado, malo
                    }).then(response => {
                        tercero.sw_ica = '0';
                        tercero.porcentaje_ica = 0;

                        if (!response || !response.codtipocontribuyente) { // everytime empty
                            const err = {
                                status: 300,
                                msg: 'No se encontro clasificacion fiscal tercero!\n'
                            };

                            throw err;
                        } else {
                            Object.assign(tercero, {
                                tipoContribuyente: response.codtipocontribuyente,
                                tipoRetencion: response.codtiporetencion,
                                sw_reteIca: response.manejaica
                            });

                            if (!tercero.sw_reteIca) {
                                return 'finish';
                            }
                            else {
                                // RETEICA -- BIEN
                                const obj = {codempresa: codigoempresa, identificacion: tercero_documento};
                                return G.Q.nfcall(ws_tercero_impuestoRteIca, obj); // impuestoreteica
                            }
                        }
                    }).then(response => {
                        if (response === 'finish') {
                            return true;
                        }

                        if (!response || !response.tasa) {
                            const err = {
                                status: 300,
                                msg: 'No se encontro reteica!'
                            };

                            throw err;
                        } else {
                            tercero.sw_ica = '1';
                            tercero.porcentaje_ica = response.tasa;
                            return true;
                        }
                    }).catch(err => {
                        logs += (err.msg || '');
                    });


                const promiseFinancieroNaturaleza = Promise.resolve(true)
                    .then(response => {
                        return G.Q.nfcall(ws_tercero_naturaleza, {idtercero}); // funcion ws "buscarNaturalezaTercero"
                    }).then(response => {
                        if (response) tercero.naturaleza = response;

                        return true;
                    }).catch(err => {
                        logs += (err.msg || '');
                    });


                const promiseFinancieroReteFuente = Promise.resolve(true)
                    .then(response => {
                        return G.Q.nfcall(ws_tercero_impuestos, { codigofuente }); // funcion ws "impuestoretefuentecodigo"
                    }).then(response => {
                        // RETEFUENTE
                        tercero.sw_rtf = response ? '1' : '0';
                        tercero.porcentaje_rtf = response ? response.tasa : 0;
                        return true;
                    }).catch(err => {
                        logs += (err.msg || '');
                    });


                const promiseFinancieroReteIva = Promise.resolve(true)
                    .then(response => {
                        return G.Q.nfcall(ws_tercero_impuestoReteIvaCodigo, { codigoiva }); // funcion ws "impuestoreteivacodigo"
                    }).then(response => {
                        if (response && response.error) { logs += 'Error en reteIva: "' + response.error + '"\n'; }
                        tercero.sw_reteiva = response ? '1' : '0';
                        tercero.porcentaje_reteiva = response ? response.tasa : 0;
                        return true;
                    }).catch(err => {
                        logs += (err.msg || '');
                    });

                return Promise.all([
                    promiseFinancieroDireccionTercero,
                    promiseFinancieroClasificacionFiscal,
                    promiseFinancieroNaturaleza,
                    promiseFinancieroReteFuente,
                    promiseFinancieroReteIva
                ]);
            }
        }).then(response => {
            if (!existeTerceroEnAsistencial) { return G.Q.ninvoke(that.m_proveedores, 'crearTercero', tercero); }
            else {
                logs += 'Tercero ya existe en Asistencial!\n';
                return false;
            }
        }).then(response => {
            if (response) { logs += response; }
            return G.Q.ninvoke(that.m_proveedores, 'crearTerceroProveedor', tercero);
        }).then(response => {
            logs += response;
            return callback(false, logs);
        }).catch(err => {
            if (err.msg) { err.msg = logs + err.msg; }
            else { err.msg = logs; }

            if (!err.status) {
                err = {
                    status: 500,
                    full: JSON.parse(JSON.stringify(err))
                };
            }
            if (!err.full) { err.full = {}; }

            return callback(false, err);
        });
};

Proveedores.prototype.ws_listarProveedores = (req, res) => {
    let args = req.body.data;
    let logs = '';

    if (args.proveedores === undefined || args.proveedores.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda o pagina_actual no esta definido', 404, {}));
        return;
    }

    const termino_busqueda = args.proveedores.termino_busqueda;

    const sw_nit = termino_busqueda && parseFloat(termino_busqueda) && typeof parseFloat(termino_busqueda) === 'number';

    const obj = {
        nit: '',
        tercero_documento: sw_nit ? parseFloat(termino_busqueda): termino_busqueda, // 900775143,
        tercero_tipo_documento: '',
        tipo: 1, // 0 = Cliente, 1 = Proveedor
        userId: parseFloat(req.session.user.usuario_id)
    };
    // Se reciben objeto con 3 propiedades: 1º nit, 2º tercero_id, 3º tipo
    // tipo: 0 Solo afecta tabla "terceros"
    // tipo: 1 Afecta tabla "terceros" y "terceros_proveedores"
    Promise.resolve(true)
        .then(response => {
            if (!sw_nit) { return false; }
            else { return G.Q.nfcall(ws_tercero_proveedor, obj); }
        }).then(response => {
            logs += (response.msg || response || '');
            return G.Q.ninvoke(that.m_proveedores, 'listarTerceroProveedor', obj);
        }).then(proveedores => {
            logs += 'Listando Proveedores!\n';
            return res.send(G.utils.r(req.url, logs, 200, { proveedores }));
        }).catch(err => {
            if (!err.status) {
                err.status = 500;
                err.full = JSON.parse(JSON.stringify(err));
            }
            if (!err.full) { err.full = {}; }

            err.msg = logs + (err.msg || '') + 'Error listando los proveedores!';

            return res.send(G.utils.r(req.url, err.msg, err.status, {})); // se borro obj "err" en la respuesta
        }); // Finish is "ws_tercero_proveedor"
};

Proveedores.prototype.listarProveedoresPorCodigo = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.proveedores === undefined || args.proveedores.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda o pagina_actual no esta definido', 404, {}));
        return;
    }

    var termino_busqueda = args.proveedores.termino_busqueda;

    that.m_proveedores.obtenerProveedorPorCodigo(termino_busqueda, function(err, lista_proveedores) {
        if (err)
            res.send(G.utils.r(req.url, 'Error listando los proveedores', 500, {}));
        else {
            res.send(G.utils.r(req.url, 'Lista de proveedores', 200, {proveedores: lista_proveedores}));
        }
    });
};

Proveedores.$inject = ["m_proveedores"];

module.exports = Proveedores;