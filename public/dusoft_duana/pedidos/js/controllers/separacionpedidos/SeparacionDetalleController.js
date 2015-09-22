//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('SeparacionDetalleController', [
        '$scope', '$rootScope', 'Request', 'API',
        "socket", "AlertService", "$modal", "localStorageService",
        "$state", "SeparacionService", "Usuario", "DocumentoDespacho",
        function($scope, $rootScope, Request,
                API, socket, AlertService, $modal,
                localStorageService, $state, SeparacionService,
                Usuario, DocumentoDespacho) {


            var self = this;

            self.init = function(callback) {
                $scope.rootDetalle = {};
                $scope.rootDetalle.pedido = $scope.rootSeparacion.documento.getPedido();
                $scope.rootDetalle.nombreCliente;

                $scope.rootDetalle.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                if ($scope.rootDetalle.pedido.getTipo() === '1') {
                    $scope.rootDetalle.nombreCliente = $scope.rootDetalle.pedido.getCliente().getNombre();
                } else {

                    $scope.rootDetalle.nombreCliente = $scope.rootDetalle.pedido.getFarmacia().get_nombre_farmacia()
                            + " -- " + $scope.rootDetalle.pedido.getFarmacia().getNombreBodega();
                }

                callback();
            };


            /**
             * +Descripcion: Metodo para prototipo de confirm y ser reutilizado
             * en la clase
             * 
             */
            self.confirm = function(titulo, mensaje, callback) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">' + titulo + '</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4 ><b>' + mensaje + '?</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-warning" ng-click="cancelarEliminacion()">Cancelar</button>\
                                        <button class="btn btn-primary"  ng-click="aceptarEliminacion()">Aceptar</button>\
                                    </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.aceptarEliminacion = function() {
                            $modalInstance.close();
                            callback(true);
                        };
                        $scope.cancelarEliminacion = function() {
                            $modalInstance.close();
                            callback(false);
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };

            /**
             * +Descripcion: Metodo encargado de generar la separacion
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            self.generarDocumento = function(callback) {
                var url = API.SEPARACION_PEDIDOS.CLIENTES.FINALIZAR_DOCUMENTO_CLIENTES;
                var pedido = $scope.rootDetalle.pedido;

                if (pedido.getTipo() === '2') {
                    url = API.SEPARACION_PEDIDOS.FARMACIAS.FINALIZAR_DOCUMENTO_FARMACIAS;
                }

                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: pedido.get_numero_pedido()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.cerrarDetallePedidos();
                        $state.go("SeparacionPedidos");
                        AlertService.mostrarMensaje("success", "Separacion finalizada");
                        callback(true);
                    } else {
                        SeparacionService.mostrarAlerta("Error", "Se ha generado un error");
                        callback(false);
                    }
                });
            };


            /**
             * 
             * @param {type} producto
             * @returns {undefined}
             * +Descripcion: Metodo para eliminar productos uno por uno
             * de la lista de separacion detalle
             * +@author Cristian Ardila
             */
            self.eliminarLote = function(producto) {
                var url = API.SEPARACION_PEDIDOS.ELIMINAR_ITEM_TEMPORAL;
                var pedido = $scope.rootDetalle.pedido;

                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        documento_temporal: {
                            item_id: producto.getItemId(),
                            codigo_producto: producto.getCodigoProducto(),
                            documento_temporal_id: pedido.getTemporalId()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var index = pedido.getProductos().indexOf(producto);
                        pedido.getProductos().splice(index, 1);
                        AlertService.mostrarMensaje("success", "Lote eliminado correctamente");
                    } else {
                        SeparacionService.mostrarAlerta("Error", "Se ha generado un error");
                    }
                });
            };

            /**
             * +Descripcion: Metodo encargado de eliminar todos los productos
             * de la lista del detalle de separacion
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            self.eliminarTemporal = function() {
                var url = API.SEPARACION_PEDIDOS.CLIENTES.ELIMINAR_DOCUMENTO_TEMPORAL_CLIENTES;
                var pedido = $scope.rootDetalle.pedido;

                if (pedido.getTipo() === '2') {
                    url = API.SEPARACION_PEDIDOS.FARMACIAS.ELIMINAR_DOCUMENTO_TEMPORAL_FARMACIAS;
                }

                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: pedido.get_numero_pedido()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.cerrarDetallePedidos(true);
                        $scope.$emit("onFinalizar");
                        AlertService.mostrarMensaje("success", "Documento eliminado");
                    } else {
                        SeparacionService.mostrarAlerta("Error", "Se ha generado un error");
                    }
                });
            };

            /**
             * +Descripcion: Metodo encargado de generar y auditar la separacion
             * @author Cristian Ardila
             * @fecha 10/09/2015
             * @returns {void}
             */
            self.generarAuditar = function() {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    templateUrl: 'views/separacionpedidos/separacionSeleccionDocumentoDespacho.html',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.cerrarGenerarAuditar = function() {
                            $modalInstance.close();

                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };


            /**
             * +Descripcion: Metodo para confirmar la eliminacion de
             * un producto de la lista de separacion, si acepta se ejecutara un
             * metodo mas encargado de invocar el servicio para eliminacion,
             * si presiona el boton cancelar, se cancelara el proceso
             */
            $scope.onEliminarLote = function(producto) {

                self.confirm("Eliminar producto", "Desea eliminar el producto", function(confirmar) {
                    if (confirmar) {
                        self.eliminarLote(producto);
                    }
                });
            };

            /**
             * @author Cristian Ardila
             * +Descripcion: Grilla en comun para pedidos asignados 
             *  clientes y pedidos temporales clientes
             */
            $scope.detalleSeparacionProducto = {
                data: 'rootDetalle.pedido.productos',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Producto', width: "600",
                        cellTemplate: '<div class="ngCellText">\
                                        {{row.entity.codigo_producto}} - {{row.entity.descripcion}}\
                                   </div>'
                    },
                    {field: 'lotesSeleccionados[0].codigo_lote', displayName: 'Lote'},
                    {field: 'lotesSeleccionados[0].fecha_vencimiento', displayName: 'F Vencimiento'},
                    {field: 'cantidad_solicitada', displayName: 'Solicitado'},
                    {field: 'lotesSeleccionados[0].cantidad_ingresada', displayName: 'Ingresado'},
                    {field: 'cantidad_pendiente', displayName: 'Pendiente'},
                    {displayName: "", cellClass: "txt-center dropdown-button", width: "50",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="onEliminarLote(row.entity)" ng-disabled="planilla.get_estado()==\'2\'" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };

            /**
             * +Descripcion: Metodo encargado de cerrar la ventana slider del 
             * detalle de separacion de productos
             * @author Cristian Ardila
             */
            $scope.cerrarDetallePedidos = function(finalizar) {

                // self.mostrarDetallePedidosCompleto();
                $scope.$emit('closeDetallePedidos', {animado: true, finalizar: finalizar});
            };


            /*
             * +descripcion: confirmar la eliminacion de todos los productos de 
             * la lista de detalle de separacion, si acepta, se ejecutara un 
             * metodo mas que invocara el servicio para la eliminacion,
             * si no acepta, se cancelara el proceso.
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * */
            $scope.onEliminarTemporal = function() {
                self.confirm("Eliminar toda la separacion", "Desea eliminar la separacion", function(confirmar) {
                    if (confirmar) {
                        self.eliminarTemporal();
                    }
                });
            };

            /*
             * +descripcion: confirmar la generacion de la separacion 
             * si acepta se generara la separacion invocando al metodo 
             * method(generarSeparacion)
             * si no acepta, se cancelara el proceso.
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * */
            $scope.onGenerarDocumento = function() {
                self.confirm("Generar separacion", "Desea generar la separacion de los productos", function(confirmar) {
                    if (confirmar) {
                        self.generarDocumento();
                    }
                });
            };

            /**
             * +Descripcion: Metodo encargado de consultar los tipos de documento
             * despachp
             * @author:Cristian Ardila
             * @fecha: 22/09/2015
             * @param {type} callback
             * @returns {undefined}
             */
            self.traerListadoDocumentosDespacho = function(callback) {

                var empresa = Usuario.getUsuarioActual().getEmpresa();
                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            tipo_documento: 'E008'
                        }
                    }
                };

                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTOS_USUARIOS, "POST", obj, function(data) {
                    if (data.status === 200) {


                        callback(data);
                        self.renderDocumentosDespachos(data);
                    }
                });
            };

            self.renderDocumentosDespachos = function(data) {


                $scope.documentos = [];
                for (var i in data.obj.movimientos_bodegas) {
                    var _documentos = data.obj.movimientos_bodegas[i];


                    var documentos = DocumentoDespacho.get(_documentos.bodegas_doc_id, _documentos.prefijo, '', '');
                    documentos.set_descripcion(_documentos.descripcion);
                    documentos.set_tipo(_documentos.tipo_doc_bodega_id);
                    documentos.set_tipo_clase_documento(_documentos.tipo_clase_documento);
                    $scope.documentos.push(documentos);
                }


            }


            $scope.listarDocumentoDespacho = {
                data: 'documentos',
                afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        self.onSeleccionDocumento(rowItem.entity);
                    }
                },
                enableColumnResize: true,
                enableRowSelection: true,
                keepLastSelected: false,
                multiSelect: false,
                columnDefs: [
                    {field: 'get_tipo()', displayName: 'Codigo'},
                    {field: 'get_descripcion()', displayName: 'Descripcion'}


                ]

            };


            self.onSeleccionDocumento = function(entity) {

                var pedido = $scope.rootDetalle.pedido;

                /* that.seleccionarDocumentoDespacho($scope.seleccion.bodegas_doc_id);*/
                var obj = {
                    session: $scope.rootDetalle.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id: pedido.getTemporalId(),
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            bodegas_doc_id: entity.get_bodegas_doc_id(),
                            numero_pedido: pedido.get_numero_pedido(),
                            auditor: Usuario.getUsuarioActual().getId()
                        }
                    }
                };

                self.renderDocumentoTemporalClienteFarmacia(obj, pedido.getTipo(), function(data) {

                });
                /*    
                 $scope.validarDocumentoUsuario(obj, 2, function(data) {
                 if (data.status === 200) {
                 
                 $scope.DocumentoTemporal.bodegas_doc_id = $scope.seleccion.bodegas_doc_id;
                 $scope.DocumentoTemporal.auditor.usuario_id = $scope.session.usuario_id;
                 AlertService.mostrarMensaje("success", data.msj);
                 } else {
                 AlertService.mostrarMensaje("warning", data.msj);
                 }
                 });
                 */

            };
            /**
             * +Descripcion: Metodo encargado de acutalizar el tipo de documento
             * temporal, dependiendo del tipo que se le envie, si es 1 actualiza
             * clientes y si es 2 acutaliza farmacias.
             * @param {type} obj
             * @param {type} tipo
             * @param {type} callback
             * @returns {undefined}
             */
            self.renderDocumentoTemporalClienteFarmacia = function(obj, tipo, callback) {
                var url = API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_CLIENTES;


                if (tipo === 2) {
                    url = API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_FARMACIAS;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {
                    console.log(data)
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                    callback(data);
                });
            }
            /*
             * +descripcion: confirmar que se genera y audita la separacion
             * si acepta se generara y auditara la separacion invocando al metodo 
             * method(generarAuditar)
             * si no acepta, se cancelara el proceso.
             * @author Cristian Ardila
             * @fecha: 10/09/2015
             * */
            $scope.onGenerarAuditar = function() {
                self.confirm("Generar y auditar", "Desea generar y auditar la separacion de los productos", function(confirmar) {
                    if (confirmar) {
                        var productos = $scope.rootDetalle.pedido.getProductos();

                        var productoValido = true;
                        for (var i in productos) {
                          
                            var numCaja = productos[i].getLotesSeleccionados()[0].getNumeroCaja();

                            if (numCaja === null || numCaja === 0 || numCaja === undefined) {
                                
                               SeparacionService.mostrarAlerta("Error", "No se puede auditar el pedido por que hay lotes sin caja");
                                productoValido = false;

                                break;
                            }
                        }
                        if (productoValido) {
                            self.generarDocumento(function(continuar){
                                
                                if(continuar){
                                     self.generarAuditar();

                                }
                            })
                        }
                    }
                });
            };



            self.init(function() {

                self.traerListadoDocumentosDespacho(function() {
                    console.log("Trayendo documentos despacho")
                });

            });

        }]);
});
