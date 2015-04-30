define(["angular", "js/controllers", "controllers/generarplanilladespacho/ListarPlanillasController"], function(angular, controllers) {

    controllers.controller('PlanillasController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        function($scope, $rootScope,Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter) {

            $scope.generar_reporte = function() {
                console.log('=============================');
                console.log('== generar_reporte ==');
                console.log('=============================');

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