
class Contacto {
    constructor() {
        this._nombre = '';
        this._telefono = '';
        this._fax = '';
        this._email = '';
        this._observaciones = '';

    }


    get nombre() {
        return this._nombre;
    }

    set nombre(value) {
        this._nombre = value;
    }

    get telefono() {
        return this._telefono;
    }

    set telefono(value) {
        this._telefono = value;
    }

    get fax() {
        return this._fax;
    }

    set fax(value) {
        this._fax = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get observaciones() {
        return this._observaciones;
    }

    set observaciones(value) {
        this._observaciones = value;
    }
}

module.exports = new Contacto;

