
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('AprobarPedidoController', ['$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "$modalInstance", "Empresa", "AlertService", "Usuario", 'STATIC',
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, $modalInstance, Empresa, AlertService, Usuario, STATIC) {
            
            var that = this;

            $scope.rootAprobarPedido = {};
            
            $scope.rootAprobarPedido.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            $scope.rootAprobarPedido.modalInstance = $modalInstance;
            
            $scope.rootAprobarPedido.Empresa = Empresa;
            
            console.log(">>> Empresa Ap. Pedido: ", $scope.rootAprobarPedido.Empresa);
            
//            $scope.rootAprobarPedido.tipo_documento = tipo_documento;
            
//            $scope.rootAprobarPedido.icono_mail = STATIC.BASE_IMG + "/mail-icon1.png";
//            $scope.rootAprobarPedido.icono_pdf = STATIC.BASE_IMG + "/pdf-icon.png";
            
            console.log(">>> Empresa - Aprobación: ", $scope.rootAprobarPedido.Empresa);
            
            $scope.rootAprobarPedido.titulo = "Aprobación Cartera - Pedido N° "+$scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().get_numero_pedido();
            
//            $scope.rootAprobarPedido.destinatarios = '';
//            $scope.rootAprobarPedido.asunto = '';

            //$scope.rootAprobarPedido.observacion = '';
            $scope.rootAprobarPedido.observacion = $scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().getObservacionCartera();
            
            $scope.rootAprobarPedido.label_btn = "Aprobar";
            
            //$modalInstance.opened.then(function() {
            $scope.rootAprobarPedido.modalInstance.opened.then(function() {
                $timeout(function(){
                    
//                    if($scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().getCliente().getEmail() !== undefined && $scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().getCliente().getEmail() !== '') {
//                        $scope.rootAprobarPedido.destinatarios = $scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().getCliente().getEmail();
//                    }
//                    
//                    if($scope.rootAprobarPedido.tipo_documento === 'c') {
//                        var numero_cotizacion = $scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
//                        $scope.rootAprobarPedido.asunto = "Cotización N° "+numero_cotizacion+" - DUANA y Cia Ltda.";;
//                    }
//
//                    if($scope.rootAprobarPedido.tipo_documento === 'p') {
//                        var numero_pedido = $scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().get_numero_pedido();
//                        $scope.rootAprobarPedido.asunto = "Pedido N° "+numero_pedido+" - DUANA y Cia Ltda.";;
//                    }
                    
                }, 400);
                
            });       

            $scope.aprobarCotizacion = function(callback) {
                
                var url = API.PEDIDOS.CAMBIAR_ESTADO_APROBACION_PEDIDO;//pendiente - cambiarEstadoAprobacionPedido
                
                var numero_pedido = $scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().get_numero_pedido();
                var observacion = $scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().getObservacion() + "||obs_cartera||" + $scope.rootAprobarPedido.observacion;
                
                //console.log("->>>>>>-- Observación: ", observacion);
                
                var nuevo_estado = '1';
                
                var obj = {
                    session: $scope.rootAprobarPedido.session,
                    data: {
                        estado_pedido: {
                            numero_pedido: numero_pedido,
                            nuevo_estado: nuevo_estado,
                            observacion: observacion
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Cambio de Estado Exitoso: ", data.msj);
                        
                        $scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().estado = nuevo_estado;
                        $scope.rootAprobarPedido.Empresa.getPedidoSeleccionado().setObservacionCartera($scope.rootAprobarPedido.observacion);
                        
                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback(true);
                        }
                    }
                    else {
                        console.log("Error en Cambio de Estado: ", data.msj);
                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback(false);
                        }
                    }
                });
                
                $scope.close();
                
            };

//            $scope.enviarMail = function() {
//                
//                if($scope.rootAprobarPedido.tipo_documento === 'c') {
//                    that.generarPdfCotizacionCliente();
//                }
//                
//                if($scope.rootAprobarPedido.tipo_documento === 'p') {
//                    that.generarPdfPedidoCliente();
//                }
//
//            };

            $scope.close = function() {
                $scope.rootAprobarPedido.modalInstance.close();
            };

            $scope.closeAlert = function() {
                $scope.alert = false;
            };
            
        }]);
});