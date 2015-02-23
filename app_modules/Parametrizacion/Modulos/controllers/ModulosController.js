
var Modulos = function(m_modulo) {

    console.log("Modulo parametrizacion modulos  Cargado ******************* ");

    this.m_modulo = m_modulo;
};


Modulos.prototype.listar_modulos = function(req, res) {

    var that = this;


    var args = req.body.data;


    that.m_modulo.listar_modulos(function(err, lista_modulos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Modulos', 500, {modulos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Modulos del sistema', 200, {modulos: lista_modulos}));
        }
    });
};

Modulos.prototype.guardarModulo = function(req, res) {
    var that = this;

    var args = req.body.data;

    var modulo = args.modulo;

    var validacion = __validarCreacionModulo(modulo);
    
    if(!validacion.valido){
        res.send(G.utils.r(req.url, validacion.msj, 403, {modulo:{}}));
        return;
    }
    
    that.m_modulo.guardarModulo(modulo, function(err, result){
        
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

    if (modulo.state === undefined || modulo.state.length === 0) {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener un estado";
        return validacion;
    }

    if (modulo.descripcion === undefined || modulo.descripcion.length === 0) {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener una descripcion";
        return validacion;
    }

    if (!modulo.parent && !modulo.icon) {
        validacion.valido = false;
        validacion.msj = "El modulo debe tener icono";
        return validacion;
    }

    return validacion;

};


Modulos.$inject = ["m_modulo"];

module.exports = Modulos;