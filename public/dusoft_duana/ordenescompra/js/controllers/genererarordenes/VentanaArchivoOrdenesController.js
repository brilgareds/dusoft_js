define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('VentanaArchivoOrdenesController', [
        '$scope', '$rootScope', 'API',
        '$modalInstance', 'AlertService', 'Request',
        'Usuario','String','socket',
        function($scope, $rootScope, API, 
                 $modalInstance, AlertService, Request,
                 Usuario, String, socket) {

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
                $scope.root.progresoArchivo = 0;

                $scope.root.flow.query = {
                    session: JSON.stringify($scope.root.session)
                };
            }



            self.subirArchivoOrdenes = function() {
                
                $scope.root.flow.opts.query.data = JSON.stringify({
                    ordenes_compras: {
                        empresa_id : Usuario.getUsuarioActual().getEmpresa().getCodigo()
                    }
                });
                
                $scope.root.progresoArchivo = 1;
                $scope.root.flow.upload();
            };

            $scope.respuestaSubidaArchivo = function(file, message) {

                var data = (message !== undefined) ? JSON.parse(message) : {};
                $scope.root.flow.cancel();
                
                if (data.status === 200) {
                    $scope.visualizarReporte("/reports/" + data.obj.pdf, data.obj.pdf , "download");
                    $modalInstance.close();
                } else {
                    var msj = data.msj;
                    
                    if(msj.msj){
                        msj = msj.msj;
                    }
                    
                    AlertService.mostrarVentanaAlerta(String.CONSTANTS.ALERTA_TITULO, msj);
                }
                
                $scope.root.progresoArchivo = 0;

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
            
            socket.on("onNotificarProgresoArchivoPlanoOrdenes", function(datos){
                $scope.root.progresoArchivo = datos.porcentaje;
            });
            
            $modalInstance.result.then(function() {
                socket.removeAllListeners();

            }, function() {

            });
            
            
            self.init();
            
        }]);
});