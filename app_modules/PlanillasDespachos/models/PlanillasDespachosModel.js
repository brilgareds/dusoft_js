/* global G */
var PlanillasDespachosModel = function () {
};
/**
 * @author Cristian 
 * +Modifico German Galvis
 * +Descripcion lista las planillas de despacho realizadas
 * @fecha 2019-03-20 YYYY-MM-DD
 * @returns {callback}
 */
PlanillasDespachosModel.prototype.listar_planillas_despachos = function (fecha_inicial, fecha_final, termino_busqueda, callback) {

    var columnas = [
        "a.id",
        "a.id as numero_guia",
        "a.numero_guia_externo",
        "a.tipo_planilla",
        "b.transportadora_id",
        "b.descripcion as nombre_transportadora",
        "b.placa_vehiculo",
        "b.estado as estado_transportadora",
//        "e.tipo_pais_id as pais_id",
//        "e.pais as nombre_pais",
//        "d.tipo_dpto_id as departamento_id",
//        "d.departamento as nombre_departamento",
//        "a.ciudad_id",
//        "c.municipio as nombre_ciudad",
        "a.nombre_conductor",
        "a.observacion",
        "g.total_cajas",
        "g.total_neveras",
        "g.total_bolsas",
        "a.usuario_id",
        "f.nombre as nombre_usuario",
        "a.estado",
        G.knex.raw("case when a.estado = '0' then 'Anulada' \
                     when a.estado = '1' then 'Activa' \
                     when a.estado = '2' then 'Despachada' end as descripcion_estado"),
        G.knex.raw("to_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro"),
        G.knex.raw("to_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho")
    ];
    var query = G.knex.select(columnas)
            .from("inv_planillas_despacho as a")
            .innerJoin("inv_transportadoras as b", "b.transportadora_id", "a.inv_transportador_id")
//            .innerJoin('tipo_mpios as c', function () {
//
//                this.on("c.tipo_mpio_id", "a.ciudad_id")
//                        .on("c.tipo_dpto_id", "a.departamento_id")
//                        .on("c.tipo_pais_id", "a.pais_id");
//            })
//            .innerJoin('tipo_dptos as d', function () {
//
//                this.on("d.tipo_dpto_id", "c.tipo_dpto_id")
//                        .on("d.tipo_pais_id", "c.tipo_pais_id");
//            })
//            .innerJoin("tipo_pais as e", "e.tipo_pais_id", "d.tipo_pais_id")
            .innerJoin("system_usuarios as f", "f.usuario_id", "a.usuario_id")
            .leftJoin(G.knex.raw("(select a.planilla_id, sum(a.cantidad_cajas) as total_cajas, sum(a.cantidad_neveras) as total_neveras, sum(a.cantidad_bolsas) as total_bolsas\
                          from (select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, a.cantidad_bolsas, a.observacion, a.fecha_registro, 1\
                      from inv_planillas_detalle_farmacias a\
                      union\
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, a.cantidad_bolsas, a.observacion, a.fecha_registro, 2\
                      from inv_planillas_detalle_clientes a\
                      union all\
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, a.cantidad_bolsas, a.observacion, a.fecha_registro, 3\
                      from inv_planillas_detalle_empresas a \
                    ) as a group by 1\
                  ) as g "), function () {

                this.on("g.planilla_id", "a.id");
            }).where(G.knex.raw("a.fecha_registro between '" + fecha_inicial + "' and '" + fecha_final + "'"))
            .andWhere(G.knex.raw("( a.id::varchar " + G.constants.db().LIKE + "'%" + termino_busqueda + "%' or\
                    b.descripcion " + G.constants.db().LIKE + "'%" + termino_busqueda + "%' or\
                    b.placa_vehiculo " + G.constants.db().LIKE + "'%" + termino_busqueda + "%' or\
                    /*e.pais " + G.constants.db().LIKE + "'%" + termino_busqueda + "%' or\
                    d.departamento " + G.constants.db().LIKE + "'%" + termino_busqueda + "%' or\
                    c.municipio " + G.constants.db().LIKE + "'%" + termino_busqueda + "%' or\
                    */a.nombre_conductor " + G.constants.db().LIKE + "'%" + termino_busqueda + "%' or\
                    a.observacion " + G.constants.db().LIKE + "'%" + termino_busqueda + "%' )"))
            .orderBy('a.id', 'desc');

    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });
};
/**
 * @author Cristian 
 * +Modifico German Galvis
 * +Descripcion Consultar los documentos de despachos de una farmacia
 * @fecha 2019-03-20 YYYY-MM-DD
 * @returns {callback}
 */
