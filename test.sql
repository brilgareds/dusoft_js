-- CONSULTA PARA LISTAR PRODUCTOS

select
    a.codigo_producto,
    fc_descripcion_producto(a.codigo_producto) as descripcion_producto,
    b.tipo_producto_id,
    d.descripcion as descripcion_tipo_producto,
    b.codigo_cum,
    b.codigo_invima,
    to_char(b.vencimiento_codigo_invima,
            'yyyy-mm-dd') as vencimiento_codigo_invima,
    b.porc_iva as iva,
    a.existencia::integer as existencia,
    coalesce(h.cantidad_total_pendiente,
             0)::integer as cantidad_total_pendiente,
    case
    when coalesce((a.existencia - coalesce(h.cantidad_total_pendiente,
                                           0) - coalesce(i.total_solicitado,
                                                         0) )::integer,
                  0) < 0 then 0
    else coalesce((a.existencia - coalesce(h.cantidad_total_pendiente,
                                           0) - coalesce(i.total_solicitado,
                                                         0) )::integer,
                  0)
    end as cantidad_disponible,
    case
    when g.precio_pactado > 0 then true
    else false
    end as tiene_precio_pactado,
    split_part(coalesce(fc_precio_producto_contrato_cliente( '2105',
                                                             a.codigo_producto,
                                                             '03' ),
                        '0'),
               '@',
               1) as precio_producto,
    b.sw_regulado,
    c.precio_regulado,
    b.estado,
    ei.estado AS estado_invima,
    c.costo_ultima_compra,
    CASE
    WHEN (SELECT
        con.contrato_cliente_id
    FROM
        vnts_contratos_clientes con
    WHERE
        con.contrato_cliente_id = '2105'
            AND con.porcentaje_genericos > 0) is null then false
    else true
    end as contrato                ,
    b.unidad_medida,
    a.empresa_id,
    a.centro_utilidad,
    a.bodega,
    (select
        alias
    from
        bodegas
    where
        bodega = a.bodega
            and empresa_id = a.empresa_id
            and centro_utilidad =a.centro_utilidad) as nombre_bodega,
    case
    when exists(select
                    *
                from
                    existencias_bodegas
                where
                    empresa_id=a.empresa_id
                        and centro_utilidad=a.centro_utilidad
                        and bodega='06'
                        and codigo_producto=a.codigo_producto) then 1
    else 0
    end as existe_producto_bodega_actual
from
existencias_bodegas a
inner join
inventarios_productos b
on a.codigo_producto = b.codigo_producto
inner join
inventarios c
on b.codigo_producto = c.codigo_producto
    and a.empresa_id = c.empresa_id
inner join
inv_tipo_producto d
ON b.tipo_producto_id = d.tipo_producto_id
inner join
inv_subclases_inventarios e
ON b.grupo_id = e.grupo_id
    and b.clase_id = e.clase_id
    and b.subclase_id = e.subclase_id
inner join
inv_clases_inventarios f
ON e.grupo_id = f.grupo_id
    and e.clase_id = f.clase_id
left join
estados_invima ei
ON b.estado_invima = ei.id
left join
(
    select
        b.codigo_producto,
        coalesce(b.precio_pactado,
                 0) as precio_pactado
    from
    vnts_contratos_clientes a
    inner join
    vnts_contratos_clientes_productos b
    on a.contrato_cliente_id = b.contrato_cliente_id
    where
        a.contrato_cliente_id = '2105'
) g
on c.codigo_producto = g.codigo_producto
left join
(
    select
        aa.empresa_id,
        aa.codigo_producto,
        aa.bodega,
        sum(aa.cantidad_total_pendiente) as cantidad_total_pendiente
    from
        (                      select
                                   a.empresa_id,
                                   b.codigo_producto,
                                   a.bodega_destino as bodega,
                                   SUM((b.numero_unidades - b.cantidad_despachada)) as cantidad_total_pendiente,
                                   1
                               from
                               ventas_ordenes_pedidos a
                               inner join
                               ventas_ordenes_pedidos_d b
                               ON a.pedido_cliente_id = b.pedido_cliente_id
                               where
                                   (
                                       b.numero_unidades - b.cantidad_despachada
                                   ) > 0
                                       and a.estado='1'
                               group by
                                   1,
                                   2,
                                   3
                               UNION
                               select
                                   a.empresa_destino as empresa_id,
                                   b.codigo_producto,
                                   a.bodega_destino as bodega,
                                   SUM( b.cantidad_pendiente) AS cantidad_total_pendiente,
                                   2
                               from
                               solicitud_productos_a_bodega_principal a
                               inner join
                               solicitud_productos_a_bodega_principal_detalle b
                               ON a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id
                               where
                                   b.cantidad_pendiente > 0
                               group by
                                   1,
                                   2,
                                   3
        ) aa
    group by
        1,
        2,
        3                ) h
on (a.empresa_id = h.empresa_id)
    and c.codigo_producto = h.codigo_producto
    and (a.bodega = h.bodega)
left join
(
    SELECT
        aa.empresa_id,
        aa.codigo_producto,
        aa.bodega_origen_producto,
        SUM(aa.total_reservado) as total_solicitado
    FROM
        (                         select
                                      b.codigo_producto,
                                      a.empresa_destino as empresa_id,
                                      b.bodega_origen_producto,
                                      SUM(cantidad_solic)::integer as total_reservado
                                  from
                                  solicitud_bodega_principal_aux a
                                  inner join
                                  solicitud_pro_a_bod_prpal_tmp b
                                  on a.farmacia_id = b.farmacia_id
                                      and a.centro_utilidad = b.centro_utilidad
                                      and a.bodega = b.bodega
                                      and a.usuario_id = b.usuario_id
                                  group by
                                      1,
                                      2,
                                      3
                                  union
                                  SELECT
                                      b.codigo_producto,
                                      a.empresa_id,
                                      b.bodega_origen_producto,
                                      sum(b.numero_unidades)::integer as total_reservado
                                  from
                                  ventas_ordenes_pedidos_tmp a
                                  INNER JOIN
                                  ventas_ordenes_pedidos_d_tmp b
                                  on b.pedido_cliente_id_tmp = a.pedido_cliente_id_tmp
                                  WHERE
                                      a.estado = '1'
                                  GROUP BY
                                      1,
                                      2,
                                      3
        ) aa
    group by
        1,
        2,
        3                ) i
on (a.empresa_id = i.empresa_id)
    and c.codigo_producto = i.codigo_producto
    and (a.bodega = i.bodega_origen_producto)
where
    a.empresa_id = '03'
        and a.centro_utilidad = '1 '
        and a.bodega = '03'
        AND (
        e.descripcion ilike '%acetami%'
    ) limit '25'
