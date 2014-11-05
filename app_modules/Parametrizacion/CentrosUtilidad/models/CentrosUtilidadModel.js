var EmpresasModel = function() {

};


EmpresasModel.prototype.listar_centros_utilidad_empresa = function(empresa_id, callback) {


    var sql = "SELECT centro_utilidad as centro_utilidad_id, descripcion FROM centros_utilidad WHERE  empresa_id = $1; ";

    G.db.query(sql,[empresa_id] , function(err, rows, result) {
        callback(err, rows, result);
    });
};

module.exports = EmpresasModel;