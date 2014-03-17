var UsuariosModel = function() {

};



// Lista los usuarios del sistema, permite buscar por nombre, login o descripcion
UsuariosModel.prototype.listar_usuarios_sistema = function(termino_busqueda, estado, callback) {

    // Estado = '' -> Todos
    // Estado = 1 -> Activos
    // Estado = 0 -> Inactivos


    var sql_aux = ";";
    if (estado !== '') {
        sql_aux = " and a.activo = '" + estado + "'";
    }

    var sql = "SELECT * FROM system_usuarios a where (a.usuario ilike $1 or a.nombre ilike $1 or a.descripcion ilike $1) " + sql_aux;

    G.db.query(sql, ["%" + termino_busqueda + "%"], function(err, rows, result) {
        callback(err, rows);
    });
};

// Selecciona un usuario por el ID
UsuariosModel.prototype.obtenerUsuarioPorId = function(usuario_id , callback) {

    var sql = "SELECT * FROM system_usuarios a where a.usuario_id = $1; " ;

    G.db.query(sql, [usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
};

// Selecciona un usuario por el login
UsuariosModel.prototype.obtenerUsuarioPorLogin = function(login , callback) {

    var sql = "SELECT * FROM system_usuarios a where a.usuario = $1; " ;

    G.db.query(sql, [login], function(err, rows, result) {
        callback(err, rows);
    });
};


UsuariosModel.prototype.cambiar_contrasenia = function(usuario, contrasenia, callback) {

    var sql = "UPDATE system_usuarios SET passwd=MD5($2) WHERE usuario = $1";

    G.db.query(sql, [usuario, contrasenia], function(err, rows, result) {
        callback(err, rows, result);
    });
};

module.exports = UsuariosModel;