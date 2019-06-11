select a.fecha_registro,
    a.pedido_cliente_id,
    a.observacion,
    vv.nombre as vendedor,
    a.tercero_id,
    t.tipo_id_tercero,
    t.nombre_tercero,
    b.codigo_producto,
    fc_descripcion_producto(b.codigo_producto) as producto,
    y.lote,
    y.fecha_vencimiento,
    b.numero_unidades,
    y.unitario as costo,
    b.valor_unitario,
    y.cantidad as enviada,
    b.porc_iva,
    y.prefijo,
    y.numero,
    ddf.factura_fiscal,
    /*(
     select factura_fiscal
     from (
     select distinct(invfa.factura_fiscal) as factura_fiscal,
     invfad.pedido_cliente_id as pedido_cliente_id,
     invfa.fecha_registro as fecha_registro
     from inv_facturas_agrupadas_despacho as invfa
     inner join inv_facturas_agrupadas_despacho_d as invfad on invfa.prefijo = invfad.prefijo and invfa.factura_fiscal = invfad.factura_fiscal

     union
     select distinct(factura_fiscal) as factura_fiscal,
     b.pedido_cliente_id,
     b.fecha_registro
     from inv_facturas_despacho as b
     ) as fac where pedido_cliente_id =  a.pedido_cliente_id
    ) as factura_fiscal,*/
    case when y.prefijo is null
             then 'SIN FACTURAR'
         ELSE (
             CASE WHEN fd.factura_fiscal is not null
                      then 'FACTURADO'
                  ELSE 'Cruzado Sin Facturar' END) END AS Estado,
    case when y.unitario > 0
             then (((100 / (y.unitario)) * (b.valor_unitario)) - 100)
         else 0 end as porcentanje,
    --(b.numero_unidades*b.valor_unitario) as total_pedido,
    CASE WHEN ip.sw_regulado = '1' then 'REGULADO' ELSE 'NO REGULADO' END as reg,
    y.total_costo as total_costo,
    (y.cantidad * b.valor_unitario) as total_factura


from ventas_ordenes_pedidos a
     INNER JOIN ventas_ordenes_pedidos_d b
on a.pedido_cliente_id = b.pedido_cliente_id

     left join (select i.pedido_cliente_id,
                    i.prefijo,
                    i.numero,
                    ind.codigo_producto,
                    ind.cantidad,
                    ind.lote,
                    ind.fecha_vencimiento,
                    (ind.total_costo) AS total_costo,
                    (ind.total_costo / ind.cantidad) as unitario

                from inv_bodegas_movimiento_despachos_clientes i
                     join inv_bodegas_movimiento_d as ind
                on (i.prefijo = ind.prefijo)
                    and (i.numero = ind.numero)
                    and (i.empresa_id = ind.empresa_id)

                group by 1, 2, 3, 4, 5, 6, 7, 8
) as y on
    (a.pedido_cliente_id = y.pedido_cliente_id)
        and (b.codigo_producto = y.codigo_producto)

     left join inv_facturas_despacho fd on fd.pedido_cliente_id = a.pedido_cliente_id

     left join inv_facturas_despacho_d ddf
on fd.prefijo = ddf.prefijo and fd.factura_fiscal = ddf.factura_fiscal

     join public.system_usuarios su
on su.usuario_id = a.usuario_id

     join inventarios_productos as ip
ON ip.codigo_producto = b.codigo_producto

     join public.terceros_clientes g
on g.tipo_id_tercero = a.tipo_id_tercero and g.tercero_id = a.tercero_id
     join public.terceros t
on t.tipo_id_tercero = g.tipo_id_tercero and t.tercero_id = g.tercero_id

     join vnts_vendedores vv on vv.tipo_id_vendedor = a.tipo_id_vendedor and vv.vendedor_id = a.vendedor_id


where cast(a.fecha_registro as DATE) between $P{fecha_ini} and $P{fecha_fin}
    and case when $P{cliente} is not null then t.nombre_tercero ilike '%'||$P{cliente}||'%' else true
end and case when ($P{p_ini_cliente} is not null) then a.pedido_cliente_id = $P{p_ini_cliente} else true
end and case when ($P{tipo_cliente} is not null and  $P{tipo_cliente} != '' ) then t.tipo_id_tercero = $P{tipo_cliente} else true
end and case when ($P{vendedor} is not null  ) then vv.vendedor_id = $P{vendedor} else true
end AND  $X{ IN, a.tercero_id, clie1}
group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21, 22,y.total_costo




























