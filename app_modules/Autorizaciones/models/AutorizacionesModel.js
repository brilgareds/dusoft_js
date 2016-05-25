var AutorizacionesModel = function() {

};


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
    }). catch (function(err) {
        callback(err);
    });
};

AutorizacionesModel.prototype.modificarAutorizacionProductos = function(obj, callback) {

    var sql = " UPDATE \n\
                autorizaciones_productos_pedidos SET \n\
		estado = :1 ,fecha_verificacion=NOW(),usuario_id = :2	\
                WHERE autorizaciones_productos_pedidos_id = :3 ; ";
    
    var query = G.knex.raw(sql, {1: obj.estado, 2: obj.usuarioId, 3: obj.autorizacionId});

    query.then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        callback(err);
    });
};

AutorizacionesModel.prototype.verificarAutorizacionProducto = function(obj, callback) {

    var sql = "SELECT * \n\
                FROM\n\
                autorizaciones_productos_pedidos\n\
                WHERE  usuario_id is null and autorizaciones_productos_pedidos_id = :1 ;";
    G.knex.raw(sql, {1: obj.autorizacionId}).//, 3: G.settings.limit, 4: offset
            then(function(resultado) {

        callback(false, resultado.rows);
    }). catch (function(err) {

        callback(err);
    });
};

AutorizacionesModel.prototype.listarProductosBloqueados = function(termino_busqueda, pagina, callback) {

    var offset = G.settings.limit * pagina;
    var where = '';
    var inner = '';
    var join = '';
    if (termino_busqueda.termino !== '') {
        where = " and a.pedido_id =" + termino_busqueda.termino + " ";
    }

    var select = "";
    if (termino_busqueda.detalles === '0') {
        select = "DISTINCT  on (a.pedido_id) a.pedido_id,";
//        join = "autorizaciones_productos_pedidos as a ";
    } else {
        select = "DISTINCT a.autorizaciones_productos_pedidos_id as autorizaciones_productos_pedidos_id,";
//        join = " (SELECT DISTINCT  on (codigo_producto) codigo_producto,  max(fecha_verificacion) as fecha_verificacion, " +
//                " autorizaciones_productos_pedidos_id,	tipo_pedido,estado,	fecha_solicitud,usuario_id,empresa_id,pedido_id " +
//                " FROM autorizaciones_productos_pedidos as a " +
//                " WHERE true and a.pedido_id = " + termino_busqueda.termino +
//                " GROUP BY 1,3,4,5,6,7,8,9) AS a ";
    }

    sql = " SELECT  " + select + " \n\
                    a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\n\
                    a.pedido_id,a.codigo_producto,\n\
                    a.estado, case when a.estado='0' \n\
                    then 'Por Verificar' when (a.estado='1') \n\
                    then 'Aprobado' \n\
                    else 'Denegado' end as estado_verificado, \n\
                    to_char(a.fecha_solicitud, 'DD-MM-YYYY HH12:MI:SS AM') as fecha_solicitud,a.usuario_id as usuario_verifica, \n\
                    to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') as fecha_verificacion, \n\
                    a.usuario_id, \n\
                    a.empresa_id,fc_descripcion_producto(a.codigo_producto) as descripcion_producto, \n\
                    c.nombre_tercero, \n\
                    b.tipo_id_tercero,b.tercero_id, \n\
                    (select count(pedido_id) \n\
                     from autorizaciones_productos_pedidos \n\
                     where pedido_id = a.pedido_id and \n\
                     empresa_id=a.empresa_id and \n\
                     tipo_pedido=a.tipo_pedido and estado = '0' ) as poraprobacion, \n\
                     b.fecha_registro as fechaPedido,d.numero_unidades,e.nombre \n\
                      FROM autorizaciones_productos_pedidos as a \n\
                      inner join (SELECT max(fecha_verificacion) as fecha_verificacion,codigo_producto \n\
                      FROM  autorizaciones_productos_pedidos as a \n\
                                WHERE true and tipo_pedido= :2 " + where + "\n\
                                GROUP BY 2) as t on ((t.fecha_verificacion=a.fecha_verificacion and t.codigo_producto=a.codigo_producto) or a.fecha_verificacion is null)\n\
                    INNER JOIN ventas_ordenes_pedidos as b on (a.pedido_id=b.pedido_cliente_id and autorizaciones_productos_pedidos_id=autorizaciones_productos_pedidos_id)  \n\
                    INNER JOIN terceros AS c on (b.tipo_id_tercero =c.tipo_id_tercero and b.tercero_id=c.tercero_id) \n\
                    INNER JOIN ventas_ordenes_pedidos_d AS d ON (b.pedido_cliente_id=d.pedido_cliente_id \n\
                            AND a.codigo_producto=d.codigo_producto) \n\
                    LEFT JOIN system_usuarios as e ON (a.usuario_id=e.usuario_id) \n\
                     WHERE true  " + where + "\n\
                     and a.empresa_id = :1 and a.tipo_pedido = :2 \n\
                 --order by b.tipo_id_tercero,b.tercero_id,a.tipo_pedido \n\
                    ";//  limit :3 offset :4

    console.log("--------------", sql);
    console.log("--------------", termino_busqueda);
    G.knex.raw(sql, {1: termino_busqueda.empresa, 2: termino_busqueda.tipo_pedido}).//, 3: G.settings.limit, 4: offset
            then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        callback(err);
    });
};

