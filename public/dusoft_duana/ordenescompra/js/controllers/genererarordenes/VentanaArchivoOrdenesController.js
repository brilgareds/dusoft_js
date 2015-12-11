define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('VentanaArchivoOrdenesController', [
        '$scope', '$rootScope', 'API',
        '$modalInstance', 'AlertService', 'Request',
        function($scope, $rootScope, API, 
                 $modalInstance, AlertService, Request) {

            var that = this;

            // Inicializacion Upload
            $scope.flow = new Flow();
            $scope.flow.target = API.ORDENES_COMPRA.SUBIR_ARCHIVO_NOVEDAD;
            $scope.flow.testChunks = false;
            $scope.flow.singleFile = true;
            
            
            $scope.flow.query = {
                session: JSON.stringify($scope.session)
            };


            that.subirArchivoNovedad = function() {
                
                $scope.flow.opts.query.data = JSON.stringify({
                    ordenes_compras: {
                        novedad_id: $scope.producto.get_novedad().get_id()
                    }
                });

                $scope.flow.upload();
            };

            $scope.respuestaSubidaArchivo = function(file, message) {

                var data = (message !== undefined) ? JSON.parse(message) : {};
                $scope.flow.cancel();

                if (data.status === 200) {
                    $scope.buscar_detalle_orden_compra();

                    $modalInstance.close();
                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }


            };

            $scope.cargarArchivo = function($flow) {

                $scope.flow = $flow;
                
            };

            $scope.aceptar = function() {
                that.gestionar_novedades();
            };

            $scope.close = function() {
                $modalInstance.close();
            };
            
            $scope.onDescargarArchivo = function(archivo){
                $scope.visualizarReporte("/OrdenesCompras/Novedades/" + archivo.descripcion, archivo.descripicion, "blank");
            };
            
        }]);
});