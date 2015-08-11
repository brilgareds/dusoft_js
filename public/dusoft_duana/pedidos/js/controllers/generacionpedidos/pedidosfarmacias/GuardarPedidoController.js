define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('GuardarPedidoController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal', "$timeout",
        "ProductoPedidoFarmacia",
        function($scope, $rootScope, Request,
                API, socket, AlertService,
                $state, Usuario, localStorageService, $modal, $timeout,
                ProductoPedidoFarmacia) {

            var self = this;

            self.init = function() {
                $scope.rootPedidoFarmacia = {};
                $scope.rootPedidoFarmacia.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                var pedido = localStorageService.get("pedidoFarmacia");

                if (pedido) {
                    $scope.root.pedido.setTipoModificacion(pedido.tipoModificacion);
                    
                    $scope.root.lista_productos.columnDefs[4].visible = self.visualizarColumnaModificarCantidad();
                    
                    self.consultarEncabezadoPedido(pedido, function(consultaEncabezado) {
                        if (!consultaEncabezado) {
                            AlertService.mostrarMensaje("warning", "No se ha consultado el pedido temporal");
                        }
                    });
                }
            };
            
            /*
             * @Author: Eduar
             * return  {boolean} visualizar
             * +Descripcion: Determina si se muestra la columna de modificar cantidad
             */
            self.visualizarColumnaModificarCantidad = function(){
                console.log("modificacion ", $scope.root.pedido.getTipoModificacion());
                if( $scope.root.pedido.getTipoModificacion() === '1' || $scope.root.pedido.getTipoModificacion() === '3' ){
                    return true;
                }
                
                return false;
            };
            
            /*
             * @Author: Eduar
             * @param {Object} pedido
             * @param {function} callback
             * +Descripcion: Consulta encabezado del pedido
             */
            self.consultarEncabezadoPedido = function(pedido, callback) {

                var obj = {
                    session: $scope.rootPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: pedido.numero_pedido
                        }
                    }
                };


                var url = API.PEDIDOS.FARMACIAS.CONSULTAR_ENCABEZADO_PEDIDO_FARMACIA;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {

                        if (data.obj.encabezado_pedido.length > 0) {
                            var _pedido = data.obj.encabezado_pedido[0];
                            $scope.renderEncabezado(_pedido);
                            $scope.root.pedido.setEsTemporal(false);
                            $scope.root.pedido.setNumeroPedido(_pedido.numero_pedido);
                            $scope.root.pedido.setEstadoActualPedido(_pedido.estado_actual_pedido);
                            
                            self.consultarDetallePedido(function(consultaDetalle) {
                                callback(consultaDetalle);
                            });

                        }

                    } else {
                        callback(false);
                    }
                });
            };
            
            
             /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Consulta detalle del pedido 
             */
            self.consultarDetallePedido = function(callback) {

                var pedido = $scope.root.pedido;
                var obj = {
                    session: $scope.rootPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: pedido.get_numero_pedido()
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.CONSULTAR_DETALLE_PEDIDO_FARMACIA;
                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        pedido.vaciarProductosSeleccionados();
                        $scope.renderDetalle(data.obj.detalle_pedido);

                        callback(true);

                    } else {
                        callback(false);
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {ProductoPedidoFarmacia} producto
             * +Descripcion: Realiza la peticion al API para eliminar un producto del temporal.
             */
            self.eliminarProducto = function(producto, index){
                var pedido = $scope.root.pedido;
                
                if(pedido.getProductosSeleccionados().length <= 1){
                   AlertService.mostrarMensaje("warning", "Debe exisitir por lo menos un producto en el pedido");
                   return;
                }
                
                var pedido = $scope.root.pedido;
                var url = API.PEDIDOS.FARMACIAS.ELIMINAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA;
                
                 var obj = {
                    session: $scope.rootPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: pedido.get_numero_pedido(),
                            codigo_producto: producto.getCodigoProducto()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                       pedido.eliminarProductoSeleccionado(index);
                       
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Metodo que realiza el request para ingresar un producto al pedido
             */
            self.guardarDetallePedido = function(callback) {
                var pedido = $scope.root.pedido;
                var producto = pedido.getProductoSeleccionado();
                var farmacia = pedido.getFarmaciaDestino();
                var cantidadPendiente = producto.getCantidadSolicitada();
                producto.setCantidadPendiente(cantidadPendiente);
                
                var url = API.PEDIDOS.FARMACIAS.INSERTAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA;

                var obj = {
                    session: $scope.rootPedidoFarmacia.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            numero_pedido: pedido.get_numero_pedido(),
                            empresa_id: farmacia.getCodigo(),
                            centro_utilidad_id: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            codigo_producto: producto.getCodigoProducto(),
                            cantidad_solic: parseInt(producto.getCantidadSolicitada()),
                            tipo_producto_id: producto.getTipoProductoId(),
                            cantidad_pendiente: cantidadPendiente
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        pedido.agregarProductoSeleccionado(producto);
                        callback(true);

                    } else {
                        callback(false, data.msj);
                    }
                });

            };
            
            /*
             * @Author: Eduar
             * @param {String} titulo
             * @param {String} mensaje
             * @param {function} callback
             * +Descripcion: Permite mostrar un alert, prevee un callback donde envia si se dio click en aceptar o cancelar
             */
            self.mostrarAlerta = function(titulo, mensaje, callback) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">'+titulo+'</h4>\
                                    </div>\
                                    <div class="modal-body row">\
                                    <div class="col-md-12">\
                                    <h4>'+mensaje+'</h4>\
                                    </div>\
                                    </div>\
                                    <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="cerrar(false)" ng-disabled="" >Cerrar</button>\
                                    <button class="btn btn-primary" ng-click="cerrar(true)" ng-disabled="" >Aceptar</button>\
                                    </div>',
                                           scope: $scope,
                                           controller: function($scope, $modalInstance) {
                                               $scope.cerrar = function(acepto) {
                                                   callback(acepto);
                                                   $modalInstance.close();
                                               };
                                           }
                                       };

                  var modalInstance = $modal.open($scope.opts);
            };
            
            /*
             * @Author: Eduar
             * @param {ProductoPedidoFarmacia} _producto
             * +Descripcion: Realiza la peticion al api para cambiar la cantidad solicitada y la pendiente 
             */
            
            self.modificarCantidadSolicitada = function(_producto){
                                
                var diferencia_cantidad = 0;
                var nuevo_pendiente = 0;
                var producto = angular.copy(_producto);

                diferencia_cantidad =  producto.getCantidadSolicitada() - producto.getCantidadIngresada();

                producto.setCantidadSolicitada(producto.getCantidadIngresada());
                
                nuevo_pendiente = producto.getCantidadPendiente() - diferencia_cantidad;

                if(nuevo_pendiente >= 0){
                    producto.setCantidadPendiente(nuevo_pendiente);
                    
                } else {
                    producto.setCantidadPendiente(0);
                }
                
                var obj = {
                    session:$scope.rootPedidoFarmacia.session,
                    data:{
                        pedidos_farmacias:{
                            numero_pedido: $scope.root.pedido.get_numero_pedido(),
                            codigo_producto: producto.getCodigoProducto(),
                            cantidad_solicitada: parseInt(producto.getCantidadSolicitada()),
                            cantidad_pendiente: parseInt(producto.getCantidadPendiente())
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.ACTUALIZAR_CANTIDADES_DETALLE_PEDIDO_FARMACIA;
                
                Request.realizarRequest(url, "POST", obj, function(data) {
                    console.log("resultado cambiar cantidad ", data);
                    if(data.status !== 200){
                        AlertService.mostrarMensaje("warning", data.msj);
                        
                    }
                    
                     self.consultarDetallePedido(function(consultaDetalle) {
                         
                     });
                    
                });            
            };
            
            self.mostrarAlertaProductosNoEncontrados = function(productos){
                $scope.productosInvalidos = [];
                
                for (var i in productos) {
                    var _producto = productos[i];
                    var producto = ProductoPedidoFarmacia.get(_producto.codigo_producto, _producto.descripcion_producto).
                                                              setCantidadSolicitada(_producto.cantidad_solicitada);

                     $scope.productosInvalidos.push(producto);                                   
                }
                
                
                $scope.productos = productos;   
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Alerta del sistema </h4>\
                                </div>\
                                <div class="modal-body row">\
                                    <div class="col-md-12">\
                                        <h4 >Productos no encontrados en la farmacia seleccionada .</h4>\
                                        <div class="row" style="max-height:300px; overflow:hidden; overflow-y:auto;">\
                                            <div class="list-group">\
                                                <a ng-repeat="producto in productosInvalidos" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                                    {{ producto.getCodigoProducto()}} - {{producto.getDescripcion()}}\
                                                </a>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {
                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }
                };
                
                var modalInstance = $modal.open($scope.opts);  
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Realiza la peticion al api para cambiar la empresa, centro y bodega destino
             */
            self.guardarPedido = function(){
                
                var pedido = $scope.root.pedido;
                var farmacia = pedido.getFarmaciaDestino();
                
                var url = API.PEDIDOS.FARMACIAS.ACTUALIZAR_PEDIDO;

                var obj = {
                    session: $scope.rootPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: pedido.get_numero_pedido(),
                            empresa_destino: farmacia.getCodigo(),
                            centro_utilidad_destino: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_destino: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            observacion:pedido.getDescripcion()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status !== 200) {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error actualizando el pedido");
                    } else {
                        if(data.obj.productosNoEncontrados.length > 0){
                            self.mostrarAlertaProductosNoEncontrados(data.obj.productosNoEncontrados);
                        } else {
                            AlertService.mostrarMensaje("success", "Se ha modificado correctamente el pedido");
                        }
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton guarda pedido
             */
            $scope.onGuardarPedido = function(){
                self.guardarPedido();
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton generar pdf
             */
            $scope.onGenerarPdfPedido = function(){
                
                var pedido = $scope.root.pedido;
                var farmaciaDestino = pedido.getFarmaciaDestino();
                var farmaciaOrigen  = pedido.getFarmaciaOrigen();
                
                var url = API.PEDIDOS.FARMACIAS.GENERAR_PDF_PEDIDO;

                var obj = {
                    session: $scope.rootPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: pedido.get_numero_pedido(),
                            empresa_origen: farmaciaOrigen.getNombre(),
                            centro_utilidad_origen: farmaciaOrigen.getCentroUtilidadSeleccionado().getNombre(),
                            bodega_origen: farmaciaOrigen.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getNombre(),
                            empresa_destino: farmaciaDestino.getNombre(),
                            centro_utilidad_destino: farmaciaDestino.getCentroUtilidadSeleccionado().getNombre(),
                            bodega_destino: farmaciaDestino.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getNombre()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var nombre = data.obj.reporte_pedido.nombre_reporte;
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "download");
                    }  else {
                        AlertService.mostrarMensaje("warning", "Error generando el pdf");
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {$event} e
             * @param {ProductoPedidoFarmacia} producto
             * +Descripcion: Evento que se escucha de GuardarPedidoBaseController, valida el cambio de cantidad del producto
             */
            $scope.eventoEditarCantidad = $scope.$on("onEditarCantidad", function(e, producto){
                
                var mensaje;
                
                if($scope.root.pedido.getEstadoActualPedido() === '0'){
                    
                    if(producto.getCantidadIngresada() >= producto.getCantidadSolicitada()){
                        mensaje = "La cantidad ingresada debe ser menor a la solicitada";
                        
                        self.mostrarAlerta("Alerta del sistema", mensaje, function(acepto){
                            
                        });
                        
                    } else {
                        mensaje = "Seguro desea cambiar la cantidad solicitada "+ producto.getCantidadSolicitada() + " a "+producto.getCantidadIngresada() + " ?";
                        
                        self.mostrarAlerta("Alerta del sistema", mensaje, function(acepto){
                            if(acepto){
                                self.modificarCantidadSolicitada(producto);
                            }
                        });
                    }
                } else {
                    mensaje = "El estado actual del pedido no permite modificarlo";
                    
                    self.mostrarAlerta("Alerta del sistema", mensaje, function(acepto){

                    });
                }
                

            });
            
            /*
             * @Author: Eduar
             * @param {$event} e
             * @param {ProductoPedidoFarmacia} producto
             * @param {int} index
             * +Descripcion: Evento que se dispara desde el controlador base para eliminar un producto
             */
            $scope.onEliminarProductoPedido = $scope.$on("onEliminarProducto",function(e, producto, index){
                self.eliminarProducto(producto, index);
            });
            
            
            $scope.eventoInsertarProductoPedido = $scope.$on("insertarProductoPedido", function(){
                self.guardarDetallePedido(function(agregado, msj) {
                    if(!agregado){
                        AlertService.mostrarMensaje("warning", msj);
                    }
                });
            });
                        
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.eventoEditarCantidad();
                $scope.onEliminarProductoPedido();
                $scope.eventoInsertarProductoPedido();
                $scope.rootPedidoFarmacia = {};
                $scope.$$watchers = null;
                localStorageService.remove("pedidoFarmacia");
            });
            
           
            self.init();


        }]);
});
