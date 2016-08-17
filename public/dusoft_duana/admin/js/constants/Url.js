   define(["angular"], function(angular){
	
    var Url = angular.module('Url', []);

    var BASE_URL = "/api"; 
       
    var BASE_URL_IMG = "/images";

    var data = {
	  'API': {
	    'ADMIN':{
                'INICIALIZAR_APLICACION': BASE_URL+"/Admin/inicializarAplicacion",
                'OBTENER_CONFIGURACION_REPORTE': BASE_URL+"/Admin/ReportesAdmin/obtenerConfiguracionReporte"
	    },
            'MODULOS':{
                'OBTENER_CANTIDAD_MODULOS': BASE_URL+"/Modulos/obtenerCantidadModulos"
            }
	  },
          'STATIC' :{
              'BASE_IMG' : BASE_URL_IMG,
              'RUTA_AVATAR' : BASE_URL_IMG+"/Usuarios/Avatars/"
          }
	};

	angular.forEach(data,function(key,value) {
	  Url.constant(value,key);
	});


	return Url;
});
