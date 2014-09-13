//Controlador de la View pedidosclientes.html

define(["angular", "js/controllers",'../../../../includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('CotizacionesController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Cliente', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state',

        function($scope, $rootScope, Request, Empresa, Cliente, PedidoVenta, API, socket, AlertService, $state) {

            //$scope.Empresa = Empresa;
            
//            $scope.session = {
//                usuario_id: Usuario.usuario_id,
//                auth_token: Usuario.token
//            };
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            //$scope.numero_pedido = "";
            //$scope.obj = {};
            $scope.listado_cotizaciones = [];

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

            $scope.buscarCotizaciones = function(termino, paginando) {

                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }
                
                for(i=0; i<10; i++)
                {
                    //var pedido = Pedido.get();
                    
                    obj = { 
                            numero_cotizacion: '123456'+i,
                            nombre_cliente: 'Franz Kafka',
                            nombre_vendedor: 'Alexeiv Karpov'+i,
                            fecha_cotizacion: '0'+i+'-09-2014',
                            valor_cotizacion: i+'00.000',
                            estado: 'Activo'
                        }
                    
                    $scope.listado_cotizaciones.push(obj);
                        
                }
                
                console.log("LISTADO COTIZACIONES: ", $scope.listado_cotizaciones);
                

                
//                var obj = {
//                    session: $scope.session,
//                    data: {
//                        documento_temporal: {
//                            termino_busqueda: termino,
//                            pagina_actual: $scope.paginaactual,
//                            filtro: {
//                                finalizados: true
//                            }
//                        }
//                    }
//                };
//
//                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_CLIENTES, "POST", obj, function(data) {
//                    $scope.ultima_busqueda = $scope.termino_busqueda;
//                    
//                    if(data.obj.documentos_temporales != undefined) {
//                        $scope.renderPedidosSeparadosCliente(data.obj, paginando);
//                    }
//
//                });

            };

//            $scope.renderPedidosSeparadosCliente = function(data, paginando) {
//
//                $scope.items = data.documentos_temporales.length;
//                //se valida que hayan registros en una siguiente pagina
//                if(paginando && $scope.items == 0){
//                    if($scope.paginaactual > 1){
//                        $scope.paginaactual--;
//                    }
//                    AlertService.mostrarMensaje("warning","No se encontraron mas registros");
//                    return;
//                }
//
//                $scope.Empresa.vaciarDocumentoTemporal("Cliente");
//               
//                for (var i in data.documentos_temporales) {
//
//                    var obj = data.documentos_temporales[i];
//                    
//                    var documento_temporal = $scope.crearDocumentoTemporal(obj);
//
//                    $scope.Empresa.agregarDocumentoTemporal(
//                        documento_temporal, "Cliente"
//                    );
//
//
//                }
//
//            };

//            $scope.crearDocumentoTemporal = function(obj) {
//                var documento_temporal = DocumentoTemporal.get();
//                documento_temporal.setDatos(obj);
//
//                var pedido = Pedido.get(obj);
//                pedido.setDatos(obj);
//                        
//                var cliente = Cliente.get(
//                        obj.nombre_cliente,
//                        obj.direccion_cliente,
//                        obj.tipo_id_cliente,
//                        obj.identificacion_cliente,
//                        obj.telefono_cliente
//                        );
//
//                pedido.setCliente(cliente);
//                
//                documento_temporal.setPedido(pedido);
//                
//                var separador = Separador.get(obj.responsable_pedido, obj.responsable_id, 1);
//                
//                documento_temporal.setSeparador(separador);
//                
//                return documento_temporal;
//            };

            //definicion y delegados del Tabla de pedidos clientes

            $scope.lista_pedidos_clientes = {
                data: 'listado_cotizaciones',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_cotizacion', displayName: 'Numero Cotización'},
                    {field: 'nombre_cliente', displayName: 'Cliente'},
                    {field: 'nombre_vendedor', displayName: 'Vendedor'},
                    {field: 'fecha_cotizacion', displayName: 'Fecha'},
                    {field: 'valor_cotizacion', displayName: 'Valor'},
                    {field: 'estado', displayName: 'Estado'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Activar</span></button></div>'}

                ]

            };
            
            $scope.abrirViewCotizacion = function()
            {
                $state.go('CotizacionCliente');
            }
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               
               //alert("En éste momento debo limpiar algo");
               $scope.listado_cotizaciones = [];

            });
            
            //eventos de widgets
            $scope.onKeyCotizacionesPress = function(ev, termino_busqueda) {
                 //if(!$scope.buscarVerPedidosFarmacias($scope.DocumentoTemporal.bodegas_doc_id)) return;

                 if (ev.which == 13) {
                     $scope.buscarCotizaciones(termino_busqueda);
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.paginaactual--;
                 $scope.buscarCotizaciones($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.paginaactual++;
                 $scope.buscarCotizaciones($scope.termino_busqueda, true);
            };

            $scope.valorSeleccionado = function() {
//                 var obj = {
//                     session: $scope.session,
//                     data: {
//                         movimientos_bodegas: {
//                             documento_temporal_id: $scope.documento_temporal_id, 
//                             usuario_id: $scope.usuario_id,
//                             bodegas_doc_id: $scope.seleccion,
//                             numero_pedido:$scope.numero_pedido
//                         }
//                     }
//                 };
//
//                $scope.validarDocumentoUsuario(obj, 2, function(data){
//                    if(data.status === 200){
//                        $scope.DocumentoTemporal.bodegas_doc_id = $scope.seleccion;
//                        AlertService.mostrarMensaje("success", data.msj);
//                    } else {
//                        AlertService.mostrarMensaje("warning", data.msj);
//                    }
//                });

            };
            
            $scope.buscarCotizaciones("");

        }]);
});
