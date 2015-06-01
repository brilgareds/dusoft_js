var TransportadorasModel = function() {

};


TransportadorasModel.prototype.listar_transportadoras = function(termino_busqueda, callback) {


    var sql = " select \
                a.transportadora_id as id, \
                a.descripcion, \
                a.placa_vehiculo as placa, \
                COALESCE(a.sw_solicitar_guia,'') as sw_solicitar_guia, \
                a.estado \
                from inv_transportadoras a where a.estado='1' ; ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

TransportadorasModel.prototype.consultar_transportadora = function(transportadora_id, callback) {


    var sql = " select \
                a.transportadora_id as id, \
                a.descripcion, \
                a.placa_vehiculo as placa, \
                COALESCE(a.sw_solicitar_guia,'') as sw_solicitar_guia, \
                a.estado \
                from inv_transportadoras a where a.transportadora_id = $1 and a.estado='1' ; ";

    G.db.query(sql, [transportadora_id], function(err, rows, result) {
        callback(err, rows);
    });
};

TransportadorasModel.prototype.insertar_transportadora = function(descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio, estado, usuario_id, callback) {


    var sql = " insert into inv_transportadoras (descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio, estado, usuario_id)\
                values ($1, $2, $3, $4, $5, $6) ;";

    G.db.query(sql, [descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio, estado, usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};


TransportadorasModel.prototype.actualizar_transportadora = function(transportadora_id, descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio, callback) {


    var sql = " update inv_transportadoras set descripcion = $2, placa_vehiculo = $3, sw_solicitar_guia = $4, sw_carropropio = $5 where transportadora_id = $1 ;";

    G.db.query(sql, [transportadora_id, descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio], function(err, rows, result) {
        callback(err, rows);
    });
};

TransportadorasModel.prototype.inactivar_transportadora = function(transportadora_id, callback) {


    var sql = " update inv_transportadoras set estado = '0' where transportadora_id = $1 ;";

    G.db.query(sql, [transportadora_id], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = TransportadorasModel;