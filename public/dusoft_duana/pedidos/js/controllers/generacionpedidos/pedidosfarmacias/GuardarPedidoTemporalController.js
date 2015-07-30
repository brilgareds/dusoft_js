define(["angular", "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    var fo = controllers.controller('GuardarPedidoTemporalController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal', "$timeout",
        function($scope, $rootScope, Request,
                API, socket, AlertService,
                $state, Usuario, localStorageService, $modal,
                ProductoPedido, $timeout) {

            var self = this;


            self.init = function() {
                console.log("on controller init");
                $scope.rootPedidoFarmaciaTemporal = {};
                $scope.rootPedidoFarmaciaTemporal.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
            };

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Metodo que se dispara desde el slide de seleccion de productos
             */
            $rootScope.$on("insertarProductoPedidoTemporal", function(event, pedido) {
                console.log("producto a guarar", pedido);
                return;
                if(!pedido.getEsTemporal()){
                    $scope.rootPedidoFarmaciaTemporal.pedido = pedido;
                    self.guardarEncabezadoPedidoTemporal(function(creacionCompleta) {
                        if (creacionCompleta) {
                            pedido.setEsTemporal(true);
                        }
                    });
                }
            });

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Metodo que realiza el request para crear el pedido temporal
             */

            self.guardarEncabezadoPedidoTemporal = function(callback) {
                var pedido = $scope.rootPedidoFarmaciaTemporal.pedido;
                console.log("pedidos ", $scope.rootPedidoFarmaciaTemporal);
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


                var url = API.PEDIDOS.FARMACIAS.CREAR_PEDIDO_TEMPORAL;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
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

            self.guardarDetallePedidoTemporal = function(callback) {
                /*var pedido = $scope.rootPedidoFarmaciaTemporal.pedido;
                 console.log("pedidos ", $scope.rootPedidoFarmaciaTemporal);
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
                 
                 
                 var url = API.PEDIDOS.FARMACIAS.CREAR_PEDIDO_TEMPORAL;
                 
                 Request.realizarRequest(url, "POST", obj, function(data) {
                 if (data.status === 200) {
                 callback(true);
                 
                 } else {
                 callback(false);
                 }
                 });*/
            };

            self.guardarDetallePedidoTemporal = function() {
                var pedido = $scope.rootPedidoFarmaciaTemporal.pedido;
                var producto = pedido.getProductoSeleccionado();
                //Cálculo de cantidad pendiente
                var cantidadPendiente = producto.getCantidadSolicitada() - producto.getDisponibilidadBodega();

                /* Inicio - Objeto para Inserción Detalle */
                var obj_detalle = {
                    session: $scope.rootSeleccionProductoFarmacia.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            numero_pedido: $scope.rootSeleccionProductoFarmacia.para_empresa_id.trim() + $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id.trim() + row.entity.codigo_producto.trim(),
                            empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
                            centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
                            bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
                            codigo_producto: row.entity.codigo_producto,
                            cantidad_solic: parseInt(row.entity.cantidad_solicitada),
                            tipo_producto_id: row.entity.tipo_producto_id,
                            cantidad_pendiente: (cantidadPendiente < 0) ? 0 : cantidadPendiente
                        }
                    }
                };
                /* Fin - Objeto para Inserción Detalle */

                /* Inicio - Validar existencia de producto en Detalle Pedido */
                
                return;

                var url_registros_detalle = API.PEDIDOS.EXISTE_REGISTRO_DETALLE_PEDIDO_TEMPORAL;

                Request.realizarRequest(url_registros_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
//                        console.log("DETALLE: data.obj.numero_registros[0].count = ", data.obj.numero_registros[0].count)
                        if (data.obj.numero_registros[0].count > 0) {

                            console.log("Ya existe éste producto en el detalle");
                        }
                        else {

//                            console.log("Ingresando el detalle");

                            /* Inicio - Inserción de objeto en grid de seleccionados */

                            var producto = ProductoPedido.get(
                                    row.entity.codigo_producto, //codigo_producto
                                    row.entity.nombre_producto, //descripcion
                                    0, //existencia **hasta aquí heredado
                                    0, //precio
                                    row.entity.cantidad_solicitada, //cantidad_solicitada
                                    0, //cantidad_separada
                                    "", //observacion
                                    "", //disponible
                                    "", //molecula
                                    "", //existencia_farmacia
                                    row.entity.tipo_producto_id, //tipo_producto_id
                                    "", //total_existencias_farmacia
                                    "", //existencia_disponible
                                    (cantidad_pendiente < 0) ? '0' : cantidad_pendiente      //cantidad_pendiente
                                    );

                            $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);

                            var longitud_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length;

                            var test_index = 0;

                            if (longitud_seleccionados > 1) {
                                test_index = 1;
                            }
                            else {
                                test_index = 0;
                            }

                            /*Inicio: Evitar Inserción por tipo Producto */
                            if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id !== row.entity.tipo_producto_id) {

                                var descripcion_tipo_anterior = "";
                                var descripcion_tipo_actual = "";

                                $scope.rootSeleccionProductoFarmacia.lista_tipo_productos.forEach(function(tipo_producto) {

                                    if (tipo_producto.tipo_producto_id === $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id) {
                                        descripcion_tipo_anterior = tipo_producto.descripcion;
                                    }
                                    if (tipo_producto.tipo_producto_id === row.entity.tipo_producto_id) {
                                        descripcion_tipo_actual = tipo_producto.descripcion;
                                    }
                                });

                                var template = ' <div class="modal-header">\
                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                </div>\
                                                <div class="modal-body">\
                                                    <h4>No se puede incluir un producto de ' + descripcion_tipo_actual + ' en un pedido de ' + descripcion_tipo_anterior + ' </h4> \
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

                                $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);

                            } /*Fin: Evitar Inserción por tipo Producto */
                            else { /*Inicio - Continuar con Inserción en Detalle*/

                                //if ($scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.length === 25) {
                                if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 25) {

                                    var template = ' <div class="modal-header">\
                                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                    </div>\
                                                    <div class="modal-body">\
                                                        <h4>Usted ha llegado a los 25 productos para éste Pedido ! </h4> \
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

                                /* Fin - Inserción de objeto en grid de seleccionados */

                                $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos;
                                $scope.$emit('cargarGridPrincipal', 1);

                                /* Inicio - Inserción del Detalle */

                                var url_detalle = API.PEDIDOS.CREAR_DETALLE_PEDIDO_TEMPORAL;

                                Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {

                                    if (data.status === 200) {
                                        console.log("Registro Insertado Exitosamente en Detalle: ", data.msj);

                                        //Restar Valor de disponibilidad para que se refleje automáticamente en la grid
                                        row.entity.disponibilidad_bodega -= row.entity.cantidad_solicitada;
                                    }
                                    else {
                                        console.log("No se pudo Incluir éste produto: ", data.msj);

                                        $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);

                                        var obj_bloqueo = {
                                            session: $scope.rootSeleccionProductoFarmacia.session,
                                            data: {
                                                usuario_bloqueo: {
                                                    farmacia_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id.trim(),
                                                    centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id.trim(),
                                                    codigo_producto: row.entity.codigo_producto.trim()
                                                }
                                            }
                                        };

                                        var url_bloqueo = API.PEDIDOS.BUSCAR_USUARIO_BLOQUEO;

                                        Request.realizarRequest(url_bloqueo, "POST", obj_bloqueo, function(data) {

                                            if (data.status === 200) {

                                                console.log("Consulta de usuario bloqueante exitosa: ", data.msj);

                                                var template = ' <div class="modal-header">\
                                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                                </div>\
                                                                <div class="modal-body">\
                                                                    <h4>El producto con código ' + row.entity.codigo_producto + ' está bloqueado por el usuario ' +
                                                        '(' + data.obj.datos_usuario[0].usuario_id + ') ' + data.obj.datos_usuario[0].nombre + ' </h4> \
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
                                            else {
                                                console.log("Consulta de usuario bloqueante fallida: ", data.msj);

                                                var template = ' <div class="modal-header">\
                                                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                                                </div>\
                                                                <div class="modal-body">\
                                                                    <h4>El producto con código ' + row.entity.codigo_producto + ' está bloqueado por otro usuario </h4> \
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
                                        });

                                    }

                                });
                                /* Fin - Inserción del Detalle */
                            } /* Fin - Continuar con Inserción en Detalle*/
                        }
                    }
                    else {
                        console.log(data.msj);
                    }
                });
                /* Fin - Validar existencia de producto en Detalle Pedido */
            };

            self.init();

        }]);
});
