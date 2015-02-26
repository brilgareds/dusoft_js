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
	    },
            'MODULOS':{
                'LISTAR_MODULOS': BASE_URL+"/Modulos/listarModulos",
                'GUARDAR_MODULO': BASE_URL+"/Modulos/guardarModulo",
                'OBTENER_MODULOS_POR_ID' : BASE_URL+"/Modulos/obtenerModulosPorId",
                'LISTAR_OPCIONES' : BASE_URL+"/Modulos/listarOpcionesPorModulo",
                'GUARDAR_OPCION' : BASE_URL+"/Modulos/guardarOpcion",
                'ELIMINAR_OPCION' : BASE_URL+"/Modulos/eliminarOpcion"
            }
	  }
	};

	angular.forEach(data,function(key,value) {
	  Url.constant(value,key);
	});


	return Url;
});
