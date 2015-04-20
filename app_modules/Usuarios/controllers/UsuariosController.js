
var Usuarios = function(usuarios, m_rol, m_modulo) {

    console.log("Modulo Usuarios Cargado ");

    this.m_usuarios = usuarios;
    this.m_rol = m_rol;
    this.m_modulo = m_modulo;
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
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

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
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

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
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

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


Usuarios.prototype.obtenerParametrizacionUsuario = function(req, res){
    var that = this;

    var args = req.body.data;
    
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }
    
    var usuario_id = args.parametrizacion_usuarios.usuario_id;

    if (usuario_id === undefined || usuario_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El id del usuario no esta definido', 404, {}));
        return;
    }
    

    that.m_usuarios.obtenerParametrizacionUsuario(usuario_id, function(err, parametrizacion){

        if(err){
            res.send(G.utils.r(req.url, 'Se genero un error al subir la imagen', 403, {}));
            return;
        }

        res.send(G.utils.r(req.url, 'Usuario guardado correctamente', 200, {parametrizacion_usuarios: {parametrizacion: parametrizacion}}));
    });
    
    
    
};


Usuarios.prototype.cambiarPredeterminadoEmpresa = function(req, res){
    var that = this;

    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

    if (args.parametrizacion_usuarios.usuario_id === undefined || args.parametrizacion_usuarios.usuario_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El id del usuario no esta definido', 404, {}));
        return;
    }
    
    if (args.parametrizacion_usuarios.empresa_id === undefined || args.parametrizacion_usuarios.empresa_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'La empresa no esta definida', 404, {}));
        return;
    }
    
    if (args.parametrizacion_usuarios.rol_id === undefined || args.parametrizacion_usuarios.rol_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El rol no esta seleccionado', 404, {}));
        return;
    }
    
    if (args.parametrizacion_usuarios.predeterminado === undefined || args.parametrizacion_usuarios.predeterminado.length === 0 ) {
        res.send(G.utils.r(req.url, 'Algunos datos obligatorios no se encontraron', 404, {}));
        return;
    }
    
    var empresa_id = args.parametrizacion_usuarios.empresa_id;
    var usuario_id = args.parametrizacion_usuarios.usuario_id;
    var rol_id = args.parametrizacion_usuarios.rol_id;
    var predeterminado = args.parametrizacion_usuarios.predeterminado;
    
    
    that.m_usuarios.cambiarPredeterminadoEmpresa(empresa_id, usuario_id, rol_id, predeterminado, function(err, rows){
        if(err){
            res.send(G.utils.r(req.url, 'Se genero un error modificando el usuario', 403, {}));
            return;
        }
            
        res.send(G.utils.r(req.url, 'Usuario', 200, {parametrizacion_usuarios: {rows: rows}}));
    });
};

Usuarios.prototype.obtenerRolUsuarioPorEmpresa = function(req, res) {
    var that = this;

    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

    if (args.parametrizacion_usuarios.usuario_id === undefined || args.parametrizacion_usuarios.usuario_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El id del usuario no esta definido', 404, {}));
        return;
    }
    
   if (args.parametrizacion_usuarios.empresa_id === undefined || args.parametrizacion_usuarios.empresa_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'La empresa no esta definida', 404, {}));
        return;
    }
    
    var empresa_id = args.parametrizacion_usuarios.empresa_id;
    var usuario_id = args.parametrizacion_usuarios.usuario_id;
    
    
    that.m_usuarios.obtenerRolUsuarioPorEmpresa(empresa_id, usuario_id, function(err, rol){
        if(err){
            res.send(G.utils.r(req.url, 'Se genero un error consultando el rol del usuario', 403, {}));
            return;
        }
            
        res.send(G.utils.r(req.url, 'Rol del usuario', 200, {parametrizacion_usuarios: {rol: rol}}));
    });
    
};

Usuarios.prototype.obtenerModulosPorUsuario = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

    if (args.parametrizacion_usuarios.usuario_id === undefined || args.parametrizacion_usuarios.usuario_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El id del usuario no esta definido', 404, {}));
        return;
    }
    
    if (args.parametrizacion_usuarios.empresa_id === undefined || args.parametrizacion_usuarios.empresa_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El codigo de la empresa no esta definido', 404, {}));
        return;
    }
    
    if (args.parametrizacion_usuarios.rol_id === undefined || args.parametrizacion_usuarios.rol_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El id del rol no esta definido', 404, {}));
        return;
    }
    
    var login_id = args.parametrizacion_usuarios.usuario_id;
    var empresa_id = args.parametrizacion_usuarios.empresa_id;
    var rol_id = args.parametrizacion_usuarios.rol_id;
    var usuario_id = req.session.user.usuario_id;

    that.m_modulo.listarModulosUsuario(rol_id, empresa_id, login_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando modulos del rol', 500, {parametrizacion_usuarios: {}}));
            return;
        }
        

        var modulos = [];
        var i = rows.length;

        if (i === 0) {
            res.send(G.utils.r(req.url, "Listado de modulos rol", 200, {parametrizacion_usuarios: {modulos_usuario: []}}));
            return;
        }

        //solo deben retornarse los modulos hijos para el plugin jstree
        rows.forEach(function(modulo) {

            that.m_modulo.obtenerModulosHijos(modulo.modulo_id, function(err, hijos) {
                if (hijos.length === 0) {
                    modulos.push(modulo);
                }

                if (--i === 0) {
                    res.send(G.utils.r(req.url, "Listado de modulos", 200, {parametrizacion_usuarios: {modulos_usuario: modulos}}));
                }

            });

        });


    });
};


