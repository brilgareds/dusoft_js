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

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
               $scope.$emit('cerrardetallefarmacia', {animado:true});
            };
            
            $rootScope.$on("mostrardetallefarmaciaCompleto", function(e, datos) {
                
                console.log("información Documento Temporal: ", datos[1]);
                $scope.DocumentoTemporal = datos[1];
                $scope.buscarDetalleDocumentoTemporal("");
                $scope.farmacia = $scope.DocumentoTemporal.pedido.farmacia;
                $scope.numero_pedido = $scope.DocumentoTemporal.pedido.numero_pedido;
                
                $scope.traerListadoDocumentosUsuario();
                
            });
            
            // Usar este evento si es necesario - Tras cerrar el Slide 
            $rootScope.$on("cerrardetalleclienteCompleto", function(e, datos) {
                
                //Liberar Memoria
                $scope.DocumentoTemporal
            });
            
            // Busqueda para actualización de Grid de pedidos para Auditar
            $scope.buscarDetalleDocumentoTemporal = function(termino, paginando){

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
                /* Fin Objeto */
                /* Inicio Request */
                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTO_TEMPORAL_FARMACIAS, "POST", obj, function(data) {
                    
                    if(data.status == 200) { 
                        
                        /* Esta búsqueda no funciona aún */
//                        $scope.ultima_busqueda = {
//                            termino_busqueda: $scope.termino_busqueda,
//                            seleccion: $scope.seleccion
//                        }
                        
                        if(data.obj.documento_temporal != undefined) {
                            //Se manda Info para render en grid de DetalleDocumentoTemporalFarmacia
                            $scope.renderDetalleDocumentoTemporalFarmacia(data.obj.documento_temporal[0], paginando);
                            
                            //Se llenan éstos valores que se requieren más adelande para Actualizar Tipo Documento
                            $scope.documento_temporal_id = data.obj.documento_temporal[0].doc_tmp_id;
                            $scope.usuario_id = data.obj.documento_temporal[0].usuario_id;
                        }
                    }
                });
                /* Fin Request */
                
            };
            
            //Función para renderizar Grid de DetalleDocumentoTemporalFarmacia
            $scope.renderDetalleDocumentoTemporalFarmacia = function(data, paginando) {

                $scope.items = data.lista_productos.length;
                
                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items == 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }
                
                //Vaciar el listado de Productos
                $scope.DocumentoTemporal.getPedido().vaciarProductos();

                for (var i in data.lista_productos) {

                    var obj = data.lista_productos[i];
                    
                    var producto_pedido_separado = $scope.crearProductoPedidoDocumentoTemporal(obj);
                    
                    $scope.DocumentoTemporal.getPedido().agregarProducto(producto_pedido_separado);
                    
                    console.log("DOCUMENTO TEMPORAL CON PRODUCTOS DE PEDIDO INGRESADOS",$scope.DocumentoTemporal);
                }
            };
            
            //Crea un objeto Pedido y le asigna los valores a sus propiedades por medio de obj.
            //Una de sus propiedades es un objeto LoteProductoPedido
            $scope.crearProductoPedidoDocumentoTemporal = function(obj) {

                var lote_pedido = LoteProductoPedido.get(obj.lote, obj.fecha_vencimiento);
        
                var producto_pedido_separado = ProductoPedido.get(  obj.codigo_producto, obj.descripcion_producto, "",
                                                                    "", obj.cantidad_solicitada, obj.cantidad_ingresada,
                                                                    obj.observacion_cambio);
                                                                    
                producto_pedido_separado.setLote(lote_pedido);
                
                
                console.log("Estructura del Objeto Producto", producto_pedido_separado);
                
                return producto_pedido_separado;
            };
            
            //Trae el Listado de Documentos de Usuario
            $scope.traerListadoDocumentosUsuario = function() {

                /* Inicio Objeto a enviar */
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
                /* Fin Objeto a enviar */
                
                /* Inicio Request */
                
                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTOS_USUARIOS, "POST", obj, function(data) {
                    
                    if(data.obj.movimientos_bodegas != undefined){
                        $scope.documentos_usuarios = data.obj.movimientos_bodegas;
                    }
                    
                });
                
                /* Fin Request */
            }
            
            // Valida si el Documento que se selecciona del listado de documentos
            $scope.validarDocumentoUsuario = function() {
                
                /* Inicio Objeto a enviar */
                var obj = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            documento_temporal_id: $scope.documento_temporal_id, 
                            usuario_id: $scope.usuario_id,
                            bodegas_doc_id: $scope.seleccion
                        }
                    }
                }
                /* Fin Objeto a enviar */

                /* Inicio Request */
                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL, "POST", obj, function(data) {

                    if(data.status === 200){
                        AlertService.mostrarMensaje("success", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });
                
                /* Fin Request */
            }

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
            
            $scope.valorSeleccionado = function(){
                //Llamado a la función que ejecuta la validación tras la selección en el DropDown de la view
                $scope.validarDocumentoUsuario();                
            }
        }]);

});
