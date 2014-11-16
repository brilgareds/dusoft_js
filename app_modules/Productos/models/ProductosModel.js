var ProductosModel = function() {


};

// Autor:      : Camilo Orozco 
// Descripcion : Validar si un producto existe o no en la base de datos
// Calls       : OrdenesCompra -> OrdenesCompraController -> ordenCompraArchivoPlano();
// 

ProductosModel.prototype.validar_producto = function(codigo_producto, callback) {

    var sql = " select * from inventarios_productos a where a.codigo_producto = $1 ";

    G.db.query(sql, [codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};

// Autor:      : Camilo Orozco 
// Descripcion : Buscar producto
// Calls       : PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();
//               

ProductosModel.prototype.buscar_productos = function(empresa_id, centro_utilidad_id, bodega_id, termino_busqueda, pagina, callback) {

    var sql = " select\
                a.empresa_id, \
                a.centro_utilidad,\
                a.bodega,\
                f.descripcion as descripcion_laboratorio,    \
                e.descripcion as descripcion_molecula,\
                b.codigo_producto, \
                fc_descripcion_producto(b.codigo_producto) as nombre_producto,\
                b.unidad_id,\
                b.estado, \
                b.codigo_invima,\
                b.contenido_unidad_venta,\
                b.sw_control_fecha_vencimiento,\
                a.existencia_minima,\
                a.existencia_maxima,\
                a.existencia::integer as existencia,\
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
                b.porc_iva,\
                b.tipo_producto_id\
                from existencias_bodegas a \
                inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and a.empresa_id = c.empresa_id\
                inner join inv_tipo_producto d ON b.tipo_producto_id = d.tipo_producto_id\
                inner join inv_subclases_inventarios e ON b.grupo_id = e.grupo_id and b.clase_id = e.clase_id and b.subclase_id = e.subclase_id\
                inner join inv_clases_inventarios f ON e.grupo_id = f.grupo_id and e.clase_id = f.clase_id\
                where a.empresa_id= $1 and a.centro_utilidad = $2 and a.bodega = $3 \
                and ( b.codigo_producto ILIKE $4 or b.descripcion ILIKE $4 ) \
                ORDER BY 7 ASC ";

    G.db.pagination(sql, [empresa_id, centro_utilidad_id, bodega_id, "%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });

};

// Autor:      : Camilo Orozco 
// Descripcion : Consultar stock producto o existencias empresa de un producto
// Calls       : Pedidos -> PedidosModel -> calcular_disponibilidad_producto();
//               PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();

ProductosModel.prototype.consultar_stock_producto = function(empresa_id, codigo_producto, callback) {

    var sql = " select SUM(a.existencia::integer) as existencia from existencias_bodegas a\
                inner join inventarios b on a.codigo_producto = b.codigo_producto and a.empresa_id = b.empresa_id\
                inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                where a.empresa_id = $1 and a.codigo_producto = $2 and a.estado = '1' and c.estado = '1'";

    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};


// Consultar lotes y fechas vencimientos produto
ProductosModel.prototype.consultar_existencias_producto = function(empresa_id, codigo_producto, callback) {

    var sql = " select \
                a.empresa_id,\
                a.centro_utilidad,\
                a.bodega as bodega_id,\
                a.codigo_producto,\
                fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\
                a.lote,\
                to_char(a.fecha_vencimiento, 'dd-mm-yyyy') AS fecha_vencimiento,\
                a.existencia_actual\
                from existencias_bodegas_lote_fv a \
                inner join existencias_bodegas b on a.empresa_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega and a.codigo_producto = b.codigo_producto\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and b.empresa_id = c.empresa_id\
                inner join inventarios_productos d on c.codigo_producto = d.codigo_producto\
                where a.empresa_id = $1 \
                and a.codigo_producto = $2 \
                and a.existencia_actual > 0\
                and a.estado = '1'\
                and d.estado = '1'\
                order by a.fecha_vencimiento desc ;";

    G.db.query(sql, [empresa_id, codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};

//Consultar tipo de productos
ProductosModel.prototype.listar_tipo_productos = function(callback) {
    
    var sql = "select tipo_producto_id, descripcion from inv_tipo_producto";
    
    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = ProductosModel;