Usuarios.prototype.listarUsuariosModulosOpciones = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

    if (args.parametrizacion_usuarios.modulo.id === undefined && args.parametrizacion_usuarios.modulo.id.length === '') {
        res.send(G.utils.r(req.url, 'El id del modulo no esta definido', 500, {parametrizacion_modulos: {}}));
        return;
    }
    var modulo = args.parametrizacion_usuarios.modulo.id;
    var rol_id = args.parametrizacion_usuarios.modulo.rol_id;
    var empresa_id = args.parametrizacion_usuarios.modulo.empresa_id;
    var usuario_id = args.parametrizacion_usuarios.usuario_id;
    
    that.m_modulo.listarUsuarioModuloOpciones(modulo, rol_id, empresa_id,usuario_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las opciones del modulo', 500, {parametrizacion_usuarios: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Listado de opciones por modulo", 200, {parametrizacion_usuarios: {opciones_modulo: rows}}));

    });
};



Usuarios.prototype.asignarRolUsuario = function(req, res) {
     var that = this;

    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }
    
    if (args.parametrizacion_usuarios.usuario_id === undefined || args.parametrizacion_usuarios.usuario_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El id del usuario no esta definido', 404, {}));
        return;
    }
    
    if (args.parametrizacion_usuarios.empresa_id === undefined || args.parametrizacion_usuarios.empresa_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El codigo de la empresa no esta definido', 404, {}));
        return;
    }
    
    if (args.parametrizacion_usuarios.rol_id === undefined || args.parametrizacion_usuarios.rol_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El id del rol no esta definido', 404, {}));
        return;
    }
    
    var login_id = args.parametrizacion_usuarios.usuario_id;
    var empresa_id = args.parametrizacion_usuarios.empresa_id;
    var rol_id = args.parametrizacion_usuarios.rol_id;
    var usuario_id = req.session.user.usuario_id;
    var predeterminado = Number(args.parametrizacion_usuarios.predeterminado) || '0';
    
    
    //asignar rol al usuario    
    that.m_usuarios.asignarRolUsuario(login_id, empresa_id, rol_id,usuario_id,predeterminado, function(err, login_empresa, ids){

        if(err){
            res.send(G.utils.r(req.url, 'Se genero un error guardando el rol', 403, {}));
            return;
        }
        
        if(err){
            res.send(G.utils.r(req.url, 'Se genero un error guardando el rol', 403, {}));
            return;
        }
        
       that.m_usuarios.obtenerEmpresasPredeterminadas(that, empresa_id, login_id, function(err, rows){
            if(err){
               res.send(G.utils.r(req.url, 'Se genero un error seleccionando la empresa como predeterminado', 403, {}));
               return;
           }
           
           console.log("cantidad de predeterminados ", rows);
                
           //si no hay empresas predeterminadas se marca la recien asignada
           if(rows.length ===  0){
               that.m_usuarios.cambiarPredeterminadoEmpresa(empresa_id, login_id, rol_id, '1', function(){
                   
                    res.send(G.utils.r(req.url, 'Usuario guardado correctamente', 200, {parametrizacion_usuarios: {login_empresa_id: login_empresa, ids_modulos:ids}}));
               });
           } else {
               res.send(G.utils.r(req.url, 'Usuario guardado correctamente', 200, {parametrizacion_usuarios: {login_empresa_id: login_empresa, ids_modulos:ids}}));
           }
               
        });

        
        
    });
                
        
    
};


Usuarios.prototype.habilitarModulosDeUsuario = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

    var rolesModulos = args.parametrizacion_usuarios.rolesModulos;
    var login_empresas_id = args.parametrizacion_usuarios.login_empresas_id;

    if (rolesModulos === undefined || rolesModulos.length === 0) {
        res.send(G.utils.r(req.url, 'No se a seleccionado ningun modulo', 500, {parametrizacion_perfiles: {}}));
        return;
    }
    
    if (login_empresas_id === undefined || login_empresas_id.length === 0) {
        res.send(G.utils.r(req.url, 'No se a seleccionado ninguna empresa', 500, {parametrizacion_perfiles: {}}));
        return;
    }


    that.m_usuarios.habilitarModulosDeUsuario(req.session.user.usuario_id, rolesModulos,login_empresas_id, function(err, rows, ids) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error habilitando las empresas para el usuario', 500, {parametrizacion_usuarios: {ids: ids}}));
            return;
        }

        res.send(G.utils.r(req.url, "Se asigno correctamente los modulos seleccionados", 200, {parametrizacion_usuarios: {ids: ids}}));

    });

};

Usuarios.prototype.guardarOpcion = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

    var opcion = args.parametrizacion_usuarios.opcion || undefined;
    var login_modulos_empresa_id = args.parametrizacion_usuarios.login_modulos_empresa_id;

    if (opcion === undefined || opcion.length === 0) {
        res.send(G.utils.r(req.url, 'No se a seleccionado ninguna opcion', 500, {parametrizacion_usuarios: {}}));
        return;
    }
    
   if (login_modulos_empresa_id === undefined || login_modulos_empresa_id.length === 0) {
        res.send(G.utils.r(req.url, 'No se a seleccionado ningun modulo', 500, {parametrizacion_usuarios: {}}));
        return;
    }

    that.m_usuarios.guardarOpcion(req.session.user.usuario_id, opcion, login_modulos_empresa_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error guardando la opcion para el modulo', 500, {parametrizacion_usuarios: {}}));
            return;
        }

        var id = 0;

        if (rows.length > 0 && rows[0].id) {
            id = rows[0].id;
        }

        res.send(G.utils.r(req.url, "Se guardo la opcion correctamente", 200, {parametrizacion_usuarios: {id: id}}));

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

Usuarios.$inject = ["m_usuarios", "m_rol", "m_modulo"];

module.exports = Usuarios;