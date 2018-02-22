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

            that.buscarNovedades = function () {
                var obj = {
                    session: $scope.session
                };
                I011Service.buscarNovedades(obj, function (data) {
                    if (data.status === 200) {
                        //callback(data.obj.listarNovedades);
                        $scope.novedades = data.obj.listarNovedades;
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
                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: $scope.documento_ingreso.getDocumentoDevolucion().numero,
                        prefijo: $scope.documento_ingreso.getDocumentoDevolucion().prefijo
                    }
                };

                Request.realizarRequest(API.I011.CONSULTAR_DETALLE_DEVOLUCION, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.buscarNovedades();
                        that.renderProductosDevolucion(data.obj.lista_productos);

                    }

                });
            };

            that.renderProductosDevolucion = function (productos) {
                $scope.datos_view.listado_productos = [];
                productos.forEach(function (data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion, 0,
                            data.tipo_producto_id, data.lote, $filter('date')(data.fecha_vencimiento, "dd/MM/yyyy"), data.cantidad, data.movimiento_id);
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
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "7%", enableCellEdit: false},
                    {field: 'getCantidadIngresada() | number : "0" ', displayName: 'Cantidad Ingresar', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad_ingresada" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    //{field: 'getNovedad()', displayName: 'Novedad', width: "10%", cellClass: "txt-center dropdown-button",
                    {field: 'novedad', displayName: 'Novedad', width: "10%", cellClass: "txt-center dropdown-button",
                        /* cellTemplate: '<div class="btn-group ">\
                         <select class="form-control selectgeneral ng-model="row.entity.novedad" pull-left">\
                         <option ng-repeat="x in novedades"\
                         value="{{x.novedad_devolucion_id}}">{{x.descripcion}}\
                         </option>\
                         </select>\
                         </div>'},
                         /* cellTemplate: '<div class="input-group-btn" cambiar-foco>\
                         <button type="button" class="btn btn-default dropdown-toggle" ng-model="row.entity.novedad"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" > {{novedad.descripcion}} <span  class="caret"></span></button>\
                         <ul class="dropdown-menu">\
                         <li ng-repeat="novedad in novedades">\
                         <a href="javascript:void(0)" ng-click="onSeleccionNovedad(novedad)">{{novedad.descripcion}}</a>\
                         </li>\
                         </ul>\
                         </div>'},*/
                        cellTemplate: '<div class="btn-group">\
                     <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                     <ul class="dropdown-menu dropdown-options">\
                     <li ng-repeat="novedad in novedades">\
                     <a href="javascript:void(0)" ng-click="onSeleccionNovedad(novedad.novedad_devolucion_id)">{{novedad.descripcion}}</a>\
                     </li>\
                     </ul>\
                     </div>'},
                    {width: "9%", displayName: "Opcion", cellClass: "txt-center",
                        /*cellTemplate: '<div class="btn-group">\
                         <button  class="btn btn-info btn-xs btnClick" ng-click="onprueba(row.entity)"><span class="glyphicon glyphicon-pencil"></span></button>\
                         <button class="btn btn-success btn-xs "  ng-click="btn_adicionar_producto(row.entity)" ng-disabled="habilitarAdicion(row.entity)" id="agregarPro"><span class="glyphicon glyphicon-plus-sign"></span></button>\
                         </div>'}*/
                        cellTemplate: '<div class="btn-group">\
                                        <button  class="btn btn-info btn-xs btnClick" ng-click="btn_modificar_producto(row.entity)"><span class="glyphicon glyphicon-pencil"></span></button>\
                                        <button class="btn btn-success btn-xs "  ng-click="btn_adicionar_producto(row.entity)" ng-disabled="habilitarAdicion(row.entity)" id="agregarPro"><span class="glyphicon glyphicon-plus-sign"></span></button>\
                                       </div>'}
                ]
            };


            $scope.habilitarAdicion = function (producto) {
                var disabled = false;

                if (producto.cantidad_ingresada === undefined || producto.cantidad_ingresada === "" || parseInt(producto.cantidad_ingresada) <= 0) {
                    disabled = true;
                }

                /* if (producto.novedad === undefined || producto.novedad === "") {
                 disabled = true;
                 }*/

                if (parseInt(producto.cantidad_ingresada) > parseInt(producto.cantidad)) {
                    AlertService.mostrarMensaje("warning", "la cantidad ingresada no puede superar la cantidad enviada");
                    disabled = true;
                }

                return disabled;
            };




            /**
             * @author German Galvis
             * @fecha 2018-02-14
             * +Descripcion Metodo encargado listar los productos asociados al docTmp
             * parametros: variables
             */
            that.listarProductosValidados = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: $scope.doc_tmp_id

                    }
                };
                Request.realizarRequest(API.E009.CONSULTAR_DETALLE_DEVOLUCION, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosValidados(data.obj.lista_productos);

                    }

                });
            };


            that.renderProductosValidados = function (productos) {
                $scope.datos_view.listado_productos_validados = [];
                console.log("productos segunda tabla", productos);
                productos.forEach(function (data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion, 0,
                            data.tipo_producto_id, data.lote, $filter('date')(data.fecha_vencimiento, "dd/MM/yyyy"), data.cantidad, data.item_id);
                    $scope.datos_view.listado_productos_validados.push(producto);
                });
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
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "7%", enableCellEdit: false},
                    {field: 'cantidad', displayName: 'Cantidad Ingresada', width: "10%", enableCellEdit: false},
                    {field: 'novedad', displayName: 'Novedad', width: "20%", enableCellEdit: false},
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

            //  Abre slider para gestionar productos
            $scope.btn_modificar_producto = function (fila) {
                // var fila = fila;
                // var empresa  = Usuario.getUsuarioActual();

                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "modificar_productos",
                    templateUrl: 'views/I011/ventanaModificacion.html',
                    controller: "ModificarProductoController",
                    resolve: {
                        fila: function () {
                            return fila;
                        },
                        empresa: function () {
                            return  Usuario.getUsuarioActual();
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function (data) {

                    console.log('modalInstance: ' + data);

                    //}   , function () {

                });

            };


            $scope.onBuscarDevoluciones = function () {
                that.buscarDevoluciones($scope.documento_ingreso.get_bodega(), function () {
                    //$scope.centros = data;
                });
            };

            $scope.onBuscarProductosDevoluciones = function () {
                that.listarProductosDevolucion();
            };


            $scope.btn_adicionar_producto = function (fila) {
                console.log("q hay en el item de la tabla", fila);
                if ($scope.doc_tmp_id === '00000') {
                    that.guardarNewDocTmp(function (respuesta) {
                        if (respuesta) {

                            that.guardarProductoTmp(fila);

                        }
                    });
                    // that.listarProductosValidados();
                } else {
                    that.guardarProductoTmp(fila);
                    //that.listarProductosValidados();
                }
                that.refrescarVista();
            };


            /**
             * @author German Galvis
             * +Descripcion Metodo encargado de guardar NewDocTmp
             * @fecha 2018-02-20
             */
            that.guardarNewDocTmp = function (callback) {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        bodega_doc_id: $scope.documento_ingreso.get_bodegas_doc_id(),
                        empresaId: usuario.getEmpresa().getCodigo(),
                        centroUtilidad: usuario.getEmpresa().centroUtilidad.codigo,
                        bodega: usuario.getEmpresa().centroUtilidad.bodega.codigo,
                        numero_doc: $scope.documento_ingreso.getDocumentoDevolucion().numero,
                        empresa_envia: $scope.documento_ingreso.getDocumentoDevolucion().empresa_id,
                        abreviatura: $scope.documento_ingreso.get_prefijo(),
                        observacion: $scope.documento_ingreso.get_observacion()
                    }
                };

                Request.realizarRequest(API.I011.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        $scope.doc_tmp_id = data.obj.movimiento_temporal_id;
                        callback(data);
                        //$scope.isTmp();
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            that.guardarProductoTmp = function (producto) {
                var fecha_actual = new Date();
                var usuario = Usuario.getUsuarioActual();
                fecha_actual = $filter('date')(new Date(fecha_actual), "dd/MM/yyyy");
                var parametro = {
                    empresaId: usuario.getEmpresa().getCodigo(),
                    centroUtilidad: usuario.getEmpresa().centroUtilidad.codigo,
                    bodega: usuario.getEmpresa().centroUtilidad.bodega.codigo,
                    codigoProducto: producto.codigo_producto,
                    cantidad: producto.cantidad_ingresada,
                    lote: producto.lote,
                    fechaVencimiento: producto.fecha_vencimiento,
                    docTmpId: $scope.doc_tmp_id
                };
                that.insertarProductos(parametro);
            };

            that.insertarProductos = function (parametro) {
                var obj = {
                    session: $scope.session,
                    data: parametro
                };

                Request.realizarRequest(API.E009.CREAR_ITEM, "POST", obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
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
            $scope.eliminar_documento = function () {
                that.eliminarGetDocTemporal();
            };

            /**
             * @author German Galvis
             * @fecha 2018-02-19
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
                I011Service.eliminarGetDocTemporal(obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
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


            that.borarrVariables = function () {
                $scope.doc_tmp_id = "00000";
                $scope.documento_ingreso.set_observacion('');
                $scope.datos_view.listado_productos = [];
                $scope.datos_view.listado_productos_validados = [];
            };

            that.refrescarVista = function () {
                that.listarProductosValidados();
            };

            $scope.cancelar_documento = function () {
                $state.go('DocumentosBodegas');
            };

            $scope.onSeleccionNovedad = function (novedad) {
                console.log("on seleccion", novedad);
                //$scope.form.filtror = filtro;
            };

            $scope.onprueba = function (fila) {
                console.log("fila", fila);
                //$scope.form.filtror = filtro;
            };





        }]);
});