AutorizacionesModel.prototype.listarProductosBloqueadosfarmacia = function(termino_busqueda, pagina, callback) {

    var offset = G.settings.limit * pagina;
    var where = '';
    var inner = '';
    var join = '';
    if (termino_busqueda.termino !== '') {
        where = " and a.pedido_id =" + termino_busqueda.termino + " ";
    }

    var select = "";
    if (termino_busqueda.detalles === '0') {
        select = "DISTINCT  on (a.pedido_id) a.pedido_id,";
//        join = "autorizaciones_productos_pedidos as a ";
    } else {
        select = "DISTINCT a.autorizaciones_productos_pedidos_id as autorizaciones_productos_pedidos_id,";
//        join = " (SELECT DISTINCT  on (codigo_producto) codigo_producto,  max(fecha_verificacion) as fecha_verificacion, " +
//                " autorizaciones_productos_pedidos_id,	tipo_pedido,estado,	fecha_solicitud,usuario_id,empresa_id,pedido_id " +
//                " FROM autorizaciones_productos_pedidos as a " +
//                " WHERE true and a.pedido_id = " + termino_busqueda.termino +
//                " GROUP BY 1,3,4,5,6,7,8,9) AS a ";
    }

    sql = "select " + select + " \n\
                    a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\n\
                    a.pedido_id,a.codigo_producto,\n\
                    a.estado, case when a.estado='0' \n\
                    then 'Por Verificar' when (a.estado='1') \n\
                    then 'Aprobado' \n\
                    else 'Denegado' end as estado_verificado, \n\
                    to_char(a.fecha_solicitud, 'DD-MM-YYYY HH12:MI:SS AM') as fecha_solicitud,a.usuario_id as usuario_verifica, \n\
                    to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') as fecha_verificacion, \n\
                    a.usuario_id, \n\
                    a.empresa_id,fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\n\
                    d.descripcion as nombre_tercero, '' as tipo_id_tercero, '' as tercero_id,\n\
                    (select count(pedido_id) \n\
                    from autorizaciones_productos_pedidos \n\
                    where pedido_id = a.pedido_id and \n\
                    empresa_id=a.empresa_id and \n\
                   tipo_pedido=a.tipo_pedido and estado = '0' ) as poraprobacion,b.fecha_registro as fechaPedido,c.cantidad_solic as numero_unidades,e.nombre\n\
               from autorizaciones_productos_pedidos  as a \n\
                   inner join (SELECT max(fecha_verificacion) as fecha_verificacion,codigo_producto\n\
                                                   FROM  autorizaciones_productos_pedidos as a\n\
                                                   WHERE true and tipo_pedido= :2 " + where + "\n\
                                                   GROUP BY 2) as t on ((t.fecha_verificacion=a.fecha_verificacion and t.codigo_producto=a.codigo_producto) or a.fecha_verificacion is null)\n\
                   inner join solicitud_productos_a_bodega_principal as b on (a.pedido_id=b.solicitud_prod_a_bod_ppal_id)\n\
                   inner join solicitud_productos_a_bodega_principal_detalle as c on (c.solicitud_prod_a_bod_ppal_id=b.solicitud_prod_a_bod_ppal_id)\n\
                   inner join bodegas as d on (b.farmacia_id=d.empresa_id and b.centro_utilidad=d.centro_utilidad and b.bodega=d.bodega)\n\
                   LEFT JOIN system_usuarios as e ON (a.usuario_id=e.usuario_id)\n\
                   where true  " + where + " and a.tipo_pedido = :2 ";
//                   where true  " + where + " and a.empresa_id = :1 and a.tipo_pedido = :2 ";
    console.log("--------------", sql);
    console.log("--------------", termino_busqueda);
    G.knex.raw(sql, {1: termino_busqueda.empresa, 2: termino_busqueda.tipo_pedido}).//, 3: G.settings.limit, 4: offset
            then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        callback(err);
    });
};


