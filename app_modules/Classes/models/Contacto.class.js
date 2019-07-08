
function Contacto() {
        this._nombre = '';
        this._telefono = '';
        this._fax = '';
        this._email = '';
        this._observaciones = '';

    }


    Contacto.prototype.get_nombre = function() {
        return this._nombre;
    }

    Contacto.prototype.set_nombre = function(value) {
        this._nombre = value;
    }

    Contacto.prototype.get_telefono = function() {
        return this._telefono;
    }

    Contacto.prototype.set_telefono = function(value) {
        this._telefono = value;
    }

    Contacto.prototype.get_fax = function() {
        return this._fax;
    }

    Contacto.prototype.set_fax = function(value) {
        this._fax = value;
    }

    Contacto.prototype.get_email = function() {
        return this._email;
    }

    Contacto.prototype.set_email = function(value) {
        this._email = value;
    }

    Contacto.prototype.get_observaciones = function() {
        return this._observaciones;
    }

    Contacto.prototype.set_observaciones = function(value) {
        this._observaciones = value;
    }

module.exports = new Contacto;

