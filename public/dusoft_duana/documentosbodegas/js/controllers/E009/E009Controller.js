
define([
    "angular",
    "js/controllers",
], function (angular, controllers) {

    controllers.controller('E009Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        'Usuario',
        "DocumentoDevolucion",
        "Usuario",
        "ProductoDevolucion",
        "E009Service",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Usuario, Documento, Sesion, Producto, E009Service) {

            var that = this;
            var datos_documento = localStorageService.get("documento_bodega_E009");
            $scope.doc_tmp_id = "00000";
            $scope.validarDesdeLink = false;
            $scope.tipoProducto = {
                id: '',
                nombre: ''
            };
            $scope.documento_devolucion = Documento.get(datos_documento.bodegas_doc_id, datos_documento.prefijo, datos_documento.numero, $filter('date')(new Date(), "dd/MM/yyyy"));


            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                listado_productos: [],
                btn_buscar_productos: ""
            };

            that.init = function (callback) {
                $scope.root = {};
                $scope.documento_devolucion.set_observacion('');
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

            that.buscarBodegaPorId = function (id, callback) {
                var obj = {
                    session: $scope.session,
                    data: {
                        id: id
                    }
                };
                E009Service.buscarBodegaId(obj, function (data) {
                    if (data.status === 200) {
                        callback(data.obj.listarBodegas);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            //  Abre slider para gestionar productos
            $scope.seleccionar_productos = function () {

                $scope.slideurl = "views/E009/gestionarproductosE009.html?time=" + new Date().getTime();
                $scope.$emit('gestionar_productos', {empresa: Sesion.getUsuarioActual(), tipoProducto: $scope.tipoProducto});
            };

            // Cerrar slider para gestionar productos
            $scope.cerrar_seleccion_productos = function (data) {

                $scope.$emit('cerrar_gestion_productos', {animado: true});
                $scope.tipoProducto = data;
                that.listarProductosAsociados();
            };

            /**
             * @author German Galvis
             * @fecha 2018-02-14
             * +Descripcion Metodo encargado listar los productos asociados al docTmp
             * parametros: variables
             */
            that.listarProductosAsociados = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: $scope.doc_tmp_id

                    }
                };

                Request.realizarRequest(API.E009.CONSULTAR_DETALLE_DEVOLUCION, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosDevolucion(data.obj.lista_productos);

                    }

                });
            };


            that.renderProductosDevolucion = function (productos) {
                $scope.datos_view.listado_productos = [];
                productos.forEach(function (data) {
                    var fecha = sumarDias(new Date(data.fecha_vencimiento), 1);
                    var producto = Producto.get(data.codigo_producto, data.descripcion, 0,
                            data.tipo_producto_id, data.subClase, data.lote, $filter('date')(fecha, "dd/MM/yyyy"), parseFloat(data.cantidad).toFixed(), data.item_id);
                    $scope.datos_view.listado_productos.push(producto);
                });
            };

            function sumarDias(fecha, dias) {
                fecha.setDate(fecha.getDate() + dias);
                return fecha;
            }

            that.borarrVariables = function () {
                $scope.doc_tmp_id = "00000";
                $scope.tipoProducto.id = '';
                $scope.tipoProducto.nombre = '';
                $scope.documento_devolucion.set_observacion('');
                $scope.documento_devolucion.set_bodega_destino(null);
                $scope.datos_view.listado_productos = [];
                $scope.validarDesdeLink = false;
            };


            /**
             * @author German Galvis
             * @fecha 2018-02-14
             * +Descripcion Metodo encargado de eliminar el producto seleccionado
             * parametros: variables
             */
            $scope.eliminar_producto = function (parametro) {
                var parametro = {item_id: parametro.item_id,
                    docTmpId: $scope.doc_tmp_id};
                that.eliminarProductoDevolucion(parametro, function (condicional) {
                    if (condicional) {
                        that.refrescarVista();
                        AlertService.mostrarMensaje("warning", "El Producto fue Eliminado Correctamente!!");
                    }
                });

            };


            $scope.btn_eliminar_producto = function (fila) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="cerrar()">&times;</button>\
                                    <h4 class="modal-title">MENSAJE DEL SISTEMA</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar el siguiente producto?</h4>\
                                    <h5>' + fila.descripcion + '</h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="cerrar()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar_eliminar_producto()" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

                            $scope.confirmar_eliminar_producto = function () {
                                $scope.eliminar_producto(fila);
                                $modalInstance.close();
                            };

                            $scope.cerrar = function () {
                                $modalInstance.close();
                            };

                        }]
                };
                var modalInstance = $modal.open($scope.opts);
            };


            $scope.lista_productos_devolucion = {
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
                    {field: 'subClase', displayName: 'Molecula', width: "20%", enableCellEdit: false},
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%", enableCellEdit: false},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "7%", enableCellEdit: false},
                    {width: "9%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                        <button  class="btn btn-danger btn-xs btnClick" ng-click="btn_eliminar_producto(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                       </div>'}
                ]
            };

            $scope.grabar_documento = function () {
                that.guardarNewDocTmp();
            };

            $scope.generar_documento = function () {
                that.crearDocumento();
            };

            $scope.eliminar_documento = function () {
                that.eliminarGetDocTemporal();
            };
            /**
             * @author German Galvis
             * +Descripcion Metodo encargado de guardar NewDocTmp
             * @fecha 2018-02-14
             */
            that.guardarNewDocTmp = function () {
                if ($scope.documento_devolucion.get_bodega_destino() === undefined || $scope.documento_devolucion.get_bodega_destino() === "") {
                    AlertService.mostrarMensaje("warning", "Debe Seleccionar la bodega destino");
                    return;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        bodega_doc_id: $scope.documento_devolucion.get_bodegas_doc_id(),
                        abreviatura: $scope.documento_devolucion.get_prefijo(),
                        bodega_seleccionada: $scope.documento_devolucion.get_bodega_destino().bodega,
                        observacion: $scope.documento_devolucion.get_observacion()
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
                        that.borarrVariables();
                        that.refrescarVista();
                    }

                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };


            that.refrescarVista = function () {
                that.listarProductosAsociados();
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


            /**
             * @author German Galvis
             * @fecha 2018-02-14
             * +Descripcion Metodo encargado crear el documento definitivo
             */
            that.crearDocumento = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        devolucion: {
                            doc_tmp_id: $scope.doc_tmp_id,
                            bodega_seleccionada: $scope.documento_devolucion.get_bodega_destino().bodega,
                            usuario_id: Sesion.getUsuarioActual().getId()
                        }
                    }
                };
                E009Service.crearDocumento(obj, function (data) {
                    if (data.status === 200) {

                        AlertService.mostrarMensaje("warning", data.msj);

                        that.borarrVariables();
                        that.refrescarVista();

                        var nombre = data.obj.nomb_pdf;
                        console.log("dato nombre pdf", nombre);
                        setTimeout(function () {
                            $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                        }, 0);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);

                    }
                });
            };


            /**
             * @author Andres M. Gonzalez
             * @fecha 25/03/2017
             * +Descripcion Metodo encargado de invocar el servicio que
             *              borra los productos del movimiento temporal
             */
            that.eliminarProductoDevolucion = function (parametro, callback) {
                var obj = {
                    session: $scope.session,
                    item_id: parametro.item_id,
                    docTmpId: parametro.docTmpId
                };
                E009Service.eliminarProductoDevolucion(obj, function (data) {

                    if (data.status === 200) {
                        callback(true);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema Eliminacion fallida: ", data.msj);
                        callback(false);

                    }
                });
            };

            that.init(function () {
                that.buscarBodega(function (data) {
                    $scope.bodegas = data;
                });
            });

            $scope.isTmp = function () {
                var disabled = false;

                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                    disabled = true;
                }
                return disabled;
            };


            $scope.habilitar_btn_productos = function () {

                var disabled = false;

                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                    disabled = true;
                }

                return disabled;
            };

            if (datos_documento.datosAdicionales !== undefined) {
                $scope.doc_tmp_id = datos_documento.datosAdicionales.doc_tmp;
                $scope.documento_devolucion.set_observacion(datos_documento.datosAdicionales.observacion);
                $scope.validarDesdeLink = true;
                that.buscarBodegaPorId(datos_documento.datosAdicionales.empresa_destino, function (result) {
                    $scope.documento_devolucion.set_bodega_destino(result[0]);
                });
                that.listarProductosAsociados();
            } else {
                $scope.validarDesdeLink = false;
            }
        }]);
});