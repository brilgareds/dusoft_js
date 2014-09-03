define(["angular", "js/controllers", 
        'models/Farmacia', 'models/Pedido', 'models/Separador',
        'models/DocumentoTemporal'], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request', 
        'Empresa', 'Farmacia', 'Pedido',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "Usuario", 
        function($scope, $rootScope, Request, Empresa, Farmacia, Pedido, Separador, DocumentoTemporal, API, socket, AlertService,Usuario) {

            $scope.Empresa = Empresa;
            $scope.pedidosSeparadosSeleccionados = [];
            $scope.empresas = [];
            $scope.seleccion = "FD";
            $scope.session = {
               usuario_id:Usuario.usuario_id,
               auth_token:Usuario.token
            };
            
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda  = {};
            $scope.paginaactual = 1;
            $scope.numero_pedido = "";


             $scope.obtenerParametros = function(){
                $scope.ultima_busqueda.seleccion;
                $scope.ultima_busqueda.termino_busqueda;

                //valida si cambio el termino de busqueda
                if($scope.ultima_busqueda.termino_busqueda != $scope.termino_busqueda
                        || $scope.ultima_busqueda.seleccion != $scope.seleccion){
                    $scope.paginaactual = 1;
                }

                var obj = {
                    session:$scope.session,
                    data:{
                        documento_temporal:{
                            termino_busqueda: $scope.termino_busqueda,
                            empresa_id: $scope.seleccion,
                            pagina_actual: $scope.paginaactual,
                            filtro: {
                                finalizados: true
                            }
                        }
                    }
                };


                return obj;
            }

            $scope.$on("onPedidosSeparadosRenderFarmacia",function(e,items){
                $scope.ultima_busqueda = {
                    termino_busqueda: $scope.termino_busqueda,
                    seleccion: $scope.seleccion
                }
                $scope.items = items;
            });

            
            $scope.$on("onPedidosSeparadosNoEncotradosFarmacia",function(e){
                if ($scope.paginaactual > 1) {
                    $scope.paginaactual--;
                }
                AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
            });
            


            $scope.listarEmpresas = function() {

                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.empresas = data.obj.empresas;
                        //console.log(JSON.stringify($scope.empresas))
                    }
                });
            };
            

            //definicion y delegados del Tabla de pedidos clientes

            $scope.lista_pedidos_separados_farmacias = {
                data: 'Empresa.getDocumentoTemporal(2)',
                enableColumnResize: true,
                enableRowSelection:false,
                columnDefs: [
                    {field: 'pedido.numero_pedido', displayName: 'Numero Pedido'},
                    {field: 'pedido.nombre_vendedor', displayName: 'Farmacia'},
                    {field: 'pedido.farmacia.nombre_bodega', displayName: 'Bodega'},
                    {field: 'zona_pedido', displayName: 'Zona'},
//                    {field: 'descripcion_estado_actual_separado', displayName: "Estado"},
                    {field: 'separador.nombre_operario', displayName: 'Separador'},
                    {field: 'auditor.nombre_operario', displayName: 'Auditor'},
                    {field: 'descripcion_estado_separacion', displayName: 'Estado Separación'},
                    {field: 'fecha_separacion_pedido', displayName: "Fecha Separación"},
                    {field: 'movimiento', displayName: "Movimiento", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Auditar</span></button></div>'}
                ]

            };

            $scope.onRowClick = function(row){
                 $scope.slideurl = "views/pedidoseparadofarmacia.html?time="+new Date().getTime();
                 $scope.$emit('mostrardetallefarmacia',row.entity);
                 //console.log("Presionado Botón Auditar Farmacia: ", row.entity);
            };
            
            $scope.valorSeleccionado = function(valor) {
                $scope.termino_busqueda = "";
                $scope.buscarPedidosSeparados($scope.obtenerParametros(),2, false, $scope.renderPedidosSeparados);
            };

            //eventos de widgets
            $scope.onKeySeparadosPress = function(ev, termino_busqueda) {
                
                if (ev.which == 13) {
                    $scope.buscarPedidosSeparados($scope.obtenerParametros(), 2, false, $scope.renderPedidosSeparados);
                }
            };

            $scope.paginaAnterior = function(){

                $scope.paginaactual--;
                $scope.buscarPedidosSeparados($scope.obtenerParametros(), 2,true,$scope.renderPedidosSeparados);
            };

            $scope.paginaSiguiente = function(){
                $scope.paginaactual++;
                $scope.buscarPedidosSeparados($scope.obtenerParametros(), 2,true, $scope.renderPedidosSeparados);
            };

            //fin de eventos

            //se realiza el llamado a api para pedidos
           $scope.buscarPedidosSeparados($scope.obtenerParametros(),2, false, $scope.renderPedidosSeparados);
           $scope.listarEmpresas("");

        }]);
});
