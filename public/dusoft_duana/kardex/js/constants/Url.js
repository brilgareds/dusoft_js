   define(["angular"], function(angular){
	var Url = angular.module('Url', []);

	var BASE_URL = "/api"; 


    var data = {
	  'API': {
	    'BASE_URL': BASE_URL,
         'KARDEX':{
	    	"LISTAR_PRODUCTOS":BASE_URL+"/Kardex/listarProductos",
	    	"OBTENER_MOVIMIENTO":BASE_URL+"/Kardex/obtenerMovimientosProducto"
	    }
	  }
	}

	angular.forEach(data,function(key,value) {
	  Url.constant(value,key);
	});


	return Url;
});
