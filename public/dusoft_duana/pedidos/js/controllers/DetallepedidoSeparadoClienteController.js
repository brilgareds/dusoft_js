define(["angular", "js/controllers",'models/Cliente', 'models/Pedido', 'models/Separador', 'models/DocumentoTemporal', 'models/DetalleDocumentoTemporal'], function(angular, controllers) {

    var fo = controllers.controller('DetallepedidoSeparadoClienteController', [
        '$scope', '$rootScope', 'Request', 
        '$modal', 'Empresa','Cliente',
         'Pedido', 'API',"socket", "$timeout", 
         "AlertService","Usuario", "localStorageService",
         "DetalleDocumentoTemporal",

        function($scope, $rootScope, Request, $modal, Empresa, Cliente, Pedido, API, socket, $timeout, AlertService,Usuario,localStorageService, DetalleDocumentoTemporal) {
            
            $scope.detalle_pedido_separado = [];
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = {};
            $scope.paginaactual = 1;
            
            $scope.detalle_pedido_separado_cliente = {};
            
            $scope.documentos_usuarios = [];

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
               $scope.$emit('cerrardetallecliente', {animado:true});
            };
            
            $rootScope.$on("mostrardetallecliente", function(e, documento_temporal) {
                
                $scope.DocumentoTemporal = documento_temporal;
                $scope.buscarDetalleDocumentoTemporal("");
                $scope.cliente = $scope.DocumentoTemporal.pedido.cliente;
                
                $scope.traerListadoDocumentosUsuario();
                
            });
            
            $scope.buscarDetalleDocumentoTemporal = function(termino, paginando){

                
                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
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
                /* Fin Objeto a enviar*/
                /* Inicio Request */
                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTO_TEMPORAL_CLIENTES, "POST", obj, function(data) {
                    
                    if(data.status == 200) { 
                        $scope.ultima_busqueda = {
                            termino_busqueda: $scope.termino_busqueda,
                            seleccion: $scope.seleccion
                        }
                        
                        if(data.obj.documento_temporal != undefined) {
                            $scope.renderDetalleDocumentoTemporalCliente(data.obj, paginando);
                        }
                    }
                    
                });
                /* Fin Request */
                
            };
            
            $scope.traerListadoDocumentosUsuario = function() {
                
                if($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }
                
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
                    
                    console.log("DOCUMENTOS USUARIO: ", data);
                    
                    $scope.documentos_usuarios = data.obj.movimientos_bodegas;

                    
                });
                
                /* Fin Request */
            }
            
            $scope.renderDetalleDocumentoTemporalCliente = function(data, paginando) {

                $scope.items = data.documento_temporal.length;
                
                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.items == 0) {
                    if ($scope.paginaactual > 1) {
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                    return;
                }
                
                //$scope.DocumentoTemporal = data.documento_temporal;
                $scope.DocumentoTemporal.vaciarDetalleDocumentoTemporal();

                for (var i in data.documento_temporal[0].lista_productos) {

                    var obj = data.documento_temporal[0].lista_productos[i];
                    
                    var detalle_documento_temporal = $scope.crearDetalleDocumentoTemporal(obj);

                    $scope.DocumentoTemporal.agregarDetalleDocumentoTemporal(detalle_documento_temporal);
                    
                }
            };
            
            $scope.crearDetalleDocumentoTemporal = function(obj) {
                
                var detalle_documento_temporal = DetalleDocumentoTemporal.get();
                detalle_documento_temporal.setDatos(obj);

                return detalle_documento_temporal;
            };
            
            $scope.detalle_pedido_separado_cliente = {
                data: 'DocumentoTemporal.getDetalleDocumentoTemporal()',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'nombre_producto', displayName: 'Nombre Producto'},
                    {field: 'existencia_lotes', displayName: 'Existencia Lotes'},
                    {field: 'cantidad_pedida', displayName: 'Cantidad Solicitada'},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote', displayName: 'Lote'},
                    {field: 'fecha_vencimiento', displayName: "Fecha Vencimiento"},
                    {field: 'observacion', displayName: "Observación"}
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
            
            $scope.valorSeleccionado = function(valor) {

                //$scope.buscarPedidosFarmacias("");
                /* Poner aquí el código relacionado con el evento correspondiente a la opción seleccionada*/
            };

        }]);

});
