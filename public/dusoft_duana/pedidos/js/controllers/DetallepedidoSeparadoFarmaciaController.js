define(["angular", "js/controllers",'models/Farmacia',
        'models/Pedido', 'models/Separador', 'models/DocumentoTemporal',
        'models/ProductoPedido', 'models/LoteProductoPedido'], function(angular, controllers) {

    var fo = controllers.controller('DetallepedidoSeparadoFarmaciaController', [
        '$scope', '$rootScope', 'Request', 
        '$modal', 'Empresa','Farmacia',
         'Pedido', 'API',"socket", "$timeout", 
         "AlertService","Usuario", "localStorageService",
         "ProductoPedido", "LoteProductoPedido",

        function(   $scope, $rootScope, Request,
                    $modal, Empresa, Cliente,
                    Pedido, API, socket,
                    $timeout, AlertService, Usuario,
                    localStorageService, ProductoPedido, LoteProductoPedido) {
                        
            $scope.detalle_pedido_separado = [];
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            $scope.DocumentoTemporal = {};
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = {};
            $scope.paginaactual = 1;
            $scope.detalle_pedido_separado_farmacia = {};
            $scope.documentos_usuarios = [];
            $scope.documento_temporal_id = "";
            $scope.usuario_id = "";
            $scope.seleccion = ""; 
            $scope.cajas = [];
            $scope.seleccion_caja = "";
            $scope.numero_pedido = "";

            
            $scope.cerrar = function(){
               $scope.$emit('cerrardetallefarmacia', {animado:true});
            };
            
            $rootScope.$on("mostrardetallefarmaciaCompleto", function(e, datos) {
                
                console.log("información Documento Temporal: ", datos[1]);
                $scope.DocumentoTemporal = datos[1];
                 $scope.buscarDetalleDocumentoTemporal($scope.obtenerParametros(), false, 2,$scope.resultadoBusquedaDocumento);
                $scope.farmacia = $scope.DocumentoTemporal.pedido.farmacia;
                $scope.numero_pedido = $scope.DocumentoTemporal.pedido.numero_pedido;
                

                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            centro_utilidad_id: '1',
                            bodega_id: '03',
                            tipo_documento: 'E008'
                        }
                    }
                }


                $scope.traerListadoDocumentosUsuario(obj, $scope.resultasdoListadoDocumentosUsuario);
                
            });
            
            // Usar este evento si es necesario - Tras cerrar el Slide 
            $rootScope.$on("cerrardetalleclienteCompleto", function(e, datos) {
                
                //Liberar Memoria
                $scope.DocumentoTemporal
            });

            $scope.obtenerParametros = function(){
                                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }
                
                /* Inicio Objeto */
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

            $scope.resultasdoListadoDocumentosUsuario = function(data){
                if(data.obj.movimientos_bodegas != undefined){
                    $scope.documentos_usuarios = data.obj.movimientos_bodegas;
                }
            };
            
            $scope.resultadoBusquedaDocumento = function(data, paginando){
                    data = $scope.usuario_id = data.obj.documento_temporal[0];
                    $scope.items = data.lista_productos.length;
                    
                    //se valida que hayan registros en una siguiente pagina
                    if (paginando && $scope.items == 0) {
                        if ($scope.paginaactual > 1) {
                            $scope.paginaactual--;
                        }
                        AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                        return;
                    }
                

                   $scope.renderDetalleDocumentoTemporal
                   ($scope.DocumentoTemporal, data, paginando);
                            
                   $scope.documento_temporal_id = data.doc_tmp_id;
                   $scope.usuario_id = data.usuario_id;
            };

            $scope.detalle_pedido_separado_farmacia = {
                data: 'DocumentoTemporal.getPedido().getProductos()',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'descripcion', displayName: 'Nombre Producto'},
                    {field: 'existencia_lotes', displayName: 'Existencia Lotes'},
                    {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada'},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote.codigo_lote', displayName: 'Lote'},
                    {field: 'lote.fecha_vencimiento', displayName: "Fecha Vencimiento"},
                    {field: 'observacion', displayName: "Observación"},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                            <button class="btn btn-default btn-xs" ng-click="onRowClick(row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in">Editar</span>\n\
                                            </button>\n\
                                            <button class="btn btn-default btn-xs" ng-click="onRowClick(row)">\n\
                                                <span class="glyphicon glyphicon-zoom-in">Eliminar</span>\n\
                                            </button>\n\
                                        </div>'
                    }
                ]

            };
            
           //eventos de widgets
           $scope.onKeyDetalleDocumentoTemporalPress = function(ev, termino_busqueda) {
                if (ev.which == 13) {
                    $scope.buscarDetalleDocumentoTemporal(termino_busqueda);
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
            
            $scope.valorSeleccionado = function() {
                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            documento_temporal_id: $scope.documento_temporal_id, 
                            usuario_id: $scope.usuario_id,
                            bodegas_doc_id: $scope.seleccion
                        }
                    }
                };

                $scope.validarDocumentoUsuario(obj, 2, function(data){
                    if(data.status === 200){
                        AlertService.mostrarMensaje("success", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });

            };
        }]);

});
