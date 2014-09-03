define(["angular", "js/controllers",'../../../../includes/slide/slideContent',
        'models/Cliente', 'models/Pedido', 'models/Separador',
        'models/DocumentoTemporal', "controllers/AuditoriaPedidosClientesController","controllers/AuditoriaPedidosFarmaciasController"], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Cliente', 'Farmacia', 'Pedido',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService",
        function($scope, $rootScope, Request, Empresa, Cliente, Farmacia, Pedido, Separador, DocumentoTemporal, API, socket, AlertService) {
            $scope.Empresa = Empresa;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";

            $scope.buscarPedidosSeparados = function(obj, tipo, paginando, callback) {
                var url = API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_CLIENTES;

                if(tipo == 2){
                    url = API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_FARMACIAS;
                }

                Request.realizarRequest(url, "POST", obj, function(data) {
                    $scope.ultima_busqueda = $scope.termino_busqueda;
                    
                    if(data.obj.documentos_temporales != undefined) {
                        callback(data.obj, paginando, tipo);
                    }

                });

            };


            $scope.crearDocumentoTemporal = function(obj, tipo) {
                var documento_temporal = DocumentoTemporal.get();
                documento_temporal.setDatos(obj);

                var pedido = Pedido.get(obj);
                pedido.setDatos(obj);
                
                if(tipo == 1){
                    var cliente = Cliente.get(
                        obj.nombre_cliente,
                        obj.direccion_cliente,
                        obj.tipo_id_cliente,
                        obj.identificacion_cliente,
                        obj.telefono_cliente
                    );

                    pedido.setCliente(cliente);
                } else {
                    var farmacia = Farmacia.get(
                        obj.farmacia_id,
                        obj.bodega_id,
                        obj.nombre_farmacia,
                        obj.nombre_bodega
                    );
                
                    pedido.setFarmacia(farmacia);
                }
                
                
                documento_temporal.setPedido(pedido);
                
                var separador = Separador.get(obj.responsable_pedido, obj.responsable_id, 1);
                
                documento_temporal.setSeparador(separador);
                
                return documento_temporal;
            };



            $scope.renderPedidosSeparados = function(data, paginando, tipo) {
                
                var items = data.documentos_temporales.length;
                var evento = (tipo == 1)?"Cliente":"Farmacia";
                
                $scope.$broadcast("onPedidosSeparadosRender"+evento, items);

                //se valida que hayan registros en una siguiente pagina
                if (paginando && items == 0) {
                    $scope.$broadcast("onPedidosSeparadosNoEncotrados"+evento, items);
                    return;
                }
                
                $scope.Empresa.vaciarDocumentoTemporal(tipo);

                for (var i in data.documentos_temporales) {

                    var obj = data.documentos_temporales[i];
                    
                    var documento_temporal = $scope.crearDocumentoTemporal(obj,tipo);

                    $scope.Empresa.agregarDocumentoTemporal(documento_temporal, tipo);
                }
            };


        }]);
});
