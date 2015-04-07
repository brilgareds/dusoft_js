
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {

    controllers.controller('GestionarPlanillasController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Sesion) {

            var that = this;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.usuario_id,
                auth_token: Sesion.token
            };

            $scope.datos_planilla = [];

            $scope.buscar_documentos_bodega = function(termino, paginando) {

                console.log('==============================');
                console.log('== buscar_documentos_bodega ==');
                console.log('==============================');

                for (i = 0; i < 30; i++) {
                    $scope.datos_planilla.push({nombre_cliente: 'nombre_cliente_' + i, documento: 'EFC ' + i, cajas: i, neveras: i, temperatura_neveras: i});
                }
            };


            $scope.gestionar_documentos_bodega = function() {

                $scope.slideurl = "views/generarplanilladespacho/gestionardocumentosbodegas.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_documentos_bodega');
            };
            
            $scope.cerrar_gestion_documentos_bodega = function() {

                $scope.$emit('cerrar_gestion_documentos_bodega', {animado: true});

            };


            $scope.lista_documentos_bodega = {
                data: 'datos_planilla',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_cliente', displayName: 'Cliente', width: "35%"},
                    {field: 'documento', displayName: 'Documento', width: "25%"},
                    {field: 'cajas', displayName: 'Cant. Cajas', width: "10%"},
                    {field: 'neveras', displayName: 'Cant. Neveras', width: "10%"},
                    {field: 'temperatura_neveras', displayName: 'Temp. Neveras', width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminar_producto_orden_compra(row)" ng-disabled="vista_previa" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };

            $scope.buscar_documentos_bodega();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});