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

EmpresasModel.$inject = ["m_centros_utilidad", "m_bodegas"];

module.exports = EmpresasModel;