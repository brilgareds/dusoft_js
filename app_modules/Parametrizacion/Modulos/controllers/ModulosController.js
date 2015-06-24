
var Modulos = function(m_modulo) {

    console.log("Modulo parametrizacion modulos  Cargado ******************* ");

    this.m_modulo = m_modulo;
};


Modulos.prototype.listar_modulos = function(req, res) {

    var that = this;


    var args = req.body.data;
    var termino = args.termino || "";
    

    that.m_modulo.listar_modulos(termino, function(err, lista_modulos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Modulos', 500, {parametrizacion_modulos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Modulos del sistema', 200, {parametrizacion_modulos: {modulos: lista_modulos}}));
        }
    });
};

Modulos.prototype.obtenerCantidadModulos = function(req, res) {

    var that = this;


    var args = req.body.data;
    

    that.m_modulo.obtenerCantidadModulos( function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Modulos', 500, {parametrizacion_modulos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Cantidad de Modulos del sistema', 200, {parametrizacion_modulos: {total: rows[0].total}}));
        }
    });
};

Modulos.prototype.obtenerModulosPorId = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.parametrizacion_modulos.modulos_id === undefined && args.parametrizacion_modulos.modulos_id.length === '') {
        res.send(G.utils.r(req.url, 'El id del modulo no esta definido', 403, {parametrizacion_modulos: {}}));
        return;
    }

    that.m_modulo.obtenerModulosPorId(args.parametrizacion_modulos.modulos_id, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error buscando el modulo', 500, {parametrizacion_modulos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Modulo encontrado', 200, {parametrizacion_modulos: {modulos: rows}}));
        }
    });
};

Modulos.prototype.guardarModulo = function(req, res) {
    var that = this;

    var args = req.body.data;

    var modulo = args.parametrizacion_modulos.modulo;

    modulo.usuario_id = req.session.user.usuario_id;
    modulo.usuario_id_modifica = req.session.user.usuario_id;

    that.m_modulo.guardarModulo(modulo, function(err, rows) {
        if (err) {
            
            var msj = "Error guardando el modulo";
            
            if(err.msj){
                msj = err.msj;
            }
            
            console.log("error guardando modulo ", err);
            res.send(G.utils.r(req.url, msj, 500, {parametrizacion_modulo: {}}));
            return;
        }

        if (rows.length > 0 && rows[0].id) {
            modulo.id = rows[0].id;
        }

        console.log("modulo a regresar ", modulo);
        res.send(G.utils.r(req.url, "Modulo creado con exito", 200, {parametrizacion_modulo: {modulo: modulo}}));
    });
};

Modulos.prototype.guardarOpcion = function(req, res) {
    var that = this;

    var args = req.body.data;

    var opcion = args.parametrizacion_modulos.opcion;

    opcion.usuario_id = req.session.user.usuario_id;
    opcion.usuario_id_modifica = req.session.user.usuario_id;

    that.m_modulo.guardarOpcion(opcion, function(err, rows) {
        if (err) {
            
            var msj = "Error guardando la opcion";
            
            if(err.msj){
                msj = err.msj;
            }
            
            console.log("error guardando opcion ", err);
            res.send(G.utils.r(req.url, msj, 500, {parametrizacion_modulo: {}}));
            return;
        }

        if (rows.length > 0 && rows[0].id) {
            opcion.id = rows[0].id;
        }

        console.log("opcion a regresar ", opcion);
        res.send(G.utils.r(req.url, "Opcion guardada con exito", 200, {parametrizacion_modulo: {opcion: opcion}}));
    });
};



Modulos.prototype.guardarVariable = function(req, res) {
    var that = this;

    var args = req.body.data;

    var variable = args.parametrizacion_modulos.variable;
    var modulo_id = args.parametrizacion_modulos.modulo_id;
    
    
    if (modulo_id === undefined && modulo_id.length === '') {
        res.send(G.utils.r(req.url, 'El modulo no esta definido', 500, {parametrizacion_modulos: {}}));
        return;
    }
    
    variable.modulo_id = modulo_id;


    variable.usuario_id = req.session.user.usuario_id;
    variable.usuario_id_modifica = req.session.user.usuario_id;

    that.m_modulo.guardarVariable(variable, function(err, rows) {
        
        if (err) {
            var msj = "Error guardando la variable";
     
            if(err.msj){
                msj = err.msj;
            }
            
            console.log("error guardando variable ", err);
            res.send(G.utils.r(req.url, msj, 500, {parametrizacion_modulo: {}}));
            return;
        }

        if (rows.length > 0 && rows[0].id) {
            variable.id = rows[0].id;
        }

        res.send(G.utils.r(req.url, "Variable guardada con exito", 200, {parametrizacion_modulo: {variable: variable}}));
    });
};


Modulos.prototype.listarOpcionesPorModulo = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.parametrizacion_modulos.modulo.id === undefined && args.parametrizacion_modulos.modulo.id.length === '') {
        res.send(G.utils.r(req.url, 'El id del modulo no esta definido', 500, {parametrizacion_modulos: {}}));
        return;
    }
    var modulo = args.parametrizacion_modulos.modulo.id;
    var rol_modulo_id = args.parametrizacion_modulos.modulo.rol_modulo_id;


    that.m_modulo.listarOpcionesPorModulo(modulo,rol_modulo_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las opciones del modulo', 500, {parametrizacion_modulo: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Listado de opciones por modulo", 200, {parametrizacion_modulos: {opciones_modulo: rows}}));

    });
};

