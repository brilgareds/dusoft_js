var UnidadesNegocioModel = function() {

};


UnidadesNegocioModel.prototype.listar_unidades_negocio = function(termino_busqueda, callback) {


    var sql = "SELECT codigo_unidad_negocio, descripcion, imagen FROM unidades_negocio where estado = '1'; ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = UnidadesNegocioModel;