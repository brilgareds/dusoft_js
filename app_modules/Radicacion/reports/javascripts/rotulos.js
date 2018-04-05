function obtenerNombre(obj){
	return obj.codigo +" - "+obj.nombre;
}


function formatMoney (num) {
     if(num >= 0)
          return "$ " + num;
       return "";
}

var i=1;

function count(precio){
    if(precio >=0)
    return i++;
    return "";
}
