define(["angular", "js/controllers",
        'models/Cliente', 'models/PedidoAuditoria', 'models/Separador',
        'models/DocumentoTemporal'], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosClientesController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Cliente', 'PedidoAuditoria',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "Usuario",
        function($scope, $rootScope, Request, Empresa, Cliente, PedidoAuditoria, Separador, DocumentoTemporal, API, socket, AlertService, Usuario) {

            $scope.Empresa = Empresa;
            $scope.pedidosSeparadosSeleccionados = [];
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            $scope.numero_pedido = "";

            var that = this;
            that.obtenerParametros = function(){
                 //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            termino_busqueda: $scope.termino_busqueda,
                            pagina_actual: $scope.paginaactual,
                            filtro: {
                                finalizados: true
                            }
                        }
                    }
                };

                return obj;
            }

            //definicion y delegados del Tabla de pedidos clientes

            $scope.lista_pedidos_separados_clientes = {
                data: 'Empresa.getDocumentoTemporal(1)',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'pedido.numero_pedido', displayName: 'Numero Pedido', cellTemplate:"<div class='ngCellText ng-scope col1 colt1'>{{row.entity.pedido.numero_pedido}}"+
                        "<span  ng-show='row.entity.esDocumentoNuevo' class='label label-danger pull-right'>Nuevo</span></div>"},
                    {field: 'pedido.cliente.nombre_tercero', displayName: 'Cliente'},
                    {field: 'pedido.nombre_vendedor', displayName: 'Vendedor'},
                    {field: 'separador.nombre_operario', displayName: 'Separador'},
                    {field: 'auditor.nombre_responsable', displayName: 'Auditor'},
                    {field: 'descripcion_estado_separacion', displayName: 'Estado Separación'},
                    {field: 'fecha_separacion_pedido', displayName: "Fecha Separación"},
                    {field: 'movimiento', displayName: "Movimiento", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Auditar</span></button></div>'}

                ]

            };

            $scope.$on("onPedidosSeparadosRenderCliente",function(e,items){
    
                $scope.items = items;
            });

            $scope.$on("onPedidosSeparadosNoEncotradosCliente",function(e){
                if ($scope.paginaactual > 1) {
                    $scope.paginaactual--;
                }
                AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
            });
            

            $scope.onRowClick = function(row) {
                row.entity.esDocumentoNuevo = false;
                $scope.notificacionclientes--;
                $scope.slideurl = "views/pedidoseparadocliente.html?time=" + new Date().getTime();
                $scope.$emit('mostrardetallecliente', row.entity);
            };



            //eventos de widgets
            $scope.onKeySeparadosPress = function(ev, termino_busqueda) {
                if (ev.which == 13) {
                    $scope.buscarPedidosSeparados( that.obtenerParametros(),
                                                   1,
                                                  false ,
                                                  $scope.renderPedidosSeparados );
                }
            };

            $scope.paginaAnterior = function() {
                $scope.paginaactual--;
                $scope.buscarPedidosSeparados(that.obtenerParametros(), 1, true, $scope.renderPedidosSeparados);
            };

            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                $scope.buscarPedidosSeparados(that.obtenerParametros(),1, true, $scope.renderPedidosSeparados);
            };

            //fin de eventos

            //se realiza el llamado a api para pedidos
            $scope.buscarPedidosSeparados(that.obtenerParametros(),1, false, $scope.renderPedidosSeparados);



             $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
                $scope.pedidosSeparadosSeleccionados = [];
                $scope.$$watchers = null;
            });


        }]);
});
