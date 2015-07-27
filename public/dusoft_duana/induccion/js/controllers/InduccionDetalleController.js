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
                        that.detalleProducto = [];
                       // console.log(localStorageService.get("productoInduccion"))
                       
                        that.detalladoProductosInduccion = localStorageService.get("productoInduccion");
                       // $scope.nombres = "hola mundo";
                       // InduccionService.consultarDetalleProducto("45","555569asasasa","44444444455556","11111",1);
                        
                      
                    /*    console.log(that.detalladoProductosInduccion.codigoProducto)
                        console.log(that.detalladoProductosInduccion.empresaId)
                        console.log(that.detalladoProductosInduccion.centroUtilidad)
                        console.log(that.detalladoProductosInduccion.bodega)
                        */
                      
                        that.init = function(){

                        };
                        
                        
                        that.init();
                        

                }]);

});
