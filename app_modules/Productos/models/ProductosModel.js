var ProductosModel = function() {


};

// Autor:      : Camilo Orozco 
// Descripcion : Validar si un producto existe o no en la base de datos
// Calls       : OrdenesCompra -> OrdenesCompraController -> ordenCompraArchivoPlano();
// 
ProductosModel.prototype.validar_producto = function(codigo_producto, callback) {

    var sql = " select a. *, fc_descripcion_producto(a.codigo_producto) as descripcion_producto from inventarios_productos a where a.codigo_producto = $1 ";

    G.db.query(sql, [codigo_producto], function(err, rows, result) {
        callback(err, rows);
    });
};

// Autor:      : Camilo Orozco 
// Descripcion : Buscar producto
// Calls       : PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();
//               

ProductosModel.prototype.buscar_productos = function(empresa_id, centro_utilidad_id, bodega_id, termino_busqueda, pagina, tipo_producto, callback) {

    var campos = [                
        "a.empresa_id", 
        "a.centro_utilidad",
        "a.bodega",
        "f.descripcion as descripcion_laboratorio",    
        "e.descripcion as descripcion_molecula",
        "b.codigo_producto", 
        G.knex.raw("fc_descripcion_producto(b.codigo_producto) as nombre_producto"),
        "b.unidad_id",
        "b.estado", 
        "b.codigo_invima",
        "b.contenido_unidad_venta",
        "b.sw_control_fecha_vencimiento",
        "b.codigo_cum",
        "a.existencia_minima",
        "a.existencia_maxima",
        G.knex.raw("a.existencia :: integer  as existencia"),
        "c.existencia as existencia_total",
        "c.costo_anterior",
        "c.costo",
        G.knex.raw("CASE WHEN c.costo > 0 THEN ROUND(((c.precio_venta/c.costo)-1) * 100) ELSE NULL END as porcentaje_utilidad"),
        "c.costo_penultima_compra",
        "c.costo_ultima_compra",
        "c.precio_venta_anterior",
        "c.precio_venta",
        "c.precio_minimo",
        "c.precio_maximo",
        "c.sw_vende",
        "c.grupo_contratacion_id",
        "c.nivel_autorizacion_id",
        "b.grupo_id",
        "b.clase_id",
        "b.subclase_id",
        "b.porc_iva",
        "b.tipo_producto_id",
        "g.valor_pactado",
        "c.precio_regulado"
     ];
    
   
    G.knex.column(campos).
    from("existencias_bodegas as a").
    innerJoin("inventarios_productos as b", "a.codigo_producto","b.codigo_producto").
    innerJoin("inventarios as c", function(){
         this.on("b.codigo_producto", "c.codigo_producto" ).
         on("a.empresa_id", "c.empresa_id");
    }).
    innerJoin("inv_tipo_producto as d", "b.tipo_producto_id","d.tipo_producto_id").
    innerJoin("inv_subclases_inventarios as e", function(){
         this.on("b.grupo_id", "e.grupo_id" ).
         on("b.clase_id", "e.clase_id").
         on("b.subclase_id", "e.subclase_id");
    }).
    innerJoin("inv_clases_inventarios as f", function(){
         this.on("e.grupo_id", "f.grupo_id" ).
         on("e.clase_id", "f.clase_id");
    }).
    leftJoin("contratacion_produc_prov_detalle as g", function(){
         this.on("b.codigo_producto", "g.codigo_producto" )
        .on("a.empresa_id", "g.empresa_id");
    }).
    where(function(){
        this.where("a.empresa_id", empresa_id).
        andWhere("a.centro_utilidad", centro_utilidad_id).
        andWhere("a.bodega",bodega_id);
        
        if (tipo_producto !== '0') {
            this.where("b.tipo_producto_id ", tipo_producto);
        }
    }).
    andWhere(function() {

       var termino = termino_busqueda;
       if(typeof termino_busqueda ===  'object'){
           termino = termino_busqueda.termino;
           
            if(termino_busqueda.tipo_busqueda === 0){
               this.where(G.knex.raw("fc_descripcion_producto(b.codigo_producto)"), G.constants.db().LIKE,   termino +"%");
            } else if(termino_busqueda.tipo_busqueda === 1){
                this.where("e.descripcion", G.constants.db().LIKE, "%" + termino + "%");
            } else {
                this.where("a.codigo_producto", G.constants.db().LIKE, "%" + termino + "%");
            }
           
       } else {
           
            this.where("b.codigo_producto", G.constants.db().LIKE, "%" + termino + "%").
            orWhere("b.descripcion", G.constants.db().LIKE, "%" + termino + "%");
       }
        
    }).        
    limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).
    //orderByRaw("7 asc").
    then(function(rows){
        callback(false, rows);
    }).
    catch(function(err){
     
       callback(err);
    });


};


