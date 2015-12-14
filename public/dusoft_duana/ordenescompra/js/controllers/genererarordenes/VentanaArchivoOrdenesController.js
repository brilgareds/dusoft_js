define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('VentanaArchivoOrdenesController', [
        '$scope', '$rootScope', 'API',
        '$modalInstance', 'AlertService', 'Request',
        'Usuario',
        function($scope, $rootScope, API, 
                 $modalInstance, AlertService, Request,
                 Usuario) {

            var self = this;
            
            
            self.init = function(){
                $scope.root = {};
                
                $scope.root.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                
                $scope.root.flow = new Flow();
                $scope.root.flow.target = API.ORDENES_COMPRA.SUBIR_ARCHIVO_ORDENES_COMPRA;
                $scope.root.flow.testChunks = false;
                $scope.root.flow.singleFile = true;

                $scope.root.flow.query = {
                    session: JSON.stringify($scope.root.session)
                };
            }



            self.subirArchivoOrdenes = function() {
                
                $scope.root.flow.opts.query.data = JSON.stringify({
                    ordenes_compras: {
                    }
                });
                console.log("A>>>>>>>>>>>>>>>>>>>>>>>> on subir archivo");
                $scope.root.flow.upload();
            };

            $scope.respuestaSubidaArchivo = function(file, message) {

                /*var data = (message !== undefined) ? JSON.parse(message) : {};
                $scope.flow.cancel();

                if (data.status === 200) {
                    $scope.buscar_detalle_orden_compra();

                    $modalInstance.close();
                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }*/


            };

            $scope.cargarArchivo = function($flow) {

                $scope.root.flow = $flow;
                
            };

            $scope.onSubirArchivo = function() {
                self.subirArchivoOrdenes();
            };

            $scope.close = function() {
                $modalInstance.close();
            };
            
            $scope.onDescargarArchivo = function(archivo){
                $scope.visualizarReporte("/OrdenesCompras/Novedades/" + archivo.descripcion, archivo.descripicion, "blank");
            };
            
            
            self.init();
            
        }]);
});