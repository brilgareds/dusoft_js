
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('AprobarCotizacionController', ['$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "$modalInstance", "Empresa", "AlertService", "Usuario", 'STATIC',
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, $modalInstance, Empresa, AlertService, Usuario, STATIC) {
            
            var that = this;

            $scope.rootAprobarCotizacion = {};
            
            $scope.rootAprobarCotizacion.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            $scope.rootAprobarCotizacion.modalInstance = $modalInstance;
            
            $scope.rootAprobarCotizacion.Empresa = Empresa;
//            $scope.rootAprobarCotizacion.tipo_documento = tipo_documento;
            
//            $scope.rootAprobarCotizacion.icono_mail = STATIC.BASE_IMG + "/mail-icon1.png";
//            $scope.rootAprobarCotizacion.icono_pdf = STATIC.BASE_IMG + "/pdf-icon.png";
            
            console.log(">>> Empresa - Aprobación: ", $scope.rootAprobarCotizacion.Empresa);
            
            $scope.rootAprobarCotizacion.titulo = "Aprobación Cartera - Cotización N° "+$scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
            
//            $scope.rootAprobarCotizacion.destinatarios = '';
//            $scope.rootAprobarCotizacion.asunto = '';

            //$scope.rootAprobarCotizacion.observacion = '';
            $scope.rootAprobarCotizacion.observacion = $scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().getObservacionCartera();
            
            $scope.rootAprobarCotizacion.label_btn = "Aprobar";
            
            //$modalInstance.opened.then(function() {
            $scope.rootAprobarCotizacion.modalInstance.opened.then(function() {
                $timeout(function(){
                    
//                    if($scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().getCliente().getEmail() !== undefined && $scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().getCliente().getEmail() !== '') {
//                        $scope.rootAprobarCotizacion.destinatarios = $scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().getCliente().getEmail();
//                    }
//                    
//                    if($scope.rootAprobarCotizacion.tipo_documento === 'c') {
//                        var numero_cotizacion = $scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
//                        $scope.rootAprobarCotizacion.asunto = "Cotización N° "+numero_cotizacion+" - DUANA y Cia Ltda.";;
//                    }
//
//                    if($scope.rootAprobarCotizacion.tipo_documento === 'p') {
//                        var numero_pedido = $scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().get_numero_pedido();
//                        $scope.rootAprobarCotizacion.asunto = "Pedido N° "+numero_pedido+" - DUANA y Cia Ltda.";;
//                    }
                    
                }, 400);
                
           });       

            $scope.aprobarCotizacion = function(callback) {
                
                var url = API.PEDIDOS.CAMBIAR_ESTADO_APROBACION_COTIZACION;
                
                var numero_cotizacion = $scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().getNumeroCotizacion();
                var observacion = $scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().getObservacion() + "||obs_cartera||" + $scope.rootAprobarCotizacion.observacion;
                
                console.log("->>>>>>-- Observación: ", observacion);
                
                var nuevo_estado = '2';
                
                var obj = {
                    session: $scope.rootAprobarCotizacion.session,
                    data: {
                        estado_cotizacion: {
                            numero_cotizacion: numero_cotizacion,
                            nuevo_estado: nuevo_estado,
                            observacion: observacion
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Cambio de Estado Exitoso: ", data.msj);
                        
                        $scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().estado = nuevo_estado;
                        $scope.rootAprobarCotizacion.Empresa.getPedidoSeleccionado().setObservacionCartera($scope.rootAprobarCotizacion.observacion);
                        
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
//                if($scope.rootAprobarCotizacion.tipo_documento === 'c') {
//                    that.generarPdfCotizacionCliente();
//                }
//                
//                if($scope.rootAprobarCotizacion.tipo_documento === 'p') {
//                    that.generarPdfPedidoCliente();
//                }
//
//            };

            $scope.close = function() {
                $scope.rootAprobarCotizacion.modalInstance.close();
            };

            $scope.closeAlert = function() {
                $scope.alert = false;
            };
            
        }]);
});