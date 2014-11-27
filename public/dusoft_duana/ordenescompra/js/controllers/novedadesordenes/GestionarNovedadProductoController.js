define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarNovedadProductoController', [
        '$scope', '$rootScope', 'API',
        '$modalInstance', 'AlertService', 'Request', 'ObservacionOrdenCompra', 'NovedadOrdenCompra', 'ArchivoNovedadOrdenCompra',
        function($scope, $rootScope, API, $modalInstance, AlertService, Request, Observacion, Novedad, Archivo) {

            var that = this;

            // variables
            $scope.novedad_id = $scope.producto_seleccionado.get_novedad().get_id() || 0;
            $scope.item_id = $scope.producto_seleccionado.get_id();
            $scope.observacion_id = $scope.producto_seleccionado.get_novedad().get_observacion().get_id();
            $scope.descripcion_novedad = $scope.producto_seleccionado.get_novedad().get_descripcion();

            // Inicializacion Upload
            $scope.flow = new Flow();
            $scope.flow.target = API.ORDENES_COMPRA.SUBIR_ARCHIVO_NOVEDAD;
            $scope.flow.testChunks = false;
            $scope.flow.singleFile = true;
            $scope.flow.query = {
                session: JSON.stringify($scope.session)
            };


            that.buscar_observaciones = function() {

                var obj = {session: $scope.session, data: {observaciones: {termino_busqueda: ""}}};

                Request.realizarRequest(API.OBSERVACIONES_ORDENES_COMPRA.LISTAR_OBSERVACIONES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_observaciones(data.obj.observaciones);
                    }
                });
            };

            that.buscar_archivos_novedad = function() {

                var obj = {session: $scope.session,
                    data: {
                        ordenes_compras: {
                            novedad_id: $scope.novedad_id
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_ARCHIVOS_NOVEDAD, "POST", obj, function(data) {
                    console.log('============== RESPUESTA SERVER ====================');
                    console.log(data);

                    if (data.status === 200) {
                        that.render_archivos_novedad(data.obj.lista_archivos);
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

                Request.realizarRequest(API.ORDENES_COMPRA.GESTIONAR_NOVEDADES, "POST", obj, function(data) {


                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {

                        var observacion = $scope.Empresa.get_observacion($scope.observacion_id);

                        var novedad_id = (data.obj.ordenes_compras.length === 0) ? $scope.novedad_id : data.obj.ordenes_compras[0].novedad_id;
                        var novedad = Novedad.get(novedad_id, $scope.descripcion_novedad, observacion);
                        $scope.novedad_id = novedad_id;
                        $scope.producto_seleccionado.set_novedad(novedad);

                        //Subir Archivo
                        if ($scope.flow.files.length > 0) {
                            that.subir_archivo_novedad();
                        } else {
                            $scope.buscar_detalle_orden_compra();

                            $modalInstance.close();
                        }
                    }
                });
            };

            that.subir_archivo_novedad = function() {

                $scope.flow.opts.query.data = JSON.stringify({
                    ordenes_compras: {
                        novedad_id: $scope.novedad_id
                    }
                });

                $scope.flow.upload();
            };

            $scope.respuesta_subida_archivo = function(file, message) {

                var data = (message !== undefined) ? JSON.parse(message) : {};


                if (data.status === 200) {
                    $scope.buscar_detalle_orden_compra();

                    $modalInstance.close();
                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }


            };

            that.render_observaciones = function(observaciones) {

                $scope.Empresa.limpiar_observaciones();

                observaciones.forEach(function(data) {

                    var observacion = Observacion.get(data.id, data.codigo, data.descripcion);
                    $scope.Empresa.set_observaciones(observacion);
                });
            };

            that.render_archivos_novedad = function(archivos) {

                $scope.producto_seleccionado.get_novedad().limpiar_archivos();

                archivos.forEach(function(data) {

                    var archivo = Archivo.get(data.id, data.descripcion_archivo);
                    $scope.producto_seleccionado.get_novedad().set_archivos(archivo);
                });
                
                console.log('========= NOVEDADD =========');
                console.log($scope.producto_seleccionado.get_novedad());
            };


            $scope.cargar_archivo = function($flow) {

                $scope.flow = $flow;
                
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
            that.buscar_archivos_novedad();

        }]);
});