var AutenticacionModel = function() {

};

AutenticacionModel.prototype.guardarTokenPush = function(parametros, callback){
    G.knex("system_usuarios_sesiones").
    where('usuario_id', parametros.usuario_id).
    andWhere("token", parametros.token).
    update({
        device_id:parametros.device_id,
    }).then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        callback(err);       
    });
};


module.exports = AutenticacionModel;