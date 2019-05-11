var ProductosModel = function() {


};

// Autor:      : Camilo Orozco 
// Descripcion : Validar si un producto existe o no en la base de datos
// Calls       : OrdenesCompra -> OrdenesCompraController -> ordenCompraArchivoPlano();
//
ProductosModel.prototype.subeCosto_UpdateInventary = function(obj, callback) {
    var empresa_id = obj.empresa_id;
    var codigoBuscar = obj.producto_id;
    var nuevo_precio = obj.nuevo_precio;

    if (codigoBuscar != undefined && codigoBuscar != '') {
        codigoBuscar = codigoBuscar.toUpperCase();

        var queryUpdateCosto = G.knex('inventarios')
            .where('codigo_producto', '=', codigoBuscar)
            .andWhere('empresa_id', '=', empresa_id)
            .update({
                costo: nuevo_precio,
                costo_ultima_compra: nuevo_precio
            });
        // .orderBy('fecha_entrega', 'asc');

        queryUpdateCosto.then(function (resultado) {
            callback(false, resultado);
        }).catch(function (err) {
            console.log("err [listarAgrupar]:", err);
            callback(err);
        });
    }
};

ProductosModel.prototype.subeCosto_SelecInventario = function(obj, callback) {
    var empresa_id = obj.empresa_id;
    var codigoBuscar = obj.producto_id;

    if (codigoBuscar != undefined && codigoBuscar != '') {
        codigoBuscar = codigoBuscar.toUpperCase();

        var querySelecBeforeValues = G.knex.column(
            G.knex.raw("fc_descripcion_producto(codigo_producto) as descripcion"),
            'costo',
            'existencia')
            .select()
            .from("inventarios")
            .where('codigo_producto', '=', codigoBuscar)
            .andWhere('empresa_id', '=', empresa_id);
        // .orderBy('fecha_entrega', 'asc');
        //  console.log(G.sqlformatter.format(query.toString()));
        querySelecBeforeValues.then(function (resultado) {
            callback(false, resultado);
        }).catch(function (err) {
            console.log("err [listarAgrupar]:", err);
            callback(err);
        });
    }
};

ProductosModel.prototype.subeCosto_SelectBodDocNum = function(obj, callback) {
    var empresa_id = obj.empresa_id;
    var centro_id = obj.centro_id;
    var bodega_id = obj.bodega_id;

    var querySelecNumeracionDocumento = G.knex.column("numeracion")
        .select()
        .from("bodegas_doc_numeraciones")
        .where('empresa_id', '=', empresa_id)
        .andWhere('centro_utilidad', '=', centro_id)
        .andWhere('bodega', '=', bodega_id)
        .andWhere('tipo_doc_bodega_id', '=', obj.tipo_doc_general_id);

    querySelecNumeracionDocumento.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });
};

ProductosModel.prototype.subeCosto_InsertBodDocNum = function(obj, callback) {
    var empresa_id = obj.empresa_id;
    var centro_id = obj.centro_id;
    var bodega_id = obj.bodega_id;

    var querySelecNumeracionDocumento = G.knex.column("numeracion")
        .select()
        .from("bodegas_doc_numeraciones")
        .where('empresa_id', '=', empresa_id)
        .andWhere('centro_utilidad', '=', centro_id)
        .andWhere('bodega', '=', bodega_id)
        .andWhere('tipo_doc_bodega_id', '=', obj.tipo_doc_general_id);
    //console.log('Este es el SQL: ',G.sqlformatter.format(querySelecNumeracionDocumento.toString()));
    querySelecNumeracionDocumento.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });
};

ProductosModel.prototype.subeCosto_SelectDocuments = function(obj, callback) {
    var tipo_doc_general_id = obj.tipo_doc_general_id;
    var querySelecNumeracion = G.knex.column("numeracion", "documento_id", "prefijo")
        .from("documentos")
        .where('empresa_id', '=', obj.empresa_id)
        .andWhere('tipo_doc_general_id', '=', tipo_doc_general_id);
    //console.log('Este es el SQL: ',G.sqlformatter.format(querySelecNumeracion.toString()));
    querySelecNumeracion.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });
};

ProductosModel.prototype.subeCosto_UpdateDocumentos = function(obj, callback) {
    var queryUpdateNumeracion = G.knex('documentos')
        .where('empresa_id', '=', obj.empresa_id)
        .andWhere('tipo_doc_general_id', '=', obj.tipo_doc_general_id)
        .andWhere('documento_id', '=', obj.documento_id)
        .update({
            numeracion: obj.nueva_numeracion
        });
    queryUpdateNumeracion.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });
};

ProductosModel.prototype.subeCosto_UpdateUrlDocumento = function(obj, callback) {
    //console.log('Entro en funcion "subeCosto_UpdateUrlDocumento" con obj:', obj);
    var ajuste_precio_id = obj.ajuste_precio_id;
    var url_documento = obj.url_documento;

    var UpdateUrlDocumento = G.knex('inv_bodegas_ajuste_precio')
        .where('ajuste_precio_id', '=', ajuste_precio_id)
        .update({
            url_documento: url_documento
        });
    // .orderBy('fecha_entrega', 'asc');
    // console.log(G.sqlformatter.format(UpdateUrlDocumento.toString()));
    UpdateUrlDocumento.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });
};

ProductosModel.prototype.subeCosto_InsertInvBodAjusPrice = function(obj, callback) {
    var insertAjustePrecio = G.knex('inv_bodegas_ajuste_precio')
        .insert({
            documento_id: obj.documento_id,
            empresa_id: obj.empresa_id,
            producto_id: obj.producto_id,
            producto_cantidad: obj.producto_cantidad,
            costo_anterior: obj.anterior_precio,
            costo_asignado: obj.nuevo_precio,
            total_diferencia: obj.total_diferencia,
            justificacion: obj.justificacion,
            aprobacion: obj.aprobacion,
            fecha: obj.fecha_actual,
            usuario_id: obj.usuario_id
        }).returning('ajuste_precio_id');
    //console.log(G.sqlformatter.format(insertAjustePrecio.toString()));
    insertAjustePrecio.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });
};

ProductosModel.prototype.validar_producto = function(codigo_producto, callback) {
   var sql = " select a. *, fc_descripcion_producto(a.codigo_producto) as descripcion_producto from inventarios_productos a where a.codigo_producto = :1 ";
    
   G.knex.raw(sql, {1:codigo_producto}).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};

