SELECT
    "a".*,
    "e"."empresa_id" AS "despacho_empresa_id",
    "e"."prefijo" AS "despacho_prefijo",
    "e"."numero" AS "despacho_numero",
    CASE
    WHEN e.numero IS NOT NULL THEN TRUE
    ELSE FALSE
    END AS tiene_despacho,
    (SELECT CASE
            WHEN id_orden_pedido_origen IS NULL THEN (SELECT 'CT' || cast(id_orden_cotizacion_origen AS TEXT)
            FROM
                ventas_ordenes_pedido_multiple_clientes
            WHERE
                id_orden_pedido_origen = a.numero_pedido LIMIT 1)
            ELSE cast(id_orden_pedido_origen AS TEXT)
            END || ' - ' || CASE
                            WHEN id_orden_pedido_destino IS NULL THEN 'PP'
                            ELSE cast(id_orden_pedido_destino AS TEXT)
                            END || ' - ' || CASE
                                            WHEN id_orden_pedido_final IS NULL
                                                OR id_orden_pedido_final = 0 THEN 'PP'
                                            ELSE cast(id_orden_pedido_final AS TEXT)
                                            END || ' - ' || cast(coalesce(t.nombre_tercero,
                                                                          '') AS TEXT) || '' ||
                cast(coalesce(b.descripcion,
                              '') AS TEXT) AS destino
    FROM
    ventas_ordenes_pedido_multiple_clientes AS vopmc
    LEFT JOIN
    ventas_ordenes_pedidos_tmp vopt
    ON (
        vopmc.id_orden_cotizacion_origen = vopt.pedido_cliente_id_tmp
        )
    LEFT JOIN
    terceros t
    ON (
        vopt.tercero_id = t.tercero_id
            AND vopt.tipo_id_tercero = t.tipo_id_tercero
        )
    LEFT JOIN
    bodegas b
    ON (
        vopmc.farmacia_id = b.empresa_id
            AND vopmc.centro_utilidad = b.centro_utilidad
            AND vopmc.bodega = b.bodega
        )
    WHERE
        id_orden_pedido_origen = a.numero_pedido LIMIT 1
    ) AS es_pedido_origen,
    (
        SELECT CASE
               WHEN id_orden_pedido_origen IS NULL
                   AND id_orden_cotizacion_origen IS NOT NULL THEN (SELECT
                   'CT' || cast(id_orden_cotizacion_origen AS TEXT)
               FROM
                   ventas_ordenes_pedido_multiple_clientes
               WHERE
                   id_orden_pedido_destino = a.numero_pedido LIMIT 1)
               WHEN id_orden_pedido_origen IS NULL
                   AND id_orden_cotizacion_origen IS NULL THEN 'PF'
               ELSE cast(id_orden_pedido_origen AS TEXT)
               END || ' - ' || CASE
                               WHEN id_orden_pedido_destino IS NULL THEN 'PP'
                               ELSE cast(id_orden_pedido_destino AS TEXT)
                               END || ' - ' || CASE
                                               WHEN id_orden_pedido_final IS NULL
                                                   OR id_orden_pedido_final = 0 THEN 'PP'
                                               ELSE cast(id_orden_pedido_final AS TEXT)
                                               END || ' - ' || cast(coalesce(t.nombre_tercero,
                                                                             '') AS TEXT) || '' ||
                   cast(coalesce(b.descripcion,
                                 '') AS TEXT) AS destino
        FROM
        ventas_ordenes_pedido_multiple_clientes AS vopmc
        LEFT JOIN
        ventas_ordenes_pedidos_tmp vopt
        ON (
            vopmc.id_orden_cotizacion_origen = vopt.pedido_cliente_id_tmp
            )
        LEFT JOIN
        terceros t
        ON (
            vopt.tercero_id = t.tercero_id
                AND vopt.tipo_id_tercero = t.tipo_id_tercero
            )
        LEFT JOIN
        bodegas b
        ON (
            vopmc.farmacia_id = b.empresa_id
                AND vopmc.centro_utilidad = b.centro_utilidad
                AND vopmc.bodega = b.bodega
            )
        WHERE
            id_orden_pedido_destino = a.numero_pedido LIMIT 1
    ) AS es_pedido_destino,
    (
        SELECT CASE
               WHEN id_orden_pedido_origen IS NULL THEN (SELECT 'CT' || cast(id_orden_cotizacion_origen AS TEXT)
               FROM
                   ventas_ordenes_pedido_multiple_clientes
               WHERE
                   id_orden_pedido_final = a.numero_pedido LIMIT 1)
               ELSE cast(id_orden_pedido_origen AS TEXT)
               END || ' - ' || CASE
                               WHEN id_orden_pedido_destino IS NULL THEN 'PP'
                               ELSE cast(id_orden_pedido_destino AS TEXT)
                               END || ' - ' || CASE
                                               WHEN id_orden_pedido_final IS NULL
                                                   OR id_orden_pedido_final = 0 THEN 'PP'
                                               ELSE cast(id_orden_pedido_final AS TEXT)
                                               END || ' - ' || cast(coalesce(t.nombre_tercero,
                                                                             '') AS TEXT) || '' ||
                   cast(coalesce(b.descripcion,
                                 '') AS TEXT) AS destino
        FROM
        ventas_ordenes_pedido_multiple_clientes AS vopmc
        LEFT JOIN
        ventas_ordenes_pedidos_tmp vopt
        ON (
            vopmc.id_orden_cotizacion_origen = vopt.pedido_cliente_id_tmp
            )
        LEFT JOIN
        terceros t
        ON (
            vopt.tercero_id = t.tercero_id
                AND vopt.tipo_id_tercero = t.tipo_id_tercero
            )
        LEFT JOIN
        bodegas b
        ON (
            vopmc.farmacia_id = b.empresa_id
                AND vopmc.centro_utilidad = b.centro_utilidad
                AND vopmc.bodega = b.bodega
            )
        WHERE
            id_orden_pedido_final = a.numero_pedido LIMIT 1
    ) AS es_pedido_final,
    (
        SELECT "bb"."nombre" AS "nombre_separador"
        FROM
        "ventas_ordenes_pedidos_estado" AS "aa"
        LEFT JOIN
        "operarios_bodega" AS "bb"
        ON "aa"."responsable_id" = "bb"."operario_id"
        WHERE
            "aa"."estado" = '1'
                AND "aa"."pedido_cliente_id" = a.numero_pedido :: INTEGER
        ORDER BY
            "aa"."fecha_registro" DESC LIMIT '1'
    ) AS "nombre_separador"
