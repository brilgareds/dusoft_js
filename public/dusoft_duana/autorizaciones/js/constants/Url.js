   define(["angular"], function(angular){
	var Url = angular.module('Url', []);

	var BASE_URL = "/api"; 


    var data = {
	  'API': {
	    'BASE_URL': BASE_URL,
         'KARDEX':{
	    	"LISTAR_PRODUCTOS":BASE_URL+"/Kardex/listarProductos",
	    	"OBTENER_MOVIMIENTO":BASE_URL+"/Kardex/obtenerMovimientosProducto",
                'LISTAR_EMPRESAS':BASE_URL+'/PedidosFarmacias/listarFarmacias',
                'CENTROS_UTILIDAD_EMPRESAS':BASE_URL+'/CentrosUtilidad/listarCentrosUtilidadEmpresa',
                'BODEGAS_EMPRESA':BASE_URL+'/Bodegas/listarBodegasEmpresas',
                'CONSULTAR_EXISTENCIAS':BASE_URL+'/Kardex/consultarExistenciasProducto',
                'LISTAR_EMPRESAS_FARMACIAS':BASE_URL+'/Empresas/listarEmpresasFarmacias'
	    }
	  }
	};

	angular.forEach(data,function(key,value) {
	  Url.constant(value,key);
	});


	return Url;
});
