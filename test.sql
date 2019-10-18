SELECT *
FROM (
    SELECT
        a.prefijo,
        a.factura_fiscal,
        to_char(a.fecha_registro, 'YYYY/MM/DD'),
        ter.nombre_tercero,
        a.tipo_id_tercero,
        a.tercero_id,
        a.valor_total,
        a.saldo,
        CASE WHEN (SELECT count(*)
        FROM facturas_dian
        WHERE factura_fiscal = a.factura_fiscal AND prefijo = a.prefijo AND sw_factura_dian = '1') >
            0 THEN 'Sincronizado'
        ELSE 'No Sincronizado' END AS estado_dian
    FROM inv_facturas_despacho AS a
    INNER JOIN terceros ter ON ter.tipo_id_tercero = a.tipo_id_tercero AND ter.tercero_id = a.tercero_id
    WHERE CAST(a.fecha_registro AS DATE) AND a.saldo > 0
    LIMIT 10);