ProductosModel.prototype.consultarExistenciasProducto = function(empresa_id, termino_busqueda, pagina, callback) { 

    G.knex.column("a.existencia", "b.codigo_producto","b.descripcion as producto","b.cantidad",
    "b.codigo_alterno", "b.contenido_unidad_venta", "c.empresa_id", "c.razon_social", "d.descripcion AS centro",
    "e.descripcion as bodega",G.knex.raw("fc_descripcion_producto(b.codigo_producto) as descripcion_producto"), "b.tipo_producto_id").
    from("existencias_bodegas as a").
    innerJoin("inventarios_productos as b", "a.codigo_producto", "b.codigo_producto").
    innerJoin("empresas as c", "a.empresa_id", "c.empresa_id").
    innerJoin("centros_utilidad as d", function(){
         this.on("a.centro_utilidad", "d.centro_utilidad" ).
         on("a.empresa_id", "d.empresa_id");
    }).
    innerJoin("bodegas as e", function(){
         this.on("e.centro_utilidad", "d.centro_utilidad" ).
         on("e.empresa_id", "d.empresa_id").
         on("e.bodega", "a.bodega");
    }).
    where(function(){
        this.where("a.estado", "1").andWhere("a.existencia", ">", "0");
        
        if (empresa_id !== "") {
            this.where("c.empresa_id", empresa_id);
        }
    }).     
    andWhere(function() {
       //this.where("b.descripcion", G.constants.db().LIKE, "%" + termino_busqueda + "%").
       this.where(G.knex.raw("fc_descripcion_producto(b.codigo_producto)"), G.constants.db().LIKE, termino_busqueda +"%").
       orWhere("b.codigo_producto", G.constants.db().LIKE, "%" + termino_busqueda + "%");
    }).
    limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).
    then(function(rows){
        callback(false, rows);
    }).
    catch(function(err){
       callback(err);
    });

};


// Autor:      : Camilo Orozco 
// Descripcion : Consultar stock producto o existencias empresa de un producto
// Calls       : Pedidos -> PedidosModel -> calcular_disponibilidad_producto();
//               PedidosFarmacias -> PedidosFarmaciasController -> listar_productos();

ProductosModel.prototype.consultar_stock_producto = function(empresa_id, codigo_producto, callback) {

    var sql = " select COALESCE(SUM(a.existencia::integer), 0) as existencia from existencias_bodegas a\
                inner join inventarios b on a.codigo_producto = b.codigo_producto and a.empresa_id = b.empresa_id\
                inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                where a.empresa_id = :1 and a.codigo_producto = :2 and a.estado = '1' and c.estado = '1'";
    
   G.knex.raw(sql, {1 : empresa_id, 2 : codigo_producto}).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};


// Consultar lotes y fechas vencimientos produto
ProductosModel.prototype.consultar_existencias_producto = function(empresa_id, codigo_producto, centro_utilidad, bodega, callback) {

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
                inner join existencias_bodegas b on a.empresa_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega and a.codigo_producto = b.codigo_producto and a.centro_utilidad = :3 and a.bodega= :4\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and b.empresa_id = c.empresa_id\
                inner join inventarios_productos d on c.codigo_producto = d.codigo_producto\
                where a.empresa_id = :1 \
                and a.codigo_producto = :2 \
                and a.existencia_actual > 0\
                and a.estado = '1'\
                and d.estado = '1'\
                order by a.fecha_vencimiento desc ;";

    
   G.knex.raw(sql, {1 : empresa_id, 2 : codigo_producto, 3 :centro_utilidad, 4 :bodega}).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};


