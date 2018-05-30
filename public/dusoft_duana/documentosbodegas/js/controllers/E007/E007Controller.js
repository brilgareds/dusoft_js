define([
    "angular",
    "js/controllers",
], function (angular, controllers) {

    controllers.controller('E007Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        'Usuario',
        'ProductoE007',
        "DocumentoE007",
        "E007Service",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Usuario, Producto, Documento, E007Service) {

            var that = this;
            var datos_documento = localStorageService.get("documento_bodega_E007");
            $scope.doc_tmp_id = "00000";
            $scope.cliente_seleccionado = [];
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
                that.listarEgresos();
                that.listarTiposTerceros();
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los tipos de egreso
             * @author German Andres Galvis
             * @fecha 17/05/2018 DD/MM/YYYY
             */
            that.listarEgresos = function () {
                var obj = {
                    session: $scope.session,
                    data: {}
                };

                E007Service.buscarEgresos(obj, function (data) {

                    if (data.status === 200) {
                        $scope.egresos = data.obj.listarEgresos;
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              el egreso seleccionado
             * @author German Andres Galvis
             * @fecha 24/05/2018 DD/MM/YYYY
             */
            that.buscarEgresoId = function (egreso_id) {
                var obj = {
                    session: $scope.session,
                    data: {
                        egreso_id: egreso_id
                    }
                };
                E007Service.buscarEgresoId(obj, function (data) {
                    if (data.status === 200) {
                        $scope.documento_ingreso.egreso = data.obj.listarEgreso[0];
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los tipos de terceros
             * @author German Andres Galvis
             * @fecha 18/05/2018 DD/MM/YYYY
             */
            that.listarTiposTerceros = function () {
                var obj = {
                    session: $scope.session,
                    data: {listar_tipo_terceros: {}}
                };

                E007Service.listarTiposTerceros(obj, function (data) {

                    if (data.status === 200) {
                        $scope.tiposTercero = data.obj.listar_tipo_terceros;
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };


            //  Abre slider para seleccionar el cliente
            $scope.btn_seleccionar_cliente = function () {
                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "buscador_clientes",
                    templateUrl: 'views/E007/buscadorClientes.html',
                    scope: $scope,
                    controller: "E007GestionarClientesController",
                    resolve: {
                        tipoTerceros: function () {
                            return  $scope.tiposTercero;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function (result) {
                    if (result !== undefined && result !== null) {
                        $scope.cliente_seleccionado = result;
                    }
                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que traera 
             *              el cliente seleccionado
             * @author German Andres Galvis
             * @fecha 24/05/2018 DD/MM/YYYY
             */
            that.buscarClientePorId = function (tipo, id) {
                var obj = {
                    session: $scope.session,
                    data: {
                        id: id,
                        tipoId: tipo
                    }
                };

                E007Service.buscarClienteId(obj, function (data) {
                    if (data.status === 200) {
                        $scope.cliente_seleccionado = data.obj.listarCliente[0];
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            //  Abre slider para seleccionar el cliente
            $scope.btn_seleccionar_productos = function () {
                $scope.opts = {
                    windowClass: 'app-modal-window-ls-xlg-ls',
                    backdrop: 'static',
                    dialogClass: "buscador_productos",
                    templateUrl: 'views/E007/buscadorProductos.html',
                    scope: $scope,
                    controller: "E007GestionarProductosController",
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
             *              los productos de la factura seleccionada
             * @author German Andres Galvis
             * @fecha 23/05/2018 DD/MM/YYYY
             * @returns {undefined}
             */
            that.listarProductosTraslado = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        docTmpId: $scope.doc_tmp_id
                    }
                };

                Request.realizarRequest(API.E007.CONSULTAR_PRODUCTOS_TRASLADO, "POST", obj, function (data) {
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
                    var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.existencia).toFixed(),
                            parseFloat(data.cantidad_disponible).toFixed(), data.tipo_producto_id, data.item_id, parseFloat(data.cantidad).toFixed());
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
                    {field: 'codigo_producto', displayName: 'Codigo ', width: "11%", enableCellEdit: false,
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
                    {field: 'descripcion', displayName: 'Descripcion', width: "40%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "10%", enableCellEdit: false},
                    {field: 'fecha_vencimiento', displayName: 'Fecha Vencimiento', width: "10%", enableCellEdit: false},
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%", enableCellEdit: false},
                    {field: 'disponible', displayName: 'Disponibilidad', width: "10%", enableCellEdit: false},
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
             * @fecha 2018-05-19
             */
            that.guardarNewDocTmp = function (callback) {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        bodega_doc_id: $scope.documento_ingreso.get_bodegas_doc_id(),
                        observacion: $scope.documento_ingreso.get_observacion(),
                        concepto_egreso_id: $scope.documento_ingreso.egreso.concepto_egreso_id,
                        empresaId: usuario.getEmpresa().getCodigo(),
                        tipo_id_tercero: $scope.cliente_seleccionado.tipo_id_tercero,
                        tercero_id: $scope.cliente_seleccionado.id
                    }
                };
                E007Service.crearGetDocTemporal(obj, function (data) {
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
             * @fecha 2018-05-24
             * +Descripcion Metodo encargado de eliminar el producto seleccionado
             * parametros: variables
             */
            $scope.eliminar_producto = function (parametro) {

                var obj = {
                    session: $scope.session,
                    item_id: parametro.item_id,
                    docTmpId: $scope.doc_tmp_id
                };

                E007Service.eliminarProductoTraslado(obj, function (data) {

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
             * @fecha 2018-05-21
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

                E007Service.eliminarGetDocTemporal(obj, function (data) {
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
             * @fecha 2018-05-24
             * +Descripcion Metodo encargado de Generar el documento definitivo
             */
            that.crearDocumento = function () {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: usuario.getEmpresa().getCodigo(),
                        concepto_egreso_id: $scope.documento_ingreso.egreso.concepto_egreso_id,
                        concepto_egreso: $scope.documento_ingreso.egreso.descripcion,
                        tipo_id_tercero: $scope.cliente_seleccionado.tipo_id_tercero,
                        tercero_id: $scope.cliente_seleccionado.tercero_id,
                        nombreTercero: $scope.cliente_seleccionado.nombre_tercero,
                        doc_tmp_id: $scope.doc_tmp_id,
                        usuario_id: Usuario.getUsuarioActual().getId()

                    }
                };

                E007Service.crearDocumento(obj, function (data) {
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
                if ($scope.doc_tmp_id === "00000" && ($scope.documento_ingreso.getEgreso() === undefined || $scope.documento_ingreso.getEgreso() === null ||
                        $scope.cliente_seleccionado.tercero_id === undefined || $scope.cliente_seleccionado.tercero_id === null)) {
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

                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                    disabled = true;
                }

                return disabled;
            };

            that.borrarVariables = function () {
                $scope.doc_tmp_id = "00000";
                $scope.documento_ingreso.set_observacion('');
                $scope.documento_ingreso.setEgreso(null);
                $scope.cliente_seleccionado = [];
                $scope.datos_view.listado_productos_validados = [];
                $scope.validarDesdeLink = false;
            };

            that.refrescarVista = function () {
                that.listarProductosTraslado();
            };


            if (datos_documento.datosAdicionales !== undefined) {
                $scope.doc_tmp_id = datos_documento.datosAdicionales.doc_tmp;
                $scope.documento_ingreso.set_observacion(datos_documento.datosAdicionales.observacion);
                that.buscarClientePorId(datos_documento.datosAdicionales.tipoTerceroId, datos_documento.datosAdicionales.terceroId);
                that.buscarEgresoId(datos_documento.datosAdicionales.tipo_egreso);
                $scope.validarDesdeLink = true;
                that.refrescarVista();

            } else {
                $scope.validarDesdeLink = false;
            }



        }]);
});