define(["angular", "js/controllers", 
    'models/auditoriapedidos/Farmacia',
    'models/auditoriapedidos/Separador', 
    'models/auditoriapedidos/DocumentoTemporal',
    'models/auditoriapedidos/ProductoPedido', 
    'models/auditoriapedidos/LoteProductoPedido'], function(angular, controllers) {

    var fo = controllers.controller('DetallepedidoSeparadoFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'EmpresaPedido', 'Farmacia',
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
            $scope.cajas = [];
            $scope.seleccion_caja = "";
            $scope.numero_pedido = "";
            var that = this;


            $scope.cerrar = function() {
                $scope.$emit('cerrardetallefarmacia', {animado: true});
                $scope.$emit('onDetalleCerrado');
            };

            $rootScope.$on("mostrardetallefarmaciaCompleto", function(e, datos) {

                //console.log("información Documento Temporal: ", datos[1]);
                $scope.DocumentoTemporal = datos[1];
                $scope.buscarDetalleDocumentoTemporal($scope.obtenerParametros(), false, 2, $scope.resultadoBusquedaDocumento);
                $scope.farmacia = $scope.DocumentoTemporal.pedido.farmacia;
                $scope.numero_pedido = $scope.DocumentoTemporal.pedido.numero_pedido;
                $scope.filtro.codigo_barras = true;

                //TEMPORALEMNTE HARDCODED HASTA QUE SE REALIZE LA FUNCIONALIDAD DE PERSMISOS
                
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


                $scope.traerListadoDocumentosUsuario(obj, $scope.resultasdoListadoDocumentosUsuario);

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

            $rootScope.$on("cerrardetallefarmaciaCompleto", function(e) {
                $scope.filtro.termino_busqueda = "";

                if ($scope.DocumentoTemporal.getPedido() !== undefined) {

                    $scope.DocumentoTemporal.getPedido().vaciarProductos();
                }
                $scope.$$watchers = null;

            });

            $scope.obtenerParametros = function() {
                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda !== $scope.filtro.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                /* Inicio Objeto */
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

            $scope.resultasdoListadoDocumentosUsuario = function(data) {
                if (data.obj.movimientos_bodegas !== undefined) {
                    //$scope.DocumentoTemporal.bodegas_doc_id
                    $scope.documentos_usuarios = data.obj.movimientos_bodegas;
                }
            };

            $scope.resultadoBusquedaDocumento = function(data, paginando) {

                data = data.obj.documento_temporal[0];
                //console.log("documento temporal ========", data);
                $scope.items = data.lista_productos.length;

                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items === 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }

                $scope.DocumentoTemporal.bodegas_doc_id = data.bodegas_doc_id;
                that.seleccionarDocumentoDespacho(data.bodegas_doc_id);
                $scope.seleccion.bodegas_doc_id = data.bodegas_doc_id;
                //$scope.renderDetalleDocumentoTemporal($scope.DocumentoTemporal, data, paginando);

                $scope.documento_temporal_id = data.doc_tmp_id;
                $scope.usuario_id = data.usuario_id;
            };


            $scope.detalle_pedido_separado_farmacia = {
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
                    //{field: 'cantidad_solicitada', displayName: "Solicitado"},
                    //{field: 'justificacion_separador', displayName: "Justificación", width: 350},
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: 40,
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onAbrirVentanaLotes(DocumentoTemporal,documento_despacho, row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in"></span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]

            };


            $scope.lista_productos_auditados_farmacias = {
                data: 'productosAuditados',
                enableHighlighting: true,
                enableRowSelection: false,
                showFilter:true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: 100},
                    {field: 'descripcion', displayName: 'Nombre Producto', width: 500},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote.codigo_lote', displayName: 'Lote'},
                    {field: 'lote.fecha_vencimiento', displayName: "Fecha Vencimiento"},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEliminarProductoAuditado(DocumentoTemporal, row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in"></span> Eliminar\n\
                                            </button>\n\
                                        </div>'
                    }
                ]
            };

            $scope.lista_cajas_no_cerradas_farmacias = {
                data: 'cajasSinCerrar',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'tipo', displayName: "Tipo", width: 200, cellClass: "txt-center",
                        cellTemplate: '<div ng-switch="row.entity.tipo">\
                            <div ng-switch-when="0">Caja</div>\
                            <div ng-switch-when="1">Nevera</div>\
                        </div>'
                    },
                    {field: 'numero_caja', displayName: 'Número de caja', width: 150},
                    {field: 'cliente', displayName: 'Cliente'},
                    {field: 'direccion', displayName: 'Direccion'},
                    {field: 'movimiento', displayName: "Opciones", width: 200, cellClass: "txt-center",
                        cellTemplate: '<div ng-switch="row.entity.caja_cerrada">\
                            <button ng-switch-when="0"  class="btn btn-default btn-xs" ng-click="onCerrarCaja(row.entity)"><span class="glyphicon glyphicon-ok"></span> Cerrar</button>\
                            <button ng-switch-when="1" class="btn btn-default btn-xs" ng-click="onImprimirRotulo(2,DocumentoTemporal.pedido.numero_pedido,row.entity.numero_caja, row.entity.tipo)"><span class="glyphicon glyphicon-print"></span> Imprimir</button>\
                        </div>'
                    }

                ]

            };

            //eventos de widgets

            $scope.paginaAnterior = function() {
                $scope.paginaactual--;
                $scope.buscarDetalleDocumentoTemporal($scope.filtro.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                $scope.buscarDetalleDocumentoTemporal($scope.filtro.termino_busqueda, true);
            };

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

                    $scope.onKeyDocumentosSeparadosPress(ev, $scope.DocumentoTemporal, obj, 2);

                }
            };

            $rootScope.$on("productoAuditado", function(e, producto) {
                if ($scope.DocumentoTemporal.pedido === undefined) {
                    return;
                }
                $scope.DocumentoTemporal.getPedido().vaciarProductos();

            });

            $scope.valorSeleccionado = function() {

                that.seleccionarDocumentoDespacho($scope.seleccion.bodegas_doc_id);
                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id: $scope.DocumentoTemporal.documento_temporal_id,
                            usuario_id: $scope.usuario_id,
                            bodegas_doc_id: $scope.seleccion.bodegas_doc_id,
                            numero_pedido: $scope.numero_pedido,
                            auditor: $scope.DocumentoTemporal.auditor.usuario_id
                        }
                    }
                };
               
                $scope.validarDocumentoUsuario(obj, 2, function(data) {
                    if (data.status === 200) {
                        $scope.DocumentoTemporal.bodegas_doc_id = $scope.seleccion.bodegas_doc_id;
                        $scope.DocumentoTemporal.auditor.usuario_id = $scope.session.usuario_id;
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
                        console.log("documento seleccionado ", doc);
                        break;
                    }
                }
            };
        }]);

});
