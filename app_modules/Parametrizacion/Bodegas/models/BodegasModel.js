var EmpresasModel = function() {

};


EmpresasModel.prototype.listar_bodegas_empresa = function(empresa_id, centro_utilidad_id, callback) {


    var sql = "SELECT  bodega as bodega_id, descripcion FROM bodegas WHERE empresa_id = $1 AND centro_utilidad = $2 ; ";

    G.db.query(sql, [empresa_id, centro_utilidad_id], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = EmpresasModel;