AutorizacionesModel.prototype.listarVerificacionProductos = function(obj, callback) {
    console.log(" listarVerificacionProductos >>>>>>>>>>>>>>>>>>>>>>> ", obj);
    var sql = "";
    if (obj.tipoPedido === 0) {
        sql = "SELECT a.pedido_id,a.codigo_producto,fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\n\
                        a.estado,a.autorizaciones_productos_pedidos_id,\n\
                        case when a.estado='0'\n\
                         then 'Por Verificar' when (a.estado='1') \n\
                         then 'Aprobado'\n\
                         else 'Denegado' end as estado_verificado,\n\
                        to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') as fecha_verificacion,\n\
                        a.usuario_id,e.nombre,d.numero_unidades\n\
                        FROM\n\
                        autorizaciones_productos_pedidos as a\n\
                        INNER JOIN ventas_ordenes_pedidos as b on (a.pedido_id=b.pedido_cliente_id)\n\
                        INNER JOIN ventas_ordenes_pedidos_d AS d ON (b.pedido_cliente_id=d.pedido_cliente_id AND a.codigo_producto=d.codigo_producto)\n\
                        LEFT JOIN system_usuarios as e ON (a.usuario_id=e.usuario_id)\n\
                        WHERE \n\
                            a.pedido_id = :1 AND a.tipo_pedido = :2 AND \n\
                            a.empresa_id = :3 AND a.codigo_producto = :4 \n\
                            ORDER BY fecha_verificacion ASC";
    } else {
        sql = "SELECT \n\
                        a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\n\
                        a.pedido_id,a.codigo_producto,\n\
                        a.estado, case when a.estado='0' \n\
                        then 'Por Verificar' when (a.estado='1') \n\
                        then 'Aprobado' \n\
                        else 'Denegado' end as estado_verificado, \n\
                        to_char(a.fecha_solicitud, 'DD-MM-YYYY HH12:MI:SS AM') as fecha_solicitud,a.usuario_id as usuario_verifica, \n\
                        to_char(a.fecha_verificacion, 'DD-MM-YYYY HH12:MI:SS AM') as fecha_verificacion, \n\
                        a.usuario_id, \n\
                        a.empresa_id,fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\n\
                        d.descripcion as nombre_tercero, '' as tipo_id_tercero, '' as tercero_id,\n\
                        (select count(pedido_id) \n\
                        from autorizaciones_productos_pedidos \n\
                        where pedido_id = a.pedido_id and \n\
                        empresa_id=a.empresa_id and \n\
                       tipo_pedido=a.tipo_pedido and estado = '0' ) as poraprobacion,b.fecha_registro as fechaPedido,c.cantidad_solic as numero_unidades,e.nombre\n\
                FROM autorizaciones_productos_pedidos  as a \n\
                INNER JOIN solicitud_productos_a_bodega_principal as b on (a.pedido_id=b.solicitud_prod_a_bod_ppal_id)\n\
                INNER JOIN solicitud_productos_a_bodega_principal_detalle as c on (c.solicitud_prod_a_bod_ppal_id=b.solicitud_prod_a_bod_ppal_id)\n\
                INNER JOIN bodegas as d on (b.farmacia_id=d.empresa_id and b.centro_utilidad=d.centro_utilidad and b.bodega=d.bodega)\n\
                LEFT JOIN system_usuarios as e ON (a.usuario_id=e.usuario_id)\n\
                WHERE \n\
                    a.pedido_id = :1 AND a.tipo_pedido = :2  \n\
                    AND a.codigo_producto = :4 \n\
                    ORDER BY fecha_verificacion ASC";// AND a.empresa_id = :3
    }
    console.log(" listarVerificacionProductos >>>>>>>>>>>>>> ", sql);
    G.knex.raw(sql, {1: obj.pedidoId, 2: obj.tipoPedido, 3: obj.empresaId, 4: obj.codigoProducto}).
            then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        callback(err);
    });
};


module.exports = AutorizacionesModel;