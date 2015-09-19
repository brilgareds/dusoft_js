
define(["angular", "js/controllers",'includes/slide/slideContent'], function(angular, controllers){
    
    controllers.controller('SeparacionProductoCantidadController',[
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService", "$state",
        "pedido","Usuario", "$modalInstance",
        function($scope,$rootScope,Request,
                 API,socket,AlertService,$modal,
                 localStorageService,$state, pedido, Usuario, $modalInstance){
         
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
                
                var url = API.SEPARACION_PEDIDOS.CLIENTES.E008_DOCUMENTO_TEMPORAL_CLIENTES;
                var obj = {
                    numero_pedido : pedido.get_numero_pedido(),
                    empresa_id : pedido.getEmpresaDestino(),
                    observacion : "Pedido #"+pedido.get_numero_pedido()
                };
                
                
                if(pedido.getTipo() === '2'){
                    url = API.SEPARACION_PEDIDOS.FARMACIAS.E008_DOCUMENTO_TEMPORAL_FARMACIAS;
                } else {
                    obj.tercero_id = pedido.getCliente().getId();
                    obj.tipo_tercero_id = pedido.getCliente().getTipoId();
                }
                
               var obj = {
                    session: $scope.rootVentanaCantidad.session,
                    data: {
                        documento_temporal: obj
                    }
               };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                      var id = data.obj.documento_temporal;
                      id =  (!id.documento_temporal_id)? parseInt(id.doc_tmp_id): parseInt(id.documento_temporal_id);
                      pedido.setTemporalId(id);
                      callback(true);

                    } else {
                      callback(false);
                    }
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

