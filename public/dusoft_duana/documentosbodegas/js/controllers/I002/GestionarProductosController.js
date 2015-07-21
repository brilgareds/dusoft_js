
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state) {

            var that = this;


            $rootScope.$on('gestionar_productosCompleto', function(e, parametros) {

                $scope.datos_form = {
                    listado_productos: [],
                    titulo : 'Buscar Productos'
                };
                
                console.log('======== gestionar_productosCompleto ======');
                console.log($scope.datos_form);

                $timeout(function() {
                    $scope.buscar_productos();
                }, 3);

            });

            $rootScope.$on('cerrar_gestion_productosCompleto', function(e, parametros) {
                $scope.$$watchers = null;
            });

            $scope.buscar_productos = function() {

                console.log('here 2');

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
                    {field: 'nombre', displayName: 'Codigo Producto', width: "10%", enableCellEdit: false},
                    {field: 'nombre', displayName: 'Descripcion', width: "30%", enableCellEdit: false},
                    {field: 'nombre', displayName: 'Cantidad', width: "7%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'nombre', displayName: 'IVA', width: "5%", enableCellEdit: false},
                    {field: 'nombre', displayName: 'Lote', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'nombre', displayName: 'Fecha. Vencimiento', width: "12%", enableCellEdit: false, cellClass: "dropdown-button",
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
                    {field: 'nombre', displayName: 'Valor Unitario', width: "9%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'nombre', displayName: 'Justificacion', width: "13%", enableCellEdit: false,
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