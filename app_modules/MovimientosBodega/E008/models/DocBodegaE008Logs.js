var DocuemntoBodegaE008Logs = function(movientos_bodegas, m_pedidos_clientes, m_pedidos_farmacias) {

    this.m_movimientos_bodegas = movientos_bodegas;
    this.m_pedidos_clientes = m_pedidos_clientes;
    this.m_pedidos_farmacias = m_pedidos_farmacias;

};


DocuemntoBodegaE008Logs.prototype.ingresarLogsSincroniacionDespachos = function(obj, callback){

    var sql = " insert into logs_despachos_ws (tipo_pedido, numero_pedido, empresa_id, prefijo, numero, datos_envidos, datos_recibidos, tipo)\
            values ( :1, :2, :3, :4, :5, :6, :7, :8 ) ; ";
    
    
    var parametros = {
        1:(obj.tipoPedido === "1") ? "CL" : "FM", 
        2:obj.numeroPedido,
        3:obj.empresa, 
        4:obj.prefijoDocumento,
        5:obj.numeroDocumento,
        6:JSON.stringify(obj.parametros),
        7:JSON.stringify(obj.resultado),
        8:obj.tipo
    };
    
    
    var query = G.knex.raw(sql, parametros);
            
    console.log("insertando logs ", parametros);
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });
};




//DocuemntoBodegaE008Logs.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocuemntoBodegaE008Logs;