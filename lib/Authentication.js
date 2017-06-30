function SessionUsuario(usuario){
    this.usuario_id = usuario.usuario_id;
    this.socket_id = usuario.socket || usuario.socket_id;
    this.auth_token = usuario.auth_token || G.random.randomKey(5, 8);
    this.device = usuario.device;
    this.usuario = usuario.usuario;
    this.appId = usuario.appId;
}




exports.SessionUsuario = SessionUsuario;

// Configurar La sesion del Usuario Cuando se Autentica
exports.set = function(usuario, callback) {
    
    var sesion_usuario = new SessionUsuario(usuario);
    var sql = "INSERT INTO system_usuarios_sesiones (usuario_id, socket_id, token, device, id_aplicacion) values ( :1, :2, :3, :4, :5 );";
    
    
    G.knex.columns(["id", "token"]).
    from("aplicaciones").
    where("token", sesion_usuario.appId).then(function(resultado){
        
        var appId = (resultado.length) > 0 ? resultado[0].id : 1;
        
        return G.knex.raw(sql, {
                                    1:sesion_usuario.usuario_id, 
                                    2:sesion_usuario.socket_id || "", 
                                    3:sesion_usuario.auth_token, 
                                    4:sesion_usuario.device,
                                    5:appId
                                });
    }).
    then(function(resultado){
       callback(false, sesion_usuario);
    }).catch(function(err){
       callback(err);
    });

};

exports.guardarRegistroConexion = function(usuario, callback) {
    
    G.knex("usuarios_auditoria_conexion").insert(
            {   
                usuario_id : usuario.usuario_id,
                ip : usuario.ip,
                app : "dusoft-web (v2)"
            }
    ).then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        callback(err);
    }).done();
    
};

// Actualizar la Sesion del Usuario
exports.update = function(usuario, callback) {
    updateSession(usuario, callback);
};

// Obtener la sesion del usuario
exports.get = function(usuario_id, token, callback) {

    var sql = "select b.usuario, b.nombre, a.* from system_usuarios_sesiones a \
               inner join system_usuarios b on a.usuario_id = b.usuario_id \
               where a.usuario_id= :1 and a.token = :2";
    
    G.knex.raw(sql, {1:usuario_id, 2:token}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       console.log("error generado >>>>>>>>>>>>>>>>>>>>>");
       callback(err);
    });
};

// Obtener las sesion del usuario
exports.getSessionsUser = function(usuario_id, callback) {

    getAllSessionsByUserId(usuario_id, function(err, rows) {
        callback(err, rows);
    });
};

