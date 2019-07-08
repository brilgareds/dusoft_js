
class ListaResponsablesTributarias {
    constructor(){
        this._codigo = "";
        this._nombre = "";
        this._descripcion = "";
    }


    get codigo() {
        return this._codigo;
    }

    set codigo(value) {
        this._codigo = value;
    }

    get nombre() {
        return this._nombre;
    }

    set nombre(value) {
        this._nombre = value;
    }

    get descripcion() {
        return this._descripcion;
    }

    set descripcion(value) {
        this._descripcion = value;
    }
}
module.exports = new ListaResponsablesTributarias;
