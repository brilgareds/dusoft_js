define(["angular", "js/services"], function(angular, services) {


    services.factory('InduccionService', ['$rootScope', 'Modulo', 'Request', 'API','$scope',
        function($rootScope, Modulo, Request, API,$scope) {


        /*    var self = this;

            self.consultarDetalleProducto = function(codigoProducto, 
                                                     empresaId, 
                                                     centroUtilidad, 
                                                     bodega, 
                                                     paginaactual) {

                                                     
                                                     console.log("Codgi producto " + codigoProducto)
               /* var obj = {
                    session: $scope.session,
                    data: {
                        induccion:
                                {
                                    empresaId: codigoProducto,
                                    centroUtilidad: empresaId,
                                    bodega: centroUtilidad,
                                    descripcion: bodega,
                                    pagina: paginaactual
                                }
                    }
                };
                
                  Request.realizarRequest(API.INDUCCION.LISTAR_PRODUCTOS, "POST", obj, function(data) {
                                        bodegaSeleccionada.vaciarProductos();
                                        $scope.productos = [];

                                        if (data.status === 200) {
                                            if (data.obj.listar_productos.length === 0) {
                                                paginaactual = 1;
                                            } else {
                                                that.renderListarProductos(data);
                                                callback();
                                            }
                                        } else {
                                            AlertService.mostrarMensaje("warning", data.msj)
                                        }
                                    });*/
        //    };

            return this;
        }]);
});



