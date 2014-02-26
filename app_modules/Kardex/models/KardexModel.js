var KardexModel = function() {

};


KardexModel.prototype.sayHello = function(callback) {

    var str = "Saludando desde Kardexx";
    callback(str);
};

KardexModel.prototype.buscar_productos = function(termino_busqueda, callback) {

    var sql = " select\
                b.codigo_producto, \
                fc_descripcion_producto(b.codigo_producto) as nombre_producto,\
                a.existencia,\
                c.costo,\
                c.costo_ultima_compra,\
                c.existencia as existencia_total,\
                c.precio_venta,\
                b.porc_iva\
                from existencias_bodegas a \
                inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and a.empresa_id = c.empresa_id\
                where a.empresa_id='03' and a.centro_utilidad = '1 ' and a.bodega = '03'\
                and ( b.codigo_producto ILIKE $1 or b.descripcion ILIKE $1 )\
                ORDER BY 3 DESC";

    G.db.query(sql, ["%" + termino_busqueda + "%"], function(err, rows, result) {
        callback(err, rows);
    });

};

KardexModel.prototype.obtener_movimientos_productos = function(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_inicial, fecha_final, callback) {

    var sql = " SELECT *  \n" +
            " FROM  " +
            " ( " +
            "   ( " +
            "     select  " +
            "     case when e.inv_tipo_movimiento IN ('E','T')  THEN 'EGRESO'  ELSE 'INGRESO' END as tipo, " +
            "     e.inv_tipo_movimiento as tipo_movimiento, " +
            "     to_char(a.fecha_registro,'YYYY-MM-DD HH24:MI') as fecha, " +
            "     a.fecha_registro, " +
            "     a.prefijo, " +
            "     a.numero, " +
            "     b.cantidad, " +
            "     b.lote, " +
            "     b.fecha_vencimiento, " +
            "     round(b.total_costo/b.cantidad) as costo, " +
            "     g.usuario, " +
            "     g.nombre, " +
            "     null as bodegas_doc_id, " +
            "     a.observacion, " +
            "     f.factura, " +
            "     f.valor " +
            "     from inv_bodegas_movimiento a  " +
            "     inner join inv_bodegas_movimiento_d b on a.empresa_id = b.empresa_id  and a.prefijo = b.prefijo and a.numero=b.numero " +
            "     inner join inv_bodegas_documentos c on a.documento_id = c.documento_id and a.empresa_id = c.empresa_id and a.centro_utilidad = c.centro_utilidad and a.bodega = c.bodega " +
            "     inner join documentos d on c.documento_id = d.documento_id AND c.empresa_id = d.empresa_id " +
            "     inner join tipos_doc_generales e on d.tipo_doc_general_id = e.tipo_doc_general_id " +
            "     inner join system_usuarios as g on a.usuario_id = g.usuario_id " +
            "     left join ( " +
            "         select c.empresa_id, c.prefijo, c.numero, a.numero_factura as factura, b.codigo_producto, b.valor  " +
            "         from  inv_facturas_proveedores a  " +
            "         inner join inv_facturas_proveedores_d b on a.codigo_proveedor_id = b.codigo_proveedor_id and a.numero_factura = b.numero_factura " +
            "         inner join inv_recepciones_parciales c on b.recepcion_parcial_id = c.recepcion_parcial_id    " +
            "         where a.fecha_registro BETWEEN $5 and $6 " +
            "         union all " +
            "         select c.empresa_id, c.prefijo, c.numero, a.prefijo||'-'||a.factura_fiscal as factura, b.codigo_producto, b.valor_unitario as valor " +
            "         from inv_facturas_despacho a  " +
            "         inner join inv_facturas_despacho_d b on a.prefijo = b.prefijo and a.factura_fiscal = b.factura_fiscal   " +
            "         inner join inv_bodegas_movimiento_despachos_clientes c on a.pedido_cliente_id = c.pedido_cliente_id " +
            "         where a.fecha_registro BETWEEN $5 and $6 " +
            "         union all " +
            "         select c.empresa_id, c.prefijo, c.numero, a.prefijo||'-'||a.factura_fiscal as factura, b.codigo_producto, b.valor_unitario as valor " +
            "         from inv_facturas_agrupadas_despacho a " +
            "         inner join inv_facturas_agrupadas_despacho_d b on a.prefijo = b.prefijo and a.factura_fiscal = b.factura_fiscal " +
            "         inner join inv_bodegas_movimiento_despachos_clientes c on b.pedido_cliente_id = c.pedido_cliente_id " +
            "         where a.fecha_registro BETWEEN $5 and $6  " +
            "     ) as f on  a.empresa_id = f.empresa_id and a.prefijo = f.prefijo and a.numero = f.numero and b.codigo_producto = f.codigo_producto " +
            "     where a.fecha_registro BETWEEN $5 and $6 " +
            "     and a.empresa_id = $1 " +
            "     and a.centro_utilidad = $2 " +
            "     and a.bodega = $3 " +
            "     and b.codigo_producto = $4    " +
            "   ) " +
            "   UNION ALL " +
            "   ( " +
            "     select  " +
            "     case when d.cargo = 'IMD'  then 'EGRESO' when d.cargo = 'DIMD' then 'INGRESO' else '?' end as tipo, " +
            "     case when d.cargo = 'IMD'  then 'C' when d.cargo = 'DIMD' then 'D' else '?' end as tipo_movimiento, " +
            "     to_char(a.fecha_registro,'YYYY-MM-DD HH24:MI') as fecha, " +
            "     a.fecha_registro, " +
            "     c.prefijo, " +
            "     a.numeracion as numero, " +
            "     b.cantidad, " +
            "     b.lote, " +
            "     b.fecha_vencimiento, " +
            "     b.total_costo as costo, " +
            "     e.usuario, " +
            "     e.nombre, " +
            "     a.bodegas_doc_id, " +
            "     'Cuenta No.' || d.numerodecuenta as observacion, " +
            "     '' as factura, " +
            "     0 as valor " +
            "     from bodegas_documentos a  " +
            "     inner join bodegas_documentos_d b on a.bodegas_doc_id = b.bodegas_doc_id and a.numeracion = b.numeracion " +
            "     inner join bodegas_doc_numeraciones c on a.bodegas_doc_id = c.bodegas_doc_id " +
            "     inner join cuentas_detalle d on b.consecutivo = d.consecutivo " +
            "     inner join system_usuarios e on a.usuario_id = e.usuario_id " +
            "     where a.fecha_registro between $5 and $6 " +
            "     and c.empresa_id = $1 " +
            "     and c.centro_utilidad = $2 " +
            "     and c.bodega = $3 " +
            "     and b.codigo_producto = $4    " +
            "   ) " +
            "   UNION ALL " +
            "   ( " +
            "     select  " +
            "     'INGRESO' as tipo, " +
            "     e.inv_tipo_movimiento as tipo_movimiento, " +
            "     to_char(b.fecha_registro,'YYYY-MM-DD HH24:MI') as fecha, " +
            "     b.fecha_registro, " +
            "     b.prefijo, " +
            "     b.numero, " +
            "     c.cantidad, " +
            "     c.lote, " +
            "     c.fecha_vencimiento, " +
            "     round(c.total_costo/c.cantidad) as costo, " +
            "     f.usuario, " +
            "     f.nombre, " +
            "     NULL as bodegas_doc_id, " +
            "     'BODEGA ORIGEN ['||a.centro_utilidad_destino ||']['|| a.bodega_destino ||'] ' || b.observacion as observacion, " +
            "     '' as factura, " +
            "     0 as valor " +
            "     from inv_bodegas_movimiento_traslados a " +
            "     inner join inv_bodegas_movimiento b on a.empresa_id = b.empresa_id and a.prefijo = b.prefijo and a.numero = b.numero " +
            "     inner join inv_bodegas_movimiento_d c on b.empresa_id = c.empresa_id and b.prefijo = c.prefijo and b.numero = c.numero " +
            "     inner join documentos d on b.documento_id = d.documento_id and b.empresa_id = d.empresa_id " +
            "     inner join tipos_doc_generales e on d.tipo_doc_general_id = e.tipo_doc_general_id " +
            "     inner join system_usuarios f on b.usuario_id = f.usuario_id " +
            "     where b.fecha_registro between $5 and $6 " +
            "     and a.empresa_id = $1 " +
            "     and a.centro_utilidad_destino = $2 " +
            "     and a.bodega_destino = $3 " +
            "     and c.codigo_producto = $4   " +
            "   ) " +
            "   UNION ALL " +
            "   ( " +
            "     select " +
            "     CASE WHEN c.tipo_movimiento IN ('E','T')  THEN 'EGRESO'  ELSE 'INGRESO' END as tipo, " +
            "     c.tipo_movimiento, " +
            "     to_char(a.fecha_registro,'YYYY-MM-DD HH24:MI') as fecha,  " +
            "     a.fecha_registro, " +
            "     c.prefijo,  " +
            "     a.numeracion as numero, " +
            "     b.cantidad, " +
            "     b.lote, " +
            "     b.fecha_vencimiento, " +
            "     b.total_costo as costo,  " +
            "     d.usuario,  " +
            "     d.nombre,  " +
            "     a.bodegas_doc_id, " +
            "     a.observacion, " +
            "     '' as factura, " +
            "     0 as valor " +
            "     from bodegas_documentos a  " +
            "     inner join bodegas_documentos_d b on a.bodegas_doc_id = b.bodegas_doc_id and a.numeracion = b.numeracion " +
            "     inner join bodegas_doc_numeraciones c on a.bodegas_doc_id = c.bodegas_doc_id " +
            "     inner join system_usuarios d on a.usuario_id = d.usuario_id " +
            "     where a.fecha_registro between $5 and $6 " +
            "     and c.empresa_id = $1 " +
            "     and c.centro_utilidad = $2 " +
            "     and c.bodega = $3 " +
            "     and b.codigo_producto = $4 " +
            "     and b.consecutivo NOT IN ( select consecutivo from cuentas_detalle where empresa_id = $1 AND centro_utilidad = $2 AND bodega = $3 AND consecutivo IS NOT NULL AND b.consecutivo = consecutivo)  " +
            "   ) " +
            " ) AS DATOS ORDER BY DATOS.fecha;";

    G.log.trace(__dirname+'/logs.txt', sql);
    
    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_inicial, fecha_final], function(err, rows, result) {
        callback(err, rows);
    });

};


module.exports = KardexModel;