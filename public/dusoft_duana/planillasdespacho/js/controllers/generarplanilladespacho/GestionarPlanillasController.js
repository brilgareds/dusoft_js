
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


            $scope.lista_remisiones_bodega = {
                data: 'datos_planilla',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_guia', displayName: 'Cliente', width: "35%"},
                    {field: 'transportador', displayName: 'Documento', width: "25%"},                    
                    {field: 'cajas', displayName: 'Cant. Cajas', width: "10%"},
                    {field: 'neveras', displayName: 'Cant. Neveras', width: "10%"},
                    {field: 'neveras', displayName: 'Temp. Neveras', width: "10%"},                    
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="modificar_planilla_despacho(row.entity,0)" >Modificar</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="generar_reporte(row.entity,0)" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-disabled="true" ng-click="enviar_email(row.entity,0)" >Enviar por Email</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});