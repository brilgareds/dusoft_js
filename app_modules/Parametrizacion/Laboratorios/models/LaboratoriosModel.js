var LaboratoriosModel = function() {

};


LaboratoriosModel.prototype.listar_laboratorios = function(termino_busqueda, callback) {

    var sql = " SELECT laboratorio_id, descripcion AS descripcion_laboratorio FROM inv_laboratorios WHERE estado = '1'";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = LaboratoriosModel;