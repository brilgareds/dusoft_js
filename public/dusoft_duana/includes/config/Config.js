   define(["angular"], function(angular){
	var Config = angular.module('Config', []);

	var BASE_URL = "/api"; 


    var data = {
	  'API': {
	    'BASE_URL': BASE_URL,
         'DOCUMENTOS_TEMPORALES' : {
	    	'LISTAR_DOCUMENTOS_TEMPORALES_CLIENTES': BASE_URL+'/movBodegas/E008/consultarDocumentosTemporalesClientes',	
	    	'LISTAR_DOCUMENTOS_TEMPORALES_FARMACIAS': BASE_URL+'/movBodegas/E008/consultarDocumentosTemporalesFarmacias',
            'CONSULTAR_DOCUMENTO_TEMPORAL_CLIENTES': BASE_URL+'/movBodegas/E008/consultarDocumentoTemporalClientes',
            'CONSULTAR_DOCUMENTO_TEMPORAL_FARMACIAS': BASE_URL+'/movBodegas/E008/consultarDocumentoTemporalFarmacias',
            'CONSULTAR_DOCUMENTOS_USUARIOS': BASE_URL+'/movBodegas/consultarDocumentosUsuario',
            'ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_CLIENTES': BASE_URL+"/movBodegas/E008/actualizarTipoDocumentoTemporalClientes",
            'ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_FARMACIAS': BASE_URL+"/movBodegas/E008/actualizarTipoDocumentoTemporalFarmacias",
            'AUDITAR_DOCUMENTO_TEMPORAL':BASE_URL+"movBodegas/E008/auditarProductoDocumentoTemporal"
	    },
	    'PEDIDOS' : {
	    	'LISTAR_PEDIDOS': BASE_URL+'/PedidosClientes/listarPedidos',	
	    	'LISTAR_PEDIDOS_FARMACIAS': BASE_URL+'/PedidosFarmacias/listarPedidos',	
	    	'ASIGNAR_RESPONSABLE_CLIENTE':BASE_URL+'/PedidosClientes/asignarResponsable',
	    	'ASIGNAR_RESPONSABLE_FARMACIA':BASE_URL+'/PedidosFarmacias/asignarResponsable',
	    	'LISTAR_EMPRESAS':BASE_URL+'/PedidosFarmacias/obtenerEmpresas',
	    	'DISPONIBILIDAD':BASE_URL+'/Pedidos/consultarDisponibilidad'
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
