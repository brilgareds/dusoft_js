
var Roles = function(m_rol, m_modulo) {

    this.m_rol = m_rol;
    this.m_modulo = m_modulo;
};


Roles.prototype.listar_roles = function(req, res) {

    var that = this;


    var args = req.body.data;
    var empresa_id = args.parametrizacion_perfiles.empresa_id;
    var termino = args.parametrizacion_perfiles.termino || "";
    var pagina = args.parametrizacion_perfiles.pagina_actual;

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
            console.log("error generado ", err);
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

    rol.usuario_id = req.session.user.usuario_id;
    rol.usuario_id_modifica = req.session.user.usuario_id;

    that.m_rol.guardarRol(rol, function(err, rows) {
        if (err) {
            var msj = "Error guardando el rol";

            if(err.msj){
                msj = err.msj;
            }

            console.log("error guardando rol ", err);
            res.send(G.utils.r(req.url, msj, 500, {parametrizacion_perfiles: {}}));
            return;
        }

        if (rows.length > 0 && rows[0].id) {
            rol.id = rows[0].id;
        }

        res.send(G.utils.r(req.url, "Rol guardado con exito", 200, {parametrizacion_perfiles: {rol: rol}}));
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
            res.send(G.utils.r(req.url, 'Error habilitando las empresas para el rol', 500, {parametrizacion_perfiles: {ids: ids}}));
            return;
        }

        res.send(G.utils.r(req.url, "Se asigno correctamente los modulos seleccionados", 200, {parametrizacion_perfiles: {ids: ids}}));

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

    that.m_modulo.listarModulosEmpresaPorRol(rol_id, function(err, rows) {
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

    if (modulo.rolesModulos.length === 0) {
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

        res.send(G.utils.r(req.url, "Se guardo la opcion correctamente", 200, {parametrizacion_perfiles: {id: id}}));

    });

};


Roles.prototype.listarRolesModulosOpciones = function(req, res) {
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

    that.m_rol.listarRolesModulosOpciones(modulo, rol_id, rol_modulo_id, empresa_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las opciones del modulo', 500, {parametrizacion_perfiles: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Listado de opciones por modulo", 200, {parametrizacion_perfiles: {opciones_modulo: rows}}));

    });
};




Roles.$inject = ["m_rol", "m_modulo"];

module.exports = Roles;