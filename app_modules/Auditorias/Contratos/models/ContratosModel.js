/* global G */
var AuditoriaContratos = function () {
};

/**
 * @author German Galvis
 * +Descripcion consulta todos los productos de los contratos que se esten
 * vendiendo por debajo del costo de compra
 * @params parametro: termino de busqueda 
 * @params callback: listado
 * @fecha 2019-05-30
 */
AuditoriaContratos.prototype.listarProductosContrato = function (parametros, callback) {

    var columnas = [
        "a.empresa_id",
        "d.nombre_tercero",
        "b.contrato_cliente_id",
        "b.codigo_producto",
        G.knex.raw("fc_descripcion_producto(b.codigo_producto) as descripcion"),
        "b.precio_pactado",
        "b.usuario_id",
        "e.nombre",
        "c.costo",
        "c.costo_ultima_compra",
        G.knex.raw("(c.costo_ultima_compra-(c.costo_ultima_compra * (f.porc_iva /100) )) as costo_sin_iva"),
        G.knex.raw("( b.precio_pactado - (c.costo_ultima_compra-(c.costo_ultima_compra * (f.porc_iva /100) ))) AS deficit")
    ];

    var query = G.knex.select(columnas)
            .from('vnts_contratos_clientes as a')
            .innerJoin("vnts_contratos_clientes_productos as b ", "b.contrato_cliente_id", "a.contrato_cliente_id")
            .innerJoin("inventarios  as c", function () {
                this.on("b.codigo_producto", "c.codigo_producto")
                        .on("a.empresa_id", "c.empresa_id");
            })
            .innerJoin("terceros as d", function () {
                this.on("d.tipo_id_tercero ", "a.tipo_id_tercero")
                        .on("d.tercero_id", "a.tercero_id");
            })
            .innerJoin("system_usuarios as e ", "e.usuario_id", "b.usuario_id")
            .innerJoin("inventarios_productos as f ", "f.codigo_producto", "c.codigo_producto")
            .where(function () {
                this.andWhere('a.estado', '1');
                this.andWhere(G.knex.raw("b.precio_pactado <= c.costo_ultima_compra"));

                if (parametros.filtro === 2) {
                    this.andWhere(G.knex.raw("b.codigo_producto " + G.constants.db().LIKE + "'%" + parametros.termino_busqueda + "%' "));
                }

                if (parametros.filtro === 1) {
                    this.andWhere(G.knex.raw("fc_descripcion_producto ( b.codigo_producto ) " + G.constants.db().LIKE + "'%" + parametros.termino_busqueda + "%' "));
                }
            })
            .orderBy('d.nombre_tercero', 'asc');



    if (parametros.tipo === 1) {
        query.limit(G.settings.limit).offset((parametros.pagina_actual - 1) * G.settings.limit);
    }

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosContrato]:", err);
        callback(err);
    });
};

module.exports = AuditoriaContratos;