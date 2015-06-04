//Controlador de la View verpedidosfarmacias.html

define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('ContenedorPedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario",
        function($scope, $rootScope, Request, API, socket, AlertService, $state, Usuario) {

            console.log(">>>> Usuario", Usuario.getUsuarioActual());

            var that = this;


            $scope.root = {};
            
            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.root.opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
            //$scope.root.opciones.sw_ver_listado_temporales = true;

            console.log(">>>> Opciones Contenedor: ", $scope.root.opciones);

            $scope.root.opcionesModulo = {
                btnCrearPedido: {
                    'click': $scope.root.opciones.sw_crear_pedido
                }
            };

            $scope.imprimirDespachos = function(empresa, numero, prefijo) {

                var test = {
                    session: $scope.root.session,
                    data: {
                        movimientos_bodegas: {
                            empresa: empresa,
                            numero: numero,
                            prefijo: prefijo
                        }
                    }
                };
                Request.realizarRequest(API.DOCUMENTOS_DESPACHO.IMPRIMIR_DOCUMENTO_DESPACHO, "POST", test, function(data) {
                    if (data.status === 200) {
                        var nombre = data.obj.movimientos_bodegas.nombre_pdf;
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "download");
                    }

                });

            };


        }]);
});