/**/
// Autor:      : Alexander López Guerrero
// Descripcion : Lista productos Clientes
// Calls       : Productos -> ProductosController -> listarProductosClientes();
// ??????????????????????????????????????????
ProductosModel.prototype.listar_productos_clientes = function(empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, termino_busqueda, pedido_cliente_id_tmp, tipo_producto, laboratorio, concentracion, pagina, filtro, callback) {

    var sql_aux = "";
    var sql_filter = "";

    //Armar String y Array para restricción de búsqueda según tipo de producto
    var array_parametros = [];

    if (tipo_producto !== '0') {

        sql_aux = " and b.tipo_producto_id = $8 ";

        array_parametros = [empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, "%" + termino_busqueda + "%", "%" + concentracion + "%", "%" + laboratorio + "%", tipo_producto];
    }
    else {
        array_parametros = [empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, "%" + termino_busqueda + "%", "%" + concentracion + "%", "%" + laboratorio + "%"];
    }

    //Armar String para filtar termino_busqueda por código de producto, molécula o descripción

    if (filtro.buscar_todo) {
        sql_filter = " a.codigo_producto ilike $5 \
                       or fc_descripcion_producto(a.codigo_producto) ilike $5 \
                       or g.descripcion  ilike $5 ";
    }
    else if (filtro.buscar_por_codigo) {
        sql_filter = " a.codigo_producto ilike $5 ";
    }
    else if (filtro.buscar_por_molecula) {
        sql_filter = " g.descripcion  ilike $5 ";
    }
    else if (filtro.buscar_por_descripcion) {
        sql_filter = " fc_descripcion_producto(a.codigo_producto) ilike $5 ";
    }

    var sql = " select\n\
                    a.codigo_producto,\n\
                    a.precio_regulado,\n\
                    fc_descripcion_producto(a.codigo_producto) as nombre_producto,\n\
                    CASE\n\
                        WHEN cast($4 as integer) = 0\n\
                        THEN fc_precio_producto_contrato_cliente(2, a.codigo_producto, $1)\n\
                        ELSE fc_precio_producto_contrato_cliente($4, a.codigo_producto, $1)\n\
                    END as precio_contrato,\n\
                    a.existencia as existencia_total,\n\
                    a.costo_anterior,\n\
                    a.costo,\n\
                    CASE WHEN a.costo > 0 THEN ROUND (((a.precio_venta/a.costo) - 1) * 100) ELSE NULL END as porcentaje_utilidad,\n\
                    a.costo_penultima_compra,\n\
                    round((a.costo_ultima_compra)/((COALESCE(b.porc_iva,0)/100)+1),2) as costo_ultima_compra,\n\
                    a.precio_venta_anterior,\n\
                    a.precio_venta,\n\
                    a.precio_minimo,\n\
                    a.precio_maximo,\n\
                    a.sw_vende,\n\
                    a.grupo_contratacion_id,\n\
                    a.nivel_autorizacion_id,\n\
                    b.sw_requiereautorizacion_despachospedidos,\n\
                    b.estado,\n\
                    b.sw_regulado,\n\
                    b.tipo_producto_id,\n\
                    b.unidad_id,\n\
                    b.codigo_invima,\n\
                    to_char(b.vencimiento_codigo_invima, 'DD-MM-YYYY') as vencimiento_codigo_invima,\n\
                    b.codigo_cum,\n\
                    b.contenido_unidad_venta,\n\
                    b.sw_control_fecha_vencimiento,\n\
                    b.grupo_id,\n\
                    b.clase_id,\n\
                    b.subclase_id,\n\
                    b.porc_iva,\n\
                    b.tipo_producto_id, \n\
                    g.subclase_id as molecula_id,\n\
                    g.descripcion as molecula_descripcion,\n\
                    i.existencia as existencia\n\
                from    inventarios a \n\
                    inner join inventarios_productos b on a.codigo_producto = b.codigo_producto \n\
                         and a.empresa_id = $1 \n\
                     inner join inv_subclases_inventarios g on b.subclase_id = g.subclase_id \n\
                         and b.grupo_id = g.grupo_id \n\
                         and b.clase_id = g.clase_id \n\
                     inner join inv_clases_inventarios h on b.grupo_id = h.grupo_id \n\
                         and b.clase_id = h.clase_id \n\
                     inner join existencias_bodegas i on a.codigo_producto = i.codigo_producto \n\
                     inner join inv_fabricantes j ON j.fabricante_id = b.fabricante_id\n\
                where \n\
                     i.empresa_id = $1 \n\
                     and i.centro_utilidad = $2 \n\
                     and i.bodega = $3 \n\
                     and ( " + sql_filter + " ) " + "\n\
                     and b.contenido_unidad_venta ilike $6 \n\
                     and j.descripcion ilike $7 " +
            sql_aux +
            "group by a.codigo_producto, a.precio_regulado, a.existencia, a.costo_anterior, a.costo, a.costo_penultima_compra, \n\
                    a.costo_ultima_compra, a.precio_venta_anterior, a.precio_venta, a.precio_minimo, a.precio_maximo, a.sw_vende, \n\
                    a.grupo_contratacion_id, a.nivel_autorizacion_id, b.sw_requiereautorizacion_despachospedidos, b.estado, \n\
                    b.sw_regulado, b.tipo_producto_id, b.unidad_id, b.codigo_invima, b.vencimiento_codigo_invima, b.codigo_cum, \n\
                    b.contenido_unidad_venta, b.sw_control_fecha_vencimiento, b.grupo_id, b.clase_id, b.subclase_id, b.porc_iva, \n\
                    b.tipo_producto_id, g.subclase_id, g.descripcion, i.existencia\n\
                order by 3 asc";


    G.db.paginated(sql, array_parametros, pagina, G.settings.limit, function(err, rows, result) {
        callback(err, rows);
    });

};

