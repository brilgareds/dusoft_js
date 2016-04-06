var ProductosModel = function() {


};

// Autor:      : Camilo Orozco 
// Descripcion : Validar si un producto existe o no en la base de datos
// Calls       : OrdenesCompra -> OrdenesCompraController -> ordenCompraArchivoPlano();
// 
ProductosModel.prototype.validar_producto = function(codigo_producto, callback) {

    var sql = " select a. *, fc_descripcion_producto(a.codigo_producto) as descripcion_producto from inventarios_productos a where a.codigo_producto = :1 ";
    
   G.knex.raw(sql, {1:codigo_producto}).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
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
               this.where(G.knex.raw("fc_descripcion_producto(b.codigo_producto)"), G.constants.db().LIKE,   "%"+termino +"%");
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
    limit(G.settings.limit).offset((pagina - 1) * G.settings.limit).then(function(rows){
        callback(false, rows);
    }).catch(function(err){
     
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


ProductosModel.prototype.validarUnidadMedidaProducto = function(obj, callback) {

    var sql = "select case when ( :1 % coalesce(unidad_medida, 1)) = 0 then '1' else '0' end as valido, unidad_medida from\
               inventarios_productos where codigo_producto = :2 ";
    
   G.knex.raw(sql, {1 : obj.cantidad, 2 : obj.codigo_producto}).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};
          
/*
* @Author: Eduar
* @param {string} empresaId
* @param {string} codigoProducto
* @param {string} centroUtilidad
* @param {string} bodega
* @param {object} filtro
* @param {function} callback
* +Descripcion: Permite consultar las existencias de lotes de un producto por empresa, bodega y centro de utilidad
*/
ProductosModel.prototype.consultar_existencias_producto = function(empresaId, codigoProducto, centroUtilidad, bodega, filtro, callback) {
    console.log("arguments ", arguments);
    var sqlAux = "";
    var obj = {1 : empresaId, 2 : codigoProducto, 3 :centroUtilidad, 4 :bodega};
    
    if(filtro.activos){
        sqlAux = "and a.existencia_actual > 0\
                  and a.estado = '1'\
                  and d.estado = '1'";
    }
    
    if(filtro.codigoLote && filtro.fechaVencimiento){
        sqlAux += "and a.lote = :5\
                   and a.fecha_vencimiento = :6 ";
        
        obj['5'] = filtro.codigoLote;
        obj['6'] = filtro.fechaVencimiento;
    }

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
                and a.codigo_producto = :2 " + sqlAux +
                "order by a.fecha_vencimiento desc ;";

    
   G.knex.raw(sql, obj).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};


/*
* @Author: Eduar
* @param {obj} params {empresaId, codigoProducto, centroUtilidad, bodega, fechaVencimiento, codigoLote}
* +Descripcion: Permite gestionar una existencia para determinado producto
*/
ProductosModel.prototype.guardarExistenciaBodega = function(params, callback) {
    var that = this;
    
    G.Q.ninvoke(that, "consultar_existencias_producto", params.empresaId, params.codigoProducto, params.centroUtilidad, params.bodega,
                                                       {fechaVencimiento:params.fechaVencimiento, codigoLote:params.codigoLote}).
                                                       
    then(function(existencia){
        if(existencia.length > 0){
           /// console.log("existencias ", existencia);
            //temporalmente regresar error
            callback(true);
            return;
        } else {
            return G.Q.ninvoke(that, 'insertarExistenciaBodega', params);
        }

    }).then(function(){
        callback(false);
        
    }).fail(function(err){
        callback(err);
    });
};

/*
* @Author: Eduar
* @param {obj} params {empresaId, codigoProducto, centroUtilidad, bodega, fechaVencimiento, codigoLote}
* +Descripcion: Permite insertar una existencia para determinado producto
*/
ProductosModel.prototype.insertarExistenciaBodega = function(params, callback) {
    var that = this;
    
    var sql = "INSERT INTO existencias_bodegas_lote_fv\
                    (empresa_id, centro_utilidad, codigo_producto, bodega, fecha_vencimiento, lote, existencia_inicial, existencia_actual)\
                    VALUES ( :1, :2, :3, :4, :5, :6, 0, 0 )";
                    
   G.knex.raw(sql, {1 : params.empresaId, 2 : params.centroUtilidad, 3:params.codigoProducto, 4:params.bodega, 
                    5:params.fechaVencimiento, 6:params.codigoLote}).
   then(function(resultado){
       callback(false, resultado);
   }).catch(function(err){
       callback(err);
   });
};


ProductosModel.prototype.consultarPrecioReguladoProducto = function(obj, callback) {
    

   var sql ="SELECT c.contrato_cliente_id,\
                    a.codigo_producto,\
                    a.precio_regulado,\
                    b.sw_regulado, \
                    c.empresa_id, \
                    COALESCE (d.precio_pactado,0) as precio_pactado, \
                    a.costo_ultima_compra,\
                    split_part(coalesce(fc_precio_producto_contrato_cliente( :3, a.codigo_producto, :1 ),'0'), '@', 1) as precio_producto\
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