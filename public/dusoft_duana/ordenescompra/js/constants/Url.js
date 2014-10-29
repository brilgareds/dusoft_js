   define(["angular"], function(angular){
	var Url = angular.module('Url', []);

	var BASE_URL = "/api"; 


    var data = {
	  'API': {
	    'BASE_URL': BASE_URL,
         'ORDENES_COMPRA' : {
	    	'LISTAR_ORDENES_COMPRAS': BASE_URL+'/OrdenesCompra/listarOrdenesCompra',		    	
	    }
	  }
	}

	angular.forEach(data,function(key,value) {
	  Url.constant(value,key);
	});


	return Url;
});
