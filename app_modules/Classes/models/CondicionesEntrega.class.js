function CondicionesEntrega() {
        this._id = "";
        this._incoterm = "";
        this._metodoPago = "";
        this._riesgoPerdida = "";
    }

    CondicionesEntrega.prototype.get_id = function() {
        return this._id;
    }

    CondicionesEntrega.prototype.set_id= function(value) {
        this._id = value;
    }

    CondicionesEntrega.prototype.get_incoterm = function() {
        return this._incoterm;
    }

    CondicionesEntrega.prototype.set_incoterm= function(value) {
        this._incoterm = value;
    }

    CondicionesEntrega.prototype.get_metodoPago = function() {
        return this._metodoPago;
    }

    CondicionesEntrega.prototype.set_metodoPago= function(value) {
        this._metodoPago = value;
    }

    CondicionesEntrega.prototype.get_riesgoPerdida = function() {
        return this._riesgoPerdida;
    }

    CondicionesEntrega.prototype.set_riesgoPerdida= function(value) {
        this._riesgoPerdida = value;
    }


module.exports = new CondicionesEntrega;
