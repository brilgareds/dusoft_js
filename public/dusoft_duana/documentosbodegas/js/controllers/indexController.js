
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('indexController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "socket",
        "$timeout",
        "AlertService",
        "localStorageService",
        "$state",
        "$filter",
        "EmpresaDocumento",
        "DocumentoBodega",
        "Usuario",
        "GeneralService",
        "E009Service",
        "E017Service",
        "I011Service",
        "I012Service",
        "TipoDocumentos",
        function ($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, Empresa, Documento, Sesion, GeneralService,
                E009Service, E017Service, I011Service, I012Service, TipoDocumentos) {

            var that = this;
            $scope.claseDoc;

            $scope.Empresa = Empresa;
            $scope.terminoBusqueda = "";
            $scope.termino_busquedaTmp = "";
            $scope.ultima_busqueda = "";
            $scope.termino = "";
            $scope.tipo_factura = "";
            $scope.paginaactual = 1;
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.ultima_busquedaTmp = "";
            $scope.terminoTmp = "";
            $scope.paginaactualTmp = 1;
            $scope.paginasTmp = 0;
            $scope.itemsTmp = 0;

            $scope.listado_productos = [];

            //se valida que el usuario tenga centro de utilidad y bodega
            var empresa = Sesion.getUsuarioActual().getEmpresa();

            if (!empresa) {
                $rootScope.$emit("onIrAlHome", {mensaje: "Documentos Bodegas : Se debe seleccionar una Empresa", tipo: "warning"});
            } else if (!empresa.getCentroUtilidadSeleccionado()) {
                $rootScope.$emit("onIrAlHome", {mensaje: "Documentos Bodegas : Se debe seleccionar un Centro de Utilidad", tipo: "warning"});
            } else if (!empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                $rootScope.$emit("onIrAlHome", {mensaje: "Documentos Bodegas : Se debe seleccionar una Bodega", tipo: "warning"});
            }

            $scope.claseDocumentos = [
                {tipo: 'I', descripcion: " Ingreso "},
                {tipo: 'E', descripcion: " Egreso "}
            ];
            $scope.selecciontipo = ' Seleccionar Clase Documento ';

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            $scope.datos_view = {
                termino_busqueda_documentos: "",
                documentos_salida: [],
                documentos_entrada: [],
                documentos_ajustes: [],
                documentos_traslado: []
            };


            $scope.consultar_listado_documentos_usuario = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            tipo_documento: ''
                        }
                    }
                };

                Request.realizarRequest(API.INDEX.LISTA_DOCUMENTOS_USUARIOS, "POST", obj, function (data) {

                    $scope.datos_view.response = data;

                    if (data.status === 200) {

                        that.render_documentos(data.obj.movimientos_bodegas);

                        $scope.datos_view.documentos_salida = $scope.Empresa.get_documentos_salida();
                        $scope.datos_view.documentos_entrada = $scope.Empresa.get_documentos_entrada();
                        $scope.datos_view.documentos_ajustes = $scope.Empresa.get_documentos_ajuste();
                        $scope.datos_view.documentos_traslado = $scope.Empresa.get_documentos_traslado();
                    }
                });
            };

            that.render_documentos = function (documentos) {

                $scope.Empresa.limpiar_documentos();

                documentos.forEach(function (data) {

                    var documento = Documento.get(data.bodegas_doc_id, data.prefijo);
                    documento.set_empresa(data.empresa_id).set_centro_utilidad(data.centro_utilidad).set_bodega(data.bodega);
                    documento.set_tipo_movimiento(data.tipo_movimiento).set_tipo(data.tipo_doc_bodega_id).set_tipo_clase_documento(data.tipo_clase_documento);
                    documento.set_descripcion(data.descripcion);

                    $scope.Empresa.set_documentos(documento);
                });
            };

            $scope.btn_documento = function (valor) {
                that.gestionarDocumentoSeleccionado(valor);
            };

            that.gestionarDocumentoSeleccionado = function (documento) {
                var result = $state.get().filter(function (obj) {
                    return obj.name === documento.tipo_doc_bodega_id;
                });

                if (result.length > 0) {
                    var numero = documento.numero || '';
                    var datosAdicionales;
                    if (documento.tipo_doc_bodega_id === 'I002') {
                        datosAdicionales = {doc_tmp: documento.doc_tmp_id, orden: documento.orden, codigo_proveedor_id: documento.codigo_proveedor_id};
                    }
                    if (documento.tipo_doc_bodega_id === 'E009') {
                        datosAdicionales = {doc_tmp: documento.doc_tmp_id, observacion: documento.observacion, empresa_destino: documento.empresa_destino};
                    }
                    if (documento.tipo_doc_bodega_id === 'E017') {
                        datosAdicionales = {doc_tmp: documento.doc_tmp_id, observacion: documento.observacion, bodega_destino: documento.bodegatf,
                            centro_utilidad: documento.centrotf, empresa_id: documento.farmacia_id};
                    }
                    if (documento.tipo_doc_bodega_id === 'I011') {
                        datosAdicionales = {doc_tmp: documento.doc_tmp_id, observacion: documento.observacion, numero: documento.numero_edb,
                            prefijo_edb: documento.prefijo_edb, farmacia_id: documento.farmacia_id, bodega_seleccionada: documento.bodega};
                    }
                    if (documento.tipo_doc_bodega_id === 'I012') {
                        datosAdicionales = {doc_tmp: documento.doc_tmp_id, observacion: documento.observacion, numero_factura: documento.numero_factura,
                            prefijoFactura: documento.prefijo_idc, terceroId: documento.tercero_id, tipoTerceroId: documento.tipo_id_tercero.trim()};
                    }
                    var datos = {bodegas_doc_id: documento.bodegas_doc_id, prefijo: documento.prefijo, numero: numero, datosAdicionales: datosAdicionales};
                    localStorageService.add("documento_bodega_" + documento.tipo_doc_bodega_id, datos);

                    $state.go(documento.tipo_doc_bodega_id);
                } else
                    AlertService.mostrarMensaje("warning", 'El modulo [ ' + documento.tipo_doc_bodega_id + '-' + documento.descripcion + ' ] aun no esta disponible en esta version!!!');
            };

            $scope.gestionar_documento = function (documento) {

                var result = $state.get().filter(function (obj) {
                    return obj.name === documento.get_tipo();
                });

                if (result.length > 0) {

                    var datos = {bodegas_doc_id: documento.get_bodegas_doc_id(), prefijo: documento.get_prefijo(), numero: documento.get_numero()}
                    localStorageService.add("documento_bodega_" + documento.get_tipo(), datos);

                    $state.go(documento.get_tipo());
                } else
                    AlertService.mostrarMensaje("warning", 'El modulo [ ' + documento.get_tipo() + '-' + documento.get_descripcion() + ' ] aun no esta disponible en esta version!!!');
            };

            $scope.seleccionarDocumentoEvento = function ($event, terminoBusqueda) {

                if ($event.which === 13 || $event.which === 1) {
                    $scope.termino_busquedaTmp = terminoBusqueda;
                    $scope.terminoTmp = terminoBusqueda;
                    if ($scope.tipoDocumento.tipo !== undefined) {
                        that.listarDocumetosTemporales(true);
                    }
                }
            };
            /*
             * evento del select temporal
             */
            $scope.seleccionarDocumento = function () {
                if ($scope.tipoDocumento.tipo.tipo !== undefined) {
                    that.listarDocumetosTemporales(true);
                }
            };

            $scope.seleccionarDocumentoCreadoEvento = function ($event, terminoBusqueda) {

                if ($event.which === 13 || $event.which === 1) {
                    $scope.terminoBusqueda = terminoBusqueda;
                    $scope.termino = terminoBusqueda;
                    if ($scope.tipoDocumento.tipo === undefined) {
                    } else {
                        that.listarDocumentosBodegaUsuario(true);
                    }
                }
            };

            $scope.seleccionarDocumentoCreado = function () {
                if ($scope.tipoDocumento.tipo.tipo !== undefined) {
                    that.listarDocumentosBodegaUsuario(true);
                }
            };

            $scope.listaDocumentosTemporales = {
                data: 'documentosTemorales',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                columnDefs: [
                    {field: 'tipo_movimiento', displayName: 'Clase de Documento', width: "10%"},
                    {field: 'tipo_doc_bodega_id', displayName: 'Tipo Doc', width: "10%"},
                    {field: 'doc_tmp_id', displayName: 'No. Doc', width: "10%"},
                    {field: 'orden', displayName: 'Orden', width: "10%"},
                    {field: 'tipo_clase_documento', displayName: 'Descripción', width: "30%"},
                    {field: 'nombre', displayName: "Usuario", width: "20%"},
                    {field: 'fecha_registro', displayName: "Fecha", cellFilter: "date:\'dd-MM-yyyy\'", width: "5%"},
                    {width: "5%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                           <div ng-if="validarDelete(row.entity.usuario_id)">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_documento(row.entity)"><span class="glyphicon glyphicon-send"></span></button>\
                                            <button class="btn btn-default btn-xs" ng-click="btn_eliminar_documento(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                           </div>\
                                        </div>'}
                ]
            };

            $scope.listaDocumentos = {
                data: 'Documento',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                showFilter: true,
                columnDefs: [
                    {field: 'tipo', displayName: 'Tipo Movimiento', width: "7%"},
                    {field: 'tipo_movimiento', displayName: 'Doc Bod ID', width: "7%"},
                    {field: 'bodegas_doc_id', displayName: 'Doc ID', width: "7%"},
                    {field: 'prefijoNumero', displayName: 'Número', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripción', width: "25%"},
                    {field: 'observaciones', displayName: "Observación", width: "25%"},
                    {field: 'fecha_registro', displayName: "Fecha", cellFilter: "date:\'dd-MM-yyyy\'", width: "5%"},
                    {width: "7%", displayName: "Acciónes", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                           <div ">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_imprimir(row.entity)">Imprimir <span class="glyphicon glyphicon-print"></span></button>\
                                           </div>\
                                        </div>'},
                    {width: "7%", displayName: "Autorizacion", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                     <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" ng-hide="ocultarTorre(row.entity)">Torres<span class="caret"></span></button>\
                     <ul class="dropdown-menu dropdown-options">\
                     <li ng-repeat="torre in row.entity.torres">\
                     <a href="javascript:void(0)" ng-click="btn_imprimirTorre(row.entity,torre.torre)">{{torre.torre}}</a>\
                     </li>\
                     </ul>\
                     </div>\
                     <button class="btn btn-default btn-xs" ng-hide="ocultarAutorizacion(row.entity)" ng-click="btn_imprimirAutorizacion(row.entity)">Imprimir <span class="glyphicon glyphicon-print"></span></button>\
                    </div>\
                 </div>'
                    }
                ]
            };

            $scope.ocultarAutorizacion = function (documento) {
                var disabled = false;

                if (documento.tipo_movimiento === "I011" || documento.tipo_movimiento === "E009" || documento.tipo_movimiento === "I012" || documento.tipo_movimiento === "E017") {
                    disabled = true;
                }
                return disabled;
            };

            $scope.ocultarTorre = function (documento) {
                var disabled = true;

                if (documento.tipo_movimiento === "I011") {
                    disabled = false;
                }
                return disabled;
            };

            that.crearHtmlDocumento = function (documentos, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                        prefijo: documentos.prefijo,
                        numeracion: documentos.numero
                    }
                };
                if (documentos.tipo_movimiento === "I002") {

                    Request.realizarRequest(API.I002.CREAR_HTML_DOCUMENTO, "POST", obj, function (data) {
                        if (data.status === 200) {
                            callback(data);
                        }
                        if (data.status === 500) {
                            AlertService.mostrarMensaje("warning", data.msj);
                            callback(false);
                        }
                    });
                } else if (documentos.tipo_movimiento === "I011") {

                    obj.data.prefijoFactura = documentos.prefijoFactura;
                    obj.data.numeroFactura = documentos.numeroFactura;

                    Request.realizarRequest(API.I011.CREAR_DOCUMENTO_IMPRIMIR, "POST", obj, function (data) {
                        if (data.status === 200) {
                            callback(data);
                        }
                        if (data.status === 500) {
                            AlertService.mostrarMensaje("warning", data.msj);
                            callback(false);
                        }
                    });
                } else if (documentos.tipo_movimiento === "I012") {

                    obj.data.tipoTercero = documentos.tipoTercero;
                    obj.data.terceroId = documentos.terceroId;
                    obj.data.prefijoFactura = documentos.prefijoFactura;
                    obj.data.numeroFactura = documentos.numeroFactura;

                    Request.realizarRequest(API.I012.CREAR_DOCUMENTO_IMPRIMIR, "POST", obj, function (data) {
                        if (data.status === 200) {
                            callback(data);
                        }
                        if (data.status === 500) {
                            AlertService.mostrarMensaje("warning", data.msj);
                            callback(false);
                        }
                    });
                } else if (documentos.tipo_movimiento === "E009") {

                    Request.realizarRequest(API.E009.CREAR_DOCUMENTO_IMPRIMIR, "POST", obj, function (data) {
                        if (data.status === 200) {
                            callback(data);
                        }
                        if (data.status === 500) {
                            AlertService.mostrarMensaje("warning", data.msj);
                            callback(false);
                        }
                    });
                } else if (documentos.tipo_movimiento === "E017") {
                    Request.realizarRequest(API.E017.CREAR_DOCUMENTO_IMPRIMIR, "POST", obj, function (data) {
                        if (data.status === 200) {
                            callback(data);
                        }
                        if (data.status === 500) {
                            AlertService.mostrarMensaje("warning", data.msj);
                            callback(false);
                        }
                    });
                }
            };


            that.crearHtmlAutorizacion = function (documentos, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                        prefijo: documentos.prefijo,
                        numeracion: documentos.numero
                    }
                };

                GeneralService.crearHtmlAutorizacion(obj, function (data) {
                    if (data.status === 200) {
                        callback(data);
                    }
                    if (data.status === 201) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
                    }

                });
            };

            $scope.btn_imprimir = function (documentos) {

                that.crearHtmlDocumento(documentos, function (respuesta) {
                    if (respuesta !== false) {
                        $scope.visualizarReporte("/reports/" + respuesta.obj.nomb_pdf, respuesta.obj.nomb_pdf, "_blank");
                    }
                });

            };

            $scope.btn_imprimirAutorizacion = function (documentos) {
                that.crearHtmlAutorizacion(documentos, function (respuesta) {
                    if (respuesta !== false) {
                        $scope.visualizarReporte("/reports/" + respuesta.obj.nomb_pdf, respuesta.obj.nomb_pdf, "_blank");
                    }
                });

            };

            $scope.btn_imprimirTorre = function (documentos, torre) {
                var e;
                if (torre === "Sin Torre") {
                    e = null;
                } else {
                    e = torre;
                }

                that.crearTorreDocumento(documentos, e, function (respuesta) {
                    if (respuesta !== false) {
                        $scope.visualizarReporte("/reports/" + respuesta.obj.nomb_pdf, respuesta.obj.nomb_pdf, "_blank");
                    }
                });

            };

            that.crearTorreDocumento = function (documentos, torre, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                        prefijo: documentos.prefijo,
                        numeracion: documentos.numero,
                        prefijoFactura: documentos.prefijoFactura,
                        numeroFactura: documentos.numeroFactura,
                        torre: torre
                    }
                };

                Request.realizarRequest(API.I011.CREAR_DOCUMENTO_TORRE, "POST", obj, function (data) {
                    if (data.status === 200) {
                        callback(data);
                    }
                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
                    }
                });

            };

            $scope.btn_eliminar_documento = function (data) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar el documento?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar el documento?</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function ($scope, $modalInstance) {

                        $scope.confirmar = function () {
                            if (data.tipo_doc_bodega_id === "I002") {
                                that.eliminarGetDocTemporal(data);
                            }
                            if (data.tipo_doc_bodega_id === "E009") {
                                that.eliminarGetDocTemporalE009(data);
                            }
                            if (data.tipo_doc_bodega_id === "E017") {
                                that.eliminarGetDocTemporalE017(data);
                            }
                            if (data.tipo_doc_bodega_id === "I011") {
                                that.eliminarGetDocTemporalI011(data);
                            }
                            if (data.tipo_doc_bodega_id === "I012") {
                                that.eliminarGetDocTemporalI012(data);
                            }
                            $modalInstance.close();
                        };

                        $scope.close = function () {
                            $modalInstance.close();
                        };

                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };

            that.eliminarGetDocTemporal = function (datos) {
                var obj = {
                    session: $scope.session,
                    data: {
                        orden_pedido_id: datos.orden,
                        doc_tmp_id: datos.doc_tmp_id
                    }
                };

                GeneralService.eliminarGetDocTemporal(obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            that.eliminarGetDocTemporalE009 = function (datos) {
                var obj = {
                    session: $scope.session,
                    data: {
                        doc_tmp_id: datos.doc_tmp_id
                    }
                };
                E009Service.eliminarGetDocTemporal(obj, function (data) {
                    if (data.status === 200) {
                        that.listarDocumetosTemporales(true);
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            that.eliminarGetDocTemporalE017 = function (datos) {
                var obj = {
                    session: $scope.session,
                    data: {
                        doc_tmp_id: datos.doc_tmp_id
                    }
                };
                E017Service.eliminarGetDocTemporal(obj, function (data) {
                    if (data.status === 200) {
                        that.listarDocumetosTemporales(true);
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 404) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
            };

            that.eliminarGetDocTemporalI011 = function (datos) {

                that.listarProductosEliminar(datos.doc_tmp_id, function (condicional) {

                    if (condicional) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                doc_tmp_id: datos.doc_tmp_id,
                                listado: $scope.listado_productos,
                                numero: datos.numero_edb,
                                prefijo: datos.prefijo_edb
                            }
                        };
                        I011Service.eliminarGetDocTemporal(obj, function (data) {
                            if (data.status === 200) {
                                that.listarDocumetosTemporales(true);
                                AlertService.mostrarMensaje("warning", data.msj);
                            }

                            if (data.status === 404) {
                                AlertService.mostrarMensaje("warning", data.msj);
                            }

                            if (data.status === 500) {
                                AlertService.mostrarMensaje("warning", data.msj);
                            }
                        });
                    }
                });
            };

            that.listarProductosEliminar = function (doc_id, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: doc_id

                    }
                };
                Request.realizarRequest(API.I011.CONSULTAR_PRODUCTOS_VALIDADOS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosValidados(data.obj.lista_productos);
                        callback(true);
                    } else {
                        callback(false);

                    }

                });
            };

            that.renderProductosValidados = function (productos) {
                $scope.listado_productos = [];
                productos.forEach(function (data) {

                    var producto = {};
                    producto.movimiento = data.movimiento_id;
                    $scope.listado_productos.push(producto);
                });
            };

            that.eliminarGetDocTemporalI012 = function (datos) {

                that.tipoFacturaI012(datos);
                that.listarProductosEliminarI012(datos.doc_tmp_id, function (condicional) {

                    if (condicional) {



                        var obj = {
                            session: $scope.session,
                            data: {
                                doc_tmp_id: datos.doc_tmp_id,
                                listado: $scope.listado_productos,
                                numero_doc: datos.numero_factura,
                                prefijo: datos.prefijo_idc,
                                tipoDocumento: $scope.tipo_factura
                            }
                        };
                        I012Service.eliminarGetDocTemporal(obj, function (data) {
                            if (data.status === 200) {
                                that.listarDocumetosTemporales(true);
                                AlertService.mostrarMensaje("warning", data.msj);
                            }

                            if (data.status === 404) {
                                AlertService.mostrarMensaje("warning", data.msj);
                            }

                            if (data.status === 500) {
                                AlertService.mostrarMensaje("warning", data.msj);
                            }
                        });
                    }
                });
            };

            that.tipoFacturaI012 = function (datos) {

                var obj = {
                    session: $scope.session,
                    data: {
                        numero: datos.numero_factura,
                        prefijo: datos.prefijo_idc
                    }
                };

                Request.realizarRequest(API.I012.CONSULTAR_TIPO_FACTURA, "POST", obj, function (data) {
                    if (data.status === 200) {

                        if (data.obj.tipoFactura.length > 0) {
                            $scope.tipo_factura = 0;

                        } else {

                            $scope.tipo_factura = 1;
                        }
                    }

                });
            };

            that.listarProductosEliminarI012 = function (doc_id, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        numero_doc: doc_id

                    }
                };
                Request.realizarRequest(API.I012.CONSULTAR_PRODUCTOS_DEVUELTOS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        that.renderProductosValidadosI012(data.obj.lista_productos);
                        callback(true);
                    } else {
                        callback(false);

                    }

                });
            };

            that.renderProductosValidadosI012 = function (productos) {
                $scope.listado_productos = [];
                productos.forEach(function (data) {

                    var producto = {};
                    producto.itemIdCompra = data.item_id_compras;
                    producto.cantidad = data.cantidad;
                    $scope.listado_productos.push(producto);
                });
            };

            $scope.validarDelete = function (usuario) {
                var disabled = false;
                if ($scope.session.usuario_id === usuario) {
                    disabled = true;
                }
                return disabled;
            };

            $scope.onBuscar = function (claseDoc, descripDoc) {
                $scope.selecciontipo = " " + descripDoc + " ";
                that.getTiposDocumentosBodegaEmpresa(claseDoc);
                $scope.claseDoc = claseDoc;
            };

            that.getTiposDocumentosBodegaEmpresa = function (claseDoc) {

                var obj = {
                    session: $scope.session,
                    data: {
                        empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                        centro_utilidad_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                        bodega_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                        invTipoMovimiento: claseDoc
                    }
                };

                Request.realizarRequest(API.INDEX.GET_TIPOS_DOCUMENTOS_BODEGA_EMPRESA, "POST", obj, function (data) {
                    if (data.status === 200) {
                        that.renderTipoDocumento(data.obj.getTiposDocumentosBodegaEmpresa);
                    }
                });
            };

            that.renderTipoDocumento = function (tipoDocumento) {
                var tipoDocumentos = [];
                tipoDocumento.forEach(function (data) {
                    var _tipoDocumento = TipoDocumentos.get(data.tipo_doc_bodega_id, data.tipo_clase_documento);
                    tipoDocumentos.push(_tipoDocumento);
                });
                $scope.tipoDocumento = tipoDocumentos;

            };

            that.listarDocumetosTemporales = function (paginandoTmp) {

                if ($scope.ultima_busquedaTmp !== $scope.terminoTmp) {
                    $scope.paginaactualTmp = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                        centroUtilidadId: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                        bodegaId: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                        tipoDocGeneralId: $scope.tipoDocumento.tipo.tipo,
                        invTipoMovimiento: $scope.claseDoc,
                        numeroDocumento: $scope.termino_busquedaTmp,
                        paginaActual: $scope.paginaactualTmp
                    }
                };

                Request.realizarRequest(API.INDEX.LISTAR_DOCUMENTOS_TEMPORALES, "POST", obj, function (data) {
                    if (data.status === 200) {

                        $scope.itemsTmp = data.obj.obtenerDocumetosTemporales.length;

                        //                se valida que hayan registros en una siguiente pagina
                        if (paginandoTmp && $scope.itemsTmp === 0) {
                            if ($scope.paginaactualTmp > 1) {
                                $scope.paginaactualTmp--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }

                        $scope.paginasTmp = (data.obj.obtenerDocumetosTemporales.length / 10);
                        $scope.itemsTmp = data.obj.obtenerDocumetosTemporales.length;

                        $scope.documentosTemorales = data.obj.obtenerDocumetosTemporales;
                    }
                });
            };

            that.listarDocumentosBodegaUsuario = function (paginando) {

                if ($scope.ultima_busqueda !== $scope.termino) {
                    $scope.paginaactual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                        centroUtilidadId: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                        bodegaId: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                        tipoDocGeneralId: $scope.tipoDocumento.tipo.tipo,
                        invTipoMovimiento: $scope.claseDoc,
                        numeroDocumento: $scope.terminoBusqueda,
                        paginaActual: $scope.paginaactual
                    }
                };

                Request.realizarRequest(API.INDEX.GET_DOCUMENTOS_BODEGA_USUARIO, "POST", obj, function (data) {
                    if (data.status === 200) {
                        $scope.ultima_busqueda = $scope.termino;
                        that.renderDocumento(data.obj.getDocumentosBodegaUsuario, paginando);
                    }
                });
            };

            that.renderDocumento = function (documentos, paginando) {
                var allDocumentos = [];

                $scope.items = documentos.length;

//                se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.paginas = (documentos.length / 10);
                $scope.items = documentos.length;


                documentos.forEach(function (data) {
                    var doc = Documento.get(data.documento_id, data.prefijo, data.numero, data.fecha_registro);
                    doc.set_tipo(data.tipo_movimiento);
                    doc.set_tipo_movimiento(data.tipo_doc_bodega_id);
                    doc.set_descripcion(data.descripcion);
                    doc.set_observaciones(data.observacion);
                    doc.setPrefijoNumero(data.prefijo + '-' + data.numero);
                    var nomb_pdf = "documentoI002" + data.prefijo + data.numero + ".html";
                    if (data.tipo_doc_bodega_id === 'I011') {
                        that.buscarTorres(data.prefijo, data.numero, function (resul) {
                            doc.torres = resul;
                        });

                    }
                    doc.setTerceroId(data.tercero_id);
                    doc.setTipoTercero(data.tipo_id_tercero);
                    doc.setNumeroFactura(data.numero_doc_cliente);
                    doc.setPrefijoFactura(data.prefijo_doc_cliente);

                    doc.setArchivo(nomb_pdf);
                    allDocumentos.push(doc);
                });
                $scope.Documento = allDocumentos;
            };

            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 20/04/2017
             * @returns {pagina}
             */
            $scope.paginaAnterior = function () {
                if ($scope.paginaactual === 1)
                    return;
                $scope.paginaactual--;
                that.listarDocumentosBodegaUsuario(true);
            };

            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 20/04/2017
             * @returns {pagina}
             */
            $scope.paginaSiguiente = function () {
                $scope.paginaactual++;
                that.listarDocumentosBodegaUsuario(true);
            };

            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 20/04/2017
             * @returns {pagina}
             */
            $scope.paginaAnteriorTmp = function () {
                if ($scope.paginaactualTmp === 1)
                    return;
                $scope.paginaactualTmp--;
                that.listarDocumetosTemporales(true);
            };

            /**
             * +Descripcion: metodo para el paginado
             * @author Andres M Gonzalez
             * @fecha: 20/04/2017
             * @returns {pagina}
             */
            $scope.paginaSiguienteTmp = function () {
                $scope.paginaactualTmp++;
                that.listarDocumetosTemporales(true);
            };

            that.buscarTorres = function (prefijo, numero, callback) {
                var obj = {
                    session: $scope.session,
                    data: {
                        prefijo: prefijo,
                        numero: numero
                    }
                };

                Request.realizarRequest(API.I011.LISTAR_TORRES, "POST", obj, function (data) {
                    if (data.status === 200) {
                        callback(data.obj.listarTorres);
                    }
                });

            };

            $scope.consultar_listado_documentos_usuario();
        }]);
});