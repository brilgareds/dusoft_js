
var ActasTecnicas = function(actasTecnicas) {
    this.m_actasTecnicas = actasTecnicas;
};

/**
* @author Andres M Gonzalez
* +Descripcion controlador que lista todos los pedidos de farmacia
* @params detalle: 1 lista el detalle de cada pedido 0: lista los pedidos que tengan bloqueos
* @fecha 2016-05-25
*/
ActasTecnicas.prototype.listarOrdenesParaActas = function(req, res) {
    var that = this;
    var args = req.body.data;
console.log("args-----------",args);
//    if (args.autorizaciones.pagina_actual === undefined) {
//        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
//        return;
//    }
    
    if (args.proveedores.terminoBusqueda === undefined && args.proveedores.codigoProveedor === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    var parametros={
       termino : args.proveedores.terminoBusqueda,
       codigoProveedor:args.proveedores.codigoProveedor
    };

    G.Q.ninvoke(that.m_actasTecnicas,'listarOrdenesParaActas',parametros).then(function(data) {
        
      res.send(G.utils.r(req.url, 'Listado de Ordenes para Actas Tecnica!!!!', 200, {listarOrdenesParaActas: data}));
      
    }).fail(function(err) {
        
      res.send(G.utils.r(req.url, 'Error Listado de Ordenes para Actas Tecnica', 500, {listarOrdenesParaActas: err}));
      
    }).
      done();

};
/**
* @author Andres M Gonzalez
* +Descripcion controlador que lista todos los pedidos de farmacia
* @params detalle: 1 lista el detalle de cada pedido 0: lista los pedidos que tengan bloqueos
* @fecha 2016-05-25
*/
ActasTecnicas.prototype.listarProductosParaActas = function(req, res) {
    var that = this;
    var args = req.body.data;
console.log("args-----------",args);
//    if (args.autorizaciones.pagina_actual === undefined) {
//        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
//        return;
//    }
    
    if (args.orden.ordenPedido === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    var parametros={
       ordenPedido : args.orden.ordenPedido
    };

    G.Q.ninvoke(that.m_actasTecnicas,'listarProductosParaActas',parametros).then(function(data) {
        
      res.send(G.utils.r(req.url, 'Listado de Productos para Actas Tecnica!!!!', 200, {listarProductosParaActas: data}));
      
    }).fail(function(err) {
        
      res.send(G.utils.r(req.url, 'Error Listado de Productos para Actas Tecnica', 500, {listarProductosParaActas: err}));
      
    }).
      done();

};


ActasTecnicas.$inject = [
                          "m_actasTecnicas"
                         ];

module.exports = ActasTecnicas;