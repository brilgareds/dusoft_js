
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('ModificarProductoController', [
        '$scope', '$rootScope', 'Request',
        '$modal', "$modalInstance", 'API', "socket", "$timeout", "$filter",
        "AlertService", "localStorageService", "$state",
        'ProductoIngresoDevolucion', 'empresa', 'fila',
        function ($scope, $rootScope, Request, $modal, $modalInstance, API, socket, $timeout, $filter, AlertService,
                localStorageService, $state, Producto, empresa, fila) {

            var that = this;
            $scope.parametros = '';


            /*
             * @Author: Eduar
             * +Descripcion: Definicion del objeto que contiene los parametros del controlador
             */
            $scope.rootModificar = {
                datos_modificados: [],
                fila: fila,
                fila_cantidad: parseFloat(fila.cantidad).toFixed(0)
            };


            $scope.onCerrar = function () {
                $modalInstance.close(1);
            };

            $scope.rootModificar.datos_modificados.push(Producto.get(fila.codigo_producto, fila.descripcion, 0,
                    fila.tipo_producto_id));


            $scope.listadoModificaciones = {
                data: 'rootModificar.datos_modificados',
                enableColumnResize: true,
                enableRowSelection: false,
                showFilter: true,
                enableHighlighting: true,
                size: 'sm',
                columnDefs: [
                    {field: 'codigo_lote', displayName: 'Lote', enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text"  ng-model="row.entity.lote" class="form-control grid-inline-input" name="lote" id="lote" /> </div>'},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', cellClass: "dropdown-button",
                        cellTemplate: ' <div class="col-xs-12" cambiar-foco >\
                                            <p class="input-group" cambiar-foco  >\
                                                <input type="text" class="form-control grid-inline-input readonlyinput calendario"  \
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_vencimiento" is-open="row.entity.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" clear-text="Borrar" current-text="Hoy" show-weeks="false" toggle-weeks-text="#"/> \
                                                <span class="input-group-btn">\
                                                    <button class="btn btn-xs btnCalendario" style="margin-top: 3px;" ng-disabled="validarTmp(row.entity)" ng-click="abrir_fecha_vencimiento(row.entity,$event);"><i class="glyphicon glyphicon-calendar"></i></button>\
                                                </span>\
                                            </p>\
                                        </div>'},
                    {field: 'cantidad', displayName: 'Cantidad', enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad" validacion-numero-entero ng-disabled="isTmp(row.entity)" class="form-control grid-inline-input" name="" id="" /> </div>'}

                ]

            };

            $scope.btn_adicionar_modificacion = function () {
                var producto = Producto.get(fila.codigo_producto, fila.descripcion, 0,
                        fila.tipo_producto_id);
                $scope.rootModificar.datos_modificados.push(producto);
            };


            $modalInstance.opened.then(function () {
                //Timer para permitir que la animacion termine
                $timeout(function () {
                }, 500);

            });

            $modalInstance.result.then(function () {
                that.finalizar();
            }, function () {
                that.finalizar();
            });

            that.finalizar = function () {

                //Timer para no impedir la animacion de la ventana
                $timeout(function () {
                    $scope.rootModificar = {};
                    $scope.$$watchers = null;

                }, 500);
            };


            /*$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {//ng-disabled="habilitar_ingreso_producto(row.entity)"
             $scope.$$watchers = null;
             });*/
        }]);
});