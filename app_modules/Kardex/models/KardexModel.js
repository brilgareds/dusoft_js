var KardexModel = function() {

};


KardexModel.prototype.buscar_productos = function(termino_busqueda, pagina, callback) {

    var offset = G.settings.limit * pagina;

    var sql = " select\
                a.empresa_id, \
                a.centro_utilidad,\
                a.bodega,\
                b.codigo_producto, \
                fc_descripcion_producto(b.codigo_producto) as nombre_producto,\
                b.unidad_id,\
                b.estado, \
                b.codigo_invima,\
                b.contenido_unidad_venta,\
                b.sw_control_fecha_vencimiento,\
                a.existencia_minima,\
                a.existencia_maxima,\
                a.existencia,\
                c.existencia as existencia_total,\
                c.costo_anterior,\
                c.costo,\
                CASE WHEN c.costo > 0 THEN ROUND(((c.precio_venta/c.costo)-1) * 100) ELSE NULL END as porcentaje_utilidad,\
                c.costo_penultima_compra,\
                c.costo_ultima_compra,\
                c.precio_venta_anterior,\
                c.precio_venta,\
                c.precio_minimo,\
                c.precio_maximo,\
                c.sw_vende,\
                c.grupo_contratacion_id,\
                c.nivel_autorizacion_id,\
                b.grupo_id,\
                b.clase_id,\
                b.subclase_id,\
                b.porc_iva\
                from existencias_bodegas a \
                inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and a.empresa_id = c.empresa_id\
                where a.empresa_id='03' and a.centro_utilidad = '1 ' and a.bodega = '03'\
                and ( b.codigo_producto ILIKE $1 or b.descripcion ILIKE $1 ) \
                ORDER BY 5 DESC limit $2 offset $3 ";

    G.db.query(sql, ["%" + termino_busqueda + "%", G.settings.limit, offset], function(err, rows, result) {
        callback(err, rows);
    });

};

//Seleccionar la existencia inicial del producto
KardexModel.prototype.obtener_existencia_inicial = function(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_cierre, callback) {

    var d = new Date(fecha_cierre);
    var lapso = d.addMonths(-1).toFormat('YYYYMM');

    var sql = "SELECT existencia_final as existencia_inicial FROM inv_bodegas_movimiento_cierres_por_lapso WHERE lapso =$5 AND empresa_id = $1 AND centro_utilidad =$2 AND bodega =$3 AND codigo_producto =$4 ;";

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, codigo_producto, lapso], function(err, rows, result) {
        callback(err, rows);
    });
};


