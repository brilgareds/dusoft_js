function ListaAnticipos() {
        this._id = "";
        this._valor = 0;
        this._fechaRecibo = "";
        this._fechaPago = "";
        this._horaPago = "";
        this._instrucciones = "";
    }

    ListaAnticipos.prototype.get_id = function() {
        return this._id;
    }

    ListaAnticipos.prototype.set_id = function(value) {
        this._id = value;
    }

    ListaAnticipos.prototype.get_valor = function() {
        return this._valor;
    }

    ListaAnticipos.prototype.set_valor = function(value) {
        this._valor = value;
    }

    ListaAnticipos.prototype.get_fechaRecibo = function() {
        return this._fechaRecibo;
    }

    ListaAnticipos.prototype.set_fechaRecibo = function(value) {
        this._fechaRecibo = value;
    }

    ListaAnticipos.prototype.get_fechaPago = function() {
        return this._fechaPago;
    }

    ListaAnticipos.prototype.set_fechaPago = function(value) {
        this._fechaPago = value;
    }

    ListaAnticipos.prototype.get_horaPago = function() {
        return this._horaPago;
    }

    ListaAnticipos.prototype.set_horaPago = function(value) {
        this._horaPago = value;
    }

    ListaAnticipos.prototype.get_instrucciones = function() {
        return this._instrucciones;
    }

    ListaAnticipos.prototype.set_instrucciones = function(value) {
        this._instrucciones = value;
    }

  module.exports = new ListaAnticipos;