FROM
(SELECT
    CASE
    WHEN estado_factura_fiscal = '0' THEN 'NO FACTURADO'
    ELSE 'FACTURADO'
    END AS factura_fiscal,
    "estado_factura_fiscal",
    "a"."empresa_id",
    "a"."centro_destino" AS "centro_utilidad_id",
    "a"."bodega_destino" AS "bodega_id",
    "a"."pedido_cliente_id" AS "numero_pedido",
    "b"."tipo_id_tercero" AS "tipo_id_cliente",
    "b"."tercero_id" AS "identificacion_cliente",
    "b"."nombre_tercero" AS "nombre_cliente",
    "b"."direccion" AS "direccion_cliente",
    "b"."telefono" AS "telefono_cliente",
    "c"."tipo_id_vendedor",
    "c"."vendedor_id" AS "idetificacion_vendedor",
    "c"."nombre" AS "nombre_vendedor",
    "a"."estado",
    CASE
    WHEN a.estado = '0' THEN 'Inactivo '
    WHEN a.estado = '1' THEN 'Activo'
    WHEN a.estado = '2' THEN 'Anulado'
    WHEN a.estado = '3' THEN 'Entregado'
    WHEN a.estado = '4' THEN 'Debe autorizar cartera'
    END AS descripcion_estado,
    "a"."estado_pedido" AS "estado_actual_pedido",
    CASE
    WHEN a.estado_pedido = '0'
        AND a.estado != '4' THEN 'No Asignado'
    WHEN a.estado_pedido = '1' THEN 'Asignado'
    WHEN a.estado_pedido = '2' THEN 'Auditado'
    WHEN a.estado_pedido = '3' THEN 'En Zona Despacho'
    WHEN a.estado_pedido = '4' THEN 'Despachado'
    WHEN a.estado_pedido = '5' THEN 'Despachado con Pendientes'
    WHEN a.estado_pedido = '6' THEN 'Separacion Finalizada'
    WHEN a.estado_pedido = '7' THEN 'En Auditoria'
    WHEN a.estado_pedido = '8' THEN 'Auditado con pdtes'
    WHEN a.estado_pedido = '9' THEN 'En zona con pdtes'
    WHEN a.estado = '4' THEN 'Debe autorizar cartera'
    WHEN a.estado_pedido = '10' THEN 'Por Autorizar'
    END AS descripcion_estado_actual_pedido,
    "d"."estado" AS "estado_separacion",
    to_char(a.fecha_registro,
            'dd-mm-yyyy HH:mi am') AS fecha_registro,
    "f"."descripcion" AS "descripcion_tipo_producto",
    '1' AS tipo_pedido,
    "a"."observacion"
FROM
"ventas_ordenes_pedidos" AS "a"
INNER JOIN
"terceros" AS "b"
ON "a"."tipo_id_tercero" = "b"."tipo_id_tercero"
    AND "a"."tercero_id" = "b"."tercero_id"
INNER JOIN
"vnts_vendedores" AS "c"
ON "a"."tipo_id_vendedor" = "c"."tipo_id_vendedor"
    AND "a"."vendedor_id" = "c"."vendedor_id"
LEFT JOIN
"inv_bodegas_movimiento_tmp_despachos_clientes" AS "d"
ON "a"."pedido_cliente_id" = "d"."pedido_cliente_id"
INNER JOIN
"inv_tipo_producto" AS "f"
ON "a"."tipo_producto" = "f"."tipo_producto_id"
WHERE
    (
        "a"."empresa_id" = '03'
            AND "a"."bodega_destino" = '03'
            AND a.fecha_registro BETWEEN '2019-01-01 00:00:00' AND '2019-10-19 23:59:00'
    )
        AND (
        a.pedido_cliente_id :: VARCHAR ILIKE '%144888%'
    )
ORDER BY
    6 DESC LIMIT '25') AS "a"
LEFT JOIN
"inv_bodegas_movimiento_despachos_clientes" AS "e"
ON "a"."numero_pedido" = "e"."pedido_cliente_id"