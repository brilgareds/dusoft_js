
var Roles = function(m_rol, m_modulo) {

    console.log("Modulo parametrizacion rols  Cargado ******************* ");

    this.m_rol = m_rol;
    this.m_modulo = m_modulo;
};


Roles.prototype.listar_roles = function(req, res) {

    var that = this;


    var args = req.body.data;
    var empresa_id = args.parametrizacion_perfiles.empresa_id;
    var termino = args.parametrizacion_perfiles.termino || "";
    var pagina = args.parametrizacion_perfiles.pagina_actual;

    console.log("argumentos ", args);

    if (empresa_id === undefined || empresa_id.length === 0) {
        res.send(G.utils.r(req.url, 'La empresa no es valida.', 403, {parametrizacion_perfiles: {}}));
        return;
    }

    if (pagina === undefined || pagina < 0) {
        res.send(G.utils.r(req.url, 'El numero de pagina no es valido', 403, {parametrizacion_perfiles: {}}));
        return;
    }


    that.m_rol.listar_roles(empresa_id, termino, pagina, function(err, lista_roles) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Roles', 500, {parametrizacion_perfiles: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Roles del sistema', 200, {parametrizacion_perfiles: {roles: lista_roles}}));
        }
    });
};


Roles.prototype.listarRolesPorEmpresa = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.parametrizacion_perfiles.empresa_id === undefined && args.parametrizacion_perfiles.empresa_id.length === 0) {
        res.send(G.utils.r(req.url, 'La empresa no es valida', 403, {parametrizacion_perfiles: {}}));
        return;
    }

    that.m_rol.listarRolesPorEmpresa(args.parametrizacion_perfiles.roles, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error buscando el rol', 500, {parametrizacion_perfiles: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Modulo encontrado', 200, {parametrizacion_perfiles: {roles: rows}}));
        }
    });
};


Roles.prototype.obtenerRolesPorId = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.parametrizacion_perfiles.roles === undefined && args.parametrizacion_perfiles.roles.length === 0) {
        res.send(G.utils.r(req.url, 'Los roles a buscar no son validos', 403, {parametrizacion_perfiles: {}}));
        return;
    }

    that.m_rol.obtenerRolesPorId(args.parametrizacion_perfiles.roles, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error buscando el rol', 500, {parametrizacion_perfiles: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Modulo encontrado', 200, {parametrizacion_perfiles: {roles: rows}}));
        }
    });
};

Roles.prototype.guardarRol = function(req, res) {
    var that = this;

    var args = req.body.data;

    var rol = args.parametrizacion_perfiles.rol;

    __validarCreacionRol(that, rol, function(validacion) {

        if (!validacion.valido) {
            res.send(G.utils.r(req.url, validacion.msj, 403, {parametrizacion_perfiles: {}}));
            return;
        }

        rol.usuario_id = req.session.user.usuario_id;
        rol.usuario_id_modifica = req.session.user.usuario_id;

        console.log("rol a crear ", rol);


        that.m_rol.guardarRol(rol, function(err, rows) {
            if (err) {
                console.log("error guardando rol ", err);
                res.send(G.utils.r(req.url, 'Error guardando el rol', 500, {parametrizacion_perfiles: {}}));
                return;
            }

            if (rows.length > 0 && rows[0].id) {
                rol.id = rows[0].id;
            }

            console.log("rol a regresar ", rol);
            res.send(G.utils.r(req.url, "Rol guardado con exito", 200, {parametrizacion_perfiles: {rol: rol}}));
        });
    });
};

Roles.prototype.habilitarModulosEnRoles = function(req, res) {
    var that = this;
    var args = req.body.data;

    var rolesModulos = args.parametrizacion_perfiles.rolesModulos;

    if (rolesModulos === undefined || rolesModulos.length === 0) {
        res.send(G.utils.r(req.url, 'No se a seleccionado ningun modulo', 500, {parametrizacion_perfiles: {}}));
        return;
    }

    that.m_rol.habilitarModulosEnRoles(req.session.user.usuario_id, rolesModulos, function(err, rows, ids) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error habilitando las empresas para el rol', 500, {parametrizacion_perfiles: {ids:ids}}));
            return;
        }

        res.send(G.utils.r(req.url, "Se asigno correctamente los modulos seleccionados", 200, {parametrizacion_perfiles: {ids:ids}}));

    });

};



