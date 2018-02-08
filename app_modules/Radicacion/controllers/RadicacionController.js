
/* global G */

var Radicacion = function(radicacion, m_usuarios) {
    this.m_radicacion = radicacion;
    this.m_usuarios = m_usuarios;
};

Radicacion.prototype.listarConcepto = function(req, res) {
     console.log("AA222");
    var that = this;
    var args = req.body.data;
    
    G.Q.ninvoke(that.m_radicacion, "listarConcepto").
        then(function(resultado) {
        res.send(G.utils.r(req.url, 'lista de concepto ok!!!!', 200, {listarConcepto: resultado}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error al listar concepto', 500, {listarConcepto: {}}));
    }).
       done();

};

Radicacion.prototype.guardarConcepto = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    
    
     if (args.nombre === undefined || args.nombre === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el nombre del concepto', 404, {}));
        return;
    }
    
     var obj = {nombre:args.nombre};
    
    G.Q.ninvoke(that.m_radicacion, "guardarConcepto",obj).
        then(function(resultado) {
        res.send(G.utils.r(req.url, 'guardar concepto ok!!!!', 200, {guardarConcepto: resultado}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error al guardar concepto', 500, {guardarConcepto: {error:err}}));
    }).
       done();
}   
/*
 * radicacion de factura
 */ 
Radicacion.prototype.factura = function(req, res) {
    console.log("AA");
    var that = this;
    var args = req.body.data;
    
    
     if (args.numeroFactura === undefined || args.numeroFactura === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el numero de la factura', 404, {}));
        return;
    }
    
     if (args.concepto_id === undefined || args.concepto_id === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar el proveedor', 404, {}));
        return;
    }
    
    if (args.sw_entregado === undefined || args.sw_entregado === ""){
        res.send(G.utils.r(req.url, 'Debe seleccionar si fue entregado o no', 404,{}));
        return;
    }
    
    if (args.bodega_id === undefined || args.bodega_id === ""){
        res.send(G.utils.r(req.url, 'Debe selecccionar la farmacia', 404, {}));
        return;
    }
    
    if (args.precio === undefined || args.precio === ""){
        res.send(G.utils.r(req.url, 'Debe digitar el precio', 404, {}));
        return;
    }
    
    if (args.fechaEntrega === undefined || args.fechaEntrega === ""){
        res.send(G.utils.r(req.url, 'Debe digitar la fecha de entrega', 404, {}));
        return;
    }
    
    if (args.ruta === undefined || args.ruta === ""){
        res.send(G.utils.r(req.url, 'Debe Digitar la ruta', 404, {}));
        return;
    } 
    
    
    if (args.fechaVencimiento === undefined || args.fechaVencimiento ===""){
        res.send(G.utils.r(req.url, 'Debe digitar la fecha de vencimiento',404, {}));
        return;
    }        
            
    
        var obj = {numeroFactura:args.numeroFactura,
         concepto_id:args.concepto_id,
         sw_entregado:args.sw_entregado,
         bodega_id:args.bodega_id,
         precio:args.precio,
         fechaEntrega:args.fechaEntrega,
         ruta:args.ruta,
         fechaVencimiento:args.fechaVencimiento};
     
    
    G.Q.ninvoke(that.m_radicacion, "Factura",obj).
        then(function(resultado) {
        res.send(G.utils.r(req.url, 'factura ok!!!!', 200, {Factura: resultado}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error de factura', 500, {Factura: {error:err}}));
    }).
       done();
   

};


Radicacion.$inject = [
                          "m_radicacion", 
                          "m_usuarios"
                         ];

module.exports = Radicacion;