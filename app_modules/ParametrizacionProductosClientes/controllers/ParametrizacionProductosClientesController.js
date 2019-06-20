/* global G */
let that;

let ParametrizacionProductosClientes = function (m_parametrizacionProductosClientes, m_productos) {
    that = this;
    that.m_parametrizacionProductosClientes = m_parametrizacionProductosClientes;
    that.m_productos = m_productos;
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

/****************************************/
/********* FUNCIONES RECURSIVAS ********/
/***************************************/

/****************************************/
/********* FUNCIONES Secundarias ******/
/************************************/
const promesa = new Promise((resolve, reject) => { resolve(true); });

const __subir_archivo_plano = (files, callback) => {
    var ruta_tmp = files.file.path;
    var ext = G.path.extname(ruta_tmp);
    var nombre_archivo = G.random.randomKey(3, 3) + ext;
    var ruta_nueva = G.dirname + G.settings.carpeta_temporal + nombre_archivo;
    let parser = {};
    let workbook = {};
    let filas = [];

    if (G.fs.existsSync(ruta_tmp)) {
        // Copiar Archivo
        G.Q.nfcall(G.fs.copy, ruta_tmp, ruta_nueva).
        then(function () {
            return  G.Q.nfcall(G.fs.unlink, ruta_tmp);
        }).then(function () {
            parser = G.XlsParser;
            workbook = parser.readFile(ruta_nueva);
            filas = G.XlsParser.serializar(workbook, [
                'codigo',
                'precio_venta',
                'justificacion']);

            if (!filas) {
                callback(true);
                return;
            } else {
                G.fs.unlinkSync(ruta_nueva);
                callback(false, filas);
            }
        }).
        fail(function (err) {
            G.fs.unlinkSync(ruta_nueva);
            callback(true);
        }).
        done();
    } else {
        callback(true);
    }
};

const __validar_productos_archivo_plano = (that, index, filas, productosValidos, productosInvalidos, parametros, callback) => {
    let producto = filas[index];
    if (!producto) { callback(false, productosValidos, productosInvalidos); return; } // Si no existe sale del ciclo!
    // console.log('Product is: ', producto);
    let obj = {
        codigo_producto: producto.codigo,
        empresa_id: parametros.empresa_id,
        number_money: number_money
    };

    G.Q.ninvoke(that.m_productos, 'validar_producto_inventario2', obj)
        .then(resultado => {
            if (resultado.length > 0) {
                producto.check = true;
                producto.costo = parseFloat(resultado[0].costo);
                producto.costoString = number_money(String(resultado[0].costo));
                producto.costo_ultima_compra = parseFloat(resultado[0].costo_ultima_compra);
                producto.costo_ultima_compraString = number_money(String(resultado[0].costo_ultima_compra));
                producto.precio_venta = parseFloat(producto.precio_venta);
                producto.precio_ventaString = number_money(String(producto.precio_venta));
                producto.descripcion = resultado[0].descripcion_producto;
                if (producto.precio_venta > producto.costo_ultima_compra) { producto.justificacion = ''; }
                if (resultado[0].sw_requiereautorizacion_despachospedidos === 0) {
                    producto.requiere_autorizacion = 'No';
                } else { producto.requiere_autorizacion = 'Si'; }
                productosValidos.push(producto);
            } else {
                producto.mensajeError = `El producto "${producto.codigo}" No existe en inventario`;
                producto.existeInventario = false;
                productosInvalidos.push(producto);
            }
            index++;
            __validar_productos_archivo_plano(that, index, filas, productosValidos, productosInvalidos, parametros, callback);
        }).catch(error => { error.msg = 'Error in "validar_producto_inventario2"'; callback(error); });
};

/****************************************/
/********* FUNCIONES PRINCIPALES ******/
/************************************/
ParametrizacionProductosClientes.prototype.listContracts = (req, res) => {
    console.log('In controller "listContracts"');
    let params = req.body.data;
    params.number_money = number_money;

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'listContracts', params);
        }).then(response => {
            res.send(G.utils.r(req.url, 'Listando Contratos!', 200, response));
        }).catch(err => {
            console.log('Hubo un error: ', err);
            res.send(G.utils.r(req.url, err.msg, 500, {}));
        });
};

