define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('GuardarPedidoController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal', "$timeout",
        function($scope, $rootScope, Request,
                API, socket, AlertService,
                $state, Usuario, localStorageService, $modal, $timeout) {

            var self = this;

            self.init = function() {
                $scope.rootPedidoFarmacia = {};
                $scope.rootPedidoFarmacia.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                var pedido = localStorageService.get("pedidoFarmacia");

                if (pedido) {
                    $scope.root.pedido.setTipoModificacion(pedido.tipoModificacion);
                    
                    $scope.root.lista_productos.columnDefs[4].visible = self.visualizarColumnaModifarCantidad();
                    
                    self.consultarEncabezadoPedido(pedido, function(consultaEncabezado) {
                        if (!consultaEncabezado) {
                            AlertService.mostrarMensaje("warning", "No se ha consultado el pedido temporal");
                        }
                    });
                }
            };
            
            
            self.visualizarColumnaModifarCantidad = function(){
                if( $scope.root.pedido.getTipoModificacion() === '1' ){
                    return true;
                }
                
                return false;
            };
            
            /*
             * @Author: Eduar
             * @param {Object} pedido
             * @param {function} callback
             * +Descripcion: Consulta encabezado del pedido
             */
            self.consultarEncabezadoPedido = function(pedido, callback) {

                var obj = {
                    session: $scope.rootPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: pedido.numero_pedido
                        }
                    }
                };


                var url = API.PEDIDOS.FARMACIAS.CONSULTAR_ENCABEZADO_PEDIDO_FARMACIA;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {

                        if (data.obj.encabezado_pedido.length > 0) {
                            var _pedido = data.obj.encabezado_pedido[0];
                            $scope.renderEncabezado(_pedido);
                            $scope.root.pedido.setEsTemporal(false);
                            $scope.root.pedido.setNumeroPedido(_pedido.numero_pedido);
                            $scope.root.pedido.setEstadoActualPedido(_pedido.estado_actual_pedido);
                            
                            self.consultarDetallePedido(function(consultaDetalle) {
                                callback(consultaDetalle);
                            });

                        }

                    } else {
                        callback(false);
                    }
                });
            };
            
            
             /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Consulta detalle del pedido 
             */
            self.consultarDetallePedido = function(callback) {

                var pedido = $scope.root.pedido;
                var obj = {
                    session: $scope.rootPedidoFarmacia.session,
                    data: {
                        pedidos_farmacias: {
                            numero_pedido: pedido.get_numero_pedido()
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.CONSULTAR_DETALLE_PEDIDO_FARMACIA;
                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        pedido.vaciarProductosSeleccionados();
                        $scope.renderDetalle(data.obj.detalle_pedido);

                        callback(true);

                    } else {
                        callback(false);
                    }
                });
            };
            
            self.mostrarAlerta = function(titulo, mensaje, callback) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">'+titulo+'</h4>\
                                    </div>\
                                    <div class="modal-body row">\
                                    <div class="col-md-12">\
                                    <h4>'+mensaje+'</h4>\
                                    </div>\
                                    </div>\
                                    <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="cerrar(false)" ng-disabled="" >Cerrar</button>\
                                    <button class="btn btn-primary" ng-click="cerrar(true)" ng-disabled="" >Aceptar</button>\
                                    </div>',
                                           scope: $scope,
                                           controller: function($scope, $modalInstance) {
                                               $scope.cerrar = function(acepto) {
                                                   callback(acepto);
                                                   $modalInstance.close();
                                               };
                                           }
                                       };

                  var modalInstance = $modal.open($scope.opts);
            };
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.eventoEditarCantidad();
                $scope.rootPedidoFarmacia = {};
                $scope.$$watchers = null;
                localStorageService.set("pedidoFarmacia", null);
            });
            
            $scope.eventoEditarCantidad = $scope.$on("onEditarCantidad", function(e, producto){
                
                console.log($scope.root.pedido.getEstadoActualPedido());
                var mensaje;
                
                if($scope.root.pedido.getEstadoActualPedido() === '0'){
                    
                    if(producto.getCantidadIngresada() >= producto.getCantidadSolicitada()){
                        mensaje = "La cantidad ingresada debe ser menor a la solicitada";
                        
                        self.mostrarAlerta("Alerta del sistema", mensaje, function(acepto){
                            
                        });
                        
                    } else {
                        mensaje = "Seguro desea cambiar la cantidad solicitada "+ producto.getCantidadSolicitada() + " a "+producto.getCantidadIngresada() + " ?";
                        
                        self.mostrarAlerta("Alerta del sistema", mensaje, function(acepto){
                            if(acepto){
                                self.modificarCantidadSolicitada(producto);
                            }
                        });
                    }
                } else {
                    mensaje = "El estado actual del pedido no permite modificarlo";
                    
                    self.mostrarAlerta("Alerta del sistema", mensaje, function(acepto){

                    });
                }
                

            });
            
            self.modificarCantidadSolicitada = function(_producto){
                                
                var diferencia_cantidad = 0;
                var nuevo_pendiente = 0;
                var producto = angular.copy(_producto);

                diferencia_cantidad =  producto.getCantidadSolicitada() - producto.getCantidadIngresada();

                producto.setCantidadSolicitada(producto.getCantidadIngresada());
                
                nuevo_pendiente = producto.getCantidadPendiente() - diferencia_cantidad;

                if(nuevo_pendiente >= 0){
                    producto.setCantidadPendiente(nuevo_pendiente);
                    
                } else {
                    producto.setCantidadPendiente(0);
                }
                
                var obj = {
                    session:$scope.rootPedidoFarmacia.session,
                    data:{
                        pedidos_farmacias:{
                            numero_pedido: $scope.root.pedido.get_numero_pedido(),
                            codigo_producto: producto.getCodigoProducto(),
                            cantidad_solicitada: parseInt(producto.getCantidadSolicitada()),
                            cantidad_pendiente: parseInt(producto.getCantidadPendiente())
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.ACTUALIZAR_CANTIDADES_DETALLE_PEDIDO_FARMACIA;
                
                Request.realizarRequest(url, "POST", obj, function(data) {
                    console.log("resultado cambiar cantidad ", data);
                    if(data.status !== 200){
                        AlertService.mostrarMensaje("warning", data.msj);
                        
                    }
                    
                     self.consultarDetallePedido(function(consultaDetalle) {
                         
                     });
                    
                });            
            };
            
            /*$scope.onModificarCantidad = function(row){
                
                var numero_pedido = $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().numero_pedido;
                
                that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){

                    //$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().setEnUso(data.obj.encabezado_pedido[0].en_uso);
                    $scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = data.obj.encabezado_pedido[0].estado;
                    //console.log(">>>> Modificar - Estado del Pedido: ", data.obj.encabezado_pedido[0].estado);
                    //console.log(">>>> Scope Modificar - Estado del Pedido: ",$scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido);
                    
                    if($scope.rootCreaPedidoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0'){
                    
                        if(row.entity.nueva_cantidad >= row.entity.cantidad_solicitada){

                            var template = ' <div class="modal-header">\
                                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                                <h4 class="modal-title">Mensaje del Sistema</h4>\
                                            </div>\
                                            <div class="modal-body">\
                                                <h4>La Nueva Cantidad debe ser Menor a la Actual ! </h4> \
                                            </div>\
                                            <div class="modal-footer">\
                                                <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
                                            </div>';

                            controller = function($scope, $modalInstance) {

                                $scope.close = function() {
                                    $modalInstance.close();
                                };
                            };

                            $scope.opts = {
                                backdrop: true,
                                backdropClick: true,
                                dialogFade: false,
                                keyboard: true,
                                template: template,
                                scope: $scope,
                                controller: controller
                            };

                            var modalInstance = $modal.open($scope.opts);


                        }
                        else{

                                var template = ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                </div>\
                                                <div class="modal-body">\
                                                    <h4>Seguro desea bajar la cantidad de '+row.entity.cantidad_solicitada+' a '+row.entity.nueva_cantidad+' ? </h4> \
                                                </div>\
                                                <div class="modal-footer">\
                                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                                    <button class="btn btn-primary" ng-click="modificarCantidad()" ng-disabled="" >Si</button>\
                                                </div>';

                            controller = function($scope, $modalInstance) {

                                $scope.modificarCantidad = function() {
                                    //that.verificarEstadoPedido(function(){

                                        that.modificarValoresCantidad(
                                            $scope.rootCreaPedidoFarmacia.pedido.numero_pedido,
                                            row.entity
                                        );
                                    //}    
                                    //);

                                    $modalInstance.close();
                                };

                                $scope.close = function() {
                                    $modalInstance.close();
                                };
                            };

                            $scope.opts = {
                                backdrop: true,
                                backdropClick: true,
                                dialogFade: false,
                                keyboard: true,
                                template: template,
                                scope: $scope,
                                controller: controller
                            };

                            var modalInstance = $modal.open($scope.opts);
                        }
                    }
                    else{
                        //Avisar la no posibilidad de modiificar porque el pedido está abierto en una tablet
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Aviso: </h4>\
                                        </div>\
                                        <div class="modal-body row">\
                                            <div class="col-md-12">\
                                                <h4 >El Pedido '+numero_pedido+' ha sido asignado. No puede modificarse!</h4>\
                                            </div>\
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                        </div>',
                            scope: $scope,
                            controller: function($scope, $modalInstance) {
                                $scope.close = function() {
                                    $modalInstance.close();
                                };
                            }
                        };

                        var modalInstance = $modal.open($scope.opts); 
                    }
                });
            };*/
            
            self.init();


        }]);
});
