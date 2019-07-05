
class Entrega {
    get fechaSalidaProductos() {
        return this._fechaSalidaProductos;
    }

    set fechaSalidaProductos(value) {
        this._fechaSalidaProductos = value;
    }

    get horaSalidaProductos() {
        return this._horaSalidaProductos;
    }

    set horaSalidaProductos(value) {
        this._horaSalidaProductos = value;
    }

    get tieneTransportista() {
        return this._tieneTransportista;
    }

    set tieneTransportista(value) {
        this._tieneTransportista = value;
    }

    get transportista() {
        return this._transportista;
    }

    set transportista(value) {
        this._transportista = value;
    }

    get direccionEntrega() {
        return this._direccionEntrega;
    }

    set direccionEntrega(value) {
        this._direccionEntrega = value;
    }

    get condicionesEntraga() {
        return this._condicionesEntraga;
    }

    set condicionesEntraga(value) {
        this._condicionesEntraga = value;
    }
    constructor() {
        this._fechaSalidaProductos = '';
        this._horaSalidaProductos = '';
        this._tieneTransportista = false;
        this._transportista = [];
        this._direccionEntrega = [];
        this._condicionesEntraga = [];
    }
}

module.exports = new Entrega;