ParametrizacionProductosClientes.prototype.updateStatusContract = (req, res) => {
    console.log('In controller "updateStatusContract"');
    let contrato = req.body.data.contrato;
    contrato.number_money = number_money;

    if (contrato.check) {
        contrato.check = 1;
    } else {
        contrato.check = 0;
    }

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'updateStatusContract', contrato);
        }).then(response => {
            res.send(G.utils.r(req.url, 'Contrato actualizado con exito!', 200, response));
        }).catch(err => {
            if (err.msg === undefined) { err.msg = 'Hubo un error!'; }
            if (err.status === undefined) { err.status = 500; }
            console.log('Err: ', err);
            res.send(G.utils.r(req.url, err.msg, err.status, err));
        });
};

ParametrizacionProductosClientes.prototype.searchInventaryProducts = (req, res) => {
    console.log('In controller "searchInventaryProducts"');
    let params = req.body.data;
    params.empresaId = req.body.session.empresaId;
    params.number_money = number_money;

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'searchInventaryProducts', params);
        }).then(response => {
            res.send(G.utils.r(req.url, 'Listando productos!', 200, response));
        }).catch(err => {
            console.log('Error: ', err);
            if (err.msg === undefined) {
                err.msg = 'Error al listar Productos';
            }
            res.send(G.utils.r(req.url, err.msg, 500, err));
        });
};

ParametrizacionProductosClientes.prototype.subirArchivo = (req, res) => {
    let parametros = req.body.data.data;
    let error = {};
    let response = {};

    promesa
        .then(response => { return G.Q.nfcall(__subir_archivo_plano, req.files); })
        .then(contenido => {
            if (contenido.length > 0) {
                return G.Q.nfcall(__validar_productos_archivo_plano, that, 0, contenido, [], [], parametros);
            } else { throw {msg: "El archivo esta vacio", status: 500, data: {productos: {}}}; }
        }).then(productosPlano => {
            console.log('Array Productos: ', productosPlano);

            if (productosPlano[0].length === 0) {
                error = {
                    msg: 'Lista de Productos',
                    status: 200,
                    data: {
                        productos: {
                            validos: productosPlano[0],
                            invalidos: productosPlano[1]
                        }
                    }
                };
                throw error;
            }
            response = {
                productos: {
                    validos: productosPlano[0],
                    invalidos: productosPlano[1]
                }
            };
            res.send(G.utils.r(req.url, 'Listando los productos!', 200, response));
            return true;
        }).catch(err => {
            console.log("err [subirArchivo]:", err);

            if (err.msg === undefined) { err.msg = "Erro Interno"; }
            if (err.status === undefined) { err.status = 500; }
            res.send(G.utils.r(req.url, err.msg, err.status, err.data));
        });
};

ParametrizacionProductosClientes.prototype.addProductsContract = (req, res) => {
    console.log('In controller "addProductsContract"');
    let obj = req.body.data;
    obj.usuarioId = req.body.session.usuario_id;
    // obj.ip = G.ip.address();
    obj.ip = req.connection.remoteAddress.replace(/^.*:/, '');
    if (obj.ip === '1') { obj.ip = G.ip.address(); }

    G.knex.transaction(transaccion => {
        promesa
            .then(response => {
                return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'addProductsContract', transaccion, obj, 0); })
            .then(response => { transaccion.commit(transaccion); })
            .catch(err => { err.transaccion = transaccion; transaccion.rollback(err); });
    }).then(transaccion => {
        res.send(G.utils.r(req.url, 'Productos agregados satisfactoriamente!!', 200, true));
    }).catch(err => {
        console.log('Error: ', err);
        if (err.msg === undefined) { err.msg = 'Hubo un error!!'; }
        res.send(G.utils.r(req.url, err.msg, 500, err));
    });
};

ParametrizacionProductosClientes.prototype.listContractProducts = (req, res) => {
    console.log('In controller "listContractProducts"');

    let params = req.body.data;
    params.empresaId = req.body.session.empresaId;
    params.number_money = number_money;

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'listContractProducts', params);
        }).then(response => {
            res.send(G.utils.r(req.url, '', 200, response));
        }).catch(err => {
           res.send(G.utils.r(req.url, err.msg, 500, err));
        });
};

