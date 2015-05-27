
define(["angular", "js/controllers"
], function(angular, controllers) {

    controllers.controller('VerificarRecepcionesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter) {

            var that = this;

            $scope.datos_view = {
                lista_productos: []
            };

            that.buscar_productos_orden_compra = function() {

                for (var i = 0; i < 25; i++) {
                    $scope.datos_view.lista_productos.push({codigo_producto: '0CDRE4512-' + i});
                }
            };

            $scope.lista_productos = {
                data: 'datos_view.lista_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo Producto', width: "10%"},
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

            that.buscar_productos_orden_compra();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});