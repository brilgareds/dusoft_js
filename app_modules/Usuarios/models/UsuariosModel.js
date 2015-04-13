var UsuariosModel = function(m_rol) {
    this.m_rol = m_rol;
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

    var sql =  "SELECT a.*, b.ruta_avatar, c. * FROM system_usuarios a\
                LEFT JOIN system_usuarios_configuraciones b ON a.usuario_id = b.usuario_id\
                LEFT JOIN (\
                        SELECT bb.id as id_rol, bb.nombre as nombre_rol, bb.observacion as observacion_rol , aa.login_id, aa.id as login_empresas_id, aa.empresa_id FROM login_empresas aa\
                        INNER JOIN roles bb ON aa.rol_id = bb.id \
                        WHERE aa.predeterminado = '1' AND aa.login_id = $1\
                ) c ON a.usuario_id = c.login_id\
                where a.usuario_id = $1;  " ;

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

UsuariosModel.prototype.obtenerRolUsuarioPorEmpresa = function(empresa_id, usuario_id, callback){
    var sql = "SELECT b. * FROM login_empresas a\
               INNER JOIN roles b ON a.rol_id = b.id\
               WHERE a.empresa_id = $1 AND a.login_id = $2";

    G.db.query(sql, [empresa_id, usuario_id], function(err, rows, result) {
        var rol = undefined;
        if (rows.length > 0 && rows[0].id) {
            rol = rows[0];
        }
        callback(err, rol, result);
    });
};


UsuariosModel.prototype.cambiarPredeterminadoEmpresa = function(empresa_id, usuario_id,predeterminado, callback){
    
    var that = this;
    if(!predeterminado){
        __obtenerLoginEmpresasMarcados(that, empresa_id, usuario_id, predeterminado, function(err, rows, result){

        });
    }
    
    var sql = "UPDATE login_empresas a SET a.predeterminado = '$3' WHERE a.empresa_id = $1 AND a.login_id = $2";

    G.db.transaction(sql, [empresa_id, usuario_id, predeterminado], function(err, rows, result) {
        callback(err, rows, result);
    });
};

function __desmarcarLoginEmpresas(that, empresa_id, usuario_id, callback){
    var sql = "UPDATE login_empresas a SET a.predeterminado = '0' WHERE a.empresa_id = $1 AND a.login_id = $2";

    G.db.transaction(sql, [empresa_id, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};


function __obtenerLoginEmpresasMarcados(that, empresa_id, usuario_id, predeterminado,  callback){
    var sql = "SELECT a.predeterminado FROM login_empresas  WHERE a.empresa_id = $1 AND a.login_id = $2  AND a.predeterminado = '1'";

    G.db.query(sql, [empresa_id, usuario_id, predeterminado], function(err, rows, result) {
        callback(err, rows, result);
    });
};

UsuariosModel.prototype.asignarRolUsuario = function(login_id, empresa_id, rol_id,  usuario_id, predeterminado, callback){
    var that = this;
 
    G.db.begin(function() {
        that.guardarRolUsuario(login_id, empresa_id, rol_id,  usuario_id, predeterminado, function(err, result) {
            var rows = result.rows;
            var login_empresa_id = (rows.length > 0)?rows[0].id:undefined;
            //callback(err, id);

             that.sobreEscribirModulosDelRol(login_id, empresa_id, rol_id, usuario_id, login_empresa_id, function(err, rows, ids){
                if(err){
                    callback(err);
                    return;
                }
                
                //se inicializa un nuevo array para devolver los modulos creados
                var modulos_ids = [];
                modulos_ids = modulos_ids.concat(ids);
                
                that.sobreEscribirOpcionesDelRol(usuario_id,rol_id,empresa_id, ids, function(err){
                    if(err){
                        callback(err);
                        return;
                    }
                    
                    G.db.commit(function() {
                        callback(err, login_empresa_id ,modulos_ids);
                    });
                    
                });
                

            });

        });
    });
};


UsuariosModel.prototype.habilitarModulosDeUsuario = function(usuario_id, rolesModulos, login_empresas_id, callback){
    var that = this;  
    
     G.db.begin(function() {
        __habilitarModulosDeUsuario(that, usuario_id, rolesModulos, login_empresas_id, [], function(err, rows, ids){
            if(err){
                callback(err);
                return;
            }

            G.db.commit(function() {
                callback(err, rows, ids);
            });
        });
     });
};

UsuariosModel.prototype.listarUsuarioModuloOpciones = function(modulo_id, rol_id, empresa_id, usuario_id, callback) {
    var sql = "SELECT a.*, b.rol_id, b.rol_opcion_id, b.estado_opcion_rol FROM modulos_opciones as a\
               LEFT JOIN (\
                    SELECT cc.id as rol_opcion_id, bb.modulo_id, cc.modulos_opcion_id, cc.estado as estado_opcion_rol, aa.rol_id FROM login_empresas as aa\
                    INNER JOIN login_modulos_empresas bb ON aa.id = bb.login_empresas_id AND bb.modulo_id = $1\
                    INNER JOIN login_modulos_opciones cc ON cc.	login_modulos_empresa_id = bb.id\
                    WHERE aa.empresa_id = $3   AND aa.rol_id = $2 AND aa.login_id = $4\
               ) as b ON b.modulo_id = a.modulo_id AND b.modulos_opcion_id = a.id\
               WHERE a.modulo_id =  $1 ORDER BY a.id DESC";

    G.db.query(sql, [modulo_id, rol_id, empresa_id, usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};

//se encarga de asignar el rol del usuario y borrar registros del rol anterior por empresa
UsuariosModel.prototype.guardarRolUsuario = function(login_id, empresa_id, rol_id,  usuario_id, predeterminado, callback){
    var that = this;
    
    //borra los registros del modulo anterior
    var usuarioRol = that.borrarRolAsignadoUsuario(rol_id, empresa_id, login_id , function(err){
        if(err){
            callback(err);
            return;
        }
        
        var sql = "INSERT INTO login_empresas (login_id, empresa_id, predeterminado, usuario_id,\
           fecha_creacion, rol_id, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id";


        var params = [
            login_id, empresa_id, predeterminado, usuario_id , 'NOW()', rol_id, '1'
        ];
        
        
         G.db.transaction(sql, params, function(err, result) {
             callback(err, result);
         });
        
    });
};


UsuariosModel.prototype.borrarRolAsignadoUsuario = function(rol_id, empresa_id, usuario_id, callback){
     var sql = "DELETE FROM login_empresas WHERE  empresa_id = $1 AND login_id = "+usuario_id;
     console.log(" empresa_id ", empresa_id, " login_id ",usuario_id)
     var params = [
        empresa_id
     ];
     
     G.db.transaction(sql, params, function(err, rows) {
         callback(err, rows);
     });
};

UsuariosModel.prototype.sobreEscribirOpcionesDelRol = function(usuario_id,rol_id,empresa_id, modulos_ids, callback){
    var that = this;
   // console.log(">>>>>>>>>>>>>>>>>>> ",ids);
    __sobreEscribirOpcionesDelRol(that,usuario_id,rol_id,empresa_id, modulos_ids, function(err){
        callback(err);
    });

};



UsuariosModel.prototype.sobreEscribirModulosDelRol = function(login_id, empresa_id, rol_id, usuario_id, login_empresa, callback){
    var that = this;
    
    //trae los modulos del rol
    that.m_rol.obtenerModulosPorRolYEmpresa(rol_id, empresa_id, function(err, rows){
        
        
        if(err){
            callback(err, rows);
            return;
        }

        var rolesModulos = [];
        //se hace el recorrido para mantener la uniformidad de las relaciones, ya que la funcion __habilitarModulosDeUsuario() sera usada desde el cliente con la misma estructura
        for(var i in rows){
            
            var rolModulo = {
                modulo:{
                    modulo_id:rows[i].modulo_id
                },
                estado:'1'
            };
            
            rolesModulos.push(rolModulo);
  
        }
        
        __habilitarModulosDeUsuario(that, usuario_id, rolesModulos, login_empresa, [], function(err, rows, ids){
             // console.log("ids insertados >>>>>>> ", ids)
              callback(err, rows ,ids);
        });

    });
        
};

UsuariosModel.prototype.guardarOpcion = function(usuario_id, opcion, callback){
    var sql = "UPDATE login_modulos_opciones SET estado = $4, usuario_id_modifica = $1, fecha_modificacion = now()  \
                WHERE login_modulos_empresa_id = $2 AND modulos_opcion_id = $3  RETURNING id";

    G.db.transaction(sql, [usuario_id, opcion.login_modulos_empresa_id, opcion.modulos_opcion_id, opcion.estado], function(err, result) {
        
        if (err) {
            callback(err, result);
            return;
        }
        //si la actualizacion no devuelve resultado se trata de hacer el insert
        var rows = result.rows;
        if (result.rowCount === 0) {
            sql = "INSERT INTO login_modulos_opciones (login_modulos_empresa_id, modulos_opcion_id, usuario_id, fecha_creacion, estado)\
                   VALUES($1, $2, $3, now(), $4) RETURNING id";

            G.db.transaction(sql, [opcion.login_modulos_empresa_id, opcion.modulos_opcion_id, usuario_id, opcion.estado], function(err, result) {
                if (err) {
                    callback(err, rows);
                    return;
                } 
                
                rows = result.rows;

               callback(err, rows);
            });

        } else {

           callback(err, rows);
        }
    });
};


function __sobreEscribirOpcionesDelRol(that, usuario_id,rol_id,empresa_id, modulos_ids, callback){
    if (modulos_ids.length === 0) {
        callback(false);
        return;
    }

    var modulo = modulos_ids[0];


    var modulo_id = modulo.modulo_id;
    var login_modulos_empresas_id = modulo.login_modulos_empresas_id;


    //se listan las opciones que tiene el modulo asignado al rol
    that.m_rol.listarRolesModulosOpciones(modulo_id, rol_id, 0, empresa_id, function(err, opciones){
        var cantidad_opciones = opciones.length;

        //valida si el modulo tiene opciones
        if(cantidad_opciones > 0){
            __guardarOpciones(that, usuario_id, login_modulos_empresas_id, opciones, function(err){
                if(err){
                    callback(err);
                    return;
                }

                modulos_ids.splice(0, 1);
                
                setTimeout(function(){
                    __sobreEscribirOpcionesDelRol(that, usuario_id,rol_id,empresa_id, modulos_ids, callback);
                },0);

            });


        } else {
             modulos_ids.splice(0, 1);
             setTimeout(function(){
                __sobreEscribirOpcionesDelRol(that, usuario_id,rol_id,empresa_id, modulos_ids, callback);
             },0);
        }

    });
    
}

function __guardarOpciones(that, usuario_id, login_modulos_empresa_id, opciones, callback){
    //console.log("opcion >>>>>>>>>>>>>>>>>>>>> code 1 ",opciones)
    if (opciones.length === 0) {
        callback(false);
        return;
    }
    
    var _opcion = opciones[0];
    
   // console.log("opcion >>>>>>>>>>>>>>>>>>>>> ",_opcion)
    
    var opcion = {
        modulos_opcion_id:_opcion.id,
        login_modulos_empresa_id:login_modulos_empresa_id,
        estado:'1'
    };
    
    //valida que la opcion este seleccionada en el rol
    if(_opcion.estado_opcion_rol === '1'){
        
        that.guardarOpcion(usuario_id, opcion, function(err){
            if(err){
                callback(err);
                return;
            }

            opciones.splice(0,1);
            setTimeout(function(){
                __guardarOpciones(that, usuario_id,login_modulos_empresa_id, opciones, callback);
            },0);
        });
    } else {
        opciones.splice(0,1);
        setTimeout(function(){
            __guardarOpciones(that, usuario_id,login_modulos_empresa_id, opciones, callback);
        },0);
    }
    
    
}


//funcion recursiva para actualizar listado de login_modulos_empresas
function __habilitarModulosDeUsuario(that, usuario_id, rolesModulos, login_empresas_id, ids, callback) {   

    //si el array esta vacio se termina la funcion recursiva

    if (rolesModulos.length === 0) {
        callback(false, true, ids);
        return;
    }
    
    var estado = Number(rolesModulos[0].estado);
    var modulo_id = rolesModulos[0].modulo.modulo_id;

    

    var sql = "UPDATE login_modulos_empresas SET estado = $4, usuario_id_modifica = $1, fecha_modificacion = now()\
                WHERE login_empresas_id = $2 AND modulo_id = $3  RETURNING id";

    console.log("estado >>>>>>>",estado , " >>>>>>>>>>>>> login_empresas_id ",login_empresas_id, " modulo_id ",modulo_id);
    G.db.transaction(sql, [usuario_id, login_empresas_id, modulo_id, estado], function(err, result) {
        if (err) {
            callback(err, result, ids);
            return;
        }
        //si la actualizacion no devuelve resultado se trata de hacer el insert
        var rows = result.rows;
        if (result.rowCount === 0) {
            sql = "INSERT INTO login_modulos_empresas (login_empresas_id, modulo_id, usuario_id, fecha_creacion, estado)\
                   VALUES($1, $2, $3, now(), $4) RETURNING id";

            G.db.transaction(sql, [login_empresas_id, modulo_id, usuario_id, estado], function(err, result) {
                if (err) {
                    callback(err, rows, ids);
                    return;
                } 
                
                rows = result.rows;
                rolesModulos.splice(0, 1);
                //se agrega el id del login_modulos_empresas creado
                if (rows.length > 0 && rows[0].id) {
                    ids.push({login_modulos_empresas_id: rows[0].id, login_empresas_id: login_empresas_id, modulo_id: modulo_id});
                }
                
                setTimeout(function(){
                     __habilitarModulosDeUsuario(that, usuario_id, rolesModulos,login_empresas_id,  ids, callback);
                },0);
                
            });

        } else {
            rolesModulos.splice(0, 1);
            if (rows.length > 0 && rows[0].id) {
                ids.push({login_modulos_empresas: rows[0].id, login_empresas_id: login_empresas_id, modulo_id: modulo_id});
            }
            
            setTimeout(function(){
                 __habilitarModulosDeUsuario(that, usuario_id, rolesModulos, login_empresas_id, ids, callback);
            },0);
        }
    });

};


UsuariosModel.$inject = ["m_rol"];

module.exports = UsuariosModel;