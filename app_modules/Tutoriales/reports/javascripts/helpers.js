
function formatMoney (num) {
    var numero = parseFloat(num) || 0;
    return "$" + numero.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}


