var ReportesAdminModel = function(m_usuarios, m_modulos, m_rol, m_empresas) {

    this.m_usuarios = m_usuarios;
    this.m_modulos = m_modulos;
    this.m_rol = m_rol;
    this.m_empresas = m_empresas;
};

ReportesAdminModel.prototype.obtenerReportesAdmin = function(json, callback) {
   var column = [
                    "reporte_admin_id",
                    "nombre_reporte",
                    "cache_id",
                    "estado_cache",
                    "usuario_id",
                    "fecha_modificacion",
                    "hora_cache",
                    "id",
                    "estado",
                    "estructurajson"
                  ];
   var query= G.knex.column(column)
               .select()
               .from('reporte_admin')             
               .then(function (rows) {
            // callback(false, query.toSQL());
                   callback(false, rows);
               })
               .catch(function (error) {
           console.log(">>>>>>>>>",error);
                   callback(error);
               }).done();
     
};


ReportesAdminModel.$inject = ["m_usuarios", "m_modulo", "m_rol", "m_empresas"];


module.exports = ReportesAdminModel;