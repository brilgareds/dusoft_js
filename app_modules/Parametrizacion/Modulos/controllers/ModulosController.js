
var Modulos = function(m_modulo) {

    console.log("Modulo parametrizacion modulos  Cargado ******************* ");

    this.m_modulo = m_modulo;
};


Modulos.prototype.listar_modulos = function(req, res) {

    var that = this;


    var args = req.body.data;


    that.m_modulo.listar_modulos(function(err, lista_modulos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Modulos', 500, {parametrizacion_modulos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Modulos del sistema', 200, {parametrizacion_modulos: {modulos: lista_modulos}}));
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

    __validarCreacionModulo(that, modulo, function(validacion) {

        if (!validacion.valido) {
            res.send(G.utils.r(req.url, validacion.msj, 403, {parametrizacion_modulos: {}}));
            return;
        }

        modulo.usuario_id = req.session.user.usuario_id;
        modulo.usuario_id_modifica = req.session.user.usuario_id;

        console.log("modulo a crear ", modulo);


        that.m_modulo.guardarModulo(modulo, function(err, rows) {
            if (err) {
                console.log("error guardando modulo ", err);
                res.send(G.utils.r(req.url, 'Error guardando el modulo', 500, {parametrizacion_modulo: {}}));
                return;
            }

            if (rows.length > 0 && rows[0].id) {
                modulo.id = rows[0].id;
            }

            console.log("modulo a regresar ", modulo);
            res.send(G.utils.r(req.url, "Modulo creado con exito", 200, {parametrizacion_modulo: {modulo: modulo}}));
        });
    });
};

Modulos.prototype.guardarOpcion = function(req, res) {
    var that = this;

    var args = req.body.data;

    var opcion = args.parametrizacion_modulos.opcion;

    __validarCreacionOpcion(that, opcion, function(validacion) {

        if (!validacion.valido) {
            res.send(G.utils.r(req.url, validacion.msj, 403, {parametrizacion_modulos: {}}));
            return;
        }

        opcion.usuario_id = req.session.user.usuario_id;
        opcion.usuario_id_modifica = req.session.user.usuario_id;

        that.m_modulo.guardarOpcion(opcion, function(err, rows) {
            if (err) {
                console.log("error guardando opcion ", err);
                res.send(G.utils.r(req.url, 'Error guardando la opcion', 500, {parametrizacion_modulo: {}}));
                return;
            }

            if (rows.length > 0 && rows[0].id) {
                opcion.id = rows[0].id;
            }

            console.log("opcion a regresar ", opcion);
            res.send(G.utils.r(req.url, "Opcion guardada con exito", 200, {parametrizacion_modulo: {opcion: opcion}}));
        });
    });
};


Modulos.prototype.listarOpcionesPorModulo = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.parametrizacion_modulos.modulo.id === undefined && aargs.parametrizacion_modulos.modulo.id.length === '') {
        res.send(G.utils.r(req.url, 'El id del modulo no esta definido', 500, {parametrizacion_modulos: {}}));
        return;
    }
    var modulo = args.parametrizacion_modulos.modulo.id;


    that.m_modulo.listarOpcionesPorModulo(modulo, function(err, rows) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las opciones del modulo', 500, {parametrizacion_modulo: {}}));
            return;
        }
        res.send(G.utils.r(req.url, "Listado de opciones por modulo", 200, {parametrizacion_modulos: {opciones_modulo: rows}}));
        
    });
};

Modulos.prototype.eliminarOpcion = function(req, res){
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
    that.m_modulo.obtenerModuloPorNombreOUrl(modulo.nombre.substring(0, 4), modulo.state.substring(0, 4), function(err, rows) {
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

                if (nombre_url === _nombre_url) {
                    validacion.valido = false;
                    validacion.msj = "El url del modulo no esta disponible";
                    callback(validacion);
                    return;
                }
            }

        }

        callback(validacion);


    });

};


function __validarCreacionOpcion(that, opcion, callback) {
    var validacion = {
        valido: true,
        msj: ""
    };

    if (opcion.modulo_id && opcion.modulo_id.length === '') {
        validacion.valido = false;
        validacion.msj = "La opcion debe tener un modulo asignado";
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
    that.m_modulo.obtenerOpcionPorNombre(opcion.nombre.substring(0, 4), function(err, rows) {
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

};

Modulos.$inject = ["m_modulo"];

module.exports = Modulos;