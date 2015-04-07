var ModuloModel = function() {

};


ModuloModel.prototype.listar_modulos = function(termino, callback) {
    
    var parametros = [];
    var sql_aux = "";
    
    
    if(termino.length > 0){
        parametros = ["%"+termino+"%"];
        sql_aux = " WHERE nombre ILIKE $1 ";
    }
    
    console.log("buscando termino "+sql_aux, parametros, termino);

    var sql = "SELECT * FROM modulos "+sql_aux+" ORDER BY id ASC ";

    G.db.query(sql, parametros, function(err, rows, result) {
        callback(err, rows);
    });
};


ModuloModel.prototype.obtenerModulosPorId = function(ids, callback) {

    var ids = ids.join(",");
    var sql = "SELECT * FROM modulos WHERE id IN($1) ";

    G.db.query(sql, [ids], function(err, rows, result) {
        callback(err, rows);
    });
};

//gestiona para modificar o insertar el modulo
ModuloModel.prototype.guardarModulo = function(modulo, callback) {
    var self = this;

    if (modulo.modulo_id && modulo.modulo_id !== 0) {
        self.modificarModulo(modulo, function(err, rows) {
            callback(err, rows);
        });
    } else {
        self.insertarModulo(modulo, function(err, rows) {
            callback(err, rows);
        });
    }
};


