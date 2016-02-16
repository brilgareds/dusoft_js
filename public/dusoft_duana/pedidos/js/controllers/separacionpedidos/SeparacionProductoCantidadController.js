
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
            
            self.init = function(callback){
                $scope.rootVentanaCantidad = {};
                $scope.rootVentanaCantidad.pedido = pedido;
                $scope.rootVentanaCantidad.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                
                $scope.rootVentanaCantidad.tiposCaja = [
                    {nombre: "Caja", id: 0},
                    {nombre: "Nevera", id: 1}
                ];
                
                $scope.rootVentanaCantidad.tipoCaja = $scope.rootVentanaCantidad.tiposCaja[0];
                
            };
            
            
             /*
             * @author Eduar Garcia
             * permite Valida la cantidad del lote a ingresar
             */ 
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
             * @param{function} callback
             * permite Crea el encabezado del temporal
             */
            self.agregarEncabezado = function(callback){
                
                
                SeparacionService.agregarEncabezadoTemporal(pedido, $scope.rootVentanaCantidad.session, function(continuar){
                    callback(continuar);
                });
                 

            };
            
            /*
             * @author Eduar Garcia
             * @param {function} callback
             * permite Agrega un item al documento temporal
             */
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
               
                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                      var itemId = data.obj.documento_temporal.item_id || 0;
                      producto.setItemId(itemId);
                      callback(true, "Producto guardado correctamente");

                    } else {
                      callback(false, "Se genero un error...");
                    }
                });
                
            };
            
                        
            /*
             * @author Eduar Garcia
             * @param{function} callback
             * Hace la peticion al API ara validar que la caja no este cerrada
             */
            self.validarCaja = function(callback){
                var cliente = (pedido.getTipo() === '2') ? pedido.getFarmacia() : pedido.getCliente();
                 
                var url = API.DOCUMENTOS_TEMPORALES.VALIDAR_CAJA;
                var obj = {
                    session: $scope.rootVentanaCantidad.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id: pedido.getTemporalId(),
                            numero_caja: $scope.rootVentanaCantidad.numero_caja,
                            numero_pedido: pedido.get_numero_pedido(),
                           /* direccion_cliente: cliente.getDireccion() || cliente.get_nombre_farmacia(),
                            nombre_cliente: cliente.getNombre() || cliente.get_nombre_farmacia(),*/
                            direccion_cliente: cliente.direccion || cliente.nombre_farmacia,
                            nombre_cliente: cliente.nombre_tercero || cliente.nombre_farmacia,
                            tipo: $scope.rootVentanaCantidad.tipoCaja.id
                        }
                    }
                };
                
                
                 Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        var obj = data.obj.movimientos_bodegas;
                        if (!obj.caja_valida) {
                            
                            callback(false, "La caja se encuentra cerrada");
                        } else {
                            callback(true);
                        }
                    } else {
                        
                        callback(false, data.msj);
                    }
                 });       
                
                
            };
            
            /*
             * @author Eduar Garcia
             * @param{function} callback
             * Hace la peticion al API ara asignar una caja al producto
             */
            self.asignarCaja = function(callback){
                var url = API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_CAJA_TEMPORALES;
                var producto = pedido.getProductoSeleccionado();
                
                var obj = {
                    session: $scope.rootVentanaCantidad.session,
                    data: {
                        documento_temporal: {
                            temporales: [producto.getItemId()],
                            numero_caja: $scope.rootVentanaCantidad.numero_caja,
                            tipo: $scope.rootVentanaCantidad.tipoCaja.id
                        }
                    }
                };
                
                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        callback(true, "Caja asignada correctamente");
                    } else {
                        callback(false, "Se ha generado un error asignado la caja");
                    }
                });
            };
            
            /*
             * @author Eduar Garcia
             * permite Handler del boton de guardar cantidad
             */   
            self.onGuardarCantidad = function(callback){
                                
                if(pedido.getTemporalId() === 0){
                    self.agregarEncabezado(function(continuar, msj){
                       if(continuar){
                           
                            self.agregarItemADocumento(function(continuar, msj){
                                //AlertService.mostrarMensaje((continuar) ? "success" : "warning", msj);
                                callback(continuar, msj);
                            });
                            
                       } else {
                           //AlertService.mostrarMensaje((continuar) ? "success" : "warning", msj);
                           callback(false, msj);
                       }
                    });
                } else {
                    self.agregarItemADocumento(function(continuar, msj){
                        //AlertService.mostrarMensaje((continuar) ? "success" : "warning", msj);
                        callback(continuar,msj);
                    });
                }

            };
            
            /*
             * @author Eduar Garcia
             * permite Handler del boton de guardar 
             */
            $scope.gestionarCantidadCaja = function(){
                var validacion = self.validarLote();
                
                
                if(parseInt($scope.rootVentanaCantidad.numeroCajaSiguiente) < parseInt($scope.rootVentanaCantidad.numero_caja)){
                    
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El siguiente numero debe ser "+$scope.rootVentanaCantidad.numeroCajaSiguiente);
                    return;
                }
                
                if(!validacion.valido){
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", validacion.mensaje);
                    return;
                }
                
                
                if($scope.rootVentanaCantidad.tipoCaja.id === -1){
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar la caja");
                    return;
                }
                
                if(isNaN(parseInt($scope.rootVentanaCantidad.numero_caja)) || parseInt($scope.rootVentanaCantidad.numero_caja) === 0){
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El número de caja no es valido");
                    return;
                }
                     
                self.onGuardarCantidad(function(continuar, msj){ 
                    
                    if(continuar){
                        self.validarCaja(function(continuar, msj){
                            if(continuar){
                                self.asignarCaja(function(continuar, msj){

                                    AlertService.mostrarMensaje((continuar) ? "success" : "warning", msj);

                                     if(continuar){
                                         $scope.cerrar();
                                     }
                                 });
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", msj);
                            }
                        });
                    } else {
                         AlertService.mostrarVentanaAlerta("Mensaje del sistema", msj);
                    }
                });
            };
            
            
            /*
             * @author Eduar Garcia
             * permite Handler del boton seleccionar caja
             */
            $scope.onSeleccionTipoCaja = function(tipoCaja) {
                $scope.rootVentanaCantidad.tipoCaja = tipoCaja;
            };
            
            
            $scope.cerrar = function(){
                $modalInstance.close();
            };
            
            
            self.consultarNumeroMayorRotulo = function(){
                var url = API.DOCUMENTOS_TEMPORALES.NUMERO_MAYOR_ROTULO;
                
                var obj = {
                    session: $scope.rootVentanaCantidad.session,
                    data: {
                        documento_temporal: {
                            documento_temporal:pedido.getTemporalId(),
                            numero_pedido: $scope.rootVentanaCantidad.pedido.get_numero_pedido(),
                            tipo: $scope.rootVentanaCantidad.tipoCaja.id
                        }
                    }
                };
                
                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.rootVentanaCantidad.numero_caja = data.obj.movimientos_bodegas.numero;
                        $scope.rootVentanaCantidad.numeroCajaSiguiente = data.obj.movimientos_bodegas.numero;
                    } else {
                        $modalInstance.close();
                        
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "No se pudo consultar la caja");
                    }
                });
            };
            
            
            self.init(function(){
                
            });
            
            
            $modalInstance.opened.then(function() {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                self.consultarNumeroMayorRotulo();

            });
            
        }
        
    ]);
});

