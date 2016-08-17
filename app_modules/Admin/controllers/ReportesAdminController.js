var ReportesAdmin = function(m_reportesAdmin) {
    this.m_reportesAdmin = m_reportesAdmin;
};


ReportesAdmin.prototype.obtenerConfiguracionReporte = function(req, res){
   var that = this;
   var args = req.body.data;
   var termino={};
G.Q.nfcall(that.m_reportesAdmin.obtenerReportesAdmin, termino).
        then(function(obtenerReportesAdmin) {
    console.log(">>>>>>>",obtenerReportesAdmin);
        res.send(G.utils.r(req.url, 'Consultar Configuracion Reportes ok!!!!', 200, {obtenerReportesAdmin: obtenerReportesAdmin}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error al Consultar Configuracion Reportes', 500, {obtenerReportesAdmin: {}}));
    }).
       done();    
};


ReportesAdmin.$inject = ["m_reportesAdmin"];

module.exports = ReportesAdmin;