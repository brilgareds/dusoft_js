
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state) {

            var that = this;


            $rootScope.$on('gestionar_productosCompleto', function(e, parametros) {

                $scope.datos_view = {
                    listado_productos: []
                };

                $timeout(function() {
                    $scope.buscar_productos();
                }, 3);

            });

            $rootScope.$on('cerrar_gestion_productosCompleto', function(e, parametros) {
                $scope.$$watchers = null;
            });

            $scope.buscar_productos = function() {

                for (i = 0; i < 20; i++) {
                    $scope.datos_view.listado_productos.push({nombre: 'producto - ' + i});
                }
                console.log($scope.datos_view.listado_productos);
            };

            $scope.abrir_fecha_vencimiento = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datos_view.datepicker_fecha_inicial = true;
                $scope.datos_view.datepicker_fecha_final = false;

            };

            $scope.lista_productos_orden_compra = {
                data: 'datos_view.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                //enableCellEditOnFocus: true,
                enableCellEdit: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'nombre', displayName: 'Codigo Producto', width: "10%", enableCellEdit: false},
                    {field: 'nombre', displayName: 'Descripcion', width: "30%", enableCellEdit: false},
                    {field: 'nombre', displayName: 'Cantidad', width: "10%", enableCellEdit: false},
                    {field: 'nombre', displayName: 'Cant Recibido', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'nombre', displayName: 'V. Unt', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'nombre', displayName: 'Lote', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'nombre', displayName: 'F. Vcto', width: "10%", enableCellEdit: false,
                        cellTemplate: ' <div class="col-xs-12">\
                                            <p class="input-group">\
                                                <input type="text" class="form-control grid-inline-input readonlyinput" name="" id="" \
                                                    datepicker-popup="{{format}}" ng-model="datos_view.fecha_inicial" is-open="datos_view.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" ng-change="" clear-text="Borrar" current-text="Hoy" placeholder="F. Vcto" show-weeks="false" toggle-weeks-text="#"/> \\n\
                                                <span class="input-group-btn">\
                                                    <button class="btn btn-xs" ng-click="abrir_fecha_vencimiento($event);"><i class="glyphicon glyphicon-calendar"></i></button>\
                                                </span>\
                                            </p>\
                                        </div>'},
                    {field: 'nombre', displayName: 'Acciones', width: "10%", enableCellEdit: false},
                                        
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});