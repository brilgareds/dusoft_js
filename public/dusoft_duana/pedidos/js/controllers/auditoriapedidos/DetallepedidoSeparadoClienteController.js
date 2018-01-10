define(["angular", "js/controllers", 
    'models/auditoriapedidos/ClientePedido',
    'models/auditoriapedidos/Separador', 
    'models/auditoriapedidos/DocumentoTemporal',
    'models/auditoriapedidos/ProductoPedido', 
    'models/auditoriapedidos/LoteProductoPedido'], function(angular, controllers) {

    var fo = controllers.controller('DetallepedidoSeparadoClienteController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'EmpresaPedido', 'Cliente',
        'API', "socket", "$timeout",
        "AlertService", "Usuario", "localStorageService",
        "ProductoPedido", "LoteProductoPedido", "DocumentoTemporal",
        function($scope, $rootScope, Request,
                $modal, Empresa, Cliente,
                API, socket,
                $timeout, AlertService, Usuario,
                localStorageService, ProductoPedido, LoteProductoPedido, DocumentoTemporal) {

            $scope.detalle_pedido_separado = [];

            $scope.DocumentoTemporal = DocumentoTemporal.get();
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.ultima_busqueda = {};
            $scope.paginaactual = 1;
            $scope.documentos_usuarios = [];
            $scope.documento_temporal_id = "";
            $scope.usuario_id = "";
            $scope.seleccion;
            $scope.documento_despacho = {};
            $scope.seleccion2 = 154;
            $scope.cajas = [];
            $scope.seleccion_caja = "";
            $scope.numero_pedido = "";
            var that = this;

            $scope.cerrar = function() {
                $scope.$emit('cerrardetallecliente', {animado: true});
                $scope.$emit('onDetalleCerrado');
            };

            $scope.$on("detalleClienteCompleto", function(e, datos) {

 
                $scope.DocumentoTemporal = datos[1];
                $scope.buscarDetalleDocumentoTemporal(that.obtenerParametros(), false, 1, that.resultadoBusquedaDocumento);
                $scope.cliente = $scope.DocumentoTemporal.pedido.cliente;
                $scope.numero_pedido = $scope.DocumentoTemporal.pedido.numero_pedido;
                $scope.filtro.codigo_barras = true;
                var empresa = Usuario.getUsuarioActual().getEmpresa();
                
                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            tipo_documento: 'E008'
                        }
                    }
                };


                $scope.traerListadoDocumentosUsuario(obj, that.resultasdoListadoDocumentosUsuario);

                var params = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id: $scope.DocumentoTemporal.documento_temporal_id,
                            usuario_id: $scope.DocumentoTemporal.separador.usuario_id
                        }
                    }
                };

                $scope.traerProductosAuditatos(params);

            });


            $scope.$on("detalleClienteCerradoCompleto", function(e) {
                $scope.filtro.termino_busqueda = "";
                if ($scope.DocumentoTemporal !== undefined) {
                    if ($scope.DocumentoTemporal.pedido !== undefined) {
                        $scope.DocumentoTemporal.getPedido().vaciarProductos();
                    }

                }
               // $scope.$$watchers = null;

            });



            that.resultadoBusquedaDocumento = function(data, paginando) {
                data = data.obj.documento_temporal[0];
                $scope.seleccion = {};
                $scope.items = data.lista_productos.length;

                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }


                //$scope.renderDetalleDocumentoTemporal($scope.DocumentoTemporal, data, paginando);

                $scope.DocumentoTemporal.bodegas_doc_id = data.bodegas_doc_id;
                that.seleccionarDocumentoDespacho(data.bodegas_doc_id);
                $scope.seleccion.bodegas_doc_id = data.bodegas_doc_id;

                //$('#id').select2('val',$scope.seleccion.bodegas_doc_id );
                $scope.documento_temporal_id = data.doc_tmp_id;
                $scope.usuario_id = data.usuario_id;

            };

            that.obtenerParametros = function() {
                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda !== $scope.filtro.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                /* Inicio Objeto a enviar*/
                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            numero_pedido: $scope.DocumentoTemporal.pedido.numero_pedido
                        }
                    }
                };

                return obj;
            };

            that.resultasdoListadoDocumentosUsuario = function(data) {
                if (data.obj.movimientos_bodegas !== undefined) {
                    $scope.documentos_usuarios = data.obj.movimientos_bodegas;
                }
            };


            $scope.detalle_pedido_separado_cliente = {
                data: 'DocumentoTemporal.getPedido().getProductos()',
                enableHighlighting: true,
                enableRowSelection: false,
                showFilter:true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: 150},
                    {field: 'descripcion', displayName: 'Nombre Producto', width: 650},
                    {field: 'cantidad_pendiente', displayName: 'Pendiente'},
                    {field: 'cantidad_separada', displayName: "Ingresado"},
                    {field: 'cantidad_solicitada_real', displayName: "Solicitado"},
                    //{field: 'observacion', displayName: "Observación", width: 350},
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: 40,
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onAbrirVentanaLotes(DocumentoTemporal,documento_despacho, row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in"></span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]

            };




            $scope.lista_productos_auditados_clientes = {
                data: 'productosAuditados',
                enableRowSelection: false,
                enableHighlighting: true,
                showFilter:true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: 100},
                    {field: 'descripcion', displayName: 'Nombre Producto', width: 500},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'existencia', displayName: "Existencia Producto"},
                    {field: 'lote.existencia_actual', displayName: "Existencia Lote"},
                    {field: 'lote.codigo_lote', displayName: 'Lote', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                         <span class="glyphicon glyphicon-warning-sign pull-right" style="color:red; font-size:17px;" \
                                            ng-if="!row.entity.lote.tieneExistencia">\
                                        </span>\
                                         {{row.entity.lote.codigo_lote}}   \
                                    </div>'
                    },
                    {field: 'lote.fecha_vencimiento', displayName: "Fecha Vencimiento"},
                    {field:'numeroCaja', displayName:"Caja"},
                    //{field: 'lote.item_id', displayName: 'Item'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEliminarProductoAuditado(DocumentoTemporal, row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in"></span> Eliminar\n\
                                            </button>\n\
                                        </div>'
                    }
                ]
            };

            $scope.lista_productos_no_auditados_clientes = {
                data: 'productosNoAuditados',
                showFilter:true,       
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'descripcion', displayName: 'Nombre Producto'},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote.codigo_lote', displayName: 'Lote'},
                    {field: 'lote.fecha_vencimiento', displayName: "Fecha Vencimiento"}
                ]
            };

            $scope.lista_productos_pendientes_clientes = {
                data: 'productosPendientes',
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'descripcion', displayName: 'Nombre Producto'},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote.codigo_lote', displayName: 'Lote'},
                    {field: 'lote.fecha_vencimiento', displayName: "Fecha Vencimiento"}
                ]
            };



            $scope.lista_cajas_no_cerradas_clientes = {
                data: 'cajasSinCerrar',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'tipo', displayName: "Tipo", width: 70, cellClass: "ngCellText",
                        cellTemplate: '<div ng-switch="row.entity.tipo">\
                            <div ng-switch-when="0">Caja</div>\
                            <div ng-switch-when="1">Nevera</div>\
                        </div>'
                    },
                    {field: 'numero_caja', displayName: 'Número', width: 150},
                    {field: 'cliente', displayName: 'Cliente'},
                    {field: 'direccion', displayName: 'Direccion'},
                    {field: 'movimiento', displayName: "Opciones", width: 200, cellClass: "txt-center",
                        cellTemplate: '<div ng-switch="row.entity.caja_cerrada">\
                            <button ng-switch-when="0"  class="btn btn-default btn-xs" ng-click="onCerrarCaja(row.entity, DocumentoTemporal.pedido.getTipo())"><span class="glyphicon glyphicon-ok"></span> Cerrar</button>\
                            <button ng-switch-when="1" class="btn btn-default btn-xs" ng-click="onImprimirRotulo(1,DocumentoTemporal.pedido.numero_pedido,row.entity.numero_caja, row.entity.tipo)"><span class="glyphicon glyphicon-print"></span> Imprimir</button>\
                        </div>'
                    }
                ]
            };

            //eventos de widgets
            $scope.onKeyDetalleDocumentoTemporalPress = function(ev, buscarcodigodebarras) {
                if (!$scope.esDocumentoBodegaValido($scope.DocumentoTemporal.bodegas_doc_id))
                    return;
                if (ev.which === 13) {
                    $scope.filtro.codigo_barras = buscarcodigodebarras;
                    $scope.filtro.descripcion_producto = !buscarcodigodebarras;

                    var obj = {
                        session: $scope.session,
                        data: {
                            documento_temporal: {
                                documento_temporal_id: $scope.DocumentoTemporal.documento_temporal_id,
                                usuario_id: $scope.DocumentoTemporal.separador.usuario_id,
                                filtro: $scope.filtro,
                                numero_pedido: $scope.DocumentoTemporal.getPedido().numero_pedido
                            }
                        }
                    };

                    $scope.onKeyDocumentosSeparadosPress(ev, $scope.DocumentoTemporal, obj, 1);

                }
            };


            $scope.paginaAnterior = function() {
                $scope.paginaactual--;
                $scope.buscarDetalleDocumentoTemporal($scope.filtro.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                $scope.buscarDetalleDocumentoTemporal($scope.filtro.termino_busqueda, true);
            };

            $scope.valorSeleccionado = function(manual) {
                
                that.seleccionarDocumentoDespacho($scope.seleccion.bodegas_doc_id);
                if (!manual) {
                    return;
                }
                
                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id: $scope.DocumentoTemporal.documento_temporal_id,
                            usuario_id: $scope.usuario_id,
                            bodegas_doc_id: $scope.seleccion.bodegas_doc_id,
                            numero_pedido: $scope.numero_pedido
                        }
                    }
                };

                $scope.validarDocumentoUsuario(obj, 1, function(data) {
                    if (data.status === 200) {
                        $scope.DocumentoTemporal.bodegas_doc_id = $scope.seleccion.bodegas_doc_id;
                        AlertService.mostrarMensaje("success", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });



            };

            that.seleccionarDocumentoDespacho = function(bodega_doc_id) {
                bodega_doc_id = parseInt(bodega_doc_id);
                for (var i in $scope.documentos_usuarios) {
                    var doc = $scope.documentos_usuarios[i];
                    
                    if (bodega_doc_id === doc.bodegas_doc_id) {
                        $scope.documento_despacho = doc;
                        $scope.seleccion.prefijo = doc.prefijo;
                        $scope.seleccion.descripcion  = doc.descripcion;
                        break;
                    }
                }
            };
        }]);

});
