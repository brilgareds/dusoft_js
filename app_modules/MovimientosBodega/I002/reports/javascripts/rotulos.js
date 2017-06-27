function obtenerNombre(obj){
	return obj.codigo +" - "+obj.nombre;
}

function formatMoney (num) {
    var numero = num || 0;
    return "$" + numero.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}
