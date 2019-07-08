function GruposImpuestos () {
    this._codigo = '';
    this._total = 0;
    this._listaImpuestos = {};
}

GruposImpuestos.prototype.get_Codigo = function () {
    return this._codigo;
};
GruposImpuestos.prototype.get_Total = function () {
    return this._total;
};
GruposImpuestos.prototype.get_Listaimpuestos = function () {
    return this._listaImpuestos;
};

GruposImpuestos.prototype.set_Codigo = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length() > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
    }
    if (typeOf(nuevoValor) === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
    }
    if (respuesta.errorCount > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this._codigo = nuevoValor;
    return respuesta;
};

GruposImpuestos.prototype.set_Total = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length() > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
    }
    if (typeOf(nuevoValor) === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
    }
    if (respuesta.errorCount > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this._total = nuevoValor;
    return respuesta;
};

GruposImpuestos.prototype.set_Listaimpuestos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length() > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
    }
    if (typeOf(nuevoValor) === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
    }
    if (respuesta.errorCount > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this._listaImpuestos = nuevoValor;
    return respuesta;
};

module.exports = new GruposImpuestos;
