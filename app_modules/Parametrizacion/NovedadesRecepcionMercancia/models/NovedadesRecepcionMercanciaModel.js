var NovedadesRecepcionMercanciaModel = function() {

};


NovedadesRecepcionMercanciaModel.prototype.listar_novedades_mercancia = function(termino_busqueda, callback) {


    var sql = " select a.id, a.codigo, a.descripcion, a.estado, a.fecha_registro from novedades_recepcion_mercancia a where a.estado='1' ; ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

NovedadesRecepcionMercanciaModel.prototype.consultar_novedad_mercancia = function(novedad_id, callback) {

    var sql = " select a.id, a.codigo, a.descripcion, a.estado, a.fecha_registro from novedades_recepcion_mercancia a where id = $1 and a.estado='1' ; ";

    G.db.query(sql, [novedad_id], function(err, rows, result) {
        callback(err, rows);
    });
};

NovedadesRecepcionMercanciaModel.prototype.insertar_novedad_mercancia = function(codigo, descripcion, usuario_id, callback) {

    var sql = " insert into novedades_recepcion_mercancia (codigo, descripcion, usuario_id)\
                values ($1, $2, $3) ; ";

    G.db.query(sql, [codigo, descripcion, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

NovedadesRecepcionMercanciaModel.prototype.actualizar_novedad_mercancia = function(novedad_id, descripcion, callback) {

    var sql = " update novedades_recepcion_mercancia set descripcion = $2 where id = $1 ; ";

    G.db.query(sql, [novedad_id, descripcion], function(err, rows, result) {
        callback(err, rows);
    });
};

NovedadesRecepcionMercanciaModel.prototype.inactivar_novedad_mercancia = function(novedad_id, callback) {

    var sql = " update novedades_recepcion_mercancia set estado = '0' where id = $1 ; ";

    G.db.query(sql, [novedad_id], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = NovedadesRecepcionMercanciaModel;