
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
    
Radicacion.prototype.factura = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    
    
     if (args.numeroFactura === undefined || args.numeroFactura === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el numero de la factura', 404, {}));
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

};


Radicacion.$inject = [
                          "m_radicacion", 
                          "m_usuarios"
                         ];

module.exports = Radicacion;