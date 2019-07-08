
function Entrega()
    {
        this._fechaSalidaProductos = '';
        this._horaSalidaProductos = '';
        this._tieneTransportista = false;
        this._transportista = [];
        this._direccionEntrega = [];
        this._condicionesEntraga = [];
    }
    
    Entrega.prototype.get_fechaSalidaProductos = function() {
        return this._fechaSalidaProductos;
    }

    Entrega.prototype.set_fechaSalidaProductos = function(value) {
        this._fechaSalidaProductos = value;
    }

    Entrega.prototype.get_horaSalidaProductos = function() {
        return this._horaSalidaProductos;
    }

    Entrega.prototype.set_horaSalidaProductos = function(value) {
        this._horaSalidaProductos = value;
    }

    Entrega.prototype.get_tieneTransportista = function() {
        return this._tieneTransportista;
    }

    Entrega.prototype.set_tieneTransportista = function(value) {
        this._tieneTransportista = value;
    }

    Entrega.prototype.get_transportista = function() {
        return this._transportista;
    }

    Entrega.prototype.set_transportista = function(value) {
        this._transportista = value;
    }

    Entrega.prototype.get_direccionEntrega = function() {
        return this._direccionEntrega;
    }

    Entrega.prototype.set_direccionEntrega = function(value) {
        this._direccionEntrega = value;
    }

    Entrega.prototype.get_condicionesEntraga = function() {
        return this._condicionesEntraga;
    }

    Entrega.prototype.set_condicionesEntraga = function(value) {
        this._condicionesEntraga = value;
    }
    
module.exports = new Entrega;

