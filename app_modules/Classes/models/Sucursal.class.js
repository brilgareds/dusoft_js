class Sucursal {
    constructor () {
        this._id = '';
        this._numeroMatricula = 0;
        this._razonSocial = '';
        this._prefijoFacturacion = '';
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

    get numeroMatricula() {
        return this._numeroMatricula;
    }

    set numeroMatricula(value) {
        this._numeroMatricula = value;
    }

    get razonSocial() {
        return this._razonSocial;
    }

    set razonSocial(value) {
        this._razonSocial = value;
    }

    get prefijoFacturacion() {
        return this._prefijoFacturacion;
    }

    set prefijoFacturacion(value) {
        this._prefijoFacturacion = value;
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
module.exports = new Sucursal;
