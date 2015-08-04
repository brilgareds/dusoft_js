define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('GuardarPedidoTemporalController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal', "$timeout", "EmpresaPedidoFarmacia",
        "ProductoPedidoFarmacia",
        function($scope, $rootScope, Request,
                API, socket, AlertService,
                $state, Usuario, localStorageService, $modal,
                $timeout, EmpresaPedidoFarmacia, ProductoPedidoFarmacia) {

            var self = this;


            self.init = function() {
                console.log("on controller init");
                $scope.rootPedidoFarmaciaTemporal = {};
                $scope.rootPedidoFarmaciaTemporal.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                
                var pedidoTemporal = localStorageService.get("pedidotemporal");
                
                if(pedidoTemporal){
                    self.consultarEncabezadoPedidoTemporal(pedidoTemporal, function(){
                        
                    });
                }
            };
            
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Consulta encabezado del pedido temporal
             */
            self.consultarEncabezadoPedidoTemporal = function(pedidoTemporal, callback){
                
                
                var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: pedidoTemporal.farmacia,
                            centro_utilidad_id: pedidoTemporal.centroUtilidad,
                            bodega_id: pedidoTemporal.bodega
                        }
                    }
                };


                var url = API.PEDIDOS.FARMACIAS.CONSULTAR_ENCABEZADO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        
                        if(data.obj.encabezado_pedido.length > 0){
                            $scope.renderEncabezado(data.obj.encabezado_pedido[0]);
                            //$scope.rootPedidoFarmaciaTemporal.pedido.setEsTemporal(true);
                            self.consultarDetallePedidoTemporal(function(){
                                
                            });
                            
                        }
                        callback(true);

                    } else {
                        callback(false);
                    }
                });
            };
            
            
            self.consultarDetallePedidoTemporal = function(callback){
                
                var pedido = $scope.root.pedido;
                var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: pedido.getFarmaciaDestino().getCodigo(),
                            centro_utilidad_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                        }
                    }
                };


                var url = API.PEDIDOS.FARMACIAS.LISTAR_DETALLE_PEDIDO_TEMPORAL;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    console.log("detalle ", data);
                    $scope.renderDetalle(data);
                    /*if (data.status === 200) {
                        
                        if(data.obj.encabezado_pedido.length > 0){
                            pedido.setEsTemporal(true);
                            self.renderEncabezado(data.obj.encabezado_pedido[0]);
                        }
                        callback(true);

                    } else {
                        callback(false);
                    }*/
                });
            };
            

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Metodo que realiza el request para crear el pedido temporal
             */

            self.guardarEncabezadoPedidoTemporal = function(callback) {
                var pedido = $scope.rootPedidoFarmaciaTemporal.pedido;
                console.log("pedidos ", $scope.rootPedidoFarmaciaTemporal);
                var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_origen_id: pedido.getFarmaciaOrigen().getCodigo(),
                            centro_utilidad_origen_id: pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_origen_id: pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            empresa_destino_id: pedido.getFarmaciaDestino().getCodigo(),
                            centro_utilidad_destino_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_destino_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            observacion: pedido.getDescripcion()
                        }
                    }
                };


                var url = API.PEDIDOS.FARMACIAS.GUARDAR_PEDIDO_TEMPORAL;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        callback(true);

                    } else {
                        callback(false);
                    }
                });
            };


            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Metodo que realiza el request para crear el pedido temporal
             */
            self.guardarDetallePedidoTemporal = function(callback) {
                
                
                var pedido = $scope.rootPedidoFarmaciaTemporal.pedido;
                var producto = pedido.getProductoSeleccionado();
                var farmacia = pedido.getFarmaciaDestino();
                var cantidadPendiente = producto.getCantidadSolicitada() - producto.getDisponibilidadBodega();
                var url  = API.PEDIDOS.FARMACIAS.CREAR_DETALLE_PEDIDO_TEMPORAL;

                var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            numero_pedido: farmacia.getCodigo() + farmacia.getCentroUtilidadSeleccionado().getCodigo() + producto.getCodigoProducto(),
                            empresa_id: farmacia.getCodigo(),
                            centro_utilidad_id: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            codigo_producto: producto.getCodigoProducto(),
                            cantidad_solic: parseInt(producto.getCantidadSolicitada()),
                            tipo_producto_id: producto.getTipoProductoId(),
                            cantidad_pendiente: (cantidadPendiente < 0) ? 0 : cantidadPendiente
                        }
                    }
                };
                
               Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        pedido.agregarProductoSeleccionado(producto);
                        callback(true);

                    } else {
                        callback(false);
                    }
                });

            };
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Metodo que se dispara desde el slide de seleccion de productos
             */
            $rootScope.$on("insertarProductoPedidoTemporal", function(event, pedido) {
                var producto = pedido.getProductoSeleccionado();
                $scope.rootPedidoFarmaciaTemporal.pedido = pedido;
                console.log("pedido actual ", pedido);
                if(!pedido.getEsTemporal()){
                    self.guardarEncabezadoPedidoTemporal(function(creacionCompleta) {
                        if (creacionCompleta) {
                            pedido.setEsTemporal(true);
                            self.guardarDetallePedidoTemporal(function(agregado){
                                
                            });
                            
                        }
                    });
                } else {
                    self.guardarDetallePedidoTemporal(function(agregado){
                        console.log("agregado al temporal ", pedido);
                    });
                }
            });
            
            self.init();

        }]);
});
