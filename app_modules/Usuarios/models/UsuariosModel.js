var UsuariosModel = function() {

};



// Lista los usuarios del sistema, permite buscar por nombre, login o descripcion
UsuariosModel.prototype.listar_usuarios_sistema = function(termino_busqueda, estado, pagina, callback) {

    // Estado = '' -> Todos
    // Estado = 1 -> Activos
    // Estado = 0 -> Inactivos


    var sql_aux = ";";
    if (estado !== '') {
        sql_aux = " and a.activo = '" + estado + "'";
    }

    var sql = "SELECT * FROM system_usuarios a where (a.usuario ilike $1 or a.nombre ilike $1 or a.descripcion ilike $1) " + sql_aux;
    
    if (pagina !== 0) {

        G.db.pagination(sql, ["%" + termino_busqueda + "%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
            callback(err, rows, total_records);
        });
    } else {
       G.db.query(sql, ["%" + termino_busqueda + "%"], function(err, rows, result) {
            callback(err, rows);
       });
    }
    
    
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


//gestiona para modificar o insertar el rol
UsuariosModel.prototype.guardarUsuario = function(usuario, callback) {
    var self = this;

    if (usuario.id && usuario.id !== 0) {
        self.modificarUsuario(usuario, function(err, rows) {
            callback(err, rows);
        });
    } else {
        self.insertarUsuario(usuario, function(err, rows) {
            callback(err, rows);
        });
    }
};


UsuariosModel.prototype.insertarUsuario = function(usuario, callback) {

    var sql = "INSERT INTO system_usuarios (usuario, nombre, passwd, activo,\
               fecha_caducidad_contrasena, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING usuario_id";


    var params = [
        usuario.usuario, usuario.nombre, "md5('"+usuario.clave+"')", Number(usuario.estado), usuario.fecha_caducidad, usuario.email
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

UsuariosModel.prototype.modificarUsuario = function(rol, callback) {


    var sql = "UPDATE roles SET  nombre = $1, observacion = $2, usuario_id = $3, usuario_id_modifica = $4,\
               estado = $5, fecha_modificacion = $6, empresa_id =$7 WHERE id = $8  \
               ";

    var params = [
        rol.nombre, rol.observacion, rol.usuario_id, rol.usuario_id,
        Number(rol.estado), 'now()', rol.empresa_id, rol.id
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

UsuariosModel.prototype.obtenerUsuarioPorNombre = function(usuario, callback) {
    var sql = "SELECT  nombre, usuario_id  FROM system_usuarios WHERE usuario ILIKE $1";

    G.db.query(sql, [usuario + "%"], function(err, rows, result) {
        callback(err, rows);
    });
};


module.exports = UsuariosModel;