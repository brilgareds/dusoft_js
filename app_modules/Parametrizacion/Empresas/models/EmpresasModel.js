var EmpresasModel = function(centros_utilidad, bodegas) {

    this.m_centros_utilidad = centros_utilidad;
    this.m_bodegas = bodegas;
};


EmpresasModel.prototype.listar_empresas = function(callback) {

    var sql = " SELECT  empresa_id, razon_social FROM empresas WHERE sw_tipo_empresa= '0' AND sw_activa='1' ";

    G.db.query(sql, function(err, empresas, result) {
        callback(err, empresas, result);
    });
};

//lista las empresas y el estado en modulos_empresas en caso de estar presente
EmpresasModel.prototype.listar_empresas_modulos = function(modulo_id, callback) {

    var sql = "SELECT  a.empresa_id, a.razon_social, COALESCE(b.estado, '0') as estado, b.id as modulos_empresas_id\
               FROM empresas a\
               LEFT JOIN  modulos_empresas b on b.empresa_id = a.empresa_id and b.modulo_id = $1\
               WHERE a.sw_tipo_empresa= '0' AND a.sw_activa='1'";

    G.db.query(sql,[modulo_id], function(err, empresas, result) {
        callback(err, empresas, result);
    });
};

EmpresasModel.$inject = ["m_centros_utilidad", "m_bodegas"];

module.exports = EmpresasModel;