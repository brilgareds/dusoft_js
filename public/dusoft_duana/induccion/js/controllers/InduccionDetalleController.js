define(["angular", "js/controllers",
    "models/EmpresaInduccion",
    "models/CentroUtilidadesInduccion",
    "models/BodegasInduccion",
    "models/ProductoInduccion"], function(angular, controllers) {

    controllers.controller('InduccionDetalleController',
            ['$scope', '$rootScope', 'Usuario', "Request",
                "localStorageService", "$modal",
                "API", "EmpresaInduccion",
                "CentroUtilidadesInduccion", "BodegasInduccion",
                "ProductoInduccion", "AlertService", "$state", "InduccionService",
                function($scope, $rootScope, Usuario, Request,
                        localStorageService, $modal, API,
                        EmpresaInduccion, CentroUtilidadesInduccion, BodegasInduccion, ProductoInduccion, AlertService, $state, InduccionService) {


                    var that = this;

                    that.renderListarProductos = function(data) {


                        for (var i in data.obj.listar_productos) {

                            var _producto = data.obj.listar_productos[i];
                  
                            var producto = ProductoInduccion.get(_producto.codigo_producto, _producto.descripcion, _producto.existencia);

                            producto.setIva(_producto.porc_iva).setCosto(_producto.costo).setPrecioVenta(_producto.precio_venta);

                            $scope.detalleProductos = producto;

                        }

                    };


                    that.init = function() {
                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };

                        $scope.detalleProductos;

                        that.detalladoProductosInduccion = localStorageService.get("productoInduccion");
                        that.detalladoProductosInduccion.session = $scope.session;
                    };
                    
                    
                    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                        $scope.$$watchers = null;
                    });


                    that.init();


                    $scope.detalleProducto = InduccionService.consultarDetalleProducto(
                            that.detalladoProductosInduccion.url,
                            that.detalladoProductosInduccion,
                            function(data) {
                                
                                that.renderListarProductos(data);

                            }
                    );


                }]);

});
