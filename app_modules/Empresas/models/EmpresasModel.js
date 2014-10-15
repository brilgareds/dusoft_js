var EmpresasModel = function(centros_utilidad, bodegas) {

    this.m_centros_utilidad = centros_utilidad;
    this.m_bodegas = bodegas;
};


EmpresasModel.prototype.listar_empresas = function() {

    var that = this;
    var obj = {};

    var sql = "SELECT  empresa_id, razon_social FROM empresas WHERE sw_tipo_empresa= '0' AND sw_activa='1' ";

    G.db.query(sql, function(err, empresas, result) {

        empresas.forEach(function(empresa) {

            console.log('============');
            console.log(empresa);
            console.log('============');

            var empresa_id = empresa.empresa_id;

            that.m_centros_utilidad.listar_centros_utilidad_empresa(empresa_id, function(err, centros_utilidad) {

                empresa.centros_utilidad = centros_utilidad;

                centros_utilidad.forEach(function(centro_utilidad) {

                    var centro_utilidad_id = centro_utilidad.centro_utilidad_id;

                    that.m_bodegas.listar_bodegas_empresa(empresa_id, centro_utilidad_id, function(err, bodegas) {

                        centro_utilidad.bodegas = bodegas;

                        callback(err, rows);
                    });
                });
            });
        });
    });
};

EmpresasModel.$inject = ["m_centros_utilidad", "m_bodegas"];

module.exports = EmpresasModel;