var ModuloModel = function() {

};


ModuloModel.prototype.listar_modulos = function(termino, callback) {
    
    var query = G.knex.column("*").
    from("modulos");
    
    if (termino.length > 0) {
        query.where("nombre", G.constants.db().LIKE, "%" + termino + "%");
    }
    
    query.orderBy("id", "asc").then(function(rows){
        callback(false, rows);
    }).catch(function(err){
        callback(err);
    }).done();
           
    
};

ModuloModel.prototype.obtenerCantidadModulos = function(callback) {

    var sql = "SELECT COUNT(*) AS total FROM modulos";
    
    G.knex.raw(sql).then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

ModuloModel.prototype.obtenerModulosPorId = function(ids, callback) {
    G.knex.column("*").from("modulos").whereIn('id', ids).
    then(function(rows){
        callback(false, rows);
    }).catch(function(err){
        callback(err);
    }).done();
};

//gestiona para modificar o insertar el modulo
ModuloModel.prototype.guardarModulo = function(modulo, callback) {
    var self = this;

    __validarCreacionModulo(self, modulo, function(validacion) {
        if (!validacion.valido) {
            var err = {msj: validacion.msj};
            callback(err);
            return;
        }

        if (modulo.modulo_id && modulo.modulo_id !== 0) {
            self.modificarModulo(modulo, function(err, rows) {
                callback(err, rows);
            });
        } else {
            self.insertarModulo(modulo, function(err, rows) {
                callback(err, rows);
            });
        }
    });

};


ModuloModel.prototype.insertarModulo = function(modulo, callback) {

    //ajuste necesario debido al archivo de setup utilizado por el super admin
    var modulo_id = "nextval('modulos_id_seq'::regclass)";

    if (modulo.modulo_id) {
        modulo_id = modulo.modulo_id;
    }

    var sql = "INSERT INTO modulos (id, parent, nombre, url, parent_name, icon, state, observacion, usuario_id,\
               fecha_creacion, estado, carpeta_raiz) VALUES (" + modulo_id + ", :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11 ) RETURNING id";


    var params = {
        1:modulo.parent, 2:modulo.nombre, 3:modulo.url, 4:modulo.parent_name, 5:modulo.icon || null,
        6:modulo.state, 7:modulo.observacion, 8:modulo.usuario_id, 9:'now()', 10:Number(modulo.estado), 11:modulo.carpetaRaiz
    };
    
    console.log(">>>>>>>>>>>>>>>>>>>>>> parametros ", params);
    
    G.knex.raw(sql, params).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

ModuloModel.prototype.modificarModulo = function(modulo, callback) {

    var that = this;
    var sql = "UPDATE modulos SET parent = :1, nombre = :2, url = :3, parent_name = :4,\
               icon = :5, state = :6, observacion = :7, usuario_id = :8, usuario_id_modifica = :9,\
               estado = :10, fecha_modificacion = :11, carpeta_raiz = :12 WHERE id = :13 ";

    var params = {
        1:modulo.parent, 2:modulo.nombre, 3:modulo.url, 4:modulo.parent_name ||  null, 5:modulo.icon,
        6:modulo.state, 7:modulo.observacion, 8:modulo.usuario_id, 9:modulo.usuario_id,
        10:Number(modulo.estado), 11:'now()', 12:modulo.carpetaRaiz, 13:modulo.modulo_id
    };
    
    G.knex.raw(sql, params).
    then(function(resultado){

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
            callback(false, resultado.rows);
        }

      
    }).catch(function(err){
       callback(err);
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

        var sql = "UPDATE modulos SET  usuario_id_modifica = :1,\
                   estado = :2, fecha_modificacion = :3 WHERE id = :4";

        var params = {1:usuario, 2:Number(estado), 3:'now()', 4:modulo};

        G.knex.raw(sql, params).then(function(resultado){
           if (--i === 0) {
                callback(false, resultado.rows);
           }
           
        }).catch(function(err){
           callback(err);
        });

    });

};

ModuloModel.prototype.obtenerModuloPorNombreOUrl = function(nombre, url, callback) {
    var sql = "SELECT  nombre, state, id FROM modulos WHERE nombre "+G.constants.db().LIKE+" :1 OR state "+G.constants.db().LIKE+" :2";
    
    G.knex.raw(sql, {1:nombre + "%", 2:url + "%"}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
    
};

//opciones

//gestiona para modificar o insertar la opcion
ModuloModel.prototype.guardarOpcion = function(opcion, callback) {
    var self = this;


    __validarCreacionOpcion(self, opcion, function(validacion) {
        if (!validacion.valido) {
            var err = {msj: validacion.msj};
            callback(err);
            return;
        }

        if (opcion.id && opcion.id !== 0) {
            self.modificarOpcion(opcion, function(err, rows) {
                callback(err, rows);
            });
        } else {
            self.insertarOpcion(opcion, function(err, rows) {
                callback(err, rows);
            });
        }
    });

};


ModuloModel.prototype.insertarOpcion = function(opcion, callback) {

    var sql = "INSERT INTO modulos_opciones (nombre, alias, modulo_id, observacion, usuario_id,\
               fecha_creacion, estado) VALUES ( :1, :2, :3, :4, :5, :6, :7 ) RETURNING id";


    var params = {
        1:opcion.nombre, 2:opcion.alias, 3:opcion.modulo_id,
        4:opcion.observacion, 5:opcion.usuario_id, 6:'now()', 7:Number(Boolean(opcion.estado)) || '0'
    };

    G.knex.raw(sql, params).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

ModuloModel.prototype.modificarOpcion = function(opcion, callback) {


    var sql = "UPDATE modulos_opciones SET nombre = :1, alias = :2,\
               observacion = :3,  usuario_id_modifica = :4,\
               estado = :5, fecha_modificacion = :6 WHERE id = :7 ";

    var params = {
        1:opcion.nombre, 2:opcion.alias, 3:opcion.observacion,
        4:opcion.usuario_id, 5:Number(Boolean(opcion.estado)), 6:'now()', 7:opcion.id
    };


    G.knex.raw(sql, params).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

ModuloModel.prototype.obtenerOpcionPorNombre = function(nombre, callback) {
    var sql = "SELECT  nombre, alias, id, modulo_id FROM modulos_opciones WHERE nombre "+G.constants.db().LIKE+" :1";
    
    G.knex.raw(sql, {1:nombre + "%"}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};


ModuloModel.prototype.guardarVariable = function(variable, callback) {
    var self = this;

    __validarCreacionVariable(self, variable, function(validacion) {
        if (!validacion.valido) {
            var err = {msj: validacion.msj};
            callback(err);
            return;
        }

        self.modificarVariable(variable, function(err, rows, result) {
            if (err) {
                callback(err, rows);
                return;
            }

            if (result.rowCount === 0) {
                self.insertarVariable(variable, function(err, rows) {
                    callback(err, rows);
                });
            } else {
                callback(err, rows);
            }
        });
    });

};


ModuloModel.prototype.insertarVariable = function(variable, callback) {

    var sql = "INSERT INTO modulos_variables (nombre, valor, observacion, modulo_id, estado,\
               fecha_creacion) VALUES ( :1, :2, :3, :4, :5, :6 ) RETURNING id";


    var params = {
        1:variable.nombre, 2:variable.valor, 3:variable.observacion,
        4:variable.modulo_id, 5:Number(Boolean(variable.estado)) || '0', 6:'now()'
    };

    G.knex.raw(sql, params).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

ModuloModel.prototype.modificarVariable = function(variable, callback) {
    var self = this;

    var sql = "UPDATE modulos_variables SET nombre = :1, valor = :2,\
               observacion = :3,  usuario_id_modifica = :4,\
               estado = :5, fecha_modificacion = :6 WHERE id = :7";

    var params = {
        1:variable.nombre, 2:variable.valor, 3:variable.observacion,
        4:variable.usuario_id, 5:Number(Boolean(variable.estado)), 6:'now()', 7:variable.id
    };

    G.knex.raw(sql, params).then(function(resultado){
        callback(false, resultado.rows, resultado);

    }).catch(function(err){
        callback(err);
    });
};


ModuloModel.prototype.listarVariablesPorModulo = function(modulo_id, callback) {
    var sql = "SELECT * FROM modulos_variables  a\
               WHERE a.modulo_id =  :1 ORDER BY a.id";

    G.knex.raw(sql, {1:modulo_id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};


ModuloModel.prototype.obtenerVariablePorNombre = function(nombre, callback) {
    var sql = "SELECT  nombre, id FROM modulos_variables WHERE nombre "+G.constants.db().LIKE+" :1";
    
    G.knex.raw(sql, {1:nombre + "%"}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

ModuloModel.prototype.listarOpcionesPorModulo = function(modulo_id, rol_modulo_id, callback) {
    G.knex.column("*").from("modulos_opciones as a").
    where("a.modulo_id", modulo_id).
    orderBy("a.id", "asc").
    then(function(rows){
        callback(false,rows);
    }).catch(function(err){
        callback(err);
    }).done();
};

ModuloModel.prototype.listarUsuarioModuloOpciones = function(modulo_id, rol_id, empresa_id, usuario_id, opcion_id, callback) {
    
    var sqlAux = "";
    
    if(opcion_id && opcion_id !== ""){
        sqlAux = " and a.id = "+opcion_id;
    }
    
    var sql = "SELECT a.*, b.rol_id, b.rol_opcion_id, b.estado_opcion_rol FROM modulos_opciones as a\
               LEFT JOIN (\
                    SELECT cc.id as rol_opcion_id, bb.modulo_id, cc.modulos_opcion_id, cc.estado as estado_opcion_rol, aa.rol_id FROM login_empresas as aa\
                    INNER JOIN login_modulos_empresas bb ON aa.id = bb.login_empresas_id AND bb.modulo_id = :1 \
                    INNER JOIN login_modulos_opciones cc ON cc.	login_modulos_empresa_id = bb.id\
                    WHERE aa.empresa_id = :3   AND aa.rol_id = :2 AND aa.login_id = :4 \
               ) as b ON b.modulo_id = a.modulo_id AND b.modulos_opcion_id = a.id\
               WHERE a.modulo_id =  :1 "+sqlAux+" ORDER BY a.id DESC";
    
    G.knex.raw(sql, {1:modulo_id, 2:rol_id, 3:empresa_id, 4:usuario_id}).then(function(resultado){
        callback(false, resultado.rows, resultado);

    }).catch(function(err){
        callback(err);
    });
};


ModuloModel.prototype.eliminarOpcion = function(id, callback) {
    var sql = "DELETE FROM modulos_opciones WHERE id = :1";

    G.knex.raw(sql, {1:id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
    
};


ModuloModel.prototype.eliminarVariable = function(id, callback) {
    var sql = "DELETE FROM modulos_variables WHERE id = :1";

    G.knex.raw(sql, {1:id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

ModuloModel.prototype.habilitarModuloEnEmpresas = function(usuario_id, empresas_modulos, callback) {

    var that = this;
    //se deshabilitan todos las empresas del modulos para asignar solo las que se enviaron del cliente

    __habilitarModuloEnEmpresas(that, usuario_id, empresas_modulos, [], function(err, result, ids) {
        callback(err, result, ids);
    });

};

ModuloModel.prototype.listarModulosPorEmpresa = function(empresa_id, callback) {
    var sql = "SELECT a.*, b.parent, b.nombre, b.state, b.icon FROM modulos_empresas a\
               INNER JOIN modulos b ON a.modulo_id = b.id and a.estado = '1' and b.estado = '1' \
               WHERE empresa_id =  :1 ORDER BY id";
    
    G.knex.raw(sql, {1:empresa_id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};

ModuloModel.prototype.listarModulosEmpresaPorRol = function(rol_id, callback) {
    var sql = " SELECT a.*, b.parent, c.estado as estado_rol, b.nombre, b.state, b.icon, c.id as roles_modulos_id FROM modulos_empresas a\
                INNER JOIN modulos b ON a.modulo_id = b.id and a.estado = '1' and b.estado = '1'\
                INNER JOIN roles_modulos c ON c.modulos_empresas_id = a.id\
                WHERE c.rol_id = :1   ORDER BY id";
    
    G.knex.raw(sql, {1:rol_id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};


ModuloModel.prototype.listarModulosUsuario = function(rol_id, empresa_id, login_id, callback) {
    //console.log("rol_id ", rol_id, " empresa id ",empresa_id, " login_id ", login_id, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    var sql = " SELECT a.*, c.parent, b.modulo_id, b.estado as estado_modulo_usuario, c.nombre, c.state, c.url, c.icon, c.carpeta_raiz,\
                b.id as login_modulos_empresas_id,\
                CASE WHEN COALESCE(( SELECT bb.id FROM modulos aa\
                                     INNER join modulos bb on aa.id = bb.parent\
                                     WHERE aa.id = b.modulo_id limit 1 ), 0) > 0 THEN '1' ELSE '0' END as es_padre\
                FROM login_empresas a\
		INNER JOIN login_modulos_empresas b ON b.login_empresas_id = a.id\
                INNER JOIN modulos c ON b.modulo_id = c.id and c.estado = '1'\
                WHERE a.rol_id = :1 AND a.empresa_id = :2 AND a.login_id = :3   ORDER BY id";

    G.knex.raw(sql, {1:rol_id, 2:empresa_id, 3:login_id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};


ModuloModel.prototype.obtenerModulosHijos = function(modulo_id, callback) {

    var sql = " SELECT b. * FROM modulos a\
                INNER join modulos b on a.id= b.parent\
                WHERE a.id = :1";

    G.knex.raw(sql, {1:modulo_id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
    
};


ModuloModel.prototype.esModuloPadre = function(modulo_id, callback){
    var sql = "SELECT b.id FROM modulos a\
                INNER join modulos b on a.id= b.parent\
                WHERE a.id = :1 limit 1";
    
    G.knex.raw(sql, {1:modulo_id}).then(function(resultado){
        var esPadre = (resultado.rows.length > 0)?true:false;
        callback(false, esPadre);

    }).catch(function(err){
        callback(err);
    });
};

ModuloModel.prototype.listarRolesPorModulo = function(modulo_id, empresa_id, callback) {
    var sql = " SELECT a. *, b.id_rol_modulo, b.estado_rol_modulo FROM roles a\
                INNER JOIN (\
                    SELECT bb.rol_id, bb.id as id_rol_modulo, bb.estado as estado_rol_modulo, aa.empresa_id FROM modulos_empresas aa\
                    INNER JOIN roles_modulos bb ON bb.modulos_empresas_id = aa.id\
                    WHERE  aa.modulo_id = :1 AND aa.empresa_id = :2 \
                ) AS b ON  b.rol_id = a.id\
                WHERE a.empresa_id = :2 AND a.estado = '1'";

    G.knex.raw(sql, {1:modulo_id, 2:empresa_id}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};


function __validarCreacionModulo(that, modulo, callback) {
    var validacion = {
        valido: true,
        msj: ""
    };

    if (modulo.parent && modulo.parent.length === '') {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener un modulo padre valido";
        callback(validacion);
        return;
    }

    if (modulo.nombre === undefined || modulo.nombre.length === 0) {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener un nombre";
        callback(validacion);
        return;
    }

    if (modulo.state === undefined) {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener un estado";
        callback(validacion);
        return;
    }

    if (modulo.observacion === undefined || modulo.observacion.length === 0) {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener una descripcion";
        callback(validacion);
        return;
    }

    //trae los modulos que hagan match con las primeras letras del nombre o la url
    that.obtenerModuloPorNombreOUrl(modulo.nombre.substring(0, 4), modulo.state.substring(0, 4), function(err, rows) {
        if (err) {
            validacion.valido = false;
            validacion.msj = "Ha ocurrido un error validando el modulo";
            callback(validacion);
            return;
        }


        var nombre_modulo = modulo.nombre.toLowerCase().replace(/ /g, "");
        var nombre_url = modulo.state.toLowerCase().replace(/ /g, "");

        //determina si el nombre del modulo ya esta en uso, insensible a mayusculas o espacios
        for (var i in rows) {

            if (modulo.modulo_id !== rows[i].id) {

                var _nombre_modulo = rows[i].nombre.toLowerCase().replace(/ /g, "");
                var _nombre_url = rows[i].state.toLowerCase().replace(/ /g, "");

                if (nombre_modulo === _nombre_modulo) {
                    validacion.valido = false;
                    validacion.msj = "El nombre del modulo no esta disponible";
                    callback(validacion);
                    return;
                }

                /*if (nombre_url === _nombre_url) {
                 validacion.valido = false;
                 validacion.msj = "El url del modulo no esta disponible";
                 callback(validacion);
                 return;
                 }*/
            }

        }

        callback(validacion);


    });

}
;


function __validarCreacionOpcion(that, opcion, callback) {
    var validacion = {
        valido: true,
        msj: ""
    };

    if (opcion.rol_id && opcion.rol_id.length === '') {
        validacion.valido = false;
        validacion.msj = "La opcion debe tener un rol asignado";
        callback(validacion);
        return;
    }

    if (opcion.nombre === undefined || opcion.nombre.length === 0) {
        validacion.valido = false;
        validacion.msj = "La opcion debe tener un nombre";
        callback(validacion);
        return;
    }

    if (opcion.alias === undefined) {
        validacion.valido = false;
        validacion.msj = "La opcion debe tener un alias";
        callback(validacion);
        return;
    }

    //trae las opcion que hagan match con las primeras letras del nombre o el alias
    that.obtenerOpcionPorNombre(opcion.nombre.substring(0, 4), function(err, rows) {
        if (err) {
            validacion.valido = false;
            validacion.msj = "Ha ocurrido un error validando la opcion";
            callback(validacion);
            return;
        }


        var nombre_opcion = opcion.nombre.toLowerCase().replace(/ /g, "");
        // var alias = opcion.alias.toLowerCase().replace(/ /g, "");

        //determina si el nombre de la opcion ya esta en uso, insensible a mayusculas o espacios
        for (var i in rows) {

            if (opcion.id !== rows[i].id) {

                var _nombre_opcion = rows[i].nombre.toLowerCase().replace(/ /g, "");
                var _alias = rows[i].alias.toLowerCase().replace(/ /g, "");
                
                
                if (nombre_opcion === _nombre_opcion && opcion.modulo_id === rows[i].modulo_id) {
                    validacion.valido = false;
                    validacion.msj = "El nombre de la opcion no esta disponible";
                    callback(validacion);
                    return;
                }

                /* if (alias === _alias) {
                 validacion.valido = false;
                 validacion.msj = "El alias de la opcion no esta disponible";
                 callback(validacion);
                 return;
                 }*/
            }

        }

        callback(validacion);


    });

}
;

function __validarCreacionVariable(that, variable, callback) {
    var validacion = {
        valido: true,
        msj: ""
    };


    if (variable.nombre === undefined || variable.nombre.length === 0) {
        validacion.valido = false;
        validacion.msj = "La variable debe tener un nombre";
        callback(validacion);
        return;
    }

    if (variable.valor === undefined) {
        validacion.valido = false;
        validacion.msj = "La variable debe tener un valor";
        callback(validacion);
        return;
    }

    if (variable.observacion === undefined) {
        validacion.valido = false;
        validacion.msj = "La variable debe tener una observacion";
        callback(validacion);
        return;
    }

    //trae las variable que hagan match con las primeras letras del nombre
    that.obtenerVariablePorNombre(variable.nombre.substring(0, 4), function(err, rows) {
        if (err) {
            validacion.valido = false;
            validacion.msj = "Ha ocurrido un error validando la variable";
            callback(validacion);
            return;
        }


        var nombre_variable = variable.nombre.toLowerCase().replace(/ /g, "");
        // var alias = variable.alias.toLowerCase().replace(/ /g, "");

        //determina si el nombre de la variable ya esta en uso, insensible a mayusculas o espacios
        for (var i in rows) {

            if (variable.id !== rows[i].id) {

                var _nombre_variable = rows[i].nombre.toLowerCase().replace(/ /g, "");

                if (nombre_variable === _nombre_variable) {
                    validacion.valido = false;
                    validacion.msj = "El nombre de la variable no esta disponible";
                    callback(validacion);
                    return;
                }
            }

        }

        callback(validacion);


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
    
    var sql = "UPDATE modulos_empresas SET estado = :4, usuario_id_modifica = :1, fecha_modificacion = now()  WHERE \
               modulo_id = :2 and empresa_id = :3 RETURNING id";
    
    G.knex.raw(sql, {1:usuario_id, 2:modulo_id, 3:empresa_id, 4:estado}).then(function(resultado){
        if (resultado.rowCount === 0) {
            sql = "INSERT INTO modulos_empresas (empresa_id, modulo_id, usuario_id, fecha_creacion, estado)\
                    VALUES( :1, :2, :3, now(), :4 ) RETURNING id";
            
             return G.knex.raw(sql, {1:empresa_id, 2:modulo_id, 3:usuario_id, 4:estado});
        } else {
            empresas_modulos.splice(0, 1);

            if (resultado.rows.length > 0 && resultado.rows[0].id) {
                ids.push({modulos_empresas_id: resultado.rows[0].id, modulo_id: modulo_id, empresa_id: empresa_id});
            }
            __habilitarModuloEnEmpresas(that, usuario_id, empresas_modulos, ids, callback);
        }

    }).then(function(resultado){
        empresas_modulos.splice(0, 1);

        //se agrega el id del rol_modulo creado
        if (resultado.rows.length > 0 && resultado.rows[0].id) {
            ids.push({modulos_empresas_id: resultado.rows[0].id, modulo_id: modulo_id, empresa_id: empresa_id});
        }

        __habilitarModuloEnEmpresas(that, usuario_id, empresas_modulos, ids, callback);
    }).catch(function(err){
        callback(err);
    });

};

module.exports = ModuloModel;