function ListaCorrecciones () {
    this._id = 0;
    this._codigo = '';
    this._descripcion = '';
}

ListaCorrecciones.prototype.get_id = function () {
    return this._id;
};

ListaCorrecciones.prototype.set_id = function (value) {
    this._id = value;
};

ListaCorrecciones.prototype.get_codigo = function () {
    return this._codigo;
};

ListaCorrecciones.prototype.set_codigo = function (value) {
    this._codigo = value;
};

ListaCorrecciones.prototype.get_descripcion = function () {
    return this._descripcion;
};

ListaCorrecciones.prototype.set_descripcion = function (value) {
    this._descripcion = value;
};

module.exports = new ListaCorrecciones;
