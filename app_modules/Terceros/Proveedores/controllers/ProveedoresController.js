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

    new Promise((resolve, reject) => {
        resolve(G.Q.nfcall(G.soap.createClient, url));
    }).then(client => {
        return G.Q.ninvoke(client, "buscarTerceroId", { idtercero: obj.tercero_documento }); // metodo = 'todos_pacientes';
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

    new Promise((resolve, reject) => { resolve(G.Q.nfcall(G.soap.createClient, url));
    }).then(client => {
        return G.Q.ninvoke(client, "datosClasificacionFiscalTercero", obj); // metodo = 'todos_pacientes';
    }).then(result => { // Service without response
        if (result && result.datosClasificacionFiscalTerceroResult) {
            response = result.datosClasificacionFiscalTerceroResult;
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
    new Promise((resolve, reject) => {
        resolve(G.Q.nfcall(G.soap.createClient, url));
    }).then(client => {
        return G.Q.ninvoke(client, 'buscarNaturalezaTercero', obj); // metodo = 'todos_pacientes'; 4488190001850797
    }).then(result => {
        if (result && result.length) {
            const natura = result[0].buscarNaturalezaTerceroResult.split(',');
            naturaleza = natura[0] === 0 ? 1:0;
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

    new Promise((resolve, reject) => {
        resolve(G.Q.nfcall(G.soap.createClient, url));
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

    new Promise((resolve, reject) => {
        resolve(G.Q.nfcall(G.soap.createClient, url));
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

    new Promise((resolve, reject) => {
        resolve(G.Q.nfcall(G.soap.createClient, url));
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

    new Promise((resolve, reject) => {
        resolve(G.Q.nfcall(G.soap.createClient, url));
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
    const nit = data.nit;
    const tipo = data.tipo;
    const tercero_documento = data.tercero_documento;
    const userId = data.userId;

    let existeTercero = false;
    let existeProveedorAsistencial = false;
    let existeProveedorFinanciero = false;
    var logs = '';
    let finish = false;

    let existe = 0;
    let Gu = false;
    var tercero = {};
    let idtercero = '';
    let detenerPromesas = false;

    // tipo = 0 AFECTA SOLO LA TABLA DE TERCEROS
    // tipo = 1 AFECTA TABLA DE TERCEROS Y TERCEROS PROVEEDORES

    const promise1 = new Promise((resolve, reject) => {
        resolve(G.Q.ninvoke(that.m_proveedores, 'verExistenciaTerceroAsistencial', tercero_documento));
    }).then(response => {
        existeTercero = response;
        return true;
    }).catch(err => { logs += err.msg; });


    const promise2 = new Promise((resolve, reject) => {
        resolve(G.Q.ninvoke(that.m_proveedores, 'verExistenciaProveedorAsistencial', tercero_documento));
    }).then(response => {
        existeProveedorAsistencial = response;

        if (!existeProveedorAsistencial) {
            logs += 'Tercero no existe como proveedor en Asistencial\n';
            return true;
        } else {
            const err = { status: 300 };
            logs += 'Tercero ya existe como proveedor en Asistencial\n';

            throw err;
        }
    }).catch(err => { throw err; });


    const promise3 = new Promise((resolve, reject) => {
        const obj = { numeroidentificacion: tercero_documento };
        resolve(G.Q.nfcall(ws_buscar_tercero, obj));
    }).then(response => {
        if (!response || !response.estadotercero) {
            const err = {
                status: 300,
                msg: 'Tercero no existe como proveedor en el FI\n'
            };

            throw err;
        } else {
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


    const promise4 = new Promise((resolve, reject) => {
        if (detenerPromesas) {
            const err = {status: 300, msg: '¡Deteniendo promesa!'};
            throw err;
        } else {
            resolve(G.Q.nfcall(ws_buscar_direccion_tercero, { tercero_documento }));
        }
    }).then(direccion => {
        logs += (direccion.msg || '');

        if (direccion && direccion.razonsocial) {
            Object.assign(tercero, {
                tipo_pais_id: direccion.prefijopais,
                tipo_dpto_id: direccion.coddepartamento,
                tipo_mpio_id: direccion.codmunicipio,
                razonsocial: direccion.razonsocial,
                direccion: direccion.direccion,
                telefono: direccion.numerotelefonico,
                email: direccion.email || ''
            });
        }

        return true;
    }).catch(err => {
        if (err.msg) { logs += err.msg; }
        throw err;
    });


    const promise5 = new Promise((resolve, reject) => {
        // CLASIFICACION FISCAL
        const obj = { codigoempresa: 'DUA', idtercero: tercero_documento };
        setTimeout(() => {
            if (detenerPromesas) {
                const err = { status: 300, msg: '¡Deteniendo promesa!' };
                reject(err);
            } else { resolve(G.Q.nfcall(ws_tercero_clasificacionFiscal, obj)); }
        }, 1000); // funcion ws "datosClasificacionFiscalTercero" // Este metodo Webservice no funciona!! dañado, malo
    }).then(response => {
        tercero.sw_ica = '0';
        tercero.porcentaje_ica = 0;

        if (!response || response.codtipocontribuyente) { // everytime empty
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

            if (!tercero.sw_reteIca) { return 'finish'; }
            else {
                // RETEICA -- BIEN
                const obj = { codempresa: 'DUA', identificacion: tercero_documento };
                return G.Q.nfcall(ws_tercero_impuestoRteIca, obj); // impuestoreteica
            }
        }
    }).then(response => {
        tercero.sw_ica = '0';
        tercero.porcentaje_ica = 0;

        if (response === 'finish') { return true; }

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
    }).catch(err => { logs += (err.msg || ''); } );



    const promise6 = new Promise((resolve, reject) => {
        resolve(G.Q.nfcall(ws_tercero_naturaleza, { idtercero })); // funcion ws "buscarNaturalezaTercero"
    }).then(response => {
        if (response)  tercero.naturaleza = response;

        return true;
    }).catch(err => { logs += (err.msg || ''); } );


    const promise7 = new Promise((resolve, reject) => {
        if (tipo === 1) {
            const obj = { idempresa: 1, numeroidentificacion: tercero_documento };
            resolve(G.Q.nfcall(ws_buscar_tercero_proveedor, obj)); // funcion ws "terceroProveedorClienteIden"
        } else { resolve('finish'); }
    }).then(response => {
        if (response === 'finish') return true;

        if (!response || !response.idtercero) {
            const err = {
                status: 300,
                msg: 'No se encontro Id del tercero!'
            };
            throw err;
        } else {
            tercero.estadoproveedor = response.estadotercero;
            tercero.razonsocial = response.razonsocial;
            tercero.id = response.idtercero;
            return true;
        }
    }).catch(err => { logs += (err.msg || ''); } );


    const promise8 = new Promise((resolve, reject) => {
        resolve(G.Q.nfcall(ws_tercero_impuestos, { codigofuente: 33 })); // funcion ws "impuestoretefuentecodigo"
    }).then(response => {
        // RETEFUENTE
        tercero.sw_rtf = response ? '1': '0';
        tercero.porcentaje_rtf = response ? response.tasa: 0;
        return true;
    }).catch(err => { logs += (err.msg || ''); } );


    const promise9 = new Promise((resolve, reject) => {
        const obj = { codigoiva: 13 };
        resolve(G.Q.nfcall(ws_tercero_impuestoReteIvaCodigo, obj)); // funcion ws "impuestoreteivacodigo"
    }).then(response => {
        tercero.sw_reteiva = response ? '1': '0';
        tercero.porcentaje_reteiva = response ? response.tasa: 0;
        return true;
    }).catch(err => { logs += (err.msg || ''); } );


    Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8, promise9])
        .then(response => {
            if (!existeTercero) { return G.Q.ninvoke(that.m_proveedores, 'crearTercero', tercero); }
            else {
                logs += 'Tercero ya existe en Asistencial!';
                return true;
            }
        }).then(response => {
            logs += response;
            return G.Q.ninvoke(that.m_proveedores, 'crearTerceroProveedor', tercero);
        }).then(response => {
            logs += response;
            callback(false, logs);
        }).catch(err => {
            detenerPromesas = true;
            if (err.msg) { err.msg = logs + err.msg; }
            else { err.msg = logs; }

            if (!err.status) {
                err = {
                    status: 500,
                    full: JSON.parse(JSON.stringify(err))
                };
            }
            if (!err.full) { err.full = {}; }

            if (err.status === 500) { return callback(err); }
            else { return callback(false, err); }
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
        userId: req.session.user.usuario_id
    };
    // Se reciben objeto con 3 propiedades: 1º nit, 2º tercero_id, 3º tipo
    // tipo: 0 Solo afecta tabla "terceros"
    // tipo: 1 Afecta tabla "terceros" y "terceros_proveedores"
    new Promise((resolve, reject) => {
        if (sw_nit) {
            resolve(G.Q.nfcall(ws_tercero_proveedor, obj));
        } else {
            resolve(true);
        }
    }).then(response => {
        if (!response || !obj.tercero_documento) {
            const err = {
                status: 300,
                msg: 'Error en respuesta!'
            };
            throw err;
        } else {
            logs += (response.msg || '');
            return G.Q.ninvoke(that.m_proveedores, 'listarTerceroProveedor', obj);
        }
    }).then(proveedores => {
        console.log('\nProveedores: ', proveedores, '\n\n', 'Logs:', logs);
        res.send(G.utils.r(req.url, 'Lista de proveedores', 200, { proveedores }));
    }).catch(err => {
        if (!err.status) {
            err = {
                status: 500,
                full: JSON.parse(JSON.stringify(err))
            };
        }
        err.msg = logs + (err.msg || '') + 'Error listando los proveedores!';
        if (!err.full) { err.full = {}; }

        console.log('Logs:', err.msg);
        res.send(G.utils.r(req.url, err.msg, err.status, err));
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