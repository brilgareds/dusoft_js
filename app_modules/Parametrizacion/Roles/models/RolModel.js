var RolModel = function() {

};


RolModel.prototype.listar_roles = function(empresa_id, termino,pagina, callback) {
    
    var sqlaux = "";
    var parametros = [empresa_id];
    if(termino.length > 0){
        sqlaux = " and nombre ilike $2";
        parametros.push("%"+termino+"%");
    }
    
    var sql = "SELECT * FROM roles where empresa_id = $1 "+sqlaux+" ORDER BY id ASC ";
    
     G.db.pagination(sql, parametros , pagina, G.settings.limit, function(err, rows, result, total_records) {
        callback(err, rows, total_records);
    });
};


RolModel.prototype.obtenerRolesPorId = function(ids, callback) {

    var ids = ids.join(",");
    var sql = "SELECT * FROM roles WHERE id in($1) ";

    G.db.query(sql, [ids], function(err, rows, result) {
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

    __habilitarModulosEnRoles(that, usuario_id, rolesModulos, function(err, result){
        callback(err, result);
    });

};


//funcion recursiva para actualizar listado de roles_modulos
function __habilitarModulosEnRoles(that, usuario_id, rolesModulos, callback) {

    //si el array esta vacio se termina la funcion recursiva

    if (rolesModulos.length === 0) {
        callback(false, true);
        return;
    }

    //este es el id de modulos_empresa
    var modulos_empresas_id = rolesModulos[0].modulo.empresasModulos[0].id;
    var rol_id = rolesModulos[0].rol.id;    
    var estado = Number(rolesModulos[0].estado);

    var sql = "UPDATE roles_modulos SET estado = $3, usuario_id_modifica = $1, fecha_modificacion = now()  WHERE modulos_empresas_id = $2";

    G.db.query(sql, [usuario_id, modulos_empresas_id, estado], function(err, rows, result) {
        if (err) {
            callback(err, rows);
        } else {
            //si la actualizacion no devuelve resultado se trata de hacer el insert
            if (result.rowCount === 0) {
                sql = "INSERT INTO roles_modulos (modulos_empresas_id, rol_id, usuario_id, fecha_creacion, estado)\
                       VALUES($1, $2, $3, now(), $4)";

                G.db.query(sql, [modulos_empresas_id, rol_id, usuario_id, estado], function(err, rows, result) {
                    if (err) {
                        callback(err, rows);
                    } else {
                        rolesModulos.splice(0, 1);
                        __habilitarModulosEnRoles(that, usuario_id, rolesModulos, callback);
                    }
                });

            } else {
                rolesModulos.splice(0, 1);
                __habilitarModulosEnRoles(that, usuario_id, rolesModulos, callback);
            }
        }
    });

};


/*/opciones

//gestiona para modificar o insertar la opcion
RolModel.prototype.guardarOpcion = function(opcion, callback) {
    var self = this;

    if (opcion.id && opcion.id !== 0) {
        self.modificarOpcion(opcion, function(err, rows) {
            callback(err, rows);
        });
    } else {
        self.insertarOpcion(opcion, function(err, rows) {
            callback(err, rows);
        });
    }
};


RolModel.prototype.insertarOpcion = function(opcion, callback) {

    var sql = "INSERT INTO rols_opciones (nombre, alias, rol_id, observacion, usuario_id,\
               fecha_creacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id";


    var params = [
        opcion.nombre, opcion.alias, opcion.rol_id,
        opcion.observacion, opcion.usuario_id, 'now()', Number(opcion.estado)
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

RolModel.prototype.modificarOpcion = function(opcion, callback) {


    var sql = "UPDATE rols_opciones SET nombre = $1, alias =$2,\
               observacion = $3,  usuario_id_modifica = $4,\
               estado = $5, fecha_modificacion = $6 WHERE id = $7  \
               ";

    var params = [
        opcion.nombre, opcion.alias, opcion.observacion,
        opcion.usuario_id, Number(opcion.estado), 'now()', opcion.id
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

RolModel.prototype.obtenerOpcionPorNombre = function(nombre, callback) {
    var sql = "SELECT  nombre, alias, id FROM rols_opciones WHERE nombre ILIKE $1";

    G.db.query(sql, [nombre + "%"], function(err, rows, result) {
        callback(err, rows);
    });
};


RolModel.prototype.listarOpcionesPorModulo = function(rol_id, callback) {
    var sql = "SELECT * FROM rols_opciones WHERE rol_id =  $1 ORDER BY id";

    G.db.query(sql, [rol_id], function(err, rows, result) {
        callback(err, rows);
    });
};

RolModel.prototype.eliminarOpcion = function(id, callback) {
    var sql = "DELETE FROM rols_opciones WHERE id = $1";

    G.db.query(sql, [id], function(err, rows, result) {
        callback(err, rows);
    });
};*/

module.exports = RolModel;