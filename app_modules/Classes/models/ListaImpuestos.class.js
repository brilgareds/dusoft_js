
function ListaImpuestos() {
        this.codigo = '';
        this.nombre = '';
        this.baseGravable = 0.0;
        this.porcentaje = 0.0;
        this.valor = 0.0;
        this.codigoUnidad = '';
        this.unidad = 0.0;

    }

    ListaImpuestos.prototype.get_codigo = function() {
        return this.codigo;
    };

    ListaImpuestos.prototype.set_codigo = function(value) {
        this.codigo = value;
    };

    ListaImpuestos.prototype.get_nombre = function() {
        return this.nombre;
    };

    ListaImpuestos.prototype.set_nombre = function(value) {
        this.nombre = value;
    };

    ListaImpuestos.prototype.get_baseGravable = function() {
        return this.baseGravable;
    };

    ListaImpuestos.prototype.set_baseGravable = function(value) {
        this.baseGravable = value;
    };

    ListaImpuestos.prototype.get_porcentaje = function() {
        return this.porcentaje;
    };

    ListaImpuestos.prototype.set_porcentaje = function(value) {
        this.porcentaje = value;
    };

    ListaImpuestos.prototype.get_valor = function() {
        return this.valor;
    };

    ListaImpuestos.prototype.set_valor = function(value) {
        this.valor = value;
    };

    ListaImpuestos.prototype.get_codigoUnidad = function() {
        return this.codigoUnidad;
    };

    ListaImpuestos.prototype.set_codigoUnidad = function(value) {
        this.codigoUnidad = value;
    };

    ListaImpuestos.prototype.get_unidad = function() {
        return this.unidad;
    };

    ListaImpuestos.prototype.set_unidad = function(value) {
        this.unidad = value;
    };

module.exports = new ListaImpuestos;
