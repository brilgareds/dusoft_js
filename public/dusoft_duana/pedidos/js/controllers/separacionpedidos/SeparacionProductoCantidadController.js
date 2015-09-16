
define(["angular", "js/controllers",'includes/slide/slideContent'], function(angular, controllers){
    
    controllers.controller('SeparacionProductoCantidadController',[
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        "pedido",
        function($scope,$rootScope,Request,
                 API,socket,AlertService,$modal,
                 localStorageService,$state, pedido){
         
            var self = this;
            console.log("pedido ", pedido);
            
            self.init = function(callback){
                $scope.rootVentanaCantidad = {};
                $scope.rootVentanaCantidad.pedido = pedido;
                
                
            };
            
            
            
           self.validarLote = function(){
               
                var producto = $scope.rootVentanaCantidad.pedido.getProductoSeleccionado();
                var obj = {};
                var cantidadIngresada = parseInt(producto.getLote().getCantidadIngresada());
	        cantidadIngresada = (cantidadIngresada > 0)? cantidadIngresada : 0;
		
		if(cantidadIngresada === 0){
			obj.valido =  false;
			obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.";
			return obj;
			
		}
		
		if(cantidadIngresada > producto.getCantidadSolicitada()){
			obj.valido = false;
			obj.mensaje = "La cantidad ingresada, debe ser menor o igual a la cantidad solicitada!!.";
			return obj;
		}
		
		if(cantidadIngresada > producto.getCantidadPendiente()){
			obj.valido =  false;
			obj.mensaje = "La cantidad ingresada, NO PUEDE SER MAYOR A la cantidad PENDIENTE!!.";
			return obj;
		}
		
		if(cantidadIngresada > producto.getDisponible()){
			obj.valido =  false;
			obj.mensaje = "La cantidad ingresada, NO PUEDE SER MAYOR A la Disponibilidad en BODEGA!!.";
			return obj;
		}
		
		if(cantidadIngresada > producto.getLote().getExistenciaActual()){
			obj.valido  = false;
			obj.mensaje = "La cantidad ingresada, debe ser menor al stock de la bodega!!.";
			return obj;
		}
		
		obj.valido = true;
		
		return obj;
	    };
            
            
            $scope.onGuardarCantidad = function(){
                var validacion = self.validarLote();
                
                console.log("validacion", validacion);
                
            };
            
            
            self.init(function(){
                
            });
            
        }
        
    ]);
});

