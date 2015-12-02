var TransportadorasModel = function() {

};


TransportadorasModel.prototype.listar_transportadoras = function(termino_busqueda, callback) {


    var sql = " select \
                a.transportadora_id as id, \
                a.descripcion, \
                a.placa_vehiculo as placa, \
                COALESCE(a.sw_solicitar_guia,'') as sw_solicitar_guia, \
                a.estado \
                from inv_transportadoras a where a.estado=  '1' ; ";
    
    G.knex.raw(sql).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

TransportadorasModel.prototype.consultar_transportadora = function(transportadora_id, callback) {


    var sql = " select \
                a.transportadora_id as id, \
                a.descripcion, \
                a.placa_vehiculo as placa, \
                COALESCE(a.sw_solicitar_guia,'') as sw_solicitar_guia, \
                a.estado \
                from inv_transportadoras a where a.transportadora_id = :1 and a.estado= '1' ; ";
    
    G.knex.raw(sql, {1:transportadora_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

TransportadorasModel.prototype.insertar_transportadora = function(descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio, estado, usuario_id, callback) {


    var sql = " insert into inv_transportadoras (descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio, estado, usuario_id)\
                values ( :1, :2, :3, :4, :5, :6 ) ;";

    G.knex.raw(sql, {1:descripcion, 2:placa_vehiculo, 3:sw_solicitar_guia, 4:sw_carropropio, 5:estado, 6:usuario_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};


TransportadorasModel.prototype.actualizar_transportadora = function(transportadora_id, descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio, callback) {

    var sql = " update inv_transportadoras set descripcion = :2, placa_vehiculo = :3, sw_solicitar_guia = :4, sw_carropropio = :5 where transportadora_id = :1 ;";
    
    G.knex.raw(sql, {1:transportadora_id, 2:descripcion, 3:placa_vehiculo, 4:sw_solicitar_guia, 5:sw_carropropio}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

TransportadorasModel.prototype.inactivar_transportadora = function(transportadora_id, callback) {

    var sql = " update inv_transportadoras set estado = '0' where transportadora_id = :1 ;";
    
    G.knex.raw(sql, {1:transportadora_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
};

module.exports = TransportadorasModel;