// Autor:      : German Galvis 
// Descripcion : Validar si un producto existe en la bodega
// 
ProductosModel.prototype.validar_producto_inventario = function(obj, callback) {

    var sql = " select a. * from inventarios a where a.codigo_producto = :1 and a.empresa_id = :2";
    
   G.knex.raw(sql, {1:obj.codigo_producto,2:obj.empresa_id}).
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

ProductosModel.prototype.consultar_stock_producto = function(empresa_id, bodega_id,  codigo_producto, filtro, callback) {
    
    var sqlAux = "";
    
    if(filtro.activo){
        sqlAux = " and c.estado = '1'";
    }

    if(filtro.validarBodega){
        sqlAux += " and a.centro_utilidad = '1' and a.bodega = '03' "
    }

    var sql = " select COALESCE(SUM(a.existencia::integer), 0) as existencia, c.estado from existencias_bodegas a\
                inner join inventarios b on a.codigo_producto = b.codigo_producto and a.empresa_id = b.empresa_id\
                inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                where a.empresa_id = :1  and a.codigo_producto = :2 and a.bodega = :3 and a.estado = '1'" +sqlAux +" group by 2";
    
   var query =  G.knex.raw(sql, {1 : empresa_id, 2 : codigo_producto, 3 : bodega_id});
    //G.logError(G.sqlformatter.format(query.toString()));
   query.then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};


ProductosModel.prototype.validarUnidadMedidaProducto = function(obj, callback) {

    var sql = "select case when ( :1 % coalesce(unidad_medida, 1)) = 0 then '1' else '0' end as valido, unidad_medida from\
               inventarios_productos where codigo_producto = :2 ";
   
   var query = G.knex.raw(sql, {1 : parseInt(obj.cantidad), 2 : obj.codigo_producto});
   query.then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};

ProductosModel.prototype.validarUnidadMedidaDescipcionProducto = function(obj, callback) {

    var sql = "select case when ( :1 % coalesce(unidad_medida, 1)) = 0 then '1' else '0' end as valido, unidad_medida,tipo_producto_id,fc_descripcion_producto(codigo_producto) as descripcion_producto  from\
               inventarios_productos where codigo_producto = :2 ";
   
   var query = G.knex.raw(sql, {1 : parseInt(obj.cantidad), 2 : obj.codigo_producto});
   query.then(function(resultado){
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
 
    var sqlAux = "";
    var obj = {1 : empresaId, 2 : codigoProducto, 3 :centroUtilidad, 4 :bodega};
    
    if(filtro.activos){
        sqlAux = "and a.existencia_actual > 0\
                  and a.estado = '1'";
        
        //El producto no ha sido autorizado
        if(filtro.estadoAprobacion !== '1'){
            sqlAux += "  and d.estado = '1'";
        }
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
                a.existencia_actual,\
                d.estado,\
                a.existencia_actual - (\
                	COALESCE(\
                	(  \
                            select sum(cantidad) from inv_bodegas_movimiento_tmp_d aa where aa.codigo_producto = a.codigo_producto \
			    and aa.lote = a.lote and aa.empresa_id = a.empresa_id and aa.centro_utilidad = a.centro_utilidad and aa.bodega = a.bodega\
                        ), 0)\
                ) as disponible\
                from existencias_bodegas_lote_fv a \
                inner join existencias_bodegas b on a.empresa_id = b.empresa_id and a.centro_utilidad = b.centro_utilidad and a.bodega = b.bodega and a.codigo_producto = b.codigo_producto and a.centro_utilidad = :3 and a.bodega= :4\
                inner join inventarios c on b.codigo_producto = c.codigo_producto and b.empresa_id = c.empresa_id\
                inner join inventarios_productos d on c.codigo_producto = d.codigo_producto\
                where a.empresa_id = :1 \
                and a.codigo_producto = :2 " + sqlAux +
                "order by a.existencia_actual desc, a.fecha_registro desc ;";

    
   var query = G.knex.raw(sql, obj);

    //G.logError(G.sqlformatter.format(query.toString()));
   query.then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};


/*
* @Author: Eduar
* @param {obj} 
* +Descripcion: Permite listar homologacion de productos
*/
ProductosModel.prototype.listarHomologacionProductos = function(params, callback){
    G.knex.column(["a.*", "b.torre"]).from("homologacion_medipol as a").
    innerJoin("param_torreproducto as b", function(){
        this.on("b.codigo_producto", "a.codigo_duana");
    }).
    where("b.empresa_id", params.empresa_id).
    andWhere(function(){
        this.where("a.codigo_medipol", G.constants.db().LIKE, "%" + params.termino_busqueda + "%").
        orWhere("a.descripcion_medipol",  G.constants.db().LIKE, "%" + params.termino_busqueda + "%").
        orWhere("a.codigo_duana", G.constants.db().LIKE, "%" + params.termino_busqueda + "%").
        orWhere(G.knex.raw("a.descripcion_duana"), G.constants.db().LIKE, "%" + params.termino_busqueda + "%"); 
    }).
    limit(G.settings.limit).
    offset((params.pagina - 1) * G.settings.limit).
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        callback(err);
    }).done();
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
* @param {obj} params {empresaId, codigoProducto, centroUtilidad, bodega, existencias}
* @Uso ProductosController
* +Descripcion: Permite actualziar las existencias para determinado producto
*/
ProductosModel.prototype.actualizarExistenciasProducto = function(params, callback){
    
    var that = this;
    params.contexto = that;
    
    G.knex.transaction(function(transaccion) {  
        params.transaccion = transaccion;
        G.Q.nfcall(__validarExistenciasProducto, params).then(function(){
           return G.Q.nfcall(__actualizarExistenciasProducto, params);  
        }).then(function(){
            //callback(false);
            transaccion.commit();
        }).fail(function(err){
           console.log("error al actualizar existencias ", err);
           transaccion.rollback(err);
        });
    }).
    then(function(){
        callback(false);
    }).catch(function(err){
        callback(err);
    }).
    done();    
    
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


/*
* @Author: Eduar
* @param {obj} params {empresaId, codigoProducto, centroUtilidad, bodega, existencias}
* +Descripcion: Valida que la cantidad de existencias en bodega sea igual a la existencia de lotes
*/
function __validarExistenciasProducto(params, callback){
    var existencias = params.existencias;
    
    var totalExistencias = 0;
    //Lotes enviados por la app del cliente
    for(var i in existencias){
        var cantidadNueva = parseInt(existencias[i].cantidadNueva);
        
        if(isNaN(cantidadNueva)){
           existencias[i].cantidadNueva = 0;
           cantidadNueva = 0;
        }
        totalExistencias += cantidadNueva;
    }
    //empresa_id, , bodega, centro_utilidad, codigo_producto, filtro, callback
    G.Q.ninvoke(params.contexto, "consultar_stock_producto_kardex", params.empresaId, params.bodega, params.centroUtilidad, params.codigoProducto, {activo:false, validarBodega:true}).
    then(function(resultado){
        
        //Se valida que las cantidades sean numericas y sean iguales
        if(parseInt(resultado[0].existencia) !== totalExistencias || isNaN(totalExistencias) || isNaN(resultado[0].existencia)){
             throw {msj:"La cantidad total no es valida", status:403};
        } else {
            callback(false);
        }
        
    }).fail(function(err){
        callback(err);
    });
}


// Autor:      : Ernesto Suarez 
// Descripcion : Consultar stock producto o existencias empresa de un producto
// Calls       : __validarExistenciasProducto

ProductosModel.prototype.consultar_stock_producto_kardex = function(empresa_id, bodega, centro_utilidad, codigo_producto, filtro, callback) {
    
    var sql = " select COALESCE(SUM(a.existencia::integer), 0) as existencia, c.estado from existencias_bodegas a\
                inner join inventarios b on a.codigo_producto = b.codigo_producto and a.empresa_id = b.empresa_id\
                inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                where a.empresa_id = :1  and a.codigo_producto = :2 and a.estado = '1' and a.centro_utilidad = :3 and a.bodega = :4  group by 2";
    
   G.knex.raw(sql, {1 : empresa_id, 2 : codigo_producto, 3 : centro_utilidad, 4 : bodega}).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
};


// Autor:      : Andres Mauricio Gonzalez
// Descripcion : Buscar producto para codificacion
//  
ProductosModel.prototype.buscarProductosCodificacion = function(parametros, callback) {

    var campos = [ 
        G.knex.raw("case when f.descripcion is null then '-- NO SE USA EN TRATAMIENTOS ESPECIALES --' else f.descripcion end as descripcion_tratamiento"), 
        G.knex.raw("a.descripcion||'-'||prod.cod_anatofarmacologico as descripcion_cod_anatofarmacologico"),
        G.knex.raw("b.descripcion||'-'||b.unidad_id as descripcion_unidad"),
        "b.unidad_id as abreviatura_unidad",
        "c.descripcion as descripcion_med_cod",
        G.knex.raw("'' as unidad_dosificacion"),
        G.knex.raw("'2' as sw_dosificacion"), //"prod.cod_adm_presenta as sw_dosificacion",
        "grp.grupo_id",
        "grp.descripcion as descripcion_grupo",
        "mol.sw_medicamento",
        "cla.clase_id",
        "cla.descripcion as descripcion_clase",
        "cla.sw_tipo_empresa",
        "sub.descripcion as descripcion_subclase",
        "mol.molecula_id",      
        "sub.subclase_id",
        "prod.descripcion",
        "prod.descripcion_abreviada",
        "prod.codigo_cum",
        "prod.codigo_alterno",
        "prod.codigo_barras",
        "prod.fabricante_id",
        "prod.sw_pos",
        "prod.cod_acuerdo228_id",
        "prod.unidad_id",
        "prod.contenido_unidad_venta as cantidad",
        "prod.cod_anatofarmacologico",
        "prod.mensaje_id",
        "prod.codigo_mindefensa",
        "prod.codigo_invima",
        G.knex.raw("to_char(prod.vencimiento_codigo_invima, 'YYYY-MM-DD') AS vencimiento_codigo_invima"),
        "prod.porc_iva",
        "prod.sw_generico",
        "prod.sw_venta_directa",
        "prod.tipo_pais_id",
        "prod.tipo_producto_id",
        "prod.presentacioncomercial_id",
        "prod.cantidad as cantidad_p",
        "prod.tratamiento_id",//-- NO SE USA EN TRATAMIENTOS ESPECIALES --
        G.knex.raw("'2' as usuario_id"),
        "prod.cod_adm_presenta as cod_presenta",
        "prod.dci_id",
        G.knex.raw("case when prod.estado_unico=1 then '1' else '0' end as estado_unico"),
        "prod.sw_solicita_autorizacion",
        "prod.codigo_producto", 
        "prod.rips_no_pos",
        "prod.tipo_riesgo_id",
        "prod.tipo_pais_id as tipo_pais_titular_reginvima_id",
        "tri.descripcion as descripcion_titular_reginvima",
        "prod.titular_reginvima_id",
        "prod.estado_invima" ,   
        "prod.cod_forma_farmacologica as descripcion_medida_medicamento",  
        G.knex.raw("'' as descripcion_principio_activo"),  
        "med.sw_fotosensible",  
        "prod.cantidad as concentracion",
        "mol.molecula_id as cod_principio_activo",
        "prod.cod_adm_presenta AS cod_concentracion",
        "med.sw_liquidos_electrolitos",
        "med.sw_manejo_luz",
        "med.sw_uso_controlado",
        "med.sw_antibiotico",
        "med.sw_refrigerado",
        "med.sw_alimento_parenteral",
        "med.sw_alimento_enteral",
        "med.dias_previos_vencimiento",
        "med.sw_farmacovigilancia",
        "med.descripcion_alerta",
     ];
    
                          
    var query = G.knex.column(campos).distinct().
    from("inv_grupos_inventarios as grp").
    innerJoin("inventarios_productos as prod", "prod.grupo_id","grp.grupo_id").
    innerJoin("inv_subclases_inventarios as sub", function(){
         this.on("sub.subclase_id", "prod.subclase_id" ).
         on("sub.clase_id", "prod.clase_id").
         on("sub.grupo_id", "prod.grupo_id");
    }).
    innerJoin("inv_titulares_reginvima as tri", "prod.titular_reginvima_id","tri.titular_reginvima_id").
    innerJoin("inv_fabricantes as fab", "prod.fabricante_id","fab.fabricante_id").    
    innerJoin("inv_clases_inventarios as cla", function(){
         this.on("sub.clase_id", "cla.clase_id" ).
         on("cla.grupo_id", "prod.grupo_id");
    }).
    innerJoin("inv_laboratorios as lab", "lab.laboratorio_id","cla.laboratorio_id").          
    innerJoin("inv_med_cod_anatofarmacologico as a", "a.cod_anatomofarmacologico","prod.cod_anatofarmacologico").          
    innerJoin("unidades as b", "b.unidad_id","prod.unidad_id").          
    innerJoin("inv_presentacioncomercial as c", "c.presentacioncomercial_id","prod.presentacioncomercial_id").         
    innerJoin("medicamentos as med", "med.codigo_medicamento","prod.codigo_producto").         
    leftJoin("hc_formulacion_factor_conversion as d", "d.codigo_producto","prod.codigo_producto").      
    leftJoin("inv_tratamientos_productos as f", "f.tratamiento_id","prod.tratamiento_id").      
    innerJoin("inv_moleculas as mol",function(){
        this.on( "mol.molecula_id","sub.molecula_id")
            .on( G.knex.raw("mol.estado='1'"));
    }). 
    where(function(){
        this.where("prod.codigo_producto",parametros.codigoProducto);
    });
  
    query.then(function(rows){
        callback(false, rows);
    }).catch(function(err){
        callback(err);
    });
};



/*
* @Author: Eduar
* @param {obj} params {empresaId, codigoProducto, centroUtilidad, bodega, existencias}
* +Descripcion: Funcion recursiva que ejecua el query para actualizar existencias
*/
function __actualizarExistenciasProducto(params, callback){
    var existencia = params.existencias[0];
    
    if(!existencia){
        callback(false);
        return;
    }

    var sql = "UPDATE existencias_bodegas_lote_fv SET\
                    lote = :1, existencia_actual = :2 \
                    WHERE empresa_id = :3 AND centro_utilidad = :4 AND codigo_producto = :5 AND bodega = :6 AND\
                    lote = :7 AND fecha_vencimiento = :8";
    
   var query = G.knex.raw(sql, {1 : existencia.codigoLoteNuevo || existencia.codigo_lote, 2 : existencia.cantidadNueva, 3:params.empresaId, 4:params.centroUtilidad, 
                                5:params.codigoProducto, 6:params.bodega, 7:existencia.codigoLote || existencia.codigo_lote, 8:existencia.fechaVencimiento || existencia.fecha_vencimiento});
   
   if(params.transaccion) query.transacting(params.transaccion);                   
   
    query.then(function(resultado){
       
       setTimeout(function(){
           params.existencias.splice(0, 1);
           __actualizarExistenciasProducto(params, callback);
       },0);
       
   }).catch(function(err){
       callback(err);
   });
    
}



module.exports = ProductosModel;