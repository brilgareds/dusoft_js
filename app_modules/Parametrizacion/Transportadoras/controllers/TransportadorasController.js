
var Transportadoras = function(transportadoras) {

    this.m_transportadoras = transportadoras;
};


Transportadoras.prototype.listarTransportadoras = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.transportadoras === undefined || args.transportadoras.termino_busqueda === undefined ) {
        res.send(G.utils.r(req.url, 'termino_busqueda no esta definido', 404, {}));
        return;
    }
    
    var termino_busqueda = args.transportadoras.termino_busqueda;

    that.m_transportadoras.listar_transportadoras(termino_busqueda, function(err, lista_transportadoras) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las transportadoras', 500, {transportadoras: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de transportadoras', 200, {transportadoras: lista_transportadoras}));
        }
    });
};


Transportadoras.prototype.consultarTransportadora = function(req, res) {

    var that = this;
    
    var args = req.body.data;

    if (args.transportadoras === undefined || args.transportadoras.id === undefined ) {
        res.send(G.utils.r(req.url, 'id no esta definido', 404, {}));
        return;
    }
    
    if (args.transportadoras.id === '' ) {
        res.send(G.utils.r(req.url, 'id esta vacio', 404, {}));
        return;
    }
    
    var transportadora_id = args.transportadoras.id;

    that.m_transportadoras.consultar_transportadora(transportadora_id, function(err, lista_transportadoras) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando la transportadora', 500, {transportadoras: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Transportadora', 200, {transportadoras: lista_transportadoras}));
        }
    });
};


Transportadoras.prototype.ingresarTransportadora = function(req, res) {

    var that = this;
    
    var args = req.body.data;

    if (args.transportadoras === undefined || args.transportadoras.descripcion === undefined || args.transportadoras.placa_vehiculo === undefined || args.transportadoras.sw_carropropio === undefined || args.transportadoras.sw_solicitar_guia === undefined) {
        res.send(G.utils.r(req.url, 'descripcion,placa_vehiculo, sw_solicitar_guia o sw_carropropio no esta definido', 404, {}));
        return;
    }
    
    if (args.transportadoras.descripcion === '' || args.transportadoras.placa_vehiculo === '' || args.transportadoras.sw_carropropio === '' || args.transportadoras.sw_solicitar_guia === '') {
        res.send(G.utils.r(req.url, 'descripcion,placa_vehiculo, sw_solicitar_guia o sw_carropropio esta vacio', 404, {}));
        return;
    }
    
    var descripcion = args.transportadoras.descripcion;
    var placa_vehiculo = args.transportadoras.placa_vehiculo;
    var sw_solicitar_guia = args.transportadoras.sw_solicitar_guia;
    var sw_carropropio = args.transportadoras.sw_carropropio;

    that.m_transportadoras.insertar_transportadora(descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio, function(err, lista_transportadoras) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error ingresando la transportadora', 500, {transportadoras: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Transportadora ingresada correctamente', 200, {transportadoras: lista_transportadoras}));
        }
    });
};


Transportadoras.prototype.modificarTransportadora = function(req, res) {

    var that = this;
    
    var args = req.body.data;

    if (args.transportadoras === undefined || args.transportadoras.id === undefined  || args.transportadoras.descripcion === undefined || args.transportadoras.placa_vehiculo === undefined || args.transportadoras.sw_carropropio === undefined || args.transportadoras.sw_solicitar_guia === undefined) {
        res.send(G.utils.r(req.url, 'id, descripcion,placa_vehiculo, sw_solicitar_guia o sw_carropropio no esta definido', 404, {}));
        return;
    }
    
    if (args.transportadoras.id === ''  || args.transportadoras.descripcion === '' || args.transportadoras.placa_vehiculo === '' || args.transportadoras.sw_carropropio === '' || args.transportadoras.sw_solicitar_guia === '') {
        res.send(G.utils.r(req.url, 'id, descripcion,placa_vehiculo, sw_solicitar_guia o sw_carropropio esta vacio', 404, {}));
        return;
    }
    
    var transportadora_id = args.transportadoras.id;
    var descripcion = args.transportadoras.descripcion;
    var placa_vehiculo = args.transportadoras.placa_vehiculo;
    var sw_solicitar_guia = args.transportadoras.sw_solicitar_guia;
    var sw_carropropio = args.transportadoras.sw_carropropio;

    that.m_transportadoras.actualizar_transportadora(transportadora_id, descripcion, placa_vehiculo, sw_solicitar_guia, sw_carropropio, function(err, lista_transportadoras) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error modificando la transportadora', 500, {transportadoras: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Transportadora modificada correctamente', 200, {transportadoras: lista_transportadoras}));
        }
    });
};


Transportadoras.prototype.inactivarTransportadora = function(req, res) {

    var that = this;
    
    var args = req.body.data;

    if (args.transportadoras === undefined || args.transportadoras.id === undefined  ) {
        res.send(G.utils.r(req.url, 'id  no esta definido', 404, {}));
        return;
    }
    
    if (args.transportadoras.id === ''  ) {
        res.send(G.utils.r(req.url, 'id esta vacio', 404, {}));
        return;
    }
    
    var transportadora_id = args.transportadoras.id;
    
    that.m_transportadoras.inactivar_transportadora(transportadora_id, function(err, lista_transportadoras) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error inactivando la transportadora', 500, {transportadoras: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Transportadora inactivada correctamente', 200, {transportadoras: lista_transportadoras}));
        }
    });
};

Transportadoras.$inject = ["m_transportadoras"];

module.exports = Transportadoras;