exports.getSessionsUserByApp = function(parametros, callback) {
    console.log("argumentos >>>>>>>>>>>>>>> ", parametros);

    var sql = "select distinct on (a.token) a. *, to_char(a.fecha_registro, 'YYYY-MM-DD') as fecha_registro\
               from system_usuarios_sesiones a\
               inner join aplicaciones as b on a.id_aplicacion = b.id\
               where usuario_id = :1 and b.token = :2";
    
    G.knex.raw(sql, {1:parametros.usuario_id, 2:parametros.appId}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};


// Selecciona el usuario a traves de usario y la contraseña
exports.login = function(usuario, contrasenia, admin, callback) {
    
    var sqlAux = "";
    
    if(admin){
        sqlAux = " and sw_admin = '1'";
    }

    var sql = "select a.*, b.empresa_id from system_usuarios as a \
               inner join login_empresas as b on b.login_id = a.usuario_id and b.predeterminado = '1'\
               where a.usuario = :1 and a.passwd= md5( :2 ) and a.activo='1' "+sqlAux;

    G.knex.raw(sql, {1:usuario, 2:contrasenia}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

// Valida que el usuarios este autenticado
exports.validate = function() {
    return function(req, res, next) {

        if (!!req.url.match(/^(\/api\/)/)) {

            var sesion = req.body.session;

            // Validar si tiene sesion activa 
            isAuthenticated(sesion.usuario_id, sesion.auth_token, function(err, authenticated) {

                if (authenticated) {

                    G.auth.get(sesion.usuario_id, sesion.auth_token, function(err, rows) {
                        if(rows.length > 0){
                            
                            req.session.user = {
                                usuario_id: sesion.usuario_id,
                                auth_token: sesion.auth_token,
                                usuario:  rows[0].usuario || '',
                                nombre_usuario: rows[0].nombre || '',
                                email: '',
                                empresa: sesion.empresaId,
                                centro_utilidad: sesion.centroUtilidad,
                                bodega: sesion.bodega,
                                moduloActual:sesion.moduloActual
                            };
                            console.log('================= validate ====================');
                            console.log(req.session.user);
                            console.log('=====================================');
                            updateSessionDate(sesion, function(){
                                
                            });
                        }
                        next();
                    });
                }
                else {
                    res.send(G.utils.r(req.url, 'No esta Authenticado', 401, {}));
                }
            });
        } else {
            next();
        }
    };
};


// Cerrar Session actual del usuario
exports.logout = function(usuario, token, callback) {

    closeSession(usuario, token, function(err, rows) {
        callback(err, rows);
    });

};


exports.getAllSessions = function(callback){
    getAllSessions(function(err, rows){
        callback(false, rows);
    });
};

// Cierra todas las sesiones incativas despues de un determiando tiempo
exports.closeInactiveSessions = function(callback) {


    console.log('=============== Inactivar Sessiones ==========');
    getAllSessions(function(err, sessions) {

        if (sessions !== undefined) {

            sessions.forEach(function(session) {
                                
                var dif = G.moment().diff(session.fecha_registro, 'minutes');
                if (parseInt(dif) > parseInt(G.settings.max_time_inactive_user)) {
                    console.log('=============== Eliminando ========== inactivo hace', dif, "minutos max ",G.settings.max_time_inactive_user, " fecha session ", session.fecha_registro);
                    closeSession(session.usuario_id, session.token, function(err, rows) {
                        callback(session);
                    });
                }
            });
        }
    });
};


exports.obtenerConexionesActivas = function(params, callback) {
            
    var query = G.knex.columns(['a.usuario_id', 'a.token', G.knex.raw("to_char(a.fecha_registro, 'DD-MM-YYYY HH12:MI:SS AM') AS fecha_registro"), 'a.device']).from("system_usuarios_sesiones as a").
    innerJoin("system_usuarios as b", "a.usuario_id", "b.usuario_id").
    innerJoin("aplicaciones as c", "a.id_aplicacion", "c.id").
    groupBy("a.usuario_id", "a.token", "a.fecha_registro", "a.device").where("b.usuario", params.usuario).
    andWhere("c.token", params.appId).
    orderBy("a.fecha_registro", "desc").
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        callback(err);
    }).done();
};



// Verifica que el usuario este autenticado
function isAuthenticated(usuario_id, token, callback) {

    var sql = "select * from system_usuarios_sesiones a where a.usuario_id= :1 and token = :2 ;";
    
    G.knex.raw(sql, {1:usuario_id, 2:token}).
    then(function(resultado){
       if(resultado.rows.length > 0){
           callback(false, true);
       } else {
           callback(false, false);
       }

    }).catch(function(err){
       callback(err);
    });
};

// Elimina la session del usuario
function closeSession(usuario, token, callback) {

    //console.log('================== Eliminando session =====================');
    var sql = "DELETE FROM system_usuarios_sesiones WHERE usuario_id= :1 and token = :2 ; ";
    
    G.knex.raw(sql, {1:usuario, 2:token}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
    
    
};

// Selecciona todas las sessiones de los usuarios
function getAllSessions(callback) {

   // console.log('============= Selecciona todas las sessiones de los usuarios===========');

    var sql = "select * from system_usuarios_sesiones order by 1;";
    
    G.knex.raw(sql).
    then(function(resultado){
       callback(false, resultado.rows);
    }).catch(function(err){
       callback(err);
    });

};

// Selecciona todas las sessiones de un usuario a traves de un id
function getAllSessionsByUserId(usuario_id, callback) {

    var sql = "select id, usuario_id, socket_id, token, to_char(fecha_registro, 'YYYY-MM-DD') as fecha_registro, lock_screen, device \
               from system_usuarios_sesiones where usuario_id = :1 order by 1;";
    
    G.knex.raw(sql, {1:usuario_id}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });

};

// Actualiza la session del usuario
function updateSessionDate(usuario, callback) {

    var sql_aux = "";

    // Actualizar Socket
   /* if (usuario.socket_id)
        sql_aux = " , socket_id = '" + usuario.socket_id + "'";

    // Lock Screen
    if (usuario.lock_screen)
        sql_aux = " , lock_screen = '" + usuario.lock_screen + "'";*/

    var sql = "UPDATE system_usuarios_sesiones SET fecha_registro=now() " + sql_aux + " WHERE usuario_id= :1 AND token = :2";
    
    G.knex.raw(sql, {1:usuario.usuario_id, 2:usuario.auth_token}).
    then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){    
        console.log("error generando query >>>>>>>>>>>>>>>>>> ", err);
        callback(err);
    });

};

function updateSession(usuario, callback) {
    
    /*console.log("usuario ", usuario);
    
    // Actualizar Socket
    if (!usuario.socket_id || usuario.socket_id.length === 0){
        callback(false);
        return;
    }
    
    var sql_aux = "";
    var valorSocket  = usuario.socket_id;
    
    // Lock Screen
    if (usuario.lock_screen)
        sql_aux = " , lock_screen = '" + usuario.lock_screen + "'";

    var sql = "INSERT INTO system_usuarios_sesiones (fecha_registro, usuario_id, token, socket_id)  VALUES ( now(), :1 , :2, :3 )";
    
    G.knex.raw(sql, {1:usuario.usuario_id, 2:usuario.auth_token, 3:valorSocket}).
    then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).catch(function(err){    
        console.log("error generando query >>>>>>>>>>>>>>>>>> ", err);
        callback(err);
    });*/
    G.Q.nfcall(G.auth.set, usuario).then(function(resultado){
        callback(false, resultado.rows, resultado);
    }).fail(function(err){
        callback(err);
    });

};




