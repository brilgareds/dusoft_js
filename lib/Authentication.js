
// Configurar La sesion del Usuario Cuando se Autentica
exports.set = function(usuario, callback) {

    var sesion_usuario = {};
    sesion_usuario.usuario_id = usuario.usuario_id;
    sesion_usuario.socket_id = usuario.socket;
    sesion_usuario.auth_token = G.random.randomKey(5, 8);
    sesion_usuario.device = usuario.device;

    var sql = "INSERT INTO system_usuarios_sesiones (usuario_id, socket_id, token, device) values ($1, $2, $3, $4);";

    G.db.query(sql, [sesion_usuario.usuario_id, sesion_usuario.socket_id, sesion_usuario.auth_token, sesion_usuario.device], function(err, rows, result) {
        callback(err, sesion_usuario);
    });

};

// Actualizar la Sesion del Usuario
exports.update = function(usuario, callback) {
    updateSession(usuario, callback);
};

// Obtener la sesion del usuario
exports.get = function(usuario_id, token, callback) {

    var sql = "select b.usuario, b.nombre, a.* from system_usuarios_sesiones a \
               inner join system_usuarios b on a.usuario_id = b.usuario_id \
               where a.usuario_id= $1 and a.token = $2";

    G.db.query(sql, [usuario_id, token], function(err, rows, result) {
        callback(err, rows);
    });
};

// Obtener las sesion del usuario
exports.getSessionsUser = function(usuario_id, callback) {

    getAllSessionsByUserId(usuario_id, function(err, rows) {
        callback(err, rows);
    });
};


// Selecciona el usuario a traves de usario y la contraseña
exports.login = function(usuario, contrasenia, callback) {

    var sql = "select * from system_usuarios where usuario = $1 and passwd= md5($2) and activo='1' ; ";

    G.db.query(sql, [usuario, contrasenia], function(err, rows, result) {
        callback(err, rows);
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

                        req.session.user = {
                            usuario_id: sesion.usuario_id,
                            auth_token: sesion.auth_token,
                            usuario:  rows[0].usuario || '',
                            nombre_usuario: rows[0].nombre || '',
                            email: '',
                            empresa: 0,
                            centro_utilidad: 0,
                            bodega: 0
                        };
                        console.log('================= validate ====================');
                        console.log(req.session.user);
                        console.log('=====================================');
                        updateSession(sesion);
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


// Cierra todas las sesiones incativas despues de un determiando tiempo
exports.closeInactiveSessions = function(callback) {

    var currentTime = new Date().getTime();

    console.log('=============== Inactivar Sessiones ==========');
    console.log(new Date());
    getAllSessions(function(err, sessions) {

        if (sessions !== undefined) {

            sessions.forEach(function(session) {

                var sessionTime = session.fecha_registro.getTime();
                var userTime = currentTime - sessionTime;
                var inactiveTime = userTime / (1000 * 60); // Minutos

                if (inactiveTime > G.settings.max_time_inactive_user) {
                    console.log('=============== Eliminando ==========');
                    closeSession(session.usuario_id, session.token, function(err, rows) {
                        callback(session);
                    });
                }
            });
        }
    });
};



// Verifica que el usuario este autenticado
function isAuthenticated(usuario_id, token, callback) {

    var sql = "select * from system_usuarios_sesiones a where a.usuario_id= $1 and token = $2 ;";

    G.db.query(sql, [usuario_id, token], function(err, rows, result) {
        if (err) {
            callback(err, false);
            return;
        }
        if (rows.length > 0) {
            callback(err, true);
            return;
        } else {
            callback(err, false);
            return;
        }
    });
}
;

// Elimina la session del usuario
function closeSession(usuario, token, callback) {

    console.log('================== Eliminando session =====================');
    var sql = "DELETE FROM system_usuarios_sesiones WHERE usuario_id=$1 and token=$2 ; ";

    G.db.query(sql, [usuario, token], function(err, rows, result) {
        callback(err, result);
    });
}
;

// Selecciona todas las sessiones de los usuarios
function getAllSessions(callback) {

    console.log('============= Selecciona todas las sessiones de los usuarios===========');

    var sql = "select * from system_usuarios_sesiones order by 1;";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });

}
;

// Selecciona todas las sessiones de un usuario a traves de un id
function getAllSessionsByUserId(usuario_id, callback) {

    var sql = "select id, usuario_id, socket_id, token, to_char(fecha_registro, 'YYYY-MM-DD') as fecha_registro, lock_screen, device \
               from system_usuarios_sesiones where usuario_id = $1 order by 1;";

    G.db.query(sql, [usuario_id], function(err, rows, result) {
        callback(err, rows);
    });

}
;

// Actualiza la session del usuario
function updateSession(usuario, callback) {

    var sql_aux = "";

    // Actualizar Socket
    if (usuario.socket_id)
        sql_aux = " , socket_id = '" + usuario.socket_id + "'";

    // Lock Screen
    if (usuario.lock_screen)
        sql_aux = " , lock_screen = '" + usuario.lock_screen + "'";

    var sql = "UPDATE system_usuarios_sesiones SET fecha_registro=now() " + sql_aux + " WHERE usuario_id= $1 AND token = $2";

    G.db.query(sql, [usuario.usuario_id, usuario.auth_token], function(err, rows, result) {

        if (callback)
            callback(err, rows);
    });

}
;






