var RolModel = function() {

};


RolModel.prototype.listar_roles = function(empresa_id, termino, pagina, callback) {

    var sqlaux = "";
    var parametros = [empresa_id];
    if (termino.length > 0) {
        sqlaux = " and nombre ilike $2";
        parametros.push("%" + termino + "%");
    }

    var sql = "SELECT * FROM roles where empresa_id = $1 " + sqlaux + " ORDER BY id ASC ";

    if (pagina !== 0) {

        G.db.pagination(sql, parametros, pagina, G.settings.limit, function(err, rows, result, total_records) {
            callback(err, rows, total_records);
        });
    } else {
        G.db.query(sql, parametros, function(err, rows, result) {
            callback(err, rows);
        });
    }
};


RolModel.prototype.obtenerRolesPorId = function(ids, callback) {

    ids = ids.join(",");
    var sql = "SELECT * FROM roles WHERE id in($1) ";

    G.db.query(sql, [ids], function(err, rows, result) {
        callback(err, rows);
    });
};


RolModel.prototype.obtenerModulosPorRol = function(rol_id, callback) {

    var sql = "SELECT * FROM roles_modulos WHERE rol_id = $1 AND estado = '1' ";

    G.db.query(sql, [rol_id], function(err, rows, result) {
        callback(err, rows);
    });
};

//gestiona para modificar o insertar el rol
RolModel.prototype.guardarRol = function(rol, callback) {
    var self = this;

    if (rol.id && rol.id !== 0) {
        self.modificarRol(rol, function(err, rows) {
            callback(err, rows);
        });
    } else {
        self.insertarRol(rol, function(err, rows) {
            callback(err, rows);
        });
    }
};


