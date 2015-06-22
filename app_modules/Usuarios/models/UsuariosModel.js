var UsuariosModel = function(m_rol, m_modulo, m_bodegas) {
    this.m_rol = m_rol;
    this.m_modulo = m_modulo;
    this.m_bodegas = m_bodegas;
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
UsuariosModel.prototype.obtenerUsuarioPorId = function(usuario_id, callback) {

    var sql = "SELECT a.*, b.ruta_avatar, c. * FROM system_usuarios a\
                LEFT JOIN system_usuarios_configuraciones b ON a.usuario_id = b.usuario_id\
                LEFT JOIN (\
                        SELECT bb.id as id_rol, bb.nombre as nombre_rol, bb.observacion as observacion_rol , aa.login_id, aa.id as login_empresas_id, aa.empresa_id FROM login_empresas aa\
                        INNER JOIN roles bb ON aa.rol_id = bb.id \
                        WHERE aa.predeterminado = '1' AND aa.login_id = $1\
                ) c ON a.usuario_id = c.login_id\
                where a.usuario_id = $1;  ";

    G.db.query(sql, [usuario_id], function(err, rows, result) {
        callback(err, (rows.length > 0) ? rows[0] : null);
    });
};

// Selecciona un usuario por el login
UsuariosModel.prototype.obtenerUsuarioPorLogin = function(login, callback) {

    var sql = "SELECT * FROM system_usuarios a where a.usuario = $1; ";

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

    __validarCreacionUsuario(self, usuario, function(validacion) {

        if (!validacion.valido) {
            var err = {msj: validacion.msj};
            callback(err, false);
            return;
        }

        self.modificarUsuario(usuario, function(err, rows, result) {
            if (err) {
                callback(err, rows);
                return;
            }

            if (result.rowCount === 0) {

                self.insertarUsuario(usuario, function(err, rows) {
                    callback(err, rows);
                });

            } else if (usuario.clave.length > 0) {
                self.cambiar_contrasenia(usuario.usuario, usuario.clave, function(err, rows) {
                    if (err) {
                        callback(err, rows);
                        return;
                    }

                    callback(err, rows);
                });
            } else {
                callback(err, rows);
            }
        });
    });

};


UsuariosModel.prototype.insertarUsuario = function(usuario, callback) {

    var sql = "INSERT INTO system_usuarios (usuario, nombre, passwd, activo,\
               fecha_caducidad_contrasena, descripcion, email) VALUES ($1, $2, md5($3), $4, $5, $6, $7) RETURNING usuario_id";


    var params = [
        usuario.usuario, usuario.nombre, usuario.clave, Number(usuario.estado), usuario.fechaCaducidad, usuario.descripcion, usuario.email
    ];



    G.db.query(sql, params, function(err, rows, result) {
        var usuario_id = (rows) ? rows[0] : undefined;
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
        var usuario_id = (rows) ? rows[0] : undefined;
        callback(err, usuario_id, result);
    });
};

UsuariosModel.prototype.obtenerUsuarioPorNombreOEmail = function(usuario, email, callback) {
    var sql = "SELECT  nombre, usuario_id, email, usuario  FROM system_usuarios WHERE usuario ILIKE $1 OR email = $2";

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

        if (err) {
            callback(err);
            return;
        }

        if (result.rowCount === 0) {
            var sql = "INSERT INTO system_usuarios_configuraciones (usuario_id, ruta_avatar) VALUES($1, $2)";

            G.db.query(sql, params, function(err, rows) {
                callback(err, rows);

            });
        } else {
            callback(false, true);
        }

    });
};