PlanillasDespachosModel.prototype.consultar_documentos_despachos_por_farmacia = function (obj, callback) {

    var fecha = new Date();
    var formato = 'YYYY-MM-DD';
    fecha.setMonth(fecha.getMonth() - 1);

    var columnas = [
        G.knex.raw("'0' as tipo"),
        G.knex.raw("'FARMACIAS' as descripcion_tipo"),
        "b.farmacia_id",
        "b.centro_utilidad",
        "b.bodega",
        "b.estado as estado",
        "a.empresa_id",
        G.knex.raw("e.razon_social as nombre_empresa"),
        "d.centro_utilidad as centro_utilidad_id",
        "d.descripcion as nombre_centro_utilidad",
        "c.bodega as bodega_id",
        "c.descripcion as nombre_bodega",
        "a.prefijo",
        "a.numero",
        "a.solicitud_prod_a_bod_ppal_id as numero_pedido",
        "a.fecha_registro",
        G.knex.raw("'0' as estado_documento")
    ];

    if (obj.estadoListarValidacionDespachos !== 1) {
        columnas.push("h.cantidad_cajas");
        columnas.push("h.cantidad_neveras");
        columnas.push("h.cantidad_bolsas");
        columnas.push("h.id_aprobacion_planillas");
    } else {
        columnas.push(G.knex.raw("(SELECT id_aprobacion_planillas FROM aprobacion_despacho_planillas_d as bb WHERE bb.prefijo = a.prefijo AND bb.numero = a.numero and (bb.cantidad_cajas > 0 or bb.cantidad_neveras > 0 or bb.cantidad_bolsas > 0) ) as id_aprobacion_planillas"));
    }


    var query = G.knex.select(columnas)
            .from("inv_bodegas_movimiento_despachos_farmacias as a")
            .innerJoin("solicitud_productos_a_bodega_principal as b", "b.solicitud_prod_a_bod_ppal_id", "a.solicitud_prod_a_bod_ppal_id")
            .innerJoin('bodegas as c', function () {

                this.on("c.empresa_id", "b.farmacia_id")
                        .on("c.centro_utilidad", "b.centro_utilidad")
                        .on("c.bodega", "b.bodega");
            })
            .innerJoin('centros_utilidad as d', function () {

                this.on("d.empresa_id", "c.empresa_id")
                        .on("d.centro_utilidad", "c.centro_utilidad");
            })
            .innerJoin("empresas as e", "e.empresa_id", "d.empresa_id");
    if (obj.estadoListarValidacionDespachos === 1) {
        query.leftJoin(G.knex.raw("( SELECT f.prefijo, f.numero FROM aprobacion_despacho_planillas_d f\
                                           UNION SELECT g.prefijo, g.numero FROM aprobacion_despacho_planillas g) as h"), function () {

            this.on("h.prefijo", "a.prefijo")
                    .on("h.numero", "a.numero");
        });
    } else {
        query.innerJoin(G.knex.raw("( SELECT f.prefijo, f.numero, f.cantidad_cajas, f.cantidad_neveras, f.cantidad_bolsas, f.id_aprobacion_planillas FROM aprobacion_despacho_planillas_d f\
                                           UNION SELECT g.prefijo, g.numero, g.cantidad_cajas, g.cantidad_neveras, g.cantidad_bolsas, g.id_aprobacion_planillas FROM aprobacion_despacho_planillas g) as h"), function () {

            this.on("h.prefijo", "a.prefijo")
                    .on("h.numero", "a.numero");
        });
    }

    query.where(function () {
        this.andWhere(G.knex.raw("a.fecha_registro >= '" + G.moment(fecha).format(formato) + "'"));
        this.andWhere('a.empresa_id', obj.empresa_id);
        this.andWhere('b.farmacia_id', obj.farmacia_id);
        this.andWhere('b.centro_utilidad', obj.centro_utilidad_id);
        this.andWhere(G.knex.raw("a.prefijo || '-' || a.numero NOT IN( select b.prefijo || '-' || b.numero from inv_planillas_detalle_farmacias b )"));
        if (obj.estadoListarValidacionDespachos === 1) {
            this.andWhere(G.knex.raw("a.prefijo || '-' || a.numero NOT IN( select b.prefijo || '-' || b.numero from aprobacion_despacho_planillas_d b )"));
            this.whereIn('b.estado', [2, 3, 8, 9]);
        }
        this.andWhere(G.knex.raw("( a.prefijo || ' ' || a.numero :: varchar " + G.constants.db().LIKE + "'%" + obj.termino_busqueda + "%' or \
                    a.numero :: varchar " + G.constants.db().LIKE + "'%" + obj.termino_busqueda + "%' or \
                    a.solicitud_prod_a_bod_ppal_id :: varchar " + G.constants.db().LIKE + "'%" + obj.termino_busqueda + "%')"));
    });
    query.orderBy('a.fecha_registro', 'desc');
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error >>>>>>>>>> ", err);
        callback(err);
    });
};
/**
 * @author Cristian 
 * +Modifico German Galvis
 * +Descripcion Consultar los documentos de despachos de un cliente
 * @fecha 2019-03-20 YYYY-MM-DD
 * @returns {callback}
 */
PlanillasDespachosModel.prototype.consultar_documentos_despachos_por_cliente = function (obj, callback) {

    var columnas = [
        G.knex.raw(" '1' as tipo"),
        G.knex.raw("'CLIENTES' as descripcion_tipo"),
        "a.empresa_id",
        "a.prefijo",
        "a.numero",
        "b.estado_pedido as estado",
        G.knex.raw("a.pedido_cliente_id as numero_pedido"),
        "a.fecha_registro",
        G.knex.raw("case when (\
                    SELECT j.numero\
                    FROM (\
                        SELECT f.prefijo, f.numero, f.id_aprobacion_planillas FROM aprobacion_despacho_planillas_d f \
                        WHERE f.prefijo = a.prefijo AND f.numero = a.numero\
                        UNION\
                        SELECT g.prefijo, g.numero, g.id_aprobacion_planillas FROM aprobacion_despacho_planillas g\
                        WHERE g.prefijo = a.prefijo AND g.numero = a.numero\
                    ) as j\
                ) is null then '0'\
                ELSE '1' end as estado_documento")
    ];


    if (obj.estadoListarValidacionDespachos !== 1) {
        columnas.push("h.cantidad_cajas");
        columnas.push("h.cantidad_neveras");
        columnas.push("h.cantidad_bolsas");
    }

    var query = G.knex.select(columnas)
            .from("inv_bodegas_movimiento_despachos_clientes as a")
            .innerJoin("ventas_ordenes_pedidos as b", "b.pedido_cliente_id", "a.pedido_cliente_id");
    if (obj.estadoListarValidacionDespachos === 1) {
        query.leftJoin(G.knex.raw("( SELECT f.prefijo, f.numero FROM aprobacion_despacho_planillas_d f\
                                           UNION SELECT g.prefijo, g.numero FROM aprobacion_despacho_planillas g) as h"), function () {

            this.on("h.prefijo", "a.prefijo")
                    .on("h.numero", "a.numero");
        });
    } else {
        query.innerJoin(G.knex.raw("( SELECT f.prefijo, f.numero, f.cantidad_cajas, f.cantidad_neveras, f.cantidad_bolsas FROM aprobacion_despacho_planillas_d f\
                                           UNION SELECT g.prefijo, g.numero, g.cantidad_cajas, g.cantidad_neveras, g.cantidad_bolsas FROM aprobacion_despacho_planillas g) as h"), function () {

            this.on("h.prefijo", "a.prefijo")
                    .on("h.numero", "a.numero");
        });
    }

    query.where(function () {

        this.andWhere('a.empresa_id', obj.empresa_id);
        this.andWhere('a.tipo_id_tercero', obj.tipo_id);
        this.andWhere('a.tercero_id', obj.tercero_id);
        this.whereIn('b.estado_pedido', [2, 3, 8, 9]);
        this.andWhere(G.knex.raw("a.prefijo || '-' || a.numero NOT IN( select b.prefijo || '-' || b.numero from inv_planillas_detalle_clientes b )"));
        this.andWhere(G.knex.raw("( a.prefijo || ' ' || a.numero :: varchar " + G.constants.db().LIKE + "'%" + obj.termino_busqueda + "%' or \
                    a.numero :: varchar " + G.constants.db().LIKE + "'%" + obj.termino_busqueda + "%' or \
                    a.pedido_cliente_id :: varchar " + G.constants.db().LIKE + "'%" + obj.termino_busqueda + "%')"));
    });
    query.orderBy('a.fecha_registro', 'desc');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error en planillas clientes ", err);
        callback(err);
    });
};
/**
 * @author Cristian 
 * +Modifico German Galvis
 * +Descripcion consulta la informacion de la planilla para mostrarla en el PDF
 * @fecha 2019-03-21 YYYY-MM-DD
 * @returns {callback}
 */
