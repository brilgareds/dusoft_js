
define([
    "angular",
    "js/controllers",
], function (angular, controllers) {

    controllers.controller('E009Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        'Usuario',
        "Devolucion",
        "DocumentoIngreso",
        "Usuario",
        "ProductoDevolucion",
        "E009Service",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Usuario, Devolucion, Documento, Sesion, Producto, E009Service) {

            var that = this;
            $scope.Devolucion = Devolucion;
            $scope.doc_tmp_id = "00000";
            $scope.selectedBodega = '03';
            $scope.observacion = '';


            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                listado: [],
                termino_busqueda_proveedores: "",
                btn_buscar_productos: ""
            };

            that.init = function (callback) {
                $scope.root = {};
                //$scope.selectedBodega = '';
                $scope.observacion = '';
                callback();
            };

            $scope.cancelar_documento = function () {
                $state.go('DocumentosBodegas');
            };

            that.buscarBodega = function (callback) {
                var obj = {
                    session: $scope.session
                };
                E009Service.buscarBodega(obj, function (data) {
                    if (data.status === 200) {
                        callback(data.obj.listarBodegas);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            //  Abre slider para gestionar productos
            $scope.seleccionar_productos = function () {

                // $state.go('buscarProductos');
                $scope.slideurl = "views/E009/gestionarproductosE009.html?time=" + new Date().getTime();
                $scope.$emit('gestionar_productos', {empresa: Sesion.getUsuarioActual()});
            };

            // Cerrar slider para gestionar productos
            $scope.cerrar_seleccion_productos = function () {

                $scope.$emit('cerrar_gestion_productos', {animado: true});

                // that.refrescarVista();
            };

            /* that.refrescarVista = function () {
             
             that.borarrVariables();
             
             $scope.buscar_productos_orden_compra();
             $scope.Empresa.limpiar_productos();
             $scope.DocumentoIngreso.get_orden_compra().limpiar_productos_ingresados();
             $scope.DocumentoIngreso.get_orden_compra().limpiar_productos_seleccionados();
             
             that.listarGetDocTemporal(function (respuesta) {
             
             if (respuesta) {
             
             that.listarGetItemsDocTemporal(function (respuesta) {
             
             if (respuesta) {
             
             that.listarParametros();
             that.listarProductosPorAutorizar();
             }
             });
             }
             });
             };*/


/*
             * retorna la diferencia entre dos fechas
             */
            $scope.restaFechas = function(f1, f2)
            {
                var aFecha1 = f1.split('/');
                var aFecha2 = f2.split('/');
                var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
                var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
                var dif = fFecha2 - fFecha1;
                var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
                return dias;
            };

            that.borarrVariables = function () {
                $scope.doc_tmp_id = "00000";
                $scope.selectedBodega = '03';
                $scope.observacion = '';
            };

            $scope.lista_productos_devolucion = {
                data: 'Devolucion.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo', width: "11%", enableCellEdit: false,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="tipo_producto_id == 1" >N</span>\
                                                <span class="label label-danger" ng-show="tipo_producto_id == 2">A</span>\
                                                <span class="label label-warning" ng-show="tipo_producto_id == 3">C</span>\
                                                <span class="label label-primary" ng-show="tipo_producto_id == 4">I</span>\
                                                <span class="label label-info" ng-show="tipo_producto_id == 5">Ne</span>\
                                                <span ng-cell-text >{{COL_FIELD}} </span>\
                                                <span class="glyphicon glyphicon-lock text-danger" ng-show="row.entity.estado == \'0\'" ></span>\
                                            </div>'
                    },
                    {field: 'getDescripcion()', displayName: 'Descripcion', width: "35%", enableCellEdit: false},
                    {field: 'get_valor_unit()', displayName: 'Molecula', width: "15%", enableCellEdit: false},
                    {field: 'getCantidad() | number : "0" ', displayName: 'Cantidad', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad_ingresada" validacion-numero-entero ng-disabled="isTmp(row.entity)" class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_fecha_vencimiento()', displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false, cellClass: "dropdown-button",
                        cellTemplate: ' <div class="col-xs-12" cambiar-foco >\
                                            <p class="input-group" cambiar-foco >\
                                                <input type="text" class="form-control grid-inline-input readonlyinput calendario"  \
                                                    datepicker-popup="{{format}}" ng-model="row.entity.fecha_vencimiento" is-open="row.entity.datepicker_fecha_inicial" \
                                                    min="minDate"   readonly  close-text="Cerrar" ng-change="" clear-text="Borrar" current-text="Hoy" placeholder="" show-weeks="false" toggle-weeks-text="#"/> \
                                                <span class="input-group-btn">\
                                                    <button class="btn btn-xs btnCalendario" style="margin-top: 3px;" ng-click="abrir_fecha_vencimiento(row.entity,$event);"><i class="glyphicon glyphicon-calendar"></i></button>\
                                                </span>\
                                            </p>\
                                        </div>'},
                    {field: 'get_lote()', displayName: 'Lote', width: "7%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.lote" class="form-control grid-inline-input" ng-disabled="isTmp(row.entity)" name="" id="" /> </div>'},
                    {width: "5%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group" cambiar-foco >\
                                            <div ng-if="!validarAutorz(row.entity)" cambiar-foco>\
                                                <button  class="btn btn-danger btn-xs btnClick" ng-disabled="validarTmp(row.entity)"  ><span class="glyphicon glyphicon-time"></span></button>\
                                            </div>\
                                            <div ng-if="validarAutorz(row.entity)"  cambiar-foco>\
                                                <div ng-if="!validarTmp(row.entity)">\
                                                  <div ng-if="!validarCantidadAdicion(row.entity)" cambiar-foco >\
                                                     <button class="btn btn-default btn-xs btnClick" ng-disabled="habilitar_ingreso_producto(row.entity)" ng-click="ingresar_producto(row.entity)" id="ingreproducto"><span class="glyphicon glyphicon-ok"></span></button>\
                                                     <button class="btn btn-success btn-xs " ng-disabled="habilitar_ingreso_lote(row.entity)" ng-click="btnAdicionarNuevoLote(row.entity)" id="agregarlote"><span class="glyphicon glyphicon-plus-sign"></span></button>\
                                                   </div>\
                                                  <div ng-if="validarCantidadAdicion(row.entity)" cambiar-foco >\
                                                     <button class="btn btn-default btn-xs btnClick" ng-disabled="habilitar_ingreso_producto(row.entity)" ng-click="ingresar_producto(row.entity)" id="ingreproducto" ><span class="glyphicon glyphicon-ok"></span></button>\
                                                     <button class="btn btn-danger btn-xs " ng-disabled="validarTmp(row.entity)"  id="agregarlote"><span class="glyphicon glyphicon-minus-sign" ></span></button>\
                                                  </div>\
                                                </div>\
                                                <div ng-if="validarTmp(row.entity)" cambiar-foco>\
                                                   <button class="btn btn-success btn-xs btnClick" ng-disabled="validarTmp(row.entity)" id="ingreproducto" ><span class="glyphicon glyphicon-ok red"></span></button>\
                                                   <button class="btn btn-danger btn-xs " ng-disabled="validarTmp(row.entity)" id="agregarlote"><span class="glyphicon glyphicon-minus-sign" ></span></button>\
                                                </div>\
                                            </div>\
                                        </div>'}
                ]
            };

            $scope.grabar_documento = function () {
                that.guardarNewDocTmp();
            };

            /**
             * @author German Galvis
             * +Descripcion Metodo encargado de guardar NewDocTmp
             * @fecha 2018-02-14
             */
            that.guardarNewDocTmp = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        bodega_seleccionada: $scope.selectedBodega,
                        observacion: $scope.observacion
                    }
                };

                Request.realizarRequest(API.E009.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        $scope.doc_tmp_id = data.obj.movimiento_temporal_id;
                        $scope.isTmp();
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            /**
             * @author German Galvis
             * @fecha 2018-02-14
             * +Descripcion Metodo encargado de invocar el servicio que
             *              borra los DocTemporal
             */
            that.eliminarGetDocTemporal = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        doc_tmp_id: $scope.doc_tmp_id
                    }
                };
                E009Service.eliminarGetDocTemporal(obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        // that.refrescarVista();
                        that.borarrVariables();
                    }

                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            $scope.eliminar_documento = function () {
                that.eliminarGetDocTemporal();
            };

            $scope.btn_eliminar_documento = function () {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar el documento?</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

                            $scope.confirmar = function () {
                                $scope.eliminar_documento();
                                $modalInstance.close();
                            };

                            $scope.close = function () {
                                $modalInstance.close();
                            };

                        }]
                };
                var modalInstance = $modal.open($scope.opts);
            };



            that.init(function () {
                that.buscarBodega(function (data) {
                    $scope.bodegas = data;
                });
            });

            $scope.isNoTmp = function () {
                var disabled = false;
                if ($scope.doc_tmp_id === "00000") {
                    //if ($scope.doc_tmp_id === "00000" && $scope.DocumentoIngreso.get_orden_compra() === undefined) {
                    disabled = true;
                }
                //console.log("isnotmp", disabled);
                return disabled;
            };

            $scope.isTmp = function () {
                var disabled = false;

                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                    disabled = true;
                }
                // console.log("istmp", disabled);
                return disabled;
            };

        }]);
});