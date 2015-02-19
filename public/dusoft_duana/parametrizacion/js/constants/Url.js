   define(["angular"], function(angular){
	var Url = angular.module('Url', []);

	var BASE_URL = "/api"; 


    var data = {
	  'API': {
	    'TERCEROS':{
	    	'LISTAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/listar",
	    	'CREAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/crear",
	    	'MODIFICAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/modificar"
	    },
	    'USUARIOS':{
	    	'LISTAR_USUARIOS':BASE_URL+"/Usuarios/listar"
	    }
	  }
	};

	angular.forEach(data,function(key,value) {
	  Url.constant(value,key);
	});


	return Url;
});
