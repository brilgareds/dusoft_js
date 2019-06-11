 /* global G */
let that;

let ParametrizacionProductosClientesModel = function () {
    that = this;
};

const promesa = new Promise((resolve, reject) => { resolve(true); });

ParametrizacionProductosClientesModel.prototype.listContracts = (filtros, callback) => {
    let offset = 0;
    let limit = 30;
    filtros.generic = filtros.generic ? 1:0;

    promesa
        .then(response => {
            let query = G.knex
                .column([
                    'a.contrato_cliente_id as contrato_numero',
                    'a.empresa_id',
                    'a.descripcion as contrato_descripcion',
                    G.knex.raw("TO_CHAR(a.fecha_inicio,'DD-MM-YYYY') as contrato_fecha_i"),
                    G.knex.raw("TO_CHAR(a.fecha_final,'DD-MM-YYYY') as contrato_fecha_f"),
                    'a.tipo_id_tercero',
                    'a.tercero_id',
                    'c.nombre_tercero',
                    'a.codigo_unidad_negocio',
                    'd.descripcion',
                    'a.contrato_generico',
                    'a.condiciones_cliente',
                    'a.observaciones',
                    'a.tipo_id_vendedor',
                    'a.vendedor_id',
                    'e.nombre as contrato_vendedor',
                    'a.valor_contrato as contrato_valor',
                    'a.saldo',
                    'a.estado',
                    G.knex.raw(`CASE\n
                        WHEN a.contrato_generico = '1'\n
                            THEN 'CONTRATO GENERICO'\n
                        WHEN a.tipo_id_tercero IS NOT NULL\n
                            THEN a.tipo_id_tercero||'-'||a.tercero_id||' ' ||c.nombre_tercero\n
                        WHEN a.codigo_unidad_negocio IS NOT NULL\n
                            THEN d.codigo_unidad_negocio||' - '||d.descripcion\n
                        END as contrato_tipo`),
                    G.knex.raw(`CASE\n
                        WHEN a.contrato_generico = '1'\n
                            THEN '3'\n
                        WHEN a.tipo_id_tercero IS NOT NULL\n
                            THEN '1'\n
                        WHEN a.codigo_unidad_negocio IS NOT NULL\n
                            THEN '2'\n
                        END as tipo_contrato`)
                ])
                .from('vnts_contratos_clientes as a')
                .leftJoin('terceros_clientes as b', function () {
                    this.on('a.tipo_id_tercero', 'b.tipo_id_tercero')
                        .on('a.tercero_id', 'b.tercero_id')
                        .on('a.empresa_id', 'b.empresa_id')
                })
                .leftJoin('terceros as c', function () {
                    this.on('b.tipo_id_tercero', 'c.tipo_id_tercero')
                        .on('b.tercero_id', 'c.tercero_id')
                        .on('b.empresa_id', 'c.empresa_id')
                })
                .leftJoin('unidades_negocio as d', 'a.codigo_unidad_negocio', 'd.codigo_unidad_negocio')
                .innerJoin('vnts_vendedores as e', function () {
                    this.on('a.tipo_id_vendedor', 'e.tipo_id_vendedor')
                        .on('a.vendedor_id', 'e.vendedor_id')
                })
                .where(function() {
                    let where = 'true';

                    if (filtros.thirdPartyNames) where += ` AND c.nombre_tercero ILIKE '%${filtros.thirdPartyNames}%'`;
                    if (filtros.businessUnit) where += ` AND d.descripcion ILIKE '%${filtros.businessUnit}%'`;
                    if (filtros.numberContract) where += ` AND a.contrato_cliente_id = '${filtros.numberContract}'`;
                    if (filtros.generic) where += ` AND a.contrato_generico = '${filtros.generic}'`;

                    this.where(G.knex.raw(where))
                })
                .orderBy('a.contrato_cliente_id')
                .limit(limit)
                .offset(offset);
            console.log('filtros: ', filtros);
            console.log('Query: ', G.sqlformatter.format(query.toString()));

            return query;
        }).then(contratos => {
            if (contratos.length > 0) {
                for (let contrato of contratos) {
                    contrato.contrato_valor = filtros.number_money(contrato.contrato_valor);
                    contrato.check = contrato.estado === '1';
                }
            }
            callback(false, contratos);
        }).catch(err => {
            if (err.msg === undefined) { err.msg = 'Error en consulta "listContracts"'; }
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.updateStatusContract = (obj, callback) => {
    console.log('In model "updateStatusContract"');
    let err = {};
    let selectColumns = [
        G.knex.raw(`(
            SELECT
                count(sub.contrato_cliente_id)
            FROM
                vnts_contratos_clientes as sub
            GROUP BY
                sub.tipo_id_tercero,
                sub.tercero_id,
                sub.estado
            HAVING
                sub.tipo_id_tercero = a.tipo_id_tercero
                AND
                sub.tercero_id = a.tercero_id
                AND
                sub.estado = '1'
            ) as contratos_activos`),
        'a.contrato_cliente_id as contrato_numero',
        'a.empresa_id',
        'a.descripcion as contrato_descripcion',
        G.knex.raw("TO_CHAR(a.fecha_inicio,'DD-MM-YYYY') as contrato_fecha_i"),
        G.knex.raw("TO_CHAR(a.fecha_final,'DD-MM-YYYY') as contrato_fecha_f"),
        'a.tipo_id_tercero',
        'a.tercero_id',
        'c.nombre_tercero',
        'a.codigo_unidad_negocio',
        'd.descripcion',
        'a.contrato_generico',
        'a.condiciones_cliente',
        'a.observaciones',
        'a.tipo_id_vendedor',
        'a.vendedor_id',
        'e.nombre as contrato_vendedor',
        'a.valor_contrato as contrato_valor',
        'a.saldo',
        'a.estado',
        G.knex.raw(`
            CASE
                WHEN a.contrato_generico = '1'
                    THEN 'CONTRATO GENERICO'
                WHEN a.tipo_id_tercero IS NOT NULL
                    THEN a.tipo_id_tercero||'-'||a.tercero_id||' ' ||c.nombre_tercero
                WHEN a.codigo_unidad_negocio IS NOT NULL
                    THEN d.codigo_unidad_negocio||' - '||d.descripcion
                END as contrato_tipo`),
        G.knex.raw(`
            CASE
                WHEN a.contrato_generico = '1'
                    THEN '3'
                WHEN a.tipo_id_tercero IS NOT NULL
                    THEN '1'
                WHEN a.codigo_unidad_negocio IS NOT NULL
                    THEN '2'
                END as tipo_contrato`)
    ];

    promesa
        .then(response => {
            if (obj.check) {
                let existContractActive = G.knex.column([
                    G.knex.raw(selectColumns)])
                    .from('vnts_contratos_clientes as a')
                    .leftJoin('terceros_clientes as b', function () {
                        this.on('a.tipo_id_tercero', 'b.tipo_id_tercero')
                            .on('a.tercero_id', 'b.tercero_id')
                            .on('a.empresa_id', 'b.empresa_id')
                    })
                    .leftJoin('terceros as c', function () {
                        this.on('b.tipo_id_tercero', 'c.tipo_id_tercero')
                            .on('b.tercero_id', 'c.tercero_id')
                            .on('b.empresa_id', 'c.empresa_id')
                    })
                    .leftJoin('unidades_negocio as d', 'a.codigo_unidad_negocio', 'd.codigo_unidad_negocio')
                    .innerJoin('vnts_vendedores as e', function () {
                        this.on('a.tipo_id_vendedor', 'e.tipo_id_vendedor')
                            .on('a.vendedor_id', 'e.vendedor_id')
                    })
                    .where('a.tipo_id_tercero', obj.tipo_id_tercero)
                    .andWhere('a.tercero_id', obj.tercero_id)
                    .orderBy('contrato_numero');
                console.log(G.sqlformatter.format(existContractActive.toString()));

                return existContractActive;
            }else { return true; }
        }).then(productos => {
            if (productos.length > 0 && productos[0].contratos_activos > 0) {
                for (let producto of productos) {
                    producto.check = producto.estado === '1';
                    producto.contrato_valor = obj.number_money(String(parseFloat(String(producto.contrato_valor))));
                }

                err.msg = 'El cliente ya tiene un contrato activo!!';
                err.contracts = productos;
                err.status = 300;
                throw err;
            }
            let query = G.knex('vnts_contratos_clientes')
                .where('contrato_cliente_id', obj.contrato_numero)
                .update('estado', obj.check);
            return query;
        }).then(response => {
            callback(false, response);
        }).catch(err => {
            if (err.msg === undefined) { err.msg = 'Error al actualizar el contrato!'; }
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.updateProductContract = (obj, callback) => {
    const contract = obj.contract;
    const product = obj.product;
    let updateRows = {};
    let err = {};

    promesa
        .then(response => {
            if (!product.producto_precio_pactado && !product.producto_precio_pactado_origin) {
                err.msg = 'Formato invalido!';
                throw err;
            } else {
                if (product.producto_precio_pactado === product.producto_precio_pactado_origin) {
                    err.msg = `El precio del producto "${product.producto_codigo}" es igual al anterior!`;
                    throw err;
                } else {
                    updateRows.usuario_id = obj.usuarioId;
                    updateRows.ip = obj.ip;
                    updateRows.precio_pactado = product.producto_precio_pactado;
                    if (product.producto_precio_pactado < product.costo_ultima_compra) {
                        if (!product.justificacion || product.justificacion.length < 20) {
                            err.msg = `La justificación del producto "${product.producto_codigo}" debe tener al menos 20 caracteres`;
                            throw err;
                        } else { updateRows.justificacion = product.justificacion; }
                    }
                    const query = G.knex('vnts_contratos_clientes_productos')
                        .where('contrato_cliente_id', contract.contrato_numero)
                        .andWhere('codigo_producto', product.producto_codigo)
                        .update(updateRows);
                    return query;
                }
            }
        }).then(response => {
            callback(false, response);
        }).catch(err => {
            if (err.msg === undefined) {
                err.msg = `Error al actualizar el precio del producto "${obj.productoId}" en el contrato #"${obj.contratoId}"!`;
            }
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.listContractProducts = (obj, callback) => {
    const offset = 0;
    const limit = 50;

    if (!obj.descripcion) { obj.descripcion = ''; }
    if (!obj.laboratorio) { obj.laboratorio = ''; }
    if (!obj.principio_activo) { obj.principio_activo = ''; }

    promesa
        .then(response => {
            const query = G.knex
                .column([
                    'a.codigo_producto as producto_codigo',
                    G.knex.raw('fc_descripcion_producto(b.codigo_producto) as producto_descripcion'),
                    'b.sw_requiereautorizacion_despachospedidos as requiere_autorizacion',
                    'a.precio_pactado as producto_precio_pactado',
                    'inventarios.costo_ultima_compra',
                    'a.justificacion'])
                .from('vnts_contratos_clientes_productos as a')
                .innerJoin('inventarios_productos as b', 'a.codigo_producto', 'b.codigo_producto')
                .innerJoin('inv_subclases_inventarios as c', function () {
                    this.on('b.grupo_id', 'c.grupo_id')
                        .on('b.clase_id', 'c.clase_id')
                        .on('b.subclase_id', 'c.subclase_id')})
                .innerJoin('inv_clases_inventarios as d', function () {
                    this.on('c.grupo_id', 'd.grupo_id')
                        .on('c.clase_id', 'd.clase_id')})   /* --b.estado = '1' */
                .innerJoin('inventarios', 'a.codigo_producto', 'inventarios.codigo_producto')
                .where('a.contrato_cliente_id', obj.contratoId)
                .andWhere('b.descripcion', 'ILIKE', `%${obj.descripcion}%`)
                .andWhere('c.descripcion', 'ILIKE', `%${obj.laboratorio}%`)
                .andWhere('d.descripcion', 'ILIKE', `%${obj.principio_activo}%`)
                .andWhere('inventarios.empresa_id', obj.empresaId)
                .orderBy('b.descripcion')
                .limit(limit)
                .offset(offset);
            return query;
        }).then(productos => {
            if (productos.length > 0) {
                for (let producto of productos ) {
                    producto.producto_precio_pactado_origin = parseFloat(String(producto.producto_precio_pactado));
                    producto.producto_precio_pactado_originString = obj.number_money(String(producto.producto_precio_pactado));
                    producto.producto_precio_pactado = producto.producto_precio_pactado_origin;
                    producto.producto_precio_pactadoString = producto.producto_precio_pactado_originString;
                    producto.costo_ultima_compra = parseFloat(String(producto.costo_ultima_compra));
                    producto.costo_ultima_compraString = obj.number_money(String(producto.costo_ultima_compra));
                    if (producto.requiere_autorizacion === 0) {
                        producto.requiere_autorizacion = 'No';
                    } else {
                        producto.requiere_autorizacion = 'Si';
                    }
                }
            }
            callback(false, productos);
        }).catch(err => {
            console.log('Error: ', err);
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.addProductsContract = (transaccion, obj, key, callback) => {
    let err = {};
    let queryIfExist = {};
    let query = {};
    let requireJustify = false;
    let justifyValid = false;
    let producto = {};

    promesa
        .then(response => {
            producto = obj.productos[key];
            if (!producto) {
                return 'finish';
            } else {
                requireJustify = producto.precio_venta < producto.costo_ultima_compra;
                justifyValid = producto.justificacion !== undefined && producto.justificacion.length > 20;
                if (requireJustify && !justifyValid) {
                    err.msg = 'Justificacion invalida!!';
                    throw err;
                } else {
                    queryIfExist = G.knex
                        .column(['contrato_cliente_id'])
                        .from('vnts_contratos_clientes_productos')
                        .where('contrato_cliente_id', obj.contrato.contrato_numero)
                        .andWhere('codigo_producto', producto.codigo);
                    return queryIfExist;
                }
            }
        }).then(response => {
            if (response === 'finish') {
                return response;
            }
            if (response.length === 0) {
                query = G.knex('vnts_contratos_clientes_productos')
                    .insert({
                        contrato_cliente_id: obj.contrato.contrato_numero,
                        codigo_producto: producto.codigo,
                        precio_pactado: producto.precio_venta,
                        justificacion: producto.justificacion,
                        usuario_id: obj.usuarioId,
                        ip: obj.ip
                    });
                if (transaccion) {
                    query.transacting(transaccion);
                }
                return query;
            } else {
                const err = {
                    msg: 'El producto "' + producto.codigo + '" ya existe en el contrato!'
                };
                throw err;
            }
        }).then(response => {
            if (response === 'finish') {
                callback(false, true);
            } else {
                G.Q.nfcall(that.addProductsContract, transaccion, obj, key+1, callback);
            }
        }).catch(err => {
            if (err.msg === undefined) { err.msg = 'Error en consulta "addProductsContract"'; }
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.deleteProductContract = (obj, callback) => {
    promesa
        .then(response => {
            const query = G.knex('vnts_contratos_clientes_productos')
                .where('codigo_producto', obj.productoId)
                .andWhere('contrato_cliente_id', obj.contratoId)
                .del();
            return query;
        })
        .then(response => {
            callback(false, true);
        }).catch(err => {
            err.msg = `Error al intentar borrar producto '${obj.productoId}' en el contrato #${obj.contratoId}`;
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.searchInventaryProducts = (obj, callback) => {
    const offset = 0;
    const limit = 50;
    let where = 'true ';

    promesa
        .then(response => {
            let query = G.knex
                .column([
                    'a.codigo_producto as codigo',
                    G.knex.raw('fc_descripcion_producto(b.codigo_producto) as descripcion'),
                    'b.sw_requiereautorizacion_despachospedidos as requiere_autorizacion',
                    G.knex.raw('(a.costo_ultima_compra)/((COALESCE(b.porc_iva,0)/100)+1) as costo_ultima_compra'),
                    'a.costo'])
                .from('inventarios as a')
                .innerJoin('inventarios_productos as b', 'a.codigo_producto', 'b.codigo_producto')
                .innerJoin('inv_subclases_inventarios as c', function () {
                    this.on('b.grupo_id', 'c.grupo_id')
                        .on('b.clase_id', 'c.clase_id')
                        .on('b.subclase_id', 'c.subclase_id') })
                .innerJoin('inv_clases_inventarios as d', function () {
                    this.on('c.grupo_id', 'd.grupo_id')
                        .on('c.clase_id', 'd.clase_id') })
                .where('a.empresa_id', obj.empresaId) /* -- b.estado = '1' */
                .andWhere(function () {
                    if (obj.codigo_producto !== undefined && obj.codigo_producto.length > 0) {
                        where += `and b.codigo_producto ILIKE '%${obj.codigo_producto}%' `;
                    }
                    if (obj.descripcion !== undefined && obj.descripcion.length > 0) {
                        where += `and b.descripcion ILIKE '%${obj.descripcion}%' `;
                    }
                    if (obj.laboratorio !== undefined && obj.laboratorio.length > 0) {
                        where += `and c.descripcion ILIKE '%${obj.laboratorio}%' `;
                    }
                    if (obj.principio_activo !== undefined && obj.principio_activo.length > 0) {
                        where += `and d.descripcion ILIKE '%${obj.principio_activo}%' `;
                    }
                    this.where(G.knex.raw(where));
                })
                .whereNotIn('b.codigo_producto',
                    G.knex
                        .column(['codigo_producto'])
                        .from('vnts_contratos_clientes_productos')
                        .where('contrato_cliente_id', obj.contratoClienteId))
                .limit(limit)
                .offset(offset)
                .orderBy('b.descripcion');

            return query;
        }).then(productos => {
            if (productos.length > 0) {
                for (let producto of productos) {
                    producto.costo = obj.number_money(producto.costo);
                    producto.costo_ultima_compra = parseFloat(producto.costo_ultima_compra);
                    producto.costo_ultima_compraString = obj.number_money(String(producto.costo_ultima_compra));
                    producto.costo_ultima_compraRedondeado = Math.ceil(producto.costo_ultima_compra);
                    producto.withOutDocument = true;
                    if (producto.requiere_autorizacion === 0) {
                        producto.requiere_autorizacion = 'No';
                    } else {
                        producto.requiere_autorizacion = 'Si';
                    }
                }
                callback(false, productos);
            } else {
                callback(false, productos);
            }
        }).catch(err => {
            console.log('Error: ', err);
            err.msg = `Error al consultar los productos del contrato "#${obj.contratoClienteId}"`;
            callback(err);
        });
};

ParametrizacionProductosClientesModel.$inject = [];
module.exports = ParametrizacionProductosClientesModel;
