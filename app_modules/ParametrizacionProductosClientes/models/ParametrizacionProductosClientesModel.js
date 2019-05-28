 /* global G */
let that;

let ParametrizacionProductosClientesModel = function () {
    that = this;
};

const promesa = new Promise((resolve, reject) => { resolve(true); });

ParametrizacionProductosClientesModel.prototype.listContracts = (filtros, callback) => {
    console.log('in model "listContracts"');
    let offset = 0;
    let limit = 30;

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

            return query;
        }).then(contratos => {
            if (contratos.length > 0) {
                for (let contrato of contratos) {
                    contrato.contrato_valor = filtros.number_money(contrato.contrato_valor);
                    contrato.check = false;
                    if (contrato.estado === '1') {
                        contrato.check = true;
                    }
                }
            }

            callback(false, contratos);
        }).catch(err => {
            if (err.msg === undefined) {
                err.msg = 'Error en consulta "listContracts"';
            }
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.updateStatusContract = (obj, callback) => {
    console.log('In model "updateStatusContract"');

    promesa
        .then(response => {
            console.log('0');
            let query = G.knex('vnts_contratos_clientes')
                .where('contrato_cliente_id', obj.contratoId)
                .update('estado', obj.newStatus);
            return query;
        }).then(response => {
            console.log('Query fine!!');
            callback(false, response);
        }).catch(err => {
            err.msg = 'Error al actualizar el contrato!';
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.listContractProducts = (obj, callback) => {
    console.log('In model "listContractProducts"');
    const offset = 0;
    const limit = 50;
    obj = {
        descripcion: '',
        laboratorio: '',
        principio_activo: '',
        number_money: obj.number_money
    };

    promesa
        .then(response => {
            const query = G.knex
                .column([
                    'a.codigo_producto as producto_codigo',
                    G.knex.raw('fc_descripcion_producto(b.codigo_producto) as producto_descripcion'),
                    'b.sw_requiereautorizacion_despachospedidos as producto_sw_autorizaciondespachos',
                    'a.precio_pactado as producto_precio_pactado'])
                .from('vnts_contratos_clientes_productos as a')
                .innerJoin('inventarios_productos as b', function () {
                    this.on('a.codigo_producto', 'b.codigo_producto')
                        .on('a.contrato_cliente_id', 'contrato_cliente_id')})
                .innerJoin('inv_subclases_inventarios as c', function () {
                    this.on('b.grupo_id', 'c.grupo_id')
                        .on('b.clase_id', 'c.clase_id')
                        .on('b.subclase_id', 'c.subclase_id')})
                .innerJoin('inv_clases_inventarios as d', function () {
                    this.on('c.grupo_id', 'd.grupo_id')
                        .on('c.clase_id', 'd.clase_id')}) /* --b.estado = '1' */
                .where('b.descripcion', 'ILIKE', `%${obj.descripcion}%`)
                .andWhere('c.descripcion', 'ILIKE', `%${obj.laboratorio}%`)
                .andWhere('d.descripcion', 'ILIKE', `%${obj.principio_activo}%`)
                .orderBy('b.descripcion')
                .limit(limit)
                .offset(offset);

            console.log('Query is: ', G.sqlformatter.format(query.toString()));
            return query;
        }).then(productos => {
            console.log('Sql fine!!!');
            if (productos.length > 0) {
                for (let producto of productos ) {
                    producto.producto_precio_pactado = obj.number_money(producto.producto_precio_pactado);
                }
            }
            callback(false, response);
        }).catch(err => {
            console.log('Error: ', err);
            callback(err);
        });
};

ParametrizacionProductosClientesModel.prototype.listInventaryProducts = (obj, callback) => {
    console.log('In model "listInventaryProducts"');
    const offset = 0;
    const limit = 50;

    promesa
        .then(response => {
            let query = G.knex
                .column([
                    'a.codigo_producto',
                    G.knex.raw('fc_descripcion_producto(b.codigo_producto) as descripcion'),
                    'b.sw_requiereautorizacion_despachospedidos',
                    G.knex.raw('(a.costo_ultima_compra)/((COALESCE(b.porc_iva,0)/100)+1) as costo_ultima_compra'),
                    'a.costo'])
                .from('inventarios as a')
                .innerJoin('inventarios_productos as b', function () {
                    this.on('a.codigo_producto', 'b.codigo_producto')
                        .on('a.empresa_id', obj.empresaId)})
                .innerJoin('inv_subclases_inventarios as c', function () {
                    this.on('b.grupo_id', 'c.grupo_id')
                        .on('b.clase_id', 'c.clase_id')
                        .on('b.subclase_id', 'c.subclase_id') })
                .innerJoin('inv_clases_inventarios as d', function () {
                    this.on('c.grupo_id', 'd.grupo_id')
                        .on('c.clase_id', 'd.clase_id') })
                .where('b.codigo_producto', 'ILIKE', '%' + obj.codigo_producto + '%') /* -- b.estado = '1' */
                .andWhere('b.descripcion', 'ILIKE', '%' + obj.descripcion + '%')
                .andWhere('c.descripcion', 'ILIKE', '%' + obj.laboratorio + '%')
                .andWhere('d.descripcion', 'ILIKE', '%' + obj.principio_activo + '%')
                .whereNotIn('b.codigo_producto',
                    G.knex
                        .column(['codigo_producto'])
                        .from('vnts_contratos_clientes_productos')
                        .where('contrato_cliente_id', obj.contratoClienteId))
                .limit(limit)
                .offset(offset)
                .orderBy('b.descripcion');

                console.log('Query is: ', G.sqlformatter.format(query.toString()));
            return query;
        }).then(response => {
            callback(false, response);
        }).catch(err => {
            console.log('Error: ', err);
            err.msg = `Error al consultar los productos del contrato "#${obj.contratoClienteId}"`;
            callback(err);
        });




};

ParametrizacionProductosClientesModel.$inject = [];

module.exports = ParametrizacionProductosClientesModel;