ParametrizacionProductosClientes.prototype.updateProductContract = (req, res) => {
    console.log('In controller "updateProductContract"');
    let params = req.body.data;
    params.usuarioId = req.body.session.usuario_id;
    // params.ip = G.ip.address();
    params.ip = req.connection.remoteAddress.replace(/^.*:/, '');
    if (params.ip === '1') { params.ip = G.ip.address(); }

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'updateProductContract', params);
        }).then(response => {
            res.send(G.utils.r(req.url, 'Precio actualizado!', 200, response));
        }).catch(err => {
            if (err.msg === undefined) { err.msg = 'Hubo un error!'; }
            if (err.status === undefined) { err.status = 500; }
            console.log('err: ', err);

            res.send(G.utils.r(req.url, err.msg, err.status, err));
        });
};

ParametrizacionProductosClientes.prototype.deleteProductContract = (req, res) => {
    console.log('In controller "deleteProductContract"');
    let args = req.body.data;

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'deleteProductContract', args);
        }).then(response => {
            res.send(G.utils.r(req.url, `El producto '${args.productoId}' fue eliminado del contrato #${args.contratoId}`, 200, response));
        }).catch(err => {
            if (err.msg === undefined) { err.msg = 'Hubo un error!'; }
            console.log('err: ', err);
            res.send(G.utils.r(req.url, err.msg, 500, err));
        });
};

const now = (oldDate='') => {
    let date = {};

    if (oldDate) { date = new Date(oldDate); }
    else { date = new Date(); }

    const dateNow = String(('0' + date.getDate()).slice(-2)
        + '-'
        + ('0' + (date.getMonth() + 1)).slice(-2)
        + '-' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2)
        + ':' + ('0' + date.getMinutes()).slice(-2)
        + ':' + ('0' + date.getSeconds()).slice(-2));
    return dateNow;
};

ParametrizacionProductosClientes.prototype.sellers = (req, res) => {
    console.log('In controller "sellers"');

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'sellers', {});
        }).then(response => {
            res.send(G.utils.r(req.url, 'Listando vendedores', 200, response));
        }).catch(err => {
            if (!err.msg) { err.msg = 'Hubo un error al buscar vendedores!' }
            if (!err.status) { err.status = 500; }

            res.send(G.utils.r(req.url, err.msg, err.status, err));
        });
};

ParametrizacionProductosClientes.prototype.searchThird = (req, res) => {
    console.log('In controller "searchThird"');

    let params = req.body.data;
    params.empresa_id = req.body.session.empresaId;

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'searchThird', params);
        }).then(response => {

            res.send(G.utils.r(req.url, 'Listando terceros', 200, response));
        }).catch(err => {
           if (err.msg === undefined) { err.msg = 'Error al listar terceros'; }
           if (err.status === undefined) { err.status = 500; }

           res.send(G.utils.r(req.url, err.msg, err.status, err));
        });
};

ParametrizacionProductosClientes.prototype.businessUnits = (req, res) => {
    console.log('In controller "businessUnits"');
    let params = req.body.data;

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'businessUnits', params);
        }).then(response => {
            res.send(G.utils.r(req.url, 'Listando las unidades de negocio', 200, response));
        }).catch(err => {
            if (err.msg === undefined) { err.msg = 'Error interno en "businessUnits"'; }
            if (err.status === undefined) { err.status = 500; }
            console.log('Error: ', err);
            res.send(G.utils.r(req.url, err.msg, err.status, err));
        });
};

ParametrizacionProductosClientes.prototype.createContract = (req, res) => {
    console.log('In controller "createContract"');
    let params = req.body.data.contract;
    params.userId = req.body.session.usuario_id;
    params.empresaId = req.body.session.empresaId;
    params.dateNow = now();
    params.dateInit = now(params.dateInit);
    params.dateExpired = now(params.dateExpired);

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'createContract', params);
        }).then(response => {
            res.send(G.utils.r(req.url, 'Contrato creado con exito!', 200, response));
        }).catch(err => {
            if (err.status === undefined) { err.status = 500; }
            if (err.msg === undefined) { err.msg = 'Hubo un error!'; }
            console.log('Err: ', err);
            res.send(G.utils.r(req.url, err.msg, err.status, err));
        });
};

ParametrizacionProductosClientes.$inject = ["m_parametrizacionProductosClientes", "m_productos"];
module.exports = ParametrizacionProductosClientes;
