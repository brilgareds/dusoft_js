define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ReportePedidosClientesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "PedidoCliente",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Pedido, Sesion) {

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                email_to: '',
                email_subject: '',
                email_message: '',
                email_attachment_name: '',
                pedido_seleccionado: Pedido.get()
            };

            $scope.generar_reporte = function(cotizacion_pedido, descargar) {

                var obj = {};
                var url = '';
                var nombre_archivo = '';

                // Reporte Cotizacion
                if (cotizacion_pedido.get_numero_cotizacion() > 0) {

                    url = API.PEDIDOS.CLIENTES.REPORTE_COTIZACION;
                    nombre_archivo = 'CotizacionNo.' + cotizacion_pedido.get_numero_cotizacion();

                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                cotizacion: cotizacion_pedido
                            }
                        }
                    };
                }

                // Reporte Pedido
                if (cotizacion_pedido.get_numero_pedido() > 0) {

                    url = API.PEDIDOS.CLIENTES.REPORTE_PEDIDO;
                    nombre_archivo = 'PedidoNo.' + cotizacion_pedido.get_numero_pedido();

                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                pedido: cotizacion_pedido
                            }
                        }
                    };
                }

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        var nombre_reporte = data.obj.pedidos_clientes.nombre_reporte;

                        var opcion = (descargar) ? "download" : "blank";

                        $scope.visualizarReporte("/reports/" + nombre_reporte, nombre_archivo, opcion);
                    }
                });
            };

            $scope.ventana_enviar_email = function(cotizacion_pedido) {

                $scope.datos_view.pedido_seleccionado = cotizacion_pedido;

                if ($scope.datos_view.pedido_seleccionado.get_numero_cotizacion() > 0) {
                    $scope.datos_view.email_subject = 'Cotizacion No.' + $scope.datos_view.pedido_seleccionado.get_numero_cotizacion();
                    $scope.datos_view.email_message = 'Cotizacion No.' + $scope.datos_view.pedido_seleccionado.get_numero_cotizacion();
                    $scope.datos_view.email_attachment_name = "CotizacionNo-" + $scope.datos_view.pedido_seleccionado.get_numero_cotizacion() + '.pdf';

                }

                if ($scope.datos_view.pedido_seleccionado.get_numero_pedido() > 0) {
                    $scope.datos_view.email_subject = 'Pedido No.' + $scope.datos_view.pedido_seleccionado.get_numero_pedido();
                    $scope.datos_view.email_message = 'Pedido No.' + $scope.datos_view.pedido_seleccionado.get_numero_pedido();
                    $scope.datos_view.email_attachment_name = "PedidoNo-" + $scope.datos_view.pedido_seleccionado.get_numero_pedido() + '.pdf';

                }


                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/generacionpedidos/pedidosclientes/redactaremail.html',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.validar_envio_email = function() {

                            var expresion = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                            var emails = $scope.datos_view.email_to.split(',');
                            var continuar = true;

                            emails.forEach(function(email) {
                                if (!expresion.test(email.trim())) {
                                    continuar = false;
                                }
                            });

                            if (continuar) {
                                $scope.enviar_email(function(continuar) {
                                    if (continuar) {
                                        $scope.datos_view.pedido_seleccionado = Pedido.get();
                                        $scope.datos_view.email_to = '';
                                        $scope.datos_view.email_subject = '';
                                        $scope.datos_view.email_message = '';
                                        $scope.datos_view.email_attachment_name = '';
                                        $modalInstance.close();
                                    }
                                });
                            } else {
                                AlertService.mostrarMensaje("warning", 'Direcciones de correo electrónico inválidas!.');
                            }
                        };

                        $scope.cancelar_enviar_email = function() {
                            $scope.datos_view.pedido_seleccionado = Pedido.get();
                            $scope.datos_view.email_to = '';
                            $scope.datos_view.email_subject = '';
                            $scope.datos_view.email_message = '';
                            $scope.datos_view.email_attachment_name = '';
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };


            $scope.enviar_email = function(callback) {

                var url = '';

                // Enviar Email Reporte Cotizacion
                if ($scope.datos_view.pedido_seleccionado.get_numero_cotizacion() > 0) {

                    url = API.PEDIDOS.CLIENTES.REPORTE_COTIZACION;

                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                cotizacion: $scope.datos_view.pedido_seleccionado,
                                enviar_email: true,
                                emails: $scope.datos_view.email_to,
                                subject: $scope.datos_view.email_subject,
                                message: $scope.datos_view.email_message
                            }
                        }
                    };
                }

                // Enviar Email  Reporte Pedido
                if ($scope.datos_view.pedido_seleccionado.get_numero_pedido() > 0) {

                    url = API.PEDIDOS.CLIENTES.REPORTE_PEDIDO;

                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                pedido: $scope.datos_view.pedido_seleccionado,
                                enviar_email: true,
                                emails: $scope.datos_view.email_to,
                                subject: $scope.datos_view.email_subject,
                                message: $scope.datos_view.email_message
                            }
                        }
                    };
                }

                Request.realizarRequest(url, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        callback(true);
                    } else {
                        callback(false);
                    }

                });
            };

        }]);
});