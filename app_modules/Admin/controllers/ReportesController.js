var Reportes1 = function(m_admin, job_temporales) {
    console.log("ingresa11->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    this.m_admin = m_admin;
    this.job_temporales = job_temporales;

};


Reportes1.prototype.obtenerConfiguracionReporte = function(req, res){
   var that = this;
   var args = req.body.data;
   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",args); 
//    var termino = {};
//    
//    if (args.autorizarProductos === undefined || args.autorizarProductos.estado === undefined || args.autorizarProductos.autorizacionId === undefined) {
//        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
//        return;
//    }
//
//    if (args.autorizarProductos.estado === '' || args.autorizarProductos.autorizacionId === '') {
//        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
//        return;
//    }
//    
//    termino.estado = args.autorizarProductos.estado;
//    termino.autorizacionId = args.autorizarProductos.autorizacionId;
//    termino.usuarioId = req.body.session.usuario_id;
//
//    G.Q.nfcall(that.m_autorizaciones.verificarAutorizacionProducto, termino).
//        then(function(verificarAutorizacionProductos) {
//        res.send(G.utils.r(req.url, 'Consultar Autorizacion de Productos Bloqueados ok!!!!', 200, {verificarAutorizacionProductos: verificarAutorizacionProductos}));
//    }).
//       fail(function(err) {
//       res.send(G.utils.r(req.url, 'Error al Consultar Autorizacion de Productos Bloqueados', 500, {verificarAutorizacionProducto: {}}));
//    }).
//       done();    
};


Reportes1.$inject = ["m_admin", "job_temporales"];

module.exports = Reportes1;