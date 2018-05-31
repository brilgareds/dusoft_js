define([
    "angular",
    "js/controllers",
], function (angular, controllers) {

    controllers.controller('E017Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        'Usuario',
        'ProductoDevolucionE017',
        "DocDevolucion",
        "E017Service",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Usuario, Producto, Documento, E017Service) {

            var that = this;
            var datos_documento = localStorageService.get("documento_bodega_E017");
            $scope.doc_tmp_id = "00000";
            $scope.bodegas = [];
            $scope.paginaactualproductos = 1;
            $scope.validarDesdeLink = false;
            $scope.documento_ingreso = Documento.get(datos_documento.bodegas_doc_id, datos_documento.prefijo, datos_documento.numero, $filter('date')(new Date(), "dd/MM/yyyy"));
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                listado_productos: []
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              las farmacias
             * @author German Andres Galvis
             * @fecha 02/05/2018 DD/MM/YYYY
             */
            that.listarFarmacias = function () {

                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        bodega: usuario.empresa.centroUtilidad.bodega.codigo
                    }
                };

                E017Service.buscarBodega(obj, function (data) {

                    if (data.status === 200) {
                        $scope.bodegas = data.obj.listarBodegas;
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que lista
             *              las farmacia seleccionada
             * @author German Andres Galvis
             * @fecha 07/05/2018 DD/MM/YYYY
             */
            that.buscarFacturaPorId = function (empresa, centro, bodega) {

                var obj = {
                    session: $scope.session,
                    data: {
                        empresa_id: empresa,
                        centro: centro,
                        bodega: bodega
                    }
                };

                E017Service.buscarBodegaId(obj, function (data) {

                    if (data.status === 200) {
                        $scope.documento_ingreso.set_bodega_destino(data.obj.listarBodega[0]);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            that.init = function () {
                $scope.documento_ingreso.set_observacion('');
                that.listarFarmacias();
            };

            //  Abre slider para seleccionar el cliente
            $scope.btn_seleccionar_productos = function () {
                $scope.opts = {
                    windowClass: 'app-modal-window-ls-xxlg-ls',
                    backdrop: 'static',
                    dialogClass: "buscador_productos",
                    templateUrl: 'views/E017/buscadorProductos.html',
                    scope: $scope,
                    controller: "E017GestionarProductosController",
                    resolve: {
                        Empresa: function () {
                            return  Usuario.getUsuarioActual().getEmpresa();
                        },
                        DocTmp: function () {
                            return  $scope.doc_tmp_id;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function () {

                    that.listarProductosTraslado();

                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los productos a trasladar
             * @author German Andres Galvis
             * @fecha 03/05/2018 DD/MM/YYYY
             * @returns {undefined}
             */
            that.listarProductosTraslado = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: $scope.doc_tmp_id
                    }
                };

                Request.realizarRequest(API.E017.CONSULTAR_PRODUCTOS_TRASLADO, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosTraslado(data.obj.listarProductos);
                    }

                });
            };

            function sumarDias(fecha, dias) {
                fecha.setDate(fecha.getDate() + dias);
                return fecha;
            }

            that.renderProductosTraslado = function (productos) {
                $scope.datos_view.listado_productos = [];
                productos.forEach(function (data) {
                    var fecha = sumarDias(new Date(data.fecha_vencimiento), 1);
                    var producto = Producto.get(data.codigo_producto, data.descripcion, 0,
                            data.tipo_producto_id, data.subClase, data.lote, $filter('date')(fecha, "dd/MM/yyyy"), parseFloat(data.cantidad).toFixed(), data.item_id);
                    $scope.datos_view.listado_productos.push(producto);
                });
            };

            $scope.lista_productos_traslado = {
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
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 6">NeA</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 7">MoE</span>\
                                                <span class="label label-default" ng-show="row.entity.getTipoProductoId() == 8">Nut</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 9">Ger</span>\
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

            $scope.grabar_documento_tmp = function (callback) {
                that.guardarNewDocTmp(callback);
            };

            /**
             * @author German Galvis
             * +Descripcion Metodo encargado de guardar NewDocTmp
             * @fecha 2018-05-03
             */
            that.guardarNewDocTmp = function (callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        bodega_doc_id: $scope.documento_ingreso.get_bodegas_doc_id(),
                        observacion: $scope.documento_ingreso.get_observacion(),
                        bodega_destino: $scope.documento_ingreso.get_bodega_destino()
                    }
                };

                E017Service.getDocTemporal(obj, function (data) {

                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        $scope.doc_tmp_id = data.obj.movimiento_temporal_id;
                        $scope.validarDesdeLink = true;
                        $scope.isTmp();
                        callback(true);
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
                    }
                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
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

            /**
             * @author German Galvis
             * @fecha 2018-05-05
             * +Descripcion Metodo encargado de eliminar el producto seleccionado
             * parametros: variables
             */
            $scope.eliminar_producto = function (parametro) {

                var obj = {
                    session: $scope.session,
                    item_id: parametro.item_id,
                    docTmpId: $scope.doc_tmp_id
                };

                E017Service.eliminarProductoTraslado(obj, function (data) {

                    if (data.status === 200) {
                        that.refrescarVista();
                        AlertService.mostrarMensaje("warning", "El Producto fue Eliminado Correctamente!!");
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema Eliminacion fallida: ", data.msj);

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
             * @fecha 2018-05-03
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

                E017Service.eliminarGetDocTemporal(obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        that.borrarVariables();
                    }

                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            $scope.generar_documento = function () {
                that.crearDocumento();
            };

            /**
             * @author German Galvis
             * @fecha 2018-05-07
             * +Descripcion Metodo encargado de Generar el documento definitivo
             */
            that.crearDocumento = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        empresa_envia: Usuario.getUsuarioActual().getEmpresa().centroUtilidad.bodega.codigo,
                        doc_tmp_id: $scope.doc_tmp_id,
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        bodega_destino: $scope.documento_ingreso.get_bodega_destino()
                    }
                };
                
                E017Service.crearDocumento(obj, function (data) {
                    if (data.status === 200) {

                        AlertService.mostrarMensaje("warning", data.msj);

                        that.borrarVariables();

                        var nombre = data.obj.nomb_pdf;
                        setTimeout(function () {
                            $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                        }, 0);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);

                    }
                });
            };


            /*==================================================================================================================================================================
             * 
             *                                                          VALIDACIONES(habilitar o desabilitar botones)
             * 
             * ==================================================================================================================================================================*/

            that.init(function () {
            });

            that.borrarVariables = function () {
                $scope.doc_tmp_id = "00000";
                $scope.documento_ingreso.set_observacion('');
                $scope.documento_ingreso.set_bodega_destino(null);
                $scope.datos_view.listado_productos = [];
                $scope.validarDesdeLink = false;
            };

            $scope.cancelar_documento = function () {
                $state.go('DocumentosBodegas');
            };

            $scope.isNoTmp = function () {
                var disabled = false;
                if ($scope.doc_tmp_id === "00000" && ($scope.documento_ingreso.get_bodega_destino() === undefined || $scope.documento_ingreso.get_bodega_destino() === null)) {
                    disabled = true;
                }
                return disabled;
            };

            $scope.isTmp = function () {
                var disabled = false;

                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                    disabled = true;
                }
                return disabled;
            };

            $scope.isGenerarDocumento = function () {
                var disabled = false;
                if ($scope.datos_view.listado_productos.length > 0) {
                    disabled = true;
                }
                return disabled;
            };

            $scope.habilitar_btn_productos = function () {

                var disabled = false;

//                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                if ($scope.documento_ingreso.get_bodega_destino() === undefined || $scope.documento_ingreso.get_bodega_destino() === null) {
                    disabled = true;
                }

                return disabled;
            };

            that.refrescarVista = function () {
                that.listarProductosTraslado();
            };

            if (datos_documento.datosAdicionales !== undefined) {
                $scope.doc_tmp_id = datos_documento.datosAdicionales.doc_tmp;
                $scope.documento_ingreso.set_observacion(datos_documento.datosAdicionales.observacion);
                that.buscarFacturaPorId(datos_documento.datosAdicionales.empresa_id, datos_documento.datosAdicionales.centro_utilidad, datos_documento.datosAdicionales.bodega_destino);
                $scope.validarDesdeLink = true;
                that.refrescarVista();

            } else {
                $scope.validarDesdeLink = false;
            }

        }]);
});