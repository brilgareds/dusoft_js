
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

            $scope.rootModificar.datos_modificados.push(Producto.get(fila.codigo_producto, fila.descripcion, 0,
                    fila.tipo_producto_id, 0, fila.torre, null, 0, fila.item_id, 0, fila.novedad));

            $scope.onCerrar = function () {
                $modalInstance.close();
            };

            $scope.onActualizarProducto = function () {
                var cantidadTotal = 0;
                $scope.rootModificar.datos_modificados.forEach(function (data) {
                    cantidadTotal += parseInt(data.cantidad_ingresada);
                });

                if (parseInt(cantidadTotal) > parseInt($scope.rootModificar.fila_cantidad)) {
                    AlertService.mostrarMensaje("warning", "la cantidad ingresada no puede superar la cantidad enviada");
                    return;
                }

                that.funcionRecursiva($scope.rootModificar.datos_modificados, 0, function () {
                    //that.insertarCantidad(fila.item_id, cantidadTotal);
                    $scope.onCerrar();
                });

            };


            that.funcionRecursiva = function (parametro, index, callback) {

                var item = parametro[index];
                if (!item) {
                    callback(false);
                    return;
                }
                item.novedadAnexa = "CAMBIO LOTE MANUAL";
                $scope.btn_adicionar_producto(item);
                var time = setTimeout(function () {
                    index++;
                    that.funcionRecursiva(parametro, index, callback);
                    clearTimeout(time);
                }, 0);
            }

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
                                                    <button class="btn btn-xs btnCalendario" style="margin-top: 3px;" ng-click="abrir_fecha_vencimiento(row.entity,$event);"><i class="glyphicon glyphicon-calendar"></i></button>\
                                                </span>\
                                            </p>\
                                        </div>'},
                    {field: 'cantidad', displayName: 'Cantidad', enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad_ingresada" validacion-numero-entero ng-disabled="isTmp(row.entity)" class="form-control grid-inline-input" name="" id="" /> </div>'}

                ]

            };

            $scope.btn_adicionar_modificacion = function () {
                var producto = Producto.get(fila.codigo_producto, fila.descripcion, 0,
                        fila.tipo_producto_id, 0, fila.torre);
                producto.setNovedad(fila.novedad);
                producto.setItemId(fila.item_id);
                $scope.rootModificar.datos_modificados.push(producto);
            };

            $scope.abrir_fecha_vencimiento = function (producto, $event) {

                $event.preventDefault();
                $event.stopPropagation();

                producto.datepicker_fecha_inicial = true;
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


            that.insertarCantidad = function (id, cantidad) {
                var obj = {
                    session: $scope.session,
                    data: {
                        cantidad: cantidad,
                        item_id: id

                    }
                };
                Request.realizarRequest(API.I011.INSERTAR_CANTIDAD, "POST", obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

        }]);
});