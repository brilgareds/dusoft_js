define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('GuardarPedidoController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal', "$timeout",
        function($scope, $rootScope, Request,
                API, socket, AlertService,
                $state, Usuario, localStorageService, $modal, $timeout) {

            var self = this;

            self.init = function() {
                $scope.rootPedidoFarmacia = {};
                $scope.rootPedidoFarmacia.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                var pedido = localStorageService.get("pedidoFarmacia");

                if (pedido) {
                    self.consultarEncabezadoPedidoTemporal(pedido, function(consultaEncabezado) {
                        if (!consultaEncabezado) {
                            AlertService.mostrarMensaje("warning", "No se ha consultado el pedido temporal");
                        }
                    });
                }
            };
            
            /*
             * @Author: Eduar
             * @param {Object} pedido
             * @param {function} callback
             * +Descripcion: Consulta encabezado del pedido
             */
            self.consultarEncabezadoPedidoTemporal = function(pedido, callback) {

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
                            console.log("detalle pedido")
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

                        $scope.renderDetalle(data.obj.detalle_pedido);

                        callback(true);

                    } else {
                        callback(false);
                    }
                });
            };
            
            self.init();


        }]);
});
