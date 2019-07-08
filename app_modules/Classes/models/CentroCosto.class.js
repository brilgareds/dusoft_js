function CentroCosto() {
        this._id = '';
        this._nombre = '';
        this._direccion = '';
        this._telefono = '';
        this._email = '';
    }

    CentroCosto.prototype.get_id = function() {
        return this._id;
    }

    CentroCosto.prototype.set_id= function(value) {
        this._id = value;
    }

    CentroCosto.prototype.get_nombre = function() {
        return this._nombre;
    }

    CentroCosto.prototype.set_nombre= function(value) {
        this._nombre = value;
    }

    CentroCosto.prototype.get_direccion = function() {
        return this._direccion;
    }

    CentroCosto.prototype.set_direccion= function(value) {
        this._direccion = value;
    }

    CentroCosto.prototype.get_telefono = function() {
        return this._telefono;
    }

    CentroCosto.prototype.set_telefono= function(value) {
        this._telefono = value;
    }

    CentroCosto.prototype.get_email = function() {
        return this._email;
    }

    CentroCosto.prototype.set_email= function(value) {
        this._email = value;
    }


module.exports = new CentroCosto;
