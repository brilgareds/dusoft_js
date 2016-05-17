var AutorizacionesModel = function() {

};

AutorizacionesModel.prototype.listarProductosBloqueados = function(termino_busqueda, pagina, callback) {

    var offset = G.settings.limit * pagina;
    var where = '';
    var inner = '';
    if (termino_busqueda.termino !== '') {
        //  where = " a.pedido_id = " + termino_busqueda.termino + " and ";
    }

    if (termino_busqueda.tipo_pedido === '0') {
        inner = " INNER JOIN  ON (" + termino_busqueda.termino + ") ";
    }

    var sql = "SELECT\n\
               DISTINCT  on (a.pedido_id) a.pedido_id,\n\
                    a.autorizaciones_productos_pedidos_id,a.tipo_pedido,\n\
                    a.pedido_id,a.codigo_producto,\n\
                    a.estado, case when a.estado='0' \n\
                    then 'Por Verificar' when (a.estado='1') \n\
                    then 'Aprobado' \n\
                    else 'Denegado' end as estado_verificado,\n\
                    a.fecha_solicitud,\n\
                    a.fecha_verificacion,a.usuario_id,\n\
                    a.empresa_id,fc_descripcion_producto(a.codigo_producto) as descripcion_producto,\n\
                    c.nombre_tercero,\n\
                    b.tipo_id_tercero,b.tercero_id,\n\
                    (select count(pedido_id) \n\
                     from autorizaciones_productos_pedidos \n\
                     where pedido_id = a.pedido_id and \n\
                     empresa_id=a.empresa_id and \n\
                     tipo_pedido=a.tipo_pedido and estado = '0' ) as poraprobacion,\n\
                     b.fecha_registro as fechaPedido,d.numero_unidades,e.nombre\n\
                 FROM autorizaciones_productos_pedidos as a\n\
                    INNER JOIN ventas_ordenes_pedidos as b on (a.pedido_id=b.pedido_cliente_id)\n\
                    INNER JOIN terceros AS c on (b.tipo_id_tercero =c.tipo_id_tercero and b.tercero_id=c.tercero_id)\n\
                    INNER JOIN ventas_ordenes_pedidos_d AS d ON (b.pedido_cliente_id=d.pedido_cliente_id \n\
                            AND a.codigo_producto=d.codigo_producto)\n\
                    LEFT JOIN system_usuarios as e ON (a.usuario_id=e.usuario_id)\n\
                 WHERE true and " + where + "\n\
                    a.empresa_id = :1 and a.tipo_pedido = :2 \n\
                  ";//  limit :3 offset :4

    G.knex.raw(sql, {1: termino_busqueda.empresa, 2: termino_busqueda.tipo_pedido}).//, 3: G.settings.limit, 4: offset
            then(function(resultado) {
        callback(false, resultado.rows, resultado);
    }). catch (function(err) {
        callback(err);
    });
};


module.exports = AutorizacionesModel;