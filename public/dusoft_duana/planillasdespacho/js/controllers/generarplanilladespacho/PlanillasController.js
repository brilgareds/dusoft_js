define(["angular", "js/controllers", "controllers/generarplanilladespacho/ListarPlanillasController"], function(angular, controllers) {

    controllers.controller('PlanillasController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Sesion) {

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };


            $scope.generar_reporte = function(planilla, descargar) {
                
                console.log(planilla);
                console.log(descargar);

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

                        var opcion = (descargar)? "download" :"blank";                     

                        $scope.visualizarReporte("/reports/" + nombre_reporte, "PlanillaGuiaNo-" + planilla.get_numero_guia(), opcion);
                    }
                });


            };

            $scope.ventana_enviar_email = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/generarplanilladespacho/redactaremail.html',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.descargar_reporte_pdf = function() {
                            $scope.generar_reporte();
                            $modalInstance.close();
                        };

                        $scope.enviar_reporte_pdf_email = function() {
                            $scope.enviar_email();
                            $modalInstance.close();
                        };

                        $scope.cancelar_enviar_email = function() {
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.enviar_email = function() {
                console.log('=============================');
                console.log('== enviar_email ==');
                console.log('=============================');

            };

        }]);
});