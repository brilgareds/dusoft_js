var DocuemntoBodegaE008Logs = function(movientos_bodegas, m_pedidos_clientes, m_pedidos_farmacias) {

    this.m_movimientos_bodegas = movientos_bodegas;
    this.m_pedidos_clientes = m_pedidos_clientes;
    this.m_pedidos_farmacias = m_pedidos_farmacias;

};


DocuemntoBodegaE008Logs.prototype.ingresarLogsSincronizacionDespachos = function(obj, callback){

    var sql = " insert into logs_despachos_ws (tipo_pedido, numero_pedido, empresa_id, prefijo, numero, datos_envidos, datos_recibidos, tipo, error)\
            values ( :1, :2, :3, :4, :5, :6, :7, :8, :9 ) ; ";
    
    
    var resultado = (obj.tipo === '1') ? obj.resultadoDetalle : obj.resultadoEncabezado;
        
    var parametros = {
        1:(obj.tipoPedido === 1) ? "CL" : "FM", 
        2:obj.numeroPedido,
        3:obj.empresa, 
        4:obj.prefijoDocumento,
        5:obj.numeroDocumento,
        6:JSON.stringify(obj.parametros),
        7:JSON.stringify(resultado) || "",
        8:obj.tipo,
        9:(obj.error === true) ? '1' : '0'
    };
    
    
    var query = G.knex.raw(sql, parametros);
            
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        console.log("error en logs Duana ", err);
        callback(err);
    });
};


DocuemntoBodegaE008Logs.prototype.obtenerEncabezadoLog = function(obj, callback){

    var sql = " SELECT * FROM  logs_despachos_ws  WHERE  numero = :1 AND prefijo = :2 ; ";
    
    var parametros = { 
        1:obj.numeroDocumento,
        2:obj.prefijoDocumento
    };
    
    var query = G.knex.raw(sql, parametros);
            
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });
};

DocuemntoBodegaE008Logs.prototype.borrarLog = function(obj, callback){

    var sql = " DELETE FROM  logs_despachos_ws  WHERE  numero = :1 AND prefijo = :2 ; ";
    
    var parametros = { 
        1:obj.numeroDocumento,
        2:obj.prefijoDocumento
    };
    
    var query = G.knex.raw(sql, parametros);
            
    query.then(function(resultado){
        callback(false, resultado.rows);
    }).catch(function(err){
        callback(err);
    });
};




//DocuemntoBodegaE008Logs.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocuemntoBodegaE008Logs;