
var Usuarios = function(usuarios) {

    console.log("Modulo Usuarios Cargado ");

    this.m_usuarios = usuarios;
};



Usuarios.prototype.listarUsuarios = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.lista_usuarios.termino_busqueda === undefined || args.lista_usuarios.estado_registro === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino_busqueda = args.lista_usuarios.termino_busqueda;
    var estado_registro = args.lista_usuarios.estado_registro;
    var pagina = args.lista_usuarios.pagina_actual || 0;


    this.m_usuarios.listar_usuarios_sistema(termino_busqueda, estado_registro, pagina, function(err, lista_usuarios) {
        res.send(G.utils.r(req.url, 'Lista Usuarios Sistema', 200, {lista_usuarios: lista_usuarios}));
    });
};


Usuarios.prototype.obtenerUsuarioPorId = function(req, res){
    var that = this;

    var args = req.body.data;

    if (args.parametrizacion_usuarios.usuario_id === undefined || args.parametrizacion_usuarios.usuario_id.length === 0) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var usuario_id = args.parametrizacion_usuarios.usuario_id;


    this.m_usuarios.obtenerUsuarioPorId(usuario_id, function(err, usuario) {
        delete usuario.passwd;
        res.send(G.utils.r(req.url, 'Usuario', 200, {parametrizacion_usuarios: {usuario:usuario}}));
    });
};

Usuarios.prototype.guardarUsuario = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.parametrizacion_usuarios.usuario === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var usuario = args.parametrizacion_usuarios.usuario;

    __validarCreacionUsuario(that, usuario, function(validacion) {

        if (!validacion.valido) {
            res.send(G.utils.r(req.url, validacion.msj, 403, {parametrizacion_usuarios: {}}));
            return;
        }

        that.m_usuarios.guardarUsuario(usuario, function(err, usuario) {
            
            if(err){
                res.send(G.utils.r(req.url, "Error guardando el usuario", 403, {parametrizacion_usuarios: {}}));
                return;
            }
            
            res.send(G.utils.r(req.url, 'Usuario guardado correctamente', 200, {parametrizacion_usuarios: {usuario: usuario}}));
        });
    });
};


Usuarios.prototype.subirAvatarUsuario = function(req, res) {
     var that = this;

    var args = req.body.data;

    if (args.parametrizacion_usuarios.usuario_id === undefined || args.parametrizacion_usuarios.usuario_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El id del usuario no esta definido', 404, {}));
        return;
    }
    
    
    __subirAvatarUsuario(req.body, req.files, function(continuar,nombreArchivo){
        if(!continuar){
            res.send(G.utils.r(req.url, 'Se genero un error al subir la imagen', 403, {}));
            return;
        }
        
        that.m_usuarios.guardarAvatarUsuario(args.parametrizacion_usuarios.usuario_id, nombreArchivo, function(err, rows){
            
            if(err){
                res.send(G.utils.r(req.url, 'Se genero un error al subir la imagen', 403, {}));
                return;
            }
            
            res.send(G.utils.r(req.url, 'Usuario guardado correctamente', 200, {parametrizacion_usuarios: {avatar: nombreArchivo}}));
        });
                
        
    });
    
};


function __subirAvatarUsuario(data, files, callback) {

    
     
    var ruta_tmp = files.file.path;
    var ext = G.path.extname(data.flowFilename);
    var usuario_id = data.data.parametrizacion_usuarios.usuario_id;
    var nombre_archivo =  usuario_id  + ext;
    var ruta_nueva = G.dirname + G.settings.carpeta_avatars + usuario_id+ "/";
    

    if (G.fs.existsSync(ruta_tmp)) {
        
        if(!G.fs.existsSync(ruta_nueva)){
            G.fs.mkdirSync(ruta_nueva);
        }
        
        // Copiar Archivo
        G.fs.copy(ruta_tmp, ruta_nueva + nombre_archivo, function(err) {
            if (err) {
                // Borrar archivo fisico
                G.fs.unlinkSync(ruta_tmp);
                callback(false);
                return;
            } else {
                G.fs.unlink(ruta_tmp, function(err) {
                    if (err) {
                        callback(false);
                        return;
                    } else {
                        callback(true, nombre_archivo);
                    }
                });
            }
        });
    } else {
        callback(false);
    }
};

function esEmailValido(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function __validarCreacionUsuario(that, usuario, callback) {
    var validacion = {
        valido: true,
        msj: ""
    };


    if (usuario.nombre === undefined || usuario.nombre.length === 0) {
        validacion.valido = false;
        validacion.msj = "El usuario debe tener un nombre";
        callback(validacion);
        return;
    }

   /* if (usuario.clave && usuario.clave.length < 5) {
        validacion.valido = false;
        validacion.msj = "El usuario debe tener una clave valida de 6 caracteres";
        callback(validacion);
        return;
    }*/

    if (usuario.email === undefined || usuario.email.length === 0) {
        validacion.valido = false;
        validacion.msj = "El usuario debe tener un email";
        callback(validacion);
        return;
    }
    
    if(!esEmailValido(usuario.email)){
        validacion.valido = false;
        validacion.msj = "El email no es valido";
        callback(validacion);
        return;
    }



    //trae los usuarios que hagan match con las primeras letras del nombre 
    that.m_usuarios.obtenerUsuarioPorNombreOEmail(usuario.nombre.substring(0, 4), usuario.email, function(err, rows) {
        if (err) {
            validacion.valido = false;
            validacion.msj = "Ha ocurrido un error validando el usuario";
            callback(validacion);
            return;
        }


        var nombre_usuario = usuario.nombre.toLowerCase().replace(/ /g, "");

        //determina si el nombre de usuario esta en uso, insensible a mayusculas o espacios
        for (var i in rows) {

            if (usuario.id !== rows[i].usuario_id) {

                var _nombre_usuario = rows[i].nombre.toLowerCase().replace(/ /g, "");

                if (nombre_usuario === _nombre_usuario) {
                    console.log("nombre de usuario ", _nombre_usuario, " input ", nombre_usuario);
                    validacion.valido = false;
                    validacion.msj = "El nombre de usuario no esta disponible";
                    callback(validacion);
                    return;
                }

                if (rows[i].email === usuario.email) {
                    validacion.valido = false;
                    validacion.msj = "El email no esta disponible";
                    callback(validacion);
                    return;
                }

            }

        }
        callback(validacion);
    });
}

Usuarios.$inject = ["m_usuarios"];

module.exports = Usuarios;