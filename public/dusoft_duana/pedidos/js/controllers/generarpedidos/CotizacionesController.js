//Controlador de la View pedidosclientes.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('CotizacionesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'Cliente', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state','Usuario',

        function($scope, $rootScope, Request, Empresa, Cliente, PedidoVenta, API, socket, AlertService, $state, Usuario) {

            var that = this;
            //$scope.Empresa = Empresa;
            
//            $scope.session = {
//                usuario_id: Usuario.usuario_id,
//                auth_token: Usuario.token
//            };

            $scope.rootCotizaciones = {};

            $scope.rootCotizaciones.paginas = 0;
            $scope.rootCotizaciones.items = 0;
            $scope.rootCotizaciones.termino_busqueda = "";
            $scope.rootCotizaciones.ultima_busqueda = {};
            $scope.rootCotizaciones.paginaactual = 1;
            $scope.rootCotizaciones.listado_cotizaciones = [];
            
            $scope.rootCotizaciones.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };

            //var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            /* INICIO - Operaciones nuevas */
            
            $scope.obtenerParametros = function() {

                //valida si cambio el termino de busqueda
                if ($scope.rootCotizaciones.ultima_busqueda.termino_busqueda !== $scope.rootCotizaciones.termino_busqueda)
                {
                    $scope.rootCotizaciones.paginaactual = 1;
                }

                var obj = {
                    session: $scope.rootCotizaciones.session,
                    data: {
                        cotizaciones_cliente: {
                            empresa_id: '03',                            
                            termino_busqueda: $scope.rootCotizaciones.termino_busqueda,
                            pagina_actual: $scope.rootCotizaciones.paginaactual,
                            filtro: {}
                        }
                    }
                };

                return obj;
            };

            $scope.onBuscarCotizacion = function(obj, paginando) {

                that.consultarEncabezadosCotizaciones(obj, function(data) {

                    $scope.rootCotizaciones.ultima_busqueda = {
                        termino_busqueda: $scope.rootCotizaciones.termino_busqueda,
                    }

                    that.renderCotizaciones(data.obj, paginando);

                });
            };


            that.consultarEncabezadosCotizaciones = function(obj, callback) {

                var url = API.PEDIDOS.LISTAR_COTIZACIONES;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("Consulta exitosa: ", data.msj);
                        console.log(">>>>>> DATOS CONSULTA COTIZACIONES: ",data);

                        if (callback !== undefined && callback !== "" && callback !== 0) {
                            callback(data);
                        }
                    }
                    else {
                        console.log("Error en la consulta: ", data.msj);
                    }
                });
            };

            that.renderCotizaciones = function(data, paginando) {

                $scope.rootCotizaciones.items = data.resultado_consulta.length;

                //se valida que hayan registros en una siguiente pagina
                if (paginando && $scope.rootCotizaciones.items === 0) {
                    if ($scope.rootCotizaciones.paginaactual > 1) {
                        $scope.rootCotizaciones.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning", "No se encontraron más registros");
                    return;
                }

                $scope.rootCotizaciones.Empresa.vaciarPedidos();

                if (data.resultado_consulta.length > 0)
                {
                    $scope.rootCotizaciones.Empresa.setCodigo(data.resultado_consulta[0].empresa_origen_id);
                }

                for (var i in data.resultado_consulta) {

                    var obj = data.resultado_consulta[i];

                    var cotizacion = that.crearCotizacion(obj);

                    $scope.rootCotizaciones.Empresa.agregarPedido(cotizacion);

                }

            };

            that.crearCotizacion = function(obj) {

                /*
                 var pedido = PedidoVenta.get();
                        
                var datos_pedido = {
                    numero_pedido: "",
                    fecha_registro: "",
                    descripcion_estado_actual_pedido: "",
                    estado: '1',
                    estado_separacion: ""
                };

                pedido.setDatos(datos_pedido);
                pedido.setTipo(PedidoVenta.TIPO_CLIENTE);
                //pedido.setObservacion("");
//                pedido.setTipoIdVendedor("");
//                pedido.setVendedorId("");
                
               //$scope.rootCreaCotizaciones.Empresa.setPedidoSeleccionado(pedido);
               
                return pedido;
                
                 */


                var cotizacion = PedidoVenta.get();

                var datos_cotizacion = {
                    numero_pedido: '',
                    fecha_registro: obj.fecha_registro,
                    estado: '1',
                };

                cotizacion.setDatos(datos_cotizacion);
                
                cotizacion.setTipo(PedidoVenta.TIPO_CLIENTE);

                cotizacion.setNumeroCotizacion(obj.numero_cotizacion);
                
                cotizacion.setValorCotizacion(obj.valor_cotizacion);

                cotizacion.setObservacion(obj.observaciones);
                
                var vendedor = VendedorPedido.get(
                    
                    );
                
                cotizacion.setVendedor(vendedor);

                var cliente = ClientePedido.get(
                        obj.farmacia_id,
                        obj.bodega_id,
                        obj.nombre_farmacia,
                        obj.nombre_bodega,
                        obj.centro_utilidad,
                        obj.nombre_centro_utilidad
                        );

                cotizacion.setCliente(cliente);

                return cotizacion;
            };            
            
            /* FIN - Operaciones nuevas */
            
            $scope.rootCotizaciones.lista_pedidos_clientes = {
                data: 'rootCotizaciones.listado_cotizaciones',
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
            $scope.onKeyCotizacionesPress = function(ev) {
                 //if(!$scope.buscarVerPedidosFarmacias($scope.DocumentoTemporal.bodegas_doc_id)) return;

                 if (ev.which == 13) {
                     //Aquí no se usa el parámetro "termino_busqueda" porque ésta variable se usa en el scope y se actualiza sin necesidad de pasarla como parámetro
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
            
            //$scope.buscarCotizaciones("");
            $scope.onBuscarCotizacion($scope.obtenerParametros(),"");

        }]);
});