UsuariosModel.prototype.obtenerRolUsuarioPorEmpresa = function(empresa_id, usuario_id, callback) {
    var sql = "SELECT b. *, a.id as login_empresa_id, a.empresa_id FROM login_empresas a\
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


UsuariosModel.prototype.cambiarPredeterminadoEmpresa = function(empresa_id, usuario_id, rol_id, predeterminado, callback) {

    var that = this;

    console.log("cambiar predeterminado predeterminad ", predeterminado, " empresa ", empresa_id, " login id ", usuario_id, " rol id ", rol_id);

    __desmarcarPredeterminadoEmpresas(that, empresa_id, usuario_id, function(err, rows, result) {

        if (err) {
            callback(true);
            return;
        }

        __cambiarPredeterminadoEmpresa(that, empresa_id, usuario_id, rol_id, predeterminado, function(err, rows) {
            if (err) {
                callback(true);
                return;
            }

            callback(err, rows);

        });


    });

};

UsuariosModel.prototype.obtenerEmpresasPredeterminadas = function(that, empresa_id, usuario_id, callback) {
    var sql = "SELECT a.predeterminado FROM login_empresas a WHERE a.login_id = $1  AND a.predeterminado = '1'";

    G.db.query(sql, [usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};


UsuariosModel.prototype.asignarRolUsuario = function(login_id, empresa_id, rol_id, usuario_id, predeterminado, callback) {
    var that = this;

    G.db.begin(function() {
        that.guardarRolUsuario(login_id, empresa_id, rol_id, usuario_id, function(err, result) {
            
            if(err){
                callback(err);
                return;
            }
            
            
            var rows = result.rows;
            var login_empresa_id = (rows.length > 0) ? rows[0].id : undefined;
            //callback(err, id);

            that.sobreEscribirModulosDelRol(login_id, empresa_id, rol_id, usuario_id, login_empresa_id, function(err, rows, ids) {
                if (err) {
                    callback(err);
                    return;
                }

                //se inicializa un nuevo array para devolver los modulos creados
                var modulos_ids = [];
                modulos_ids = modulos_ids.concat(ids);

                that.sobreEscribirOpcionesDelRol(usuario_id, rol_id, empresa_id, ids, function(err) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    G.db.commit(function() {
                        callback(err, login_empresa_id, modulos_ids);
                    });

                });


            });

        });
    });
};


UsuariosModel.prototype.habilitarModulosDeUsuario = function(usuario_id, rolesModulos, login_empresas_id, callback) {
    var that = this;

    G.db.begin(function() {
        __habilitarModulosDeUsuario(that, usuario_id, rolesModulos, login_empresas_id, [], function(err, rows, ids) {
            if (err) {
                callback(err);
                return;
            }

            G.db.commit(function() {
                callback(err, rows, ids);
            });
        });
    });
};


UsuariosModel.prototype.deshabilitarBodegasUsuario = function(usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, callback) {

    var that = this;

    that.m_bodegas.listar_bodegas_empresa(empresa_id, centro_utilidad_id, function(err, rows) {

        __deshabilitarBodegasUsuario(that, usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, rows, function(err, rows) {
            callback(err, rows);
        });
    });

};


UsuariosModel.prototype.guardarCentroUtilidadBodegaUsuario = function(usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, bodegas, estado, callback) {
    var that = this;
    __guardarCentroUtilidadBodegaUsuario(that, usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, bodegas, estado, function(err) {
        callback(err);
    });
};


//se encarga de asignar el rol del usuario y borrar registros del rol anterior por empresa
UsuariosModel.prototype.guardarRolUsuario = function(login_id, empresa_id, rol_id, usuario_id, callback) {
    var that = this;

    //borra los registros del modulo anterior
    var usuarioRol = that.borrarRolAsignadoUsuario(rol_id, empresa_id, login_id, function(err) {
        if (err) {
            callback(err);
            return;
        }

        var sql = "INSERT INTO login_empresas (login_id, empresa_id, usuario_id,\
           fecha_creacion, rol_id, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";


        var params = [
            login_id, empresa_id, usuario_id, 'NOW()', rol_id, '1'
        ];


        G.db.transaction(sql, params, function(err, result) {
            callback(err, result);
        });

    });
};

UsuariosModel.prototype.obtenerParametrizacionUsuario = function(usuario_id, empresa_id, callback) {
    var that = this;

    var parametrizacion = {};

    //obtiene el rol del usuario
    that.obtenerRolUsuarioPorEmpresa(empresa_id, usuario_id, function(err, rol) {
        console.log("usuario obtenido ", rol);

        //el usuario no tiene un rol asignado como predeterminado
        if (!rol || !rol.id) {
            callback(err, parametrizacion);
            return;
        }

        //obtiene los modulos del usuario
        that.m_modulo.listarModulosUsuario(rol.id, empresa_id, usuario_id, function(err, modulos) {
            if (err) {
                callback(err);
                return;
            }

            parametrizacion.rol = rol;

            //obtiene las opciones correspondientes de cada modulo
            __asignarOpcionesModulo(that, modulos, 0, rol.id, empresa_id, usuario_id, function(err, modulos) {

                if (err) {
                    callback(err);
                    return;
                }
                __asignarVariablesModulo(that, modulos, 0, function(err, modulos) {

                    if (err) {
                        callback(err);
                        return;
                    }

                    parametrizacion.modulos = modulos;

                    //obtiene los centros de utilidad basado en la empresa del usuario
                    that.obtenerCentrosUtilidadUsuario(empresa_id, usuario_id, false, undefined, "", function(err, rows) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        console.log("centros utilidad usuario ", rows, empresa_id, usuario_id);
                        //return;

                        if (rows.length === 0) {
                            callback(err, parametrizacion);
                            return;
                        }

                        //asigna las bodegas del centro de utilidad
                        __obtenerBodegasCentroUtilidadUsuario(that, 0, empresa_id, usuario_id, rows, function(err, centros) {
                            parametrizacion.centros_utilidad = centros;
                            callback(err, parametrizacion);
                        });


                    });
                });
            });




        });

    });
};

UsuariosModel.prototype.borrarRolAsignadoUsuario = function(rol_id, empresa_id, usuario_id, callback) {
    var sql = "DELETE FROM login_empresas WHERE  empresa_id = $1 AND login_id = " + usuario_id;
    var params = [
        empresa_id
    ];

    G.db.transaction(sql, params, function(err, rows) {
        callback(err, rows);
    });
};

UsuariosModel.prototype.sobreEscribirOpcionesDelRol = function(usuario_id, rol_id, empresa_id, modulos_ids, callback) {
    var that = this;
    // console.log(">>>>>>>>>>>>>>>>>>> ",ids);
    __sobreEscribirOpcionesDelRol(that, usuario_id, rol_id, empresa_id, modulos_ids, function(err) {
        callback(err);
    });

};



UsuariosModel.prototype.sobreEscribirModulosDelRol = function(login_id, empresa_id, rol_id, usuario_id, login_empresa, callback) {
    var that = this;

    //trae los modulos del rol
    that.m_rol.obtenerModulosPorRolYEmpresa(rol_id, empresa_id, function(err, rows) {


        if (err) {
            callback(err, rows);
            return;
        }

        var rolesModulos = [];
        //se hace el recorrido para mantener la uniformidad de las relaciones, ya que la funcion __habilitarModulosDeUsuario() sera usada desde el cliente con la misma estructura
        for (var i in rows) {

            var rolModulo = {
                modulo: {
                    modulo_id: rows[i].modulo_id
                },
                estado: '1'
            };

            rolesModulos.push(rolModulo);

        }

        __habilitarModulosDeUsuario(that, usuario_id, rolesModulos, login_empresa, [], function(err, rows, ids) {
            // console.log("ids insertados >>>>>>> ", ids)
            callback(err, rows, ids);
        });

    });

};

UsuariosModel.prototype.guardarOpcion = function(usuario_id, opcion, login_modulos_empresa_id, callback) {
    var that = this;

    G.db.begin(function() {
        __guardarOpcion(that, usuario_id, opcion, login_modulos_empresa_id, function(err, rows, ids) {
            if (err) {
                callback(err);
                return;
            }

            G.db.commit(function() {
                callback(err, rows, ids);
            });
        });
    });
};

UsuariosModel.prototype.obtenerEmpresasUsuario = function(usuario_id, callback) {
    var that = this;

    var sql = "SELECT b.empresa_id, b.razon_social FROM login_empresas a \
               INNER JOIN empresas b ON b.empresa_id = a.empresa_id\
                WHERE a.login_id = $1  AND a.estado= '1'";

    G.db.query(sql, [usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};


UsuariosModel.prototype.obtenerCentrosUtilidadUsuario = function(empresa_id, login_id, todosCentrosExistentes, pagina, termino, callback) {
    var that = this;
    
    if(todosCentrosExistentes){
        
        var sql =  "SELECT  a.centro_utilidad AS centro_utilidad_id, a.descripcion, COALESCE(b.seleccionado_usuario, '0') AS seleccionado_usuario, a.empresa_id, c.razon_social AS nombre_empresa\
                    FROM centros_utilidad a \
                    LEFT JOIN (\
                        SELECT bb.estado AS seleccionado_usuario, bb.centro_utilidad_id, bb.empresa_id FROM login_empresas AS aa\
                        INNER JOIN login_centros_utilidad_bodega bb ON bb.login_empresa_id = aa.id\
                        WHERE aa.login_id = $1 AND aa.estado = '1' GROUP BY 1,2,3\
                    ) AS b ON b.centro_utilidad_id = a.centro_utilidad AND a.empresa_id = b.empresa_id\
                    INNER JOIN empresas c ON a.empresa_id = c.empresa_id\
                    WHERE  a.descripcion ILIKE $2";
        
        G.db.pagination(sql, [login_id, "%"+termino+"%"], pagina, G.settings.limit, function(err, rows, result, total_records) {
            callback(err, rows, total_records);
        });
    } else {
        
        var sql = " SELECT bb.estado AS seleccionado_usuario, bb.centro_utilidad_id, bb.empresa_id, cc.razon_social AS nombre_empresa FROM login_empresas AS aa\
                    INNER JOIN login_centros_utilidad_bodega bb ON bb.login_empresa_id = aa.id\
                    INNER JOIN empresas cc ON bb.empresa_id = cc.empresa_id\
                    WHERE aa.login_id = $1 AND aa.estado = '1' GROUP BY 1,2,3,4";
        
        G.db.query(sql, [login_id], function(err, rows, result) {
            callback(err, rows, result);
        });
    }
    
};

UsuariosModel.prototype.obtenerBodegasUsuario = function(empresa_id, login_id, centro_utilidad_id, callback) {
    var that = this;
    
    var sql =  "SELECT a.centro_utilidad AS centro_utilidad_id, a.descripcion, a.bodega AS bodega_id, COALESCE(b.seleccionado_usuario, '0') AS seleccionado_usuario\
                FROM bodegas a\
                LEFT JOIN (\
                    SELECT bb.estado AS seleccionado_usuario, bb.centro_utilidad_id, bb.bodega_id FROM login_empresas AS aa\
                    INNER JOIN login_centros_utilidad_bodega bb ON bb.login_empresa_id = aa.id\
                    WHERE aa.login_id = $1 GROUP BY 1,2, 3\
                ) AS b ON b.centro_utilidad_id = a.centro_utilidad AND a.bodega = b.bodega_id\
                WHERE a.centro_utilidad = $2 AND a.empresa_id = $3";

    G.db.query(sql, [login_id, centro_utilidad_id, empresa_id ], function(err, rows, result) {
        callback(err, rows, result);
    });
};

UsuariosModel.prototype.borrarParametrizacionPorUsuario = function(usuario_id, callback) {
    var tablas = [
                    "roles_modulos",
                    "login_modulos_empresas",
                    "modulos_empresas",
                    "modulos",
                    "login_empresas",
                    "roles",
                    "system_usuarios_sesiones",
                    "system_usuarios"
               ];
     
     __borrarParametrizacionPorUsuario(tablas, usuario_id, function(err){
         callback(err);
     });
     
};


function __borrarParametrizacionPorUsuario(tablas, usuario_id, callback) {
    var tabla = tablas[0];
    
    
    if(!tabla){
        callback(false);
        return;
    }
    
    var sql = "DELETE FROM "+tabla+" WHERE usuario_id = $1";
    
    G.db.query(sql, [usuario_id], function(err, rows, result) {
        
        if(err){
            callback(err);
            return;
        }
        
        tablas.splice(0, 1);
        
        setTimeout(function() {
            __borrarParametrizacionPorUsuario(tablas, usuario_id, callback);
        },0);
    });
}

function __obtenerBodegasCentroUtilidadUsuario(that, index, empresa_id, usuario_id, centros, callback) {

    var centro_utilidad = centros[index];

    if (!centro_utilidad) {
        callback(false, centros);
        return;
    }


    that.obtenerBodegasUsuario(centro_utilidad.empresa_id, usuario_id, centro_utilidad.centro_utilidad_id, function(err, bodegas) {
        if (err) {
            callback(err);
            return;
        }

        centro_utilidad.bodegas = bodegas;

        index++;
        setTimeout(function() {
            __obtenerBodegasCentroUtilidadUsuario(that, index, empresa_id, usuario_id, centros, callback);
        }, 0);
    });
}

function __cambiarPredeterminadoEmpresa(that, empresa_id, usuario_id, rol_id, predeterminado, callback) {

    var sql = "UPDATE login_empresas  SET predeterminado = $4 WHERE empresa_id = $1 AND login_id = $2 AND rol_id = $3";

    G.db.query(sql, [empresa_id, usuario_id, rol_id, predeterminado], function(err, rows, result) {
        callback(err, rows, result);
    });
}
;


function __desmarcarPredeterminadoEmpresas(that, empresa_id, usuario_id, callback) {
    var sql = "UPDATE login_empresas  SET predeterminado = '0' WHERE login_id = $1 AND predeterminado = '1'";

    G.db.query(sql, [usuario_id], function(err, rows, result) {
        callback(err, rows, result);
    });
}
;


function __sobreEscribirOpcionesDelRol(that, usuario_id, rol_id, empresa_id, modulos_ids, callback) {
    if (modulos_ids.length === 0) {
        callback(false);
        return;
    }

    var modulo = modulos_ids[0];


    var modulo_id = modulo.modulo_id;
    var login_modulos_empresas_id = modulo.login_modulos_empresas_id;


    //se listan las opciones que tiene el modulo asignado al rol
    that.m_rol.listarRolesModulosOpciones(modulo_id, rol_id, 0, empresa_id, function(err, opciones) {
        var cantidad_opciones = opciones.length;

        //valida si el modulo tiene opciones
        if (cantidad_opciones > 0) {
            __guardarOpciones(that, usuario_id, login_modulos_empresas_id, opciones, function(err) {
                if (err) {
                    callback(err);
                    return;
                }

                modulos_ids.splice(0, 1);

                setTimeout(function() {
                    __sobreEscribirOpcionesDelRol(that, usuario_id, rol_id, empresa_id, modulos_ids, callback);
                }, 0);

            });


        } else {
            modulos_ids.splice(0, 1);
            setTimeout(function() {
                __sobreEscribirOpcionesDelRol(that, usuario_id, rol_id, empresa_id, modulos_ids, callback);
            }, 0);
        }

    });

}

function __guardarOpciones(that, usuario_id, login_modulos_empresa_id, opciones, callback) {
    //console.log("opcion >>>>>>>>>>>>>>>>>>>>> code 1 ",opciones)
    if (opciones.length === 0) {
        callback(false);
        return;
    }

    var _opcion = opciones[0];

    // console.log("opcion >>>>>>>>>>>>>>>>>>>>> ",_opcion)

    var opcion = {
        id: _opcion.id,
        //login_modulos_empresa_id:login_modulos_empresa_id,
        seleccionado: true
    };

    //valida que la opcion este seleccionada en el rol
    if (_opcion.estado_opcion_rol === '1') {

        __guardarOpcion(that, usuario_id, opcion, login_modulos_empresa_id, function(err) {
            if (err) {
                callback(err);
                return;
            }

            opciones.splice(0, 1);
            setTimeout(function() {
                __guardarOpciones(that, usuario_id, login_modulos_empresa_id, opciones, callback);
            }, 0);
        });
    } else {
        opciones.splice(0, 1);
        setTimeout(function() {
            __guardarOpciones(that, usuario_id, login_modulos_empresa_id, opciones, callback);
        }, 0);
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

                setTimeout(function() {
                    __habilitarModulosDeUsuario(that, usuario_id, rolesModulos, login_empresas_id, ids, callback);
                }, 0);

            });

        } else {
            rolesModulos.splice(0, 1);
            if (rows.length > 0 && rows[0].id) {
                ids.push({login_modulos_empresas_id: rows[0].id, login_empresas_id: login_empresas_id, modulo_id: modulo_id});
            }

            setTimeout(function() {
                __habilitarModulosDeUsuario(that, usuario_id, rolesModulos, login_empresas_id, ids, callback);
            }, 0);
        }
    });

}
;

