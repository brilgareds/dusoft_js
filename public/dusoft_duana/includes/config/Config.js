   define(["angular"], function(angular){
	var Config = angular.module('Config', []);

	var BASE_URL = "http://10.0.2.191:3002/api"; 

    var data = {
	  'API': {
	    'BASE_URL': BASE_URL,
	    'PEDIDOS' : {
	    	'LISTAR_PEDIDOS': BASE_URL+'/PedidosClientes/listarPedidos',	
	    	'LISTAR_PEDIDOS_FARMACIAS': BASE_URL+'/PedidosFarmacias/listarPedidos',	
	    	'ASIGNAR_RESPONSABLE_CLIENTE':BASE_URL+'/PedidosClientes/asignarResponsable',
	    	'ASIGNAR_RESPONSABLE_FARMACIA':BASE_URL+'/PedidosFarmacias/asignarResponsable',
	    	'LISTAR_EMPRESAS':BASE_URL+'/PedidosFarmacias/obtenerEmpresas'
	    },
	    'TERCEROS':{
	    	'LISTAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/listar",
	    	'CREAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/crear",
	    	'MODIFICAR_OPERARIOS':BASE_URL+"/Terceros/operariosBodega/modificar",
	    },
	    'USUARIOS':{
	    	'LISTAR_USUARIOS':BASE_URL+"/Usuarios/listar"
	    },
	    'KARDEX':{
	    	"LISTAR_PRODUCTOS":BASE_URL+"/Kardex/listarProductos",
	    	"OBTENER_MOVIMIENTO":BASE_URL+"/Kardex/obtenerMovimientosProducto"
	    }
	  }
	}

	angular.forEach(data,function(key,value) {
	  Config.constant(value,key);
	});


	return Config;
});
