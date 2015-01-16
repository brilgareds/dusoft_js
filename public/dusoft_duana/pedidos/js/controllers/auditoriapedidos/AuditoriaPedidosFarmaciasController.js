define(["angular", "js/controllers", 
        'models/Farmacia', 'models/PedidoAuditoria', 'models/Separador',
        'models/DocumentoTemporal'], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request', 
        'EmpresaPedido', 'Farmacia', 'PedidoAuditoria',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "Usuario", 
        function($scope, $rootScope, Request, Empresa, Farmacia, PedidoAuditoria, Separador, DocumentoTemporal, API, socket, AlertService,Usuario) {

            $scope.Empresa = Empresa;
            $scope.pedidosSeparadosSeleccionados = [];
            $scope.empresas = [];
            $scope.seleccion = "FD";
            
            
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda  = {};
            $scope.paginaactual = 1;
            $scope.numero_pedido = "";
            var that = this;


             that.obtenerParametros = function(){
                $scope.ultima_busqueda.seleccion;
                $scope.ultima_busqueda.termino_busqueda;

                //valida si cambio el termino de busqueda
                if($scope.ultima_busqueda.termino_busqueda !== $scope.termino_busqueda
                        || $scope.ultima_busqueda.seleccion !== $scope.seleccion){
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
            };

            $scope.$on("onPedidosSeparadosRenderFarmacia",function(e,items){
                $scope.ultima_busqueda = {
                    termino_busqueda: $scope.termino_busqueda,
                    seleccion: $scope.seleccion
                };
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
                    
                    if (data.status === 200) {
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
                enableHighlighting: true,
                columnDefs: [
                    {field: 'pedido.numero_pedido', displayName: 'Numero Pedido', cellTemplate:"<div class='ngCellText ng-scope col1 colt1'>{{row.entity.pedido.numero_pedido}}"+
                        "<span  ng-show='row.entity.esDocumentoNuevo' class='label label-danger pull-right'>Nuevo</span></div>"},
                    {field: 'pedido.nombre_vendedor', displayName: 'Farmacia'},
                    {field: 'pedido.farmacia.nombre_bodega', displayName: 'Bodega'},
                    {field: 'zona_pedido', displayName: 'Zona'},
//                    {field: 'descripcion_estado_actual_separado', displayName: "Estado"},
                    {field: 'separador.nombre_operario', displayName: 'Separador'},
                    {field: 'auditor.nombre_responsable', displayName: 'Auditor'},
                    {field: 'descripcion_estado_separacion', displayName: 'Estado Separación'},
                    {field: 'fecha_separacion_pedido', displayName: "Fecha Separación"},
                    {field: 'accion', displayName: "Accion", cellClass: "txt-center", width: "7%", 
                     cellTemplate: '<div ng-switch="esAuditorCreador(row)">\
                                      <button ng-switch-when="true" class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Auditar</span></button>\
                                      <button ng-switch-when="false" disabled class="btn btn-default btn-xs"><span class="glyphicon glyphicon-zoom-in">Auditar</span></button>\
                                   </div>'
                    }
                ]

            };
            
            
            $scope.esAuditorCreador = function(row){
                if(row.entity.auditor.usuario_id === 0){
                    return true;
                }
                
                return row.entity.auditor.usuario_id === $scope.session.usuario_id;
            };

            $scope.onRowClick = function(row){
                row.entity.esDocumentoNuevo = false;
                $scope.notificacionfarmacias--;
                 $scope.slideurl = "views/auditoriapedidos/pedidoseparadofarmacia.html?time="+new Date().getTime();
                 $scope.$emit('mostrardetallefarmacia',row.entity);
                 //console.log("Presionado Botón Auditar Farmacia: ", row.entity);
            };
            
            $scope.valorSeleccionado = function(valor) {
                $scope.termino_busqueda = "";
                $scope.buscarPedidosSeparados(that.obtenerParametros(),2, false, $scope.renderPedidosSeparados);
            };

            //eventos de widgets
            $scope.onKeySeparadosPress = function(ev, termino_busqueda) {
                
                if (ev.which === 13) {
                    $scope.buscarPedidosSeparados(that.obtenerParametros(), 2, false, $scope.renderPedidosSeparados);
                }
            };

            $scope.paginaAnterior = function(){

                $scope.paginaactual--;
                $scope.buscarPedidosSeparados(that.obtenerParametros(), 2,true,$scope.renderPedidosSeparados);
            };

            $scope.paginaSiguiente = function(){
                $scope.paginaactual++;
                $scope.buscarPedidosSeparados(that.obtenerParametros(), 2,true, $scope.renderPedidosSeparados);
            };
            
            
             $scope.$on("onRefrescarListadoPedidos",function(){
                 $scope.termino_busqueda = "";
                 $scope.buscarPedidosSeparados(that.obtenerParametros(),2, false, $scope.renderPedidosSeparados);
            });

            //fin de eventos

            //se realiza el llamado a api para pedidos
           $scope.buscarPedidosSeparados(that.obtenerParametros(),2, false, $scope.renderPedidosSeparados);
           $scope.listarEmpresas("");

        }]);
});