// Selecciona los movimientos del producto dentro de un periodo de tiempo determinado
KardexModel.prototype.obtener_movimientos_productos = function(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_inicial, fecha_final, callback) {

    // sql para la bd de pruebas a.tipo_producto as tipo_producto_id
    var sql_pruebas = " SELECT *  \n" +
            " FROM  " +
            " ( " +
            "   ( " +
            "     select  " +
            "     d.tipo_doc_general_id as tipo_documento,  " +
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
            "     c.tipo_doc_bodega_id as tipo_documento,  " +
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
            "     d.tipo_doc_general_id as tipo_documento,  " +
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
            "     c.tipo_doc_bodega_id as tipo_documento, " +
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
            " ) AS DATOS ORDER BY DATOS.fecha ;";


    // sql para la bd de produccion
    var sql_produccion = " SELECT *  \n" +
            " FROM  " +
            " ( " +
            "   ( " +
            "     select  " +
            "     d.tipo_doc_general_id as tipo_documento,  " +
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
            "     from inv_bodegas_documentos c  " +
            "     inner join inv_bodegas_movimiento a  on c.documento_id = a.documento_id and c.empresa_id = a.empresa_id and c.centro_utilidad = a.centro_utilidad and c.bodega = a.bodega  " +
            "     inner join inv_bodegas_movimiento_d b on a.empresa_id = b.empresa_id  and a.prefijo = b.prefijo and a.numero=b.numero  " +
            "     inner join documentos d on c.documento_id = d.documento_id AND c.empresa_id = d.empresa_id " +
            "     inner join tipos_doc_generales e on d.tipo_doc_general_id = e.tipo_doc_general_id " +
            "     inner join system_usuarios as g on a.usuario_id = g.usuario_id " +
            "     left join ( " +
            "         select c.empresa_id, c.prefijo, c.numero, a.numero_factura as factura, b.codigo_producto, b.valor  " +
            "         from  inv_facturas_proveedores a  " +
            "         inner join inv_facturas_proveedores_d b on a.codigo_proveedor_id = b.codigo_proveedor_id and a.numero_factura = b.numero_factura " +
            "         inner join inv_recepciones_parciales c on b.recepcion_parcial_id = c.recepcion_parcial_id    " +
            "         union " +
            "         select c.empresa_id, c.prefijo, c.numero, a.prefijo||'-'||a.factura_fiscal as factura, b.codigo_producto, b.valor_unitario as valor " +
            "         from inv_bodegas_movimiento_despachos_clientes c  " +
            "         inner join inv_facturas_despacho a  on c.pedido_cliente_id = a.pedido_cliente_id    " +
            "         inner join inv_facturas_despacho_d b on a.prefijo = b.prefijo and a.factura_fiscal = b.factura_fiscal " +
            "         union all " +
            "         select c.empresa_id, c.prefijo, c.numero, a.prefijo||'-'||a.factura_fiscal as factura, b.codigo_producto, b.valor_unitario as valor " +
            "         from inv_facturas_agrupadas_despacho a " +
            "         inner join inv_facturas_agrupadas_despacho_d b on a.prefijo = b.prefijo and a.factura_fiscal = b.factura_fiscal " +
            "         inner join inv_bodegas_movimiento_despachos_clientes c on b.pedido_cliente_id = c.pedido_cliente_id " +
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
            "     c.tipo_doc_bodega_id as tipo_documento,  " +
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
            "     d.tipo_doc_general_id as tipo_documento,  " +
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
            "     c.tipo_doc_bodega_id as tipo_documento, " +
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
            " ) AS DATOS ORDER BY DATOS.fecha ;";

    console.log("ambiente de trabajo es ", G.settings.env);
    var sql = (G.settings.env === 'prod') ? sql_produccion : sql_pruebas;

    G.db.query(sql, [empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_inicial, fecha_final], function(err, rows, result) {
        callback(err, rows);
    });

};

