
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosOrdenCompraController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state) {

            var that = this;


            $rootScope.$on('gestionar_productos_orden_compraCompleto', function(e, parametros) {

                $scope.datos_form = {
                    listado_productos: [],
                    titulo : 'Ingresar Productos Orden de Compra'
                };
                
                console.log('======== gestionar_productos_orden_compraCompleto ======');                

                $timeout(function() {
                    $scope.buscar_productos();
                }, 3);

            });

            $rootScope.$on('cerrar_gestion_productos_orden_compraCompleto', function(e, parametros) {
                console.log('======== cerrar_gestion_productos_orden_compraCompleto ======');
                $scope.$$watchers = null;
            });

            $scope.buscar_productos = function() {
                
                console.log('here 1');
                
                for (i = 0; i < 5; i++) {
                    $scope.datos_form.listado_productos.push({nombre: 'producto - ' + i});
                }

            };

            $scope.abrir_fecha_vencimiento = function(producto, $event) {

                $event.preventDefault();
                $event.stopPropagation();

                producto.datepicker_fecha_inicial = true;
            };

            $scope.lista_productos= {
                data: 'datos_form.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'nombre', displayName: 'Codigo Producto 123', width: "10%", enableCellEdit: false},
                    {field: 'nombre', displayName: 'Descripcion', width: "30%", enableCellEdit: false},
                    {field: 'nombre', displayName: 'Cantidad', width: "10%", enableCellEdit: false},
                    {field: 'nombre', displayName: 'Lote', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'nombre', displayName: 'Fecha. Vencimiento', width: "13%", enableCellEdit: false, cellClass: "dropdown-button",
                        cellTemplate: ' <div class="col-xs-12">\
                                            <p class="input-group">\
                                                <input type="text" class="form-control grid-inline-input readonlyinput" name="" id="" \
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_inicial" is-open="row.entity.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" ng-change="" clear-text="Borrar" current-text="Hoy" placeholder="" show-weeks="false" toggle-weeks-text="#"/> \
                                                <span class="input-group-btn">\
                                                    <button class="btn btn-xs" style="margin-top: 3px;" ng-click="abrir_fecha_vencimiento(row.entity,$event);"><i class="glyphicon glyphicon-calendar"></i></button>\
                                                </span>\
                                            </p>\
                                        </div>'},
                    {field: 'nombre', displayName: 'Cant Recibido', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'nombre', displayName: 'Valor Unitario', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="eliminar_producto_orden_compra(row)" ng-disabled="vista_previa" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});