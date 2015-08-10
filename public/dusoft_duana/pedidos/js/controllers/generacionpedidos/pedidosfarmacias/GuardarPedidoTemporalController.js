define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('GuardarPedidoTemporalController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal', "$timeout", "EmpresaPedidoFarmacia",
        "ProductoPedidoFarmacia",
        function($scope, $rootScope, Request,
                API, socket, AlertService,
                $state, Usuario, localStorageService, $modal,
                $timeout, EmpresaPedidoFarmacia, ProductoPedidoFarmacia) {

            var self = this;


            self.init = function() {
                $scope.rootPedidoFarmaciaTemporal = {};
                $scope.rootPedidoFarmaciaTemporal.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                
                //prepara la configuracion de la directiva para subir el archivo
                $scope.rootPedidoFarmaciaTemporal.opcionesArchivo = new Flow();
                $scope.rootPedidoFarmaciaTemporal.opcionesArchivo.target = API.PEDIDOS.FARMACIAS.SUBIR_ARCHIVO_PLANO;
                $scope.rootPedidoFarmaciaTemporal.opcionesArchivo.testChunks = false;
                $scope.rootPedidoFarmaciaTemporal.opcionesArchivo.singleFile = true;
                $scope.rootPedidoFarmaciaTemporal.opcionesArchivo.query = {
                    session: JSON.stringify($scope.rootPedidoFarmaciaTemporal.session)
                };

                var pedidoTemporal = localStorageService.get("pedidotemporal");

                if (pedidoTemporal) {
                    self.consultarEncabezadoPedidoTemporal(pedidoTemporal, function(consultaEncabezado) {
                        if (!consultaEncabezado) {
                            AlertService.mostrarMensaje("warning", "No se ha consultado el pedido temporal");
                        }
                    });
                }
            };

            /*
             * @Author: Eduar
             * @param {Object} pedidoTemporal
             * @param {function} callback
             * +Descripcion: Consulta encabezado del pedido temporal
             */
            self.consultarEncabezadoPedidoTemporal = function(pedidoTemporal, callback) {

                var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: pedidoTemporal.farmacia,
                            centro_utilidad_id: pedidoTemporal.centroUtilidad,
                            bodega_id: pedidoTemporal.bodega
                        }
                    }
                };


                var url = API.PEDIDOS.FARMACIAS.CONSULTAR_ENCABEZADO_PEDIDO_TEMPORAL;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {

                        if (data.obj.encabezado_pedido.length > 0) {
                            $scope.renderEncabezado(data.obj.encabezado_pedido[0]);
                            $scope.root.pedido.setEsTemporal(true);

                            self.consultarDetallePedidoTemporal(function(consultaDetalle) {
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
             * +Descripcion: Consulta detalle del pedido temporal
             */
            self.consultarDetallePedidoTemporal = function(callback) {

                var pedido = $scope.root.pedido;
                var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: pedido.getFarmaciaDestino().getCodigo(),
                            centro_utilidad_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.LISTAR_DETALLE_PEDIDO_TEMPORAL;
                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        
                        $scope.renderDetalle(data.obj.listado_productos);

                        callback(true);

                    } else {
                        callback(false);
                    }
                });
            };

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Metodo que realiza el request para crear el pedido temporal
             */

            self.guardarEncabezadoPedidoTemporal = function(callback) {
                var pedido = $scope.root.pedido;
                var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_origen_id: pedido.getFarmaciaOrigen().getCodigo(),
                            centro_utilidad_origen_id: pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_origen_id: pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            empresa_destino_id: pedido.getFarmaciaDestino().getCodigo(),
                            centro_utilidad_destino_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_destino_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            observacion: pedido.getDescripcion()
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.GUARDAR_PEDIDO_TEMPORAL;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        callback(true);
                        //se guarda para traer los datos cuando el usuario recargue la pagina
                        var farmacia = pedido.getFarmaciaDestino();
                        localStorageService.set("pedidotemporal", {
                            farmacia: farmacia.getCodigo(),
                            centroUtilidad: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                        });
                        
                    } else {
                        callback(false);
                    }
                });
            };


            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Metodo que realiza el request para crear el pedido temporal
             */
            self.guardarDetallePedidoTemporal = function(callback) {
                var pedido = $scope.root.pedido;
                var producto = pedido.getProductoSeleccionado();
                var farmacia = pedido.getFarmaciaDestino();
                var cantidadPendiente = producto.getCantidadSolicitada() - producto.getDisponibilidadBodega();
                cantidadPendiente = (cantidadPendiente > 0) ? cantidadPendiente : 0;
                producto.setCantidadPendiente(cantidadPendiente);
                var url = API.PEDIDOS.FARMACIAS.CREAR_DETALLE_PEDIDO_TEMPORAL;

                var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            numero_pedido: farmacia.getCodigo() + farmacia.getCentroUtilidadSeleccionado().getCodigo() + producto.getCodigoProducto(),
                            empresa_id: farmacia.getCodigo(),
                            centro_utilidad_id: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            codigo_producto: producto.getCodigoProducto(),
                            cantidad_solic: parseInt(producto.getCantidadSolicitada()),
                            tipo_producto_id: producto.getTipoProductoId(),
                            cantidad_pendiente: cantidadPendiente
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        pedido.agregarProductoSeleccionado(producto);
                        callback(true);

                    } else {
                        callback(false);
                    }
                });

            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Realiza la peticion al API para generar un pedido dsde el temporal.
             */
            self.generarPedido = function(){
                var pedido = $scope.root.pedido;
                var farmacia = pedido.getFarmaciaDestino();
                var url = API.PEDIDOS.FARMACIAS.GENERAR_PEDIDO_FARMACIA;
                
                 var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        pedidos_farmacias: {
                            empresa_id: farmacia.getCodigo(),
                            centro_utilidad_id: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            tipo_pedido: pedido.getProductosSeleccionados()[0].getTipoProductoId(),
                            observacion:pedido.getDescripcion()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                       pedido.setNumeroPedido(data.obj.numero_pedido);
                       pedido.setEsTemporal(false);
                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error al crear el pedido");
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {ProductoPedidoFarmacia} producto
             * +Descripcion: Realiza la peticion al API para eliminar un producto del temporal.
             */
            self.eliminarProductoTemporal = function(producto, index){
                var pedido = $scope.root.pedido;
                var farmacia = pedido.getFarmaciaDestino();
                var url = API.PEDIDOS.FARMACIAS.ELIMINAR_REGISTRO_DETALLE_PEDIDO_TEMPORAL;
                
                 var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            empresa_id: farmacia.getCodigo(),
                            centro_utilidad_id: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            codigo_producto: producto.getCodigoProducto()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                       pedido.eliminarProductoSeleccionado(index);
                       
                       if(pedido.getProductosSeleccionados().length === 0){
                           self.eliminarPedidoTemporal();
                       }
                       
                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error al eliminar el producto");
                    }
                });
            };
            
             /*
             * @Author: Eduar
             * +Descripcion: Realiza la peticion al API para eliminar el encabezado y detalle de un pedido temporal
             */
            self.eliminarPedidoTemporal = function(){
                var pedido = $scope.root.pedido;
                var farmacia = pedido.getFarmaciaDestino();
                var url = API.PEDIDOS.FARMACIAS.ELIMINAR_PEDIDO_TEMPORAL;
                
                 var obj = {
                    session: $scope.rootPedidoFarmaciaTemporal.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            empresa_id: farmacia.getCodigo(),
                            centro_utilidad_id: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                       $state.go("ListarPedidosFarmacias");
                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error al eliminar el pedido");
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {Array<Object>} productos
             * @param {function} callback
             * +Descripcion: Permite mostrar los productos que no se guardaron del archivo plano
             */
            self.mostrarProductosNoValidos = function(productos, callback){
                $scope.productosInvalidos = [];
                
                for (var i in productos) {
                    var _producto = productos[i];
                    var producto = ProductoPedidoFarmacia.get(_producto.codigo_producto, _producto.descripcion).
                                                              setCantidadSolicitada(_producto.cantidad_solicitada);

                     $scope.productosInvalidos.push(producto);                                   
                }
                
                
                $scope.productos = productos;   
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Listado Productos </h4>\
                                </div>\
                                <div class="modal-body row">\
                                    <div class="col-md-12">\
                                        <h4 >Lista Productos INVALIDOS.</h4>\
                                        <div class="row" style="max-height:300px; overflow:hidden; overflow-y:auto;">\
                                            <div class="list-group">\
                                                <a ng-repeat="producto in productosInvalidos" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                                    {{ producto.getCodigoProducto()}}\
                                                </a>\
                                            </div>\
                                        </div>\
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
                
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton generar pedido
             */
            $scope.onGenerarPedido = function(){
                self.generarPedido();
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton guardar pedido temporal
             */
            $scope.onGuardarEncabezadoPedidoTemporal = function(){
                self.guardarEncabezadoPedidoTemporal(function(respuestaValida){
                    if(respuestaValida){
                        AlertService.mostrarMensaje("success", "Pedido modificado correctamente");
                    } else {
                        AlertService.mostrarMensaje("warning", "Error al modificar el pedido");
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton cancelar pedido
             */
            $scope.onEliminarPedidoTemporal = function(){
                var template = ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar el pedido temporal? </h4> \
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-success" ng-click="close()">No</button>\
                                    <button class="btn btn-warning" ng-click="onConfirmarEliminarPedido()">Si</button>\
                                </div>';

                controller = function($scope, $modalInstance) {

                    $scope.close = function() {
                        $modalInstance.close();
                    };
                    
                    $scope.onConfirmarEliminarPedido = function(){
                        $modalInstance.close();
                        self.eliminarPedidoTemporal();
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
            };
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Metodo que se dispara desde el slide de seleccion de productos
             */
            $scope.eventoInsertarProductoPedidoTemporal = $scope.$on("insertarProductoPedidoTemporal", function(event) {
                var pedido = $scope.root.pedido;
                var producto = pedido.getProductoSeleccionado();
                
                if (!pedido.getEsTemporal()) {
                    self.guardarEncabezadoPedidoTemporal(function(creacionCompleta) {
                        if (creacionCompleta) {
                            pedido.setEsTemporal(true);
                            self.guardarDetallePedidoTemporal(function(agregado) {

                            });

                        }
                    });
                } else {
                    self.guardarDetallePedidoTemporal(function(agregado) {
                        console.log("agregado al temporal ", pedido);
                    });
                }
            });
            
            /*
             * @Author: Eduar
             * +Descripcion: Despues que se selecciona correctamente los dropdown en el parent, se busca si el pedido ya fue guardado anteriormente
             */
            $scope.onBodegaPedidoSeleccionada = $scope.$on("onBodegaSeleccionada", function() {

                var farmacia = $scope.root.pedido.getFarmaciaDestino();

                var pedidoTemporal = {
                    farmacia: farmacia.getCodigo(),
                    centroUtilidad: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                    bodega: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                };

                self.consultarEncabezadoPedidoTemporal(pedidoTemporal, function(consultaEncabezado) {

                });
            });
            
            /*
             * @Author: Eduar
             * @param {$event} e
             * @param {ProductoPedidoFarmacia} producto
             * @param {int} index
             * +Descripcion: Evento que se dispara desde el controlador base para eliminar un producto
             */
            $scope.onEliminarProductoTemporal = $scope.$on("onEliminarProductoTemporal",function(e, producto, index){
                self.eliminarProductoTemporal(producto, index);
            });
            
            
            /*
             * @Author: Eduar
             * @param {$flow} $flow
             * +Descripcion: Helper que asigna el objeto flow debido a que la referencia se pierde
             */
            $scope.cargarArchivoPlano = function($flow) {
                $scope.rootPedidoFarmaciaTemporal.opcionesArchivo = $flow;
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton subir archivo plano
             */
            $scope.subirArchivoPlano = function() {
                 var pedido = $scope.root.pedido;
                 
                 self.guardarEncabezadoPedidoTemporal(function(creacionCompleta) {
                    if (creacionCompleta) {
                        pedido.setEsTemporal(true);
                        
                         $scope.rootPedidoFarmaciaTemporal.opcionesArchivo.opts.query.data = JSON.stringify({
                                pedidos_farmacias: {
                                    empresa_origen_id: pedido.getFarmaciaOrigen().getCodigo(),
                                    centro_utilidad_origen_id: pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getCodigo(),
                                    bodega_origen_id: pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                                    empresa_destino_id: pedido.getFarmaciaDestino().getCodigo(),
                                    centro_utilidad_destino_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                                    bodega_destino_id: pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                                    tipo_producto:pedido.getTipoPedido()
                                }
                         });
                         
                         $scope.rootPedidoFarmaciaTemporal.opcionesArchivo.upload();
                    }
                 });
            };
            
            /*
             * @Author: Eduar
             * @param {File} file
             * @param {String} message
             * +Descripcion: Handler de la respuesta del servidor al subir el archivo
             */
            $scope.respuestaArchivoPlano = function(file, message) {
                console.log("respuesta archivo plano ", message);
                $scope.rootPedidoFarmaciaTemporal.opcionesArchivo.cancel();
                var datos = JSON.parse(message);
                
                if(datos.status === 200){
                    self.consultarDetallePedidoTemporal(function(){
                        self.mostrarProductosNoValidos(datos.obj.productosInvalidos);
                    });
                } else {
                    AlertService.mostrarMensaje("warning", datos.msj);
                }
                
            };
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.onBodegaPedidoSeleccionada();
                $scope.onEliminarProductoTemporal();
                $scope.eventoInsertarProductoPedidoTemporal();
                $scope.rootPedidoFarmaciaTemporal = {};
                $scope.$$watchers = null;
                localStorageService.remove("pedidotemporal");
                

            });

            self.init();

        }]);
});
