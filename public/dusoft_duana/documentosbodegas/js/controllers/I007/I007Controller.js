define([
    "angular",
    "js/controllers",
], function (angular, controllers) {

    controllers.controller('I007Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        'Usuario',
        'ProductoI007',
        "DocumentoI007",
        "I007Service",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Usuario, Producto, Documento, I007Service) {

            var that = this;
            var datos_documento = localStorageService.get("documento_bodega_I007");
            $scope.doc_tmp_id = "00000";
            $scope.tercero_seleccionado = [];
            $scope.validarDesdeLink = false;
            $scope.documento_ingreso = Documento.get(datos_documento.bodegas_doc_id, datos_documento.prefijo, datos_documento.numero, $filter('date')(new Date(), "dd/MM/yyyy"));
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };


            $scope.datos_view = {
                listado_productos_validados: []
            };

            that.init = function () {
                $scope.documento_ingreso.set_observacion('');
                that.listarTiposTerceros();
                that.listarPrestamos();
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los tipos de terceros
             * @author German Andres Galvis
             * @fecha 31/05/2018 DD/MM/YYYY
             */
            that.listarTiposTerceros = function () {
                var obj = {
                    session: $scope.session,
                    data: {listar_tipo_terceros: {}}
                };

                I007Service.listarTiposTerceros(obj, function (data) {

                    if (data.status === 200) {
                        $scope.tiposTercero = data.obj.listar_tipo_terceros;
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los tipos de prestamos
             * @author German Andres Galvis
             * @fecha 06/06/2018 DD/MM/YYYY
             */
            that.listarPrestamos = function () {
                var obj = {
                    session: $scope.session,
                    data: {}
                };

                I007Service.listarPrestamos(obj, function (data) {

                    if (data.status === 200) {
                        $scope.prestamos = data.obj.listarPrestamos;
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que traera 
             *              el prestamo seleccionado
             * @author German Andres Galvis
             * @fecha 07/06/2018 DD/MM/YYYY
             */
            that.buscarPrestamoPorId = function (tipo) {
                var obj = {
                    session: $scope.session,
                    data: {
                        tipoprestamo: tipo
                    }
                };

                I007Service.buscarPrestamoId(obj, function (data) {
                    if (data.status === 200) {
                        $scope.documento_ingreso.prestamo = data.obj.listarPrestamo[0];
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            //  Abre slider para seleccionar el cliente
            $scope.btn_seleccionar_tercero = function () {
                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "buscador_clientes",
                    templateUrl: 'views/I007/buscadorTercero.html',
                    scope: $scope,
                    controller: "I007GestionarTercerosController",
                    resolve: {
                        tipoTerceros: function () {
                            return  $scope.tiposTercero;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function (result) {
                    if (result !== undefined && result !== null) {
                        $scope.tercero_seleccionado = result;
                    }
                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que traera 
             *              el tercero seleccionado
             * @author German Andres Galvis
             * @fecha 07/06/2018 DD/MM/YYYY
             */
            that.buscarTerceroPorId = function (tipo, id) {
                var obj = {
                    session: $scope.session,
                    data: {
                        id: id,
                        tipoId: tipo
                    }
                };

                I007Service.buscarTerceroId(obj, function (data) {
                    if (data.status === 200) {
                        $scope.tercero_seleccionado = data.obj.listarTercero[0];
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            //  Abre slider para seleccionar el cliente
            $scope.btn_seleccionar_productos = function () {
                $scope.opts = {
                    windowClass: 'app-modal-window-ls-xxlg-ls',
                    backdrop: 'static',
                    dialogClass: "buscador_productos",
                    templateUrl: 'views/I007/buscadorProductos.html',
                    scope: $scope,
                    controller: "I007GestionarProductosController",
                    resolve: {
                        Empresa: function () {
                            return  Usuario.getUsuarioActual().getEmpresa();
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
             *              los productos de la factura seleccionada
             * @author German Andres Galvis
             * @fecha 01/06/2018 DD/MM/YYYY
             */
            that.listarProductosTraslado = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        docTmpId: $scope.doc_tmp_id
                    }
                };

                Request.realizarRequest(API.I007.CONSULTAR_PRODUCTOS_TRASLADO, "POST", obj, function (data) {
                    if (data.status === 200) {
                        that.renderProductosTraslado(data.obj.lista_productos);
                    }

                });
            };

            function sumarDias(fecha, dias) {
                fecha.setDate(fecha.getDate() + dias);
                return fecha;
            }

            that.renderProductosTraslado = function (productos) {
                $scope.datos_view.listado_productos_validados = [];
                productos.forEach(function (data) {
                    var fecha = sumarDias(new Date(data.fecha_vencimiento), 1);
                    var producto = Producto.get(data.codigo_producto, data.descripcion,  data.tipo_producto_id, parseFloat(data.cantidad).toFixed(),
                    parseFloat(data.porcentaje_gravamen).toFixed(), parseFloat(data.total_costo).toFixed(2), data.item_id);
                    producto.setFechaVencimiento($filter('date')(fecha, "dd/MM/yyyy"));
                    producto.setLote(data.lote);
                    $scope.datos_view.listado_productos_validados.push(producto);
                });
            };

            $scope.lista_productos_traslado = {
                data: 'datos_view.listado_productos_validados',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo ', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span title="Normales" class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                <span title="Alto Costo" class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                <span title="Controlados" class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                <span title="Insumos" class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                <span title="Nevera" class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                <span title="Nevera Alto Costo" class="label label-info" ng-show="row.entity.getTipoProductoId() == 6">NeA</span>\
                                                <span title="Monopol_Estado" class="label label-info" ng-show="row.entity.getTipoProductoId() == 7">MoE</span>\
                                                <span title="Nutricion" class="label label-default" ng-show="row.entity.getTipoProductoId() == 8">Nut</span>\
                                                <span title="Gerencia" class="label label-warning" ng-show="row.entity.getTipoProductoId() == 9">Ger</span>\
                                                <span ng-cell-text >{{COL_FIELD}} </span>\
                                                <span class="glyphicon glyphicon-lock text-danger" ng-show="row.entity.estado == \'0\'" ></span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripcion', width: "30%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "10%", enableCellEdit: false},
                    {field: 'fecha_vencimiento', displayName: 'Fecha Vencimiento', width: "11%", enableCellEdit: false},
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%", enableCellEdit: false},
                    {field: 'porc_iva', displayName: '% gravemen', width: "10%", enableCellEdit: false},
                    {field: 'valorU', displayName: 'costo Total', width: "10%", enableCellEdit: false},
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
             * @fecha 2018-06-06
             */
            that.guardarNewDocTmp = function (callback) {
                var obj = {
                    session: $scope.session,
                    data: {
                        bodega_doc_id: $scope.documento_ingreso.get_bodegas_doc_id(),
                        observacion: $scope.documento_ingreso.get_observacion(),
                        prestamo: $scope.documento_ingreso.prestamo.tipo_prestamo_id,
                        tipo_id_tercero: $scope.tercero_seleccionado.tipo_id_tercero,
                        tercero_id: $scope.tercero_seleccionado.id
                    }
                };
                
                I007Service.crearGetDocTemporal(obj, function (data) {
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
             * @fecha 2018-06-07
             * +Descripcion Metodo encargado de eliminar el producto seleccionado
             * parametros: variables
             */
            $scope.eliminar_producto = function (parametro) {

                var obj = {
                    session: $scope.session,
                    item_id: parametro.item_id,
                    docTmpId: $scope.doc_tmp_id
                };

                I007Service.eliminarProductoTraslado(obj, function (data) {

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
             * @fecha 2018-06-06
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

                I007Service.eliminarGetDocTemporal(obj, function (data) {
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
             * @fecha 2018-06-07
             * +Descripcion Metodo encargado de Generar el documento definitivo
             */
            that.crearDocumento = function () {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: usuario.getEmpresa().getCodigo(),
                        prestamo_id: $scope.documento_ingreso.prestamo.tipo_prestamo_id,
                        prestamo: $scope.documento_ingreso.prestamo.descripcion,
                        tipo_id_tercero: $scope.tercero_seleccionado.tipo_id_tercero,
                        tercero_id: $scope.tercero_seleccionado.tercero_id,
                        nombreTercero: $scope.tercero_seleccionado.nombre_tercero,
                        doc_tmp_id: $scope.doc_tmp_id,
                        usuario_id: Usuario.getUsuarioActual().getId()

                    }
                };

                I007Service.crearDocumento(obj, function (data) {
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

            $scope.cancelar_documento = function () {
                $state.go('DocumentosBodegas');
            };

            $scope.isNoTmp = function () {
                var disabled = false;
                if ($scope.doc_tmp_id === "00000" && ($scope.tercero_seleccionado.tercero_id === undefined || $scope.tercero_seleccionado.tercero_id === null)) {
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

            $scope.habilitar_btn_productos = function () {

                var disabled = false;

                if ($scope.tercero_seleccionado.tercero_id === undefined || $scope.tercero_seleccionado.tercero_id === null ||
                        $scope.documento_ingreso.prestamo === undefined || $scope.documento_ingreso.prestamo === null ) {
                    disabled = true;
                }

                return disabled;
            };

            that.borrarVariables = function () {
                $scope.doc_tmp_id = "00000";
                $scope.documento_ingreso.set_observacion('');
                $scope.documento_ingreso.setPrestamo(null);
                $scope.tercero_seleccionado = [];
                $scope.datos_view.listado_productos_validados = [];
                $scope.validarDesdeLink = false;
            };

            that.refrescarVista = function () {
                that.listarProductosTraslado();
            };

            if (datos_documento.datosAdicionales !== undefined) {
                $scope.doc_tmp_id = datos_documento.datosAdicionales.doc_tmp;
                $scope.documento_ingreso.set_observacion(datos_documento.datosAdicionales.observacion);
                that.buscarTerceroPorId(datos_documento.datosAdicionales.tipoTerceroId, datos_documento.datosAdicionales.terceroId);
                that.buscarPrestamoPorId(datos_documento.datosAdicionales.tipo_prestamo);
                $scope.validarDesdeLink = true;
                that.refrescarVista();

            } else {
                $scope.validarDesdeLink = false;
            }



        }]);
});