KardexModel.prototype.obtener_detalle_movimientos_producto = function(empresa_id, tipo_documento_bodega, prefijo, numero, callback) {

    var sql = "";

    switch (tipo_documento_bodega)
    {
        case 'I001':

            sql = " SELECT \
                    a.tipo_id_tercero || ' ' || a.tercero_id || ' : '|| b.nombre_tercero as \"PROVEEDOR\" ,\
                    a.documento_compra as \"FACTURA DE COMPRA No.\" ,\
                    a.fecha_doc_compra as \"FECHA DE COMPRA\" \
                    FROM inv_bodegas_movimiento_compras_directas a\
                    inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ; ";
            break;

        case 'I002':

            sql = " SELECT \
                    a.orden_pedido_id as \"ORDEN DE PEDIDO No.\",\
                    d.tipo_id_tercero || ' ' || d.tercero_id || ' : '|| d.nombre_tercero as \"PROVEEDOR.\"\
                    FROM inv_bodegas_movimiento_ordenes_compra a\
                    inner join compras_ordenes_pedidos b on a.orden_pedido_id = b.orden_pedido_id \
                    inner join terceros_proveedores c on b.codigo_proveedor_id = c.codigo_proveedor_id\
                    inner join terceros d on c.tipo_id_tercero = d.tipo_id_tercero and c.tercero_id = d.tercero_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ; ";

            break;

        case 'I003':

            sql = " SELECT \
                    a.fecha_selectivo as \"<b>FECHA SELECTIVO</b>\",\
                    a.coordinador_auxiliar as \"<b>COORDINADOR O AUXILIAR ESTABLECIMIENTO</b>\",\
                    c.descripcion||'-'||d.descripcion as \"<b>NOMBRE ESTABLECIMIENTO</b>\",\
                    a.control_interno as \"<b>AUDITOR GESTION CONTROL INTERNO</b>\"\
                    FROM inv_bodegas_movimiento_ajustes a\
                    INNER JOIN inv_bodegas_movimiento b ON (a.empresa_id = b.empresa_id) AND (a.prefijo = b.prefijo) AND (a.numero = b.numero)\
                    INNER JOIN bodegas c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad) AND (b.bodega = c.bodega)\
                    INNER JOIN centros_utilidad d ON (c.empresa_id = d.empresa_id) AND (c.centro_utilidad = d.centro_utilidad)\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";
            break;

        case 'I005':

            sql = " SELECT '(' || b.tipo_aprovechamiento_id || ') ' || b.descripcion as \"TIPO DE APROVECHAMIENTO\" \
                    FROM inv_bodegas_movimiento_aprovechamientos a\
                    inner join inv_bodegas_tipos_aprovechamiento b on a.tipo_aprovechamiento_id = b.tipo_aprovechamiento_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";

            break;

        case 'I006':

            sql = " SELECT \
                    a.tipo_id_tercero || ' ' || a.tercero_id || ' : '|| b.nombre_tercero as \"TERCERO QUE DEVUELVE EL PRESTAMO\",\
                    a.prefijo_prestamo || '-' || a.numero_prestamo as \"DOCUMENTO DE PRESTAMO\"\
                    FROM inv_bodegas_movimiento_ing_dev_prestamos a\
                    inner join terceros b on a.tipo_id_tercero =  b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";

            break;

        case 'I007':

            sql = " SELECT \
                    a.tipo_id_tercero || ' ' || a.tercero_id || ' : '|| b.nombre_tercero as \"PROVEEDOR DEL PRESTAMO\",\
                    '(' || c.tipo_prestamo_id || ') ' || c.descripcion as \"MOTIVO DEL PRESTAMO\"\
                    FROM inv_bodegas_movimiento_prestamos a\
                    inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                    inner join inv_bodegas_tipos_prestamos  c on a.tipo_prestamo_id = c.tipo_prestamo_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3  ;";
            break;

        case 'I008':

            sql = " SELECT \
                    c.razon_social as \"EMPRESA QUE DESPACHA\",\
                    b.prefijo||'-'||b.numero as \"DOCUMENTO DE DESPACHO\",\
                    b.solicitud_prod_a_bod_ppal_id as \"PEDIDO\",\
                    d.observacion as \"OBSERVACION DOCUMENTO\"\
                    FROM inv_bodegas_movimiento_ingresosdespachos_farmacias a\
                    inner join inv_bodegas_movimiento_despachos_farmacias as b ON a.empresa_despacho = b.empresa_id AND a.prefijo_despacho = b.prefijo AND a.numero_despacho = b.numero\
                    inner join inv_bodegas_movimiento as d ON b.empresa_id = d.empresa_id AND b.prefijo = d.prefijo AND b.numero = d.numero\
                    inner join empresas as c ON b.empresa_id = c.empresa_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ; ";

            break;

        case 'I011':

            sql = " SELECT \
                    emp.empresa_id || ' - ' || emp.razon_social as \"FARMACIA\",\
                    ' ' || a.prefijo_doc_farmacia || '-' || a.numero_doc_farmacia as \"DOCUMENTO DE DEVOLUCION\"\
                    FROM inv_bodegas_movimiento_devolucion_farmacia a\
                    inner join empresas emp on a.farmacia_id = emp.empresa_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3";

            break;

        case 'I012':

            sql = " SELECT \
                    b.tipo_id_tercero || ' ' || b.tercero_id || ' : '|| b.nombre_tercero as \"CLIENTE\",\
                    a.prefijo_doc_cliente || '-' || a.numero_doc_cliente as \"NUMERO DE FACTURA\" \
                    FROM inv_bodegas_movimiento_devolucion_cliente a \
                    inner join terceros as b on  a.tipo_id_tercero = b.tipo_id_tercero AND a.tercero_id = b.tercero_id  \
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ; ";
            break;

        case 'I013':

            sql = " SELECT \
                    pac.primer_nombre|| ' ' ||pac.segundo_nombre|| ' ' ||pac.primer_apellido|| ' ' ||pac.segundo_apellido || ' : ' as \"PACIENTE\",\
                    '(' || a.formula_papel || ') ' as \"NUMERO DE FORMULA\" \
                    FROM inv_bodegas_movimiento_devoluciones_formula_medica a \
                    inner join esm_formula_externa b on a.formula_id = b.formula_id \
                    inner join pacientes pac on b.tipo_id_paciente = pac.tipo_id_paciente AND b.paciente_id = pac.paciente_id \
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";
            break;

        case 'I015':

            sql = " SELECT \
                    e.razon_social||'-'||d.descripcion||'-'||c.descripcion as \"FARMACIA ORIGEN\",\
                    '(' || a.prefijo_doc_farmacia || '-' || a.numero_doc_farmacia || ') ' as \"DOCUMENTO DE TRASLADO\"\
                    FROM inv_bodegas_movimiento_ingresos_traslados_farmacia a\
                    inner JOIN inv_bodegas_movimiento as b ON (a.farmacia_id = b.empresa_id) AND (a.prefijo_doc_farmacia = b.prefijo) AND (a.numero_doc_farmacia = b.numero)\
                    inner JOIN bodegas as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad) AND (b.bodega = c.bodega)\
                    inner JOIN centros_utilidad as d ON (c.empresa_id = d.empresa_id) AND (c.centro_utilidad = d.centro_utilidad) \
                    inner JOIN empresas as e ON (d.empresa_id = e.empresa_id)\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";
            break;

        case 'T001':
            sql = " SELECT \
                    ('[' || b.empresa_id || ']' || '[' || b.centro_utilidad || ']' || '[' || b.bodega || '] : ' || b.descripcion) as \"BODEGA DESTINO\",\
                    (CASE WHEN a.usuario_id IS NULL THEN 'SIN CONFIRMAR' ELSE c.nombre || ' [' || to_char(a.fecha_confirmacion, 'YYYY-MM-DD HH24:MI:SS') || ']' END) as \"CONFIRMACION\"\
                    FROM inv_bodegas_movimiento_traslados a\
                    inner join bodegas as b on a.empresa_id = b.empresa_id and a.centro_utilidad_destino = b.centro_utilidad and a.bodega_destino = b.bodega\
                    LEFT JOIN system_usuarios as c ON (a.usuario_id = c.usuario_id)\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3";
            break;

        case 'T002':

            sql = " SELECT \
                    ('[' || b.empresa_id || ']' || '[' || b.centro_utilidad || ']' || '[' || b.bodega || '] : ' || b.descripcion) as \"BODEGA DESTINO\",\
                    (CASE WHEN a.usuario_id IS NULL THEN 'SIN CONFIRMAR' ELSE c.nombre || ' [' || to_char(a.fecha_confirmacion, 'YYYY-MM-DD HH24:MI:SS') || ']' END) as \"CONFIRMACION\",\
                    d.orden_requisicion_id as \"ORDEN REQUISICION\",\
                    f.tipo_id_tercero || ' ' || f.tercero_id || '-' || f.nombre_tercero as \"ESM\",\
                    g.descripcion as \"FUERZA\",\
                    CASE WHEN d.sw_bodegamindefensa = '1' THEN 'PRODUCTOS DE MINDEFENSA' ELSE 'PRODUCTOS DE OPERADOR LOGISTICO' END as \"BODEGA\", \
                    d.sw_bodegamindefensa,\
                    d.sw_entregado_off   \
                    FROM inv_bodegas_movimiento_traslados a\
                    inner join bodegas b on a.empresa_id = b.empresa_id and a.centro_utilidad_destino = b.centro_utilidad and a.bodega_destino = b.bodega\
                    inner join inv_bodegas_movimiento_traslados_esm d on a.empresa_id = d.empresa_id AND a.prefijo = d.prefijo AND a.numero = d.numero\
                    inner join esm_orden_requisicion e on d.orden_requisicion_id = e.orden_requisicion_id \
                    inner join terceros f on e.tercero_id = f.tercero_id AND e.tipo_id_tercero = f.tipo_id_tercero\
                    inner join esm_tipos_fuerzas g e.tipo_fuerza_id = g.tipo_fuerza_id \
                    left join system_usuarios as c ON (a.usuario_id = c.usuario_id),\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";
            break;

        case 'T003':

            sql = " SELECT \
                    ('[' || b.empresa_id || ']' || '[' || b.centro_utilidad || ']' || '[' || b.bodega || '] : ' || b.descripcion) as \"BODEGA DESTINO\",\
                    c.nombre  as \"USUARIO QUE DEVUELVE\"\
                    FROM inv_bodegas_movimiento_traslados_esm_devoluciones a\
                    inner join bodegas b on a.empresa_id = b.empresa_id and a.centro_utilidad_destino = b.centro_utilidad and a.bodega_destino = b.bodega\
                    LEFT JOIN system_usuarios as c ON (a.usuario_id = c.usuario_id),\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3;";
            break;

        case 'T004':

            sql = " SELECT \
                    ('[' || b.empresa_id || ']' || '[' || b.centro_utilidad || ']' || '[' || b.bodega || '] : ' || b.descripcion) as \"BODEGA DESTINO\",\
                    a.prefijo_documento_devolucion || ' ' ||a.numero_documento_devolucion  as \"DOCUMENTO DE DEVOLUCION\"\
                    FROM inv_bodegas_movimiento_traslados_esm_despacho_devolucion a\
                    inner join bodegas b on a.empresa_id = b.empresa_id and a.centro_utilidad_destino = b.centro_utilidad and a.bodega_destino = b.bodega\
                    WHERE a.empresa_id = $1  AND a.prefijo = $2 AND a.numero = $3 ;";
            break;

        case 'E001':
            sql = " SELECT '(' || b.tipo_perdida_id || ') ' || b.descripcion as \"TIPO DE PERDIDA\" \
                    FROM inv_bodegas_movimiento_perdidas a\
                    inner join inv_bodegas_tipos_perdidas b on a.tipo_perdida_id = b.tipo_perdida_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ; ";
            break;

        case 'E002':

            sql = " SELECT \
                    a.tipo_id_tercero || ' ' || a.tercero_id || ' : '|| b.nombre_tercero as \"ENTIDAD BENEFICIARIA\",\
                    '(' || c.tipo_prestamo_id || ') ' || c.descripcion as \"MOTIVO DEL PRESTAMO\"\
                    FROM inv_bodegas_movimiento_prestamos a\
                    inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                    inner join inv_bodegas_tipos_prestamos c on a.tipo_prestamo_id = c.tipo_prestamo_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";
            break;
        case 'E003':

            sql = " SELECT \
                    a.fecha_selectivo as \"<b>FECHA SELECTIVO</b>\",\
                    a.coordinador_auxiliar as \"<b>COORDINADOR O AUXILIAR ESTABLECIMIENTO</b>\",\
                    c.descripcion||'-'||d.descripcion as \"<b>NOMBRE ESTABLECIMIENTO</b>\",\
                    a.control_interno as \"<b>AUDITOR GESTION CONTROL INTERNO</b>\"\
                    FROM inv_bodegas_movimiento_ajustes as a\
                    inner join inv_bodegas_movimiento as b ON (a.empresa_id = b.empresa_id) AND (a.prefijo = b.prefijo) AND (a.numero = b.numero)\
                    inner join bodegas as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad) AND (b.bodega = c.bodega)\
                    inner join centros_utilidad as d ON (c.empresa_id = d.empresa_id) AND (c.centro_utilidad = d.centro_utilidad)\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ; ";
            break;

        case 'E004':

            sql = " SELECT \
                    a.tipo_id_tercero || ' ' || a.tercero_id || ' : '|| b.nombre_tercero as \"TERCERO QUE RECIBE LA DEVOLUCION DEL PRESTAMO\",\
                    a.prefijo_prestamo || '-' || a.numero_prestamo as \"DOCUMENTO DE PRESTAMO\"\
                    FROM inv_bodegas_movimiento_eg_dev_prestamos a \
                    inner join terceros b on  a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ; ";
            break;

        case 'E006':

            sql = " SELECT b.departamento || ' : ' || b.descripcion as \"DEPARTAMENTO\" \
                    FROM inv_bodegas_movimiento_consumo a \
                    inner join departamentos b on a.departamento = b.departamento \
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";
            break;

        case 'E007':

            sql = " SELECT \
                    b.departamento || ' : ' || b.descripcion as \"DEPARTAMENTO\", \
                    a.tipo_id_tercero || ' ' || a.tercero_id || ' : '|| d.nombre_tercero as \"TERCERO\", \
                    '(' || a.tipo_id_tercero || ') ' || c.descripcion as \"CONCEPTO DEL EGRESO\" \
                    FROM inv_bodegas_movimiento_conceptos_egresos a \
                    inner join departamentos b on a.departamento = b.departamento \
                    inner join inv_bodegas_conceptos_egresos c on a.concepto_egreso_id = c.concepto_egreso_id \
                    inner join terceros d on a.tipo_id_tercero = d.tipo_id_tercero and a.tercero_id = d.tercero_id \
                    WHERE a.empresa_id = $1 AND a.prefijo =$2 AND a.numero = $3; ";
            break;

        case 'E008':

            sql = " select * from\
                    (\
                      (   \
                        SELECT  'CLIENTES'  as \"TIPO DE DESPACHO :\",\
                        a.tipo_id_tercero || ' ' || a.tercero_id || ' : '|| b.nombre_tercero as \"FARMACIA/CLIENTE :\",\
                        a.pedido_cliente_id AS \"NUMERO PEDIDO: \",\
                        b.direccion AS \"DIRECCION: \",\
                        b.telefono AS \"TELEFONO: \",\
                        a.observacion AS \"OBSERVACIONES\"\
                        FROM inv_bodegas_movimiento_despachos_clientes a\
                        inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                        WHERE   a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3\
                      ) \
                      UNION ALL\
                      (    \
                        SELECT  'FARMACIAS'  as \"TIPO DE DESPACHO :\",\
                        e.empresa_id || ' - '|| e.razon_social ||' ::: '||c.descripcion as \"FARMACIA/CLIENTE :\",\
                        a.solicitud_prod_a_bod_ppal_id AS \"NUMERO PEDIDO: \",\
                        e.direccion AS \"DIRECCION: \",\
                        e.telefonos AS \"TELEFONO: \",\
                        a.observacion AS \"OBSERVACIONES\" \
                        FROM  inv_bodegas_movimiento_despachos_farmacias a\
                        inner JOIN solicitud_productos_a_bodega_principal b ON (a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id)\
                        inner JOIN bodegas as c ON (b.farmacia_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad) AND (b.bodega = c.bodega)\
                        JOIN centros_utilidad as d ON (c.centro_utilidad = d.centro_utilidad) AND (c.empresa_id = d.empresa_id)\
                        JOIN empresas as e ON (d.empresa_id = e.empresa_id)\
                        WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3\
                      )   \
                    )as x ; ";
            break;

        case 'E012':

            sql = " SELECT \
                    b.tipo_id_tercero || ' ' || b.tercero_id || ' : '|| b.nombre_tercero as \"PROVEEDOR\",\
                    a.codigo_proveedor_id as \"CODIGO DEL PROVEEDOR\",\
                    a.numero_factura as \"NUMERO DE FACTURA\"\
                    FROM inv_bodegas_movimiento_devolucion_proveedor a\
                    inner JOIN terceros_proveedores c ON (a.codigo_proveedor_id = c.codigo_proveedor_id) \
                    inner JOIN terceros b ON (c.tipo_id_tercero = b.tipo_id_tercero) AND (c.tercero_id = b.tercero_id) \
                    WHERE  a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3; ";
            break;

        case 'E016':

            sql = " SELECT \
                    b.tipo_id_tercero || ' ' || b.tercero_id || ' : '|| b.nombre_tercero as \"ESM\",\
                    '(' || a.orden_requisicion_id || ') ' as \"NUMERO DE REQUISICION\",\
                    '' || c.descripcion || ' ' as \"TIPO DE FUERZA\",\
                    '' || a.direccion || ' ' as \"DIRECCION\",\
                    '' || a.empresa_transportadora || ' ' as \"EMPRESA TRANSPORTADORA\",\
                    '' || a.numero_guia || ' ' as \"NUMERO GUIA\",\
                    CASE WHEN sw_bodegamindefensa = '1' THEN 'PRODUCTOS DE MINDEFENSA' ELSE 'PRODUCTOS DE OPERADOR LOGISTICO' END as \"BODEGA\",\
                    a.sw_bodegamindefensa,\
                    a.sw_entregado_off      \
                    FROM inv_bodegas_movimiento_despacho_campania a \
                    inner join terceros b on a.tercero_id = b.tercero_id AND a.tipo_id_tercero = b.tipo_id_tercero\
                    inner join esm_tipos_fuerzas c on a.tipo_fuerza_id = c.tipo_fuerza_id     \
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ; ";
            break;

        case 'E017':

            sql = " SELECT \
                    d.razon_social||'-'||c.descripcion||'-'||b.descripcion as \"FARMACIA DESTINO\",\
                    CASE WHEN a.sw_estado = '1' THEN 'PENDIENTE POR RECIBIR TOTALMENTE' ELSE 'RECIBIDO TOTALMENTE' END as \"ESTADO DOCUMENTO\"\
                    FROM inv_bodegas_movimiento_traslados_farmacia as a\
                    LEFT JOIN bodegas as b ON (a.farmacia_id = b.empresa_id) AND (a.centro_utilidad = b.centro_utilidad) AND (a.bodega = b.bodega)\
                    LEFT JOIN centros_utilidad as c ON (b.empresa_id = c.empresa_id) AND (b.centro_utilidad = c.centro_utilidad)\
                    LEFT JOIN empresas as d ON (c.empresa_id = d.empresa_id)\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";
            break;

        case 'E018':

            sql = " SELECT \
                    b.plan_descripcion as \"PLAN\",\
                    c.descripcion_tipo_formula as \"TIPO DISPENSACION\",\
                    a.requisicion AS \"COD. SOLICITUD\"   \
                    FROM inv_bodegas_movimiento_distribucion a\
                    inner join JOIN planes b ON(a.plan_id = b.plan_id)\
                    inner join JOIN esm_tipos_formulas as c ON (a.tipo_formula_id = c.tipo_formula_id)\
                    WHERE a.empresa_id = $1 AND a.prefijo = $2 AND a.numero = $3 ;";
            break;

    }


    G.db.query(sql, [empresa_id, prefijo, numero], function(err, rows, result) {
        callback(err, rows);
    });

};


module.exports = KardexModel;