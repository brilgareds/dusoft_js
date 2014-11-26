define(["angular", "js/controllers",'models/ClientePedido',
        'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido'], function(angular, controllers) {

    var fo = controllers.controller('DetallepedidoSeparadoClienteController', [
        '$scope', '$rootScope', 'Request', 
        '$modal', 'EmpresaPedido','Cliente',
         'API',"socket", "$timeout", 
         "AlertService","Usuario", "localStorageService",
         "ProductoPedido", "LoteProductoPedido", "DocumentoTemporal",
   
        function(   $scope, $rootScope, Request,
                    $modal, Empresa, Cliente,
                    API, socket,
                    $timeout, AlertService, Usuario,
                    localStorageService, ProductoPedido, LoteProductoPedido, DocumentoTemporal) {
            
            $scope.detalle_pedido_separado = [];

            $scope.DocumentoTemporal = DocumentoTemporal.get();
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = {};
            $scope.paginaactual = 1;
            $scope.documentos_usuarios = [];
            $scope.documento_temporal_id = "";
            $scope.usuario_id = "";
            $scope.seleccion = {};
            $scope.seleccion2 = 154;
            $scope.cajas = [];
            $scope.seleccion_caja = "";
            $scope.numero_pedido = "";
            var that = this;
            
            $scope.cerrar = function(){
               $scope.$emit('cerrardetallecliente', {animado:true});
               $scope.$emit('onDetalleCerrado');
              // $scope.DocumentoTemporal  = {};
            };
            
            $rootScope.$on("mostrardetalleclienteCompleto", function(e, datos) {
                
                
                $scope.DocumentoTemporal = datos[1];
                console.log("información Documento Temporal: ", $scope.DocumentoTemporal);
                $scope.buscarDetalleDocumentoTemporal(that.obtenerParametros(), false, 1, that.resultadoBusquedaDocumento);
                $scope.cliente = $scope.DocumentoTemporal.pedido.cliente;
                $scope.numero_pedido = $scope.DocumentoTemporal.pedido.numero_pedido;
                $scope.filtro.codigo_barras = true;
                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: '1',
                            bodega_id: '03',
                            tipo_documento: 'E008'
                        }
                    }
                };


                $scope.traerListadoDocumentosUsuario(obj, that.resultasdoListadoDocumentosUsuario);

                var params ={
                    session:$scope.session,
                    data : {
                        documento_temporal:{
                            documento_temporal_id:$scope.DocumentoTemporal.documento_temporal_id,
                            usuario_id:$scope.DocumentoTemporal.separador.usuario_id
                        }
                    }
                };
                
                $scope.traerProductosAuditatos(params);
                
            });


            $rootScope.$on("cerrardetalleclienteCompleto",function(e){
                 $scope.$$watchers = null;
                if($scope.DocumentoTemporal === undefined) return;
                $scope.DocumentoTemporal.getPedido().vaciarProductos();
                 console.log("cerrardetalleclienteCompleto ________________________");
                console.log($scope.DocumentoTemporal);
               
               // $scope.DocumentoTemporal.getPedido().vaciarProductos();
                //$scope.detalle_pedido_separado_cliente.data = [];
               
            });

            

            that.resultadoBusquedaDocumento = function(data, paginando){
                    data  = data.obj.documento_temporal[0];
                    $scope.seleccion = {};
                    $scope.items = data.lista_productos.length;
                    
                   //console.log("resultadoBusquedaDocumento ========================== ", $scope.DocumentoTemporal)
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
                   $scope.seleccion.bodegas_doc_id = $scope.DocumentoTemporal.bodegas_doc_id;

                   //$('#id').select2('val',$scope.seleccion.bodegas_doc_id );
                   $scope.documento_temporal_id = data.doc_tmp_id;
                   $scope.usuario_id = data.usuario_id;

            };
            
            that.obtenerParametros = function(){
                                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }
                
                /* Inicio Objeto a enviar*/
                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal: {
                            numero_pedido: $scope.DocumentoTemporal.pedido.numero_pedido
                        }
                    }
                };

                return obj;
            };

            that.resultasdoListadoDocumentosUsuario = function(data){
                console.log("resultadod listado ******************", data);
                if(data.obj.movimientos_bodegas !== undefined){
                    $scope.documentos_usuarios = data.obj.movimientos_bodegas;
                }
            };

 
            $scope.detalle_pedido_separado_cliente = {
                data: 'DocumentoTemporal.getPedido().getProductos()',
                enableHighlighting: true,
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código' , width:100},
                    {field: 'descripcion', displayName: 'Nombre Producto', width:500},
                    {field: 'existencia_lotes', displayName: 'Existencia'},
                    {field: 'cantidad_solicitada', displayName: 'Solicitado' },
                    {field: 'cantidad_separada', displayName: "Separado"},
                    {field: 'observacion', displayName: "Observación", width:150},
                    {field: 'opciones', displayName: "", cellClass: "txt-center" , width:40,
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEditarRow(DocumentoTemporal, row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in"></span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]

            };




            $scope.lista_productos_auditados_clientes = {
                data:'productosAuditados',
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código' , width:100},
                    {field: 'descripcion', displayName: 'Nombre Producto', width:500},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote.codigo_lote', displayName: 'Lote'},
                    {field: 'lote.fecha_vencimiento', displayName: "Fecha Vencimiento"},
                    {field: 'lote.item_id', displayName:'Item'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onEliminarProductoAuditado(DocumentoTemporal, row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in">Eliminar</span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]
            };

             $scope.lista_productos_no_auditados_clientes = {
                data:'productosNoAuditados',
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'descripcion', displayName: 'Nombre Producto'},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote.codigo_lote', displayName: 'Lote'},
                    {field: 'lote.fecha_vencimiento', displayName: "Fecha Vencimiento"}
                ]
            };

            $scope.lista_productos_pendientes_clientes = {
                data:'productosPendientes',
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'descripcion', displayName: 'Nombre Producto'},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote.codigo_lote', displayName: 'Lote'},
                    {field: 'lote.fecha_vencimiento', displayName: "Fecha Vencimiento"}
                ]
            };
            
           //eventos de widgets
           $scope.onKeyDetalleDocumentoTemporalPress = function(ev, termino_busqueda, buscarcodigodebarras) {
                if(!$scope.esDocumentoBodegaValido($scope.DocumentoTemporal.bodegas_doc_id)) return;
                    if (ev.which === 13) {  
                        console.log("search with code "+buscarcodigodebarras);
                        $scope.filtro.termino_busqueda  =  termino_busqueda;
                        $scope.filtro.codigo_barras = buscarcodigodebarras;
                        $scope.filtro.descripcion_producto = !buscarcodigodebarras;

                        var obj = {
                            session: $scope.session,
                            data: {
                                documento_temporal: {
                                    documento_temporal_id : $scope.DocumentoTemporal.documento_temporal_id,
                                    usuario_id: $scope.DocumentoTemporal.separador.usuario_id,
                                    filtro:$scope.filtro,
                                    numero_pedido:$scope.DocumentoTemporal.getPedido().numero_pedido
                                }
                            }
                        };

                    $scope.onKeyDocumentosSeparadosPress(ev, termino_busqueda, $scope.DocumentoTemporal, obj, 1);
                     
                }
            };


            $scope.paginaAnterior = function() {
                $scope.paginaactual--;
                $scope.buscarDetalleDocumentoTemporal($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                $scope.buscarDetalleDocumentoTemporal($scope.termino_busqueda, true);
            };
            
            $scope.valorSeleccionado= function(manual) {
                console.log("valor seleccionado  manual ", manual , " seleccion ",$scope.seleccion);
                if(!manual){
                    return;
                }
                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            documento_temporal_id: $scope.DocumentoTemporal.documento_temporal_id, 
                            usuario_id: $scope.usuario_id,
                            bodegas_doc_id: $scope.seleccion.bodegas_doc_id,
                            numero_pedido:$scope.numero_pedido
                        }
                    }
                };

                $scope.validarDocumentoUsuario(obj, 1, function(data){
                    if(data.status === 200){
                        $scope.DocumentoTemporal.bodegas_doc_id = $scope.seleccion.bodegas_doc_id;
                        AlertService.mostrarMensaje("success", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });

            };
        }]);

});
