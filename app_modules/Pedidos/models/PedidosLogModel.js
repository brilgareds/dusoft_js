var PedidosLogModel = function(m_productos) {

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
        callback(false, resultado.rows, resultado);
    }).catch(function(err){
        callback(err);
    });

};


module.exports = PedidosLogModel;