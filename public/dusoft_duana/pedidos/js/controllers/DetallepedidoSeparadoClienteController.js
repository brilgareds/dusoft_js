define(["angular", "js/controllers", 'controllers/asignacioncontroller','models/Cliente', 'models/Pedido', 'models/Separador', 'models/DocumentoTemporal', 'models/DetalleDocumentoTemporal'], function(angular, controllers) {

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

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
               $scope.$emit('cerrarslide');
            };
            
            $rootScope.$on("mostrarslide", function(e, documento_temporal) {
                
                $scope.DocumentoTemporal = documento_temporal;
                $scope.buscarDetalleDocumentoTemporal("");
                
            });
            
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
                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.CONSULTAR_DOCUMENTO_TEMPORAL_CLIENTES, "POST", obj, function(data) {
                    
                    console.log("Info Documento desde Server: ", data);
                    
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
                
                console.log("Lista de Productos: ", data.documento_temporal[0].lista_productos);

                for (var i in data.documento_temporal[0].lista_productos) {

                    var obj = data.documento_temporal[0].lista_productos[i];
                    
                    var detalle_documento_temporal = $scope.crearDetalleDocumentoTemporal(obj);

                    $scope.DocumentoTemporal.agregarDetalleDocumentoTemporal(detalle_documento_temporal);
                    console.log("Detalle Documento Temporal Previo Grilla: ============ ",$scope.DocumentoTemporal.getDetalleDocumentoTemporal());
                    
                    
                }
            };
            
            $scope.crearDetalleDocumentoTemporal = function(obj) {
                
                //console.log("Objeto para Insertar en Detalle", obj);
                
                var detalle_documento_temporal = DetalleDocumentoTemporal.get();
                detalle_documento_temporal.setDatos(obj);
                
                console.log("Objeto Detalle Documento Temporal", detalle_documento_temporal);

                return detalle_documento_temporal;
            };
            
            $scope.detalle_pedido_separado_cliente = {
                data: 'DocumentoTemporal.getDetalleDocumentoTemporal()',
                //data: 'detalle_pedido_separado',
                //data: 'DocumentoTemporal.detalle_documento_temporal',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [                
                    {field: 'codigo_producto', displayName: 'Código Producto'},
                    {field: 'nombre_producto', displayName: 'Nombre Producto'},
                    {field: 'existencia_lotes', displayName: 'Existencia Lotes'},
                    {field: 'cantidad_pedida', displayName: 'Cantidad Pedida'},
                    {field: 'cantidad_separada', displayName: "Cantidad Separada"},
                    {field: 'lote', displayName: 'Lote'},
                    {field: 'fecha_vencimiento', displayName: "Fecha Vencimiento"},
                    {field: 'observacion', displayName: "Observación"}
                ]

            };
            
            //console.log("GRILLA: ",$scope.detalle_pedido_separado_cliente);
            
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


        }]);

});
