var RolModel = function() {

};


RolModel.prototype.listar_roles = function(empresa_id, termino, pagina, callback) {

    var sqlaux = "";
    var parametros = {1:empresa_id};
    if (termino.length > 0) {
        sqlaux = " and nombre "+G.constants.db().LIKE+" :2";
        parametros['2'] = "%" + termino + "%";
    }

    var sql = "SELECT * FROM roles where empresa_id = :1 " + sqlaux + " ORDER BY id ASC ";
    
    var query = G.knex.raw(sql, parametros);

    if (pagina !== 0) {        
        query.limit(G.settings.limit).
        offset((pagina - 1) * G.settings.limit);
    } 
    
    query.then(function(resultado){
        callback(false, resultado.rows,  resultado);

    }).catch(function(err){
        callback(err);
    });
    
};


RolModel.prototype.obtenerRolesPorId = function(ids, callback) {

    ids = ids.join(",");
    var sql = "SELECT * FROM roles WHERE id in( :1 ) ";
    
    G.knex.raw(sql, {1:ids}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};


RolModel.prototype.obtenerModulosPorRol = function(rol_id, callback) {

    var sql = "SELECT * FROM roles_modulos WHERE rol_id = :1 AND estado = '1' ";
    
    G.knex.raw(sql, {1:rol_id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};


RolModel.prototype.obtenerModulosPorRolYEmpresa = function(rol_id, empresa_id, callback) {

    var sql = " SELECT a. *, c.modulo_id FROM roles a\
                INNER JOIN roles_modulos b ON b.rol_id = a.id\
                INNER JOIN modulos_empresas c ON c.id = b.modulos_empresas_id AND c.empresa_id = a.empresa_id\
                WHERE a.id = :1 AND b.estado = '1' AND a.empresa_id = :2 ";
    
    G.knex.raw(sql, {1:rol_id, 2:empresa_id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};



//gestiona para modificar o insertar el rol
RolModel.prototype.guardarRol = function(rol, callback) {
    var self = this;

    __validarCreacionRol(self, rol, function(validacion) {
        if (!validacion.valido) {
            var err = {msj : validacion.msj};
            callback(err);
            return;
        }

        self.modificarRol(rol, function(err, rows, result) {
            
            if(err){
                callback(err);
                return;
            }
        
            if(result.rowCount === 0){
                self.insertarRol(rol, function(err, rows) {
                    callback(err, rows);
                });
            } else {
                callback(err, rows);
            }
        });

    });

};


RolModel.prototype.insertarRol = function(rol, callback) {

    var sql = "INSERT INTO roles (empresa_id, nombre, observacion, usuario_id,\
               fecha_creacion, estado) VALUES ( :1, :2, :3, :4, :5, :6 ) RETURNING id";

    var params = {
        1:rol.empresa_id, 2:rol.nombre, 3:rol.observacion, 4:rol.usuario_id, 5:'now()', 6:Number(rol.estado)
    };
    
    G.knex.raw(sql, params).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

RolModel.prototype.modificarRol = function(rol, callback) {


    var sql = "UPDATE roles SET  nombre = :1, observacion = :2, usuario_id = :3, usuario_id_modifica = :4,\
               estado = :5, fecha_modificacion = :6, empresa_id = :7 WHERE id = :8";

    var params = {
        1:rol.nombre, 2:rol.observacion, 3:rol.usuario_id, 4:rol.usuario_id,
        5:Number(rol.estado), 6:'now()', 7:rol.empresa_id, 8:rol.id
    };
    
    G.knex.raw(sql, params).then(function(resultado){
        callback(false, resultado.rows, resultado);

    }).catch(function(err){
        callback(err);
    });
};

RolModel.prototype.obtenerRolPorNombre = function(nombre, callback) {
    var sql = "SELECT  nombre, id, empresa_id FROM roles WHERE nombre "+G.constants.db().LIKE+" :1";
    
    G.knex.raw(sql, {1:nombre + "%"}).then(function(resultado){
        callback(false, resultado.rows, resultado);

    }).catch(function(err){
        callback(err);
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
               fecha_creacion, estado) VALUES ( :1, :2, :3, :4, :5 ) RETURNING id";

    var params = {
        1:modulo_opcion_id, 2:rol_modulo_id, 3:usuario_id, 4:'now()', 5:Number(estado)
    };
    
    G.knex.raw(sql, params).then(function(resultado){
        callback(false, resultado.rows, resultado);

    }).catch(function(err){
        callback(err);
    });
    
};

RolModel.prototype.modificarOpcion = function(modulo, usuario_id, callback) {
    var estado = modulo.opcionAGuardar.seleccionado;
    var rol_modulo_id = modulo.rolesModulos[0].id;
    var modulo_opcion_id = modulo.opcionAGuardar.id;

    console.log("modificar opcion >>>>>>>>>>>", typeof estado, " estado ", Number(estado), " rol_modulo_id ", rol_modulo_id, " modulo_opcion_id ", modulo_opcion_id);

    var sql = "UPDATE roles_modulos_opciones SET   usuario_id_modifica = :1,\
               estado = :2, fecha_modificacion = :3  WHERE rol_modulo_id = :4 AND modulo_opcion_id = :5";

    var params = {
        1:usuario_id, 2:Number(estado), 3:'now()', 4:rol_modulo_id, 5:modulo_opcion_id
    };
    
    G.knex.raw(sql, params).then(function(resultado){
        callback(false, resultado.rows, resultado);

    }).catch(function(err){
        callback(err);
    });
};


RolModel.prototype.listarRolesModulosOpciones = function(modulo_id, rol_id, rol_modulo_id, empresa_id, callback) {
    var sql = "SELECT a.*, b.rol_id, b.rol_opcion_id, b.estado_opcion_rol FROM modulos_opciones as a\
               LEFT JOIN (\
                    SELECT cc.id as rol_opcion_id, aa.modulo_id, cc.modulo_opcion_id, cc.estado as estado_opcion_rol, bb.rol_id FROM modulos_empresas as aa\
                    INNER JOIN roles_modulos bb ON aa.id = bb.modulos_empresas_id AND bb.rol_id = :2\
                    INNER JOIN roles_modulos_opciones cc ON cc.rol_modulo_id = bb.id\
                    WHERE aa.empresa_id = :3 and aa.modulo_id = :1\
               ) as b ON b.modulo_id = a.modulo_id AND b.modulo_opcion_id = a.id\
               WHERE a.modulo_id =  :1 ORDER BY a.id DESC";
    
    G.knex.raw(sql, {1:modulo_id, 2:rol_id, 3:empresa_id}).then(function(resultado){
        callback(false, resultado.rows, resultado);

    }).catch(function(err){
        callback(err);
    });
};


function __validarCreacionRol(that, rol, callback) {
    var validacion = {
        valido: true,
        msj: ""
    };


    if (rol.nombre === undefined || rol.nombre.length === 0) {
        validacion.valido = false;
        validacion.msj = "El rol debe tener un nombre";
        callback(validacion);
        return;
    }

    if (rol.observacion === undefined || rol.observacion.length === 0) {
        validacion.valido = false;
        validacion.msj = "El rol debe tener una descripcion";
        callback(validacion);
        return;
    }

    //trae los rols que hagan match con las primeras letras del nombre o la url
    that.obtenerRolPorNombre(rol.nombre.substring(0, 4), function(err, rows) {
        if (err) {
            validacion.valido = false;
            validacion.msj = "Ha ocurrido un error validando el rol";
            callback(validacion);
            return;
        }


        var nombre_rol = rol.nombre.toLowerCase().replace(/ /g, "");

        //determina si el nombre del rol ya esta en uso, insensible a mayusculas o espacios
        for (var i in rows) {

            if (rol.id !== rows[i].id) {

                var _nombre_rol = rows[i].nombre.toLowerCase().replace(/ /g, "");

                if (nombre_rol === _nombre_rol && rol.empresa_id === rows[i].empresa_id) {
                    validacion.valido = false;
                    validacion.msj = "El nombre del rol no esta disponible para la empresa seleccionada";
                    callback(validacion);
                    return;
                }

            }

        }
        callback(validacion);
    });
};


//funcion recursiva para actualizar listado de roles_modulos
function __habilitarModulosEnRoles(that, usuario_id, rolesModulos, ids, callback) {

    //si el array esta vacio se termina la funcion recursiva

    if (rolesModulos.length === 0) {
        callback(false, true, ids);
        return;
    }

    console.log("modulo >>>>>>>>>>>>>>>>>>>>>> ", rolesModulos[0]);
    //este es el id de modulos_empresa
    var modulos_empresas_id = rolesModulos[0].modulo.empresasModulos[0].id;
    var rol_id = rolesModulos[0].rol.id;
    var estado = Number(rolesModulos[0].estado);
    var modulo_id = rolesModulos[0].modulo.modulo_id;
    
    var sql = "UPDATE roles_modulos SET estado = :3, usuario_id_modifica = :1, fecha_modificacion = now()  \
               WHERE modulos_empresas_id = :2 AND rol_id = :4 RETURNING id";


    G.knex.raw(sql, {1:usuario_id, 2:modulos_empresas_id, 3:estado, 4:rol_id}).then(function(resultado){
        if (resultado.rowCount === 0) {
            sql = "INSERT INTO roles_modulos (modulos_empresas_id, rol_id, usuario_id, fecha_creacion, estado)\
                   VALUES( :1, :2, :3, now(), :4 ) RETURNING id";

             return G.knex.raw(sql, {1:modulos_empresas_id, 2:rol_id, 3:usuario_id, 4:estado});
        } else {
            rolesModulos.splice(0, 1);
            if (resultado.rows.length > 0 && resultado.rows[0].id) {
                ids.push({roles_modulos_id: resultado.rows[0].id, modulos_empresas_id: modulos_empresas_id, modulo_id: modulo_id});
            }
            __habilitarModulosEnRoles(that, usuario_id, rolesModulos, ids, callback);
        }

    }).then(function(resultado){
        rolesModulos.splice(0, 1);
        //se agrega el id del rol_modulo creado
        if (resultado.rows.length > 0 && resultado.rows[0].id) {
            ids.push({roles_modulos_id: resultado.rows[0].id, modulos_empresas_id: modulos_empresas_id, modulo_id: modulo_id});
        }

        __habilitarModulosEnRoles(that, usuario_id, rolesModulos, ids, callback);
    }).catch(function(err){
        callback(err);
    });

};

module.exports = RolModel;