PlanillasDespachosModel.prototype.consultar_planilla_despacho = function (planilla_id, callback) {

    var columnas = [
        "a.id",
        "a.id as numero_guia",
        "a.numero_guia_externo",
        "a.numero_placa_externo",
        "a.tipo_planilla",
        "b.transportadora_id",
        "b.descripcion as nombre_transportadora",
        "b.placa_vehiculo",
        "b.estado as estado_transportadora",
//        "e.tipo_pais_id as pais_id",
//        "e.pais as nombre_pais",
//        "d.tipo_dpto_id as departamento_id",
//        "d.departamento as nombre_departamento",
//        "a.ciudad_id",
//        "c.municipio as nombre_ciudad",
        "a.nombre_conductor",
        "a.observacion",
        "g.total_cajas",
        "g.total_neveras",
        "g.total_bolsas",
        "a.usuario_id",
        "f.nombre as nombre_usuario",
        "a.estado",
        G.knex.raw("case when a.estado = '0' then 'Anulada' \
                     when a.estado = '1' then 'Activa' \
                     when a.estado = '2' then 'Despachada' end as descripcion_estado"),
        G.knex.raw("to_char(a.fecha_registro,'dd-mm-yyyy') as fecha_registro"),
        G.knex.raw("to_char(a.fecha_despacho,'dd-mm-yyyy') as fecha_despacho")
    ];
    var query = G.knex.select(columnas)
            .from("inv_planillas_despacho as a")
            .innerJoin("inv_transportadoras as b", "b.transportadora_id", "a.inv_transportador_id")
//            .innerJoin('tipo_mpios as c', function () {
//
//                this.on("c.tipo_mpio_id", "a.ciudad_id")
//                        .on("c.tipo_dpto_id", "a.departamento_id")
//                        .on("c.tipo_pais_id", "a.pais_id");
//            })
//            .innerJoin('tipo_dptos as d', function () {
//
//                this.on("d.tipo_dpto_id", "c.tipo_dpto_id")
//                        .on("d.tipo_pais_id", "c.tipo_pais_id");
//            })
//            .innerJoin("tipo_pais as e", "e.tipo_pais_id", "d.tipo_pais_id")
            .innerJoin("system_usuarios as f", "f.usuario_id", "a.usuario_id")
            .leftJoin(G.knex.raw("(select a.planilla_id, sum(a.cantidad_cajas) as total_cajas, sum(a.cantidad_neveras) as total_neveras, sum(a.cantidad_bolsas) as total_bolsas\
                          from (select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, a.cantidad_bolsas, a.observacion, a.fecha_registro, 1\
                      from inv_planillas_detalle_farmacias a\
                      union \
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, a.cantidad_bolsas, a.observacion, a.fecha_registro, 2\
                      from inv_planillas_detalle_clientes a\
                      union all \
                      select a.inv_planillas_despacho_id as planilla_id, a.cantidad_cajas, a.cantidad_neveras, a.cantidad_bolsas, a.observacion, a.fecha_registro, 3\
                      from inv_planillas_detalle_empresas a \
                    ) as a group by 1\
                  ) as g "), function () {

                this.on("g.planilla_id", "a.id");
            })
            .where('a.id', planilla_id);
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });
};
/**
 * @author Cristian 
 * +Modifico German Galvis
 * +Descripcion Consultar los documentos de despachos de un cliente pertenecientes a una planilla
 * @fecha 2019-03-21 YYYY-MM-DD
 * @returns {callback}
 */
