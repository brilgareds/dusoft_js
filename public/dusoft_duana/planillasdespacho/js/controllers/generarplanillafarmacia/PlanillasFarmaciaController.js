define(["angular", "js/controllers", "controllers/generarplanillafarmacia/ListarPlanillasFarmaciaController"], function(angular, controllers) {

    controllers.controller('PlanillasFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "PlanillaDespacho",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, PlanillaDespacho, Sesion) {

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
                planilla_seleccionada: PlanillaDespacho.get()
            };

            $scope.generar_reporte = function(planilla, descargar) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: planilla.get_numero_guia()
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.REPORTE_PLANILLA_DESPACHO, "POST", obj, function(data) {

                    if (data.status === 200) {
                        var nombre_reporte = data.obj.planillas_despachos.nombre_reporte;

                        var opcion = (descargar) ? "download" : "blank";

                        $scope.visualizarReporte("/reports/" + nombre_reporte, "PlanillaGuiaNo-" + planilla.get_numero_guia(), opcion);
                    }
                });
            };

            $scope.ventana_enviar_email = function(planilla) {

                $scope.datos_view.planilla_seleccionada = planilla;
                $scope.datos_view.email_subject = 'Planilla Devolucion Guia No.' + $scope.datos_view.planilla_seleccionada.get_numero_guia();
                $scope.datos_view.email_message = 'Planilla Devolucion Guia No.' + $scope.datos_view.planilla_seleccionada.get_numero_guia() + '.\nCon destino a la ciudad de ' + $scope.datos_view.planilla_seleccionada.get_ciudad().get_nombre_ciudad();
                $scope.datos_view.email_attachment_name = "PlanillaGuiaNo-" + $scope.datos_view.planilla_seleccionada.get_numero_guia() + '.pdf';

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/generarplanillafarmacia/redactaremailfarmacia.html',
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
                                        $scope.datos_view.planilla_seleccionada = PlanillaDespacho.get();
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
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };


            $scope.enviar_email = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_despachos: {
                            planilla_id: $scope.datos_view.planilla_seleccionada.get_numero_guia(),
                            enviar_email: true,
                            emails: $scope.datos_view.email_to,
                            subject: $scope.datos_view.email_subject,
                            message: $scope.datos_view.email_message
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.REPORTE_PLANILLA_DESPACHO, "POST", obj, function(data) {

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