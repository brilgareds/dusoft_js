var PedidosLogModel = function() {

};

/*
 * @Author: Eduar
 * @param {Object} parametros {}
 * +Descripcion:Metodo que permite guarda logs de cambios en los productos de pedidos de clientes o farmacias, en caso de modificacion o eliminacion
 */
PedidosLogModel.prototype.guardarLog = function(parametros, callback) {
    
    var sql = " INSERT INTO logs_pedidos ( usuario_responsable, fecha, accion, tipo_pedido, pedido, empresa_id, codigo_producto, cantidad_solicitada, cantidad_actual )\
                VALUES( :1, :2, :3, :4, :5, :6, :7, :8, :9 );";
    
    var query = G.knex.raw(sql, {1:parametros.usuarioId, 2:'now()', 3:parametros.accion, 4:parametros.tipoPedido, 5:parametros.numeroPedido, 
                     6:parametros.empresaId, 7:parametros.codigoProducto, 8:parseInt(parametros.cantidadSolicitada), 9:parseInt(parametros.cantidadActual)});
    
    if(parametros.transaccion) query.transacting(parametros.transaccion);
    
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        callback(err);
    });

};



/*
 * @Author: Eduar
 * @param {Object} parametros {}
 * +Descripcion:Permite consultar las modificaciones o eliminaciones realizadas en los productos de determinaod pedido de clientes o farmacias
 */
PedidosLogModel.prototype.consultarLogs = function(parametros, callback) {
    
    var sql = " SELECT a.*, b.nombre, \
                CASE  WHEN a.codigo_producto != '0' THEN fc_descripcion_producto(a.codigo_producto) else 'N/A' END as descripcion_producto,\
                CASE  WHEN a.accion = '0' THEN 'Modificado' WHEN a.accion = '1' THEN 'Eliminado' else 'Pedido Anulado' END as descripcion_accion, \
                to_char(a.fecha, 'yyyy-mm-dd hh:mi:ss AM') as fecha_registro\
                FROM logs_pedidos as a\
                INNER JOIN system_usuarios b ON a.usuario_responsable = b.usuario_id\
                WHERE a.pedido = :1\
                AND a.tipo_pedido = :2\
                AND a.empresa_id = :3 ORDER BY a.codigo_producto, a.fecha ASC ";
    
    G.knex.raw(sql, {1:parametros.numeroPedido, 2:parametros.tipoPedido, 3:parametros.empresaId}).then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });

};


module.exports = PedidosLogModel;