PlanillasDespachosModel.prototype.consultar_documentos_planilla_despacho = function (planilla_id, termino_busqueda, callback) {
    var sql = "";
    if (planilla_id !== undefined && planilla_id !== "") {
        sql = " and a.planilla_id = :1 ";
    }
    if (termino_busqueda !== undefined && termino_busqueda !== "") {
        sql += " and ( a.descripcion_destino " + G.constants.db().LIKE + " :2 )"
    }

    var sql = " select *,false as chequeado from (\
                    select \
                    '0' as tipo,\
                    'FARMACIAS' as descripcion_tipo,\
                    a.id,\
                    (\
                    SELECT muni.municipio\
                    from inv_planillas_despacho as ipd\
                    INNER JOIN tipo_mpios as muni ON (ipd.ciudad_id = muni.tipo_mpio_id and ipd.departamento_id = muni.tipo_dpto_id)\
                    where ipd.id = a.inv_planillas_despacho_id\
                    ) as ciudad,\
                    a.inv_planillas_despacho_id as planilla_id,\
                    a.empresa_id,\
                    d.descripcion as descripcion_destino,\
                    d.ubicacion as direccion_destino,\
                    a.prefijo,\
                    a.numero,\
                    b.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                    a.cantidad_cajas,\
                    a.cantidad_neveras,\
                    a.cantidad_bolsas,\
                    a.temperatura_neveras,\
                    a.observacion,\
                    '' as descripcion_sede,\
                    '' as direccion_sede,\
                    ( select a.prefijo||'-'||a.factura_fiscal\
                    from( \
                    SELECT a.prefijo,a.factura_fiscal\
                    FROM  inv_facturas_despacho as a\
                    where pedido_cliente_id = b.solicitud_prod_a_bod_ppal_id\
                    UNION\
                    SELECT a.prefijo,a.factura_fiscal\
                    FROM  inv_facturas_agrupadas_despacho_d as a\
                    where pedido_cliente_id = b.solicitud_prod_a_bod_ppal_id\
                    ) as a\
                    ) as factura,\
                    a.usuario_id,\
                    a.lio_id \
                    from inv_planillas_detalle_farmacias a\
                    inner join inv_bodegas_movimiento_despachos_farmacias b on a.empresa_id = b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                    inner join solicitud_productos_a_bodega_principal c on b.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id\
                    inner join bodegas d on c.farmacia_id = d.empresa_id and c.centro_utilidad = d.centro_utilidad and c.bodega = d.bodega\
                    inner join centros_utilidad e on d.empresa_id = e.empresa_id and d.centro_utilidad = e.centro_utilidad\
                    inner join (\n\
                        SELECT  distinct on(g.cantidad_cajas,g.cantidad_neveras,g.cantidad_bolsas, g.numero, g.prefijo) g.cantidad_cajas, g.cantidad_neveras, g.cantidad_bolsas, g.numero, g.prefijo \
                        FROM aprobacion_despacho_planillas f \n\
                        INNER JOIN aprobacion_despacho_planillas_d g ON g.id_aprobacion_planillas = f.id_aprobacion_planillas\
                    ) as f ON (f.numero = a.numero and f.prefijo = a.prefijo)\
                    UNION \
                    select \
                    '1' as tipo,\
                    'CLIENTES' as descripcion_tipo,\
                    a.id,\
                    (\
                    SELECT muni.municipio\
                    from inv_planillas_despacho as ipd\
                    INNER JOIN tipo_mpios as muni ON (ipd.ciudad_id = muni.tipo_mpio_id and ipd.departamento_id = muni.tipo_dpto_id)\
                    where ipd.id = a.inv_planillas_despacho_id\
                    ) as ciudad,\
                    a.inv_planillas_despacho_id as planilla_id,\
                    a.empresa_id,\
                    d.nombre_tercero as descripcion_destino,\
                    d.direccion as direccion_destino,\
                    a.prefijo,\
                    a.numero,\
                    b.pedido_cliente_id as numero_pedido,\
                    a.cantidad_cajas,\
                    a.cantidad_neveras,\
                    a.cantidad_bolsas,\
                    a.temperatura_neveras,\
                    a.observacion,\
                    f.nombre_tercero as descripcion_sede,\
                    f.direccion as direccion_sede,\
                    ( select a.prefijo||'-'||a.factura_fiscal\
                    from( \
                    SELECT a.prefijo,a.factura_fiscal\
                    FROM  inv_facturas_despacho as a\
                    where pedido_cliente_id = b.pedido_cliente_id\
                    UNION\
                    SELECT a.prefijo,a.factura_fiscal\
                    FROM  inv_facturas_agrupadas_despacho_d as a\
                    where pedido_cliente_id = b.pedido_cliente_id\
                    limit 1\
                    ) as a\
                    ) as factura,\
                    a.usuario_id,\
                    a.lio_id\
                    from inv_planillas_detalle_clientes a\
                    inner join inv_bodegas_movimiento_despachos_clientes b on a.empresa_id = b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                    inner join ventas_ordenes_pedidos c on b.pedido_cliente_id = c.pedido_cliente_id\
                    inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id = d.tercero_id\
                    left join terceros f on c.tipo_id_sede = f.tipo_id_tercero and c.sede_id = f.tercero_id\
                    UNION\
                    select \
                    '2' as tipo,\
                    'EMPRESAS' as descripcion_tipo,\
                    a.id,\
                    (\
                    SELECT muni.municipio\
                    from inv_planillas_despacho as ipd\
                    INNER JOIN tipo_mpios as muni ON (ipd.ciudad_id = muni.tipo_mpio_id and ipd.departamento_id = muni.tipo_dpto_id)\
                    where ipd.id = a.inv_planillas_despacho_id\
                    ) as ciudad,\
                    a.inv_planillas_despacho_id as planilla_id,\
                    a.empresa_id,\
                    d.descripcion as descripcion_destino,\
                    d.ubicacion as direccion_destino,\
                    a.prefijo,\
                    a.numero,\
                    0 as numero_pedido,\
                    a.cantidad_cajas,\
                    a.cantidad_neveras,\
                    a.cantidad_bolsas,\
                    a.temperatura_neveras,\
                    a.observacion,\
                    '' as descripcion_sede,\
                    '' as direccion_sede,\
                    '' as factura,\
                    a.usuario_id,\
                    a.lio_id\
                    from inv_planillas_detalle_empresas a\
                    inner join (\
                        SELECT distinct on(g.cantidad_cajas,g.cantidad_neveras,g.cantidad_bolsas, g.numero, g.prefijo) f.cantidad_cajas, f.cantidad_neveras, f.cantidad_bolsas, g.numero, g.prefijo\
                        FROM aprobacion_despacho_planillas f \
                        INNER JOIN aprobacion_despacho_planillas_d g ON g.id_aprobacion_planillas = f.id_aprobacion_planillas\
                    ) as b ON (b.prefijo = a.prefijo AND b.numero = a.numero)\
                    inner join bodegas d on a.empresa_destino = d.empresa_id and a.centro_utilidad = d.centro_utilidad and a.bodega = d.bodega\
                ) as a where true " + sql + ";";
    var query = G.knex.raw(sql, {1: planilla_id, 2: '%' + termino_busqueda + '%'});
    query.then(function (resultado) {
        callback(false, resultado.rows);
    }).catch(function (err) {
        console.log("error generado ", err);
        callback(err);
    });
};

