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

//opciones

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
};

RolModel.prototype.habilitarModuloEnEmpresas = function(usuario_id, empresas_rols, rol_id, callback) {
    
    var that = this;
    //se deshabilitan todos las empresas del rols para asignar solo las que se enviaron del cliente
    /*var sql = "UPDATE rols_empresas SET estado = 0, usuario_id_modifica = $2, fecha_modificacion = now() WHERE rol_id = $1";

    G.db.query(sql, [rol_id, usuario_id], function(err, rows, result) {
        if (err) {
            callback(err, rows);
        } else {*/
            __habilitarModuloEnEmpresas(that, usuario_id, empresas_rols, function(err, result){
                callback(err, result);
            });
        /*}
    });*/
};

RolModel.prototype.listarModulosPorEmpresa = function(empresa_id, callback) {
    var sql = "SELECT a.*, b.parent, b.nombre, b.state, b.icon FROM rols_empresas a\
               INNER JOIN rols b ON a.rol_id = b.id and a.estado = 1 \
               WHERE empresa_id =  $1 ORDER BY id";

    G.db.query(sql, [empresa_id], function(err, rows, result) {
        callback(err, rows);
    });
};



//funcion recursiva para actualizar listado de empresas_rols
function __habilitarModuloEnEmpresas(that, usuario_id, empresas_rols, callback) {

    //si el array esta vacio se termina la funcion recursiva

    if (empresas_rols.length === 0) {
        callback(false, true);
        return;
    }

    //toma el primer objeto
    var empresa_id = empresas_rols[0].empresa.codigo;
    var rol_id = empresas_rols[0].rol.rol_id;
    var estado = Number(empresas_rols[0].empresa.estado);
    console.log("va a actualizar con estado ",estado);

    var sql = "UPDATE rols_empresas SET estado = $4, usuario_id_modifica = $1, fecha_modificacion = now()  WHERE rol_id = $2 and empresa_id = $3";

    G.db.query(sql, [usuario_id, rol_id, empresa_id, estado], function(err, rows, result) {
        if (err) {
            callback(err, rows);
        } else {
            //si la actualizacion no devuelve resultado se trata de hacer el insert
            if (result.rowCount === 0) {
                sql = "INSERT INTO rols_empresas (empresa_id, rol_id, usuario_id, fecha_creacion, estado)\
                       VALUES($1, $2, $3, now(), $4)";

                G.db.query(sql, [empresa_id, rol_id, usuario_id, estado], function(err, rows, result) {
                    if (err) {
                        callback(err, rows);
                    } else {
                        empresas_rols.splice(0, 1);
                        __habilitarModuloEnEmpresas(that, usuario_id, empresas_rols, callback);
                    }
                });

            } else {
                empresas_rols.splice(0, 1);
                __habilitarModuloEnEmpresas(that, usuario_id, empresas_rols, callback);
            }
        }
    });

};

module.exports = RolModel;