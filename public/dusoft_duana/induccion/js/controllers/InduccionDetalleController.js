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
                "ProductoInduccion", "AlertService","$state","InduccionService",
                function($scope, $rootScope, Usuario, Request,
                        localStorageService, $modal, API,
                        EmpresaInduccion, CentroUtilidadesInduccion, BodegasInduccion, ProductoInduccion, AlertService,$state,InduccionService) {
                            
                          
                        var that = this; 

                        $scope.detalleProductos ;
                       
                        that.detalladoProductosInduccion = localStorageService.get("productoInduccion");
                        
                     
                        that.renderListarProductos = function(data) {
                            
                          
                        for (var i in data.obj.listar_productos) {

                            var _producto = data.obj.listar_productos[i];
                           //console.log(_producto)
                            var producto = ProductoInduccion.get(_producto.codigo_producto, _producto.descripcion, _producto.existencia);
                            
                            producto.setIva(_producto.porc_iva).setCosto(_producto.costo).setPrecioVenta(_producto.precio_venta);
                            //that.detalladoProductosInduccion.agregar.agregarProducto(producto)
                            
                            
                          
                            $scope.detalleProductos = producto;
       
                        }
                        
                        
                    };
                    
                       // console.log(that.detalladoProductosInduccion)
                        $scope.detalleProducto = InduccionService.consultarDetalleProducto(
                                that.detalladoProductosInduccion.url,
                                that.detalladoProductosInduccion,
                                function(data){
                                    
                                    
                                   // console.log(data)
                                    that.renderListarProductos(data);
                                    
                                 //   console.log(data)
                                }
                        );
                     
                      
                        that.init = function(){

                        };
                        
                        
                        that.init();
                        

                }]);

});