function __guardarOpcion(that, usuario_id, opcion, login_modulos_empresa_id, callback) {

    var sql = "UPDATE login_modulos_opciones SET estado = $4, usuario_id_modifica = $1, fecha_modificacion = now()  \
                WHERE login_modulos_empresa_id = $2 AND modulos_opcion_id = $3  RETURNING id";


    console.log("login_modulos_empresa_id >>>>>>>>>>> ", login_modulos_empresa_id, " modulos_opcion_id >>>>>> ", opcion.id);

    G.db.transaction(sql, [usuario_id, login_modulos_empresa_id, opcion.id, Number(opcion.seleccionado)], function(err, result) {

        if (err) {
            callback(err, result);
            return;
        }
        //si la actualizacion no devuelve resultado se trata de hacer el insert
        var rows = result.rows;
        if (result.rowCount === 0) {
            sql = "INSERT INTO login_modulos_opciones (login_modulos_empresa_id, modulos_opcion_id, usuario_id, fecha_creacion, estado)\
                   VALUES($1, $2, $3, now(), $4) RETURNING id";

            G.db.transaction(sql, [login_modulos_empresa_id, opcion.id, usuario_id, Number(opcion.seleccionado)], function(err, result) {
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
}


function __asignarOpcionesModulo(that, modulos, index, rol_id, empresa_id, usuario_id, callback) {

    var modulo = modulos[index];

    if (!modulo) {

        callback(false, modulos);
        return;

    }

    that.m_modulo.listarUsuarioModuloOpciones(modulo.modulo_id, rol_id, empresa_id, usuario_id, function(err, opciones) {
        if (err) {
            callback(err);
            return;
        }
        modulo.opciones = opciones;

        index++;
        setTimeout(function() {
            __asignarOpcionesModulo(that, modulos, index, rol_id, empresa_id, usuario_id, callback);
        }, 0);
    });
}

function __asignarVariablesModulo(that, modulos, index, callback) {

    var modulo = modulos[index];

    if (!modulo) {

        callback(false, modulos);
        return;

    }

    that.m_modulo.listarVariablesPorModulo(modulo.modulo_id, function(err, variables) {
        if (err) {
            callback(err);
            return;
        }
        modulo.variables = variables;

        index++;
        setTimeout(function() {
            __asignarVariablesModulo(that, modulos, index, callback);
        }, 0);
    });
}


function __deshabilitarBodegasUsuario(that, usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, bodegas, callback) {
    if (bodegas.length === 0) {
        callback(false);
        return;
    }
    var bodega = bodegas[0];

    that.guardarCentroUtilidadBodegaUsuario(usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, [bodega.bodega_id], '0', function(err, rows) {
        if (err) {
            callback(err, rows);
            return;
        }

        bodegas.splice(0, 1);
        setTimeout(function() {
            __deshabilitarBodegasUsuario(that, usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, bodegas, callback);
        }, 0);

    });
}

function __guardarCentroUtilidadBodegaUsuario(that, usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, bodegas, estado, callback) {
    if (bodegas.length === 0) {
        callback(false);
        return;
    }

    var bodega = bodegas[0];

    var sql = "UPDATE login_centros_utilidad_bodega SET usuario_id_modifica = $1, fecha_modificacion = now(), estado = $5 \
                WHERE empresa_id = $2 AND centro_utilidad_id = $3 AND  bodega_id = $4 AND login_empresa_id = $6 ";

    G.db.query(sql, [usuario_id, empresa_id, centro_utilidad_id, bodega, estado, login_empresa_id], function(err, rows, result) {
        if (err) {
            callback(err, result);
            return;
        }
        if (result.rowCount === 0) {
            sql = "INSERT INTO login_centros_utilidad_bodega (fecha_modificacion, usuario_id_modifica, login_empresa_id, empresa_id, centro_utilidad_id, bodega_id, estado, fecha_creacion)\
                   VALUES(now(), $1, $2, $3, $4, $5, $6, now())";

            G.db.query(sql, [usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, bodega, estado], function(err, rows, result) {
                if (err) {
                    callback(err, rows);
                    return;
                }

                bodegas.splice(0, 1);

                setTimeout(function() {
                    __guardarCentroUtilidadBodegaUsuario(that, usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, bodegas, estado, callback);
                }, 0);

            });

        } else {
            bodegas.splice(0, 1);

            setTimeout(function() {
                __guardarCentroUtilidadBodegaUsuario(that, usuario_id, login_empresa_id, empresa_id, centro_utilidad_id, bodegas, estado, callback);
            }, 0);
        }
    });

}

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

    if (usuario.usuario === undefined || usuario.usuario.length === 0) {
        validacion.valido = false;
        validacion.msj = "El usuario debe tener un nombre de usuario";
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

    if (!esEmailValido(usuario.email)) {
        validacion.valido = false;
        validacion.msj = "El email no es valido";
        callback(validacion);
        return;
    }



    //trae los usuarios que hagan match con las primeras letras del nombre 
    that.obtenerUsuarioPorNombreOEmail(usuario.usuario.substring(0, 4), usuario.email, function(err, rows) {
        if (err) {
            validacion.valido = false;
            validacion.msj = "Ha ocurrido un error validando el usuario";
            callback(validacion);
            return;
        }


        var nombre_usuario = usuario.usuario.toLowerCase().replace(/ /g, "");

        //determina si el nombre de usuario esta en uso, insensible a mayusculas o espacios
        for (var i in rows) {
            //console.log("buscando en ",rows[i].usuario , " buscando con ", nombre_usuario);
            if (usuario.id !== rows[i].usuario_id) {

                var _nombre_usuario = rows[i].usuario.toLowerCase().replace(/ /g, "");

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

UsuariosModel.$inject = ["m_rol", "m_modulo", "m_bodegas"];

module.exports = UsuariosModel;