PlanillasDespachosModel.prototype.consultar_documentos_planilla_despacho_detalle = function (planilla_id, termino_busqueda, obj, callback) {
    var sql1 = "";
    var sql3 = "";
    if (planilla_id !== undefined && planilla_id !== "") {
        sql1 = " and a.planilla_id = :1 ";
    }
    if (termino_busqueda !== undefined && termino_busqueda !== "") {
        sql1 += " and ( a.descripcion_destino " + G.constants.db().LIKE + " :2 )"
    }

    if (obj.tercero_id !== undefined && obj.tercero_id !== "" && obj.tercero_id !== null && (planilla_id === "" || planilla_id === undefined)) {
        sql1 += " and ( a.tercero_id = :3  and a.tipo_id_tercero = :4 ) "
        sql3 += " and ( a.tercero_id = :3  and a.tipo_id_tercero = :4 ) "
    }
    if (obj.modificar === 1) {
        sql1 += " AND b.planilla_id is not null";
        if (planilla_id !== "" && planilla_id !== undefined) {
            if (obj.registro_salida_bodega_id !== undefined && obj.registro_salida_bodega_id !== "") {
                sql3 += " AND q.registro_salida_bodega_id = " + obj.registro_salida_bodega_id;
                sql1 += " AND b.registro_salida_bodega_id = " + obj.registro_salida_bodega_id;
            } else {
                sql3 += " AND q.planilla_id = :1";
            }
        }
        sql3 += " AND q.planilla_id is not null";
    } else if (obj.modificar === 0) {
        // sql1 += " AND b.planilla_id is null";  
        if (planilla_id !== "" && planilla_id !== undefined) {
            sql3 += " AND q.planilla_id = :1";
        }
//        sql3 += " AND (q.planilla_id is null or q.planilla_id='0')";
         
        sql3 += " AND q.planilla_id is null";
    }

    var sql = "( select a.*,case when b.planilla_id is not null then true else false end  as chequeado from (\
                    select \
                    '0' as tipo,\
                    'FARMACIAS' as descripcion_tipo,\
                    a.id,\
                    (\
                    SELECT muni.municipio\
                    from inv_planillas_despacho as ipd\
                    INNER JOIN tipo_mpios as muni ON (ipd.ciudad_id = muni.tipo_mpio_id and ipd.departamento_id = muni.tipo_dpto_id)\
                    where ipd.id = a.inv_planillas_despacho_id\
                    ) as ciudad,\
                    a.inv_planillas_despacho_id as planilla_id,\
                    a.empresa_id,\
                    e.descripcion as descripcion_destino,\
                    e.ubicacion as direccion_destino,\
                    d.tipo_id_tercero,\
                    d.tercero_id,\
                    a.prefijo,\
                    a.numero,\
                    b.solicitud_prod_a_bod_ppal_id as numero_pedido,\
                    f.cantidad_cajas,\
                    f.cantidad_neveras,\
                    f.cantidad_bolsas,\
                    a.temperatura_neveras,\
                    a.observacion,\
                    '' as descripcion_sede,\
                    '' as direccion_sede,\
                    ( select a.prefijo||'-'||a.factura_fiscal\
                    from( \
                    SELECT a.prefijo,a.factura_fiscal\
                    FROM  inv_facturas_despacho as a\
                    where pedido_cliente_id = b.solicitud_prod_a_bod_ppal_id\
                    UNION\
                    SELECT a.prefijo,a.factura_fiscal\
                    FROM  inv_facturas_agrupadas_despacho_d as a\
                    where pedido_cliente_id = b.solicitud_prod_a_bod_ppal_id\
                    ) as a\
                    ) as factura,\
                    a.usuario_id \
                    from inv_planillas_detalle_farmacias a\
                    inner join inv_bodegas_movimiento_despachos_farmacias b on a.empresa_id = b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                    inner join solicitud_productos_a_bodega_principal c on b.solicitud_prod_a_bod_ppal_id = c.solicitud_prod_a_bod_ppal_id\
                    inner join bodegas d on c.farmacia_id = d.empresa_id and c.centro_utilidad = d.centro_utilidad and c.bodega = d.bodega\
                    inner join centros_utilidad e on d.empresa_id = e.empresa_id and d.centro_utilidad = e.centro_utilidad\
                    inner join (\n\
                        SELECT  distinct on(g.cantidad_cajas,g.cantidad_neveras,g.cantidad_bolsas, g.numero, g.prefijo) g.cantidad_cajas, g.cantidad_neveras, g.numero, g.prefijo ,g.cantidad_bolsas \
                        FROM aprobacion_despacho_planillas f \
                        INNER JOIN aprobacion_despacho_planillas_d g ON g.id_aprobacion_planillas = f.id_aprobacion_planillas\
                    ) as f ON (f.numero = a.numero and f.prefijo = a.prefijo)\
                    UNION \
                    select \
                    '1' as tipo,\
                    'CLIENTES' as descripcion_tipo,\
                    a.id,\
                    (\
                    SELECT muni.municipio\
                    from inv_planillas_despacho as ipd\
                    INNER JOIN tipo_mpios as muni ON (ipd.ciudad_id = muni.tipo_mpio_id and ipd.departamento_id = muni.tipo_dpto_id)\
                    where ipd.id = a.inv_planillas_despacho_id\
                    ) as ciudad,\
                    a.inv_planillas_despacho_id as planilla_id,\
                    a.empresa_id,\
                    d.nombre_tercero as descripcion_destino,\
                    d.direccion as direccion_destino,\
                    d.tipo_id_tercero,\
                    d.tercero_id,\
                    a.prefijo,\
                    a.numero,\
                    b.pedido_cliente_id as numero_pedido,\
                    e.cantidad_cajas,\
                    e.cantidad_neveras,\
                    e.cantidad_bolsas,\
                    a.temperatura_neveras,\
                    a.observacion,\
                    f.nombre_tercero as descripcion_sede,\
                    f.direccion as direccion_sede,\
                    ( select a.prefijo||'-'||a.factura_fiscal\
                    from( \
                    SELECT a.prefijo,a.factura_fiscal\
                    FROM  inv_facturas_despacho as a\
                    where pedido_cliente_id = b.pedido_cliente_id\
                    UNION\
                    SELECT a.prefijo,a.factura_fiscal\
                    FROM  inv_facturas_agrupadas_despacho_d as a\
                    where pedido_cliente_id = b.pedido_cliente_id\
                    limit 1\
                    ) as a\
                    ) as factura,\
                    a.usuario_id\
                    from inv_planillas_detalle_clientes a\
                    inner join inv_bodegas_movimiento_despachos_clientes b on a.empresa_id = b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero\
                    inner join ventas_ordenes_pedidos c on b.pedido_cliente_id = c.pedido_cliente_id\
                    inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id = d.tercero_id\
                    left join terceros f on c.tipo_id_sede = f.tipo_id_tercero and c.sede_id = f.tercero_id\
                    inner join (\n\
                        SELECT distinct on(g.cantidad_cajas,g.cantidad_neveras,g.cantidad_bolsas, g.numero, g.prefijo) g.cantidad_cajas, g.cantidad_neveras, g.numero, g.prefijo,g.cantidad_bolsas\
                        FROM aprobacion_despacho_planillas f \
                        INNER JOIN aprobacion_despacho_planillas_d g ON g.id_aprobacion_planillas = f.id_aprobacion_planillas\
                    ) as e ON (e.numero = a.numero and e.prefijo = a.prefijo)\
                    UNION\
                    select \
                    '2' as tipo,\
                    'EMPRESAS' as descripcion_tipo,\
                    a.id,\
                    (\
                    SELECT muni.municipio\
                    from inv_planillas_despacho as ipd\
                    INNER JOIN tipo_mpios as muni ON (ipd.ciudad_id = muni.tipo_mpio_id and ipd.departamento_id = muni.tipo_dpto_id)\
                    where ipd.id = a.inv_planillas_despacho_id\
                    ) as ciudad,\
                    a.inv_planillas_despacho_id as planilla_id,\
                    a.empresa_id,\
                    d.descripcion as descripcion_destino,\
                    d.ubicacion as direccion_destino,\
                    d.tipo_id_tercero,\
                    d.tercero_id, \
                    a.prefijo,\
                    a.numero,\
                    0 as numero_pedido,\
                    a.cantidad_cajas,\
                    a.cantidad_neveras,\
                    a.cantidad_bolsas,\
                    a.temperatura_neveras,\
                    a.observacion,\
                    '' as descripcion_sede,\
                    '' as direccion_sede,\
                    '' as factura,\
                    a.usuario_id\
                    from inv_planillas_detalle_empresas a\
                    inner join (\
                        SELECT distinct on(g.cantidad_cajas,g.cantidad_neveras,g.cantidad_bolsas, g.numero, g.prefijo) f.cantidad_cajas, f.cantidad_neveras, g.numero, g.prefijo,g.cantidad_bolsas\
                        FROM aprobacion_despacho_planillas f \
                        INNER JOIN aprobacion_despacho_planillas_d g ON g.id_aprobacion_planillas = f.id_aprobacion_planillas\
                    ) as b ON (b.prefijo = a.prefijo AND b.numero = a.numero)\
                    inner join bodegas d on a.empresa_destino = d.empresa_id and a.centro_utilidad = d.centro_utilidad and a.bodega = d.bodega\
                ) as a \
                 left join inv_registro_salida_bodega_detalle as b on (b.prefijo_id=a.prefijo and a.numero=b.numero and a.tipo=b.tipo and a.id=b.id and a.planilla_id=b.planilla_id and a.empresa_id=b.empresa_id)\
                 where true " + sql1 + ")";
    var sql2 = "(select\
        '1' as tipo,\
        'CLIENTES' as descripcion_tipo,\
        a.numero as id,\
        d.municipio as ciudad,\
        0 as planilla_id,\
        a.empresa_id,\
        c.nombre_tercero, \
        c.direccion,\
	a.tipo_id_tercero,\
	a.tercero_id,\
        a.prefijo,\
        a.numero,\
        a.pedido_cliente_id as numero_pedido,\
	h.cantidad_cajas,\
	h.cantidad_neveras,\
	h.cantidad_bolsas,\
	 cast('0.0' as double precision )  as temperatura_neveras,\
	a.observacion,\
	'' as descripcion_sede,\
	'' as direccion_sede,\
	'' as factura,\
	a.usuario_id,\
        case\
            when q.planilla_id is not null then true\
            else false\
        end  as chequeado\
            \
         from\
             inv_bodegas_movimiento_despachos_clientes as a\
         inner join\
             ventas_ordenes_pedidos as b\
                 on b.pedido_cliente_id = a.pedido_cliente_id\
         inner join terceros as c on a.tipo_id_tercero = c.tipo_id_tercero and a.tercero_id=c.tercero_id\
         inner join tipo_mpios as d on d.tipo_pais_id = c.tipo_pais_id and d.tipo_dpto_id = c.tipo_dpto_id and c.tipo_mpio_id = d.tipo_mpio_id\
         inner join\
         (\
                SELECT\
                    f.prefijo,\
                    f.numero,\
                    f.cantidad_cajas,\
                    f.cantidad_neveras,\
                    f.cantidad_bolsas\
                FROM\
                    aprobacion_despacho_planillas_d f\
                UNION\
                SELECT\
                    g.prefijo,\
                    g.numero,\
                    g.cantidad_cajas,\
                    g.cantidad_neveras,\
                    g.cantidad_bolsas\
                FROM\
                    aprobacion_despacho_planillas g\
        ) as h on h.prefijo = a.prefijo and h.numero = a.numero\
        left join\
            inv_registro_salida_bodega_detalle as q\
                on (\
                    q.prefijo_id=a.prefijo\
                    and a.numero=q.numero\
                    and q.tipo='1'\
                    and q.id=a.numero \
                    and a.empresa_id=q.empresa_id\
                )\
        where\
            (\
               b.estado_pedido in (\
                    '2', '3', '8', '9','4','5'\
                ) " + sql3 + "\
                and a.prefijo || '-' || a.numero NOT IN(\
                    select\
                        b.prefijo || '-' || b.numero\
                    from\
                        inv_planillas_detalle_clientes b\
                )\
                and (\
                    a.prefijo || ' ' || a.numero :: varchar ilike'%%'\
                    or a.numero :: varchar ilike'%%'\
                    or a.pedido_cliente_id :: varchar ilike'%%'\
                )\
            )\
        order by\
            a.fecha_registro desc)";

    var sql3 = sql + " union " + sql2;

    var query = G.knex.raw(sql3, {1: planilla_id, 2: '%' + termino_busqueda + '%', 3: obj.tercero_id, 4: obj.tipo_id_tercero});
//console.log(G.sqlformatter.format(query.toString())); 
    query.then(function (resultado) {
        callback(false, resultado.rows);
    }).catch(function (err) {
        console.log("error generado ", err);
        callback(err);
    });
};
/**
 * +Descripcion: Funcion encargada de ingresar planilla 
 * @param {type} parametros
 * @param {type} callback
 * @returns {undefined} */
