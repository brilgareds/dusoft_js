var AutorizacionesModel = function() {

};

/**
* @author Andres M Gonzalez
* +Descripcion inserta una nueva autorizacion en base a otra que se haya realizado con anterioridad
* @params obj: estado de la autorizacion - usuario que autoriza
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.insertarAutorizacionProductos = function(obj, callback) {

    var sql = "INSERT INTO \n\
                 autorizaciones_productos_pedidos \n\
                 (tipo_pedido,pedido_id,codigo_producto,estado,fecha_solicitud,fecha_verificacion,usuario_id,empresa_id)\
                SELECT 	\n\
                 tipo_pedido,pedido_id,codigo_producto," + obj.estado + ",fecha_solicitud,now()," + obj.usuarioId + ",empresa_id\
                FROM\
                  autorizaciones_productos_pedidos\
                WHERE autorizaciones_productos_pedidos_id = :1; ";
    var query = G.knex.raw(sql, {1: obj.autorizacionId});
    query.then(function(resultado) {
       callback(false, resultado.rows);
     }). 
        catch (function(err) {
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

    var sql = " UPDATE \n\
                autorizaciones_productos_pedidos SET \n\
		estado = :1 ,fecha_verificacion=NOW(),usuario_id = :2	\
                WHERE autorizaciones_productos_pedidos_id = :3 ; ";
    
    var query = G.knex.raw(sql, {1: obj.estado, 2: obj.usuarioId, 3: obj.autorizacionId});

    query.then(function(resultado) {
        callback(false, resultado.rows);
    }). 
        catch (function(err) {
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

    var sql = "SELECT * \n\
                FROM\n\
                autorizaciones_productos_pedidos\n\
                WHERE  usuario_id is null AND autorizaciones_productos_pedidos_id = :1 ;";
    G.knex.raw(sql, {1: obj.autorizacionId}).
     then(function(resultado) {
        callback(false, resultado.rows);
    }). 
        catch (function(err) {
        callback(err);
    });
};

/**
* @author Andres M Gonzalez
* +Descripcion consulta todas las atorizacioes que esten en estado 0
* @params obj: pedidoId
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.verificarPedidoAutorizado = function(obj, callback) {

    var sql = "SELECT * \n\
                FROM\n\
                autorizaciones_productos_pedidos\n\
                WHERE  estado = '0' AND pedido_id = :1 ;";
    G.knex.raw(sql, {1: obj}).then(function(resultado) {
        callback(false, resultado);
    }). 
        catch (function(err) {
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
        WHERE1 = " INNER JOIN (\n\
                              SELECT max(fecha_verificacion) AS fecha_verificacion,codigo_producto \n\
                               FROM  autorizaciones_productos_pedidos AS a \n\
                              WHERE true AND tipo_pedido= :2 AND a.pedido_id =" + termino_busqueda.termino + "  \n\
                                GROUP BY 2) AS t \n\
                           ON ((t.fecha_verificacion=a.fecha_verificacion AND t.codigo_producto=a.codigo_producto) or a.fecha_verificacion is null) ";
    }

    var SELECT = "";
    if (termino_busqueda.detalles === '0') {
        SELECT = "DISTINCT  ON (a.pedido_id) a.pedido_id,";
    } else {
        SELECT = "DISTINCT a.autorizaciones_productos_pedidos_id AS autorizaciones_productos_pedidos_id,";
    }

    var sql =  SELECT + " \n\
                a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\n\
                a.pedido_id,a.codigo_producto,\n\
                a.estado, case when a.estado='0' \n\
                then 'Por Verificar' when (a.estado='1') \n\
                then 'Aprobado' \n\
                else 'Denegado' end AS estado_verificado, \n\
                to_char(a.fecha_solicitud, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_solicitud,a.usuario_id AS usuario_verifica, \n\
                to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_verificacion, \n\
                a.usuario_id, \n\
                a.empresa_id,fc_descripcion_producto(a.codigo_producto) AS descripcion_producto, \n\
                c.nombre_tercero, \n\
                b.tipo_id_tercero,b.tercero_id, \n\
                    (SELECT count(pedido_id) \n\
                     FROM autorizaciones_productos_pedidos \n\
                     WHERE pedido_id = a.pedido_id AND \n\
                           empresa_id=a.empresa_id AND \n\
                           tipo_pedido=a.tipo_pedido AND estado = '0' ) AS poraprobacion \n\
                FROM autorizaciones_productos_pedidos AS a \n\
                " + WHERE1 + "\
                INNER JOIN ventas_ordenes_pedidos AS b ON (a.pedido_id=b.pedido_cliente_id AND autorizaciones_productos_pedidos_id=autorizaciones_productos_pedidos_id)  \n\
                INNER JOIN terceros AS c ON (b.tipo_id_tercero =c.tipo_id_tercero AND b.tercero_id=c.tercero_id) \n\
                INNER JOIN ventas_ordenes_pedidos_d AS d ON (b.pedido_cliente_id=d.pedido_cliente_id AND a.codigo_producto=d.codigo_producto) \n\
                LEFT  JOIN system_usuarios AS e ON (a.usuario_id=e.usuario_id) \n\
                WHERE true  " + WHERE2 + "\n\
                      AND a.empresa_id = :1 AND a.tipo_pedido = :2 \n\
                      ";
     console.log("listarProductosBloqueados >>",sql);
     console.log("params >>",termino_busqueda);
   var query = G.knex.select(G.knex.raw(sql, parametros))
    .limit(G.settings.limit)
    .offset((pagina - 1) * G.settings.limit)
    .then(function(resultado){
        callback(false, resultado);
    }).
       catch(function(err){
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
        WHERE1 = " INNER JOIN (\n\
                              SELECT max(fecha_verificacion) AS fecha_verificacion,codigo_producto \n\
                              FROM  autorizaciones_productos_pedidos AS a \n\
                              WHERE true AND tipo_pedido= :2 AND a.pedido_id =" + termino_busqueda.termino + "  \n\
                                GROUP BY 2) AS t \n\
                            ON ((t.fecha_verificacion=a.fecha_verificacion AND t.codigo_producto=a.codigo_producto) or a.fecha_verificacion is null) ";
    }

    
    if (termino_busqueda.detalles === '0') {
        SELECT = "DISTINCT  ON (a.pedido_id) a.pedido_id,";
    } else {
        SELECT = "DISTINCT a.autorizaciones_productos_pedidos_id AS autorizaciones_productos_pedidos_id,";
    }

   var sql =  SELECT + " \n\
                    a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\n\
                    a.pedido_id,a.codigo_producto,\n\
                    a.estado, case when a.estado='0' \n\
                    then 'Por Verificar' when (a.estado='1') \n\
                    then 'Aprobado' \n\
                    else 'Denegado' end AS estado_verificado, \n\
                    to_char(a.fecha_solicitud, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_solicitud,a.usuario_id AS usuario_verifica, \n\
                    to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_verificacion, \n\
                    a.usuario_id, \n\
                    a.empresa_id,fc_descripcion_producto(a.codigo_producto) AS descripcion_producto,\n\
                    d.descripcion AS nombre_tercero, '' AS tipo_id_tercero, '' AS tercero_id,\n\
                        (SELECT count(pedido_id) \n\
                        FROM autorizaciones_productos_pedidos \n\
                        WHERE pedido_id = a.pedido_id AND \n\
                        empresa_id=a.empresa_id AND \n\
                        tipo_pedido=a.tipo_pedido AND estado = '0' ) AS poraprobacion,\n\
                   b.fecha_registro AS fechaPedido,c.cantidad_solic AS numero_unidades,e.nombre\n\
                   FROM autorizaciones_productos_pedidos  AS a \n\
                   " + WHERE1 + "\
                   INNER JOIN solicitud_productos_a_bodega_principal AS b ON (a.pedido_id=b.solicitud_prod_a_bod_ppal_id)\n\
                   INNER JOIN solicitud_productos_a_bodega_principal_detalle AS c ON (c.solicitud_prod_a_bod_ppal_id=b.solicitud_prod_a_bod_ppal_id)\n\
                   INNER JOIN bodegas AS d ON (b.farmacia_id=d.empresa_id AND b.centro_utilidad=d.centro_utilidad AND b.bodega=d.bodega)\n\
                   LEFT JOIN system_usuarios AS e ON (a.usuario_id=e.usuario_id)\n\
                   WHERE true  " + WHERE2 + " AND a.tipo_pedido = :2 ";
    console.log("listarProductosBloqueadosfarmacia >>",sql);
     console.log("params >>",termino_busqueda);
   var parametros =  {1: termino_busqueda.empresa, 2: termino_busqueda.tipo_pedido}; 
   var query = G.knex.select(G.knex.raw(sql, parametros))
    .limit(G.settings.limit)
    .offset((pagina - 1) * G.settings.limit)
    .then(function(resultado){
        callback(false, resultado);
    }).
        catch(function(err){
        callback(err);       
    });
};

/**
* @author Andres M Gonzalez
* +Descripcion consulta todas los productos bloqueados de un pedido de farmacia
* @params obj: pedidoId, tipoPedido, empresaId, codigoProducto
* @fecha 2016-05-25
*/
AutorizacionesModel.prototype.listarVerificacionProductos = function(obj, pagina, callback) {
    var sql = "";    
    if (obj.tipoPedido === 0) {
        sql = " a.pedido_id,a.codigo_producto,fc_descripcion_producto(a.codigo_producto) AS descripcion_producto,\n\
                a.estado,a.autorizaciones_productos_pedidos_id,\n\
                case when a.estado='0'\n\
                    then 'Por Verificar' when (a.estado='1') \n\
                    then 'Aprobado'\n\
                    else 'Denegado' end AS estado_verificado,\n\
                to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_verificacion,\n\
                a.usuario_id,e.nombre,d.numero_unidades\n\
                FROM\n\
                    autorizaciones_productos_pedidos AS a\n\
                INNER JOIN ventas_ordenes_pedidos AS b ON (a.pedido_id=b.pedido_cliente_id)\n\
                INNER JOIN ventas_ordenes_pedidos_d AS d ON (b.pedido_cliente_id=d.pedido_cliente_id AND a.codigo_producto=d.codigo_producto)\n\
                LEFT JOIN system_usuarios AS e ON (a.usuario_id=e.usuario_id)\n\
                WHERE \n\
                 a.pedido_id = :1 AND a.tipo_pedido = :2 AND \n\
                 a.empresa_id = :3 AND a.codigo_producto = :4 \n\
                 ORDER BY fecha_verificacion ASC";
    } else {
        sql = " a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\n\
                a.pedido_id,a.codigo_producto,\n\
                a.estado, \n\
                case when a.estado='0' \n\
                    then 'Por Verificar' when (a.estado='1') \n\
                    then 'Aprobado' \n\
                    else 'Denegado' end AS estado_verificado, \n\
                to_char(a.fecha_solicitud, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_solicitud,a.usuario_id AS usuario_verifica, \n\
                to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_verificacion, \n\
                a.usuario_id, \n\
                a.empresa_id,fc_descripcion_producto(a.codigo_producto) AS descripcion_producto,\n\
                d.descripcion AS nombre_tercero, '' AS tipo_id_tercero, '' AS tercero_id,\n\
                (SELECT count(pedido_id) \n\
                    FROM autorizaciones_productos_pedidos \n\
                    WHERE pedido_id = a.pedido_id AND \n\
                         empresa_id=a.empresa_id AND \n\
                    tipo_pedido=a.tipo_pedido AND estado = '0' ) AS poraprobacion,\n\
                b.fecha_registro AS fechaPedido,c.cantidad_solic AS numero_unidades,e.nombre\n\
                FROM autorizaciones_productos_pedidos  AS a \n\
                INNER JOIN solicitud_productos_a_bodega_principal AS b ON (a.pedido_id=b.solicitud_prod_a_bod_ppal_id)\n\
                INNER JOIN solicitud_productos_a_bodega_principal_detalle AS c ON (c.solicitud_prod_a_bod_ppal_id=b.solicitud_prod_a_bod_ppal_id)\n\
                INNER JOIN bodegas AS d ON (b.farmacia_id=d.empresa_id AND b.centro_utilidad=d.centro_utilidad AND b.bodega=d.bodega)\n\
                LEFT JOIN system_usuarios AS e ON (a.usuario_id=e.usuario_id)\n\
                WHERE \n\
                    a.pedido_id = :1 AND a.tipo_pedido = :2  \n\
                    AND a.codigo_producto = :4 \n\
                    ORDER BY fecha_verificacion ASC";
    }
    
   var parametros =  {1: obj.pedidoId, 2: obj.tipoPedido, 3: obj.empresaId, 4: obj.codigoProducto}; 
   var query = G.knex.select(G.knex.raw(sql, parametros))
    .limit(G.settings.limit)
    .offset((pagina - 1) * G.settings.limit)
    .then(function(resultado){  
     callback(false, resultado);
    }).
       catch(function(err){
        callback(err);
    });
};


module.exports = AutorizacionesModel;