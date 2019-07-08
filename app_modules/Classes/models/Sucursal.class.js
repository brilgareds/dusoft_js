 function Sucursal() {

        this._id = '';
        this._numeroMatricula = 0;
        this._razonSocial = '';
        this._prefijoFacturacion = '';
        this._direccion = '';
        this._telefono = '';
        this._email = '';
   
    Sucursal.prototype.getId = function () {
        return this._id;
    };

    Sucursal.prototype.setId = function (value) {
        this._id = value;
    };

    Sucursal.prototype.getNumeroMatricula = function () {
        return this._numeroMatricula;
    };

    Sucursal.prototype.setNumeroMatricula = function (value) {
        this._numeroMatricula = value;
    };

    Sucursal.prototype.getRazonSocial = function () {
        return this._razonSocial;
    };

    Sucursal.prototype.setRazonSocial = function (value) {
        this._razonSocial = value;
    };

    Sucursal.prototype.getPrefijoFacturacion = function () {
        return this._prefijoFacturacion;
    };

    Sucursal.prototype.setPrefijoFacturacion = function (value) {
        this._prefijoFacturacion = value;
    };

    Sucursal.prototype.getDireccion = function () {
        return this._direccion;
    };

    Sucursal.prototype.setDireccion = function (value) {
        this._direccion = value;
    };

    Sucursal.prototype.getTelefono = function () {
        return this._telefono;
    };

    Sucursal.prototype.setTelefono = function (value) {
        this._telefono = value;
    };

    Sucursal.prototype.getEmail = function () {
        return this._email;
    };

    Sucursal.prototype.setEmail = function (value) {
        this._email = value;
    };
};
module.exports = new Sucursal;