PlanillasDespachosModel.prototype.ingresar_planilla_despacho = function (parametros, callback) {

    var query = G.knex('inv_planillas_despacho').
            returning('id').
//            insert({pais_id: parametros.pais_id, departamento_id: parametros.departamento_id, ciudad_id: parametros.ciudad_id, tipo_planilla: parametros.tipo_planilla,
            insert({tipo_planilla: parametros.tipo_planilla,
                inv_transportador_id: parametros.transportador_id, nombre_conductor: parametros.nombre_conductor, observacion: parametros.observacion,
                numero_guia_externo: parametros.numero_guia_externo, usuario_id: parametros.usuario_id, numero_placa_externo: parametros.numero_placa_externo
            });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error ingresar_planilla_despacho", err);
        callback(err);
    }).done();

};
/**
 * @author Cristian 
 * +Modifico German Galvis
 * +Descripcion ingresa los documentos a la planilla 
 * @fecha 2019-03-29 YYYY-MM-DD
 * @returns {callback}
 */
PlanillasDespachosModel.prototype.ingresar_documentos_planilla = function (tabla, obj, callback) {

    var query = G.knex(G.knex.raw("" + tabla));

    if (obj.tipo === '2') {
        query.insert({inv_planillas_despacho_id: obj.planilla_id, empresa_id: obj.empresa_id, prefijo: obj.prefijo,
            numero: obj.numero, cantidad_cajas: obj.cantidad_cajas, cantidad_neveras: obj.cantidad_neveras,
            temperatura_neveras: obj.temperatura_neveras, observacion: obj.observacion, usuario_id: obj.usuario_id,
            empresa_destino: obj.empresa_cliente, centro_utilidad: obj.centro_cliente, bodega: obj.bodega_cliente,
            cantidad_bolsas: obj.cantidad_bolsas
        });
    } else {
        query.insert({inv_planillas_despacho_id: obj.planilla_id, empresa_id: obj.empresa_id, prefijo: obj.prefijo,
            numero: obj.numero, cantidad_cajas: obj.cantidad_cajas, cantidad_neveras: obj.cantidad_neveras,
            temperatura_neveras: obj.temperatura_neveras, observacion: obj.observacion, usuario_id: obj.usuario_id,
            cantidad_bolsas: obj.cantidad_bolsas
        });
    }

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });
};
PlanillasDespachosModel.prototype.eliminar_documento_planilla = function (tabla, planilla_id, empresa_id, prefijo, numero, callback) {

    var sql = " delete from " + tabla + " where inv_planillas_despacho_id = :1 and empresa_id = :2 and  prefijo = :3 and  numero = :4";
    var parametros = {1: planilla_id, 2: empresa_id, 3: prefijo, 4: numero};
    G.knex.raw(sql, parametros).then(function (resultado) {
        callback(false, resultado.rows, resultado);
    }).catch(function (err) {
        callback(err);
    });
};
PlanillasDespachosModel.prototype.modificar_estado_planilla_despacho = function (planilla_id, estado, callback) {


    var sql = " update inv_planillas_despacho set estado = :2, fecha_despacho = NOW() where id = :1; ";
    var parametros = {1: planilla_id, 2: estado};
    G.knex.raw(sql, parametros).then(function (resultado) {

        callback(false, resultado.rows, resultado);
    }).catch(function (err) {

        callback(err);
    });
};
// Consultar las cajas, bolsas y neveras de un documento (se usa en aprobacion de despachos y planillas)
PlanillasDespachosModel.prototype.consultarCantidadCajaNevera = function (obj, callback) {

    var params = {1: obj.empresa_id, 2: obj.prefijo, 3: obj.numero};
    var sql = "";
    if (obj.esPlanillas) {
        sql = " SELECT bb.cantidad_cajas as total_cajas, bb.cantidad_neveras as total_neveras, bb.cantidad_bolsas as total_bolsas\
                FROM aprobacion_despacho_planillas aa \
                INNER JOIN aprobacion_despacho_planillas_d AS bb ON (aa.id_aprobacion_planillas = bb.id_aprobacion_planillas) \
                WHERE bb.prefijo = :2 AND bb.numero = :3; ";
    } else {

        sql = " SELECT\
                    (\
                            SELECT coalesce(max(b.numero_caja),'0') as total_cajas\
                            FROM inv_bodegas_movimiento_d b  where b.empresa_id = :1\
                            AND  b.prefijo = :2 AND b.numero = :3  and b.tipo_caja = '0'\
                    ) as total_cajas,\
                    (\
                            SELECT coalesce(max(b.numero_caja),'0') as total_neveras\
                            FROM inv_bodegas_movimiento_d b  where b.empresa_id = :1\
                            AND  b.prefijo = :2 AND b.numero = :3  and b.tipo_caja = '1'\
                    ) as total_neveras,\
                    0 as total_bolsas; ";
    }


    var query = G.knex.raw(sql, params);
    query.then(function (resultado) {

        callback(false, resultado.rows);
    }).catch(function (err) {
        console.log("err [consultarCantidadCajaNevera]:: ", err);
        callback(err);
    });
};
/**
 *@author Cristian Ardila
 *@fecha  06/02/2016
 *+Descripcion Metodo que contiene el SQL encargado de consultar el total de
 *             numero de cajas de un grupo de documentos  
 *             
 **/