/**/

// ??????????????????????????????????????
//Consultar tipo de productos
ProductosModel.prototype.listar_tipo_productos = function(callback) {

    var sql = "select tipo_producto_id, descripcion from inv_tipo_producto";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

//??????????????????????????????????????????
ProductosModel.prototype.obtenerDescripcionProducto = function(codigo, callback) {

    var sql = "select fc_descripcion_producto($1) as descripcion_producto";

    G.db.query(sql, [codigo], function(err, rows, result) {
        callback(err, rows);
    });
};

//???????????????????????????????????????????
//Consultar precio de producto en contrato con un cliente
ProductosModel.prototype.consultar_precio_producto_contrato = function(codigo_producto, contrato_id, callback) {

    var sql = " select	a.contrato_cliente_id, a.codigo_producto, a.precio_pactado, a.descripcion\n\
                    from vnts_contratos_clientes a\
                        join vnts_contratos_clientes_productos b on a.contrato_cliente_id = b.contrato_cliente_id\
                    where a.tercero_id = '88244370'";

    G.db.query(sql, [codigo_producto, contrato_id], function(err, rows, result) {
        callback(err, rows);
    });
};


ProductosModel.prototype.consultarPrecioReguladoProducto = function(obj, callback) {
    

   var sql ="SELECT c.contrato_cliente_id,\
                    a.codigo_producto,\
                    a.precio_regulado,\
                    b.sw_regulado, \
                    c.empresa_id, \
                    COALESCE (d.precio_pactado,0) as precio_pactado, \
                    a.costo_ultima_compra\
            FROM inventarios a  INNER JOIN inventarios_productos b  \
            ON a.codigo_producto = b.codigo_producto \
            LEFT JOIN vnts_contratos_clientes c \
            ON c.empresa_id = a.empresa_id AND c.contrato_cliente_id = :3 \
            LEFT JOIN vnts_contratos_clientes_productos d \
            ON d.contrato_cliente_id = c.contrato_cliente_id AND d.codigo_producto = a.codigo_producto \
            WHERE a.empresa_id = :1 AND  b.codigo_producto = :2";

    G.knex.raw(sql, {1: obj.empresaId, 2: obj.codigoProducto, 3: obj.contratoId}). then(function(resultado){
   
        callback(false, resultado.rows);
    }).catch(function(err) {
    
        callback(err);
    });

};


module.exports = ProductosModel;