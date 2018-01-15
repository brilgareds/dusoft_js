define(["angular", "js/services"], function(angular, services) {


    services.factory('PedidosFarmaciasService', 
                    ['$rootScope', 'Request', 'API', 'PedidoFarmacia',
                     'CentroUtilidadPedidoFarmacia','BodegaPedidoFarmacia','FarmaciaPedido',"$modal",
                     "Usuario",
        function($rootScope, Request, API, PedidoFarmacia,
                 CentroUtilidadPedidoFarmacia, BodegaPedidoFarmacia, FarmaciaPedido, $modal,
                 Usuario) {

            var self = this;
            
            self.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
            
            
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: Permite que los controladores de pedidos farmacias obtengan los permisos en los botones, se valida con el objeto pedid
             * de ser necesario
             */            
            self.getOpcionesModulo = function(pedido) {
                
                var _opciones =    {
                    btnCrearPedido: {
                        'click': (pedido !== undefined)?self.validarBotonIncluirProductos(pedido):self.opciones.sw_crear_pedido
                       //Ejemplo 'mouseover':self.opciones.sw_consultar_pedido 
                    },
                    btnVerPedido: {
                        'click':self.opciones.sw_consultar_pedido 
                    },
                    btnModificarPedido: {
                        'click': self.opciones.sw_modificar_pedido
                    },
                    btnModificacionEspecial: {
                        'click':  self.opciones.sw_modificacion_especial_pedidos
                    },
                    btnGuardarTemporal:{
                        'click': self.opciones.sw_guardar_temporal
                    },
                    btnGenerarPedido:{
                        'click': self.opciones.sw_generar_pedido
                    },
                    btnEliminarPedidoTemporal:{
                        'click': self.validarBotonEliminarProducto(pedido)
                    }
                };
                
                return _opciones;
            };
            
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: Metodo que permite validar el permiso del boton de eliminar producto
             */
            self.validarBotonEliminarProducto = function(pedido){
                if(pedido === undefined){
                    return;
                }
                
                if(pedido.getEsTemporal() && self.opciones.sw_eliminar_temporal){
                    return true;
                } else if(pedido.get_numero_pedido()){
                    return true;
                }
                
                return false;
            };
            
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: Metodo que permite validar el permiso del boton de incluir producto
             */
            
            self.validarBotonIncluirProductos = function(pedido){
                if(pedido === undefined){
                    return false;
                }
                
                //El pedido aun no esta guardado y el usuario puede crear pedidos
                if(!pedido.getEsTemporal() && self.opciones.sw_crear_pedido){
                    return true;
                    
                //El pedio es temporal y el usuario puede modificar
                } else if(pedido.getEsTemporal() && self.opciones.sw_modificar_pedido ){
                    return true;
                    
                } 
                
                return false;
            };
            
            /*
             * @Author: Eduar
             * @param {object} obj
             * +Descripcion: metodo que serializa el pedido en los modelos usado por ListaPedidoController y ListaPedidoTemporalesController
             */
            
            self.crearPedido = function(obj) {

                var pedido = PedidoFarmacia.get();

                var datos_pedido = {
                    numero_pedido: obj.numero_pedido || '',
                    fecha_registro: obj.fecha_registro || '',
                    descripcion_estado_actual_pedido: obj.descripcion_estado_actual_pedido || '',
                    estado_actual_pedido: obj.estado_actual_pedido || '',
                    estado_separacion: obj.estado_separacion || ''
                };
                
                pedido.setDatos(datos_pedido);
                pedido.setNumeroPedidoCliente(obj.pedido_cliente);
                pedido.setDescripcion(obj.observacion);

                var farmacia = FarmaciaPedido.get(
                        obj.farmacia_id,
                        obj.bodega,
                        obj.nombre_farmacia
                );
                
                             
                var centroUtilidad = CentroUtilidadPedidoFarmacia.get(obj.nombre_farmacia, obj.centro_utilidad);
                var bodega = BodegaPedidoFarmacia.get(obj.nombre_bodega, obj.bodega_id || obj.bodega);
                farmacia.setCentroUtilidadSeleccionado(centroUtilidad).getCentroUtilidadSeleccionado().setBodegaSeleccionada(bodega);
                farmacia.setZona(obj.zona);
                
                pedido.setFarmaciaDestino(farmacia);

                return pedido;
            };
            
            /*
             * @Author: Eduar
             * @param {object} obj
             * +Descripcion: metodo que permite enviar un email en el cual se adjunta el pdf
             */
            
            self.enviarEmail = function(session, pedido, asunto,mensaje, destinatarios, callback){
                var farmaciaDestino = pedido.getFarmaciaDestino();
                var farmaciaOrigen  = pedido.getFarmaciaOrigen();
                
                var url = API.PEDIDOS.FARMACIAS.ENVIAR_EMAIL;

                var obj = {
                    session: session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: pedido.get_numero_pedido(),
                            farmaciaOrigen:farmaciaOrigen,
                            farmaciaDestino:farmaciaDestino,
                            destinatarios:destinatarios,
                            mensaje:mensaje,
                            asunto:asunto
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var nombre = data.obj.reporte_pedido.nombre_reporte;
                        callback(false, nombre);
                        //$scope.visualizarReporte("/reports/" + nombre, nombre, "download");
                    }  else {
                        callback({err:true, msj:"Ha ocurrido un error al enviar el email"});
                        //AlertService.mostrarMensaje("warning", "Error generando el pdf");
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {Object} session
             * @param {PedidoFarmacia}pedido
             * @param {function} callback
             * +Descripcion: Permite abrir la ventana para enviar por correo el pdf generado
             */
            self.ventanaEnviarEmail = function(session, pedido, callback) {
                
                var opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/generacionpedidos/pedidosfarmacias/redactaremail.html',
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
                        $scope.asunto = 'Pedido No.' + pedido.get_numero_pedido();
                        $scope.mensaje = 'Pedido con destino a  '+ pedido.getFarmaciaDestino().getNombre();
                        $scope.nombreAdjunto = "Se enviara el email con el pdf adjunto";
                        $scope.destinatarios = "";
                        
                        $scope.validarEnvioEmail = function() {

                            var expresion = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                            var emails = $scope.destinatarios.split(',');
                            var continuar = true;

                            emails.forEach(function(email) {
                                if (!expresion.test(email.trim())) {
                                    continuar = false;
                                }
                            });

                            if (continuar) {
                                self.enviarEmail(session, pedido, $scope.asunto, $scope.mensaje, $scope.destinatarios, function(err, nombre) {
                                    callback(err, nombre); 
                                    $modalInstance.close();
                                });
                            } else {
                                callback({err:true, msj:"Las direcciones de correo deben ser validas"});
                            }
                        };

                        $scope.cancelarEnviarEmail = function() {
                            callback(false, false);
                            $modalInstance.close();
                        };
                    }]
                };
                var modalInstance = $modal.open(opts);
            };
            
            return this;
        }]);
});



