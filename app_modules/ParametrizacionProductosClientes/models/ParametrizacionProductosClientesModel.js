 /* global G */
let that;

let ParametrizacionProductosClientesModel = function () {
    that = this;
};

const promesa = new Promise((resolve, reject) => { resolve(true); });

ParametrizacionProductosClientesModel.prototype.listContracts = (filtros, callback) => {
    let offset = 0;
    let limit = 30;
    const typeOrder = filtros.ordenar ? 'asc':'desc';
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
                    G.knex.raw("a.fecha_inicio as contrato_fecha_i2"),
                    G.knex.raw("a.fecha_final as contrato_fecha_f2"),
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
                    'e.nombre as vendedor_nombre',
                    'a.valor_contrato as contrato_valor',
                    'a.saldo',
                    'a.estado',
                    'a.porcentaje_genericos',
                    'a.porcentaje_marcas',
                    'a.porcentajes_insumos',
                    'a.facturar_iva',
                    'a.sw_sincroniza',
                    'a.sw_autorizacion',
                    'a.sw_facturacion_agrupada',
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
                .orderBy('a.contrato_cliente_id', typeOrder)
                .limit(limit)
                .offset(offset);

            return query;
        }).then(contratos => {
            if (contratos.length > 0) {

                for (let contrato of contratos) {
                    contrato.type = { cod: parseFloat(contrato.tipo_contrato) };
                    contrato.seller = {
                        cod: parseFloat(contrato.vendedor_id),
                        name: contrato.vendedor_nombre,
                        sellerDocType: contrato.tipo_id_vendedor,
                        sellerDocNum: contrato.vendedor_id
                    };
                    contrato.businessUnit = {
                        cod: parseFloat(contrato.codigo_unidad_negocio),
                        name: parseFloat(contrato.codigo_unidad_negocio) + ' - ' + contrato.descripcion
                    };
                    contrato.docType = contrato.tipo_id_tercero;
                    contrato.docNum = contrato.tercero_id;
                    contrato.dateInit = contrato.contrato_fecha_i2;
                    contrato.dateExpired = contrato.contrato_fecha_f2;
                    contrato.description = contrato.contrato_descripcion;
                    contrato.terms = contrato.condiciones_cliente;
                    contrato.observations = contrato.observaciones;
                    contrato.value = parseFloat(contrato.contrato_valor);
                    contrato.percBrand = parseFloat(contrato.porcentaje_marcas);
                    contrato.percGeneric = parseFloat(contrato.porcentaje_genericos);
                    contrato.percSupplies = parseFloat(contrato.porcentajes_insumos);
                    contrato.checkInIva = (contrato.facturar_iva === '1');
                    contrato.authorizeWallet = (contrato.sw_autorizacion === '1');
                    contrato.sw_sync = (contrato.sw_sincroniza === '1');

                    if (contrato.type.cod === 1) { contrato.type.name = 'Cliente Especifico'; }
                    else if (contrato.type.cod === 2) { contrato.type.name = 'Unidad de Negocio'; }
                    else if (contrato.type.cod === 3) { contrato.type.name = 'Contrato Generico'; }
                    else { contrato.type.name = 'Ninguno'; }

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

const validCreateContract = obj => {
    let error = { count: 0, msg: 'Formato incorrecto en los campos:\n' };
    let response = {};

    if (!obj.typeCod)        { error.count++; error.msg += '"typeCod", '; }
    if (!obj.empresaId)      { error.count++; error.msg += '"empresaId", '; }
    if (!obj.description)    { error.count++; error.msg += '"description", '; }
    if (!obj.dateInit)       { error.count++; error.msg += '"dateInit", '; }
    if (!obj.dateExpired)    { error.count++; error.msg += '"dateExpired", '; }
    if (!obj.terms)          { error.count++; error.msg += '"terms", '; }
    if (!obj.observations)   { error.count++; error.msg += '"observations", '; }
    if (!obj.percGeneric)    { error.count++; error.msg += '"percGeneric", '; }
    if (!obj.percBrand)      { error.count++; error.msg += '"percBrand", '; }
    if (!obj.percSupplies)   { error.count++; error.msg += '"percSupplies", '; }
    if (!obj.value)          { error.count++; error.msg += '"value", '; }
    if (!obj.userId)         { error.count++; error.msg += '"userId", '; }
    if (!obj.sellerDocType)  { error.count++; error.msg += '"sellerDocType", '; }
    if (!obj.sellerDocNum)   { error.count++; error.msg += '"sellerDocNum", '; }
    if (!obj.dateNow)        { error.count++; error.msg += '"dateNow", '; }
    if (!obj.typeCod)        { error.count++; error.msg += '"type", '; }
    if (obj.update && !obj.contrato_numero) { error.count++; error.msg += '"contrato_numero", '; }
    if (obj.typeCod === 1 && !obj.docType) { error.count++; error.msg += '"docType", '; }
    if (obj.typeCod === 1 && !obj.docNum) { error.count++; error.msg += '"docNum", '; }
    if (obj.typeCod === 2 && !obj.businessUnitCod && obj.businessUnitCod !== 0)  { error.count++; error.msg += '"businessUnitCod", '; }
    error.msg = error.msg.substring(0, error.msg.length-2);

    if (error.count > 0) { response.error = error; }
    else {
        obj.sw_sync = (!obj.sw_sync) ? '0':'1';
        obj.authorizeWallet = (!obj.authorizeWallet) ? '0':'1';
        obj.sw_bundled_billing = (!obj.sw_bundled_billing) ? '0':'1';
        obj.checkInIva = (!obj.checkInIva) ? '0':'1';

        response = obj;
    }
    return response;
};

ParametrizacionProductosClientesModel.prototype.sellers = (obj, callback) => {
    console.log('In controller "sellers"');

    promesa
        .then(respoinse => {
            const query = G.knex.column([
                G.knex.raw('upper(a.nombre) as name'),
                'a.tipo_id_vendedor as sellerDocType',
                'a.vendedor_id as sellerDocNum',
                'a.telefono'])
                .from('vnts_vendedores as a')
                .where('a.estado', '1');
            return query;
        }).then(response => {
            callback(false, response);
        }).catch(err => {
            if (!err.msg) err.msg = 'No se encontraron vendedores disponibles!';
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.searchThird = (obj, callback) => {
    console.log('In model "searchThird"');
    let limit = 1;
    let offset = 0;
    obj.docNum = obj.docNum ? obj.docNum:'';
    obj.docType = obj.docType ? obj.docType:'';

    promesa
        .then(response => {

            let query = G.knex.column([
                'a.tipo_id_tercero',
                'a.tercero_id',
                'a.direccion',
                'a.telefono',
                'a.email',
                'a.nombre_tercero',
                'a.tipo_bloqueo_id',
                'c.descripcion as bloqueo',
                'g.pais',
                'f.departamento',
                'municipio'])
                .from('terceros as a')
                .innerJoin('terceros_clientes as b', function () {
                    this.on('a.tipo_id_tercero', 'b.tipo_id_tercero')
                        .on('a.tercero_id', 'b.tercero_id')})
                .leftJoin('inv_tipos_bloqueos as c', 'a.tipo_bloqueo_id', 'c.tipo_bloqueo_id')
                .leftJoin('tipo_mpios as d', function () {
                    this.on('a.tipo_pais_id', 'd.tipo_pais_id')
                        .on('a.tipo_dpto_id', 'd.tipo_dpto_id')
                        .on('a.tipo_mpio_id', 'd.tipo_mpio_id')})
                .leftJoin('tipo_dptos as f', function () {
                    this.on('d.tipo_pais_id', 'f.tipo_pais_id')
                        .on('d.tipo_dpto_id', 'f.tipo_dpto_id')})
                .leftJoin('tipo_pais as g', 'f.tipo_pais_id', 'g.tipo_pais_id')
                .where('b.empresa_id', obj.empresa_id)
                .andWhere('a.tipo_id_tercero', obj.docType)
                .andWhere('a.tercero_id', obj.docNum)
                .groupBy([
                    'a.tipo_id_tercero',
                    'a.tercero_id',
                    'a.direccion',
                    'a.telefono',
                    'a.email',
                    'a.nombre_tercero',
                    'a.tipo_bloqueo_id',
                    'c.descripcion',
                    'g.pais',
                    'f.departamento',
                    'municipio'])
                .orderBy('a.nombre_tercero')
                .limit(limit)
                .offset(offset);
            // console.log('Query is: ', G.sqlformatter.format(query.toString()));

            return query;
        }).then(response => {
            if (response.length > 0) {
                response[0].direccion = response[0].direccion.replace(/s+/g, ' ');
                callback(false, response[0]);
            } else { throw { msg: 'No se encontro el tercero!!' }; }
        }).catch(err => {
            if (!err.msg) { err.msg = 'No fue posible encontrar terceros!'; }
            callback(err);
        });
};

const fieldsContract = obj => {
    let fields = {
        empresa_id: obj.empresaId,
        descripcion: obj.description,
        fecha_inicio: obj.dateInit,
        fecha_final: obj.dateExpired,
        condiciones_cliente: obj.terms,
        observaciones: obj.observations,
        porcentaje_genericos: obj.percGeneric,
        porcentaje_marcas: obj.percBrand,
        porcentajes_insumos: obj.percSupplies,
        valor_contrato: obj.value,
        saldo: obj.value,
        usuario_id: obj.userId,
        tipo_id_vendedor: obj.sellerDocType,
        vendedor_id: obj.sellerDocNum,
        facturar_iva: obj.checkInIva,
        sw_sincroniza: obj.sw_sync,
        sw_autorizacion: obj.authorizeWallet,
        sw_facturacion_agrupada: obj.sw_bundled_billing,
        fecha_registro: obj.dateNow
    };

    if (!obj.update) { fields.estado = '0'; }
    if (obj.typeCod === 1) { fields.tipo_id_tercero = obj.docType; fields.tercero_id = obj.docNum; }
    else if (obj.typeCod === 2) { fields.codigo_unidad_negocio = obj.businessUnitCod; }
    else if (obj.typeCod === 3) { fields.contrato_generico = '1'; }

    return fields;
};

ParametrizacionProductosClientesModel.prototype.createOrUpdateContract = (obj, callback) => {
    console.log('In model "createOrUpdateContract"');
    // console.log('obj: ', obj);
    let errCount = 0;
    obj.check = true;
    obj.tipo_id_tercero = obj.docType;
    obj.tercero_id = obj.docNum;
    obj.contrato_numero = (!obj.contrato_numero) ? '0':obj.contrato_numero;
    let query = {};

    promesa
        .then(response => {
            obj = validCreateContract(obj);
            if (!obj.error) {
                return G.Q.nfcall(that.existContractActive, obj);
            } else {
                let err = {
                    msg: (obj.error.msg) ? obj.error.msg: (!obj.update) ? 'Campos invalidos para crear contrato!!':'Campos invalidos para actualizar contrato!'
                };
                throw err;
            }
        }).then(contracts => {
            let fields = fieldsContract(obj);
            if (!contracts.length) { fields.estado = '1'; }
            else { errCount++; }

            if (!obj.update) {
                query = G.knex('vnts_contratos_clientes').insert(fields);
            } else {
                const filter = {contrato_cliente_id: obj.contrato_numero};
                query = G.knex('vnts_contratos_clientes').where(filter).update(fields);
            }
            //console.log('query: ', G.sqlformatter.format(query.toString()));

            return query;
        }).then(response => {
            if (errCount === 0) {
                callback(false, {});
            } else {
                const msgUpdate = 'Contrato actualizado con estado INACTIVO! Cliente ya tenia un contrato activo!';
                const msgCreate = 'Contrato creado con estado INACTIVO! Cliente ya tenia un contrato activo!';
                let err = {
                    status: 300,
                    msg: (!obj.update) ? msgCreate:msgUpdate
                };
                throw err;
            }
        }).catch(err => {
            if (!err.msg) {
                const msgUpdate = `No fue posible actualizar contrato #${obj.contrato_numero}!!`;
                const msgCreate = `No fue posible crear contrato con empresa "${obj.empresaId}" y tercero "${obj.docType} - ${obj.docNum}"!!`;
                err.msg = (obj.update === undefined) ? msgCreate:msgUpdate;
            }
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.businessUnits = (obj, callback) => {
    console.log('In model "businessUnit"');

    promesa
        .then(response => {
            let filtro = 'true';
            if (obj.codigo_unidad_negocio) { filtro = `a.codigo_unidad_negocio = '${obj.codigo_unidad_negocio}'`; }

            let query = G.knex('unidades_negocio AS a')
                .column([
                    'a.codigo_unidad_negocio',
                    G.knex.raw('upper(a.descripcion) as descripcion'),
                    'a.empresa_id'])
                .where('a.estado', '1')
                .andWhere(G.knex.raw(filtro))
                .orderBy('codigo_unidad_negocio');

            return query;
        }).then(units => {
            if (units.length > 0) {
                for (let unit of units) {
                    unit.name = unit.codigo_unidad_negocio + ' - ' + unit.descripcion;
                }

            }
            callback(false, units);
        }).catch(err => {
            if (err.msg === undefined) { err.msg = 'Error al listar las unidades de negocio!'; }
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.existContractActive = (obj, callback) => {
    let response = {};
    let filtro = 'true';
    if (obj.tipo_id_tercero) { filtro += ` AND a.tipo_id_tercero = '${obj.tipo_id_tercero}'`; }
    if (obj.tercero_id) { filtro += ` AND a.tercero_id = '${obj.tercero_id}'`; }

    promesa
        .then(response => {
            const countContractsActives = `(
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
                    sub.estado != '0'
                ) as contratos_activos`;


            const selectColumns = [
                G.knex.raw(countContractsActives),
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
                    END as tipo_contrato`)];

            const query = G.knex.column(G.knex.raw(selectColumns))
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
                .where(G.knex.raw(filtro))
                .orderBy('contrato_numero');
            //console.log('Last Query: ', G.sqlformatter.format(query.toString()));

            return query;
        }).then(contractsActives => {
            if (contractsActives.length > 0 && contractsActives[0].contratos_activos > 0) {
                for (let contract of contractsActives) {
                    contract.check = contract.estado === '1';
                    contract.contrato_valor = obj.number_money(String(parseFloat(String(contract.contrato_valor))));
                }
                response = contractsActives;
            } else { response = []; }

            callback(false, response);
        }).catch(err => {
            if (err.msg === undefined) { err.msg = 'Error al consultar contratos activos!!'; }
            console.log('Err: ', err);
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.updateStatusContract = (obj, callback) => {
    console.log('In model "updateStatusContract"');
    let err = {};

    promesa
        .then(response => {
            if (obj.check) {
                return G.Q.nfcall(that.existContractActive, obj);
            } else { return true; }
        }).then(contractsActives => {
            if (contractsActives.length > 0 && contractsActives[0].contratos_activos > 0) {
                err.msg = 'El cliente ya tiene un contrato activo!!';
                err.contracts = contractsActives;
                err.status = 300;
                throw err;
            } else {
                return G.knex('vnts_contratos_clientes').where('contrato_cliente_id', obj.contrato_numero).update('estado', obj.check);
            }
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