Roles.prototype.obtenerModulosPorRol = function(req, res) {
    var that = this;
    var args = req.body.data;

    var rol_id = args.parametrizacion_perfiles.rol_id;

    if (rol_id === undefined || rol_id.length === 0) {
        res.send(G.utils.r(req.url, 'El modulo es invalido', 500, {parametrizacion_perfiles: {}}));
        return;
    }

    //lista los roles registrados en roles_modulos
    that.m_rol.obtenerModulosPorRol(rol_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando modulos del rol', 500, {parametrizacion_perfiles: {}}));
            return;
        }

        //apartir del modulos_empresas_id se listan los modulos 
        var modulos_ids = [];

        for (var i in rows) {
            modulos_ids.push(rows[i].modulos_empresas_id);
        }

        if (modulos_ids.length > 0) {
            that.m_modulo.listarModulosEmpresaPorId(modulos_ids, function(err, rows) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Error listando modulos del rol', 500, {parametrizacion_perfiles: {}}));
                    return;
                }

                var modulos = [];
                var i = rows.length;

                if (i === 0) {
                    res.send(G.utils.r(req.url, "Listado de modulos rol", 200, {parametrizacion_perfiles: {modulos_empresas: []}}));
                    return;
                }

                //solo deben retornarse los modulos hijos para el plugin jstree
                rows.forEach(function(modulo) {

                    that.m_modulo.obtenerModulosHijos(modulo.modulo_id, function(err, hijos) {
                        if (hijos.length === 0) {
                            modulos.push(modulo);
                        }

                        if (--i === 0) {
                            res.send(G.utils.r(req.url, "Listado de modulos", 200, {parametrizacion_perfiles: {modulos_empresas: modulos}}));
                        }

                    });

                });


            });

        } else {
            res.send(G.utils.r(req.url, "", 200, {parametrizacion_perfiles: {modulos_empresas: []}}));
        }

    });

};


Roles.prototype.guardarOpcion = function(req, res) {
    var that = this;
    var args = req.body.data;
   
    
    if (args.parametrizacion_perfiles === undefined) {
        res.send(G.utils.r(req.url, 'No se a seleccionado ningun modulo', 500, {parametrizacion_perfiles: {}}));
        return;
    }
    
    var modulo = args.parametrizacion_perfiles.modulo || undefined;

    if (modulo === undefined || modulo.length === 0) {
        res.send(G.utils.r(req.url, 'No se a seleccionado ningun modulo', 500, {parametrizacion_perfiles: {}}));
        return;
    }
    
    if(modulo.rolesModulos.length === 0){
        res.send(G.utils.r(req.url, 'No se selecciono el rol', 500, {parametrizacion_perfiles: {}}));
        return;
    }

    that.m_rol.guardarOpcion(modulo, req.session.user.usuario_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error guardando la opcion para el modulo', 500, {parametrizacion_perfiles: {}}));
            return;
        }

        var id = 0;
        
        if (rows.length > 0 && rows[0].id) {
            id = rows[0].id;
        }

        res.send(G.utils.r(req.url, "Se guardo la opcion correctamente", 200, {parametrizacion_perfiles: {id:id}}));

    });

};


Roles.prototype.listarRolesModulosOpciones = function(req, res ){
    var that = this;
    var args = req.body.data;

    if (args.parametrizacion_perfiles.modulo.id === undefined && args.parametrizacion_perfiles.modulo.id.length === '') {
        res.send(G.utils.r(req.url, 'El id del modulo no esta definido', 500, {parametrizacion_modulos: {}}));
        return;
    }
    var modulo = args.parametrizacion_perfiles.modulo.id;
    var rol_modulo_id = args.parametrizacion_perfiles.modulo.rol_modulo_id;
    var rol_id = args.parametrizacion_perfiles.modulo.rol_id;
    var empresa_id = args.parametrizacion_perfiles.modulo.empresa_id;
    
    that.m_rol.listarRolesModulosOpciones(modulo,rol_id,rol_modulo_id,empresa_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las opciones del modulo', 500, {parametrizacion_perfiles: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Listado de opciones por modulo", 200, {parametrizacion_perfiles: {opciones_modulo: rows}}));

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
    that.m_rol.obtenerRolPorNombre(rol.nombre.substring(0, 4), function(err, rows) {
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
    that.m_rol.obtenerOpcionPorNombre(opcion.nombre.substring(0, 4), function(err, rows) {
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

                if (nombre_opcion === _nombre_opcion) {
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

Roles.$inject = ["m_rol", "m_modulo"];

module.exports = Roles;