PlanillasDespachosModel.prototype.gestionarLios = function (obj, callback) {

    var lenght = obj.documentos;
    var vEmpresaId = [];
    var vNumero = [];
    var vPrefijo = [];
    for (var i in lenght) {

        vEmpresaId.push("'" + obj.documentos[i].empresa_id + "'")
        vNumero.push("'" + obj.documentos[i].numero + "'")
        vPrefijo.push("'" + obj.documentos[i].prefijo + "'")

    }
    ;
    var sql = "SELECT SUM(a.totalCajas) as totalCajas, SUM(a.totalNeveras) as totalNeveras, SUM(a.totalBolsas) as totalBolsas\
            FROM (\
              SELECT distinct on(aa.id_aprobacion_planillas,aa.cantidad_cajas,aa.cantidad_neveras,aa.cantidad_bolsas)\
               aa.id_aprobacion_planillas, aa.cantidad_cajas as totalCajas, aa.cantidad_neveras as totalNeveras, aa.cantidad_bolsas as totalBolsas \
               FROM aprobacion_despacho_planillas aa \
               INNER JOIN aprobacion_despacho_planillas_d as bb ON (aa.id_aprobacion_planillas = bb.id_aprobacion_planillas)\
               WHERE bb.prefijo::varchar IN (" + vPrefijo.toString() + ")\
               AND bb.numero::varchar IN (" + vNumero.toString() + ")\
            ) as a;";
//    aa.empresa_id::varchar IN ("+vEmpresaId.toString()+") AND\

    var query = G.knex.raw(sql, {});
    query.then(function (resultado) {
        callback(false, resultado.rows);
    }).catch(function (err) {
        console.log("err [gestionarLios]:: ", err);
        callback(err);
    });
};
/**
 *@author Cristian Ardila
 *@fecha  06/02/2016
 *+Descripcion Metodo que contiene el SQL encargado de atualizar el numero de lio
 *             en un grupo de EFC
 *              
 *             
 **/
PlanillasDespachosModel.prototype.insertarLioDocumento = function (obj, callback) {

    G.knex.transaction(function (transaccion) {
        obj.transaccion = transaccion;
        G.Q.nfcall(__insertarLioDocumento, obj, 0).then(function () {

            transaccion.commit();
        }).fail(function (err) {

            transaccion.rollback(err);
        }).done();
    }).then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [insertarLioDocumento]:: ", err);
        callback(err);
    }).done();
};

/**
 *@author German Galvis
 *@fecha  17/04/2019
 *+Descripcion Metodo encargado de traer el consecutivo de los lios
 *              
 *             
 **/
PlanillasDespachosModel.prototype.consecutivoLio = function (callback) {
    var sql = " SELECT nextval('inv_planilla_despacho_lio_seq'::regclass); ";
    G.knex.raw(sql).
            then(function (resultado) {
                callback(false, resultado.rows);
            }).catch(function (error) {
        console.log("error [consecutivoLio]: ", error);
        callback(error);
    });
};

/**
 *@author German Galvis
 *@fecha  29/04/2019
 *+Descripcion Metodo encargado de traer el consecutivo de los lios
 *                           
 **/
PlanillasDespachosModel.prototype.modificarDocumento = function (parametros, transaccion, callback) {

    var temperatura = '0';

    if (parametros.documento.cantidad_neveras > 0) {
        temperatura = '3.2';
    }

    var query = G.knex(G.knex.raw(parametros.tabla))
            .where('id', parametros.documento.id)
            .andWhere('prefijo', parametros.documento.prefijo)
            .andWhere('numero', parametros.documento.numero)
            .update({
                cantidad_cajas: parametros.documento.cantidad_cajas,
                cantidad_neveras: parametros.documento.cantidad_neveras,
                cantidad_bolsas: parametros.documento.cantidad_bolsas,
                temperatura_neveras: temperatura
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    }).done();
};


/**
 *@author German Galvis
 *@fecha  29/04/2019
 *+Descripcion Metodo que contiene el SQL encargado de atualizar el lio
 *              
 *             
 **/
