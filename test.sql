select "a".*,
    "h"."pedido_cliente_id" as "numero_pedido",
    "j"."sw_autorizacion",
    "j"."sw_facturacion_agrupada",
    coalesce(g.descripcion,
             '') as descripcion_tipo_producto,
    (select CASE
        WHEN id_orden_pedido_origen IS NULL
            THEN (select 'CT' || cast(id_orden_cotizacion_origen as text)
                  from ventas_ordenes_pedido_multiple_clientes
                  where id_orden_pedido_origen = h.pedido_cliente_id
                  limit 1)
        ELSE cast(id_orden_pedido_origen as text)
        END || ' - ' || CASE
        WHEN id_orden_pedido_destino IS NULL
            THEN 'PP'
        ELSE cast(id_orden_pedido_destino as text)
        END || ' - ' || CASE
        WHEN id_orden_pedido_final IS NULL
            OR id_orden_pedido_final = 0
            THEN 'PP'
        ELSE cast(id_orden_pedido_final as text)
        END || ' - ' || cast(coalesce(t.nombre_tercero,
                                      '') as text) || '' || cast(coalesce(b.descripcion,
                                                                          '') as text) as destino
     from ventas_ordenes_pedido_multiple_clientes as vopmc
          left join
     ventas_ordenes_pedidos_tmp vopt
     on (
         vopmc.id_orden_cotizacion_origen = vopt.pedido_cliente_id_tmp
         )
          left join
     terceros t
     on (
         vopt.tercero_id = t.tercero_id
             and vopt.tipo_id_tercero = t.tipo_id_tercero
         )
          left join
     bodegas b
     on (
         vopmc.farmacia_id = b.empresa_id
             and vopmc.centro_utilidad = b.centro_utilidad
             and vopmc.bodega = b.bodega
         )
     where id_orden_pedido_origen = h.pedido_cliente_id
     limit 1
    ) as es_pedido_origen, (
    SELECT CASE
        WHEN id_orden_pedido_origen IS NULL
            THEN (select 'CT' || cast(id_orden_cotizacion_origen as text)
                  from ventas_ordenes_pedido_multiple_clientes
                  where id_orden_pedido_destino = h.pedido_cliente_id
                  limit 1)
        WHEN id_orden_pedido_origen IS NULL
            and id_orden_cotizacion_origen IS NULL
            THEN 'PF'
        ELSE cast(id_orden_pedido_origen as text)
        END || ' - ' || CASE
        WHEN id_orden_pedido_destino IS NULL
            THEN 'PP'
        ELSE cast(id_orden_pedido_destino as text)
        END || ' - ' || CASE
        WHEN id_orden_pedido_final IS NULL
            OR id_orden_pedido_final = 0
            THEN 'PP'
        ELSE cast(id_orden_pedido_final as text)
        END || ' - ' || cast(coalesce(t.nombre_tercero,
                                      '') as text) || '' || cast(coalesce(b.descripcion,
                                                                          '') as text) as destino
    from ventas_ordenes_pedido_multiple_clientes as vopmc
         left join
    ventas_ordenes_pedidos_tmp vopt
    on (
        vopmc.id_orden_cotizacion_origen = vopt.pedido_cliente_id_tmp
        )
         left join
    terceros t
    on (
        vopt.tercero_id = t.tercero_id
            and vopt.tipo_id_tercero = t.tipo_id_tercero
        )
         left join
    bodegas b
    on (
        vopmc.farmacia_id = b.empresa_id
            and vopmc.centro_utilidad = b.centro_utilidad
            and vopmc.bodega = b.bodega
        )
    where id_orden_pedido_destino = h.pedido_cliente_id
    limit 1
) as es_pedido_destino, (
    select CASE
        WHEN id_orden_pedido_origen IS NULL
            THEN (select 'CT' || cast(id_orden_cotizacion_origen as text)
                  from ventas_ordenes_pedido_multiple_clientes
                  where id_orden_pedido_final = h.pedido_cliente_id
                  limit 1)
        ELSE cast(id_orden_pedido_origen as text)
        END || ' - ' || CASE
        WHEN id_orden_pedido_destino IS NULL
            THEN 'PP'
        ELSE cast(id_orden_pedido_destino as text)
        END || ' - ' || CASE
        WHEN id_orden_pedido_final IS NULL
            OR id_orden_pedido_final = 0
            THEN 'PP'
        ELSE cast(id_orden_pedido_final as text)
        END || ' - ' || cast(coalesce(t.nombre_tercero,
                                      '') as text) || '' || cast(coalesce(b.descripcion,
                                                                          '') as text) as destino
    from ventas_ordenes_pedido_multiple_clientes as vopmc
         left join
    ventas_ordenes_pedidos_tmp vopt
    on (
        vopmc.id_orden_cotizacion_origen = vopt.pedido_cliente_id_tmp
        )
         left join
    terceros t
    on (
        vopt.tercero_id = t.tercero_id
            and vopt.tipo_id_tercero = t.tipo_id_tercero
        )
         left join
    bodegas b
    on (
        vopmc.farmacia_id = b.empresa_id
            and vopmc.centro_utilidad = b.centro_utilidad
            and vopmc.bodega = b.bodega
        )
    where id_orden_pedido_final = h.pedido_cliente_id
    limit 1
) as es_pedido_final
from (select a.empresa_id,
          a.centro_destino as centro_utilidad_id,
          a.bodega_destino as bodega_id,
          a.pedido_cliente_id_tmp as numero_cotizacion,
          a.tipo_id_tercero,
          a.tercero_id,
          b.nombre_tercero,
          b.direccion,
          b.telefono,
          b.email,
          e.pais,
          d.departamento,
          c.municipio,
          f.tipo_id_vendedor,
          f.vendedor_id,
          f.nombre as nombre_vendendor,
          f.telefono as telefono_vendedor,
          a.observaciones,
          coalesce(a.observacion_cartera,
                   '') as observacion_cartera,
          coalesce(a.sw_aprobado_cartera,
                   '') as sw_aprobado_cartera,
          coalesce(a.tipo_producto,
                   '') as tipo_producto,
          a.estado,
          case
              when a.estado = '0'
                  then 'Inactivo'
              when a.estado = '1'
                  then 'Activo'
              when a.estado = '2'
                  then 'Anulado'
              when a.estado = '3'
                  then 'Aprobado cartera'
              when a.estado = '5'
                  then 'Tiene un pedido'
              when a.estado = '6'
                  then 'Se solicita autorizacion'
              when a.estado = '4'
                  then 'No autorizado por cartera'
              end as descripcion_estado,
          to_char(a.fecha_registro,
                  'dd-mm-yyyy HH:mi am') as fecha_registro
      from ventas_ordenes_pedidos_tmp a
           inner join
      terceros b
      on a.tipo_id_tercero = b.tipo_id_tercero
          and a.tercero_id = b.tercero_id
           inner join
      tipo_mpios c
      on b.tipo_pais_id = c.tipo_pais_id
          and b.tipo_dpto_id = c.tipo_dpto_id
          and b.tipo_mpio_id = c.tipo_mpio_id
           inner join
      tipo_dptos d
      on c.tipo_pais_id = d.tipo_pais_id
          and c.tipo_dpto_id = d.tipo_dpto_id
           inner join
      tipo_pais e
      on d.tipo_pais_id = e.tipo_pais_id
           inner join
      vnts_vendedores f
      on a.tipo_id_vendedor = f.tipo_id_vendedor
          and a.vendedor_id = f.vendedor_id
      where a.empresa_id = '03' and a.bodega_id = '06' and
          a.fecha_registro between '2019-01-01 00:00:00' and '2019-06-21 23:59:00' AND (
          a.pedido_cliente_id_tmp::varchar ilike '%%'
          ) AND (
          a.estado ilike '6%'
          ) AND observacion_cartera = ''
      order by "a"."fecha_registro" desc
      limit '25') as "a"
     left join
"inv_tipo_producto" as "g"
on "a"."tipo_producto" = "g"."tipo_producto_id"
     left join
"ventas_ordenes_pedidos" as "h"
on "a"."numero_cotizacion" = "h"."pedido_cliente_id_tmp"
     left join
"vnts_contratos_clientes" as "j"
on "a"."tipo_id_tercero" = "j"."tipo_id_tercero"
    and "a"."tercero_id" = "j"."tercero_id"
    and "a"."empresa_id" = "j"."empresa_id"
    and a.bodega_id = '06'
    and j.estado = '1'
