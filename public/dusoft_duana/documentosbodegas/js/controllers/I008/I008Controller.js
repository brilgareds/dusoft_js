define([
    "angular",
    "js/controllers",
], function (angular, controllers) {

    controllers.controller('I008Controller', [
        '$scope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        'Usuario',
        'ProductoI008',
        "DocumentoI008",
        "I008Service",
        function ($scope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Usuario, Producto, Documento, I008Service) {

            var that = this;
            var datos_documento = localStorageService.get("documento_bodega_I008");
            $scope.doc_tmp_id = "00000";
            $scope.cliente_seleccionado = [];
            $scope.validarDesdeLink = false;
            $scope.documento_ingreso = Documento.get(datos_documento.bodegas_doc_id, datos_documento.prefijo, datos_documento.numero, $filter('date')(new Date(), "dd/MM/yyyy"));
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                listado_productos: [],
                listado_productos_validados: []
            };

            that.init = function () {
                $scope.documento_ingreso.set_observacion('');
                that.listarDocumentosTraslado();
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los documentos
             * @author German Andres Galvis
             * @fecha 12/01/2019 DD/MM/YYYY
             */
            that.listarDocumentosTraslado = function () {

                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: usuario.getEmpresa().getCodigo(),
                        centroUtilidad: usuario.getEmpresa().centroUtilidad.codigo,
                        bodega: usuario.getEmpresa().centroUtilidad.bodega.codigo,
                    }
                };
                I008Service.buscarTraslados(obj, function (data) {

                    if (data.status === 200) {
                        $scope.documentosTraslado = data.obj.listarTraslados;
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que lista
             *              el documento seleccionado
             * @author German Andres Galvis
             * @fecha 15/01/2019 DD/MM/YYYY
             */
            that.buscarDocumentoPorId = function (tmp_id, empresa_id) {

                var obj = {
                    session: $scope.session,
                    data: {
                        tmp_id: tmp_id,
                        empresa_id: empresa_id
                    }
                };

                I008Service.buscarDocumentoId(obj, function (data) {
                    if (data.status === 200) {
                        $scope.documento_ingreso.set_documento_traslado(data.obj.listarDocumento[0]);
                        that.refrescarVista();
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            $scope.onBuscarProductosTraslado = function () {
                that.listarProductosTraslado();
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los productos del traslado seleccionado
             * @author German Andres Galvis
             * @fecha 14/01/2019 DD/MM/YYYY
             */
            that.listarProductosTraslado = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: $scope.documento_ingreso.get_documento_traslado().numero,
                        prefijo: $scope.documento_ingreso.get_documento_traslado().prefijo
                    }
                };
                I008Service.buscarProductosTraslados(obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosTraslado(data.obj.listarProductos);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }

                });
            };

            function sumarDias(fecha, dias) {
//                fecha.setDate(fecha.getDate() + dias);
                fecha.setDate(fecha.getDate());
                return fecha;
            }

            that.renderProductosTraslado = function (productos) {
                $scope.datos_view.listado_productos = [];
                productos.forEach(function (data) {
                    var fecha = sumarDias(new Date(data.fecha_vencimiento), 1);
                    var producto = Producto.get(data.codigo_producto, data.descripcion, data.tipo_producto_id, data.lote,
                            $filter('date')(fecha, "dd/MM/yyyy"), parseFloat(data.cantidad).toFixed(), data.movimiento_id, 0);
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
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "10%", enableCellEdit: false},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "11%", enableCellEdit: false},
                    {field: 'getCantidadIngresada() | number : "0" ', displayName: 'Cantidad Ingresar', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad_ingresada" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "8%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-success btn-xs "  ng-click="btn_adicionar_producto(row.entity)" ng-disabled="habilitarAdicion(row.entity)" id="agregarPro"><span class="glyphicon glyphicon-plus-sign"></span></button>\
                                       </div>'}
                ]
            };

            $scope.btn_adicionar_producto = function (fila) {
                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                    that.guardarNewDocTmp(fila);
                } else {
                    that.guardarProductoTmp(fila);
                }
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que inserta 
             *              los productos del despacho seleccionado al tmp
             * @author German Andres Galvis
             * @fecha 14/01/2019 DD/MM/YYYY
             */
            that.guardarProductoTmp = function (producto) {

                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        empresa_id: usuario.getEmpresa().getCodigo(),
                        centro_utilidad: usuario.getEmpresa().centroUtilidad.codigo,
                        bodega: usuario.getEmpresa().centroUtilidad.bodega.codigo,
                        codigoProducto: producto.codigo_producto,
                        cantidad: producto.cantidad,
                        cantidad_enviada: producto.cantidad_ingresada,
                        lote: producto.lote,
                        fechaVencimiento: producto.fecha_vencimiento,
                        item_id: producto.item_id,
                        docTmpId: $scope.doc_tmp_id
                    }
                };
                
                I008Service.agregarProductoTmp(obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        that.refrescarVista();
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            /**
             * @author German Galvis
             * @fecha 14/01/2019 DD/MM/YYYY
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

                Request.realizarRequest(API.I008.CONSULTAR_PRODUCTOS_VALIDADOS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosValidados(data.obj.listarProductos);
                    }

                });
            };

            that.renderProductosValidados = function (productos) {
                $scope.datos_view.listado_productos_validados = [];
                productos.forEach(function (data) {
                    var fecha = sumarDias(new Date(data.fecha_vencimiento), 1);
                    var producto = Producto.get(data.codigo_producto, data.descripcion, data.tipo_producto_id, data.lote,
                            $filter('date')(fecha, "dd/MM/yyyy"), parseFloat(data.cantidad).toFixed(), data.item_id, 0);
                    producto.setItemIdCompra(data.item_id_compras);

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
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "10%", enableCellEdit: false},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "11%", enableCellEdit: false},
                    {width: "8%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                        <button  class="btn btn-danger btn-xs btnClick" ng-click="btn_eliminar_producto(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                       </div>'}
                ]
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
             * @fecha 14/01/2019 DD/MM/YYYY
             * +Descripcion Metodo encargado de eliminar el producto seleccionado
             * parametros: variables
             */
            $scope.eliminar_producto = function (parametro) {

                var obj = {
                    session: $scope.session,
                    item_id: parametro.item_id,
                    item_id_compras: parametro.itemIdCompra,
                    docTmpId: $scope.doc_tmp_id,
                    cantidad: parametro.cantidad
                };
                I008Service.eliminarProductoTmp(obj, function (data) {

                    if (data.status === 200) {
                        that.refrescarVista();
                        AlertService.mostrarMensaje("warning", "El Producto fue Eliminado Correctamente!!");
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema Eliminacion fallida: ", data.msj);

                    }
                });
            };

            that.init(function () {
            });

            /**
             * @author German Galvis
             * +Descripcion Metodo encargado de guardar NewDocTmp
             * @fecha 14/01/2019 DD/MM/YYYY
             */
            that.guardarNewDocTmp = function (fila) {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        bodega_doc_id: $scope.documento_ingreso.get_bodegas_doc_id(),
                        observacion: $scope.documento_ingreso.get_observacion(),
                        empresaId: usuario.getEmpresa().getCodigo(),
                        empresaEnvia: $scope.documento_ingreso.get_documento_traslado().empresa_id,
                        numero_documento_seleccionado: $scope.documento_ingreso.get_documento_traslado().numero,
                        prefijo_documento_seleccionado: $scope.documento_ingreso.get_documento_traslado().prefijo
                    }
                };
                I008Service.crearTmp(obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        $scope.doc_tmp_id = data.obj.movimiento_temporal_id;
                        $scope.validarDesdeLink = true;
                        $scope.isTmp();
                        that.guardarProductoTmp(fila);
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                    if (data.status === 404) {
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
             * @fecha 14/01/2019 DD/MM/YYYY
             * +Descripcion Metodo encargado de invocar el servicio que
             *              borra los DocTemporal
             */
            that.eliminarGetDocTemporal = function () {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        listado: $scope.datos_view.listado_productos_validados,
                        doc_tmp_id: $scope.doc_tmp_id,
                        empresa_id:usuario.getEmpresa().getCodigo()
                    }
                };

                I008Service.eliminarGetDocTemporal(obj, function (data) {
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
                var condicion = true;
                var productos = $scope.datos_view.listado_productos;
                var productos_devueltos = $scope.datos_view.listado_productos_validados;

                productos_devueltos.forEach(function (data) {
                    for (var i = 0; i < productos.length; i++) {

                        if (data.itemIdCompra === productos[i].item_id) {
                            condicion = false;
                            AlertService.mostrarMensaje("warning", "la cantidad ingresada para el producto " + data.descripcion + " tiene que coincidir con la cantidad enviada");
                        }
                    }
                });

                if (productos.length > 0) {
                    condicion = false;
                    AlertService.mostrarMensaje("warning", "Se debe dar ingreso a todos los productos despachados");
                }

                if (condicion) {
                    that.crearDocumento();
                }
            };

            /**
             * @author German Galvis
             * @fecha 2018-05-11
             * +Descripcion Metodo encargado de Generar el documento definitivo
             */
            that.crearDocumento = function () {
                var usuario = Usuario.getUsuarioActual();
                var estado = 1;

                if ($scope.datos_view.listado_productos === undefined || $scope.datos_view.listado_productos === null || $scope.datos_view.listado_productos.length <= 0) {
                    estado = 0;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        prefijo_despacho: $scope.documento_ingreso.get_documento_traslado().prefijo,
                        numero_despacho: $scope.documento_ingreso.get_documento_traslado().numero,
                        empresa_origen: $scope.documento_ingreso.get_documento_traslado().empresa_id,
                        empresa_id: usuario.getEmpresa().getCodigo(),
                        doc_tmp_id: $scope.doc_tmp_id,
                        sw_estado: estado,
                        usuario_id: usuario.getId()

                    }
                };

                I008Service.crearDocumento(obj, function (data) {
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


            that.borrarVariables = function () {
                $scope.doc_tmp_id = "00000";
                $scope.documento_ingreso.set_observacion('');
                $scope.documento_ingreso.set_documento_traslado(null);
                $scope.datos_view.listado_productos = [];
                $scope.datos_view.listado_productos_validados = [];
                $scope.validarDesdeLink = false;
            };

            that.refrescarVista = function () {
                that.listarProductosTraslado();
                that.listarProductosValidados();
            };

            $scope.cancelar_documento = function () {
                $state.go('DocumentosBodegas');
            };

            $scope.isTmp = function () {
                var disabled = false;

                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                    disabled = true;
                }
                return disabled;
            };

            /*
             * funcion para permitir validar los productos
             * @returns {boolean}
             */
            $scope.habilitarAdicion = function (producto) {
                var disabled = false;

                if (producto.cantidad_ingresada === undefined || producto.cantidad_ingresada === "" || parseInt(producto.cantidad_ingresada) <= 0) {
                    disabled = true;
                }

                if (parseInt(producto.cantidad_ingresada) > parseInt(producto.cantidad)) {
                    AlertService.mostrarMensaje("warning", "la cantidad ingresada no puede superar la cantidad enviada");
                    disabled = true;
                }

                return disabled;
            };

            if (datos_documento.datosAdicionales !== undefined) {
                $scope.doc_tmp_id = datos_documento.datosAdicionales.doc_tmp;
                $scope.documento_ingreso.set_observacion(datos_documento.datosAdicionales.observacion);
                that.buscarDocumentoPorId(datos_documento.datosAdicionales.doc_tmp, datos_documento.datosAdicionales.empresa_id);
                $scope.validarDesdeLink = true;

            } else {
                $scope.validarDesdeLink = false;
            }

        }]);
});