function obtenerNombre(obj) {
    return obj.codigo + " - " + obj.nombre;
}


function formatMoney(num) {
    if (num >= 0)
        return "$ " + format(num)
    return "";
}

var i = 1;

function count(precio) {
    if (precio >= 0)
        return i++;
    return "";
}

function format(input)
{
    var num = input.replace(/\./g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
       // input.value = num;
    }
    return num;
}
