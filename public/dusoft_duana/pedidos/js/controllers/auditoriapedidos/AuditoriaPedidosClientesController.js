define(["angular", "js/controllers",
    'models/auditoriapedidos/ClientePedido', 
    'models/auditoriapedidos/PedidoAuditoria', 
    'models/auditoriapedidos/Separador',
    'models/auditoriapedidos/DocumentoTemporal'], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaPedidosClientesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'Cliente', 'PedidoAuditoria',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "Usuario","localStorageService",
        function($scope, $rootScope, Request, Empresa,
                 Cliente, PedidoAuditoria, Separador, DocumentoTemporal,
                 API, socket, AlertService, Usuario,
                 localStorageService) {

            $scope.Empresa = Empresa;
            $scope.pedidosSeparadosSeleccionados = [];

            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            $scope.numero_pedido = "";

            var that = this;
            
            var empresa = Usuario.getUsuarioActual().getEmpresa();
            
            that.obtenerParametros = function() {
                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        documento_temporal: {
                            termino_busqueda: $scope.termino_busqueda,
                            pagina_actual: $scope.paginaactual,
                            empresa_id:Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                            filtro: {
                                finalizados: true,
                                centro_utilidad:empresa.getCentroUtilidadSeleccionado().getCodigo(),
                                bodega_id:empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                            }
                        }
                    }
                };

                return obj;
            };

            //definicion y delegados del Tabla de pedidos clientes

            $scope.lista_pedidos_separados_clientes = {
                data: 'Empresa.getDocumentoTemporal(1)',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'descripcion_estado_separacion', displayName: 'Estado Separación'},
                    {field: 'pedido.numero_pedido', displayName: 'Numero Pedido',
                        cellTemplate: "<div class='ngCellText ng-scope col1 colt1'>\
                                        {{row.entity.pedido.numero_pedido}}\
                                        <span  ng-show='row.entity.esDocumentoNuevo' class='label label-danger pull-right'>Nuevo</span>\
                                     </div>"
                    },
                    {field: 'pedido.cliente.nombre_tercero', displayName: 'Cliente'},
                    {field: 'pedido.nombre_vendedor', displayName: 'Vendedor'},
                    {field: 'separador.nombre_operario', displayName: 'Separador'},
                    {field: 'auditor.nombre_responsable', displayName: 'Auditor'},
                    {field: 'fecha_separacion_pedido', displayName: "Fecha Separación"},
                    {field: 'movimiento', displayName: "Detalle", cellClass: "txt-center", width: "7%",
                        cellTemplate: '<div ng-switch="esAuditorCreador(row)">\
                                        <button ng-switch-when="true" ng-validate-events="{{opcionesModulo.btnAuditarClientes}}" class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in"></span> Auditar</button>\
                                        <button ng-switch-when="false" disabled class="btn btn-default btn-xs"><span class="glyphicon glyphicon-zoom-in"></span> Auditar</button>\
                                      </div>'
                    }

                ]

            };


            $scope.esAuditorCreador = function(row) {
                //  console.log("usuario id ", row.entity.auditor, " session id ", $scope.session.usuario_id);
                if (row.entity.auditor.usuario_id === 0) {
                    return true;
                }

                return row.entity.auditor.usuario_id === $scope.session.usuario_id;
            };

            $scope.onRowClick = function(row) {
                row.entity.esDocumentoNuevo = false;
                $scope.notificacionclientes--;
                that.mostrarDetalle(row.entity);
            };
            
            
            $scope.$on("onPedidosSeparadosRenderCliente", function(e, items) { 
                //console.log("documentos de clientes ", Empresa.getDocumentoTemporal(1))
                $scope.items = items;
                
                if(localStorageService.get("auditoriaCliente")){
                    var numero = parseInt(localStorageService.get("auditoriaCliente"));
                    var documento =  $scope.obtenerDocumento(numero, 1);
                    that.mostrarDetalle(documento);
                }
                
            });

            $scope.$on("onPedidosSeparadosNoEncotradosCliente", function(e) {
                if ($scope.paginaactual > 1) {
                    $scope.paginaactual--;
                }
                AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
            });


            $scope.$on("cerrardetalleclienteCompleto", function(e) {
                $scope.buscarPedidosSeparados(that.obtenerParametros(), 1, false, $scope.renderPedidosSeparados);
                $scope.$broadcast("detalleClienteCerradoCompleto");
            });
            
            that.mostrarDetalle = function(documento){
                $scope.slideurl = "views/auditoriapedidos/pedidoseparadocliente.html?time=" + new Date().getTime();
                $scope.$emit('mostrardetallecliente', documento);
                localStorageService.remove("auditoriaCliente");
                
            };
            
            $scope.$on("mostrardetalleclienteCompleto",function(e, datos){
               
                $scope.$broadcast("detalleClienteCompleto", datos);
            });
            
            $scope.$on("cerrarDetalleCliente", function(){
                
                $scope.$emit('cerrardetallecliente', {animado: true});
            });


            //eventos de widgets
            $scope.onKeySeparadosPress = function(ev, termino_busqueda) {
                if (ev.which === 13) {
                    $scope.buscarPedidosSeparados(that.obtenerParametros(),
                            1,
                            false,
                            $scope.renderPedidosSeparados
                     );
                }
            };

            $scope.paginaAnterior = function() {
                $scope.paginaactual--;
                $scope.buscarPedidosSeparados(that.obtenerParametros(), 1, true, $scope.renderPedidosSeparados);
            };

            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                $scope.buscarPedidosSeparados(that.obtenerParametros(), 1, true, $scope.renderPedidosSeparados);
            };

            //fin de eventos
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.pedidosSeparadosSeleccionados = [];
                $scope.$$watchers = null;
            });

            $scope.$on("onRefrescarListadoPedidos", function() {
                $scope.termino_busqueda = "";
                $scope.buscarPedidosSeparados(that.obtenerParametros(), 1, false, $scope.renderPedidosSeparados);
            });


            //se realiza el llamado a api para pedidos
                        //se valida que el usuario tenga centro de utilidad y bodega
            
            if(!empresa){
                $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene una empresa valida para generar pedidos de clientes", tipo:"warning"});
            } else if(!empresa.getCentroUtilidadSeleccionado()){
                $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene un centro de utilidad valido para generar pedidos de clientes.", tipo:"warning"});
            } else if(!empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada()){
                $rootScope.$emit("onIrAlHome",{mensaje:"El usuario no tiene una bodega valida para generar pedidos de clientes", tipo:"warning"});
            } else {
                
                //se valida si se debe consultar un producto desde separacion
                if(localStorageService.get("auditoriaCliente")){
                    var numero = parseInt(localStorageService.get("auditoriaCliente"));
                    $scope.termino_busqueda = numero;
                    $scope.buscarPedidosSeparados(that.obtenerParametros(), 1, false, $scope.renderPedidosSeparados);
                } else {
                    $scope.buscarPedidosSeparados(that.obtenerParametros(), 1, false, $scope.renderPedidosSeparados);
                }
                
            }
            console.log("prueba produccion >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

        }]);
});
