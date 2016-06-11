var ReportesAdmin = function(m_reportesAdmin, job_temporales) {
    this.m_reportesAdmin = m_reportesAdmin;
    this.job_temporales = job_temporales;
};


ReportesAdmin.prototype.obtenerConfiguracionReporte = function(req, res){
   var that = this;
   var args = req.body.data;
   
G.Q.nfcall(that.m_reportesAdmin.obtenerReportesAdmin, termino).
        then(function(verificarAutorizacionProductos) {
        res.send(G.utils.r(req.url, 'Consultar Autorizacion de Productos Bloqueados ok!!!!', 200, {verificarAutorizacionProductos: verificarAutorizacionProductos}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error al Consultar Autorizacion de Productos Bloqueados', 500, {verificarAutorizacionProducto: {}}));
    }).
       done();    
};


ReportesAdmin.$inject = ["m_reportesAdmin", "job_temporales"];

module.exports = ReportesAdmin;