Modulos.prototype.eliminarOpcion = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.parametrizacion_modulos.opcion.id === undefined && args.parametrizacion_modulos.opcion.id.length === '') {
        res.send(G.utils.r(req.url, 'El id de la opcion no esta definida', 500, {parametrizacion_modulos: {}}));
        return;
    }

    that.m_modulo.eliminarOpcion(args.parametrizacion_modulos.opcion.id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error eliminando la opcion', 500, {parametrizacion_modulo: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Opcion eliminada correctamente", 200, {parametrizacion_modulos: {opciones_modulo: {}}}));

    });
};


Modulos.prototype.eliminarVariable = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    var variable_id = args.parametrizacion_modulos.variable_id; 

    if (variable_id === undefined && variable_id.length === '') {
        res.send(G.utils.r(req.url, 'El id de la variable no esta definida', 500, {parametrizacion_modulos: {}}));
        return;
    }

    that.m_modulo.eliminarVariable(variable_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error eliminando la variable', 500, {parametrizacion_modulo: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Variable eliminada correctamente", 200, {parametrizacion_modulos: {variablees_modulo: {}}}));

    });
};


Modulos.prototype.listarVariablesPorModulo = function(req, res) {
    var that = this;
    var args = req.body.data;
    var modulo = args.parametrizacion_modulos.modulo_id;

    if (modulo === undefined) {
        res.send(G.utils.r(req.url, 'El id del modulo no esta definido', 500, {parametrizacion_modulos: {}}));
        return;
    }


    that.m_modulo.listarVariablesPorModulo(modulo, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las variables del modulo', 500, {parametrizacion_modulo: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Listado de variables por modulo", 200, {parametrizacion_modulos: {variables_modulo: rows}}));

    });
};


Modulos.prototype.habilitarModuloEnEmpresas = function(req, res) {
    var that = this;
    var args = req.body.data;

    var empresas_modulos = args.parametrizacion_modulos.empresas_modulos;
    var modulo_id = args.parametrizacion_modulos.modulo_id;

    if (empresas_modulos === undefined && empresas_modulos.length === 0) {
        res.send(G.utils.r(req.url, 'No se a seleccionado ninguna empresa', 500, {parametrizacion_modulos: {}}));
        return;
    }
    
    if (modulo_id === undefined && modulo_id.length === 0) {
        res.send(G.utils.r(req.url, 'El id del modulo no se encontro', 500, {parametrizacion_modulos: {}}));
        return;
    }

    

    that.m_modulo.habilitarModuloEnEmpresas(req.session.user.usuario_id, empresas_modulos, function(err, rows, ids) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error habilitando las empresas para el modulo', 500, {parametrizacion_modulo: {}}));
            return;
        }
        
        res.send(G.utils.r(req.url, "Se habilito el modulo en las empresas seleccionadas", 200, {parametrizacion_modulos: {ids:ids}}));
        
    });

};



Modulos.prototype.listarModulosPorEmpresa = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.parametrizacion_roles.empresa_id === undefined && args.parametrizacion_roles.empresa_id.length === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido', 500, {parametrizacion_roles: {}}));
        return;
    }
    var empresa_id = args.parametrizacion_roles.empresa_id;


    that.m_modulo.listarModulosPorEmpresa(empresa_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los modulos de la empresa', 500, {parametrizacion_roles: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Listado de modulos", 200, {parametrizacion_roles: {modulos_empresas: rows}}));

    });
};


//lista los roles relacionados al modulo y la empresa
Modulos.prototype.listarRolesPorModulo = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.parametrizacion_modulos.empresa_id === undefined && args.parametrizacion_modulos.empresa_id.length === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido', 500, {parametrizacion_modulos: {}}));
        return;
    }
    
    if (args.parametrizacion_modulos.modulo_id === undefined && args.parametrizacion_modulos.modulo_id.length === '') {
        res.send(G.utils.r(req.url, 'El id del modulo no esta definido', 500, {parametrizacion_modulos: {}}));
        return;
    }
    
    var empresa_id = args.parametrizacion_modulos.empresa_id;
    var modulo_id = args.parametrizacion_modulos.modulo_id;

    that.m_modulo.listarRolesPorModulo(modulo_id, empresa_id, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los roles del modulo', 500, {parametrizacion_modulos: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Listado de roles", 200, {parametrizacion_modulos: {roles: rows}}));

    });
};

Modulos.prototype.esModuloPadre = function(req, res){
    var that = this;
    var args = req.body.data;

    if (args.parametrizacion_modulos.modulo_id === undefined && args.parametrizacion_modulos.modulo_id.length === '') {
        res.send(G.utils.r(req.url, 'El id del modulo no esta definido', 500, {parametrizacion_modulos: {}}));
        return;
    }
    
    var modulo_id = args.parametrizacion_modulos.modulo_id;

    that.m_modulo.esModuloPadre(modulo_id, function(err, esPadre) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los roles del modulo', 500, {parametrizacion_modulos: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Listado de roles", 200, {parametrizacion_modulos: {esPadre: esPadre}}));

    });
};


Modulos.$inject = ["m_modulo"];

module.exports = Modulos;