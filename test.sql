SELECT b.descripcion as producto,
    b.subclase_id,
    (a.cantidad_solicitada - a.cantidad_entregada) as cantidad_sol,
    a.*
FROM esm_orden_requisicion_d as a
     INNER JOIN inventarios_productos b
ON b.codigo_producto = a.codigo_producto
     INNER JOIN inventarios_productos c
ON b.subclase_id = c.subclase_id
WHERE b.descripcion ILIKE '%aceta%' AND a.orden_requisicion_id = '1' AND a.cantidad_solicitada <> a.cantidad_entregada
ORDER BY a.sw_pactado






SELECT *
FROM inventarios_productos as ae
WHERE ae.subclase_id =
    (
        SELECT b.subclase_id
        FROM esm_orden_requisicion_d as a
             INNER JOIN inventarios_productos b
        ON b.codigo_producto = a.codigo_producto
        WHERE b.descripcion ILIKE '%aceta%' AND a.orden_requisicion_id = '1' AND
            a.cantidad_solicitada <> a.cantidad_entregada
    )




SELECT *
FROM esm_orden_requisicion_d as a
     INNER JOIN
(
    SELECT b.subclase_id
    FROM inventarios_productos as b
    WHERE b.descripcion ILIKE '%aceta%'
)
ON fg.codigo_producto = a.codigo_producto
