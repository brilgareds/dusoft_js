
define(["angular", "js/controllers"
], function(angular, controllers) {

    controllers.controller('GestionarRecepcionesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter) {

            var that = this;

            $scope.datos_view = {
                btn_agregar_eliminar_registro: true,
                disabled_agregar_eliminar_registro: true,
                recepciones: []
            };


            $scope.agregar_eliminar_registro = function() {

                if ($scope.datos_view.btn_agregar_eliminar_registro) {
                    $scope.agregar_registro();
                    $scope.datos_view.btn_agregar_eliminar_registro = false;
                } else {
                    $scope.eliminar_registro();
                    $scope.datos_view.btn_agregar_eliminar_registro = true;
                }
            };

            $scope.agregar_registro = function() {

                $scope.datos_view.recepciones.push({
                    disabled_btn: false,
                    class_btn_add: 'glyphicon glyphicon-plus',
                    fn_btn_add: $scope.agregar_anexo
                });
            };

            $scope.eliminar_registro = function() {

                $scope.datos_view.recepciones.pop();
            };

            $scope.agregar_anexo = function(row) {

                row.disabled_btn = true;

                $scope.datos_view.disabled_agregar_eliminar_registro = true;

                $scope.datos_view.recepciones.push({
                    disabled_btn: false,
                    class_btn_add: 'glyphicon glyphicon-minus',
                    fn_btn_add: $scope.eliminar_anexo
                });
            };

            $scope.eliminar_anexo = function() {
                $scope.datos_view.recepciones.pop();

                var row = $scope.datos_view.recepciones[$scope.datos_view.recepciones.length - 1];
                row.disabled_btn = false;

                $scope.datos_view.disabled_agregar_eliminar_registro = true;
            };

            $scope.crear_recepcion = function(row) {

                $scope.datos_view.disabled_agregar_eliminar_registro = false;
                $scope.datos_view.btn_agregar_eliminar_registro = true;

                row.disabled_btn = true;
            };

            $scope.cancelar_recepcion = function() {
                $state.go('ListarRecepciones');
            };

            $scope.finalizar_recepcion = function() {
                $state.go('ListarRecepciones');
            };

            $scope.agregar_registro();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});