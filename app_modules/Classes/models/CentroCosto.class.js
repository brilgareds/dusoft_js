class CentroCosto {
    constructor () {
        this._id = '';
        this._nombre = '';
        this._direccion = '';
        this._telefono = '';
        this._email = '';
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get nombre() {
        return this._nombre;
    }

    set nombre(value) {
        this._nombre = value;
    }

    get direccion() {
        return this._direccion;
    }

    set direccion(value) {
        this._direccion = value;
    }

    get telefono() {
        return this._telefono;
    }

    set telefono(value) {
        this._telefono = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }
}

module.exports = new CentroCosto;
