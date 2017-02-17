var AutorizacionesModel = function() {

};

/**
* @author Andres M Gonzalez
* +Descripcion inserta una nueva autorizacion en base a otra que se haya realizado con anterioridad
* @params obj: estado de la autorizacion - usuario que autoriza
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.insertarAutorizacionProductos = function(obj, callback) {

    var sql = "INSERT INTO \
               autorizaciones_productos_pedidos \
               (tipo_pedido,pedido_id,codigo_producto,estado,fecha_solicitud,fecha_verificacion,usuario_id,empresa_id)\
               SELECT 	\
               tipo_pedido,pedido_id,codigo_producto," + obj.estado + ",fecha_solicitud,now()," + obj.usuarioId + ",empresa_id\
               FROM\
               autorizaciones_productos_pedidos\
               WHERE autorizaciones_productos_pedidos_id = :1; ";
    var query = G.knex.raw(sql, {1: obj.autorizacionId});
    query.then(function(resultado) {
       callback(false, resultado.rows);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

/**
* @author Andres M Gonzalez
* +Descripcion modifica autorizacion
* @params obj: estado: estado de la verificacion, usuario:id, autorizacionId
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.modificarAutorizacionProductos = function(obj, callback) {
    
    var sql = " UPDATE \
                autorizaciones_productos_pedidos SET \
		estado = :1 ,fecha_verificacion=NOW(),usuario_id = :2	\
                WHERE autorizaciones_productos_pedidos_id = :3 ; ";
    
    var query = G.knex.raw(sql, {1: obj.estado, 2: obj.usuarioId, 3: obj.autorizacionId});

    query.then(function(resultado) {
        callback(false, resultado.rows);
    }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
    });
};

/**
* @author Andres M Gonzalez
* +Descripcion consulta todas las uatorizacioes no verificadas
* @params obj: autorizaciones_productos_pedidos_id
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.verificarAutorizacionProducto = function(obj, callback) {

    var sql = "SELECT * \
               FROM\n\
               autorizaciones_productos_pedidos\n\
               WHERE  usuario_id is null AND autorizaciones_productos_pedidos_id = :1 ;";
    G.knex.raw(sql, {1: obj.autorizacionId}).
     then(function(resultado) {
        callback(false, resultado.rows);
    }). 
        catch (function(err) {
        console.log("error sql",err);
        callback(err);
    });
};

/**
* @author Andres M Gonzalez
* +Descripcion consulta todas las autorizaciones que esten en estado 0
* @params obj: pedidoId
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.verificarPedidoAutorizado = function(obj, callback) {

    var sql = "SELECT * \
               FROM \
               autorizaciones_productos_pedidos \
               WHERE  estado = '0' AND pedido_id = :1 ;";
    G.knex.raw(sql, {1: obj}).then(function(resultado) {
        callback(false, resultado);
    }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
    });
};

/**
* @author Andres M Gonzalez
* +Descripcion consulta todas las autorizaciones
* @params obj: pedidoId
* @return : rows 
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.verificarNumeroAutorizaciones = function(obj, callback) {

    var sql = "select \
                codigo_producto,pedido_id, count(*) \
                from \
                autorizaciones_productos_pedidos \
                where \
                pedido_id = :1 \
                GROUP BY codigo_producto,pedido_id \
                HAVING count(*) > 1 \
                  ;";
    //console.log("verificarPedido >>>>>>>>>>>>>>",sql);
    G.knex.raw(sql, {1: obj.pedido_id}).then(function(resultado) {
        callback(false, resultado.rows);
    }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
    });
};

/**
* @author Andres M Gonzalez
* +Descripcion consulta todas las autorizaciones
* @params obj: pedidoId
* @return : rows 
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.verificarPedido = function(obj, callback) {

    var sql = "SELECT * \
               FROM \
               autorizaciones_productos_pedidos \
               WHERE pedido_id = :1 ;";
   // console.log("verificarPedido >>>>>>>>>>>>>>",sql);
    G.knex.raw(sql, {1: obj.pedido_id}).then(function(resultado) {
        callback(false, resultado.rows);
    }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
    });
};

/**
* @author Andres M Gonzalez
* +Descripcion modifica la farmacia y coloca el estado de los productos en 0-pendinte 
* @params obj: estado,usuario_id,empresa_id,pedido_id
* @return : rows 
* @fecha 2016-10-13
*/
AutorizacionesModel.prototype.modificaProductoDeAutorizaciones = function(obj, callback) {

    var sql = " UPDATE \
                autorizaciones_productos_pedidos SET \
		estado = :1 ,fecha_verificacion = null,usuario_id = null ,	\
		empresa_id = :2 	\
                WHERE pedido_id = :3 ; ";
     var query = G.knex.raw(sql, {1: obj.estado,2: obj.empresa_id, 3: obj.pedido_id});
    query.then(function(resultado) {
       callback(false, resultado.rows);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

/**
* @author Andres M Gonzalez
* +Descripcion elimina los productos de un pedido que tengan solo varios registros
* @params obj[]: pedidoId , codigo_producto, limit
* @fecha 2016-10-14
*/
AutorizacionesModel.prototype.eliminaProductosRepetidosAutorizados = function(obj, callback) {
    var sql ="";    
    obj.forEach(function (item) {
       //     console.log("QQQQQQQQQQQQQQQQQQ ",item);
                sql += " delete from autorizaciones_productos_pedidos \
                         where autorizaciones_productos_pedidos_id in ( \
                         select \
                         autorizaciones_productos_pedidos_id \
                         from \
                         autorizaciones_productos_pedidos \
                         where \
                         pedido_id = "+item.pedido_id+" and codigo_producto = '"+item.codigo_producto+"' limit "+(item.count-1)+" ); ";
//            console.log("222QQQQQQQQQQQQQQQQQQ ",sql);
          });
//console.log("33QQQQQQQQQQQQQQQQQQ ",sql);
     var query = G.knex.raw(sql);
    query.then(function(resultado) {
       callback(false, resultado.rows);
     }).catch (function(err) {
        callback(err);
     });
};
/**
* @author Andres M Gonzalez
* +Descripcion elimina los productos de la tabla autorizaciones_productos_pedidos 
* @params obj: pedidoId
* @fecha 2016-10-12
*/
AutorizacionesModel.prototype.eliminarProductoDeAutorizaciones = function(obj, callback) {

    var sql = " DELETE \
                 FROM \
                autorizaciones_productos_pedidos\
                WHERE pedido_id = :1 AND codigo_producto = :2 ; ";
     var query = G.knex.raw(sql, {1: obj.pedidoId,2: obj.codigoProducto});
    query.then(function(resultado) {
       callback(false, resultado.rows);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};
/**
* @author Andres M Gonzalez
* +Descripcion consulta todas las autorizaciones que esten en estado 0
* @params obj: pedidoId
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.verificarProductoAutorizadoFarmacia = function(obj, callback) {

    var sql = " select count(*) as numero_productos,sum(verifica) as numero_denegados,sum(verificaAll) as numero_pendientes \
                from ( \
                select(  select                 \
                         case when (a.estado = '0')  \
                         then 0   \
                         when (a.estado = '2')      \
                         then 1  else 0 end AS estado_verificado   \
                         FROM autorizaciones_productos_pedidos  AS a   \
                        where a.pedido_id = b.solicitud_prod_a_bod_ppal_id  AND a.codigo_producto = c.codigo_producto \
                        order by fecha_verificacion desc limit 1  ) as verifica,  \
                    (select                 \
                        case when (a.estado = '0')  \
                        then 1   \
                        else 0 end AS estado_verificado   \
                        FROM autorizaciones_productos_pedidos  AS a   \
                        where a.pedido_id = b.solicitud_prod_a_bod_ppal_id  AND a.codigo_producto = c.codigo_producto \
                        order by fecha_verificacion desc limit 1  ) as verificaAll  \
                from solicitud_productos_a_bodega_principal AS b      \
                INNER JOIN solicitud_productos_a_bodega_principal_detalle AS c ON (c.solicitud_prod_a_bod_ppal_id=b.solicitud_prod_a_bod_ppal_id)   \
                where b.solicitud_prod_a_bod_ppal_id = :1 \
                ) as d; ";
    G.knex.raw(sql, {1: obj}).then(function(resultado) {
        callback(false, resultado.rows);
    }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
    });
};
/**
* @author Andres M Gonzalez
* +Descripcion consulta todas las atorizaciones que esten en estado 0
* @params obj: pedidoId
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.verificarProductoAutorizadoCliente = function(obj, callback) {

    var sql = " select count(*) as numero_productos,sum(verifica) as numero_denegados,sum(verificaAll) as numero_pendientes \
                from ( \
                select  ( select                 \
                        case when (a.estado = '0')  \
                        then 0   \
                        when (a.estado='2')      \
                        then 1  else 0 end AS estado_verificado   \
                        FROM autorizaciones_productos_pedidos  AS a   \
                        where a.pedido_id = b.pedido_cliente_id  AND a.codigo_producto = c.codigo_producto \
                        order by fecha_verificacion desc limit 1  \
                      ) as verifica, \
                     ( select case when (a.estado = '0')\
                        then 1 else 0 end AS estado_verificado \
                        FROM autorizaciones_productos_pedidos  AS a   \
                	where a.pedido_id = b.pedido_cliente_id  \
                        AND a.codigo_producto = c.codigo_producto \
                	order by fecha_verificacion desc limit 1 \
                     ) as verificaAll \
                from ventas_ordenes_pedidos AS b      \
                INNER JOIN ventas_ordenes_pedidos_d AS c ON (c.pedido_cliente_id=b.pedido_cliente_id)   \
                where b.pedido_cliente_id = :1 \
                ) as d; ";
    G.knex.raw(sql, {1: obj}).then(function(resultado) {
        callback(false, resultado.rows);
    }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
    });
};

/**
* @author Andres M Gonzalez
* +Descripcion consulta todas los productos bloqueados de un pedido de clientes
* @params obj: pedidoId
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.listarProductosBloqueados = function(termino_busqueda, pagina, callback) {

    var parametros = {1: termino_busqueda.empresa, 2: termino_busqueda.tipo_pedido};
    var WHERE1 = '';
    var WHERE2 = '';
    
    if (termino_busqueda.termino !== '') {
        WHERE2 = " AND a.pedido_id =" + termino_busqueda.termino + " ";
        WHERE1 = " INNER JOIN (\
                               SELECT max(fecha_verificacion) AS fecha_verificacion,codigo_producto \
                               FROM  autorizaciones_productos_pedidos AS a \
                               WHERE true AND tipo_pedido= :2 AND a.pedido_id =" + termino_busqueda.termino + "  \
                               GROUP BY 2) AS t \
                           ON ((t.fecha_verificacion=a.fecha_verificacion AND t.codigo_producto=a.codigo_producto) or a.fecha_verificacion is null) ";
    }

    var SELECT = "";
    if (termino_busqueda.detalles === '0') {
        SELECT = " * from ( select DISTINCT  ON (a.pedido_id) a.pedido_id,";
    } else {
        SELECT = " * from ( select DISTINCT a.autorizaciones_productos_pedidos_id AS autorizaciones_productos_pedidos_id,";
    }

    var sql =  SELECT + " \
                        a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\
                        a.pedido_id,a.codigo_producto,d.numero_unidades,\
                        a.estado, case when a.estado='0' \
                        then 'Por Verificar' when (a.estado='1') \
                        then 'Aprobado' \
                        else 'Denegado' end AS estado_verificado, \
                        to_char(a.fecha_solicitud, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_solicitud,a.usuario_id AS usuario_verifica, \
                        to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_verificacion, \
                        a.usuario_id, \
                        a.empresa_id,fc_descripcion_producto(a.codigo_producto) AS descripcion_producto, \
                        c.nombre_tercero,e.nombre,f.estado as estado_productos, \
                        b.tipo_id_tercero,b.tercero_id, \
                            (SELECT count(pedido_id) \
                             FROM autorizaciones_productos_pedidos \
                             WHERE pedido_id = a.pedido_id AND \
                                   empresa_id=a.empresa_id AND \
                                   tipo_pedido=a.tipo_pedido AND estado = '0' ) AS poraprobacion \
                        FROM autorizaciones_productos_pedidos AS a \
                        " + WHERE1 + "\
                        INNER JOIN ventas_ordenes_pedidos AS b ON (a.pedido_id=b.pedido_cliente_id AND autorizaciones_productos_pedidos_id=autorizaciones_productos_pedidos_id)  \
                        INNER JOIN terceros AS c ON (b.tipo_id_tercero =c.tipo_id_tercero AND b.tercero_id=c.tercero_id) \
                        INNER JOIN ventas_ordenes_pedidos_d AS d ON (b.pedido_cliente_id=d.pedido_cliente_id AND a.codigo_producto=d.codigo_producto) \
                        LEFT  JOIN system_usuarios AS e ON (a.usuario_id=e.usuario_id) \
                        INNER JOIN inventarios_productos as f ON (f.codigo_producto=a.codigo_producto)   \
                        WHERE true  " + WHERE2 + "\
                               AND a.tipo_pedido = :2 \
                              ) as p \
                       order by p.estado_verificado desc";
    
   var query = G.knex.select(G.knex.raw(sql, parametros)).
    limit(G.settings.limit).
    offset((pagina - 1) * G.settings.limit).
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });   
};

/**
* @author Andres M Gonzalez
* +Descripcion consulta todas los productos bloqueados de un pedido de farmacia
* @params obj: tipo_Pedido, empresaId
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.listarProductosBloqueadosfarmacia = function(termino_busqueda, pagina, callback) {
    var WHERE1 = '';
    var WHERE2 = '';
    var SELECT = "";
    
    if (termino_busqueda.termino !== '') {
        WHERE2 = " AND a.pedido_id =" + termino_busqueda.termino + " ";
        WHERE1 = " INNER JOIN (\
                              SELECT max(fecha_verificacion) AS fecha_verificacion,codigo_producto \
                              FROM  autorizaciones_productos_pedidos AS a \
                              WHERE true AND tipo_pedido= :2 AND a.pedido_id =" + termino_busqueda.termino + "  \
                                GROUP BY 2) AS t \
                            ON ((t.fecha_verificacion=a.fecha_verificacion AND t.codigo_producto=a.codigo_producto) or a.fecha_verificacion is null) ";
    }

    
    if (termino_busqueda.detalles === '0') {
        SELECT = " * from ( select DISTINCT  ON (a.pedido_id) a.pedido_id,";
    } else {
        SELECT = " * from ( select DISTINCT a.autorizaciones_productos_pedidos_id AS autorizaciones_productos_pedidos_id,";
    }

   var sql =  SELECT + " \
                    a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\
                    a.pedido_id,a.codigo_producto,\
                    a.estado, case when a.estado='0' \
                    then 'Por Verificar' when (a.estado='1') \
                    then 'Aprobado' \
                    else 'Denegado' end AS estado_verificado, \
                    to_char(a.fecha_solicitud, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_solicitud,a.usuario_id AS usuario_verifica, \
                    to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_verificacion, \
                    a.usuario_id,f.estado as estado_productos, \
                    a.empresa_id,fc_descripcion_producto(a.codigo_producto) AS descripcion_producto,\
                    d.descripcion AS nombre_tercero, '' AS tipo_id_tercero, '' AS tercero_id,\
                        (SELECT count(pedido_id) \
                        FROM autorizaciones_productos_pedidos \
                        WHERE pedido_id = a.pedido_id AND \
                        empresa_id=a.empresa_id AND \
                        tipo_pedido=a.tipo_pedido AND estado = '0' ) AS poraprobacion,\
                   b.fecha_registro AS fechaPedido,c.cantidad_solic AS numero_unidades,e.nombre\n\
                   FROM autorizaciones_productos_pedidos  AS a \
                   " + WHERE1 + "\
                   INNER JOIN solicitud_productos_a_bodega_principal AS b ON (a.pedido_id=b.solicitud_prod_a_bod_ppal_id)\
                   INNER JOIN solicitud_productos_a_bodega_principal_detalle AS c ON (c.solicitud_prod_a_bod_ppal_id=b.solicitud_prod_a_bod_ppal_id and a.codigo_producto=c.codigo_producto)\
                   INNER JOIN bodegas AS d ON (b.farmacia_id=d.empresa_id AND b.centro_utilidad=d.centro_utilidad AND b.bodega=d.bodega)\
                   INNER JOIN inventarios_productos as f ON (f.codigo_producto=a.codigo_producto)   \
                   LEFT JOIN system_usuarios AS e ON (a.usuario_id=e.usuario_id)\
                   WHERE true  " + WHERE2 + " AND a.tipo_pedido = :2  ) as p \
               order by p.estado_verificado desc";
   var parametros =  {1: termino_busqueda.empresa, 2: termino_busqueda.tipo_pedido}; 
   var query = G.knex.select(G.knex.raw(sql, parametros)).
        limit(G.settings.limit).
        offset((pagina - 1) * G.settings.limit).
        then(function(resultado){
            callback(false, resultado);
        }).catch(function(err){
            console.log("error sql",err);
            callback(err);       
        });
};

/**
* @author Andres M. Gonzalez
* +Descripcion consulta todas los productos bloqueados de un pedido de farmacia
* @params obj: pedidoId, tipoPedido, empresaId, codigoProducto
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.listarVerificacionProductos = function(obj, pagina, callback) {
    var sql = "";
    var limite="";
    var offsett="";
    if(obj.estadoActual===true){
        limite=1;
        offsett=0;
    }else{
       limite=G.settings.limit;
       offsett=(pagina - 1) * G.settings.limit;
    }
    
    if (obj.tipoPedido === 0) {
        sql = " a.pedido_id,a.codigo_producto,fc_descripcion_producto(a.codigo_producto) AS descripcion_producto,\
                a.estado,a.autorizaciones_productos_pedidos_id,\
                case when a.estado='0'\
                    then 'Por Verificar' when (a.estado='1') \
                    then 'Aprobado'\
                    else 'Denegado' end AS estado_verificado,\
                to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_verificacion,\
                a.usuario_id,e.nombre,d.numero_unidades\n\
                FROM\n\
                    autorizaciones_productos_pedidos AS a\n\
                INNER JOIN ventas_ordenes_pedidos AS b ON (a.pedido_id=b.pedido_cliente_id)\
                INNER JOIN ventas_ordenes_pedidos_d AS d ON (b.pedido_cliente_id=d.pedido_cliente_id AND a.codigo_producto=d.codigo_producto)\
                LEFT JOIN system_usuarios AS e ON (a.usuario_id=e.usuario_id)\
                WHERE \
                 a.pedido_id = :1 AND a.tipo_pedido = :2 AND \
                  a.codigo_producto = :3 \
                 ORDER BY fecha_verificacion DESC \
                 ";
    } else {
        sql = " a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\
                a.pedido_id,a.codigo_producto,\
                a.estado, \
                case when a.estado='0' \
                    then 'Por Verificar' when (a.estado='1') \
                    then 'Aprobado' \
                    else 'Denegado' end AS estado_verificado, \
                to_char(a.fecha_solicitud, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_solicitud,a.usuario_id AS usuario_verifica, \
                to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_verificacion, \
                a.usuario_id, \
                a.empresa_id,fc_descripcion_producto(a.codigo_producto) AS descripcion_producto,\
                d.descripcion AS nombre_tercero, '' AS tipo_id_tercero, '' AS tercero_id,\
                (SELECT count(pedido_id) \
                    FROM autorizaciones_productos_pedidos \
                    WHERE pedido_id = a.pedido_id AND \
                         empresa_id=a.empresa_id AND \
                    tipo_pedido=a.tipo_pedido AND estado = '0' ) AS poraprobacion,\
                b.fecha_registro AS fechaPedido,c.cantidad_solic AS numero_unidades,e.nombre\n\
                FROM autorizaciones_productos_pedidos  AS a \
                INNER JOIN solicitud_productos_a_bodega_principal AS b ON (a.pedido_id=b.solicitud_prod_a_bod_ppal_id)\
                INNER JOIN solicitud_productos_a_bodega_principal_detalle AS c ON (c.solicitud_prod_a_bod_ppal_id=b.solicitud_prod_a_bod_ppal_id and a.codigo_producto=c.codigo_producto)\
                INNER JOIN bodegas AS d ON (b.farmacia_id=d.empresa_id AND b.centro_utilidad=d.centro_utilidad AND b.bodega=d.bodega)\
                LEFT JOIN system_usuarios AS e ON (a.usuario_id=e.usuario_id)\
                WHERE \
                    a.pedido_id = :1 AND a.tipo_pedido = :2  \
                    AND a.codigo_producto = :3 \
                    ORDER BY fecha_verificacion DESC \
                    ";
    }
    
   var parametros =  {1: obj.pedidoId, 2: obj.tipoPedido, 3: obj.codigoProducto}; 
   var query = G.knex.select(G.knex.raw(sql, parametros)).
        limit(limite).
        offset(offsett).
        then(function(resultado){  
         callback(false, resultado);
        }).catch(function(err){
          console.log("error sql",err);
          callback(err);
        });
};


module.exports = AutorizacionesModel;