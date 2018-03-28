define([
    "angular",
    "js/controllers",
], function (angular, controllers) {

    controllers.controller('I012Controller', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        'Usuario',
        'ProductoFactura',
        "FacturaDevolucion",
        "I012Service",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Usuario, Producto, Documento, I012Service) {

            var that = this;
            var datos_documento = localStorageService.get("documento_bodega_I012");
            $scope.doc_tmp_id = "00000";
            $scope.tipoDocumento = '';
            $scope.cliente_seleccionado = [];
            $scope.validarDesdeLink = false;
            $scope.documento_ingreso = Documento.get(datos_documento.bodegas_doc_id, datos_documento.prefijo, datos_documento.numero, $filter('date')(new Date(), "dd/MM/yyyy"));
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                listado_productos: [],
                listado_productos_devueltos: []
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los tipos de terceros
             * @author German Andres Galvis
             * @fecha 20/03/2018 DD/MM/YYYY
             * @returns {undefined}
             */
            that.listarTiposTerceros = function () {
                var obj = {
                    session: $scope.session,
                    data: {listar_tipo_terceros: {}}
                };

                I012Service.listarTiposTerceros(obj, function (data) {

                    if (data.status === 200) {
                        $scope.tiposTercero = I012Service.renderListarTipoTerceros(data.obj.listar_tipo_terceros);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            that.init = function () {
                $scope.documento_ingreso.set_observacion('');
                that.listarTiposTerceros();
            };

            //  Abre slider para seleccionar el cliente
            $scope.btn_seleccionar_cliente = function () {
                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "buscador_clientes",
                    templateUrl: 'views/I012/buscadorClientes.html',
                    scope: $scope,
                    controller: "I012GestionarClientesController",
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
                        that.buscarFacturas();
                    }
                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              las facturas asociadas al cliente seleccionado
             * @author German Andres Galvis
             * @fecha 26/03/2018 DD/MM/YYYY
             * @returns {undefined}
             */
            that.buscarFacturas = function () {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    empresaId: usuario.getEmpresa().getCodigo(),
                    cliente: $scope.cliente_seleccionado
                };
                I012Service.buscarFacturas(obj, function (data) {
                    if (data.status === 200) {
                        $scope.facturasCliente = data.obj.listarFacturas;
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };


            $scope.onBuscarProductosFactura = function () {
                $scope.tipoDocumento = $scope.documento_ingreso.getFacturaDevolucion().fac_agrupada;
                console.log("tipo", $scope.tipoDocumento);
                that.listarProductosFactura();
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los productos de la factura seleccionada
             * @author German Andres Galvis
             * @fecha 26/03/2018 DD/MM/YYYY
             * @returns {undefined}
             */
            that.listarProductosFactura = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: $scope.documento_ingreso.getFacturaDevolucion().factura_fiscal,
                        prefijo: $scope.documento_ingreso.getFacturaDevolucion().prefijo,
                        empresaId: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                    }
                };
                Request.realizarRequest(API.I012.CONSULTAR_DETALLE_FACTURA, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosFactura(data.obj.lista_productos);
                    }

                });
            };

            function sumarDias(fecha, dias) {
                fecha.setDate(fecha.getDate() + dias);
                return fecha;
            }

            that.renderProductosFactura = function (productos) {
                $scope.datos_view.listado_productos = [];
                productos.forEach(function (data) {
                    var fecha = sumarDias(new Date(data.fecha_vencimiento), 1);
                    var resta = (data.cantidad - data.cantidad_devuelta);
                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, data.tipo_producto_id, data.lote,
                            data.torre, $filter('date')(fecha, "dd/MM/yyyy"), parseFloat(data.cantidad).toFixed(), data.item_id, parseFloat(data.iva).toFixed(2), data.valor_unitario);
                    producto.setCantidadResta(resta);
                    $scope.datos_view.listado_productos.push(producto);
                });
            };

            $scope.lista_productos_factura = {
                data: 'datos_view.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                columnDefs: [
                    {field: 'torre', displayName: 'Torre', width: "3%", enableCellEdit: false},
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
                    {field: 'descripcion', displayName: 'Descripcion', width: "34%", enableCellEdit: false},
                    {field: 'cantidad_resta', displayName: 'Cantidad', width: "6%", enableCellEdit: false},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "9%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "7%", enableCellEdit: false},
                    {field: 'iva', displayName: 'IVA(%)', width: "6%", enableCellEdit: false},
                    {field: 'valorU', displayName: 'VLR/U', width: "8%", enableCellEdit: false},
                    {field: 'getCantidadIngresada() | number : "0" ', displayName: 'Cantidad Ingresar', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad_ingresada" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "8%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                        <button  class="btn btn-info btn-xs btnClick" ng-click="btn_modificar_producto(row.entity)" ng-disabled="habilitarModificacion()"><span class="glyphicon glyphicon-pencil"></span></button>\
                                        <button class="btn btn-success btn-xs "  ng-click="btn_adicionar_producto(row.entity)" ng-disabled="habilitarAdicion(row.entity)" id="agregarPro"><span class="glyphicon glyphicon-plus-sign"></span></button>\
                                       </div>'}
                ]
            };

            $scope.habilitarAdicion = function (producto) {
                var disabled = false;
                if ($scope.doc_tmp_id === "00000") {
                    disabled = true;
                }

                if (producto.cantidad_ingresada === undefined || producto.cantidad_ingresada === "" || parseInt(producto.cantidad_ingresada) <= 0) {
                    disabled = true;
                }

                if (parseInt(producto.cantidad_ingresada) > parseInt(producto.cantidad_resta)) {
                    AlertService.mostrarMensaje("warning", "la cantidad ingresada no puede superar la cantidad enviada");
                    disabled = true;
                }

                return disabled;
            };

            $scope.habilitarModificacion = function () {
                var disabled = false;
                if ($scope.doc_tmp_id === "00000") {
                    disabled = true;
                }

                return disabled;
            };

            /**
             * @author German Galvis
             * @fecha 2018-03-27
             * +Descripcion Metodo encargado listar los productos asociados al docTmp
             * parametros: variables
             */
            that.listarProductosDevueltos = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: $scope.doc_tmp_id

                    }
                };
                Request.realizarRequest(API.I012.CONSULTAR_PRODUCTOS_DEVUELTOS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosDevueltos(data.obj.lista_productos);
                    }

                });
            };

            that.renderProductosDevueltos = function (productos) {
                $scope.datos_view.listado_productos_devueltos = [];
                productos.forEach(function (data) {
                    var fecha = sumarDias(new Date(data.fecha_vencimiento), 1);
                    var producto = Producto.get(data.codigo_producto, data.descripcion, data.tipo_producto_id, data.lote,
                            data.torre, $filter('date')(fecha, "dd/MM/yyyy"), parseFloat(data.cantidad).toFixed(), data.item_id, parseFloat(data.iva).toFixed(2), data.valor_unitario);
                    producto.setCostoTotal(data.total_costo);
                    $scope.datos_view.listado_productos_devueltos.push(producto);
                });
            };

            $scope.lista_productos_devueltos = {
                data: 'datos_view.listado_productos_devueltos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                footerTemplate: '   <div class="row col-md-12">\
                                        <div class="">\
                                            <table class="table table-clear text-center">\
                                                <thead>\
                                                    <tr>\
                                                        <th class="text-center">SUBTOTAL</th>\
                                                        <th class="text-center">IVA</th>\
                                                        <th class="text-center">RET-FTE</th>\
                                                        <th class="text-center">RETE-ICA</th>\
                                                        <th class="text-center">RETE-IVA</th>\
                                                        <th class="text-center">VALOR TOTAL</th>\
                                                    </tr>\
                                                </thead>\
                                                <tbody>\
                                                    <tr>\
                                                        <td class="right">{{valorSubtotal | currency: "$ "}}</td> \
                                                        <td class="right">{{gravamen | currency: "$ "}}</td> \
                                                        <td class="right">{{valorRetFte | currency: "$ "}}</td> \
                                                        <td class="right">{{valorRetIca | currency: "$ "}}</td> \
                                                        <td class="right">{{valorRetIva | currency: "$ "}}</td> \
                                                        <td class="right">{{total | currency: "$ "}}</td> \
                                                    </tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>',
                columnDefs: [
                    {field: 'torre', displayName: 'Torre', width: "3%", enableCellEdit: false},
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
                    {field: 'descripcion', displayName: 'Descripcion', width: "34%", enableCellEdit: false},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "9%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "7%", enableCellEdit: false},
                    {field: 'cantidad', displayName: 'Cantidad Ingresada', width: "9%", enableCellEdit: false},
                    {field: 'iva', displayName: 'Gravemen(%)', width: "9%", enableCellEdit: false},
                    {field: 'costoTotal', displayName: 'Costo', width: "9%", enableCellEdit: false},
                    {width: "9%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                        <button  class="btn btn-danger btn-xs btnClick" ng-click="btn_eliminar_producto(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                         </div>'}
                ]
            };

            that.init(function () {
                console.log("hola");
            });

            //  Abre slider para gestionar productos
            $scope.btn_modificar_producto = function (fila) {
                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "modificar_productos",
                    templateUrl: 'views/I011/ventanaModificacion.html',
                    scope: $scope,
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
                modalInstance.result.then(function () {

                });
            };

            $scope.grabar_documento_tmp = function () {
                that.guardarNewDocTmp();
            };

            /**
             * @author German Galvis
             * +Descripcion Metodo encargado de guardar NewDocTmp
             * @fecha 2018-03-27
             */
            that.guardarNewDocTmp = function () {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        bodega_doc_id: $scope.documento_ingreso.get_bodegas_doc_id(),
                        observacion: $scope.documento_ingreso.get_observacion(),
                        abreviatura: $scope.documento_ingreso.get_prefijo(),
                        empresaId: usuario.getEmpresa().getCodigo(),
                        tipo_id_tercero: $scope.cliente_seleccionado.tipo_id_tercero,
                        tercero_id: $scope.cliente_seleccionado.id,
                        numero_factura: $scope.documento_ingreso.getFacturaDevolucion().factura_fiscal,
                        prefijo_factura: $scope.documento_ingreso.getFacturaDevolucion().prefijo,
                    }
                };
                Request.realizarRequest(API.I012.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        $scope.doc_tmp_id = data.obj.movimiento_temporal_id;
                        $scope.validarDesdeLink = true;
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



            $scope.btn_adicionar_producto = function (fila) {
                that.guardarProductoTmp(fila);
            };

            that.guardarProductoTmp = function (producto) {

                var usuario = Usuario.getUsuarioActual();
                var costo_total = (producto.cantidad_ingresada * producto.valorU);
                var obj = {
                    session: $scope.session,
                    data: {
                        bodega: usuario.getEmpresa().centroUtilidad.bodega.codigo,
                        cantidad: producto.cantidad_ingresada,
                        centroUtilidad: usuario.getEmpresa().centroUtilidad.codigo,
                        codigoProducto: producto.codigo_producto,
                        docTmpId: $scope.doc_tmp_id,
                        empresaId: usuario.getEmpresa().getCodigo(),
                        fechaVencimiento: producto.fecha_vencimiento,
                        lote: producto.lote,
                        item_id: producto.item_id,
                        gravamen: producto.iva,
                        totalCosto: costo_total,
                        valorU: producto.valorU,
                        totalCostoPedido: costo_total,
                        numero_doc: $scope.documento_ingreso.getFacturaDevolucion().factura_fiscal,
                        prefijo: $scope.documento_ingreso.getFacturaDevolucion().prefijo,
                        tipoDocumento: $scope.tipoDocumento
                    }
                };

                I012Service.agregarProductoTmp(obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        that.refrescarVista();
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
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
             * @fecha 2018-03-28
             * +Descripcion Metodo encargado de eliminar el producto seleccionado
             * parametros: variables
             */
            $scope.eliminar_producto = function (parametro) {

                var obj = {
                    session: $scope.session,
                    item_id: parametro.item_id,
                    cantidad: parametro.cantidad,
                    codigo_producto: parametro.codigo_producto,
                    fechaVencimiento: parametro.fecha_vencimiento,
                    lote: parametro.lote,
                    numero_doc: $scope.documento_ingreso.getFacturaDevolucion().factura_fiscal,
                    prefijo: $scope.documento_ingreso.getFacturaDevolucion().prefijo,
                    tipoDocumento: $scope.tipoDocumento,
                    docTmpId: $scope.doc_tmp_id
                };
                
                I012Service.eliminarProductoDevolucion(obj, function (data) {

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
             * @fecha 2018-03-27
             * +Descripcion Metodo encargado de invocar el servicio que
             *              borra los DocTemporal
             */
            that.eliminarGetDocTemporal = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        doc_tmp_id: $scope.doc_tmp_id,
//                        listado: $scope.datos_view.listado_productos_devueltos,
//                        numero: $scope.documento_ingreso.getDocumentoDevolucion().numero,
//                        prefijo: $scope.documento_ingreso.getDocumentoDevolucion().prefijo
                    }
                };
                
                console.log("obj",obj);
                I012Service.eliminarGetDocTemporal(obj, function (data) {
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
//
//            /**
//             * @author German Galvis
//             * @fecha 2018-02-27
//             * +Descripcion Metodo encargado de Generar el documento definitivo o 
//             * una parte del mismo
//             * parametros: variable
//             */
//            $scope.generar_documento = function (dato) {
//                that.crearDocumento(dato);
//            };
//
//            that.crearDocumento = function (dato) {
//
//                var obj = {
//                    session: $scope.session,
//                    data: {
//                        ingreso: {
//                            numero_doc: $scope.documento_ingreso.getDocumentoDevolucion().numero,
//                            prefijo_doc: $scope.documento_ingreso.getDocumentoDevolucion().prefijo,
//                            empresa_envia: $scope.documento_ingreso.getDocumentoDevolucion().empresa_id,
//                            doc_tmp_id: $scope.doc_tmp_id,
//                            datoSeleccion: dato,
//                            usuario_id: Usuario.getUsuarioActual().getId()
//                        }
//                    }
//                };
//                I011Service.crearDocumento(obj, function (data) {
//                    if (data.status === 200) {
//
//                        AlertService.mostrarMensaje("warning", data.msj);
//
//                        that.borrarVariables();
//
//                        var nombre = data.obj.nomb_pdf;
//                        setTimeout(function () {
//                            $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
//                        }, 0);
//                    }
//
//                    if (data.status === 500) {
//                        AlertService.mostrarMensaje("warning", data.msj);
//
//                    }
//                });
//            };
//
            that.borrarVariables = function () {
                $scope.doc_tmp_id = "00000";
                $scope.tipoDocumento = '';
                $scope.documento_ingreso.set_observacion('');
                $scope.documento_ingreso.setFacturaDevolucion(null);
                $scope.cliente_seleccionado = [];
                $scope.datos_view.listado_productos = [];
                $scope.datos_view.listado_productos_devueltos = [];
                $scope.validarDesdeLink = false;
            };

            that.refrescarVista = function () {
                that.listarProductosFactura();
                that.listarProductosDevueltos();
            };

            $scope.cancelar_documento = function () {
                $state.go('DocumentosBodegas');
            };

            $scope.isNoTmp = function () {
                var disabled = false;
                if ($scope.doc_tmp_id === "00000" && $scope.documento_ingreso.getFacturaDevolucion() === undefined) {
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
//
//            $scope.isGenerarDocumento = function () {
//                var disabled = false;
//                if ($scope.datos_view.listado_productos_validados.length > 0 && $scope.datos_view.listado_productos.length === 0) {
//                    disabled = true;
//                }
//                return disabled;
//            };
//
//            $scope.isGenerarParteDocumento = function () {
//                var disabled = false;
//                if ($scope.datos_view.listado_productos_validados.length > 0 && $scope.datos_view.listado_productos.length > 0) {
//                    disabled = true;
//                }
//                return disabled;
//            };
//
//            if (datos_documento.datosAdicionales !== undefined) {
//                $scope.doc_tmp_id = datos_documento.datosAdicionales.doc_tmp;
//                $scope.documento_ingreso.set_observacion(datos_documento.datosAdicionales.observacion);
//                $scope.documento_ingreso.set_bodega(datos_documento.datosAdicionales.bodega_seleccionada);
//                /*that.buscarBodegaPorId(datos_documento.datosAdicionales.bodega_seleccionada, function (result) {
//                 $scope.bodegas = result[0];
//                 $scope.documento_ingreso.set_bodega(result[0].bodega);
//                 });*/
//                var doc_devolucion = {
//                    numero: datos_documento.datosAdicionales.numero,
//                    prefijo: datos_documento.datosAdicionales.prefijo_edb,
//                    empresa_id: datos_documento.datosAdicionales.farmacia_id
//
//                };
//                $scope.documento_ingreso.setDocumentoDevolucion(doc_devolucion);
//                $scope.validarDesdeLink = true;
//                that.listarProductosFactura();
//                that.listarProductosDevueltos();
//            } else {
//                $scope.validarDesdeLink = false;
//            }

        }]);
});