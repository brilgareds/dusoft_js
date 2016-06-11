var ReportesAdminModel = function(m_usuarios, m_modulos, m_rol, m_empresas,m_reportesAdmin) {

    this.m_usuarios = m_usuarios;
    this.m_modulos = m_modulos;
    this.m_rol = m_rol;
    this.m_empresas = m_empresas;
    this.m_reportesAdmin = m_reportesAdmin;
};

ReportesAdminModel.prototype.obtenerReportesAdmin = function(json, callback) {

   var query= G.knex.column(column)
               .select()
               .from('reporte_admin')             
               .then(function (rows) {
             callback(false, query.toSQL());
                   callback(false, rows);
               })
               .catch(function (error) {
                   callback(error);
               }).done();
     
};


ReportesAdminModel.$inject = ["m_usuarios", "m_modulo", "m_rol", "m_empresas","m_reportesAdmin"];


module.exports = ReportesAdminModel;