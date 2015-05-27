
define(["angular", "js/controllers",
], function(angular, controllers) {

    controllers.controller('ListarRecepcionesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter) {

            var that = this;

            $scope.datos_view = {
                lista_recepciones: []
            };

            $scope.crear_recepcion = function() {
                $state.go('RecepcionMercancia');
            };

            that.buscar_recepciones = function() {

                for (var i = 0; i < 25; i++) {
                    $scope.datos_view.lista_recepciones.push({numero_guia: i});
                }

            };
            
            $scope.verificar_recepcion = function(){
                $state.go('VerificarMercancia');
            };

            $scope.lista_recepciones_mercancia = {
                data: 'datos_view.lista_recepciones',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_guia', displayName: '# Guía', width: "10%"},
                    {field: 'get_transportadora().get_descripcion()', displayName: 'Transportador', width: "15%"},
                    {field: 'get_ciudad().get_nombre_ciudad()', displayName: 'Proveedor', width: "25%"},
                    {field: 'get_fecha_despacho()', displayName: "Orden Compra", width: "9%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Cajas', width: "5%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Neveras', width: "5%"},
                    {field: 'get_descripcion_estado()', displayName: "Novedad", width: "15%"},
                    {field: 'get_fecha_registro()', displayName: "F. Registro", width: "9%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="verificar_recepcion(row.entity)" >Verifcar</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };

            that.buscar_recepciones();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});