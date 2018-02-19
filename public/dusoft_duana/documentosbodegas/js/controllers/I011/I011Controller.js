define([
    "angular",
    "js/controllers",
], function (angular, controllers) {

    controllers.controller('I011Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        'Usuario',
        'ProductoIngresoDevolucion',
        "DocumentoIngresoDevolucion",
        "I011Service",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Usuario, Producto, Documento, I011Service) {

            var that = this;
            var datos_documento = localStorageService.get("documento_bodega_I011");
            $scope.doc_tmp_id = "00000";
            //$scope.doc_seleccionado="";
            $scope.documento_ingreso = Documento.get(datos_documento.bodegas_doc_id, datos_documento.prefijo, datos_documento.numero, $filter('date')(new Date(), "dd/MM/yyyy"));

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                listado_productos: [],
                listado_productos_validados: []
            };


            that.init = function (callback) {
                $scope.root = {};
                $scope.documento_ingreso.set_observacion('');
                callback();
            };

            that.buscarBodega = function (callback) {
                var obj = {
                    session: $scope.session
                };
                I011Service.buscarBodega(obj, function (data) {
                    if (data.status === 200) {
                        callback(data.obj.listarBodegas);

                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };


            that.buscarDevoluciones = function (parametro) {
                var obj = {
                    session: $scope.session,
                    bodega: parametro
                };
                I011Service.buscarDevoluciones(obj, function (data) {
                    if (data.status === 200) {
                        $scope.docDevoluciones = data.obj.listarDevoluciones;
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            that.listarProductosDevolucion = function () {
                console.log("documento seleccionado", $scope.documento_ingreso.getDocumentoDevolucion());
                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: $scope.documento_ingreso.getDocumentoDevolucion().numero,
                        prefijo: $scope.documento_ingreso.getDocumentoDevolucion().prefijo
                    }
                };

                Request.realizarRequest(API.I011.CONSULTAR_DETALLE_DEVOLUCION, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosDevolucion(data.obj.lista_productos);

                    }

                });
            };


            that.renderProductosDevolucion = function (productos) {
                $scope.datos_view.listado_productos = [];
                productos.forEach(function (data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion, 0,
                            data.tipo_producto_id, data.lote, data.fecha_vencimiento, data.cantidad, data.movimiento_id);
                    $scope.datos_view.listado_productos.push(producto);
                });
            };


            $scope.lista_productos_ingreso = {
                data: 'datos_view.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo ', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                <span ng-cell-text >{{COL_FIELD}} </span>\
                                                <span class="glyphicon glyphicon-lock text-danger" ng-show="row.entity.estado == \'0\'" ></span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripcion', width: "35%", enableCellEdit: false},
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%", enableCellEdit: false},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false, cellClass: "dropdown-button",
                        cellTemplate: ' <div class="col-xs-12" cambiar-foco >\
                                            <p class="input-group" cambiar-foco >\
                                                <input type="text" class="form-control grid-inline-input readonlyinput calendario"  \
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_vencimiento" is-open="row.entity.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" ng-change="" clear-text="Borrar" current-text="Hoy" placeholder="" show-weeks="false" toggle-weeks-text="#"/> \
                                                </p>\
                                        </div>'},
                    {field: 'lote', displayName: 'Lote', width: "7%", enableCellEdit: false},
                    {field: 'getCantidadIngresada() | number : "0" ', displayName: 'Cantidad Ingresar', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad_ingresada" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'getNovedad()', displayName: 'Novedad', width: "10%",cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li>\
                                                <a href="javascript:void(0);" ng-click="onRowClick(row)">Ver movimiento</a>\
                                            </li>\
                                            <li>\
                                                <a href="javascript:void(0);" ng-click="onTrearExistencias(row.entity)">Modificar lotes</a>\
                                            </li>\
                                        </ul>\
                                    </div>'},
                    {width: "9%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                        <button  class="btn btn-info btn-xs btnClick" ng-click="btn_eliminar_producto(row.entity)"><span class="glyphicon glyphicon-pencil"></span></button>\
                                        <button class="btn btn-success btn-xs " ng-disabled="habilitar_ingreso_lote(row.entity)" ng-click="btnAdicionarNuevoLote(row.entity)" id="agregarlote"><span class="glyphicon glyphicon-plus-sign"></span></button>\
                                       </div>'}
                ]
            };

            $scope.lista_productos_validados = {
                data: 'datos_view.listado_productos_validados',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo ', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                <span ng-cell-text >{{COL_FIELD}} </span>\
                                                <span class="glyphicon glyphicon-lock text-danger" ng-show="row.entity.estado == \'0\'" ></span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripcion', width: "35%", enableCellEdit: false},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false, cellClass: "dropdown-button",
                        cellTemplate: ' <div class="col-xs-12" cambiar-foco >\
                                            <p class="input-group" cambiar-foco >\
                                                <input type="text" class="form-control grid-inline-input readonlyinput calendario"  \
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_vencimiento" is-open="row.entity.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" ng-change="" clear-text="Borrar" current-text="Hoy" placeholder="" show-weeks="false" toggle-weeks-text="#"/> \
                                                </p>\
                                        </div>'},
                    {field: 'lote', displayName: 'Lote', width: "7%", enableCellEdit: false},
                    {field: 'getCantidad() | number : "0" ', displayName: 'Cantidad Ingresada', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'getCantidad() | number : "0" ', displayName: 'Novedad', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "9%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                        <button  class="btn btn-danger btn-xs btnClick" ng-click="btn_eliminar_producto(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                         </div>'}
                ]
            };


            that.init(function () {
                that.buscarBodega(function (data) {
                    $scope.bodegas = data;
                });
            });

            $scope.onBuscarDevoluciones = function () {
                that.buscarDevoluciones($scope.documento_ingreso.get_bodega(), function () {
                    //$scope.centros = data;
                });
            };

            $scope.onBuscarProductosDevoluciones = function () {
                that.listarProductosDevolucion();
            };


        }]);
});