ModuloModel.prototype.insertarModulo = function(modulo, callback) {

    var sql = "INSERT INTO modulos (parent, nombre, url, parent_name, icon, state, observacion, usuario_id,\
               fecha_creacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";


    var params = [
        modulo.parent, modulo.nombre, modulo.url, modulo.parent_name, modulo.icon,
        modulo.state, modulo.observacion, modulo.usuario_id, 'now()', Number(modulo.estado)
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.modificarModulo = function(modulo, callback) {

    var that = this;
    var sql = "UPDATE modulos SET parent = $1, nombre = $2, url =$3, parent_name = $4,\
               icon = $5, state = $6, observacion = $7, usuario_id = $8, usuario_id_modifica = $9,\
               estado = $10, fecha_modificacion = $11 WHERE id = $12 ";

    var params = [
        modulo.parent, modulo.nombre, modulo.url, modulo.parent_name, modulo.icon,
        modulo.state, modulo.observacion, modulo.usuario_id, modulo.usuario_id,
        Number(modulo.estado), 'now()', modulo.modulo_id
    ];

    G.db.query(sql, params, function(err, rows, result) {

        //se debe determinar los modulos padres e hijos para modificar su estado
        var modulos = modulo.modulosHijo || [];

        if (modulo.modulosPadre !== undefined && modulo.estado) {
            modulos = modulos.concat(modulo.modulosPadre);
        }


        if (modulos !== undefined && modulos.length > 0) {

            that.activarModulosFamilirares(modulo.estado, modulo.usuario_id, modulos, function(err, rows) {
                callback(err, rows);
            });
        } else {
            callback(err, rows);
        }

    });
};

//funcion que se encarga de modificar el estado de todos los modulos hijo y modificar el estado de los modulos padre siempre y cuando sea true
ModuloModel.prototype.activarModulosFamilirares = function(estado, usuario, modulos, callback) {

    var i = modulos.length;

    if (i === 0) {
        callback(false, []);
        return;
    }

    modulos.forEach(function(modulo) {

        var sql = "UPDATE modulos SET  usuario_id_modifica = $1,\
                   estado = $2, fecha_modificacion = $3 WHERE id = $4";

        var params = [usuario, Number(estado), 'now()', modulo];

        G.db.query(sql, params, function(err, rows, result) {
            if (--i === 0) {
                callback(err, rows);
            }
        });

    });

};

ModuloModel.prototype.obtenerModuloPorNombreOUrl = function(nombre, url, callback) {
    var sql = "SELECT  nombre, state, id FROM modulos WHERE nombre ILIKE $1 OR state ILIKE $2";

    G.db.query(sql, [nombre + "%", url + "%"], function(err, rows, result) {
        callback(err, rows);
    });
};

//opciones

//gestiona para modificar o insertar la opcion
ModuloModel.prototype.guardarOpcion = function(opcion, callback) {
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


ModuloModel.prototype.insertarOpcion = function(opcion, callback) {

    var sql = "INSERT INTO modulos_opciones (nombre, alias, modulo_id, observacion, usuario_id,\
               fecha_creacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id";


    var params = [
        opcion.nombre, opcion.alias, opcion.modulo_id,
        opcion.observacion, opcion.usuario_id, 'now()', Number(Boolean(opcion.estado)) || '0'
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.modificarOpcion = function(opcion, callback) {


    var sql = "UPDATE modulos_opciones SET nombre = $1, alias =$2,\
               observacion = $3,  usuario_id_modifica = $4,\
               estado = $5, fecha_modificacion = $6 WHERE id = $7  \
               ";

    var params = [
        opcion.nombre, opcion.alias, opcion.observacion,
        opcion.usuario_id, Number(Boolean(opcion.estado)), 'now()', opcion.id
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.obtenerOpcionPorNombre = function(nombre, callback) {
    var sql = "SELECT  nombre, alias, id FROM modulos_opciones WHERE nombre ILIKE $1";

    G.db.query(sql, [nombre + "%"], function(err, rows, result) {
        callback(err, rows);
    });
};


ModuloModel.prototype.listarOpcionesPorModulo = function(modulo_id, rol_modulo_id, callback) {
    var sql = "SELECT * FROM modulos_opciones  a\
               WHERE a.modulo_id =  $1 ORDER BY a.id";

    G.db.query(sql, [modulo_id], function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.eliminarOpcion = function(id, callback) {
    var sql = "DELETE FROM modulos_opciones WHERE id = $1";

    G.db.query(sql, [id], function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.habilitarModuloEnEmpresas = function(usuario_id, empresas_modulos, modulo_id, callback) {

    var that = this;
    //se deshabilitan todos las empresas del modulos para asignar solo las que se enviaron del cliente

    __habilitarModuloEnEmpresas(that, usuario_id, empresas_modulos, [], function(err, result, ids) {
        callback(err, result, ids);
    });

};

ModuloModel.prototype.listarModulosPorEmpresa = function(empresa_id, callback) {
    var sql = "SELECT a.*, b.parent, b.nombre, b.state, b.icon FROM modulos_empresas a\
               INNER JOIN modulos b ON a.modulo_id = b.id and a.estado = '1' and b.estado = '1' \
               WHERE empresa_id =  $1 ORDER BY id";

    G.db.query(sql, [empresa_id], function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.listarModulosEmpresaPorRol = function(rol_id, callback) {
    var sql = " SELECT a.*, b.parent, c.estado as estado_rol, b.nombre, b.state, b.icon, c.id as roles_modulos_id FROM modulos_empresas a\
                INNER JOIN modulos b ON a.modulo_id = b.id and a.estado = '1' and b.estado = '1'\
                INNER JOIN roles_modulos c ON c.modulos_empresas_id = a.id\
                WHERE c.rol_id = $1   ORDER BY id";

    G.db.query(sql, [rol_id], function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.obtenerModulosHijos = function(modulo_id, callback) {

    var sql = " SELECT b. * FROM modulos a\
                INNER join modulos b on a.id= b.parent\
                WHERE a.id = $1";

    G.db.query(sql, [modulo_id], function(err, rows, result) {
        callback(err, rows);
    });
};


ModuloModel.prototype.listarRolesPorModulo = function(modulo_id, empresa_id, callback){
    var sql = " SELECT a. *, b.id_rol_modulo, b.estado_rol_modulo FROM roles a\
                INNER JOIN (\
                    SELECT bb.rol_id, bb.id as id_rol_modulo, bb.estado as estado_rol_modulo, aa.empresa_id FROM modulos_empresas aa\
                    INNER JOIN roles_modulos bb ON bb.modulos_empresas_id = aa.id\
                    WHERE  aa.modulo_id = $1 AND aa.empresa_id = $2\
                ) AS b ON  b.rol_id = a.id\
                WHERE a.empresa_id = $2 AND a.estado = '1'";
    
    G.db.query(sql, [modulo_id, empresa_id], function(err, rows, result) {
        callback(err, rows);
    });
};

//funcion recursiva para actualizar listado de empresas_modulos
function __habilitarModuloEnEmpresas(that, usuario_id, empresas_modulos, ids, callback) {

    //si el array esta vacio se termina la funcion recursiva

    if (empresas_modulos.length === 0) {
        callback(false, true, ids);
        return;
    }

    //toma el primer objeto
    var empresa_id = empresas_modulos[0].empresa.codigo;
    var modulo_id = empresas_modulos[0].modulo.modulo_id;
    var estado = Number(empresas_modulos[0].empresa.estado);
    console.log("va a actualizar con estado ", estado);

    var sql = "UPDATE modulos_empresas SET estado = $4, usuario_id_modifica = $1, fecha_modificacion = now()  WHERE modulo_id = $2 and empresa_id = $3 RETURNING id";

    G.db.query(sql, [usuario_id, modulo_id, empresa_id, estado], function(err, rows, result) {
        if (err) {
            callback(err, rows);
        } else {
            //si la actualizacion no devuelve resultado se trata de hacer el insert
            if (result.rowCount === 0) {
                sql = "INSERT INTO modulos_empresas (empresa_id, modulo_id, usuario_id, fecha_creacion, estado)\
                       VALUES($1, $2, $3, now(), $4) RETURNING id";

                G.db.query(sql, [empresa_id, modulo_id, usuario_id, estado], function(err, rows, result) {
                    if (err) {
                        callback(err, rows, ids);
                    } else {
                        empresas_modulos.splice(0, 1);

                        //se agrega el id del rol_modulo creado
                        if (rows.length > 0 && rows[0].id) {
                            ids.push({modulos_empresas_id: rows[0].id, modulo_id: modulo_id, empresa_id:empresa_id});
                        }

                        __habilitarModuloEnEmpresas(that, usuario_id, empresas_modulos, ids, callback);
                    }
                });

            } else {
                empresas_modulos.splice(0, 1);

                if (rows.length > 0 && rows[0].id) {
                    ids.push({modulos_empresas_id: rows[0].id, modulo_id: modulo_id, empresa_id:empresa_id});
                }
                __habilitarModuloEnEmpresas(that, usuario_id, empresas_modulos, ids, callback);
            }
        }
    });

}
;

module.exports = ModuloModel;