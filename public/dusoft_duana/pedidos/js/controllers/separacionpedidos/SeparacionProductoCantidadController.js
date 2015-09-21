
define(["angular", "js/controllers",'includes/slide/slideContent'], function(angular, controllers){
    
    controllers.controller('SeparacionProductoCantidadController',[
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        "pedido","Usuario", "$modalInstance","SeparacionService",
        function($scope,$rootScope,Request,
                 API,socket,AlertService,$modal,
                 localStorageService,$state, pedido, Usuario, $modalInstance,
                 SeparacionService){
         
            var self = this;
            console.log("pedido ", pedido);
            
            self.init = function(callback){
                $scope.rootVentanaCantidad = {};
                $scope.rootVentanaCantidad.pedido = pedido;
                $scope.rootVentanaCantidad.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                
            };
            
            
            
           self.validarLote = function(){
               
                var producto = pedido.getProductoSeleccionado();
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
		
		if(cantidadIngresada > producto.getLote().getDisponible()){
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
            
            
            /*
             * @author Eduar Garcia
             * permite Crea el encabezado del temporal
             */
            self.agregarEncabezado = function(callback){
                
                
                SeparacionService.agregarEncabezadoTemporal(pedido, $scope.rootVentanaCantidad.session, function(continuar){
                    callback(continuar);
                });
                 

            };
            
            
            self.agregarItemADocumento = function(callback){
               var url = API.SEPARACION_PEDIDOS.E008_DETALLE;
               var producto = pedido.getProductoSeleccionado();
               var cantidadIngresada = producto.getLote().getCantidadIngresada();
               
              
               var obj = {
                    session: $scope.rootVentanaCantidad.session,
                    data: {
                        documento_temporal: {
                            empresa_id : pedido.getEmpresaDestino(),
                            centro_utilidad_id : pedido.getCentroDestino(),
                            bodega_id : pedido.getBodegaDestino(),
                            doc_tmp_id : pedido.getTemporalId(),
                            codigo_producto : producto.getCodigoProducto(),
                            lote : producto.getLote().getCodigo(),
                            fecha_vencimiento : producto.getLote().getFechaVencimiento(),
                            cantidad_ingresada : cantidadIngresada,
                            valor_unitario : producto.getValorUnitario(),
                            iva : producto.getValorIva(),
                            total_costo : producto.getValorUnitario() * cantidadIngresada,
                            total_costo_pedido : producto.getValorUnitario()
                        }
                    }
               };
               
               console.log("agregar item al documento iva>>>>>>>>> ", producto.getValorIva());

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                      callback(true, "Producto guardado correctamente");

                    } else {
                      callback(false, "Se genero un error...");
                    }
                });
                
            };
            
            
            $scope.onGuardarCantidad = function(){
                var validacion = self.validarLote();
                
                if(!validacion.valido){
                    console.log("no valido ", validacion);
                    return;
                }
                                
                if(pedido.getTemporalId() === 0){
                    self.agregarEncabezado(function(continuar, msj){
                       if(continuar){
                           
                            self.agregarItemADocumento(function(continuar){
                                AlertService.mostrarMensaje((continuar) ? "success" : "warning", msj);
                            });
                            
                       } else {
                           AlertService.mostrarMensaje((continuar) ? "success" : "warning", msj);
                       }
                    });
                } else {
                    self.agregarItemADocumento(function(continuar, msj){
                        AlertService.mostrarMensaje((continuar) ? "success" : "warning", msj);
                    });
                }

            };
            
            
            self.init(function(){
                
            });
            
        }
        
    ]);
});