RolModel.prototype.insertarRol = function(rol, callback) {

    var sql = "INSERT INTO roles (empresa_id, nombre, observacion, usuario_id,\
               fecha_creacion, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";


    var params = [
        rol.empresa_id, rol.nombre, rol.observacion, rol.usuario_id, 'now()', Number(rol.estado)
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

RolModel.prototype.modificarRol = function(rol, callback) {


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

RolModel.prototype.obtenerRolPorNombre = function(nombre, callback) {
    var sql = "SELECT  nombre, id, empresa_id FROM roles WHERE nombre ILIKE $1";

    G.db.query(sql, [nombre + "%"], function(err, rows, result) {
        callback(err, rows);
    });
};


RolModel.prototype.habilitarModulosEnRoles = function(usuario_id, rolesModulos, callback) {

    var that = this;

    __habilitarModulosEnRoles(that, usuario_id, rolesModulos, [], function(err, result, ids) {
        console.log("ids creados 111 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", ids);
        callback(err, result, ids);
    });

};


RolModel.prototype.guardarOpcion = function(modulo, usuario_id, callback) {
    var self = this;
    var opcion = modulo.opcionAGuardar;

    self.modificarOpcion(modulo, usuario_id, function(err, rows, result) {

        if (result.rowCount > 0) {
            callback(err, rows);

        } else {
            self.insertarOpcion(modulo, usuario_id, function(err, rows) {
                callback(err, rows);
            });
        }
    });

};


RolModel.prototype.insertarOpcion = function(modulo, usuario_id, callback) {

    var rol_modulo_id = modulo.rolesModulos[0].id;
    var modulo_opcion_id = modulo.opcionAGuardar.id;
    var estado = modulo.opcionAGuardar.seleccionado;

    console.log("estado >>>>>>>>>>>", typeof estado, " estado ", Number(estado), " rol_modulo_id ", rol_modulo_id, " modulo_opcion_id ", modulo_opcion_id);

    var sql = "INSERT INTO roles_modulos_opciones (modulo_opcion_id, rol_modulo_id, usuario_id,\
               fecha_creacion, estado) VALUES ($1, $2, $3, $4, $5) RETURNING id";


    var params = [
        modulo_opcion_id, rol_modulo_id, usuario_id, 'now()', Number(estado)
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

RolModel.prototype.modificarOpcion = function(modulo, usuario_id, callback) {
    var estado = modulo.opcionAGuardar.seleccionado;
    var rol_modulo_id = modulo.rolesModulos[0].id;
    var modulo_opcion_id = modulo.opcionAGuardar.id;

    console.log("modificar opcion >>>>>>>>>>>", typeof estado, " estado ", Number(estado), " rol_modulo_id ", rol_modulo_id, " modulo_opcion_id ", modulo_opcion_id);

    var sql = "UPDATE roles_modulos_opciones SET   usuario_id_modifica = $1,\
               estado = $2, fecha_modificacion = $3  WHERE rol_modulo_id = $4 AND modulo_opcion_id = $5";

    var params = [
        usuario_id, Number(estado), 'now()', rol_modulo_id, modulo_opcion_id
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows, result);
    });
};


RolModel.prototype.listarRolesModulosOpciones = function(modulo_id, rol_id, rol_modulo_id, empresa_id, callback) {
    var sql = "SELECT a.*, b.rol_id, b.rol_opcion_id, b.estado_opcion_rol FROM modulos_opciones as a\
               LEFT JOIN (\
                    SELECT cc.id as rol_opcion_id, aa.modulo_id, cc.modulo_opcion_id, cc.estado as estado_opcion_rol, bb.rol_id FROM modulos_empresas as aa\
                    INNER JOIN roles_modulos bb ON aa.id = bb.modulos_empresas_id AND bb.rol_id = $2\
                    INNER JOIN roles_modulos_opciones cc ON cc.rol_modulo_id = bb.id\
                    WHERE aa.empresa_id = $3 and aa.modulo_id = $1\
               ) as b ON b.modulo_id = a.modulo_id AND b.modulo_opcion_id = a.id\
               WHERE a.modulo_id =  $1 ORDER BY a.id DESC";

    G.db.query(sql, [modulo_id, rol_id, empresa_id], function(err, rows, result) {
        callback(err, rows, result);
    });
};


//funcion recursiva para actualizar listado de roles_modulos
function __habilitarModulosEnRoles(that, usuario_id, rolesModulos, ids, callback) {

    //si el array esta vacio se termina la funcion recursiva

    if (rolesModulos.length === 0) {
        callback(false, true, ids);
        return;
    }
    
    console.log("modulo >>>>>>>>>>>>>>>>>>>>>> ", rolesModulos[0])
    //este es el id de modulos_empresa
    var modulos_empresas_id = rolesModulos[0].modulo.empresasModulos[0].id;
    var rol_id = rolesModulos[0].rol.id;
    var estado = Number(rolesModulos[0].estado);
    var modulo_id = rolesModulos[0].modulo.modulo_id;

    

    var sql = "UPDATE roles_modulos SET estado = $3, usuario_id_modifica = $1, fecha_modificacion = now()  \
                WHERE modulos_empresas_id = $2 AND rol_id = $4 RETURNING id";

    G.db.query(sql, [usuario_id, modulos_empresas_id, estado, rol_id], function(err, rows, result) {
        if (err) {
            callback(err, rows, ids);
        } else {
            //si la actualizacion no devuelve resultado se trata de hacer el insert
            if (result.rowCount === 0) {
                sql = "INSERT INTO roles_modulos (modulos_empresas_id, rol_id, usuario_id, fecha_creacion, estado)\
                       VALUES($1, $2, $3, now(), $4) RETURNING id";

                G.db.query(sql, [modulos_empresas_id, rol_id, usuario_id, estado], function(err, rows, result) {
                    if (err) {
                        callback(err, rows, ids);
                    } else {
                        rolesModulos.splice(0, 1);
                        //se agrega el id del rol_modulo creado
                        if (rows.length > 0 && rows[0].id) {
                            ids.push({roles_modulos_id: rows[0].id, modulos_empresas_id: modulos_empresas_id, modulo_id: modulo_id});
                        }

                        __habilitarModulosEnRoles(that, usuario_id, rolesModulos, ids, callback);
                    }
                });

            } else {
                rolesModulos.splice(0, 1);
                if (rows.length > 0 && rows[0].id) {
                    ids.push({roles_modulos_id: rows[0].id, modulos_empresas_id: modulos_empresas_id, modulo_id: modulo_id});
                }
                __habilitarModulosEnRoles(that, usuario_id, rolesModulos, ids, callback);
            }
        }
    });

}
;

module.exports = RolModel;