PlanillasDespachosModel.prototype.modificarLioDocumento = function (obj, callback) {

    G.knex.transaction(function (transaccion) {
        obj.transaccion = transaccion;
        G.Q.nfcall(__modificarLioDocumento, obj, 0).then(function () {

            transaccion.commit();
        }).fail(function (err) {

            transaccion.rollback(err);
        }).done();
    }).then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [modificarLioDocumento]:: ", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de traer el id de la planilla por documento
 * @fecha  08/05/2019
 * @returns {callback}
 */
PlanillasDespachosModel.prototype.ConsultarIdPlanilla = function (parametros, callback) {


    var query = G.knex.select("inv_planillas_despacho_id")
            .from("inv_planillas_detalle_farmacias")
            .where('prefijo', parametros.prefijo)
            .andWhere('numero', parametros.numero);

    query.union(function () {
        this.select("inv_planillas_despacho_id")
                .from("inv_planillas_detalle_clientes")
                .where('prefijo', parametros.prefijo)
                .andWhere('numero', parametros.numero);
    });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [ConsultarIdPlanilla]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de modificar la planilla de despacho
 * @fecha  15/05/2019
 * @returns {callback}
 */
PlanillasDespachosModel.prototype.modificar_planilla_despacho = function (obj, callback) {

    var query = G.knex("inv_planillas_despacho").
            where('id', obj.numeroPlanilla).
            update(
                    {
                        "inv_transportador_id": obj.transportador_id,
                        "nombre_conductor": obj.nombre_conductor,
                        "observacion": obj.observacion,
                        "numero_guia_externo": obj.numero_guia_externo,
                        "numero_placa_externo": obj.numero_placa_externo,
                        "tipo_planilla": obj.tipo_planilla
                    });
    query.then(function (resultado) {

        callback(false, resultado);

    }).catch(function (err) {
        console.log("error sql modificar_planilla_despacho", err);
        callback(err);
    });
};

function __insertarLioDocumento(obj, index, callback) {

    var documento = obj.documentos[index];
    var sql = "";
    if (!documento) {
        callback(false);
        return;
    }

    var cantidadCaja = index === 0 ? obj.totalCaja : 0;
    var cantidadNeveras = index === 0 ? obj.cantidadNeveras : 0;
    var cantidadBolsas = index === 0 ? obj.cantidadBolsas : 0;
    var tabla;
    if (documento.tipo === '0') {
        tabla = "inv_planillas_detalle_farmacias";
    } else if (documento.tipo === '1') {
        tabla = "inv_planillas_detalle_clientes";
    }

    var observacion = obj.observacion.lenght === 0 ? documento.prefijo + " - " + documento.numero : "'" + obj.observacion + "'";
    if (documento.tipo !== '2') {

        sql = "INSERT INTO " + tabla + " (\
                inv_planillas_despacho_id, \
                empresa_id, \
                prefijo,\
                numero, \
                cantidad_cajas,\
                cantidad_neveras,\
                cantidad_bolsas,\
                temperatura_neveras,\
                observacion, \
                usuario_id,\
                fecha_registro,\
                numero_lios,\
                lio_id)\
                (select " + obj.numeroGuia + " as inv_planillas_despacho_id,\
                empresa_id,\
                prefijo,\
                numero,\
                " + cantidadCaja + " as totalCajas,\
                " + cantidadNeveras + " as cantidad_neveras,\
                " + cantidadBolsas + " as cantidad_bolsas,\
                " + obj.temperatura + " as temperatura_neveras,\
                " + observacion + " as observacion,\
                " + parseInt(obj.usuario_id) + " as usuario_id,\
                now() as fecha_registro,\
                " + obj.cantidadLios + " as numero_lios, \
                " + obj.consecutivoLio + " as lio_id \
                 FROM inv_bodegas_movimiento_d\
                 WHERE empresa_id = :1\
                 AND prefijo= :2\
                 AND numero = :3\
                 GROUP BY 1,2,3,4,6,7,8,9,10,1)";
    } else {

        sql = "INSERT INTO inv_planillas_detalle_empresas(\
                inv_planillas_despacho_id, \
                empresa_id, \
                prefijo,\
                numero, \
                cantidad_cajas,\
                cantidad_neveras,\
                cantidad_bolsas,\
                temperatura_neveras,\
                observacion, \
                usuario_id,\
                fecha_registro,\
                empresa_destino, \
                centro_utilidad,\
                bodega,\
                numero_lios,\
                lio_id\
                )\
                (select " + obj.numeroGuia + " as inv_planillas_despacho_id,\
                aa.empresa_id,\
                bb.prefijo,\
                bb.numero,\
                " + cantidadCaja + " as totalCajas,\
                " + cantidadNeveras + " as cantidad_neveras,\
                " + cantidadBolsas + " as cantidad_bolsas,\
                " + obj.temperatura + " as temperatura_neveras,\
                " + observacion + " as observacion,\
                " + parseInt(obj.usuario_id) + " as usuario_id,\
                now() as fecha_registro,\
                :4 as empresa_destino,\
                :5 as centro_utilidad,\
                :6 as bodega,\
                " + obj.cantidadLios + " as numero_lios, \
                " + obj.consecutivoLio + " as lio_id \
                 FROM aprobacion_despacho_planillas as aa \
                 INNER JOIN aprobacion_despacho_planillas_d as bb ON aa.id_aprobacion_planillas = bb.id_aprobacion_planillas\
                 WHERE  aa.empresa_id = :1\
                 AND bb.prefijo= :2\
                 AND bb.numero = :3\
                 GROUP BY 1,2,3,4,5,6,7,8,9,10,1)";
    }

    index++;

    var query = G.knex.raw(sql, {1: documento.empresa_id, 2: documento.prefijo, 3: documento.numero, 4: documento.tercero.empresa_id, 5: documento.tercero.centro_utilidad, 6: documento.tercero.codigo});

    if (obj.transaccion)
        query.transacting(obj.transaccion);
    query.then(function (resultado) {

//        obj.documentos.splice(0, 1);
        __insertarLioDocumento(obj, index, callback);
    }).catch(function (err) {

        callback(err);
    });
}
;

function __modificarLioDocumento(obj, index, callback) {

    var documento = obj.documentos[index];
    if (!documento) {
        callback(false);
        return;
    }

    var tabla;
    if (documento.tipo === '0') {
        tabla = "inv_planillas_detalle_farmacias";
    } else if (documento.tipo === '1') {
        tabla = "inv_planillas_detalle_clientes";
    } else if (documento.tipo === '2') {
        tabla = "inv_planillas_detalle_empresas";
    }

    var query = G.knex(G.knex.raw(tabla))
            .where('id', documento.id)
            .andWhere('prefijo', documento.prefijo)
            .andWhere('numero', documento.numero)
            .update({
                cantidad_cajas: index === 0 ? obj.totalCaja : 0,
                cantidad_neveras: index === 0 ? obj.cantidadNeveras : 0,
                cantidad_bolsas: index === 0 ? obj.cantidadBolsas : 0,
                temperatura_neveras: obj.temperatura,
                observacion: obj.observacion,
                numero_lios: obj.cantidadLios
            });
    index++;
    if (obj.transaccion)
        query.transacting(obj.transaccion);
    query.then(function (resultado) {
//        obj.documentos.splice(0, 1);
        __modificarLioDocumento(obj, index, callback);
    }).catch(function (err) {

        callback(err);
    });
}
;
PlanillasDespachosModel.$inject = [];
module.exports = PlanillasDespachosModel;