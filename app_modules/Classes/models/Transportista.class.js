class Transportista {
    constructor(){
        this._razonSocial = "";
        this._nombreRegistrado = "";
        this._tipoIdentificacion = 0;
        this._identificacion = 0;
        this._digitoVerificacion = 0;
        this._naturaleza = "";
        this._codigoRegimen = "";
        this._responsabilidadFiscal = "";
        this._codigoImpuesto = "";
        this._nombreImpuesto = "";
        this._telefono = "";
        this._email = "";
        this._contacto = {};
        this._direccion = {};
        this._direccionFiscal = {};
        this._listaResponsabilidadesTributarias = [];
        this._numeroMatricula = 0;
    }

    get razonSocial() {
        return this._razonSocial;
    }

    set razonSocial(value) {
        this._razonSocial = value;
    }

    get nombreRegistrado() {
        return this._nombreRegistrado;
    }

    set nombreRegistrado(value) {
        this._nombreRegistrado = value;
    }

    get tipoIdentificacion() {
        return this._tipoIdentificacion;
    }

    set tipoIdentificacion(value) {
        this._tipoIdentificacion = value;
    }

    get identificacion() {
        return this._identificacion;
    }

    set identificacion(value) {
        this._identificacion = value;
    }

    get digitoVerificacion() {
        return this._digitoVerificacion;
    }

    set digitoVerificacion(value) {
        this._digitoVerificacion = value;
    }

    get naturaleza() {
        return this._naturaleza;
    }

    set naturaleza(value) {
        this._naturaleza = value;
    }

    get codigoRegimen() {
        return this._codigoRegimen;
    }

    set codigoRegimen(value) {
        this._codigoRegimen = value;
    }

    get responsabilidadFiscal() {
        return this._responsabilidadFiscal;
    }

    set responsabilidadFiscal(value) {
        this._responsabilidadFiscal = value;
    }

    get codigoImpuesto() {
        return this._codigoImpuesto;
    }

    set codigoImpuesto(value) {
        this._codigoImpuesto = value;
    }

    get nombreImpuesto() {
        return this._nombreImpuesto;
    }

    set nombreImpuesto(value) {
        this._nombreImpuesto = value;
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

    get contacto() {
        return this._contacto;
    }

    set contacto(value) {
        this._contacto = value;
    }

    get direccion() {
        return this._direccion;
    }

    set direccion(value) {
        this._direccion = value;
    }

    get direccionFiscal() {
        return this._direccionFiscal;
    }

    set direccionFiscal(value) {
        this._direccionFiscal = value;
    }

    get listaResponsabilidadesTributarias() {
        return this._listaResponsabilidadesTributarias;
    }

    set listaResponsabilidadesTributarias(value) {
        this._listaResponsabilidadesTributarias = value;
    }

    get numeroMatricula() {
        return this._numeroMatricula;
    }

    set numeroMatricula(value) {
        this._numeroMatricula = value;
    }
}


  module.exports = new Transportista;
