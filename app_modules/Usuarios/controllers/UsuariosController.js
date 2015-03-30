
var Usuarios = function(usuarios) {

    console.log("Modulo Usuarios Cargado ");

    this.m_usuarios = usuarios;
};



Usuarios.prototype.listarUsuarios = function(req, res) {
    var that = this;

    var args = req.body.data;
    
    if (args.lista_usuarios.termino_busqueda === undefined || args.lista_usuarios.estado_registro === undefined){
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

Usuarios.prototype.guardarUsuario = function(req, res) {
    var that = this;

    var args = req.body.data;
    
    if (args.parametrizacion_usuarios.usuario === undefined || args.parametrizacion_usuarios.id === undefined){
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var usuario = args.parametrizacion_usuarios.usuario;

    this.__validarCreacionUsuario(that, usuario, function(validacion){
        
        if (!validacion.valido) {
            res.send(G.utils.r(req.url, validacion.msj, 403, {parametrizacion_usuarios: {}}));
            return;
        }
        
        that.m_usuarios.guardarUsuario(usuario, function(err, usuario) {
            res.send(G.utils.r(req.url, 'Lista Usuarios Sistema', 200, {parametrizacion_usuarios: {usuario:usuario}}));
        });
    });
};



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

    if (usuario.passwd === undefined || usuario.passwd.length < 5) {
        validacion.valido = false;
        validacion.msj = "El usuario debe tener una clave valida de 6 caracteres";
        callback(validacion);
        return;
    }
    
    if (usuario.email === undefined || usuario.email.length === 0) {
        validacion.valido = false;
        validacion.msj = "El usuario debe tener un email";
        callback(validacion);
        return;
    }

    //trae los usuarios que hagan match con las primeras letras del nombre 
    that.m_usuarios.obtenerUsuarioPorNombre(usuario.nombre.substring(0, 4), function(err, rows) {
        if (err) {
            validacion.valido = false;
            validacion.msj = "Ha ocurrido un error validando el usuario";
            callback(validacion);
            return;
        }


        var nombre_usuario = usuario.nombre.toLowerCase().replace(/ /g, "");

        //determina si el nombre de usuario esta en uso, insensible a mayusculas o espacios
        for (var i in rows) {

            if (usuario.id !== rows[i].id) {

                var _nombre_usuario = rows[i].nombre.toLowerCase().replace(/ /g, "");

                if (nombre_usuario === _nombre_usuario) {
                    validacion.valido = false;
                    validacion.msj = "El nombre de usuario no esta disponible";
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