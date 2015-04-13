var TransportadorasModel = function() {

};


TransportadorasModel.prototype.listar_transportadoras = function(termino_busqueda, callback) {


    var sql = " select a.transportadora_id as id, a.descripcion, a.placa_vehiculo as placa, a.estado from inv_transportadoras a ; ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = TransportadorasModel;