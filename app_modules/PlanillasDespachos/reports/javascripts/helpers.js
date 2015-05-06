
function formatMoney(num) {
    var numero = num || 0;
    return "$" + numero.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

function count(param) {
    return param.length;
}

function total_cajas(datos) {
    var total_cajas = 0;
    datos.forEach(function(obj) {
        total_cajas += obj.cantidad_cajas;
    });
    return total_cajas;
}

function total_neveras(datos) {
    var total_neveras = 0;
    datos.forEach(function(obj) {
        total_neveras += obj.cantidad_neveras;
    });
    return total_neveras;
}

/****************/
function getSubTotal(data) {
  var result = 0;
  data.items.forEach(function (i) { result += i.price * i.quantity; });

  return result;
}

function getTotal(data) {
  var result = 0;
  data.items.forEach(function (i) { result += i.price * i.quantity; });

  return result * 0.95;
}

function getTaxes(data) {
  var result = 0;
  data.items.forEach(function (i) { result += i.price * i.quantity; });

  return result * 0.05;
}


