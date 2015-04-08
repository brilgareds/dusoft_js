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

    var sql = "SELECT a.*, b.ruta_avatar FROM system_usuarios a \
               LEFT JOIN system_usuarios_configuraciones b ON a.usuario_id = b.usuario_id\
               where a.usuario_id = $1; " ;

    G.db.query(sql, [usuario_id], function(err, rows, result) {
        callback(err, (rows.length > 0)?rows[0]:null);
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
    console.log("usuario >> ",usuario);

    if (usuario.id && usuario.id !== 0 && usuario.id !== "") {
        
        if(usuario.clave.length > 0){
            self.cambiar_contrasenia(usuario.usuario, usuario.clave, function(err, rows){
                
                if(err){
                    callback(err, rows);
                    return;
                }
                
                self.modificarUsuario(usuario, function(err, rows) {
                    callback(err, rows);
                });
            });
        } else {
            self.modificarUsuario(usuario, function(err, rows) {
                callback(err, rows);
            });
        }
        
    } else {
        self.insertarUsuario(usuario, function(err, rows) {
            callback(err, rows);
        });
    }
};


UsuariosModel.prototype.insertarUsuario = function(usuario, callback) {

    var sql = "INSERT INTO system_usuarios (usuario, nombre, passwd, activo,\
               fecha_caducidad_contrasena, descripcion, email) VALUES ($1, $2, md5($3), $4, $5, $6, $7) RETURNING usuario_id";


    var params = [
        usuario.usuario, usuario.nombre, usuario.clave, Number(usuario.estado), usuario.fechaCaducidad, usuario.descripcion, usuario.email
    ];
    
    

    G.db.query(sql, params, function(err, rows, result) {
        var usuario_id = (rows)?rows[0]:undefined;
        callback(err, usuario_id);
    });
};

UsuariosModel.prototype.modificarUsuario = function(usuario, callback) {

    var sql = "UPDATE system_usuarios SET  usuario = $1, nombre = $2, activo= $3, fecha_caducidad_contrasena =$4,\
               email = $5, descripcion = $6  WHERE usuario_id = $7 RETURNING usuario_id";

    var params = [
        usuario.usuario, usuario.nombre, Number(usuario.estado), usuario.fechaCaducidad,
        usuario.email, usuario.descripcion, usuario.id 
    ];

    G.db.query(sql, params, function(err, rows, result) {
        var usuario_id = (rows)?rows[0]:undefined;
        callback(err, usuario_id);
    });
};

UsuariosModel.prototype.obtenerUsuarioPorNombreOEmail = function(usuario,email, callback) {
    var sql = "SELECT  nombre, usuario_id, email  FROM system_usuarios WHERE usuario ILIKE $1 OR email = $2";

    G.db.query(sql, [usuario + "%", email], function(err, rows, result) {
        callback(err, rows);
    });
};

UsuariosModel.prototype.guardarAvatarUsuario = function(usuario_id, nombreArchivo, callback) {
    var sql = "UPDATE system_usuarios_configuraciones SET  ruta_avatar = $2 WHERE usuario_id = $1";

    var params = [
        usuario_id, nombreArchivo 
    ];

    G.db.query(sql, params, function(err, rows, result) {
        
        if(err){
            callback(err);
            return;
        }
        
        if(result.rowCount === 0){
            var sql = "INSERT INTO system_usuarios_configuraciones (usuario_id, ruta_avatar) VALUES($1, $2)";
            
             G.db.query(sql, params, function(err, rows) {
                 callback(err, rows);
                 
             });
        } else {
            callback(false, true);
        }
        
    });
};



UsuariosModel.prototype.asignarRolUsuario = function(login_id, empresa_id, rol_id,  usuario_id, predeterminado, callback){
    var sql = "INSERT INTO login_empresas (login_id, empresa_id, predeterminado, usuario_id,\
               fecha_creacion, rol_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";


    var params = [
        login_id, empresa_id, predeterminado, usuario_id , 'NOW()', rol_id
    ];
    
    

    G.db.query(sql, params, function(err, rows, result) {
        var id = (rows)?rows[0]:undefined;
        callback(err, usuario_id);
    });
};


module.exports = UsuariosModel;