define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarNovedadProductoController', [
        '$scope', '$rootScope', 'API',
        '$modalInstance', 'AlertService', 'Request', 'ObservacionOrdenCompra', 'NovedadOrdenCompra',
        function($scope, $rootScope, API, $modalInstance, AlertService, Request, Observacion, Novedad) {

            console.log('====== Producto Selec=======');
            console.log($scope.producto_seleccionado);

            var that = this;

            // variables
            $scope.novedad_id = $scope.producto_seleccionado.get_novedad().get_id() || 0;
            $scope.item_id = $scope.producto_seleccionado.get_id();
            $scope.observacion_id = $scope.producto_seleccionado.get_novedad().get_observacion().get_id();
            $scope.descripcion_novedad = $scope.producto_seleccionado.get_novedad().get_descripcion();


            that.buscar_observaciones = function() {

                var obj = {session: $scope.session, data: {observaciones: {termino_busqueda: ""}}};

                Request.realizarRequest(API.OBSERVACIONES_ORDENES_COMPRA.LISTAR_OBSERVACIONES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_observaciones(data.obj.observaciones);
                    }
                });
            };

            that.gestionar_novedades = function() {

                var obj = {session: $scope.session,
                    data: {
                        ordenes_compras: {
                            novedad_id: $scope.novedad_id,
                            item_id: $scope.item_id,
                            observacion_id: $scope.observacion_id,
                            descripcion: $scope.descripcion_novedad
                        }
                    }
                };

                console.log('=============== OBJ ===============');
                console.log(obj);

                Request.realizarRequest(API.ORDENES_COMPRA.GESTIONAR_NOVEDADES, "POST", obj, function(data) {


                    console.log('=============== data ===============');
                    console.log(data);

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {

                        var observacion = $scope.Empresa.get_observacion($scope.observacion_id);

                        var novedad_id = (data.obj.ordenes_compras.length === 0) ? $scope.novedad_id : data.obj.ordenes_compras[0].novedad_id;
                        var novedad = Novedad.get(novedad_id, $scope.descripcion_novedad, observacion);

                        $scope.producto_seleccionado.set_novedad(novedad);

                        $scope.buscar_detalle_orden_compra();

                        $modalInstance.close();
                    }
                });
            };

            that.render_observaciones = function(observaciones) {

                $scope.Empresa.limpiar_observaciones();

                observaciones.forEach(function(data) {

                    var observacion = Observacion.get(data.id, data.codigo, data.descripcion);
                    $scope.Empresa.set_observaciones(observacion);
                });
            };

            $modalInstance.result.then(function() {

            }, function() {

            });

            $scope.aceptar = function() {
                that.gestionar_novedades();
            };

            $scope.close = function() {
                $modalInstance.close();
            };


            that.buscar_observaciones();

        }]);
});