
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
            res.send(G.utils.r(req.url, 'Lista de Modulos del sistema', 200, {parametrizacion_modulos:{modulos: lista_modulos}}));
        }
    });
};

Modulos.prototype.obtenerModulosPorId = function(req, res) {

    var that = this;


    var args = req.body.data;
    
    if (args.parametrizacion_modulos.modulos_id === undefined && args.parametrizacion_modulos.modulos_id.length === '') {
        res.send(G.utils.r(req.url, 'El id del modulo no esta definido', 500, {parametrizacion_modulos: {}}));
        return validacion;
    }

    that.m_modulo.obtenerModulosPorId(args.parametrizacion_modulos.modulos_id, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error buscando el modulo', 500, {parametrizacion_modulos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Modulo encontrado', 200, {parametrizacion_modulos:{modulos: rows}}));
        }
    });
};

Modulos.prototype.guardarModulo = function(req, res) {
    var that = this;

    var args = req.body.data;

    var modulo = args.parametrizacion_modulos.modulo;

    var validacion = __validarCreacionModulo(modulo);

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
        var id;
        if (rows.length > 0 && rows[0].id) {
            id = rows[0].id;
        }
        modulo.id = id;
        res.send(G.utils.r(req.url, "Modulo creado con exito", 200, {parametrizacion_modulo: {modulo: modulo}}));
        console.log("resultado de guardar el modulo ", rows);
    });

};

function __validarCreacionModulo(modulo) {
    var validacion = {
        valido: true,
        msj: ""
    };

    if (modulo.parent && modulo.parent.length === '') {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener un modulo padre valido";
        return validacion;
    }

    if (modulo.nombre === undefined || modulo.nombre.length === 0) {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener un nombre";
        return validacion;
    }

    if (modulo.state === undefined) {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener un estado";
        return validacion;
    }

    if (modulo.observacion === undefined || modulo.observacion.length === 0) {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener una descripcion";
        return validacion;
    }


    return validacion;

}
;


Modulos.$inject = ["m_modulo"];

module.exports = Modulos;