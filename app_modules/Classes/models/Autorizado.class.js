
function Autorizado() {

        this._razonSocial = '';
        this._tipoIdentificacion = 0;
        this._identificacion = 0;
        this._digitoVerificacion = 0;
        }


    Autorizado.prototype.get_razonSocial = function() {
        return this._razonSocial;
    }

    Autorizado.prototype.set_razonSocial= function(value) {
        this._razonSocial = value;
    }

    Autorizado.prototype.get_tipoIdentificacion = function() {
        return this._tipoIdentificacion;
    }

    Autorizado.prototype.set_tipoIdentificacion= function(value) {
        this._tipoIdentificacion = value;
    }

    Autorizado.prototype.get_identificacion = function() {
        return this._identificacion;
    }

    Autorizado.prototype.set_identificacion= function(value) {
        this._identificacion = value;
    }

    Autorizado.prototype.get_digitoVerificacion = function() {
        return this._digitoVerificacion;
    }

    Autorizado.prototype.set_digitoVerificacion= function(value) {
        this._digitoVerificacion = value;
    }


module.exports = new Autorizado;
