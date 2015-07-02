//Controlador de la View verpedidosfarmacias.html

define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('ContenedorPedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "$modal",
        function($scope, $rootScope, Request, API, socket, AlertService, $state, Usuario, $modal) {

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
            
            $scope.validarPermisosPedido = function(pedido){
                var empresas = Usuario.getUsuarioActual().getEmpresasFarmacias();
                
                //se busca la empresa
                var existeFarmaciaCentroBodega = empresas.some(function(empresa){
                    return empresa.getCodigo() === pedido.getFarmacia().get_farmacia_id()
                    
                    & 
                    //se busca el centro de utilidad
                    empresa.getCentrosUtilidad().some(function(centro){
                        return  centro.getCodigo() === pedido.getFarmacia().getCentroUtilidadId()
                        
                        &
                        //se busca la bodega
                        centro.bodegas.some(function(bodega){
                            return bodega.getCodigo() === pedido.getFarmacia().getBodegaId();
                        });
                    });
                    
                });
                
                return existeFarmaciaCentroBodega;

            };
            
            $scope.mostrarAlertaPermisoDenegadoPedido = function(pedido){
                console.log("pedido >>>>>>>>>>>>>> ", pedido);
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
                                                <h4 >Usted No tiene acceso a:<br><br>\
                                                <b>FARMACIA:</b> '+pedido.getFarmacia().get_farmacia_id()+' - '+pedido.getFarmacia().get_nombre_farmacia()+'<br>\
                                                <b>CENTRO UTILIDAD:</b> '+pedido.getFarmacia().getCentroUtilidadId()+' - '+pedido.getFarmacia().getNombreCentroUtilidad()+'<br>\
                                                <b>BODEGA:</b> '+pedido.getFarmacia().getBodegaId()+' - '+pedido.getFarmacia().getNombreBodega()+'</h4>\
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


        }]);
});
